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

let { element, controller } = authentic.ui.createElementAndController({
	client: authentic.client.createClient({
		urlPrefix: "/auth"
	})
});
document.body.appendChild(element);
controller.toggle();
```

## Roadmap

* Use AVL-tree for indices in VolatileObjectStore class.
* Add automatic backoff to Autoguard when receiving Retry-After header in response.
* Add automatic retries with exponential backoff on error to Autoguard.
* Consider adding display name.
* Consider adding registration keys.
* Consider adding secrets.
* Rename token to code.
* Document database requirements (255 bytes for email, 127 bytes for passdata, 31 bytes for username).
* Add customizable and localizable HTML emails.
* Expose AccessHandler to plain NodeJS request handlers.
* Automatically create and update database tables.
* Return DOM and controller from injector.
