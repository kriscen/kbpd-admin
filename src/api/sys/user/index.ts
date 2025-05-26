//管理用户相关接口
import request from "@/utils/request";
import type { loginReq, loginResp, userInfoResp } from "./type";

//统一管理接口地址
enum API {
  LOGIN_URL = "/user/login",
  USER_INFO_URL = "/user/info"
}

//暴露请求函数
//登录接口
export const reqLogin = (data: loginReq) =>
  request.post<loginReq, loginResp>(API.LOGIN_URL, data);

//获取用户信息接口
export const reqUserInfo = () =>
  request.get<void, userInfoResp>(API.USER_INFO_URL);
