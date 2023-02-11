// Todo: find out how to load from utils in core
export const getStatusBadgeColor = (status: string) => {
    const statusColors: any = {
        terminated: 'danger',
        active: 'success',
        provisioning: 'primary',
        migrating: 'primary',
        initial: 'danger',
    };
    // eslint-disable-next-line no-prototype-builtins
    return statusColors.hasOwnProperty(status)
        ? statusColors[status]
        : 'primary';
};
