<template>
    <view class="uni-calendar-item__weeks-box" :class="{
        'uni-calendar-item--disable': weeks.disable,
        'uni-calendar-item--checked': (showDot && calendar.fullDate === weeks.fullDate),
        'uni-calendar-item--before-checked': weeks.beforeMultiple,
        'uni-calendar-item--multiple': weeks.multiple,
        'uni-calendar-item--after-checked': weeks.afterMultiple,
        'uni-calendar-item--selected':selected && weeks.extraInfo
    }" @click="choiceDate(weeks)">
        <view class="uni-calendar-item__weeks-box-item">
            <!-- <text v-if="selected && weeks.extraInfo" class="uni-calendar-item__weeks-box-circle"
                :style="weeks.extraInfo.dropColor ? 'background-color: ' + weeks.extraInfo.dropColor : ''"></text> -->
            <text class="uni-calendar-item__weeks-box-text" :class="{
                'uni-calendar-item--isDay-text': weeks.isDay,
                'uni-calendar-item--isDay': calendar.fullDate === weeks.fullDate && weeks.isDay,
                'uni-calendar-item--checked': calendar.fullDate === weeks.fullDate && !weeks.isDay,
                'uni-calendar-item--before-checked': weeks.beforeMultiple,
                'uni-calendar-item--multiple': weeks.multiple,
                'uni-calendar-item--after-checked': weeks.afterMultiple,
                'uni-calendar-item--disable': weeks.disable,
            }">{{weeks.isDay ? todayText : weeks.date }}</text>
            <!-- <text v-if="!lunar && !weeks.extraInfo && weeks.isDay" class="uni-calendar-item__weeks-lunar-text" :class="{
                'uni-calendar-item--isDay-text': weeks.isDay,
                'uni-calendar-item--isDay': calendar.fullDate === weeks.fullDate && weeks.isDay,
                'uni-calendar-item--checked': calendar.fullDate === weeks.fullDate && !weeks.isDay,
                'uni-calendar-item--before-checked': weeks.beforeMultiple,
                'uni-calendar-item--multiple': weeks.multiple,
                'uni-calendar-item--after-checked': weeks.afterMultiple,
            }">{{ todayText }}</text> -->
            <text v-if="lunar && !weeks.extraInfo" class="uni-calendar-item__weeks-lunar-text" :class="{
                'uni-calendar-item--isDay-text': weeks.isDay,
                'uni-calendar-item--isDay': calendar.fullDate === weeks.fullDate && weeks.isDay,
                'uni-calendar-item--checked': calendar.fullDate === weeks.fullDate && !weeks.isDay,
                'uni-calendar-item--before-checked': weeks.beforeMultiple,
                'uni-calendar-item--multiple': weeks.multiple,
                'uni-calendar-item--after-checked': weeks.afterMultiple,
                'uni-calendar-item--disable': weeks.disable,
            }">{{ weeks.isDay ? todayText : (weeks.lunar.IDayCn === '初一' ? weeks.lunar.IMonthCn : weeks.lunar.IDayCn) }}</text>
            <text v-if="weeks.extraInfo && weeks.extraInfo.info" class="uni-calendar-item__weeks-lunar-text" :class="{
                'uni-calendar-item--extra': weeks.extraInfo.info,
                'uni-calendar-item--isDay-text': weeks.isDay,
                'uni-calendar-item--isDay': calendar.fullDate === weeks.fullDate && weeks.isDay,
                'uni-calendar-item--checked': calendar.fullDate === weeks.fullDate && !weeks.isDay,
                'uni-calendar-item--before-checked': weeks.beforeMultiple,
                'uni-calendar-item--multiple': weeks.multiple,
                'uni-calendar-item--after-checked': weeks.afterMultiple,
                'uni-calendar-item--disable': weeks.disable,
            }" :style="weeks.extraInfo.fontColor ? 'color: ' + weeks.extraInfo.fontColor : ''">{{ weeks.extraInfo.info }}</text>
        </view>
    </view>
</template>

<script>
import { initVueI18n } from '@dcloudio/uni-i18n'
import i18nMessages from './i18n/index.js'
const { t } = initVueI18n(i18nMessages)

export default {
    emits: ['change'],
    props: {
        weeks: {
            type: Object,
            default() {
                return {}
            }
        },
        calendar: {
            type: Object,
            default: () => {
                return {}
            }
        },
        selected: {
            type: Array,
            default: () => {
                return []
            }
        },
        lunar: {
            type: Boolean,
            default: false
        },
        showDot:{
            type:Boolean,
            default: false
        }
    },
    computed: {
        todayText() {
            return t("uni-calender.today")
        },
    },
    methods: {
        choiceDate(weeks) {
            console.log(this.weeks);
            this.$emit('change', weeks)
        }
    }
}
</script>

<style lang="scss" scoped>
$uni-font-size-base: 14px;
$uni-text-color: #fff;
$uni-font-size-sm: 12px;
$uni-color-error: #e43d33;
$uni-opacity-disabled: 0.3;
$uni-text-color-disable: #c0c0c0;
$uni-primary: #2979ff !default;

.uni-calendar-item__weeks-box {
    flex: 1;
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #efb41c;
    border-radius: 14rpx;
}

.uni-calendar-item__weeks-box-text {
    font-size: $uni-font-size-base;
    color: $uni-text-color;
}

.uni-calendar-item__weeks-lunar-text {
    font-size: $uni-font-size-sm;
    color: $uni-text-color;
}

.uni-calendar-item__weeks-box-item {
    position: relative;
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 80rpx;
    height: 80rpx;
    padding-bottom: 20rpx;
    box-sizing: border-box;
}

.uni-calendar-item__weeks-box-circle {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 8px;
    height: 8px;
    border-radius: 8px;
    background-color: $uni-color-error;

}

.uni-calendar-item--disable {
    // background-color: rgba(249, 249, 249, $uni-opacity-disabled);
    background-color: #f9eba9;
    // color: $uni-text-color-disable;
    color: transparent;
}

.uni-calendar-item--isDay-text {
    // color: $uni-primary;
    color: #fff;
}



.uni-calendar-item--isDay {
    // background-color: $uni-primary;
    // opacity: 0.8;
    color: #fff;

    // position: relative;

    // &.uni-calendar-item__weeks-box {
    //     &::after{
    //         content: " ";
    //         width: 12rpx;
    //         height: 12rpx;
    //         position: absolute;
    //         bottom: 18rpx;
    //         background-color: transparent;
    //         border-radius: 6rpx;
    //     }
    // }
}

.uni-calendar-item--extra {
    color: $uni-color-error;
    opacity: 0.8;
}

.uni-calendar-item--checked {
    // background-color: $uni-primary;
    color: #fff;
    // opacity: 0.8;

    position: relative;

    &.uni-calendar-item__weeks-box {
        &::after{
            content: " ";
            width: 12rpx;
            height: 12rpx;
            position: absolute;
            bottom: 18rpx;
            background-color: $uni-text-color;
            border-radius: 6rpx;
        }
    }
}

.uni-calendar-item--multiple {
    background-color: $uni-primary;
    color: #fff;
    opacity: 0.8;
}

.uni-calendar-item--before-checked {
    background-color: #ff5a5f;
    color: #fff;
}

.uni-calendar-item--after-checked {
    background-color: #ff5a5f;
    color: #fff;
}

.uni-calendar-item--selected{
    background-color: #ef621c;
}
</style>
