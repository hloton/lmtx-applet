<template>
	<view>
		<top-navigation bgColor="#ffffff">
			<template #left-slot>
				修改员工密码
			</template>
		</top-navigation>
		<view class="box">
			<view class="box-top">
				<view class="account">密码</view>
				<input type="password" placeholder="请输入原密码"  v-model="oldpsw"/>
			</view>
			<view class="empty"></view>
			<view class="box-top">
				<view class="account">新密码</view>
				<input type="password" placeholder="请输入新密码"  v-model="newpsw"/>
			</view>
			<view class="empty"></view>
			<view class="box-top">
				<view class="account">确认密码</view>
				<input type="password" placeholder="请二次输入密码"  v-model="confirmpsw"/>
			</view>
		</view>
		<view class="enter" @tap="edit">保存</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				oldpsw:'',
				newpsw:'',
				confirmpsw:''
			};
		},
		methods:{
			edit(){
				if (!this.oldpsw) return this.$toast('请输入原密码')
				if (!this.newpsw) return this.$toast('请输入原密码')
				if (!this.confirmpsw) return this.$toast('请输入原密码')
				if (this.newpsw !== this.confirmpsw) return this.$toast('两次密码输入不同')
				let params = {
					password: this.oldpsw,
					new_password: this.newpsw,
					confirm_password: this.confirmpsw,
					id: uni.getStorageSync('staffinfo')
				}
				this.$request('/applet/staff/updatePassWord', params).then(res => {
					if (res.success) {
						this.$toast('修改成功!').then(() => {
							uni.navigateBack({})
						})
					} else this.$toast(res.msg)
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
		height: 338rpx;
		background-color: white;
		border-radius: 20rpx;
		margin: 30rpx auto;
		box-shadow: 0rpx 2rpx 18rpx 0rpx rgba(0, 0, 0, 0.06);
		
		.box-top {
			width: 100%;
			height: 110rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			text-align: right;
			.account {
				margin-left: 30rpx;
				font-size: 30rpx;
				font-weight: bold;
				color: #4b4b4b;
				white-space: nowrap;
			}

			input {
				margin-right: 30rpx;
			}
		}
	}

	.empty {
		width: 630rpx;
		height: 2rpx;
		background-color: #eeedf0;
		margin: 0 auto;
	}

	.enter {
		width: 690rpx;
		height: 96rpx;
		background-color: #55B5FF;
		border-radius: 50rpx;
		text-align: center;
		line-height: 96rpx;
		color: #FFFFFF;
		font-size: 36rpx;
		margin: 152rpx auto;
	}
</style>
