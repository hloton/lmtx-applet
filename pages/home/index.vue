<template>
	<view class="page">
		<scroll-view
			:scroll-y="true"
			:style="{ height: scrollToHeight }"
			:enable-back-to-top="true"
			@scrolltolower="onArriveBottom"
			:refresher-enabled="atTopThe"
			:refresher-triggered="inRequest"
			@refresherrefresh="refresherrefresh"
			scroll="scroll"
		>
			<top-navigation bgColor="'transparent'" :isBack="false" :isFix="true">
				<template #left-slot>
					<view class="nav" @tap="$navto('/pages/home/region')">
						<image src="/static/images/home/position.png"></image>
						{{ areaClass == '1' ? curAddress.cityName || '请选择位置' : curAddress.areaName || '请选择位置' }}
					</view>
				</template>
			</top-navigation>
			<!-- 顶部背景图片 -->
			<image src="/static/images/home/bg.png" class="title-bg"></image>
			<view style="padding: 30rpx;padding-bottom: 0;">
				<u-swiper radius="12" height="300rpx" :list="swiperList" @click="clickswiper" keyName="ad_image_url" indicator indicatorMode="dot" circular></u-swiper>
				
				
				<view class="classification">
					<image @click="toProjectDetail(item)" :src="`/static/images/home/class${item.type}.png`"
					 v-for="(item, index) in typeArr" :key="item.type"></image>
				</view>
				<!-- <view class="accompany" @tap="$navto('/pages/home/accompany')"><image :src="$getImgUrl() + '/upload/image/accompany.png'"></image></view> -->
				<view class="hospital">
					<!-- <view class="title" :style="{top: `${statusHeight}px`}" id="tabs">
						<view class="shuxian"></view>
						
					</view> -->
					<view class="title" id="tabs">
						<u-tabs
							:list="navList"
							:activeStyle="{
								color: '#55B5FF',
								fontWeight: 'bold',
								transform: 'scale(1.05)'
							}"
							:current="navCurrent"
							@click="navClick"
							@change="navChange"
						></u-tabs>
					</view>
					<!-- 医院列表 -->
					<view class="hospital-list" v-if="navId == 0">
						
						<view class="hospital-item" v-for="(item, index) in list" :key="index" @click="$navto('/pages/order/hospital-info?id=' + item.id)">
						
<!-- 						<view class="hospital-item" v-for="(item, index) in list" :key="index" @tap="toProjectList(item.id, item.name)"> -->
							<image :src="$getImgUrl() + item.ext1" class="logo" mode="scaleToFill"></image>
							<view class="right">
								<view class="hospital-name">{{ item.name }}</view>
								<view class="label">
									<view class="level">{{ item.label }}</view>
									<view>{{ item.type }}</view>
								</view>
								<view class="introduce">
									<text style="color: #666;">重点科室</text>
									:{{ item.department }}
								</view>
								<view class="address">
									<image src="/static/images/home/address.png" class="icon"></image>
									地址：{{ item.province }}{{ item.city }}{{ item.area }}{{ item.address }}
								</view>
							</view>
						</view>
						<u-empty mode="data" v-if="!list.length" text="暂无医院"></u-empty>
						<u-loadmore :status="status" v-if="list.length" />
					</view>

					<!-- 服务人员列表 -->
					<view class="attendant-list" v-if="navId == 1">
						<view class="attendant-item" v-for="(item, index) in staffList" :key="index" @tap="toStaff(item)">
							<image :src="$getHost() + item.profile" class="avatar" mode="scaleToFill"></image>
							<view class="right">
								<view class="attendant-name">{{ item.name }}</view>
								<view class="right-text u-flex u-row-around u-flex-2">
									<view>年龄:{{ item.old }}</view>
									<u-line direction="col" length="17" color="#333333"></u-line>

									<view>{{ item.sex }}</view>
									<u-line direction="col" length="17" color="#333333"></u-line>
									<view>{{ item.length_old }}年工龄</view>
								</view>
								<view class="profile u-flex u-col-top">
									<view class="profile-left">个人简介：</view>
									<view class="profile-right u-line-2">{{ item.brief }}</view>
									<!-- <text class="u-line-1" style="width: 50%;">个人简介：</text>
									<text class="u-line-2">
											{{ item.brief }}
									</text> -->
								</view>
							</view>
						</view>
						<u-empty mode="data" v-if="!staffList.length" text="暂无服务人员"></u-empty>
						<u-loadmore :status="status" v-if="staffList.length" />
					</view>
					<view class="copyright" v-if="companyName">©技术支持：{{ companyName }}</view>
				</view>
			</view>
		</scroll-view>
		<!-- 客服 -->
		<image src="/static/images/home/service.png" class="service" @tap="serviceShow = true"></image>
		<u-popup :show="serviceShow" @close="serviceShow = false" bgColor="transparent" closeOnClickOverlay>
			<view class="popup">
				<view class="popup-top">
					<view class="public" style="border-bottom: 1px solid #EBEBEB;">
						<view class="left">
							<image src="/static/images/home/phone.png" class="icon"></image>
							陪诊客服
						</view>
						<text class="phone" @tap="call">{{ serviceMobile }}</text>
					</view>
					<view class="public">
						<view class="left">
							<image src="/static/images/home/message.png" class="icon"></image>
							在线客服
						</view>
						<view>
							<!-- #ifdef MP-WEIXIN -->
							<button @contact="wxcontact" type="default" open-type="contact">在线联系</button>
							<!-- #endif -->
							<!-- #ifdef APP-PLUS -->
							<button @tap="notOpen" type="default">在线联系</button>
							<!-- #endif -->
						</view>
					</view>
				</view>
				<view class="cancel" @tap="serviceShow = false">取消</view>
			</view>
		</u-popup>
	</view>
