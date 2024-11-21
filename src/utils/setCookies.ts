import Cookies from 'js-cookie';

interface CookieOptions {
  expires?: number;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
}

const setCookies = (cookieData: { [key: string]: string }, options: CookieOptions = {}) => {
  Object.keys(cookieData).forEach((key) => {
    Cookies.set(key, cookieData[key], { ...options, expires: options.expires || 7 });
  });
};

export default setCookies;
