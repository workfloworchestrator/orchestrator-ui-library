import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Diff, Hunk, parseDiff, tokenize } from 'react-diff-view';
import 'react-diff-view/style/index.css';
import { DiffType } from 'react-diff-view/types/Diff';
import { HunkData } from 'react-diff-view/types/utils/parse';

import { useTranslations } from 'next-intl';
// CSS for syntax highlight
import 'prism-themes/themes/prism-ghcolors.min.css';
import * as refractor from 'refractor';
import { diffLines, formatLines } from 'unidiff';

import {
    EuiButtonIcon,
    EuiFlexGroup,
    EuiFlexItem,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';

const EMPTY_HUNKS: never[] = [];

interface DiffState {
    type: DiffType;
    hunks: HunkData[];
}

interface WfoDiffProps {
    oldText: string;
    newText: string;
}

const WfoDiff: React.FC<WfoDiffProps> = ({ oldText, newText }) => {
    const t = useTranslations('processes.delta');
    const [showSplit, setShowSplit] = useState(true);

    const [{ type, hunks }, setDiff] = useState<DiffState>({
        type: 'modify',
        hunks: [],
    });
    const updateDiffText = useCallback(() => {
        const diffText = formatLines(diffLines(oldText, newText), {
            context: 3,
        });
        const [diff] = parseDiff(diffText, { nearbySequences: 'zip' });
        setDiff(diff);
    }, [oldText, newText, setDiff]);

    const tokens = useMemo(() => {
        if (!hunks) {
            return undefined;
        }

        const options = {
            refractor,
            highlight: true,
            language: 'javascript',
        };

        try {
            return tokenize(hunks, options);
        } catch (ex) {
            return undefined;
        }
    }, [hunks]);

    useEffect(() => {
        updateDiffText();
    }, [updateDiffText]);

    return (
        <div>
            <EuiFlexGroup>
                <EuiFlexItem grow={false}>
                    <EuiText>
                        <h2>{t('title')}</h2>
                    </EuiText>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                    <EuiButtonIcon
                        size={'s'}
                        iconType={
                            showSplit
                                ? 'continuityAboveBelow'
                                : 'continuityWithin'
                        }
                        onClick={() => setShowSplit(!showSplit)}
                    />
                </EuiFlexItem>
            </EuiFlexGroup>

            <EuiSpacer />
            <Diff
                viewType={showSplit ? 'split' : 'unified'}
                diffType={type}
                hunks={hunks || EMPTY_HUNKS}
                tokens={tokens}
            >
                {(hunks) =>
                    hunks.map((hunk) => <Hunk key={hunk.content} hunk={hunk} />)
                }
            </Diff>
        </div>
    );
};

export default WfoDiff;
