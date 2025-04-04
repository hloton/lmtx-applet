<template>
	<view class="page">
		<view style="margin-bottom: 30rpx;" >
			<staffhome v-if="activeIndex == 0" type="staff" ref="order" @myEvent="toPay"></staffhome>
			<mine v-if="activeIndex == 1" ref="mine" :isearnest="isearnest"></mine>
		</view>
		<view class="occupi"></view>
		<!-- 接单大厅 -->
			<image v-if="activeIndex == 0" src="/static/images/home/order-hall.png" class="order-hall" @tap="toOrderHall"></image>
			<!-- <image  src="/static/images/home/service.png" class="order-hall" @tap="toOrderHall"></image> -->
			<!-- 客服 -->
			<image v-if="activeIndex == 1" src="/static/images/home/service.png" class="service" @tap="serviceShow = true"></image>
			<u-popup :show="serviceShow" @close="serviceShow = false" bgColor="transparent" closeOnClickOverlay>
				<view class="popup">
					<view class="popup-top">\
						<view class="public" style="border-bottom: 1px solid #EBEBEB;">
							<view class="left">
								<image src="/static/images/home/phone.png" class="icon"></image>
								陪诊客服
							</view>
							<text class="phone" @tap="call">{{ serviceMobile }}</text>
						</view>
						<view class="public">
							<view class="left">
								<image src="/static/images/home/message.png" class="icon"></image>
								在线客服
							</view>
							<view>
								<!-- #ifdef MP-WEIXIN -->
								<button @contact="wxcontact" type="default" open-type="contact">在线联系</button>
								<!-- #endif -->
								<!-- #ifdef APP-PLUS -->
								<button @tap="notOpen" type="default">在线联系</button>
								<!-- #endif -->
							</view>
						</view>
					</view>
					<view class="cancel" @tap="serviceShow = false">取消</view>
				</view>
			</u-popup>
			
			
		<view class="tabbar">
			<view v-for="(item,index) in tabs" @click="changeTabbar(index)">
				<image class="tabbar-icon" :src="index == activeIndex ? item.selectedIconPath : item.iconPath"
					mode="aspectFit"></image>
				<text :class="{'active-text':index == activeIndex}">{{item.text}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapActions
	} from "vuex";
	import staffhome from '@/pages/order/index.vue'
	import mine from './mine-detail'
	export default {
		components: {
			staffhome,
			mine
		},
		data() {
			return {
				activeIndex: 0,
				serviceMobile: '',
				serviceShow: false,
				tabs: [{
					pagePath: "/pages/order/index",
					iconPath: "/static/images/tabbar/order.png",
					selectedIconPath: "/static/images/tabbar/order_select.png",
					text: "订单"
				}, {
					pagePath: "/pages/mine/staff/mine-detail",
					iconPath: "/static/images/tabbar/mine.png",
					selectedIconPath: "/static/images/tabbar/mine_select.png",
					text: "我的"
				}],
				isearnest: false
			};
		},
		onPullDownRefresh() {
			if (this.activeIndex == 0) {
				this.$refs.order.refresher()
			} else if (this.activeIndex == 1) {
				this.$store.dispatch('getstaffInfo')
			}
		},
		onLoad(option) {
			if(option.type == 'earnest') {
				this.isearnest = true
				this.activeIndex = 1
				
			}
			this.$store.dispatch('getstaffInfo')
			// this.getStaffDetails()
			this.getConfigPhone();
		},
		methods: {
			toPay(type) {
				console.log("监听返回", type)
				if(type == 'confirm') {
					this.isearnest = true
					this.activeIndex = 1
				
				}
			},
			
			changeTabbar(index) {
				this.isearnest = false
				this.activeIndex = index;
				if(this.activeIndex == 1) {
					this.$store.dispatch('getstaffInfo')
				}
			},
			//获取就诊陪客服
			getConfigPhone() {
				this.$request('/applet/index/page/getConfig', {
					type: '4'
				}).then(res => {
					if (res.code == 200) {
						this.serviceMobile = res.data.content;
					}
				});
			},
			//拨打客服电话
			call() {
				uni.makePhoneCall({
					phoneNumber: this.serviceMobile
				});
			},
			//微信客服回调
			wxcontact(e) {
				console.log(e);
			},
			
			toOrderHall() {
				uni.navigateTo({
					url: '/pages/order/order-hall'
				});
			}
		}
	}
</script>

<style lang="scss">
	.page {
		position: relative;
	}
	.occupi {
		padding-bottom: constant(safe-area-inset-bottom);
		/*兼容 IOS<11.2*/
		padding-bottom: env(safe-area-inset-bottom);
		/*兼容 IOS>11.2*/
		height: 100rpx;
		width: 750rpx;
	}
	
	.order-hall, .service {
		position: fixed;
		bottom: 240rpx;
		right: 0;
		width: 138rpx;
		height: 138rpx;
		z-index: 99;
	}

	.tabbar {
		position: fixed;
		left: 0rpx;
		bottom: 0rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		/*兼容 IOS<11.2*/
		padding-bottom: env(safe-area-inset-bottom);
		/*兼容 IOS>11.2*/
		width: 750rpx;
		height: 98rpx;
		border-top: 1px solid #f5f5f5;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #ffffff;
		font-size: 22rpx;
		color: #061630;

		view {
			flex: 1;
			text-align: center;
			position: relative;
			z-index: 9;
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		.tabbar-icon {
			width: 44rpx;
			height: 44rpx;
		}

		.active-text {
			color: #55B5FF;
		}

		.release-button {
			position: absolute;
			top: -90rpx;
			left: 65rpx;
			background: linear-gradient(to bottom, #ec008c, #fc6767);
			border-radius: 100rpx;
			width: 120rpx;
			height: 120rpx;
			z-index: 8;
			text-align: center;
			line-height: 110rpx;
			font-size: 60rpx;
			color: #ffffff;
		}
		
		
	}
	.popup {
		padding: 30rpx;
	
		.popup-top {
			width: 100%;
			height: 261rpx;
			background: #ffffff;
			border-radius: 20rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			box-sizing: border-box;
			padding: 0 30rpx;
	
			.public {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 43rpx 0;
				box-sizing: border-box;
				font-size: 30rpx;
				font-weight: bold;
	
				.left {
					display: flex;
					justify-content: space-between;
					align-items: center;
	
					image {
						width: 44rpx;
						height: 44rpx;
						margin-right: 30rpx;
					}
	
					.phone {
						color: #55b5ff;
					}
				}
	
				button {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 178rpx;
					height: 60rpx;
					background: #ff4d4d;
					border-radius: 12rpx;
					font-size: 28rpx;
					font-weight: bold;
					color: #ffffff;
				}
			}
		}
	
		.cancel {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 96rpx;
			background: #ffffff;
			border-radius: 48rpx;
			font-size: 36rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #333333;
			margin-top: 30rpx;
		}
	}
</style>
