// #ifdef VUE2
import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex)

//require.context(directory,useSubdirectories,regExp)
// directory:表示检索的目录
// useSubdirectories：表示是否检索子文件夹
// regExp:匹配文件的正则表达式,一般是文件名

///挂在modules下所有模块
const modulesDir = require.context("./modules",false, /^.*\.js$/)
const modules = {}
modulesDir.keys().forEach(fileName =>{
	let comp = modulesDir(fileName)
	modules[fileName.replace(/^\.\/(.*)\.\w+$/, "$1")] = comp.default;
})
//挂载getter路径下所有getter
const gettersDir = require.context("./getters", false, /^.*\.js$/)
let getters = {}
gettersDir.keys().forEach(fileName => {
	let comp = gettersDir(fileName);
	getters = {
		...getters,
		...comp.default
	};
});

//挂载action下所有action
const actionsDir = require.context("./actions", false, /^.*\.js$/);
let actions = {};
actionsDir.keys().forEach(fileName => {
	let comp = actionsDir(fileName);
	actions = {
		...actions,
		...comp.default
	};
});

export default new Vuex.Store({
	modules,
	getters,
	actions
});
// #endif

// #ifdef VUE3
import {
	createStore
} from 'vuex'
const modulesDir = require.context("./modules", false, /^.*\.js$/);
const modules = {};
modulesDir.keys().forEach(fileName => {
	let comp = modulesDir(fileName);
	modules[fileName.replace(/^\.\/(.*)\.\w+$/, "$1")] = comp.default;
});
// 挂载getter路径下所有getter
const gettersDir = require.context("./getters", false, /^.*\.js$/);
let getters = {};
gettersDir.keys().forEach(fileName => {
	let comp = gettersDir(fileName);
	getters = {
		...getters,
		...comp.default
	};
});
// 挂载action目录下所有action
const actionsDir = require.context("./actions", false, /^.*\.js$/);
let actions = {};
actionsDir.keys().forEach(fileName => {
	let comp = actionsDir(fileName);
	actions = {
		...actions,
		...comp.default
	};
});
export default createStore({
	modules,
	getters,
	actions
})
// #endif
