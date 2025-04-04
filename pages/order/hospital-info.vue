<template>
	<view>
		<view
		  class="background-blur"
		    :style="{ backgroundImage: `url(${$getHost()+info.ext1})` }">
		</view>
		<top-navigation bgColor="transparent">
			<template #left-slot>
				医院简介
			</template>
		</top-navigation>
		<view class="content">
			<view class="hospital-item">
				 
						
				<image :src="$getHost()+info.ext1" class="logo"></image>
				<view class="right">
					<view class="hospital-name">
						{{info.name}}
					</view>
					<view class="label">
						<view class="level">
							{{info.label}}
						</view>
						<view >
							{{info.type}}
						</view>
					</view>
					<view class="address" @click="seeLocation">
						<image src="/static/images/home/address.png" class="icon"></image>
						地址：{{info.province}}{{info.city}}{{info.city}}{{info.address}}
					</view>
				</view>
			</view>
			<view class="card">
				<text class="key">重点科室：</text>
				<text>{{info.department}}</text>
			</view>
			<view class="card">
				<text class="key">医院简介：</text>
				<!-- <text>{{info.intro}}</text> -->
				<u-read-more 
				    :show-height="100" 
				    :toggle="true"
				    close-text="展开阅读全文"
				    open-text="收起"
				    color="#55b5ff"
				    :text-indent="0"
				    :font-size="15"
				  >
				    <text class="intro-text">{{ info.intro }}</text>
				  </u-read-more>
			</view>
			<view class="card">
				<text class="project-text">在线预约您需要的服务</text>
				<view class="project-card" v-for="(item,idx) in projectArr" :key="idx" @click="toCreate(item)">
					
							<view 
							    class="image-container"
							    :style="{backgroundImage: `url(/static/images/home/accompany${idx+1}.png)`}"
							  >
							    <!-- 图片渐变层 -->
							    <view class="image-gradient"></view>
							  </view>
							  
							  
							<view class="card-content">
								<view style="display: flex; align-items: center;">
									<!-- <image :src="`/static/images/home/accompany${idx+1}.png`" class="logo"></image>	 -->
									<view class="type">
										<view class="type-name">
											{{item.name}}
										</view>	
										<view class="label_box">
											<view class="label" v-for="ele in item.label && item.label.split(';')">
												<image src="/static/images/home/check.png"></image>
												{{ele}}
											</view>
										</view>
									</view>	
								</view>
								<!-- 这个放在医院详情页 -->
								<button class="book-btn">预约</button>						</view>
							</view>
			</view>

		</view>
	</view>
</template>

