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
        while(true) {
            await new Promise(f => setTimeout(f, this._update_time_ms));
    
            const new_x = this._update_time_ms/1000 + this._last_x
            this._last_x = new_x
    
            const data0 = Math.sin(2 * Math.PI * new_x * this._f)
            const data1 = Math.sin(2 * Math.PI * new_x * this._f + Math.PI/4) + Math.sin(2 * Math.PI * new_x * this._f * 2.5)
    
            const payload0 = {
                timestamp: new Date().getTime(),
                data: data0,
            } 

            const payload1 = {
                timestamp: new Date().getTime(),
                data: data1,
            }  
            
    
            this._mqtt_instance.publish("IOTT/Data/Dev0", payload0, false)
            this._mqtt_instance.publish("IOTT/Data/Dev1", payload1, false)
    
            console.log("Publish")
        }
    }
}