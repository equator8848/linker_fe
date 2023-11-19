import store from '@/store'
import {roleType} from '@/common/constant'

const userInfo = store.getters['userInfo'];

function isSuperAdmin() {
    if (!userInfo) {
        return false;
    }
    // console.log("isSuperAdmin userInfo roleType is " + userInfo.roleType);
    return (userInfo.roleType & roleType.SUPER_ADMIN) === roleType.SUPER_ADMIN;
}

function isAdmin() {
    if (!userInfo) {
        return false;
    }
    // console.log("isSuperAdmin userInfo roleType is " + userInfo.roleType);
    const userRoleType = (userInfo.roleType & roleType.SUPER_ADMIN);
    return userRoleType === roleType.SUPER_ADMIN || userRoleType === roleType.SYSTEM_ADMIN;
}

export {
    isSuperAdmin,
    isAdmin
}

