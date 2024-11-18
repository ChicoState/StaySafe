#added more dependency here to work with the web scraper

# Node backend setup
FROM node:22  

WORKDIR /usr/src

# Copy package requirements and install
COPY package.json .
RUN npm install

# Additional dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
  libgtk-3-0 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libgbm-dev \
  libasound2 \
  libpangocairo-1.0-0 \
  libatk-bridge2.0-0 \
  libatspi2.0-0 \
  --no-install-recommends

# Copy current directory items over
COPY . .

EXPOSE 8080

# Run index.js
CMD ["node", "index.js"]
