<template>
    <view class="search_page">
        <view class="search_page_top">
            <view class="search_bar">
                <image src="/static/image/common/search.png" mode="scaleToFill" class="prefix_icon" />
                <input class="search_input" focus :placeholder="searchConfig.placeholder" />
            </view>
            <view class="search_btn">搜索</view>
        </view>
        <view class="search_page_content">
            <view class="search_history">
                <view class="search_history_title">历史搜索</view>
                <view class="search_history_labels">
                    <text class="history_label">
                        瑞纳冰
                    </text>
                    <text class="history_label">
                        冰镇杨纳冰
                    </text>
                    <text class="history_label">
                        冰镇杨梅瑞纳冰
                    </text>
                    <text class="history_label">
                        冰纳冰
                    </text>
                    <text class="history_label">
                        冰镇杨梅瑞纳冰
                    </text>
                    <text class="history_label">
                        冰冰
                    </text>
                    <text class="history_label">
                        冰镇杨梅瑞纳冰
                    </text>
                    <text class="history_label">
                        冰镇杨梅瑞纳冰
                    </text>
                    <text class="history_label">
                        冰镇杨梅瑞纳冰
                    </text>
                </view>
            </view>
            <view class="search_result">
                <image src="/static/image/default_img.jpg" mode="scaleToFill" class="avatar" />
                <view class="search_result_content">
                    <view class="name">这个是店名</view>
                    <view class="product_num">商品总数：99</view>
                    <view class="like_num">获赞数量：99
                        <image src="/static/image/menu/icon_like.png" mode="scaleToFill" class="icon" />
                    </view>
                    <view class="confirm_btn">去TA的商店</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { onLoad } from "@dcloudio/uni-app"

// 获取跳转参数
onLoad((query) => {
    // type 1:商家搜索
    if (JSON.stringify(query) != "{}") {
        const { type } = query
        searchConfig.value = searchTypeConfig.find(item => item.type = type)
    }
})

const searchTypeConfig = [{ type: 1, placeholder: '请输入商家昵称或商家id' }]

const searchConfig = ref({ type: 0, placeholder: "" })

// TODO 写搜索接口, 保存搜索结果到storage中

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
                    margin-bottom: 30rpx;
                }
            }
        }

        .search_result {
            box-sizing: border-box;
            width: 100%;
            background-color: #fff;
            border: 2rpx solid #e6e9f7;
            border-radius: 40rpx;
            padding: 20rpx 40rpx;
            display: flex;


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

                .name {
                    font-weight: 700;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    margin-bottom: 20px;
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
                    // TODO 优化样式
                }

            }
        }
    }
}
</style>