<script>
	import {
		areaClass
	} from '@/config/config.js'
	import {
		mapGetters
	} from "vuex";
	export default {
		data() {
			return {
				hospital:'',
				info:{},
				projectArr: []
			};
		},
		onLoad(option){
			this.hospitalId=option.id
			this.getHospitalDetail()
			this.getProjectList();
		},computed:{
			...mapGetters(['curAddress'])
		},
		methods:{
			getProjectList() {
				let params = {
					is_extra: '1'
				}
				if (areaClass == '1') {
					params.city_code = this.curAddress.cityCode
				} else if (areaClass == '2') {
					params.area_code = this.curAddress.areaCode
				}
				this.$request('/applet/index/page/getProject', params).then(res => {
					if (res.code == 200) {
						this.projectArr = res.data;
					}
				})
			},
			toCreate(data) {
				if ((data.is_price && !data.original_price) || (!data.is_price && !data.price)) {
					return uni.$toast('该服务暂无开通')
				}
				this.$store.commit('SET_ININT_ORDER', {}) //初始化创建订单数据
				this.$store.commit('SET_ORDER_DATA', {
					project_type: data.id,//这里是项目id
					money: data.is_price ? data.original_price : data.price, //是原价还是现价
					from: 1,
					hospital_name:this.info.name,
					hospital_id:this.info.id
				})
				this.$navto('/pages/order/create-order', true)
			},
			getHospitalDetail() {
				this.$request('/applet/index/page/getHospitalDetail', {
					id: this.hospitalId
				}).then(res => {
					if (res.code == 200) {
						this.info = res.data//医院信息
					} else {
						uni.$toast(res.msg);
					}
				})
			},
			seeLocation(){
				let coordinate = this.info.coordinate.split(',')//获取坐标
				let info = this.info
				console.log(coordinate,"coordinate")
				// #ifdef MP-WEIXIN
				uni.openLocation({//使用应用内置地图查看位置
					latitude: Number(coordinate[0]),
					longitude: Number(coordinate[1]),
					name: info.name,
					address: info.address,
					success: function () {
						console.log('success');
					}
				});
				// #endif
				
				// #ifdef APP-PLUS
				let url = '';
				if (plus.os.name == 'Android') {
					//判断是安卓端
					plus.nativeUI.actionSheet({
							//选择菜单
							title: '选择地图应用',
							cancel: '取消',
							buttons: [{
								title: '腾讯地图'
							}, {
								title: '百度地图'
							}, {
								title: '高德地图'
							}]
						},
						function (e) {
							switch (e.index) {
								//下面是拼接url,不同系统以及不同地图都有不同的拼接字段
							case 1:
								//注意referer=xxx的xxx替换成你在腾讯地图开发平台申请的key
								url = `qqmap://map/geocoder?coord=${Number(coordinate[0])},${Number(coordinate[1])}&referer=xxx`;
								break;
							case 2:
								url = `baidumap://map/marker?location=${Number(coordinate[0])},${Number(coordinate[1])}&title=${info.name}&coord_type=gcj02&src=andr.baidu.openAPIdemo`;
								break;
							case 3:
								url = `androidamap://viewMap?sourceApplication=appname&poiname=${info.name}&lat=${Number(coordinate[0])}&lon=${Number(coordinate[1])}&dev=0`;
								break;
							default:
								break;
							}
							if (url != '') {
								url = encodeURI(url);
								//plus.runtime.openURL(url,function(e){})调起手机APP应用
								plus.runtime.openURL(url, function (e) {
									plus.nativeUI.alert('本机未安装指定的地图应用');
								});
							}
						}
					);
				} else {
					// iOS上获取本机是否安装了百度高德地图，需要在manifest里配置
					// 在manifest.json文件app-plus->distribute->apple->urlschemewhitelist节点下添加
					//（如urlschemewhitelist:["iosamap","baidumap"]）
					plus.nativeUI.actionSheet({
							title: '选择地图应用',
							cancel: '取消',
							buttons: [{
								title: '腾讯地图'
							}, {
								title: '百度地图'
							}, {
								title: '高德地图'
							}]
						},
						function (e) {
							switch (e.index) {
							case 1:
								url = `qqmap://map/geocoder?coord=${Number(coordinate[0])},${Number(coordinate[1])}&referer=xxx`;
								break;
							case 2:
								url = `baidumap://map/marker?location=${Number(coordinate[0])},${Number(coordinate[1])}&title=${info.name}&content=${info.address}&src=ios.baidu.openAPIdemo&coord_type=gcj02`;
								break;
							case 3:
								url = `iosamap://viewMap?sourceApplication=applicationName&poiname=${info.name}&lat=${Number(coordinate[0])}&lon=${Number(coordinate[1])}&dev=0`;
								break;
							default:
								break;
							}
							if (url != '') {
								url = encodeURI(url);
								plus.runtime.openURL(url, function (e) {
									plus.nativeUI.alert('本机未安装指定的地图应用');
								});
							}
						}
					);
				}
				// #endif
				// #ifdef H5
				uni.showToast({
					duration: 1500,
					title: 'H5页面不支持唤起APP',
					icon: 'none'
				});
				// #endif
			}
			
		}
	}
</script>

<style lang="scss" scoped>
page{
	background: #F6F7FB;
}
 .background-blur {
		      position: absolute;
		      top: 0;
		      left: 0;
		      right: 0;
		      bottom: 0;
		      background-size:contain;
		      background-position: top;
			  background-repeat: no-repeat;
		      filter: blur(15rpx);  // 模糊效果
		      opacity: 0.9;         // 降低透明度
		      z-index: -1;
		    }
