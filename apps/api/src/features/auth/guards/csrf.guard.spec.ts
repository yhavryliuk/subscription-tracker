import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CsrfGuard } from './csrf.guard';

const makeContext = (headers: Record<string, string>, cookies: Record<string, string>) => {
  const mockCtx = {
    req: { headers, cookies },
    res: {},
  };

  jest.spyOn(GqlExecutionContext, 'create').mockReturnValue({
    getContext: () => mockCtx,
  } as unknown as GqlExecutionContext);

  return {} as ExecutionContext;
};

describe('CsrfGuard', () => {
  let guard: CsrfGuard;

  beforeEach(() => {
    guard = new CsrfGuard();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns true when CSRF header matches cookie', () => {
    const ctx = makeContext(
      { 'x-csrf-token': 'my-token' },
      { csrfToken: 'my-token' },
    );

    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('throws ForbiddenException when CSRF header is missing', () => {
    const ctx = makeContext({}, { csrfToken: 'my-token' });

    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('throws ForbiddenException when CSRF cookie is missing', () => {
    const ctx = makeContext({ 'x-csrf-token': 'my-token' }, {});

    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('throws ForbiddenException when header and cookie do not match', () => {
    const ctx = makeContext(
      { 'x-csrf-token': 'token-a' },
      { csrfToken: 'token-b' },
    );

    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });
});
