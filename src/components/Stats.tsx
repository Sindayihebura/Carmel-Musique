interface StatsProps {
  trackCount: number;
  totalPlays: number;
  totalLikes: number;
  totalDownloads: number;
}

export function Stats({ trackCount, totalPlays, totalLikes, totalDownloads }: StatsProps) {
  if (trackCount === 0) return null;

  const stats = [
    { label: 'Morceaux', value: trackCount, icon: '🎵', color: 'from-purple-500/20 to-purple-600/20' },
    { label: 'Lectures', value: totalPlays, icon: '▶️', color: 'from-blue-500/20 to-blue-600/20' },
    { label: 'Likes', value: totalLikes, icon: '❤️', color: 'from-pink-500/20 to-pink-600/20' },
    { label: 'Téléchargements', value: totalDownloads, icon: '⬇️', color: 'from-green-500/20 to-green-600/20' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(stat => (
          <div
            key={stat.label}
            className={`bg-gradient-to-br ${stat.color} backdrop-blur-sm border border-white/5 rounded-xl p-4 flex items-center gap-3`}
          >
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
