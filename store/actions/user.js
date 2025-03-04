import http from '@/utils/http.js';
const user = {
	//获取用户信息
	async getUserData({
		commit
	}, data) {
		let params = data
		const res = await uni.$request('/applet/index/login/login', params)
		console.log("获取用户信息", res)
		if (res.success) commit('SET_USER_DATA', res.data);
		else uni.$toast(res.mag || '请求失败！')
		return true
	},
	//获取员工信息
	async getstaffInfo({
		commit
	}, data) {
		let params = {
			id: uni.getStorageSync('staffinfo')
		}
		const res = await uni.$request('/applet/staff/queryStaffDetail',params)
		console.log("获取员工信息", res, params);
		if (res.success) {
			commit('SET_STAFF_INFO', res.data)
			uni.stopPullDownRefresh();
		} else uni.$toast(res.mag || '请求失败！')
		return true
	},
	
	async setStaffId({
		commit
	},data) {
		console.log("存储员工id", data)
		commit('SET_STAFF_ID', data)
		return true
	}
};

export default user;
