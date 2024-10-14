# Node backend setup
FROM node:22

WORKDIR /usr/src
# Copy package requirements and install
COPY package.json .
RUN npm install
# Copy current directory items over
COPY index.js .
EXPOSE 8080
# Run index.js
CMD ["node", "index.js"]