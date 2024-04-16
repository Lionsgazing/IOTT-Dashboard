import { MQTT, MQTT_Connection_Options, Message } from "../lib/mqtt.ts";

export type SubscribtionsData = {
    subscribtions: string[]
    callback: (<T extends object>(topic: string, payload: T, extra: any) => void)
    callback_extra: any
}

export class MQTTHandler {
    private _mqtt: MQTT
    private _mqtt_connection_options: MQTT_Connection_Options
    private _subscribtionsData: SubscribtionsData[]

    constructor(subscribtionsData: SubscribtionsData[]) {
        //Unpack subscribtion object to get actual subscribtion topics
        let total_subscribtions: string[] = []
        for (const subscribtionData of subscribtionsData) {
            for (const subscribtion of subscribtionData.subscribtions) {
                total_subscribtions.push(subscribtion)
            }
        }

        //Save subscribtion data
        this._subscribtionsData = subscribtionsData

        //Create connection options for the MQTT
        this._mqtt_connection_options = {
            host: "127.0.0.1",
            port: 8883, //Websocket port on broker
            username: "",
            password: "",
            useSSL: false,

            subscribtions: total_subscribtions,

            onMessageCallback: MQTTHandler.onMessage,
            onMessageCallbackExtra: this,

            client_id: "IOTT_Dashboard-" + String(new Date().getTime())
        }

        //Create MQTT instance
        this._mqtt = new MQTT(this._mqtt_connection_options)
    }

    public publish(topic: string, payload: object, retained: boolean = false) {
        this._mqtt.publish(topic, payload, retained)
    }

    static onMessage(msg: Message, extra: any) {
        const mqtt_instance: MQTTHandler = extra
        const topic: string = msg.destinationName
        const json_payload: object = JSON.parse(msg.payloadString)

        //Find topic match and decide where to sent it.
        // Go through each subscribtionsData
        for (const subscribtionData of mqtt_instance._subscribtionsData) {
            //Go through each subscribtion
            for (const subscribtion of subscribtionData.subscribtions) {
                if (subscribtion == topic) {
                    //Found match so do callback and return.
                    subscribtionData.callback(topic, json_payload, subscribtionData.callback_extra)
                    return
                }
            }
        }
    }
}