<template>
	<view>
		<top-navigation bgColor="#ffffff">
					<template #left-slot>
						收件地址
					</template>
			</top-navigation>
			<!-- <view class="box">
					</view> -->
			<u-swipe-action ref="swiper">
				<u-swipe-action-item :options="options2" class="box-top" @click="click" v-for="(item,index) in addressList" :key="index" :name="index">
					<view class="info" @tap="checkPatient(item)">
						<view class="info-top">
							<!-- 收件人姓名 -->
							<text class="name">{{item.addressee}}</text>
							<text class="sex">{{item.phone}}</text>
						</view>
						<view class="info-down">{{item.address}}</view>
					</view>
				</u-swipe-action-item>
				
			</u-swipe-action>
		
			<view class="placeholder-box"></view>
			<view class="end" @tap="$navto('/pages/mine/address/add-address')">添加邮寄地址</view>
			<view class="tips" v-if="notfound">
				<view class="photo">
					<image src="/static/images/mine/empty-address.png"></image>
				</view>
				<view class="word">您还没有常用邮寄地址~</view>
				<view class="add">请点击下方按钮添加邮寄地址</view>
			</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addressList: [],
				pageNum: 1,
				notfound: false,
				options2: [{
					text: '编辑',
					style: {
						backgroundColor: '#55B5FF'
					}
				}, {
					text: '删除',
					style: {
						backgroundColor: '#CDCDCD'
					}
				}],
				current: '', //当前要操作项的index
				type: 0, //1-代表是选择就诊人
			};
		},
		onShow() {
			this.getaddress()
		},
		onLoad(option){
			this.type=option.type||0
		},
		methods:{
			//获取地址信息
			getaddress() {
				this.notfound = false
				let params = {
					member_id: uni.getStorageSync('userinfo').id,
				}
				this.$request('/applet/my/getAddress', params).then(res => {
					if (res.success) {
						if (res.data == 0) {
							this.notfound = true
							return;
						}
						this.addressList = res.data
					} else this.$toast(res.msg)
				})
			},
			click(e){
				this.current = e.name
				if(e.index==0){//编辑地址
					uni.setStorageSync('editAddress',this.addressList[e.name])
					this.$navto('/pages/mine/address/add-address?isedit=true')
					// #ifdef APP-PLUS
					this.$refs.swiper.$children[0].$children[this.current].closeHandler()
					// #endif
					// #ifdef MP-WEIXIN
					this.$refs.swiper.$children[this.current].closeHandler()
					// #endif
				}else{//删除地址
					uni.$showModal({
						title: '提示',
						content: `确定要删除这条邮寄地址吗?`
					}).then(() => {
						let params = {
							id: this.addressList[e.name].id
						}
						this.$request('/applet/my/delAddress', params).then(res => {
							if (res.success) {
								// #ifdef APP-PLUS
								this.$refs.swiper.$children[0].$children[this.current].closeHandler()
								// #endif
								// #ifdef MP-WEIXIN
								this.$refs.swiper.$children[this.current].closeHandler()
								// #endif
								this.$toast('删除成功!')
								this.getaddress()
							} else this.$toast(res.msg)
						})
					})
				}
			},
			//选择地址
			
			checkPatient(item){
				if(this.type==1){
					this.$store.commit('SET_ORDER_DATA',{
						consignee:item.address,
						consignee_phone:item.phone,
						consignee_address:item.address
					})
					uni.navigateBack({});
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f7f6fb;
	}

	.info {
		width: 100%;
		padding: 48rpx 30rpx;
		overflow: scroll;
		margin-bottom: 20rpx;
		.info-top {
			margin-bottom: 20rpx;

			.name {
				max-width: 200rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				font-weight: bold;
				margin-right: 60rpx;
				font-size: 30rpx;
				font-weight: bold;
				color: #333333;
			}

			.sex {
				font-size: 30rpx;
				font-weight: 500;
				color: #666666;
			}
		}

		.info-down {
			width: 630rpx;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			color: #404040;
			font-size: 28rpx;
			font-weight: 500;
			color: #333333;
		}
	}


	.end {
		position: fixed;
		padding-bottom: constant(safe-area-inset-bottom);
		/*兼容 IOS<11.2*/
		padding-bottom: env(safe-area-inset-bottom);
		bottom: 0rpx;
		z-index: 99;
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		background-color: #55b5ff;
		text-align: center;
		color: #FFFFFF;
	}

	.placeholder-box {
		height: 100rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tips {
		.photo {
			display: flex;

			image {
				width: 347rpx;
				height: 288rpx;
				margin: 252rpx auto 0 auto;
			}
		}

		.word {
			margin-top: 40rpx;
			text-align: center;
			font-size: 32rpx;
			font-weight: bold;
			color: #343434;
		}

		.add {
			margin-top: 29rpx;
			text-align: center;
			color: #808080;
			font-size: 28rpx;
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
	} 
</style>
