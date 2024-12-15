# Node backend setup
FROM node:22  

# We do not need the standalone Chromium (skip download)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install Chromium and necessary dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
  curl \
  gnupg \
  chromium \
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
  --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /usr/src

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy all project files
COPY . .

# Reinstall bcrypt to ensure compatibility
RUN npm uninstall bcrypt && npm install bcrypt

# Expose the backend port
EXPOSE 8080

# Run the backend service
CMD ["node", "index.js"]
