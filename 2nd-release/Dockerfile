FROM node:18.2-buster-slim AS dev

WORKDIR /home/app

# 1. Copy dependencies definitions
COPY ./package.json ./package-lock.json* ./

# 2. Install dependencies
RUN npm install

# 3. Copy our own code
COPY . /home/app/
COPY src /home/app/src

# 4. start the app
CMD ["npm", "start"]