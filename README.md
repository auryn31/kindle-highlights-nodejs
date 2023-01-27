# Scrape Kindle Highlights in node.js

This is an easy file to scrape your kindle highlights with node.js and puppeteer.

## Get started

Update local `.env` with your username and password:

```
USERNAME=
PASSWORD=
```

Run

- `yarn` or `npm install`
- `yarn start`

If you cannot login because you use 2FA, start in visual mode, log in manually and restart the process.
The state will be saved locally in the `user_data` folder. Then you should be logged in anyways and the scraping should work.
The result will be in file `highlights.json`.

Have fun.
