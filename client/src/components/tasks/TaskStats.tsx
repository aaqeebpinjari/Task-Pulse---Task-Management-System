interface TaskStatsProps {
  stats: { total: number; completed: number; pending: number; inProgress: number };
}

// Props include total, pending, completed, in-progress numbers
const TaskStats = ({ stats }: TaskStatsProps) => {
  const cards = [
    { label: 'Total Tasks', value: stats.total, color: '#1d4ed8' },
    { label: 'Completed', value: stats.completed, color: '#16a34a' },
    { label: 'In Progress', value: stats.inProgress, color: '#0891b2' },
    { label: 'Pending', value: stats.pending, color: '#f97316' },
  ];

  return (
    <div className="grid grid-2" style={{ gap: '1rem' }}>
      {cards.map((card) => (
        <div key={card.label} className="card" style={{ borderLeft: `6px solid ${card.color}` }}>
          <p style={{ margin: 0, color: '#475569' }}>{card.label}</p>
          <h2 style={{ margin: 0 }}>{card.value}</h2>
        </div>
      ))}
    </div>
  );
};

export default TaskStats;

