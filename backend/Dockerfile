#added more dependency here to work with the web scraper

# Node backend setup
FROM node:22  

# We do not need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install curl gnupg -y \
  && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install google-chrome-stable -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

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
