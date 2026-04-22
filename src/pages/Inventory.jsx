import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, Plus, RefreshCw, Search, Trash2, X, ArrowRight } from 'lucide-react';
import { useClothing } from '../context/ClothingContext';
import { ITEM_TYPES, getStatusLabel } from '../data/inspectionProfiles';

const createDraftItem = () => ({
  id: '',
  owner: '',
  status: 'Zur Pruefung faellig',
  type: 'Jacke',
  last_inspection: '',
  next_inspection: '',
  remarks: '',
});

const Inventory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || 'Alle';
  const { addItem, deleteItem, items, restoreItem } = useClothing();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [view, setView] = useState('active');
  const [newItem, setNewItem] = useState(createDraftItem());

  const activeItems = items.filter(item => (view === 'active' ? !item.archived : item.archived));

  const filteredItems = activeItems.filter(item => {
    const today = new Date();
    const matchesSearch =
      item.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.includes(searchTerm);

    let matchesStatus = statusFilter === 'Alle' || item.status === statusFilter;
    if (statusFilter === 'overdue') {
      matchesStatus = item.next_inspection ? new Date(item.next_inspection) < today : false;
    }
    if (statusFilter === 'upcoming') {
      if (!item.next_inspection) {
        matchesStatus = false;
      } else {
        const nextDate = new Date(item.next_inspection);
        const diffDays = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
        matchesStatus = diffDays >= 0 && diffDays <= 30;
      }
    }

    return matchesSearch && matchesStatus;
  });

  const statuses = [
    { label: 'Alle', value: 'Alle' },
    { label: 'Gut', value: 'Gut' },
    { label: 'Bedarf Reinigung', value: 'Bedarf Reinigung' },
    { label: 'In Reparatur', value: 'In Reparatur' },
    { label: 'Prüfung fällig', value: 'Zur Pruefung faellig' },
    { label: 'ÜBERFÄLLIG', value: 'overdue' },
    { label: 'DEMNÄCHST', value: 'upcoming' },
    { label: 'Stillgelegt', value: 'Stillgelegt' },
  ];

  const handleCreate = event => {
    event.preventDefault();
    if (!newItem.id) {
      alert('Bitte ID ausfüllen');
      return;
    }

    addItem(newItem);
    setShowAddModal(false);
    setNewItem(createDraftItem());
  };

  const handlePermanentDelete = id => {
    if (window.confirm('Möchtest du dieses Kleidungsstück wirklich unwiderruflich löschen?')) {
      deleteItem(id);
    }
  };

  const handleStatusFilterChange = value => {
    const nextParams = new URLSearchParams(searchParams);

    if (value === 'Alle') {
      nextParams.delete('status');
    } else {
      nextParams.set('status', value);
    }

    setSearchParams(nextParams);
  };

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <div className="header-copy">
          <h1>{view === 'active' ? 'Materialbestand' : 'Archiv'}</h1>
          <p className="text-muted text-sm">
            {view === 'active'
              ? 'Aktive Ausrüstung im Einsatz'
              : 'Ausgemusterte oder archivierte Ausrüstung'}
          </p>
        </div>

        <div className="actions">
          <div className="view-toggle glass">
            <button className={view === 'active' ? 'active' : ''} onClick={() => setView('active')}>
              Aktiv
            </button>
            <button className={view === 'archived' ? 'active' : ''} onClick={() => setView('archived')}>
              Archiv
            </button>
          </div>

          {view === 'active' && (
            <button className="btn-primary flex items-center gap-2" onClick={() => setShowAddModal(true)}>
              <Plus size={18} /> Neu hinzufügen
            </button>
          )}

          <div className="search-bar glass">
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Inhaber/ID suchen..."
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="filter-group glass">
            <Filter size={18} color="var(--text-muted)" />
            <select value={statusFilter} onChange={event => handleStatusFilterChange(event.target.value)}>
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="inventory-grid">
        {filteredItems.map(item => (
          <div key={item.id} className="item-card glass card">
            <div className="card-top">
              <span className={`status-badge ${item.status.toLowerCase().replace(/ /g, '-')}`}>
                {getStatusLabel(item.status)}
              </span>
              <span className="type-badge">{item.type}</span>
            </div>

            <div className="card-body">
              <h3 className="item-id-title">ID: {item.id}</h3>
              <p className="owner">{item.owner}</p>
            </div>

            {view === 'active' ? (
              <Link to={`/item/${item.id}`} className="view-detail-btn glass">
                Akte öffnen <ArrowRight size={16} />
              </Link>
            ) : (
              <div className="archive-actions">
                <button className="btn-restore glass" onClick={() => restoreItem(item.id)}>
                  <RefreshCw size={16} /> Wiederherstellen
                </button>
                <button className="btn-delete-perm glass" onClick={() => handlePermanentDelete(item.id)}>
                  <Trash2 size={16} /> Endgültig löschen
                </button>
              </div>
            )}
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="empty-state glass">
            <p>Keine Einträge {view === 'archived' ? 'im Archiv' : 'gefunden'}.</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content glass card fire-glow">
            <div className="modal-header">
              <h2>Ausrüstung hinzufügen</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}><X /></button>
            </div>

            <form onSubmit={handleCreate} className="add-form">
              <div className="form-group">
                <label>Barcode / ID</label>
                <input
                  required
                  type="text"
                  value={newItem.id}
                  onChange={event => setNewItem({ ...newItem, id: event.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Inhaber / Träger</label>
                  <input
                    required
                    type="text"
                    value={newItem.owner}
                    onChange={event => setNewItem({ ...newItem, owner: event.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Typ</label>
                  <select
                    value={newItem.type}
                    onChange={event => setNewItem({ ...newItem, type: event.target.value })}
                  >
                    {ITEM_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Bemerkung</label>
                <textarea
                  rows="3"
                  value={newItem.remarks}
                  onChange={event => setNewItem({ ...newItem, remarks: event.target.value })}
                />
              </div>

              <p className="form-hint">
                Die neue Akte startet mit Status "Zur Prüfung fällig". Die eigentliche Jahresprüfung folgt über den hinterlegten PDF-Fragebogen.
              </p>

              <button type="submit" className="btn-primary w-full mt-4">Hinzufügen</button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .inventory-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1.5rem;
        }
        .actions { display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; }
        .view-toggle { display: flex; padding: 0.25rem; background: rgba(0, 0, 0, 0.3); border-radius: 10px; }
        .view-toggle button {
          background: none;
          border: none;
          padding: 0.5rem 1rem;
          color: var(--text-muted);
          font-size: 0.9rem;
          border-radius: 8px;
          cursor: pointer;
        }
        .view-toggle button.active { background: var(--surface); color: white; }
        .search-bar,
        .filter-group {
          display: flex;
          align-items: center;
          padding: 0.5rem 1rem;
          gap: 0.75rem;
          border-radius: 12px;
        }
        .search-bar input { background: transparent; border: none; padding: 0; color: white; outline: none; width: 150px; }
        .filter-group select { background: transparent; border: none; color: white; outline: none; cursor: pointer; }
        .filter-group select option { background: var(--surface-dark, #111); color: white; }
        .inventory-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
        .item-card { border: 1px solid var(--border); transition: 0.2s; }
        .item-card:hover { transform: translateY(-4px); background: rgba(255, 255, 255, 0.04); }
        .card-top { display: flex; justify-content: space-between; gap: 0.75rem; margin-bottom: 1rem; align-items: center; }
        .card-body { margin-bottom: 1.25rem; }
        .item-id-title { font-weight: 900; color: var(--primary); }
        .owner { color: var(--text-muted); }
        .type-badge {
          padding: 0.25rem 0.65rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 700;
        }
        .status-badge { padding: 0.25rem 0.5rem; border-radius: 20px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; }
        .status-badge.gut { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .status-badge.bedarf-reinigung { background: rgba(69, 123, 157, 0.1); color: var(--secondary); }
        .status-badge.in-reparatur { background: rgba(248, 113, 113, 0.1); color: #f87171; }
        .status-badge.zur-pruefung-faellig { background: rgba(251, 191, 36, 0.1); color: var(--accent); }
        .status-badge.stillgelegt { background: rgba(148, 163, 184, 0.15); color: var(--text-muted); }
        .view-detail-btn {
          background: rgba(255, 255, 255, 0.03);
          padding: 0.75rem;
          border-radius: 8px;
          text-decoration: none;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
        }
        .view-detail-btn:hover { background: var(--primary); }
        .archive-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
        .btn-restore,
        .btn-delete-perm {
          background: rgba(255, 255, 255, 0.03);
          padding: 0.5rem;
          border-radius: 8px;
          color: var(--text-muted);
          border: 1px solid var(--border);
          cursor: pointer;
          font-size: 0.75rem;
        }
        .btn-restore:hover { color: var(--success); border-color: var(--success); }
        .btn-delete-perm:hover { color: #f87171; border-color: #f87171; }
        .empty-state {
          padding: 2rem;
          text-align: center;
          color: var(--text-muted);
          border: 1px dashed var(--border);
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }
        .modal-content { width: 100%; max-width: 600px; padding: 2rem; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .add-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-group label {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
          display: block;
        }
        .form-hint { color: var(--text-muted); font-size: 0.8rem; line-height: 1.5; }
        .w-full { width: 100%; }
        .mt-4 { margin-top: 0.5rem; }
        .text-muted { color: var(--text-muted); }
        .text-sm { font-size: 0.9rem; }

        @media (max-width: 960px) {
          .form-row { grid-template-columns: 1fr; }
          .actions { width: 100%; }
          .search-bar input { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Inventory;
