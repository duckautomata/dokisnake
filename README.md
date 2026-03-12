# dokisnake

Snake game but you are Doki and DAD catching chicken

## Tech Used

- Node 22
- Vite to run locally
- p5.js for drawing the canvas

## Running Locally

1. Have Node 20 or later installed
2. Clone the repo locally
3. Run `npm install` to install dependencies
4. Run `npm run dev` and open the site it gives you. It should be next to `Local: <site link>`

Every time you save, Vite will automatically refresh the cache and the site should refresh with the new changes.

## Building a new release

This project is hosted in a Cloudflare worker. If you have access to the worker, then run the deploy command to update the contents.

```bash
npm run deploy
```
