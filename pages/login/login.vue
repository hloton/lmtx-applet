<template>
	<view class="box">
		<top-navigation>
			<template>
				注册
			</template>
		</top-navigation>
		<view class="logo-box"><image class="logo" src="@/static/images/logo.png"></image></view>
			<!-- #ifdef MP-WEIXIN -->
			<view class="title_box">
			<view class="title">乐木同行</view>
			<view class="tips">三甲医院一站式陪诊服务平台</view>
			</view>
			<button class="u-reset-button" open-type="getPhoneNumber" @getphonenumber="getPhone"><view class="login-button">立即登录</view></button>
			<!-- <view class="login-button" v-if="loginProcess == 3" @tap="wxLogin">旧的 立 即 登 录</view> -->
			<!-- #endif -->
			
			<!-- 非微信就短信验证（阿里云短信平台（没搞懂 -->
			<!-- #ifndef MP-WEIXIN -->
			<view class="inputbox">
				<view class="inputson">
					<image class="inputson-mr" src="@/static/images/login/phone.png" />
					<input type="text" placeholder="输入手机号" placeholder-calss="placeholder-style" maxlength="11" v-model="phone" />
				</view>
				<view class="inputson">
					<image class="inputson-mr" src="@/static/images/login/code.png" />
					<input type="text" placeholder="输入验证码" placeholder-calss="placeholder-style" maxlength="8" v-model="code" />
					<view class="code" @tap="getCode">{{ countDown ? `${countDown}秒后获取` : '获取验证码' }}</view>
				</view>
			</view>
			<button class="u-reset-button" @tap="appLogin"><view class="login-button">立 即 登 录</view></button>
			<!-- #endif -->
			
			
			
			<!-- 用户同意协议 -->
			<view class="user-agreement">
				<radio value="r1" :checked="markread" @tap="markread = !markread" style="transform:scale(0.6)" />
				我已阅读并同意
				<text @tap="$navto('/pages/mine/privacy/privacy?type=2')">《用户协议》</text>
				和
				<text @tap="$navto('/pages/mine/privacy/privacy?type=1')">《隐私政策》</text>
			</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				markread:true,//是否同意协议
				//小程序使用
				userTemp:{},//微信用户信息
				loginData:{},//登录信息
				loginProcess:1,//1获取用户信息 2获取用户手机号 3登录
				lock:false,//避免重复获取微信信息
				
				// APP使用
				countDown: 0, // 验证码倒计时
				phone: '', // 手机号
				code: '' //验证码
				// APP使用结束
				
			};
		},
		methods:{
			//获取用户信息和登录code
			getUser(){
				if(this.lock) return
				this.lock= true;
				//通过微信获取用户信息
				uni.getUserProfile({
					lang: 'zh_CN',
					desc: '用于用户登录',
					success: res => {
						console.log('授权', res);
						this.userTemp = res.userInfo;//用户信息放到usertemp里
						uni.login({
							provider: 'weixin',
							success: loginRes => {
								console.log('微信授权1', loginRes);
								this.loginData = loginRes;
								// this.lock = false;
								// this.loginProcess = 2;
								this.wxLogin();
							},
							fail: () => {
								// this.lock = false;
							}
						});
					},
					fail: error => {
						// this.lock = false;
					}
			})
			// const temp = await wx.getUserProfile({
			// 	lang: 'zh_CN',
			// 	desc: '用于用户登录'
			// });
			// this.userTemp = temp.userInfo;
			// this.loginData = await wx.login();
			// this.lock = false;
			// this.loginProcess = 2;
			},
			
			//获取手机号信息
			async getPhone(e){
				console.log(e,"手机号信息")
			if (!e.detail.encryptedData) {
				console.log("退出")
				return
			}
			console.log('接下来wxlogin')
				this.loginData=await wx.login()
				console.log('微信的wx.login',this.loginData)
				
				if(this.lock)return
				this.lock=true
				
				let params={
					code:this.loginData.code,
					encrypted:e.detail.encryptedData,
					iv:e.detail.iv
				}
				
			const res = await this.$request('/applet/index/login/getPhone', params);
			if(res.success){
				this.phone=res.data
				uni.showModal({
					title: '授权',
					content: '是否授权',
					success: tapRes => {
						if (tapRes.confirm) {
							this.getUser();
						}
						if (tapRes.cancel) {
							this.$toast('取消登录');
						}
					}
				})
			}else{
				this.$toast(res.msg);
				// this.lock = false
				return;
			}
			this.lock = false//获取完微信信息就false
			this.loginProcess = 3//登录
			// 自动登录
			this.wxLogin()
			},
			//微信登录
			async wxLogin(){
				if (this.lock) return;
				this.lock = true;
				if(!this.markread){
					uni.$showModal({
						title: '提示',
						content: '请您确认已完成阅读用户协议和隐私政策',
						showCancel: false
					});
					this.lock = false;
					return;
				}
				this.loginData = await wx.login();
				let params={
					code:this.loginData.code,
					nickname: this.userTemp.nickName,
					sex: this.userTemp.gender,
					photo: this.userTemp.avatarUrl,
					ext1: this.phone
				}
				const res = await this.$request('/applet/index/login/login', params);
				if(res.success){
					if(res.data.status===1){
						uni.setStorageSync('userinfo',res.data)
						this.$toast('登录成功!').then(() => {
							uni.reLaunch({
								url: '/pages/index/index'//登录成功来到首页
							});
						});
					}
					else{
						this.$toast('您的账号已被封禁!');
					}
				}
				else{
					his.$toast(res.msg);
				}
			},
			//APP的
			// 获取验证码
			async getCode() {
				if (this.countDown) return;
				if (this.$check.checkPhoneNumber(this.phone, '手机号', true)) return;
				const params = {
					phone: this.phone
				};
				const res = await this.$request('/applet/index/login/getCode', params);
				if (res.success) {
					this.$toast('短信发送成功!');
					this.gocountdown();
				} else this.$toast(res.msg);
			},
			//倒计时
			gocountdown() {
				if (this.countDown) return;
				// 倒计时
				this.countDown = 59;
				let timer = setInterval(() => {
					this.countDown--;
					if (this.countDown <= 0) {
						clearInterval(timer);
						timer = null;
					}
				}, 1000);
			},
			// APP登录（先不理
			async appLogin() {
				if (!this.markread) {
					uni.$showModal({
						title: '提示',
						content: '请您确认已完成阅读用户协议和隐私政策',
						showCancel: false
					});
					return;
				}
				if (this.$check.checkPhoneNumber(this.phone, '手机号', true)) return;
				if (this.$check.checkNull(this.code, '验证码', true)) return;
				const params = {
					phone: this.phone,
					code: this.code
				};
				const res = await this.$request('/applet/index/login/codeLogin', params);
				if (res.success) {
					console.log('登录成功', res);
					if (res.data.status === 1) {
						uni.setStorageSync('userinfo', res.data);
						this.$toast('登录成功!').then(() => {
							uni.reLaunch({
								url: '/pages/index/index'
							});
						});
					} else {
						this.$toast('您的账号已被封禁!');
					}
				} else this.$toast(res.msg);
			}
		}
	}
