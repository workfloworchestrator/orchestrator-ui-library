import React, { FC } from 'react';

import { WfoIconProps } from './WfoIconProps';

export const WfoPlannedWork: FC<WfoIconProps> = ({
    width = 24,
    height = 24,
    color = '#000000',
}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
    >
        <path
            xmlns="http://www.w3.org/2000/svg"
            fill={color}
            fill-rule="evenodd"
            d="M7,9.5 C7,12.906616 9.0040254,15.8451668 11.8974708,17.2010469 L5.64,17.2 L4.68,20.4 L13.32,20.4 L12.428326,17.4280315 C12.9822682,17.6428026 13.5643216,17.8011905 14.1674429,17.8961521 L14.92,20.4 L16.2,20.4 C16.6418278,20.4 17,20.7581722 17,21.2 C17,21.6418278 16.6418278,22 16.2,22 L1.8,22 C1.3581722,22 1,21.6418278 1,21.2 C1,20.7581722 1.3581722,20.4 1.8,20.4 L3.08,20.4 L7.20995944,6.63346855 C7.28858141,6.37139532 7.48053724,6.16689679 7.72256902,6.06703879 C7.25791178,7.11603618 7,8.27789883 7,9.5 Z M16,2 C19.8659932,2 23,5.13400675 23,9 C23,12.8659932 19.8659932,16 16,16 C12.1340068,16 9,12.8659932 9,9 C9,5.13400675 12.1340068,2 16,2 Z M16,4.1 C13.2938047,4.1 11.1,6.29380473 11.1,9 C11.1,11.7061953 13.2938047,13.9 16,13.9 C18.7061953,13.9 20.9,11.7061953 20.9,9 C20.9,6.29380473 18.7061953,4.1 16,4.1 Z M17.05,5.5 L17.05,8.5646 L18.8424621,10.3575379 L17.3575379,11.8424621 L14.95,9.43492424 L14.95,5.5 L17.05,5.5 Z"
        />
    </svg>
);