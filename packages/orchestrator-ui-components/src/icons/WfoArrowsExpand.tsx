import React, { FC } from 'react';
import { WfoIconProps } from './WfoIconProps';

export const WfoArrowsExpand: FC<WfoIconProps> = ({
    width = 16,
    height = 20,
    color = '#000000',
}) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
    >
        <title>icon/arrows-expand</title>
        <g
            id="Symbols"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
        >
            <g id="icon/arrows-expand" fill={color} fillRule="nonzero">
                <path
                    d="M8,3 C8.55228475,3 9,3.44771525 9,4 C9,4.55228475 8.55228475,5 8,5 L6.414,5 L9.70710678,8.29289322 C10.0976311,8.68341751 10.0976311,9.31658249 9.70710678,9.70710678 C9.31658249,10.0976311 8.68341751,10.0976311 8.29289322,9.70710678 L5,6.414 L5,8 C5,8.55228475 4.55228475,9 4,9 C3.44771525,9 3,8.55228475 3,8 L3.00278786,3.92476146 L3.02024007,3.79927424 L3.04973809,3.68785748 L3.08186687,3.60305436 L3.13590047,3.49621086 L3.21292769,3.38297765 L3.29291093,3.29285919 C3.32828727,3.25749917 3.36567442,3.22531295 3.40469339,3.19633458 L3.51222854,3.1267352 L3.60305314,3.08187107 L3.73400703,3.03584514 L3.8819045,3.00690716 L4,3 L8,3 Z M16,3 L20,3 L20.0752385,3.00278786 L20.2007258,3.02024007 L20.3121425,3.04973809 L20.4232215,3.09367336 L20.5207088,3.14599545 L20.6170223,3.21292769 L20.7071408,3.29291093 C20.7425008,3.32828727 20.774687,3.36567442 20.8036654,3.40469339 L20.8732648,3.51222854 L20.9181289,3.60305314 L20.9641549,3.73400703 L20.9930928,3.8819045 L21,4 L21,8 C21,8.55228475 20.5522847,9 20,9 C19.4477153,9 19,8.55228475 19,8 L19,6.414 L15.7071068,9.70710678 C15.3165825,10.0976311 14.6834175,10.0976311 14.2928932,9.70710678 C13.9023689,9.31658249 13.9023689,8.68341751 14.2928932,8.29289322 L17.585,5 L16,5 C15.4477153,5 15,4.55228475 15,4 C15,3.44771525 15.4477153,3 16,3 Z M9.70710678,14.2928932 C10.0976311,14.6834175 10.0976311,15.3165825 9.70710678,15.7071068 L6.414,19 L8,19 C8.55228475,19 9,19.4477153 9,20 C9,20.5522847 8.55228475,21 8,21 L3.92476146,20.9972121 L3.79927424,20.9797599 L3.68785748,20.9502619 L3.60305436,20.9181331 L3.49621086,20.8640995 L3.38297765,20.7870723 L3.29285919,20.7070891 C3.25749917,20.6717127 3.22531295,20.6343256 3.19633458,20.5953066 L3.12467117,20.4840621 L3.07122549,20.371336 L3.03584514,20.265993 L3.00683422,20.1174742 L3,20 L3,16 C3,15.4477153 3.44771525,15 4,15 C4.55228475,15 5,15.4477153 5,16 L5,17.585 L8.29289322,14.2928932 C8.68341751,13.9023689 9.31658249,13.9023689 9.70710678,14.2928932 Z M16,21 C15.4477153,21 15,20.5522847 15,20 C15,19.4477153 15.4477153,19 16,19 L17.585,19 L14.2928932,15.7071068 C13.9023689,15.3165825 13.9023689,14.6834175 14.2928932,14.2928932 C14.6834175,13.9023689 15.3165825,13.9023689 15.7071068,14.2928932 L19,17.585 L19,16 C19,15.4477153 19.4477153,15 20,15 C20.5522847,15 21,15.4477153 21,16 L20.9972121,20.0752385 L20.9797599,20.2007258 L20.9502619,20.3121425 L20.9063266,20.4232215 L20.8540045,20.5207088 L20.7902954,20.6128994 L20.7073018,20.7068684 C20.6717127,20.7425008 20.6343256,20.774687 20.5953066,20.8036654 L20.4840621,20.8753288 L20.371336,20.9287745 L20.2350988,20.9722083 L20.1539846,20.9882174 L20,21 L16,21 Z"
                    id="Shape"
                ></path>
            </g>
        </g>
    </svg>
);
