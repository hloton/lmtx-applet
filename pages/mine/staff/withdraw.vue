<template>
	<view>
		<top-navigation bgColor="#ffffff">
			<template #left-slot>
				{{fromType == 'balance' ? '余额提现' : '保证金提现' }}
			</template>
		</top-navigation>

		<view class="draw-box u-m-30" v-if="!checked">
			<u-cell-group>
				<u-cell title="微信" isLink value="已绑定">
					<u-icon slot="icon" size="32" color="#18A73E" name="weixin-fill"></u-icon>
					<!-- <u-badge count="99" :absolute="false" slot="right-icon"></u-badge> -->
					<!-- <u-switch slot="right-icon" v-model="checked"></u-switch> -->
				</u-cell>
			</u-cell-group>
		</view>

		<view class="u-flex u-m-30" v-if="!checked">
			<text class="draw-box-info">温馨提示：</text>
			<text class="draw-box-info1">请先绑定微信，再进行提现!</text>
		</view>

		<view class="box-down">
			<view class="money">提现金额</view>
			<view class="money-center">
				<text class="box-right">￥</text>
				<input
					:placeholder="fromType == 'balance' ? '请输入提现金额' : `可提现保证金：${staffinfo.staff.earnest_money}元`"
					class="ser"
					v-model="money"
					type="digit"
					:disabled="fromType == 'balance' ? false : true"
				/>
			</view>
			<view class="empty"></view>
			<view class="money-down">
				<text style="color: #9d9d9d;">
					{{ fromType == 'balance' ? `可提现金额：￥${staffinfo.staff.balance}` : taxrate == '0' ? '' : money != 0 ? `扣除管理服务费￥${`${money}` * `${taxrate / 100}`}` : `扣除管理服务费${taxrate}%` || 0 }}
				</text>
				<text class="total" @tap="money = fromType == 'balance' ? staffinfo.staff.balance : staffinfo.staff.earnest_money">全部提现</text>
			</view>
		</view>
		<view class="tips">{{ showTips ? '输入金额超过可用余额' : '' }}</view>
		

		<view class="draw-box u-m-30 u-p-30" v-show="checked">
			<u--form labelPosition="left" :model="model" ref="form1" :labelStyle="formStyle">
				<u-form-item label="姓名" prop="bankInfo.name" labelWidth="90" borderBottom ref="item1">
					<u--input v-model="model.bankInfo.name" border="none" inputAlign="right" placeholder="请输入持卡人姓名"></u--input>
				</u-form-item>

				<u-form-item label="银行卡号" prop="bankInfo.bank_num" labelWidth="90" borderBottom ref="item1">
					<u--input v-model="model.bankInfo.bank_num" border="none" inputAlign="right" placeholder="请输入持卡人本人的银行卡"></u--input>
				</u-form-item>

				<u-form-item label="手机号" prop="bankInfo.phone" labelWidth="90" borderBottom ref="item1">
					<u--input v-model="model.bankInfo.phone" border="none" inputAlign="right" placeholder="请输入银行卡预留手机号"></u--input>
				</u-form-item>
			</u--form>
		</view>

		<view class="end" @tap="confirm" :style="{ color: showTips ? '#a7d2ff' : '' }">申请提现</view>
		<view v-if="fromType == 'earnest'" @tap="$navto('/pages/mine/staff/withdraw-list')" class="u-flex u-m-t-30 u-row-center" style="color: #48ACFA;">申请记录</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			type: '', //1-余额提现 2-保证金提现 3-保证金银行卡 4-余额银行卡
			fromType: '', //balance-余额  earnest-保证金
			money: '',
			showTips: false, //提示语
			isBank: '',
			taxrate: '',
			checked: false,
			model: {
				bankInfo: {
					name: '',
					bank_num: '',
					phone: ''
				}
			},

			formStyle: {
				padding: '10rpx 0',
				color: '#333333',
				fontWeight: 500,
				fontSize: '30rpx'
				// height: '200px'
			},
			rules: {
				'bankInfo.name': [
					{
						type: 'string',
						required: true,
						message: '请填写姓名',
						trigger: ['blur', 'change']
					},
					{
						// 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
						validator: (rule, value, callback) => {
							// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
							return uni.$u.test.chinese(value);
						},
						message: '姓名必须为中文',
						// 触发器可以同时用blur和change，二者之间用英文逗号隔开
						trigger: ['change', 'blur']
					}
				],
				'bankInfo.phone': [
					{
						type: 'string',
						required: true,
						message: '请填写正确的手机号',
						trigger: ['blur', 'change']
					},
					{
						// 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
						validator: (rule, value, callback) => {
							// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
							return uni.$u.test.mobile(value);
						},
						message: '手机号码不正确',
						// 触发器可以同时用blur和change，二者之间用英文逗号隔开
						trigger: ['change', 'blur']
					}
				],
				'bankInfo.bank_num': {
					type: 'string',
					required: true,
					message: '请输入银行卡号',
					trigger: ['blur', 'change']
				}
			}
		};
	},
	computed: {
		...mapGetters(['staffinfo'])
	},
	watch: {
		money(newval) {
			if (Number(newval) > Number(this.fromType == 'balance' ? this.staffinfo.staff.balance : this.staffinfo.staff.earnest_money || 0)) {
				this.showTips = true;
			} else {
				this.showTips = false;
			}
		}
	},
	onReady() {
		// 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则
		this.$refs.form1.setRules(this.rules);
	},
	onLoad(option) {
		console.log(option);
		this.fromType = option.type;
		if (option.type == 'balance') {
			this.type = '1';
		}
		if (option.type == 'earnest') {
			this.type = '2';
		}
//是否开启银行卡
		this.getConfig();
//税额
		this.getTaxrate();
	},
	methods: {
		// switchChange(e) {
		// 	console.log(e, this.checked);
		// 	if (e) {
		// 		this.type = 3;
		// 	} else {
		// 		this.type = 2;
		// 	}
		// },
		getConfig() {
			this.$request('/applet/index/page/getConfig', {
				type: '9'
			}).then(res => {
				console.log('是否开启银行卡提现', res);
				if (res.code == 200) {
					this.isBank = res.data.content;
					if (this.isBank == '1') {
						if(this.fromType == 'balance') {
							this.type = 4;
						}
						if(this.fromType == 'earnest') {
							this.type = 3;
						}
						this.checked = true;
					}
				}
			});
		},

		getTaxrate() {
			this.$request('/applet/index/page/getConfig', {
				type: '8'
			}).then(res => {
				console.log('税率', res);
				if (res.code == 200) {
					this.taxrate = res.data.content;
				}
			});
		},
		confirm() {
			if(this.fromType == 'balance' && this.staffinfo.staff.balance == '0' ){
				this.$toast('余额不足，不能提现')
				return
			}
			if(this.fromType =='earnest' && this.staffinfo.staff.earnest_money == '0') {
				this.$toast('保证金不足，不能提现')
				return
			}
			if (this.checked) {
				this.$refs.form1
					.validate()
					.then(res => {
						uni.$u.toast('提现中');
						this.withdraw();
					})
					.catch(errors => {
						uni.$u.toast('请完善信息');
					});
			} else {
				this.withdraw();
			}
		},
		//提现
		withdraw() {
			if (!this.money) {
				if (this.fromType == 'balance') {
					this.$toast('请输入提现金额');
				} else {
					this.$toast('请点击全部提现');
				}
				return;
			}
				if (this.money < 1) {
				this.$toast('低于1元无法提现');
				return;
			}
			if (this.$check.checkAmount(this.money, '金额', true)) return;
			if (this.fromType == 'balance') {
				if (this.money > this.staffinfo.staff.balance) {
					this.$toast('超出可提现金额');
					return;
				}
			}

		
			let params = {
				id: uni.getStorageSync('staffinfo'),
				money: this.money,
				member_id: uni.getStorageSync('userinfo').id,
				type: this.type.toString(),
				...this.model.bankInfo
			};
			let requestUrl = '';
			// // #ifdef MP-WEIXIN
			// requestUrl = '/applet/staff/saveWithdrawal'
			// // #endif
			// // #ifndef MP-WEIXIN
			// requestUrl = '/applet/staff/aliSaveWithdrawal'
			// // #endif
			requestUrl = '/applet/staff/saveWithdrawal';
			console.warn(JSON.stringify(params))
			this.$request(requestUrl, params).then(res => {
				console.log('提现', res);
				if (res.success) {
					this.$toast(this.fromType == 'balance' ? '已提交提现申请' : '申请成功，待后台审核').then(() => {
						this.$store.dispatch('getstaffInfo');
						uni.navigateBack({});
					});
				} else this.$toast(res.msg);
			});
		}
	}
};
</script>

