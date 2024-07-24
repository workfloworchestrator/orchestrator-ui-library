import { isPlainObject } from 'lodash';

export function stripUndefined(obj: object): Record<string, unknown> {
    if (!isPlainObject(obj)) {
        return obj as Record<string, unknown>;
    }
    const copy: Record<string, unknown> = { ...obj };
    for (const [k, v] of Object.entries(copy)) {
        if (v === undefined) {
            delete copy[k];
        }
    }
    return copy;
}
