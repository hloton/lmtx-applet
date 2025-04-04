<!-- 分享 -->
<template>
	<view class="share-popup" v-if="isDisplay">
		<view class="color-bg" @tap="hide()"></view>
		<view class="content-bg">
			<!-- <view class="look-up">
				<view class="">
				</view>
				<view>
					<text class="look-title">分享到</text>
				</view>
				<view>
					
				</view>
			</view> -->
			<view class="share-fast-bg">
				<view class="share-fast">
					<image src="./qq-friends.png" mode="aspectFit"></image>
					<text>QQ好友</text>
				</view>
				<view class="share-fast">
					<image src="./wechat-friends.png" mode="aspectFit"></image>
					<text>微信好友</text>
				</view>
				<view class="share-fast">
					<image src="./circle-friends.png" mode="aspectFit"></image>
					<text>朋友圈</text>
				</view>
				<view class="share-fast">
					<image src="./weibo.png" mode="aspectFit"></image>
					<text>微博</text>
				</view>
				<view class="share-fast">
					<image src="./qq-space.png" mode="aspectFit"></image>
					<text>QQ空间</text>
				</view>
				<view class="share-fast">
					<image src="./copy-link.png" mode="aspectFit"></image>
					<text>复制链接</text>
				</view>
				<view class="share-fast">
					<image src="./photo-shar.png" mode="aspectFit"></image>
					<text>照片分享</text>
				</view>
			</view>
			<view class="cancel" @tap="hide()">
				取消
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * props:
	 * 		isShow：显示隐藏默认值	参数值例：true	默认值：false
	 * 
	 * methods
	 * @show		显示方法			function()	方法主动调用 //<Alert ref="refName"> this.$refs.refName.show()
	 * @onCancel	监听取消按钮		callback()	书写再标签内 //<Alert @onCancel>
	 * @share		分享方法的		function()
	 * @shareSuccess	分享成功回调
	 * @shareComplete	调用分享结束的回调
	 * @shareFail		调用分享失败的回调
	 * */
	export default {
		name: 'share-popup',
		props: {
			isShow: {
				type: [Boolean, String],
				default: false
			},
		},
		data() {
			return {
				isDisplay: false
			};
		},
		mounted() {
			this.isDisplay = this.isShow;
		},
		methods: {
			show(){
				this.isDisplay = true;
			},
			hide(){
				this.isDisplay = false;
			}
		}
	};
</script>

<style lang="scss" scoped>
	.share-popup{
		height: 100vh;
		width: 750rpx;
		position: fixed;
		top: 0rpx;
		left: 0rpx;
		z-index: 1000;
		.color-bg{
			height: 100vh;
			width: 750rpx;
			background-color: #000000;
			opacity: 0.4;
			position: absolute;
			top: 0rpx;
			left: 0rpx;
		}
		.content-bg{
			width: 750rpx;
			height: auto;
			background-color: #FFFFFF;
			position: absolute;
			bottom: 0rpx;
			padding-top: 10rpx;
			border-radius: 32rpx 32rpx 0rpx 0rpx;
			overflow: hidden;
			.look-up{
				height: auto;
				width: 750rpx;
				min-height: 60rpx;
				border-bottom: 1px solid #F1F1F1;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.look-title{
					font-weight: bold;
					font-size: 32rpx;
				}
			}
			.share-fast-bg {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				width: 100%;
				height: 120%;
				padding: 0rpx 0rpx 15rpx 0rpx;
				background-color: #FFFFFF;
				.share-fast {
					width: 150rpx;
					height: 155rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: space-between;
					margin-top: 50rpx;
					image {
						width: 110rpx;
						height: 110rpx;
					}
			
					text {
						color: #676767;
						font-size: 24rpx;
						
					}
				}
			}
			.cancel{
				width: 750rpx;
				height: 110rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 28rpx;
				font-weight: bold;
				margin-top: 20rpx;
			}
		}
	}
	
</style>
