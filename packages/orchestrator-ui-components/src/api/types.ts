// These types are specifically for the axios calls
// When replacing the REST calls with GraphQL, these types should be removed

export type LegacyFixedInput = {
    name: string;
    value: string;
    created_at: number;
    fixed_input_id: string;
    product_id: string;
};

export type LegacyWorkflow = {
    name: string;
    description: string;
    target: string;
    created_at: number;
    workflow_id: string;
};

export type LegacyResourceType = {
    resource_type_id: string;
    resource_type: string;
    description: string;
};

export type LegacyProductBlock = {
    product_block_id: string;
    name: string;
    tag: string;
    description: string;
    status: string;
    created_at: number;
    end_date: number;
    resource_types: LegacyResourceType[];
    parent_ids: string[];
};

export type LegacyProduct = {
    name: string;
    tag: string;
    description: string;
    product_id: string;
    created_at: number;
    product_type: string;
    end_date: number;
    status: string;
    fixed_inputs: LegacyFixedInput[];
    workflows: LegacyWorkflow[];
    product_blocks: LegacyProductBlock[];
    create_subscription_workflow_key: string;
    modify_subscription_workflow_key: string;
    terminate_subscription_workflow_key: string;
};
