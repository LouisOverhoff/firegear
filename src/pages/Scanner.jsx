import React, { useEffect, useEffectEvent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { AlertCircle, Camera, Plus, Search, X } from 'lucide-react';
import { useClothing } from '../context/ClothingContext';
import { ITEM_TYPES } from '../data/inspectionProfiles';

const createDraftItem = id => ({
  id,
  owner: '',
  status: 'Zur Pruefung faellig',
  type: 'Jacke',
  last_inspection: '',
  next_inspection: '',
  remarks: '',
});

const Scanner = () => {
  const navigate = useNavigate();
  const { addItem, getItem } = useClothing();
  const [manualId, setManualId] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [scannedId, setScannedId] = useState('');
  const [newItem, setNewItem] = useState(createDraftItem(''));
  const inputRef = useRef(null);

  const handleScan = id => {
    const item = getItem(id);

    if (item) {
      navigate(`/item/${id}`);
      return;
    }

    setScannedId(id);
    setNewItem(createDraftItem(id));
    setShowAddModal(true);
  };

  const handleScannerResult = useEffectEvent(decodedText => {
    handleScan(decodedText);
  });

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    const scanner = new Html5QrcodeScanner('reader', {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1,
    });

    scanner.render(
      decodedText => {
        handleScannerResult(decodedText);
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(error => console.log('Scanner clear error', error));
    };
  }, []);

  const handleManualSearch = event => {
    event.preventDefault();

    if (manualId) {
      handleScan(manualId);
    }
  };

  const handleCreate = event => {
    event.preventDefault();
    addItem(newItem);
    setShowAddModal(false);
    navigate(`/item/${newItem.id}`);
  };

  return (
    <div className="scanner-container">
      <div className="scanner-header">
        <h1>Material-Scanner</h1>
        <p>Scanne den Barcode an der Ausrüstung. Neue IDs werden automatisch zur Erfassung gemeldet.</p>
      </div>

      <div className="scanner-grid">
        <div className="glass card camera-card fire-glow">
          <div className="camera-header">
            <Camera size={20} color="var(--primary)" />
            <span>Kamera Live-Feed</span>
          </div>
          <div id="reader" className="reader-box"></div>
        </div>

        <div className="glass card search-card">
          <h3>Schnellsuche / ID-Erfassung</h3>
          <form className="manual-form" onSubmit={handleManualSearch}>
            <div className="input-group">
              <Search size={20} color="var(--text-muted)" />
              <input
                ref={inputRef}
                type="text"
                placeholder="ID manuell eingeben..."
                value={manualId}
                onChange={event => setManualId(event.target.value)}
              />
            </div>
            <button className="btn-primary" type="submit">Suchen / Erfassen</button>
          </form>

          <div className="test-ids glass">
            <h4>Vorhandene Test-IDs:</h4>
            <code>123456789</code>, <code>987654321</code>
            <p className="mt-2 text-xs">Eine neue ID öffnet direkt die Erfassung.</p>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content glass card fire-glow">
            <div className="modal-header">
              <div className="flex items-center gap-3">
                <Plus className="text-primary" />
                <h2>Neue Ausrüstung erfassen</h2>
              </div>
              <button className="close-btn" onClick={() => setShowAddModal(false)}><X /></button>
            </div>

            <div className="alert-new glass mb-4">
              <AlertCircle size={18} />
              <span>ID <strong>{scannedId}</strong> ist noch nicht im System.</span>
            </div>

            <form onSubmit={handleCreate} className="add-form">
              <div className="form-group">
                <label>Barcode / ID</label>
                <input required type="text" readOnly value={newItem.id} className="read-only-input" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Inhaber / Träger</label>
                  <input
                    required
                    type="text"
                    placeholder="Name..."
                    value={newItem.owner}
                    onChange={event => setNewItem({ ...newItem, owner: event.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Ausrüstungsart</label>
                  <select
                    value={newItem.type}
                    onChange={event => setNewItem({ ...newItem, type: event.target.value })}
                  >
                    {ITEM_TYPES.map(type => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Erste Bemerkung</label>
                <textarea
                  rows="3"
                  placeholder="Zustand bei Erfassung..."
                  value={newItem.remarks}
                  onChange={event => setNewItem({ ...newItem, remarks: event.target.value })}
                />
              </div>

              <p className="text-xs">
                Die jährliche Prüfung wird anschließend über den PDF-Fragebogen in der Akte dokumentiert.
              </p>

              <button type="submit" className="btn-primary w-full mt-2">Ausrüstung anlegen</button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .scanner-container { animation: fadeIn 0.4s ease-out; }
        .scanner-header { margin-bottom: 2.5rem; text-align: center; }
        .scanner-header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; font-weight: 900; }
        .scanner-header p { color: var(--text-muted); }

        .scanner-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 2rem; }
        .camera-card { padding: 0.5rem; overflow: hidden; border: 1px solid rgba(230, 57, 70, 0.3); }
        .camera-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          border-bottom: 1px solid var(--border);
          margin-bottom: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.8rem;
        }
        .reader-box { width: 100%; min-height: 400px; border-radius: 8px; overflow: hidden; background: #000; }

        #reader { border: none !important; }
        #reader__dashboard_section_csr button {
          background: var(--primary);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
        }

        .search-card { display: flex; flex-direction: column; gap: 1.5rem; padding: 2rem; }
        .manual-form { display: flex; flex-direction: column; gap: 1rem; }
        .input-group {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--border);
          padding: 1rem;
          border-radius: 12px;
        }
        .input-group input {
          background: transparent;
          border: none;
          font-size: 1.1rem;
          flex-grow: 1;
          outline: none;
          padding: 0;
          color: white;
        }

        .test-ids {
          padding: 1.5rem;
          border-radius: 12px;
          font-size: 0.85rem;
          color: var(--text-muted);
          border: 1px dashed var(--border);
          background: rgba(255, 255, 255, 0.02);
        }
        .mt-2 { margin-top: 0.5rem; }
        .text-xs { font-size: 0.75rem; color: var(--text-muted); }
        code {
          background: var(--surface-lighter);
          color: var(--primary);
          padding: 0.15rem 0.35rem;
          border-radius: 4px;
          font-family: monospace;
          font-weight: bold;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
          backdrop-filter: blur(8px);
        }
        .modal-content {
          width: 100%;
          max-width: 550px;
          padding: 2.5rem;
          animation: modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .modal-header h2 { font-size: 1.5rem; font-weight: 900; }
        .alert-new {
          background: rgba(230, 57, 70, 0.1);
          color: var(--primary);
          padding: 0.75rem 1rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.9rem;
          border: 1px solid rgba(230, 57, 70, 0.2);
        }
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
        .form-group input,
        .form-group select,
        .form-group textarea {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border);
          padding: 0.85rem;
          border-radius: 10px;
          color: white;
          width: 100%;
          outline: none;
          font-size: 1rem;
        }
        .read-only-input {
          background: rgba(255, 255, 255, 0.05) !important;
          color: var(--primary) !important;
          font-weight: 800;
          font-family: monospace;
          letter-spacing: 2px;
        }
        .w-full { width: 100%; }

        @media (max-width: 960px) {
          .scanner-grid { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Scanner;
