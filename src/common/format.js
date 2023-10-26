function nodeIdMask(nodeInput) {
    if (nodeInput.startsWith("lxd")) {
        return `主机${nodeInput.substring(3)}`;
    }
    return "error";
}

import {planing} from '@/common/constant'

function getPlaningStr(inputPlaning) {
    switch (inputPlaning) {
        case planing.TEST:
            return "测试版";
        case planing.EXPLORER:
            return "试用版";
        case planing.STANDARD:
            return "特惠版";
        case planing.PROFESSION:
            return "专业版";
        case planing.FLAGSHIP:
            return "旗舰版";
        default:
            return "定制版"
    }
}

function getPlaningStrList(allowPlannings) {
    return allowPlannings.map(x => getPlaningStr(x)).join(" ");
}

export {
    nodeIdMask,
    getPlaningStr,
    getPlaningStrList
}