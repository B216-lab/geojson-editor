export interface MapStyleParams {
    id: string
    name: string
    url: string
}

export default class MapStyle {
    id: string
    name: string
    url: string
    image: string

    constructor({ id, name, url }: MapStyleParams) {
        this.id = id
        this.name = name
        this.url = url
        this.image = this.generateMapboxThumbnailURL(url)
    }

    generateMapboxThumbnailURL(url: string): string {
        const token = (import.meta as any).env?.VITE_APP_MAPBOX_TOKEN || ''
        return `https://api.mapbox.com/styles/v1/${url.slice(16, url.length)}/static/-122.4241,37.78,14.25,0,0/200x200?access_token=${token}`
    }
}


