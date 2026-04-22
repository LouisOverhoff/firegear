import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, AlertTriangle, ArrowRight, Clock, ShoppingBag } from 'lucide-react';
import { BarChart, Bar, Cell, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { useClothing } from '../context/ClothingContext';

const Dashboard = () => {
  const { items } = useClothing();
  const activeItems = items.filter(item => !item.archived);
  const today = new Date();

  const overdueItems = activeItems.filter(
    item => item.next_inspection && new Date(item.next_inspection) < today
  );

  const upcomingItems = activeItems.filter(item => {
    if (!item.next_inspection) {
      return false;
    }

    const nextDate = new Date(item.next_inspection);
    const diffTime = nextDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  });

  const totalItems = activeItems.length;
  const inRepair = activeItems.filter(item => item.status === 'In Reparatur').length;
  const cleaning = activeItems.filter(item => item.status === 'Bedarf Reinigung').length;
  const dueInspection = activeItems.filter(item => item.status === 'Zur Pruefung faellig').length;

  const statusData = [
    { name: 'Gut', count: activeItems.filter(item => item.status === 'Gut').length, color: 'var(--success)' },
    { name: 'Reinigung', count: cleaning, color: 'var(--secondary)' },
    { name: 'Reparatur', count: inRepair, color: '#f87171' },
    { name: 'Prüfung', count: dueInspection, color: 'var(--accent)' },
  ];

  return (
    <div className="dashboard-container">
      <h1 className="title">Material-Statistik</h1>
      <p className="subtitle">Zustandsanalyse der aktiven Ausrüstung</p>

      <div className="summary-cards">
        <Link to="/inventory?status=Alle" className="stat-card-link">
          <StatCard icon={<ShoppingBag size={24} />} label="Aktiver Bestand" value={totalItems} color="var(--primary)" />
        </Link>
        <Link to="/inventory?status=overdue" className="stat-card-link">
          <StatCard icon={<AlertCircle size={24} />} label="Überfällig" value={overdueItems.length} color="#ef4444" />
        </Link>
        <Link to="/inventory?status=upcoming" className="stat-card-link">
          <StatCard icon={<AlertTriangle size={24} />} label="Demnächst fällig" value={upcomingItems.length} color="var(--accent)" />
        </Link>
        <Link to="/inventory?status=Bedarf Reinigung" className="stat-card-link">
          <StatCard icon={<Clock size={24} />} label="Reinigung" value={cleaning} color="var(--secondary)" />
        </Link>
      </div>

      <div className="dashboard-grid">
        <div className="glass card chart-container">
          <h3>Bestandsverteilung</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusData}>
              <XAxis dataKey="name" axisLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: 'var(--surface)', border: 'none', borderRadius: '12px' }}
                cursor={{ fill: 'transparent' }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="inspection-panels">
          <div className="glass card panel overdue-panel">
            <h3 className="text-red-500">
              <AlertCircle size={18} /> Überfällige Prüfungen
            </h3>
            <div className="list">
              {overdueItems.length > 0 ? (
                overdueItems.map(item => (
                  <Link key={item.id} to={`/item/${item.id}`} className="list-item overdue">
                    <div className="details">
                      <span className="id">{item.id}</span>
                      <span className="owner">{item.owner}</span>
                    </div>
                    <div className="date">{new Date(item.next_inspection).toLocaleDateString('de-DE')}</div>
                    <ArrowRight size={14} className="arrow" />
                  </Link>
                ))
              ) : (
                <p className="empty">Keine überfälligen Prüfungen.</p>
              )}
            </div>
          </div>

          <div className="glass card panel upcoming-panel">
            <h3 className="text-amber-500">
              <AlertTriangle size={18} /> Demnächst zur Prüfung
            </h3>
            <div className="list">
              {upcomingItems.length > 0 ? (
                upcomingItems.map(item => (
                  <Link key={item.id} to={`/item/${item.id}`} className="list-item upcoming">
                    <div className="details">
                      <span className="id">{item.id}</span>
                      <span className="owner">{item.owner}</span>
                    </div>
                    <div className="date">{new Date(item.next_inspection).toLocaleDateString('de-DE')}</div>
                    <ArrowRight size={14} className="arrow" />
                  </Link>
                ))
              ) : (
                <p className="empty">Keine anstehenden Prüfungen.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-container { animation: fadeIn 0.5s ease-out; }
        .title { font-size: 2.5rem; margin-bottom: 0.5rem; font-weight: 900; }
        .subtitle { color: var(--text-muted); margin-bottom: 2rem; }

        .summary-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .stat-card-link { text-decoration: none; color: inherit; transition: 0.2s; }
        .stat-card-link:hover { transform: translateY(-4px); }
        .stat-card { padding: 1.5rem; display: flex; align-items: center; gap: 1.25rem; height: 100%; }
        .stat-icon { padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .stat-value { font-size: 1.5rem; font-weight: 900; }
        .stat-label { color: var(--text-muted); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; }

        .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; align-items: start; }
        .inspection-panels { display: flex; flex-direction: column; gap: 1.5rem; }
        .chart-container { height: 100%; }

        h3 { margin-bottom: 1.5rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); display: flex; align-items: center; gap: 0.5rem; }
        .text-red-500 { color: #f87171 !important; }
        .text-amber-500 { color: var(--accent) !important; }

        .list { display: flex; flex-direction: column; gap: 0.75rem; }
        .list-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 10px;
          border: 1px solid var(--border);
          text-decoration: none;
          color: white;
          transition: 0.2s;
        }
        .list-item:hover { background: rgba(255, 255, 255, 0.08); transform: translateX(5px); }
        .list-item.overdue { border-left: 3px solid #ef4444; }
        .list-item.upcoming { border-left: 3px solid var(--accent); }
        .details { display: flex; flex-direction: column; }
        .details .id { font-weight: 900; font-family: monospace; color: var(--primary); }
        .details .owner { font-size: 0.8rem; color: var(--text-muted); }
        .date { font-weight: 700; font-size: 0.85rem; }
        .arrow { color: var(--text-muted); opacity: 0; transition: 0.2s; }
        .list-item:hover .arrow { opacity: 1; }
        .empty { font-size: 0.85rem; color: var(--text-muted); text-align: center; padding: 1rem; font-style: italic; }

        @media (max-width: 960px) {
          .dashboard-grid { grid-template-columns: 1fr; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

const StatCard = ({ color, icon, label, value }) => (
  <div className="glass stat-card">
    <div className="stat-icon" style={{ color }}>{icon}</div>
    <div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

export default Dashboard;
