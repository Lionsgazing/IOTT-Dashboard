import mqtt from "mqtt"
import { MQTTConfig } from "../../config"
import { SmartText } from "../../lib/bootstrap/smarttext"
import { dom } from "../../lib/dom/dom"
import { DeviceStatus } from "./status"

export class StatusPage {
    private _Container: HTMLDivElement

    get Content() {
        return this._Container
    }

    private _deviceStatusObjects: DeviceStatus[]
    
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
        row_container.appendChild(row0)

        //Read mqtt config and create devices status
        this._deviceStatusObjects = []
        for (const device of mqtt_config.devices) {
            const deviceStatusObject = new DeviceStatus({device_name: device.id, initial_state: false, id: device.status_topic})
            this._deviceStatusObjects.push(deviceStatusObject)
            const row = dom.div("row", [deviceStatusObject.Content])     
            row_container.appendChild(row)
        }
    
        //this._Container.appendChild(device_status_header)
        this._Container.appendChild(row_container)
    }

    public async Setup() {
        
    }

    static onMqttMessage(topic: string, json_payload: object, extra: any) {
        const page_instance: StatusPage = extra[0]
        const payload: {status: string} = json_payload
        
        //Get deviceStatusObject, Find matching id and update acording to the status.
        const deviceStatusObjects = page_instance._deviceStatusObjects
        for (const deviceStatusObject of deviceStatusObjects) {
            if (deviceStatusObject.ID === topic) {
                if (payload.status == "online") {
                    deviceStatusObject.IsOnline = true
                }
                else {
                    deviceStatusObject.IsOnline = false
                }

                break
            }
        }
    }
}