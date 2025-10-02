import React, { FC, useState } from 'react';

import { editor } from 'monaco-editor';

import Editor from '@monaco-editor/react';

import { useWithOrchestratorTheme } from '@/hooks';
import { useOrchestratorTheme } from '@/hooks';

import { getStyles } from './styles';

export type WfoJsonCodeBlockProps = {
    data: object;
    isBasicStyle?: boolean;
};

/**
 * WfoJsonCodeBlock is used to render objects in JSON format
 * @param data
 * @param isBasicStyle Basic style is a minimalistic style of the code block. It has no paddings and line numbers
 * @constructor
 */
export const WfoJsonCodeBlock: FC<WfoJsonCodeBlockProps> = ({
    data,
    isBasicStyle = false,
}) => {
    const { isDarkThemeActive } = useOrchestratorTheme();
    const { euiCodeBlockStyle, euiBasicCodeBlockStyle } =
        useWithOrchestratorTheme(getStyles);

    const json = JSON.stringify(data, null, 4);

    const [editorHeight, setEditorHeight] = useState(0);

    function editorDidMount(editor: editor.IStandaloneCodeEditor) {
        const scrollHeight = editor.getScrollHeight();
        setEditorHeight(Math.min(scrollHeight, 500));
    }

    return (
        <Editor
            height={editorHeight}
            css={isBasicStyle ? euiBasicCodeBlockStyle : euiCodeBlockStyle}
            theme={isDarkThemeActive ? 'vs-dark' : 'light'}
            options={{
                readOnly: true,
                lineNumbers: isBasicStyle ? 'off' : 'on',
                scrollBeyondLastLine: false,
                contextmenu: false,
                minimap: { enabled: false },
                mouseWheelZoom: true,
                mouseStyle: 'copy',
            }}
            onMount={editorDidMount}
            language="json"
            value={json}
        />
    );
};
