/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  buildInspectionHistoryNote,
  createAnnualInspection,
  normalizeItem,
} from '../data/inspectionProfiles';

const ClothingContext = createContext();

const MOCK_DATA = [
  {
    id: '123456789',
    owner: 'Max Mustermann',
    status: 'Gut',
    last_inspection: '2025-01-15',
    next_inspection: '2026-01-15',
    remarks: 'Keine M\u00e4ngel',
    type: 'Jacke',
    archived: false,
    annualInspection: createAnnualInspection(
      'Jacke',
      {
        inspectionDate: '2025-01-15',
        inspector: 'Werkstatt Nord',
        signature: 'MM',
        notes: 'Keine M\u00e4ngel',
        answers: {
          labelReadable: 'ok',
          careLabelReadable: 'ok',
          manufacturerInformation: 'ok',
          outerHoles: 'ok',
          outerContamination: 'ok',
          outerThermalDamage: 'ok',
          laminateDelamination: 'na',
          seamDamage: 'ok',
          seamTapesComplete: 'ok',
          insulationDamage: 'ok',
          insulationZipperFunction: 'ok',
          innerHoles: 'ok',
          innerContamination: 'ok',
          innerThermalDamage: 'ok',
          innerSeamDamage: 'ok',
          zipperClosureComplete: 'ok',
          zipperDamage: 'ok',
          zipperFunction: 'ok',
          pocketCoverage: 'ok',
          buttonsAndVelcroClean: 'ok',
          pocketClosureFunction: 'ok',
          hangerPresent: 'ok',
          carabinerPresent: 'ok',
          velcroDamage: 'ok',
          velcroClosureFunction: 'ok',
          reflectiveSeams: 'ok',
          reflectiveDamage: 'ok',
          reflectiveFunction: 'ok',
        },
        overallResult: 'Gut',
      },
      {
        id: '123456789',
        type: 'Jacke',
        status: 'Gut',
        remarks: 'Keine M\u00e4ngel',
        last_inspection: '2025-01-15',
      }
    ),
    history: [
      {
        timestamp: '2025-01-15T12:00:00Z',
        status: 'Gut',
        remarks: 'Erstinbetriebnahme nach Pr\u00fcfung',
      },
    ],
  },
  {
    id: '987654321',
    owner: 'Erika Musterfrau',
    status: 'Bedarf Reinigung',
    last_inspection: '2024-11-20',
    next_inspection: '2025-11-20',
    remarks: 'Ru\u00dfverschmutzung vom letzten Kellerbrand',
    type: 'Hose',
    archived: false,
    history: [
      {
        timestamp: '2024-11-20T14:30:00Z',
        status: 'Gut',
        remarks: 'Neu ausgegeben',
      },
      {
        timestamp: '2025-02-15T09:00:00Z',
        status: 'Bedarf Reinigung',
        remarks: 'Nach Brandeinsatz verschmutzt',
      },
    ],
  },
  {
    id: '456789123',
    owner: 'Thomas M\u00fcller',
    status: 'Zur Pruefung faellig',
    last_inspection: '2023-03-20',
    next_inspection: '2026-03-20',
    remarks: 'Visier leicht verkratzt',
    type: 'Helm',
    archived: false,
    history: [
      {
        timestamp: '2023-03-20T10:00:00Z',
        status: 'Gut',
        remarks: 'Pr\u00fcfung bestanden',
      },
    ],
  },
  {
    id: '321654987',
    owner: 'Sarah Schmidt',
    status: 'In Reparatur',
    last_inspection: '2025-02-10',
    next_inspection: '2026-02-10',
    remarks: 'Naht an der rechten Hand offen',
    type: 'Handschuhe',
    archived: false,
    history: [
      {
        timestamp: '2025-02-10T16:00:00Z',
        status: 'In Reparatur',
        remarks: 'Defekt gemeldet',
      },
    ],
  },
];

export const ClothingProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('fire_gear_items');
    return (saved ? JSON.parse(saved) : MOCK_DATA).map(normalizeItem);
  });

  useEffect(() => {
    localStorage.setItem('fire_gear_items', JSON.stringify(items));
  }, [items]);

  const updateItem = (id, updates) => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id !== id) {
          return item;
        }

        const { historyNote, inspectionRecord, ...persistedUpdates } = updates;
        const nextInspectionRecords = inspectionRecord
          ? [inspectionRecord, ...(item.inspectionRecords || [])]
          : persistedUpdates.inspectionRecords || item.inspectionRecords || [];
        const mergedItem = normalizeItem({
          ...item,
          ...persistedUpdates,
          inspectionRecords: nextInspectionRecords,
        });
        const inspectionChanged =
          JSON.stringify(mergedItem.annualInspection) !== JSON.stringify(item.annualInspection);
        const hasStatusChanged = mergedItem.status !== item.status;
        const hasInspectionDateChanged =
          mergedItem.last_inspection !== item.last_inspection ||
          mergedItem.next_inspection !== item.next_inspection;
        const hasNewInspectionRecord = Boolean(inspectionRecord);
        const shouldLogHistory =
          hasStatusChanged || inspectionChanged || hasInspectionDateChanged || hasNewInspectionRecord;

        const newHistory = shouldLogHistory
          ? [
              {
                timestamp: new Date().toISOString(),
                status: mergedItem.status,
                remarks:
                  historyNote ||
                  (hasNewInspectionRecord
                    ? `Pr\u00fcfung archiviert: ${inspectionRecord.recordId}`
                    : buildInspectionHistoryNote(mergedItem.type, mergedItem.annualInspection)),
              },
              ...(item.history || []),
            ]
          : item.history || [];

        return { ...mergedItem, history: newHistory };
      })
    );
  };

  const addItem = newItem => {
    const normalizedItem = normalizeItem({
      ...newItem,
      archived: false,
    });

    const itemWithHistory = {
      ...normalizedItem,
      history: [
        {
          timestamp: new Date().toISOString(),
          status: normalizedItem.status,
          remarks: normalizedItem.remarks || 'Erstellt',
        },
      ],
    };

    setItems(prevItems => [...prevItems, itemWithHistory]);
  };

  const archiveItem = id => {
    setItems(prevItems =>
      prevItems.map(item => (item.id === id ? { ...item, archived: true } : item))
    );
  };

  const restoreItem = id => {
    setItems(prevItems =>
      prevItems.map(item => (item.id === id ? { ...item, archived: false } : item))
    );
  };

  const deleteItem = id => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const getItem = id => items.find(item => item.id === id);

  return (
    <ClothingContext.Provider
      value={{ items, updateItem, getItem, addItem, deleteItem, archiveItem, restoreItem }}
    >
      {children}
    </ClothingContext.Provider>
  );
};

export const useClothing = () => useContext(ClothingContext);
