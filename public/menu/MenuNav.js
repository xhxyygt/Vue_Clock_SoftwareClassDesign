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
//   设置css样式
    // data() {
    //     return{
    //         style: {
    //             menu: {
    //                 width: '100%',
    //                 height: '50px',
    //                 backgroundColor: '#333',
    //                 boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    //                 position: 'relative',
    //                 zIndex: '2',
    //                 margin: '0',
    //             },
    //             ul: {
    //                 margin: '0',
    //                 padding: '0',
    //                 listStyle: 'none',
    //                 display: 'flex',
    //                 justifyContent: 'center',
    //                 alignItems: 'center',
    //                 height: '100%',
    //                 minHeight: '50px',
    //             },
    //             li: {
    //                 margin: '0 10px',
    //                 display: 'flex',
    //                 justifyContent: 'center',
    //                 alignItems: 'center',
    //             },
    //             a: {
    //                 color:'white',
    //                 textDecoration: 'none',
    //                 padding: '5px 10px',
    //                 borderRadius: '5px',
    //                 transition: 'all 0.3s ease-in-out',
    //                 textAlign: 'center',
    //                 display: 'flex',
    //                 justifyContent: 'center',
    //                 alignItems: 'center',
    //             }
    //         },

    //     }
    // }



})
app.mount('#app')