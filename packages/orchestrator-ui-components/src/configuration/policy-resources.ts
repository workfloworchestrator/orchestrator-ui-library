// Todo possibly missing policies in xls file, example '/orchestrator/prefixes/'

// http://localhost:3001/subscriptions/5095c5af-08b0-4dd7-b676-7c5094ac3689?activeTab=service-configuration

export enum PolicyResource {
    NAVIGATION_METADATA = '/orchestrator/metadata',
    NAVIGATION_SETTINGS = '/orchestrator/settings',
    NAVIGATION_SUBSCRIPTIONS = '/orchestrator/subscriptions',
    NAVIGATION_TASKS = '/orchestrator/tasks',
    NAVIGATION_WORKFLOWS = '/orchestrator/workflows',
    PROCESS_ABORT = '/orchestrator/processes/abort/',
    PROCESS_DELETE = '/orchestrator/processes/delete/',
    PROCESS_DETAILS = '/orchestrator/processes/details/',
    PROCESS_RELATED_SUBSCRIPTIONS = '/orchestrator/subscriptions/view/from-process',
    // PROCESS_RELATED_SUBSCRIPTIONS = '/orchestrator/processes/details/related-subscriptions',
    PROCESS_RETRY = '/orchestrator/processes/retry/',
    PROCESS_USER_INPUT = '/orchestrator/processes/user-input/',
    SUBSCRIPTION_CREATE = '/orchestrator/processes/create/process/menu',
    // SUBSCRIPTION_CREATE = '/orchestrator/subscriptions/create',
    SUBSCRIPTION_MODIFY = '/orchestrator/subscriptions/modify/',
    SUBSCRIPTION_TERMINATE = '/orchestrator/subscriptions/terminate/',
    SUBSCRIPTION_VALIDATE = '/orchestrator/subscriptions/validate/',
    TASKS_CREATE = '/orchestrator/processes/create/task',
    // TASKS_CREATE = '/orchestrator/processes/tasks/create-task',
    TASKS_RETRY_ALL = '/orchestrator/processes/all-tasks/retry',
    // TASKS_RETRY_ALL = '/orchestrator/processes/tasks/retry-all'
}
