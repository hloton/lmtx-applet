

/** 根据传入的参数tel验证手机号码是否符合相关规范。如果传入keywoed关键词,会同时验证手机号码是否为空以及是否符合相关规范。
 * 如果传入reversal关键词，则对结果进行取反操作。
 * @method checkPhoneNumber(tel,keyWord,reversal)
 * @for check.js
 * @param{String,String,Boolean} 		tel	手机号码, keyWord 提示关键词, reversal是否对结果取反
 * @return {Boolean} 布尔类型			布尔类型,当传入的tel参数符合手机号码规范时，返回false,但当reversal为true时返回false。
 */
function checkPhoneNumber(tel, keyword = false, reversal = false) {
	let reg = /^0?1[3|4|5|6|7|8|9][0-9]\d{8}$/;
	if (!keyword) {
		return reg.test(tel);
	} else {
		if (tel.length <= 0) {
			uni.showToast({
				icon: "none",
				title: keyword + "不能为空！",
				duration: 2000
			});
			return reversal;
		}
		if (!reg.test(tel)) {
			uni.showToast({
				icon: "none",
				title: keyword + "格式错误！",
				duration: 2000
			})
			return reversal;
		}
		return !reversal;
	}
}

/** 根据传入的参数email验证电子邮箱是否符合相关规范。如果传入keywoed关键词,会同时验证电子邮箱是否为空以及是否符合相关规范。
 * 如果传入reversal关键词，则对结果进行取反操作。
 * @method checkEmail(email,keyWord,reversal)
 * @for check.js
 * @param{String,String,Boolean} 		email 电子邮箱, keyWord 提示关键词, reversal是否对结果取反
 * @return {Boolean} 布尔类型			布尔类型,当传入的tel参数符合电子邮箱规范时，返回false,但当reversal为true时返回false。
 */
function checkEmail(email, keyword = false, reversal = false) {
	let reg = new RegExp(/^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/);
	if (!keyword) {
		return reg.test(email);
	} else {
		if (email.length <= 0) {
			uni.showToast({
				icon: "none",
				title: keyword + "不能为空！",
				duration: 2000
			});
			return reversal;
		}
		if (!reg.test(email)) {
			uni.showToast({
				icon: "none",
				title: keyword + "格式错误！",
				duration: 2000
			})
			return reversal;
		}
		return !reversal;
	}
}
/** 根据传入的参数判断参数的长度是否小于等于0。如果传入keywoed关键词,会直接提示参数不能为空。
 * 如果传入reversal关键词，则对结果进行取反操作。
 * @method checkNull(value)
 * @for check.js
 * @param{String,String,Boolean} 		value 参数, keyWord 提示关键词, reversal是否对结果取反
 * @return {Boolean} 布尔类型			布尔类型,当传入的value长度大于0，返回false,但当reversal为true时返回false。
 */
function checkNull(value, keyword = false, reversal = false) {
	if (!keyword) {
		return value.length <= 0;
	} else {
		if (value.length <= 0) {
			uni.showToast({
				icon: "none",
				title: keyword + "不能为空！",
				duration: 2000
			});
			return reversal;
		}
		return !reversal;
	}
}

/** 根据传入的参数name验证真实姓名是否符合相关规范。如果传入keywoed关键词,会同时验证身份证号是否为空以及是否符合相关规范。
 * 如果传入reversal关键词，则对结果进行取反操作。
 * @method checkRealName(name,keyWord,reversal)
 * @for check.js
 * @param{String,String,Boolean} 		name 真实姓名, keyWord 提示关键词, reversal是否对结果取反
 * @return {Boolean} 布尔类型			布尔类型,当传入的name参数符合真实姓名规范时，返回false,但当reversal为true时返回false。
 */
function checkRealName(name, keyword = false, reversal = false) {
	let reg = new RegExp(/^[\u4e00-\u9fa5]{2,4}$/);
	if (!keyword) {
		return reg.test(name);
	} else {
		if (name.length <= 0) {
			uni.showToast({
				icon: "none",
				title: keyword + "不能为空！",
				duration: 2000
			});
			return reversal;
		}
		if (!reg.test(name)) {
			uni.showToast({
				icon: "none",
				title: keyword + "格式错误！",
				duration: 2000
			})
			return reversal;
		}
		return !reversal;
	}
}

/** 根据传入的参数tex验证身份证号是否符合相关规范。如果传入keywoed关键词,会同时验证身份证号是否为空以及是否符合相关规范。
 * 如果传入reversal关键词，则对结果进行取反操作。
 * @method checkIdCard(tex,keyWord,reversal)
 * @for check.js
 * @param{String,String,Boolean} 		tex 身份证号, keyWord 提示关键词, reversal是否对结果取反
 * @return {Boolean} 布尔类型			布尔类型,当传入的tex参数符合身份证号规范时，返回false,但当reversal为true时返回false。
 */
