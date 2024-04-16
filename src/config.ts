export type MQTTConfig = {
    base_topic: string
    devices: 
        {
            id: string
            data_topic: string
        }[]
}

export type DashboardConfig = {
    tabify: boolean
    graphs: {
        title: string
        id_link: string
        display: string[]
        width: string
        height: string
    }[]
}