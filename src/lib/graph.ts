import { dom } from "./dom/dom"
import * as echarts from 'echarts'
import { Serie } from "./graph_series"

export class Graph {
    private _Container: HTMLDivElement
    private _Graph: echarts.ECharts
    private _GraphSeries: Serie[]

    private _IsLoaded: boolean

    get Content() {
        return this._Container
    }

    constructor(target_container: HTMLDivElement) {
        //Save container
        this._Container = target_container
        this._Graph = echarts.init(this._Container)
        this._IsLoaded = false
        this._GraphSeries = []
    }

    public Resize() {
        if (this._IsLoaded){
            this._Graph.resize()
        }
    }

    public Update() {
        let series: object[] = []
        for (const graph_serie of this._GraphSeries) {
            series.push(graph_serie.toEcharts())
        }

        this._Graph.setOption({            
            series: series,
        })
    }

    public SetSize(height: string, width: string) {
        this._Graph.getDom().style.height = height
        this._Graph.getDom().style.width = width
    }

    public Setup(Series: Serie[], xAxis: object | undefined = undefined, yAxis: object | undefined = undefined) {
        this._GraphSeries = Series

        let series: object[] = []
        for (const graph_serie of this._GraphSeries) {
            series.push(graph_serie.toEcharts())
        }
        let xAxisGraph
        if (xAxis === undefined) {
            xAxisGraph = {
                name: "xAxis",
                type: "time",
            }
        }
        else {
            xAxisGraph = xAxis
        }

        let yAxisGraph
        if (yAxis === undefined) {
            yAxisGraph = {
                name: "yAxis",
                type: "value",
            }
        }
        else {
            yAxisGraph = yAxis
        }

        //Create echarts graph
        this._Graph.setOption({
            title: {
                show: true,
                text: "Title",
                subtext: "Sub text",
            },
            xAxis: xAxisGraph,
            yAxis: yAxisGraph,
            grid: {
                show: true,
            },
            series: series,
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