import { Plugin } from '@nestjs/apollo';
import { GraphQLRequestContext } from '@apollo/server';

export class ComplexityPlugin {
  private readonly maxComplexity = 1000;

  requestDidStart() {
    return {
      didResolveOperation: async (requestContext: GraphQLRequestContext<any>) => {
        const complexity = this.calculateComplexity(requestContext.request.query);
        
        if (complexity > this.maxComplexity) {
          throw new Error(
            `Query complexity ${complexity} exceeds maximum allowed complexity of ${this.maxComplexity}`
          );
        }
      },
    };
  }

  private calculateComplexity(query: string): number {
    const depth = (query.match(/\{/g) || []).length;
    const fieldCount = (query.match(/\w+:/g) || []).length;
    return depth * Math.max(fieldCount / depth, 1);
  }
}
