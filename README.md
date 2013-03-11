## Model

Dates are in ISO 8601.

* **sender** - Twitter name of sender.
* **recipient** - Twitter name of recipient.
* **issue_date** - Date sender issued the badge.
* **claim_date** - Date recipient claimed the badge, or `null` if unclaimed.
* **title** - Title of badge.
* **description** - Description of badge (markdown).
* **image_url** - Absolute image URL of badge.
* **assertion_url** - Assertion URL of badge, or `null` if not generated.

## API

### Posting a badge

Request:

```
POST /badge HTTP/1.1
Content-Type: application/json

{
  "access_token": "awepognapewon32opnfe",
  "recipient": "toolness",
  "title": "Github Rockstar",
  "description": "This person is [cool](http://foo.org/).",
  "image_url": "http://placekitten.com/90/90",
}
```

Response:

```
HTTP/1.1 201 Created

{
  "url": "/badge/15"
}
```

### Changing a badge

```
PUT /badge/15 HTTP/1.1
Content-Type: application/json

{
  "access_token": "awepognapewon32opnfe",
  "recipient": "toolness",
  "title": "Github Rockstar",
  "description": "This person is [cool](http://foo.org/).",
  "image_url": "http://placekitten.com/90/90",
}
```

### Requesting a badge

Request:

```
GET /badge/15 HTTP/1.1
```

Response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "sender": "iamjessklein",
  "recipient": "toolness",
  "issue_date": "2013-03-10T17:38:02.855Z",
  "claim_date": null,
  "title": "Github Rockstar",
  "description": "This person is [cool](http://foo.org/).",
  "image_url": "http://placekitten.com/90/90",
  "assertion_url": null
}
```
