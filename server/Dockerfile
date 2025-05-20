FROM ubuntu

RUN apt-get update && apt-get install -y python3 python3-pip

WORKDIR /code
COPY requirements.txt ./
RUN pip install --no-cache-dir --upgrade --break-system-packages -r requirements.txt

COPY ./app /code/app

EXPOSE 8000
