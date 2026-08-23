export function inputCleaner(req, res, next) {
  if (typeof req.body.username === "string") {
    req.body.username = req.body.username.toLowerCase();
  }

  if (typeof req.body.comment === "string") {
    req.body.comment = req.body.comment.replace(/<[^>]*>/g, "");
  }

  next();
}

export function inputValidator(req, res, next) {
  const username = req.body.username;

  if (typeof username === "string" && username.length >= 3) {
    return next();
  }

  return res.redirect(
    "/form?error=Username must be at least 3 characters.",
  );
}