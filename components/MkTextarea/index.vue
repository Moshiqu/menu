<template>
    <view class="textarea-container" :style="{ textAlign, height: textareaIsWrap ? '100%' : `${minHeight}%` }">
        <textarea :placeholder="placeholder" class="textarea_class" :maxlength="maxlength" v-model="textValue"
            @blur="blurHandler"></textarea>
        <view class="footer" :style="{ right: `${footerRight}rpx` }" v-if="maxlength != 255">
            {{ textValue?.length || 0 }}/{{ maxlength }}
        </view>
        <view class="textarea_class invisible_input">{{ textValue }}</view>
    </view>
</template>

<script setup>
import { onMounted, getCurrentInstance, defineProps, ref, watch, defineEmits } from 'vue'

const $props = defineProps({
    // 字体位置
    textAlign: { type: String, default: "left" },
    // 初始值
    textareaValue: {
        type: [String, null], // 允许 String 或 null 类型  
        default: '', // 默认值为空字符串  
        validator: function (value) {
            // 自定义验证函数，接受 null 值  
            return value === null || typeof value === 'string';
        },
    },
    maxlength: { type: Number, default: 255 },
    // 单一行, 占据父盒子高度的百分之多少
    minHeight: { type: Number, default: 50 },
    // 字数数量框向右偏移量, 相对的祖元素需要设置position:relative和padding-bottom(需调试)
    footerRight: { type: Number, default: 0 },
    placeholder: { type: String, default: "请输入内容" }
})
const $emits = defineEmits()

const currentInstance = getCurrentInstance()

const textValue = ref('')

onMounted(() => {
    textValue.value = $props.textareaValue
})

const textareaIsWrap = ref(false)

// 计算是否换行
// 输入框的宽度
let textareaWidth = 0
uni.createSelectorQuery().in(currentInstance).select('.textarea_class').boundingClientRect((rect) => {
    textareaWidth = rect.width
}).exec()

watch(textValue, (nv, ov) => {
    uni.createSelectorQuery().in(currentInstance).select('.invisible_input').boundingClientRect((rect) => {
        // 内容框宽度
        const invisibleWidth = rect.width
        textareaIsWrap.value = invisibleWidth >= textareaWidth
    }).exec()
})

const blurHandler = () => {
    $emits("update:textareaValue", textValue.value)
}



</script>

<style scoped lang="less">
.textarea-container {
    // width: 245px;
    width: 100%;
    // margin-bottom: 14px;
    height: 100%;
    font-size: 16px;
    line-height: 24px;

    .textarea_class {
        width: 100%;
        height: 100%;
        // min-height: 20px;
        padding: 0;
        box-sizing: border-box;
        border: none;
    }

    .textarea_class:focus {
        outline: none;
    }

    .footer {
        position: absolute;
        bottom: 0;
        font-size: 12px;
    }

    .invisible_input {
        width: fit-content;
        white-space: nowrap;
        visibility: hidden;
    }
}
</style>