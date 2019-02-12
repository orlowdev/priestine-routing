import { IncomingMessage, ServerResponse } from 'http';
import { HttpRouter } from '../http-router';
import { HttpContextInterface } from '../interfaces';

/**
 * Serve incoming HTTP requests using provided Router.
 *
 * @deprecated You have to implement using the Router yourself. The implementation for this code will be available
 * as part of opinionated microframework `@priestine/ascendance`.
 *
 * @param {HttpRouter} router
 * @returns {(request: IncomingMessage, response: ServerResponse) => Promise<void>}
 */
export const withHttpRouter = (router: HttpRouter) => async (
  request: IncomingMessage,
  response: ServerResponse
): Promise<void> => {
  if (!router.routeMap.sorted) {
    router.routeMap.sort();
  }

  const route = router.routeMap.find(request);

  const ctx: HttpContextInterface = {
    request,
    response,
    intermediate: {
      route: route.key,
    },
  };

  if (route.value.isEmpty) {
    ctx.response.setHeader('Content-Type', 'application/json');
    ctx.response.statusCode = 404;
    ctx.response.end(
      JSON.stringify({
        success: false,
        message: `Cannot ${request.method} ${request.url}`,
      })
    );

    return;
  }

  const result: HttpContextInterface = await route.value.process(ctx);

  if (result.error) {
    ctx.response.setHeader('Content-Type', 'application/json');
    ctx.response.statusCode = (ctx.error as any).statusCode || 500;
    ctx.response.end(
      JSON.stringify({
        success: false,
        message: `${ctx.error.message}`,
      })
    );
  }
};
