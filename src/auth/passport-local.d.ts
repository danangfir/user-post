declare module 'passport-local' {
  import { Strategy as PassportStrategy } from 'passport';
  
  interface IStrategyOptions {
    usernameField?: string;
    passwordField?: string;
    session?: boolean;
    passReqToCallback?: boolean;
  }

  interface VerifyFunction {
    (username: string, password: string, done: (error: any, user?: any, options?: IVerifyOptions) => void): void;
  }

  interface VerifyFunctionWithRequest {
    (req: Request, username: string, password: string, done: (error: any, user?: any, options?: IVerifyOptions) => void): void;
  }

  interface IVerifyOptions {
    message: string;
  }

  class Strategy extends PassportStrategy {
    constructor(options: IStrategyOptions, verify: VerifyFunction);
    constructor(verify: VerifyFunction);
    constructor(options: IStrategyOptions, verify: VerifyFunctionWithRequest);
    constructor(verify: VerifyFunctionWithRequest);

    name: string;
  }
}
