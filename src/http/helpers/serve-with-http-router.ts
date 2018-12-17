import { IncomingMessage, ServerResponse } from 'http';
import { HttpRouter } from '../http-router';
import { IHttpContext } from '../interfaces';

/**
 * Serve incoming HTTP requests using provided Router.
 *
 * @param {HttpRouter} router
 * @returns {(request: IncomingMessage, response: ServerResponse) => Promise<void>}
 */
export const withHttpRouter = (router: HttpRouter) => (
  request: IncomingMessage,
  response: ServerResponse
): Promise<void> => {
  if (!router.routeMap.sorted) {
    router.routeMap.sort();
  }

  const route = router.routeMap.find(request);

  const ctx: IHttpContext = {
    request,
    response,
    intermediate: {
      route: route.key,
    },
  };

  if (route.value.isEmpty) {
    ctx.intermediate.error = new Error(`Cannot ${ctx.request.method} ${ctx.request.url}`);
    HttpRouter.handleError(ctx);
    return;
  }

  route.value.$process(ctx);
};
