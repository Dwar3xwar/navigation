declare module 'rx' {
    export = Rx;
} 

declare module Rx {
    class ReplaySubject {
        constructor(bufferSize: number);
        onNext(item: any): void;
    }
}
