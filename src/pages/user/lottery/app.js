//lottery 转盘

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
    //消耗
    const expend = 50
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
    let resp_info = { 1: '0', 2: '2', 3: '4', 4: '1' }
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
    //获得 免费 status
    function freeNum() {
        let n = Number(free.innerHTML) || 0

        if (!n) btn.querySelector("span").innerHTML = '积分抽奖'

        return n
    }
    freeNum()

    //get goods

    function getGoods() {

        //积分抽奖
        let luck_num = Number(luck.innerHTML)
        //免费
        let free_n = freeNum()
        //总积分
        let total_n = Number(total.innerHTML)


        // random(info.length)
        if (luck_num && tragger && total_n >= expend || free_n && tragger) {

            //btn state
            tragger = 0

            //旋转目标数  demo             
            //let n = random(info.length)

            function setZp(s) {
                // s = state 

                //btn state init
                tragger = 1;

                //set free luck 
                if (free_n) {
                    free_n--;

                    free.innerHTML = free_n

                    freeNum()
                } else {

                    luck_num--;
                    total_n -= expend;
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
            let url = 'index.php?m=Home&c=Index&a=getdata'
            //let url = '#'
            let d = {}
            Axios.post(url, d).then(function (json) {
                let resp = json.data
                //let resp = { code: '000', giftid: 1 }
                let n = resp.giftid
                console.log(resp)
                if (resp.code == '000' && n) {
                    //success
                    n = resp_info[n]
                    game.traggerAnimate(n, setZp);

                } else {
                    //fail
                    //btn state init
                    tragger = 1;
                    tip.setTime({ title: '抽奖失败', content: resp.msg })
                }
            })


        } else if (tragger) {
            //btn state init
            tragger = 1;
            //次数为0
            tip.setTime({ title: "抽奖失败", content: "今天的抽奖次数已经用完!" })
        }
    }

    btn.addEventListener("click", getGoods, false);

    //记录 btn
    let goods_show = document.querySelector("#goods-list")

    //content
    let goods = document.querySelector(".goods-list")

    let gl_con = goods.querySelector('tbody')

    goods_show.addEventListener("click", function () {
        //get prize list the server 
        Axios.post("index.php?m=Home&c=Index&a=prizelist", {}).then(function (json) {
            let resp = json.data

            if (resp) {
                let htm = ''
                for (let i = 0; i < resp.length; i++) {
                    let d = resp[i]
                    let tr = `<td>${d.dateline}</td><td>${d.score}</td><td>${info[resp_info[d.prize]]}</td>`

                    htm += `<tr>${tr}</tr>`
                }
                gl_con.innerHTML = htm
                //show goods list
                goods.dataset.show = 'true';
            } else {

                tip.setTime({ title: "中奖记录", content: "您还未有中奖记录!" })
            }
        })

    }, false)

    //hide goods list
    let goods_hide = document.querySelector(".goods-list .tit")
    goods_hide.addEventListener("click", function () {
        goods.dataset.show = 'false'
    }, false)

})()