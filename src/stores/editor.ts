import { defineStore } from 'pinia'
import FeatureModel, { CASCADABLE_PROPERTIES } from '@/models/Feature.model'

export const MAP_TOOLS = {
    select: { id: 'select', name: 'Select Tool', description: 'Helps you select existing shapes, modify, transform or delete them.', icon: 'mdi:cursor-default-outline', cursor: 'default', shortcut: 'v' },
    polygon: { id: 'polygon', name: 'Polygon Tool', description: 'Helps you draw a Polygon by clicking and specifying the vertices.', icon: 'mdi:shape-outline', cursor: 'crosshair', shortcut: 'p' },
    rectangle: { id: 'rectangle', name: 'Rectangle Tool', description: 'Helps you draw a Rectangle by clicking a start corner and end corner.', icon: 'mdi:shape-outline', cursor: 'crosshair', shortcut: 'r' },
    ellipse: { id: 'ellipse', name: 'Ellipse Tool', description: 'Helps you draw a polygonal Ellipse by clicking a center point and an end point from the center as radius.', icon: 'mdi:shape-outline', cursor: 'crosshair', shortcut: 'e' },
    line: { id: 'line', name: 'LineString Tool', description: 'Helps you draw a LineString by clicking and specifying the vertices.', icon: 'mdi:vector-line', cursor: 'crosshair', shortcut: 'l' },
    point: { id: 'point', name: 'Point Tool', description: 'Helps you draw a single Point by clicking anywhere on the map', icon: 'mdi:map-marker-outline', cursor: 'crosshair', shortcut: 'o' },
    measure: { id: 'measure', name: 'Measure Tool', description: 'Helps you measure distance between multiple points on the map.', icon: 'mdi:ruler', cursor: 'crosshair', shortcut: 'm' },
} as const

export const EDITING_MODE = {
    transform: { id: 'transform', name: 'Transform', cursor: 'crosshair' },
    modify: { id: 'modify', name: 'Modify', cursor: 'crosshair' },
} as const

