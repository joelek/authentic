# @joelek/authentic

```ts
import * as libhttp from "http";
import * as server from "@joelek/authentic/dist/lib/server";

const AUTHENTICATOR = new server.Authenticator();
const REQUEST_LISTENER = AUTHENTICATOR.createRequestListener();
const HTTP_SERVER = libhttp.createServer({}, REQUEST_LISTENER);
const HTTP_HOSTNAME = "localhost";
const HTTP_PORT = 8080;

HTTP_SERVER.listen(HTTP_PORT, HTTP_HOSTNAME, () => {
	console.log(`Server listening at http://${HTTP_HOSTNAME}:${HTTP_PORT}/ ...`);
});
```

```ts
import * as client from "@joelek/authentic/dist/lib/client";

const AUTHENTIC = client.createClient();
```

## Roadmap

* Add automatic cleaning of stores used by Authentictor class.
* Use AVL-tree for indices in VolatileObjectStore class.
* Add roles.
