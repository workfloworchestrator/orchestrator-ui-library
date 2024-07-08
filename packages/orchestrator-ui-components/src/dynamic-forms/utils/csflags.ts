export enum CsFlags {
    ALLOW_INVALID_FORMS = 'ALLOW_INVALID_FORMS',
}
export const IsCsFlagEnabled = (flag: CsFlags): boolean => {
    if (flag === CsFlags.ALLOW_INVALID_FORMS) {
        return true;
    }
    return false;
};
