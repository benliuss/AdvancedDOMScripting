function myLogger(id) {
    id = id || 'ADSLogwindow';
    var logWindow = null;
    var creatWindow = function () {

        //取得新窗口在浏览器中居中放置时的左上角位置
        var browserWindowSize=ADS.getBrowserWindowSize();
        var top=((browserWindowSize.height-200)/2)||0;
        var left=((browserWindowSize.width-200)/2)||0;

        //创建作为日志窗口的DONM节点，使用受保护的logWindow属性维护作用
        logWindow=document.createElement('UL');
        logWindow.setAttribute('id',id);

        //在屏幕中剧中定位日志窗口、设置固定大小、内容滚动、美化
        logWindow.style.position='absolute';
        logWindow.style.top=top+'px';
        logWindow.style.left=left+'px';
        logWindow.style.width='200px';
        logWindow.style.height='200px';
        logWindow.style.overflow='scroll';
        logWindow.style.padding='0';
        logWindow.style.margin='0';
        logWindow.style.border='1px solid black';
        logWindow.style.backgroundColor='white';
        logWindow.style.listStyle='none';
        logWindow.style.font='10px/10px Verdana,Tahoma,Sans';

        //添加到文档主体中
        document.body.appendChild(logWindow);

    }
    this.writeRaw = function (message) {
        //如果初始窗口不存在，创建它
        if(!logWindow) creatWindow();

        //创建列表项并添加样式
        var li=document.createElement('LI');
        li.style.padding='2px';
        li.style.border='0';
        li.style.borderBottom='1px dotted black';
        li.style.margin='0';
        li.style.color='#000';
        li.style.font='9px/9px Verdana,Tahoma,Sans';

        //为日志节点添加信息
        if(typeof message=='undefined'){
            li.appendChild(document.createTextNode('Message was unfined'));
        }else if(typeof li.innerHTML!=undefined){
            li.innerHTML=message;
        }else{
            li.appendChild(document.createTextNode(meaasge));
        }

        //将这个条目添加到日志窗口
        logWindow.appendChild(li);

        return true
    };
}
myLogger.prototype= {
    write: function (message) {
        //警告message为空值
        if(typeof message=='string'&&message.length==0){
            return this.writeRaw('ADS.log:null message');
        }

        //如果message不是字符串，则尝试调用toString()方法，如果不存在该访问则记录对象类型
        if(typeof message!='string'){
            if(message.toString) return this.writeRaw(message.toString());
            else return this.writeRaw(typeof message);
        }

        //转换<和>以便.innerHTML不会将message作为HTML进行解析
        message=message.replace(/</g,"&lt;").replace(/>/g,"&gt;");

        return this.writeRaw(message);
    },

    //向日志中写入一个标题
    hweader: function () {
        message='<span style="color:white;background-color:black;font-weight:bold;padding:0px 5px;">'+message+'</span>';
        return this.writeRaw(message);
    }
};
if(!window.ADS){window['ADS']={};}
window['ADS']['log']=new myLogger();
ADS.log.writeRaw('This is raw.');
ADS.log.writeRaw('<strong>This is bold!</strong>');


