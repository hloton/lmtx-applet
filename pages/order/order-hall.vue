<template>
	<view class="page">
		<top-navigation bgColor="#ffffff" :isBack="true" :isFix="true">
			<template #left-slot>
				接单大厅
			</template>
		</top-navigation>

		<view class="content">
			<view class="order-item u-m-b-30" v-for="(item, index) in orderList" :key="index">
				<view class="u-flex u-row-between">
					<view class="order-item__title_l u-text-left">医院名称:</view>
					<view class="order-item__title_r u-text-right">{{ item.hospital_name }}</view>
				</view>
				<view class="u-flex u-row-between u-p-t-45">
					<view class="order-item__time_l u-text-left">就诊时间:</view>
					<view class="order-item__time_r u-text-right">{{ item.hope_time }}</view>
				</view>
				<view class="u-flex u-row-between u-p-t-45 u-p-b-25">
					<view class="order-item__people_l u-text-left">就诊人:</view>
					<view class="order-item_people_r u-text-right">{{ item.patients_name }} {{ item.ext3 }}岁</view>
				</view>
				<u-line></u-line>
				<view class="u-flex u-p-t-20 u-row-right">
					<view class="info-btn u-flex u-col-center u-row-center" @click="toDetail(item.id)">查看详情</view>
					<view class="order-btn u-flex u-col-center u-row-center u-m-l-20" @click="orderReceiving(item.id)">接单</view>
				</view>
			</view>
		</view>
		<u-empty mode="data" text="暂无订单" :show="notfound" marginTop="100"></u-empty>
		<u-loadmore :status="status" v-if="notdata" />
		<u-modal
			:show="earnestShow"
			title="提示"
			content="陪诊师要先缴纳保证金，才可以抢单哦~"
			confirmText="去缴纳"
			cancelText="取消"
			showCancelButton
			confirmColor="#55B5FF"
			@cancel="earnestShow = false"
			@confirm="confirm"
		></u-modal>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			pageNum: 1,
			pageSize: 10,
			orderList: [],
			type: 'staff',
			notfound: false,
			notdata: false,
			status: 'loadmore',
			earnestShow: false
		};
	},
	computed: {
		...mapGetters(['curAddress', 'staffinfo'])
	},
	mounted() {
		// if (!this.curAddress.cityCode) {
		// 	this.$navto('/pages/home/region');
		// 	return false;
		// }
		this.getOrderList();
	},
	onLoad() {
		// this.getOrderList()
	},
	onReachBottom() {
		this.pageNum += 1;
		this.getOrderList();
	},
	methods: {
		getOrderList() {
			this.$request('/applet/index/order/queryStaffOrderList', {
				page_num: this.pageNum,
				page_size: this.pageSize,
				staff_id: this.staffinfo.staff.staff_id,
				city_code: this.staffinfo.staff.city_code
			}).then(res => {
				if (res.success) {
					if ((res.data.list == 0 && this.pageNum == 1)||res.data.list==null) {
						this.notfound = true;
						return;
					} else {
						this.orderList = [...this.orderList, ...res.data.list];
						if (this.orderList.length >= res.data.totalRow) {
							this.notdata = true;
							this.status = 'nomore';
							return;
						}
					}
				}
			});
		},
		orderReceiving(id) {
			if (this.staffinfo.staff.is_earnest == 0) {
				this.earnestShow = true;
				return;
			}
			let param = {
				id: id,
				staff_id: this.staffinfo.staff.staff_id
			};
			console.warn('接单', param);
			this.$request('/applet/index/order/orderReceiving', param, '接单中...').then(res => {
				if (res.success) {
					this.$toast('已接单');
					this.orderList = [];
					this.getOrderList();
				}

			});
		},
		confirm() {
			this.$navto('/pages/mine/staff/staff?type=' + 'earnest');
		},
		toDetail(id) {
			if (this.staffinfo.staff.is_earnest == 0) {
				this.earnestShow = true;
				return;
			}
			let param = {
				id: id,
				type: this.type,
				from: 'orderHall'
			}
			this.$navto('/pages/order/order-details' + uni.$u.queryParams(param))
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background: #f6f7fb;
}
.content {
	padding: 30rpx;
	.order-item {
		width: 690rpx;
		height: 379rpx;
		background: #ffffff;
		box-shadow: 0rpx 2rpx 18rpx 0rpx rgba(0, 0, 0, 0.06);
		border-radius: 30rpx;
		font-size: 30rpx;
		font-weight: 400;
		color: #333333;
		padding: 45rpx 20rpx 10rpx 20rpx;

		.info-btn {
			width: 160rpx;
			height: 62rpx;
			border: 2rpx solid #55b5ff;
			border-radius: 30rpx;
			color: #55b5ff;
			font-size: 28rpx;
		}

		.order-btn {
			width: 130rpx;
			height: 62rpx;
			border: 2rpx solid #55b5ff;
			border-radius: 30rpx;
			color: #55b5ff;
		}
	}
}
</style>
