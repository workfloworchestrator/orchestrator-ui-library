import styles from './custom-button.module.scss';
import React from 'react';

/* eslint-disable-next-line */
export interface CustomButtonProps {
  buttonText: string
}

export function CustomButton(props: CustomButtonProps) {
  return (
    <button>{props.buttonText}</button>
  );
}

