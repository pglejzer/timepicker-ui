declare class ClockFace {
    private array;
    private classToAdd;
    private clockFace;
    private tipsWrapper;
    private theme;
    private clockType;
    private disabledTime;
    private hour;
    constructor(obj: {
        array: Array<string>;
        classToAdd: string;
        clockFace: HTMLElement;
        tipsWrapper: HTMLElement;
        theme?: string;
        clockType?: string;
        disabledTime?: any;
        hour?: any;
    });
    create: () => void;
}
export default ClockFace;
