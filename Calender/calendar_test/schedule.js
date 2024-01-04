// 用户点击日期的响应：改变背景颜色，显示当天的日程
// 点击日期包括点击日期的数字和日期的背景
// 日期的背景是一个div，日期的数字是div的子元素
const calendarDays = document.querySelector('.calendar-days');
calendarDays.addEventListener('click', function(event) {
    var target = event.target;
    // if (event.target === this) {
    //     target = event.target;
    //     console.log(1);
    // }
    // else{
    //     target = event.target.parentNode;
    //     console.log(2);
    // }
    if (!target.classList.contains('date-item')) {
        target = target.parentNode;
    }
    console.log(target);
    // 添加current-date类名，同时去掉其他元素的current-date类名
    target.classList.add('current-date');
    const siblings = target.parentNode.children;
    for (let i = 0; i < siblings.length; i++) {
        if (siblings[i] !== target) {
            siblings[i].classList.remove('current-date');
        }
    }
}
);