<template>
    <view class="production">
        <view class="img_box">
            <view class="img_avatar"></view>
            <view class="img_text">上传商品主图 非必填</view>
        </view>
        <view class="production_info">
            <view class="production_name">
                <view class="label">
                    <view class="star">*</view>
                    名称
                </view>
                <view class="editor">
                    <input confirm-type="确定" type="text" placeholder="请输入商品名称" v-model="productName" />
                </view>
            </view>
            <view class="production_cate">
                <view class="label">
                    <view class="star">*</view>
                    分类
                </view>
                <view class="editor">
                    <picker @change="bindPickerChange" :value="cateIndex" :range="cateList" range-key="category_name">
                        <view :class="[cateIndex == -1 ? 'picker_text picker_placeholder' : 'picker_text']">
                            {{ cateIndex === -1 ? '请选择商品分类' : cateList[cateIndex] && cateList[cateIndex].category_name }}
                        </view>
                    </picker>
                </view>
            </view>
            <view class="production_description" style="padding-bottom: 24rpx;position: relative;">
                <view class="label" @click="() => console.log(productName)">
                    描述
                </view>
                <MkTextarea class="editor textarea_editor" textAlign="right" v-model:textareaValue="productDescription"
                    :maxlength="30" :footerRight="40" />
            </view>
            <view class="production_price">
                <view class="label">
                    价格
                </view>
                <view class="editor price_editor">
                    <input confirm-type="确定" type="digit" placeholder="只是标识使用 不能真实收钱" v-model="productPrice"
                        @change="priceChangeHandler" />
                    <text class="price_unit">元</text>
                </view>
            </view>

        </view>
        <view class="operations">
            <view class="continue_btn" @click="saveAndNext">
                <view>保存</view>
                <view>并继续添加做法</view>
            </view>
            <view class="save_btn" @click="saveHandler">保存{{ productId ? '修改' : '' }}</view>
        </view>
    </view>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app"
import { ref } from "vue"
import MkTextarea from '@/src/components/MkTextarea'
import { addProductionDetail, updateProductionDetail } from '@/src/api/menu'

// 从pinia中获取菜单列表
import { useMenuStore } from "@/src/store/menu";
const menuStore = useMenuStore()

const cateList = ref([])
cateList.value = menuStore.cateList

// 获取跳转参数
onLoad((query) => {
    if (JSON.stringify(query) != "{}") {
        const { production: production_source } = query
        const production = JSON.parse(decodeURIComponent(production_source))
        productId.value = production.id
        productName.value = production.product_name
        productDescription.value = production.product_description
        productPrice.value = production.product_price
        for (let index = 0; index < cateList.value.length; index++) {
            const element = cateList.value[index];
            if (element.id == production.category_id) {
                cateIndex.value = index
                break
            }
        }
    }
})

// 商品id
const productId = ref(0)

// 商品名称
const productName = ref('')

// 选中的分类
const cateIndex = ref(-1)

// 分类改变回调
const bindPickerChange = (e) => {
    cateIndex.value = e.detail.value === -1 ? '请选择商品分类' : e.detail.value
}

// 商品描述
const productDescription = ref('')

// 商品价格
const productPrice = ref('')

// 价格只能为整数或者保留后两位小数
const priceChangeHandler = () => {
    const num = String(productPrice.value)
    productPrice.value = Number(num.match(/\d+\.?\d{0,2}/, ''))
}

// 保存
const saveHandler = () => {
    if (!productName.value || cateIndex.value == -1) {
        return uni.showToast({
            title: productName.value ? '商品分类不能为空' : '商品名称不能为空',
            icon: 'none',
            duration: 2000
        })
    }

    uni.showLoading({ title: '正在保存', icon: 'loading', mask: true })
    const cateId = cateList.value[cateIndex.value].id

    if (productId.value) {
        updateProductionDetail({ productName: productName.value, productDescription: productDescription.value, cateId, productPrice: productPrice.value, id: productId.value }).then(res => {
            uni.showToast({ title: '修改商品成功', icon: 'success', mask: true })
            setTimeout(() => {
                uni.navigateBack({
                    delta: 1,
                    success: function () {
                        const pages = getCurrentPages(); //获取当前页面栈
                        const prevPage = pages[pages.length - 2]; //获取上一个页面实例对象
                        prevPage.$vm.refresh(); //调用上一个页面的onLoad方法
                    }
                });
            }, 1500);
        }).catch(err => {
            uni.showToast({ title: '修改商品失败', icon: 'error', mask: true })
        }).finally(() => {
            uni.hideLoading()

        })
    } else {
        addProductionDetail({ productName: productName.value, productDescription: productDescription.value, cateId, productPrice: productPrice.value }).then(res => {
            uni.showToast({ title: '添加商品成功', icon: 'success', mask: true })
            setTimeout(() => {
                uni.navigateBack({
                    delta: 1,
                    success: function () {
                        const pages = getCurrentPages(); //获取当前页面栈
                        const prevPage = pages[pages.length - 2]; //获取上一个页面实例对象
                        prevPage.$vm.refresh(); //调用上一个页面的onLoad方法
                    }
                });
            }, 1500);
        }).catch(err => {
            uni.showToast({ title: '添加商品失败', icon: 'error', mask: true })
        }).finally(() => {
            uni.hideLoading()

        })
    }

}

