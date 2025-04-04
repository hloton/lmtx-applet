<template>
	<view>
		<top-navigation bgColor="#ffffff" :isBack="true" :isFix="true">
			<template #left-slot>
				申请成为陪诊师
			</template>
		</top-navigation>

		<view class="step_box" v-if="apply != '1'">
			<view class="line"><view class="line-select" :class="{ 'line-disable': cancel }" :style="{ width: lineStyle.width }"></view></view>
			<view class="u-steps u-steps--row">
				<view class="u-steps-item u-steps-item--row" v-for="(item, index) in stepArr" :key="index">
					<view class="u-steps-item__wrapper u-steps-item__wrapper--row" :class="{ step_select: index == active }">
						<image v-if="!cancel && index == '0'" src="/static/images/order/step_select.png" mode="aspectFit" class="slot-icon"></image>
						<image v-if="!cancel && index == '1' && apply != '2'" src="/static/images/order/step.png" mode="aspectFit" class="slot-icon"></image>
						<image v-if="!cancel && index == '1' && apply == '2'" src="/static/images/order/step_error.png" mode="aspectFit" class="slot-icon"></image>

						<image v-if="cancel" :src="'/static/images/order/step_cancel.png'" mode="aspectFit" class="slot-icon"></image>
					</view>
					<view class="u-steps-item__content u-steps-item__content--row">
						<text>{{ item.title }}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="u-p-t-50 u-flex u-flex-wrap u-row-center" v-show="apply == '1'">
			<view class="u-p-80 u-text-center faild-text">您已成功申请成为陪诊师，去登录吧~</view>

			<view class="login-btn"><u-button type="primary" text="去登录" customStyle="margin-top: 50px" @click="toLogin"></u-button></view>
		</view>

		<view class="content" v-show="apply == '2'">
			<view class="u-p-t-20">
				<view class="u-flex u-p-t-10 u-p-b-30">
					<u-icon name="close-circle-fill" color="#f56c6c" size="30"></u-icon>
					<text class="faild-title u-m-l-10">失败原因</text>
				</view>
				<u-line></u-line>
				<view class="u-p-80 u-text-center faild-text">{{ failCause }}</view>
			</view>
		</view>

		<view class="content" v-show="!apply">
			<view class="u-p-t-50 u-p-b-50">
				<u--form labelPosition="left" :model="applyUser" ref="form1" :labelStyle="formStyle">
					<u-form-item label="姓名" prop="userInfo.name" labelWidth="90" borderBottom ref="item1">
						<u--input v-model="applyUser.userInfo.name" border="none" inputAlign="right" placeholder="请输入姓名"></u--input>
					</u-form-item>

					<u-form-item label="性别" prop="userInfo.sexname" labelWidth="70%" borderBottom ref="item2">
						<u-radio-group v-model="applyUser.userInfo.sexname">
							<u-radio
								:customStyle="{ marginRight: '16px' }"
								v-for="(item, index) in sexlist"
								:key="index"
								:label="item.name"
								:name="item.name"
								@change="sexChange"
							></u-radio>
						</u-radio-group>
					</u-form-item>

					<u-form-item label="手机号" prop="userInfo.phone" labelWidth="90" borderBottom ref="item1">
						<u--input v-model="applyUser.userInfo.phone" border="none" inputAlign="right" placeholder="请填写手机号"></u--input>
					</u-form-item>
					<u-form-item
						label="出生日期"
						prop="userInfo.old"
						labelWidth="90"
						borderBottom
						@click="
							showBirthday = true;
							hideKeyboard();
						"
						ref="item1"
					>
						<u--input v-model="applyUser.userInfo.old" disabled disabledColor="#ffffff" inputAlign="right" placeholder="请选择生日" border="none"></u--input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>

					<u-form-item
						label="省市区"
						prop="userInfo.area_text"
						labelWidth="80"
						borderBottom
						@click="
							showProvince = true;
							hideKeyboard();
						"
						ref="item1"
					>
						<u-input v-model="applyUser.userInfo.area_text" disabled disabledColor="#ffffff" inputAlign="right" placeholder="请选择" border="none"></u-input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>

					<!-- <uni-data-picker :localdata="columns" popup-title="省市区" @change="onchange" @nodeclick="onnodeclick" :map=""}></uni-data-picker> -->

					<u-form-item label="工龄" prop="userInfo.length_old" labelWidth="90" borderBottom ref="item1">
						<u--input v-model="applyUser.userInfo.length_old" border="none" inputAlign="right" placeholder="请输入工龄（年）"></u--input>
					</u-form-item>

					<u-form-item label="个人简介" labelWidth="90" borderBottom ref="item3">
						<u--textarea placeholder="不低于3个字" v-model="applyUser.userInfo.brief" count></u--textarea>
					</u-form-item>

					<view class="u-flex u-m-t-30 u-col-top u-m-b-30">
						<view class="upload-title u-text-center">照片</view>

						<view class="upload-item u-m-l-20 u-flex u-col-center u-row-center" @tap="uploadImg(1)">
							<u-avatar v-if="applyUser.userInfo.ext1" :src="$getImgUrl() + applyUser.userInfo.ext1" shape="square" size="55"></u-avatar>
							<u-icon v-else name="plus" color="#999999" bold size="28"></u-icon>
						</view>
					</view>

					<u-line></u-line>

					<view class="u-m-t-30 ">
						<view class="upload-title ">上传身份证正反照片</view>
						<view class="u-page__upload-item u-flex u-m-t-30 u-row-between">
							<view class="" @tap="uploadImg(2)">
								<view class="id-photo u-flex u-col-center u-row-center">
									<u-image
										v-if="applyUser.userInfo.card_front"
										:src="$getImgUrl() + applyUser.userInfo.card_front"
										width="120px"
										height="80px"
										mode="aspectFit"
									></u-image>
									<u-image v-else src="/static/images/mine/ex2.png" width="120px" height="80px" mode="aspectFit"></u-image>
									<view v-if="!applyUser.userInfo.card_front" class="id-photo-icon u-flex u-col-center u-row-center">
										<u-icon name="camera-fill" color="#ffffff" size="30"></u-icon>
									</view>
								</view>
								<view class="id-photo-text">请上传身份证正面照片</view>
							</view>
							<view class="" @tap="uploadImg(3)">
								<view class="id-photo u-flex u-col-center u-row-center">
									<u-image
										v-if="applyUser.userInfo.card_reverse"
										:src="$getImgUrl() + applyUser.userInfo.card_reverse"
										width="120px"
										height="80px"
										mode="aspectFit"
									></u-image>
									<u-image v-else src="/static/images/mine/ex1.png" width="120px" height="80px" mode="aspectFit"></u-image>
									<view v-if="!applyUser.userInfo.card_reverse" class="id-photo-icon u-flex u-col-center u-row-center">
										<u-icon name="camera-fill" color="#ffffff" size="30"></u-icon>
									</view>
								</view>
								<view class="id-photo-text">请上传身份证反面照片</view>
							</view>
						</view>
					</view>
					<u-line></u-line>

					<u-form-item label="设置登录密码" prop="userInfo.password" labelWidth="100" ref="item1">
						<u--input v-model="applyUser.userInfo.password" password border="none" inputAlign="right" placeholder="请输入登录密码"></u--input>
					</u-form-item>
				</u--form>
			</view>
		</view>
		<u-button v-if="!apply" type="primary" text="提交" customStyle="margin-top: 50px" @click="submit"></u-button>
		<u-button v-if="apply == '2'" type="primary" text="修改资料" customStyle="margin-top: 50px" @click="reapply()"></u-button>
		<!-- 出生日期 -->
		<u-datetime-picker
			:show="showBirthday"
			:value="birthday"
			mode="date"
			:minDate="87524800000"
			:maxDate="1653778555000"
			closeOnClickOverlay
			@confirm="birthdayConfirm"
			@cancel="birthdayClose"
			@close="birthdayClose"
		></u-datetime-picker>
		<!-- 省市区 -->
		<city-select v-model="showProvince" @city-change="cityChange"></city-select>
	</view>
