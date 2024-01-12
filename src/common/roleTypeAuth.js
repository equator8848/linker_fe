import store from '@/store'
import {roleType} from '@/common/constant'

function isSuperAdmin() {
    const userInfo = store.getters['userInfo'];
    if (!userInfo) {
        return false;
    }
    // console.log("isSuperAdmin userInfo roleType is " + userInfo.roleType);
    return (userInfo.roleType & roleType.SUPER_ADMIN) === roleType.SUPER_ADMIN;
}

function isAdmin() {
    const userInfo = store.getters['userInfo'];
    if (!userInfo) {
        return false;
    }
    // console.log("isAdmin userInfo roleType is ", userInfo.roleType);
    return (userInfo.roleType & roleType.SUPER_ADMIN) === roleType.SUPER_ADMIN ||
        (userInfo.roleType & roleType.SYSTEM_ADMIN) === roleType.SYSTEM_ADMIN;
}

export {
    isSuperAdmin,
    isAdmin
}

