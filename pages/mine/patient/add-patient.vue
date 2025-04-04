<template>
	<view>
<top-navigation bgColor="#ffffff">
			<template #left-slot>
				{{isedit?'修改':'添加'}}就诊人信息
			</template>
		</top-navigation>
		
		<view class="box">
			<view class="word-box">
				<text>就诊人是否已满18周岁</text>
				<view class="radio">
					<u-radio-group v-model="is_adult" placement="row">
						<u-radio activeColor="#55b5ff" :customStyle="{marginLeft: '26rpx'}"
							v-for="(item, index) in radiolist1" :key="index" :label="item.name" :name="item.value"
							@change="isadultChange">
						</u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="empty"></view>
			<view class="word-box">
				<input placeholder="请填写就诊人姓名" v-model="name" />
			</view>
			<view class="empty"></view>
			<view class="word-box">
				<text>请选择就诊人性别</text>
				<view class="radio">
					<u-radio-group v-model="sex" placement="row">
						<u-radio activeColor="#55b5ff" :customStyle="{marginLeft: '26rpx'}"
							v-for="(item, index) in radiolist2" :key="index" :label="item.name" :name="item.value"
							@change="sexChange">
						</u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="empty"></view>
			<view class="word-box">
				<input placeholder="请填写手机号" v-model="phone" maxlength="11" type="number" />
			</view>
		
			<view class="empty"></view>
			<view class="word-box">
				<input placeholder="请填写就诊人身份证号" v-model="cardnum" maxlength="18" type="idcard" />
			</view>
			<view class="empty"></view>
			<view class="word-box" style="justify-content: space-between;">
				<text>就诊人关系</text>
				<picker mode="selector" :range="relation" @change="relationChange">
					<view style="display: flex;justify-content: center;">
						<text :style="{color:curRelation?'':'#aeaeae'}">{{curRelation||'请选择就诊人关系'}}</text>
						<u-icon name="arrow-right" :color="curRelation?'':'#aeaeae'"></u-icon>
					</view>
				</picker>
			</view>
			<view class="empty"></view>
			<view class="word-box">
				<text>行动是否方便</text>
				<view class="radio">
					<u-radio-group v-model="is_walk" placement="row">
						<u-radio activeColor="#55b5ff" :customStyle="{marginLeft: '26rpx'}"
							v-for="(item, index) in radiolist1" :key="index" :label="item.name" :name="item.value"
							@change="isWalkchange">
						</u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="empty"></view>
		</view>
		<view class="end" @tap="save">保存</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				radiolist1: [{
						name: '是',
						value: '1'
					},
					{
						name: '否',
						value: '0'
					}
				],
				radiolist2: [{
						name: '男',
						value: '0'
					},
					{
						name: '女',
						value: '1'
					}
				],
				relation: ['父母', '子女', '兄弟姐妹', '本人', '夫妻', '其他'],
				name:'',//姓名
				cardnum:'',//身份证号
				phone:'',//手机号
				curRelation:'',//
				lock: false, //防止多次提交
				sex:'',//性别
				is_walk:'',//行动是否方便
				is_adult:'',//是否满18岁，1是，0否
				isedit: false, //当前页是否是修改页
			};
		},
		onLoad(e){
			this.name = uni.getStorageSync('patientInfo').name
			this.cardnum = uni.getStorageSync('patientInfo').card_num
			this.phone = uni.getStorageSync('patientInfo').phone
			this.sex = uni.getStorageSync('patientInfo').sex + ''
			this.is_walk = uni.getStorageSync('patientInfo').is_walk + ''
			this.is_adult = uni.getStorageSync('patientInfo').is_adult + ''
			this.curRelation = uni.getStorageSync('patientInfo').relation
			this.isedit=e.isedit
		},
		onUnload(){
			uni.removeStorageSync('patientInfo')
		},
		methods:{
			save(){
				if(this.lock)return
				if(!this.is_adult)return this.$toast('就诊人是否已满18周岁')
				if (this.$check.checkRealName(this.name, '就诊人姓名', true)) return;
				if (!this.sex) return this.$toast('请选择就诊人性别')
				if (this.$check.checkPhoneNumber(this.phone, '手机号', true)) return;
				if (this.$check.checkIdCard(this.cardnum, '身份证号', true)) return;//校验，合法就返回false，上面同理
				if (!this.curRelation) return this.$toast('请选择与就诊人的关系')
				if (!this.is_walk) return this.$toast('就诊人是否行动方便')
				this.lock=true
				let params = {
					is_adult: this.is_adult, //是否满18周岁
					name: this.name,
					sex: this.sex,
					phone: this.phone,
					card_num: this.cardnum,
					relation: this.curRelation,
					is_walk: this.is_walk, //是否行动方便
				}
				let url=''
				if(this.isedit){//编辑模式
					url='/applet/my/editPatients'
					params.id=uni.getStorageSync('patientInfo').id
				}else{
					url='/applet/my/addPatients'
					params.member_id=uni.getStorageSync('userinfo').id
				}
				this.$request(url,params).then(res=>{
					if(res.success){
						this.$toast(`${this.isedit?'修改':'添加'}成功`).then(() => {
							uni.navigateBack({})//等 1.5 秒,自动返回上一页
						})
					}else this.$toast(res.msg)
				})
			},
			//是否满18岁
			isadultChange(e) {
				this.is_adult = e
			},
			//就诊人关系
			relationChange(e){
				this.curRelation=this.relation[e.detail.value]
			},
			//性别
			sexChange(e){
				this.sex=e
			},
			//行动是否方便
			isWalkchange(e){
				this.is_walk=e
			}
		}
	}
</script>

<style lang="scss">
page {
		background-color: #f6f7fb;
	}
	.box {
		width: 690rpx;
		height: 874rpx;
		padding: 20rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 2rpx 18rpx 0rpx rgba(0, 0, 0, 0.06);
		border-radius: 20rpx;
		margin: 30rpx;
		padding: 30rpx;
		box-sizing: border-box;
	
		.word-box {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			height: 110rpx;
	
			image {
				width: 35rpx;
				height: 32rpx;
				color: #B0B0B0;
				margin-left: 20rpx;
			}
		}
	
		.radio {
			margin: 30rpx 0 0 86rpx;
		}
	
		.empty {
			width: 100%;
			height: 2rpx;
			background: #EBEBEB;
			margin: 0 auto;
		}
	
		input {
			width: 100%;
			height: 110rpx;
		}
	}
	
	.end {
		position: fixed;
		padding-bottom: constant(safe-area-inset-bottom);
		/*兼容 IOS<11.2*/
		padding-bottom: env(safe-area-inset-bottom);
		bottom: 0rpx;
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		background-color: #55b5ff;
		text-align: center;
		color: #FFFFFF;
	}
</style>
