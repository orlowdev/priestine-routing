# @priestine/routing

[![pipeline](https://gitlab.com/priestine/routing/badges/master/pipeline.svg)](https://gitlab.com/priestine/routing) [![codecov](https://codecov.io/gl/priestine/routing/branch/master/graph/badge.svg)](https://codecov.io/gl/priestine/routing) [![licence: MIT](https://img.shields.io/npm/l/@priestine/routing.svg)](https://gitlab.com/priestine/routing) [![docs: typedoc](https://img.shields.io/badge/docs-typedoc-blue.svg)](https://priestine.gitlab.io/routing) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier) [![versioning: semantics](https://img.shields.io/badge/versioning-semantics-912e5c.svg)](https://gitlab.com/priestine/semantics) [![npm](https://img.shields.io/npm/dt/@priestine/routing.svg)](https://www.npmjs.com/package/@priestine/routing) [![npm](https://img.shields.io/npm/v/@priestine/routing.svg)](https://www.npmjs.com/package/@priestine/routing) [![bundlephobia-min](https://img.shields.io/bundlephobia/min/@priestine/routing.svg)](https://bundlephobia.com/result?p=@priestine/routing) [![bundlephobia-minzip](https://img.shields.io/bundlephobia/minzip/@priestine/routing.svg)](https://bundlephobia.com/result?p=@priestine/routing)

`@priestine/routing` brings simple and eloquent routing to Node.js. It currently only works with Node.js `http` and `https`
yet new releases aim to support other APIs.

## TL;DR

```javascript
import { withHttpRouter, HttpRouter } from '@priestine/routing';
import { createServer } from 'http';

/**
 * Create an empty router
 */
const router = HttpRouter.empty();

/**
 * Define a set of functions
 */

// Curried for creating header builders
// `ctx` has { request: IncomingMessage, response: ServerResponse, intermediate: {/* Your data plus { route (matched route), error? } */} }
const setHeader = (name) => (value) => ({ response }) => {
  response.setHeader(name, value);
};

// Specifically, a Content-Type header builder (we could make it in one go tho)
const setContentTypeHeader = setHeader('Content-Type');

// Anything to be passed to the next middleware should be put to ctx.intermediate
// to keep request and response Node.js-ly pure
//
// Middleware context is passed along the middleware by reference so you can globally change it.
//
// It is recommended to return intermediate though, as this will enable deterministic function behaviour.
// If a middleware returns intermediate, ctx.intermediate is overriden by given value.
// This allows clearing intermediate contents that are no longer needed.
// It also enables support for short syntax, e.g.:
const buildHello = ({ intermediate }) => ({
  helloWorld: {
    id: 'hello-world',
    message: 'Hello World!',
  },
});

const sayHello = (ctx) => ctx.response.end(JSON.stringify(ctx.intermediate.helloWorld));

/**
 * Register them in the router
 */
router
  .get('/', [setContentTypeHeader('application/json'), buildHello, sayHello])
  .get(/^\/(\d+)\/?$/, [setContentTypeHeader('text/html'), buildHello, sayHello]);

/**
 * Assign the router to serve Node.js HTTP server.
 */
createServer(withHttpRouter(router)).listen(3000);

// Go get http://localhost:3000 or http://localhost:3000/123123123
```

## More

### Installation

```bash
npm i --save @priestine/routing
```

or

```bash
yarn add @priestine/routing
```

Routing consists of a few components one should grasp to build routing efficiently. This is the list, from biggest to
smallest:

- Routers
- Pipelines
- Middleware

### The Router Thing

1. `HttpRouter` is a kind of fluent interface for registering new routes and assigning logic to be executed for them:

- `router.register` accepts three required arguments:

  - **url** - a string or a RegExp describing the URL pathname IncomingMessage url must match
  - **methods** - an array of HTTP methods that IncomingMessage method must be in
  - **middleware** - an array of `HttpMiddlewareLike` or a `PipelineInterface` that will be processed if current
    IncomingMessage matches given url and methods (**NOTE** if you want to use `PipelineInterface`s you need to also
    `yarn add @priestine/data` or `npm i --save @priestine/data`)

  ```javascript
  const router = HttpRouter.empty();
  router
    .register(
      '/',
      ['POST', 'PUT'],
      [
        (ctx) => ctx.response.setHeader('Content-Type', 'application/json'),
        (ctx) => ctx.response.end('{ "success": true }'),
      ]
    )
    .register('/1', ['GET'], MyCustomPipeline);
  ```

- `router.get` (or one of **get**, **post**, **put**, **patch**, **delete**, **options**, **head**, **all**) is a helper
  method that registers a route with the same method and accepts only url and a `PipelineInterface` or array of middleware

  ```javascript
  const router = HttpRouter.empty();
  router.get('/', [
    ({ response }) => response.setHeader('Content-Type', 'application/json'),
    ({ response }) => response.end('{ "success": true }'),
  ]);
  ```

- `router.concat` allows concatenating multiple routers into one main router to be used app-wide. This is done to
  allow building modular routing with separated logic and then merging them to have single route map.

  ```javascript
  // NOTE: middleware provided in this example are not part of @priestine/routing
  const MainRouter = HttpRouter.empty();
  const ApiRouter = HttpRouter.empty();

  MainRouter.get('/', [SetContentTypeHeader('text/html'), GetTemplate('./templates/index.html'), EndResponse]);

  ApiRouter.post('/api/v1/user-actions/subscribe', [
    SetContentTypeHeader('application/json'),
    ParseRequestBody,
    JSONParseLens(['intermediate', 'requestBody']),
    UpsertUserSubscriptionStatus,
    EndJSONResponse,
  ]);

  MainRouter.concat(ApiRouter);
  ```

### The Pipeline Thing

Pipelines are a set of middleware that is executed on matching the route. Pipelines themselves are class-based
middleware with helper logic enabled. Internally, they iterate over processing assigned middleware until they get
to the end.

#### Special treatment

- If middleware returns a **Promise**, pipeline will resolve it before moving on to the next one
- If middleware returns something, or returned **Promise** successfully resolves into something, this something is
  assigned to `ctx.intermediate`
- Pipeline passes `ctx` to each middleware by reference so any changes to `ctx.intermediate` from previous middleware
  is available in further middleware unless `ctx.intermediate` wasn't changed by returning a value from one of previous
  pieces of middleware
- If an exception is thrown during pipeline execution or a **Promise** is rejected, the Pipeline immediately stops
  and delegated the error to the wrapper function

#### Manual Pipeline building

Pipelines are classes implementing `PipelineInterface`. To use them manually, you have to `npm i --save @priestine/data`
or `yarn add @priestine/data`.

When you declare routes, you can pass arrays of middleware and Router will create pipelines from those arrays
automatically. You can also provide pipelines yourself:

```javascript
import { Pipeline } from '@priestine/data/src';

const router = HttpRouter.empty();

const MyPipeline = Pipeline.from([MyMiddleware, MySecondMiddleware, MyThirdMiddleware]);

router.get('/', MyPipeline);
```

#### Pipeline.concat

You can build multiple reusable pipelines and concat them together before assigning to the router:

```javascript
const AccessControlPipeline = Pipeline.from([
  /* Some middleware */
]);
const ContentNegotiationPipeline = Pipeline.from([
  /* Some middleware */
]);

router = HttpRouter.empty();

router.get(
  '/',
  Pipeline.empty()
    .concat(AccessControlPipeline)
    .concat(ContentNegotiationPipeline)
    .concat(Pipeline.of(({ response }) => response.end('OK')))
);
```

This allows you to compose middleware into reusable sets that can be appended/prepended anywhere in your app.

### Middleware

Middleware is a reusable piece of business logic that encapsulates one specific step.
Middleware in `@priestine/routing` can be function- or class-based. Each middleware is provided with `ctx` argument:

```javascript
ctx = {
  request: IncomingMessage,
  response: ServerResponse,
  intermediate: { route: { url: string | RegExp, method: string } } & TIntermediate,
  error: Error | undefined,
};
```

If middleware is deterministic (meaning that it returns the intermediate or Promise resolving into the intermediate),
the `ctx.intermediate` object will be overriden by given value if `ctx` successfully validates through `isMiddlewareContext`
guard. This is done for two reasons:

1. Custom transformations for the intermediate that entirely change it
2. Easier testing
3. Cleaning up intermediate from values that are not going to be used anymore
4. Short syntax for returning objects `=> ({})`

Having said that, it is entirely optional and you can omit returning the intermediate, thus the argument context will
be passed to the next piece of middleware automatically.

For passing any computed data to next middleware, you should assign it to `ctx.intermediate` that serves a purpose of
transferring data along the pipeline.

#### Function Middleware

**Function middleware** is a fancy name for a function that accepts `ctx`.

```javascript
// Asynchronous function middleware
// Due to the fact that it returns a promise, the Pipeline will resolve it before moving on to the next one
// In the example, the middleware sets intermediate to be { id: 1, aThingToUseSpreadOperatorFor: true } after the
// the timeout.
const MyAsyncMiddleware = () =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve({ id: 1, aThingToUseSpreadOperatorFor: true });
    }, 200)
  );

// You can return a Promise with .then assigned as the Pipeline is fully Promise-compliant and the .then callback will
// be automatically applied. As .then returns a Promise, the behaviour in the pipeline is going to be just the same as
// if we returned a Promise itself as in the previous function.
const MyAsyncWithThen = ({ intermediate }) =>
  asynchrony
    .then((v) => ({
      ...intermediate,
      ...v,
    }))
    .catch((e) =>
      HttpError.from(e)
        .withStatusCode(500)
        .withMessage('No-no-no')
    );

// Synchronous function middleware
// Previous middleware assigned intermediate to be { id: 1, aThingToUseSpreadOperatorFor: true } and we can access it
// as the Pipeline resolved the promise. We can use spread operator for the intermediate and use short syntax to return
// a new intermediate with incremented id and additional 'hello' key.
const MyMiddleware = ({ intermediate }) => ({
  ...intermediate,
  id: intermediate.id + 1,
  hello: 'world',
});

router.get('/', [MyAsyncMiddleware, MyAsyncWithThen, MyMiddleware]);
```

#### Class-based Middleware

**Class-based middleware** must implement `HttpMiddlewareInterface` interface (it must have a `process` method that accepts `ctx`).

**NOTE**: When registering middleware in the Pipeline, you must provide an **instance** of a class-based middleware.

```javascript
class SetContentTypeHeader {
  static applicationJson() {
    return new SetContentTypeHeader('application/json');
  }

  constructor(value) {
    this.value = value;
  }

  process(ctx) {
    ctx.response.setHeader('Content-Type', this.value);
  }
}

router.get('/', [SetContentTypeHeader.applicationJson()]);
```

#### Parallel vs waterfall (Lazy vs Eager)

Asynchronous middleware in the pipeline can be executed either in parallel or sequentially. Each middleware can
dictate which type of execution must be applied to it:

- **parallel** execution does not block the pipeline and allows next middleware start processing even if the promise of
  current middleware has not been resolved. In this case, the Promise containing the result of current middleware
  computation can be directly assigned to the `ctx.intermediate` key and _awaited_ later where necessary. This approach
  allows doing extra checks simultaneously and exit the pipeline if something is not right. This can be referred to as
  Lazy execution. Example (the functions used in the example are not part of `@priestine/routing`):

```javascript
/**
 * `GetCurrentPost` doesn't block the next piece of middleware that can trigger exiting the pipeline
 * if user is not authenticated thus not allowed to see posts in this imaginary scenario. This allows writing middleware
 * in arbitrary order in some cases.
 */
const GetCurrentPost = (ctx) => {
  ctx.intermediate.post = db.collection('posts').findOne({ id: ctx.intermediate.params.id });
};

const GetPostComments = async (ctx) => {
  ctx.intermediate.body = (await ctx.intermediate.post).comments;
};

HttpRouter.empty().get(/^\/posts\/(?<id>(\w+))\/comments/, [GetCurrentPost, IsAuthenticated, GetPostComments]);
```

- **waterfall** execution blocks the pipeline until current middleware is done. This is convenient in cases where further
  execution of the pipeline heavily relies on the result of computation. To inform the pipeline that it needs to wait for
  current middleware to resolve, you need to return a Promise inside the middleware. This can be referred to as Eager
  execution. **NOTE** this doesn't block JavaScript event loop. Example (the functions used in the example are not part
  of `@priestine/routing`):

```javascript
/**
 * `IsAuthorized` blocks the middleware until the `ctx` is resolved. Thus, the Promise is rejected,
 * the pipeline will be exited and no further computation will be executed, being replaced with emitting a
 * `pipelineError` event.
 */
const IsAuthorized = (ctx) =>
  new Promise((resolve, reject) => {
    db.collection('users')
      .findOne({ _id: ctx.intermediate.userId })
      .then((u) => {
        if (u.roles.includes('admin')) {
          ctx.intermediate.userAuhorized = true;
          resolve(); // To make this middleware deterministic, use resolve(ctx)
          return;
        }

        reject(new UnauthorizedError());
      });
  });

HttpRouter.empty().get(/^\/posts\/(?<id>(\w+))\/comments/, [IsAuthorized, GetCurrentPost, GetPostComments]);
```

#### Generic Context

`@priestine/routing` is written in TypeScript and provides generic context interfaces for describing types of
`ctx.intermediate`:

```typescript
import { HttpContextInterface } from '@priestine/routing';

interface UserAware {
  user: {
    _id: string;
    name: string;
  };
}

export const GetUser = ({ intermediate }: HttpContextInterface<UserAware>) => {
  intermediate.user = {
    _id: '123123123123',
    name: 'Test User',
  };
};
```

### Assigning router to listen for connections

The router itself cannot listen for **IncomingMessage**'s and to make it work you need to wrap it into a wrapper
`withHttpRouter` and pass it to `http.createServer` as an argument:

#### HTTP

```javascript
import { createServer } from 'http';
import { HttpRouter, withHttpRouter } from '@priestine/routing';

const router = HttpRouter.empty().get('/', [(ctx) => ctx.response.end('hi')]);

createServer(withHttpRouter(router)).listen(3000);
```

#### HTTPS

```javascript
import { createServer } from 'https';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { HttpRouter, withHttpRouter } from '@priestine/routing';

const router = HttpRouter.empty().get('/', [({ response }) => response.end('hi')]);

const options = {
  key: readFileSync(resolve('/path/to/certificate/key.pem')),
  cert: readFileSync(resolve('/path/to/certificate/cert.pem')),
};

createServer(options, withHttpRouter(router)).listen(3000);
```

**NOTE**: `withHttpRouter` is opinionated and in case error occurs it always returns JSON response with the status code
and status message of the error in the response head as well as the error message in the response body, wrapped into

```json
{
  "success": false,
  "message": "ERROR_MESSAGE"
}
```

If you wish to amend this behaviour, you can create your own Router wrapper.

See https://gitlab.com/priestine/routing/blob/dev/src/http/helpers/serve-with-http-router.ts for details.

**NOTE**: `withHttpRouter` is marked deprecated and will be removed in future releases due to it opinionated behaviour
that doesn't correlate to the app concept.

### Error handling

To force quitting current pipeline, you can either **throw** (synchronous middleware) or **reject(e)** (asynchronous
middleware). The `error` object will be bound to `ctx` alongside `request`, `response` and `intermediate`.
