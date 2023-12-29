function deepCopy(newObj, oldObj) {
    for (let key in oldObj) {
        // key 是属性名 oldObj[key]是属性值
        if (oldObj[key] instanceof Array) {
            newObj[key] = []
            deepCopy(newObj[key], oldObj[key])
        } else {
            newObj[key] = oldObj[key]
            // newObj[key] 是一个属性名 oldObj[key] 是一个属性值
        }
    }
}

export {
    deepCopy
}