<template>
	<view>
		<top-navigation bgColor="#ffffff" :isBack="false">
			<template #left-slot>
				我的
			</template>
		</top-navigation>
		<view>
			<image src="/static/images/home/bg.png" class="bg"></image>
			<view class="name">
				<view style="display: flex;">
					员工姓名：{{ staffinfo.staff.name }}
					<view class="revise" @tap="$navto('/pages/mine/staff/change-password')">修改密码</view>
				</view>
				<view class="exit" @tap="logout">
					<image src="/static/images/mine/mine-exit.png"></image>
					<view class="exit-word">退出</view>
				</view>
			</view>
		</view>
		
		<view class="box-top">
			<view class="state">状态</view>
			<view class="select">
				<u-radio-group v-model="staffinfo.staff.status" placement="row">
					<u-radio
						activeColor="#55b5ff"
						:customStyle="{ marginLeft: '66rpx' }"
						v-for="(item, index) in radiolist"
						:key="index"
						:label="item.name"
						:name="item.id"
						@change="radioChange"
					></u-radio>
				</u-radio-group>
			</view>
			<view class="save" @tap="saveState">保存</view>
		</view>
		<view class="box-center">
			<view class="count">统计总览</view>
			<view class="blue-box">
				<view class="box-left">
					<view>
						<text style="font-size:36rpx ;color: #58b6ff;font-weight: bold;">{{ staffinfo.level.order_count }}</text>
						<text style="color: #58b6ff;">人</text>
					</view>
					<view style="margin-top: 12rpx;">服务人数</view>
				</view>
				<view class="empty-center"></view>
				<view class="box-right">
					<view style="color: #ff5050;font-weight: bold;font-size: 36rpx;">{{ staffinfo.level.level_avg.toFixed(1) }}</view>
					<view style="margin-top: 12rpx;">综合评分</view>
				</view>
			</view>
		</view>
		<view class="box-list u-flex u-row-between">
			<text style="font-weight: bold;">服务地区：</text>
			<text style="color: #878787;">{{ staffinfo.staff.province }} {{ staffinfo.staff.city }} {{ staffinfo.staff.area }}</text>
		</view>
		<view class="box-list u-m-t-30">
			<view class="pro-title">服务管理</view>
			<view class="u-m-t-30">
				<u-checkbox-group v-model="checkboxValue1" placement="row" @change="listChange">
					<u-checkbox
						activeColor="#55b5ff"
						shape="circle"
						:customStyle="{ marginBottom: '8px', width: '45%' }"
						v-for="(item, index) in proList"
						:key="index"
						:label="item.name"
						:name="item.id"
					></u-checkbox>
				</u-checkbox-group>
			</view>
		</view>
		<view class="box-down">
			<view class="balance">
				<text style="font-size: 32rpx;">余额：</text>
				<text style="color: #ff5f5f;font-size: 50rpx;margin-left: 56rpx;">{{ staffinfo.staff.balance || 0 }}</text>
				<text style="color: #ff5f5f;font-size: 24rpx;margin: 10rpx 0 0 18rpx;">元</text>
			</view>
			<view class="three-box">
				<u-button text="提现"  :customStyle="withdrawBtn" @tap="$navto('/pages/mine/staff/withdraw?type=' + 'balance')"></u-button>
				<u-button text="奖励明细" :customStyle="detailBtn" @tap="$navto('/pages/mine/staff/reward-detail')"></u-button>
				<u-button text="提现记录" :customStyle="detailBtn" @tap="$navto('/pages/mine/staff/withdraw-record')"></u-button>
			</view>
		</view>
		<view class="box-down">
			<view class="balance">
				<text style="font-size: 32rpx;">保证金：</text>
				<text style="color: #ff5f5f;font-size: 50rpx;margin-left: 56rpx;">{{ staffinfo.staff.earnest_money || 0 }}</text>
				<text style="color: #ff5f5f;font-size: 24rpx;margin: 10rpx 0 0 18rpx;">元</text>
			</view>
			<view class="three-box">
				<u-button text="提现" :customStyle="withdrawBtn" @tap="$navto('/pages/mine/staff/withdraw?type=' + 'earnest')"></u-button>
				<u-button text="保证金明细" :customStyle="detailBtn" @tap="$navto('/pages/mine/staff/earnest-detail')"></u-button>
				<u-button text="已缴纳" :customStyle="detailBtn" v-if="staffinfo.staff.is_earnest"></u-button>
				<u-button text="缴纳保证金" v-else :customStyle="detailBtn" @tap="earnestShow = true"></u-button>
			</view>
		</view>
		<u-popup :show="earnestShow" :round="10" mode="bottom" @close="closePop">
			<view class="earnest-money u-m-30">
				<view class="box-list u-m-t-50">
					<view class="pro-title">缴纳保证金额</view>
					<view class="earnest-money-info u-p-30 u-flex u-row-center">
						<text class="money u-text-center">{{ money }}</text>
					</view>
				</view>
		
				<u-button text="缴纳" type="primary" :customStyle="btnStyle" @tap="earnestMoneyOrder"></u-button>
				<!-- <view class="save" @tap="earnestMoneyOrder">缴纳</view> -->
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex';
	export default {
		props: {
			isearnest: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				btnStyle: {
					marginTop: '180rpx',
					width: '503rpx',
					height: '68rpx',
					background: '#55b5ff',
					
					borderRadius: '16rpx',
					fontSize: '28rpx',
					lineHeight: '68rpx',
					color: '#ffffff'
				},
				detailBtn: {
					width: '193rpx',
					height: '68rpx',
					background: '#f3faff',
					border: '1rpx solid #55b5ff',
					borderRadius: '16rpx',
					fontSize: '28rpx',
					lineHeight: '68rpx',
					color: '#55b5ff'
				},
				withdrawBtn: {
					width: '193rpx',
					height: '68rpx',
					background: '#55b5ff',
				
					borderRadius: '16rpx',
					fontSize: '28rpx',
					lineHeight: '68rpx',
					color: '#ffffff'
				},
				earnestShow: this.isearnest,
				radiolist: [
					{
						name: '在线',
						checked: false,
						id: 1
					},
					{
						name: '离线',
						checked: false,
						id: 2
					},
					{
						name: '未设置',
						checked: false,
						id: 0
					}
				],
				level: {},
				status: '',
				proList: [],
				checkboxValue: [],
				checkboxValue1: [],
				checkAction: '',
				money: '' //保证金
			};
		},
		computed:{
			...mapGetters(['staffinfo'])
		},
		mounted() {
			this.status = this.staffinfo.staff.status;
			this.proList = this.staffinfo.projectList;
			this.getConfig();
			this.staffinfo.serveStaffList?.map(item => {
				this.checkboxValue.push(item.project_type);
				this.checkboxValue1.push(item.project_type);
			});
		},
		methods:{
			//获取保证金额
			getConfig() {
				this.$request('/applet/index/page/getConfig', {
					type: '10'
				}).then(res => {
					console.log('获取保证金额', res);
					if (res.code == 200) {
						this.money = res.data.content;
					}
				});
			},
			//退出登录
			logout() {
				uni.$showModal({
					title: '提示',
					content: '确定要退出登录吗?'
				}).then(() => {
					uni.removeStorageSync('staffinfo');
					this.$store.commit('SET_STAFF_INFO', '');
					uni.reLaunch({
						url: '/pages/index/index?type=2'
					});
				});
			},
			radioChange(e) {
				console.log('切换状态', e);
				this.status = e;
			},
			//缴纳保证金
			earnestMoneyOrder() {
				let param = {
					staff_id: uni.getStorageSync('staffinfo'),
					member_id: uni.getStorageSync('userinfo').id,
					money: this.money
				};
				this.$request('/applet/index/order/earnestMoneyOrder', param).then(res => {
					console.log('保证金订单', res);
					if (!res.success) return this.$toast('缴纳失败');
					if (res.code == 200) {
						this.$request('/applet/index/order/earnestMoneyPay', {
							money_order_id: res.data.money_order_id
						}).then(payRes => {
							// console.log('支付结果', payRes,param);
							// uni.requestPayment({
							// 	...payRes.data,
							// 	success: res => {
							// 		this.$toast('缴纳成功');
							// 		this.earnestShow = false
							// 		this.$store.dispatch('getstaffInfo')
							// 	},
							// 	fail: err => {
							// 		this.$toast('支付失败，请稍后再试');
							// 	}
							// });
							this.$toast('缴纳成功');
									this.earnestShow = false
									this.$store.dispatch('getstaffInfo')
						});
					}
				});
			},
			//关闭缴纳保证金弹窗
			closePop() {
				this.earnestShow = false;
			},
			//服务管理勾勾
			listChange(e) {
				// this.checkboxValue1 = e
				const a = this.checkboxValue;
				console.log('选择', this.checkboxValue1);
			
				// if(e.length == a.length && e.sort().toString() == a.sort().toString() ) {
				// 	console.warn(e.length == a.length && e.sort().toString() == a.sort().toString() )
				// 	this.checkAction = '0'
				// }
			
				let checkRes = this.compare(a, e);
				console.log('新增', checkRes);
				if (checkRes.add.length) {
					this.proSave(checkRes.add, '1');
				}
				if (checkRes.del.length) {
					this.proSave(checkRes.del, '2');
				}
				this.checkboxValue = e;
			},
			proSave(arr, type) {
				this.$request('/applet/staff/updateServeStaff', {
					staff_id: this.staffinfo.staff.staff_id,
					type_id: arr.toString(),
					type: type
				}).then(res => {
					console.log(type == '1' ? '增加' : '取消', res);
					if(res.success) {
						this.$store.dispatch('getstaffInfo')
					}
					
				});
			},
			
			compare(beforeArr, afterArr) {
				let resObj = {
						add: [],
						del: []
					},
					cenObj = {};
			
				for (let i = 0; i < beforeArr.length; i++) {
					cenObj[beforeArr[i]] = beforeArr[i];
				}
			
				for (let j = 0; j < afterArr.length; j++) {
					if (!cenObj[afterArr[j]]) {
						resObj.add.push(afterArr[j]);
					} else {
						delete cenObj[afterArr[j]];
					}
				}
				for (let k in cenObj) {
					resObj.del.push(k);
				}
				return resObj;
			},
			
			//保存状态
			saveState() {
				let params = {
					id: uni.getStorageSync('staffinfo'),
					status: this.status
				};
				this.$request('/applet/staff/updateStatus', params).then(res => {
					if (res.success) {
						this.$toast('修改成功!');
					} else this.$toast(res.msg);
				});
			}
		}
	}
