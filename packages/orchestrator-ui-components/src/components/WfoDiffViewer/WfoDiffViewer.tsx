import React, {useState, useCallback, useMemo, FC} from 'react';
import * as refractor from 'refractor';
import {diffLines, formatLines} from 'unidiff';
import {parseDiff, Diff, Hunk, tokenize} from 'react-diff-view';
// CSS for syntax highlight
import 'prism-themes/themes/prism-vs.css';
import 'react-diff-view/style/index.css';
import {EuiButton} from "@elastic/eui";
// import './styles.css';

const EMPTY_HUNKS: never[] = [];

const useInput = (initialValue: string) => {
    const [value, onChange] = useState(initialValue);

    return {
        value,
        onChange(e: { target: { value: React.SetStateAction<string>; }; }) {
            onChange(e.target.value);
        },
    };
};

export default function WfoDiffViewer() {
    const oldText = 'jadajaja'
    const newText = 'shjkdhjkd';
    // @ts-ignore
    const [{type, hunks}, setDiff] = useState('');
    const updateDiffText = useCallback(() => {
        const diffText = formatLines(diffLines(oldText, newText), {context: 3});
        const [diff] = parseDiff(diffText, {nearbySequences: 'zip'});
        // @ts-ignore
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

    return (
        <div onClick={updateDiffText}>
            {/*<header className="header">*/}
            {/*    <div className="input">*/}
            {/*        <Input.TextArea className="text" rows={10} placeholder="old text..." {...oldText} />*/}
            {/*        <Input.TextArea className="text" rows={10} placeholder="new text..." {...newText} />*/}
            {/*    </div>*/}
                <EuiButton className="submit" type="primary" onClick={updateDiffText}>
                    GENERATE DIFF
                </EuiButton>
            {/*</header>*/}
                <Diff viewType="split" diffType={type} hunks={hunks || EMPTY_HUNKS} tokens={tokens}>
                    {(hunks) => hunks.map((hunk) => <Hunk key={hunk.content} hunk={hunk} />)}
                </Diff>
        </div>
    );
}
