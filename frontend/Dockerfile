# React frontend setup
FROM node:22

WORKDIR /usr/src
# Copy package requirements and install
COPY package*.json .
RUN npm install
# Copy current directory items over
EXPOSE 3000
# Start react app
CMD ["npm", "start"]
