<template>
	<view class="detail-box">
		<top-navigation bgColor="#ffffff" :isBackFunction="false" @click="checkTap">
			<template #left-slot>
				订单详情
			</template>
		</top-navigation>
		<step-bar v-if="!detailForm" :active="active" :cancel="cancel" :stepArr="stepArr"></step-bar>
        <view class="detail-content">
        	<order-status v-if="!detailFrom" :orderData="orderDetail"></order-status>
			<order-address v-if="orderDetail.type==4 || orderDetail.type==5"    :orderData="orderDetail" ></order-address>
			<view v-if="detailForm" :style="{paddingTop:CustomBar+'px'}"></view>
			<order-appointment :orderData="orderDetail"></order-appointment>
			<order-info :isStaff="isStaff" :orderData="orderDetail"></order-info>
		</view>	
		<view class="bottom-btn cancel-btn" v-if="orderDetail.status == 0" @click="cancelOrder">取消订单</view>
		<view class="bottom-btn" v-if="orderDetail.status == 2 && detailType != 'staff'" @click="$navto(`/pages/order/evaluate?id=${orderDetail.id}`)">立即评价</view>
		<view class="bottom-btn" v-if="orderDetail.status == 1 && detailType == 'staff' && detailFrom != 'orderHall'" @click="doneOrder">确定完成服务</view>
		<view class="bottom-btn" v-if="detailFrom == 'orderHall'" @click="orderReceiving(orderDetail.id)">接单</view>
	</view>
</template>

<script>
	import stepBar from '@/components/step-bar/step-bar.vue';
	import orderData from './components/orderType.js';
	import orderInfor from './components/info.vue'
	import orderStatus from './components/status.vue'
	import orderAddress from './components/address.vue';
	import orderAppointment from './components/appointment.vue'
	import { mapGetters } from 'vuex';
	export default {
		data() {
			return {
				CustomBar:this.CustomBar+15,
				active:0,
				cancel:false,
				isStaff:false,
				orderId:'',
				detailType:'',
				orderDetail:{},
				stepArr: [
					{
						title: '填写信息'
					},
					{
						title: '在线支付'
					},
					{
						title: '专人陪诊'
					},
					{
						title: '服务完成'
					}
				],
				detailFrom: ''
			};
		},
		components: {
			stepBar,
			orderStatus,
			orderAddress,
			orderAppointment,
			orderInfor
		},
		computed:{
			...mapGetters(['staffinfo']),
		},
		onLoad(option){
			console.warn('接受详情',option,this.CustomBar)
			this.orderId=option.id
			this.detailType=option.type
			this.detailFrom=option.from
			if(this.detailType=='staff'){//陪诊人员视角
				this.stepArr=[//陪诊师的进度条只有两点
					{title:'陪诊'},
					{title:'服务完成'}
				]
				this.isStaff=true
			}
		},
		onShow() {
			this.getOrderDetail()
		},
		methods:{
			getOrderDetail(){
				this.$request('/applet/staff/queryOrderDetail',{
					id:this.orderId
				}).then(res=>{
					console.log('订单详情',res)
					if(res.code==200){
						this.orderDetail=res.data
						if(this.detailType=='staff'){
							if(this.orderDetail.status==3||this.orderDetail.status==2){
								//已完成或者待评价
								this.active=1//服务完成
							}else this.active=0
						}else{//用户视角
							if(this.orderDetail.status==1&&this.orderDetail.staff_id){
								this.active=1
							}else this.active=this.orderDetail.status
						}
						if(this.orderDetail.status==4){//已取消
							this.cancel=true
						}
					}else{
						uni.$toast(res.msg)
					}
				})
			},
			//取消订单
			cancelOrder(){
				uni.$showModal({
					title:'提示',
					content:'确定要取消订单吗？'
				}).then(()=>{
					this.$request('/applet/index/order/cancelOrder',{
						id:this.orderDetail.id
					}).then(res=>{
						if(res.code==200){
							uni.$toast('订单取消成功')
							this.getOrderDetail()
						}else{
							uni.$toast(res.msg)
						}
					})
				})
			},
			//陪诊师完成服务
			doneOrder(){
				uni.$showModal({
					title:'提示',
					content:'确定完成服务了吗？'
				}).then(()=>{
					this.$request('/applet/staff/doneOrder',{
						id:this.orderDetail.id
					}).then(res=>{
						if(res.code==200){
							uni.$toast('恭喜你，服务完成')
							setTimeout(()=>{
								this.checkTap()
							},1500)
						}else{
							uni.$toast(res.msg)
						}
					})
				})
			},
			//陪诊师接单
			orderReceving(id){
				let params={
					id:id,
					staff_id:this.staffinfo.staff.staff_id
				}
				console.warn("接单", param)
				this.$request('/applet/index/order/orderReceiving', param, "接单中...").then(res => {
					if(res.success) {
						this.$toast('已接单')
						setTimeout(() => {
							this.checkTap();
						}, 1500);
					}
					
					console.log("接单", res)
				})
			},
			//点击左上退出箭头
			checkTap(){
				if(this.detailType=='staff'){
					uni.reLaunch({
						url:'/pages/mine/staff/staff'//回到陪诊师首页
					})
				}else {
				uni.reLaunch({
					url: '/pages/index/index?type=1'//回到首页订单页
				});
			}
			}
		}
	}
</script>

<style lang="scss">
* {
	box-sizing: border-box;
}
.detail-box{
	background-color: #f6f7fb;
}
.detail-content {
	position: relative;
	top: -110rpx;
	padding: 0 30rpx;
	box-sizing: border-box;
	padding-bottom: 100rpx;

	/deep/ .box {
		width: 690rpx;
		background: #ffffff;
		box-shadow: 0rpx 2rpx 18rpx 0rpx rgba(0, 0, 0, 0.06);
		border-radius: 20rpx;
		padding: 40rpx 30rpx;
		padding-bottom: 0rpx;
		box-sizing: border-box;
	}

	/deep/ .unpaid-txt {
		font-size: 34rpx;
		font-weight: bold;
		color: #333333;
	}

	/deep/ .list-box {
		margin-top: 40rpx;
	}

	/deep/ .list-row {
		display: flex;
		justify-content: space-between;
		font-size: 30rpx;
		font-weight: 500;
		height: 80rpx;

		.exp {
			color: #666666;
		}

		.row-right {
			flex: 1;
			text-align: right;
			color: #333333;
		}
	}
}

.bottom-btn {
	position: fixed;
	bottom: 30rpx;
	left: 30rpx;
	width: 690rpx;
	height: 96rpx;
	background: #55b5ff;
	box-shadow: 0rpx 2rpx 18rpx 0rpx rgba(0, 0, 0, 0.06);
	border-radius: 48rpx;
	text-align: center;
	font-size: 36rpx;
	font-weight: 500;
	color: #ffffff;
	line-height: 94rpx;

	&.cancel-btn {
		background: #ffffff;
		color: #333333;
	}
}
</style>
