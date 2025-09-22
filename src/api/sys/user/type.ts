//传统登录接口需要携带的req类型
export interface loginReq {
  username: string;
  password: string;
}

//OAuth2授权码登录请求类型
export interface OAuth2LoginReq {
  code: string;
  state: string;
}

//OAuth2 token刷新请求类型
export interface OAuth2RefreshReq {
  refreshToken: string;
}

interface dataType {
  token: string;
}

//传统登录接口返回的resp类型
export interface loginResp {
  code: number;
  data: dataType;
  message?: string;
}

//OAuth2登录返回的token数据类型
export interface OAuth2TokenData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

//OAuth2登录接口返回的resp类型
export interface OAuth2LoginResp {
  code: number;
  data: OAuth2TokenData;
  message?: string;
}

interface userInfo {
  userId: number;
  avatar: string;
  username: string;
  password?: string;
  desc: string;
  roles: string[];
  buttons: string[];
  routes: string[];
  token?: string;
  email?: string;
  phone?: string;
  realName?: string;
  department?: string;
}

interface user {
  checkUser: userInfo;
}

export interface userInfoResp {
  code: number;
  data: user;
  message?: string;
}

//登录状态类型
export interface LoginState {
  isLoggedIn: boolean;
  token: string;
  refreshToken?: string;
  userInfo: userInfo | null;
  loginMode: "mock" | "oauth2";
}

//通用API响应类型
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message?: string;
}
