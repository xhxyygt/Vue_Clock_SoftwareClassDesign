
const isLeapYear = (year) => {
    return (
        (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) ||
        (year % 100 === 0 && year % 400 === 0)
    );
};
const getFebDays = (year) => {
    return isLeapYear(year) ? 29 : 28;
};
const month_names = [
    '一月','二月','三月','四月',
    '五月','六月','七月','八月',
    '九月','十月','十一月','十二月',
];

let calendar = document.querySelector('.calendar');
let month_picker = document.querySelector('#month-picker');
const dayTextFormate = document.querySelector('.day-text-formate');
const timeFormate = document.querySelector('.time-formate');
const dateFormate = document.querySelector('.date-formate');
var current_month; //保存一个月的相关信息

// 点击月份显示月份列表
month_picker.onclick = () => {
    month_list.classList.remove('hideonce');
    month_list.classList.remove('hide');
    month_list.classList.add('show');
    dayTextFormate.classList.remove('showtime');
    dayTextFormate.classList.add('hidetime');
    timeFormate.classList.remove('showtime');
    timeFormate.classList.add('hideTime');
    dateFormate.classList.remove('showtime');
    dateFormate.classList.add('hideTime');
};

//根据输入的月份和年份生成当月的信息（包括农历年月日，公历节日，农历节日，某月的第几个星期几的节日）
// 相关信息在 lunarInfo, sokarTerm, Animals, Gan, Zhi, nStr1, nStr2, monthName, sFtv, lFtv, wFtv已经给出
// 根据给出的数组进行计算
var fat = mat = 9;
var eve = 0; 
function month_info(month, year){
  fat = mat = 0; // 用于保存某月的第几个星期几的节日
  var SolarDateObj, LunarDateObj;
  var lY, lM, lD = 1; 
  var lL, lX = 0;// 农历信息
  var tmp1, tmp2; // 临时变量
    var lDPOS = new Array(3); // 农历日期保存数组
    var n = 0; 
    var firstLM = 0; // 保存当年农历的闰月

  current_month = new Array(); // 保存一个月的相关信息
  current_month['month'] = month; // 公历月份
  current_month['year'] = year; // 公历年份

  let days_of_month = [
    31,
    getFebDays(year),
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  current_month['days'] = days_of_month[month]; // 公历当月天数
  // console.log(month, year);
  SolarDateObj = new Date(year, month, 1); // 当月第一天
  // console.log(SolarDateObj);
  current_month['first_day'] = SolarDateObj.getDay(); // 当月第一天是星期几

  if((month+1) == 5) {fat = SolarDateObj.getDay()} // 保存某月的第几个星期几的节日
  if((month+1) == 6) {mat = SolarDateObj.getDay()} // 保存某月的第几个星期几的节日
  for (var i = 0; i < current_month['days']; i++) {
    if(lD>lX){
      SolarDateObj = new Date(year, month, i+1); // 当月第一天
      LunarDateObj = new Dianaday(SolarDateObj); // 当月第一天的农历日期
      lY = LunarDateObj.year; // 农历年份
      lM = LunarDateObj.month; // 农历月份
      lD = LunarDateObj.day; // 农历日期改为整数
      lL = LunarDateObj.isLeap; // 农历是否闰月
      lX = lL? leapDays(lY): monthDays(lY, lM); // 农历当月天数
      if (lM == 12) { eve = lX } //除夕
      if (n == 0) firstLM = lM;
      lDPOS[n++] = i - lD + 1;
    }
    current_month[i] = new calElement(year, month+1, i+1, nStr1[(i + current_month['first_day']) % 7], lY, lM, lD++, lL);
    //周末判断
    if((i + current_month['first_day']) % 7 == 0 || (i + current_month['first_day']) % 7 == 6){
      current_month[i]['is_weekend'] = true;
    }
    //农历日期(中文)
    current_month[i]['lunar_date'] = cDay(current_month[i]['lDay']);
    //公历节日
    for (var j in sFtv) {
      if (parseInt(sFtv[j].substr(0, 2)) == (month + 1)) {
        if (parseInt(sFtv[j].substr(2, 4)) == (i + 1)) {
          current_month[i]['solarFestival'] = sFtv[j].substr(5);
          // console.log(current_month[i]['solar_festival']);
        }
      }
    }
    //农历节日
    for (var j in lFtv) {
      if(parseInt(lFtv[j].substr(0, 2)) == parseInt(lM)){
        if(parseInt(lFtv[j].substr(2, 4)) == parseInt(current_month[i]['lDay'])){
          current_month[i]['lunarFestival'] = lFtv[j].substr(5);
        }
        if (lM == 12) { // 判断是否为除夕
          if (current_month[i]['lDay'] == eve) {
            current_month[i]['lunarFestival'] = '除夕';
          }
        }
      }
    }
    current_month[i]['month_name'] = monthName[lM - 1]; 
    //某月的第几个星期几的节日
    if ((month + 1) == 5 && (i + 1) == fat) {current_month[i]['solarFestival'] += '母亲节 ';} // 母亲节
    if ((month + 1) == 6 && (i + 1) == mat) {current_month[i]['solarFestival'] += '父亲节 ';} // 父亲节
    // 今日
    if (year == tY && month == tM && i + 1 == tD) {
      current_month[i]['is_today'] = true;
    }
  }
  // 节气
  tmp1 = sTerm(year, month * 2) - 1;
  tmp2 = sTerm(year, month * 2 + 1) - 1;
  current_month[tmp1]['solarTerms'] = solarTerm[month * 2];
  current_month[tmp2]['solarTerms'] = solarTerm[month * 2 + 1];

  return current_month;
};



// 根据选择的月份和年份生成日历
// 注：month为0-11（1月参数为0）
const generateCalendar = (month, year) => {
    let calendar_days = document.querySelector('.calendar-days'); // 日期表格
    // calendar_days.innerHTML = '';
    let calendar_header_year = document.querySelector('#year');
    let days_of_month = [
        31,
        getFebDays(year),
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
    ];
    current_month = month_info(month, year); // 当月的相关信息
    console.log(current_month);
    
    
    // 上方的月份和年份
    month_picker.innerHTML = month_names[month];
    calendar_header_year.innerHTML = year;
    
    let first_day = new Date(year, month); // 当月第一天
    let currentDate = new Date();


  // 先清空原来的日期
  calendar_days.innerHTML = '';
  for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
  
      let day = document.createElement('div'); //每一天
      if (i >= first_day.getDay()) { //有日期的单元格
        day.classList.add('date-item');
        // 把当天的阳历日期存到属性里
        //chose_date=cld[sD].sYear + "-" + cld[sD].sMonth + "-" + (parseInt(sD) + 1);
        day.setAttribute('data-date', current_month[i - first_day.getDay()]['sYear'] + "-" + current_month[i - first_day.getDay()]['sMonth'] + "-" + (parseInt(i - first_day.getDay()) + 1));
        day.classList.remove('has-dot'); // 移除日程标记
        //每一天的数字日期和文字日期（农历或节日）
        let day_num = document.createElement('div');
        day_num.classList.add('day-number');
        let day_text = document.createElement('div');
        day_text.classList.add('day-text');
        day.appendChild(day_num);
        day.appendChild(day_text);
        // day.innerHTML = i - first_day.getDay() + 1;
        day_num.innerHTML = i - first_day.getDay() + 1;
        // 优先级：阳历节日 > 农历节日 > 节气 > 农历日期,前三种情况颜色为红色
        if (current_month[i - first_day.getDay()]['solarFestival'] !== '') {
          day_text.innerHTML = current_month[i - first_day.getDay()]['solarFestival'];
        } else if (current_month[i - first_day.getDay()]['lunarFestival'] !== '') {
          day_text.innerHTML = current_month[i - first_day.getDay()]['lunarFestival'];
        } else if (current_month[i - first_day.getDay()]['solarTerms'] !== '') {
          day_text.innerHTML = current_month[i - first_day.getDay()]['solarTerms'];
        }else if(current_month[i - first_day.getDay()]['lunar_date'] === '初一'){
          day_text.innerHTML = current_month[i - first_day.getDay()]['month_name'] + '月';
        }
        else {
          day_text.innerHTML = current_month[i - first_day.getDay()]['lunar_date'];
        }

        if(year === currentDate.getFullYear() && month === currentDate.getMonth()){
          if (i - first_day.getDay() + 1 === currentDate.getDate()) {
            day.classList.add('current-date');
            chose_date = current_month[i - first_day.getDay()]['sYear'] + "-" + current_month[i - first_day.getDay()]['sMonth'] + "-" + (parseInt(i - first_day.getDay()) + 1);
            console.log(chose_date);
          }
        }
        //如果不是本月，默认为阳历该月1日添加current-date类
        else if(i-first_day.getDay() + 1 === 1 ){
          day.classList.add('current-date');
          chose_date = current_month[i - first_day.getDay()]['sYear'] + "-" + current_month[i - first_day.getDay()]['sMonth'] + "-" + (parseInt(i - first_day.getDay()) + 1);
          console.log(chose_date);
        }
      }
      calendar_days.appendChild(day);
    }
    displaySchedule(scheduleItems);
    display_reddot();
  };

