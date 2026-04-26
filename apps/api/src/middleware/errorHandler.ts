import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  console.error('[Error]', err.stack ?? err.message);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
};
