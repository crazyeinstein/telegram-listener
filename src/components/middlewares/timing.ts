export function timing(req, res, next) {
  req.timing = {
    from: new Date(),
  };

  res.on('finish', () => {
    req.timing.to = new Date();
    req.timing.duration = req.timing.to - req.timing.from;
  });

  next();
}
