import React, { FC, useMemo } from 'react';

import { css } from '@emotion/react';

import { useOrchestratorTheme } from '@/hooks';

interface WfoHighlightedTextProps {
    text: string;
    highlight_indices: [number, number][];
}

export const WfoHighlightedText: FC<WfoHighlightedTextProps> = ({
    text,
    highlight_indices,
}) => {
    const { theme } = useOrchestratorTheme();

    const highlightStyles = css`
        background-color: ${theme.colors.warning};
        color: ${theme.colors.plainDark};
        padding: 0 ${theme.size.xs};
        font-family: ${theme.font.family};
        font-weight: ${theme.font.weight.bold};
        border-radius: ${theme.size.xs};
    `;

    const highlightedParts = useMemo(() => {
        if (!highlight_indices || highlight_indices.length === 0) {
            return text;
        }

        const sorted = [...highlight_indices].sort((a, b) => a[0] - b[0]);
        const parts: React.ReactNode[] = [];
        let lastIndex = 0;

        sorted.forEach(([start, end], idx) => {
            // Plain text
            if (start > lastIndex) {
                parts.push(
                    <span key={`plain-${idx}`}>
                        {text.slice(lastIndex, start)}
                    </span>,
                );
            }
            // Highlighted text
            parts.push(
                <span key={`hl-${idx}`} css={highlightStyles}>
                    {text.slice(start, end)}
                </span>,
            );
            lastIndex = end;
        });

        // Remaining plain text
        if (lastIndex < text.length) {
            parts.push(<span key="plain-last">{text.slice(lastIndex)}</span>);
        }

        return parts;
    }, [text, highlight_indices, highlightStyles]);

    return <>{highlightedParts}</>;
};
