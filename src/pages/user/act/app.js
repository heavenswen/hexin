import 'assets/css/react.scss'
import 'assets/css/index.scss'
//rem 
import Rem from "assets/js/rem.js"
import DateTable from "assets/js/dateTable.js"
import Tip from "assets/js/maskTip.js"
import Axios from 'axios'
(function () {
  //rem init
  new Rem();
  //init tip
  let tip = new Tip({})
  //date 
  let signTable = new DateTable({
    obj: '.table tbody'
  });

  //已签到的日期
  Axios.get('#', {}, {}).then(function (json) {
    //获得已签到的日期

    let arr = json.data.siges

    initTable(arr)

  })

  //init datetable
  function initTable(arr) {
    //已签到的日期
    let siges = arr || []

    //init table
    signTable.initTable(function (n) {
      if (siges.indexOf(n) != -1) {
        return `<a data-date='${n}'><i data-icon='cart'></i></a>`
      } else {
        return `<a data-date='${n}'>${n}</a>`
      }
    })
    //获得总天数
    let sigeNum = signTable.mouthLength()
    //sige day 
    let sigeLength = siges.length

    //签到进度
    let sp = document.querySelector(".sp")
    function setSp() {
      let n = sigeLength / sigeNum * 100

      sp.style.width = n + '%'

      let sigeObjs = document.querySelectorAll(".goods li[data-day]")
      for (let i = 0; i < sigeObjs.length; i++) {
        let o = sigeObjs[i]
        let n = o.dataset.day
        if (Number(n) <= sigeLength) {
          o.dataset.sp = 'active'
          o.querySelector('a').addEventListener('click', getGoods, false)
        }
      }

    }
    setSp();

    //get goods
    function getGoods() {
      let day = this.parentNode.dataset.day
      if (day > sigeLength) return;
      let url = "#"
      let data = {}
      Axios.get(url, data).then((json) => {
        let resp = json.data
        if (resp) {
          //show
          this.dataset.sp = 'open'
          //只执行一次
          console.log(this)
          this.removeEventListener('click', getGoods, false)
          //tip
          tip.setTime({
            title: "签到礼包", content: `
            <p class='text-center' style="color:#ccc;font-size:.24rem;">
              您已成功签到 ${sigeLength} 天
            </p>
            <p>
              恭喜你，获得签到礼包
            <p>
            `})
        }

      })
    }


    //签到
    let signBtn = document.querySelector("#sign")
    function getSign() {
      let today = new Date().getDate()

      if (siges.indexOf(today) != -1) {
        return tip.setTime({ title: "已签到", content: "明天再来吧!" })
      }
      let url = "index.php?m=Home&c=Index&a=signon"
      let data = {}
      Axios.post(url, data).then((json) => {
        let resp = json.data
        console.log(resp)
        if (resp.code == '000') {
          //签到成功
          tip.setTime({ title: "成功签到", content: "获得了，10积分" })

          let o = document.querySelector(`[data-date='${today}'`)
          o.innerHTML = `<i data-icon='cart'></i>`
          siges.push(today)
          sigeLength++;
          setSp();//set sp status
          //only one
          //this.removeEventListener("click", getSign, false)

        } else {
          let content = resp.msg
          tip.setTime({ title: "签到失败", content: content })
        }

      })
    }

    document.querySelector("#sign").addEventListener("click", getSign, false)
  }
})()