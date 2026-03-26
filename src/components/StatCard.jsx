export function StatCard({ label, value, icon, colorScheme = 'indigo' }) {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-50',
      iconBg: 'bg-indigo-100',
      text: 'text-indigo-600',
    },
    violet: {
      bg: 'bg-violet-50',
      iconBg: 'bg-violet-100',
      text: 'text-violet-600',
    },
    emerald: {
      bg: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
      text: 'text-emerald-600',
    },
    amber: {
      bg: 'bg-amber-50',
      iconBg: 'bg-amber-100',
      text: 'text-amber-600',
    },
    rose: {
      bg: 'bg-rose-50',
      iconBg: 'bg-rose-100',
      text: 'text-rose-600',
    },
  };

  const colors = colorMap[colorScheme] || colorMap.indigo;

  return (
    <div className={`rounded-xl p-6 flex items-center gap-4 ${colors.bg} border border-white shadow-sm`}>
      {icon && (
        <div className={`flex items-center justify-center w-12 h-12 rounded-xl text-2xl ${colors.iconBg}`}>
          {icon}
        </div>
      )}
      <div className="flex flex-col">
        <span className={`text-3xl font-bold ${colors.text}`}>{value}</span>
        <span className="text-sm text-gray-500 font-medium mt-0.5">{label}</span>
      </div>
    </div>
  );
}