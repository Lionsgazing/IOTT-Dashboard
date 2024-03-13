import { dom } from "./dom/dom"
import * as echarts from 'echarts'

export class Graph {
    private _Container: HTMLDivElement
    private _Graph: echarts.ECharts

    get Content() {
        return this._Container
    }

    constructor(target_container: HTMLDivElement) {
        //Save container
        this._Container = target_container
        this._Graph = echarts.init(this._Container)

        //Create echarts graph
        this._Graph.setOption({
            xAxis: {
                type: "value",
            },
            yAxis: {
                type: "value",
            },
            series: [
                {
                    type: "line",
                    data: [
                        [1, 2],
                        [2, 2],
                        [3, 2],
                        [4, 2]
                    ],
                    encode: {x: [0], y: [1]}
                }
            ]
        })
        this._Graph.resize()
        
    }
}