<template>
	<view>
		<top-navigation bgColor="#ffffff">
			<template #left-slot>
				全部科室
			</template>
		</top-navigation>
		<view class="deparent-box" :style="{height:scrollToHeight}">
			<scroll-view scroll-y="true" class="left-box" :style="{height:scrollToHeight}">
				<view class="tab-item" :class="{'select':idx==activeIndex}" v-for="(item,idx) in deparentArr">
					<view @click="changeDeparent(idx)">{{item.name}}</view>
				</view>
			</scroll-view>
			<scroll-view scroll-y="true" class="right-box" :style="{height:scrollToHeight}" v-if="deparentArr.length">
				<view class="deparent-item" v-for="(item,idx) in deparentArr[activeIndex].two">
					<view @click="checkDeparent(idx)">{{item.name}}</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				deparentArr:[],
				activeIndex:0,
				hospitalId:'',
			};
		},
		onLoad(option){
			this.hospitalId=option.id ||1
			this.getDepartment()
		},
		computed:{
			scrollToHeight() {
							let temp = `calc(${this.screenHeight}px - ${this.statusHeight}px - 88rpx)`
							return temp
			}
		},
		methods:{
			//获取部门信息
			getDepartment(){
				this.$request('/applet/index/page/getHospitalDepartment', {
					hospital_id: this.hospitalId
				}).then(res => {
					if (res.code == 200) {
						this.deparentArr = res.data;
					} else {
						uni.$toast(res.msg);
					}
				})
			},
			//选中一级科室
			changeDeparent(idx){
				this.activeIndex=idx
			},
			//选中二级科室
			checkDeparent(idx){
				let hospital_one=this.deparentArr[this.activeIndex]
				let hospital_two=hospital_one.two[idx]
				this.$store.commit('SET_ORDER_DATA', {
					hospital_one: hospital_one.name,
					hospital_two: hospital_two.name,
					// hospital_one_id:hospital_one.id,
					// hospital_two_id:hospital_two.id,
				})
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss" scoped>
.deparent-box {
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
						background: #55B5FF;
						position: absolute;
						left: 0;
						top: 0;
					}
				}
			}
		}

		.right-box {
			flex: 1;// 剩余宽度全给它

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
</style>
