export default {
	'1': [{//全天陪诊
		title: '就诊人',
		type: 'patient',
		value: '',
		placeholder:'请选择就诊人',
		event: 'link',
		must:true,
		key:'patients_name'
	},{
		title: '期望就诊时间',
		type: 'time',
		value: '',
		placeholder:'请选择就诊时间',
		event: 'picker',
		must:true,
		key:'hope_time'
	}, {
		title: '科室',
		type: 'depart',
		value: '',
		placeholder:'请选择服务科室',
		event: 'link',
		must:true,
		key:'hospital_one'
	}, {
		title: '服务需求',
		type: 'textarea',
		value: '',
		placeholder:'请输入其他服务需求...',
		event: 'input',
		key:'service_demand'
	}],
	'2': [{//小时陪诊
		title: '就诊人',
		type: 'patient',
		value: '',
		placeholder:'请选择就诊人',
		event: 'link',
		must:true,
		key:'patients_name'
	},{
		title: '期望就诊时间',
		type: 'time',
		value: '',
		placeholder:'请选择就诊时间',
		event: 'picker',
		must:true,
		key:'hope_time'
	}, {
		title: '科室',
		type: 'depart',
		value: '',
		placeholder:'请选择服务科室',
		event: 'link',
		must:true,
		key:'hospital_one'
	}, {
		title: '服务需求',
		type: 'textarea',
		value: '',
		placeholder:'请输入其他服务需求...',
		event: 'input',
		key:'service_demand'
	}],
	'3': [{//代办问诊
		title: '就诊人',
		type: 'patient',
		value: '',
		placeholder:'请选择就诊人',
		event: 'link',
		must:true,
		key:'patients_name'
	},{
		title: '期望就诊时间',
		type: 'time',
		value: '',
		placeholder:'请选择就诊时间',
		event: 'picker',
		must:true,
		key:'hope_time'
	}, {
		title: '科室',
		type: 'depart',
		value: '',
		placeholder:'请选择服务科室',
		event: 'link',
		must:true,
		key:'hospital_one'
	}, {
		title: '服务需求',
		type: 'textarea',
		value: '',
		placeholder:'请输入其他服务需求...',
		event: 'input',
		key:'service_demand'
	}],
	
	'4': [{//取送报告
		title: '就诊人',
		type: 'patient',
		value: '',
		placeholder:'请选择就诊人',
		event: 'link',
		must:true,
		key:'patients_name'
	},{
		title: '期待处理时间',
		type: 'time',
		value: '',
		placeholder:'请选择处理时间',
		event: 'picker',
		must:true,
		key:'hope_dispose_time'
	}, {
		title: '收件信息',
		type: 'address',
		value: '',
		placeholder:'请选择收件信息',
		event: 'link',
		must:true,
		key:'consignee'
	}, {
		title: '报告信息',
		type: 'report',
		value: '',
		placeholder:'请选择报告信息',
		event: 'picker',
		must:true,
		key:'report'
	}, {
		title: '订单备注',
		type: 'input',
		value: '',
		placeholder:'请输入其他服务要求',
		event: 'input',
		key:'remark'
		
	}],
	
	
	'5': [{//代办买药
		title: '就诊人',
		type: 'patient',
		value: '',
		placeholder:'请选择就诊人',
		event: 'link',
		must:true,
		key:'patients_name'
	},{
		title: '药物类型',
		type: 'drug',
		value: '',
		placeholder:'请选择药物类型',
		event: 'picker',
		must:true,
		key:'drug_type'
	}, {
		title: '药品名',
		type: 'input',
		value: '',
		placeholder:'请准确输入药品名称',
		event: 'input',
		must:true,
		key:'drug_name'
	}, {
		title: '服务时间',
		type: 'time',
		value: '',
		placeholder:'请选择服务时间',
		event: 'picker',
		must:true,
		key:'service_time'
	}, {
		title: '收件信息',
		type: 'address',
		value: '',
		placeholder:'请选择收件信息',
		event: 'link',
		must:true,
		key:'consignee'
	}, {
		title: '服务需求',
		type: 'textarea',
		value: '',
		placeholder:'请输入其他服务需求...',
		event: 'input',
		key:'service_demand'
	}],

'6': [{//诊前挂号
		title: '就诊人',
		type: 'patient',
		value: '',
		placeholder:'请选择就诊人',
		event: 'link',
		must:true,
		key:'patients_name'
	},{
		title: '期望就诊时间',
		type: 'time',
		value: '',
		placeholder:'请选择就诊时间',
		event: 'picker',
		must:true,
		key:'hope_time'
	}, {
		title: '科室',
		type: 'depart',
		value: '',
		placeholder:'请选择服务科室',
		event: 'link',
		must:true,
		key:'hospital_one'
	}, {
		title: '服务需求',
		type: 'textarea',
		value: '',
		placeholder:'请输入其他服务需求...',
		event: 'input',
		key:'service_demand'
	}],

	'7': [{//尊享陪诊
		title: '就诊人',
		type: 'patient',
		value: '',
		placeholder:'请选择就诊人',
		event: 'link',
		must:true,
		key:'patients_name'
	},{
		title: '期望就诊时间',
		type: 'time',
		value: '',
		placeholder:'请选择就诊时间',
		event: 'picker',
		must:true,
		key:'hope_time'
	}, {
		title: '科室',
		type: 'depart',
		value: '',
		placeholder:'请选择服务科室',
		event: 'link',
		must:true,
		key:'hospital_one'
	}, {
		title: '专享归属',
		type: 'exclusive',
		value: '',
		placeholder:'请选择专享归属',
		event: 'picker',
		must:true,
		key:'exclusive'
	}, {
		title: '服务需求',
		type: 'textarea',
		value: '',
		placeholder:'请输入其他服务需求...',
		event: 'input',
		key:'service_demand'
	}]
}
// 1	全天陪诊	就诊人、期望就诊时间、科室、服务需求
// 2	小时陪诊	就诊人、期望就诊时间、科室、服务需求
// 3	代办问诊	就诊人、期望就诊时间、科室、服务需求
// 4	取送报告	期待处理时间、收件信息、报告信息、订单备注
// 5	代办买药	药物类型、药品名、收件信息、服务时间、服务需求
// 6	诊前挂号	就诊人、期望就诊时间、科室、服务需求
// 7	尊享陪诊	就诊人、期望就诊时间、科室、专享归属、服务需求