import {createStore} from 'vuex'

function getKeyFromStorage(key: string) {
    const localData = localStorage.getItem(key);
    if (localData) {
        return localData;
    }
    return sessionStorage.getItem(key);
}

function getDefaultBaseUrl() {
    const cachedBaseUrl = getKeyFromStorage('base_url');
    if (cachedBaseUrl) {
        return cachedBaseUrl;
    }
    return process.env.NODE_ENV === 'production' ?
        '' : ''
}

const cachedUserInfo = getKeyFromStorage('user_info');
const cachedToken = getKeyFromStorage('token');
const cachedBaseDomain = getKeyFromStorage('base_domain');
const cachedBaseUrl = getDefaultBaseUrl();
const cachedExpiredAt = getKeyFromStorage('expired_at');

export default createStore({
    state: {
        userInfo: cachedUserInfo ? JSON.parse(cachedUserInfo) : null,
        token: cachedToken ? cachedToken : null,
        baseUrl: cachedBaseUrl ? cachedBaseUrl : '',
        baseDomain: cachedBaseDomain ? cachedBaseDomain : null,
        expiredAt: cachedExpiredAt ? cachedExpiredAt : null,
        refreshingInterval: null,
        refreshSwitch: true,
        residentNotice: null
    },
    getters: {
        userInfo(state) {
            return state.userInfo;
        },
        token(state) {
            return state.token;
        },
        baseDomain(state) {
            return state.baseDomain;
        },
        expiredAt(state) {
            return state.expiredAt;
        },
        refreshingInterval(state) {
            return state.refreshingInterval;
        },
        refreshSwitch(state) {
            return state.refreshSwitch;
        },
        residentNotice(state) {
            return state.residentNotice;
        },
        baseUrl(state) {
            return state.baseUrl;
        }
    },
    mutations: {
        setLoginInfo(state, loginResponseData) {
            state.userInfo = loginResponseData.loginUser;
            state.token = loginResponseData.token;
            state.expiredAt = loginResponseData.tokenExpiredAt;
        },
        clearLoginInfo(state) {
            state.userInfo = null;
            state.token = null;
            state.expiredAt = null;
        },
        setRefreshingInterval(state, val) {
            state.refreshingInterval = val
        },
        setRefreshSwitch(state, val) {
            state.refreshSwitch = val;
        },
        setResidentNotice(state, val) {
            state.residentNotice = val;
        },
        setBaseUrl(state, val) {
            console.log("切换baseUrl", val);
            state.baseUrl = val;
            localStorage.setItem('base_url', val);
        },
        setBaseDomain(state, val) {
            state.baseDomain = val;
            localStorage.setItem('base_domain', val);
        }
    },
    actions: {},
    modules: {}
})
