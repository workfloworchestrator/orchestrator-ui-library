import styles from './orchestrator-ui-components.module.scss';

/* eslint-disable-next-line */
export interface OrchestratorUiComponentsProps {}

export function OrchestratorUiComponents(props: OrchestratorUiComponentsProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to OrchestratorUiComponents!</h1>
    </div>
  );
}

export default OrchestratorUiComponents;
