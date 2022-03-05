declare const getNumberOfHours24: Array<string>;
declare const getNumberOfHours12: Array<string>;
declare const getNumberOfMinutes: Array<string>;
declare const getModalTemplate: (options: {
    iconTemplate?: string;
    timeLabel?: string;
    amLabel?: string;
    pmLabel?: string;
    cancelLabel?: string;
    okLabel?: string;
    enableSwitchIcon?: boolean;
    animation?: boolean;
    editable?: boolean;
    clockType?: string;
}) => string;
declare const getMobileModalTemplate: (options: {
    mobileTimeLabel?: string;
    amLabel?: string;
    pmLabel?: string;
    cancelLabel?: string;
    okLabel?: string;
    iconTemplateMobile?: string;
    minuteMobileLabel?: string;
    hourMobileLabel?: string;
    enableSwitchIcon?: boolean;
    animation?: boolean;
    clockType?: string;
}) => string;
export { getMobileModalTemplate, getModalTemplate, getNumberOfHours12, getNumberOfHours24, getNumberOfMinutes, };
