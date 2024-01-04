// 农历和节气的计算
const lunarInfo = [
    0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
    0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
    0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0
]; 
// 依次表示1900年到2100年每年的农历信息, 信息为16进制, 12位表示一个年份, 
// 从高到低依次表示12个月份的大小月信息, 0表示小月, 1表示大月,
// 例如0x04bd8表示1900年的农历信息, 0000 0100 1011 1101 1000, 
// 从高到低依次表示12个月份的大小月信息, 0x04bd8的第一个字节0x04表示1900年的1月是小月, 
// 第二个字节0x0b表示1900年的2月是大月, 以此类推, 最后一个字节0x08表示1900年的12月是小月
const solarTerm = [
    '小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
    '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
    '小暑', '大暑', '立秋', '处暑', '白露', '秋分',
    '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'];
const Animals = new Array(
    "鼠", "牛", "虎", "兔", 
    "龙", "蛇", "马", "羊", 
    "猴", "鸡", "狗", "猪");
const Gan = new Array(
    "甲", "乙", "丙", "丁",
    "戊", "己", "庚", "辛",
    "壬", "癸");
const Zhi = new Array(
    "子", "丑", "寅", "卯",
    "辰", "巳", "午", "未",
    "申", "酉", "戌", "亥");
const nStr1 = new Array(
    "日", "一", "二", "三",
    "四", "五", "六", "七",
    "八", "九", "十"); 
const nStr2 = new Array(
    "初", "十", "廿", "卅",
    "　"); 
const monthName = new Array(
    "正", "二", "三", "四",
    "五", "六", "七", "八",
    "九", "十", "冬", "腊");
// 公历节日
const sFtv = [
    "0101 元旦",
    "0214 情人节",
    "0308 妇女节",
    "0312 植树节",
    "0315 消费者权益日",
    "0401 愚人节",
    "0501 劳动节",
    "0504 青年节",
    "0512 护士节",
    "0601 儿童节",
    "0701 建党节",
    "0801 建军节",
    "0910 教师节",
    "0928 孔子诞辰",
    "1001 国庆节",
    "1006 老人节",
    "1024 联合国日",
    "1224 平安夜",
    "1225 圣诞节"];
// 农历节日
const lFtv = [
    "0101 春节",
    "0115 元宵节",
    "0505 端午节",
    "0707 七夕情人节",
    "0715 中元节",
    "0815 中秋节",
    "0909 重阳节",
    "1208 腊八节",
    "1224 小年",
    "0100 除夕"];
// 某月的第几个星期几
const wFtv = [
    "0150 世界麻风日",
    "0520 母亲节",
    "0530 全国助残日",
    "0630 父亲节",
    "0932 国际和平日",
    "0940 国际聋人节",
    "1011 国际住房日",
    "1013 国际减轻自然灾害日",
    "1144 感恩节"];

