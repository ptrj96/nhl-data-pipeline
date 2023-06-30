# nhl-data-pipeline

## Getting Started

This app runs on Node 18 which can be installed [here](https://nodejs.org/en/download)

This app uses a postgres db with an included `docker-compose.yaml` for ease of running it.

### Running the App

1. install necessary packages with `npm install`
2. copy the .env template with `cp .env.template .env` and fill out the DB_PASSWORD with a password of your choosing and you will need to set the environment of your shell with that file
3. start db with `docker compose up -d` if you want it in the background or omit the `-d` if you want it to run in the foreground.
4. run `npm start` and the app will be running at http://localhost:3000

### Other scripts

This app includes some unit tests written with jest. They can be run by running `npm test`

Linting is also set up with `npm run lint`
