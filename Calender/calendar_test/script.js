
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
const month_info = (month, year) => {
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
  SolarDateObj = new Date(month, year, 1); // 当月第一天
  current_month['first_day'] = SolarDateObj.getDay(); // 当月第一天是星期几

  if((month+1) == 5) {fat = SolarDateObj.getDay()} // 保存某月的第几个星期几的节日
  if((month+1) == 6) {mat = SolarDateObj.getDay()} // 保存某月的第几个星期几的节日
  for (var i = 0; i < current_month['days']; i++) {
    if(lD>lX){
      SolarDateObj = new Date(year, month, i+1); // 当月第一天
      LunarDateObj = new Dianaday(SolarDateObj); // 当月第一天的农历日期
      lY = LunarDateObj.year; // 农历年份
      lM = LunarDateObj.month; // 农历月份
      lD = LunarDateObj.day; // 农历日期
      lL = LunarDateObj.isLeap; // 农历是否闰月
      lX = lL? leapDays(lY): monthDays(lY, lM); // 农历当月天数
      if (lM == 12) { eve = lX }
      if (n == 0) firstLM = lM;
      lDPOS[n++] = i - lD + 1;
    }
    current_month[i] = new calElement(year, month+1, i+1, nStr1[(i + current_month['first_day']) % 7], lY, lM, lD++, lL);
    //周末判断
    if((i + current_month['first_day']) % 7 == 0 ) current_month[i]['isWeekend'] = true;


  }


  LunarDateObj = new Dianaday(SolarDateObj); // 当月第一天的农历日期
  current_month['lunar_year'] = LunarDateObj.year; // 农历年份
  current_month['lunar_month'] = LunarDateObj.month; // 农历月份
  current_month['lunar_day'] = LunarDateObj.day; // 农历日期
  current_month['lunar_month_name'] = monthName[LunarDateObj.month]; // 农历月份名称
  current_month['lunar_year_name'] = Animals[(LunarDateObj.year - 4) % 12]; // 农历年份名称
  current_month['lunar_month_days'] = monthDays(LunarDateObj.year, LunarDateObj.month); // 农历月份天数
  current_month['solar_terms'] = solarTermCal(year, month); // 节气
  current_month['gan'] = Gan[(year - 4) % 10]; // 干
  current_month['zhi'] = Zhi[(year - 4) % 12]; // 支

  // 获取公历节日
var solar_festival = ""; // 初始化一个空字符串
var solar_festival_date = (month + 1) * 100 + SolarDateObj.getDate(); // 计算公历节日的日期，例如1月1日是101，2月14日是214
for (var i = 0; i < sFtv.length; i++) { // 遍历公历节日的数组
    var solar_festival_item = sFtv[i]; // 获取每个节日的字符串
    if (solar_festival_item.startsWith(solar_festival_date)) { // 如果节日的字符串以公历节日的日期开头
        solar_festival = solar_festival_item.slice(5); // 去掉前五个字符，只保留节日的名称
        break; // 跳出循环
    }
}
current_month['solar_festival'] = solar_festival; // 将字符串赋值给current_month['solar_festival']

// 获取农历节日
var lunar_festival = ""; // 初始化一个空字符串
var lunar_festival_date = LunarDateObj.month * 100 + LunarDateObj.day; // 计算农历节日的日期，例如正月初一是101，五月初五是505
for (var i = 0; i < lFtv.length; i++) { // 遍历农历节日的数组
    var lunar_festival_item = lFtv[i]; // 获取每个节日的字符串
    if (lunar_festival_item.startsWith(lunar_festival_date)) { // 如果节日的字符串以农历节日的日期开头
        lunar_festival = lunar_festival_item.slice(5); // 去掉前五个字符，只保留节日的名称
        break; // 跳出循环
    }
}
current_month['lunar_festival'] = lunar_festival; // 将字符串赋值给current_month['lunar_festival']

// 获取某月的第几个星期几的节日
var week_festival = ""; // 初始化一个空字符串
var week_festival_date = (SolarDateObj.getMonth() + 1) * 100 + Math.floor((SolarDateObj.getDate() - 1) / 7) * 10 + SolarDateObj.getDay(); // 计算某月的第几个星期几的节日的日期，例如1月的第3个星期日是1310，9月的第4个星期一是9440
for (var i = 0; i < wFtv.length; i++) { // 遍历某月的第几个星期几的节日的数组
    var week_festival_item = wFtv[i]; // 获取每个节日的字符串
    if (week_festival_item.startsWith(week_festival_date)) { // 如果节日的字符串以某月的第几个星期几的节日的日期开头
        week_festival = week_festival_item.slice(5); // 去掉前五个字符，只保留节日的名称
        break; // 跳出循环
    }
}
current_month['week_festival'] = week_festival; // 将字符串赋值给current_month['week_festival']



  return current_month;
};






solarTermCal = (y, m) => {
  // 节气
  var sTermInfo = [
    0, 21208, 42467, 63836, 85337, 107014,
    128867, 150921, 173149, 195551, 218072, 240693,
    263343, 285989, 308563, 331033, 353350, 375494,
    397447, 419210, 440795, 462224, 483532, 504758
  ];
  var solarTerms = [];
  var tmp1 = new Date( ( 31556925974.7*(y-1900) + sTermInfo[m*2+1]*60000 ) + Date.UTC(1900,0,6,2,5) );
  var tmp2 = tmp1.getUTCDate();
  if ( tmp2 == m+1 ) solarTerms.push(solarTerm[m*2+1]);
  tmp1 = new Date( ( 31556925974.7*(y-1900) + sTermInfo[m*2]*60000 ) + Date.UTC(1900,0,6,2,5) );
  tmp2= tmp1.getUTCDate();
  if ( tmp2 == m+1 ) solarTerms.push(solarTerm[m*2]);
  return solarTerms;
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
      day.classList.add('date-item');
      //每一天的数字日期和文字日期（农历或节日）
      let day_num = document.createElement('div');
      day_num.classList.add('day-number');
      let day_text = document.createElement('div');
      day_text.classList.add('day-text');
      day.appendChild(day_num);
      day.appendChild(day_text);

  
      if (i >= first_day.getDay()) {
        // day.innerHTML = i - first_day.getDay() + 1;
        day_num.innerHTML = i - first_day.getDay() + 1;
        day_text.innerHTML = '农历';

        if (i - first_day.getDay() + 1 === currentDate.getDate() &&
          year === currentDate.getFullYear() &&
          month === currentDate.getMonth()
        ) {
          day.classList.add('current-date');
        }
      }
      calendar_days.appendChild(day);
    }
  };
  
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
            for (let i = 0; i < siblings.length; i++) {
                // console.log(siblings[i].innerHTML);
                // console.log(currentDate.getDate());
                // console.log(siblings[i].innerHTML.toString() === currentDate.getDate().toString());
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