</script>

<style lang="scss">
page {
	background-color: #f5f6fa;
}

.bg {
	width: 750rpx;
	height: 374rpx;
	position: absolute;
}

.name {
	padding: 0 30rpx;
	box-sizing: border-box;
	position: absolute;
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	color: #f8fcff;
	font-size: 32rpx;
	font-weight: bold;
	margin-top: 74rpx;
}

.revise {
	width: 122rpx;
	height: 43rpx;
	line-height: 43rpx;
	text-align: center;
	background: #ff4d4d;
	border-radius: 21rpx;
	font-size: 22rpx;
	margin-left: 48rpx;
	color: #fff5f0;
}

.exit {
	image {
		width: 44rpx;
		height: 44rpx;
	}

	.exit-word {
		font-size: 22rpx;
	}
}

.box-top {
	position: relative;
	width: 690rpx;
	height: 347rpx;
	background: #ffffff;
	box-shadow: 0rpx 2rpx 18rpx 0rpx rgba(0, 0, 0, 0.06);
	border-radius: 20rpx;
	margin: 190rpx 0 0 30rpx;

	.state {
		height: 100rpx;
		line-height: 100rpx;
		font-weight: bold;
		font-size: 32rpx;
		margin: 39rpx 0 0 30rpx;
	}

	.select {
		margin: 10rpx 76rpx 0 26rpx;
	}

	.save {
		width: 630rpx;
		height: 96rpx;
		background: #55b5ff;
		border-radius: 48rpx;
		color: #ffffff;
		text-align: center;
		line-height: 96rpx;
		margin: 57rpx auto 0 auto;
	}
}
.box-list {
	background: #ffffff;
	box-shadow: 0rpx 2rpx 18rpx 0rpx rgba(0, 0, 0, 0.06);
	border-radius: 20rpx;
	margin: 0 30rpx;
	padding: 30rpx;
	.pro-title {
		font-weight: bold;
		font-size: 32rpx;
	}
}