</template>

<script>
import citySelect from './u-city-select.vue';
import { mapGetters } from 'vuex';
export default {
	components: { citySelect },
	data() {
		return {
			staffId: '',
			active: 0,
			apply: '',

			cancel: false,
			stepArr: [
				{
					title: '填写资料'
				},
				{
					title: '平台审核'
				}
			],
			lineStyle: {},
			formStyle: {
				padding: '10rpx 0',
				color: '#333333',
				fontWeight: 500,
				fontSize: '30rpx'
				// height: '200px'
			},

			fileList1: [],
			disabled1: false,
			tips: '',
			value: '',
			showProvince: false,
			showBirthday: false,
			applyUser: {
				userInfo: {
					member_id: uni.getStorageSync('userinfo').id,
					name: '',
					sex: '',
					sexname: '',
					phone: '',
					old: '',
					length_old: '',
					ext1: '',
					brief: '',
					card_front: '',
					card_reverse: '',
					province_code: '',
					province: '',
					city_code: '',
					city: '',
					area_code: '',
					area: '',
					password: '',
					area_text: ''
				}
			},
			showSex: false,
			birthday: Number(new Date()),
			rules: {
				'userInfo.name': [
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
				'userInfo.phone': [
					{
						type: 'string',
						required: true,
						message: '请填写手机号',
						trigger: ['change']
					},
					{
						// 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
						validator: (rule, value, callback) => {
							// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
							return uni.$u.test.mobile(value);
						},
						message: '手机号格式不正确',
						// 触发器可以同时用blur和change，二者之间用英文逗号隔开
						trigger: ['change', 'blur']
					}
				],
				'userInfo.area_text': {
					type: 'string',
					required: true,
					message: '省市区不能为空',
					trigger: ['change']
				},

				'userInfo.sexname': {
					type: 'string',
					min: 1,
					max: 2,
					message: '请选择男或女',
					trigger: ['change']
				},
				'userInfo.brief': {
					type: 'string',
					min: 3,
					required: true,
					message: '不低于3个字',
					trigger: ['change']
				},

				'userInfo.old': {
					type: 'string',
					required: true,
					message: '请选择生日',
					trigger: ['change']
				},
				'userInfo.length_old': [
					{
						type: 'string',
						required: true,
						message: '请填写工龄',
						trigger: ['change']
					},
					{
						// 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
						validator: (rule, value, callback) => {
							// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
							return uni.$u.test.number(value);
						},
						message: '工龄只能为数字',
						// 触发器可以同时用blur和change，二者之间用英文逗号隔开
						trigger: ['change', 'blur']
					}
				],
				'userInfo.password': [
					{
						type: 'string',
						min: 8,
						max: 32,
						required: true,
						message: '请输入8-32位密码',
						trigger: ['change']
					},
					{
						// 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
						validator: (rule, value, callback) => {
							// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
							return uni.$u.test.rangeLength(value, [8, 32]);
						},
						message: '请输入8-32位密码',
						// 触发器可以同时用blur和change，二者之间用英文逗号隔开
						trigger: ['change', 'blur']
					}
				]
			},
			sexlist: [
				{
					id: '1',
					name: '男',
					disabled: false
				},
				{
					id: '2',
					name: '女',
					disabled: false
				}
			],
			applyType: '1', //1 申请服务人员 2审核失败修改服务人员
			failCause: ''
		};
	},
	onReady() {
		// 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则

		this.$refs.form1.setRules(this.rules);
	},
	onLoad(option) {
		this.apply = option.type;
		if (this.apply == 2) {
			this.active = 1;
			this.stepArr[1].title = '审核失败';
		}
		if (option.failCause) {
			this.failCause = option.failCause;
		}
	},
	computed: {
		...mapGetters(['staffid'])
	},
	created() {
		this.lineWidth();
		// this.getProvince();
	},
	methods: {
		lineWidth() {
			this.$nextTick(() => {
				if (this.cancel) {
					this.lineStyle = {
						width: '684rpx'
					};
				} else {
					this.getRect('.step_select').then(size => {
						if (this.active < this.stepArr.length - 1) {
							this.lineStyle = {
								width: size.left + 'px'
							};
						} else {
							this.lineStyle = {
								width: '684rpx'
							};
						}
					});
				}
			});
		},
		getRect(selector, all) {
			return new Promise(resolve => {
				uni.createSelectorQuery()
					.in(this)
					[all ? 'selectAll' : 'select'](selector)
					.boundingClientRect(rect => {
						if (all && Array.isArray(rect) && rect.length) {
							resolve(rect);
						}
						if (!all && rect) {
							resolve(rect);
						}
					})
					.exec();
			});
		},
		reapply() {
			this.apply = '';
			this.applyType = '2';
			this.servePersonnelDetails();
			this.active = 0;
			this.stepArr[0].title = '修改资料'
			this.stepArr[1].title = '提交审核';
			this.lineWidth();
		},

		//获取申请后
		servePersonnelDetails() {
			this.$request('/applet/staff/servePersonnelDetails', {
				member_id: uni.getStorageSync('userinfo').id
			}).then(res => {
				console.log('获取申请后', res, uni.getStorageSync('userinfo').id);
				if (res.success) {
					if (res.data) {
						Object.assign(this.applyUser.userInfo, res.data);
						this.applyUser.userInfo.area_text = res.data.province + '-' + res.data.city + '-' + res.data.area;
						this.applyUser.userInfo.password = '';
						this.applyUser.userInfo.old = res.data.old_year;
						if(res.data.sex == 1) {
							this.applyUser.userInfo.sexname = '男'
						}else{
							this.applyUser.userInfo.sexname = '女'
						}
						
					}
				}
			});
		},
		cityChange(e) {
			// this.input = e.province.label + '-' + e.city.label + '-' + e.area.label;
			this.applyUser.userInfo.area_text = e.province.province + '-' + e.city.city + '-' + e.area.area;
			this.applyUser.userInfo.province = e.province.province;
			this.applyUser.userInfo.province_code = e.province.provinceid;
			this.applyUser.userInfo.city = e.city.city;
			this.applyUser.userInfo.city_code = e.city.cityid;
			this.applyUser.userInfo.area = e.area.area;
			this.applyUser.userInfo.area_code = e.area.areaid;
		},

		uploadImg(type) {
			uni.chooseImage({
				count: 1, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				// sourceType: ['album'], //从相册选择
				success: chooseImageRes => {
					console.log(chooseImageRes);
					let filePath = chooseImageRes.tempFilePaths[0];
					let file = chooseImageRes.tempFiles[0];
					uni.uploadFile({
						url: this.$getHost() + '/applet/index/page/uploading', //上传图片接口
						file: file,
						filePath: filePath,
						name: 'file',
						formData: {
							user: 'test'
						},
						success: uploadFileRes => {
							let res = JSON.parse(uploadFileRes.data);
							console.log('上传图片', res);
							switch (type) {
								case 1:
									this.applyUser.userInfo.ext1 = res.data.filePath;
									break;
								case 2:
									this.applyUser.userInfo.card_front = res.data.filePath;
									break;
								case 3:
									this.applyUser.userInfo.card_reverse = res.data.filePath;
									break;
							}

							// let res = JSON.parse( uploadFileRes.data )
							// const coverImg =  res.data.filePath;
							// console.log(coverImg)
						},
						fail: failRes => {
							console.log('上传失败', failRes);
						}
					});
				}
			});
		},

		sexChange(n) {
			console.log('sexChange', n);
			if(n == '男') {
				this.applyUser.userInfo.sex = '1'
			}else{
				this.applyUser.userInfo.sex = '2'
			}
			
		},
		radioChange(n) {
			// console.log('radioChange', n);
		},

		sexSelect(e) {
			this.applyUser.userInfo.sex = e.name;
			this.$refs.form1.validateField('userInfo.sex');
		},
		change(e) {
			// console.log(e);
		},

		provinceCancle() {
			this.showProvince = false;
		},
		provinceConfirm(e) {
			console.log('选择省市区', e);
			this.applyUser.userInfo.province = e.value.toString();
			this.$refs.form1.validateField('userInfo.province');
			this.showProvince = false;
		},

		formatter(day) {
			const d = new Date();
			let month = d.getMonth() + 1;
			const date = d.getDate();
			if (day.month == month && day.day == date + 3) {
				day.bottomInfo = '有优惠';
				day.dot = true;
			}
			return day;
		},

		codeChange(text) {
			this.tips = text;
		},
		getCode() {
			if (this.$refs.uCode.canGetCode) {
				// 模拟向后端请求验证码
				uni.showLoading({
					title: '正在获取验证码'
				});
				setTimeout(() => {
					uni.hideLoading();
					// 这里此提示会被this.start()方法中的提示覆盖
					uni.$u.toast('验证码已发送');
					// 通知验证码组件内部开始倒计时
					this.$refs.uCode.start();
				}, 2000);
			} else {
				uni.$u.toast('倒计时结束后再发送');
			}
		},
		calendarClose() {
			this.showProvince = false;
			this.$refs.form1.validateField('hotel');
		},
		birthdayClose() {
			this.showBirthday = false;
			this.$refs.form1.validateField('userInfo.old');
		},
		birthdayConfirm(e) {
			this.showBirthday = false;
			this.applyUser.userInfo.old = uni.$u.timeFormat(e.value, 'yyyy-mm-dd');
			this.$refs.form1.validateField('userInfo.old');
		},
		submit() {
			// 如果有错误，会在catch中返回报错信息数组，校验通过则在then中返回true
			if(!this.applyUser.userInfo.brief) {
				uni.$u.toast('请输入个人简介')
				return
			}
			if(!this.applyUser.userInfo.ext1) {
				uni.$u.toast('请上传照片')
				return
			}
			if(!this.applyUser.userInfo.card_front || !this.applyUser.userInfo.card_reverse) {
				uni.$u.toast('请上传身份证')
				return
			}

			this.$refs.form1
				.validate()
				.then(res => {
					// uni.$u.toast('校验通过');
					let param = {
						...this.applyUser.userInfo,
						type: this.applyType,
						staff_id: this.staffid
					};

					console.warn(JSON.stringify(param));
					console.log("参数", param)

					console.log('ididid', this.staffid);
					// return
					this.$request('/applet/staff/applyServePersonnel', param).then(applyRes => {
						console.log('申请结果', applyRes);
						if (applyRes.success) {
							uni.$u.toast('申请成功,请等待审核');
							if(applyRes.data){
								this.$store.dispatch('setStaffId', applyRes.data.staff_id);
							}
							setTimeout(() => {
								uni.redirectTo({
									url: '/pages/mine/staff/staff-entry'
								});
							}, 1500);
						} else {
							uni.$u.toast(applyRes.msg);
						}
					});
				})
				.catch(errors => {
					uni.$u.toast('请完善信息');
					console.log(errors)
				});
		},
		reset() {
			const validateList = ['userInfo.name', 'userInfo.sex', 'userInfo.sex', 'checkboxValue1', 'intro', 'hotel', 'code', 'userInfo.birthday'];
			this.$refs.form1.resetFields();
			this.$refs.form1.clearValidate();
			setTimeout(() => {
				this.$refs.form1.clearValidate(validateList);
				// 或者使用 this.$refs.form1.clearValidate()
			}, 10);
		},
		hideKeyboard() {
			uni.hideKeyboard();
		},
		toLogin() {
			uni.navigateTo({
				url: '/pages/mine/staff/staff-entry'
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background: #f6f7fb;
}
.content {
	position: relative;
	top: -100rpx;
	margin: 0 30rpx;
	padding: 0 30rpx;
	background: #ffffff;
	box-shadow: 0rpx 2rpx 18rpx 0rpx rgba(0, 0, 0, 0.06);
	border-radius: 20rpx;
}

.step_box {
	width: 750rpx;
	height: 366rpx;
	background: url(../../../static/images/home/bg.png);
	background-size: 100% 100%;
	padding-top: 80rpx;
	box-sizing: border-box;
	position: relative;

	.u-steps {
		display: flex;
		z-index: 10;
		position: absolute;
		width: 750rpx;

		.u-steps-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		.u-steps-item__content {
			color: #ffffff;
			margin-top: 20rpx;
			font-size: 28rpx;
			font-weight: 500;
		}
	}

	.line {
		width: 684rpx;
		height: 18rpx;
		background-color: #ffffff;
		border-radius: 18rpx;
		position: absolute;
		left: 30rpx;
		top: 96rpx;
		z-index: 1;

		.line-select {
			width: 80rpx;
			height: 14rpx;
			position: absolute;
			left: 5rpx;
			top: 2rpx;
			border-radius: 14rpx;
			background: #00b26a;
			&.line-disable {
				background: linear-gradient(0deg, #dbdbdb, #f8f8f8);
			}
		}
	}
}

.slot-icon {
	width: 50rpx;
	height: 50rpx;
	background-color: transparent;
}

.upload-title {
	vertical-align: text-top;
	font-size: 30rpx;
	font-weight: 500;
}
.upload-item {
	width: 140rpx;
	height: 140rpx;
	border-radius: 20rpx;

	background-color: #f6f6f6;
}

.id-photo {
	padding: 30rpx;
	border-radius: 20rpx;
	background-color: #f6f6f6;
	position: relative;
	.id-photo-icon {
		position: absolute;
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background-color: #55b5ff;
	}
}
.id-photo-text {
	padding-top: 20rpx;
	padding-bottom: 30rpx;
	font-size: 22rpx;
	font-weight: 400;
	color: #808080;
	text-align: center;
}

.faild-title {
	font-size: 34rpx;

	font-weight: 500;
	color: #333333;
}

.faild-text {
	font-size: 30rpx;
	font-weight: 400;
	color: #666666;
}
.login-btn {
	width: 80%;
}
</style>
