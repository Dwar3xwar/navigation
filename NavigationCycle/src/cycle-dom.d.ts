declare module '@cycle/dom' {
    export = CycleDOM;
} 

declare module CycleDOM {
    export var h: (selector: string, properties: any, children: string | any[]) => string;
}
