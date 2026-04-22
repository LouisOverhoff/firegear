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
  FileText,
  Save,
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
  createAnnualInspection,
  deriveStatusFromInspection,
  getInspectionProfile,
  getInspectionStats,
  getNextInspectionDate,
  getStatusLabel,
} from '../data/inspectionProfiles';

const buildFormState = item => ({
  ...item,
  annualInspection: createAnnualInspection(item.type, item.annualInspection, item),
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
      key={item.id}
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

  const profile = getInspectionProfile(formData.type);
  const inspection = formData.annualInspection;
  const stats = getInspectionStats(formData.type, inspection.answers);
  const recommendedStatus = deriveStatusFromInspection(formData.type, inspection.answers);
  const isManualStatusOverride =
    formData.status !== recommendedStatus && !(stats.missing > 0 && formData.status === 'Zur Pruefung faellig');

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

  const handleSave = () => {
    if (
      stats.missing > 0 &&
      !window.confirm(
        `Der Fragebogen ist noch unvollständig (${stats.missing} offene Punkte). Trotzdem speichern?`
      )
    ) {
      return;
    }

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

    updateItem(id, {
      ...persistedForm,
      annualInspection: finalInspection,
      historyNote: buildInspectionHistoryNote(persistedForm.type, finalInspection),
    });

    navigate('/scanner');
  };

  const handleArchive = () => {
    if (window.confirm('Möchtest du dieses Kleidungsstück archivieren?')) {
      archiveItem(id);
      navigate('/scanner');
    }
  };

  return (
    <div className="item-detail-container">
      <div className="detail-top-bar">
        <button className="back-btn glass" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Zurück
        </button>

        <div className="top-actions">
          <button className="archive-btn glass" onClick={handleArchive}>
            <Archive size={18} /> Archivieren
          </button>
          <button className="btn-primary save-btn" onClick={handleSave}>
            <Save size={18} /> Speichern
          </button>
        </div>
      </div>

      <header className="detail-header">
        <div className="title-section">
          <span className="id-tag">AUSRÜSTUNGSAKTE</span>
          <h1 className="id-header">{formData.id}</h1>
          <p className="owner">Inhaber / Träger: <strong>{formData.owner}</strong></p>
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
          {isManualStatusOverride && (
            <p className="manual-override-note">Status wurde manuell von der Empfehlung abweichend gesetzt.</p>
          )}
        </div>
      </header>

      <div className="tabs">
        <button className={activeTab === 'inspection' ? 'active' : ''} onClick={() => setActiveTab('inspection')}>
          Jährliche Prüfung
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
              <h3><ClipboardList size={18} /> Prüfstatus</h3>
              <div className="summary-stack">
                <div className="summary-pill ok">
                  <span>Beantwortet</span>
                  <strong>{stats.total - stats.missing} / {stats.total}</strong>
                </div>
                <div className={`summary-pill ${stats.issues > 0 ? 'issue' : 'ok'}`}>
                  <span>Dokumentierte Mängel</span>
                  <strong>{stats.issues}</strong>
                </div>
                <div className={`summary-pill ${stats.missing > 0 ? 'warning' : 'ok'}`}>
                  <span>Offene Punkte</span>
                  <strong>{stats.missing}</strong>
                </div>
              </div>
              <p className="source-note">{profile.source}</p>
            </div>

            <div className="glass card meta-card">
              <h3><Calendar size={18} /> Prüfdaten</h3>

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
                <label>Geprüft am</label>
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
                <label>Nächste Prüfung fällig</label>
                <input
                  type="date"
                  value={formData.next_inspection}
                  onChange={event => handleFieldChange('next_inspection', event.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Prüfer / Werkstatt</label>
                <input
                  type="text"
                  value={inspection.inspector}
                  onChange={event => handleInspectionMetaChange('inspector', event.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Unterschrift / Kürzel</label>
                <input
                  type="text"
                  value={inspection.signature}
                  onChange={event => handleInspectionMetaChange('signature', event.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Status nach Prüfung</label>
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
                  <h2>Fragebogen für die jährliche Prüfung</h2>
                </div>
                <div className={`recommendation-badge ${recommendedStatus.toLowerCase().replace(/ /g, '-')}`}>
                  Empfehlung: {getStatusLabel(recommendedStatus)}
                </div>
              </div>

              {stats.missing > 0 && (
                <div className="inspection-alert warning">
                  <AlertTriangle size={18} />
                  <span>{stats.missing} Fragen sind noch nicht beantwortet.</span>
                </div>
              )}

              {stats.issues > 0 && (
                <div className="inspection-alert danger">
                  <ShieldAlert size={18} />
                  <span>{stats.issues} Mängel sind dokumentiert. Bitte Status und Maßnahme prüfen.</span>
                </div>
              )}

              <div className="inspection-sections">
                {profile.sections.map(section => (
                  <div key={section.id} className="question-section">
                    <div className="question-section-header">
                      <h3>{section.title}</h3>
                      <span>{section.questions.length} Punkte</span>
                    </div>

                    <div className="question-list">
                      {section.questions.map(question => {
                        const answer = inspection.answers[question.id] ?? '';
                        return (
                          <div key={question.id} className={`question-row ${answer || 'empty'}`}>
                            <label className="question-label" htmlFor={question.id}>
                              {question.label}
                            </label>
                            <select
                              id={question.id}
                              value={answer}
                              className={`answer-select ${answer || 'empty'}`}
                              onChange={event => handleInspectionAnswerChange(question.id, event.target.value)}
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
            </div>

            <div className="glass card notes-card">
              <h3><FileText size={18} /> Notizen / Maßnahmen</h3>
              <textarea
                rows="8"
                className="remarks-textarea"
                value={formData.remarks}
                onChange={event => handleRemarksChange(event.target.value)}
                placeholder="Zusätzliche Feststellungen, Reinigungsbedarf, Reparaturhinweise..."
              />
            </div>
          </section>
        </div>
      )}

      {activeTab === 'data' && (
        <div className="detail-grid">
          <div className="glass card info-section">
            <h3>Basis-Informationen</h3>
            <div className="form-grid">
              <div className="form-group">
                <label><User size={16} /> Aktueller Träger</label>
                <input
                  type="text"
                  value={formData.owner}
                  onChange={event => handleFieldChange('owner', event.target.value)}
                />
              </div>

              <div className="form-group">
                <label><Tag size={16} /> Ausrüstungsart</label>
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
                <label>Letzte Prüfung</label>
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
          <h3>Chronik der Änderungen</h3>
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
        .save-btn {
          display: flex;
          align-items: center;
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
        .summary-card,
        .meta-card,
        .inspection-card,
        .notes-card,
        .info-section,
        .history-section {
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
        .source-note { margin: 0; color: var(--text-muted); font-size: 0.82rem; line-height: 1.5; }

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

        @media (max-width: 1100px) {
          .inspection-layout { grid-template-columns: 1fr; }
          .inspection-sidebar { position: static; }
          .detail-header { grid-template-columns: 1fr; }
        }

        @media (max-width: 760px) {
          .detail-top-bar { flex-direction: column; align-items: stretch; }
          .top-actions { width: 100%; }
          .top-actions > * { flex: 1; justify-content: center; }
          .question-row { grid-template-columns: 1fr; }
          .form-grid { grid-template-columns: 1fr; }
          .inspection-card-header { flex-direction: column; }
          .date-with-action { flex-direction: column; }
          .timeline-header { flex-direction: column; align-items: start; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ItemDetail;
