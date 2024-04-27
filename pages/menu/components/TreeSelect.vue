<template>
    <view class="menu_content">
        <view class="category">
            <scroll-view scroll-y style="height: 100%;" scroll-with-animation>
                <view :class="['tab', parentActiveId == item.id ? 'active' : '']" v-for="item in menuStore.menuList"
                    :key="item.id" @click="parentClickHandler(item.id)">
                    {{ item.category_name }}
                    <view class="dot" v-if="calDot(item.id)">{{ calDot(item.id) }}</view>
                </view>
                <view :class="['tab category_set', parentActiveId === -1 ? 'active' : '']" style="color: #2678fa;"
                    @click="parentClickHandler(-1)">
                    分类管理
                </view>
                <view :style="{ background: '#fff', paddingBottom: '300rpx' }">
                </view>
            </scroll-view>
        </view>
        <view class="product" id="product_box">
            <view class="unvisited_box"></view>
            <scroll-view scroll-y style="height: 100%;" :scroll-into-view="intoParentId" scroll-with-animation
                class="scroll-view">
                <view class="cate" v-for="item in menuStore.menuList" :key="item.id" :id="'parent_' + item.id">
                    <view class="cate_title">{{ item.category_name }}</view>
                    <view class="product_card" v-for="(product, productIndex) in item.children" :key="product.id"
                        v-if="item.children.length">
                        <image src="/static/image/default_img.jpg" class="product_img" @click="toDetail(product.id)">
                        </image>
                        <view class="product_info">
                            <view class="product_title">{{ product.product_name }}</view>
                            <view class="product_desc">{{ product.product_description }}</view>
                            <view class="product_sale" v-if="!isEdit">
                                <view class="price">￥{{ product.product_price || 0 }}</view>
                                <view>销量:{{ product.sold_num || 0 }}</view>
                            </view>
                            <view class="product_like" v-if="!isEdit && product.like_num">
                                <view>
                                    <image src="/static/image/menu/icon_like.png" mode="widthFix" />
                                    <view class="num">123</view>
                                </view>
                            </view>
                            <view class="product_operation" v-if="!isEdit">
                                <template v-if="calSelectNum(item.id, product.id)">
                                    <image src="/static/image/menu/icon_minus.png" class="btn"
                                        @click="plusMinusHandler(item.id, product, 'minus')" />
                                    <text class="select_text">{{ calSelectNum(item.id, product.id) }}</text>
                                </template>
                                <image src="/static/image/menu/icon_plus.png" class="btn plus"
                                    @click="plusMinusHandler(item.id, product, 'plus')" :id="`startBtn_${product.id}`" />
                                <view class="fly_item" :id="`flyItem_${product.id}`"
                                    :style="product.id == animationProductId ? flyItemStyle : {}">
                                    <view class="ball" :id="`flyBall_${product.id}`"
                                        :style="product.id == animationProductId ? flyBallStyle : {}"></view>
                                </view>
                            </view>
                            <view class="product_btns" v-else>
                                <text v-if="productIndex" @click="productMove(true, item, product, productIndex)">上移</text>
                                <text v-if="productIndex !== item.children.length - 1"
                                    @click="productMove(false, item, product, productIndex)">下移</text>
                                <text @click="editProduction(product)">编辑</text>
                                <text @click="showDialog = true, currentProduct = product">删除</text>
                            </view>
                        </view>
                    </view>
                    <view class="no_product" v-else>
                        <image src="/static/image/no_data_img.jpg" class="no_data_img"></image>
                    </view>
                </view>
            </scroll-view>
        </view>
        <view class="cart" @click="showCart" id="cart">
            <view>{{ menuStore.allCartNum }}</view>
            <image src="/static/image/menu/bowl.png" class="bowl" />
        </view>
        <MkDialog v-model:showDialog="showDialog" @confirm="deleteProductHandler" :title="'提示'"
            :description="`是否确认删除该商品!`" />
        <MkLoading :loading="isLoading" showText text="正在删除" />
    </view>
