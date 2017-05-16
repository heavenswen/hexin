import 'assets/css/react.scss'
import 'assets/css/index.scss'
//rem 
import rem from "assets/js/rem.js"
import dateTable from "assets/js/dateTable.js"
(function () {
  //rem init
  new rem();
  dateTable({ obj: '.table tbody' });


})()