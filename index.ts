import { createServer } from 'http';
import { withHttpRouter } from './src/http/helpers/serve-with-http-router';
import { HttpRouter } from './src/http/http-router';

export * from './src';

const appRouter = HttpRouter.empty();

const setHeader = (name) => (value) => (ctx) => {
  ctx.response.setHeader(name, value);
};

const setContentTypeHeader = setHeader('Content-Type');

const buildHello = (ctx) => {
  ctx.intermediate.helloWorld = {
    id: 'hello-world',
    message: 'Hello World!',
  };
};

const sayHello = (ctx) => ctx.response.end(JSON.stringify(ctx.intermediate.helloWorld));

appRouter.get('/', [setContentTypeHeader('application/json'), buildHello, sayHello]);

createServer(withHttpRouter(appRouter)).listen(3000);
