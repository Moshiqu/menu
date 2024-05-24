export const orderStatus = () => {
    // 1：待制作；2：制作中；3：制作完成；4：订单取消（只能由商家取消）；5：订单完成
    const map = new Map()

    map.set(1, '待制作')
    map.set(2, '制作中')
    map.set(3, '制作完成')
    map.set(4, '订单被商家取消')
    map.set(5, '订单完成')

    return map
}
