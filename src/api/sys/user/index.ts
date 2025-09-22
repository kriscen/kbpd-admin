//管理用户相关接口
import request from "@/utils/request";
import type {
  loginReq,
  loginResp,
  userInfoResp,
  OAuth2LoginReq,
  OAuth2LoginResp,
  OAuth2RefreshReq
} from "./type";
import { isMockLogin, getEnvConfig } from "@/utils/env";

//统一管理接口地址
enum API {
  LOGIN_URL = "/user/login",
  USER_INFO_URL = "/user/info",
  OAUTH2_LOGIN_URL = "/oauth2/login",
  OAUTH2_TOKEN_URL = "/oauth2/token",
  OAUTH2_REFRESH_URL = "/oauth2/refresh"
}

//暴露请求函数
//传统登录接口
export const reqLogin = (data: loginReq) => {
  if (isMockLogin()) {
    // 开发模式使用模拟数据
    return request.post<loginReq, loginResp>(API.LOGIN_URL, data);
  } else {
    // 生产模式或OAuth2模式，这里可以是一个兼容接口
    return request.post<loginReq, loginResp>(API.LOGIN_URL, data);
  }
};

//OAuth2授权码登录接口
export const reqOAuth2Login = (data: OAuth2LoginReq) => {
  const config = getEnvConfig();
  // 使用外部OAuth2服务的token接口
  return request.post<OAuth2LoginReq, OAuth2LoginResp>(config.oauth2.tokenUrl, {
    grant_type: "authorization_code",
    client_id: config.oauth2.clientId,
    code: data.code,
    redirect_uri: config.oauth2.redirectUri,
    state: data.state
  });
};

//OAuth2刷新token接口
export const reqOAuth2RefreshToken = (data: OAuth2RefreshReq) => {
  const config = getEnvConfig();
  return request.post<OAuth2RefreshReq, OAuth2LoginResp>(
    config.oauth2.tokenUrl,
    {
      grant_type: "refresh_token",
      client_id: config.oauth2.clientId,
      refresh_token: data.refreshToken
    }
  );
};

//获取用户信息接口
export const reqUserInfo = () =>
  request.get<void, userInfoResp>(API.USER_INFO_URL);
