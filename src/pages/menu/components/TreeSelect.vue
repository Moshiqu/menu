<template>
    <view class="menu_content">
        <view class="category">
            <scroll-view scroll-y style="height: 100%;" scroll-with-animation>
                <view :class="['tab', parentActiveId == item.parentId ? 'active' : '']" v-for="item in treeData"
                    :key="item.parentId" @click="parentClickHandler(item.parentId)">
                    {{ item.name }}
                    <view class="dot" v-if="calDot(item.children)">{{ calDot(item.children) }}</view>
                </view>
                <view :class="['tab category_set', parentActiveId === -1 ? 'active' : '']" style="color: #2678fa;"
                    @click="parentClickHandler(-1)">
                    分类管理
                </view>
                <view :style="{background: '#fff',paddingBottom:'300rpx'}">
                </view>
            </scroll-view>
        </view>
        <view class="product" id="product_box">
            <view class="unvisible_box"></view>
            <scroll-view scroll-y style="height: 100%;" :scroll-into-view="intoParentId" scroll-with-animation
                class="scroll-view" @scroll="handleScroll">
                <view class="cate" v-for="item in treeData" :key="item.parentId" :id="'parent_' + item.parentId">
                    <view class="cate_title" v-if="item.children.length">{{ item.name }}</view>
                    <view class="product_card" v-for="(product, productIndex) in item.children" :key="product.productId">
                        <image src="../../../../static/image/default_img.jpg" class="product_img"></image>
                        <view class="product_info">
                            <view class="product_title">{{ product.name }}</view>
                            <view class="product_desc">{{ product.description }}</view>
                            <view class="product_sale" v-if="!isEdit">销量:{{ product.saleNum || 0 }}</view>
                            <view class="product_operation" v-if="!isEdit">
                                <template v-if="product.selectNum">
                                    <image src="../../../../static/image/menu/icon_minus.png" class="btn"
                                        @click="plusMinusHandler(product, 'minus')" />
                                    <text class="select_text">{{ product.selectNum }}</text>
                                </template>
                                <image src="../../../../static/image/menu/icon_plus.png" class="btn plus"
                                    @click="plusMinusHandler(product, 'plus')" :id="`startBtn_${product.productId}`" />
                                <view class="fly_item" :id="`flyItem_${product.productId}`"
                                    :style="product.productId == animationProductId ? flyItemStyle : {}">
                                    <view class="ball" :id="`flyBall_${product.productId}`"
                                        :style="product.productId == animationProductId ? flyBallStyle : {}"></view>
                                </view>
                            </view>
                            <view class="product_btns" v-else>
                                <text v-if="product.index !== 1" @click="move(true, item, product, productIndex)">上移</text>
                                <text v-if="product.index !== item.children.length"
                                    @click="move(false, item, product, productIndex)">下移</text>
                                <text @click="editProduction(product)">编辑</text>
                                <text @click="showDialog = true, currentProduct = product">删除</text>
                            </view>
                        </view>
                    </view>
                </view>
            </scroll-view>
        </view>
        <view class="cart" @click="showCart" id="cart">
            <view>{{ cartNum }}</view>
            <image src="../../../../static/image/menu/bowl.png" class="bowl" />
        </view>
        <MkDialog v-model:showDialog="showDialog" @confirm="deleteProduct" />
        <MkLoading :loading="isLoading" showText text="正在删除" />
    </view>
</template>

<script setup>
import MkDialog from '@/src/components/MkDialog'
import MkLoading from '@/src/components/MkLoading'
import { ref, reactive, nextTick, getCurrentInstance, computed, watch, defineProps } from 'vue'
import { throttle } from 'lodash'


// 当前组件实例
const currentInstance = getCurrentInstance()

// 分类数据
const parentTab = reactive([{ parentId: 1, name: '蔬菜', index: 1 }, { parentId: 2, name: '肉类', index: 2 }, { parentId: 3, name: '海鲜', index: 3 }, { parentId: 4, name: '主食', index: 4 }, { parentId: 5, name: '汤', index: 5 }, { parentId: 6, name: '牛排', index: 6 }, { parentId: 7, name: '饮料', index: 7 }, { parentId: 8, name: '时令蔬菜', index: 8 }, { parentId: 9, name: '宣传宣传宣传宣传宣传', index: 9 }, { parentId: 10, name: '水果', index: 10 }, { parentId: 11, name: '天气', index: 11 }])

// 商品数据
const productList = [{ parentId: 1, name: '莴笋', description: "这个是莴笋", productId: 1, saleNum: 11, index: 1 }, { parentId: 1, name: '番茄', description: "这个是番茄", productId: 2, index: 2 }, { parentId: 2, name: '猪肉', description: "这个是猪肉", productId: 3, index: 1 }, { parentId: 3, name: '生蚝', description: "这个是生蚝", productId: 4, index: 1 }, { parentId: 4, name: '米饭', description: "这个是米饭", productId: 5, index: 1 }, { parentId: 4, name: '稀饭', description: "这个是稀饭", productId: 6, index: 2 }]

