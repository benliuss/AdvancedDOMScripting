/**
 * Created by asus on 2017/3/21.
 */
/*重复一个字符串*/
if(!String.repeat){
    String.prototype.repeat=function (l) {
        return new Array(1+l).join(this);
    }
}

/*清除结尾和开头处的空白*/
if(!String.trim){
    String.prototype.trim=function () {
        return this.replace(/^\s+|\s/g,'');
    }
}

(function () {
    //ADS命名空间
    if(!window.ADS){window['ADS']={}}

    /*能力检测*/
    function isCompatible(other) {
        if (other === false
            || !Array.prototype.push
            || !Object.hasOwnProperty
            || !document.createElement
            || !document.getElementsByTagName
        ) {
            return false;
        }
        return true;
    }
    window['ADS']['isCompatible']=isCompatible;

    /*通过id和元素查找所有元素*/
    function $() {
        var elements=new Array();
        for(var i=0;i<arguments.length;i++){
            var element=arguments[i];
            if(typeof element=='string'){
                element=document.getElementById(element);
            }
            if(arguments.length==1){
                return element;
            }
            elements.push(element);
        }
        return elements;
    }
    window['ADS']['$']=$;

    function addEvent(node,type,listener) {
        if(!isCompatible()){return false;}
        if(!(node=$(node))){return false;}

        if(node.addEventListener){
            node.addEventListener(type,listener,false);
            return true;
        }else if(node.attachEvent){
            node['e'+type+listener]=listener;
            node[type+listener]=function () {
                node['e'+type+listener](window.event);
            }
            node.attachEvent('on'+type,node[type+listener]);
            return true;
        }
        return false;
    }
    window['ADS']['addEvent']=addEvent;

    function removeEvent(node,type,listener) {
        if(!(node=$(node))){return false;}

        if(node.removeEventListener){
            node.removeEvent(type,listener,false);
            return false;
        }
        if(node.detachEvent){
            node.detachEvent('on'+type,node[type+listener]);
            node[type+listener]=null;
            return true;
        }
        return false;
    };
    window['ADS']['removeEvent']=removeEvent;

    /*在标签内通过class查找所有元素*/
    function getElementsByClassName(className,tag,parent) {
        parent=parent||document;
        if(!(parent=$(parent))){return false;}

        var allTags=(tag=='*'&&parent.all)?parent.all:parent.getElementsByTagName(tag);
        var matchingElements=new Array();
        className=className.replace(/\-/g,"\\-");
        var regex=new RegExp("(|\\s)"+className+"(\\s|$)");

        var element;
        for(var i=0;i<allTags.length;i++){
            element=allTags[i];
            if(regex.text(element.className)){
                matchingElements.push(element);
            }
        }
        return matchingElements;
    }
    window['ADS']['getElementsByClassName']=getElementsByClassName;

    function toggleDisplay(node,value) {
        if((node=$(node))){return false};

        if(node.style.display!='none'){
            node.style.display='none';
        }else{
            node.style.display=value|'';
        }
        return true;
    }
    window['ADS']['toggleDisplay']=toggleDisplay;

    function insertAfter(node,referenceNode) {
        if(!(node=($node))){return false;}
        if(!(referenceNode=$(referenceNode))){return false};

        return referenceNode.parentNode.insertBefore(node,referenceNode.nextSibling);
    };
    window['ADS']['insertAfter']=insertAfter;

    function removeChildren(parent) {
        if(!(parent=$(parent))){return false};

        while(parent.firstChild){
            parent.firstChild.parentNode.removeChild(parent.firstChild);
        }
        return parent;
    };
    window['ADS']['removeChildren']=removeChildren;

    function prependChild(parent,newChild) {
        if(!(parent=$(parent))){return false;}
        if(!(newChild=$(newChild))){return false;}

        if(parent.firstChild){
            parent.insertBefore(newChild,parent.firstChild)
        }else{
            parent.appendChild(newChild);
        }
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
        return {
            'width': (
            window.innerWidth
            || (de && de.clientWidth)
            || document.body.clientWidth),
            'height': (
            window.innerHeight
            || (de && de.clientHeight)
            || document.body.clientHeight)
        }
    }
    window['ADS']['getBrowserWindowSize']=getBrowserWindowSize;

    window['ADS']['node']={
        ELEMENT_NODE:1,
        ATTRIBUTE_NODE:2,
        TEXT_NODE:3,
        CATA_SECTION_NODE:4,
        ENTITY_REFERENCE_NODE:5,
        ENTITY_NODE:6,
        PROCESSING_NODE:7,
        COMMENT_NODE:8,
        DOCUMENT_NODE:9,
        DOCUMENT_TYPE_NODE:10,
        DOCUMENT_FRAGMENT_NODE:11,
        NOTATION_NODE:12
    }

    function walkElementsLinear(func,node) {
        var root=node||window.document;
        var nodes=root.getElementsByClassName('*');
        for(var i=0;i<nodes.length;i++){
            func.call(node[i]);
        }
    }
    window['ADS']['walkElementsLinear']=walkElementsLinear;

    function walkTheDOMRecursive(func,node,depth,returnedFromParent) {
        var root=node||window.document;
        returnedFromParent=func.call(root,depth++,returnedFromParent);
        node=root.firstChild;
        while(node){
            walkTheDOMRecursive(func,node,depth,returnedFromParent);
            node=node.nextSibling;
        }
    }
    window['ADS']['walkTheDOMRecursive']=walkTheDOMRecursive;

    function walkTheDOMWithAttributes(func,node,depth,returnedFromParent) {
        var root=node||window.document;
        returnedFromParent=func.call(root,depth++,returnedFromParent);
        if(root.attributes) {
            for (var i = 0; i < root.attributes.length; i++) {
                walkTheDOMWithAttributes(root.attributes[i], func, depth - 1, returnedFromParent);
            }
        }
        if(root.nodeType!=ADS.node.ATTRIBUTE_NODE){
            node=root.fristChild;
            while(node){
                walkTheDOMWithAttributes(node,func,depth,returnedFromParent);
                node=node.nextSibling;
            }
        }
    }
    window['ADS']['walkTheDOMWithAttributes']=walkTheDOMWithAttributes;

    /*吧word-word转换为wordWord*/
    function camelize(s) {
        return s.replace(/-(\w)/g,function (strMath,p1) {
            return p1.toUpperCase();
        });
    }
    window['ADS']['camelize']=camelize;

    function uncamelize(s,sep) {
        sep=sep||'-';
        return s.repace(/([a-z])([A-Z])/g,function (strMatch,p1,p2) {
            return p1+sep+p2.toLowerCase();
        });
    }
    window['ADS']['uncamelize']=uncamelize;

    /*阻止冒泡*/
    function stopPropagation(eventObject) {
        eventObject=eventObject||getEventObject(eventObject);
        if(eventObject.stopPropagation){
            eventObject.stopPropagation();
        }else{
            eventObject.cancelBubble=true;
        }
    }
    window['ADS']['stopPropagation']=stopPropagation;

    /*取消默认动作*/
    function preventDefault(eventObject) {
        eventObject=eventObject||getEventObject(eventObject);
        if(eventObject.preventDefault){
            eventObject.preventDefault();
        }else{
            eventObject.returnValue=false;
        }
    }
    window['ADS']['preventDefault']=preventDefault;

    /*load事件的问题，若标记中载入图像*/
    function addLoadEvent(loadEvent,waitForImages) {
        if(!isCompatible()) return false;
        if(waitForImages){
            return addEvent(window,'load',loadEvent);
        }
        var init=function () {
            if(arguments.callee.done) return;
            arguments.callee.done=true;
            loadEvent.apply(document,arguments);
        };
        if(document.addEventListener){
            document.addEventListener("DOMContentLoaded",init,false)
        }
        if(/WebKit/i.test(navigator.userAgent)){
            var _timer=setInterval(function () {
                if(/load|complete/.test(document.readyState)){
                    clearInterval(_timer);
                    init();
                }
            },10);
        }
        /*@cc_on @*/
        /*if (@_win32)
        document.write("<script id=__ie_onload defer src=javascript:void(0)><\/script>");
        var script=document.getElementByID("__ie_onload");
        ...*/

    }
    window['ADS']['addLoadEvent']=addLoadEvent;

    /*取得事件对象*/
    function getEventObject(W3CEvent) {
        return W3CEvent||window.event;
    }
    window['ADS']['getEventObject']=getEventObject;

    /*访问事件目标函数*/
    function getTarget(eventObject) {
        eventObject=eventObject||getEventObject(eventObject);
        var target=eventObject.target||eventObject.srcElement;
        if(target.nodeType==ADS.node.TEXT_NODE){
            target=node.parentNode;
        }
        return target;
    }
    window['getTarget']=getTarget;

    /*处理IE鼠标按键*/
    function getMouseButton(eventObject) {
        eventObject=eventObject||getEventObject(eventObject);
        var buttons={
            'left':false,
            'middle':false,
            'right':false
        };
        if(eventObject.toString&&eventObject.toString().indexOf('MouseEvent')!=-1){
            switch (eventObject.button){
                case 0:buttons.left=true;break;
                case 1:buttons.middle=true;break;
                case 2:buttons.right=true;break;
                default:break;
            }
        } else if(eventObject.button){
         switch(eventObject.button){
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
        }else {
            return false;
            }
        return buttons;
    }
    window['ADS']['getMouseButton']=getMouseButton;

    /*寻找光标相对文档原点的位置*/
    function getPointerPositionInDocument(eventObject) {
        eventObject=eventObject||getEventObject(eventObject);
        var x=eventObject.pageX||(eventObject.clientX+(document.documentElement.scrollLeft||document.body.scrollLeft));
        var y=eventObject.pageY||(eventObject.clientY+(document.documentElement.scrollTop||document.body.scrollTop));
        return {'x':x,'y':y};
    }
    window['ADS']['getPointerPositionInDocument']=getPointerPositionInDocument;

    /*键盘取得键盘代码和相关ASCII值*/
    function getKeyPressed(eventObject) {
        eventObject=eventObject||getEventObject(eventObject);
        var code=eventObject.keyCode;
        var value=String.fromCharCode(code);
        return{'code':code,'value':value};
    }
    window['ADS']['getKeyPressed']=getKeyPressed;
    
    /*通过id修改单个元素的样式*/
    function setStyleById(element,styles) {
        if(!(element=$(element))) return false;
        for(property in styles){
            if(!styles.hasOwnProperty(property)) continue;
            if(element.style.setProperty){
                element.style.setProperty(uncamelize(property,'-'),styles[property],null);
                element.style[camelize(property)]=styles[property];
            }
        }
        return true;
    }
    window['ADS']['setStyleById']=setStyleById;
    window['ADS']['setStyle']=setStyleById;
    
    /*通过类名修改多个元素样式*/
    function setStylesByClassName(parent,tag,className,styles) {
        if(!(parent=$(parent))) return false;
        var elements=getElementsByClassName(className,tag,parent);
        for(var e=0;e<elements.length;e++){
            setStyleById(elements[e],styles);
        }
        return true;
    }
    window['ADS']['setStylesByClassName']=setStylesByClassName;
    
    /*通过标签名修改多个元素样式*/
    function setStylesByTagName(tagname,styles,parent) {
        parent=$(parent)||document;
        var elements=parent.getElementsByTagName(tagname);
        for(var e=0;e<elements.length;e++){
            setStyleById(elements,styles);
        }
        return true;
    }
    window['ADS']['setStylesByTagName']=setStylesByTagName;
    
    /*取得包含元素类名的数组*/
    function getClassNames(element) {
        if(!(element=$(element))) return false;
        return element.className.replace(/\s+/,' ').split(' ');
    };
    window['ADS']['getClassNames']=getClassNames;
    
    /*检查元素中是否存在某个类*/
    function hasClassName(element,className) {
        if(!(element=$(element))) return false;
        var classes=getClassNames(element);
        for(var i=0;i<classes.length;i++){
            if(classes[i]===className){
                return true;
            }
        }
        return false;
    }
    window['ADS']['hasClassName']=hasClassName;

    /*为元素添加类*/
    function addClassName(element,className) {
        if(!(element=$(element))) return false;
        element.class+=(element.className?' ':'')+className;
        return true;
    }
    window['ADS']['addClassName']=addClassName;

    function removeClassName(element,className) {
        if(!(element=$(element))) return false;
        var classes=element.getClassNames(element);
        var length=classes.length;
        for(var i=length-1;i>=0;i++){
            if(classes[i]===className){
                delete(classes[i]);
            }
        }
        element.className=classes.join(' ');
        return(length==classes.length?false:true);
    }
    window['ADS']['removeClassName']=removeClassName;

    /*添加新样式表*/
    function addStyleSheet(url,media) {
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
            var node=styles[i].ownerNode||styles.owningElement;
            styles[i].disabled=true;
            node.parentNode.removeChild(node);
        }
    }
    window['ADS']['removeStyleSheet']=removeStyleSheet;

    /*通过URL取得所有样式表的数组*/
    function getStyleSheets(url,media) {
        var sheets = [];
        for (var i = 0; i < document.styleSheets.length; i++) {
            if (url && document.styleSheets[i].href.indexOf(url) == -1) {
                continue;
            }
            if (media) {
                media = media.replace(/,\s*/, ',');
                var sheetMedia;
                if (document.styleSheets[i].media.mediaText) {
                    sheetMedia = document.styleSheets[i].media.meidaText.replace(/,\s*/, ',');
                    sheetMedia = sheetMedia.replace(/,\s*$/, '');
                } else {
                    sheetMedia = document.styleSheets[i].media.replace(/,\s*/, ',');
                }
                if (media != sheetMedia) {
                    continue;
                }
            }
            sheets.push(document.styleSheets[i]);

        }
        return sheets;
    }
    window['ADS']['getStyleSheets']=getStyleSheets;

    /*编辑一条样式规则*/
    function editCSSRule(selector,styles,url,media) {
        var stylesSheets=(typeof url=='array'?url:getStyleSheets(url,media));
        for(var i=0;i<styleSheets.length;i++){
            var rules=stylesSheets[i].cssRules||stylesSheets[i].rules;
            if(!rules){continue;}
            selector=selector.toUpperCase();
            for(var j=0;j<rules.length;j++){
                if(rules.selectorText.toUpperCase()==selector){
                    for(property in styles){
                        if(!styles.hasOwnProperty(property)){continue;}
                        rules[j].style[camelize(property)]=styles[property];
                    }
                }
            }
        }
    }
    window['ADS']['editCSSRule']=editCSSRule;

    function addCSSRule(selector,styles,index,url,media) {
        var declaration='';
        for(property in styles){
            if(!styles.hasOwnProperty(property)){continue;}
            declaration+=property+':'+styles[property]+';';
        }
        var styleSheets=(typeof url=='array'? url:getStyleSheets(url,media));
        var newIndex;
        for(var i=0;i<styleSheets.length;i++){
            if(styleSheets[i].insertRule){
                newIndex=(index>=0?index:styleSheets[i].cssRules.length);
                styleSheets[i].insertRule(
                    selector+'{'+declaration+'}',
                    newIndex
                );
            }else if(styleSheets[i].addRule){
                newIndex=(index>=0?index:-1);
                styleSheets[i].addRule(selector,declaration,newIndex);
            }
        }
    }
    window['ADS']['addCSSRule']=addCSSRule;







})();


