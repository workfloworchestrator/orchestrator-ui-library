import type { Meta } from '@storybook/react';
import { HeaderBadge } from './HeaderBadge';

const Story: Meta<typeof HeaderBadge> = {
    component: (args) => (
        <div style={{ display: 'flex' }}>
            <HeaderBadge {...args} />
        </div>
    ),
    title: 'Badges/HeaderBadge',
};
export default Story;

export const Primary = {
    args: {
        children: 'Badge text',
    },
};
