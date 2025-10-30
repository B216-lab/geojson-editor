import { defineStore } from 'pinia'
import MapStyle from '@/models/MapStyle.model'

export const MAP_STYLES = [
    { id: 'mapbox-simple', name: 'Simple', url: 'mapbox://styles/haxzie/ck2yi2gwu3gpx1co4b9ivyhbl' },
    { id: 'mapbox-satellite-streets', name: 'Satellite-Streets', url: 'mapbox://styles/mapbox/satellite-streets-v11' },
    { id: 'mapbox-black-and-white', name: 'Black and White', url: 'mapbox://styles/haxzie/ckgt77gyq0vyt1amneqvdgmra' },
    { id: 'mapbox-lights', name: 'Light', url: 'mapbox://styles/haxzie/ck35bh5u809rl1cmsgwk9uow1' },
    { id: 'mapbox-dark', name: 'Dark', url: 'mapbox://styles/haxzie/ck35bhm884p391cm7k0pj0p4g' },
    { id: 'mapbox-frozen-city', name: 'Frozen City', url: 'mapbox://styles/haxzie/ck0aovhaa389j1cpdls6va2f1' },
    { id: 'mapbox-morning-star', name: 'Morning Snow', url: 'mapbox://styles/haxzie/ck0cctlg503xe1co6hmx1kunx' },
]

export const DEFAULT_MAP_STYLE = 'mapbox-dark'

export const useMapStore = defineStore('map', {
    state: () => ({
        mapStyles: MAP_STYLES,
        activeMapStyle: DEFAULT_MAP_STYLE,
        isSyncEnabled: false,
        showMapLabels: true,
        useExactDimensions: false,
        searchLocation: null as [number, number] | null,
        temporarySearchMarkerLocation: null as [number, number] | null,
        showPropertiesPopup: true,
        geojson: { type: 'FeatureCollection', features: [] as any[] },
        viewState: undefined as any,
    }),
    getters: {
        getAllMapStyles(): Record<string, MapStyle> {
            return MAP_STYLES.reduce((result, next) => {
                result[next.id] = new MapStyle({ ...next })
                return result
            }, {} as Record<string, MapStyle>)
        },
        getActiveMapStyleId: (s) => s.activeMapStyle,
        getActiveMapStyleURL(): string | undefined {
            const found = MAP_STYLES.find((m) => m.id === this.activeMapStyle)
            return found?.url
        },
        getShowMapLabels: (s) => s.showMapLabels,
        getViewState: (s) => s.viewState,
        getUseExactDimensions: (s) => s.useExactDimensions,
        getShowPropertiesPopup: (s) => s.showPropertiesPopup,
        getSearchLocation: (s) => s.searchLocation,
        getTemporarySearchMarkerLocation: (s) => s.temporarySearchMarkerLocation,
    },
    actions: {
        setActiveMapStyleId(id: string) {
            this.activeMapStyle = id
            this.sync()
        },
        setShowMapLabels(show: boolean) {
            this.showMapLabels = show
            this.sync()
        },
        setUseExactDimensions(value: boolean) {
            this.useExactDimensions = value
            this.sync()
        },
        setShowPropertiesPopup(show: boolean) {
            this.showPropertiesPopup = show
            this.sync()
        },
        setSearchLocation(location: [number, number] | null) {
            this.searchLocation = location
        },
        setTemporarySearchMarkerLocation(location: [number, number] | null) {
            this.temporarySearchMarkerLocation = location
            if (location) {
                setTimeout(() => {
                    this.temporarySearchMarkerLocation = null
                }, 2000)
            }
        },
        loadMapState(mapState?: any) {
            if (mapState) {
                const { mapStyleId, showMapLables, viewState, useExactDimensions } = mapState
                if (mapStyleId) this.setActiveMapStyleId(mapStyleId)
                this.setShowMapLabels(!!showMapLables)
                if (viewState) this.setViewState(viewState)
                this.setUseExactDimensions(!!useExactDimensions)
                this.setShowPropertiesPopup(false)
            }
            this.isSyncEnabled = true
        },
        setViewState(viewState: any) {
            this.viewState = viewState
        },
        sync() {
            if (!this.isSyncEnabled) return
            // placeholder for remote sync integration
        },
        reset() {
            this.$reset()
        },
    },
})


