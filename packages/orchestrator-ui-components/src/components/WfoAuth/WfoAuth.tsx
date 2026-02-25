import React, { ReactNode, useContext } from 'react';

import { WfoLogoSpinner } from '@/components';
import { OrchestratorConfigContext } from '@/contexts';
import { PolicyContextProvider } from '@/contexts/PolicyContext';
import { useWfoSession } from '@/hooks';

interface AuthProps {
  children: ReactNode;
  isAllowedHandler?: (routerPath: string, resource?: string) => boolean;
}

/**
 * The WfoAuth component exposes a function isAllowedHandler to apply policy checks.
 * In components in this library a usePolicy hook is available that exposes a function isAllowed
 * with 1 optional parameter "resource".
 *
 * For convenience there is also a WfoIsAllowedToRender component available. In both hook
 * and component the current route is determined in the usePolicy hook and passed as
 * first parameter in the isAllowedHandler function in this WfoAuth component.
 *
 * Example for usage in any component:
 * const { isAllowed } = usePolicy();
 * const isAllowedToDoOrSeeSomething: boolean = isAllowed('something')
 *
 * Example for implementing the isAllowed function:
 * const isAllowed = (routerPath: string, resource?: string) => {
 *     // Your own rules to determine if something is allowed or not
 *     // The useWfoSession hook can be used to get the current user profile
 * }
 */
export const WfoAuth = ({ children, isAllowedHandler = () => true }: AuthProps) => {
  const { authActive } = useContext(OrchestratorConfigContext);
  const { status } = useWfoSession({
    required: authActive,
  });

  if (status === 'loading') {
    return <WfoLogoSpinner />;
  }

  return <PolicyContextProvider isAllowedHandler={isAllowedHandler}>{children}</PolicyContextProvider>;
};
