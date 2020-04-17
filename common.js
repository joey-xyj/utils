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

/**
 * 防抖函数 - 最后一次调用时触发
 * @param {Function} fn 原始函数
 * @param {number} delaytime 延迟时间
 * @return {Function}
 */
export function debounce (fn, delaytime) {
    let timer = null;
    return (...args) => {
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
        }, delaytime);
    }
}

/**
 * 防抖 进阶版
 * @param {Function} fn 原始函数
 * @param {number} delaytime 等待事件(ms)，
 * @param {number} overtime 
 * @return {Function}
 */
export function debounce_advance (fn, delaytime, overtime) {
    let previous = null;
    let timer = null;
    return (...args) => {
        let now = +new Date();
        if (!previous) {
            previous = now;
        }

        if (now - previous > overtime) {
            timer && clearTimeout(timer);
            previous = now;
            return new Promise(resolve => {
                resolve(fn(...args));
            })
        } else {
            timer && clearTimeout(timer);
            return new Promise(resolve => {
                timer = setTimeout(() => {
                    resolve(fn(...args));
                }, delaytime);
            });
        }
    }
    
}

/**
 * 节流 - 在一段时间内只能执行一次
 * @param {Function} fn 原始函数
 * @param {number} delay  延时时间
 * @return {Function}
 */
export function throttle(fn, delay) {
    let last_time;
    let timer = null;
    return (...args) => {
        let now = +new Date();
        if (last_time && now < last_time + delay) { // 还在当前时间
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn(...args);
                last_time = now;
            }, delay);
        } else {
            last_time = now;
            fn();
        } 
    }
}