<template>
	<view>
		<top-navigation bgColor="#ffffff" :isFix="true" :isBack="true">
			<template #left-slot>
				地区选择
			</template>
		</top-navigation>
		
		<view v-if="areaClass==1" class="deparent-box"  :style="{height:scrollToHeight}">
			<scroll-view enable-flex enable-back-to-top scroll-y class="left-box" :style="{height:scrollToHeight}">
				<view class="tab-item" :class="{'select':idx == activeIndex}" v-for="(item,idx) in deparentArr" :key="idx">
					<view @click="changeDeparent(idx)">{{item.province}}</view>
				</view>
			</scroll-view>
			<scroll-view scroll-y  enable-back-to-top scroll-with-animation class="right-box" :style="{height:scrollToHeight}">
				<view class="deparent-item" v-for="(item,idx) in deparentArr[activeIndex].child" :key="idx">
					<view @click="checkDeparent(idx)">{{item.city}}</view>
				</view>
			</scroll-view>
		</view>
		<view v-if="arwaClass==2">//区县
			<view class="top-title">
				<view>省</view>
				<view>市</view>
				<view>区</view>
			</view>
			<picker-view :indicator-style="'height: 6.25vh;'" @change="bindChange" :value="selectIndex">
				<picker-view-column>
					<view class="item" v-for="(item,index) in locationList[0]" :key="index">{{item.province}}</view>
				</picker-view-column>
				<picker-view-column>
					<view class="item" v-for="(item,index) in locationList[1]" :key="index">{{item.city}}</view>
				</picker-view-column>
				<picker-view-column>
					<view class="item" v-for="(item,index) in locationList[2]" :key="index">{{item.area}}</view>
				</picker-view-column>
			</picker-view>
		</view>
		<view class="button-pay" @tap="checkDeparent">确定</view>
	</view>
</template>

<script>
	import {mapGetters} from 'vuex'
	import { areaClass } from '@/config/config';
	export default {
		data() {
			return {
				areaClass:areaClass,//选择区域的等级
				deparentArr:[
					{
						province: '广东省',
						child: [
						    {city:'广州市',
							cityid:'440100'},
							{city:'佛山市',
							cityid:'440600'}
						]
					}
				],
				activeIndex:0,
				//三级联动开始
				locationList:[],
				provinceIndex: 0,
				cityIndex: 0,
				areaIndex: 0,
				selectIndex: [] ,//选中的
				haveAddress: uni.getStorageSync('cityCode')
				//三级联动结束
				
			};
		},
		onLoad(){
			console.log("选地址")
			// this.getProvince();
			// this.getCity();
		},computed:{
			...mapGetters(['isLogin','curAddress']),
			scrollToHeight(){
				let temp = `calc(${this.screenHeight}px - ${this.statusHeight}px - 180rpx)`
				return temp
			}
		},
		
		methods:{
			getProvince() {//获取省份
				this.$request('/applet/index/page/g', {}).then(res => {
					console.log("获取省市", res)
					if (res.code == 200) {
			
						this.deparentArr = res.data
						
						//用于客户不选择地址的情况
						console.log("是否有地址", this.curAddress.cityCode)
						if(!this.curAddress.cityCode) {
						let data = {
							cityCode: res.data[0].child[0].cityid,
							cityName: res.data[0].child[0].city
						}
						this.$store.commit('SET_CUR_ADDRESS', data)
						uni.setStorageSync('cityCode', data)
						}
						
						
						// 省市区选择需要三级联动
						// if (areaClass === '2') {
						// 	this.locationList.push(res.data)
						// 	this.locationList.push(res.data[0].child)
						// 	this.locationList.push(res.data[0].child[0].child)
						// 	console.log(this.locationList)
						// }
			
					}
				})
			},
			changeDeparent(idx){
				this.activeIndex=idx
			},
			checkDeparent(index){
				let data
				if(areaClass =='1'){//城市
					data={
						cityCode: this.deparentArr[this.activeIndex].child[index].cityid,
						cityName: this.deparentArr[this.activeIndex].child[index].city
					}
				}else if(areaClass=='2'){
					const city=this.locationList[1][this.cityIndex]
					const area=this.locationList[2][this.activeIndex]
					data={
						cityCode:city.cityid,
						cityName: city.city,
						areaCode: area.areaid,
						areaName: area.area
					}
				}
				this.$store.commit('SET_CUR_ADDRESS',data)
				uni.setStorageSync('cityCode',data)
				console.log(data,"citycode")
				uni.navigateBack({})
			},
			bindChange(e) {
				this.provinceIndex = e.detail.value[0]
				this.cityIndex = e.detail.value[1]
				this.areaIndex = e.detail.value[2]
			}
		},
	   watch: {
	   	provinceIndex: {
	   		handler(newData) {
	   			this.locationList[1] = this.locationList[0][newData].child
	   			this.locationList[2] = this.locationList[1][0].child
	   			this.selectIndex = [newData, 0, 0]
	   			this.locationList = [...this.locationList]
	   		}
	   	},
		// 相当于
		//provinceIndex(newData) {   		
	 //   			this.locationList[1] = this.locationList[0][newData].child
	 //   			this.locationList[2] = this.locationList[1][0].child
	 //   			this.selectIndex = [newData, 0, 0]
	 //   			this.locationList = [...this.locationList]
	   		
	 //   	},
	   	cityIndex: {
	   		handler(newData) {
	   			this.locationList[2] = this.locationList[1][newData].child
	   			this.selectIndex = [this.provinceIndex, newData, 0]
	   			this.areaIndex = 0
	   			this.locationList = [...this.locationList]
	   		}
	   	}
	   },
	}
</script>

<style lang="scss" scoped>
	picker-view{
		width: 100%;
		height: 50vh;
	}
	.item{
		line-height: 6.25vh;
		text-align: center;
	}
	.deparent-box{
		width: 750rpx;
		height: 100vh;
		display: flex;
		.left-box {
			width: 240rpx;
			height: 100vh;
			background-color: #F6F7FB;
		
			.tab-item {
				min-height: 100rpx;
				padding-left: 1px;
				border-bottom: 1rpx solid #D9DEEE;
				font-size: 28rpx;
				font-weight: 500;
				color: #333333;
				width: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				text-align: center;
		
				&.select {
					background-color: #FFFFFF;
					font-weight: bold;
					position: relative;
		
					&::before {
						content: '';
						display: inline-block;
						width: 12rpx;
						height: 100%;
						background: #74c0fc;
						position: absolute;
						left: 0;
						top: 0;
					}
				}
			}
		}
		
		.right-box {
			flex: 1;
		
			.deparent-item {
				width: 100%;
				padding-left: 58rpx;
				box-sizing: border-box;
				height: 100rpx;
				line-height: 100rpx;
				font-size: 30rpx;
				font-weight: bold;
				color: #333333;
		
				view {
					width: 452rpx;
					//超出省略
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}
		}
	}
	.top-title {
		width: 690rpx;
		height: 100rpx;
		background: #F1EFF2;
		margin: 30rpx auto 10rpx auto;
		display: flex;
		justify-content: center;
		align-items: center;
	
		view {
			flex: 1;
			text-align: center;
			font-size: 30rpx;
			font-weight: bold;
			color: #333333;
		}
	}
	
	.button-pay {
		position: fixed;
		bottom: 0rpx;
		width: 750rpx;
		height: 96rpx;
		background: $uni-color-primary;
		line-height: 94rpx;
		text-align: center;
		color: #FFFFFF;
		font-size: 36rpx;
		font-weight: 500;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>
