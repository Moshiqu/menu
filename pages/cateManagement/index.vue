<template>
    <view class="cate_page">
        <view class="cate_item" v-for="(cate, index) in menuStore.cateList" :key="cate.id">
            <view class="cate_name" @click="modifiedHandler(cate)">{{ cate.category_name }}</view>
            <view class="cate_operation">
                <image src="/static/image/common/up.png" @click="move(true, cate, index)" />
                <image src="/static/image/common/up.png" class="down_icon" @click="move(false, cate, index)" />
                <image src="/static/image/common/delete.png" @click="showDeleteDialog = true, currentCate = cate" />
            </view>
        </view>
        <view class="cate_btn" @click="addCate">新建分类</view>
        <CateEditDialog v-model:show="showDialog" :cate="currentCate" @confirm="saveCate" v-if="showDialog" />
        <MkDialog v-model:showDialog="showDeleteDialog" @confirm="deleteCate" :title="'提示'" :description="`是否确认删除该分类!`" />
    </view>
</template>

<script setup>
import { ref } from 'vue'
import CateEditDialog from "./components/cateEditDialog.vue"
import { addCategory, updateCategory, updateCategorySort, deleteCategory } from '/api/menu'
import MkDialog from '/components/MkDialog'

// 从pinia中获取菜单列表
import { useMenuStore } from "/store/menu";
const menuStore = useMenuStore()

const showDialog = ref(false)

// 需要修改的分类
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

// 获取用户信息
import { userUserInfoStore } from "/store/userInfo";
const userInfoStore = userUserInfoStore()

// 保存分类
const saveCate = (cateValue) => {
    if (currentCate.value) {
        // 修改的分类
        updateCategory({ id: currentCate.value.id, categoryName: cateValue }).then(res => {
            if (res.code === 200) {
                uni.showToast({ title: "修改分类成功", icon: "none" })
                menuStore.getMenuListByApi()
            } else {
                uni.showToast({ title: "修改失败", icon: "error" })
            }
        }).catch(err => {
            uni.showToast({ title: err.errMsg || err.message || '修改失败', icon: "error" })
        }).finally(() => {
            showDialog.value = false
            currentCate.value = null
        })
        return
    }

    const userId = userInfoStore.userInfo.user_id
    addCategory({ cateName: cateValue, userId }).then(res => {
        if (res.code === 200) {
            uni.showToast({ title: "添加分类成功", icon: "none" })
            menuStore.getMenuListByApi()
        } else {
            uni.showToast({ title: "添加失败", icon: "error" })
        }
    }).catch(err => {
        uni.showToast({ title: err.errMsg || err.message || '添加失败', icon: "error" })
    }).finally(() => {
        showDialog.value = false
        currentCate.value = null
    })
}

// 修改分类排序 type:true 上移
const move = (type, cate, index) => {
    if (type && !index) return uni.showToast({ title: "不能再上移", icon: "none" })
    if (!type && index === menuStore.cateList.length - 1) return uni.showToast({ title: "不能再下移", icon: "none" })

    const anotherCate = menuStore.cateList[type ? index - 1 : index + 1]

    const params = {
        value1: { id: cate.id, sortIndex: anotherCate.sort_index },
        value2: { id: anotherCate.id, sortIndex: cate.sort_index }
    }

    uni.showLoading()
    updateCategorySort(params).then(res => {
        uni.hideLoading()
        if (res.code != 200) return uni.showToast({ title: '修改失败', icon: "none" })
        uni.showToast({ title: '修改成功', icon: "none" })
        menuStore.getMenuListByApi()
    }).catch(err => {
        uni.hideLoading()
        uni.showToast({ title: err.errMsg || err.message || '修改失败', icon: "none" })
    })
}

// 删除分类
const showDeleteDialog = ref(false)

const deleteCate = () => {
    if (!currentCate.value.id) return
    showDeleteDialog.value = true
    uni.showLoading()
    deleteCategory({ id: currentCate.value.id }).then(res => {
        uni.hideLoading()
        if (res.code !== 200) return uni.showToast({ title: "删除分类失败", icon: 'none' })
        uni.showToast({ title: "删除分类成功", icon: 'none', duration: 1500 })
        menuStore.getMenuListByApi()
    }).catch(err => {
        uni.hideLoading()
        uni.showToast({ title: err.errMsg || err.message || '删除失败', icon: 'none' })
    }).finally(() => {
        showDeleteDialog.value = false
        currentCate.value = null
    })
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