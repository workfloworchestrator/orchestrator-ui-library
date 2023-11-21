import { useContext } from 'react';

import { ToastContext } from '../contexts/ToastContext';

export const useToastMessage = () => useContext(ToastContext);
