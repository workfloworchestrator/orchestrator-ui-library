export const getFirstUuidPart = (uuid?: string): string =>
    uuid ? uuid.slice(0, 8) : '';

export const isUuid4 = (value: string): boolean =>
    !!value.match(
        /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-5][0-9a-f]{3}-?[089ab][0-9a-f]{3}-?[0-9a-f]{12}$/i,
    );
