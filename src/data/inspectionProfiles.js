export const STATUS_OPTIONS = [
  'Gut',
  'Bedarf Reinigung',
  'In Reparatur',
  'Zur Pruefung faellig',
  'Stillgelegt',
];

export const STATUS_LABELS = {
  Gut: 'Gut',
  'Bedarf Reinigung': 'Bedarf Reinigung',
  'In Reparatur': 'In Reparatur',
  'Zur Pruefung faellig': 'Zur Pr\u00fcfung f\u00e4llig',
  Stillgelegt: 'Stillgelegt',
};

export const ITEM_TYPES = [
  'Jacke',
  'Hose',
  'Helm',
  'Handschuhe',
  'Stiefel',
  'Flammschutzhaube',
];

export const RESPONSE_OPTIONS = [
  { value: '', label: 'Bitte w\u00e4hlen' },
  { value: 'ok', label: 'Ja / in Ordnung' },
  { value: 'issue', label: 'Nein / M\u00e4ngel vorhanden' },
  { value: 'na', label: 'n.a.' },
];

const RESPONSE_LABELS = {
  '': 'Offen',
  ok: 'Ja / in Ordnung',
  issue: 'Nein / M\u00e4ngel vorhanden',
  na: 'n.a.',
};

const PROFILES = {
  clothing: {
    key: 'clothing',
    title: 'J\u00e4hrliche Pr\u00fcfung Einsatzbekleidung',
    shortTitle: 'Pr\u00fcfung Einsatzbekleidung',
    source: 'Fragebogen gem\u00e4\u00df PDF "Wartung-Pr\u00fcfung Einsatzbekleidung u. Flammschutzhaube".',
    sections: [
      {
        id: 'identification',
        title: 'Kennzeichnung',
        questions: [
          { id: 'labelReadable', label: 'Kennzeichnung lesbar?' },
          { id: 'careLabelReadable', label: 'Pflegeanleitung lesbar?' },
          {
            id: 'manufacturerInformation',
            label: 'Herstellerinformationen vorhanden, vollst\u00e4ndig und verf\u00fcgbar?',
          },
        ],
      },
      {
        id: 'outerShell',
        title: 'Oberstoff',
        questions: [
          { id: 'outerHoles', label: 'Sichtpr\u00fcfung auf L\u00f6cher' },
          {
            id: 'outerContamination',
            label: 'Sichtpr\u00fcfung auf sicherheitsrelevante Verschmutzungen',
          },
          {
            id: 'outerThermalDamage',
            label: 'Sichtpr\u00fcfung auf thermische Sch\u00e4digungen / Kr\u00e4uselungen',
          },
          {
            id: 'laminateDelamination',
            label: 'Bei Laminat: Sichtpr\u00fcfung auf Abl\u00f6sung Oberstoff - Laminat',
          },
        ],
      },
      {
        id: 'seams',
        title: 'Nahtverbindungen',
        questions: [
          {
            id: 'seamDamage',
            label: 'Sichtpr\u00fcfung auf Besch\u00e4digungen der Nahtverbindungen',
          },
          {
            id: 'seamTapesComplete',
            label: 'Sichtpr\u00fcfung der Abklebungen vollst\u00e4ndig',
          },
        ],
      },
      {
        id: 'lining',
        title: 'Isolationsfutter',
        questions: [
          { id: 'insulationDamage', label: 'Sichtpr\u00fcfung auf Besch\u00e4digung' },
          {
            id: 'insulationZipperFunction',
            label: 'Funktionspr\u00fcfung Rei\u00dfverschluss (Besch\u00e4digung, Leichtl\u00e4ufigkeit)',
          },
        ],
      },
      {
        id: 'innerLining',
        title: 'Innenfutter',
        questions: [
          { id: 'innerHoles', label: 'Sichtpr\u00fcfung auf L\u00f6cher' },
          {
            id: 'innerContamination',
            label: 'Sichtpr\u00fcfung auf sicherheitsrelevante Verschmutzungen',
          },
          {
            id: 'innerThermalDamage',
            label: 'Sichtpr\u00fcfung auf thermische Sch\u00e4digungen / Kr\u00e4uselungen',
          },
          {
            id: 'innerSeamDamage',
            label: 'Sichtpr\u00fcfung auf Besch\u00e4digungen der Nahtverbindungen',
          },
        ],
      },
      {
        id: 'zipper',
        title: 'Rei\u00dfverschluss',
        questions: [
          {
            id: 'zipperClosureComplete',
            label: 'Sichtpr\u00fcfung auf vollst\u00e4ndige Schlie\u00dfung',
          },
          { id: 'zipperDamage', label: 'Sichtpr\u00fcfung auf Besch\u00e4digung' },
          {
            id: 'zipperFunction',
            label: 'Funktionspr\u00fcfung Rei\u00dfverschluss (Besch\u00e4digung, Leichtl\u00e4ufigkeit)',
          },
        ],
      },
      {
        id: 'pockets',
        title: 'Taschen / \u00dcberlappungen',
        questions: [
          {
            id: 'pocketCoverage',
            label: 'Sichtpr\u00fcfung auf \u00dcberdeckung der Taschenpatten',
          },
          {
            id: 'buttonsAndVelcroClean',
            label: 'Sichtpr\u00fcfung Kn\u00f6pfe oder Klett vollst\u00e4ndig und sauber',
          },
          {
            id: 'pocketClosureFunction',
            label: 'Funktionspr\u00fcfung Schlie\u00dfung mit Klettstreifen',
          },
        ],
      },
      {
        id: 'hangerAndCarabiner',
        title: 'Aufh\u00e4nger und Karabiner',
        questions: [
          {
            id: 'hangerPresent',
            label: 'Sichtpr\u00fcfung auf Vorhandensein und Besch\u00e4digung des Aufh\u00e4ngers',
          },
          {
            id: 'carabinerPresent',
            label: 'Sichtpr\u00fcfung auf Vorhandensein und Besch\u00e4digung des Karabiners',
          },
        ],
      },
      {
        id: 'velcro',
        title: 'Klettverschl\u00fcsse',
        questions: [
          {
            id: 'velcroDamage',
            label: 'Sichtpr\u00fcfung auf Besch\u00e4digung und Verschmutzung',
          },
          {
            id: 'velcroClosureFunction',
            label: 'Funktionspr\u00fcfung der sachgerechten Schlie\u00dfung',
          },
        ],
      },
      {
        id: 'reflectiveStrips',
        title: 'Reflexstreifen',
        questions: [
          {
            id: 'reflectiveSeams',
            label: 'Sichtpr\u00fcfung der Nahtverbindungen (Festigkeit, Abl\u00f6sen)',
          },
          {
            id: 'reflectiveDamage',
            label: 'Sichtpr\u00fcfung auf Besch\u00e4digung und Verschmutzung',
          },
          {
            id: 'reflectiveFunction',
            label: 'Funktionspr\u00fcfung der Reflexstreifen (ggf. mittels Lampe)',
          },
        ],
      },
    ],
    cleaningQuestionIds: ['outerContamination', 'innerContamination'],
  },
  hood: {
    key: 'hood',
    title: 'J\u00e4hrliche Pr\u00fcfung Flammschutzhaube',
    shortTitle: 'Pr\u00fcfung Flammschutzhaube',
    source: 'Fragebogen gem\u00e4\u00df PDF "Wartung-Pr\u00fcfung Einsatzbekleidung u. Flammschutzhaube".',
    sections: [
      {
        id: 'identification',
        title: 'Kennzeichnung',
        questions: [{ id: 'hoodLabelReadable', label: 'Kennzeichnung lesbar?' }],
      },
      {
        id: 'manufacturer',
        title: 'Hersteller',
        questions: [
          {
            id: 'hoodManufacturerInformation',
            label: 'Herstellerinformationen vorhanden, vollst\u00e4ndig und verf\u00fcgbar?',
          },
        ],
      },
      {
        id: 'outerShell',
        title: 'Oberstoff',
        questions: [
          {
            id: 'hoodFabricCondition',
            label: 'Sichtpr\u00fcfung auf L\u00f6cher, Oberfl\u00e4che des Oberstoffs und Verf\u00e4rbungen',
          },
          {
            id: 'hoodContamination',
            label: 'Sichtpr\u00fcfung auf sicherheitsrelevante Verschmutzungen',
          },
        ],
      },
      {
        id: 'seams',
        title: 'Nahtverbindungen',
        questions: [
          {
            id: 'hoodSeamDamage',
            label: 'Sichtpr\u00fcfung auf Besch\u00e4digungen der Nahtverbindungen',
          },
        ],
      },
      {
        id: 'maskOpening',
        title: 'Maskenausschnitt',
        questions: [
          { id: 'hoodMaskOpening', label: 'Sichtpr\u00fcfung auf Besch\u00e4digung' },
          {
            id: 'hoodFitFunction',
            label: 'Funktionspr\u00fcfung von Gr\u00f6\u00dfe / Passform (nach Reinigung und Gebrauch)',
          },
        ],
      },
      {
        id: 'coverage',
        title: 'Deckung / \u00dcberlappung',
        questions: [
          {
            id: 'hoodCoverage',
            label: 'Sichtpr\u00fcfung auf \u00dcberdeckung der Feuerschutzhaube',
          },
        ],
      },
    ],
    cleaningQuestionIds: ['hoodContamination'],
  },
};

