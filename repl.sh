#!/bin/sh

docker run -it --rm --network=telegram-bot-nestjs-template-service-net -v $(pwd):/opt nestjs/base:10.1.17-alpine3.18 npm run start -- --entryFile repl