import { baseResponse } from './base_response';

/**
 * 文件信息
 */
export const fileInfo = {
  key: { type: 'string', description: '文件路径' },
  url: { type: 'string', description: '完整文件路径' },
};

// uploadFile
export const uploadStateRequest = {
  appId: { type: 'number', required: true, description: '应用ID' },
  subId: { type: 'string', required: true, description: '内部ID' },
  hash: { type: 'string', required: true, description: '文件hash' },
};
export const uploadStateResponse = {
  ...baseResponse,
  data: { type: 'fileInfo', description: '文件信息' },
};

// uploadFile
export const uploadFileRequest = {
  appId: { type: 'number', required: true, description: '应用ID' },
  subId: { type: 'string', required: true, description: '内部ID' },
  file: { type: 'file', required: true, description: '本地文件' },
};
export const uploadFileResponse = {
  ...baseResponse,
  data: { type: 'fileInfo', description: '文件信息' },
};
