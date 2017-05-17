import 'assets/css/react.scss'
import 'assets/css/zp.scss'
//rem 
import Rem from "assets/js/rem.js"
import Tip from "assets/js/maskTip.js"
import Axios from 'axios'
import Zp from 'assets/js/zp.js'
(function () {
    //rem init
    new Rem();
    //init tip
    let tip = new Tip({ className: 'tip' })

    let btn = document.querySelector("#btn")
    //btn state
    let tragger = 1
    
    //init page
    //积分
    let luck = document.querySelector(".luck")
    //免费
    let free = document.querySelector(".free")
    //总数
    let total = document.querySelector(".total")
    //get server 积分

    Axios.post("index.php?m=Home&c=Index&a=getscore", { openid: '' }).then(function (json) {
        let resp = json.data
        if (resp.score) {
            total.innerHTML = resp.score
        } else {
            console.error(`score empty`)
        }
    })


    //奖项｛0:1,1:谢谢｝
    let info = ["一等奖", ' 谢谢参与', "二等奖", ' 谢谢参与', "三等奖", ' 谢谢参与']
    let game = new Zp(".canvas-box", {
        info: info
    })


    //arr[100%] max num 
    function random(num) {
        var r;
        r = (Math.random() * num).toFixed(0);
        r = r >= num ? r - (r - num + 1) : r;
        return Number(r);
    }

    //get goods

    function getGoods() {

        //积分抽奖
        let luck_num = Number(luck.innerHTML)//次数 
        //免费
        let free_n = Number(free.innerHTML)
        //总积分
        let total_n = Number(total.innerHTML)

        // random(info.length)
        if (luck_num && tragger || free_n && tragger) {

            //btn state
            tragger = 0;

            //旋转目标数                
            let n = random(info.length)

            function setZp(s) {
                // s = state 

                //btn state init
                tragger = 1;

                //set free luck 
                if (free_n) {
                    free_n--;

                    free.innerHTML = free_n
                } else {

                    luck_num--;
                    total_n -= 50;
                    luck.innerHTML = luck_num
                    total.innerHTML = total_n
                }

                //tip

                if (s.match(/谢谢参与/)) {

                    tip.setTime({ title: "抽奖结果", content: "谢谢参与 再接再厉" })

                } else {
                    tip.setTime({ title: "抽奖结果", content: s })
                }
                //修改次数
            }
            //get data server
            var url = 'index.php?m=Home&c=Index&a=getdata';
            var d = {};
            Axios.post(url, d).then(function (json) {
                var resp = json.data;
                var n = resp.id;
                var arr = { 1: 0, 2: 2, 3: 4, 4: 1 }
                n = arr[n];
                if (n) game.traggerAnimate(n, setZp);
            })


        } else if (tragger) {
            tip.setTime({ title: "机会已用完", content: "明天再来吧！" })
        }
    }

    btn.addEventListener("click", getGoods, false);

    //记录
    let goods_show = document.querySelector("#goods-list")
    let goods = document.querySelector(".goods-list")
    goods_show.addEventListener("click", function () {
        //show goods list 
        goods.dataset.show = 'true';

    }, false)

    //hide goods list
    let goods_hide = document.querySelector(".goods-list .tit")
    goods_hide.addEventListener("click", function () {
        goods.dataset.show = 'false'
    }, false)

})()