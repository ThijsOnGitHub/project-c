/// <reference types="react-scripts" />
declare module '*.svg' {
    const content: React.Compontent;
    export default content;
}
declare global {
    interface String {
        capitalFirst():string
    }
}