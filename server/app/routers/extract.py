import fitz
import html2text
import pathlib
import httpx
from fastapi import UploadFile, status
from fastapi.responses import PlainTextResponse, Response
from fastapi.routing import APIRouter
from pydantic import HttpUrl

router = APIRouter(prefix='/extract')


@router.post('/file', response_class=PlainTextResponse)
async def extract_file(file: UploadFile):
    extractor = get_extractor(get_file_ext(file.filename))
    if not extractor:
        return Response(content='Unsupported file type', status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)
    text = await extractor(file)
    return text

@router.get('/url/{url:path}', response_class=PlainTextResponse)
async def extract_url(url: HttpUrl):
    strUrl = str(url)
    async with httpx.AsyncClient() as client:
        response = await client.get(strUrl)
    downloaded = response.text
    if not downloaded:
        return Response(content='Unable to retreive url', status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)
    return extract_html(downloaded)

def get_file_ext(filename):
    return pathlib.Path(filename).suffix

async def get_document_text(file: UploadFile):
    with fitz.open(stream= await file.read(), filetype=get_file_ext(file.filename)) as doc:
        text = chr(12).join([page.get_textpage().extractText(sort=True) for page in doc])
    return text

async def get_html_text(file: UploadFile):
    contents = await file.read()
    decoded = contents.decode()
    extracted = extract_html(decoded)
    return extracted

def get_extractor(suffix: str):
    match suffix.lower():
        case '.pdf' | '.xps' | '.epub' | 'mobi' | '.fb2' | '.cbz' | '.svg' | '.txt':
            return get_document_text
        case '.html' | '.htm':
            return get_html_text

def extract_html(text: str):
    h = html2text.HTML2Text()
    h.ignore_images = True
    h.ignore_links = True
    h.wrap_tables = True
    h.wrap_links = True
    h.wrap_list_items = True
    h.body_width = 0
    return h.handle(text)
    