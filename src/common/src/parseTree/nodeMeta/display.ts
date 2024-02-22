


export type DisplayOptions = GraphDisplayOptions | GaugeDisplayOptions | TableDisplayOptions | BasicDisplayOptions


//TODO: Make convenient way of getting the type of a display option
function isTypeOf(options: DisplayOptions, targetType: DisplayType): options is DisplayOptions {
    return options.type === targetType;
}


enum DisplayType {
    Graph,
    Gauge,
    Table,
    Basic
}

export interface GraphDisplayOptions {
    type: DisplayType.Graph
    xLabelInterval: number,
    yLabelInterval: number,
    xResolution: number,
    xStart: number,
    yStart: number,
    xEnd: number,
    yEnd: number
}

export interface GaugeDisplayOptions {
    type: DisplayType.Gauge
}

export interface TableDisplayOptions {
    type: DisplayType.Table
}

export interface BasicDisplayOptions {
    type: DisplayType.Basic
}
