import { IncomingMessage, ServerResponse } from 'http';
import { HttpError } from '../errors';
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
export const withHttpRouter = (router: HttpRouter) => (
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
    ctx.intermediate.error = HttpError.from(
      new Error(`Cannot ${ctx.request.method} ${ctx.request.url}`)
    ).withStatusCode(404);
    return;
  }

  route.value.process(ctx);
};