var targetDates = []; //日程数组
// 根据日程显示日程标记has-dot
function display_reddot() {
  let date_item = document.querySelectorAll('.date-item');
  for (let i = 0; i < date_item.length; i++) {
    let date = date_item[i].getAttribute('data-date');
    for (var j = 0; j < targetDates.length; j++) {
      var dateRange = targetDates[j].split(" ");
      var startDate = new Date(dateRange[0]);
      var endDate = new Date(dateRange[1]);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      var currentDate = new Date(date);
      currentDate.setHours(0, 0, 0, 0);
      if (currentDate >= startDate && currentDate <= endDate) {
          // 修改目标单元格的样式属性
          date_item[i].classList.add("has-dot");
      }
    }

  }
}


  
  let month_list = calendar.querySelector('.month-list');
  month_names.forEach((e, index) => {
    let month = document.createElement('div');
    month.innerHTML = `<div>${e}</div>`;
  
    month_list.append(month);
    month.onclick = () => {
      currentMonth.value = index;
    //   console.log(currentMonth.value); //点击5月，控制台输出4
      generateCalendar(currentMonth.value, currentYear.value);
      month_list.classList.replace('show', 'hide');
      dayTextFormate.classList.remove('hideTime');
      dayTextFormate.classList.add('showtime');
      timeFormate.classList.remove('hideTime');
      timeFormate.classList.add('showtime');
      dateFormate.classList.remove('hideTime');
      dateFormate.classList.add('showtime');
    };
  });
  
  (function () {
    month_list.classList.add('hideonce');
  })();
  document.querySelector('#pre-year').onclick = () => {
    --currentYear.value;
    generateCalendar(currentMonth.value, currentYear.value);
  };
  document.querySelector('#next-year').onclick = () => {
    ++currentYear.value;
    generateCalendar(currentMonth.value, currentYear.value);
  };
  
  let currentDate = new Date();
  let currentMonth = { value: currentDate.getMonth() };
  let currentYear = { value: currentDate.getFullYear() };
  generateCalendar(currentMonth.value, currentYear.value);

  const todayShowTime = document.querySelector('.time-formate');
  const todayShowDate = document.querySelector('.date-formate');
  
  const currshowDate = new Date();
  const showCurrentDateOption = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  };
  const currentDateFormate = new Intl.DateTimeFormat(
    'zh-CN',
    showCurrentDateOption
  ).format(currshowDate);
  todayShowDate.textContent = currentDateFormate;
  setInterval(() => {
    const timer = new Date();
    const option = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
    // const formateTimer = new Intl.DateTimeFormat('en-us', option).format(timer);
    // 24 hour format
    const formateTimer = new Intl.DateTimeFormat('zh-CN', option).format(timer);
    let time = `${`${timer.getHours()}`.padStart(
      2,
      '0'
    )}:${`${timer.getMinutes()}`.padStart(
      2,
      '0'
    )}: ${`${timer.getSeconds()}`.padStart(2, '0')}`;
    todayShowTime.textContent = formateTimer;
  }, 1000);
  
