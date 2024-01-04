
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
    
    
    // 上方的月份和年份
    month_picker.innerHTML = month_names[month];
    calendar_header_year.innerHTML = year;
    
    let first_day = new Date(year, month); // 当月第一天
    let currentDate = new Date();


    
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
