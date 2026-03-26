export function isAdmin(session) {
  if (!session) return false;
  return session.role === 'admin';
}

export function isViewer(session) {
  if (!session) return false;
  return session.role === 'viewer';
}

export function canEditPost(session, post) {
  if (!session || !post) return false;
  if (isAdmin(session)) return true;
  return post.author === session.username;
}

export function canDeletePost(session, post) {
  if (!session || !post) return false;
  if (isAdmin(session)) return true;
  return post.author === session.username;
}