function checkIdCard(tex, keyword = false, reversal = false) {
	var num = tex;
	num = num.toUpperCase();
	var len, re;
	len = num.length;
	let temp = true;
	//身份证号长度不能为0
	if (temp && len == 0) temp = false;
	//身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。    
	if (temp && !(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) temp = false;
	//地区码
	var aCity = {
		11: "北京",
		12: "天津",
		13: "河北",
		14: "山西",
		15: "内蒙古",
		21: "辽宁",
		22: "吉林",
		23: "黑龙江",
		31: "上海",
		32: "江苏",
		33: "浙江",
		34: "安徽",
		35: "福建",
		36: "江西",
		37: "山东",
		41: "河南",
		42: "湖北",
		43: "湖南",
		44: "广东",
		45: "广西",
		46: "海南",
		50: "重庆",
		51: "四川",
		52: "贵州",
		53: "云南",
		54: "西藏",
		61: "陕西",
		62: "甘肃",
		63: "青海",
		64: "宁夏",
		65: "新疆",
		71: "台湾",
		81: "香港",
		82: "澳门",
		91: "国外"
	};
	//验证前两位地区是否有效
	if (temp && aCity[parseInt(num.substr(0, 2))] == null) temp = false;
	//当身份证为15位时的验证出生日期。 
	if (temp && len == 15) {
		re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
		var arrSplit = num.match(re);
		//检查生日日期是否正确  
		var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
		var bGoodDay;
		bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) &&
			(
				dtmBirth.getDate() == Number(arrSplit[4]));
		if (!bGoodDay) temp = false;
	}
	//当身份证号为18位时，校验出生日期和校验位。 
	if (temp && len == 18) {
		re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
		var arrSplit = num.match(re);
		//检查生日日期是否正确  
		var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
		var bGoodDay;
		bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[
			3])) && (
			dtmBirth.getDate() == Number(arrSplit[4]));
		if (!bGoodDay) temp = false;
		else {
			//检验18位身份证的校验码是否正确。 
			//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
			var valnum;
			var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
			var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
			var nTemp = 0,
				i;
			for (i = 0; i < 17; i++) {
				nTemp += num.substr(i, 1) * arrInt[i];
			}
			valnum = arrCh[nTemp % 11];
			if (valnum != num.substr(17, 1)) temp = false;
		}
	}
	if (!keyword) return temp;
	else {
		if (len <= 0) {
			uni.showToast({
				icon: "none",
				title: keyword + "不能为空！",
				duration: 2000,
				position: 'bottom'
			});
			return reversal;
		}
		if (!temp) {
			uni.showToast({
				icon: "none",
				title: keyword + "格式错误！",
				duration: 2000,
				position: 'bottom'
			});
			return reversal;
		}
		return !reversal;
	}
}

function chekcChinese(value, reversal = false) {
	let reg = new RegExp(/^[\u4e00-\u9fa5]/);
	if (reg.test(value)) {
		return !reversal;
	}
}

//校验密码强度---沒有匹配到以下級別就提示
function checkPassWord(value) {
	// 0： 表示第一个级别 1：表示第二个级别 2：表示第三个级别
	// 3： 表示第四个级别 4：表示第五个级别
	var arr = [],
		array = [1, 2, 3, 4];
	if (value.length < 6) { //最初级别
		return 0;
	}
	if (/\d/.test(value)) { //如果用户输入的密码 包含了数字
		arr.push(1);
	}
	if (/[a-z]/.test(value)) { //如果用户输入的密码 包含了小写的a到z
		arr.push(2);
	}
	if (/[A-Z]/.test(value)) { //如果用户输入的密码 包含了大写的A到Z
		arr.push(3);
	}
	if (/\W/.test(value)) { //如果是非数字 字母 下划线
		arr.push(4);
	}
	for (let i = 0; i < array.length; i++) {
		if (arr.indexOf(array[i]) === -1) {
			return array[i];
		}
	}
}

function judgePassword(value) {
	// 0： 表示第一个级别 1：表示第二个级别 2：表示第三个级别	3： 表示第四个级别 4：表示第五个级别
	let temp = 1;
	if (value.length < 6) return temp; //最初级别
	if (/\d/.test(value)) temp++; //如果用户输入的密码 包含了数字
	if (/[a-z]/.test(value)) temp++; //如果用户输入的密码 包含了小写的a到z
	if (/[A-Z]/.test(value)) temp++; //如果用户输入的密码 包含了大写的A到Z
	if (/\W/.test(value)) temp++; //如果是非数字 字母 下划线
	if (value.length > 12) temp++; //密码长度大于12密码难度加1
	return temp;
}

