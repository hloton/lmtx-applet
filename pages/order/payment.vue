<template>
	<view>
		<top-navigation bgColor="#ffffff" :isBackFunction="false" @click="showPop">
			<template #left-slot>
				收银台
			</template>
		</top-navigation>
		<view class="content">
			<view class="card">
				<view class="top">
					<view class="pay-text">
						支付金额
					</view>
					<view class="pay-num">
						<text style="font-size: 36rpx;margin-right: 10rpx;">￥</text>
						{{orderDetail.money}}
					</view>
				</view>
				<view class="bottom">
					<view class="">
						{{projectList[orderDetail.project_type]}}
					</view>
					<view class="">
						¥ {{orderDetail.money}}
					</view>
				</view>
			</view>
			<view class="paytext">
				支付方式
			</view>
			<view class="pay-type">
				<!-- #ifdef MP-WEIXIN -->
				<view class="pay-line">
					<view class="left">
						<u-icon name="weixin-fill" size="70rpx" color='#18a73e'></u-icon>
						微信
					</view>
					<view class="right">
						<u-icon @tap="payType = 'wxpay'" :name="`checkmark-circle${payType == 'wxpay' ? '-fill' : ''}`" size="46rpx" color='#55b5ff'></u-icon>
					</view>
				</view>
				<!-- #endif -->
				<!-- #ifdef APP-PLUS -->
				<view class="pay-line">
					<view class="left">
						<u-icon name="zhifubao" size="70rpx" color='#1677ff'></u-icon>
						支付宝
					</view>
					<view class="right">
						<u-icon @tap="payType = 'alipay'" :name="`checkmark-circle${payType == 'alipay' ? '-fill' : ''}`" size="46rpx" color='#55b5ff'></u-icon>
					</view>
				</view>
				<!-- #endif -->
			</view>
		</view>
		<view class="confirm" @tap="getwxpay">
			确定支付
		</view>
		<u-popup :show="confirmShow" @close="confirmShow = false" round="10" mode="center">
					<view class="confirmpop">
						<view class="title">
							提示
						</view>
						<view class="tips">
							是否确认放弃付款？
						</view>
						<view class="btn-box">
							<view class="btn cancel" style="margin-right: 34rpx;" @tap="confirmShow = false">
								取消
							</view>
							<view class="btn confirm_btn" @tap="sureCancel">
								确认
							</view>
						</view>
					</view>
				</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				confirmShow:false,
				orderDetail:{},
				projectList:['', '全程陪诊', '半天陪诊', '代办问诊', '取送报告', '代办买药', '诊前挂号', '专享陪诊','延时服务'],
				payFinish:false,
				payType:''
			};
		},
		onLoad(e){
			//修改默认支付类型
			//#ifdef MP-WEIXIN
			this.paytype='wxpay'
			//#endif
			// #ifdef APP-PLUS
			this.payType = 'alipay'
			// #endif
			this.$request('/applet/staff/queryOrderDetail', {
				id: e.id
			}).then(res => {
				if (res.success) {
					this.orderDetail = res.data
					this.project_type = res.data.project_type
				} else this.$toast(res.msg)
			})
		},
		methods:{
			//支付方法
			async getwxpay(){
				let requestUrl={
					wxpay:'/applet/pay/wxPay',
					alipay:'/applet/pay/payApp'
				}
				let params={
					order_num:this.orderDetail.order_num,
					menber_id:uni.getStorageSync('userinfo').id+'',
					body:this.projectList[this.orderDetail.project_type]
				}
				
				
				let res = await this.$request(requestUrl[this.payType], params)
				console.log("支付", res)
				if (!res.success) return this.$toast(res.msg)
				// let payData = {
				// 	provider: this.payType
				// }
				// // #ifdef MP-WEIXIN
				// payData = {
				// 	...payData,
				// 	...res.data
				// }
				// // #endif
				// // #ifdef APP-PLUS
				// payData = {
				// 	...payData,
				// 	orderInfo: res.data
				// }
				// // #endif
				// uni.requestPayment({
				// 	...payData,
				// 	success: (res) => {
				// 		this.$toast('支付成功').then(res => {
				// 			uni.reLaunch({
				// 				url: '/pages/order/order-details?id=' + this.orderDetail.id
				// 			});
				// 		})
				// 	},
				// 	fail: (err) => {
				// 		this.$toast('支付失败，请稍后再试').then(res => {
				// 			uni.reLaunch({
				// 				url: '/pages/order/order-details?id=' + this.orderDetail.id
				// 			});
				// 		})
				// 	}
				// });
				
				
				this.$toast('支付成功').then(res => {
					uni.reLaunch({
						url: '/pages/order/order-details?id=' + this.orderDetail.id
						});
				})
			},
			showPop(){
				if(!this.payFinish){
					this.confirmShow=true
				}
			},
			sureCancel(){
				this.confirmShow=false
				uni.reLaunch({
					url:'/pages/order/order-details?id='+this.orderDetail.id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
page {
		background: #F6F7FB;
	}

	.content {
		padding: 20rpx;

		.card {
			width: 100%;
			background: #FFFFFF;
			box-shadow: 0px 2rpx 18rpx 0px rgba(0, 0, 0, 0.06);
			border-radius: 20rpx;
			padding: 30rpx;
			padding-top: 77rpx;
			box-sizing: border-box;

			.top {
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				padding-bottom: 56rpx;
				border-bottom: 1px solid #ebebeb;

				.pay-text {
					font-size: 30rpx;
					font-weight: bold;
					color: #333333;
					margin-bottom: 40rpx;
				}

				.pay-num {
					font-size: 60rpx;
					font-weight: 800;
					color: #FF4D4D;
				}
			}

			.bottom {
				margin-top: 40rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 30rpx;
				font-weight: bold;
				color: #333333;
			}
		}

		.paytext {
			font-size: 32rpx;
			font-weight: bold;
			color: #333333;
			margin: 44rpx 0;
		}

		.pay-type {

			width: 100%;
			min-height: 112rpx;
			background: #FFFFFF;
			box-shadow: 0px 2rpx 18rpx 0px rgba(0, 0, 0, 0.06);
			border-radius: 20rpx;
			padding: 0 29rpx;
			box-sizing: border-box;

			.pay-line {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 100rpx;

				.left {
					display: flex;
					align-items: center;

					image {
						width: 52rpx;
						height: 44rpx;
						margin-right: 20rpx;
					}
				}

				.right {
					image {
						width: 40rpx;
						height: 40rpx;
					}
				}
			}

		}
	}

	.confirm {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690rpx;
		height: 96rpx;
		background: #55B5FF;
		border-radius: 48rpx;
		font-size: 36rpx;
		font-weight: 500;
		color: #FFFFFF;
		margin: 150rpx auto;
		margin-bottom: 0;
	}

	.confirmpop {
		width: 566rpx;
		height: 338rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		padding: 50rpx 40rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		flex-direction: column;

		.title {
			font-size: 36rpx;
			font-weight: bold;
			color: #333333;
			margin-bottom: 50rpx;
		}

		.tips {
			font-size: 30rpx;
			font-weight: 500;
			color: #666666;
			margin-bottom: 50rpx;
		}

		.btn-box {
			height: 76rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.btn {
				width: 228rpx;
				height: 76rpx;
				border-radius: 38rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #FFFFFF;
			}

			.cancel {
				background: #CDCDCD;
			}

			.confirm_btn {
				background: #55B5FF;
			}
		}
	}
</style>
