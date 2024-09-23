# Node backend setup
FROM node:22

WORKDIR /staysafe
# Copy package requirements and install
COPY package*.json .
RUN npm install
# Copy current directory items over
COPY . .
EXPOSE 8080
# Run index.js
CMD ["node", "index.js"]