export const JWT_API = {
    secret: 'SECRET-KEY',
    timeout: '1 days'
};

export const FIREBASE_API = {
    apiKey: 'AIzaSyBernKzdSojh_vWXBHt0aRhf5SC9VLChbM',
    authDomain: 'secretum.firebaseapp.com',
    projectId: 'secretum-staking',
    storageBucket: 'secretum-staking.appspot.com',
    messagingSenderId: '901111229354',
    appId: '1:901111229354:web:a5ae5aa95486297d69d9d3',
    measurementId: 'G-MGJHSL8XW3'
};

export const AUTH0_API = {
    client_id: '7T4IlWis4DKHSbG8JAye4Ipk0rvXkH9V',
    domain: 'dev-w0-vxep3.us.auth0.com'
};

export const AWS_API = {
    poolId: 'us-east-1_AOfOTXLvD',
    appClientId: '3eau2osduslvb7vks3vsh9t7b0'
};

// basename: only at build time to set, and Don't add '/' at end off BASENAME for breadcrumbs, also Don't put only '/' use blank('') instead,
export const BASE_PATH = '';

export const DASHBOARD_PATH = '/main';

const config = {
    fontFamily: `'Roboto', sans-serif`,
    borderRadius: 8,
    outlinedFilled: true,
    navType: 'dark', // light, dark
    presetColor: 'default', // default, theme1, theme2, theme3, theme4, theme5, theme6
    locale: 'en', // 'en' - English, 'fr' - French, 'ro' - Romanian, 'zh' - Chinese
    rtlLayout: false,
    container: true
};

export default config;
