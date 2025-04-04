<template>
	<view class="status-box">
		<!-- 五个状态，0待支付，1进行中，2待评价，3已完成，4已取消 -->
		
		<!-- 待支付 -->
		<view class="box unpaid" v-if="orderData.status==0">
		     <view class="unpaid-txt">订单待支付</view>
			<view class="unpaid-btn" @click="$navto(`/pages/order/payment?id=${orderData.id}`)">立即支付（￥{{orderData.money.toFixed(2)}}）</view>
		</view>
		<!-- 进行中 ，工作人员已分配/未分配-->
		<view class="box progress" v-if="orderData.status==1">
			<view class="progress-top">
				<iamge src="/static/images/order/clock.png" mode="aspectFit"></iamge>
				<text>进行中</text>
			</view>
			<view class="progress-info">
				<view class="info-title">服务人员信息</view>
				<view class="info-box">
					<view class="info-left">
						<image class="avatar" :src="orderData.staff_photo && $getHost()+orderData.staff_photo||'/static/images/order/avtor/png'" mode="aspectFit"></image>
						<text v-if="orderData.staff_id">{{orderData.staff_name}}</text>
						<text class="blue" v-if="!orderData.staff_id">系统进行服务人员匹配中...</text>
					</view>
					<view class="info-right" v-if="orderData.staff_id">
						联系电话：{{orderData.staff_phone}}
					</view>
				</view>
			</view>
		</view>
		
		<!-- 待评价 -->
		<view class="box progress" v-if="orderData.status==2">
			<view class="progress-top">
				<image src="/static/images/order/write.png" mode="aspectFit"></image>
				<text>待评价</text>
			</view>		
			<view class="progress-info">
				<view class="info-title">服务人员信息</view>
				<view class="info-box">
					<view class="info-left">
						<image :src="$getHost() + orderData.staff_photo" mode="aspectFit"></image>
						<text>{{orderData.staff_name}}</text>
					</view>
					<view class="info-right">联系电话：{{orderData.staff_phone}}</view>
				</view>
			</view>
		</view>
		
		<!-- 已完成 -->
		<view class="box progress" v-if="orderData.status==3">
			<view class="progress-top">
				<image src="/static/images/order/finfish.png" mode="aspectFit"></image>
				<text>已完成</text>
			</view>
			<view class="progress-info">
				<view class="info-title">
					服务人员信息
				</view>
				<view class="info-box">
					<view class="info-left">
						<image :src="$getHost() + orderData.staff_photo" mode="aspectFit"></image>
						<text>{{orderData.staff_name}}</text>
					</view>
					<view class="info-right">联系电话：{{orderData.staff_phone}}</view>
				</view>
			</view>
		</view>
		
		<!-- 已取消 -->
		<view class="box progress" v-if="orderData.status==4">
			<view class="progress-top">
				<image src="/static/images/order/cancel.png" mode="aspectFit"></image>
				<text>订单已取消</text>
			</view>
			<view class="progress-info">
				<text class="gray">您的订单已取消，感谢您的信任</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:'orderStatus',
		props:{
			orderData:{
				type:Object,
				default:()=>{
					return{}
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.unpaid{
		height: 278rpx;
		margin-bottom: 40rpx;
		
		.unpaid-btn{
			width: 630rpx;
			height: 96rpx;
			background: #55b5ff;
			border-radius:48rpx ;
			color: #ffffff;
			font-size: 36rpx;
			font-weight: 500;
			text-align: center;
			line-height: 94rpx;
			margin-top: 50rpx;
		}
	}
	.progress{
		height: 350rpx;
		margin-bottom: 30rpx;
	}
	.progress-top{
		display: flex;
		font-size: 34rpx;
		font-weight: bold;
		color: #333333;
		align-items: center;
		padding-bottom: 40rpx;
		border-bottom: 1px solid #EBEBEB;
		image {
			width: 44rpx;
			height: 44rpx;
			margin-right: 8rpx;
			margin-top: 4rpx;
		}
	}
	.progress-info{
		padding: 50rpx 0 35rpx 0;
		font-size: 30rpx;
		color: #333333;
		font-weight: bold;
		.info-title{
			color: #4c4c4c;
			margin-bottom: 25rpx;
		}
		.info-box{
			display: flex;
			align-items: center;
			font-size: 34rpx;
			image{
				width: 66rpx;
				height: 66rpx;
				margin-right: 20rpx;
			}
			.blue{
				color: $uni-color-primary;
				font-size: 30rpx;
			}
		}
		.info-right{
			font-weight: 500;
			color: #666666;
		}
		.gray{
			font-size: 30rpx;
			font-weight: 500;
			color: #666666;
			margin-left: 100rpx;
			line-height: 100rpx;
		}
	}
</style>