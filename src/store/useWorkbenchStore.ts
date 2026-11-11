import { create } from 'zustand'
import { demoProfiles } from '../data/mockData'
import type { RoleProfile, ReviewStatus } from '../types'

interface WorkbenchState {
  profiles: RoleProfile[]
  saveProfile: (profile: RoleProfile) => void
  updateReview: (id: string, reviewStatus: ReviewStatus, clinicalNotes?: string) => void
}

export const useWorkbenchStore = create<WorkbenchState>((set) => ({
  profiles: demoProfiles,
  saveProfile: (profile) =>
    set((state) => ({
      profiles: state.profiles.some((item) => item.id === profile.id)
        ? state.profiles.map((item) => (item.id === profile.id ? profile : item))
        : [profile, ...state.profiles],
    })),
  updateReview: (id, reviewStatus, clinicalNotes) =>
    set((state) => ({
      profiles: state.profiles.map((profile) =>
        profile.id === id
          ? {
              ...profile,
              reviewStatus,
              status:
                reviewStatus === 'Approved'
                  ? 'Approved'
                  : reviewStatus === 'Clarification requested'
                    ? 'Clarification requested'
                    : reviewStatus === 'Specialist review'
                      ? 'Specialist review'
                      : profile.status,
              clinicalNotes,
              specialistReviewRequired:
                reviewStatus === 'Specialist review' || profile.specialistReviewRequired,
            }
          : profile,
      ),
    })),
}))
