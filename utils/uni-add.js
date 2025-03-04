import Vue from 'vue';

function toast(title,icon='none',duration=1500){
	uni.showToast({
		title:title,
		duration:duration,
		icon
	})
	return new Promise(resolve=>{
		setTimeout(resolve,duration)
	})
}
function showModal(setting) {
	return new Promise((resolve, reject) => {
		uni.showModal({
			...setting,
			success(res) {
				if (res.confirm) {
					resolve()
				} else if (res.cancel) {
					reject()
				}
			},
			fail() {
				reject()
			}
		});
	});

}

function navto(url, showmodel = false) {
	if (showmodel) {
		console.log()
		if (!uni.$app.$store.state.user.islogin) {
			uni.$showModal({
					title: '提示',
					content: '您还未登录,是否去登录?'
				})
				.then(() => {
					uni.navigateTo({
						url: '/pages/login/login'
					})
				})
		} else {
			uni.navigateTo({
				url
			})
		}
	} else {
		uni.navigateTo({
			url
		})
	}
}
export default {
	init() {
		return {
			toast,
			showModal,
			navto
		}
	}
}
