<template>
	<view class="create-box">
		<top-navigation bgColor="#ffffff">
			<template #left-slot>
				填写订单
			</template>
		</top-navigation>
		<step-bar></step-bar>
		<view class="content">
			<view class="list-box">
				<view class="list-row">
					<text class="exp">服务类型</text>
					<view class="row-right" @click="toProjectDetail">
						<text class="right-text black">{{orderType[type]}}</text>
						<u-icon name="arrow-right" color="#B0B0B0" size="18" v-if="orderInfo.from == 1"></u-icon>
					</view>
				</view>	
			</view>
			
			<view class="list-box">
			<!-- 	<view class="list-row">
					<text class="exp">{{orderInfo.hospital_name}}</text>
					<view class="row-right" @click="$navto('/pages/order/hospital-info?id=' + orderInfo.hospital_id)" v-if="orderInfo.hospital_name">
						<text class="right-text">医院简介</text>
						<u-icon name="arrow-right" color="#B0B0B0" size="18"></u-icon>
					</view>
				</view> -->
				<!-- <view class="list-row" v-if="orderInfo.from == 1 || orderInfo.from == 3"> -->
				<view class="list-row" >
					<text class="exp">医院</text>
					<view class="row-right" @click="showHospital = true">
						<text class="right-text">{{orderInfo.hospital_name || '请选择医院'}}</text>
						<u-icon name="arrow-right" color="#B0B0B0" size="18"></u-icon>
					</view>
				</view>
				<view class="list-row" :class="{'list-column':item.type=='textarea'}" v-for="(item,index) in dataList" :key="index">
					<text class="exp">{{item.title}}</text>
					<view class="row-right" v-if="item.type=='textarea'">
						<u--textarea v-model="item.value" :placeholder="item.placeholder"></u--textarea>
					</view>
					<view class="row-right" v-else-if="item.type == 'input'">
						<u--input border="none" v-model="item.value" :placeholder="item.placeholder" placeholderStyle="{color:'#808080'}" inputAlign="right" @input="changeInput($event,item.key)"></u--input>
					</view>
					<view class="row-right" v-else @click="tapRow(item,index)">
						<text class="right-text">{{item.value || item.placeholder}}</text>
						<u-icon name="arrow-right" color="#B0B0B0" size="18"></u-icon>
					</view>
				</view>
			</view>
			
			<view class="tips">
				<view class="tip-title">
					<image src="/static/images/order/danger.png" mode="aspectFit"></image>
					<text>注意事项</text>
				</view>
				<view class="tip-content">
					<text>{{attentions}}</text>
				</view>
			</view>
			
			<view class="button-box">
				<view class="clause-box">
					<u-checkbox-group v-model="checked" @change="changeServe">
						<u-checkbox activeColor="#55B5FF" shape="circle" :name="1"></u-checkbox>
					</u-checkbox-group>
					<text>我已认真阅读预约相关条例</text>
					<text class="blue" @click="$navto(`/pages/mine/privacy/privacy?type=6`)">《服务条款同意书》</text>
				</view>
				<view class="button-pay" @click="createOrder">立即下单（￥{{orderInfo.money}}）</view>
			</view>
		</view>
		<u-datetime-picker ref="datetimePicker" :show="show" v-model="time" mode="datetime" :minDate="minDate" :formatter="formatter" @confirm="changeData" @cancel="show=false"></u-datetime-picker>
<!-- 报告信息 -->
		<u-popup :show="reportPop" mode="bottom">
			<view class="pop-content">
				<view class="pop-head">
					<text class="pop-close" @click="reportPop=false">取消</text>
					<text class="pop-title">报告类型</text>
					<text class="pop-sure blue" @click="checkReport('reportType','activeReport')">确定</text>
				</view>
				<view class="options_box">
					<view @click="changeReport(idx,'activeReport')" class="option_item" :class="{'select':idx == activeReport}" v-for="(item,idx) in reportType" :key="idx">{{item}}</view>
				</view>
			</view>
		</u-popup>
		<!-- 病案用途 -->
		<u-popup :show="drugPop" mode="bottom">
			<view class="pop-content">
				<view class="pop-head">
					<text class="pop-close" @click="drugPop=false">取消</text>
					<text class="pop-title">病案用途</text>
					<text class="pop-sure blue" @click="checkReport('drugType','activeDrug')">确定</text>
				</view>
				<view class="options_box">
					<view @click="changeReport(idx,'activeDrug')" class="option_item" :class="{'select':idx == activeDrug}" v-for="(item,idx) in drugType" :key="idx">{{item}}</view>
				</view>
			</view>
		</u-popup>
		<!-- 选择医院 -->
		<u-picker :show="showHospital" :columns="hospitalArr" keyName="name" @confirm="checkHospital" @cancel="showHospital=false"></u-picker>
		<!-- 专享归属 -->
		<u-picker :show="showExclusive" :columns="exclusiveArr" keyName="name" @confirm="checkExclusive" @cancel="showExclusive=false"></u-picker>
	</view>
