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
        header: {
            Authorization: `Bearer ${uni.getStorageSync('token')}`
        },
        success: (response) => {
            if (response.data.code != 200) return reject(response.data)
            return resolve(response.data)
        },
        fail: (fail) => {
            return reject(fail);
        }
    })
}

export const request = (options = {}) => {
    return new Promise((resolve, rejects) => {
        handleRequest(options, resolve, rejects)
    })
}