declare class ClockFace {
    private array;
    private classToAdd;
    private clockFace;
    private tipsWrapper;
    private theme;
    private clockType;
    constructor(obj: {
        array: Array<string>;
        classToAdd: string;
        clockFace: HTMLElement;
        tipsWrapper: HTMLElement;
        theme?: string;
        clockType?: string;
    });
    create: () => void;
}
export default ClockFace;