//返回农历y年的总天数
function lYearDays(y) {
    var i, sum = 348;
    for (i = 0x8000; i > 0x8; i >>= 1)sum += (lunarInfo[y - 1900] & i) ? 1 : 0;
    return (sum + leapDays(y));
}
//返回农历y年闰月的天数
function leapDays(y) {
    if (leapMonth(y)) return ((lunarInfo[y - 1900] & 0x10000) ? 30 : 29);
    else return (0);
}
//判断y年的农历中那个月是闰月,不是闰月返回0
function leapMonth(y) {
    return (lunarInfo[y - 1900] & 0xf);
}
//返回农历y年m月的总天数
function monthDays(y, m) {
    return ((lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29);
}

//算出当前月第一天的农历日期和当前农历日期下一个月农历的第一天日期
function Dianaday(objDate) {
    var i, leap = 0, temp = 0;
    var baseDate = new Date(1900, 0, 31);
    var offset = (objDate - baseDate) / 86400000;
    this.dayCyl = offset + 40;
    this.monCyl = 14;
    for (i = 1900; i < 2050 && offset > 0; i++) {
        temp = lYearDays(i)
        offset -= temp;
        this.monCyl += 12;
    }
    if (offset < 0) {
        offset += temp;
        i--;
        this.monCyl -= 12;
    }
    this.year = i;
    this.yearCyl = i - 1864;
    leap = leapMonth(i); //闰哪个月
    this.isLeap = false;
    for (i = 1; i < 13 && offset > 0; i++) {
        if (leap > 0 && i == (leap + 1) && this.isLeap == false) {    //闰月
            --i; this.isLeap = true; temp = leapDays(this.year);
        }
        else {
            temp = monthDays(this.year, i);
        }
        if (this.isLeap == true && i == (leap + 1)) this.isLeap = false;    //解除闰月
        offset -= temp;
        if (this.isLeap == false) this.monCyl++;
    }
    if (offset == 0 && leap > 0 && i == leap + 1)
        if (this.isLeap) { this.isLeap = false; }
        else { this.isLeap = true; --i; --this.monCyl; }
    if (offset < 0) { offset += temp; --i; --this.monCyl; }
    this.month = i;
    this.day = offset + 1;
}

// //记录公历和农历某天的日期
function calElement(sYear, sMonth, sDay, week, lYear, lMonth, lDay, isLeap) {
    this.isToday = false;
    //公历
    this.sYear = sYear;
    this.sMonth = sMonth;
    this.sDay = sDay;
    this.week = week;
    //农历
    this.lYear = lYear;
    this.lMonth = lMonth;
    this.lDay = lDay;
    this.isLeap = isLeap;
    //节日记录
    this.lunarFestival = ''; //农历节日
    this.solarFestival = ''; //公历节日
    this.solarTerms = ''; //节气
}

// //返回某年的第n个节气为几日(从0小寒起算)
// function sTerm(y, n) {
//     var offDate = new Date((31556925974.7 * (y - 1900) + sTermInfo[n] * 60000) + Date.UTC(1900, 0, 6, 2, 5));
//     return (offDate.getUTCDate())
// }

// //保存y年m+1月的相关信息
// var fat = mat = 9;
// var eve = 0;
// function calendar_generate(y, m) {
//     fat = mat = 0;
//     var sDObj, lDObj, lY, lM, lD = 1, lL, lX = 0, tmp1, tmp2;
//     var lDPOS = new Array(3);
//     var n = 0;
//     var firstLM = 0;
//     sDObj = new Date(y, m, 1);    //当月第一天的日期
//     this.length = solarDays(y, m);    //公历当月天数
//     this.firstWeek = sDObj.getDay();    //公历当月1日星期几
//     if ((m + 1) == 5) { fat = sDObj.getDay() }
//     if ((m + 1) == 6) { mat = sDObj.getDay() }
//     for (var i = 0; i < this.length; i++) {
//         if (lD > lX) {
//             sDObj = new Date(y, m, i + 1);    //当月第一天的日期
//             lDObj = new Dianaday(sDObj);     //农历
//             lY = lDObj.year;           //农历年
//             lM = lDObj.month;          //农历月
//             lD = lDObj.day;            //农历日
//             lL = lDObj.isLeap;         //农历是否闰月
//             lX = lL ? leapDays(lY) : monthDays(lY, lM); //农历当月最后一天
//             if (lM == 12) { eve = lX }
//             if (n == 0) firstLM = lM;
//             lDPOS[n++] = i - lD + 1;
//         }
//         this[i] = new calElement(y, m + 1, i + 1, nStr1[(i + this.firstWeek) % 7], lY, lM, lD++, lL);
//         if ((i + this.firstWeek) % 7 == 0) {
//             this[i].color = 'red';  //周日颜色
//         }
//     }
//     //节气
//     tmp1 = sTerm(y, m * 2) - 1;
//     tmp2 = sTerm(y, m * 2 + 1) - 1;
//     this[tmp1].solarTerms = solarTerm[m * 2];
//     this[tmp2].solarTerms = solarTerm[m * 2 + 1];
    
//     if (y == tY && m == tM) {
//         this[tD - 1].isToday = true;    //今日
//     }
// }
//                 //用中文显示农历的日期
//                 function cDay(d) {
//                     var s;
//                     switch (d) {
//                         // case 10:
//                         //     s = '初十';
//                         //     break;
//                         // case 20:
//                         //     s = '二十';
//                         //     break;
//                         // case 30:
//                         //     s = '三十';
//                         //     break;
//                         default:
//                             s = nStr2[Math.floor(d / 10)];
//                             //s += nStr1[d % 10];
//                             s += nStr1[parseInt(d % 10)];
//                             break;
//                     }
//                     return (s);
//                 }
//                 //在表格中显示公历和农历的日期,以及相关节日
//                 var cld;
//                 var flag=0;
//                 var targetDates = [
//                  "2024-11-1 2024-11-2",
//                  "2024-11-1 2025-11-4"
//                 ];
//                 var chose_date=null;
//                 var chose_cell;
//                 function drawCld(SY, SM) {
//                     if(flag){
//                     removeClickListeners(cld);}
//                     var TF = true;
//                     var p1 = p2 = "";
//                     var i, sD, s, size;
//                     var monthsChinese=['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
//                     cld = new calendar_generate(SY, SM);
//                     GZ.innerHTML = '                       【' + Animals[(SY - 4) % 12] + '】';    //生肖
//                     for (i = 0; i < 42; i++) {
//                         sObj = eval('SD' + i);
//                         lObj = eval('LD' + i);
//                         sObj.className = '';
//                         sD = i - cld.firstWeek;
//                         var row=parseInt(i/7)+4;
//                         var col=i%7+1;
//                         var targetCell = document.querySelector("tr:nth-child("+row+") td:nth-child("+col+")");
//                         targetCell.style.backgroundColor = '#e0e0e0';
//                         targetCell.classList.remove("has-dot");
//                         targetCell.classList.remove("chosecell_tag");
//                         if (sD > -1 && sD < cld.length) { //日期内
//                             sObj.innerHTML = sD + 1;
//                             if (cld[sD].isToday) {
//                                 sObj.style.color = 'rgba(241, 101, 20, 0.915)'; //今日颜色
//                                // 修改单元格的样式属性
//                                chose_cell=targetCell;
//                                chose_cell.classList.add("chosecell_tag");
//                             } 
//                              // 特定时间段日期标记
//                             var currentDate = new Date(cld[sD].sYear + "-" + cld[sD].sMonth + "-" + cld[sD].sDay );
//                             for (var j = 0; j < targetDates.length; j++) {
//                                 var dateRange = targetDates[j].split(" ");
//                                 var startDate = new Date(dateRange[0]);
//                                 var endDate = new Date(dateRange[1]);
//                                 if (currentDate >= startDate && currentDate <= endDate) {
//                                     // 修改目标单元格的样式属性
//                                     targetCell.classList.add("has-dot");
//                                 }
//                                 else{targetCell.classList.remove("has-dot");
//                                 }
//                             }
//                             if (cld[sD].lDay == 1) { //显示农历月
//                                 lObj.innerHTML = '<b>' + (cld[sD].isLeap ? '闰' : '') +monthsChinese[ cld[sD].lMonth-1] +'</b>';
//                             }
//                             else { //显示农历日
//                                 lObj.innerHTML = cDay(cld[sD].lDay);
//                             }
//                             var Slfw = Ssfw = null;
//                             s = cld[sD].solarFestival;
//                             for (var ipp = 0; ipp < lFtv.length; ipp++) {    //农历节日
//                                 if (parseInt(lFtv[ipp].substr(0, 2)) === parseInt(cld[sD].lMonth)) {
//                                     if (parseInt(lFtv[ipp].substr(2, 4)) === parseInt(cld[sD].lDay)) {
//                                         lObj.innerHTML = lFtv[ipp].substr(5);
//                                         Slfw = lFtv[ipp].substr(5);
//                                     }
//                                 }
//                                 if (12 == (cld[sD].lMonth)) {    //判断是否为除夕
//                                     if (eve == (cld[sD].lDay)) { lObj.innerHTML = "除夕"; Slfw = "除夕"; }
//                                 }
//                             }
//                             for (var ipp = 0; ipp < sFtv.length; ipp++) {    //公历节日
//                                 if (parseInt(sFtv[ipp].substr(0, 2)) == (SM + 1)) {
//                                     if (parseInt(sFtv[ipp].substr(2, 4)) == (sD + 1)) {
//                                         lObj.innerHTML = sFtv[ipp].substr(5);
//                                         Ssfw = sFtv[ipp].substr(5);
//                                     }
//                                 }
//                             }
//                             if ((SM + 1) == 5) {    //母亲节
//                                 if (fat == 0) {
//                                     if ((sD + 1) == 7) { Ssfw = "母亲节"; lObj.innerHTML = "母亲节" }
//                                 }
//                                 else if (fat < 9) {
//                                     if ((sD + 1) == ((7 - fat) + 8)) { Ssfw = "母亲节"; lObj.innerHTML = "母亲节" }
//                                 }
//                             }
//                             if ((SM + 1) == 6) {    //父亲节
//                                 if (mat == 0) {
//                                     if ((sD + 1) == 14) { Ssfw = "父亲节"; lObj.innerHTML = "父亲节" }
//                                 }
//                                 else if (mat < 9) {
//                                     if ((sD + 1) == ((7 - mat) + 15)) { Ssfw = "父亲节"; lObj.innerHTML = "父亲节" }
//                                 }
//                             }
//                             if (s.length <= 0) {    //设置节气的颜色
//                                 s = cld[sD].solarTerms;
//                                 if (s.length > 0) s = s.fontcolor('limegreen');
//                             }
//                             if (s.length > 0) { lObj.innerHTML = s; Slfw = s; }    //节气
//                             if ((Slfw != null) && (Ssfw != null)) {
//                                 lObj.innerHTML = Slfw + "/" + Ssfw;
//                             }
//                         }
//                         else { //非日期
//                             sObj.innerHTML = '';
//                             lObj.innerHTML = '';
//                         }
//                     }
//                     addClickListeners(cld);
//                 }
//                //事件监听，点击日历中某一格返回当前日期
//                   // 定义全局函数 handleClick
//                     function handleClick() {
//                     var sD = this.dataset.sD;
//                     chose_cell.classList.remove("chosecell_tag");
//                     chose_cell = this;
//                     chose_cell.classList.add("chosecell_tag");
//                     var solarDate = cld[sD].sYear + "-" + cld[sD].sMonth + "-" + (parseInt(sD) + 1);
//                     chose_date = solarDate;
//                     console.log("当前选中的公历日期是：" + chose_date);
//                     }
        
//                     // 在 addClickListeners 函数中使用闭包
//                     function addClickListeners(cld) {
//                     var i;
//                     var sD;
//                     for (i = 0; i < 42; i++) {
//                         sD = i - cld.firstWeek;
//                         var row = parseInt(i / 7) + 4;
//                         var col = i % 7 + 1;
//                         var targetCell = document.querySelector("tr:nth-child(" + row + ") td:nth-child(" + col + ")");
//                         if (sD > -1 && sD < cld.length) {
//                         (function() {
//                             targetCell.dataset.sD = sD;
//                             targetCell.addEventListener("click", handleClick);
//                         })();
//                         }
//                     }
//                     }
//                     function removeClickListeners(cld) {
//                     var i;
//                     var sD;
//                     for (i = 0; i < 42; i++) {
//                         sD = i - cld.firstWeek;
//                         var row = parseInt(i / 7) + 4;
//                         var col = i % 7 + 1;
//                         var targetCell = document.querySelector("tr:nth-child(" + row + ") td:nth-child(" + col + ")");
//                         if (sD > -1 && sD < cld.length) {
//                         targetCell.removeEventListener("click", handleClick);
//                         }
//                     }
//                     }
//                 function jumpToToday() {
//                 initial();
//                 }
        
//                 //在下拉列表中选择年月时,调用自定义函数drawCld(),显示公历和农历的相关信息
//                 function changeCld() {
//                     var y, m;
//                     y = CLD.SY.selectedIndex + 1900;
//                     m = CLD.SM.selectedIndex;
//                     drawCld(y, m);
//                 }
//                 function addmonth(){
//                     var y, m;
//                     if(CLD.SM.selectedIndex<11){
//                     CLD.SM.selectedIndex++;
//                     }
//                     else{
//                     CLD.SM.selectedIndex=0;
//                     CLD.SY.selectedIndex++;
//                     }
//                     y = CLD.SY.selectedIndex + 1900;
//                     m = CLD.SM.selectedIndex;
//                     drawCld(y, m);
//                 }
//                 function minusmonth(){
//                     var y, m;
//                     if(CLD.SM.selectedIndex>0){
//                     CLD.SM.selectedIndex--;
//                     }
//                     else{
//                     CLD.SM.selectedIndex=11;
//                     CLD.SY.selectedIndex--;
//                     }
//                     y = CLD.SY.selectedIndex + 1900;
//                     m = CLD.SM.selectedIndex;
//                     drawCld(y, m);
//                 }
//                 function addyear(){
//                     var y, m;
//                     if(CLD.SY.selectedIndex<149){
//                     CLD.SY.selectedIndex++;
//                     }
//                     else{
//                     CLD.SY.selectedIndex=0;
//                     }
//                     y = CLD.SY.selectedIndex + 1900;
//                     m = CLD.SM.selectedIndex;
//                     drawCld(y, m);
//                 }
//                 function minusyear(){
//                     var y, m;
//                     if(CLD.SY.selectedIndex>0){
//                     CLD.SY.selectedIndex--;
//                     }
//                     else{
//                     CLD.SY.selectedIndex=149;
//                     }
//                     y = CLD.SY.selectedIndex + 1900;
//                     m = CLD.SM.selectedIndex;
//                     drawCld(y, m);
//                 }
//                 //用自定义变量保存当前系统中的年月日
//                 var Today = new Date();
//                 var tY = Today.getFullYear();
//                 var tM = Today.getMonth();
//                 var tD = Today.getDate();
//                 //打开页时,在下拉列表中显示当前年月,并调用自定义函数drawCld(),显示公历和农历的相关信息
//                 function initial() {
                    
//                     CLD.SY.selectedIndex = tY - 1900;
//                     CLD.SM.selectedIndex = tM;
//                     drawCld(tY, tM);
//                     flag=1;
//                 }
