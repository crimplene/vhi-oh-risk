import type {
  ControlType,
  ExposureFrequency,
  HazardAssessment,
  RoleProfile,
} from '../types'
import { scoreHazard } from '../utils/assessment'

function hazardsFor(
  names: string[],
  control: ControlType,
  frequency: ExposureFrequency,
): HazardAssessment[] {
  return names.map((name, index) => ({
    id: `${name.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}-${index}`,
    name,
    controlType: control,
    exposureFrequency: frequency,
    score: scoreHazard(control, frequency),
    generatedAutomatically: true,
  }))
}

export const demoProfiles: RoleProfile[] = [
  {
    id: 'demo-maintenance',
    name: 'Maintenance Technician',
    description: 'Plant maintenance across production areas, including occasional night shifts and respirator use.',
    roles: ['Maintenance/Engineering'],
    modifiers: ['Night Work', 'Respirator Required'],
    hazards: hazardsFor(
      ['Noise', 'Hand Arm Vibration', 'Manual Handling', 'Machinery', 'Chemical Exposure', 'Dust'],
      'Engineering Controls',
      'Regular',
    ),
    status: 'Submitted',
    reviewStatus: 'Pending review',
    riskScore: 0,
    functionalAssessmentLevel: 1,
    recommendation: [
      'Baseline and periodic audiometry where noise exposure assessment indicates risk.',
      'Baseline hand-arm vibration assessment and symptom surveillance.',
      'Review respiratory risks; consider baseline respiratory questionnaire and spirometry.',
      'Include fatigue, sleep and shift-work tolerance in the occupational health review.',
    ],
    specialistReviewRequired: false,
    owner: 'Jordan Lee',
    submittedAt: '2026-11-10T09:30:00.000Z',
  },
  {
    id: 'demo-warehouse',
    name: 'Warehouse Operative',
    description: 'Goods handling and mobile plant operation in a busy distribution centre.',
    roles: ['Manufacturing/Production'],
    modifiers: ['Driving/Mobile Plant', 'Shift Work'],
    hazards: hazardsFor(['Noise', 'Machinery', 'Dust', 'Chemical Exposure'], 'Partially Enclosed', 'Most Shifts'),
    status: 'Approved',
    reviewStatus: 'Approved',
    riskScore: 0,
    functionalAssessmentLevel: 3,
    recommendation: ['Baseline and periodic audiometry where noise exposure assessment indicates risk.'],
    specialistReviewRequired: false,
    owner: 'Sam Patel',
    submittedAt: '2026-11-08T14:00:00.000Z',
  },
  {
    id: 'demo-lab',
    name: 'Laboratory Technician',
    description: 'Routine sample processing and chemical preparation in a controlled laboratory.',
    roles: ['Laboratory Work', 'Chemical Handling'],
    modifiers: ['PPE Required'],
    hazards: hazardsFor(
      ['Biological Agents', 'Sharps', 'Chemical Exposure', 'Repetitive Tasks', 'Respiratory Sensitizers', 'Skin Contact'],
      'Extraction',
      'Regular',
    ),
    status: 'Draft',
    reviewStatus: 'Not submitted',
    riskScore: 0,
    functionalAssessmentLevel: 1,
    recommendation: ['Check immunisation status and establish exposure incident and infection surveillance.'],
    specialistReviewRequired: false,
    owner: 'Jordan Lee',
  },
  {
    id: 'demo-outdoor',
    name: 'Grounds Maintenance',
    description: 'Outdoor grounds work throughout the year, including seasonal heat and UV exposure.',
    roles: ['Outdoor/Environmental'],
    modifiers: ['Heat Exposure', 'UV Exposure'],
    hazards: hazardsFor(['Heat', 'Cold', 'UV', 'Weather Exposure'], 'Open', 'Occasional'),
    status: 'Specialist review',
    reviewStatus: 'Specialist review',
    riskScore: 0,
    functionalAssessmentLevel: 1,
    recommendation: [
      'Review environmental exposure controls, hydration, thermal protection and skin protection.',
    ],
    specialistReviewRequired: true,
    owner: 'Avery Chen',
    submittedAt: '2026-11-07T10:15:00.000Z',
  },
]

for (const profile of demoProfiles) {
  profile.riskScore = profile.hazards.reduce((sum, hazard) => sum + hazard.score, 0)
}
