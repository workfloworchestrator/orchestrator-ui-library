export enum Locale {
    enUS = 'en-Us',
    nlNL = 'nl-NL',
}

export interface ValidationError {
    input_type: string;
    loc: (string | number)[];
    msg: string;
    type: string;
    ctx?: ValidationErrorContext;
}

export interface ValidationErrorContext {
    [index: string]: string;
}
