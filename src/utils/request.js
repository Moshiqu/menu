const url_all = {
    'DEV': 'http://192.168.0.112:3001', // 开发
}


let BASEURL = url_all['DEV']


// 发起请求
function handleRequest(options, resolve, reject) {
    uni.request({
        url: BASEURL + options.url,
        method: options.method,
        data: options.data,
        success: (response) => {
            return resolve(response.data)
        },
        fail: (fail) => {
            console.log('fail', fail)
            return reject(fail);
        }
    })
}

export const request = (options = {}) => {
    return new Promise((resolve, rejects) => {
        handleRequest(options, resolve, rejects)
    })
}