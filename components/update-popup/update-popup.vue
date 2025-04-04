<!-- 更新弹窗 -->
<template>
	<view>
		<view class="updatePage" v-if="lengthThe < 100 && lengthThe > 0">
			<view class="updatePageBg"></view>
			<view class="promptBox">
				<image src="./movingGraph.gif" mode="aspectFit"></image>
				<view class="clues">正在下载({{ lengthThe }}%)</view>
				<view class="progressBar"><view class="progressOf" :style="{ width: lengthThe + '%' }"></view></view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'updatePage',
	data() {
		return {
			lengthThe: 0
		};
	},
	mounted() {},
	methods: {
		detectionUpdate() {
			console.log('detectionUpdate');
			// #ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, wgtinfo => {
				console.log(wgtinfo.version); //本地应用版本号
				this.$http.request('/app_api/system/system/versionsLink', {}).then(res => {
					if (wgtinfo.version != res.data[0].param_value) {
						uni.showModal({
							confirmText: '更新',
							content: '检测到新版本，要更新么？',
							title: '提示',
							success(e) {
								if (e.confirm) {
									var url = res.data[1].param_value; // 下载文件地址
									var options = { method: 'GET' };
									var dtask = plus.downloader.createDownload(url, options);
									dtask.addEventListener('statechanged', (task, status) => {
										switch (task.state) {
											case 1: // 开始
												console.log('开始');
												break;
											case 2: //已连接到服务器
												console.log('已连接到服务器');
												break;
											case 3: // 已接收到数据
												var current = parseInt((100 * task.downloadedSize) / task.totalSize);
												this.lengthThe = current;
												break;
											case 4:
												console.log('完成下载');
												plus.runtime.install(
													task.filename, //安装APP
													{
														force: true
													},
													function() {
														console.log('更新成功');
													},
													function() {
														console.log('更新失败');
														uni.showToast({
															title: '更新失败！',
															icon: 'none'
														});
													}
												);
												break;
										}
									});
									dtask.start();
								}
							}
						});
					}
				});
			});
			// #endif
		}
	}
};
</script>

<style lang="scss">
.updatePage {
	width: 100vw;
	height: 100vh;
	position: fixed;
	left: 0rpx;
	top: 0rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
	.updatePageBg {
		width: 100vw;
		height: 100vh;
		// background-color: #111111;
		position: absolute;
		top: 0rpx;
		left: 0rpx;
	}
	.promptBox {
		width: 50vw;
		height: 50vw;
		opacity: 1;
		background-color: #151515;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 50rpx;
		image {
			width: 30vw;
			height: 30vw;
		}
		.clues {
			color: #eeeeee;
			font-size: 30rpx;
			margin: 20rpx 0rpx;
		}
		.progressBar {
			width: 40vw;
			height: 1.5vw;
			background-color: #aaaaaa;
			border-radius: 5rpx;
			.progressOf {
				height: 1.5vw;
				width: 20vw;
				background-color: #eeeeee;
			}
		}
	}
}
</style>
