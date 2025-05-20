import json
import json_repair
import app.services.models as models
from fastapi import Form, FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.routing import APIRouter
from pydantic import BaseModel, Field
from typing import Annotated

router = APIRouter(prefix='/generate')

async def lifespanBefore(app: FastAPI):
    await models.unloadLlama3()
    await models.unloadStableDiffusion()

class ImageOut(BaseModel):
    image: str

class IsContentOut(BaseModel):
    is_content: bool
    full_response: str

class ImagePromptOut(BaseModel):
    prompt: str
    full_response: str

class Question(BaseModel):
    text: str
    options: list[str]
    answer: int
    explanation: str | None = None

class QuestionsOut(BaseModel):
    questions: list[Question]
    full_response: str
    repaired: bool

@router.post('/image')
async def image(prompt: Annotated[str, Form()]) -> ImageOut:
    response = await models.stableDiffusionGenerate(prompt)
    return ImageOut(image=response)

@router.post('/is-content')
async def is_content(context: Annotated[str, Form()]) -> IsContentOut:
    _is_content_prompt = '''\
        Is the below context interesting content? Please answer true or false.

    '''
    response: str = await models.llama3Generate(f'{_is_content_prompt}{context}')
    return IsContentOut(is_content=True if 'true' in response.lower() else False,
                        full_response=response)

@router.post('/image-prompt')
async def is_content(context: Annotated[str, Form()]) -> ImagePromptOut:
    _image_prompt_prompt = '''\
        Please generate a terse image generation prompt of no more \
        than 75 words for a scene derived from the below context:

    '''
    response: str = await models.llama3Generate(f'{_image_prompt_prompt}{context}')
    firstQuote = response.find('"')
    lastQuote = response.rfind('"')
    if firstQuote < 0 or lastQuote < 0 or firstQuote >= lastQuote:
        return ImagePromptOut(prompt= '', full_response= response)
    return ImagePromptOut(prompt= response[firstQuote + 1 : lastQuote],
                          full_response= response)

@router.post('/questions')
async def questions(context: Annotated[str, Form()]) -> QuestionsOut:
    _question_prompt = '''\
        Please provide three multiple choice questions derived from the below context. \
        Also provide the answer as the 0-indexed index of the options. Also explain step-by-step how you arrive at each question. \
        Please output your response in the following JSON format:
\
        {"questions": [{"text": "Question text", \
                    "options": ["Option 1", "Option 2", "Option 3", "Option 4"], \
                    "answer": 0, \
                    "explanation": "Step-by-step explanation"\
                    }]\
        }

    '''
    response: str = await models.llama3Generate(f'{_question_prompt}{context}')
    i = response.find('{')
    li = response.rfind('}')
    if i < 0 or li < 0 or i >= li:
        return QuestionsOut(questions= [], full_response= response, repaired= False)
    json_str = response[i:li + 1]
    try:
        py_obj = json.loads(json_str)
        py_obj['full_response'] = response
        py_obj['repaired'] = False
        return jsonable_encoder(py_obj)
    except:
        repaired = json_repair.repair_json(json_str, skip_json_loads = True, return_objects=True)
        repaired['full_response'] = response
        repaired['repaired'] = True
        return jsonable_encoder(repaired)