import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlAuthGuard } from './gql-auth.guard';

describe('GqlAuthGuard', () => {
  let guard: GqlAuthGuard;

  beforeEach(() => {
    guard = new GqlAuthGuard();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getRequest', () => {
    it('extracts request from GraphQL execution context', () => {
      const mockReq = { user: { id: 'user-1' }, headers: {} };
      const mockGqlCtx = {
        getContext: () => ({ req: mockReq }),
      } as unknown as GqlExecutionContext;

      jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(mockGqlCtx);

      const mockContext = {} as ExecutionContext;
      const result = guard.getRequest(mockContext);

      expect(result).toBe(mockReq);
      expect(GqlExecutionContext.create).toHaveBeenCalledWith(mockContext);
    });
  });
});
