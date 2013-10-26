All aboard the fun <del>train</del> chain!

Pass arguments through a chain of functions. Each function must decide whether
to continue through the chain.

```javascript

var server = http.createServer(chain(
  [ dispatch('get', '/oauth-callback', oauthCallbackAction)
  , authenticateFromToken
  , servePrivateFiles
  , function(_,_, res) { notFound(res) }
  ]))

// ...

function authenticateFromToken(next, req, res) {
  validateAuthToken(
    authTokenFrom(req),
    withErrHandler(handleAuthTokenErr, function(isValid) {
      if (isValid) next(req, res) else redirectTo(res, oauth.authUrl(req.url))
    })
  })
}

// ...

function notFound(res) {
  res.writeHead(404)
  res.end("Not found\n")
}

```

It's like [connect](https://github.com/senchalabs/connect) but without all the code
