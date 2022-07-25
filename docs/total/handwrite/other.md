---
title: 其他手写
author: RoleTang
date: '2022-07-25'
---

深拷贝

```js
// map 解决循环引用问题
function deepClone(obj, map = new Map()) {
	if(typeof obj  === 'function' || Object.prototype.toString.call(obj) !== '[object Object]') return obj
    if(map.has(obj)) return map.get(obj)
    const res = Array.isArray(obj) ? [] : {}
    map.set(obj, res)
    for(const key of obj) {
        if(Object.hasOwnProperty.call(obj, key)) {
            res[key] = deepClone(obj[key])
        }
    }
    return res
}
```

dom 转 json

```js
function convertToJson() {
    const root = document.getElementsByClassName('root')[0];
    const output = new Object();
    // 只需要这两个标签即可
    output.tagName = root.tagName;
    output.className = root.className;
    output.childs = getChilds(root);
    // 此方法非常快速
    console.log(JSON.stringify(output));
}

function getChilds(node) {
    const childs = node.children;
    const result = new Array();
    if(!childs || childs.length === 0) return result;
    for (const child of childs) {
        const childOutput = new Object();
        childOutput.tagName = child.tagName;
        childOutput.className = child.className;
        childOutput.childs = getChilds(child);
        result.push(childOutput);
    }
    return result;
}
convertToJson();
```