import { baseResponse } from './base_response';

/**
 * 用户信息
 */
export const user = {
  id: { type: 'integer', description: 'ID' },
  username: { type: 'string', description: '用户名' },
  password: { type: 'string', description: '密码' },
  name: { type: 'string', description: '名字' },
  avatar: { type: 'string', description: '头像' },
  phone: { type: 'string', description: '手机号' },
  gender: { type: 'integer', description: '性别' },
  birthday: { type: 'string', description: '生日' },
  email: { type: 'string', description: '邮箱' },
  remark: { type: 'string', description: '备注' },
};

/**
 * 登录用户信息
 */
export const loginUser = {
  ...user,
  token: { type: 'string', description: 'token' },
};

// login
export const userLoginRequest = {
  username: { type: 'string', required: true, example: 'admin' },
  password: { type: 'string', required: true, example: '123456' },
};
export const userLoginResponse = {
  ...baseResponse,
  data: { type: 'loginUser', description: '登录用户信息' },
};

// getLoginUser
export const getLoginUserResponse = {
  ...baseResponse,
  data: { type: 'loginUser', description: '登录用户信息' },
};

// updateBaseInfo
export const updateBaseInfoRequest = {
  name: { type: 'string', required: false, description: '姓名' },
  avatar: { type: 'string', required: false, description: '头像' },
  gender: { type: 'number', required: false, description: '性别' },
  birthday: { type: 'string', required: false, description: '生日' },
  email: { type: 'string', required: false, description: '邮箱' },
  province: { type: 'number', required: false, description: '省' },
  city: { type: 'number', required: false, description: '市' },
  county: { type: 'number', required: false, description: '区县' },
  remark: { type: 'string', required: false, description: '备注' },
};
