import { getAvatarProps } from '../utils/AvatarService.js';

export function AvatarChip({ role }) {
  const { emoji, bgColor, label } = getAvatarProps(role);

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-sm font-medium ${bgColor}`}
      title={label}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </span>
  );
}