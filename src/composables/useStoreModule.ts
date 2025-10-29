import { useUIStore } from '@/stores/ui'
import { useEditorStore } from '@/stores/editor'
import { useMapStore } from '@/stores/map'
import { useProjectsStore } from '@/stores/projects'

/**
* Совместимость с legacy: возвращает объект, похожий на useStoreModule из Vuex-обёртки.
*/
export function useStoreModule(moduleName: 'UI' | 'editor' | 'map' | 'projects') {
    const store =
        moduleName === 'UI' ? useUIStore() :
            moduleName === 'editor' ? useEditorStore() :
                moduleName === 'map' ? useMapStore() :
                    useProjectsStore()

    const getters = new Proxy(store as any, {
        get(target, prop: string) {
            return (target as any)[prop]
        },
    })

    return {
        state: (store as any).$state,
        getters,
        actions: store,
    }
}