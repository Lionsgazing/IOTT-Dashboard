import { dom } from "./dom/dom"
import * as echarts from 'echarts'

export class Graph {
    private _Container: HTMLDivElement
    private _Graph: echarts.ECharts

    private _IsLoaded: boolean

    get Content() {
        return this._Container
    }

    constructor(target_container: HTMLDivElement) {
        //Save container
        this._Container = target_container
        this._Graph = echarts.init(this._Container)
        this._IsLoaded = false
    }

    public Resize() {
        if (this._IsLoaded){
            this._Graph.resize()
        }
    }

    public Setup() {
        //Create echarts graph
        this._Graph.setOption({
            title: {
                show: true,
                text: "Title",
                subtext: "Sub text",
            },
            xAxis: {
                name: "xAxis",
                type: "value",
            },
            yAxis: {
                name: "yAxis",
                type: "value",
            },
            series: [
                {
                    name: "series",
                    type: "line",
                    sampling: "lttb",
                    data: [
                        [1, 2],
                        [2, 2],
                        [3, 2],
                        [4, 2]
                    ],
                    encode: {x: [0], y: [1]}
                }
            ],
            legend: {
                show: "true",
                type: "plain",
                bottom: "2.5%",
            },
            dataZoom: {
                type: "inside",
            },
            axisPointer: {
                show: true,
                type: "line",
                snap: true,

            }
        })
        this._Graph.resize()

        this._IsLoaded = true
    }
}