<template>
	<view>
		<top-navigation bgColor="#ffffff">
			<template #left-slot>
				保证金明细
			</template>
		</top-navigation>
		<u-sticky bgColor="#fff"><u-tabs :list="navList" :scrollable="false" @change="navChange"></u-tabs></u-sticky>
		<u-empty mode="data" v-if="notfound" text="暂无明细" marginTop="100"></u-empty>
		<block v-for="(item, index) in rewardList" :key="index">
			<view class="box">
				<view class="box-top" v-if="type == '2'">
					<text style="color: #7f7f7f;">扣除方式：</text>
					<text style="color: #7f7f7f;">{{ item.status == 1 ? '平台扣除' : '提现' }}</text>
				</view>
				<view class="box-time">
					<text style="color: #7f7f7f;">{{ type == '2' ? '时间：' : '缴纳时间' }}</text>
					<text style="color: #7f7f7f;">{{ item.add_time }}</text>
				</view>
				<view class="order">
					<text v-if="type == '2'" style="color: #7f7f7f;">{{ item.status == 1 ? '扣除金额' : '提现金额' }}:：</text>
					<text v-if="type == '1'" style="color: #7f7f7f;">缴纳金额：</text>

					<text style="color: #7f7f7f;">{{type =='1' ? '+' : '-'}}￥{{ item.money }}</text>
				</view>
				<view class="money">
					<text>{{type =='1' ? '+' : '-'}}</text>
					<text>￥</text>
					<text style="font-size: 46rpx;">{{ item.money }}</text>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
export default {
	data() {
		return {
			navList: [{ name: '增加' }, { name: '扣除' }],
			rewardList: [],
			pageNum: 1,
			notfound: false,
			type: '1',
			hasMore:true,
		};
	},
	onReachBottom() {
		this.pageNum+=1;
		if(this.hasMore){
			this.getawardDetail();
		}
	},
	onLoad() {
		this.getawardDetail();
	},
	methods: {
		getawardDetail() {
			if (!this.hasMore) return // 没有更多数据时停止请求
			let params = {
				staff_id: uni.getStorageSync('staffinfo'),
				page_num: this.pageNum,
				page_size: 10,
				type: this.type
			};
			console.warn(params);
			this.$request('/applet/order/earnestApplication/earnestDetailList', params).then(res => {
				console.log('保证金明细', res);
				if (res.success) {
					if (res.data.list.length == 0 && this.pageNum == 1) {
						this.notfound = true;
						this.hasMore=false
						return;
					} else {
						// res.data.list.forEach(item => {
						// 	item.typeChinese = this.projectList[item.type]
						// })
						this.notfound = false;
						this.rewardList = [...this.rewardList, ...res.data.list];
						if (this.rewardList.length >= res.data.totalRow) {
							this.hasMore=false
							return;
						}
						
					}
				} else this.$toast(res.msg);
			});
		},
		navChange(e) {
			console.log('切换', e);
		
			this.type = e.index + 1;
			
			this.pageNum = 1;
			this.rewardList = [];
			this.getawardDetail();
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #f7f6fb;
}

.box {
	width: 690rpx;
	background-color: #ffffff;
	box-shadow: 0rpx 2rpx 18rpx 0rpx rgba(0, 0, 0, 0.06);
	margin: 30rpx auto;
	border-radius: 20rpx;
	padding: 20rpx 0;
	position: relative;
	.box-top {
		height: 98rpx;
		line-height: 98rpx;
		font-size: 28rpx;
		margin-left: 30rpx;
	}
	.box-time {
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
		position: absolute;
		right: 20rpx;
		bottom: 30%;
		color: #ff4d4d;
		font-size: 26rpx;
		font-weight: bold;
	}

	.order {
		display: flex;

		align-items: center;
		margin: 30rpx 0 0 30rpx;
		margin-right: 20rpx;
		font-size: 26rpx;
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
	background-color: #ffffff;
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
		color: #ff4d4d;
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
