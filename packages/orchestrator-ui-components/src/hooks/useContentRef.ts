import { useContext } from 'react';

import { ContentContext } from '../components/WfoPageTemplate';

export const useContentRef = () => ({
    contentRef: useContext(ContentContext)?.contentRef,
});
