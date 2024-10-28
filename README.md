# StaySafe


## Enviroment Setup
1. For macOS users, [install Homebrew](https://brew.sh/) and then install Docker Compose:
```bash
brew install docker-compose
```
2. For Linux users, install Docker Compose with your distro's package manager:
```bash
# For Debian/Ubuntu and derivatives
sudo apt install docker-compose

# For Arch and derivatives
sudo pacman -S docker-compose
```
3. Clone the Github repository from ChicoState/StaySafe and navigate to it:
```bash
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

If you run into issues with the Docker environment, try the following:

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

