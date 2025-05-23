import asyncio
import enum
import httpx
import json
import os
from ollama import AsyncClient
from typing import Any, Awaitable, Callable

class Models(enum.Enum):
    NONE = 0
    LLAMA3 = 1
    STABLE_DIFFUSION = 2

gpu_lock = asyncio.Lock()
loadedModel = Models.NONE
unloadModel: Callable[[], Awaitable] = None
sdApiEndpoint = 'http://stable-diffusion:7860/sdapi/v1'
swapModels = os.getenv('SWAP_MODELS', 'false').lower() == 'true'
ollamaModel = os.getenv('OLLAMA_MODEL', 'llama3.2')
sdCheckpoint = os.getenv('SD_CHECKPOINT', 'v1-5-pruned-emaonly.safetensors')

async def use_model(model: Models,
                    callback: Callable[[], Awaitable[Any]],
                    newUnloader: Callable[[], Awaitable]) -> Any:
    global gpu_lock, loadedModel, unloadModel
    if not swapModels or model == loadedModel: 
        return await callback()

    async with gpu_lock:
        if unloadModel:
            await unloadModel()
            await asyncio.sleep(3)
        unloadModel = newUnloader
        loadedModel = model
        return await callback()

async def unloadLlama3():
    await AsyncClient('ollama').generate(ollamaModel, '', keep_alive = 0)
    print('unloadLlama3 | Done... sleeping')
    await asyncio.sleep(5)

async def unloadStableDiffusion():
    async with httpx.AsyncClient() as client:
        await client.post(f'{sdApiEndpoint}/unload-checkpoint')

async def llama3Generate(prompt: str) -> str:
    print("llama3Generate | ", prompt)
    timeout = 15
    async def _inner():
        response = await AsyncClient('ollama', timeout=timeout) \
            .generate(ollamaModel, prompt, keep_alive = -1)
        return response['response'] if response else ''
    return await use_model(Models.LLAMA3, _inner, unloadLlama3)

async def stableDiffusionGenerate(prompt: str) -> str:
    async def _inner():
        payload = json.dumps({
            "prompt": f'{prompt}, masterpiece, best quality, highly detailed',
            "negative_prompt": '(worst quality, low quality:1.4),((((ugly)))), (((duplicate))), ((morbid)), ((mutilated)),\
                (((cross eyed))), [out of frame], extra fingers, mutated hands, \
                ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), \
                (((deformed))), ((ugly)), blurry, ((bad anatomy)), \
                (((bad proportions))), ((extra limbs)), cloned face, \
                (((disfigured))). out of frame, ugly, extra limbs, (bad anatomy), \
                gross proportions, (malformed limbs), ((missing arms)), ((missing legs)), \
                (((extra arms))), (((extra legs))), mutated hands, (fused fingers), \
                (too many fingers), (((long neck))),(((text))),(((signatures)))',
            "width": 1024,
            "height": 1024,
            "cfg_scale": 7,
            "sampler_name": "DPM++ 2M",
            "scheduler": "Karras",
            "steps": 50,
            "override_settings": {
                'sd_model_checkpoint': sdCheckpoint
                # 'sd_model_checkpoint': "sdXL_v10VAEFix"
                # 'sd_model_checkpoint': "abyssorangemix3AOM3_aom3a1b"
                # 'sd_model_checkpoint': "edgeOfRealism_eorV20Fp16BakedVAE"
            }
            }).encode('utf-8')
        async with httpx.AsyncClient() as client:
            await client.post(f'{sdApiEndpoint}/reload-checkpoint')
            response = await client.post(f'{sdApiEndpoint}/txt2img',
                                            content=payload,
                                            headers={'Content-Type': 'application/json'},
                                            timeout=httpx.Timeout(35.0))
            obj: dict = response.json()
            return obj.get('images')[0]

    return await use_model(Models.STABLE_DIFFUSION, _inner, unloadStableDiffusion)