FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# for build without docker-compose
# RUN npm run build

RUN git clone https://github.com/vishnubob/wait-for-it.git

# for build without docker-compose
# CMD ["node", "src/index.js"]