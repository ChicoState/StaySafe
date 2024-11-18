#!/bin/bash
docker rm staysafe_front
docker rm staysafe_back
docker-compose build --no-cache
docker-compose up
