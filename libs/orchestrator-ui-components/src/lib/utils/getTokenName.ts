export function getTokenName(name: string) {
    const icons = {
        Node: 'tokenNamespace',
        'IP BGP Service Settings': 'tokenEnumMember',
        IP_PREFIX: 'tokenIP',
    };
    if (name in icons) {
        return icons[name];
    }
    return 'tokenConstant';
}
