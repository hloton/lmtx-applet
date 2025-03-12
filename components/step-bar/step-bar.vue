<template>
	<view class="step_box">
		<view class="line">
			<view class="line-select" :class="{'line-disable':cancel}" :style="{ width: lineStyle.width}">			
			</view>
		</view>
		<view class="u-steps u-steps--row">
			<view class="u-steps-item u-steps-item--row" v-for="(item,index) in stepArr" :key="index">
				<view class="u-steps-item_wrapper u-steps-item__wrapper--row" :class="{'step_select': index == active}">
					<image v-if="!cancel" :src="index<=active?'/static/images/order/step_select.png':'/static/images/order/step.png'" mode="aspectFit" class="slot-icon"></image>
					<image v-if="cancel" :src="'/static/images/order/step_cancel.png'" mode="aspectFit" class="slot-icon"></image>
				</view>
				<view class="u-steps-item__content u-steps-item__content--row">
					<text>{{item.title}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		name:"stepBar",
		props:{
			stepArr:{
				type:Array,
				default:()=>{
					return [{
						title:'填写信息',
					},
					{
						title:'在线支付'
					},{
						title:'专人陪诊'
					},{
						title:'服务完成'
					}]
				}
			},
			active:{
				type:Number,
				default:0//默认是0，在create-order是第一项
			},
			cancel:{
				type:Boolean,
				default:false
			}
			
		},
		
		data(){
			return {
				lineStyle:{}
			}
		},
		watch:{
			cancel(newValue,oldValue){
				this.lineWidth()
			},
			active(newValue,oldValue){
				this.lineWidth()
			},
			stepArr(newValue,oldValue){
				this.lineWidth()
			}
		},
		created(){
			this.lineWidth()
		},
		methods:{
			lineWidth(){
				this.$nextTick(()=>{
					if(this.cancel){
						this.lineStyle={
							width: '684rpx'
						}
					}else{
						this.getRect('.step_select').then(size=>{
							if (this.active < this.stepArr.length - 1) {
								this.lineStyle = {
									width: size.left + 'px'
								}
							} else {
								this.lineStyle = {
									width: '684rpx'
								}
							}
						})
					}
				})
			},
			getRect(selector, all){
				return new Promise((resolve)=>{
					uni.createSelectorQuery()
						.in(this)[all ? 'selectAll' : 'select'](selector)
						.boundingClientRect((rect) => {
							if (all && Array.isArray(rect) && rect.length) {
								resolve(rect)
							}
							if (!all && rect) {
								resolve(rect)
							}
						})
						.exec()
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.step_box{
		width: 750rpx;
		height: 366rpx;
		background: url(../../static/images/home/bg.png);
		background-size: 100% 100%;
		padding-top: 60rpx;
		box-sizing: border-box;
		position: relative;
		.u-steps {
				display: flex;
				z-index: 10;
				position: absolute;
				width: 750rpx;
		
				.u-steps-item {
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: center;
				}
		
				.u-steps-item__content {
					color: #FFFFFF;
					margin-top: 20rpx;
					font-size: 28rpx;
					font-weight: 500;
				}
			}
		
			.line {
				width: 684rpx;
				height: 18rpx;
				background-color: #FFFFFF;
				border-radius: 18rpx;
				position: absolute;
				left: 30rpx;
				top: 96rpx;
				z-index: 1;
		
				.line-select {
					width: 80rpx;
					height: 14rpx;
					position: absolute;
					left: 5rpx;
					top: 2rpx;
					border-radius: 14rpx;
					background: #00b26a;
		
					&.line-disable {
						background: linear-gradient(0deg, #DBDBDB, #F8F8F8);
					}
				}
			}
		}
		
		.slot-icon {
			width: 80rpx;
			height: 80rpx;
			background-color: transparent;
	}
</style>