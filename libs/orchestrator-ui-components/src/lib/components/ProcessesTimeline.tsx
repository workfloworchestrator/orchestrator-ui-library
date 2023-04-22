import React from 'react';
import {
    EuiAvatar,
    EuiButtonIcon,
    EuiCommentList,
    EuiCommentProps,
    EuiText,
    EuiBadge,
    EuiFlexGroup,
    EuiFlexItem,
    EuiSpacer,
} from '@elastic/eui';


const Card = () => {
    return (
        <div style={{ marginTop: 5 }}>
            <table width="100%" bgcolor={'#F1F5F9'}>
                <tr>
                    <td
                        valign={'top'}
                        style={{
                            width: 250,
                            padding: 10,
                            borderBottom: 'solid 1px #ddd',
                        }}
                    >
                        <b>ID</b>
                    </td>
                    <td style={{ padding: 10, borderBottom: 'solid 1px #ddd' }}>
                        <a href="#">792225b3-f40a-4724-9f3e-15bc5668d3cd</a>
                    </td>
                </tr>
                <tr>
                    <td
                        valign={'top'}
                        style={{ padding: 10, borderBottom: 'solid 1px #ddd' }}
                    >
                        <b>Status</b>
                    </td>
                    <td style={{ padding: 10, borderBottom: 'solid 1px #ddd' }}>
                        <EuiBadge color={'success'}>Completed</EuiBadge>
                    </td>
                </tr>
                <tr>
                    <td
                        valign={'top'}
                        style={{ padding: 10, borderBottom: 'solid 1px #ddd' }}
                    >
                        <b>Started at</b>
                    </td>
                    <td style={{ padding: 10, borderBottom: 'solid 1px #ddd' }}>
                        2-11-2021 13:47:43 - Duration: 00:00:024
                    </td>
                </tr>
                <tr>
                    <td valign={'top'} style={{ padding: 10 }}>
                        <b>Started by</b>
                    </td>
                    <td style={{ padding: 10 }}>Hans Trompert</td>
                </tr>
            </table>
        </div>
    );
};

const comments: EuiCommentProps[] = [
    {
        username: 'Modify',
        timelineAvatarAriaLabel: 'Modify FW2 Speed',
        timelineAvatar: <EuiAvatar name="M" />,
        children: (
            <>
                <EuiText>
                    <h4>Modify</h4>
                </EuiText>
                <EuiText size={'s'}>modify_fw_speed</EuiText>
                {Card()}
            </>
        ),
    },
    {
        username: 'Modify',
        timelineAvatarAriaLabel: 'Modify FW2 Speed',
        timelineAvatar: <EuiAvatar name="M" />,
        children: (
            <>
                <EuiText>
                    <h4>Modify</h4>
                </EuiText>
                <EuiText size={'s'}>modify_fw_speed</EuiText>
                {Card()}
            </>
        ),
    },
    {
        username: 'Modify',
        timelineAvatarAriaLabel: 'Modify FW2 Speed',
        timelineAvatar: <EuiAvatar name="M" />,
        children: (
            <>
                <EuiText>
                    <h4>Modify</h4>
                </EuiText>
                <EuiText size={'s'}>modify_fw_speed</EuiText>
                {Card()}
            </>
        ),
    },
    {
        username: 'Create',
        timelineAvatarAriaLabel: 'Create Firewall',
        timelineAvatar: <EuiAvatar name="Create" />,
        children: (
            <>
                <EuiText>
                    <h4>Modify</h4>
                </EuiText>
                <EuiText size={'s'}>create_fw</EuiText>
                {Card()}
            </>
        ),
    },
];

export const ProcessesTimeline = () => (
    <>
        <EuiSpacer size={'m'} />
        <EuiCommentList comments={comments} aria-label="Comment list example" />
    </>
);
