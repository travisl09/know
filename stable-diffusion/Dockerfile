FROM python:3.10

RUN apt-get update && apt-get install -y wget git libgl1 libglib2.0-0

WORKDIR /stable-diffusion
RUN wget -q https://raw.githubusercontent.com/AUTOMATIC1111/stable-diffusion-webui/master/webui.sh

RUN useradd -ms /bin/sh -u 1001 sd
RUN chown -R sd:sd /stable-diffusion && chmod 0700 ./webui.sh

USER sd
EXPOSE 7860
VOLUME [ "/stable-diffusion" ]

ENTRYPOINT [ "./webui.sh" ]
CMD [ "--xformers", "--api", "--listen", "--api-server-stop" ]