import React, { FC, useCallback, useEffect, useState } from 'react';

import { editor } from 'monaco-editor';

import { EuiFlexItem } from '@elastic/eui';
import Editor from '@monaco-editor/react';
import type { Monaco } from '@monaco-editor/react';

import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';

import { getStyles } from './styles';

export type WfoMonacoCodeBlockProps = {
    data: object;
};

const MONACO_THEME: { light: editor.BuiltinTheme; dark: editor.BuiltinTheme } =
    {
        light: 'vs',
        dark: 'hc-black',
    };

/**
 * WfoMonacoCodeBlock is used to render objects in JSON format using the Monaco Editor
 * @param data
 * @constructor
 */
export const WfoMonacoCodeBlock: FC<WfoMonacoCodeBlockProps> = ({ data }) => {
    const { theme, isDarkThemeActive } = useOrchestratorTheme();
    const { monacoEditorStyle } = useWithOrchestratorTheme(getStyles);
    const [monacoInstance, setMonacoInstance] = useState<Monaco | undefined>(
        undefined,
    );
    const json = JSON.stringify(data, null, 4);

    const [editorHeight, setEditorHeight] = useState(0);

    const addThemeToEditor = useCallback(
        (monaco: Monaco) => {
            monaco.editor.defineTheme('wfoTheme', {
                base: isDarkThemeActive
                    ? MONACO_THEME.dark
                    : MONACO_THEME.light,
                inherit: true,
                rules: [],
                colors: {
                    'editor.background': theme.colors.body,
                },
            });
            monaco.editor.setTheme('wfoTheme');
        },
        [theme, isDarkThemeActive],
    );

    useEffect(() => {
        if (monacoInstance) {
            addThemeToEditor(monacoInstance);
        }
    }, [addThemeToEditor, isDarkThemeActive, monacoInstance]);

    function editorDidMount(
        editor: editor.IStandaloneCodeEditor,
        monaco: Monaco,
    ) {
        const scrollHeight = editor.getScrollHeight();
        setEditorHeight(Math.min(scrollHeight, 500));
        setMonacoInstance(monaco);
    }

    return (
        <EuiFlexItem css={monacoEditorStyle}>
            <Editor
                height={editorHeight}
                options={{
                    readOnly: true,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    contextmenu: false,
                    minimap: { enabled: false },
                    mouseWheelZoom: true,
                    renderLineHighlight: 'none',
                    fontFamily: theme.font.family,
                    tabSize: 8,
                }}
                beforeMount={addThemeToEditor}
                onMount={editorDidMount}
                language="json"
                value={json}
            />
        </EuiFlexItem>
    );
};
