# @priestine/routing

[![pipeline](https://gitlab.com/priestine/routing/badges/master/pipeline.svg)](https://gitlab.com/priestine/routing) [![codecov](https://codecov.io/gl/priestine/routing/branch/master/graph/badge.svg)](https://codecov.io/gl/priestine/routing) [![licence: MIT](https://img.shields.io/npm/l/@priestine/routing.svg)](https://gitlab.com/priestine/routing) [![docs: typedoc](https://img.shields.io/badge/docs-typedoc-blue.svg)](https://priestine.gitlab.io/routing) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier) [![versioning: semantics](https://img.shields.io/badge/versioning-semantics-912e5c.svg)](https://gitlab.com/priestine/semantics) [![npm](https://img.shields.io/npm/dt/@priestine/routing.svg)](https://www.npmjs.com/package/@priestine/routing) [![npm](https://img.shields.io/npm/v/@priestine/routing.svg)](https://www.npmjs.com/package/@priestine/routing)

`@priestine/routing` brings simple and eloquent routing to Node.js. It currently only works with Node.js `http` server
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
// `ctx` has { request: IncomingMessage, response: ServerResponse, intermediate: {/* Your data */}, error? } 
const setHeader = (name) => (value) => (ctx) => {
  ctx.response.setHeader(name, value);
};

// Specifically, a Content-Type header builder (we could make it in one go tho)
const setContentTypeHeader = setHeader('Content-Type');

// Anything to be passed to the next middleware should be put to ctx.intermediate
// to keep request and response Node.js-ly pure
const buildHello = (ctx) => {
    ctx.intermediate.helloWorld = {
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
    - **middleware** - an array of `IMiddlewareLike` that will be processed inside a Pipeline if current IncomingMessage
    matches given url and methods
    
    ```javascript
    const router = HttpRouter.empty();
    router.register('/', ['POST', 'PUT'], [
      (ctx) => ctx.response.setHeader('Content-Type', 'application/json'),
      (ctx) => ctx.response.end('{ "success": true }'),
    ]);
    ```

  - `router.get` (or one of **get**, **post**, **put**, **patch**, **delete**, **options**, **head**) registers a
  route with the same method and accepts only url and array of middleware
    
    ```javascript
    const router = HttpRouter.empty();
    router.get('/', [
      (ctx) => ctx.response.setHeader('Content-Type', 'application/json'),
      (ctx) => ctx.response.end('{ "success": true }'),
    ]);
    ```
    
  - `router.beforeEach` and `router.afterEach` accept array of middleware that will be executed before/after each
  registered pipeline
  
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

### Middleware
 
Middleware is a reusable piece of business logic that encapsulates one specific step.
Middleware in `@priestine/routing` can be functional or class-based. Each middleware is provided with `ctx` argument:
 
```javascript
ctx = {
  request: IncomingMessage,
  response: ServerResponse,
  intermediate: { route: { url: string | RegExp, method: string } } & object,
  error: Error | undefined,
}
```

For passing any computed data to next middleware, you should assign it to `ctx.intermediate` that serves a purpose of
transferring data along the pipeline.
 
#### Function Middleware

**Function middleware** is a fancy name for a function that accepts `ctx`. You don't need to return `ctx` after the
computation is finished as it is done for you automatically. If the computation is asynchronous, you nee to return it
wrapped into a Promise that resolves `ctx` object or rejects with an error. This will force the Pipeline to await for
the Promise to resolve before moving on to the next middleware.

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

**Class-based middleware** must implement `IMiddleware` interface (it must have a `$process`) method that accepts `ctx`.
You don't need to return `ctx` after the computation is finished as it is done for you automatically. If the computation
is asynchronous, you nee to return it wrapped into a Promise that resolves `ctx` object or rejects with an error. This
will force the Pipeline to await for the Promise to resolve before moving on to the next middleware.

**NOTE**: When registering middleware in the Router, you must provide an **instance** of a class-based middleware.

```javascript
class SetContentTypeHeader {
  static applicationJson() {
    return new MyMiddleware('application/json');
  }
  
  constructor(value) {
    this.value = value;
  }
  
  $process(ctx) {
    ctx.response.setHeader('Content-Type', this.value);
  }
}

router.get('/', [
  SetContentTypeHeader.applicationJson(),
])
```

#### Parallel vs waterfall

Asynchronous middleware in the pipeline can be executed in either in parallel or sequentially. Each middleware can
dictate which type of execution must be applied to it:

- parallel execution does not block the pipeline and allows next middleware start processing even if the promise of 
current middleware has not been resolved. It this case, the Promise containing the result of current middleware
computation can be directly assigned to the `ctx.intermediate` key and *awaited* later where necessary. This approach
allows doing extra checks simultaneously and exit the pipeline if something is not right. Example:

```javascript
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

In the example above `GetCurrentPost` doesn't block the next piece of middleware that can trigger exiting the pipeline
if user is not authenticated thus not allowed to see posts in this imaginary scenario. This allows writing middleware
in arbitrary order in some cases.

- waterfall execution blocks the pipeline until current middleware is done. This is convenient in cases where further
execution of the pipeline heavily relies on the result of computation. To inform the pipeline that it needs to wait for
current middleware to *await*, you need to return a Promise inside the middleware, that resolves with amended
`ctx`:

```javascript
const IsAuthorized = (ctx) => new Promise((resolve, reject) => {
  db.collection('users').findOne({ _id: ctx.intermediate.userId })
    .then((u) => {
      if (u.roles.includes('admin')) {
        ctx.intermediate.userAuhorized = true;
        resolve(ctx);
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

In the example above `IsAuthorized` blocks the middleware until the `ctx` is resolved. Thus, the Promise is rejected,
the pipeline will be exited and no further computation will be executed, being replaced with `HttpRouter.onError`.

#### IGenericMiddlewareLike

`@priestine/routing` is written in TypeScript and provides generic context interfaces for providing typings of
`ctx.intermediate`:

```typescript
import { IGenericHttpContext } from '@priestine/routing';

interface IUserAware {
  user: {
    _id: string;
    name: string;
  };
}

export const GetUser = (ctx: IGenericHttpContext<IUserAware>) => {
  ctx.intermediate.user = {
    _id: '123123123123',
    name: 'Test User',
  };
};
```

### Assigning router to listen for connections

The router itself cannot listen for **IncomingMessage**'s and to make it work you need to wrap it into a helper
`withHttpRouter` and pass it to `http.createServer` as an argument:

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

### Error handling

Error handling in `@priestine/routing` is done using the same concept of middleware yet error handlers are registered
statically to be available anywhere:

```javascript
HttpRouter.onError([
  (ctx) => ctx.response.setHeader('Content-Type', 'application/json'),
  (ctx) => ctx.intermediate.body = {
    success: false,
    message: ctx.intermediate.error.message,
  },
  (ctx) => ctx.response.end(JSON.stringify(ctx.intermediate.body)),
]);
```

If something goes wrong, the middleware pipeline is aborted and a new pipeline of `HttpRouter.errorHandlers` (provided
with `HttpRouter.onError`) is issued using the `ctx` of the pipeline that broke down. You can debug the nature of the
error by checking the contents of the `ctx.intermediate` as it will have all the amendments up to the moment where it
crashed.

**NOTE**: `beforeEach` and `afterEach` are not applied to error handlers!

To force quitting current pipeline, you can either **throw** (synchronous middleware) or **reject()** (asynchronous
middleware).