.box-center {
	width: 690rpx;
	height: 311rpx;
	background: #ffffff;
	box-shadow: 0rpx 2rpx 18rpx 0rpx rgba(0, 0, 0, 0.06);
	border-radius: 20rpx;
	margin: 30rpx;

	.count {
		width: 100%;
		height: 110rpx;
		line-height: 110rpx;
		font-weight: bold;
		font-size: 32rpx;
		margin-left: 30rpx;
	}

	.blue-box {
		width: 630rpx;
		height: 160rpx;
		background: #f5fbff;
		border-radius: 20rpx;
		margin: auto auto;
		display: flex;
		//justify-content: space-around;
		align-items: center;

		.box-left {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin-left: 90rpx;
		}

		.empty-center {
			width: 1rpx;
			height: 59rpx;
			background: #cfd6f2;
			margin-left: 103rpx;
		}

		.box-right {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin-left: 103rpx;
		}
	}
}

.box-down {
	width: 690rpx;
	height: 261rpx;
	background: #ffffff;
	box-shadow: 0rpx 2rpx 18rpx 0rpx rgba(0, 0, 0, 0.06);
	border-radius: 20rpx;
	margin: 30rpx;

	.balance {
		display: flex;
		align-items: center;
		height: 150rpx;
		line-height: 150rpx;
		font-weight: bold;
		margin-left: 30rpx;
	}

	.three-box {
		display: flex;
		flex-direction: row;
		text-align: center;
		justify-content: space-between;
		margin: 0 30rpx;

		.withdraw {
			width: 193rpx;
			height: 68rpx;
			background: #55b5ff;
			border-radius: 16rpx;
			color: #ffffff;
			font-size: 28rpx;
			line-height: 68rpx;
		}

		.detail {
			width: 193rpx;
			height: 68rpx;
			background: #f3faff;
			border: 1rpx solid #55b5ff;
			border-radius: 16rpx;
			font-size: 28rpx;
			line-height: 68rpx;
			color: #55b5ff;
		}
	}
}

