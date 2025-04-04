<template>
	<view>
		<top-navigation bgColor="#ffffff">
			<template #left-slot>
				就诊人信息
			</template>
		</top-navigation>
		<view class="tips" v-if="notfound">
			<view class="photo">
				<image src="/static/images/mine/empty-address.png"></image>
			</view>
			<view class="word">
				您还未添加就诊人~
			</view>
			<view class="add">
				请点击下方按钮添加就诊人 
			</view>
		</view>
		
		<u-swipe-action ref="swiper">
			<u-swipe-action-item :options="options2" @click="click" 
			v-for="(item,index) in patientList" :key="index" :name="index">
				<view class="info" @click="checkPatient(item)">
					<view class="info-top">
						<text class="name">{{item.name}}</text>
						<text class="sex">{{item.sex == 0?'男':'女'}}</text>
						<text class="age">{{item.age}}岁</text>
					</view>
					<view class="info-down">
						{{item.card_num}}
					</view>
				</view>
			</u-swipe-action-item>
		</u-swipe-action>
		<view class="occupi"></view>
		<view class="end" style="z-index: 20;" @tap="$navto('/pages/mine/patient/add-patient')">添加就诊人</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
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
				showaction:true,
				notfound:false,//是否没有数据
				current:'',//当前要操作项的index
				patientList:[],//就诊人信息
				type:0
			};
		},
		onShow(){
			this.getPatientList()
		},
		onLoad(option){
			this.type=option.type||0
		},
		methods:{
			//获取就诊人列表
			getPatientList(){
				this.$request('/applet/my/getPatients',{
					member_id:uni.getStorageSync('userinfo').id,
				}).then(res=>{
					if(res.success){
						this.notfound=false
						if(res.data==0)this.notfound=true
						this.patientList=res.data
					}else this.$toast(res.msg)
				})
			},
			//滑动点击按钮,选中就诊人
			click(e){
				this.showaction=false
				this.current=e.name
				if(e.index==0){//编辑
					// #ifdef APP-PLUS
					this.$refs.swiper.$children[0].$children[this.current].closeHandler()
					// #endif
					// #ifdef MP-WEIXIN
					this.$refs.swiper.$children[this.current].closeHandler()
					// #endif
					uni.setStorageSync('patientInfo', this.patientList[e.name])
					this.$navto('/pages/mine/patient/add-patient?isedit=true')
				}
				else{//删除
					this.delpatient()
				}
			},
			//删除就诊人
			delpatient(){
				uni.$showModal({
					title:'提示',
					content: `确定要删除${this.patientList[this.current].name}的信息吗?`
				}).then(()=>{
					let params={
						id: this.patientList[this.current].id
					}
					this.$request('/applet/my/delPatients', params).then(res => {
											if (res.success) {
												this.getPatientList()
												this.$toast('已删除')
												// #ifdef APP-PLUS
												this.$refs.swiper.$children[0].$children[this.current].closeHandler()
												// #endif
												// #ifdef MP-WEIXIN
												this.$refs.swiper.$children[this.current].closeHandler()
												// #endif
											} else this.$toast(res.msg)
										})
				})
			},
			checkPatient(item) {
				if (this.type == 1) { //选择就诊人
					this.$store.commit('SET_ORDER_DATA', {
						patients_id: item.id,
						patients_name: item.name,
						patients_relation: item.relation,
						patients_phone: item.phone,
						patients_is_walk: item.is_walk,
						ext2:item.sex == 0?'男':'女',
						ext3:item.age
					})
					uni.navigateBack();
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #f7f6fb;
	}
	.occupi{
		height: 100rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
	.box-top {
		// width: 690rpx;
		// height: 180rpx;
		// background: #FFFFFF;
		// box-shadow: 0rpx 2rpx 18rpx 0rpx rgba(0, 0, 0, 0.06);
		// border-radius: 20rpx;
		// margin: 30rpx;
		// display: flex;
	}

	.info {
		width: 490rpx;
		height: 180rpx;

		.info-top {
			//	width: 490rpx;
			height: 100rpx;
			line-height: 100rpx;

			.name {
				margin: 48rpx 0 0 40rpx;
				font-weight: bold;
			}

			.sex {
				margin-left: 90rpx;
				color: #949494;
			}

			.age {
				margin-left: 89rpx;
				color: #949494;
			}
		}

		.info-down {
			margin: auto 40rpx;
			font-weight: bold;
			color: #404040;
		}
	}

	.edit {
		width: 100rpx;
		height: 180rpx;
		background: #55B5FF;
		box-shadow: 0rpx 2rpx 18rpx 0rpx rgba(0, 0, 0, 0.06);
		border-radius: 0rpx;
		text-align: center;
		line-height: 180rpx;
		color: #E1E1E1;
		font-size: 26rpx;
	}

	.delete {
		width: 100rpx;
		height: 180rpx;
		background: #CDCDCD;
		box-shadow: 0rpx 2rpx 18rpx 0rpx rgba(0, 0, 0, 0.06);
		border-radius: 0rpx 20rpx 20rpx 0rpx;
		text-align: center;
		line-height: 180rpx;
		color: #E1E1E1;
		font-size: 26rpx;
	}

	.end {
		position: fixed;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		bottom: 0rpx;
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		background-color: #55b5ff;
		text-align: center;
		color: #FFFFFF;
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
