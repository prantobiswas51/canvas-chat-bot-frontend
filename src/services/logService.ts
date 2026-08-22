import apiClient from '@/services/apiClient';

export interface LogProcessSummary {
  name: string;
  pmId: number;
  status: string;
  pid?: number;
  restarts: number;
}

export type LogType = 'out' | 'error';

export interface LogTailResult {
  path: string;
  lines: string[];
}

export const logService = {
  async listProcesses(): Promise<LogProcessSummary[]> {
    const { data } = await apiClient.get<LogProcessSummary[]>('/logs/processes');
    return data;
  },

  async tail(process: string, type: LogType, lines = 300): Promise<LogTailResult> {
    const { data } = await apiClient.get<LogTailResult>('/logs', { params: { process, type, lines } });
    return data;
  },
};

export default logService;
