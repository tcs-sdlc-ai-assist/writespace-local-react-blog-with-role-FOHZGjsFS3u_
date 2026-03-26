export function getAvatarProps(role) {
  if (role === 'admin') {
    return {
      emoji: '👑',
      bgColor: 'bg-violet-500',
      label: 'Admin',
    };
  }

  return {
    emoji: '📖',
    bgColor: 'bg-indigo-500',
    label: 'Viewer',
  };
}