// 点击下方的今日时间，跳转到当天
// 判断当前是否是今天，若是今天则不用跳转
// 判断当前月份是否和今天在同一月份，如果是的话就不用跳转，只把current-date类名添加到当天同时删除其他元素的current-date类名
    const today = document.querySelector('.date-time-formate');
    today.addEventListener('click', () => {
        if (currentMonth.value === currentDate.getMonth() && currentYear.value === currentDate.getFullYear()) { //月份是当前月，不用跳转，只把current-date类名添加到当天同时删除其他元素的current-date类名
            const calendarDays = document.querySelector('.calendar-days');
            const siblings = calendarDays.children;
            // console.log(currentDate);
            for (let i = current_month.first_day; i < siblings.length; i++) {
                // console.log(siblings[i].innerHTML);
                // console.log(currentDate.getDate());
                // siblings[i]中的day-number和currateDate比较，如果相等则添加current-date类名，否则删除current-date类名
                if (siblings[i].children[0].innerHTML.toString() === currentDate.getDate().toString()) {
                    siblings[i].classList.add('current-date');
                }
                else {
                    siblings[i].classList.remove('current-date');
                }
            }            
        }
        else {
            currentMonth.value = currentDate.getMonth();
            currentYear.value = currentDate.getFullYear();
            generateCalendar(currentMonth.value, currentYear.value);
        }
    });
