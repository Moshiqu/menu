import moment from "moment"

const formateTime = (str) => {
    if(!str) return ''
    const date = new Date(str)
    if (isNaN(date.getTime())) {
        // 如果字符串不能被解析为有效的日期对象，返回一个错误或默认值  
        return "Invalid date string";
    }

    return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

export {
    formateTime
}