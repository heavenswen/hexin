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
  //获得今天的日期
  const today = new Date().getDate()
  const openNums = {} //签到进行状态
  //init tip
  const tip = new Tip({})
  //date 
  const signTable = new DateTable({
    obj: '.table tbody'
  });

  //积分 
  const int = 10
  //日期显示
  const date = document.querySelector(".date")
  //；累计签到的天数
  const day = document.querySelector(".day")
  //签到进度
  const sp = document.querySelector(".sp")
  //签到按钮
  const signBtn = document.querySelector("#sign")
  //sp
  const opens = document.querySelectorAll(`[data-day]`)
  //累计积分
  const total = document.querySelector(".integral")
  //获得取得5,10
  const opneNums = []
  for (let i = 0; i < opens.length; i++) {
    let v = opens[i].dataset.day
    opneNums.push(v)
  }

  date.innerHTML = `${signTable.year}年${Number(signTable.mouth) + 1}月`
  //已签到的日期
  Axios.post('index.php?m=Home&c=Index&a=qiandaolist', {}).then(function (json) {
    //获得已签到的日期
    let resp = json.data
    let arr = []
    for (let i = 0; i < resp.length; i++) {
      let v = Number(resp[i].riqi)

      arr.push(v)
      //设置天道状态

      //已领取状态
      if (resp[i].addscore != '0' && opneNums.indexOf(String(i + 1)) != -1) {
        //已领取
        let obj = document.querySelector(`[data-day='${i + 1}']`)
        if (obj) obj.dataset.sp = 'open'
      }
    }
    if (arr.indexOf(today) != -1) signBtn.innerHTML = '已签到'
    initTable(arr)

  })


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
    const siges = arr
    //累计签到天数 
    day.innerHTML = arr.length
    //init table
    signTable.initTable(function (n) {
      n = Number(n)
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

    //进度
    function setSp() {
      let n = sigeLength / sigeNum * 100

      sp.style.width = n + '%'

      let sigeObjs = document.querySelectorAll(".goods li[data-day]")
      for (let i = 0; i < sigeObjs.length; i++) {
        let o = sigeObjs[i]
        let n = o.dataset.day
        if (Number(n) <= sigeLength) {
          if (o.dataset.sp != 'open') o.dataset.sp = 'active'
        }
        //获得礼品事件
        if (o.dataset.sp != 'open') o.querySelector('a').addEventListener('click', getGoods, false)

      }

    }
    setSp();

    //get goods
    function getGoods() {
      let d = this.parentNode.dataset.day
      if (d > sigeLength) return;
      let url = "index.php?m=Home&c=Index&a=signontotal"
      var params = new URLSearchParams();
      //params.append('riqi', riqi);
      params.append('day', d)
      //let data = { riqi: riqi, day: day }


      Axios.post(url, params).then((json) => {
        let resp = json.data
        if (resp.code == '000') {
          //show 添加积分
          this.parentNode.dataset.sp = 'open'
          //只执行一次
          this.removeEventListener('click', getGoods, false)
          //积分 show
          total.innerHTML = Number(total.innerHTML) + Number(resp.total)
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

    function getSign() {

      if (signBtn.innerHTML == "已签到") {
        //不允许重复签到
        return;
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
          let o = document.querySelector(`[data-date='${today}']`)
          o.innerHTML = `<i data-icon='cart'></i>`
          siges.push(today)
          sigeLength++;
          signBtn.innerHTML = "已签到"
          setSp();//set sp status
          //only one
          //this.removeEventListener("click", getSign, false)

        } else {

          tip.setTime({ title: "签到失败", content: resp.msg })

        }


      })
    }

    signBtn.addEventListener("click", getSign, false)
  }
})()