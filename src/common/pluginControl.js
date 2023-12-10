import store from '@/store'

function isHasPluginCode(code) {
    const pluginCodeSet = store.getters['pluginCodeSet'];
    if (!pluginCodeSet) {
        return false;
    }
    // console.log("isHasPluginCode", code, pluginCodeSet, pluginCodeSet.has(code))
    return pluginCodeSet.has(code);
}

export {
    isHasPluginCode
}

