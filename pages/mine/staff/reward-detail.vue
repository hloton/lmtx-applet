<template>
	<view>
		<top-navigation bgColor="#ffffff">
			<template #left-slot>
				奖励明细
			</template>
		</top-navigation>
		<u-empty mode="data" v-if="notfound" text="暂无奖励" marginTop="100"></u-empty>
		<block v-for="(item,index) in rewardList" :key="index">
			<view class="box">
				<view class="box-top">
					<text style="color: #7f7f7f;">交易编号：</text>
					<text>{{item.num}}</text>
				</view>
				<view class="order">
					{{item.award_type == 1?'订单奖励':'激励奖励'}}
					<view class="money">
						<text>+</text>
						<text>￥</text>
						<text style="font-size: 46rpx;">{{item.money}}</text>
					</view>
				</view>
				<view class="type" v-if="item.award_type == 1">
					<text style="color: #888888;font-size: 26rpx;">服务类型：</text>
					<text>{{item.typeChinese}}</text>
				</view>
				<view class="number" v-if="item.award_type == 1">
					<text style="color: #888888;">订单编号：</text>{{item.order_num}}
				</view>
				<view class="time">{{item.update_time}}</view>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				rewardList: [],
				pageNum: 1,
				notfound: false,
				 hasMore: true, // 新增 hasMore 状态
				projectList: ['', '全天陪诊', '半天陪诊', '代办问诊', '取送报告',  '代办买药', '诊前挂号', '尊享陪诊','延时服务'],
			};
		},
		onReachBottom() {
			 if (this.hasMore) { // 只在还有更多数据时加载
			      this.getawardDetail()
			    }
		},
		onLoad() {
			this.getawardDetail()
		},
		methods: {
			getawardDetail() {
				if (!this.hasMore) return // 没有更多数据时停止请求
				let params = {
					staff_id: uni.getStorageSync('staffinfo'),
					pageNum: this.pageNum,
					pageSize: 10
				}
				this.$request('/applet/staff/awardDetail', params).then(res => {
					if (res.success) {
						if (res.data.length == 0 && this.pageNum == 1) {
							this.notfound = true
							this.hasMore=false
							return;
						} else {
							res.data.forEach(item => {
								item.typeChinese = this.projectList[item.type]
							})
							this.rewardList = [...this.rewardList, ...res.data]
							if (this.rewardList.length >= res.total_rows) {
								this.hasMore=false
								return;
							}
							this.pageNum++
						}
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
		background-color: #FFFFFF;
		box-shadow: 0rpx 2rpx 18rpx 0rpx rgba(0, 0, 0, 0.06);
		margin: 30rpx auto;
		border-radius: 20rpx;
		padding: 20rpx 0;

		.box-top {
			height: 98rpx;
			line-height: 98rpx;
			font-size: 28rpx;
			margin-left: 30rpx;
		}

		.empty {
			display: flex;
			justify-content: space-between;
			width: 630rpx;
			height: 2rpx;
			background-color: #eeedf0;
			margin: 0 auto;
		}

		.money {
			color: #FF4D4D;
			font-size: 26rpx;
			font-weight: bold;
		}

		.order {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin: 30rpx 0 0 30rpx;
			margin-right: 20rpx;
			font-size: 30rpx;
			font-weight: bold;
		}

		.type {
			font-size: 28rpx;
			margin: 20rpx 30rpx;
		}

		.number {
			font-size: 26rpx;
			margin: 20rpx 30rpx;
		}

		.time {
			font-size: 26rpx;
			color: #b5b5b5;
			margin: 20rpx 30rpx;
		}
	}

	.box-down {
		width: 690rpx;
		height: 260rpx;
		background-color: #FFFFFF;
		margin: 30rpx auto;
		border-radius: 20rpx;

		.box-top {
			height: 98rpx;
			line-height: 98rpx;
			font-size: 28rpx;
			margin-left: 30rpx;
		}

		.empty {
			width: 630rpx;
			height: 2rpx;
			background-color: #eeedf0;
			margin: 0 auto;
		}

		.money {
			position: absolute;
			margin: 19rpx 0 0 550rpx;
			color: #FF4D4D;
			font-size: 26rpx;
			font-weight: bold;
		}

		.order {
			margin: 30rpx 0 0 30rpx;
			font-size: 30rpx;
			font-weight: bold;
		}

		.time {
			font-size: 26rpx;
			color: #b5b5b5;
			margin: 20rpx 30rpx;
		}
	}
</style>
