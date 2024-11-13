'use client';

import { useContext, useState } from 'react';

import { ComponentUsingContext } from '@/components/ComponentUsingContext';
import { OrchestratorConfigContext } from '@/contexts/ConfigContext';

export default function Page() {
    const [isHidden, setIsHidden] = useState(true);

    const configuration = useContext(OrchestratorConfigContext);
    console.log('page 2 (client)', configuration);

    return (
        <>
            <h1>Subpage 2 (client)</h1>
            <button onClick={() => setIsHidden(!isHidden)}>Toggle</button>
            {isHidden && <div>Some text</div>}
            <ComponentUsingContext />
        </>
    );
}
