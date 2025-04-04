<template>
	<!-- 取送报告和代办买药才需要地址 -->
	<view class="address-box box">
		<view class="unpaid-txt">收件地址</view>
		<view class="list-box">
			<view class="list-row">
				<view class="exp">收件人姓名</view>
			</view>
			<view class="list-row">
				<view class="exp">收件人电话：</view>
				<view class="row-right">{{orderData.consignee_phone}}</view>
			</view>
			<view class="list-row">
				<view class="exp">收件人地址：</view>
				<view class="row-right">{{orderData.consignee_address}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		name:'orderAddress',
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
	.address-box{
		height:413rpx;
		margin-bottom: 30rpx;
	}
</style>