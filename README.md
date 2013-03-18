This is an experimental app that can be used to issue Open Badges
from one Twitter user to another.

## Mockups

<a href="http://www.flickr.com/photos/jessicaklein/8544039631/"><img src="http://farm9.staticflickr.com/8092/8544039631_14bde7e190_z.jpg"></a>

## Prerequisites

You'll need node and mongoDB.

You'll also need a pair of Twitter app tokens, which can be obtained from
[dev.twitter.com/apps](https://dev.twitter.com/apps).

## Quick Start

1. Make sure your mongoDB server is running.
2. Run `npm install`.
3. Run `npm test`.
4. Run `cp .env.example .env`.
5. Edit `.env` to taste.
6. Run `node app.js`, then browse to http://localhost:3000/.

## Deployment

For production deployments, you'll want to run `make optimize`, which
minifies/compresses necessary files. If you want to revert from
production to development, make sure you run `make clean` first.
