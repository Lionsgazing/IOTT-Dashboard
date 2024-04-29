import {MQTTHandler} from "./pages/MQTTHandler"

export class mqtt_debug {
    private _mqtt_instance: MQTTHandler
    private _f: number
    private _last_x: number
    private _update_time_ms: number
    constructor(mqtt_instance: MQTTHandler, update_time_ms: number, f: number) {
        this._mqtt_instance = mqtt_instance
        this._f = f
        this._update_time_ms = update_time_ms
        this._last_x = 0
    }
    async debug() {
        //Set status
        await new Promise(f => setTimeout(f, this._update_time_ms));
        this._mqtt_instance.publish("status/raspberry-aalborg/connection", {status: "online"}, true)
        this._mqtt_instance.publish("status/raspberry-copenhagen/connection", {status: "online"}, true)
        this._mqtt_instance.publish("status/raspberry-silkeborg/connection", {status: "online"}, true)
        this._mqtt_instance.publish("status/raspberry-aarhus/connection", {status: "online"}, true)

        while(true) {
            await new Promise(f => setTimeout(f, this._update_time_ms));
    
            const new_x = this._update_time_ms/1000 + this._last_x
            this._last_x = new_x
    
            const data0 = Math.sin(2 * Math.PI * new_x * this._f)
            const data1 = Math.sin(2 * Math.PI * new_x * this._f + Math.PI/4) + Math.sin(2 * Math.PI * new_x * this._f * 1.5)
            const data2 = Math.sin(2 * Math.PI * new_x * this._f + Math.PI/2) + Math.sin(2 * Math.PI * new_x * this._f * 0.5)
            const data3 = Math.sin(2 * Math.PI * new_x * this._f + Math.PI/3) + Math.sin(2 * Math.PI * new_x * this._f * 2.5)

            const payload0 = {
                timestamp: new Date().getTime(),
                temperature: data0,
                pressure: -data0,
                humidity: data0 + 0.5 
            } 

            const payload1 = {
                timestamp: new Date().getTime(),
                temperature: data1,
                pressure: -data1,
                humidity: data1 + 0.5
            }  
            
            const payload2 = {
                timestamp: new Date().getTime(),
                temperature: data2,
                pressure: -data2,
                humidity: data2 + 0.5
            }  

            const payload3 = {
                timestamp: new Date().getTime(),
                temperature: data3,
                pressure: -data3,
                humidity: data3 + 0.5,
            }  

            this._mqtt_instance.publish("raspberry/Aalborg/sense-hat/readings/all_readings", payload0, false)
            this._mqtt_instance.publish("raspberry/Copenhagen/sense-hat/readings/all_readings", payload1, false)
            this._mqtt_instance.publish("raspberry/Silkeborg/sense-hat/readings/all_readings", payload2, false)
            this._mqtt_instance.publish("raspberry/Aarhus/sense-hat/readings/all_readings", payload3, false)
        }
    }
}