</template>

<script setup>
import MkDialog from '/components/MkDialog'
import MkLoading from '/components/MkLoading'
import { ref, nextTick, getCurrentInstance, computed, watch, defineProps, onMounted } from 'vue'
import { throttle } from 'lodash'
import { getMenu } from '/api/menu'
import { deleteProduct } from '/api/menu';
import { updateSort } from '/api/menu'


// 当前组件实例
const currentInstance = getCurrentInstance()

import { useMenuStore } from "/store/menu"
const menuStore = useMenuStore()

// 获取数据
const getMenuHandler = () => {
    uni.showLoading({ title: '正在加载...', icon: 'loading', mask: true })
    getMenu().then(res => {
        menuStore.setMenuList(res.data)
    }).catch(err => {
    }).finally(() => {
        uni.hideLoading()
    })
}

// 激活的分类id
const parentActiveId = ref(-0)

watch(() => menuStore.menuList, (nv, ov) => {
    if (nv.length) {
        parentActiveId.value = menuStore.menuList[0].id
        intoParentId.value = `parent_${menuStore.menuList[0].id}`
        console.log(parentActiveId.value, intoParentId.value);

        // 右侧产品栏最顶部的分类id
        nextTick(() => {
            menuStore.menuList.forEach(item => {
                if (item.children.length) {
                    uni.createIntersectionObserver(currentInstance).relativeTo('.unvisited_box').observe(`#parent_${item.id}`, (res) => {
                        const { id } = res
                        parentActiveId.value = id.replace(/[^\d]/g, "")
                    })
                }
            })
        })
    }
})

// 右侧产品需要滚动到的id
const intoParentId = ref(`parent_0`)

// 分类栏点击事件
const parentClickHandler = (id) => {
    parentActiveId.value = id
    intoParentId.value = 'parent_' + id

    if (id == -1) {
        uni.navigateTo({
            url: '/pages/cateManagement/index'
        });
    }
}

// 添加产品和减少产品
// 添加 减少

const plusMinusHandler = throttle((categoryId, product, type = 'plus') => {
    switch (type) {
        case 'plus':
            plusAnimationHandler(product.id)
            menuStore.addToCart(categoryId, product)
            break;

        case 'minus':
            menuStore.minusFromCart(categoryId, product)
            break;
    }
}, 700)

const calDot = (cateId) => {
    const cartCate = menuStore.cartList.find(cate => cate.id === cateId)

    return cartCate ? cartCate.children.length : 0
}

const calSelectNum = (cateId, productId) => {
    return menuStore.cartList.find(cate => cate.id === cateId)?.children.find(item => item.id == productId)?.selectNum
}

// 购物车
const showCart = () => {
    // TODO 购物车弹框
    console.log(cartList);
}

// 添加 动画
const isAnimationRunning = ref(false)
const animationProductId = ref(-1)
const flyItemStyle = ref({})
const flyBallStyle = ref({})

const plusAnimationHandler = async (id) => {
    animationProductId.value = id
    flyItemStyle.value = { display: 'block' }
    // 现在按钮距离购物车的距离
    const boundBtn = await getBoundingClientRect(`#startBtn_${animationProductId.value}`)
    const boundCart = await getBoundingClientRect('#cart')

    // 中心点的水平垂直距离
    const offsetX = boundCart.left + boundCart.width / 2 - (boundBtn.left + boundBtn.width / 2);
    const offsetY = boundCart.top + boundCart.height / 2 - (boundBtn.top + boundBtn.height / 2) - 10;

    // 页面滚动尺寸
    const scrollLeft = 0;
    if (!isAnimationRunning.value) {
        // 购物车图形出现与初始定位
        flyItemStyle.value.left = (boundBtn.left + scrollLeft) + 'px'
        flyItemStyle.value.top = (boundBtn.top) + 'px'

        // 开始动画
        flyItemStyle.value.transform = 'translateY(' + offsetY + 'px)';
        flyBallStyle.value.transform = 'translateX(' + offsetX + 'px)';
        flyBallStyle.value.background = 'red'

        // 动画标志量
        isAnimationRunning.value = true;
        setTimeout(function () {
            flyItemStyle.value.display = 'none';
            flyItemStyle.value.transform = 'translateX(0)';
            flyBallStyle.value.transform = 'translateY(0)';
            flyBallStyle.value.background = 'transparent'
            flyItemStyle.value = {}
            flyBallStyle.value = {}
            animationProductId.value = -1
            isAnimationRunning.value = false;
        }, 500);
    }
}

