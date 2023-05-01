// Todo remove this one
export const getStatusBadgeColor = (status: string) => {
    const statusColors = {
        terminated: 'danger', // lightShade (bg) + darkestShade (text)
        active: 'success', // success
        provisioning: 'primary', // primary
        migrating: 'primary', // primary
        initial: 'danger', // warning
    };
    // eslint-disable-next-line no-prototype-builtins
    return statusColors.hasOwnProperty(status)
        ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          statusColors[status]
        : 'primary';
};
