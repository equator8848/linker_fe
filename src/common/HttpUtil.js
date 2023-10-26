import axios from 'axios'
import qs from 'qs'
import {ElNotification} from 'element-plus'
import {responseCode} from '@/common/constant'
import store from '../store/index'

const instance = axios.create({
    timeout: 1000 * 300
});

instance.interceptors.request.use(config => {
    config.headers['token'] = store.getters['token'];
    return config
});

function getBaseUrl() {
    return store.getters['baseUrl'];
}

function urlEncoderPost(url, dataObject) {
    return new Promise((resolve, reject) => {
        instance.post(url, qs.stringify(dataObject))
            .then(response => {
                const responseData = response.data;
                if (responseData.status === responseCode.SUCCESS) {
                    resolve(responseData);
                } else if (responseData.status === responseCode.ASYNC) {
                    ElNotification.info({
                        title: '查询超时（非报错）',
                        message: responseData.msg
                    });
                    resolve(null);
                } else {
                    ElNotification.error({
                        title: '错误',
                        message: responseData.data ? responseData.msg + "，" + responseData.data : responseData.msg
                    });
                    reject(responseData);
                }
            }).catch(error => {
            ElNotification.error({
                title: '网络错误',
                message: error
            });
        });
    })
}

function urlEncoderPut(url, dataObject) {
    return new Promise((resolve, reject) => {
        instance.put(url, qs.stringify(dataObject))
            .then(response => {
                const responseData = response.data;
                if (responseData.status === responseCode.SUCCESS) {
                    resolve(responseData);
                } else if (responseData.status === responseCode.ASYNC) {
                    ElNotification.info({
                        title: '查询超时（非报错）',
                        message: responseData.msg
                    });
                    resolve(null);
                } else {
                    ElNotification.error({
                        title: '错误',
                        message: responseData.data ? responseData.msg + "，" + responseData.data : responseData.msg
                    });
                    reject(responseData);
                }
            }).catch(error => {
            ElNotification.error({
                title: '网络错误',
                message: error
            });
        });
    })
}

function formDataPost(url, formDataObject) {
    return new Promise((resolve, reject) => {
        instance.post(url, formDataObject, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            const responseData = response.data;
            if (responseData.status === responseCode.SUCCESS) {
                resolve(responseData);
            } else if (responseData.status === responseCode.ASYNC) {
                ElNotification.info({
                    title: '查询超时（非报错）',
                    message: responseData.msg
                });
                resolve(null);
            } else {
                ElNotification.error({
                    title: '错误',
                    message: responseData.data ? responseData.msg + "，" + responseData.data : responseData.msg
                });
                reject(responseData);
            }
        }).catch(error => {
            ElNotification.error({
                title: '网络错误',
                message: error
            });
        });
    })
}

function jsonPost(url, formDataObject) {
    return new Promise((resolve, reject) => {
        instance.post(url, formDataObject, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            const responseData = response.data;
            if (responseData.status === responseCode.SUCCESS) {
                resolve(responseData);
            } else if (responseData.status === responseCode.ASYNC) {
                ElNotification.info({
                    title: '查询超时（非报错）',
                    message: responseData.msg
                });
                resolve(null);
            } else {
                ElNotification.error({
                    title: '错误',
                    message: responseData.data ? responseData.msg + "，" + responseData.data : responseData.msg
                });
                reject(responseData);
            }
        }).catch(error => {
            ElNotification.error({
                title: '网络错误',
                message: error
            });
        });
    })
}

function jsonPut(url, formDataObject) {
    return new Promise((resolve, reject) => {
        instance.put(url, formDataObject, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            const responseData = response.data;
            if (responseData.status === responseCode.SUCCESS) {
                resolve(responseData);
            } else if (responseData.status === responseCode.ASYNC) {
                ElNotification.info({
                    title: '查询超时（非报错）',
                    message: responseData.msg
                });
                resolve(null);
            } else {
                ElNotification.error({
                    title: '错误',
                    message: responseData.data ? responseData.msg + "，" + responseData.data : responseData.msg
                });
                reject(responseData);
            }
        }).catch(error => {
            ElNotification.error({
                title: '网络错误',
                message: error
            });
        });
    })
}


function get(url, parameters) {
    return new Promise(((resolve, reject) => {
            instance.get(url, {
                params: {...parameters}
            }).then(response => {
                const responseData = response.data;
                if (responseData.status === responseCode.SUCCESS) {
                    resolve(responseData);
                } else if (responseData.status === responseCode.ASYNC) {
                    ElNotification.info({
                        title: '查询超时（非报错）',
                        message: responseData.msg
                    });
                    resolve(null);
                } else {
                    ElNotification.error({
                        title: '错误',
                        message: responseData.data ? responseData.msg + "，" + responseData.data : responseData.msg
                    });
                    reject(responseData);
                }
            }).catch(error => {
                ElNotification.error({
                    title: '网络错误',
                    message: error
                });
            });
        })
    )
}

function getSilently(url, parameters) {
    return new Promise(((resolve, reject) => {
            instance.get(url, {
                params: {...parameters}
            }).then(response => {
                const responseData = response.data;
                if (responseData.status === responseCode.SUCCESS) {
                    resolve(responseData);
                } else if (responseData.status === responseCode.ASYNC) {
                    resolve(null);
                } else {
                    console.log("request error" + JSON.stringify(responseData));
                    reject(responseData);
                }
            }).catch(error => {
                console.log("request error" + error);
                reject(null);
            });
        })
    )
}

function httpDelete(url, parameters) {
    return new Promise(((resolve, reject) => {
            instance.delete(url, {
                params: {...parameters}
            }).then(response => {
                const responseData = response.data;
                if (responseData.status === responseCode.SUCCESS) {
                    resolve(responseData);
                } else if (responseData.status === responseCode.ASYNC) {
                    ElNotification.info({
                        title: '查询超时（非报错）',
                        message: responseData.msg
                    });
                    resolve(null);
                } else {
                    ElNotification.error({
                        title: '错误',
                        message: responseData.data ? responseData.msg + "，" + responseData.data : responseData.msg
                    });
                    reject(responseData);
                }
            }).catch(error => {
                ElNotification.error({
                    title: '网络错误',
                    message: error
                });
            });
        })
    )
}

export default {
    get(url, parameters) {
        return get(getBaseUrl() + url, parameters)
    },
    getWithoutBaseUrl(url, parameters) {
        return getSilently(url, parameters)
    },
    put(url, parameters) {
        return urlEncoderPut(getBaseUrl() + url, parameters)
    },
    urlEncoderPost(url, dataObject) {
        return urlEncoderPost(getBaseUrl() + url, dataObject);
    },
    urlEncoderPut(url, dataObject) {
        return urlEncoderPut(getBaseUrl() + url, dataObject);
    },
    urlEncoderDelete(url, parameters) {
        return httpDelete(getBaseUrl() + url, parameters);
    },
    jsonPost(url, dataObject) {
        return jsonPost(getBaseUrl() + url, dataObject);
    },
    jsonPut(url, dataObject) {
        return jsonPut(getBaseUrl() + url, dataObject);
    },
    formDataPost(url, formData) {
        return jsonPost(getBaseUrl() + url, formData);
    }
}
