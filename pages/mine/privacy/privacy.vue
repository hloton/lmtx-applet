<template>
	<view>
		<top-navigation bgColor="#ffffff">
			<template #left-slot>
				{{type == 1?'隐私协议':type == 2?'服务条款':'服务条款同意书'}}
			</template>
		</top-navigation>
		<view class="content">
			<u-parse :content="content"></u-parse>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content:'',
				type:''
			};
		},
		onLoad(e) {
			this.type = e.type
			this.$request('/applet/index/page/getConfig', {
				type: e.type
			}).then(res => {
				this.content = res.data.content
			})
		}
	}
</script>

<style lang="scss">
.content {
		padding: 20rpx;
	}
</style>
