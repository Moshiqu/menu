<template>
    <view class="cart_pop" @click="$emits('update:isShowCart')">
        <view :class="['mask', $props.isShowCart ? 'is_visible' : 'is_hide']">
            <view :class="['cart', $props.isShowCart ? 'is_visible' : 'is_hide']" @click.stop>
                <view class="cart_title">
                    <view>已选商品({{ cartList.length }})</view>
                    <image src="/static/image/common/icon_delete.png" @click="$emits('update:isShowCart')"
                        mode="scaleToFill" />
                </view>
                <scroll-view scroll-y="true"
                    style="max-width: 800rpx;max-width: 416px;min-height: 470rpx;max-height: 800rpx;">
                    <!-- <view v-for="product in cartList" :key="product.id" class="product_item">
                        <image src="/static/image/default_img.jpg" />
                    </view> -->
                    <view class="product_item">
                        <image src="/static/image/default_img.jpg" mode="scaleToFill" />
                        <view class="product_content">
                            <view class="product_title">这个是title啊</view>
                            <view class="product_price">￥999.00</view>
                            <view class="product_like_num">
                                <view class="product_like">
                                    <view>
                                        <image src="/static/image/menu/icon_like.png" mode="widthFix" />
                                        <view class="num">123</view>
                                    </view>
                                </view>
                                <view class="product_num">
                                    <image src="/static/image/menu/icon_minus.png" class="btn" />
                                    <text class="select_text">99</text>
                                    <image src="/static/image/menu/icon_plus.png" class="btn plus" />
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="product_item">
                        <image src="/static/image/default_img.jpg" mode="scaleToFill" />
                        <view class="product_content">
                            <view class="product_title">这个是title啊</view>
                            <view class="product_price">￥999.00</view>
                            <view class="product_like_num">
                                <view class="product_like">
                                    <view>
                                        <image src="/static/image/menu/icon_like.png" mode="widthFix" />
                                        <view class="num">123</view>
                                    </view>
                                </view>
                                <view class="product_num">
                                    <image src="/static/image/menu/icon_minus.png" class="btn" />
                                    <text class="select_text">99</text>
                                    <image src="/static/image/menu/icon_plus.png" class="btn plus" />
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="product_item">
                        <image src="/static/image/default_img.jpg" mode="scaleToFill" />
                        <view class="product_content">
                            <view class="product_title">这个是title啊</view>
                            <view class="product_price">￥999.00</view>
                            <view class="product_like_num">
                                <view class="product_like">
                                    <view>
                                        <image src="/static/image/menu/icon_like.png" mode="widthFix" />
                                        <view class="num">123</view>
                                    </view>
                                </view>
                                <view class="product_num">
                                    <image src="/static/image/menu/icon_minus.png" class="btn" />
                                    <text class="select_text">99</text>
                                    <image src="/static/image/menu/icon_plus.png" class="btn plus" />
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="product_item">
                        <image src="/static/image/default_img.jpg" mode="scaleToFill" />
                        <view class="product_content">
                            <view class="product_title">这个是title啊</view>
                            <view class="product_price">￥999.00</view>
                            <view class="product_like_num">
                                <view class="product_like">
                                    <view>
                                        <image src="/static/image/menu/icon_like.png" mode="widthFix" />
                                        <view class="num">123</view>
                                    </view>
                                </view>
                                <view class="product_num">
                                    <image src="/static/image/menu/icon_minus.png" class="btn" />
                                    <text class="select_text">99</text>
                                    <image src="/static/image/menu/icon_plus.png" class="btn plus" />
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="product_item">
                        <image src="/static/image/default_img.jpg" mode="scaleToFill" />
                        <view class="product_content">
                            <view class="product_title">这个是title啊</view>
                            <view class="product_price">￥999.00</view>
                            <view class="product_like_num">
                                <view class="product_like">
                                    <view>
                                        <image src="/static/image/menu/icon_like.png" mode="widthFix" />
                                        <view class="num">123</view>
                                    </view>
                                </view>
                                <view class="product_num">
                                    <image src="/static/image/menu/icon_minus.png" class="btn" />
                                    <text class="select_text">99</text>
                                    <image src="/static/image/menu/icon_plus.png" class="btn plus" />
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="product_item">
                        <image src="/static/image/default_img.jpg" mode="scaleToFill" />
                        <view class="product_content">
                            <view class="product_title">这个是title啊</view>
                            <view class="product_price">￥999.00</view>
                            <view class="product_like_num">
                                <view class="product_like">
                                    <view>
                                        <image src="/static/image/menu/icon_like.png" mode="widthFix" />
                                        <view class="num">123</view>
                                    </view>
                                </view>
                                <view class="product_num">
                                    <image src="/static/image/menu/icon_minus.png" class="btn" />
                                    <text class="select_text">99</text>
                                    <image src="/static/image/menu/icon_plus.png" class="btn plus" />
                                </view>
                            </view>
                        </view>
                    </view>
                </scroll-view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { useMenuStore } from "/store/menu"
import { ref } from "vue";
const menuStore = useMenuStore()

const $props = defineProps()

const $emits = defineEmits(['update:isShowCart'])

const cartList = ref(menuStore.cartProductsList)

console.log(cartList);
// TODO 购物车模块
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

            .product_item {
                height: 140rpx;
                box-sizing: border-box;
                display: flex;
                margin-bottom: 30rpx;

                &:last-child{
                    margin-bottom: 200rpx;
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