.content{
	padding: 20rpx;
	.hospital-item{
		height: 260rpx;
		background-color: #FFFFFF;
		box-shadow: 0px2rpx 16rpx 0px rgba(0,0,0,0.16);
		border-radius: 20rpx;
		margin-bottom: 30rpx;
		padding: 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		
			 
		.logo{
			width: 200rpx;
			height: 200rpx;
			margin-right: 30rpx;
		}
		
		.right{
			height: 100%;
			display: flex;
			justify-content: space-between;
			flex-direction: column;
			.hospital-name {
				max-width: 400rpx;
				font-size: 32rpx;
				font-weight: bold;
				color: #333333;
				margin-right: 30rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
			
			.label {
				display: flex;
				align-items: center;
				font-size: 26rpx;
				font-weight: 500;
				color: #333333;
			
				.level {
					font-size: 26rpx;
					font-weight: bold;
					color: #FF4D4D;
					margin-right: 46rpx;
				}
			}
			.introduce {
				max-width: 400rpx;
				font-size: 24rpx;
				font-weight: 500;
				color: #808080;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
			
			.address {
				max-width: 400rpx;
				font-size: 26rpx;
				font-weight: 500;
				color: #666666;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			
				.icon {
					width: 32rpx;
					height: 32rpx;
					margin-right: 20rpx;
				}
			}
		}
	}
	.card {
		width: 100%;
		padding: 50rpx 30rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		box-shadow: 0px 2rpx 18rpx 0px rgba(0, 0, 0, 0.06);
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		font-size: 28rpx;
		color: #666666;
		line-height: 44rpx;

		.key {
			font-weight: bold;
			color: #333333;
		}
	}
	}
	.project-text{
		color: #000000;
		font-size: 40rpx;
		font-weight: 600;
		margin-bottom: 50rpx;
		display: block;
	}
	.project-card{
		background-color: #fff; // 备用背景色
					position: relative;
					overflow: hidden; /* 添加这行 */
					width: 100%;
					height: 180rpx;
					box-shadow: 0px 2rpx 18rpx 0px rgba(0, 0, 0, 0.06);
					border-radius: 20rpx;
					padding: 48rpx 34rpx;
					box-sizing: border-box;
					display: flex;
					justify-content: space-around;
					align-items: center;
					margin-bottom: 30rpx;
		.image-container {
		   position: absolute;
		   left: 0;
		   top: 0;
		   bottom: 0;
		   width: 300rpx; // 控制图片显示宽度
		   background-size: cover;
		   background-position: left center;
		   .image-gradient {
		     width: 100%;
		     height: 100%;
		     background: linear-gradient(
		       to right,
		       rgba(255,255,255,0) 0%,
		       rgba(255,255,255,1) 75%
		     );
		  
		   }
		   }
		   
		   .card-content {
		     position: relative; /* 确保内容在顶层 */
		     z-index: 99;
		     width: 100%;
		     height: 100%;
		     padding: 48rpx 34rpx;
		     box-sizing: border-box;
		     display: flex;
		     justify-content: space-around;
		     align-items: center;
		   	margin-left:180rpx;
		   }
		   			.logo {
		   				width: 76rpx;
		   				height: 76rpx;
		   				margin-right: 32rpx;
		   			}
		   
		   			.type {
		   				// height: 90rpx;
		   				display: flex;
		   				justify-content: space-between;
		   				flex-direction: column;
		   
		   				.type-name {
		   					font-size: 32rpx;
		   					font-weight: bold;
		   					color: #333333;
		   				}
		   
		   				.label_box {
		   					display: flex;
		   					flex-wrap: wrap;
		   					width:320rpx;
		   				}
		   
		   				.label {
		   					display: flex;
		   					align-items: center;
		   					font-size: 24rpx;
		   					font-weight: 500;
		   					color: #666666;
		   					margin-right: 20rpx;
		   					margin-top: 20rpx;
		   
		   					image {
		   						width: 28rpx;
		   						height: 28rpx;
		   						margin-right: 9rpx;
		   					}
		   				}
		   			}
		   			.book-btn{
		   				background-color:#74c0fc;
		   				color:#ffffff;
		   				width: 120rpx;
		   				height:70rpx;
		   				align-items:center;
		   				font-size:15px;
		   				font-weight:600;
		   				line-height:70rpx;
		   			}
		   		}
	
	

</style>
