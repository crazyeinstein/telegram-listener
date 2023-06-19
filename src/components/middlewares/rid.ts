import * as uuid from 'uuid';

export function rid(req, res, next) {
  req.rid = req.get('x-request-id') || uuid.v1();
  req.tid = req.get('x-amzn-trace-id');

  res.setHeader('x-request-id', req.rid);

  next();
}