// 创建一个异步函数来获取元素的边界信息  
const getBoundingClientRect = async (selector) => {
    return new Promise((resolve, reject) => {
        uni.createSelectorQuery().in(currentInstance).select(selector).boundingClientRect((rect) => {
            if (rect) {
                resolve(rect);
            } else {
                reject(new Error('无法获取元素的边界信息'));
            }
        }).exec();
    })
}

// 编辑
const $props = defineProps({
    isEdit: Boolean,
});

const productMove = (up, cate, product, productIndex) => {
    const params = { value1: { id: 0, sortIndex: 0 }, value2: { id: 0, sortIndex: 0 } }

    const anotherProduct = up ? cate.children[productIndex - 1] : cate.children[productIndex + 1]
    const { sort_index: sortIndexAnother, id: idAnother } = anotherProduct
    const { sort_index: sortIndex, id: idCurrent } = product
    params.value1 = { id: idAnother, sortIndex: sortIndex }
    params.value2 = { id: idCurrent, sortIndex: sortIndexAnother }

    uni.showLoading({ title: "", mask: true })
    updateSort(params).then(res => {
        getMenuHandler()
    }).catch(err => {
        uni.showToast({ title: '修改排序失败', icon: "error" })
    }).finally(() => {
        uni.hideLoading()
    })
}

const editProduction = (production) => {
    uni.navigateTo({
        url: `/pages/productionManagement/index?production=${JSON.stringify(production)}`
    });
}

const isLoading = ref(false)

// 删除商品
const showDialog = ref(false)

const currentProduct = ref(null)

const deleteProductHandler = () => {
    if (!currentProduct.value) return uni.showToast({ title: "删除失败", icon: "error", showToast: true })
    showDialog.value = false
    isLoading.value = true
    // 调用删除接口
    deleteProduct({ id: currentProduct.value.id }).then((result) => {
        uni.showToast({ title: "删除成功", icon: 'success' })
        getMenuHandler()
    }).catch((err) => {
        uni.showToast({ title: "删除失败", icon: 'error' })
    }).finally(() => {
        isLoading.value = false
    });
}

// 去商品详情页
const toDetail = (productionId) => {
    uni.navigateTo({
        url: `/pages/productionDetail/index?productionId=${productionId}`
    });
}

</script>

<style lang="less" scoped>
@category_width: 220rpx;
@category_tab_height: 130rpx;
@theme_color: #f6c33d;
@cart_width: 80rpx;

