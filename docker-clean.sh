#!/bin/bash
docker rm staysafe_front staysafe_back staysafe_mongo
docker compose build --no-cache
docker compose up