</template>

<script>
	import stepBar from "@/components/step-bar/step-bar.vue"
	import orderData from './components/orderType.js'
	import {areaClass} from '@/config/config.js'
	import {mapGetters} from "vuex";
import indexList from "../../uni_modules/uview-ui/libs/config/props/indexList.js";
	let requestBol = false;
	function deepCopy(value){//全局工具函数,其他组件也可直接使用
		if (value instanceof Function) return value
		else if (value instanceof Array) {
			var newValue = []
			for (let i = 0; i < value.length; ++i) newValue[i] = deepCopy(value[i])
			return newValue
		} else if (value instanceof Object) {
			var newValue = {}
			for (let i in value) newValue[i] = deepCopy(value[i])
			return newValue
		} else return value
	}
	export default {
		data() {
			return {
				orderType: ['', '全程陪诊', '半天陪诊', '代办问诊', '取送报告', '代办买药', '诊前挂号', '专享陪诊','延时服务'],
				type: 1,
				serve: '',
				checked: [],
				dataList: [],
				time: Number(new Date()),
				show: false,
				opreateIndex: 0,
				reportPop: false,
				activeReport: 0,
				reportType: ['CT结果', '检测报告', '验血报告', '其他'],
				hospitalName: '广东第一大医院',
				showHospital: false,
				hospitalArr: [],
				showExclusive: false,
				exclusiveArr: [[
					{
						name: '老人专享'
					}, {
						name: '儿童专享'
					}, {
						name: '孕妇专享'
					}
				]],
				drugPop: false,
				drugType: ['处方药', '非处方药'],
				activeDrug: 0,
				orderInfo: {},
				minDate: Date.now(),
				attentions: '',
				serviceContent: ''
			};
		},
		components: {
			stepBar
		},
		computed:{
			...mapGetters(["curAddress"])
		},
		onLoad(option){
			this.orderInfo=this.$store.state.user.orderInfo//获取订单信息
			this.type=this.orderInfo.project_type//获取订单类型
			this.dataList=deepCopy(orderData[this.type])//写死的
			this.defaultHosp=this.orderInfo.hospital_id?this.orderInfo.hospital_id-1:0
			console.log(this.orderInfo,"this.orderinfo")
			console.log(this.defaultHosp,"默认选中医院")
			// if (this.orderInfo.from == 1 || this.orderInfo.from == 3) {//1项目2医院3服务人员
				//获取医院列表
				this.getHospital()
				// 微信小程序需要用此写法
				this.$nextTick(() => {
					this.$refs.datetimePicker.setFormatter(this.formatter)
				})
			// }
		},
		//页面展示，整合store数据和 dataList数据
		onShow() {
			this.updateOrder();
			this.getProjectInfo();
		},
	
		methods:{
			//初始化页面数据
			updateOrder(){
				this.dataList?.forEach(item=>{
					if(this.orderInfo[item.key]){
						item.value = this.orderInfo[item.key];
						if (item.key == 'hospital_one') {
							item.value = this.orderInfo['hospital_one'] + ' ' + this.orderInfo['hospital_two']
						}
					}
				})
			},
			//获取医院列表
			getHospital(){
				let params={
					pageNum:1,
					pageSize:100
				}
				if (areaClass == '1') {
					params.city_code = this.curAddress.cityCode
				} else if (areaClass == '2') {
					params.area_code = this.curAddress.areaCode
				}
				this.$request('/applet/index/page/getHomeProduct',params).then(res=>{
					if(res.code==200){
						this.hospitalArr.push(res.data)
						console.log(this.hospitalArr,"hospitalarr")
					}
					else{
						uni.$toast(res.msg)
					}
				})
			},
			//获取项目信息
			getProjectInfo(){
				let params={
					id:this.type
				}
				if (areaClass == '1') {
					params.city_code = this.curAddress.cityCode
				} else if (areaClass == '2') {
					params.area_code = this.curAddress.areaCode
				}
				this.$request('/applet/index/page/getProjectDetail',params).then(res=>{
					if(res.code==200){
						this.attentions=res.data.matters_need_attention//注意事项
						this.serviceContent=res.data.service_guidelines//服务指引
					}
					else{
						uni.$toast(res.msg)
					}
				})
			},
			//点击信息列表
			tapRow(item,idx){
				this.opreateIndex=idx
				switch(item.event){
					case'picker'://如果是选择器
					if(item.type=='time'){
						this.show=true
					}
					if(item.type=='report'){
						this.reportPop=true
					}
					if(item.type=='exclusive'){
						this.showExclusive=true
					}
					if(item.type=='drug'){
						this.drugPop=true
					}break;
					case'link'://跳转
					if(item.type=='patient'){//选择就诊人
						this.$navto('/pages/mine/patient/select-patient?type=1',true)
					}else if(item.type=='depart'){//选择就诊科室
						if(!this.orderInfo.hospital_id){
							return uni.$toast('请先选择医院')
						}
						this.$navto('/pages/order/department?id='+this.orderInfo.hospital_id)
					}else if(item.type=='address'){//收货地址
						this.$navto('/pages/mine/address/address?type=1')
					}
					break;
					default:break;
				}
			},
			formatter(type, value) {
				if (type === 'year') {
					return `${value}年`
				}
				if (type === 'month') {
					return `${value}月`
				}
				if (type === 'day') {
					return `${value}日`
				}
				if (type === 'hour') {
					return `${value}时`
				}
				if (type === 'minute') {
					return `${value}分`
				}
				return value
			},
			//选择时间
			changeData(e){
				const timeFormat = uni.$u.timeFormat
				this.time=timeFormat(e.value,'yyyy-mm-dd hh:MM')
				this.dataList[this.opreateIndex].value=this.time
				this.$store.commit('SET_ORDER_DATA',{
					hope_time:this.time
				})
				this.show=false
			},
			// 改变选中状态
			changeReport(idx, key) {
				this[key] = idx;
			},
			//确定-选择报告  
			checkReport(key, key2) {
				this.$store.commit('SET_ORDER_DATA', {
					report: this[key][this[key2]]
				})
				this.dataList[this.opreateIndex].value = this[key][this[key2]]
				this.reportPop = false;
				this.drugPop = false;
			},
			//选择医院
			checkHospital(e){
				console.log(e,"选医院")
				this.$store.commit('SET_ORDER_DATA',{
						hospital_name:e.value[0].name,
						hospital_id:e.value[0].id
				})
				this.showHospital=false
			},
			//专属陪护
			checkExclusive(e){
				this.$store.commit('SET_ORDER_DATA',{
					exclusive:e.value[0].name
				})
				this.dataList[this.opreateIndex].value=e.value[0].name
				this.showExclusive=false
			},
			//输入框输入
			changeInput(val,key){
				let obj={}
				obj[key]=val
				this.$store.commit('SET_ORDER_DATA',obj)
			},
			//勾选须知
			changeServe(e){
				this.checked=e
			},
			//去查看详情
			toProjectDetail(){
				if(this.orderInfo.from=1){
					this.$navto('/pages/order/project-info?type='+this.type)
				}
			},
			//提交订单
			createOrder(){
				//有无选择医院
				if(!this.orderInfo.hospital_id){
					return uni.$toast('请先选择医院')
				}
				let name=''
				this.dataList.forEach(ele=>{
					if (!ele.value && ele.must) {//必填但没填
						name = ele.title;
					}
					if (!ele.value && !ele.must) {//非必填但没填就空值
						let obj = {};
						obj[ele.key] = '';
						this.$store.commit('SET_ORDER_DATA', obj)
					}
				})
				if(name){
					return uni.showToast({
						title:'请选择'+name,
						icon:'none'
					})
				}
				if(!this.checked.length){
					return uni.showToast({
						title: '请勾选同意书',
						icon: 'none'
					})
				}
				let data ={
					member_id:uni.getStorageSync('userinfo').id
				}
				Object.assign(data, this.orderInfo);
				data.from = undefined;
				if (requestBol) {
					return uni.$toast('正在请求中~')
				}
				requestBol = true
				this.$request('/applet/index/order/createOrder',data).then(res=>{
					requestBol=false
					if(res.code==200){
						uni.$toast('订单提交成功！')
						setTimeout(()=>{
							this.$navto('/pages/order/payment?orderId='+res.data.id)//跳去付款页面
						},1000)
					}else{
						uni.$toast(res.msg)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.create-box{
	background-color: #F6F7FB;
}
.content{
	position: relative;
	top:-110rpx;
	padding: 0 30rpx;
	box-sizing: border-box;
	padding-bottom: 130rpx;
}
.list-box{
	width: 690rpx;
	background-color: #ffffff;
	box-shadow: 0rpx 2rpx 18rpx 0rpx rgba(0,0,0,0.06);
	border-radius: 20rpx;
	margin-bottom: 30rpx;
	box-sizing: border-box;
	padding:0 30rpx;
	.list-row{
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 110rpx;
		&+.list-row{//&是父选择器引用，表示.list-row
			border-top: 1px solid #EBEBEB;
// 			为所有紧跟在另一个 .list-row 之后的 .list-row 元素添加顶部边框
// 即：除第一个 .list-row 外，其他所有相邻的 .list-row 都会有一个上边框）
		}
		.exp {
			color: #333333;
			font-weight: bold;
			max-width: 400rpx;
			//超出省略
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		&.list-column {
			height: 422rpx;
			flex-direction: column;
			align-items: flex-start;
			justify-content: flex-start;
			padding-top: 40rpx;
		}
	}
	.row-right{
		display: flex;
		align-items: center;
		.right-text{
			font-size: 30rpx;
			font-weight: 500;
			color: #808080;
			max-width: 200rpx;
			//超出省略
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			&.black {
				color: #333333;
			}
		}
		/deep/.u-icon{
			margin-left: 8rpx;
		}
		/deep/ .u-textarea {
			width: 590rpx;
			height: 280rpx;
			background: #F3F3F3;
			border-radius: 18rpx;
			border: none;
			margin-top: 30rpx;
		}
	}
}


.tips{
	width: 690rpx;
	background: #FFFFFF;
	box-shadow: 0rpx 2rpx 18rpx 0rpx rgba(0, 0, 0, 0.06);
	border-radius: 0rpx 0rpx 20rpx 20rpx;
	//margin-left: 30rpx;
	margin-top: 20rpx;
	padding: 46rpx 30rpx 50rpx 30rpx;
	box-sizing: border-box;
	
	.tip-title {
		display: flex;
		align-items: center;
	
		image {
			width: 36rpx;
			height: 36rpx;
			margin-right: 20rpx;
		}
	
		text {
			font-size: 30rpx;
			font-weight: bold;
			color: #333333;
		}
	}
	
	.tip-content {
		margin-top: 40rpx;
		font-size: 26rpx;
		font-weight: 500;
		color: #666666;
	}
}

.button-box {
		position: fixed;
		bottom: 0;
		left: 0;

		.clause-box {
			width: 750rpx;
			height: 96rpx;
			background: #FFFFFF;
			box-shadow: 0rpx 2rpx 20rpx 0rpx rgba(0, 0, 0, 0.06);
			display: flex;
			font-size: 26rpx;
			justify-content: center;
			align-items: center;

		}

		.button-pay {
			width: 750rpx;
			height: 90rpx;
			background: $uni-color-primary;
			line-height: 90rpx;
			text-align: center;
			color: #FFFFFF;
			font-size: 36rpx;
			font-weight: 500;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
		}
	}

	.blue {
		color: $uni-color-primary;
	}

	.pop-content {
		height: 388rpx;
		background-color: #FFFFFF;
		padding: 50rpx 30rpx;
		font-weight: bold;
		font-size: 30rpx;
		color: #333333;

		.pop-head {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.pop-title {
				font-size: 36rpx;
			}
		}

		.options_box {
			margin-top: 80rpx;
			display: flex;
			flex-wrap: wrap;

			.option_item {
				width: 214rpx;
				height: 72rpx;
				background: #EBEBEB;
				border-radius: 18rpx;
				text-align: center;
				line-height: 70rpx;
				margin-right: 24rpx;
				margin-bottom: 20rpx;

				&:nth-child(3) {
					margin-right: 0;
				}

				&.select {
					background-color: $uni-color-primary;
					color: #FFFFFF;
				}
			}
		}

	}
</style>
