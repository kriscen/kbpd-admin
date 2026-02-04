/**
 * @zh_CN 登录页面 url 地址
 */
export const LOGIN_PATH = '/auth/login';

/**
 * @zh_CN 文档地址
 */
export const KBPD_DOC_URL = 'https://doc.kbpd.com';

/**
 * @zh_CN Github 地址
 */
export const KBPD_GITHUB_URL = 'https://github.com/kbpd/kbpd-admin';

/**
 * @zh_CN 预览地址
 */
export const KBPD_PREVIEW_URL = 'https://preview.kbpd.com';

export interface LanguageOption {
  label: string;
  value: 'en-US' | 'zh-CN';
}

/**
 * Supported languages
 */
export const SUPPORT_LANGUAGES: LanguageOption[] = [
  {
    label: '简体中文',
    value: 'zh-CN',
  },
  {
    label: 'English',
    value: 'en-US',
  },
];