</script>

<style lang="scss">
	.box{
		    background-color: #0065ff;
		    min-height: 100vh;    /* 确保占满整个屏幕高度 */
		    width: 100%;          /* 确保宽度占满 */
		
	}
.logo-box {
	height: 600rpx;
	width: 750rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 50rpx;
	.logo {
		width: 550rpx;
		height: 500rpx;
		margin-top: 150rpx;
		border-radius: 10rpx;
	}
}
.title_box{
	width:100%;
	height: 200rpx;
	margin: 0rpx auto;
	color: #ffffff;
	text-align: center;
	.title{
		font-size: 70rpx;
		font-weight: 600;
		line-height: 88rpx;
		margin-bottom: 24rpx;
	}
	.tips {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 44rpx;
		opacity: 0.8;
	}
}


.login-button {
	width: 610rpx;
	height: 96rpx;
	line-height: 96rpx;
	text-align: center;
	background: #ffffff;
	font-size: 30rpx;
	color: #0065ff;
	border-radius: 20rpx;
	margin: 50rpx auto 0rpx auto;
	font-weight: bold;
}

.user-agreement {
	margin-top: 40rpx;
	        display: flex;
	        justify-content: center;
	        align-items: center;
	        font-size: 24rpx;
	        color: rgba(255,255,255,0.8);
	        
	        text {
	            color: rgba(255,255,255,0.9);
	        }

	/deep/ .uni-radio-input {
		&.uni-radio-input-checked {
			background-color: $uni-color-primary !important;
		}
	}

	radio .wx-radio-input.wx-radio-input-checked {
		border-color: $uni-color-primary !important;

		background: $uni-color-primary !important;
	}
}

.inputbox {
	margin: 30rpx 72rpx 0 72rpx;
	display: flex;
	flex-direction: column;
	align-items: center;

	.inputson {
		width: 606rpx;
		height: 90rpx;
		margin-top: 40rpx;
		padding-bottom: 26rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #e6e6e6;
		box-sizing: border-box;

		image {
			width: 48rpx;
			height: 48rpx;
		}

		.inputson-mr {
			margin-right: 20rpx;
		}

		input {
			flex: 1;
			width: 100%;
			height: 48rpx;
		}

		.code {
			width: 130rpx;
			text-align: center;
			padding: 10rpx 20rpx;
			background: rgba(255, 255, 255, 0.39);
			border: 2rpx solid $uni-color-primary;
			border-radius: 8rpx;
			font-size: 22rpx;
			font-weight: 400;

			color: transparent;
			background: $uni-color-primary;
			background-clip: text;
		}
	}
}
</style>
