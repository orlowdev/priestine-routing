import { IncomingMessage, ServerResponse } from 'http';
import { HttpPipeline } from '../http-pipeline';
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

  const pipeline = HttpPipeline.of(route.value);

  const ctx: IHttpContext = {
    request,
    response,
    intermediate: {
      route: route.key,
    },
  };

  if (pipeline.isEmpty) {
    ctx.intermediate.error = new Error(`Cannot ${ctx.request.method} ${ctx.request.url}`);
    HttpRouter.handleError(ctx);
    return;
  }

  pipeline.$process(ctx);
};
