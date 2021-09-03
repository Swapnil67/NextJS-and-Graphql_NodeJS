import session from 'express-session';
export {};
declare module 'express-session' {
  export interface SessionData {
    userId: { [key: Number]: any };
  }
}