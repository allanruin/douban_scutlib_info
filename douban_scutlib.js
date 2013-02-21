// ==UserScript==
// @name       豆瓣华工图书馆自动查找
// @namespace  http://allan.100steps.net
// @version    0.1
// @description  自动查找华工图书馆是否有这本书
// @match      http://book.douban.com/subject/*
// @copyright  2012+, AllanRuin
// ==/UserScript==

var title_span = document.getElementsByTagName('h1')[0].childNodes[1];
var bookTitle = title_span.textContent;
var data = 'cmdACT=simple.list&TABLE=&RDID=&CODE=&SCODE=&PAGE=&CLANLINK=&libcode=&MARCTYPE=&ORGLIB=SCUT&FIELD1=TITLE&VAL1='+bookTitle+'&MODE=FRONT';

GM_xmlhttpRequest({
  method: "POST",
  url: 'http://202.38.232.10/opac/servlet/opac.go',
  data: encodeURI(data),
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  },
  onload: ResponseProcessor
});

function ResponseProcessor(response){
	var doc = document.implementation.createHTMLDocument();
	doc.documentElement.innerHTML = response.responseText;

	var result_tbody = doc.getElementById('result_content').childNodes[1]
		,result_count = Number(doc.getElementsByTagName('font')[1].innerText)
		,first_row_content = result_tbody.childNodes[2].innerText
		,borrowinfo = document.getElementById('borrowinfo')
		,buy_info = document.getElementById('buyinfo');
	if (borrowinfo === null){

		if (result_count !=0 ){
			var info_div_str = '<div class="gray_ad" id="borrowinfo"><h2>在哪儿借这本书?</h2>'  +
			'<ul class="bs more-after"><li style="border: none"><a href="http://202.38.232.10/' +
			'opac/servlet/opac.go?title='+ encodeURI(bookTitle) +'" target="_blank">华南理工大' +
			'学图书馆('+ result_count + ')</a></li><li style="border: none"></ul>'				+
			'<div class="clearfix"></div><div class="ft pl">'									+
			'<a class="rr" href="http://book.douban.com/library_invitation">&gt; 图书馆合作</a>'+
			'找不到你需要的图书馆？</div></div>';

			buy_info.insertAdjacentHTML('afterend',info_div_str);
		}
	}else{
		var ul_tag = borrowinfo.childNodes[3]
		var scut_litag = ul_tag.insertBefore(ul_tag.childNodes[1].cloneNode(true),ul_tag.childNodes[1]);
		scut_litag.childNodes[1].href = "http://202.38.232.10/opac/servlet/opac.go?title=" + encodeURI(bookTitle);
		scut_litag.childNodes[1].textContent = "华南理工大学图书馆("+ result_count +")";		
	}

}