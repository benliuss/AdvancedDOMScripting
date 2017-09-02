function registerMultiStateAnchorListeners(anchor,anchorImage,path,extension) {
    //载入悬停时的图像
    //载入过程和其余脚本
    //异步进行
    var imageMouseOver=new Image();
    imageMouseOver.src=path+'-over'+extension;
    //悬停时变换源文件
    ADS.addEvent(anchor,'mouseover',function (W3CEvent) {
        anchorImage.src=imageMouseOver.src;
    });
    //移出时变为原始文件
    ADS.addEvent(anchor,'mouseout',function (W3CEvent) {
        anchorImage.src=path+extension;
    });

    //载入按下时图像
    var imageMouseDown=new Image();
    imageMouseDown.src=path+'-down'+extension;
    //按下
    ADS.addEvent(anchor,'mousedown',function (W3CEvent) {
        anchorImage.src=imageMouseDown.src;
    });
    //放开
    ADS.addEvent(anchor,'mouseup',function (W3CEvent) {
        anchorImage.src=path+extension;
    });
}
function initMultiStateAnchors(W3CEvent) {
    //遍历所有锚，找到其第一个子图像元素
    var anchors = ADS.getElementsByClassName('multiStateAnchor','a');
    for (var i = 0; i < anchors.length; i++) {
        var anchorImage = anchors[i].getElementsByTagName('img')[0];

        //如果存在，解析其原路径
        if (anchorImage) {
            var extensionIndex = anchorImage.src.lastIndexOf('.');
            var path = anchorImage.src.substr(0, extensionIndex);
            var extension = anchorImage.src.substring(
                extensionIndex,
                anchorImage.src.length
            );

            //添加各种鼠标处理程序
            //同时预先加载图像
            registerMultiStateAnchorListeners(
                anchors[i],
                anchorImage,
                path,
                extension
            );
        }
    }
}
ADS.addEvent(window,'load',initMultiStateAnchors);