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
