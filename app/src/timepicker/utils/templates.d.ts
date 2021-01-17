declare const getNumberOfHours24: Array<string>;
declare const getNumberOfHours12: Array<string>;
declare const getNumberOfMinutes: Array<string>;
declare const getModalTemplate: (options: {
    iconTemplate?: string | undefined;
    selectTimeLabel?: string | undefined;
    amLabel?: string | undefined;
    pmLabel?: string | undefined;
    cancelLabel?: string | undefined;
    okLabel?: string | undefined;
    enableSwitchIcon?: boolean | undefined;
}) => string;
declare const getMobileModalTemplate: (options: {
    enterTimeLabel?: string | undefined;
    amLabel?: string | undefined;
    pmLabel?: string | undefined;
    cancelLabel?: string | undefined;
    okLabel?: string | undefined;
    iconTemplateMobile?: string | undefined;
    minuteMobileLabel?: string | undefined;
    hourMobileLabel?: string | undefined;
    enableSwitchIcon?: boolean | undefined;
}) => string;
export { getMobileModalTemplate, getModalTemplate, getNumberOfHours12, getNumberOfHours24, getNumberOfMinutes, };
