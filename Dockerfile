FROM node:12

COPY . /application
EXPOSE 3335
ENTRYPOINT ["bash", "/application/up.sh"]
