import { timeAgo } from '@/utils/DateFormatter'

export const PROJECT_ACCESS = {
    READ: 'READ',
    WRITE: 'WRITE',
    OWNER: 'OWNER',
} as const

export type ProjectAccess = typeof PROJECT_ACCESS[keyof typeof PROJECT_ACCESS]

export interface ProjectParams {
    _id: string
    title: string
    description: string
    state: Record<string, unknown>
    featureIds: string[]
    features: Record<string, unknown>
    createdBy: string | null
    isArchived: boolean
    lastOpenedAt: string
    createdAt: string
    updatedAt: string
    cover: string | null
}

export default class Project {
    id: string
    title: string
    description: string
    state: Record<string, unknown>
    featureIds: string[]
    features: Record<string, unknown>
    createdBy: string | null
    isArchived: boolean
    lastOpenedAt: string
    createdAt: string
    updatedAt: string
    cover: string | null
    _createdAt: string
    _lastOpenedAt: string
    _updatedAt: string

    constructor({
        _id,
        title,
        description,
        state,
        featureIds,
        features,
        createdBy,
        isArchived,
        lastOpenedAt,
        createdAt,
        updatedAt,
        cover,
    }: ProjectParams) {
        this.id = _id
        this.title = title
        this.description = description
        this.state = state
        this.featureIds = featureIds
        this.features = features
        this.createdBy = createdBy
        this.isArchived = isArchived
        this.lastOpenedAt = lastOpenedAt
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.cover = cover
        this._createdAt = timeAgo(createdAt)
        this._lastOpenedAt = timeAgo(lastOpenedAt)
        this._updatedAt = timeAgo(updatedAt)
    }
}


