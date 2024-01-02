const app = Vue.createApp({el: '#app'});
app.component('menu-nav', {
    template: `
    <nav class="menu">
      <ul>
        <li><a href="../AlarmClock/alarm_clock.html">闹钟</a></li>
        <li><a href="../world_clock/worldclock.html">世界时钟</a></li>
        <li><a href="../StopWatch/stop_watch.html">秒表</a></li>
        <li><a href="../Timer/timer.html">计时器</a></li>
        <li><a href="../Calender/calendar_lunar.html">日历</a></li>
        <li><a href="#">睡眠追踪</a></li>
      </ul>
    </nav>
    `,
})
app.mount('#app')