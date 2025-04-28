## How to First Init the Project

```yarn install``` <br>
```npm install``` <br>

## How to Start (dashboard)

```yarn run dev:dashboard``` <br>
```npm run dev:dashboard``` <br>

## How to Start (server)

```yarn run dev:server``` <br>
```npm run dev:server``` <br>

## How to Start (dashboard + server)

```yarn run dev``` <br>
```npm run dev``` <br>


# Server:

1. Using `req.user` for user details ##### for `/leumi-wallet` routes you can access `req.user` for get user details

2. To init fireblocks SDK:

    2.1. Create CSR + secret_key: https://developers.fireblocks.com/docs/manage-api-keys

    2.2. `leumi-server/.env` should configure `FIREBLOCKS_API_KEY=`
   
    2.3. Add your private key (secret) to `fireblocks_secret.key` in `leumi-server/src/services/fireblocks/`

3. Ngrok: 

   3.1. mac: https://ngrok.com/downloads/mac-os

   3.2. linux: https://ngrok.com/downloads/linux

   3.3. using Ngrok `ngrok http http://localhost:3001`