<!-- 缺省页组件 -->
<template>
	<view>
		<view class="zanwu" :style="{ 'margin-top': marginTop + 'rpx'}">
			<image src="./default.svg" class="imgWH" mode="aspectFit"></image>
			<view class="zwData">{{ msg }}</view>
		</view>
	</view>
</template>

<script>
/**
 * 缺省页
 * props:
 * 		marginTop:距离顶部高度
 * 		msg:提示信息
 *
 **/
/**
 *  @description 缺省页
 * @property {Number, String} 	marginTop	距离顶部高度;默认值：212
 * @property {String} 			msg			提示信息;默认值：暂无数据
 * @example
 * */
export default {
	name: 'defaultPage',
	data() {
		return {
			delayJudgment: false
		};
	},
	props: {
		msg: {
			type: String,
			default: '暂无数据'
		},
		marginTop: {
			type: String,
			default: '212'
		}
		// imgUrl:{
		// 	type:String,
		// 	default: './default.svg"'
		// }
	},
	mounted() {
		setTimeout(() => {
			this.delayJudgment = true;
		}, 2000);
	},
	methods: {}
};
</script>

<style lang="scss">
//没找到相关信息样式
.zanwu {
	width: 300rpx;
	height: auto;
	text-align: center;
	margin: 0 auto;
	margin-top: 10rpx;
	.imgWH {
		width: 300rpx;
		height: 250rpx;
	}
	.zwData {
		margin-top: 12rpx;
		font-size: 28rpx;
		color: #bfbfbf;
	}
}
</style>
