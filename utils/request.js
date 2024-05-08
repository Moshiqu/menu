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
            // 非后台内部错误
            if (response.statusCode !== 200) {
                return uni.showToast({
                    title: '出错了~',
                    icon: 'none',
                    mask: true
                })
            }

            // 后台内部错误
            if (response.data.code != 200) {
                return uni.showToast({
                    title: response.data.message,
                    icon: 'none',
                    mask: true
                })
            }

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