<template>
    <view class="cate_page">
        <view class="cate_item" v-for="(cate, index) in menuStore.cateList" :key="index">
            <view class="cate_name" @click="modifiedHandler(cate)">{{ cate.name }}</view>
            <view class="cate_operation">
                <image src="../../../static/image/common/up.png" />
                <image src="../../../static/image/common/up.png" class="down_icon" />
                <image src="../../../static/image/common/delete.png" />
            </view>
        </view>
        <view class="cate_btn" @click="addCate">新建分类</view>
        <CateEditDialog v-model:show="showDialog" :cate="currentCate" @confirm="saveCate" v-if="showDialog" />
    </view>
</template>

<script setup>
import { ref } from 'vue'
import CateEditDialog from "./components/cateEditDialog.vue"

// 从pinia中获取菜单列表
import { useMenuStore } from "@/src/store/menu";
const menuStore = useMenuStore()

const showDialog = ref(false)

// 修改的分类
const currentCate = ref(null)

const modifiedHandler = (cate) => {
    currentCate.value = cate
    showDialog.value = true
}

// 新建分类按钮
const addCate = () => {
    currentCate.value = null
    showDialog.value = true
}

// 保存分类
const saveCate = (cateValue) => {
    // 调用新增和修改接口, 然后调用首页火球菜单的接口并更新pinia中的menuList
    showDialog.value = false
}

</script>

<style lang="less" scoped>
.cate_page {
    min-height: 100vh;
    background-color: #f7f8fa;
    box-sizing: border-box;
    padding: 70rpx 70rpx 200rpx;
    position: relative;

    .cate_item {
        width: 100%;
        height: 70rpx;
        margin-bottom: 70rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .cate_name {
            width: 60%;
            height: 100%;
            border: 2rpx solid #e8e8e8;
            border-radius: 10rpx;
            background-color: #fff;
            color: #777777;
            line-height: 70rpx;
            padding-left: 40rpx;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .cate_operation {
            height: 100%;
            width: 25%;
            display: flex;
            align-items: center;
            justify-content: space-between;

            &>image {
                width: 40rpx;
                height: 40rpx;
            }

            .down_icon {
                transform: rotate(180deg);
            }
        }
    }

    .cate_btn {
        position: fixed;
        bottom: 100rpx;
        left: 50%;
        transform: translateX(-50%);
        width: 660rpx;
        height: 100rpx;
        font-size: 36rpx;
        font-weight: 700;
        line-height: 100rpx;
        background-color: #f6c33d;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50rpx;
    }
}
</style>