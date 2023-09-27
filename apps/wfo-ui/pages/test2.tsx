import React, { LegacyRef, MutableRefObject, useRef } from 'react';

// This might be it

// ---------- HugeDiv Component representing a Step card ----------
type HugeDivProps = {
    color: string;
    text: string;
};

const HugeDivWithoutRef = (
    { color, text }: HugeDivProps,
    ref: LegacyRef<HTMLDivElement>,
) => {
    return (
        <div ref={ref} css={{ backgroundColor: color, height: '100vh' }}>
            {text}
        </div>
    );
};

const HugeDiv = React.forwardRef(HugeDivWithoutRef);

// -------------------- The parent page ---------------------------
export function TestPage() {
    type DivComponent = {
        ref: MutableRefObject<HTMLDivElement | null>;
        color: string;
        text: string;
    };

    const theObjectCollection: DivComponent[] = [
        {
            text: 'DIV 1',
            color: 'lightBlue',
            ref: useRef<HTMLDivElement>(null),
        },
        {
            text: 'DIV 2',
            color: 'pink',
            ref: useRef<HTMLDivElement>(null),
        },
        {
            text: 'DIV 3',
            color: 'lightGreen',
            ref: useRef<HTMLDivElement>(null),
        },
        {
            text: 'DIV 4',
            color: 'lightYellow',
            ref: useRef<HTMLDivElement>(null),
        },
    ];

    return (
        <>
            <h1>Test</h1>
            <button
                onClick={() =>
                    theObjectCollection[0].ref.current?.scrollIntoView({
                        behavior: 'smooth',
                    })
                }
            >
                [BTN1]
            </button>
            <button
                onClick={() =>
                    theObjectCollection[1].ref.current?.scrollIntoView({
                        behavior: 'smooth',
                    })
                }
            >
                [BTN2]
            </button>
            <button
                onClick={() =>
                    theObjectCollection[2].ref.current?.scrollIntoView({
                        behavior: 'smooth',
                    })
                }
            >
                [BTN3]
            </button>
            <button
                onClick={() =>
                    theObjectCollection[3].ref.current?.scrollIntoView({
                        behavior: 'smooth',
                    })
                }
            >
                [BTN4]
            </button>

            {theObjectCollection.map(({ text, color, ref }) => (
                <HugeDiv key={text} ref={ref} color={color} text={text} />
            ))}
        </>
    );
}

export default TestPage;
