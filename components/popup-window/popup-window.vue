<!-- 弹窗透明底组件 -->
<template>
	<view>
		<view class="popup-window" v-show="isShow" @touchmove.stop.prevent="moveHandle">
			<view
				class="popup-window-bg"
				:style="{
					'background-color': bgColor,
					'opacity': transparency,
					'height' : bgHeight,
					'width' : bgWidth
				}"
				@touchstart="hide(clickCancel, startFunc)"
				@touchmove.stop.prevent="touchmove"
				@tap.stop.prevent="hide(clickCancel)"
			></view>
			<slot name="popup-content" @tap.stop=""></slot>
		</view>
	</view>
</template>

<script>
/**
 * @description 弹窗组件
 * @property {String} 				bgColor			背景色;默认值：#000000
 * @property {Number, String} 		transparency	透明度;默认值：0.4
 * @property {Boolean, String} 		clickCancel		点击背景部分是否隐藏;默认值：true
 * @property {Boolean, String} 		startFunc		触摸时背景部分是否隐藏;默认值：false
 * @property {Boolean, String} 		defaultDisplay 	弹窗显示默认值; 默认值false
 * @function show									显示弹窗
 * @function hide									隐藏弹窗
 * @example
 * */
export default {
	name: 'popup-window',
	data() {
		return {
			isShow: false
		};
	},
	props: {
		bgColor: {
			type: String,
			default: '#000000'
		},
		transparency: {
			type: [String, Number],
			default: '0.6'
		},
		clickCancel: {
			type: [String, Boolean],
			default: true
		},
		startFunc: {
			type: [String, Boolean],
			default: false
		},
		defaultDisplay: {
			type: [String, Boolean],
			default: false
		},
		bgHeight: {
			type: [String, Number],
			default: '100vh'
		},
		bgWidth: {
			type: [String, Number],
			default: '100vw'
		},
	},
	mounted() {
		this.isShow = this.defaultDisplay;
	},
	methods: {
		moveHandle(){},
		show() {
			this.isShow = true;
			// console.log(this.startFunc)
		},
		hide(value = true, startFunc = true) {
			this.$emit('clickOnThe');
			if (!value) {
				return;
			}
			if (!startFunc) {
				return;
			}
			this.isShow = false;
		},
		touchmove() {},
		touchend() {}
	}
};
</script>

<style>
.popup-window {
	width: 100vw;
	height: 100vh;
	position: fixed;
	left: 0rpx;
	top: 0rpx;
	/* #ifndef APP-PLUS-NVUE */
	display: flex;
	/* #endif */
	align-items: center;
	justify-content: center;
	z-index: 999;
}
.popup-window-bg {
	width: 100vw;
	height: 100vh;
	background-color: #000000;
	position: fixed;
	top: 0rpx;
	left: 0rpx;
	opacity: 0.4;
}
</style>