</template>


<script>
import {mapGetters} from 'vuex'
import  {companyName,areaClass} from '@/config/config.js'
export default {
	data() {
		return {
			swiperList:[],//轮播图列表
			serviceShow:false,//客服弹窗
			list:[],//医院列表
			navCurrent:0,
			staffList:[],//医护人员
			status:'loadmore',//医院加载状态
			staffstatus:'loadmore',
			typeArr:[],
			pageNum:1,
			pageSize:10,
			staffNum:1,
			staffSize:10,
			notfound:false,//医院是否存在
			notfoundstaff:false,
			notdata: false, //是否还有数据未拉取
			notstaffdata: false,
			serviceMobile: '',
			inRequest: false, //是否在下拉状态
			atTopThe: true, //是否在顶部
			isRefresh: false, //是否在刷新中
			companyName: companyName, //公司名称
			areaClass: areaClass, //选择城市等级
			navList: [
				{
					name: '医院列表'
				},
				{
					name: '服务人员列表'
				}
			],
			navId: 0
		};
	},
	computed:{
		...mapGetters(['curAddress']),//可通过this.curAddress访问到store中定义的curAddress getter的值。

		scrollToHeight(){
			let temp = `calc(${this.screenHeight}px - ${this.statusHeight}px - 40rpx)`;
			return temp
		}
	},watch: {
		curAddress(newval) {
			console.log("设置地址", newval)
			this.getHospital(true);
			this.getProject();
			this.getConfigPhone();
			this.getSwiper();
			// this.queryServeStaffList();
		}
	},
	created() {
		console.log("当前地址", this.curAddress);
		this.getHospital();
		this.getSwiper();
		this.getProject();
		this.getConfigPhone();
		//this.queryServeStaffList();
		
		// if (!this.curAddress.cityCode) {
		// 	this.$navto('/pages/home/region');
		// 	return false;
		// }
		
	},
	methods:{
		//
		onArriveBottom() {
			if (this.notdata) return;
			this.getHospital();
		},
		//获取轮播图
		getSwiper() {
			this.$request('/applet/index/page/getAd').then(res => {
				if (res.code == 200) {
					this.swiperList = res.data.map(ele => {
						ele.ad_image_url = this.$getHost() + ele.ad_image_url;
						return ele;
					});
				}
			});
		},
		//点击轮播图
		clickswiper(e){
			//this.$navto('/pages/home/chaperone?id='+this.swiperList[e].ad_id)
		},
		//滚动方法
		scroll(e){
			if(e.detail.scrollTop===0){
				this.atTopThe=true;//在顶部就刷新
			}else{
				this.atTopThe=false
			}
		},
		onArrivrBotom(){
			if(this.notdata)return
			this.getHospital()
		},
		//获取项目
		getProject(){
			let params={
				is_extra:'2'
			}
			if(areaClass=='1'){
				params.city_code = this.curAddress.cityCode;
			}else if (areaClass == '2') {
				params.area_code = this.curAddress.areaCode;
			}
			console.log('城市参数', params);
			this.$request('/applet/index/page/getProject',params).then(res=>{
				console.log('获取项目列表', res);
				if (res.code == 200) {
					this.typeArr = res.data;
							
				} else {
					uni.$toast(`获取项目列表失败${res.msg}`);
				}
			})
		},
		//获取医院列表
		getHospital(clearData=false){//默认参数cleardata是false，传true那就是true
			if(clearData){
				this.pageNum=1
				this.notfound=false
				this.list=[]
			}
			this.status = 'loadmore';
			let params = {
				pageNum: this.pageNum,
				pageSize: this.pageSize
			};
			if(areaClass=='1'){
				params.city_code=this.curAddress.cityCode
			}else if (areaClass == '2') {
				params.area_code = this.curAddress.areaCode;
			}
			this.$request('/applet/index/page/getHomeProduct', params).then(res => {
				if (res.success) {
					if (res.data == 0 && this.pageNum == 1) {
						this.notfound = true;
						return;
					} else {
						this.list = [...this.list, ...res.data];
						if (this.list.length >= res.total_rows) {
							this.status = 'nomore';
							this.notdata = true;
							return;
						}
						this.pageNum++;
					}
				} else {
					this.$toast(res.msg);
				}
			});
			
		},
		//服务人员列表
		queryServeStaffList() {
			this.staffList = [];
			let param = {
				page_num: this.staffNum,
				page_size: this.staffSize,
				city_code: this.curAddress.cityCode
			};
			this.$request('/applet/staff/queryServeStaffList', param).then(res => {
				console.log('获取服务人员列表', res);
				if (res.success) {
					if(res.data.list == 0 && this.staffNum ==1) {
						this.notfound = true;
						return;
					}else {
						this.staffList = [...this.staffList, ...res.data.list];
						if(this.staffList.length >= res.data.totalRow) {
							this.staffstatus = 'nomore';
							this.notstaffdata = true;
							return;
						}
						this.staffNum++;
					}
					
				}else {
					this.$toast(res.msg)
				}
			});
		},
		toProjectList(id, name) {
			this.$store.commit('SET_ORDER_DATA', {
				hospital_id: id,
				hospital_name: name,
				city_code: this.curAddress.cityCode,
				from: 2 //1-项目  2-医院
			});
			this.$navto('/pages/home/project-list');
		},
		toStaff(data) {
			this.$store.commit('SET_ORDER_DATA', {
				city_code: this.curAddress.cityCode,
				from: 3 ,//1-项目  2-医院 3-服务人员
				
			});
			this.$navto('/pages/home/staff-info' + uni.$u.queryParams(data));
		},
		//
		toCreat(item) {//创建订单（点击分类栏里的项目去新建一个订单(后面要改成项目详情页)
			if (item.type) {
				
				if(item.type == 9){
					//跳转富文本页面
					this.$navto('/pages/home/chaperone');
				}else{
					if ((item.is_price && !item.original_price) || (!item.is_price && !item.price)) {
						return uni.$toast('该服务暂无开通');
					}
					this.$store.commit('SET_ORDER_DATA', {
						project_type: item.id,
						from: 1, //1-项目  2-医院
						city_code: this.curAddress.cityCode,
						money: item.is_price ? item.original_price : item.price
					});
					this.$navto('/pages/order/creat-order', true);
					
				}
				
				
			} else {
				//跳转富文本页面
				this.$navto('/pages/home/chaperone');
			}
		},
		
		//点击项目去项目详情页
		toProjectDetail(item) {
			if(item.type!='6')
				this.$navto('/pages/order/project-info?type=' + item.type)
			else
			this.$navto('/pages/home/accompany')
		},
		//下拉刷新方法
		async refresherrefresh(){
			if(!this.isRefresh){
				this.isRefresh=true
				this.inRequest=true
				if(this.navId==0){//医院列表
					await this.getHospital(true)
					this.notdata=false
				}
				if(this.navId == 1) {
					await this.queryServeStaffList()
					this.notstaffdata = false;
				}
			}
			//请求成功后修改下拉刷新状态
			setTimeout(() => {
				this.inRequest = false;
				this.isRefresh = false;
			}, 300);
			
		},
		notOpen() {
			this.$toast('该功能暂未开放，敬请期待');
		},
		//点击nav
		navClick(item) {
			console.log('点击nav', item, this.navCurrent);
		},
		navChange(e) {
			console.log('change', e);
			this.navId = e.index;
		},
		//获取就诊陪客服
		getConfigPhone() {
			this.$request('/applet/index/page/getConfig', {
				type: '4'
			}).then(res => {
				if (res.code == 200) {
					this.serviceMobile = res.data.content;
				}
			});
		},
		//拨打客服电话
		call() {
			uni.makePhoneCall({
				phoneNumber: this.serviceMobile
			});
		},
		//微信客服回调
		wxcontact(e) {
			console.log(e);
		},
	}
}
</script>

