import { ProcessStatus } from '../types';

export const listIncludesStatus = (processStatuses: ProcessStatus[], status?: string): boolean =>
  status ? processStatuses.map((processStatus) => processStatus.toUpperCase()).includes(status.toUpperCase()) : false;
