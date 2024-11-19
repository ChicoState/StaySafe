# StaySafe
Our mission is to enhance personal and community safety by providing comprehensive
insights and data analysis. We aim to support businesses in identifying optimal locations for
hosting their operations, assist travelers in selecting the safest and most suitable
accommodations, and guide home buyers in finding their ideal homes. Through informed
decision-making, we strive to contribute to safer environments and more prosperous
communities.

## Table of Contents
* [Software Stack](#Software-Stack)
* [Environment Setup](#Environment-Setup)
* [Troubleshooting](#Troubleshooting)
* [License](#License)

## Software Stack
### MERN
* MongoDB (database)
* Express.js (application controller layer)
* React.js (web application presentation)
* Node.js (JavaScript runtime)

## Environment Setup
1. Install Docker Desktop from the [Docker website](https://www.docker.com/) or the standalone Docker Compose from your package manager:
    ```bash
    # For Debian/Ubuntu and derivatives
    sudo apt install docker-compose

    # For Arch and derivatives
    sudo pacman -S docker-compose

    # For macOS with Homebrew
    brew install docker-compose
    ```

2. Clone this repository and navigate to it:
    ```bash
    git clone git@github.com:ChicoState/StaySafe.git
    cd StaySafe
    ```

3. Build and start the containers.
    ```bash
    docker compose up 
    ```

4. Access the app via a web browser:
    * Frontend at http://localhost:3000/
    * Backend at http://localhost:8080/

## Docker Troubleshooting

If you run into issues with the Docker environment, try running `docker-clean.sh` or use the following:

```bash
docker rm staysafe_front staysafe_back staysafe_mongo
docker compose build --no-cache
docker compose up
```

If the above doesn't resolve the issue, and the issue appears to be related to npm dependencies:

```bash
rm backend/package-lock.json frontend/node_modules
rm -r backend/node_modules frontend/node_modules
docker rm staysafe_front staysafe_back staysafe_mongo
docker compose build --no-cache
docker compose up
```
