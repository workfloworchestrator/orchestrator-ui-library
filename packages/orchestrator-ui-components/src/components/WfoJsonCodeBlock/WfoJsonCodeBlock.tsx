import React, { FC, useCallback, useEffect, useState } from 'react';

import { editor } from 'monaco-editor';

import Editor from '@monaco-editor/react';
import type { Monaco } from '@monaco-editor/react';

import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';

import { getStyles } from './styles';

export type WfoJsonCodeBlockProps = {
    data: object;
    isBasicStyle?: boolean;
};

const WFO_THEME = {
    light: 'wfo-light',
    dark: 'wfo-dark',
};

const MONACO_THEME: { light: editor.BuiltinTheme; dark: editor.BuiltinTheme } =
    {
        light: 'vs',
        dark: 'vs-dark',
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
    const { theme, isDarkThemeActive } = useOrchestratorTheme();
    const { euiCodeBlockStyle, euiBasicCodeBlockStyle } =
        useWithOrchestratorTheme(getStyles);

    const json = JSON.stringify(data, null, 4);

    const [editorHeight, setEditorHeight] = useState(0);
    const [monacoInstance, setMonacoInstance] = useState<Monaco | undefined>(
        undefined,
    );

    const addThemeToEditor = useCallback(
        (monaco: Monaco) => {
            monaco.editor.defineTheme(
                isDarkThemeActive ? WFO_THEME.dark : WFO_THEME.light,
                {
                    base: isDarkThemeActive
                        ? MONACO_THEME.dark
                        : MONACO_THEME.light,
                    inherit: true,
                    rules: [
                        {
                            token: '',
                            foreground: theme.colors.textPrimary.replace(
                                '#',
                                '',
                            ),
                            background:
                                theme.colors.backgroundBasePlain.replace(
                                    '#',
                                    '',
                                ),
                        },
                    ],
                    colors: {
                        'editor.foreground': theme.colors.textPrimary,
                        'editor.background': theme.colors.backgroundBasePlain,
                    },
                },
            );
        },
        [isDarkThemeActive, theme],
    );

    function editorDidMount(
        editor: editor.IStandaloneCodeEditor,
        monaco: Monaco,
    ) {
        const scrollHeight = editor.getScrollHeight();
        setMonacoInstance(monaco);
        setEditorHeight(Math.min(scrollHeight, 500));
    }

    useEffect(() => {
        if (monacoInstance) {
            addThemeToEditor(monacoInstance);
            monacoInstance.editor.setTheme(
                isDarkThemeActive ? WFO_THEME.dark : WFO_THEME.light,
            );
        }
    }, [monacoInstance, isDarkThemeActive, addThemeToEditor, theme]);

    return (
        <Editor
            height={editorHeight}
            css={isBasicStyle ? euiBasicCodeBlockStyle : euiCodeBlockStyle}
            theme={isDarkThemeActive ? WFO_THEME.dark : WFO_THEME.light}
            options={{
                readOnly: true,
                lineNumbers: isBasicStyle ? 'off' : 'on',
                scrollBeyondLastLine: false,
                contextmenu: false,
                minimap: { enabled: false },
                mouseWheelZoom: true,
                renderLineHighlight: 'none',
                fontFamily: theme.font.family,
            }}
            beforeMount={addThemeToEditor}
            onMount={editorDidMount}
            language="json"
            value={json}
        />
    );
};
