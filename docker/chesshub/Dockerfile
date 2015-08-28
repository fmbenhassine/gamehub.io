FROM node:0.10.40
MAINTAINER Hussein Galal

ENV GITHUB_REPO=https://github.com/galal-hussein/gamehub.io.git

RUN mkdir -p /var/www/app
WORKDIR /var/www/app

RUN apt-get update \
&& apt-get install git \
&& git clone $GITHUB_REPO . \
&& npm install 

ADD ./config/default.json config/default.json
#ADD ./initData.js initData.js

EXPOSE 3000

CMD node initData.js; node .
