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
const buildHello = ({ intermediate }) => {
    intermediate.helloWorld = {
      id: 'hello-world',
      message: 'Hello World!',
    }
};

// You don't need to actually return the ctx. It's done for you automatically
// In case you run async code, you must create and return a Promise that will resolve when necessary
const sayHello = (ctx) => ctx.response.end(JSON.stringify(ctx.intermediate.helloWorld));

/**
 * Register them in the router
 */
router
  .afterEach([
    buildHello,
    sayHello,
  ])
  .get('/', [
    setContentTypeHeader('application/json'),
  ])
  .get(/^\/(\d+)\/?$/, [
    setContentTypeHeader('text/html'),   
  ])
;

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

Routing consists of a few components one should grasp to build routing efficiently:

### The Router Thing

1. `HttpRouter` is a kind of fluent interface for registering new routes:

  - `router.register` accepts three required arguments:
    - **url** - a string or a RegExp describing the URL pathname IncomingMessage url must match
    - **methods** - an array of HTTP methods that IncomingMessage method must be in
    - **middleware** - an array of `HttpMiddlewareLike` or an `Pipeline` that will be processed if current
    IncomingMessage matches given url and methods (**NOTE** if you want to use `Pipeline`s you need to also
    `yarn add @priestine/data`)
    
    ```javascript
    const router = HttpRouter.empty();
    router
      .register('/', ['POST', 'PUT'], [
        (ctx) => ctx.response.setHeader('Content-Type', 'application/json'),
        (ctx) => ctx.response.end('{ "success": true }'),
      ])
      .register('/1', ['GET'], MyCustomPipeline)
    ;
    ```

  - `router.get` (or one of **get**, **post**, **put**, **patch**, **delete**, **options**, **head**) registers a
  route with the same method and accepts only url and an HttpPipeline or array of middleware
    
    ```javascript
    const router = HttpRouter.empty();
    router.get('/', [
      ({ response }) => response.setHeader('Content-Type', 'application/json'),
      ({ response }) => response.end('{ "success": true }'),
    ]);
    ```
    
  - `router.beforeEach` and `router.afterEach` accept array of middleware or a pipeline that will be executed
  before/after each registered pipeline.
  
    ```javascript
    const runBeforeEach = [
      SetContentTypeHeader('application/json'),
      ExtractQueryParams,
      ExtractRequestParams,
    ];
  
    const runAfterEach = [
      FlushHead,
      CreateJSONResponseBody,
      EndResponse,
    ];
  
    HttpRouter
      .empty()
      .beforeEach(runBeforeEach)
      .afterEach(runAfterEach)
      .get('/', [
        SomeLogic,
      ])
    ;
    ```
  
  - `router.concat` allows concatenating multiple routers into one main router to be used app-wide. This is done to
  allow building modular routing with separated logic and then merging them to have single route map.
  
    ```javascript
    const MainRouter = HttpRouter.empty();
    const ApiRouter = HttpRouter.empty();
    
    MainRouter
      .get('/', [
        SetContentTypeHeader('text/html'),
        GetTemplate('./templates/index.html'),
        EndResponse,
      ])
    ;
    
    ApiRouter
      .post('/api/v1/user-actions/subscribe', [
        SetContentTypeHeader('application/json'),
        ParseRequestBody,
        JSONParseLens(['intermediate', 'requestBody']),
        UpsertUserSubscriptionStatus,
        EndJSONResponse,
      ])
    ;
    
    MainRouter.concat(ApiRouter);
    ```

### HttpMiddleware
 
HttpMiddleware is a reusable piece of business logic that encapsulates one specific step.
Middleware in `@priestine/routing` can be function- or class-based. Each middleware is provided with `ctx` argument:
 
```javascript
ctx = {
  request: IncomingMessage,
  response: ServerResponse,
  intermediate: { route: { url: string | RegExp, method: string } } & TIntermediate,
  error: Error | undefined,
}
```

If middleware is deterministic (meaning that it returns the context object or Promise resolving into the context
object), the context object will be overriden by given value if it successfully validates through `isMiddlewareContext`
guard. This is done for two reasons:

1. Custom transformations for the context that entirely change it
2. Easier testing

Having said that, it is entirely optional and you can omit returning the context, thus the argument context will
be passed to the next piece of middleware automatically.

For passing any computed data to next middleware, you should assign it to `ctx.intermediate` that serves a purpose of
transferring data along the pipeline.

#### Function Middleware

**Function middleware** is a fancy name for a function that accepts `ctx`.

