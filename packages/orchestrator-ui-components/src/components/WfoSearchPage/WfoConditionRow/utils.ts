import { PathInfo } from '@/types';

export const createOptionsFromPaths = (paths: PathInfo[], group: string) =>
    paths
        .filter(({ group: pathGroup }) => pathGroup === group)
        .map(({ displayLabel, path, type, operators }) => ({
            label: displayLabel || path,
            value: path,
            'data-type': type,
            'data-operators': operators?.join(', ') || '',
        }));

export const shouldHideValueInput = (
    selectedPathInfo: PathInfo | null,
    operatorSelected: boolean,
): boolean => {
    if (!selectedPathInfo || !operatorSelected) return true;

    if (selectedPathInfo.group === 'component') return true;
    if (selectedPathInfo.type === 'boolean') return true;

    return false;
};

export const isFullPathSelected = (
    path: string,
    selectedPathInfo: PathInfo | null,
): boolean => {
    return !!(
        path &&
        (path.includes('.') ||
            (selectedPathInfo && selectedPathInfo.group === 'component') ||
            (!path.includes('.') && selectedPathInfo))
    );
};

export const getFieldNameFromPath = (
    path: string,
    isComponent: boolean,
): string => {
    return isComponent ? path : path.split('.').pop() || path;
};

export const getFieldNameFromFullPath = (fullPath: string): string => {
    const parts = fullPath.split('.');
    return parts[parts.length - 1] || fullPath;
};

export const getPathSelectionOptions = (
    selectedFieldName: string,
    paths: PathInfo[],
) => {
    if (!selectedFieldName) return [];

    const fieldInfo = paths.find(({ path }) => path === selectedFieldName);
    if (!fieldInfo || !fieldInfo.availablePaths) return [];

    return fieldInfo.availablePaths.map((fullPath) => ({
        label: fullPath,
        value: fullPath,
        fullPath: fullPath,
    }));
};
