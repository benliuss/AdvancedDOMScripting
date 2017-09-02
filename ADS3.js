/**
 * Created by asus on 2017/5/10.
 */
/**
 * 重复一个字符串
 */
if(!String.repeat){
	String.prototype.repeat=function (l) {
		return new Array(l+1).join(this);//////////
	}
}



/**
 * 清楚字符串开头和结尾的空白
 */
if(!String.trim){
	String.prototype.trim=function () {
		return this.replace(/^\s+|\s/g,'');//////////
	}
}



(function () {
	/**
	 * ADS命名空间
	 */
	if(!window.ADS){window['ADS']={}}



	/**
	 * 能力检测
	 */
	function isCompatible(other) {
		if(other===false
		||!Array.prototype.push
		||!Object.hasOwnProperty
		||!document.createElement
		||!document.getElementsByTagName){
			return false;
		}
		return true;
	}
	window['ADS']['isCompatible']=isCompatible;



	/**
	 * 通过id和元素查找所有元素
	 */
	function $() {
		var elements=new Array();
		for(var i=0;i<arguments.length;i++){
			var element=arguments[i];
			if(typeof element==='string'){
				element=document.getElementById(element);//////////
			}
			if(arguments.length===1){
				return element;
			}
			elements.push(element);
		}
		return elements;
	}
	window['ADS']['$']=$;



	/**
	 * 添加事件
	 */
	function addEvent(node,type,listener) {
		if(!isCompatible()){return false;}
		if(!(node=$(node))){return false;}

		if(node.addEventListener){
			node.addEventListener(type,listener,false);
			return true;
		}else if(node.attachEvent){
			/////////////////////
			node['e'+type+listener]=listener;
			node[type+listener]=function () {
				node['e'+type+listener](window.event);
			};

			node.attachEvent('on'+type,node[type+listener]);
			return true;
		}
		return false;
	}
	window['ADS']['addEvent']=addEvent;
	/**
	 * 移除事件
	 */
	function removeEvent(node,type,listener) {
		if(!(node=$(node))){return false;}

		if(node.removeEventListener){
			node.removeEventListener(type,listener,false);
			return true;
		}else if(node.detachEvent){
			node.detachEvent('on'+type,node[type+listener]);
			node[type+listener]=null;////
			return true;
		}
		return false;
	}
	window['ADS']['removeEvent']=removeEvent;



	/**
	 * 在标签内通过className查找所有元素
	 */
	function getElementsByClassName(className,tag,parent) {
		parent=parent||document;
		if(!(parent=$(parent))){return false;}

		var allTags=(tag==='*'&&parent.all)?parent.all:parent.getElementsByTagName(tag);////////
		var matchingElements=new Array();

		className=className.replace(/\-/g,'\\-');
		var regex=new RegExp('(^|\\s)'+className+'(\\s|$)');//////////////

		var element;
		for(var i=0;i<allTags.length;i++){
			element=allTags[i];
			if(regex.test(element.className)){
				matchingElements.push(element);
			}
		}
		return matchingElements;////////className查找呢？？
	}
	window['ADS']['getElementsByClassName']=getElementsByClassName;



	/**
	 * 改变显示形式，可见时改为none；不可见时改为value||''
	 */
	function toggleDisplay(node,value) {
		if(!(node=$(node))){return false;}

		if(node.style.display!=='none'){
			node.style.display='none';
		}else{
			node.style.display=value||'';
		}
		return true;
	}
	window['ADS']['toggleDisplay']=toggleDisplay;



	/**
	 * 后部插入
	 */
	function insertAfter(node,referenceNode) {
		if(!(node=$(node))){return false;}
		if(!(referenceNode=$(referenceNode))){return false;}

		return referenceNode.parentNode.insertBefore(node,referenceNode.nextSibling);
	}
	window['ADS']['insertAfter']=insertAfter;



	/**
	 * 移除全部子元素
	 */
	function removeChildren(parent) {
		if(!(parent=$(parent))){return false;}

		while(parent.firstChild){
			parent.firstChild.parentNode.removeChild(parent.firstChild);///////while循环
		}
		return parent;
	}
	window['ADS']['removeChildren']=removeChildren;



	/**
	 * 添加元素到第一子元素
	 */
	function prependChild(parent,newChild) {
		if(!(parent=$(parent))){return false;}
		if(!(newChild=$(newChild))){return false;}

		if(parent.firstChild){
			parent.insertAfter(newChild,parent.firstChild);
		}else{
			parent.appendChild(newChild);
		}
		return parent;
	}
	window['ADS']['prependChild']=prependChild;



	/**
	 * 将func作用域绑定到abj上
	 */
	function bindFunction(obj,func) {
		return function () {
			func.apply(obj,arguments);
		}
	}
	window['ADS']['bindFunction']=bindFunction;



	/**
	 * 取得浏览器视窗宽高
	 */
	function getBrowserWindowSize() {
		var de=document.documentElement;
		return{
			'width':(
				window.innerWidth
				||(de&&de.clientWidth)
				||document.body.clientWidth),
			'height':(
				window.innerHeight
				||(de&&de.clientHeight)
				||document.body.clientHeight)
		}
	}
	window['ADS']['getBrowserWindowSize']=getBrowserWindowSize;



	/**
	 * 创建node对象
	 */
	window['ADS']['node']={
		ELEMENT_NODE:1,
		ATTRIBUTE_NODE:2,
		TEXT_NODE:3,
		CDATA_SECTION_NODE:4,
		ENTITY_SECTION_NODE:5,
		ENTITY_NODE:6,
		PROCESSING_INSTRUCTION_NODE:7,
		COMMENT_NODE:8,
		DOCUMENT_NODE:9,
		DOCUMENT_TYPE_NODE:10,
		DOCUMENT_FRAGMENT_NODE:11,
		NOTATION_NODE:12
	};



	/**
	 *Walk the nodes in the DOM tree
	 */
	function walkElementsLinear(func,node) {
		var root=node||window.document;
		var nodes=root.getElementsByTagName('*');
		for(var i=0;i<nodes.length;i++){
			func.call(node[i]);
		}
	}
	window['ADS']['walkElementsLinear']=walkElementsLinear;



	/**
	 * Walk the nodes in the DOM tree maintaining parent/child relationships.
	 */
	function walkTheDOMRecursive(func,node,depth,returnedFromParent) {
		var root=node||window.document;
		returnedFromParent=func.call(root,depth++,returnedFromParent);

		node=root.firstChild;
		while (node){
			walkTheDOMRecursive(func,node,depth,returnedFromParent);
			node=node.nextSibling;////////////////
		}
	}
	window['ADS']['walkTheDOMRecursive']=walkTheDOMRecursive;



	/**
	 * Walk the nodes in the DOM tree maintaining parent/child relationships and include the node attributes as well.
	 */
	function walkTheDOMWithAttributes(func,node,depth,returnedFromParent) {
		var root=node||window.document;
		returnedFromParent=func.call(root,depth++,returnedFromParent);

		if(root.attributes){
			for(var i=0;i<root.attributes.length;i++){
				walkTheDOMWithAttributes(root.attributes[i],func,depth-1,returnedFromParent);////////////////
			}
		}
		if(root.nodeType!==ADS.node.ATTRIBUTE_NODE){
			node=root.firstChild;
			while (node){
				walkTheDOMWithAttributes(node,func,depth,returnedFromParent);
				node=node.nextSibling;
			}
		}
	}
	window['ADS']['walkTheDOMWithAttributes']=walkTheDOMWithAttributes;



	/**
	 * word-word转换wordWord
	 */
	function camelize(s) {
		return s.replace(/-(\w)/g,function (strMatch,p1) {//////////
			return p1.toUpperCase();
		});
	}
	window['ADS']['camelize']=camelize;

	/**
	 * wordWord转换为word-word
	 */
	function uncamelize(s,sep) {
		sep=sep||'-';
		return s.replace(/([a-z])([A-Z])/g,function (strMatch,p1,p2) {
			return p1+sep+p2.toLowerCase();
		})
	}
})();
