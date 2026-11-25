import { createContext, useContext } from 'react';

import type { PydanticFormField } from 'pydantic-forms';

/** True inside the new start-workflow layout (WfoStartProcessPageBeta). App-level fields use it to render their beta variant. */
export const BetaLayoutContext = createContext(false);

export const useIsBetaLayout = () => useContext(BetaLayoutContext);

/** Fields of the current beta form page, so a field can depend on a sibling (e.g. contact persons on the customer). */
export const BetaPageFieldsContext = createContext<Record<string, PydanticFormField>>({});