<style lang="scss">
page {
	min-height: 100vh;
	background-color: #f6f7fb;
}

.box-top {
	display: flex;
	align-items: center;
	width: 690rpx;
	height: 112rpx;
	background: #ffffff;
	box-shadow: 0rpx 2rpx 18rpx 0rpx rgba(0, 0, 0, 0.06);
	border-radius: 20rpx;
	margin: 30rpx auto;

	image {
		width: 56rpx;
		height: 56rpx;
		margin: 28rpx 23rpx 28rpx 29rpx;
	}

	.bind {
		margin-left: 307rpx;
	}

	.right {
		width: 26rpx;
		height: 26rpx;
	}
}

.word {
	margin-left: 30rpx;
	font-size: 24rpx;
}
.draw-box {
	background: #ffffff;
	box-shadow: 0rpx 2rpx 18rpx 0rpx rgba(0, 0, 0, 0.06);
	border-radius: 20rpx;
}
.draw-box-info {
	font-size: 24rpx;
	font-weight: 500;
	color: #ff4d4d;
}
.draw-box-info1 {
	font-size: 24rpx;
	font-weight: 500;
	color: #808080;
}
.checked {
	display: none;
}

.box-down {
	width: 690rpx;
	height: 310rpx;
	background: #ffffff;
	box-shadow: 0rpx 2rpx 18rpx 0rpx rgba(0, 0, 0, 0.06);
	border-radius: 20rpx;
	margin: 30rpx auto;

	.money {
		width: 100%;
		height: 105rpx;
		line-height: 105rpx;
		margin-left: 34rpx;
	}

	.money-center {
		display: flex;

		.box-right {
			font-size: 48rpx;
			margin-left: 52rpx;
		}

		.empty-harp {
			width: 1rpx;
			height: 70rpx;
			background-color: #e8e8e8;
			margin-left: 18rpx;
		}

		input {
			font-size: 40rpx;
			margin-left: 30rpx;
		}
	}

	.empty {
		width: 630rpx;
		height: 1rpx;
		background: #f0f0f0;
		margin: 40rpx auto 0 auto;
	}

	.money-down {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 96rpx;
		font-size: 28rpx;
		padding: 0 30rpx;
	}

	.total {
		color: #ff5c5c;
		font-weight: bold;
	}
}

.tips {
	margin: 0 30rpx;
	color: #ff5c5c;
	font-weight: bold;
	height: 50rpx;
}

.bing-ali {
	margin: 0rpx auto;
	color: #55b5ff;
	width: 300rpx;
	text-align: center;
}

.end {
	bottom: 40%;
	left: 0;
	right: 0;
	width: 690rpx;
	height: 96rpx;
	background: #55b5ff;
	border-radius: 48rpx;
	line-height: 96rpx;
	text-align: center;
	margin: 0 auto;
	color: #ebebeb;
	font-size: 36rpx;
}
</style>