const PROFILE_BY_TYPE = {
  Flammschutzhaube: 'hood',
};

const addYears = (dateString, years = 1) => {
  if (!dateString) {
    return '';
  }

  const baseDate = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(baseDate.getTime())) {
    return '';
  }

  baseDate.setFullYear(baseDate.getFullYear() + years);
  return baseDate.toISOString().split('T')[0];
};

const cloneAnswersForProfile = (profile, answers = {}) =>
  Object.fromEntries(
    profile.sections.flatMap(section =>
      section.questions.map(question => [question.id, answers[question.id] ?? ''])
    )
  );

const createChecksum = input => {
  let hash = 2166136261;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, '0')}`;
};

const buildRecordPayload = record => {
  const { recordHash: UNUSED_RECORD_HASH, ...rest } = record;
  return JSON.stringify(rest);
};

const getMeaningfulAnswerCount = answers =>
  Object.values(answers || {}).filter(answer => Boolean(answer)).length;

const hasInspectionEvidence = inspection =>
  Boolean(
    inspection?.inspectionDate ||
      inspection?.inspector ||
      inspection?.signature ||
      inspection?.notes ||
      getMeaningfulAnswerCount(inspection?.answers) > 0
  );

const ensureInspectionDateTime = value => {
  if (!value) {
    return new Date().toISOString();
  }

  return value.includes('T') ? value : `${value}T12:00:00.000Z`;
};

const sealInspectionRecord = record => ({
  ...record,
  recordHash: createChecksum(buildRecordPayload(record)),
});

const normalizeInspectionRecord = (record, index = 0) => {
  const profile = getInspectionProfile(record?.itemSnapshot?.type || 'Jacke');
  const normalizedInspection = createAnnualInspection(
    record?.itemSnapshot?.type || 'Jacke',
    record?.inspection,
    record?.itemSnapshot
  );
  const createdAt = record?.createdAt || ensureInspectionDateTime(normalizedInspection.inspectionDate);
  const normalizedRecord = {
    schemaVersion: 1,
    recordId: record?.recordId || `inspection-${createdAt.replace(/[:.]/g, '-')}-${index}`,
    createdAt,
    previousHash: record?.previousHash || '',
    origin: record?.origin || 'inspection',
    locked: true,
    profileKey: record?.profileKey || profile.key,
    itemSnapshot: {
      id: record?.itemSnapshot?.id || '',
      owner: record?.itemSnapshot?.owner || '',
      type: record?.itemSnapshot?.type || 'Jacke',
      status: record?.itemSnapshot?.status || normalizedInspection.overallResult,
      lastInspection: record?.itemSnapshot?.lastInspection || normalizedInspection.inspectionDate || '',
      nextInspection: record?.itemSnapshot?.nextInspection || '',
    },
    inspection: normalizedInspection,
    stats: record?.stats || getInspectionStats(record?.itemSnapshot?.type || 'Jacke', normalizedInspection.answers),
    recordHash: record?.recordHash || '',
  };

  return normalizedRecord.recordHash ? normalizedRecord : sealInspectionRecord(normalizedRecord);
};

const createLegacyInspectionRecord = item => {
  const inspection = createAnnualInspection(item.type, item.annualInspection, item);
  if (!hasInspectionEvidence(inspection) && !item.last_inspection) {
    return null;
  }

  return normalizeInspectionRecord(
    {
      recordId: `legacy-${item.id}-${(inspection.inspectionDate || new Date().toISOString().slice(0, 10)).replace(/[^0-9]/g, '')}`,
      createdAt: ensureInspectionDateTime(inspection.inspectionDate || item.last_inspection),
      origin: 'legacy-import',
      previousHash: '',
      profileKey: getInspectionProfile(item.type).key,
      itemSnapshot: {
        id: item.id,
        owner: item.owner,
        type: item.type,
        status: item.status || inspection.overallResult,
        lastInspection: item.last_inspection || inspection.inspectionDate || '',
        nextInspection: item.next_inspection || '',
      },
      inspection: {
        ...inspection,
        notes:
          inspection.notes ||
          'Historischer Datensatz aus bestehender Akte importiert. Der vollst\u00e4ndige Fragebogen lag vorher nicht append-only vor.',
      },
    },
    0
  );
};

export const getInspectionProfile = (type = 'Jacke') => PROFILES[PROFILE_BY_TYPE[type] || 'clothing'];

export const getStatusLabel = status => STATUS_LABELS[status] || status;

export const getResponseLabel = value => RESPONSE_LABELS[value] || RESPONSE_LABELS[''];

export const getInspectionStats = (type, answers = {}) => {
  const profile = getInspectionProfile(type);
  const questionIds = profile.sections.flatMap(section => section.questions.map(question => question.id));
  const missingIds = questionIds.filter(id => !answers[id]);
  const issueIds = questionIds.filter(id => answers[id] === 'issue');
  const cleaningOnly =
    issueIds.length > 0 && issueIds.every(id => profile.cleaningQuestionIds.includes(id));

  return {
    total: questionIds.length,
    missing: missingIds.length,
    issues: issueIds.length,
    missingIds,
    issueIds,
    cleaningOnly,
  };
};

export const deriveStatusFromInspection = (type, answers = {}) => {
  const stats = getInspectionStats(type, answers);

  if (stats.missing > 0) {
    return 'Zur Pruefung faellig';
  }

  if (stats.issues === 0) {
    return 'Gut';
  }

  return stats.cleaningOnly ? 'Bedarf Reinigung' : 'In Reparatur';
};

export const createAnnualInspection = (type, existingInspection = {}, fallbackItem = {}) => {
  const profile = getInspectionProfile(type);
  const answers = cloneAnswersForProfile(profile, existingInspection.answers);
  const derivedStatus = deriveStatusFromInspection(type, answers);

  return {
    profileKey: profile.key,
    inspectionDate: existingInspection.inspectionDate ?? fallbackItem.last_inspection ?? '',
    inspector: existingInspection.inspector ?? '',
    signature: existingInspection.signature ?? '',
    identification: existingInspection.identification ?? fallbackItem.type ?? '',
    serialNumber: existingInspection.serialNumber ?? fallbackItem.id ?? '',
    notes: existingInspection.notes ?? fallbackItem.remarks ?? '',
    answers,
    overallResult: existingInspection.overallResult ?? fallbackItem.status ?? derivedStatus,
    source: profile.source,
  };
};

export const createInspectionRecord = (item, inspection, existingRecords = []) => {
  const normalizedInspection = createAnnualInspection(item.type, inspection, item);
  const stats = getInspectionStats(item.type, normalizedInspection.answers);
  const previousHash = existingRecords?.[0]?.recordHash || '';
  const createdAt = new Date().toISOString();

  return sealInspectionRecord({
    schemaVersion: 1,
    recordId: `inspection-${item.id}-${createdAt.replace(/[:.]/g, '-')}`,
    createdAt,
    previousHash,
    origin: 'inspection',
    locked: true,
    profileKey: getInspectionProfile(item.type).key,
    itemSnapshot: {
      id: item.id,
      owner: item.owner,
      type: item.type,
      status: item.status,
      lastInspection: item.last_inspection,
      nextInspection: item.next_inspection,
    },
    inspection: normalizedInspection,
    stats,
  });
};

export const buildInspectionHistoryNote = (type, inspection) => {
  const profile = getInspectionProfile(type);
  const stats = getInspectionStats(type, inspection.answers);

  if (stats.missing > 0) {
    return `${profile.shortTitle} gespeichert - Fragebogen unvollst\u00e4ndig (${stats.missing} offen).`;
  }

  if (stats.issues === 0) {
    return `${profile.shortTitle} abgeschlossen - ohne festgestellte M\u00e4ngel.`;
  }

  return `${profile.shortTitle} abgeschlossen - ${stats.issues} dokumentierte M\u00e4ngel.`;
};

export const getNextInspectionDate = inspectionDate => addYears(inspectionDate);

export const getInspectionRecordFilename = record => {
  const datePart = (record?.inspection?.inspectionDate || record?.createdAt || 'unbekannt')
    .slice(0, 10)
    .replace(/[^0-9-]/g, '');

  return `pruefung-${record?.itemSnapshot?.id || 'akte'}-${datePart}.html`;
};

const escapeHtml = value =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

export const buildInspectionRecordHtml = record => {
  const profile = getInspectionProfile(record?.itemSnapshot?.type || 'Jacke');
  const inspection = createAnnualInspection(record?.itemSnapshot?.type || 'Jacke', record?.inspection, record?.itemSnapshot);
  const stats = getInspectionStats(record?.itemSnapshot?.type || 'Jacke', inspection.answers);

  const sectionsHtml = profile.sections
    .map(
      section => `
        <section class="section">
          <h2>${escapeHtml(section.title)}</h2>
          <table>
            <thead>
              <tr>
                <th>Pr\u00fcfpunkt</th>
                <th>Antwort</th>
              </tr>
            </thead>
            <tbody>
              ${section.questions
                .map(
                  question => `
                    <tr>
                      <td>${escapeHtml(question.label)}</td>
                      <td>${escapeHtml(getResponseLabel(inspection.answers[question.id] ?? ''))}</td>
                    </tr>
                  `
                )
                .join('')}
            </tbody>
          </table>
        </section>
      `
    )
    .join('');

  return `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(profile.title)} - ${escapeHtml(record?.itemSnapshot?.id || '')}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #111827; margin: 32px; line-height: 1.45; }
      h1, h2 { margin: 0 0 12px; }
      .meta, .summary { margin: 0 0 24px; padding: 16px; border: 1px solid #d1d5db; border-radius: 12px; }
      .meta-grid, .summary-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px 24px; }
      .label { font-size: 12px; text-transform: uppercase; color: #6b7280; margin-bottom: 4px; }
      .value { font-size: 15px; font-weight: 600; }
      table { width: 100%; border-collapse: collapse; margin-top: 12px; }
      th, td { border: 1px solid #d1d5db; padding: 10px; text-align: left; vertical-align: top; }
      th { background: #f3f4f6; }
      .section { margin-bottom: 24px; }
      .notes { white-space: pre-wrap; padding: 16px; border: 1px solid #d1d5db; border-radius: 12px; }
      @media print { body { margin: 16px; } }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(profile.title)}</h1>
    <div class="meta">
      <div class="meta-grid">
        <div><div class="label">Akte / ID</div><div class="value">${escapeHtml(record?.itemSnapshot?.id || '')}</div></div>
        <div><div class="label">Tr\u00e4ger</div><div class="value">${escapeHtml(record?.itemSnapshot?.owner || '')}</div></div>
        <div><div class="label">Ausr\u00fcstung</div><div class="value">${escapeHtml(record?.itemSnapshot?.type || '')}</div></div>
        <div><div class="label">Status</div><div class="value">${escapeHtml(getStatusLabel(record?.itemSnapshot?.status || inspection.overallResult))}</div></div>
        <div><div class="label">Gepr\u00fcft am</div><div class="value">${escapeHtml(inspection.inspectionDate || '')}</div></div>
        <div><div class="label">N\u00e4chste Pr\u00fcfung</div><div class="value">${escapeHtml(record?.itemSnapshot?.nextInspection || '')}</div></div>
        <div><div class="label">Pr\u00fcfer</div><div class="value">${escapeHtml(inspection.inspector || '')}</div></div>
        <div><div class="label">Unterschrift / K\u00fcrzel</div><div class="value">${escapeHtml(inspection.signature || '')}</div></div>
        <div><div class="label">Kenn- / Bezeichnung</div><div class="value">${escapeHtml(inspection.identification || '')}</div></div>
        <div><div class="label">Serien- / Inventarnr.</div><div class="value">${escapeHtml(inspection.serialNumber || '')}</div></div>
        <div><div class="label">Pr\u00fcf-ID</div><div class="value">${escapeHtml(record?.recordId || '')}</div></div>
        <div><div class="label">Pr\u00fcfsiegel / Hash</div><div class="value">${escapeHtml(record?.recordHash || '')}</div></div>
      </div>
    </div>
    <div class="summary">
      <div class="summary-grid">
        <div><div class="label">Dokumentierte M\u00e4ngel</div><div class="value">${escapeHtml(String(stats.issues))}</div></div>
        <div><div class="label">Offene Punkte</div><div class="value">${escapeHtml(String(stats.missing))}</div></div>
        <div><div class="label">Vorheriges Siegel</div><div class="value">${escapeHtml(record?.previousHash || '-')}</div></div>
        <div><div class="label">Archiviert am</div><div class="value">${escapeHtml(new Date(record?.createdAt || '').toLocaleString('de-DE'))}</div></div>
      </div>
    </div>
    ${sectionsHtml}
    <section class="section">
      <h2>Notizen / Ma\u00dfnahmen</h2>
      <div class="notes">${escapeHtml(inspection.notes || '')}</div>
    </section>
  </body>
</html>`;
};

export const normalizeItem = item => {
  const annualInspection = createAnnualInspection(item.type, item.annualInspection, item);
  const existingRecords =
    Array.isArray(item.inspectionRecords) && item.inspectionRecords.length > 0
      ? item.inspectionRecords.map((record, index) => normalizeInspectionRecord(record, index))
      : [];
  const legacyRecord = existingRecords.length === 0 ? createLegacyInspectionRecord(item) : null;
  const inspectionRecords = legacyRecord ? [legacyRecord] : existingRecords;
  const normalizedStatus = item.status || annualInspection.overallResult || 'Zur Pruefung faellig';

  return {
    ...item,
    archived: Boolean(item.archived),
    last_inspection: item.last_inspection ?? annualInspection.inspectionDate ?? '',
    next_inspection: item.next_inspection ?? addYears(annualInspection.inspectionDate),
    remarks: item.remarks ?? annualInspection.notes ?? '',
    status: normalizedStatus,
    annualInspection: {
      ...annualInspection,
      overallResult: annualInspection.overallResult || normalizedStatus,
    },
    inspectionRecords,
    history: Array.isArray(item.history) ? item.history : [],
  };
};
