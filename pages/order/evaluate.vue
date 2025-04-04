<template>
	<view class="evaluate-page">
		<top-navigation bgColor="#ffffff">
			<template #left-slot>
				评价
			</template>
		</top-navigation>
		<view class="evaluate-box">
			<view class="evaluate-content">
				<view class="list-row">
					<view class="exp">服务打分：</view>
					<view class="right-row">
						<u-rate :count="count" v-model="serve_value" active-color="#FF4D4D"></u-rate>
					</view>
				</view>
				<view class="list-row">
					<view class="exp">服务评价：</view>
					<view class="right-row">
						<u--input placeholder="请输入服务的评价" border="none" v-model="serve_evaluate" inputAlign="right" maxlength="100"></u--input>
					</view>
				</view>
				<view class="list-row">
					<view class="exp">服务人员打分：</view>
					<view class="right-row">
						<u-rate :count="count" v-model="waiter_value" active-color="#FF4D4D"></u-rate>
					</view>
				</view>
				<view class="list-row">
					<view class="exp">服务人员评价：</view>
					<view class="right-row">
						<u--input placeholder="请输入服务人员的评价" border="none" v-model="waiter_evaluate" inputAlign="right" maxlength="100"></u--input>
					</view>
				</view>
			</view>
			<view class="bottom-btn" @click="submitEvalute">提交评价</view>
		</view>
	</view>
</template>

<script>
	let requestBol = false;
	export default {
		data() {
			return {
				count: 5,
				serve_value: 0,
				waiter_value:0,
				serve_evaluate:'',
				waiter_evaluate:'',
				orderId:''
			}
		},
		onLoad(option) {
			this.orderId = option.id;
			this.from = option.from
		},
		methods: {
			submitEvalute() {
				if(!this.serve_value) return uni.$toast('请选择服务星级');
				if(!this.serve_evaluate) return uni.$toast('请输入服务评价');
				if(!this.waiter_value) return uni.$toast('请选择服务人员星级');
				if(!this.waiter_evaluate) return uni.$toast('请输入服务人员评价');
				if(requestBol) {
					return uni.$toast('正在请求中');
				}
				requestBol = true;
				this.$request('/applet/my/evaluateOrder',{
					id:this.orderId,
					service_grade:this.serve_value,
					service_evaluate:this.serve_evaluate,
					staff_grade:this.waiter_value,
					staff_evaluate:this.waiter_evaluate
				}).then(res => {
					requestBol = true;
					if(res.code == 200) {
						uni.$toast('评价成功');
						setTimeout(() => {
							if(this.from == 'order'){
								uni.reLaunch({
								    url: '/pages/index/index?type=1'
								});
							}else {
								uni.navigateBack()
							}
						},1000)
					}else {
						uni.$toast(res.msg);
					}
				})
			}
		},
	}
</script>

<style scoped lang="scss">
	.evaluate-page {
		width: 100vw;
		height: 100vh;
		background-color: #F6F7FB;
		box-sizing: border-box;
	}

	.evaluate-box {
		padding: 30rpx;
	}

	.evaluate-content {
		width: 690rpx;
		height: 412rpx;
		background: #FFFFFF;
		box-shadow: 0px 2rpx 18rpx 0px rgba(0, 0, 0, 0.06);
		border-radius: 20rpx;
		padding: 30rpx 30rpx;
		box-sizing: border-box;
	}

	.list-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 90rpx;

		.exp {
			font-size: 30rpx;
			font-weight: 500;
			color: #333333;
			white-space: nowrap;
		}
	}
	.bottom-btn {
		margin-top: 150rpx;
		width: 690rpx;
		height: 96rpx;
		background: #55B5FF;
		box-shadow: 0rpx 2rpx 18rpx 0rpx rgba(0, 0, 0, 0.06);
		border-radius: 48rpx;
		text-align: center;
		font-size: 36rpx;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 94rpx;
	}
</style>
