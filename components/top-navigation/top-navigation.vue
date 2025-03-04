<!-- 顶部导航栏 -->
<template>
	<view>
		<block v-if="!onlyShowStatusBar">
			<image :src="imgSrc" v-if="imgSrc" class="bg-img" mode="scaleToFill"></image>
			<view style="height: 580rpx;" v-if="imgSrc"></view>
			<view class="title-bar-appbar" :class="isFix ? '' : 'flx'"
				:style="{ 'padding-top': calculateStatusBar, background: bgColor ? bgColor : '#FFF' }">
				<view class="top-box" :style="{ 'min-height': `${height}rpx` }">
					<view class="top-module left-the">
						<!-- <image class="back-button" src="./back-icon.png" @tap="backPage" mode="aspectFit" v-if="isBack"></image> -->
						<u-icon name="arrow-leftward" color="#000000" size="20" @tap="backPage" v-if="isBack"></u-icon>
						<slot name="left-slot"></slot>
					</view>
					<view class="top-module center-the">
						<slot name="center-slot"></slot>
					</view>
					<view class="top-module right-the">
						<slot name="right-slot"></slot>
					</view>
				</view>
			</view>
			<view class="title-bar-placeholder" :style="{ height: calculateHeight }" v-if="!isFix"></view>
		</block>
		<view v-else style="width: 750rpx;" :style="{ height: calculateStatusBar }"></view>
	</view>
</template>

<script>
	/**
	 *
	 * @description 顶部导航栏
	 * slot:
	 * 		left-slot:左侧插槽
	 * 		center-solt:中间插槽
	 * 		right-solt:右侧插槽
	 * @property {String} 			bgColor				顶部导航栏颜色;默认值：#FFF
	 * @property {String, Boolean} 	isBack				是否显示返回;默认值：true
	 * @property {String, Boolean} 	isBackFunction		左侧插槽是否绑定返回事件;默认值：true
	 * @property {String, Boolean} 	isFix				是否固定在顶部，不悬浮;默认值：true
	 * @property {String} 			imgSrc				导航栏背景图;默认值：空
	 * @property {String, Boolean}  onlyShowStatusBar 	是否仅占位状态栏	默认值：false
	 * @property {Number}  			height 				状态栏高度，单位Rrpx	默认值：88
	 * @example
	 * <top-navigation :isBack="true" :bgColor="themeColors.white"><template #center-slot><view class="mine-name">信息</view></template></top-navigation>
	 *   */

	export default {
		name: 'top-navigation',
		data() {
			return {};
		},
		props: {
			bgColor: {
				type: String,
				default: 'transparent'
			},
			isBack: {
				type: [Boolean, String],
				default: true
			},
			isBackFunction: {
				type: [Boolean, String],
				default: true
			},
			isFix: {
				type: [Boolean, String],
				default: false
			},
			imgSrc: {
				type: String,
				default: ''
			},
			onlyShowStatusBar: {
				type: [Boolean, String],
				default: false
			},
			height: {
				type: [Number],
				default: 88
			}
		},
		computed: {
			calculateHeight() {
				return `calc(${this.statusHeight}px + ${this.height}rpx)`;
			},
			calculateStatusBar() {
				return `${this.statusHeight}px`;
			}
		},
		methods: {
			backPage() {
				if (!this.isBackFunction) {
					this.$emit('click')
					return
				};
				uni.navigateBack({
					delta: 1
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.title-bar {
		width: 750rpx;
		height: auto;
		position: relative;
	}

	.title-bar-appbar {
		@extend .title-bar;
		z-index: 20;
	}

	.title-bar-placeholder {
		@extend .title-bar;
		z-index: 1;
	}

	.top-box {
		height: auto;
		min-height: 88rpx;
		width: 750rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30rpx;
		box-sizing: border-box;

		.back-button {
			width: 35rpx;
			height: 35rpx;
			margin-right: 28rpx;
		}

		.top-module {
			min-width: 50rpx;
			width: auto;
			display: flex;
			align-items: center;
			font-size: 36rpx;
			font-weight: 500;
		}

		.left-the {
			justify-content: flex-start;
		}

		.right-the {
			justify-content: flex-end;
		}

		.center-the {
			justify-content: center;
			font-weight: 550;
			font-size: 30rpx;
		}
	}

	.flx {
		position: fixed;
		top: 0rpx;
	}

	.bg-img {
		width: 750rpx;
		height: 580rpx;
		position: absolute;
		top: 0rpx;
		z-index: 1;
	}
</style>
