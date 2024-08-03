const commonSettings = {
    refreshingIntervalMs: 5000
}

const responseCode = {
    SUCCESS: 2000,
    ASYNC: 2002,
    BAD_REQUEST: 4000,
    UNAUTHORIZED: 4001,
    FORBIDDEN: 4003,
    PRECONDITION_FAILED: 4012,
    SERVER_ERROR: 5000
}

const operationStatusStr = {
    INIT: "已提交",
    RUNNING: "运行中",
    STOP: "已结束",
    ERROR: "错误",
}

const instanceCloudInitStatusStr = {
    UNKNOWN: "未知",
    RUNNING: "运行中",
    DONE: "已完成",
    ERROR: "错误",
}

const instanceCloudInitStatus = {
    UNKNOWN: 0,
    RUNNING: 1,
    DONE: 2,
    ERROR: 3,
}

const instanceVolumeStatus = {
    UNKNOWN: 0,
    NORMAL: 1,
    ERROR: 2,
}

const instanceStatus = {
    INIT: 1,
    RUNNING: 20,
    STOP: 30,
    ERROR: 40,
    TEMPORARY: 50,
    DELETED: 100
}

const planing = {
    TEST: 1,
    EXPLORER: 2,
    STANDARD: 4,
    PROFESSION: 8,
    FLAGSHIP: 16,
    CUSTOM: 32,
}

const serverDomain = {
    PRIMARY: 'primary_domain',
    BACKUP1: 'backup_domain1',
    BACKUP2: 'backup_domain2',
    BACKUP3: 'backup_domain3',
}

const roleType = {
    VISITOR: 1,
    USER: 2,
    SYSTEM_ADMIN: 4,
    SUPER_ADMIN: 8,
}

const userStatus = {
    DISABLE: 0,
    NORMAL: 1,
}

const loginStatus = {
    SUCCESS: 0,
    USER_NOT_FOUND: 1,
    PASSWORD_NOT_MATCH: 2,
    FORBIDDEN: 3,
    NEED_SET_PASSWORD: 4
}

const eventType = {
    CHANGE_PROJECT: "CHANGE_PROJECT"
}

const imageVersionType = {
    CUSTOM: 0,
    COMPARABLE_VERSION: 1,
    TIMESTAMP: 2,
    CUSTOM_PREFIX_TIMESTAMP: 3
}

export {
    responseCode,
    operationStatusStr,
    commonSettings,
    instanceCloudInitStatus,
    instanceCloudInitStatusStr,
    instanceStatus,
    planing,
    instanceVolumeStatus,
    serverDomain,
    roleType,
    loginStatus,
    userStatus,
    eventType,
    imageVersionType
}

