/**
 * 统一错误处理工具类
 */
import { ElMessage } from "element-plus";

// 错误类型枚举
export enum ErrorType {
  NETWORK_ERROR = "NETWORK_ERROR",
  AUTH_ERROR = "AUTH_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR"
}

// 错误信息接口
export interface ErrorInfo {
  type: ErrorType;
  code?: number;
  message: string;
  details?: any;
}

// 错误处理类
export class ErrorHandler {
  // HTTP状态码错误映射
  private static statusErrorMap: Record<number, string> = {
    400: "请求参数错误",
    401: "未授权，请重新登录",
    403: "拒绝访问，权限不足",
    404: "请求的资源不存在",
    405: "请求方法不允许",
    408: "请求超时",
    422: "请求参数验证失败",
    500: "服务器内部错误",
    502: "网关错误",
    503: "服务不可用",
    504: "网关超时"
  };

  // 根据HTTP状态码获取错误信息
  static getErrorByStatus(status: number): ErrorInfo {
    const message = this.statusErrorMap[status] || `HTTP错误: ${status}`;

    let type = ErrorType.UNKNOWN_ERROR;
    if (status === 401) {
      type = ErrorType.AUTH_ERROR;
    } else if (status >= 400 && status < 500) {
      type = ErrorType.VALIDATION_ERROR;
    } else if (status >= 500) {
      type = ErrorType.SERVER_ERROR;
    }

    return {
      type,
      code: status,
      message
    };
  }

  // 网络错误处理
  static getNetworkError(): ErrorInfo {
    return {
      type: ErrorType.NETWORK_ERROR,
      message: "网络连接失败，请检查网络设置"
    };
  }

  // 显示错误消息
  static showError(error: ErrorInfo | string) {
    const message = typeof error === "string" ? error : error.message;
    ElMessage.error(message);
  }

  // 显示成功消息
  static showSuccess(message: string) {
    ElMessage.success(message);
  }

  // 显示警告消息
  static showWarning(message: string) {
    ElMessage.warning(message);
  }

  // 处理API响应错误
  static handleApiError(response: any): ErrorInfo {
    if (response?.code !== 200) {
      return {
        type: ErrorType.SERVER_ERROR,
        code: response?.code,
        message: response?.message || "服务器响应异常",
        details: response
      };
    }

    return {
      type: ErrorType.UNKNOWN_ERROR,
      message: "未知错误"
    };
  }
}

// 错误边界装饰器（用于异步函数）
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  showError: boolean = true
): T {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error: any) {
      const errorInfo = error.response
        ? ErrorHandler.getErrorByStatus(error.response.status)
        : ErrorHandler.getNetworkError();

      if (showError) {
        ErrorHandler.showError(errorInfo);
      }

      throw errorInfo;
    }
  }) as T;
}
