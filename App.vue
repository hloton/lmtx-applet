<script>
	import Vue from 'vue';
	
	export default {
		onLaunch: function() {
			console.log('App Launch');
		uni.getSystemInfo({
				success: e => {
					// 状态栏高度px
					Vue.prototype.statusHeight = e.statusBarHeight;
					Vue.prototype.screenHeight = e.screenHeight;
					Vue.prototype.screenWidth = e.screenWidth;
					Vue.prototype.platform = e.platform;
					Vue.prototype.widthRatio = e.screenWidth / 750;
					
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif
								
					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight + 4;
					// #endif		
								
					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			});
			this.$store.commit('SET_CUR_ADDRESS', uni.getStorageSync('cityCode'))
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-ui/index.scss";
	@import 'static/style/index.scss';
</style>
