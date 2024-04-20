<template>
    <view class="production_step_page">
        <view class="production_title">番茄</view>
        <view class="production_material">
            <view class="production_material_tile">用料</view>
            <view class="material_container">
                <view class="material_row" v-for="(item, index) in materialData" :key="index">
                    <input class="material_name" placeholder="食材：如面粉" v-model="item.materialName" />
                    <input class="material_quantity" placeholder="用量：如100g" v-model="item.materialQuantity" />
                    <view class="material_delete" v-if="index" @click="deleteMaterial(index)">
                        <image src="../../../static/image/common/close.png" />
                    </view>
                </view>
                <view class="more_btn">
                    <MkNormalBtn text="再增加一行" @confirm="addMaterial" />
                </view>
            </view>
        </view>
        <view class="production_step">
            <view class="step_row" v-for="(item, index) in stepData" :key="index">
                <view class="step_title">
                    <view class="step_num">步骤 {{ index + 1 }}</view>
                    <view class="step_operation" v-if="index">
                        <image src="../../../static/image/common/up.png" @click="exchangeStep(index)" />
                        <image src="../../../static/image/common/delete.png" @click="deleteStep(index)" />
                    </view>
                </view>
                <view class="step_img">
                    <view class="img_avatar"></view>
                    <view class="img_text">图片非必填</view>
                </view>
                <view class="step_description">
                    <textarea auto-height placeholder="添加步骤说明" placeholder-style="color:#c8cddb"
                        v-model="item.description" />
                </view>
            </view>
            <view class="more_btn">
                <MkNormalBtn text="再增加一步" @confirm="addStep" />
            </view>
        </view>
        <view class="operations">
            <view class="back_btn" @click="backMenu">返回首页</view>
            <view class="save_btn">保存</view>
        </view>
    </view>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app"
import MkNormalBtn from '@/src/components/MkNormalBtn'
import { ref, nextTick, onMounted } from 'vue'

// 获取跳转参数
onLoad((query) => {
    if (JSON.stringify(query) != "{}") {
        productionId.value = productionId
    }
})

onMounted(() => {
    // TODO 调试材料步骤接口
})

const productionId = ref(0)

// 用料
const materialData = ref([{ materialName: '', materialQuantity: '' }])

// 添加用料
const addMaterial = () => {
    materialData.value.push({ materialName: '', materialQuantity: '' })
}

// 删除用料
const deleteMaterial = (index) => {
    materialData.value.splice(index, 1)
}

// 步骤
const stepData = ref([{
    description: "",
    imgUrl: "",
}])

// 添加步骤
const addStep = () => {
    stepData.value.push({ description: '', imgUrl: "" })
    nextTick(() => {
        uni.pageScrollTo({
            scrollTop: 2000000,    //滚动到页面的目标位置（单位px）
        });
    })
}

// 步骤上移
const exchangeStep = (index) => {
    const currentStep = stepData.value[index]
    const preStep = stepData.value[index - 1]

    stepData.value[index] = preStep
    stepData.value[index - 1] = currentStep
}

// 删除步骤
const deleteStep = (index) => {
    stepData.value.splice(index, 1)
}

// 返回首页
const backMenu = () => {
    uni.switchTab({
        url: `../menu/index`
    });
}


</script>

<style scoped lang="less">
@production_step_color: #f6c33d;

.production_step_page {
    padding: 30rpx 20rpx 40rpx 20rpx;

    .production_title {
        position: relative;
        width: fit-content;
        font-weight: 700;
        font-size: 38rpx;
        margin-bottom: 70rpx;

        &::after {
            content: "";
            position: absolute;
            bottom: 4rpx;
            left: 0;
            width: 100%;
            height: 8rpx;
            background-color: @production_step_color;
            z-index: -1;
        }
    }

    .production_material {
        padding: 0 20rpx;
        margin-bottom: 20rpx;

        .production_material_tile {
            color: #777777;
        }

        .material_container {
            width: 100%;
            margin-top: 28rpx;

            .material_row {
                width: 95%;
                border-bottom: 2rpx dashed #c8c9cc;
                box-sizing: border-box;
                font-size: 28rpx;
                margin-top: 40rpx;
                display: flex;
                position: relative;

                &>input {
                    width: 50%;
                    display: flex;
                    text-overflow: ellipsis;
                }

                &>.material_delete {
                    position: absolute;
                    top: 50%;
                    right: 0;
                    transform: translate(100%, -74%);
                    height: 72rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    image {
                        width: 32rpx;
                        height: 32rpx;
                    }
                }


            }

            .more_btn {
                margin-top: 20rpx;
                display: flex;
                justify-content: flex-end;
            }

        }
    }

    .production_step {
        padding: 0 20rpx;
        margin-top: 40rpx;

        .step_row {
            width: 100%;
            margin-bottom: 60rpx;

            .step_title {
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: #777777;

                .step_operation {
                    display: flex;

                    image {
                        width: 32rpx;
                        height: 32rpx;
                        margin-left: 40rpx;
                    }
                }
            }

            .step_img {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-top: 30rpx;

                .img_avatar {
                    width: 480rpx;
                    height: 300rpx;
                    background-color: #f7f8fa;
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
                    font-size: 28rpx;
                }
            }

            .step_description {
                margin-top: 30rpx;
            }



        }

        .more_btn {
            margin-top: 20rpx;
            display: flex;
            justify-content: flex-end;
        }
    }

    .operations {
        margin-top: 160rpx;
        display: flex;
        justify-content: space-between;
        font-weight: 700;
        padding: 0 30rpx;

        &>view {
            width: 300rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            border-radius: 80rpx;
            padding: 20rpx 0;
        }

        @btn_color: #f6c33d;

        .back_btn {
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