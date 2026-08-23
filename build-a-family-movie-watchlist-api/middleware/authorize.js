export function authorizeModification(req, res, next) {
  const role = req.user?.role;
  const currentUserId = String(req.user?.id);
  const targetUserId = String(req.params.userId);

  const isParent = role === "parent";
  const isChildEditingOwnList =
    role === "child" && currentUserId === targetUserId;

  if (!isParent && !isChildEditingOwnList) {
    return res.status(403).json({
      error: "Access denied",
    });
  }

  return next();
}