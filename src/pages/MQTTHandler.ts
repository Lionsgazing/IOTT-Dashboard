
import mqtt from "mqtt";
import { MQTT, MQTT_Connection_Options, MQTT_Subscription_Options, Message } from "../lib/mqtt.ts";
import { replaceAll } from "../lib/replaceAll.ts";

export type SubscribtionsData = {
    subscribtions: string[]
    callback: (<T extends object>(topic: string, payload: T, extra: any) => void)
    callback_extra: any
}

export class MQTTHandler {
    private _mqtt: MQTT
    private _mqtt_connection_options: MQTT_Connection_Options
    private _mqtt_subscription_options: MQTT_Subscription_Options
    private _subscribtionsData: SubscribtionsData[]

    constructor(mqtt_connection_options: MQTT_Connection_Options, subscribtionsData: SubscribtionsData[]) {
        //Save given parameters
        this._mqtt_connection_options = mqtt_connection_options
        this._subscribtionsData = subscribtionsData
        
        //Unpack subscribtion object to get actual subscribtion topics
        let total_subscribtions: string[] = []
        for (const subscribtionData of subscribtionsData) {
            for (const subscribtion of subscribtionData.subscribtions) {
                total_subscribtions.push(subscribtion)
            }
        }

        //Create mqtt_subscription_options
        this._mqtt_subscription_options = {
            onMessageCallback: MQTTHandler.onMessage,
            onMessageCallbackExtra: this,
            subscribtions: total_subscribtions
        }

        //Create MQTT instance
        this._mqtt = new MQTT(this._mqtt_connection_options, this._mqtt_subscription_options)  
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
            console.warn("[MQTTHandler] JSON payload parsing failed... Ignoring payload...")
            return
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