export interface RequestUserInterface {
  sub: number;
  email: string;
  iat: number;
  exp: number;
  role: string;
  isAuth: boolean;
  isBlackList: boolean;
}
