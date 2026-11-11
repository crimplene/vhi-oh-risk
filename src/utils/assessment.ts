import type {
  ControlType,
  ExposureFrequency,
  HazardAssessment,
  Modifier,
  RoleCategory,
} from '../types'

const roleHazards: Record<RoleCategory, string[]> = {
  'Office/DSE': ['DSE', 'Ergonomics', 'Visual Demands', 'Psychosocial Demands'],
  'Manufacturing/Production': ['Noise', 'Machinery', 'Dust', 'Chemical Exposure'],
  'Maintenance/Engineering': [
    'Noise',
    'Hand Arm Vibration',
    'Manual Handling',
    'Machinery',
    'Chemical Exposure',
    'Dust',
  ],
  'Laboratory Work': ['Biological Agents', 'Sharps', 'Chemical Exposure', 'Repetitive Tasks'],
  'Chemical Handling': ['Chemical Exposure', 'Respiratory Sensitizers', 'Skin Contact'],
  'Cleaning/Wet Work': ['Wet Work', 'Skin Contact', 'Chemical Exposure', 'Manual Handling'],
  'Healthcare/Biological': ['Biological Agents', 'Sharps', 'Patient Handling', 'Wet Work'],
  'Outdoor/Environmental': ['Heat', 'Cold', 'UV', 'Weather Exposure'],
}

const controlScores: Record<ControlType, number> = {
  'Fully Enclosed': -2,
  'Partially Enclosed': -1,
  Extraction: -1,
  'Engineering Controls': -2,
  'PPE Primary': 2,
  Open: 1,
  None: 1,
  Unknown: 1,
}

const frequencyScores: Record<ExposureFrequency, number> = {
  Routine: 2,
  'Most Shifts': 2,
  Regular: 1,
  Occasional: 0,
  Rare: -1,
  Unknown: 1,
}

export const controlOptions = Object.keys(controlScores) as ControlType[]
export const frequencyOptions = Object.keys(frequencyScores) as ExposureFrequency[]

export function generateHazards(roles: RoleCategory[]): string[] {
  return [...new Set(roles.flatMap((role) => roleHazards[role]))]
}

export function scoreHazard(control: ControlType, frequency: ExposureFrequency): number {
  return controlScores[control] + frequencyScores[frequency]
}

export function scoreHazards(hazards: HazardAssessment[]): number {
  return hazards.reduce((total, hazard) => total + hazard.score, 0)
}

export function getFunctionalAssessmentLevel(modifiers: Modifier[]): 1 | 3 {
  return modifiers.some((modifier) =>
    ['Driving/Mobile Plant', 'Work At Height', 'Confined Space', 'Emergency Response'].includes(modifier),
  )
    ? 3
    : 1
}

export function generateRecommendations(
  hazards: HazardAssessment[],
  modifiers: Modifier[],
  riskScore: number,
): string[] {
  const hazardNames = hazards.map((hazard) => hazard.name)
  const recommendations = new Set<string>()

  if (hazardNames.some((name) => ['Noise', 'Machinery'].includes(name))) {
    recommendations.add('Baseline and periodic audiometry where noise exposure assessment indicates risk.')
  }
  if (hazardNames.includes('Hand Arm Vibration')) {
    recommendations.add('Baseline hand-arm vibration assessment and symptom surveillance.')
  }
  if (hazardNames.some((name) => ['Dust', 'Chemical Exposure', 'Respiratory Sensitizers'].includes(name)) ||
    modifiers.includes('Respirator Required')) {
    recommendations.add('Review respiratory risks; consider baseline respiratory questionnaire and spirometry.')
  }
  if (hazardNames.some((name) => ['Manual Handling', 'Patient Handling'].includes(name))) {
    recommendations.add('Provide manual-handling training and assess musculoskeletal symptoms at baseline.')
  }
  if (hazardNames.some((name) => ['Biological Agents', 'Sharps'].includes(name))) {
    recommendations.add('Check immunisation status and establish exposure incident and infection surveillance.')
  }
  if (hazardNames.some((name) => ['Wet Work', 'Skin Contact'].includes(name))) {
    recommendations.add('Offer skin-health education and periodic skin surveillance.')
  }
  if (hazardNames.some((name) => ['Heat', 'Cold', 'UV', 'Weather Exposure'].includes(name))) {
    recommendations.add('Review environmental exposure controls, hydration, thermal protection and skin protection.')
  }
  if (modifiers.includes('Night Work') || modifiers.includes('Shift Work')) {
    recommendations.add('Include fatigue, sleep and shift-work tolerance in the occupational health review.')
  }
  if (recommendations.size === 0) {
    recommendations.add('Complete a pre-placement health questionnaire and review at routine intervals.')
  }
  if (riskScore >= 8) {
    recommendations.add('Prioritise a clinician review and confirm that controls are effective before role start.')
  }

  return [...recommendations]
}
