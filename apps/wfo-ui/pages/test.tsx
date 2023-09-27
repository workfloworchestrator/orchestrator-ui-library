import React, { FC, useEffect, useRef, useState } from 'react';

// Not so great solution

type HugeDivProps = {
    color: string;
    text: string;
    scrollIntoView: boolean;
};

const HugeDiv: FC<HugeDivProps> = ({ color, text, scrollIntoView }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log(`useEffect for ${text}`, { ref, current: ref.current });
        if (ref.current) {
            if (scrollIntoView) {
                ref.current.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [scrollIntoView]);

    return (
        <div ref={ref} css={{ backgroundColor: color, height: '100vh' }}>
            {text}
        </div>
    );
};

export function TestPage() {
    const [div1, setDiv1] = useState(false);
    const [div2, setDiv2] = useState(false);

    return (
        <>
            <h1>Test</h1>
            <button
                onClick={() => {
                    setDiv1(false);
                    setDiv2(true);
                }}
            >
                BTN2
            </button>
            <HugeDiv color={'lightBlue'} text={'DIV 1'} scrollIntoView={div1} />
            <HugeDiv color={'pink'} text={'DIV 2'} scrollIntoView={div2} />
            <button
                onClick={() => {
                    setDiv2(false);
                    setDiv1(true);
                }}
            >
                BTN1
            </button>
        </>
    );
}

export default TestPage;
