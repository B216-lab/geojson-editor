export type DistanceScaleItem = { name: string; id: string; scale: number }
export type DistanceScale = Record<'mtrs' | 'miles' | 'kms', DistanceScaleItem>

export const DISTANCE_SCALE: DistanceScale = {
    mtrs: { name: 'Mtrs', id: 'mtrs', scale: 1 },
    miles: { name: 'Miles', id: 'miles', scale: 1609.34 },
    kms: { name: 'Kms', id: 'kms', scale: 1000 },
}

export const PROJECT_ACTIONS = {
    UPDATE_STATE: 'UPDATE_STATE',
    UPDATE_TITLE: 'UPDATE_TITLE',
    UPDATE_FEATURES: 'UPDATE_FEATURES',
    UPDATE_FEATURE_ORDER: 'UPDATE_FEATURE_ORDER',
    DELETE_FEATURES: 'DELETE_FEATURES',
    UPDATE_DESCRIPTION: 'UPDATE_DESCRIPTION',
    UPDATE_COVER: 'UPDATE_COVER',
} as const


