import { baseResponse } from './base_response';

// mpLogin
export const mpLoginWxappRequest = {
  appId: { type: 'number', required: true, description: '应用ID' },
  code: { type: 'string', required: true, description: '登录凭证' },
};

export const mpLoginWxappResponse = {
  ...baseResponse,
  data: { type: 'loginUser', description: '登录用户信息' },
};
