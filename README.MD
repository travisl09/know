# Prerequisites
-   Docker (only tested on linux/WSL)
-   NVIDIA GPU w/ > 8G RAM
-   Updated NVIDIA drivers -  http://www.nvidia.com/Download/index.aspx (use `nvidia-smi` to check driver version)
# Init
## Create external volumes for model containers
`docker volume create ollama && docker volume create stable-diffusion`
## Setup local client development
Create /know/client/env/env.development with the line:

`VITE_KNOW_API_URL=https://<your-local-ip-addr>:12001/api`
## Build containers
`docker compose build`
## Initialize stable diffusion
`docker compose up stable-diffusion` -- this will take a while
## Pull ollama image
`docker exec -it know-ollama-1 ollama pull llama3.2`
# Run
`docker compose up`
## Clients
Client: https://<your-local-ip-addr>:12001

stable-diffusion client: http://localhost:7860
# Customizations
## Change ollama model
`docker exec -it know-ollama-1 ollama pull <your-model>`

Create/update /compose.override.yml by setting /services/server/environment/OLLAMA_MODEL=your-model
## Change stable diffusion checkpoint
`docker compose up -d stable-diffusion` - start sd container in detached mode

`docker exec -it know-stable-diffusion-1 sh` - attach shell to sd container

`cd /stable-diffusion/stable-diffusion-webui/models/Stable-diffusion` - cd to sd model directory

download new model into models dir (in this case abyssorangemix3AOM3_aom3a1b.safetensors) e.g. `wget -O abyssorangemix3AOM3_aom3a1b.safetensors https://huggingface.co/jiovannip/t3st0/resolve/ee5c60d3a9d28433a0d0c1c92c56980e8cad276f/abyssorangemix3AOM3_aom3a1b.safetensors?download=true` 

Create/update /compose.override.yml by setting /services/server/environment/SD_CHECKPOINT=your-checkpoint