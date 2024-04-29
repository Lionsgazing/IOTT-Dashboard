export type MQTTConfig = {
    devices: 
        {
            id: string
            data_topic: string
            status_topic: string
        }[]
}

export type DashboardConfig = {
    tabify: boolean
    graphs: {
        title: string
        id_link: string
        display_y_axis: string[]
        display_x_axis: string
        width: string
        height: string
    }[]
}