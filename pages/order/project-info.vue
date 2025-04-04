<template>
	<view>
		<top-navigation bgColor="#ffffff">
			<template #left-slot>
				详情页
			</template>
		</top-navigation>
		<view class="bg-box">
			<image :src="$getImgUrl()+info.ext1" class="title-logo"></image>
			<text class="bg-title">{{info.name}}</text>
		</view>
		<view class="content">
			<view class="type-info">
				<view class="price" v-if="show">
					<view class="present-price">
						<text class="num">{{info.is_price ? info.original_price : info.price}}</text>元/次
					</view>
					<view class="original-price" v-if="!info.is_price">
						{{info.original_price}}元/次
					</view>
				</view>
				<view class="info">
					{{info.recommend}}
				</view>
			</view>
			
		<view class="service-content">
			<view class="title">
				<text :class="{'select':checkServe == 0}" @click="checkServe = 0">服务内容</text>
				<text :class="{'select':checkServe == 1}" @click="checkServe = 1">服务须知</text>
			</view>
			<view class="service">
				<image :src="checkServe ? $getImgUrl() + info.service_guidelines : $getImgUrl() + info.service_content" mode="widthFix"></image>
				<text v-if="checkServe == 1">退订协议
1、如需退订,请在就诊前一个工作日下午6：00前联系客服退订，如若超过退订时间或用户未按约定时间到达约定地点的，不予退订。
2、服务退订成功后用户可重新下单。</text>
			</view>
			
		</view>
		
		<view class="evaluation">
			<view class="title">
				评价
			</view>
			<view class="eval">
				<view class="eval-item" v-for="(item,index) in evaluteArr" :key="index" @click="$navto(`/pages/order/evaluate-detail?id=${item.id}`)">
					<view class="top">
						<view class="left">
							<image src="/static/images/mine/default.png" mode="aspectFit"></image>
							<view class="uername">
								{{item.nickname}}
							</view>
						</view>
						<view class="right">
							<view class="score" style="margin-right: 30rpx;">
								<view class="num">
									{{item.service_grade.toFixed(1)}}
								</view>
								服务评分
							</view>
							<view class="score">
								<view class="num">
									{{item.staff_grade.toFixed(1)}}
								</view>
								服务人员评分
							</view>
						</view>
					</view>
					<view class="bottom">
						<view class="public">
							<text class="key">服务评价：</text>
							<text class="value">{{item.service_evaluate}}</text>
						</view>
						<view class="public">
							<text class="key">服务人员评价：</text>
							<text class="value">{{item.staff_evaluate}}</text>
						</view>
						<view class="time">
							{{item.evaluate_time}}
						</view>
					</view>
				</view>
				<u-loadmore :status="status" v-if="!notFound" />
				<u-empty mode="list" v-if="notFound" :text="notFoundTxt"></u-empty>
			</view>
		</view>
		
		<view style="height:26rpx;"></view>
		<view class="reservation" @click="toCreateOrder" v-if="show">
			立即预约￥{{info.is_price ? info.original_price : info.price}}
		</view>
		</view>
	</view>
</template>

<script>
	import { areaClass } from '../../config/config';
	import {mapGetters} from "vuex"
	export default {
		data() {
			return {
				projectId: '',
				info: {},
				show: true,
				checkServe: 0,
				evaluteArr: [],
				pageNum: 1,
				pageSize: 10,
				totalPage: 0,
				notFound: false,
				notFoundTxt: '暂无订单',
				status: 'loadmore',
				from: '',
				staffId: ''
			};
		},
		onLoad(option){
			this.projectId=option.id || option.type//传参过来的项目id
			if(option.from){
				this.from = option.from
				//1项目2医院3服务人员
			}
			if(option.staffId){
				this.staffId=option.staffId
			}
			// if(!option.id){
			// 	this.show=false
			// }
			this.getProjectInfo()
			this.evaluteArr=[]
			this.pageNum = 1;
			this.notFound = false;
			this.status = 'loadmore'
			this.getEvaluteList();
		},
		computed: {
			...mapGetters(["curAddress"])//通过this.curAddress访问到store中定义的curAddress getter的值。
		},
		methods:{
			getProjectInfo(){
				let params={
					id:this.projectId
				}
				if(areaClass=='1'){//来自城市
					params.city_code=this.curAddress.cityCode
				}else if (areaClass == '2') {
					params.area_code = this.curAddress.areaCode
				}
				this.$request('/applet/index/page/getProjectDetail',params).then(res=>{
					console.log("获取项目详细信息", res)
					if (res.code == 200) {
						this.info = res.data;
					} else {
						uni.$toast(res.msg);
					}
				})
			},
			//获取评价列表
			getEvaluteList(){
				this.status='loadmore'
				this.$request('/applet/index/page/getEvaluate',{
					project_id:this.projectId,
					pageNum:this.pageNum,
					pageSize:this.pageSize
				}).then(res=>{
					if(res.code==200){
						this.evaluteArr=[...this.evaluteArr,...res.data]
						this.totalPage=Math.ceil(res.total_rows/this.pageSize)
						if(!res.total_rows){
							this.notFound=true
							this.notFoundTxt='暂无评价'
						}
						if(this.totalPage==this.pageNum){
							this.status='nomore'
						}
					}
					else{
						this.notFound=true
						this.notFoundTxt='暂无评价'
					}
				})
			},
			//创建订单
			toCreateOrder(){
				this.orderInfo=JSON.parse(JSON.stringify(this.$store.state.user.orderInfo))
				this.$store.commit('SET_ININT_ORDER', {}) //初始化创建订单数据
				if(this.from == '3') {//来自医院
						this.$store.commit('SET_ORDER_DATA', {
					hospital_id: this.orderInfo.hospital_id,
					hospital_name: this.orderInfo.hospital_name,
					city_code: this.orderInfo.city_code,
					from: this.from ? this.from : 2, //1-项目  2-医院
					project_type: this.info.type,
					money: this.info.is_price ? this.info.original_price : this.info.price, //是原价还是现价
					staff_id: this.staffId
				})
				}else {
					this.$store.commit('SET_ORDER_DATA', {
						hospital_id: this.orderInfo.hospital_id,
						hospital_name: this.orderInfo.hospital_name,
						city_code: this.orderInfo.city_code,
						from: this.from ? this.from : 2, //1-项目  2-医院
						project_type: this.info.type,
						money: this.info.is_price ? this.info.original_price : this.info.price, //是原价还是现价
						
					})
				}
							
				this.$navto('/pages/order/create-order')
			}
		}
	}
