<template>
	<view class="page">
		<top-navigation bgColor="#ffffff" :isBack="false">
			<template #left-slot>
				我的
			</template>
		</top-navigation>
		<view class="bg" v-if="islogin">
			<image src="/static/images/home/bg.png"></image>
			<image class="photo" src="/static/images/mine/default.png"></image>
			<text>{{userinfo.nickname}}</text>
		</view>
		<view class="bg" v-else>
			<image src="/static/images/home/bg.png"></image>
			<image class="photo" src="/static/images/mine/avater.png"></image>
			<text @tap="$navto('/pages/login/login')">点击登录</text>
		</view>
		<view class="box">
			<view class="box-left" @tap="$navto('/pages/mine/patient/select-patient',true)">
				<image src="/static/images/mine/people.png"></image>
				<text>就诊人管理</text>
			</view>
			<view class="box-left" @tap="$navto('/pages/mine/address/address',true)">
				<image src="/static/images/mine/address.png"></image>
				<text>地址管理</text>
			</view>
			<view class="box-left" style="margin-top: 30rpx;" @tap="$navto('/pages/mine/privacy/privacy?type=1',true)">
				<image src="/static/images/mine/tcp.png"></image>
				<text>隐私协议</text>
			</view>
			<view class="box-left" style="margin-top: 30rpx;" @tap="$navto('/pages/mine/privacy/privacy?type=2',true)">
				<image src="/static/images/mine/service.png"></image>
				<text>服务条款</text>
			</view>
			<view class="box-left" style="margin-top: 30rpx;" @tap="$navto('/pages/mine/staff/staff-entry',true)">
				<image src="/static/images/mine/entry.png"></image>
				<text>陪诊师入口</text>
			</view>
			<view class="box-left" style="margin-top: 30rpx;" @tap="logout">
				<image src="/static/images/mine/exit.png"></image>
				<text>退出登录</text>
			</view>
		</view>
		<view class="copyright" v-if="companyName">
			©技术支持：{{companyName}}
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from "vuex";
	import {
		companyName
	} from '@/config/config.js'
	export default {
		data() {
			return {
				userinfo: {}, //用户信息
				companyName: companyName, //公司名称
			};
		},
		computed: {
			...mapGetters(['islogin']),
		},
		mounted() {
			this.userinfo = uni.getStorageSync('userinfo')
		},
		methods: {
			logout() {
				if (!uni.getStorageSync('userinfo').id) return
				uni.$showModal({
						title: '提示',
						content: '确定要退出登录吗?'
					})
					.then(() => {
						uni.clearStorage()
						this.$store.commit('SET_ISLOGIN', false)
						this.$navto('/pages/login/login')
					})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.copyright {
		font-size: 28rpx;
		color: #333333;
		margin: 40rpx 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	page {
		background-color: #f7f6f9;
	}

	.bg {
		position: relative;

		image {
			width: 750rpx;
			height: 366rpx;
		}

		.photo {
			display: flex;
			position: absolute;
			z-index: 1;
			width: 110rpx;
			height: 110rpx;
			margin: -288rpx 0 0 30rpx;
			border-radius: 50%;
		}

		text {
			display: flex;
			position: absolute;
			z-index: 2;
			margin: -258rpx 0 0 160rpx;
			color: #ffffff;
		}
	}

	.box {
		position: relative;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		margin: -110rpx 0 0 0;
		padding: 0rpx 30rpx;

		.box-left {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 332rpx;
			height: 250rpx;
			background: #FFFFFF;
			box-shadow: 0rpx 2rpx 18rpx 0rpx rgba(0, 0, 0, 0.06);
			border-radius: 20rpx;

			image {
				width: 58rpx;
				height: 58rpx;
			}

			text {
				margin-top: 39rpx;
			}
		}

	}
</style>
