<template>
    <view class="production_detail_page">
        <view class="production_img">
            <image src="/static/image/default_img.jpg" mode="widthFix" />
        </view>

        <view class="production_content">
            <view class="title">
                {{ productionDetail.product_description }}
            </view>

            <view class="material_box" v-if="productionDetail.materialList.length">
                <view class="material_title">用料</view>
                <view class="material_item" v-for="(material, index) in productionDetail.materialList" :key="index">
                    <view>{{ material.material_name }}</view>
                    <view>{{ material.material_quantity }}</view>
                </view>
            </view>

            <view class="step_box" v-if="productionDetail.stepList.length">
                <view class="step_item" v-for="(step, index) in productionDetail.stepList" :key="index">
                    <view class="step_title">步骤 {{ index + 1 }}</view>
                    <!-- <image src="/static/image/default_img.jpg" mode="widthFix" class="step_img" v-if="step.step_img" /> -->
                    <image src="/static/image/default_img.jpg" mode="widthFix"
                        :class="[isNormalMode ? 'step_img' : 'zip_step_img']" />
                    <view class="step_description">{{ step.step_description }} </view>
                </view>
            </view>
        </view>

        <view class="exchange_btn" v-if="productionDetail.stepList.length" @click="exchangeSize">
            小图模式
        </view>
    </view>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getProductionDetail } from '/api/menu'
import { onLoad } from "@dcloudio/uni-app"

// 获取跳转参数
onLoad((query) => {
    if (JSON.stringify(query) != "{}") {
        productionId.value = query.productionId
    }
})

onMounted(() => {
    uni.showLoading()
    getProductionDetail({ productionId: productionId.value }).then(res => {
        if (res.code === 200) {
            productionDetail.value = res.data
            uni.setNavigationBarTitle({
                title: res.data.product_name
            })
            uni.hideLoading()
        } else {
            uni.hideLoading()
            uni.showToast({ title: res.message, icon: "none" })
        }
    }).catch(err => {
        uni.hideLoading()
        uni.showToast({ title: err.Msg || err.message || '获取商品详情失败', icon: 'none' })
        console.log(err, 'err');
    })
})

// 当前产品
const productionId = ref(0)

const productionDetail = ref({ stepList: [], materialList: [] })

// 切换图片大小
const isNormalMode = ref(true)

const exchangeSize = () => {
    isNormalMode.value = !isNormalMode.value
}

</script>

<style scoped lang="less">
.production_detail_page {
    box-sizing: border-box;
    padding-bottom: 200rpx;
    position: relative;

    .production_img {
        image {
            width: 100%;
        }
    }

    .production_content {
        padding: 0 60rpx;

        .title {
            margin-bottom: 20rpx;
            font-size: 48rpx;
            position: relative;
            text-decoration: solid underline #f6c33d 8rpx;
            text-align: center;
        }
    }

    .material_box {
        margin-bottom: 100rpx;

        .material_title {
            padding-left: 20rpx;
            margin-bottom: 32rpx;
        }

        .material_item {
            font-size: 28rpx;
            line-height: 54rpx;
            color: #777;
            border-bottom: 2rpx dashed #ebe8e8;

            display: flex;
            justify-content: space-between;

            &>view:last-child {
                margin-left: 20rpx;
                overflow-wrap: anywhere;
            }
        }
    }

    .step_box {
        .step_item {
            margin-bottom: 40rpx;

            .step_title {
                padding-left: 20rpx;
                margin-bottom: 20rpx;
            }

            .step_img {
                width: 100%;
            }

            .zip_step_img {
                width: 200rpx;
                height: 200rpx;
            }

            .step_description {
                overflow-wrap: break-word;
            }
        }
    }

    .exchange_btn {
        position: fixed;
        bottom: 100rpx;
        left: 50%;
        transform: translateX(-50%);
        width: 600rpx;
        height: 100rpx;
        background: #f6c33d;
        border-radius: 50rpx;
        line-height: 100rpx;
        text-align: center;
    }
}
</style>