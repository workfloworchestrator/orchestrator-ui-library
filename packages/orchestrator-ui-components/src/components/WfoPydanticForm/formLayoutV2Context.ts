import { createContext, useContext } from 'react';

import type { PydanticFormField } from 'pydantic-forms';

/** True inside the new start-workflow layout (WfoStartProcessPageV2). App-level fields use it to render their V2 variant. */
export const FormLayoutV2Context = createContext(false);

export const useIsFormLayoutV2 = () => useContext(FormLayoutV2Context);

/** Fields of the current V2 form page, so a field can depend on a sibling (e.g. contact persons on the customer). */
export const FormPageFieldsV2Context = createContext<Record<string, PydanticFormField>>({});
