import dayjs from 'dayjs';
import Md5 from 'md5';

// 格式化时间
export function formatTime(date?: dayjs.ConfigType): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}

/**
 * 生成md5
 * @param message 文本、文件
 * @returns
 */
export function md5(message: string | number[] | Uint8Array): string {
  return Md5(message);
}