.end {
	width: 690rpx;
	background: #ffffff;
	box-shadow: 0rpx 2rpx 18rpx 0rpx rgba(0, 0, 0, 0.06);
	border-radius: 20rpx;
	margin: 30rpx;
	line-height: 120rpx;
	font-size: 32rpx;
	display: flex;
	justify-content: space-between;
	padding: 10rpx 20rpx;
	box-sizing: border-box;
}
//多选
.u-checkbox-group {
	flex-wrap: wrap;
	justify-content: space-between;
}
.pro-save {
	width: 430rpx;
	height: 60rpx;
	background: #55b5ff;
	border-radius: 48rpx;
	color: #ffffff;
	text-align: center;
	line-height: 60rpx;
	margin: 30rpx auto 0 auto;
}
.earnest-money {
	width: 690rpx;
	background: #f6f7fb;
	box-shadow: 0rpx 2rpx 18rpx 0rpx rgba(0, 0, 0, 0.06);
	.money {
		width: 248rpx;
		height: 90rpx;
		background: #e9e9e9;
		border-radius: 10rpx;
		font-size: 40rpx;
		line-height: 90rpx;
		font-weight: 400;
		color: #666666;
	}

	.detail {
		width: 600rpx;
		height: 96rpx;
		background: #55b5ff;
		border-radius: 48rpx;
		color: #ffffff;
		font-size: 28rpx;
		line-height: 68rpx;
		margin-top: 200rpx;
	}
}
</style>