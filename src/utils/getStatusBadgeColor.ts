export const getStatusBadgeColor = (status: string) => {
  const statusColors = {
    terminated: 'danger',
    active: 'success',
    provisioning: 'primary',
    migrating: 'primary',
    initial: 'danger',
  };
  // eslint-disable-next-line no-prototype-builtins
  return statusColors.hasOwnProperty(status) ?
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      statusColors[status]
    : 'primary';
};
