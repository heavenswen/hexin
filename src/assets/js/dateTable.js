//日历类

const now = new Date()//当前时间
class DateTable {
    constructor({ obj, date }) {
        this.obj = document.querySelector(obj) //对象
        this.now = date ? date : now//时间
        this.year = this.now.getFullYear()//年
        this.mouth = this.now.getMonth()//当月
        this.firstDay = new Date(this.year, this.mouth, 1) //第一天 星期

    }
    mouthLength(d) {
        // date
        //计算出天数
        let day = d?d:this.firstDay

        let year = day.getYear()
        let n = day.getMonth()
        let big = [1, 3, 5, 7, 8, 10, 12]
        if (n == 2) {
            //是不是闰年
            let b = this.year % 4
            if (b) {
                return 28;
            } else {
                return 29;
            }
        } else if (big.indexOf(n)) {
            //大月
            return 31;
        } else {
            return 30;
        }
    }
    initTable(fun) {
        let htm = '' //
        let d = this.firstDay
        let day = d.getDay()//星期几
        let addD = (7 - day) //补齐天数
        let monthD = this.mouthLength(d) //月份的天数
        let num = monthD + addD//获得天数
        let addM = num % 7 ? 1 : 0;
        let m = parseInt(num / 7) + addM //几周
        let n = 0//从1开始
        for (let i = 1; i < m; i++) {
            let tr = ''
            //td 输出
            for (let x = 0; x < 7; x++) {
                let con
                //第一排 和最后一排处理
                if (n < day || n > monthD) {
                    con = '&nbsp;'
                } else {

                    //添加
                    if (fun) {
                        //再处理
                        con = fun(n);
                    } else {
                        con = n;
                    }

                }
                n++;

                tr += `<td>${con}</td>`
            }
            //输出
            htm += `<tr>${tr}</tr>`
        }

        //生成htm    
        if (htm) this.obj.innerHTML = htm
    }
}

module.exports = DateTable