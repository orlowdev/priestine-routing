/**
 * Interface each class-based middleware must implement to be considered as such.
 *
 * The only requirement for class-based middleware is to have `$process` method where the middleware execution logic
 * is located. The class-based middleware `$process` method shares behaviour with IMiddlewareFunction.
 *
 * @interface IMiddleware<TContext>
 */
export interface IMiddleware<TContext> {
  $process(ctx: TContext): any;
}
