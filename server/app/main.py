import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import extract
from app.routers import generate

@asynccontextmanager
async def lifespan(app: FastAPI):
    await generate.lifespanBefore(app)
    yield

app = FastAPI(lifespan=lifespan)
app.include_router(extract.router)
app.include_router(generate.router)

origins = [
    'http://0.0.0.0:5173',
    'https://0.0.0.0:5173',
    'http://localhost:5173',
    'https://localhost:5173',
    'https://127.0.0.1:5173',
    'http://127.0.0.1:5173',
    'http://192.168.0.15:5173',
    'https://192.168.0.15:5173',
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)




if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)