.menu_content {
    height: calc(100% - 128rpx - 40rpx - 20rpx);
    display: flex;

    .category {
        background-color: #f7f8fa;
        width: @category_width;

        .tab {
            height: @category_tab_height;
            text-align: center;
            // line-height: @category_tab_height;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            padding-left: 24rpx;
            padding-right: 44rpx;
            font-size: 28rpx;

            .dot {
                position: absolute;
                top: 18rpx;
                right: 20rpx;

                width: 40rpx;
                height: 40rpx;
                background-color: #d81e06;
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 40rpx;
                font-size: 28rpx;
                font-weight: 400;
            }
        }

        .category_set {
            font-weight: 700;

            &::after {
                content: '';
                display: inline-block;
                width: 32rpx;
                height: 32rpx;
                // background-image无法引用本地资源，故需要用网络地址
                background-image: url('/static/image/menu/icon_setting.png');
                background-size: 100% 100%;
            }
        }

        .active {
            background-color: #fff;
            font-weight: 700;
            color: #000;
            position: relative;

            &::before {
                content: " ";
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                height: 48rpx;
                width: 16rpx;
                border-left: 8rpx solid @theme_color;
            }
        }
    }

    .product {
        background-color: #fff;
        width: calc(100% - @category_width);
        position: relative;

        .unvisited_box {
            position: absolute;
            top: 0;
            width: 100%;
            height: 30rpx;
            background: transparent;
        }

        .cate {
            width: 100%;
            margin-bottom: 40rpx;
            padding: 0 20rpx;
            box-sizing: border-box;

            .cate_title {
                // position: fixed;
                top: 0;
            }

            .product_card {
                display: flex;
                padding-right: 40rpx;
                padding: 20rpx 0;

                .product_img {
                    width: 200rpx;
                    height: 200rpx;
                    border-radius: 20rpx;
                    flex-shrink: 0;
                    margin-right: 20rpx;
                }

                .product_info {
                    position: relative;
                    width: 100%;

                    .product_title {
                        font-size: 28rpx;
                        font-weight: 700;
                        margin-bottom: 10rpx;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }

                    .product_desc {
                        font-size: 26rpx;
                        margin-bottom: 10rpx;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }

                    .product_sale {
                        font-size: 24rpx;
                        color: #999;
                        display: flex;
                        align-items: center;

                        &>view {
                            width: 50%;
                        }

                        .price {
                            color: #e94f30;
                        }
                    }

                    .product_like {
                        display: flex;
                        align-items: center;
                        position: absolute;
                        bottom: 0;

                        &>view {
                            display: flex;
                            align-items: flex-end;

                            image {
                                width: 40rpx;
                            }

                            .num {
                                font-size: 28rpx;
                                color: #d81e06;
                                line-height: 14px;
                            }
                        }
                    }

                    .product_operation {
                        position: absolute;
                        bottom: 0;
                        right: 0;
                        height: calc(40rpx * 1.2);
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-end;

                        .select_text {
                            width: 60rpx;
                            text-align: center;
                        }

                        .btn {
                            width: 40rpx;
                            height: 40rpx;
                            flex-shrink: 0;
                        }

                        .plus {
                            transform: scale(1.2);
                        }

                        .fly_item {
                            position: fixed;
                            width: 24rpx;
                            height: 24rpx;
                            // right: calc(50% - 12rpx);

                            display: none;
                            transition: transform .5s;
                            transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);

                            .ball {
                                width: 24rpx;
                                height: 24rpx;
                                background-color: transparent;
                                border-radius: 50%;
                                position: fixed;

                                transition: transform .5s;
                                transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
                            }
                        }
                    }

                    .product_btns {
                        color: #65a2c6;
                        font-size: 24rpx;
                        display: flex;
                        justify-content: flex-end;
                        position: absolute;
                        bottom: 0;
                        right: 0;
                        width: 100%;

                        text {
                            padding: 0 6rpx;
                            border: 1rpx solid #65a2c6;
                            border-radius: 10rpx;
                            white-space: nowrap;
                            margin-left: 8rpx;

                            &:first-child {
                                margin-left: 0;
                            }
                        }
                    }

                }
            }

            .no_product {
                .no_data_img {
                    width: 400rpx;
                    height: 200rpx;
                    margin: 20rpx 0;
                    border-radius: 20rpx;
                }
            }
        }
    }

    .cart {
        position: fixed;
        bottom: calc(@category_tab_height * 0.2);
        left: calc(@category_width * 0.35);
        height: @cart_width;
        width: @cart_width;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;

        view {
            width: 36rpx;
            height: 36rpx;
            background: #694f0c;
            border-radius: 50%;
            color: #fff;
            font-size: 24rpx;
            line-height: 36rpx;
            position: absolute;
            top: -24rpx;
        }

        image {
            width: 100%;
            height: calc(@cart_width * 0.75);
        }
    }
}
</style>