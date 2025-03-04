const develop = true
const companyName='广州市乐木同行医疗有限公司'
const areaClass ='1'//1城市2区县
const smallName = '乐木同行陪诊'
let host = ''
let imgUrl = ''

if(develop){
	host = 'http://localhost:8080/lmtx_admin_war'
	imgUrl='http://localhost:8080/lmtx_admin_war'
	}
	else{
		host = 'http://localhost:8080/lmtx_admin_war'
		imgUrl='http://localhost:8080/lmtx_admin_war'
	}
	console.log = develop ? console.log : () => {}
	console.info = develop ? console.info : () => {}
	
	export {
		host,
		imgUrl,
		companyName,
		areaClass,
		smallName
	}
	