import { MQTT, MQTT_Connection_Options, Message } from "../lib/mqtt.ts";
import { replaceAll } from "../lib/replaceAll.ts";

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

        console.log(total_subscribtions)

        //Save subscribtion data
        this._subscribtionsData = subscribtionsData

        //Create connection options for the MQTT
        this._mqtt_connection_options = {
            host: "wss.niels-bjorn.dk",
            port: 443, //Websocket port on broker
            username: "rpimqttclientb",
            password: "pD2l0bYEw",
            useSSL: true,

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

        //Ensure that "" are used and not ''.
        const payloadstr = replaceAll(msg.payloadString, "'", '"')
        
        let json_payload: object = {}
        try {
            json_payload = JSON.parse(payloadstr)
        }
        catch {
            console.log("JSON payload parsing failed...")
        }


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