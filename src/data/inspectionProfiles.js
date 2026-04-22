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
  'Zur Pruefung faellig': 'Zur Prüfung fällig',
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
  { value: '', label: 'Bitte wählen' },
  { value: 'ok', label: 'Ja / in Ordnung' },
  { value: 'issue', label: 'Nein / Mängel vorhanden' },
  { value: 'na', label: 'n.a.' },
];

const PROFILES = {
  clothing: {
    key: 'clothing',
    title: 'Jährliche Prüfung Einsatzbekleidung',
    shortTitle: 'Prüfung Einsatzbekleidung',
    source: 'Fragebogen gemäß PDF "Wartung-Prüfung Einsatzbekleidung u. Flammschutzhaube".',
    sections: [
      {
        id: 'identification',
        title: 'Kennzeichnung',
        questions: [
          { id: 'labelReadable', label: 'Kennzeichnung lesbar?' },
          { id: 'careLabelReadable', label: 'Pflegeanleitung lesbar?' },
          { id: 'manufacturerInformation', label: 'Herstellerinformationen vorhanden, vollständig und verfügbar?' },
        ],
      },
      {
        id: 'outerShell',
        title: 'Oberstoff',
        questions: [
          { id: 'outerHoles', label: 'Sichtprüfung auf Löcher' },
          { id: 'outerContamination', label: 'Sichtprüfung auf sicherheitsrelevante Verschmutzungen' },
          { id: 'outerThermalDamage', label: 'Sichtprüfung auf thermische Schädigungen / Kräuselungen' },
          { id: 'laminateDelamination', label: 'Bei Laminat: Sichtprüfung auf Ablösung Oberstoff - Laminat' },
        ],
      },
      {
        id: 'seams',
        title: 'Nahtverbindungen',
        questions: [
          { id: 'seamDamage', label: 'Sichtprüfung auf Beschädigungen der Nahtverbindungen' },
          { id: 'seamTapesComplete', label: 'Sichtprüfung der Abklebungen vollständig' },
        ],
      },
      {
        id: 'lining',
        title: 'Isolationsfutter',
        questions: [
          { id: 'insulationDamage', label: 'Sichtprüfung auf Beschädigung' },
          { id: 'insulationZipperFunction', label: 'Funktionsprüfung Reißverschluss (Beschädigung, Leichtläufigkeit)' },
        ],
      },
      {
        id: 'innerLining',
        title: 'Innenfutter',
        questions: [
          { id: 'innerHoles', label: 'Sichtprüfung auf Löcher' },
          { id: 'innerContamination', label: 'Sichtprüfung auf sicherheitsrelevante Verschmutzungen' },
          { id: 'innerThermalDamage', label: 'Sichtprüfung auf thermische Schädigungen / Kräuselungen' },
          { id: 'innerSeamDamage', label: 'Sichtprüfung auf Beschädigungen der Nahtverbindungen' },
        ],
      },
      {
        id: 'zipper',
        title: 'Reißverschluss',
        questions: [
          { id: 'zipperClosureComplete', label: 'Sichtprüfung auf vollständige Schließung' },
          { id: 'zipperDamage', label: 'Sichtprüfung auf Beschädigung' },
          { id: 'zipperFunction', label: 'Funktionsprüfung Reißverschluss (Beschädigung, Leichtläufigkeit)' },
        ],
      },
      {
        id: 'pockets',
        title: 'Taschen / Überlappungen',
        questions: [
          { id: 'pocketCoverage', label: 'Sichtprüfung auf Überdeckung der Taschenpatten' },
          { id: 'buttonsAndVelcroClean', label: 'Sichtprüfung Knöpfe oder Klett vollständig und sauber' },
          { id: 'pocketClosureFunction', label: 'Funktionsprüfung Schließung mit Klettstreifen' },
        ],
      },
      {
        id: 'hangerAndCarabiner',
        title: 'Aufhänger und Karabiner',
        questions: [
          { id: 'hangerPresent', label: 'Sichtprüfung auf Vorhandensein und Beschädigung des Aufhängers' },
          { id: 'carabinerPresent', label: 'Sichtprüfung auf Vorhandensein und Beschädigung des Karabiners' },
        ],
      },
      {
        id: 'velcro',
        title: 'Klettverschlüsse',
        questions: [
          { id: 'velcroDamage', label: 'Sichtprüfung auf Beschädigung und Verschmutzung' },
          { id: 'velcroClosureFunction', label: 'Funktionsprüfung der sachgerechten Schließung' },
        ],
      },
      {
        id: 'reflectiveStrips',
        title: 'Reflexstreifen',
        questions: [
          { id: 'reflectiveSeams', label: 'Sichtprüfung der Nahtverbindungen (Festigkeit, Ablösen)' },
          { id: 'reflectiveDamage', label: 'Sichtprüfung auf Beschädigung und Verschmutzung' },
          { id: 'reflectiveFunction', label: 'Funktionsprüfung der Reflexstreifen (ggf. mittels Lampe)' },
        ],
      },
    ],
    cleaningQuestionIds: ['outerContamination', 'innerContamination'],
  },
  hood: {
    key: 'hood',
    title: 'Jährliche Prüfung Flammschutzhaube',
    shortTitle: 'Prüfung Flammschutzhaube',
    source: 'Fragebogen gemäß PDF "Wartung-Prüfung Einsatzbekleidung u. Flammschutzhaube".',
    sections: [
      {
        id: 'identification',
        title: 'Kennzeichnung',
        questions: [
          { id: 'hoodLabelReadable', label: 'Kennzeichnung lesbar?' },
        ],
      },
      {
        id: 'manufacturer',
        title: 'Hersteller',
        questions: [
          { id: 'hoodManufacturerInformation', label: 'Herstellerinformationen vorhanden, vollständig und verfügbar?' },
        ],
      },
      {
        id: 'outerShell',
        title: 'Oberstoff',
        questions: [
          { id: 'hoodFabricCondition', label: 'Sichtprüfung auf Löcher, Oberfläche des Oberstoffs und Verfärbungen' },
          { id: 'hoodContamination', label: 'Sichtprüfung auf sicherheitsrelevante Verschmutzungen' },
        ],
      },
      {
        id: 'seams',
        title: 'Nahtverbindungen',
        questions: [
          { id: 'hoodSeamDamage', label: 'Sichtprüfung auf Beschädigungen der Nahtverbindungen' },
        ],
      },
      {
        id: 'maskOpening',
        title: 'Maskenausschnitt',
        questions: [
          { id: 'hoodMaskOpening', label: 'Sichtprüfung auf Beschädigung' },
          { id: 'hoodFitFunction', label: 'Funktionsprüfung von Größe / Passform (nach Reinigung und Gebrauch)' },
        ],
      },
      {
        id: 'coverage',
        title: 'Deckung / Überlappung',
        questions: [
          { id: 'hoodCoverage', label: 'Sichtprüfung auf Überdeckung der Feuerschutzhaube' },
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

export const getInspectionProfile = (type = 'Jacke') => PROFILES[PROFILE_BY_TYPE[type] || 'clothing'];

export const getStatusLabel = status => STATUS_LABELS[status] || status;

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

export const buildInspectionHistoryNote = (type, inspection) => {
  const profile = getInspectionProfile(type);
  const stats = getInspectionStats(type, inspection.answers);

  if (stats.missing > 0) {
    return `${profile.shortTitle} gespeichert - Fragebogen unvollständig (${stats.missing} offen).`;
  }

  if (stats.issues === 0) {
    return `${profile.shortTitle} abgeschlossen - ohne festgestellte Mängel.`;
  }

  return `${profile.shortTitle} abgeschlossen - ${stats.issues} dokumentierte Mängel.`;
};

export const normalizeItem = item => {
  const annualInspection = createAnnualInspection(item.type, item.annualInspection, item);
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
    history: Array.isArray(item.history) ? item.history : [],
  };
};

export const getNextInspectionDate = inspectionDate => addYears(inspectionDate);
