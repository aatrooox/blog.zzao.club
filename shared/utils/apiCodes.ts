/**
 * API 错误代码定义
 * 前后端共享的错误代码枚举
 */

export const API_CODES = {
  // 成功
  SUCCESS: 0,

  // 认证相关错误 (1000-1999)
  NO_TOKEN: 1001, // 未提供token
  TOKEN_EXPIRED: 1002, // token过期（可刷新）
  TOKEN_INVALID: 1003, // token无效（不可刷新）
  AUTH_FAILED: 1004, // 认证失败
  REFRESH_TOKEN_EXPIRED: 1005, // refresh token过期

  // 权限相关错误 (2000-2999)
  PERMISSION_DENIED: 2001, // 无权限
  FORBIDDEN: 2002, // 禁止访问

  // 业务相关错误 (3000-3999)
  VALIDATION_ERROR: 3001, // 参数验证错误
  RESOURCE_NOT_FOUND: 3002, // 资源不存在
  DUPLICATE_ERROR: 3003, // 重复错误

  // 系统错误 (9000-9999)
  INTERNAL_ERROR: 9001, // 内部错误
  NETWORK_ERROR: 9002, // 网络错误
} as const

export type ApiCode = typeof API_CODES[keyof typeof API_CODES]

/**
 * 错误代码到消息的映射
 */
export const API_ERROR_MESSAGES = {
  [API_CODES.NO_TOKEN]: '请先登录后再尝试',
  [API_CODES.TOKEN_EXPIRED]: '登录已过期',
  [API_CODES.TOKEN_INVALID]: '滴！无效卡！',
  [API_CODES.AUTH_FAILED]: '滴！什么卡？',
  [API_CODES.REFRESH_TOKEN_EXPIRED]: '滴！过期卡！',
  [API_CODES.PERMISSION_DENIED]: '无权限访问',
  [API_CODES.FORBIDDEN]: '禁止访问',
  [API_CODES.VALIDATION_ERROR]: '参数验证失败',
  [API_CODES.RESOURCE_NOT_FOUND]: '资源不存在',
  [API_CODES.DUPLICATE_ERROR]: '重复操作',
  [API_CODES.INTERNAL_ERROR]: '内部错误',
  [API_CODES.NETWORK_ERROR]: '网络错误',
} as const
