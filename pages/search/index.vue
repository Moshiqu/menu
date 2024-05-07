<template>
    <view class="search_page">
        <view class="search_page_top">
            <view class="search_bar">
                <image src="/static/image/common/search.png" mode="scaleToFill" class="prefix_icon" />
                <input class="search_input" focus :placeholder="searchConfig.placeholder" v-model.trim="searchValue"
                    confirm-type="search" @confirm="searchHandler" />
            </view>
            <view class="search_btn" @click="searchHandler">搜索</view>
        </view>
        <view class="search_page_content">
            <view class="search_history" v-if="searchHistoryList.length">
                <view class="search_history_title">历史搜索</view>
                <view class="search_history_labels">
                    <text class="history_label" v-for="(item, index) in searchHistoryList" :key="index"
                        @click="searchValue = item, searchHandler()">
                        {{ item }}
                    </text>
                </view>
            </view>
            <view class="search_result" v-if="isSearched">
                <view class="search_result_title">搜索结果</view>
                <template v-if="resultList.length">
                    <view class="search_result_item" v-for="item in resultList" :key="item.id"
                        @click="toOtherStore(item.id)">
                        <image src="/static/image/default_img.jpg" mode="scaleToFill" class="avatar" />
                        <view class="search_result_content">
                            <view class="name">{{ item.nick_name }}</view>
                            <view class="description">{{ item.description }}</view>
                            <view class="product_num">商品总数：{{ item.total_product_num }}</view>
                            <view class="like_num">获赞数量：{{ item.total_like_num }}
                                <image src="/static/image/menu/icon_like.png" mode="scaleToFill" class="icon" />
                            </view>
                            <view class="confirm_btn">去TA的商店</view>
                        </view>
                    </view>
                </template>
                <view v-else class="no_result_box">
                    <image src="/static/image/common/no_result.png" mode="scaleToFill" class="no_result_img" />
                    <text>暂无结果</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from "@dcloudio/uni-app"
import { config } from './config'
import { useMenuStore } from '/store/menu';

// 获取跳转参数
onLoad((query) => {
    if (JSON.stringify(query) != "{}") {
        const { type } = query
        searchConfig.value = config.find(item => item.type = type)
    }
})

// 搜索
const searchConfig = ref({ type: 0, placeholder: "", emptySearchValue: '输入框不能为空' })

const searchValue = ref('')

const resultList = ref([])

const isSearched = ref(false)

const searchHandler = () => {
    if (!searchValue.value) return uni.showToast({ title: searchConfig.value.emptySearchValue, icon: "none" })
    isSearched.value = true
    uni.showLoading({ title: '搜索中', mask: true })

    if (!searchConfig.value.searchApi) return
    searchConfig.value.searchApi({ value: searchValue.value }).then(res => {
        uni.hideLoading()
        if (res.code !== 200) return uni.showToast({ title: res.message || '搜索失败', icon: "none" })
        resultList.value = res.data

        // 保存搜索的值
        const defaultObj = {}
        defaultObj[`type_${searchConfig.value.type}`] = []

        const storage = uni.getStorageSync('search_history') || defaultObj
        const typeStorage = storage[`type_${searchConfig.value.type}`]
        if (typeStorage.includes(searchValue.value)) typeStorage.splice(typeStorage.indexOf(searchValue.value), 1)
        typeStorage.unshift(searchValue.value)

        const typeStorage10 = typeStorage.length > 10 ? typeStorage.slice(0, 10) : typeStorage
        storage[`type_${searchConfig.value.type}`] = typeStorage10
        uni.setStorageSync('search_history', storage)
    }).catch(err => {
        uni.hideLoading()
        uni.showToast({ title: err.Msg || err.errMsg || '搜索失败', icon: "none" })
    }).finally(() => {
        searchHistoryList.value = uni.getStorageSync('search_history')[`type_${searchConfig.value.type}`] || []
    })
}

// 搜索历史
const searchHistoryList = ref([])

onMounted(() => {
    searchHistoryList.value = uni.getStorageSync('search_history')[`type_${searchConfig.value.type}`] || []
})

// 跳转首页, 搜索其他店家商品

const menuStore = useMenuStore()
const toOtherStore = (userId) => {
    menuStore.resetCartList()
    // TODO 跳转首页, 并携带参数
    // uni.setStorageSync('storeId', userId)
    // uni.switchTab({ url: `/pages/menu/index` })
    uni.reLaunch({
        url: `/pages/menu/index?storeId=${userId}`
    });
}

</script>

<style scoped lang="less">
.search_page {
    height: 100vh;
    background-color: #f5f5f5;

    .search_page_top {
        width: 100%;
        padding: 10rpx 40rpx;
        font-size: 28rpx;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        background-color: #fff;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, .05), 0 2px 3px 0 rgba(0, 0, 0, .1);

        .search_bar {
            width: 400rpx;
            height: 60rpx;
            position: relative;

            .prefix_icon {
                position: absolute;
                left: 20rpx;
                top: 50%;
                transform: translateY(-50%);
                width: 40rpx;
                height: 40rpx;
            }

            .search_input {
                width: 100%;
                height: 100%;
                border-radius: 30rpx;
                background-color: #f6f6f6;
                padding-left: 70rpx;
                box-sizing: border-box;
            }
        }

        .search_btn {
            width: 80rpx;
            margin-left: 40rpx;
        }

    }

    .search_page_content {
        padding: 40rpx 20rpx;
        font-size: 28rpx;

        .search_history {
            margin-bottom: 60rpx;

            .search_history_title {
                font-weight: 700;
                margin-bottom: 30rpx;
            }

            .search_history_labels {
                .history_label {
                    display: inline-block;
                    height: 60rpx;
                    border-radius: 30rpx;
                    padding: 0 30rpx;
                    line-height: 60rpx;
                    background-color: #fff;
                    color: #797979;
                    margin-right: 10rpx;
                    margin-bottom: 20rpx;
                }
            }
        }

        .search_result {
            .search_result_title {
                font-weight: 700;
                margin-bottom: 30rpx;
            }

            .search_result_item {
                box-sizing: border-box;
                width: 100%;
                background-color: #fff;
                border: 2rpx solid #e6e9f7;
                border-radius: 40rpx;
                padding: 20rpx;
                display: flex;
                margin-bottom: 20rpx;

                .avatar {
                    width: 154rpx;
                    height: 154rpx;
                    border-radius: 20rpx;
                    margin-right: 20rpx;
                }

                .search_result_content {
                    flex: 1;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;

                    .name {
                        font-weight: 700;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    .description {
                        font-size: 24rpx;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    .product_num,
                    .like_num {
                        display: inline-block;
                        font-size: 24rpx;
                        color: #999;
                        display: flex;
                        align-items: flex-end;

                        .icon {
                            width: 40rpx;
                            height: 40rpx;
                            margin-left: 10rpx;
                        }
                    }

                    .confirm_btn {
                        position: absolute;
                        bottom: 0;
                        right: 0;
                    }

                }
            }

            .no_result_box {
                display: flex;
                flex-direction: column;
                align-items: center;

                .no_result_img {
                    width: 370px;
                    height: calc(370px / 1.88);
                }

                text {
                    margin-top: 40rpx;
                    color: #4a7dff;
                    font-size: 24px;
                }
            }
        }


    }
}
</style>