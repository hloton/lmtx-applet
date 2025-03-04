import Vue from 'vue'
import check from './check'
import http from './http'
import uniAdd from './uni-add.js'
import plugs from './plugs.js'

const models = {
	check,
	http,
	uniAdd,
	plugs
}

function install() {
	for (let key of Object.keys(models)) {
		const element = models[key].init()
		for (let index of Object.keys(element)) {
			uni[`$${index}`] = element[index]
			// #ifdef VUE2
			Vue.prototype[`$${index}`] = element[index]
			// #endif
			// #ifdef VUE3
			app.config.globalProperties[`${index}`] = element[index]
			// #endif

		}

	}
}

const utils = {
	install
};

export default utils