/** 根据传入的参数bankno验证银行卡号是否符合相关规范。如果传入keywoed关键词,会同时验证银行卡号是否为空以及是否符合相关规范。
 * 如果传入reversal关键词，则对结果进行取反操作。
 * @method checkIdCard(bankno,keyWord,reversal)
 * @for check.js
 * @param{String,String,Boolean} 		bankno 银行卡号, keyWord 提示关键词, reversal是否对结果取反
 * @return {Boolean} 布尔类型			布尔类型,当传入的bankno参数符合银行卡号规范时，返回false,但当reversal为true时返回false。
 */
function checkBankCardNumber(bankno, keyword = false, reversal = false) {
	let temp = true;
	let reg = /^\d{1,}$/;
	// 银行卡号长度不能小于16大于19
	if (temp && bankno.length < 16 || bankno.length > 19) temp = false;
	// 银行卡号必须全为数字
	if (temp && !reg.test(bankno)) temp = false;
	//开头6位码
	var strBin =
		"10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";
	// 开头六位数必须符合相关规定
	if (temp && strBin.indexOf(bankno.substring(0, 2)) == -1) temp = false;
	//Luhm校验（新）
	if (temp && !luhmCheck(bankno)) temp = false;
	if (!keyword) return temp;
	else {
		if (bankno.length <= 0) {
			uni.showToast({
				icon: "none",
				title: keyword + "不能为空！",
				duration: 2000,
				position: 'bottom'
			});
			return reversal;
		}
		if (!temp) {
			uni.showToast({
				icon: "none",
				title: keyword + "格式错误！",
				duration: 2000,
				position: 'bottom'
			});
			return reversal;
		}
		return !reversal;
	}
}
/** 根据传入的参数amount验证金额数是否符合相关规范。如果传入keywoed关键词,会同时验证金额数是否为空以及是否符合相关规范。
 * 如果传入reversal关键词，则对结果进行取反操作。
 * @method checkAmount(amount,keyWord,reversal)
 * @for check.js
 * @param{String,String,Boolean} 		amount 金额数, keyWord 提示关键词, reversal是否对结果取反
 * @return {Boolean} 布尔类型			布尔类型,当传入的amount参数符合金额数规范时，返回false,但当reversal为true时返回false。
 */
function checkAmount(amount, keyword = false, reversal = false) {
	let reg = new RegExp(/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/);
	if (!keyword) {
		return reg.test(amount);
	} else {
		if (amount.length <= 0) {
			uni.showToast({
				icon: "none",
				title: keyword + "不能为空！",
				duration: 2000
			});
			return reversal;
		}
		if (!reg.test(amount)) {
			uni.showToast({
				icon: "none",
				title: keyword + "格式错误！",
				duration: 2000
			})
			return reversal;
		}
		return !reversal;
	}
}

function luhmCheck(bankno) {
	var lastNum = bankno.substr(bankno.length - 1, 1); //取出最后一位（与luhn进行比较）
	var first15Num = bankno.substr(0, bankno.length - 1); //前15或18位
	var newArr = new Array();
	for (var i = first15Num.length - 1; i > -1; i--) { //前15或18位倒序存进数组
		newArr.push(first15Num.substr(i, 1));
	}
	var arrJiShu = new Array(); //奇数位*2的积 <9
	var arrJiShu2 = new Array(); //奇数位*2的积 >9
	var arrOuShu = new Array(); //偶数位数组
	for (var j = 0; j < newArr.length; j++) {
		if ((j + 1) % 2 == 1) { //奇数位
			if (parseInt(newArr[j]) * 2 < 9) arrJiShu.push(parseInt(newArr[j]) * 2);
			else arrJiShu2.push(parseInt(newArr[j]) * 2);
		} else //偶数位
			arrOuShu.push(newArr[j]);
	}
	var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
	var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
	for (var h = 0; h < arrJiShu2.length; h++) {
		jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
		jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
	}
	var sumJiShu = 0; //奇数位*2 < 9 的数组之和
	var sumOuShu = 0; //偶数位数组之和
	var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
	var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
	var sumTotal = 0;
	for (var m = 0; m < arrJiShu.length; m++) {
		sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
	}
	for (var n = 0; n < arrOuShu.length; n++) {
		sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
	}
	for (var p = 0; p < jishu_child1.length; p++) {
		sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
		sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
	}
	//计算总和
	sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);
	//计算luhn值
	var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
	var luhn = 10 - k;
	if (lastNum == luhn) {
		// $("#banknoInfo").html("luhn验证通过");
		return true;
	} else {
		// $("#banknoInfo").html("银行卡号必须符合luhn校验");
		return false;
	}
}

export default {
	init() {
		return {
			check: {
				checkEmail,
				checkPassWord,
				checkPhoneNumber,
				checkIdCard,
				checkBankCardNumber,
				judgePassword,
				checkNull,
				checkRealName,
				chekcChinese,
				checkAmount
			}
		}
	}
}
