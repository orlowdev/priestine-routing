# @priestine/routing

[![pipeline](https://gitlab.com/priestine/routing/badges/master/pipeline.svg)](https://gitlab.com/priestine/routing) [![codecov](https://codecov.io/gl/priestine/routing/branch/master/graph/badge.svg)](https://codecov.io/gl/priestine/routing) [![licence: MIT](https://img.shields.io/npm/l/@priestine/routing.svg)](https://gitlab.com/priestine/routing) [![docs: typedoc](https://img.shields.io/badge/docs-typedoc-blue.svg)](https://priestine.gitlab.io/routing) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier) [![versioning: semantics](https://img.shields.io/badge/versioning-semantics-912e5c.svg)](https://gitlab.com/priestine/semantics)[![npm](https://img.shields.io/npm/dt/@priestine/routing.svg)](https://www.npmjs.com/package/@priestine/routing) [![npm](https://img.shields.io/npm/v/@priestine/routing.svg)](https://www.npmjs.com/package/@priestine/routing)

## Installation

```bash
npm i --save @priestine/routing
```

or

```bash
yarn add @priestine/routing
```

## Usage

### TL;DR

```javascript
import { withHttpRouter, HttpRouter } from '@priestine/routing';

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

// Anything to be passed to the next middleware should be put to ctx.intermediate to keep request and response Node.js-ly pure
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
    .get('/', [
      setContentTypeHeader('application/json'),
      buildHello,
      sayHello,
    ])
    .get(/^\/(\d+)\/?$/, [
      setContentTypeHeader('text/html'),
      buildHello,
      sayHello,
    ])
;

/**
 * Assign the router to serve Node.js HTTP server.
 */
createServer(withHttpRouter(router)).listen(3000);

// Go get http://localhost:3000
```
