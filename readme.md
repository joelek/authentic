# @joelek/authentic

```ts
import * as libhttp from "http";
import * as authentic from "@joelek/authentic/dist/lib/node";

const SERVER = new authentic.server.Server();

const AUTH_REQUEST_LISTENER = SERVER.createAuthRequestListener({
	urlPrefix: "/auth"
});

const APP_REQUEST_LISTENER = SERVER.createAppRequestListener(async (request, access_handler) => {
	let user_id = access_handler.requireAuthorization(/* Required roles... */);
	return {
		payload: user_id
	};
});

const HTTP_SERVER = libhttp.createServer({}, async (request, response) => {
	let url = request.url ?? "/";
	if (url.startsWith("/auth/")) {
		return AUTH_REQUEST_LISTENER(request, response);
	} else {
		return APP_REQUEST_LISTENER(request, response);
	}
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
* Consider adding display name.
* Consider adding registration keys.
* Consider adding secrets.
* Document database requirements (255 bytes for email, 127 bytes for passdata, 31 bytes for username).
* Automatically create and update database tables.
* Add language selector.
* Add support for HTML emails.
* Make UI colors configurable.
* Consider removing customized IDs.