```javascript
// Synchronous function middleware
const MyMiddleware = (ctx) => {
  ctx.intermediate.id = 1;
}

// Asynchronous function middleware
const MyAsyncMiddleware = (ctx) => {
  return new Promise((resolve) => setTimeout(() => { resolve(ctx); }, 200));
}

router.get('/', [
  MyAsyncMiddleware,
  MyMiddleware,
]);
```

#### Class-based Middleware

**Class-based middleware** must implement `HttpMiddlewareInterface` interface (it must have a `process`) method that accepts `ctx`.

**NOTE**: When registering middleware in the Router, you must provide an **instance** of a class-based middleware.

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

router.get('/', [
  SetContentTypeHeader.applicationJson(),
])
```

#### Parallel vs waterfall (Lazy vs Eager)

Asynchronous middleware in the pipeline can be executed either in parallel or sequentially. Each middleware can
dictate which type of execution must be applied to it:

- **parallel** execution does not block the pipeline and allows next middleware start processing even if the promise of 
current middleware has not been resolved. In this case, the Promise containing the result of current middleware
computation can be directly assigned to the `ctx.intermediate` key and *awaited* later where necessary. This approach
allows doing extra checks simultaneously and exit the pipeline if something is not right. This can be referred to as
Lazy execution. Example:

```javascript
/**
 *  `GetCurrentPost` doesn't block the next piece of middleware that can trigger exiting the pipeline
 * if user is not authenticated thus not allowed to see posts in this imaginary scenario. This allows writing middleware
 * in arbitrary order in some cases.
 */
const GetCurrentPost = (ctx) => {
  ctx.intermediate.post = db.collection('posts').findOne({ id: ctx.intermediate.params.id });
};

const GetPostComments = async (ctx) => {
  ctx.intermediate.body = (await ctx.intermediate.post).comments;
};

HttpRouter.empty()
  .get(/^\/posts\/(?<id>(\w+))\/comments/, [
    GetCurrentPost,
    IsAuthenticated,
    GetPostComments,
  ])
;
```

- **waterfall** execution blocks the pipeline until current middleware is done. This is convenient in cases where further
execution of the pipeline heavily relies on the result of computation. To inform the pipeline that it needs to wait for
current middleware to resolve, you need to return a Promise inside the middleware. This can be referred to as Eager
execution. **NOTE** this doesn't block JavaScript event loop. Example:

```javascript
/**
 * `IsAuthorized` blocks the middleware until the `ctx` is resolved. Thus, the Promise is rejected,
 * the pipeline will be exited and no further computation will be executed, being replaced with emitting a
 * `pipelineError` event.
 */
const IsAuthorized = (ctx) => new Promise((resolve, reject) => {
  db.collection('users').findOne({ _id: ctx.intermediate.userId })
    .then((u) => {
      if (u.roles.includes('admin')) {
        ctx.intermediate.userAuhorized = true;
        resolve(); // To make this middleware deterministic, use resolve(ctx)
        return;
      }
      
      reject(new UnauthorizedError());
    })
  ;
});

HttpRouter.empty()
  .get(/^\/posts\/(?<id>(\w+))\/comments/, [
    IsAuthorized,
    GetCurrentPost,
    GetPostComments,
  ])
;
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

The router itself cannot listen for **IncomingMessage**'s and to make it work you need to wrap it into a helper
`withHttpRouter` and pass it to `http.createServer` as an argument:

#### HTTP

```javascript
import { createServer } from 'http';
import { HttpRouter, withHttpRouter } from '@priestine/routing';

const router = HttpRouter.empty()
  .get('/', [
    (ctx) => ctx.response.end('hi'),
  ])
;

createServer(withHttpRouter(router)).listen(3000);
```

#### HTTPS

```javascript
import { createServer } from 'https';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { HttpRouter, withHttpRouter } from '@priestine/routing';

const router = HttpRouter.empty()
  .get('/', [
    ({ response }) => response.end('hi'),
  ])
;

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
  "message": "ERROR_MESSAGE",
  "stack": "ERROR_STACK_TRACE" /* Stack trace is only visible when NODE_ENV !== 'production' */
}
```

If you wish to amend this behaviour, you can create your own Router wrapper.
See https://gitlab.com/priestine/routing/blob/dev/src/http/helpers/serve-with-http-router.ts for details.
**NOTE**: `withHttpRouter` is marked deprecated and will be removed in future releases due to it opinionated behaviour
that doesn't correlate to the app concept.

### Error handling

To force quitting current pipeline, you can either **throw** (synchronous middleware) or **reject(e)** (asynchronous
middleware).
