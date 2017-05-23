//签到
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
  //积分 
  let int = 10
  let date = document.querySelector(".date")
  let day = document.querySelector(".day")
  date.innerHTML = `${signTable.year}年${Number(signTable.mouth) + 1}月`
  //已签到的日期
  Axios.post('index.php?m=Home&c=Index&a=qiandaolist', {}).then(function (json) {
    //获得已签到的日期
    let resp = json.data
    let arr = []

    for (let i = 0; i < resp.length; i++) {
      let v = resp[i].riqi
      arr.push(v)
    }

    initTable(arr)

  })

  let total = document.querySelector(".integral")
  //get server 积分
  function getInt() {
    Axios.post("index.php?m=Home&c=Index&a=getscore", {}).then(function (json) {
      let resp = json.data
      if (resp.score) {
        total.innerHTML = resp.score
      } else {
        console.error(`score empty`)
      }
    })
  }
  getInt();



  //init datetable
  function initTable(arr) {
    //已签到的日期
    let siges = arr
    //累计签到天数 
    day.innerHTML = arr.length
    //init table
    signTable.initTable(function (n) {
      n = String(n)
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
      let url = "index.php?m=Home&c=Index&a=signontotal"
      let data = {}
      Axios.get(url, data).then((json) => {
        let resp = json.data
        if (resp.code == '000') {
          //show 添加积分
          this.dataset.sp = 'open'
          //只执行一次
          this.removeEventListener('click', getGoods, false)
          //积分 show
          total.innerHTML = Number(total.innerHTML) + resp.count
          //tip
          tip.setTime({
            title: "签到礼包", content: `
            <p class='text-center' style="color:#ccc;font-size:.24rem;">
              您已成功签到 ${sigeLength} 天
            </p>
            <p>
              ${resp.msg}
            <p>
            `})

        } else if (resp.code == '001') {
          //提示
          tip.setTime({ title: '签到礼包', content: resp.msg })
        } else {
          console.log(resp)
        }

      })
    }


    //签到
    let signBtn = document.querySelector("#sign")
    function getSign() {
      //获得当前日期
      let today = new Date().getDate()

      if (siges.indexOf(today) != -1) {
        return tip.setTime({ title: "已签到", content: "明天再来吧!" })
      }
      let url = "index.php?m=Home&c=Index&a=signon"
      let data = {}
      Axios.post(url, data).then((json) => {
        let resp = json.data
        if (resp.code == '000') {
          //签到成功
          tip.setTime({ title: "成功签到", content: `获得了，${int}积分` })
          //修改积分
          total.innerHTML = Number(total.innerHTML) + int
          //修改天数
          day.innerHTML = Number(day.innerHTML) + 1
          //显示签到
          let o = document.querySelector(`[data-date='${today}'`)
          o.innerHTML = `<i data-icon='cart'></i>`
          siges.push(today)
          sigeLength++;
          setSp();//set sp status
          //only one
          //this.removeEventListener("click", getSign, false)

        } else {
          tip.setTime({ title: "签到失败", content: resp.msg })
        }

      })
    }

    document.querySelector("#sign").addEventListener("click", getSign, false)
  }
})()