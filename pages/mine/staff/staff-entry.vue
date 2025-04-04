<template>
	<view>
		<top-navigation bgColor="#ffffff">
			<template #left-slot>
				陪诊师入口
			</template>
		</top-navigation>
		<view class="box">
			<view class="box-top">
				<view class="account">陪诊师账号</view>
				<view>
					<input placeholder="请输入陪诊师账号" v-model="account" style="flex: 1;" />
				</view>
			</view>
			<view class="empty"></view>
			<view class="box-top">
				<view class="account">密码</view>
				<view>
					<input type="password" placeholder="请输入陪诊师密码" v-model="password" style="flex: 1;" />
				</view>
			</view>
		</view>
		<u-alert v-if="isAudit == '1'" :show-icon="true" type = "warning" description = "默认陪诊师账号是你的手机号码" :closable="true"></u-alert>
		<view class="enter" @tap="login">进入</view>
		<view class="apply" v-if="isAudit == '0'" >审核中</view>
		<view class="error" v-else-if="isAudit == '2'" @tap="apply">查看原因</view>
		<view class="apply" v-if="isShowApply" @tap="apply">申请成为陪诊师</view>
		<u-notify message="审核未通过,请修改资料" :show="applyShow"></u-notify>
		<u-notify ref="uNotify" message=""></u-notify>
	</view>
</template>

<script>
	import {mapGetters} from "vuex";
	export default {
		data() {
			return {
				account:'',
				password:'',
				lock:false,
				isAudit:'',
				isShowApply:false,
				applyShow:false,
				failCause:''
			};
		},
		computed:{
			...mapGetters(['staffid'])
		},
		onShow() {
			this.servePersonnelDetails()
		},
		methods:{
			//登录
			login(){
				if (this.lock) return
				if (!this.account) return this.$toast('请输入账号')
				if (!this.password) return this.$toast('请输入密码')
				this.lock = true;
				let params = {
					account_num: this.account,
					password: this.password
				}
				this.$request('/applet/staff/login', params).then(res => {
					if (res.success) {
						uni.setStorageSync('staffinfo', res.data)
						this.$toast('登录成功').then(() => {
							uni.reLaunch({
								url: '/pages/mine/staff/staff'
							});
						})
					} else this.$toast(res.msg)
				})
				this.lock = false;
			},
			//申请成为陪诊师
			apply(type){
				//申请成为陪诊师
				uni.navigateTo({
					url: '/pages/mine/staff/staff-apply?type=' + this.isAudit +'&failCause=' + this.failCause
				});
			},
			//获取申请后
			servePersonnelDetails(){
				this.$request('/applet/staff/servePersonnelDetails', {
					member_id: uni.getStorageSync('userinfo').id,
					}).then(res => {
					console.log("获取申请后", res, uni.getStorageSync('userinfo').id)
					if(res.success) {
						if(res.data) {
								this.isAudit = res.data.is_audit
									this.$store.dispatch('setStaffId', res.data.staff_id)
								if(this.isAudit == '1') {
									this.$refs.uNotify.show({
									    top: '-1',
									    type: 'success',
									    color: '#ffffff',
									    bgColor: '#00aaff',
									    message: '您已成为陪诊师，请直接登录',
									    duration: 1000 * 3,
									    fontSize: 16,
									    safeAreaInsetTop:true
									})
								}
								if(this.isAudit == '2') {
									this.failCause = res.data.fail_cause
									this.$refs.uNotify.show({
									    top: '-1',
									    type: 'error',
									    color: '#ffffff',
									    bgColor: '#ff0000',
									    message: '审核未通过，请重新申请',
									    duration: 1000 * 3,
									    fontSize: 16,
									    safeAreaInsetTop:true
									})
								}
						}else{
							this.isShowApply = true
						}
					
					}
				})
			}
		}
	}
</script>

<style lang="scss">
page {
		background-color: #f7f6fb;
	}
	
	.box {
		width: 690rpx;
		height: 225rpx;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		margin: 30rpx auto;
		box-shadow: 0rpx 2rpx 18rpx 0rpx rgba(0, 0, 0, 0.06);
	
		.box-top {
			width: 100%;
			height: 112rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			// justify-content: center;
			text-align: right;
	
			.account {
				margin-left: 30rpx;
				font-weight: bold;
				color: #434343;
				font-size: 32rpx;
				white-space: nowrap;
			}
	
			input {
				// text-align: end;
				margin-right: 30rpx;
			}
		}
	}
	
	.empty {
		width: 630rpx;
		height: 1rpx;
		background-color: #eeedf0;
		margin: 0 auto;
	}
	
	.enter, .apply {
		width: 690rpx;
		height: 96rpx;
		background-color: #55B5FF;
		border-radius: 48rpx;
		text-align: center;
		line-height: 96rpx;
		color: #fefeff;
		font-size: 36rpx;
		
	}
	.enter {
		margin: 0 auto;
		margin-top: 120rpx;
	}
	.error {
		margin: 0 auto;
		margin-top: 80rpx;
		width: 690rpx;
		height: 96rpx;
		background-color: #ff0000;
		border-radius: 48rpx;
		text-align: center;
		line-height: 96rpx;
		color: #fefeff;
		font-size: 36rpx;
	}
	
	
	.apply {
		margin: 0 auto;
		margin-top: 80rpx;
	}
</style>
