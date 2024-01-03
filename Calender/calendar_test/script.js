const isLeapYear = (year) => {
    return (
      (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) ||
      (year % 100 === 0 && year % 400 === 0)
    );
  };
  const getFebDays = (year) => {
    return isLeapYear(year) ? 29 : 28;
  };
  let calendar = document.querySelector('.calendar');
  const month_names = [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
  ];
  let month_picker = document.querySelector('#month-picker');
  const dayTextFormate = document.querySelector('.day-text-formate');
  const timeFormate = document.querySelector('.time-formate');
  const dateFormate = document.querySelector('.date-formate');
  
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
  
  const generateCalendar = (month, year) => {
    let calendar_days = document.querySelector('.calendar-days');
    calendar_days.innerHTML = '';
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
    
    let currentDate = new Date();
    
    month_picker.innerHTML = month_names[month];
    
    calendar_header_year.innerHTML = year;
    
    let first_day = new Date(year, month);
  
  
  for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
  
      let day = document.createElement('div');
      day.classList.add('date-item');
  
      if (i >= first_day.getDay()) {
        day.innerHTML = i - first_day.getDay() + 1;

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
                if (siblings[i].innerHTML.toString() === currentDate.getDate().toString()) {
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

    // const today = document.querySelector('.date-time-formate');
    // today.addEventListener('click', () => {
    //     currentMonth.value = currentDate.getMonth();
    //     currentYear.value = currentDate.getFullYear();
    //     generateCalendar(currentMonth.value, currentYear.value);
    //     }
    // );

// 用户点击某一天后，当天的背景色变化
    const calendarDays = document.querySelector('.calendar-days');
    calendarDays.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('date-item')) {
            // 添加current-date类名，同时去掉其他元素的current-date类名
            target.classList.add('current-date');
            const siblings = target.parentNode.children;
            for (let i = 0; i < siblings.length; i++) {
                if (siblings[i] !== target) {
                    siblings[i].classList.remove('current-date');
                }
            }
            

        }

        // target.addClass("current-date").siblings().removeClass("current-date");
        // if (target.classList.contains('current-date')) {
        //     target.classList.add('current-date-clicked');
        // }
    }
    );


