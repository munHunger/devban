FROM node:16.0.0-alpine
WORKDIR /opt/devban

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

RUN chmod -R a+rw /root && \
    chmod -R a+rw /opt && \
    adduser -D devban && \
    chown -R devban /opt
USER devban

RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
