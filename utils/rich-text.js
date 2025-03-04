// 临时变量，替换方法的载体
let graceRichTextReg;
// 一一对应替换关系
const GRT = [
	['div', "word-break:break-all;"],
	['h1', "font-size:3em;"],
	['h2', "font-size:2em;"],
	['h3', "font-size:1.6em;"],
	['h4', "font-size:1.2em;"],
	['h5', "font-size:1em;"],
	['h6', "font-size:0.9em;"],
	['p', "font-size:1em;word-break: break-all;"],
	['b', "font-size:1em;"],
	['strong', "font-size:1em;"],
	['code', "font-size:1em; line-height:1.2em; background:#F6F7F8; padding:8px 2%; width:96%;"],
	['img', "width:100%; vertical-align:middle;"],
	['blockquote',
		"font-size:1em; border-left:3px solid #D1D1D1; line-height:2em; border-radius:5px; background:#F6F7F8; padding:8px 2%;"
	],
	['ul', "padding:5px 0; list-style:none; padding:0; margin:0;"],
	['li', "line-height:1.5em; padding:5px 0; list-style:none; padding:0; margin:0; margin-top:10px;"],
	['table', "width:100%; border-left:1px solid #F2F3F4; border-top:1px solid #F2F3F4;"],
	['th', "border-right:1px solid #F2F3F4; border-bottom:1px solid #F2F3F4;"],
	['td', "border-right:1px solid #F2F3F4; border-bottom:1px solid #F2F3F4; padding-left:5px;"]
];
// 进行数据清理
function dataClean(value) {
	// 原作者自带	开始
	value = value.replace(/<pre.*pre>?/gis, function (word) {
		word = word.replace(/[\n]/gi, '<br />');
		word = word.replace(/    /gi, '<span style="padding-left:2em;"></span>');
		return word.replace(/[\t]/gi, '<span style="padding-left:2em;"></span>');
	});
	value = value.replace(/<pre/gi,
		'<p style="font-size:1em; margin:12px 0; line-height:1.2em; background:#F6F7F8; border-radius:5px; padding:8px 4%; width:92%;"'
	);
	value = value.replace(/<\/pre/gi, "</p");
	// 原作者自带	结束
	value = value.replace(new RegExp("<o:p></o:p>", "gm"), "");
	value = value.replace(new RegExp(' face="宋体"', "gm"), "");
	value = value.replace(new RegExp('<font', "gm"), "<span");
	value = value.replace(new RegExp('</font', "gm"), "</span");
	value = value.replace(new RegExp('\n', "gm"), "<br />");
	return value;
}

export default {
	format: function (html) {
		if (typeof html != 'string') {
			console.warn('富文本格式化仅支持传入字符串参数')
			return
		}
		if (html.length <= 0) return ''
		html = dataClean(html);
		for (let i = 0; i < GRT.length; i++) {
			graceRichTextReg = new RegExp('<' + GRT[i][0] + '>|<' + GRT[i][0] + ' (.*?)>', 'gi');
			html = html.replace(graceRichTextReg, function (word) {
				if (word.indexOf('style=') != -1) {
					var regIn = new RegExp('<' + GRT[i][0] + '(.*?)style="(.*?)"(.*?)(/?)>', 'gi');
					return word.replace(regIn, '<' + GRT[i][0] + '$1style="$2 ' + GRT[i][1] + '"$3$4>');
				} else {
					var regIn = new RegExp('<' + GRT[i][0] + '(.*?)(/?)>', 'gi');
					return word.replace(regIn, '<' + GRT[i][0] + '$1 style="' + GRT[i][1] + '$2">');
				}
			});
		}
		return html;
	}
}
