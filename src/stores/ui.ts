import { defineStore } from 'pinia'

/**
* Управляет состоянием UI: модальные окна и флаги доступа.
*/
export const useUIStore = defineStore('UI', {
    state: () => ({
        // комментарии: состояние UI
        showImportModal: true,
        showMapSearch: true,
        accessFlags: {
            isShapesEditable: true,
            isMapEditable: true,
            showTools: true,
            showLayers: true,
            showShareOptions: true,
            showExportOptions: true,
            canDeleteProject: true,
            canChangeProjectName: true,
        } as Record<string, boolean>,
    }),
    getters: {
        // комментарии: геттеры повторяют имена из legacy
        showImportModal: (s) => s.showImportModal,
        showMapSearch: (s) => s.showMapSearch,
        getAccessFlags: (s) => s.accessFlags,
    },
    actions: {
        /**
        * Показ модального окна импорта
        */
        setShowImportModal(show: boolean) {
            this.showImportModal = show
        },
        /**
        * Показ поиска по карте
        */
        setShowMapSearch(show: boolean) {
            this.showMapSearch = show
        },
        /**
        * Установка флагов доступа
        */
        setAccessFlags(flags: Record<string, boolean>) {
            this.accessFlags = Object.freeze({ ...this.accessFlags, ...flags })
        },
        /**
        * Сброс состояния
        */
        reset() {
            this.$reset()
        },
    },
})