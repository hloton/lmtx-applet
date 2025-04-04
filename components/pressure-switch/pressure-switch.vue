<template>
	<view>
		<view
			class="switch-module"
			@tap="switchEvent"
			:style="{
				'background-color': switchPosition ? openColor : closeColor,
				'border-radius': isRadius ? '1000rpx' : '0rpx',
				height: switchHeight,
				width: switchWidth
			}"
		>
			<view
				class="circle"
				:style="{
					'background-color': sliderColor,
					'border-radius': isRadius ? '1000rpx' : '0rpx',
					left: switchPosition ? sliderDistance : '0rpx',
					height: switchHeight,
					width: switchHeight
				}"
			></view>
		</view>
	</view>
</template>

<script>
/**
 * 开关组件
 * @description 该组件主要用户开关和滑块
 * @property {Boolean, String} 		initialState		开关的默认开关状态;默认值：false
 * @property {String} 				openColor			打开时开关块的背景色;默认值：#01c847
 * @property {String} 				closeColor			关闭时开关块的背景色;默认值：#666666
 * @property {String} 				sliderColor			滑块的颜色;默认值：#FFFFFF
 * @property {Boolean, String} 		isRadius			滑块是否是圆形;默认值：true
 * @property {String} 				switchHeight		开关的高度;默认值：80rpx
 * @property {String} 				switchWidth			开关的宽度;默认值：160rpx
 * @property {String} 				sliderDistance		滑块滑动距离;默认值：80rpx
 * @property {String} 				isDirectlyModify	是否可以直接改变属性;默认值：true
 * @event {Function} 				switchPosition  	返回开关状态
 * @tutorial Function				switchEvent  		改变开关属性 
 * @tutorial Function 				turnOnSwitch  		主动打开开关
 * @tutorial Function 				turnOffSwitch  		主动关闭开关
 * @tutorial Function 				turningOnOff  		主动切换开关
 * @example <pressure-switch></pressure-switch>
 * */
export default {
	name: 'pressure-switch',
	props: {
		initialState: {
			type: [Boolean, String],
			default: false
		},
		openColor: {
			type: String,
			default: '#01c847'
		},
		closeColor: {
			type: String,
			default: '#666666'
		},
		isRadius: {
			type: [Boolean, String],
			default: true
		},
		sliderColor: {
			type: String,
			default: '#FFFFFF'
		},
		switchHeight: {
			type: String,
			default: '40rpx'
		},
		switchWidth: {
			type: String,
			default: '80rpx'
		},
		sliderDistance: {
			type: String,
			default: '40rpx'
		},
		isDirectlyModify:{
			type: [Boolean, String],
			default: true
		},
	},
	data() {
		return {
			switchPosition: false
		};
	},
	mounted() {
		this.switchPosition = this.initialState;
	},
	methods: {
		switchEvent() {
			if(!this.isDirectlyModify) return; 
			this.$emit('switchPosition', !this.switchPosition);
			this.switchPosition = !this.switchPosition;
		},
		// 打开开关
		turnOnSwitch(){
			this.switchPosition = true;
			this.$emit('switchPosition', !this.switchPosition);
		},
		// 关闭开关
		turnOffSwitch(){
			this.switchPosition = false;
			this.$emit('switchPosition', !this.switchPosition);
		},
		// 开或关
		turningOnOff(){
			this.switchPosition = !this.switchPosition;
			this.$emit('switchPosition', !this.switchPosition);
		}
	}
};
</script>

<style lang="scss">
.switch-module {
	background-color: #666666;
	border-radius: 1000rpx;
	transition: background-color 0.3s;
	display: flex;
	align-items: center;
	.circle {
		width: 80rpx;
		height: 80rpx;
		background-color: #ffffff;
		border-radius: 1000rpx;
		position: relative;
		left: 0rpx;
		transition: left 0.3s;
	}
}
</style>
