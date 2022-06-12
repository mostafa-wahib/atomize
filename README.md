
![banner](https://user-images.githubusercontent.com/97390127/173239296-ac9e4a9c-5a1a-441c-b14e-c4bcf23351bb.png)

![GitHub last commit](https://img.shields.io/github/last-commit/mostafa-wahib/atomize)

Atomize is a quick and modern URL shortener. It enables you to host your own URL Shortener, brand your urls, analyze your shortened links performance, and much more!

### Technologies

- Typescript
- NodeJS
- Express
- MongoDB
- Redis
- Docker

## Setup

User authentication is done using JWT that is encrypted using RSA256.

Here is an example .env file :

```env

PRIVATEKEY='-----BEGIN RSA PRIVATE KEY-----
YOUR PRIVATE KEY
-----END RSA PRIVATE KEY-----'
PUBLICKEY='-----BEGIN PUBLIC KEY-----
YOUR PUBLIC KEY
-----END PUBLIC KEY-----'
ACCESSTOKENTTL=15m #Defualt 15m
REFRESHTOKENTTL=1y #Default 1y
PORT=8080 #Defualt 1337
```

## Usage

```bash

# Build Images
docker-compose build

# Launch containers in detach mode
docker-compose up -d
```

## Test

```bash
# install project dependencies
yarn install

# Execute tests using jest
yarn test
```
