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