<template>
	<view class="order-box box">
		<view class="unpaid-txt">
			订单信息
		</view>
		<view class="list-box">
			<view class="list-row">
				<view class="exp">
					服务类型：
				</view>
				<view class="row-right">
					{{typeArr[orderData.project_type]}}
				</view>
			</view>
			
			<view class="list-row">
				<view class="exp">
					订单编号:
				</view>
				<view class="row-right">
					{{orderData.ext1}}
				</view>
			</view>
			
			<view class="list-row">
				<view class="exp">
					下单时间：
				</view>
				<view class="row-right">
					{{orderData.order_time}}
				</view>
			</view>
			
			<view class="list-row">
				<view class="exp">
					{{isStaff?'实付金额：':'应付金额：'}}
				</view>
				<view class="row-right">
					{{orderData.money}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		name:'orderInfor',
		props:{
			orderData:{
				type:Object,
				default:()=>{
					return {}
				}
			},
			isStaff:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return{
				typeArr:['','全天陪诊','半天陪诊','代办问诊','取送报告','代办买药','诊前挂号','尊享陪诊','延时服务']
			} 
		}
	}
</script>

<style scoped lang="scss">
	.order-box {
		margin-top: 30rpx;
	}
</style>
