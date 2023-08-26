import { baseResponse } from './base_response';

/**
 * 文件信息
 */
export const fileInfo = {
  url: { type: 'string', description: '文件路径' },
};

// uploadFile
export const queryFileRequest = {
  appId: { type: 'number', required: true, description: '应用ID' },
  hash: { type: 'string', required: true, description: '文件hash' },
};
export const queryFileResponse = {
  ...baseResponse,
  data: { type: 'fileInfo', description: '文件信息' },
};

// uploadFile
export const uploadFileRequest = {
  appId: { type: 'number', required: true, description: '应用ID' },
  tags: { type: 'string', required: true, description: '文件标签' },
  file: { type: 'file', required: true, description: '本地文件' },
};
export const uploadFileResponse = {
  ...baseResponse,
  data: { type: 'fileInfo', description: '文件信息' },
};

// uploadFileChunk
export const uploadFileChunkRequest = {
  appId: { type: 'number', required: true, description: '应用ID' },
  tags: { type: 'string', required: true, description: '文件标签' },
  hash: { type: 'string', required: true, description: '文件hash' },
  name: { type: 'string', required: true, description: '文件名称' },
  size: { type: 'number', required: true, description: '文件大小' },
  mime: { type: 'string', required: false, description: '文件类型' },
  start: { type: 'number', required: true, description: '分片位置' },
  length: { type: 'number', required: true, description: '分片长度' },
  content: { type: 'string', required: true, description: '分片内容' },
};
export const uploadFileChunkResponse = {
  ...baseResponse,
  data: { type: 'fileInfo', description: '文件信息' },
};
