FROM node:18

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

ADD . ./

#Maybe you'll want to delete this to build with environment file :) 
RUN rm -rf .env*

RUN pnpm install --no-frozen-lockfile
RUN pnpm build

CMD [ "node", "./build/app.js" ]