import React, { FC, ReactNode } from 'react';
import {
    EuiButton,
    EuiModal,
    EuiModalBody,
    EuiModalFooter,
    EuiModalHeader,
    EuiModalHeaderTitle,
    EuiSpacer,
} from '@elastic/eui';

//use this one

//When you yse the pencil the dropdown appears and the noc manual can be edited

// calculation done in the table

// the check results - in the number 1

// IF noc manual is specified its the one ! IF its not specified then its IMS calculated impact

// compares to the default sending level - Look 2nd row

//minimal impact notification level overwrites the default sending level

// MINL - Minimal Impact Notification Level

export type WfoInformationModalProps = {
    title: string;
    onClose: () => void;
    children: ReactNode;
};

export const WfoInformationModal: FC<WfoInformationModalProps> = ({
    title,
    onClose,
    children,
}) => {
    return (
        <EuiModal onClose={onClose}>
            <EuiModalHeader>
                <EuiModalHeaderTitle size="xs">{title}</EuiModalHeaderTitle>
            </EuiModalHeader>

            <EuiSpacer size="s" />

            <EuiModalBody>{children}</EuiModalBody>

            <EuiModalFooter>
                <EuiButton onClick={onClose} fill>
                    Close
                </EuiButton>
            </EuiModalFooter>
        </EuiModal>
    );
};