</script>

<style lang="scss">
page {
		background: #F6F7FB;
	}
	.bg-box {
		position: relative;
	
		.title-logo {
			width: 100%;
			height: 500rpx;
		}
	
		.bg-title {
			position: absolute;
			left: 74rpx;
			top: 60rpx;
			font-size: 50rpx;
			font-weight: bold;
			color: #FFFFFF;
			line-height: 36rpx;
			text-shadow: 0px 2rpx 16rpx rgba(0, 0, 0, 0.16);
			z-index: 10;
		}
	}
	.content {
		position: relative;
		bottom: 70rpx;
		padding: 0 20rpx;
	
		.type-info {
			width: 100%;
			background: #FFFFFF;
			box-shadow: 0px 2rpx 18rpx 0px rgba(0, 0, 0, 0.06);
			border-radius: 20rpx;
			padding: 60rpx 44rpx;
			box-sizing: border-box;
	
			.price {
				display: flex;
				align-items: baseline;
				margin-bottom: 40rpx;
	
				.present-price {
					font-size: 24rpx;
					font-weight: 500;
					color: #333333;
					margin-right: 30rpx;
	
					.num {
						font-size: 42rpx;
						font-weight: bold;
						color: #FF4D4D;
						margin-right: 10rpx;
					}
				}
	
				.original-price {
					font-size: 24rpx;
					font-weight: 500;
					text-decoration: line-through;
					color: #BAB9B9;
				}
			}
	
			.info {
				font-size: 28rpx;
				font-weight: 500;
				color: #666666;
			}
		}
	
		.service-content {
			margin-top: 44rpx;
	
			.title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
				margin: 0 0 24rpx 20rpx;
	
				.select {
					color: #55B5FF;
				}
	
				text {
					margin-right: 80rpx;
				}
			}
	
			.title-cur {
				color: #333333;
			}
	
			.service {
				width: 716rpx;
				background: #FFFFFF;
				box-shadow: 0px 2rpx 18rpx 0px rgba(0, 0, 0, 0.06);
				border-radius: 20rpx;
				padding: 30rpx;
				box-sizing: border-box;
	
				image {
					width: 100%;
					height: auto;
				}
			}
		}
	
		.evaluation {
			margin-top: 30rpx;
	
			.title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333333;
				margin: 0 0 45rpx 20rpx;
			}
	
			.eval {
				margin: 0 10rpx;
	
				.eval-item {
					width: 100%;
					background: #FFFFFF;
					box-shadow: 0px 2rpx 18rpx 0px rgba(0, 0, 0, 0.06);
					border-radius: 20rpx;
					margin-bottom: 30rpx;
					padding: 40rpx 30rpx;
					box-sizing: border-box;
	
					.top {
						display: flex;
						align-items: center;
						justify-content: space-between;
						border-bottom: 1px solid #EBEBEB;
						padding-bottom: 40rpx;
	
						.left {
							display: flex;
							align-items: center;
							justify-content: space-between;
	
							image {
								width: 76rpx;
								height: 76rpx;
								margin-right: 24rpx;
							}
	
							.uername {
								width: 200rpx;
								font-size: 30rpx;
								font-weight: bold;
								color: #333333;
								overflow: hidden;
								white-space: nowrap;
								text-overflow: ellipsis;
							}
						}
	
						.right {
							display: flex;
							align-items: center;
	
							.score {
								display: flex;
								align-items: center;
								justify-content: space-between;
								flex-direction: column;
								font-size: 24rpx;
								font-weight: 500;
								color: #333333;
	
								.num {
									font-size: 30rpx;
									font-weight: bold;
									color: #FF4D4D;
									margin-bottom: 10rpx;
								}
							}
						}
					}
	
					.bottom {
						margin-top: 50rpx;
	
						.public {
							font-size: 28rpx;
							margin-bottom: 40rpx;
							// width: 300rpx;
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
	
							.key {
								color: #333333;
								font-weight: bold;
							}
	
							.value {
								color: #666666;
	
							}
						}
	
						.time {
							font-size: 26rpx;
							font-weight: 500;
							color: #ADADAD;
						}
					}
				}
			}
		}
	
		.reservation {
			display: flex;
			align-items: center;
			justify-content: center;
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 96rpx;
			background: #55B5FF;
			font-size: 36rpx;
			font-weight: 500;
			color: #FFFFFF;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
		}
	}
</style>
