<template>
	<view class="create-box">
		<top-navigation bgColor="#ffffff" :isBack="false" :isFix="true">
			<template #left-slot>
				我的订单
			</template>
		</top-navigation>
		<view>
			<u-sticky offset-top="0">
				<view class="head-tabs">
					<u-row justify="space-between">
						<u-col span="2"  v-for="(item,index) in tabs" @click="changeTab(index)">
							<view class="tab-text" :class="{select:index==activeIndex}">{{item.title}}</view>
						</u-col>
					</u-row>  
				</view>
			</u-sticky>
			<u-empty mode="data" v-if="!islogin" text="未登录" marginTop="100"></u-empty>
			<swiper :current="activeIndex" :style="{height:scrollToHeight}" @change="swiperChange">
				<swiper-item v-for="(item,idx) in tabs.length" :key="idx">
					<u-empty mode="data" v-if="notFound" :text="notFoundTxt" marginTop="100">
					</u-empty>
					<scroll-view scroll-y="true" style="height: 100%;" @scrolltolower="scrolltolower">
						<view class="list-box">
							<view class="list-item" v-for="(item,index) in list" 
							:key="item.id" @click="toDetail(item.id)">
								<image class="avatar" src="/static/images/mine/default.png" mode="aspectFit"></image>
								<view class="list-right">
									<view class="title">{{item.hospital_name}}</view>
									<view class="patient">就诊人：{{ item.patients_name }}</view>
									<view class="time">{{ item.order_time }}</view>
								</view>
								<view class="right-side">
									<view class="button-box" v-if="item.status == 0" @click.stop="payOrder(item)">去支付</view>
									<view class="text blue" v-if="item.status == 1">进行中</view>
									<view class="button-box blue" v-if="item.status == 2 && type == 'member'" @click.stop="evaluteOrder(item)">立即评价</view>
									<view class="text blue" v-if="item.status == 3 || (item.status == 2 && type == 'staff')">已完成</view>
									<view class="text" v-if="item.status == 4">已取消</view>
								</view>
							</view>
							<u-loadmore :status="status" v-if="!notFound"></u-loadmore>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
		<u-modal :show="earnestShow" title="提示" content='首次查看订单,需要缴纳保证金哦~' confirmText="去缴纳"  cancelText="取消" showCancelButton confirmColor="#55B5FF" @cancel="earnestShow = false" @confirm="confirm"></u-modal>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex';
	export default {
		props:{
			type:{
				type:String,
				default:'member'
			}
		},
		data() {
			return {
				tabs:[
					{
						title:'全部',
						key:'5'
					},
					{
						title:'待支付',
						key:'0'
					},
					{
						title:'进行中',
						key:'1'
					},
					{
						title:'待评价',
						key:'2'
					},
					{
						title:'已完成',
						key:'3'
					},
					{
						title:'已取消',
						key:'4'
					},
				],
				activeIndex:0,
				list:[],
				pageNum:1,
				pageSize:10,
				totalPage:0,
				notFound:false,
				notFoundTxt:'暂无订单',
				status:'loadmore',
				earnestShow:false
			};
		},
		computed:{
			...mapGetters(['staffinfo','islogin']),
			scrollToHeight(){
				let temp=`calc(${this.screenHeight}px - ${this.statusHeight}px - 277rpx - 98rpx)`
				return temp
			}
		},
		created() {
			if(this.type=='staff'){//陪诊师
				this.tabs=[
					{
						title:'全部订单',
						key:'5'
					},
					{
						title:'进行中',
						key:'1'
					},
					{
						title:'已完成',
						key:'3'
					},
					{
						title:'已取消',
						key:'4'
					}
				]
			}
			this.init()
		},
		methods:{
			//初始化数据
			init(){
				this.pageNum=1;
				this.notFound=false;
				this.status='loadmore'
				this.getOrderList(true)
			},
			//切换tab
			changeTab(index){
				this.activeIndex=index
			},
			//视图容器切换
			swiperChange(e){
				this.activeIndex=e.detail.current
				this.init()
			},
			//获取订单列表
			getOrderList(refresh=false){
			if(!this.islogin)return;
				let data={
					pageSize:this.pageSize,
					pageNum:this.pageNum
				}
				if(this.type=='member'){
					Object.assign(data,{
						member_id:uni.getStorageSync('userinfo').id,
						status:this.tabs[this.activeIndex].key
					})
				}else{
					Object.assign(data,{
						staff_id:uni.getStorageSync('staffinfo'),
						staff_status:this.tabs[this.activeIndex].key
					})
				}
				this.status='loadmore'
				console.warn(data)
				this.$request('/applet/staff/queryOrderList',data).then(res=>{
					console.log('获取订单',res)
					if(res.code==200){
						if(refresh)this.list=[]
						this.list=[...this.list,...res.data]
						this.totalPage=Math.ceil(res.total_rows/this.pageSize)
						if(!res.total_rows){
							this.notFound=true
							this.notFoundTxt='暂无订单'
						}
						if(this.totalPage==this.pageNum){
							this.status='nomore'
						}
					}else{
						this.notFound=true
						this.notFoundTxt=res.msg
					}
					uni.stopPullDownRefresh()//停止当前页面下拉刷新
				})
			},
			refresher() {
				this.init();
			},
			//上拉加载
			scrolltolower(){
				if(this.pageNum==this.totalPage){
					this.status='nomore'
					return
				}
				this.pageNum++
				this.getOrderList()
			},
			//去详情页
			toDetail(id){
				console.log(id,"iddd")
				if(this.type=='staff'){
					if(this.staffinfo.staff.is_earnest==0){
						this.earnestShow=true
						return
					}
				}
				this.$navto(`/pages/order/order-details?id=${id}&type=${this.type}`)
				
			},
			//去支付页
			peyOrder(data){
				this.$navto(`/pages/order/payment?id=${data.id}`)
			},
			//去评价
			evaluteOrder(data){
				this.$navto(`/pages/order/evaluate?id=${data.id}&form=order`)
			},
			
			confirm() {
				console.log("点击确定")
				this.$emit("myEvent", 'confirm')
			},
		}
	}
