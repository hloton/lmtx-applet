<template>
	<view>
		<top-navigation bgColor="'transparent" :imgSrc="$getHost()+accompanyImg">
			<template #left-slot>
				全部服务
			</template>
		</top-navigation>
		
	
		
		<view class="content">
			<view class="card" v-for="(item,idx) in projectArr" :key="idx" @click="toProjectDetail(item)">
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
<!-- 				<button class="book-btn">预约</button> -->
				<u-icon name="arrow-right" color="#b0b0b0"></u-icon>
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
				accompanyImg:'',
				projectArr:[]
			};
		},
		computed:{
			...mapGetters(['curAddress'])
		},
		onLoad(){
			this.getConfig()
			this.getProjectList();
		},
		methods:{
			//点击项目去项目详情页
		toProjectDetail(item) {
				this.$navto('/pages/order/project-info?type=' + item.type)	
		},
			//获取背景图
			getConfig(){
				this.$request('/applet/index/page/getConfig',{
					type:'5'
				}).then(res=>{
					if(res.success){
						this.accompanyImg=res.data.content
					}
				})
			},
			getProjectList(){
				let params={
					is_extra:'1'
				}
				if(areaClass==='1'){
					params.city_code=this.curAddress.cityCode
				}else if(areaClass==='2'){
					params.area_code = this.curAddress.areaCode
				}
				this.$request('/applet/index/page/getProject', params).then(res => {
					if (res.code == 200) {
						this.projectArr = res.data;
					}
				})
			},
			toCreate(data){
				//没有设定价格，可能还没配置这个项目
				if ((data.is_price && !data.original_price) || (!data.is_price && !data.price)) {
					return uni.$toast('该服务暂无开通')
				}
				this.$store.commit('SET_ININT_ORDER', {}) //初始化创建订单数据
				this.$store.commit('SET_ORDER_DATA', {
					project_type: data.id,
					money: data.is_price ? data.original_price : data.price, //是原价还是现价
					from: 1
				})
				this.$navto('/pages/order/creat-order', true)
			}
		}
	}
</script>

<style lang="scss" scoped>
page{
	background: #F6F7FB;
}
.content {
		position: relative;
		bottom: 240rpx;
		padding: 0 30rpx;
		z-index: 9;

		.card {
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
    /* 保持原有样式 */
    width: 100%;
    height: 100%;
    padding: 48rpx 34rpx;
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
    align-items: center;
	margin-left:160rpx;
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
					width:400rpx;
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
			// .book-btn{
			// 	background-color:#74c0fc;
			// 	color:#ffffff;
			// 	width: 130rpx;
			// 	height:80rpx;
			// 	align-items:center;
			// 	font-size:15px;
			// 	font-weight:600;
			// 	line-height:80rpx;
			// }
		}
	}
</style>



