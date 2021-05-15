FROM node:lts AS builder

ADD package.json .
ADD package-lock.json .
RUN npm install

ADD . .

RUN npm run build

FROM alpine

COPY --from=builder build/devban-cli .

ENTRYPOINT [ "devban-cli" ]