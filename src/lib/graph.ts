import { dom } from "./dom/dom"
import * as echarts from 'echarts'
import { Serie } from "./graph_series"
import { Dictionary } from "echarts/types/src/util/types.js"

export class Graph {
    private _Container: HTMLDivElement
    private _Graph: echarts.ECharts

    private _GraphSeriesIds: string[]
    private _GraphSeries: Dictionary<Serie>

    private _markLines: object
    private _markAreas: object

    private _IsLoaded: boolean
    private _ID: string

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

    get ID() {
        return this._ID
    }

    constructor(target_container: HTMLDivElement, title: string, id: string) {
        //Save container
        this._Container = target_container
        this._Graph = echarts.init(this._Container)
        this._IsLoaded = false
        this._title = title
        this._ID = id

        //Create series containers
        this._GraphSeriesIds = []
        this._GraphSeries = {}
        this._markLines = {}
        this._markAreas = {}
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

    public SetThreshold(from?: number | string, to?: number | string, color?: string, label?: string) {
        this._markAreas = {
            itemStyle: {
                color: color
            },
            data: [
                [
                    {
                        yAxis: from
                    },
                    {
                        yAxis: to
                    }
                ],
            ]
        }
        this._markLines = {
            silent: true,
            label: {
                show: true,
                position: "middle",
                formatter: (params: Object) => {
                    return label
                },
            },
            lineStyle: {
                color: "#333",
            },
            data: [
                {
                    yAxis: from
                }
            ]
        }
    }

    /*public AddVerticalLine(SeriesID: string, markLine: object) {
        this._markLines[SeriesID] = markLine
    }*/

    public ClearSeriesData() {
        console.info("[Graph] All series data cleared")
        for (const ID of this._GraphSeriesIds) {
            const series = this._GraphSeries[ID]
            series.ClearBuffer()
        }
    }

    public Update() {
        let series: object[] = []
        for (const ID of this._GraphSeriesIds) {
            const serie_options = this._GraphSeries[ID].toEcharts(ID)
            
            //Add markline info
            serie_options.markLine = this._markLines
            serie_options.markArea = this._markAreas
            
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

    public IDToSeriesIndex(target_ID: string) {
        let i = 0
        for (const ID of this._GraphSeriesIds) {
            const serie_options = this._GraphSeries[ID].toEcharts(ID)
            
            if (serie_options.id == target_ID) {
                return i
            }

            i++
        }
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
                type: "value",
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
            title: titleGraph,
            xAxis: xAxisGraph,
            yAxis: yAxisGraph,
            grid: {
                show: true,
                bottom: "110px"
            },
            legend: {
                show: "true",
                type: "plain",
                bottom: "60px",
            },
            dataZoom: [
                {
                    type: "inside",
                    filterMode: "none",
                },
                {
                    type: "slider",
                    filterMode: "none",
                    bottom: "25px",
                }
            ],
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {
                        show: true,
                        type: "png",
                    },
                }
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