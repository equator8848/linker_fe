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
const cachedCurrentProject = getKeyFromStorage('current_project')
const cachedCurrentInstanceId = getKeyFromStorage('current_instance_id')


export default createStore({
    state: {
        userInfo: cachedUserInfo ? JSON.parse(cachedUserInfo) : null,
        token: cachedToken ? cachedToken : null,
        baseUrl: cachedBaseUrl ? cachedBaseUrl : '',
        baseDomain: cachedBaseDomain ? cachedBaseDomain : null,
        expiredAt: cachedExpiredAt ? cachedExpiredAt : null,
        needUpdateUserName: false,
        refreshingInterval: null,
        refreshSwitch: true,
        currentProject: cachedCurrentProject ? JSON.parse(cachedCurrentProject) : null,
        projectList: [],
        currentInstanceId: cachedCurrentInstanceId ? cachedCurrentInstanceId : null,
    },
    getters: {
        userInfo(state) {
            return state.userInfo;
        },
        needUpdateUserName(state) {
            return state.needUpdateUserName;
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
        currentProject(state) {
            return state.currentProject;
        },
        projectList(state) {
            return state.projectList;
        },
        currentInstanceId(state) {
            return state.currentInstanceId;
        },
        baseUrl(state) {
            return state.baseUrl;
        }
    },
    mutations: {
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo;
        },
        setLoginInfo(state, loginResponseData) {
            state.userInfo = loginResponseData.loginUser;
            state.token = loginResponseData.token;
            state.expiredAt = loginResponseData.tokenExpiredAt;
            state.needUpdateUserName = loginResponseData.needUpdateUserName;
        },
        setNeedUpdateUserNameFlag(state, needUpdateUserNameFlag) {
            state.needUpdateUserName = needUpdateUserNameFlag;
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
        setCurrentProject(state, val) {
            state.currentProject = val;
            localStorage.setItem('current_project', JSON.stringify(val));
        },
        setProjectList(state, val) {
            state.projectList = val;
        },
        setCurrentInstanceId(state, instanceId) {
            state.currentInstanceId = instanceId;
            localStorage.setItem('current_instance_id', instanceId);
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
