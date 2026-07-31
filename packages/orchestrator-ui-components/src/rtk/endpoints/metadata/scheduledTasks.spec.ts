import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';

import { getOrchestratorStore } from '@/rtk/store';
import type { OrchestratorConfig } from '@/types';

import { ScheduledTaskPostPayload, scheduledTasksApi } from './scheduledTasks';

jest.mock('next-auth/react', () => ({
  getSession: jest.fn().mockResolvedValue(null),
}));

// jsdom does not provide a global Request. fetchBaseQuery constructs a Request
// before delegating to fetch, so a minimal polyfill is required for these tests.
class TestRequest {
  url: string;
  method: string;
  headers: Headers;
  body: unknown;
  constructor(input: string, init: RequestInit = {}) {
    this.url = input;
    this.method = init.method ?? 'GET';
    this.headers = new Headers(init.headers);
    this.body = init.body;
  }
  clone() {
    return this;
  }
}
(global as unknown as { Request: unknown }).Request = TestRequest;

const API_BASE_URL = 'http://localhost:8080/api';

const orchestratorConfig = {
  orchestratorApiBaseUrl: API_BASE_URL,
  graphqlEndpointCore: `${API_BASE_URL}/graphql`,
  authActive: false,
} as unknown as OrchestratorConfig;

const createTestStore = () =>
  getOrchestratorStore({
    orchestratorConfig,
    customApis: [],
  });

const createScheduledTaskPayload: ScheduledTaskPostPayload = {
  workflow_id: 'workflow-id',
  workflow_name: 'workflow-name',
  name: 'my scheduled task',
  trigger: 'date',
  trigger_kwargs: { run_date: '2026-01-01T00:00:00Z' },
  scheduled_type: 'create',
  user_inputs: [],
};

const getLastFetchCall = (fetchMock: jest.Mock) => {
  const [input, init] = fetchMock.mock.calls[fetchMock.mock.calls.length - 1];
  const request = typeof input === 'string' ? { url: input, ...(init ?? {}) } : input;
  return {
    url: request.url as string,
    method: request.method as string,
    body: request.body as string,
  };
};

describe('scheduledTasksApi', () => {
  let fetchMock: jest.Mock;
  let store: ReturnType<typeof createTestStore>;
  let dispatch: ThunkDispatch<unknown, unknown, UnknownAction>;

  beforeEach(() => {
    fetchMock = jest.fn().mockResolvedValue({
      status: 200,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: async () => ({}),
      text: async () => '{}',
      clone() {
        return this;
      },
    });
    global.fetch = fetchMock as unknown as typeof fetch;
    store = createTestStore();
    dispatch = store.dispatch as ThunkDispatch<unknown, unknown, UnknownAction>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates a scheduled task with a POST to the canonical /api/schedules/ endpoint', async () => {
    await dispatch(scheduledTasksApi.endpoints.createScheduledTask.initiate(createScheduledTaskPayload));

    const { url, method, body } = getLastFetchCall(fetchMock);

    expect(url).toBe(`${API_BASE_URL}/schedules/`);
    expect(url).not.toContain('//schedules');
    expect(url).not.toContain('schedules//');
    expect(method).toBe('POST');
    expect(JSON.parse(body)).toEqual(createScheduledTaskPayload);
  });

  it('deletes a scheduled task with a DELETE to the canonical /api/schedules/ endpoint', async () => {
    await dispatch(
      scheduledTasksApi.endpoints.deleteScheduledTask.initiate({
        workflowId: 'workflow-id',
        scheduleId: 'schedule-id',
      }),
    );

    const { url, method, body } = getLastFetchCall(fetchMock);

    expect(url).toBe(`${API_BASE_URL}/schedules/`);
    expect(url).not.toContain('//schedules');
    expect(url).not.toContain('schedules//');
    expect(method).toBe('DELETE');
    expect(JSON.parse(body)).toEqual({
      scheduled_type: 'delete',
      workflow_id: 'workflow-id',
      schedule_id: 'schedule-id',
    });
  });
});
