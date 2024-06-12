'use client';

import { useState } from 'react';

import { TestComponent } from 'npm-template-with-tsup';

export default function Counter() {
    const [count, setCount] = useState(0);
    return (
        <>
            <h2>{count}</h2>
            <button type="button" onClick={() => setCount(count + 1)}>
                +
            </button>
            <TestComponent />
        </>
    );
}
