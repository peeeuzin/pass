FROM node:16-alpine

WORKDIR /usr/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 4000

CMD [ "sh", "./scripts/initialize.sh" ]