<style lang="scss" scoped>
.page {
	background-color: #ffffff;
	position: relative;
}

.nav {
	display: flex;
	font-size: 32rpx;
	font-weight: bold;
	color: #ffffff;

	image {
		width: 40rpx;
		height: 40rpx;
		margin-right: 18rpx;
	}
}

.title-bg {
	position: absolute;
	top: 0;
	width: 750rpx;
	height: 450rpx;
}

.service {
	position: fixed;
	bottom: 200rpx;
	right: 10rpx;
	width: 108rpx;
	height: 108rpx;
	z-index: 99;
}

.classification {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	margin-top: 40rpx;

	image {
		width: 218rpx;
		height: 146rpx;
		margin-bottom: 20rpx;
		border-radius: 10%;
	}
}

.accompany {
	margin-top: 10rpx;
	margin-bottom: 10rpx;

	image {
		width: 100%;
		height: 180rpx;
		border-radius: 20rpx;
	}
}

.hospital {
	.title {
		position: sticky;
		width: 100%;
		display: flex;
		align-items: center;
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
		padding: 20rpx 0 40rpx 10rpx;
		background-color: #fff;
		z-index: 9;

		.shuxian {
			width: 9rpx;
			height: 32rpx;
			background: #55b5ff;
			border-radius: 5rpx;
			margin-right: 20rpx;
		}
	}

	.hospital-list,
	.attendant-list {
		padding-bottom: 50rpx;

		.hospital-item,
		.attendant-item {
			height: 260rpx;
			background: #ffffff;
			box-shadow: 0px 2rpx 16rpx 0px rgba(0, 0, 0, 0.16);
			border-radius: 20rpx;
			margin-bottom: 30rpx;
			padding: 30rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;

			.logo,
			.avatar {
				width: 200rpx;
				height: 200rpx;
				margin-right: 26rpx;
			}
			.avatar {
				border-radius: 20rpx;
			}

			.right {
				height: 100%;
				display: flex;
				justify-content: space-between;
				flex-direction: column;
				width: 404rpx;

				.hospital-name,
				.attendant-name {
					max-width: 400rpx;
					font-size: 32rpx;
					color: #333333;
					margin-right: 30rpx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				.hospital-name {
					font-weight: bold;
				}
				.attendant-name {
					font-weight: 500;
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
						color: #ff4d4d;
						margin-right: 46rpx;
					}
				}
				.right-text {
					color: #333333;
					font-weight: 400;
					font-size: 26rpx;
					max-width: 238rpx;
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
				.profile {
					width: 407rpx;
					height: 52rpx;
					font-size: 24rpx;
					font-weight: 400;
					color: #666666;
					.profile-left {
						display: inline-block;
						white-space: nowrap;
					}
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
	}
}

.popup {
	padding: 30rpx;

	.popup-top {
		width: 100%;
		height: 261rpx;
		background: #ffffff;
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		box-sizing: border-box;
		padding: 0 30rpx;

		.public {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 43rpx 0;
			box-sizing: border-box;
			font-size: 30rpx;
			font-weight: bold;

			.left {
				display: flex;
				justify-content: space-between;
				align-items: center;

				image {
					width: 44rpx;
					height: 44rpx;
					margin-right: 30rpx;
				}

				.phone {
					color: #55b5ff;
				}
			}

			button {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 178rpx;
				height: 60rpx;
				background: #ff4d4d;
				border-radius: 12rpx;
				font-size: 28rpx;
				font-weight: bold;
				color: #ffffff;
			}
		}
	}

	.cancel {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 96rpx;
		background: #ffffff;
		border-radius: 48rpx;
		font-size: 36rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #333333;
		margin-top: 30rpx;
	}
}

.copyright {
	font-size: 28rpx;
	color: #333333;
	margin: 20rpx 0;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
