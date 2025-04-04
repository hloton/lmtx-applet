<template>
	<view>
	<top-navigation bgColor="#ffffff">
		<template #left-slot>
			{{isedit?'修改':'添加'}}邮寄地址
		</template>
	</top-navigation>
		<view class="box">
			<view class="box-top">
				<input placeholder="请输入收件人姓名" v-model="name"  maxlength="10"/>
			</view>
			<view class="empty"></view>
			<view class="box-top">
				<input placeholder="请输入收件人手机号码" v-model="mobile"  maxlength="11"/>
			</view>
			<view class="empty"></view>
			<view class="box-top">
				<input placeholder="请输入收件人地址" v-model="address" />
			</view>
		</view>
		<view class="enter" @tap="save">保存</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isedit:false,
				name:'',//姓名
				mobile:'',//手机号
				address:'',//收货地址
				lock:false//防止多次提交
			};
		},
		onLoad(e){
			this.isedit=e.isedit
			this.name=uni.getStorageSync('editAddress').addressee
			this.moblie=uni.getStorageSync('editAddress').phone
			this.address=uni.getStorageSync('editAddress').address
		},
		onUnload(){
			uni.removeStorageSync('editAddress');
			
		},
		methods:{
			save(){
				if(this.lock)return
				//数据验证
				if (this.$check.checkRealName(this.name, '收件人姓名', true)) return;
				if (this.$check.checkPhoneNumber(this.mobile, '收件人手机号', true)) return;
				if (!this.address) return uni.$toast('请输入收件人地址');
				this.lock = true
				let params = {
					member_id: uni.getStorageSync('userinfo').id,
					addressee: this.name,
					phone: this.mobile,
					address: this.address
				}
				let url = ''
				if (this.isedit) {
					url = '/applet/my/editAddress'
					params.id = uni.getStorageSync('editAddress').id
				} else {
					url = '/applet/my/addAddress'
					params.member_id = uni.getStorageSync('userinfo').id
				}
				this.$request(url, params).then(res => {
					if (res.success) {
						this.$toast(`${this.isedit?'修改':'添加'}成功`).then(() => {
							uni.navigateBack({})
						})
					} else this.$toast(res.msg)
					this.lock = false
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

			input {
				margin-left: 36rpx;
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
