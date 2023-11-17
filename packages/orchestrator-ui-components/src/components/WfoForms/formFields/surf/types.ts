export interface ServicePort {
    subscription_id?: string;
    vlan?: string;
    bandwidth?: number;
    nonremovable?: boolean;
    modifiable?: boolean;
}

export enum PortMode {
    TAGGED = 'tagged',
    UNTAGGED = 'untagged',
    LINK_MEMBER = 'link_member',
}

export enum ProductTag {
    MSC = 'MSC',
    MSCNL = 'MSCNL',
    IRBSP = 'IRBSP',
    SP = 'SP',
    SPNL = 'SPNL',
    AGGSP = 'AGGSP',
    AGGSPNL = 'AGGSPNL',
}

export interface ImsNode {
    id: number;
    name: string;
    status: string;
}

export interface SortOption<nameStrings = string> {
    name: nameStrings;
    descending: boolean;
}

export interface IpPrefix {
    id: number;
    prefix: string;
    version: number;
}

export interface IpBlock {
    id: number;
    prefix: string;
    ip_network: string;
    description: string;
    state: number;
    parent: number;
    version: number;
    parent_ipam_id: number;
    is_subnet: boolean;
    state_repr: string;
}
