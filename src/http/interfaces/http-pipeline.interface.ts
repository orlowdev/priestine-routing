import { IHttpContext } from './http-context.interface';
import { PipelineInterface } from '@priestine/data/src';

/**
 * Descriptor for HTTP pipeline.
 *
 * @interface HttpPipelineInterface
 */
export interface HttpPipelineInterface<T = {}> extends PipelineInterface<T, IHttpContext> {
  concat(o: HttpPipelineInterface): HttpPipelineInterface;
}
