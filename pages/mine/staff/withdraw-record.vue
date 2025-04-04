<template>
	<view>
		<top-navigation bgColor="#ffffff">
			<template #left-slot>
				提现记录
			</template>
		</top-navigation>
		<u-sticky bgColor="#fff"><u-tabs :list="navList" :scrollable="false" @change="navChange"></u-tabs></u-sticky>
		<block v-if="type =='1'" v-for="(item,index) in record" :key="index">
			<view class="box">
				<view class="box-top">
					<text v-if="item.status == '0'" style="color: #7f7f7f;">提现中</text>
					<text v-if="item.status == '1'" style="color: #55B5FF;">已到账</text>
					
				</view>
				<view class="empty"></view>
				<view class="record">提现记录</view>
				<view class="sum">交易编号：
					<text>{{ item.order_num }}</text></view>
				<view class="sum">提现金额： <text class="money">￥{{item.money}}</text></view>
				<view class="time u-p-b-30">{{item.add_time}}</view>
			</view>
		</block>
		<block v-if="type =='2'" v-for="(item,index) in record" :key="index">
			<view class="box">
				<view class="box-top">
					<text v-if="item.application_status == '0'" style="color: #7f7f7f;">审核中</text>
					<text v-if="item.application_status == '1'" style="color: #55B5FF;">申请成功</text>
					<view class="" v-if="item.application_status == '2'">
						<text style="color: #FF4D4D;">申请失败，拒绝理由如下：</text>
						<view class="">
							<text style="color: #7f7f7f;">{{ item.application_is_cause }}</text>
						</view>
						
					</view>
				</view>
				<view class="empty"></view>
				<view class="record">提现记录</view>
				<view class="sum">交易编号：
					<text>{{ item.application_order_num }}</text></view>
				<view class="sum">提现金额： <text class="money">￥{{item.application_money}}</text></view>
				<view class="time u-p-b-30">{{item.application_add_time}}</view>
			</view>
		</block>
		<u-empty mode="data" text="暂无记录" :show="notfound" marginTop="100"></u-empty>
		<u-loadmore :status="status" v-if="notdata" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navList: [{ name: '微信' }, { name: '银行卡' }],
				record: [],
				notfound: false, //无数据
				notdata: false, //没有更多数据了
				status: 'loadmore',
				pageNum: '1',
				pageSize: '10',
				type: '1'
			};
		},
		onLoad() {
			this.getrecord()
		},
		onReachBottom() {
			this.getrecord()
		},
		methods: {
			navChange(e) {
				console.log('切换', e);
				this.record = [];
				this.type = e.index + 1;
				this.pageNum = 1;
				this.notfound = false;
				this.notdata = false;
				this.getrecord(this.type);
			},
			getrecord() {
				// this.record = []
				if (this.notdata) return
				this.status = 'loadmore'
				let params = {
					id: uni.getStorageSync('staffinfo'),
					page_num: this.pageNum,
					page_size: this.pageSize,
					type: this.type.toString()
				}
				console.log(JSON.stringify(params))
				this.$request('/applet/staff/queryWithdrawal', params).then(res => {
					console.log("获取记录", res)
					if (res.success) {
						if (res.data.list == 0 && this.pageNum == 1) {
							this.notfound = true
							return;
						} else {
							this.record = [...this.record, ...res.data.list]
							if (this.record.length >= res.data.totalRow) {
								this.notdata = true
								this.status = 'nomore'
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
		// height: 317rpx;
		background-color: #ffffff;
		box-shadow: 0rpx 2rpx 18rpx 0rpx rgba(0, 0, 0, 0.06);
		margin: 30rpx auto;
		border-radius: 20rpx;

		.box-top {
			// height: 98rpx;
			line-height: 88rpx;
			margin-left: 30rpx;
			font-size: 28rpx;
		}

		.empty {
			width: 630rpx;
			height: 2rpx;
			background-color: #eeedf0;
			margin: 0 auto;
		}

		.record {
			font-weight: bold;
			font-size: 32rpx;
			color: #3f3f3f;
			margin: 30rpx 0 0 30rpx;
		}

		.sum {
			margin: 20rpx 0 0 30rpx;
			font-size: 28rpx;
			color: #8a8a8a;

			.money {
				color: #ff0b17;
			}
		}

		.time {
			font-size: 26rpx;
			margin: 20rpx 0 0 30rpx;
			color: #c0c0c0;
		}
	}
</style>
