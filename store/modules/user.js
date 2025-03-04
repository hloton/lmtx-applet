export default{
	//vuex全局状态
	state:{
		userData:{},
		orderInfo:{},//订单相关数据
		staffinfo:{},//员工信息
		curAddress:{},//当前选择位置
		islogin:{},//登陆状态
		staffid:''//申请陪诊师id
	},
	// 提供修改 state 的方法，每个方法对应一个状态更新场景
	mutations:{
		SET_USER_DATA(state,data){
			state.userData=data
		},
		SET_ORDER_DATA(state,data){
			console.log(data, 'SET_ORDER_DATA')
			Object.assign(state.orderInfo,data)
		},
		SET_ININT_ORDER(state,data){//初始化订单信息
			state.orderInfo = {}
		},
		SET_STAFF_INFO(state,data){
			state.staffinfo=data
		},
		SET_CUR_ADDRESS(state, data) {
			state.curAddress = data
		},
		SET_ISLOGIN(state, data) {
			state.islogin = data
		},
		
		SET_STAFF_ID(state,data) {
			state.staffid = data
		}
	}
}