// 保存并添加做法
const saveAndNext = () => {
    if (!productName.value || cateIndex.value == -1) {
        return uni.showToast({
            title: productName.value ? '商品分类不能为空' : '商品名称不能为空',
            icon: 'none',
            duration: 2000
        })
    }

    uni.showLoading({ title: '正在保存', icon: 'loading', mask: true })
    const cateId = cateList.value[cateIndex.value].id
    if (productId.value) {
        updateProductionDetail({ productName: productName.value, productDescription: productDescription.value, cateId, productPrice: productPrice.value }).then(res => {
            uni.showToast({ title: '修改商品成功', icon: 'success', mask: true })
            setTimeout(() => {
                uni.navigateTo({
                    url: `../productionStep/index?productionId=${res.data.id}`
                });
            }, 1500);
        }).catch(err => {
            uni.showToast({ title: '修改商品失败', icon: 'error', mask: true })
        }).finally(() => {
            uni.hideLoading()
        })
    } else {
        addProductionDetail({ productName: productName.value, productDescription: productDescription.value, cateId, productPrice: productPrice.value }).then(res => {
            uni.showToast({ title: '添加商品成功', icon: 'success', mask: true })
            setTimeout(() => {
                uni.redirectTo({
                    url: `../productionStep/index?productionId=${res.data.id}`
                });
            }, 1500);
        }).catch(err => {
            uni.showToast({ title: '添加商品失败', icon: 'error', mask: true })
        }).finally(() => {
            uni.hideLoading()
        })
    }

}

</script>

<style lang="less" scoped>
@bgc: #f7f8fa;
@placeholder_color: #8080a1;

.production {
    background-color: @bgc;
    padding-top: 40rpx;
    height: 100vh;
    box-sizing: border-box;

    .img_box {
        display: flex;
        flex-direction: column;
        align-items: center;

        .img_avatar {
            width: 300rpx;
            height: 300rpx;
            background-color: #fff;
            position: relative;
            margin-bottom: 20rpx;

            &::after {
                content: " ";
                height: 50rpx;
                width: 50rpx;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-image: url(../../../static/image/menu/icon_camera.png);
                background-size: 100% 100%;

            }
        }

        .img_text {
            color: #777777;
        }
    }

    .production_info {
        margin-top: 60rpx;

        &>view {
            height: 100rpx;
            line-height: 100rpx;
            background-color: #fff;
            border-bottom: 4rpx solid @bgc;
            display: flex;
            justify-content: space-between;
            padding: 0 40rpx;

            .label {
                position: relative;
                width: 20%;
                min-width: 120rpx;

                .star {
                    position: absolute;
                    top: 50%;
                    left: -16rpx;
                    transform: translateY(-50%);
                    color: #ee0a24;
                }
            }

            .editor {
                width: 70%;

                input {
                    height: 100%;
                    width: 100%;
                    text-align: right;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                textarea {
                    width: 100%;
                    text-align: right;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-height: 100%;
                }

                .picker_text {
                    text-align: right;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .picker_placeholder {
                    color: @placeholder_color;
                }
            }

            .textarea_editor {
                display: flex;
                align-items: center;
                width: 80%;
            }

            .price_editor {
                display: flex;

                .price_unit {
                    margin-left: 20rpx;
                    color: #969799;
                }
            }
        }

    }

    .operations {
        margin-top: 60rpx;
        padding: 0 48rpx;
        display: flex;
        justify-content: space-between;
        font-weight: 700;
        font-size: 24rpx;

        &>view {
            width: 300rpx;
            height: 80rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            border-radius: 80rpx;

        }

        @btn_color: #f6c33d;

        .continue_btn {
            color: @btn_color;
            background-color: #fff;
            border: 2rpx solid @btn_color;
            flex-direction: column;
        }

        .save_btn {
            color: #000;
            background: @btn_color;
        }
    }
}
</style>