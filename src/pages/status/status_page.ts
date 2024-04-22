import { MQTTConfig } from "../../config"
import { SmartText } from "../../lib/bootstrap/smarttext"
import { dom } from "../../lib/dom/dom"

export class StatusPage {
    private _Container: HTMLDivElement

    get Content() {
        return this._Container
    }
    
    constructor(mqtt_config: MQTTConfig) {
        //Create container
        this._Container = dom.div("d-flex flex-grow-1 p-4")

        //Row container
        const row_container = dom.div("col")

        //Create UI Layout        
        const device_status_header = dom.h2("MQTT Device Status")
        const device_status_header_seperator = dom.hr()
        const column_device_status = dom.div("col", [device_status_header, device_status_header_seperator])
        const row0 = dom.div("row", [column_device_status])

        const text = new SmartText({type: "h4", contents: ["Hi ", "there"], colors: ["", "#FF00FF"]})
        const row1 = dom.div("row", [text.Content])

         

        //this._Container.appendChild(device_status_header)
        row_container.appendChild(row0)
        row_container.appendChild(row1)
        this._Container.appendChild(row_container)
    }

    public async Setup() {
        
    }

    static onMqttMessage(topic: string, json_payload: object, extra: any) {
        const page_instance: StatusPage = extra
    }
}