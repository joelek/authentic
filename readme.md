# @joelek/authentic

```ts
import * as libhttp from "http";
import * as authentic from "@joelek/authentic/dist/lib/node";

const SERVER = new authentic.server.Server();

const REQUEST_LISTENER = SERVER.createRequestListener({
	urlPrefix: "/auth"
});

const HTTP_SERVER = libhttp.createServer((request, response) => {
	let url = request.url ?? "/";
	if (url.startsWith("/auth/")) {
		return REQUEST_LISTENER(request, response);
	}
	response.writeHead(404);
});

HTTP_SERVER.listen();
```

```ts
import * as authentic from "@joelek/authentic/dist/lib/browser";

let manager = authentic.ui.injectUserInterface({
	client: authentic.client.createClient({
		urlPrefix: "/auth"
	})
});
manager.toggle();
```

## Roadmap

* Use AVL-tree for indices in VolatileObjectStore class.
* Add automatic backoff to Autoguard when receiving Retry-After header in response.
* Add automatic retries with exponential backoff on error to Autoguard.
* Combine all authenticated states to one.
* Investigate issue occuring when registering two users.
* Restrict length of user data values.
* Consider adding display name.
* Document full integration.
