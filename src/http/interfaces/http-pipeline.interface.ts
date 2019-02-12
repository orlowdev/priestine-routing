import { HttpContextInterface } from './http-context.interface';
import { PipelineInterface } from '@priestine/data/src';

/**
 * Descriptor for HTTP pipeline.
 *
 * @interface HttpPipelineInterface
 * @deprecated Will be removed in future releases
 */
export interface HttpPipelineInterface<T = {}> extends PipelineInterface<T, HttpContextInterface> {
  concat(o: HttpPipelineInterface): HttpPipelineInterface;
}
