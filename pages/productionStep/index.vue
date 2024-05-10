<template>
    <view class="production_step_page">
        <view class="production_title">{{ productionName }}</view>
        <view class="production_material">
            <view class="production_material_tile">用料</view>
            <view class="material_container">
                <view class="material_row" v-for="(item, index) in materialData" :key="index">
                    <input class="material_name" placeholder="食材：如面粉" v-model.trim="item.material_name" />
                    <input class="material_quantity" placeholder="用量：如100g" v-model.trim="item.material_quantity" />
                    <view class="material_delete" v-if="index" @click="deleteMaterial(index)">
                        <image src="/static/image/common/close.png" />
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
                        <image src="/static/image/common/up.png" @click="exchangeStep(index)" />
                        <image src="/static/image/common/delete.png" @click="deleteStep(index)" />
                    </view>
                </view>
                <view class="step_img">
                    <view class="img_avatar"></view>
                    <view class="img_text">图片非必填</view>
                </view>
                <view class="step_description">
                    <textarea auto-height placeholder="添加步骤说明" placeholder-style="color:#c8cddb"
                        v-model="item.step_description" />
                </view>
            </view>
            <view class="more_btn">
                <MkNormalBtn text="再增加一步" @confirm="addStep" />
            </view>
        </view>
        <view class="operations">
            <view class="back_btn" @click="backMenu">返回首页</view>
            <view class="save_btn" @click="save">保存</view>
        </view>
    </view>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app"
import MkNormalBtn from '/components/MkNormalBtn'
import { ref, nextTick, onMounted } from 'vue'
import { getMaterialStep, addMaterialStep, updateMaterialStep } from '/api/menu'

// 获取跳转参数
onLoad((query) => {
    if (JSON.stringify(query) != "{}") {
        productionId.value = query.productionId
        productionName.value = query.productionName

    }
})

onMounted(() => {
    uni.showLoading({ title: "加载中" })
    getMaterialStep({ id: productionId.value }).then(res => {
        if (!res.code == 200) return uni.showToast({ title: "出错啦", icon: "error" })
        const { material, step } = res.data
        if (step.length) {
            // 修改
            isAdd = false
            materialData.value = !!material.length ? material : [{ material_name: '', material_quantity: '' }]
            stepData.value = step
        } else {
            // 新增
            isAdd = true
        }
    }).catch(err => {

    }).finally(() => {
        uni.hideLoading()
    })
})

const productionId = ref(0)

const productionName = ref('')

// 新增或者修改 true为新增 false为修改
let isAdd = true

// 用料
const materialData = ref([{ material_name: '', material_quantity: '' }])

// 添加用料
const addMaterial = () => {
    materialData.value.push({ material_name: '', material_quantity: '' })
}

// 删除用料
const deleteMaterial = (index) => {
    materialData.value.splice(index, 1)
}

// 步骤
const stepData = ref([{
    step_description: "",
    step_img: ""
}])

// 添加步骤
const addStep = () => {
    stepData.value.push({ step_description: '', step_img: "" })
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
        url: `/pages/menu/index`
    });
}

// 保存
import { useMenuStore } from "@/store/menu";
const menuStore = useMenuStore()

const save = () => {
    if (!stepData.value.length || !stepData.value[0].step_description) return uni.showToast({ title: '请至少设置一个步骤', icon: "none", duration: 2000 })
    // 步骤说明不能为空
    for (let index = 0; index < stepData.value.length; index++) {
        const step = stepData.value[index];
        if (!step.step_description) return uni.showToast({ title: `步骤${index + 1}的说明不能为空`, icon: "none", duration: 2000 })
    }
    // 过滤空用料
    materialData.value = materialData.value.filter(material => {
        if (material.material_name || material.material_quantity) {
            return material
        }
    })
    // 如果用量存在, 则材料名不能为空
    for (let index = 0; index < materialData.value.length; index++) {
        const material = materialData.value[index];
        if (material.material_quantity && !material.material_name) return uni.showToast({ title: "用料名不能为空", icon: "none", duration: 2000 })
    }

    const params = { material: materialData.value, step: stepData.value, id: productionId.value }

    uni.showLoading({ title: '正在保存' })
    if (isAdd) {
        addMaterialStep(params).then(res => {
            uni.hideLoading()
            uni.showToast({ title: "保存成功", icon: "success" })
            menuStore.getMenuListByApi()

            setTimeout(() => {
                uni.switchTab({
                    url: `/pages/menu/index`
                });
            }, 1500);
        }).catch(err => {
            uni.hideLoading()
            uni.showToast({ title: "保存失败", icon: "error" })
        })
    } else {
        updateMaterialStep(params).then(res => {
            uni.hideLoading()
            uni.showToast({ title: "保存成功", icon: "success" })
            menuStore.getMenuListByApi()

            setTimeout(() => {
                uni.switchTab({
                    url: `/pages/menu/index`,
                });
            }, 1500);
        }).catch(err => {
            uni.hideLoading()
            uni.showToast({ title: "保存失败", icon: "error" })
        })
    }
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
                        background-image: url(/static/image/menu/icon_camera.png);
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