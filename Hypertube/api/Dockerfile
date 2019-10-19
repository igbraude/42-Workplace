FROM node:11

RUN apt-get update
RUN apt-get install -y ffmpeg libav-tools

ADD . /data
WORKDIR /data

RUN npm install
CMD ["npm", "start"]