/**
* Управляет состоянием редактора: активные инструменты, выделение, фичи, bbox.
*/
export const useEditorStore = defineStore('editor', {
    state: () => ({
        filename: 'Untitled File',
        geoJson: Object.freeze({ type: 'FeatureCollection', features: [] as any[] }),
        features: {} as Record<string, any>,
        featureIds: [] as string[],
        shouldCascadeFeatureProperties: true,
        cascadeFeatureProperties: {} as Record<string, any>,
        boundingBox: null as any,
        activeTool: 'select' as string | null,
        activeEditMode: null as any,
        hoveredFeatureId: null as string | null,
        selectedFeatureIds: [] as string[],
        focusedFeatureId: null as string | null,
        isGeneratingImage: false,
    }),
    getters: {
        /**
        * Возвращает GeoJSON с визуальными модификаторами выделения
        */
        getGeoJson(state) {
            return {
                type: 'FeatureCollection',
                features: [...state.featureIds]
                    .filter((featureId) => {
                        const f = state.features[featureId]
                        if (!f) return false
                        if (f.properties?.isHidden) return false
                        if (state.activeEditMode && state.selectedFeatureIds.includes(featureId)) return false
                        return true
                    })
                    .map((id) => state.features[id]),
            }
        },
        getFeatures(state) {
            return [...state.featureIds].reverse().map((id) => ({ ...state.features[id], isSelected: state.selectedFeatureIds.includes(id) }))
        },
        getActiveEditMode: (s) => s.activeEditMode,
        getActiveTool: (s) => s.activeTool,
        getHoveredFeatureId: (s) => s.hoveredFeatureId,
        getSelectedFeatureIds: (s) => s.selectedFeatureIds || [],
        getSelectedFeatures: (s) => s.selectedFeatureIds?.map((id) => s.features[id]),
        getFocusedFeature: (s) => (s.focusedFeatureId && s.features[s.focusedFeatureId]) || null,
        isGeneratingImage: (s) => s.isGeneratingImage,
        getBoundingBox: (s) => s.boundingBox,
    },
    actions: {
        /**
        * Установка имени файла
        */
        setFilename(name: string) {
            this.filename = name
        },
        /**
        * Установка GeoJSON
        */
        setGeoJson(geo: any) {
            this.geoJson = Object.freeze(geo)
        },
        syncFileName() {
            // placeholder for remote sync
        },
        /**
        * Сброс состояния
        */
        reset() {
            this.$reset()
        },
        /**
        * Установка активного инструмента
        */
        setActiveTool(tool: string | null) {
            this.activeTool = tool
        },
        /**
        * Установка активного режима редактирования
        */
        setActiveEditMode({ mode, featureId }: { mode: string | null; featureId?: string | null }) {
            this.selectedFeatureIds = featureId ? [featureId] : []
            this.activeEditMode = mode
        },
        setHoveredFeatureId(featureId: string | null) {
            this.hoveredFeatureId = featureId
        },
        setSelectedFeatureIds(featureIds: string[]) {
            this.selectedFeatureIds = featureIds
        },
        selectAllFeatures() {
            this.selectedFeatureIds = this.featureIds
        },
        customSelectFeatureId({ featureId, deselect, isMultiSelect }: { featureId: string; deselect?: boolean; isMultiSelect?: boolean }) {
            const ids = [...this.featureIds].reverse()
            if (!featureId) return
            if (deselect) {
                this.selectedFeatureIds = this.selectedFeatureIds.filter((id) => id !== featureId)
            } else if (isMultiSelect) {
                if (this.selectedFeatureIds.length > 0) {
                    const lastIdx = this.selectedFeatureIds.reduce((result, item) => Math.max(result, ids.indexOf(item)), -1)
                    if (lastIdx > -1) {
                        let fidx = ids.indexOf(featureId)
                        if (fidx > lastIdx) fidx += 1
                        const min = Math.min(lastIdx, fidx)
                        const max = Math.max(lastIdx, fidx)
                        const selectedIds = ids.slice(min, max)
                        this.selectedFeatureIds = [...new Set([...this.selectedFeatureIds, ...selectedIds])]
                    }
                }
            } else {
                if (this.selectedFeatureIds.includes(featureId)) {
                    this.selectedFeatureIds = this.selectedFeatureIds.filter((id) => id !== featureId)
                } else {
                    this.selectedFeatureIds = [...this.selectedFeatureIds, featureId]
                }
            }
        },
        setCascadeFeatureProperties({ featureType, properties }: { featureType: string; properties: Record<string, any> }) {
            this.cascadeFeatureProperties = Object.freeze({
                ...this.cascadeFeatureProperties,
                [featureType]: { ...(this.cascadeFeatureProperties[featureType] || {}), ...properties },
            })
        },
        setFocusedFeatureId(featureId: string | null) {
            this.focusedFeatureId = featureId
        },
        setFeatureIdList({ featureIds }: { featureIds: string[] }) {
            this.featureIds = featureIds
        },
        setFeatures({ features, featureIds }: { features: Record<string, any>; featureIds?: string[] }) {
            this.featureIds = featureIds || Object.keys(features)
            this.features = features
        },
        updateFeaturePosition({ fromIndex, toIndex }: { fromIndex: number; toIndex: number }) {
            const featureIdsCopy = [...this.featureIds]
            const fi = featureIdsCopy.length - fromIndex - 1
            const ti = featureIdsCopy.length - toIndex - 1
            const element = featureIdsCopy[fi] as string
            featureIdsCopy.splice(fi, 1)
            featureIdsCopy.splice(ti, 0, element)
            this.featureIds = featureIdsCopy
        },
        updateFeatureProperties({ featureId, properties, geometry, replaceProperties }: { featureId: string; properties?: any; geometry?: any; replaceProperties?: boolean }) {
            const existing = this.features[featureId]
            const updated = new (FeatureModel as any)({
                ...existing,
                geometry: { ...existing?.geometry, ...geometry },
                properties: { ...(replaceProperties ? {} : existing?.properties), ...properties },
            })
            this.setFeatures({ features: { ...this.features, [featureId]: updated }, featureIds: this.featureIds })
            if (properties && Object.keys(properties).length) {
                const cascade = Object.keys(properties).reduce((result, key) => {
                    if ((CASCADABLE_PROPERTIES as readonly string[]).includes(key)) {
                        return { ...result, [key]: (properties as any)[key] }
                    }
                    return result
                }, {} as Record<string, any>)
                this.setCascadeFeatureProperties({ featureType: String(updated.geometry.type), properties: cascade })
            }
        },
        updateMultipleFeatureProperties({ featureIds, properties }: { featureIds: string[]; properties: Record<string, any> }) {
            const updated = featureIds.reduce((acc, id) => {
                const f = this.features[id]
                if (!f) return acc
                const u = new (FeatureModel as any)({ ...f, properties: { ...(f as any).properties, ...properties } })
                acc[id] = u
                return acc
            }, {} as Record<string, any>)
            this.setFeatures({ features: { ...this.features, ...updated }, featureIds: this.featureIds })
        },
        addGeoJsonFeatures({ features, shouldUpdateBBOX, cascadeStyles = true }: { features: any[]; shouldUpdateBBOX?: boolean; cascadeStyles?: boolean }) {
            const lastIndex: Record<string, number> = { Polygon: 0, MultiPolygon: 0, LineString: 0, Point: 0, MultiLineString: 0 }
            Object.values(this.features).forEach((feature: any) => {
                const name = feature.properties?.name as string
                const type = feature.geometry?.type as string
                const match = new RegExp(`${type} ([0-9]+)`).exec(name || '')
                if (match) lastIndex[type] = Math.max((lastIndex as any)[type] || 0, parseInt(match[1] || '0'))
            })
            const toAdd = features.reduce((result, feature, index) => {
                const type = String(feature.geometry.type)
                const item = new (FeatureModel as any)({
                    ...feature,
                    properties: {
                        ...feature.properties,
                        ...((cascadeStyles && this.shouldCascadeFeatureProperties && this.cascadeFeatureProperties[type]) || {}),
                        ...(feature.properties?.name?.length
                            ? {}
                            : { name: `${type} ${((lastIndex as any)[type] || 0) + index + 1}` }),
                    },
                })
                return { ...result, [item.properties.id as string]: { ...item } }
            }, {} as Record<string, any>)
            const newFeatures = { ...this.features, ...toAdd }
            const addedIds = Object.keys(toAdd)
            const newIds = [...[...addedIds].reverse(), ...this.featureIds]
            this.setFeatures({ features: newFeatures, featureIds: newIds })
            setTimeout(() => {
                this.selectedFeatureIds = addedIds
            }, 100)
            if (shouldUpdateBBOX) this.updateBoundingBox()
        },
        deleteSelectedFeatures() {
            const toDelete = [...this.selectedFeatureIds]
            this.setSelectedFeatureIds([])
            this.setHoveredFeatureId(null)
            const featureIds = this.featureIds.filter((id) => toDelete.indexOf(id) === -1)
            this.setFeatures({ features: Object.fromEntries(Object.entries(this.features).filter(([k]) => !toDelete.includes(k))), featureIds })
        },
        deleteFeatureById({ featureId }: { featureId: string }) {
            if (this.selectedFeatureIds?.includes(featureId)) {
                this.setSelectedFeatureIds(this.selectedFeatureIds.filter((id) => id !== featureId))
            }
            if (this.hoveredFeatureId === featureId) this.setHoveredFeatureId(null)
            const featureIds = this.featureIds.filter((id) => id !== featureId)
            const { [featureId]: _, ...rest } = this.features
            this.setFeatures({ features: rest, featureIds })
        },
        async updateBoundingBox({ bbox }: { bbox?: [[number, number], [number, number]] } = {}) {
            if (bbox) {
                this.boundingBox = bbox
                return
            }
            try {
                // compute bbox from current geojson
                const all = this.getGeoJson as any
                if (all?.features?.length) {
                    const { bbox } = await import('@turf/turf')
                    const b = bbox(all)
                    this.boundingBox = [[b[0], b[1]], [b[2], b[3]]] as any
                } else {
                    this.boundingBox = null
                }
            } catch (e) {
                console.error(e)
            }
        },
        async loadEditorData({ title, features }: { title: string; features: Record<string, any> }) {
            this.setFilename(title)
            this.setFeatures({ features: features || {}, featureIds: (features && Object.keys(features).reverse()) || [] })
            this.updateBoundingBox()
        },
    },
})