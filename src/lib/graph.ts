import { dom } from "./dom/dom"
import * as echarts from 'echarts'
import { Serie } from "./graph_series"
import { Dictionary } from "echarts/types/src/util/types.js"

export class Graph {
    private _Container: HTMLDivElement
    private _Graph: echarts.ECharts

    private _GraphSeriesIds: string[]
    private _GraphSeries: Dictionary<Serie>

    private _markLines: Dictionary<object>

    private _IsLoaded: boolean

    private _title: string

    get Content() {
        return this._Container
    }

    get SeriesIDs() {
        return this._GraphSeriesIds
    }

    get Series() {
        return this._GraphSeries
    }

    get Title() {
        return this._title
    }

    constructor(target_container: HTMLDivElement, title: string) {
        //Save container
        this._Container = target_container
        this._Graph = echarts.init(this._Container)
        this._IsLoaded = false
        this._title = title

        //Create series containers
        this._GraphSeriesIds = []
        this._GraphSeries = {}
        this._markLines = {}
    }

    public Resize() {
        if (this._IsLoaded){
            this._Graph.resize()
        }
    }

    public AddSeries(Series: Serie[]) {
        for (const val of Series) {
            const ID = val.ID
            this._GraphSeriesIds.push(ID)
            this._GraphSeries[ID] = val
        }
    }

    public AddVerticalLine(SeriesID: string, markLine: object) {
        this._markLines[SeriesID] = markLine
    }

    public ClearSeriesData() {
        for (const ID of this._GraphSeriesIds) {
            const series = this._GraphSeries[ID]
            series.ClearBuffer()
        }
    }

    public Update() {
        let series: object[] = []
        for (const ID of this._GraphSeriesIds) {
            const serie_options = this._GraphSeries[ID].toEcharts()

            //Debug
            this._markLines[ID] = {
                silent: true,
                lineStyle: {
                    color: "#333",
                },
                data: [
                    {
                        yAxis: 0.5
                    }
                ]
            }
            
            //Add markline info
            serie_options.markLine = this._markLines[ID]
            
            series.push(serie_options)
        }

        this._Graph.setOption({            
            series: series,
        })
    }

    public SetSize(height: string, width: string) {
        this._Graph.getDom().style.height = height
        this._Graph.getDom().style.width = width
    }

    public Setup(title: object | undefined = undefined, xAxis: object | undefined = undefined, yAxis: object | undefined = undefined) {
        let titleGraph
        if (title === undefined) {
            titleGraph = {
                show: true,
                text: "Title",
                subtext: "Sub title"
            }
        }
        else {
            titleGraph = title
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

        let visualMap = {
            pieces: [
                {
                  gt: 0,
                  lte: 0.5,
                  color: '#93CE07'
                },
                {
                  gt: 0.5,
                  lte: 1,
                  color: '#FBDB0F'
                },
              ],
        }

        //Create echarts graph
        this._Graph.setOption({
            title: titleGraph,
            xAxis: xAxisGraph,
            yAxis: yAxisGraph,
            visualMap: visualMap,
            grid: {
                show: true,
            },
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