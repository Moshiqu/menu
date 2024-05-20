<template>
    <view class="cart_pop" @click="$emits('update:isShowCart')">
        <view :class="['mask', $props.isShowCart ? 'is_visible' : 'is_hide']">
            <view :class="['cart', $props.isShowCart ? 'is_visible' : 'is_hide']" @click.stop>
                <view class="cart_title">
                    <view>已选商品({{ menuStore.cartProductsList.length || 0 }})</view>
                    <image src="/static/image/common/icon_delete.png" @click="$emits('update:isShowCart')"
                        mode="scaleToFill" />
                </view>
                <template v-if="menuStore.cartProductsList.length">
                    <scroll-view scroll-y="true"
                        style="max-width: 800rpx;max-width: 416px;min-height: 470rpx;max-height: 800rpx;">
                        <view class="product_item" v-for="product in menuStore.cartProductsList" :key="product.id">
                            <image src="/static/image/default_img.jpg" mode="scaleToFill" />
                            <view class="product_content">
                                <view class="product_title">{{ product.product_name }}</view>
                                <view class="product_price">￥{{ product.product_price || 0 }}</view>
                                <view class="product_like_num">
                                    <view class="product_like"
                                        :style="{ visibility: product.like_num ? 'visible' : 'hidden' }">
                                        <view>
                                            <image src="/static/image/menu/icon_like.png" mode="widthFix" />
                                            <view class="num">{{ product.like_num }}</view>
                                        </view>
                                    </view>
                                    <view class="product_num">
                                        <image src="/static/image/menu/icon_minus.png" class="btn"
                                            @click="plusMinusProductHandler(product, 'minus')" />
                                        <text class="select_text">{{ product.selectNum }}</text>
                                        <image src="/static/image/menu/icon_plus.png" class="btn plus"
                                            @click="plusMinusProductHandler(product, 'plus')" />
                                    </view>
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                    <view class="cart_btns">
                        <view class="btn_clean" @click="cleanCart">一键清空</view>
                        <view class="btn_confirm" @click="cartConfirm">
                            <text class="money" v-if="Number(totalPrice)">￥{{ totalPrice }}</text>
                            <text>确认下单</text>
                        </view>
                    </view>
                </template>
                <view class="empty-cart" v-else>
                    <image src="/static/image/menu/empty_cart.png" mode="scaleToFill" />
                    <text>购物车是空的，去添加一些吧~</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { useMenuStore } from "/store/menu"
import { ref, computed } from "vue";
const menuStore = useMenuStore()

const $props = defineProps()

const $emits = defineEmits(['update:isShowCart', 'plusMinusHandler'])

const plusMinusProductHandler = (product, type) => {
    if (type === 'minus' && product.selectNum === 1) {
        return uni.showModal({
            title: '提示',
            content: '确定要移除该商品吗?',
            success: (res) => {
                if (res.confirm) {
                    $emits('plusMinusHandler', product.category_id, product, type)
                }
            }
        });
    }
    $emits('plusMinusHandler', product.category_id, product, type)
}

// 购物车总金额
const totalPrice = computed(() => {
    return menuStore.cartProductsList.reduce((acc, cur) => {
        return acc + cur.selectNum * cur.product_price
    }, 0).toFixed(2)
})

// 一键清空购物车
const cleanCart = () => {
    uni.showModal({
        title: '提示',
        content: '确定要移除所有商品吗?',
        success: (res) => {
            if (res.confirm) {
                menuStore.resetCartList()
            }
        }
    })
}

// TODO 提交订单功能(userStore的userInfo.id 如果和menuStore的menuId 相同的话, 则阻止)
const cartConfirm = () => {
    uni.navigateTo({
        url: `/pages/preOrder/index`
    });
}

</script>

<style scoped lang="less">
.cart_pop {
    .mask {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        animation-duration: 0.5s;
        animation-fill-mode: forwards;
        overflow: hidden;
        font-size: 28rpx;

        &.is_visible {
            animation-name: fadeIn;

            @keyframes fadeIn {
                from {
                    background-color: rgba(0, 0, 0, 0);
                    z-index: -1;
                    display: none;

                }

                to {
                    background-color: rgba(0, 0, 0, .5);
                    z-index: 44;
                    display: block;

                }
            }
        }

        &.is_hide {
            animation-name: fadeOut;

            @keyframes fadeOut {
                from {
                    background-color: rgba(0, 0, 0, 0.5);
                    z-index: 44;
                    display: block;
                }

                to {
                    background-color: rgba(0, 0, 0, 0);
                    z-index: -1;
                    display: none;
                }
            }
        }

        .cart {
            box-sizing: border-box;
            border-top-right-radius: 30rpx;
            border-top-left-radius: 30rpx;
            background-color: #f7ebc1;
            position: absolute;
            bottom: 0;
            width: 100%;
            animation: moveIn .6s forwards;
            padding: 40rpx;
            padding-bottom: 0;

            animation-duration: 0.5s;
            animation-fill-mode: forwards;

            &.is_visible {
                animation-name: moveIn;

                @keyframes moveIn {
                    from {
                        transform: translateY(100%);
                    }

                    to {
                        transform: translateY(0);
                    }
                }
            }

            &.is_hide {
                animation-name: moveOut;


                @keyframes moveOut {
                    from {
                        transform: translateY(0);
                    }

                    to {
                        transform: translateY(100%);
                    }
                }
            }

            .cart_title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: #96979a;
                margin-bottom: 40rpx;

                image {
                    height: 28rpx;
                    width: 28rpx;
                }
            }

            .cart_btns {
                position: fixed;
                bottom: 40rpx;
                left: 50%;
                transform: translateX(-50%);
                width: 90%;
                height: 90rpx;
                background-color: #f6c33d;
                border-radius: 40rpx;
                font-size: 32rpx;
                display: flex;
                overflow: hidden;
                font-size: 14px;
                font-weight: 700;

                &>view {
                    width: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .btn_clean {
                    background-color: #fff;
                }

                .btn_confirm {
                    .money {
                        font-size: 28rpx;
                        margin-right: 10rpx;
                    }
                }
            }

            .empty-cart {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding-bottom: 40rpx;

                image {
                    width: calc(320rpx * 1.52);
                    height: 320rpx;
                    margin-bottom: 40rpx;
                }
            }

            .product_item {
                height: 140rpx;
                box-sizing: border-box;
                display: flex;
                margin-bottom: 30rpx;

                &:last-child {
                    margin-bottom: 160rpx;
                }

                &>image {
                    width: 140rpx;
                    height: 140rpx;
                    margin-right: 20rpx;
                    border-radius: 10rpx;
                    flex-shrink: 0;
                }

                .product_content {
                    width: calc(100% - 20rpx);
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    margin-right: 6rpx;

                    .product_title {
                        font-weight: 700;
                    }

                    .product_price {
                        color: #e94f30;
                    }

                    .product_like_num {
                        display: flex;
                        justify-content: space-between;

                        .product_like {
                            display: flex;
                            align-items: center;

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

                        .product_num {
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
                                transform: scale(1.2) translateY(-2rpx);
                            }
                        }
                    }
                }

            }
        }
    }
}
</style>