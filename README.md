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
1. Install [Docker](https://www.docker.com/).

2. Clone this repository and navigate to it:
    ```bash
    git clone git@github.com:ChicoState/StaySafe.git && cd StaySafe
    ```

3. Build the Docker containers with no cache.
    ```bash
    docker compose build --no-cache
    ```

4. Start up the containers.
    ```bash
    docker compose up 
    ```
5. You access the:
    * Frontend at http://localhost:3000/
    * Backend at http://localhost:8080/

## Troubleshooting

If you run into issues with the Docker environment, try in the following order:
```bash
docker rm staysafe_back && docker rm staysafe_front && docker rm staysafe_mongo
```
```bash
docker compose build --no-cache
```
```bash
<<<<<<< HEAD
git clone git@github.com:ChicoState/StaySafe.git
cd StaySafe
```
4. Build the Docker images:
```bash
docker-compose up
```
5. React frontend can be found at http://localhost:3000/
6. Node backend data can be found at http://localhost:8080/
___

#### Docker Troubleshooting

If you run into issues with the Docker environment, try running `docker-clean.sh` or use the following:

```bash
docker rm staysafe_front
docker rm staysafe_back
docker-compose build --no-cache
docker-compose up
```

If the above doesn't resolve the issue, and the issue appears to be related to npm dependencies:

```bash
rm backend/package-lock.json
rm -r backend/node_modules
rm frontend/package-lock.json
rm -r frontend/node_modules
docker rm staysafe_front
docker rm staysafe_back
docker-compose build --no-cache
docker-compose up
```

=======
docker compose up
```
>>>>>>> e4ece0ec77f8bb92c82f700d96480580305092c5
