//登录接口需要携带的req类型
export interface loginReq {
  username: string;
  password: string;
}

interface dataType {
  token: string;
}

//登录接口返回的resp类型
export interface loginResp {
  code: number;
  token: dataType;
}

interface userInfo {
  userId: number;
  avatar: string;
  username: string;
  password: string;
  desc: string;
  roles: string[];
  buttons: string[];
  routes: string[];
  token: string;
}

interface user {
  checkUser: userInfo;
}

export interface userInfoResp {
  code: number;
  data: user;
}
