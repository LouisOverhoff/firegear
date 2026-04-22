import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  Archive,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Download,
  FileLock2,
  FileText,
  History,
  Save,
  SearchCheck,
  ShieldAlert,
  Tag,
  User,
} from 'lucide-react';
import { useClothing } from '../context/ClothingContext';
import {
  ITEM_TYPES,
  RESPONSE_OPTIONS,
  STATUS_OPTIONS,
  buildInspectionHistoryNote,
  buildInspectionRecordHtml,
  createAnnualInspection,
  createInspectionRecord,
  deriveStatusFromInspection,
  getInspectionProfile,
  getInspectionRecordFilename,
  getInspectionStats,
  getNextInspectionDate,
  getResponseLabel,
  getStatusLabel,
} from '../data/inspectionProfiles';

const buildFormState = item => ({
  ...item,
  annualInspection: createAnnualInspection(item.type, item.annualInspection, item),
  inspectionRecords: item.inspectionRecords || [],
});

const getStatusIcon = status => {
  switch (status) {
    case 'Gut':
      return <CheckCircle2 size={16} color="var(--success)" />;
    case 'Bedarf Reinigung':
      return <Clock3 size={16} color="var(--secondary)" />;
    case 'In Reparatur':
      return <ShieldAlert size={16} color="#f87171" />;
    case 'Zur Pruefung faellig':
      return <AlertTriangle size={16} color="var(--accent)" />;
    default:
      return <Clock3 size={16} color="var(--text-muted)" />;
  }
};

const ItemDetail = () => {
  const { id } = useParams();
  const { archiveItem, getItem, updateItem } = useClothing();
  const item = getItem(id);

  if (!item) {
    return <div className="loading">Lade Akte...</div>;
  }

  return (
    <EditableItemDetail
      key={`${item.id}-${item.inspectionRecords?.length || 0}-${item.history?.length || 0}`}
      id={id}
      item={item}
      archiveItem={archiveItem}
      updateItem={updateItem}
    />
  );
};