</script>

<style lang="scss" scoped>
.head-tabs {
	width: 750rpx;
	height: 88rpx;
	background: #ffffff;
	padding: 0 30rpx;
	box-sizing: border-box;

	.tab-text {
		color: #333333;
		font-size: 28rpx;
		font-weight: 500;
		text-align: center;
		line-height: 88rpx;

		&.select {
			color: $uni-color-primary;
			position: relative;

			&::after {
				content: '';
				display: inline-block;
				position: absolute;
				width: 37rpx;
				height: 6rpx;
				background-color: $uni-color-primary;
				border-radius: 6rpx;
				bottom: 0rpx;
				left: 50%;
				margin-left: -18rpx;
			}
		}
	}
}

.list-box {
	padding: 30rpx;
	padding-bottom: 0;
}

.list-item {
	width: 690rpx;
	height: 210rpx;
	background: #ffffff;
	box-shadow: 0rpx 2rpx 18rpx 0rpx rgba(0, 0, 0, 0.06);
	border-radius: 20rpx;
	margin-bottom: 30rpx;
	border-width: 0;
	display: flex;
	align-items: center;
	padding: 0 30rpx;
	box-sizing: border-box;

	.avatar {
		width: 100rpx;
		height: 100rpx;
		border-radius: 100rpx;
	}

	.list-right {
		margin-left: 30rpx;
		height: 140rpx;
		width: 350rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.title {
			width: 290rpx;
			height: 40rpx;
			font-size: 30rpx;
			font-weight: bold;
			color: #333333;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.patient {
			color: #666666;
			font-size: 28rpx;
			font-weight: 500;
		}

		.time {
			font-size: 26rpx;
			font-weight: 500;
			color: #adadad;
			line-height: 36rpx;
		}
	}

	.button-box {
		width: 150rpx;
		height: 62rpx;
		background: #ff4d4d;
		border-radius: 18rpx;
		color: #ffffff;
		text-align: center;
		line-height: 58rpx;
		font-size: 28rpx;

		&.blue {
			background-color: $uni-color-primary;
		}
	}

	.text {
		font-size: 28rpx;
		font-weight: 500;
		color: #ff4d4d;
		margin-top: -68rpx;
		margin-left: 30rpx;

		&.blue {
			color: $uni-color-primary;
		}
	}
}
</style>