// 计算为树形结构并排序
const treeData_show = parentTab.map(parent => {
    const treeItem = JSON.parse(JSON.stringify(parent))
    treeItem.children = productList.filter(item => item.parentId === parent.parentId).sort((a, b) => a.index - b.index) || []

    return treeItem
}).sort((a, b) => a.index - b.index)

// 树形结构响应式
const treeData = reactive(treeData_show)

// 存入pinia
import { useMenuStore } from "@/src/store/menu"

const menuStore = useMenuStore()

menuStore.setMenuList(treeData)

// 激活的分类id
const parentActiveId = ref(1)

// 右侧产品需要滚动到的id
const intoParentId = ref(`parent_1`)

// 右侧产品栏最顶部的分类id
nextTick(() => {
    treeData.forEach(item => {
        if (item.children.length) {
            uni.createIntersectionObserver(currentInstance).relativeTo('.unvisible_box').observe(`#parent_${item.parentId}`, (res) => {
                const { id } = res
                parentActiveId.value = id.replace(/[^\d]/g, "")
            })
        }
    })
})


// 分类栏点击事件
const parentClickHandler = (parentId) => {
    parentActiveId.value = parentId
    intoParentId.value = 'parent_' + parentId

    if (parentId == -1) {
        uni.navigateTo({
            url: '../cateManagement/index'
        });
    }
}

// 添加产品和减少产品
// 购物车列表
const cartList = computed(() => {
    return treeData.filter(cate => {
        const cateSelect = cate.children.filter(product => {
            return !!product.selectNum
        })
        return !!cateSelect.length
    })
})

// 已选择的产品数量
const cartNum = computed(() => {
    let num = 0
    cartList.value.forEach(cate => {
        if (cate.children.length) {
            cate.children.forEach(item => {
                if (item.selectNum) {
                    num += item.selectNum
                }
            })
        }
    })

    return num
})

const showCart = () => {
    console.log(cartList);
}

watch(cartList, (nv, ov) => {

})

// 添加 动画
const isAnimationRunning = ref(false)
const animationProductId = ref(-1)
const flyItemStyle = ref({})
const flyBallStyle = ref({})
let viewScrollTop = 0

const plusAnimationHandler = async (productId) => {
    animationProductId.value = productId
    flyItemStyle.value = { display: 'block' }
    // 现在按钮距离购物车的距离
    const boundBtn = await getBoundingClientRect(`#startBtn_${animationProductId.value}`)
    const boundCart = await getBoundingClientRect('#cart')

    // 中心点的水平垂直距离
    const offsetX = boundCart.left + boundCart.width / 2 - (boundBtn.left + boundBtn.width / 2);
    const offsetY = boundCart.top + boundCart.height / 2 - (boundBtn.top + boundBtn.height / 2) - 10;

    // 页面滚动尺寸
    const scrollTop = 0;
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

// 监听滚动
const handleScroll = (event) => {
    const { scrollTop } = event.detail
    viewScrollTop = scrollTop
}

// 添加 减少
const plusMinusHandler = throttle((product, type = 'plus') => {
    switch (type) {
        case 'plus':
            plusAnimationHandler(product.productId)
            if (!product.selectNum) {
                product.selectNum = 1
            } else {
                product.selectNum++
            }
            break;

        case 'minus':
            product.selectNum--
            break;
    }
}, 600)

const calDot = (cate) => {
    let num = 0

    cate.forEach(product => {
        if (product.selectNum) {
            num += product.selectNum
        }
    })

    return num
}

// 编辑
const $props = defineProps({
    isEdit: Boolean,
});

const move = (up, cate, product, productIndex) => {
    if (up) {
        const temp = product.index
        product.index = cate.children[productIndex - 1].index
        cate.children[productIndex - 1].index = temp
    } else {
        const temp = product.index
        product.index = cate.children[productIndex + 1].index
        cate.children[productIndex + 1].index = temp
    }
    cate.children.sort((a, b) => a.index - b.index)
}

const editProduction = (production) => {
    uni.navigateTo({
        url: `../productionManagement/index?production=${JSON.stringify(production)}`
    });
}

const isLoading = ref(false)

// 删除商品
const showDialog = ref(false)

const currentProduct = ref(null)

const deleteProduct = () => {
    // 调用删除接口
    // 展示loading
    // 调用获取菜单接口
    showDialog.value = false
    isLoading.value = true
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
                background-image: url('../../../../static/image/menu/icon_setting.png');
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

        .unvisible_box {
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
                    }

                    .product_operation {
                        position: absolute;
                        bottom: 0;
                        right: 0;
                        height: calc(40rpx * 1.2);
                        display: flex;
                        justify-content: space-between;

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