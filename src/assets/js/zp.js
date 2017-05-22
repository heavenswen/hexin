//o 对象
function zhuanpan(o, object) {
    (function () {
        //帧
        var lastTime = 0;
        var vendors = ['webkit', 'moz'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
                // Webkit中此取消方法的名字变了
                window[vendors[x] + 'CancelRequestAnimationFrame'];
        }
        //动画开始
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function (callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
                var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }
        //动画结束 
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
        }
    }());
    const box = document.querySelector('.canvas-box')
    const w = box.clientWidth * 2
    var info = object.info;//项目
    var age = info.length;//获得个数
    var color = ["#fcdf5f", "#f76661", "#fcdf5f", "#f76661", "#fcdf5f", "#f76661", "#fcdf5f", "#f76661",];
    var font = w / 640 * 27 + "px 微软雅黑";//项目字体
    var fontColor = "#333";//项目字色
    var step = 2 * Math.PI / age;//一个弧度
    //生成画布
    let canvas = addCanvas();
    var outerR = w / 2 * 0.75; //轮盘的大小
    var interR = w / 2 * 0.75 * .25;//内存空白圆的大小
    var range = 10;// 转动圈数
    var radio = 0.05;//转动比 
    var t = null;//帧er
    var context = canvas.getContext("2d");
    var deg = 360 / age;//平均角


    //偏移 居中
    context.translate(w / 2, w / 2);

    init(context);

    //添加画布节点
    function addCanvas() {
        let id = document.createAttribute("id")
        let o_w = document.createAttribute("width")
        let o_h = document.createAttribute("height")
        id.value = "canvas"
        o_w.value = w
        o_h.value = w
        let cxt = document.createElement("canvas")
        cxt.setAttributeNode(id)
        cxt.setAttributeNode(o_w)
        cxt.setAttributeNode(o_h)
        box.appendChild(cxt)
        //cxt.style.width = w / 2 + 'px'
        //cxt.style.height = w / 2 + 'px'
        return cxt;
    }
    this.traggerAnimate = function (n, f) {
        if (t) {
            console.log('动画进行中')
            return false;
        }
        //默认旋转路径
        var define_r = range * 360;
        //设置终点 0开始
        var random = 360 - (n + 1) * deg + deg / 2;
        define_r = (define_r + random);
        //var setdeg = beginAngle;
        var angle = 360;

        //帧动画
        t = requestAnimationFrame(animate);

        function animate() {
            //setdeg *= radio;
            if (define_r <= 0.1) {
                //animate init
                cancelAnimationFrame(t);
                t = null;

                //检测实际的位置
                var pos = angle / (360 / age);

                pos = Math.ceil(pos);

                var num = age - pos;
                //console.log(angle)
                //提示内容
                var res = info[num];
                //callback 指向内容 angle角度
                if (f) f(res, num, angle);
            } else {
                //动画
                //转动幅度 总幅度%
                var rotate_deg = define_r * radio;
                //清除幅度
                define_r -= rotate_deg;
                //画布旋转幅度
                angle += rotate_deg;

                //过角
                if (angle >= 360) {
                    angle -= 360;
                }
                //重绘画布
                context.clearRect(-250, -250, w, w);
                context.save();
                context.beginPath();
                //旋转 幅度计算
                context.rotate(angle * Math.PI / 180);
                init(context);
                context.restore();
                //继续帧
                t = requestAnimationFrame(animate);

            }
        }
    };

    //canvas init
    function init(context) {
        //content
        for (var i = 0; i < age; i++) {
            context.save();
            context.beginPath();
            context.moveTo(0, 0);
            context.fillStyle = color[i];
            // 偏移 90 angle
            var translateAngle = 2 / 360 * 90;
            var start = 2 / age * i - translateAngle;
            start = start >= 0 ? start : 2 + start;
            //转换成2.0*pi = 360
            start = start * Math.PI;
            context.arc(0, 0, outerR, start, start + step);
            context.fill();
            context.restore();
        }

        // center  园
        context.save();
        context.beginPath();
        context.fillStyle = "#fff";
        context.arc(0, 0, interR, 0, 2 * Math.PI);
        context.fill();
        context.restore();

        //block font

        for (var i = 0; i < age; i++) {
            context.save();
            context.beginPath();
            context.fillStyle = fontColor;
            context.font = font;
            context.textAlign = "center";
            context.textBaseline = "middle";
            //重置0度位置 减90度
            var start = i * deg - 90 + deg / 2;
            start = start >= 0 ? start : 360 + start;
            var rotate = start * Math.PI / 180;
            //rotate = rotate >= 0 ? rotate :
            context.rotate(rotate);
            context.fillText(info[i], (outerR + interR) / 2, 0);
            context.restore();
        }
    }
}
module.exports = zhuanpan