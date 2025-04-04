<template>
	<view class="evaluate-detail">
		<top-navigation bgColor="#ffffff">
			<template #left-slot>
				评价详情页
			</template>
		</top-navigation>
		<view class="detail-box">
			<view class="detail-content">
				<view class="detail-top">
					<view class="top-left">
						<image :src="info.photo" mode="aspectFit"></image>
						<text>{{info.nickname}}</text>
					</view>
					<view class="top-right">
						<view class="rate">
							<text class="red">{{info.service_grade.toFixed(1)}}</text>
							<text>服务评分</text>
						</view>
						<view class="rate">
							<text class="red">{{info.staff_grade.toFixed(1)}}</text>
							<text>服务人员评分</text>
						</view>
					</view>
				</view>
				<view class="detail-bottom">
					<view class="flex">
						<view class="content"><span class="exp">服务评价：</span>{{info.service_evaluate}}</view>
					</view>
					<view class="flex">
						<view class="content"><span class="exp">服务人员评价：</span>{{info.staff_evaluate}}</view>
					</view>
					<view class="time">{{info.evaluate_times}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				evalusteId:'',
				info:{}
			}
		},
		onLoad(option) {
			this.evalusteId = option.id;
			this.getDetail();
		},
		methods: {
			getDetail() {
				this.$request('/applet/index/page/getEvaluateDetail',{
					id:this.evalusteId
				}).then(res => {
					if(res.code == 200) {
						this.info = res.data;
					}else {
						uni.$toast(res.msg)
					}
				})
			}
		},
	}
</script>

<style scoped lang="scss">
.evaluate-detail {
	width: 100vw;
	height: 100vh;
	background-color: #F6F7FB;
	box-sizing: border-box;
	
}
.detail-box {
	padding: 30rpx;
}
.detail-content {
	width: 690rpx;
	// height: 562rpx;
	background: #FFFFFF;
	box-shadow: 0px 2rpx 18rpx 0px rgba(0, 0, 0, 0.06);
	border-radius: 20rpx;
	padding: 30rpx;
	box-sizing: border-box;
	.detail-top {
		height: 154rpx;
		border-bottom: 1px solid #EBEBEB;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.top-left {
			display: flex;
			align-items: center;
			font-size: 30rpx;
			font-weight: bold;
			color: #333333;
			image {
				width: 76rpx;
				height: 76rpx;
				margin-right: 20rpx;
			}
		}
		.top-right {
			display: flex;
			font-size: 24rpx;
			font-weight: 500;
			color: #333333;
			justify-content: space-between;
			width: 270rpx;
			
			.rate {
				display: flex;
				flex-direction: column;
				align-items: center;
				height: 70rpx;
				justify-content: space-between;
				.red {
					color: #FF4D4D;
					font-weight: bold;
				}
			}
		}
	}
	.detail-bottom {
		.flex {
			display: flex;
			font-size: 28rpx;
			font-weight: bold;
			line-height: 44rpx;
			margin-top: 30rpx;
		}
		.exp {
			color: #333333;
		}
		.content {
			color: #666666;
		}
		.time {
			margin-top: 30rpx;
			font-size: 26rpx;
			font-weight: 500;
			color: #ADADAD;
			line-height: 36rpx;
		}
	}
}
</style>