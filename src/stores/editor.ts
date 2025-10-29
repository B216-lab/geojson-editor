import { defineStore } from 'pinia'

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
            const shouldFadeUnselected = state.selectedFeatureIds.length > 0
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
                    .map((id) => {
                        const isSelected = state.selectedFeatureIds.includes(id)
                        const f = state.features[id]
                        const props = f.properties || {}
                        const adjustOpacity = (hex: string, a: number) => {
                            // комментарии: упрощённая функция; перенести из utils при наличии
                            return hex
                        }
                        return {
                            ...f,
                            properties: {
                                ...props,
                                ...(shouldFadeUnselected && !isSelected && props.fillColor
                                    ? { fillColor: adjustOpacity(props.fillColor, 0.2) }
                                    : {}),
                                ...(shouldFadeUnselected && !isSelected && props.lineColor
                                    ? { lineColor: adjustOpacity(props.lineColor, 0.2) }
                                    : {}),
                            },
                        }
                    }),
            }
        },
        /**
        * Флаг генерации изображений (исправленное имя)
        */
        isGeneratingImage: (s) => s.isGeneratingImage,
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
        setActiveEditMode(mode: any) {
            this.activeEditMode = mode
        },
        /**
        * Выбор/подсветка фич
        */
        setSelectedFeatureIds(ids: string[]) {
            this.selectedFeatureIds = ids
        },
    },
})