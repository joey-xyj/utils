import { resolve } from "path";

/**
 * @file 常用js工具类
 * @author june(jioser@qq.com)
 */

let jsonNum = 0;

/**
 * jsonp
 * @param {string} url 请求url
 * @param {*} handler 数据加载完后的回调
 */
export function jsonp(url, handler) {
    // unique function name
    const funcName = `_unique_json_fun_${jsonNum++}`;
    window[funcName] = function () {
        handler.apply(this, arguments);
        delete this.window[funcName];
        s.parentNode.removeChild(pa);
    }

    const pa = document.createElement('script');
    pa.type = 'text/javascript';
    pa.charset = 'utf-8';
    pa.async = true;
    pa.src = `${url}&&callback=${funcName}`;
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(pa, s);
}

/**
 * 封装ajax
 * @param {string} method get/post
 * @param {string} url 请求url
 * @param {Object} params 请求参数
 */
export function ajax(method, url, params = {}) {
    return new Promise((resolve, reject) =>{
        try {
            method = method.toUpperCase();
            if (method === 'GET' && params) {
                url += (url.indexOf('?') === -1 ? '?' : '&') + urlParamsFormat(params);
            }

            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState !== 4) {
                    return;
                }

                xhr.status == 200
                    ? resolve(JSON.parse(xhr.responseText))
                    : resolve(xhr.status);
            }

            xhr.open(method, url, true);

            if (method === 'POST') {
                xhr.setRequestHeader('Content-type', 'application/json; chartset=utf-8');
            }
            xhr.send(method === 'PSOT' ? JSON.stringify(params) : null);
        } catch (e) {
            console.error(e);
        }
    });
}

/**
 * 对象转换
 * @param {Object} params 请求参数
 * @return {string} 组合string
 */
export function urlParamsFormat(params) {
    if (!params) {
        return '';
    }

    let results = [];
    for (let key in params) {
        results.push(`${key}=${params[key]}`);
    }

    return results.join('&');
}

/**
 * localStroage 获取
 * @param {string} key
 * @return {string} 返回数据
 */
export function lsGet(key) {
    try {
        return window.localStorage.getItem(key);
    } catch (e) {
        return undefined;
    }
}

/**
 * localStroage 设置
 * @param {string} key
 * @return {value} 值
 */
export function lsSet (key, val) {
    try {
        window.localStorage.setItem(key, val);
    } catch (e) {
        return false
    }
}

/**
 * sessionStorage 获取
 * @param {string} key
 * @return {string} 返回数据
 */
export function ssGet(key) {
    try {
        return window.sessionStorage.getItem(key);
    } catch (e) {
        return undefined;
    }
}

/**
 * sessionStorage 设置
 * @param {string} key
 * @return {value} 值
 */
export function ssSet (key, val) {
    try {
        window.sessionStorage.setItem(key, val);
    } catch (e) {
        return false
    }
}