const EditableItemDetail = ({ archiveItem, id, item, updateItem }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => buildFormState(item));
  const [activeTab, setActiveTab] = useState('inspection');
  const [selectedRecordId, setSelectedRecordId] = useState(
    () => item.inspectionRecords?.[0]?.recordId || null
  );

  const profile = getInspectionProfile(formData.type);
  const inspection = formData.annualInspection;
  const inspectionRecords = formData.inspectionRecords || [];
  const selectedRecord =
    inspectionRecords.find(record => record.recordId === selectedRecordId) || inspectionRecords[0] || null;
  const selectedRecordProfile = selectedRecord
    ? getInspectionProfile(selectedRecord.itemSnapshot?.type || formData.type)
    : null;
  const stats = getInspectionStats(formData.type, inspection.answers);
  const recommendedStatus = deriveStatusFromInspection(formData.type, inspection.answers);
  const isManualStatusOverride =
    formData.status !== recommendedStatus &&
    !(stats.missing > 0 && formData.status === 'Zur Pruefung faellig');

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTypeChange = nextType => {
    setFormData(prev => {
      const nextInspection = createAnnualInspection(nextType, prev.annualInspection, {
        ...prev,
        type: nextType,
      });

      return {
        ...prev,
        type: nextType,
        annualInspection: nextInspection,
        status: nextInspection.overallResult,
        remarks: nextInspection.notes,
      };
    });
  };

  const handleInspectionDateChange = value => {
    setFormData(prev => ({
      ...prev,
      last_inspection: value,
      next_inspection: value ? getNextInspectionDate(value) : '',
      annualInspection: {
        ...prev.annualInspection,
        inspectionDate: value,
      },
    }));
  };

  const handleInspectionAnswerChange = (questionId, value) => {
    setFormData(prev => {
      const answers = { ...prev.annualInspection.answers, [questionId]: value };
      const nextRecommendedStatus = deriveStatusFromInspection(prev.type, answers);

      return {
        ...prev,
        status: nextRecommendedStatus,
        annualInspection: {
          ...prev.annualInspection,
          answers,
          overallResult: nextRecommendedStatus,
        },
      };
    });
  };

  const handleInspectionMetaChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      annualInspection: {
        ...prev.annualInspection,
        [field]: value,
      },
    }));
  };

  const handleStatusChange = value => {
    setFormData(prev => ({
      ...prev,
      status: value,
      annualInspection: {
        ...prev.annualInspection,
        overallResult: value,
      },
    }));
  };

  const handleRemarksChange = value => {
    setFormData(prev => ({
      ...prev,
      remarks: value,
      annualInspection: {
        ...prev.annualInspection,
        notes: value,
      },
    }));
  };

  const buildPersistedForm = () => {
    const persistedForm = { ...formData };
    delete persistedForm.history;

    const finalInspection = {
      ...persistedForm.annualInspection,
      inspectionDate: persistedForm.last_inspection,
      overallResult: persistedForm.status,
      notes: persistedForm.remarks,
      identification: persistedForm.annualInspection.identification || persistedForm.type,
      serialNumber: persistedForm.annualInspection.serialNumber || persistedForm.id,
    };

    return {
      persistedForm,
      finalInspection,
    };
  };

  const handleSaveDraft = () => {
    const { persistedForm, finalInspection } = buildPersistedForm();

    updateItem(id, {
      ...persistedForm,
      annualInspection: finalInspection,
      historyNote: 'Pruefentwurf aktualisiert',
    });
  };

  const handleArchiveInspection = () => {
    if (stats.missing > 0) {
      window.alert(
        `Die Pruefung kann erst archiviert werden, wenn alle ${stats.total} Punkte beantwortet sind. Aktuell offen: ${stats.missing}.`
      );
      return;
    }

    const { persistedForm, finalInspection } = buildPersistedForm();
    const archivedSnapshot = {
      ...persistedForm,
      annualInspection: finalInspection,
    };
    const inspectionRecord = createInspectionRecord(
      archivedSnapshot,
      finalInspection,
      persistedForm.inspectionRecords
    );

    updateItem(id, {
      ...persistedForm,
      annualInspection: finalInspection,
      inspectionRecord,
      historyNote: `${buildInspectionHistoryNote(persistedForm.type, finalInspection)} Archiv-ID: ${inspectionRecord.recordId}`,
    });

    setSelectedRecordId(inspectionRecord.recordId);
    setActiveTab('archive');
  };

  const handleArchiveItem = () => {
    if (window.confirm('Moechtest du dieses Kleidungsstueck archivieren?')) {
      archiveItem(id);
      navigate('/scanner');
    }
  };

  const handleDownloadRecord = record => {
    const html = buildInspectionRecordHtml(record);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = getInspectionRecordFilename(record);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return (
    <div className="item-detail-container">
      <div className="detail-top-bar">
        <button className="back-btn glass" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Zurueck
        </button>

        <div className="top-actions">
          <button className="archive-btn glass" onClick={handleArchiveItem}>
            <Archive size={18} /> Artikel archivieren
          </button>
          <button className="btn-secondary save-btn" onClick={handleSaveDraft}>
            <Save size={18} /> Entwurf speichern
          </button>
          <button className="btn-primary save-btn" onClick={handleArchiveInspection}>
            <FileLock2 size={18} /> Pruefung archivieren
          </button>
        </div>
      </div>

      <header className="detail-header">
        <div className="title-section">
          <span className="id-tag">AUSRUESTUNGSAKTE</span>
          <h1 className="id-header">{formData.id}</h1>
          <p className="owner">Inhaber / Traeger: <strong>{formData.owner}</strong></p>
        </div>

        <div className="status-panel glass">
          <div className="status-panel-row">
            <span className="panel-label">Aktueller Status</span>
            <span className={`status-badge large ${formData.status.toLowerCase().replace(/ /g, '-')}`}>
              {getStatusLabel(formData.status)}
            </span>
          </div>
          <div className="status-panel-row muted">
            <span>Empfehlung aus Fragebogen</span>
            <strong>{getStatusLabel(recommendedStatus)}</strong>
          </div>
          <div className="status-panel-row muted">
            <span>Archivierte Pruefungen</span>
            <strong>{inspectionRecords.length}</strong>
          </div>
          {isManualStatusOverride && (
            <p className="manual-override-note">
              Status wurde manuell von der aktuellen Fragebogen-Empfehlung abweichend gesetzt.
            </p>
          )}
        </div>
      </header>

      <div className="tabs">
        <button className={activeTab === 'inspection' ? 'active' : ''} onClick={() => setActiveTab('inspection')}>
          Jaehrliche Pruefung
        </button>
        <button className={activeTab === 'archive' ? 'active' : ''} onClick={() => setActiveTab('archive')}>
          Pruefarchiv
        </button>
        <button className={activeTab === 'data' ? 'active' : ''} onClick={() => setActiveTab('data')}>
          Stammdaten
        </button>
        <button className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}>
          Historie
        </button>
      </div>

      {activeTab === 'inspection' && (
        <div className="inspection-layout">
          <aside className="inspection-sidebar">
            <div className="glass card summary-card fire-glow">
              <h3><ClipboardList size={18} /> Pruefstatus</h3>
              <div className="summary-stack">
                <div className="summary-pill ok">
                  <span>Beantwortet</span>
                  <strong>{stats.total - stats.missing} / {stats.total}</strong>
                </div>
                <div className={`summary-pill ${stats.issues > 0 ? 'issue' : 'ok'}`}>
                  <span>Dokumentierte Maengel</span>
                  <strong>{stats.issues}</strong>
                </div>
                <div className={`summary-pill ${stats.missing > 0 ? 'warning' : 'ok'}`}>
                  <span>Offene Punkte</span>
                  <strong>{stats.missing}</strong>
                </div>
              </div>
              <p className="source-note">{profile.source}</p>
              <p className="source-note">
                Archivierung ist nur moeglich, wenn der komplette Fragenkatalog beantwortet ist. Danach bleibt die gespeicherte Pruefung unveraenderbar im Archiv bestehen.
              </p>
            </div>

            <div className="glass card meta-card">
              <h3><Calendar size={18} /> Pruefdaten</h3>

              <div className="form-group">
                <label>Kenn- / Bezeichnung</label>
                <input
                  type="text"
                  value={inspection.identification}
                  onChange={event => handleInspectionMetaChange('identification', event.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Serien- / Inventarnr.</label>
                <input
                  type="text"
                  value={inspection.serialNumber}
                  onChange={event => handleInspectionMetaChange('serialNumber', event.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Geprueft am</label>
                <div className="date-with-action">
                  <input
                    type="date"
                    value={formData.last_inspection}
                    onChange={event => handleInspectionDateChange(event.target.value)}
                  />
                  <button
                    className="btn-secondary mini-btn"
                    type="button"
                    onClick={() => handleInspectionDateChange(new Date().toISOString().split('T')[0])}
                  >
                    HEUTE
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Naechste Pruefung faellig</label>
                <input
                  type="date"
                  value={formData.next_inspection}
                  onChange={event => handleFieldChange('next_inspection', event.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Pruefer / Werkstatt</label>
                <input
                  type="text"
                  value={inspection.inspector}
                  onChange={event => handleInspectionMetaChange('inspector', event.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Unterschrift / Kuerzel</label>
                <input
                  type="text"
                  value={inspection.signature}
                  onChange={event => handleInspectionMetaChange('signature', event.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Status nach Pruefung</label>
                <select value={formData.status} onChange={event => handleStatusChange(event.target.value)}>
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>{getStatusLabel(status)}</option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          <section className="inspection-main">
            <div className="glass card inspection-card">
              <div className="inspection-card-header">
                <div>
                  <span className="section-kicker">{profile.title}</span>
                  <h2>Fragebogen fuer die aktuelle Pruefung</h2>
                </div>
                <div className={`recommendation-badge ${recommendedStatus.toLowerCase().replace(/ /g, '-')}`}>
                  Empfehlung: {getStatusLabel(recommendedStatus)}
                </div>
              </div>

              {stats.missing > 0 && (
                <div className="inspection-alert warning">
                  <AlertTriangle size={18} />
                  <span>{stats.missing} Fragen sind noch nicht beantwortet. Fuer eine archivierte Pruefung muss der komplette Katalog ausgefuellt sein.</span>
                </div>
              )}

              {stats.issues > 0 && (
                <div className="inspection-alert danger">
                  <ShieldAlert size={18} />
                  <span>{stats.issues} Maengel sind dokumentiert. Bitte Status und Massnahme pruefen, bevor die Pruefung archiviert wird.</span>
                </div>
              )}

              <QuestionnaireEditor
                profile={profile}
                answers={inspection.answers}
                onAnswerChange={handleInspectionAnswerChange}
              />
            </div>

            <div className="glass card notes-card">
              <h3><FileText size={18} /> Notizen / Massnahmen</h3>
              <textarea
                rows="8"
                className="remarks-textarea"
                value={formData.remarks}
                onChange={event => handleRemarksChange(event.target.value)}
                placeholder="Zusaetzliche Feststellungen, Reinigungsbedarf, Reparaturhinweise..."
              />
            </div>
          </section>
        </div>
      )}

      {activeTab === 'archive' && (
        <div className="inspection-layout archive-layout">
          <aside className="inspection-sidebar archive-sidebar">
            <div className="glass card summary-card">
              <h3><History size={18} /> Pruefarchiv</h3>
              <p className="source-note">
                Jede archivierte Pruefung ist ein eigener, gesperrter Datensatz mit kompletter Fragenliste, Zeitstempel und Pruefsiegel.
              </p>
            </div>

            <div className="archive-list">
              {inspectionRecords.length > 0 ? (
                inspectionRecords.map(record => (
                  <button
                    key={record.recordId}
                    className={`glass archive-record-card ${selectedRecord?.recordId === record.recordId ? 'active' : ''}`}
                    onClick={() => setSelectedRecordId(record.recordId)}
                  >
                    <div className="archive-record-top">
                      <span className="archive-record-date">
                        {new Date(record.createdAt).toLocaleString('de-DE')}
                      </span>
                      <span className={`status-badge ${record.itemSnapshot.status.toLowerCase().replace(/ /g, '-')}`}>
                        {getStatusLabel(record.itemSnapshot.status)}
                      </span>
                    </div>
                    <div className="archive-record-body">
                      <strong>{record.recordId}</strong>
                      <span>Pruefer: {record.inspection.inspector || '-'}</span>
                      <span>Maengel: {record.stats.issues}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="glass card empty-archive">
                  Noch keine archivierte Pruefung vorhanden.
                </div>
              )}
            </div>
          </aside>

          <section className="inspection-main">
            {selectedRecord ? (
              <div className="glass card inspection-card archive-detail-card">
                <div className="inspection-card-header">
                  <div>
                    <span className="section-kicker">{selectedRecordProfile?.title}</span>
                    <h2>Archivierte Pruefung ansehen</h2>
                  </div>
                  <div className="archive-actions">
                    <button className="btn-secondary archive-download" onClick={() => handleDownloadRecord(selectedRecord)}>
                      <Download size={16} /> Herunterladen
                    </button>
                  </div>
                </div>

                <div className="archive-meta-grid">
                  <div className="meta-box">
                    <span className="label">Pruef-ID</span>
                    <strong>{selectedRecord.recordId}</strong>
                  </div>
                  <div className="meta-box">
                    <span className="label">Archiviert am</span>
                    <strong>{new Date(selectedRecord.createdAt).toLocaleString('de-DE')}</strong>
                  </div>
                  <div className="meta-box">
                    <span className="label">Pruefsiegel</span>
                    <strong className="mono">{selectedRecord.recordHash}</strong>
                  </div>
                  <div className="meta-box">
                    <span className="label">Vorheriges Siegel</span>
                    <strong className="mono">{selectedRecord.previousHash || '-'}</strong>
                  </div>
                </div>

                <div className="archive-meta-grid">
                  <div className="meta-box">
                    <span className="label">Geprueft am</span>
                    <strong>{selectedRecord.inspection.inspectionDate || '-'}</strong>
                  </div>
                  <div className="meta-box">
                    <span className="label">Pruefer</span>
                    <strong>{selectedRecord.inspection.inspector || '-'}</strong>
                  </div>
                  <div className="meta-box">
                    <span className="label">Status</span>
                    <strong>{getStatusLabel(selectedRecord.itemSnapshot.status)}</strong>
                  </div>
                  <div className="meta-box">
                    <span className="label">Akte</span>
                    <strong>{selectedRecord.itemSnapshot.id}</strong>
                  </div>
                </div>

                <div className="inspection-alert locked">
                  <FileLock2 size={18} />
                  <span>Diese Pruefung ist archiviert und in der Anwendung nicht mehr bearbeitbar. Download und Einsicht bleiben erhalten.</span>
                </div>

                <QuestionnaireReadOnly
                  profile={selectedRecordProfile}
                  answers={selectedRecord.inspection.answers}
                />

                <div className="glass archive-notes">
                  <h3><FileText size={18} /> Notizen / Massnahmen</h3>
                  <p>{selectedRecord.inspection.notes || 'Keine Notizen hinterlegt.'}</p>
                </div>
              </div>
            ) : (
              <div className="glass card empty-archive">
                Waehle links eine archivierte Pruefung aus.
              </div>
            )}
          </section>
        </div>
      )}

      {activeTab === 'data' && (
        <div className="detail-grid">
          <div className="glass card info-section">
            <h3>Basis-Informationen</h3>
            <div className="form-grid">
              <div className="form-group">
                <label><User size={16} /> Aktueller Traeger</label>
                <input
                  type="text"
                  value={formData.owner}
                  onChange={event => handleFieldChange('owner', event.target.value)}
                />
              </div>

              <div className="form-group">
                <label><Tag size={16} /> Ausruestungsart</label>
                <select value={formData.type} onChange={event => handleTypeChange(event.target.value)}>
                  {ITEM_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Barcode / ID</label>
                <input type="text" value={formData.id} readOnly />
              </div>

              <div className="form-group">
                <label>Letzte Pruefung</label>
                <input type="date" value={formData.last_inspection} readOnly />
              </div>
            </div>

            <div className="form-group">
              <label>Zusammenfassung</label>
              <textarea
                rows="5"
                value={formData.remarks}
                onChange={event => handleRemarksChange(event.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="history-section glass card">
          <h3>Chronik der Aenderungen</h3>
          <div className="timeline">
            {(formData.history || []).map((entry, index) => (
              <div key={`${entry.timestamp}-${index}`} className="timeline-item">
                <div className="timeline-marker">{getStatusIcon(entry.status)}</div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <span className="timeline-status badge">{getStatusLabel(entry.status)}</span>
                    <span className="timeline-date">
                      {new Date(entry.timestamp).toLocaleString('de-DE')}
                    </span>
                  </div>
                  <p className="timeline-remark">{entry.remarks || 'Keine Bemerkungen.'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .item-detail-container { animation: slideUp 0.3s ease-out; }
        .detail-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          gap: 1rem;
        }
        .top-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .back-btn,
        .archive-btn,
        .save-btn,
        .archive-download {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.7rem 1.2rem;
          border-radius: 12px;
          transition: 0.2s;
          border: 1px solid var(--border);
        }
        .back-btn:hover { background: var(--surface); color: white; }
        .archive-btn { color: var(--text-muted); }
        .archive-btn:hover { background: rgba(255, 255, 255, 0.05); color: var(--accent); border-color: var(--accent); }
        .save-btn { border: none; }

        .detail-header {
          display: grid;
          grid-template-columns: 1fr minmax(320px, 380px);
          gap: 1.5rem;
          align-items: end;
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--border);
        }
        .id-tag {
          font-family: monospace;
          background: var(--surface-lighter);
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
          display: inline-block;
        }
        .id-header {
          font-size: clamp(2.5rem, 5vw, 4rem);
          line-height: 1;
          margin-bottom: 0.5rem;
          font-weight: 900;
          font-family: monospace;
          color: var(--primary);
          letter-spacing: -2px;
        }
        .owner { font-size: 1.1rem; color: var(--text-muted); }
        .owner strong { color: var(--text); }
        .status-panel {
          padding: 1.25rem;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .status-panel-row {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: center;
        }
        .status-panel-row.muted { color: var(--text-muted); font-size: 0.9rem; }
        .panel-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--text-muted);
        }
        .manual-override-note {
          margin: 0;
          color: var(--accent);
          font-size: 0.8rem;
          line-height: 1.5;
        }

        .status-badge {
          padding: 0.35rem 0.8rem;
          border-radius: 999px;
          font-weight: 800;
          text-transform: uppercase;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
        }
        .status-badge.large { font-size: 0.78rem; }
        .status-badge.gut,
        .recommendation-badge.gut { background: rgba(16, 185, 129, 0.12); color: var(--success); }
        .status-badge.bedarf-reinigung,
        .recommendation-badge.bedarf-reinigung { background: rgba(69, 123, 157, 0.14); color: var(--secondary); }
        .status-badge.in-reparatur,
        .recommendation-badge.in-reparatur { background: rgba(248, 113, 113, 0.12); color: #f87171; }
        .status-badge.zur-pruefung-faellig,
        .recommendation-badge.zur-pruefung-faellig { background: rgba(251, 191, 36, 0.14); color: var(--accent); }
        .status-badge.stillgelegt,
        .recommendation-badge.stillgelegt { background: rgba(148, 163, 184, 0.16); color: var(--text-muted); }

        .tabs { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
        .tabs button {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 1rem;
          padding: 0.65rem 1.1rem;
          border-bottom: 2px solid transparent;
        }
        .tabs button.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
          font-weight: 700;
        }

        .inspection-layout {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 1.5rem;
          align-items: start;
        }
        .inspection-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          position: sticky;
          top: 6rem;
        }
        .archive-layout .inspection-sidebar { position: static; }
        .summary-card,
        .meta-card,
        .inspection-card,
        .notes-card,
        .info-section,
        .history-section,
        .archive-notes {
          border: 1px solid var(--border);
        }
        .summary-stack { display: grid; gap: 0.75rem; margin-bottom: 1rem; }
        .summary-pill {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.85rem 1rem;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.03);
        }
        .summary-pill strong { font-size: 1rem; }
        .summary-pill.ok { border: 1px solid rgba(16, 185, 129, 0.18); }
        .summary-pill.issue { border: 1px solid rgba(248, 113, 113, 0.22); color: #fca5a5; }
        .summary-pill.warning { border: 1px solid rgba(251, 191, 36, 0.22); color: #fde68a; }
        .source-note { margin: 0 0 0.85rem; color: var(--text-muted); font-size: 0.82rem; line-height: 1.5; }
        .archive-list { display: grid; gap: 0.75rem; }
        .archive-record-card {
          width: 100%;
          text-align: left;
          padding: 1rem;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.03);
        }
        .archive-record-card:hover,
        .archive-record-card.active {
          border-color: var(--primary);
          background: rgba(230, 57, 70, 0.08);
        }
        .archive-record-top {
          display: flex;
          justify-content: space-between;
          gap: 0.75rem;
          align-items: start;
          margin-bottom: 0.75rem;
        }
        .archive-record-date { font-size: 0.85rem; color: var(--text-muted); }
        .archive-record-body {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          color: var(--text-muted);
          font-size: 0.85rem;
        }
        .archive-record-body strong { color: var(--text); font-size: 0.9rem; }
        .empty-archive {
          padding: 2rem;
          text-align: center;
          color: var(--text-muted);
        }

        h3 {
          margin-bottom: 1.25rem;
          font-size: 0.9rem;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border);
          padding-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
        .form-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 700;
          text-transform: uppercase;
        }
        .date-with-action { display: flex; gap: 0.5rem; }
        .mini-btn {
          padding: 0.75rem 0.9rem;
          min-width: max-content;
          font-size: 0.75rem;
        }
        .inspection-card-header {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: start;
          margin-bottom: 1.5rem;
        }
        .inspection-card-header h2 { font-size: 1.65rem; margin: 0.35rem 0 0; }
        .section-kicker {
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.72rem;
          font-weight: 700;
        }
        .recommendation-badge {
          padding: 0.7rem 1rem;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 800;
          white-space: nowrap;
        }
        .inspection-alert {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-radius: 12px;
          padding: 0.9rem 1rem;
          margin-bottom: 1rem;
        }
        .inspection-alert.warning { background: rgba(251, 191, 36, 0.08); color: #fde68a; }
        .inspection-alert.danger { background: rgba(248, 113, 113, 0.08); color: #fca5a5; }
        .inspection-alert.locked {
          background: rgba(148, 163, 184, 0.08);
          color: #cbd5e1;
        }
        .inspection-sections { display: grid; gap: 1.25rem; }
        .question-section {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.1rem;
        }
        .question-section-header {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: center;
          margin-bottom: 1rem;
        }
        .question-section-header h3 {
          margin: 0;
          padding: 0;
          border: 0;
          color: var(--text);
          font-size: 1rem;
          letter-spacing: 0;
          text-transform: none;
        }
        .question-section-header span { color: var(--text-muted); font-size: 0.85rem; }
        .question-list { display: grid; gap: 0.75rem; }
        .question-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 240px;
          gap: 1rem;
          align-items: center;
          padding: 0.85rem 1rem;
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.55);
        }
        .question-row.ok { border: 1px solid rgba(16, 185, 129, 0.18); }
        .question-row.issue { border: 1px solid rgba(248, 113, 113, 0.22); }
        .question-row.na { border: 1px solid rgba(148, 163, 184, 0.2); }
        .question-row.empty { border: 1px solid rgba(251, 191, 36, 0.18); }
        .question-label { line-height: 1.45; font-weight: 500; }
        .answer-select.ok { border-color: rgba(16, 185, 129, 0.4); color: var(--success); }
        .answer-select.issue { border-color: rgba(248, 113, 113, 0.4); color: #fca5a5; }
        .answer-select.na { border-color: rgba(148, 163, 184, 0.4); color: var(--text-muted); }
        .answer-select.empty { border-color: rgba(251, 191, 36, 0.4); }
        .answer-display {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.8rem 1rem;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          font-weight: 700;
        }
        .answer-display.ok { color: var(--success); border-color: rgba(16, 185, 129, 0.24); }
        .answer-display.issue { color: #fca5a5; border-color: rgba(248, 113, 113, 0.24); }
        .answer-display.na { color: var(--text-muted); border-color: rgba(148, 163, 184, 0.24); }
        .answer-display.empty { color: var(--accent); border-color: rgba(251, 191, 36, 0.24); }
        .remarks-textarea {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.25rem;
          color: var(--text);
          font-size: 1rem;
          line-height: 1.6;
          resize: vertical;
          min-height: 220px;
          width: 100%;
        }
        .archive-detail-card { display: grid; gap: 1.25rem; }
        .archive-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .archive-meta-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.75rem;
        }
        .meta-box {
          padding: 0.9rem 1rem;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .meta-box .label {
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .mono { font-family: monospace; font-size: 0.85rem; }
        .archive-notes { padding: 1.25rem; }
        .archive-notes p {
          margin: 0;
          white-space: pre-wrap;
          line-height: 1.6;
          color: var(--text);
        }
        .detail-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
        .form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }

        .timeline { position: relative; padding-left: 2rem; margin-top: 1.5rem; }
        .timeline::before {
          content: '';
          position: absolute;
          left: 7px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--border);
        }
        .timeline-item { position: relative; margin-bottom: 2rem; }
        .timeline-marker {
          position: absolute;
          left: -2rem;
          width: 16px;
          height: 16px;
          background: var(--background);
          border-radius: 50%;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .timeline-content {
          background: rgba(255, 255, 255, 0.03);
          padding: 1rem;
          border-radius: 10px;
          border: 1px solid var(--border);
          margin-left: 1rem;
        }
        .timeline-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          gap: 1rem;
        }
        .timeline-status { font-weight: 700; font-size: 0.8rem; }
        .timeline-date { color: var(--text-muted); font-size: 0.75rem; }
        .timeline-remark { color: var(--text); font-size: 0.9rem; }

        @media (max-width: 1200px) {
          .archive-meta-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        @media (max-width: 1100px) {
          .inspection-layout { grid-template-columns: 1fr; }
          .inspection-sidebar { position: static; }
          .detail-header { grid-template-columns: 1fr; }
        }

        @media (max-width: 760px) {
          .detail-top-bar { flex-direction: column; align-items: stretch; }
          .top-actions { width: 100%; }
          .top-actions > * { flex: 1; }
          .question-row { grid-template-columns: 1fr; }
          .form-grid { grid-template-columns: 1fr; }
          .inspection-card-header { flex-direction: column; }
          .date-with-action { flex-direction: column; }
          .timeline-header { flex-direction: column; align-items: start; }
          .archive-meta-grid { grid-template-columns: 1fr; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

const QuestionnaireEditor = ({ answers, onAnswerChange, profile }) => (
  <div className="inspection-sections">
    {profile.sections.map(section => (
      <div key={section.id} className="question-section">
        <div className="question-section-header">
          <h3>{section.title}</h3>
          <span>{section.questions.length} Punkte</span>
        </div>

        <div className="question-list">
          {section.questions.map(question => {
            const answer = answers[question.id] ?? '';
            return (
              <div key={question.id} className={`question-row ${answer || 'empty'}`}>
                <label className="question-label" htmlFor={question.id}>
                  {question.label}
                </label>
                <select
                  id={question.id}
                  value={answer}
                  className={`answer-select ${answer || 'empty'}`}
                  onChange={event => onAnswerChange(question.id, event.target.value)}
                >
                  {RESPONSE_OPTIONS.map(option => (
                    <option key={option.value || 'empty'} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      </div>
    ))}
  </div>
);

const QuestionnaireReadOnly = ({ answers, profile }) => (
  <div className="inspection-sections">
    {profile.sections.map(section => (
      <div key={section.id} className="question-section">
        <div className="question-section-header">
          <h3>{section.title}</h3>
          <span>{section.questions.length} Punkte</span>
        </div>

        <div className="question-list">
          {section.questions.map(question => {
            const answer = answers[question.id] ?? '';
            return (
              <div key={question.id} className={`question-row ${answer || 'empty'}`}>
                <div className="question-label">{question.label}</div>
                <div className={`answer-display ${answer || 'empty'}`}>
                  {getResponseLabel(answer)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ))}
  </div>
);

export default ItemDetail;
