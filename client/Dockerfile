FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

RUN git clone https://github.com/vishnubob/wait-for-it.git

CMD ["node", "build/server.js"]