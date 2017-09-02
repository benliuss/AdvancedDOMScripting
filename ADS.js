//重复一个字符串
if(!String.repeat){
    String.prototype.repeat=function (l) {
        return new Array(l+1).join(this);
    }
}



//清除结尾和开头处的空白符
if(!String.trim){
    String.prototype.trim=function () {
        return this.replace(/^\s+|\s/g,'');
    }
}



(function () {
    //ADS命名空间
    if(!window.ADS) {window['ADS']={}}



    //能力检测
    function isCompatible(other) {
        if(other===false
            ||!Array.prototype.push
            ||!Object.hasOwnProperty
            ||!document.createElement
            ||!document.getElementsByTagName
        ){
            return false;
        }
        return true;
    }
    window['ADS']['isCompatible']=isCompatible;



    //通过id或元素查找所有元素
    function $() {
        var elements = new Array();

        //查找作为参数提供的所有元素
        for (var i = 0; i < arguments.length; i++) {
            var element = arguments[i];

            //如果是一个字符串，那假设它是一个id
            if (typeof element == 'string') {
                element = document.getElementById(element);
            }

            //如果是一个参数，立即返回它
            if (arguments.length == 1) {
                return element;
            }

            //添加到数组
            elements.push(element);
        }
        return elements;
    };
    window['ADS']['$']=$;



    function addEvent(node,type,listener) {
        //检查兼容性，平稳退化
        if(!isCompatible()){return false;}
        if(!(node=$(node))){return false;}

        //W3C
        if(node.addEventListener) {
            node.addEventListener(type, listener, false);
            return true;
        }else if(node.attachEvent){
            //MSIE
            node['e'+type+listener]=listener;
            node[type+listener]=function () {
                node['e'+type+listener](window.event);
            }
            node.attachEvent('on'+type,node[type+listener]);
            return true;
        }

        //都无
        return false;
    };

    window['ADS']['addEvent']=addEvent;
    function removeEvent(node,type,listener) {
        if(!(node=$(node))){return false;}

        if(node.removeEventListener){
            //W3C
            node.removeEvent(type,listener,false);
            return true;
        }else if(node.detachEvent){
            //MSIE
            node.detachEvent('on'+type,node[type+listener]);
            node[type+listener]=null;
            return true;
        }

        //都无
        return false;
    };
    window['ADS']['removeEvent']=removeEvent;




    //在标签内通过className查找所有元素
    function getElementsByClassName(className,tag,parent) {
        parent=parent||document;
        if(!(parent=$(parent))) return false;

        //匹配所有标签元素
        var allTags=(tag == "*" && parent.all) ? parent.all : parent.getElementsByTagName(tag);
        var matchingElements=new Array();

        //创建正则表达式，判断className是否正确
        className=className.replace(/\-/g,"\\-");
        var regex=new RegExp("(^|\\s)"+className+"(\\s|$)");

        var element;
        //检查每个元素
        for(var i=0;i<allTags.length;i++){
            element=allTags[i];
            if(regex.test(element.className)){
                matchingElements.push(element);
            }
        }
        return matchingElements;
    };
    window['ADS']['getElementsByClassName']=getElementsByClassName;



    function toggleDisplay(node,value) {
        if(!(node=$(node))){return false}

        if(node.style.display!='none'){
            node.style.display='none';
        }else{
            node.style.display=value||'';
        }
        return true;
    }
    window['ADS']['toggleDisplay']=toggleDisplay;



    function insertAfter(node,referenceNode) {
        if(!(node=$(node))) return false;
        if(!(referenceNode=$(referenceNode))) return false;

        return referenceNode.parentNode.insertBefore(node,referenceNode.nextSibling);
    };
    window['ADS']['insertAfter']=insertAfter;


    function removeChildren(parent) {
        if(!(parent=$(parent))){return false}

        //存在子节点时删除子节点
        while(parent.firstChild){
            parent.firstChild.parentNode.removeChild(parent.firstChild);
        }

        //返回父元素，实现方法连缀
        return parent;
    };
    window['ADS']['removeChildren']=removeChildren;

    function prependChild(parent,newChild) {
        if(!(parent=$(parent))) {return false}
        if(!(newChild=$(newChild))) {return false}

        //存在子节点，之前添加
        if(parent.firstChild){
            parent.insertBefore(newChild,parent.firstChild);
        }else{
            //否则直接添加
            parent.appendChild(newChild);
        }
        //返回父元素，实现方法连缀
        return parent;
    }
    window['ADS']['prependChild']=prependChild;



    function bindFunction(obj,func) {
        return function () {
            func.apply(obj,arguments);
        };
    };
    window['ADS']['bindFunction']=bindFunction;



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
    };
    window['ADS']['getBrowserWindowSize']=getBrowserWindowSize;



    window['ADS']['node']={
        ELEMENT_NODE:1,
        ATTRIBUTE_NODE:2,
        TEXT_NODE:3,
        CDATA_SECTION_NODE:4,
        ENTITY_REFERENCE_NODE:5,
        ENTITY_NODE:6,
        PROCESSING_INSTRUCTION_NODE:7,
        COMMENT_NODE:8,
        DOCUMENT_NODE:9,
        DOCUMENT_TYPE_NODE:10,
        DOCUMENT_FRAGMENT_NODE:11,
        NOTATION_NODE:12
    };



    //遍历DOM树
    function walkElementsLinear(func,node) {
        var root=node||window.document;
        var nodes=root.getElementsByTagName("*");
        for(var i=0;i<nodes.length;i++){
            func.call(node[i]);
        }
    };
    window['ADS']['walkElementsLinear']=walkElementsLinear;

    /**
     * Walk the nodes in the DOM tree maintaining parent/child relationships.
     */
    function walkTheDOMRecursive(func,node,depth,returnedFromParent) {
        var root=node||window.document;
        returnedFromParent=func.call(root,depth++,returnedFromParent);
        node=root.firstChild;
        while(node){
            walkTheDOMRecursive(func,node,depth,returnedFromParent);
            node=node.nextSibling;
        }
    };
    window['ADS']['walkTheDOMRecursive']=walkTheDOMRecursive;

    /**
     *Walk the nodes in the DOM tree maintaining parent/child relationships and include the node attributes as well.
     */
    function walkTheDOMWithAttributes(func,node,depth,returnedFromParent) {
        var root=node||window.document;
        returnedFromParent=func.call(root,depth++,returnedFromParent);
        if(root.attributes){
            for(var i=0;i<root.attributes.length;i++){
                walkTheDOMWithAttributes(root.attributes[i],func,depth-1,returnedFromParent);
            }
        }
        if(root.nodeType!=ADS.node.ATTRIBUTE_NODE){
            node=root.firstChild;
            while(node){
                walkTheDOMWithAttributes(node,func,depth,returnedFromParent);
                node=node.nextSibling;
            }
        }
    };
    window['ADS']['walkTheDOMWithAttributes']=walkTheDOMWithAttributes;



    /* 把word-word转换为wordWord */
    function camelize(s) {
        return s.replace(/-(\w)/g,function (strMatch,p1) {
            return p1.toUpperCase();
        });
    }
    window['ADS']['camelize']=camelize;

    /**
     * 把wordWord转换为word-word
     */
    function uncamelize(s,sep) {
        sep=sep||'-';
        return s.replace(/([a-z])([A-Z])/g,function (strMatch,p1,p2) {
            return p1+sep+p2.toLowerCase();
        });
    }
    window['ADS']['uncamelize']=uncamelize;



    //阻止冒泡
    function stopPropagation(eventObject) {
        eventObject=eventObject||getEventObject(eventObject);
        if(eventObject.stopPropagation){
            eventObject.stopPropagation();
        }else{
            //MSIE
            eventObject.cancelBubble=true;
        }
    }
    window['ADS']['stopPropagation']=stopPropagation;



    //取消默认动作
    function preventDefault(eventObject) {
        eventObject=eventObject||geteventObject(eventObject);
        if(eventObject.preventDefault){
            eventObject.preventDefault();
        }else{
            eventObject.returnValue=false;
        }
    }
    window['ADS']['preventDefault']=preventDefault;



    //load事件的问题（标记中嵌入图像）
    function addLoadEvent(loadEvent,waitForImages) {
        if(!isCompatible()) return false;

        //如果等待标记是true，使用常规添加事件方法
        if(waitForImages){
            return addEvent(window,'load',loadEvent);
        }

        //否则使用一些不同的方式包装loadEvent()方法
        //以便为this关键字指定正确的内容，同时确保事件不会冒泡
        var init=function () {

            //如果这个函数已经被调用了则返回
            if(arguments.callee.done) return;

            //标记这个函数以便检验它是否运行过
            arguments.callee.done=true;

            //在document的环境中运行载入事件
            loadEvent.apply(document,arguments);
        };

        //为DOMContentLoadLoaded事件注册事件侦听器
        if(document.addEventListener){
            document.addEventListener("DOMContentLoaded",init,false)
        }

        //对于Safari，使用setInterval()函数检测document是否载入完成
        if(/WebKit/i.test(navigator.userAgent)){
            var _timer=setInterval(function () {
                if(/loaded|complete/.test(document.readyState)){
                    clearInterval(_timer);
                    init();
                }
            },10);
        }

        //对于IE（使用条件注释）
        //附加一个在载入过程最后执行的脚本，
        //并检测该脚本是否载入完成
        /*@cc_on @*/
        /*if (@_win32)
        document.write("<script id=__ie_onload defer src=javascript:void(0)><\/script>");
        var script=document.getElementById("__ie_onload");
        script.onreadystatechange=function() {
            if(this.readyState=="comeplete"){
                init();
            }
        };
        /*@end @*/
        return true;
    }
    window['ADS']['addLoadEvent']=addEvent;



    //取得事件对象
    function getEventObject(W3CEvent) {
        return W3CEvent||window.event;
    }
    window['ADS']['getEventObject']=getEventObject;



    //访问事件的目标函数
    function getTarget(eventObject) {
        eventObject||getEventObject(eventObject);

        //如果是W3C或MSIE的模型
        var target=eventObject.target||eventObject.srcElement;

        //如果像Safari中一样是一个文本节点
        //重新将目标对象指定为父元素
        if(target.nodeType==ADS.node.TEXT_NODE){
            target=node.parentNode;
        }

        return target;
    }
    window['ADS']['getTarget']=getTarget;



    //处理IE的鼠标按键
    function getMouseButton(eventObject) {
        eventObject=eventObject||getEventObject(eventObject);

        //使用适当的属性初始化一个对象变量
        var buttons= {
            'left': false,
            'middle': false,
            'right': false
        };

        //检查eventObject的toString()方法值
        //W3C DOM对象有toString方法并且此时该方法的返回值应该是MouseEvent
        if(eventObject.toString&&eventObject.toString().indexOf('MouseEvent')!=-1){
            //W3C方法
            switch(eventObject.button){
                case 0:buttons.left=true; break;
                case 1:buttons.middle=true; break;
                case 2:buttons.right=true; break;
                default:break;
            }
        }else if(eventObject.button){
            //MSIE方法
            switch(eventObject.butotn){
                case 1:buttons.left=true; break;
                case 2:buttons.right=true; break;
                case 3:
                    buttons.left=true;
                    buttons.right =true;
                    break;
                case 4:buttons.middle=true; break;
                case 5:
                    buttons.left=true;
                    buttons.middle=true;
                    break;
                case 6:
                    buttons.middle=true;
                    buttons.right =true;
                    break;
                case 7:
                    buttons.left=true;
                    buttons.middle=true;
                    buttons.right =true;
                    break;
                default:break;
            }
        }else{
            return false;
        }

        return buttons;
    }
    window['ADS']['getMouseButton']=getMouseButton;



    //寻找光标相对与文档原点的位置
    function getPointerPositionInDocument(eventObject) {
        eventObject = eventObject || getEventObject(eventObject);

        var x = eventObject.pageX || (eventObject.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
        var y = eventObject.pageY || (eventObject.clientY + (document.documentElement.scrollTop || document.body.scrollTop));

        //现在x和y中包含着鼠标相对于文档原点的坐标
        return {'x': x, 'y': y};
    }
    window['ADS']['getPointerPositionInDocument']=getPointerPositionInDocument;



    //键盘取得键盘代码和相关ASCII值
    function getKeyPressed(eventObject) {
        eventObject=eventObject||getEventObject(eventObject);

        var code=eventObject.keyCode;
        var value=String.fromCharCode(code);
        return {'code':code,'value':value};
    }
    window['ADS']['getKeyPressed']=getKeyPressed;



    //通过ID修改单个元素的样式
    function setStyleById(element,styles) {
        //取得对象的引用
        if(!(element=$(element))) return false;

        //循环遍历styles对象并应用每个属性
        for(property in styles){
            if(!styles.hasOwnproperty(property)) continue;

            if(element.style.setProperty) {
                //DOM2规范样式方法
                element.style.setProperty(
                    uncamelize(property, '-'), styles[property], null);
            }else{
                //备用方法
                element.style[camelize(property)]=styles[property];
            }
        }
        return true;
    }
    window['ADS']['setStyle']=setStyleById;
    window['ADS']['setStyleById']=setStyleById;

    //通过类名修改多个元素的样式
    function setStylesByClassName(parent,tag,className,styles) {
        if(!(parent=$(parent))) return false;
        var elements=getElementsByClassName(className,tag,parent);
        for(var e=0;e<elements.length;e++){
            setStyleById(elements[e],styles);
        }
        return true;
    }
    window['ADS']['setStylesByClassName']=setStylesByClassName;

    //通过标签名修改多个元素的样式
    function setStylesByTagName(tagname,styles,parent) {
        parent=$(parent)||document;
        var elements=parent.getElementsByTagName(tagname);
        for(var e=0;e<elements.length;e++){
            setStyleById(elements[e],styles);
        }
        return true;
    }
    window['ADS']['setStylesByTagName']=setStylesByTagName;



    /*取得包含元素类名的数组*/
    function getClassNames(element) {
        if(!(element=$(element))) return false;

        //用一个空格符替换多个空格
        //基于空格分割类名
        return element.className.replace(/\s+/,' ').split(' ');
    };
    window['ADS']['getClassNames']=getClassNames;

    /*检查元素中是否存在某个类*/
    function hasClassName(element,className) {
        if(!(element=$(element))) return false;
        var classes=getClassNames(element);
        for(var i=0;i<classes.length;i++){
            //检测className与classes是否匹配，是则返回true
            if(classes[i]===className) {
                return true;
            }
        }
        return false;
    };
    window['ADS']['hasClassName']=hasClassName;

    /*为元素添加类*/
    function addClassName(element,className) {
        if(!(element=$(element))) return false;
        //将类名添加到当前className的末尾
        //如果没有className，不包含空格
        element.className+=(element.className?' ':'')+className;
        return true;
    };
    window['ADS']['addClassName']=addClassName;

    /*从元素中删除类*/
    function removeClassName(element,className) {
        if(!(element=$(element))) return false;
        var classes=element.getClassNames(element);
        var length=classes.length;
        //遍历数组删除匹配的项
        //因为从数组中删除项会使数组变短，所以要反向循环
        for(var i=length-1;i>=0;i++){
            if(classes[i]===className){
                delete(classes[i]);
            }
        }
        element.className=classes.join(' ');
        return(length==classes.length?false:true);
    };
    window['ADS']['removeClassName']=removeClassName;



    /*添加新样式表*/
    function addStyleSheet(url,media){
        media=media||'screen';

        var link=document.createElement('LINK');
        link.setAttribute('rel','stylesheet');
        link.setAttribute('type','text/css');
        link.setAttribute('href',url);
        link.setAttribute('media',media);

        document.getElementsByTagName('head')[0].appendChild(link);
    }
    window['ADS']['addStyleSheet']=addStyleSheet;

    /*移除样式表*/
    function removeStyleSheet(url,media) {
        var styles=getStyleSheets(url,media);
        for(var i=0;i<styles.length;i++){
            var node=styles[i].ownerNode||styles[i].owningElement;
            //禁用样式表
            styles[i].disabled=true;
            //移除节点
            node.parentNode.removeChild(node);
        }
    }
    window['ADS']['removeStyleSheet']=removeStyleSheet;



    /*通过URL取得所有样式表的数组*/
    function getStyleSheets(url,media) {
        var sheets=[];
        for(var i=0;i<document.styleSheets.length;i++){
            if(url&&document.styleSheets[i].href.indexOf(url)==-1){
                continue;
            }
            if(media){
                //规范化media字符串
                media=media.replace(/,\s*/,',');
                var sheetMedia;

                if(document.styleSheets[i].media.mediaText){
                    //DOM方法
                    sheetMedia=document.styleSheets.media.mediaText.replace(/,\s*/,',');
                    //Safari会添加额外的逗号和空格
                    sheetMedia=sheetMedia.replace(/,\s*$/,'');
                }else{
                    //MSIE方法
                    sheetMedia=document.styleSheets[i].media.replace(/,\s*/,',');
                }

                //如果media不匹配则跳过
                if(media!=sheetMedia){continue;}
            }
            sheets.push(document.styleSheet[i]);
        }
        return sheets;
    }
    window['ADS']['getStyleSheets']=getStyleSheets;



    /*编辑一条样式规则*/
    function editCSSRule(selector,styles,url,media) {
        var styleSheets=(typeof url=='array'?url:getStyleSheets(url,media));

        for(var i=0;i<styleSheets.length;i++){

            //取得规则列表
            //DOM2样式规范方法是styleSheet[i].cssRules
            //MSIE方法是styleSheet[i].rules
            var rules=styleSheets[i].cssRules||styleSheets[i].rules;
            if(!rules) {continue;}

            //由于MSIE默认是用大写故转换为大写格式
            //如果你使用的是区分大小写的id，则可能会导致冲突
            selector=selector.toUpperCase();

            for(var j=0;j<rules.length;j++){
                //检查选择器是否匹配
                if(rules.selectorText.toUpperCase()==selector){
                    for(property in styles){
                        if(!styles.hasOwnProperty(property)) {continue;}
                        //设置新样式属性
                        rules[j].style[camelize(property)]=styles[property];
                    }
                }
            }
        }
    }
    window['ADS']['editCSSRule']=editCSSRule;

    /*添加一条规则*/
    function addCSSRule(selector,styles,index,url,media) {
        var declaration='';

        //根据styles参数（样式对象）构建声明字符串
        for(property in styles){
            if(!styles.hasOwnProperty(property)) {continue;}
            declaration+=property+':'+styles[property]+';';
        }

        var styleSheets=(typeof url=='array'?url:getStyleSheets(url,media));
        var newIndex;
        for(var i=0;i<styleSheets.length;i++){
            //添加规则
            if(styleSheets[i].insertRule){
                //DOM2样式规范方法
                //index是列表末尾
                newIndex=(index>=0?index:styleSheets[i].cssRules.length);
                styleSheets[i].insertRule(
                    selector+'{'+declaration+'}',
                    newIndex
                );
            }else if(styleSheets[i].addRule){
                //Microsoft方法
                //index=-1是列表末尾
                newIndex=(index>=0?index:-1);
                styleSheets[i].addRule(selector,declaration,newIndex);
            }
        }
    }
    window['ADS']['addCSSRule']=addCSSRule;











})();