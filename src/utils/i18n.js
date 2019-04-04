import Cookies from 'js-cookie';

const LANGUAGE_COOKIE_KEY = 'lang';

const setLanguage = lang => {
  Cookies.set(LANGUAGE_COOKIE_KEY, lang);
};

const getLanguage = () => Cookies.get(LANGUAGE_COOKIE_KEY) || 'zh-TW';

export { setLanguage, getLanguage };
