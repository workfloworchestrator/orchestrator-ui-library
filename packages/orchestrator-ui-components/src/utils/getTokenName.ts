export function getTokenName(name: string | number | boolean): string {
  if (typeof name === 'boolean') return 'tokenConstant';
  const icons: { [key: string]: string } = {
    Node: 'tokenNamespace',
    'IP BGP Service Settings': 'tokenEnumMember',
    IP_PREFIX: 'tokenIP',
  };
  if (name in icons) {
    return icons[name];
  }
  return 'tokenConstant';
}
