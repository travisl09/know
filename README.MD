# Prerequisites
-   Docker (only tested on linux/WSL)
-   NVIDIA GPU w/ > 8G RAM
-   Updated NVIDIA drivers -  http://www.nvidia.com/Download/index.aspx (use `nvidia-smi` to check driver version)
# Init
## Create external volumes for model containers
`docker volume create ollama && docker volume create stable-diffusion`
## Build containers
`docker compose build`
## Initialize stable diffusion
`docker compose up stable-diffusion` -- this will take a while
# Run
`docker compose up`