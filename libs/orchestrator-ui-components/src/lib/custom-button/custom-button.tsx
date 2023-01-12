import styles from './custom-button.module.scss';

/* eslint-disable-next-line */
export interface CustomButtonProps {
  buttonText: string
}

export function CustomButton(props: CustomButtonProps) {
  return (
    <button>{props.buttonText}</button>
  );
}

export default CustomButton;
