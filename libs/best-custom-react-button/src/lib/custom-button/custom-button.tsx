import styles from './custom-button.module.scss';
import {FC} from 'react';
import { EuiButton } from '@elastic/eui';

/* eslint-disable-next-line */
export interface CustomButtonProps {
  buttonText: string
}

export const CustomButton:FC<CustomButtonProps> = (props: CustomButtonProps) => {
  return (
    <EuiButton fill>Lokale aanpassing</EuiButton>
  );
}

