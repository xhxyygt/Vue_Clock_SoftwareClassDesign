// 用户点击日期的响应：改变背景颜色，显示当天的日程
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
}
);