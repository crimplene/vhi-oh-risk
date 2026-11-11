export const roleOptions = [
  'Office/DSE',
  'Manufacturing/Production',
  'Maintenance/Engineering',
  'Laboratory Work',
  'Chemical Handling',
  'Cleaning/Wet Work',
  'Healthcare/Biological',
  'Outdoor/Environmental',
] as const

export const modifierOptions = [
  'Night Work',
  'Shift Work',
  'Driving/Mobile Plant',
  'Work At Height',
  'Confined Space',
  'Emergency Response',
  'Respirator Required',
  'PPE Required',
  'Heat Exposure',
  'Cold Exposure',
  'UV Exposure',
] as const

export type RoleCategory = (typeof roleOptions)[number]
export type Modifier = (typeof modifierOptions)[number]
export type ProfileStatus = 'Draft' | 'Submitted' | 'Approved' | 'Clarification requested' | 'Specialist review'
export type ReviewStatus = 'Not submitted' | 'Pending review' | 'Approved' | 'Clarification requested' | 'Specialist review'
export type ControlType =
  | 'Fully Enclosed'
  | 'Partially Enclosed'
  | 'Extraction'
  | 'Engineering Controls'
  | 'PPE Primary'
  | 'Open'
  | 'None'
  | 'Unknown'
export type ExposureFrequency =
  | 'Routine'
  | 'Most Shifts'
  | 'Regular'
  | 'Occasional'
  | 'Rare'
  | 'Unknown'

export interface HazardAssessment {
  id: string
  name: string
  controlType: ControlType
  exposureFrequency: ExposureFrequency
  score: number
  generatedAutomatically: boolean
}

export interface RoleProfile {
  id: string
  name: string
  description: string
  roles: RoleCategory[]
  modifiers: Modifier[]
  hazards: HazardAssessment[]
  status: ProfileStatus
  reviewStatus: ReviewStatus
  riskScore: number
  functionalAssessmentLevel: 1 | 3
  recommendation: string[]
  specialistReviewRequired: boolean
  owner: string
  submittedAt?: string
  clinicalNotes?: string
}
