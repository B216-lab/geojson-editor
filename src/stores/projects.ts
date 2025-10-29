import { defineStore } from 'pinia'
import Project, { PROJECT_ACCESS } from '@/models/Project.model'
import { v4 as uuid } from 'uuid'

export const useProjectsStore = defineStore('projects', {
    state: () => ({
        activeProject: null as Project | null,
        activeProjectAccess: PROJECT_ACCESS.READ as typeof PROJECT_ACCESS[keyof typeof PROJECT_ACCESS],
        projectIds: [] as string[],
        projects: {} as Record<string, Project>,
    }),
    getters: {
        getProjects: (s) => {
            return s.projectIds
                .map((key) => s.projects[key])
                .filter((p): p is Project => Boolean(p))
                .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
        },
        getActiveProject: (s) => s.activeProject,
        getActiveProjectId: (s) => s.activeProject?.id,
        getActiveProjectAccess: (s) => s.activeProjectAccess,
    },
    actions: {
        async initializeProject() {
            try {
                const project = new Project({
                    _id: uuid(),
                    title: 'Untitled Project',
                    description: '',
                    state: {},
                    featureIds: [],
                    features: {},
                    createdBy: null,
                    isArchived: false,
                    lastOpenedAt: new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    cover: null,
                })
                this.setActiveProject(project)
                // OWNER access by default for local editing
                this.setAccess(PROJECT_ACCESS.OWNER)
                return project
            } catch (error) {
                console.error(error)
                return false
            }
        },
        setActiveProject(project: Project) {
            this.activeProject = project
        },
        setAccess(access: typeof PROJECT_ACCESS[keyof typeof PROJECT_ACCESS]) {
            this.activeProjectAccess = access
        },
        async sync(_: any) {
            // no-op placeholder; integrate backend here if needed
        },
        clearProjects() {
            this.projects = {}
            this.projectIds = []
        },
        reset() {
            this.$reset()
        },
    },
})


