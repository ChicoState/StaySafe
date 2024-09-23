# React frontend setup
FROM node:22

WORKDIR /staysafe
# Copy package requirements and install
COPY package*.json .
RUN npm install
# Copy current directory items over
COPY . .
EXPOSE 3000
# Start react app
CMD ["npm", "start"]
