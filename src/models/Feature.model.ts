import type { Polygon as GeoPolygon, MultiPolygon as GeoMultiPolygon, LineString as GeoLineString, MultiLineString as GeoMultiLineString, Point as GeoPoint } from 'geojson'
import { bbox as turfBbox, area as turfArea, length as turfLength, lineString as turfLineString, multiPolygon as turfMultiPolygon, multiLineString as turfMultiLineString, polygon as turfPolygon, point as turfPoint } from '@turf/turf'
import { v4 as uuid } from 'uuid'
import { DISTANCE_SCALE } from '@/utils/constants'

export type RgbaColor = [number, number, number, number]

export type SupportedGeometry = GeoPolygon | GeoMultiPolygon | GeoLineString | GeoMultiLineString | GeoPoint

export interface FeatureProperties {
    id?: string
    name?: string
    fillColor?: RgbaColor
    lineColor?: RgbaColor
    lineWidth?: number
    widthScale?: string
    hideFill?: boolean
    hideLine?: boolean
    pointRadius?: number
    radiusScale?: string
    isHidden?: boolean
    area?: number
    perimeter?: number
    distance?: number
    shape?: string
    // allow arbitrary custom properties
    [key: string]: unknown
}

export const DEFAULT_PROPERTIES = [
    'id',
    'name',
    'fillColor',
    'lineColor',
    'lineWidth',
    'widthScale',
    'hideFill',
    'hideLine',
    'pointRadius',
    'radiusScale',
    'isHidden',
    'area',
    'perimeter',
    'distance',
    'shape',
] as const

export const CASCADABLE_PROPERTIES = [
    'fillColor',
    'lineColor',
    'lineWidth',
    'widthScale',
    'pointRadius',
    'radiusScale',
] as const

export const OMIT_PROPERTIES_FOR_EXPORT = [
    'fillColor',
    'lineColor',
    'lineWidth',
    'widthScale',
    'hideFill',
    'hideLine',
    'isHidden',
    'shape',
] as const

export const DISPLAYABLE_DEFAULT_PROPERTIES = [
    'id',
    'name',
    'area',
    'perimeter',
    'distance',
] as const

export const DEFAULT_STYLES: Record<'Polygon' | 'LineString' | 'Point', Partial<FeatureProperties>> = {
    Polygon: {
        fillColor: [66, 135, 245, 100],
        lineColor: [66, 135, 245, 255],
        lineWidth: 3,
        widthScale: DISTANCE_SCALE.mtrs.id,
        hideFill: false,
        hideLine: false,
    },
    LineString: {
        lineColor: [66, 135, 245, 255],
        lineWidth: 3,
        hideLine: false,
        widthScale: DISTANCE_SCALE.mtrs.id,
    },
    Point: {
        fillColor: [255, 255, 255, 100],
        lineColor: [66, 135, 245, 255],
        lineWidth: 10,
        widthScale: DISTANCE_SCALE.mtrs.id,
        radiusScale: DISTANCE_SCALE.mtrs.id,
        pointRadius: 30,
        hideFill: false,
        hideLine: false,
    },
}

export const FEATURE_TYPES = {
    Polygon: 'Polygon',
    MultiPolygon: 'MultiPolygon',
    LineString: 'LineString',
    MultiLineString: 'MultiLineString',
    Point: 'Point',
} as const

export interface ConstructorParams {
    type: 'Feature'
    geometry: SupportedGeometry
    properties: FeatureProperties
    style?: unknown
}

export default class FeatureModel {
    type: 'Feature'
    geometry: SupportedGeometry
    properties: FeatureProperties
    style?: unknown
    id?: string
    bbox?: [number, number, number, number]

    constructor({ type, geometry, properties, style }: ConstructorParams) {
        this.type = type
        this.geometry = geometry
        this.properties = properties
        this.style = style

        if (this.properties) {
            this.properties.id = this.properties.id || uuid()
            this.id = this.properties.id
            this.properties.name = this.properties.name || `${this.geometry.type}`
            this.properties.isHidden = this.properties.isHidden || false
        }

        switch (this.geometry.type) {
            case FEATURE_TYPES.Polygon:
            case FEATURE_TYPES.MultiPolygon: {
                try {
                    if (this.geometry.type === FEATURE_TYPES.MultiPolygon) {
                        const mp = turfMultiPolygon((this.geometry as GeoMultiPolygon).coordinates)
                        this.properties.area = turfArea(mp)
                        this.bbox = turfBbox(mp) as [number, number, number, number]
                    } else {
                        const p = turfPolygon((this.geometry as GeoPolygon).coordinates)
                        this.properties.area = turfArea(p)
                        this.properties.perimeter = turfLength(
                            turfLineString(((this.geometry as GeoPolygon).coordinates[0] as any))
                        )
                        this.bbox = turfBbox(p) as [number, number, number, number]
                    }
                } catch (error) {
                    console.log(error)
                }
                this.properties = {
                    ...DEFAULT_STYLES.Polygon,
                    ...this.properties,
                }
                break
            }
            case FEATURE_TYPES.LineString: {
                try {
                    const ls = turfLineString((this.geometry as GeoLineString).coordinates)
                    this.properties.distance = turfLength(ls)
                    this.bbox = turfBbox(ls) as [number, number, number, number]
                } catch (error) {
                    console.log(error)
                }
                this.properties = {
                    ...DEFAULT_STYLES.LineString,
                    ...this.properties,
                }
                break
            }
            case FEATURE_TYPES.MultiLineString: {
                try {
                    const mls = turfMultiLineString((this.geometry as GeoMultiLineString).coordinates)
                    this.properties.distance = turfLength(mls)
                    this.bbox = turfBbox(mls) as [number, number, number, number]
                } catch (error) {
                    console.log(error)
                }
                this.properties = {
                    ...DEFAULT_STYLES.LineString,
                    ...this.properties,
                }
                break
            }
            case FEATURE_TYPES.Point: {
                try {
                    const p = turfPoint((this.geometry as GeoPoint).coordinates)
                    this.bbox = turfBbox(p) as [number, number, number, number]
                } catch (error) {
                    console.error(error)
                }
                this.properties = {
                    ...DEFAULT_STYLES.Point,
                    ...this.properties,
                }
                break
            }
        }
    }
}


