import { baseResponse } from './base_response';

/**
 * 文件信息
 */
export const areaInfo = {
  url: { type: 'string', description: '文件路径' },
};

export const getAreasResponse = {
  ...baseResponse,
  data: { type: 'array', itemType: 'areaInfo', description: '区域列表' },
};

// getAreas
export const getAreasRequest = {
  areaIds: { type: 'array', itemType: 'number', required: true, description: '区域ID列表' },
};

// getSubAreas
export const getSubAreasRequest = {
  areaId: { type: 'number', required: true, description: '区域ID' },
};
