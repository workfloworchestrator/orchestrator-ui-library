import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Diff, Hunk, parseDiff, tokenize } from 'react-diff-view';
import 'react-diff-view/style/index.css';
import { DiffType } from 'react-diff-view/types/Diff';
import { HunkData } from 'react-diff-view/types/utils/parse';

import { useTranslations } from 'next-intl';
// CSS for syntax highlight
import 'prism-themes/themes/prism-ghcolors.min.css';
import * as refractor from 'refractor';
import { diffLines, formatLines } from 'unidiff';

import { EuiButtonIcon, EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText } from '@elastic/eui';

import { getWfoDiffStyles } from '@/components/WfoDiff/styles';
import { useWithOrchestratorTheme } from '@/hooks';

const EMPTY_HUNKS: never[] = [];

const SMALL_CONTEXT = 3;
const FULL_CONTEXT = 1000000;

interface DiffState {
  type: DiffType;
  hunks: HunkData[];
}

interface WfoDiffProps {
  oldText: string;
  newText: string;
  syntax?: 'javascript' | 'python';
}

const WfoDiff: FC<WfoDiffProps> = ({ oldText, newText, syntax }) => {
  const t = useTranslations('processes.delta');
  const [showSplit, setShowSplit] = useState(true);
  const [showFull, setShowFull] = useState(false);

  const { diffStyle } = useWithOrchestratorTheme(getWfoDiffStyles);

  const [{ type, hunks }, setDiff] = useState<DiffState>({
    type: 'modify',
    hunks: [],
  });
  const updateDiffText = useCallback(() => {
    const diffText = formatLines(diffLines(oldText, newText), {
      context: showFull ? FULL_CONTEXT : SMALL_CONTEXT,
    });
    const [diff] = parseDiff(diffText, { nearbySequences: 'zip' });
    setDiff(diff);
  }, [oldText, newText, setDiff, showFull]);

  const tokens = useMemo(() => {
    if (!hunks) {
      return undefined;
    }

    const options = {
      refractor,
      highlight: !!syntax,
      language: syntax ?? '',
    };

    try {
      return tokenize(hunks, options);
    } catch {
      return undefined;
    }
  }, [hunks, syntax]);

  useEffect(() => {
    updateDiffText();
  }, [updateDiffText, showFull]);

  return (
    <div>
      <EuiFlexGroup gutterSize={'xs'}>
        <EuiFlexItem grow={false}>
          <EuiText>
            <h3>{t('title')}</h3>
          </EuiText>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiButtonIcon
            size={'s'}
            iconType={showSplit ? 'continuityAboveBelow' : 'continuityWithin'}
            onClick={() => setShowSplit(!showSplit)}
            aria-label={t(showSplit ? 'continuityAboveBelow' : 'continuityWithin')}
          />
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiButtonIcon
            size={'s'}
            iconType={showFull ? 'fullScreenExit' : 'fullScreen'}
            onClick={() => setShowFull(!showFull)}
            aria-label={t(showFull ? 'fullScreenExit' : 'fullScreen')}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer />
      <Diff
        css={diffStyle}
        viewType={showSplit ? 'split' : 'unified'}
        diffType={type}
        hunks={hunks || EMPTY_HUNKS}
        tokens={tokens}
      >
        {(hunks) => hunks.map((hunk) => <Hunk key={hunk.content} hunk={hunk} />)}
      </Diff>
    </div>
  );
};

export default WfoDiff;
