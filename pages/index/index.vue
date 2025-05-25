<template>
	<view style="margin-bottom: 30rpx;">
		<!-- 这里放组件 -->
		<home v-if="activeIndex==0" ref="home"></home>
		<order v-else-if="activeIndex == 1" ref="order"></order>
		<mine v-else-if="activeIndex == 2"></mine>
		
		<view class="occupi"></view>
		<view class="tabbar">
			<view v-for="(item,index) in tabs" :key="index" @click="changeTabbar(index)">
				<image class="tabbar-icon" :src="index == activeIndex ? item.selectedIconPath : item.iconPath"></image>
				<text :class="{'active-text':index == activeIndex}">{{item.text}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import Home from "@/pages/home/index.vue"//uniapp的@默认是项目根目录
	import Order from "@/pages/order/index.vue"
	import Mine from "@/pages/mine/mine.vue"
	import { mapGetters } from 'vuex';
	import { smallName } from "@/config/config";
	export default {
		data(){
			return{
				tabs: [{
					pagePath: "/pages/home/index",
					iconPath: "/static/images/tabbar/home.png",
					selectedIconPath: "/static/images/tabbar/home_select.png",
					text: "首页"
				}, {
					pagePath: "/pages/order/index",
					iconPath: "/static/images/tabbar/order.png",
					selectedIconPath: "/static/images/tabbar/order_select.png",
					text: "订单"
				}, {
					pagePath: "/pages/mine/index",
					iconPath: "/static/images/tabbar/mine.png",
					selectedIconPath: "/static/images/tabbar/mine_select.png",
					text: "我的"
				}],
				activeIndex:0,
				loginData:{}
			}
		},
		onLoad(option){
			this.$store.commit('SET_ISLOGIN',uni.getStorageSync('userinfo')?true:false)
			this.activeIndex=option.type||0
			// #ifdef MP-WEIXIN
			wx.showShareMenu({
				menus: ['shareAppMessage', 'shareTimeline'], // 需要显示的转发按钮名称列表.合法值包含 "shareAppMessage"、"shareTimeline"
				success(res) {
					console.log(res);
				},
				fail(e) {
					console.log(e);
				}
			});
			// #endif
		},
		onShow() {
			this.$store.commit('SET_ININT_ORDER',{})//初始化创建订单数据
		},
		computed:{
			...mapGetters(['staffid'])//将store中名为staffid的getter映射到计算属性
			
		},
		components:{
			//注册组件
			Home,
			Order,
			Mine
		},
		onPullDownRefresh() {//下拉刷新
			if (this.activeIndex == 1) {
				this.$refs.order.refresher()
			} else {
				uni.stopPullDownRefresh()
			}
		},
		methods:{
			changeTabbar(index){
				this.activeIndex=index
			},
			test(){
					
				uni.$showModal({
					title:'提升',
					content:'请您确认已完成阅读用户协议和隐私政策'
				})
				.then(() => {
					console.log('成功');
				})
				.catch(() => {
					console.log('失败');
				});
			},
			//获取手机号信息
			async getPhone(e){
				console.log("绑定手机号", e)
				wx.checkSession()
				this.loginData=await wx.login()
				let code=await wx.getUserProfile()
				let params={
					encrypted:e.detail.encryptedData,
					iv:e.detail.iv,
					code:code
				}
				console.log(params)
				const res = await this.$request('/applet/index/login/getPhone', params)
				console.log("获取手机号", res, params)
				if (res.success) {
					this.userTemp.ext1 = res.data
					const res = await this.$request('/applet/index/login/login', params)
				} else {
					this.$toast(res.msg)
					return
				}
			}
		},
		// #ifdef MP-WEIXIN
		onShareTimeline() {
			return {
				title: `邀请您使用${smallName}小程序`, // 分享出的卡片标题
				path: 'pages/index/index' // 他人通过卡片进入小程序的路径，可以在后面拼接URL的形式带参数
			};
		},
		onShareAppMessage() {
			return {
				title: `邀请您使用${smallName}小程序`, // 分享出的卡片标题
				path: 'pages/index/index' // 他人通过卡片进入小程序的路径，可以在后面拼接URL的形式带参数
			};
		},
		// #endif
	}
</script>

<style lang="scss">
	notice-box {
		position: fixed;
		bottom: 100rpx;
		width: 750rpx;
		height: 70rpx;
		background: rgba(253, 239, 216, 1);
		padding: 0 35rpx;
	
		.notice-detail {
			font-size: 24rpx;
	
			font-weight: 400;
			color: rgba(204, 149, 59, 1);
		}
	
		.bindPhone {
			width: 135rpx;
			line-height: 52rpx;
			background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
			border-radius: 26rpx;
			padding: 0;
			font-size: 26rpx;
	
			font-weight: 500;
			color: rgba(255, 255, 255, 1);
		}
	}
		.occupi {
			padding-bottom: constant(safe-area-inset-bottom);
			/*兼容 IOS<11.2*/
			padding-bottom: env(safe-area-inset-bottom);
			/*兼容 IOS>11.2*/
			height: 100rpx;
			width: 750rpx;
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
</style>
