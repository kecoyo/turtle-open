import { baseResponse } from './base_response';

/**
 * 文件信息
 */
export const fileInfo = {
  key: { type: 'string', description: '文件路径' },
  url: { type: 'string', description: '完整文件路径' },
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

// uploadChunk
export const uploadChunkRequest = {
  appId: { type: 'number', required: true, description: '应用ID' },
  tags: { type: 'string', required: true, description: '文件标签' },
  hash: { type: 'string', required: true, description: '文件hash' },
  name: { type: 'string', required: true, description: '文件名称' },
  size: { type: 'number', required: true, description: '文件大小' },
  mime: { type: 'string', required: false, description: '文件类型' },
  content: { type: 'string', required: true, description: '分块内容' },
};
export const uploadChunkResponse = {
  ...baseResponse,
  data: { type: 'fileInfo', description: '文件信息' },
};
