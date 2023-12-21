        // 获取元素
        const timer = document.getElementById("timer");
        const buttons = document.getElementById("buttons");
        const settings = document.getElementById("settings");
        const hour = document.getElementById("hour");
        const minute = document.getElementById("minute");
        const second = document.getElementById("second");
        const hourPrev = document.getElementById("hour-prev");
        const minutePrev = document.getElementById("minute-prev");
        const secondPrev = document.getElementById("second-prev");
        const hourNext = document.getElementById("hour-next");
        const minuteNext = document.getElementById("minute-next");
        const secondNext = document.getElementById("second-next");
        const hourIncrease = document.getElementById("hour-increase");
        const minuteIncrease = document.getElementById("minute-increase");
        const secondIncrease = document.getElementById("second-increase");
        const hourDecrease = document.getElementById("hour-decrease");
        const minuteDecrease = document.getElementById("minute-decrease");
        const secondDecrease = document.getElementById("second-decrease");
        const start = document.getElementById("start");
        const time = document.getElementById("time");
        const total = document.getElementById("total");
        const progress = document.getElementById("progress");
        const pause = document.getElementById("pause");
        const stop = document.getElementById("stop");

        // 定义变量
        let hourValue = 0;
        let minuteValue = 0;
        let secondValue = 0;
        let duration = 0;
        let remaining = 0;
        let remaining_svg = 0;
        let interval = null;
        let paused = false;
        var audio = document.getElementById("my-audio");
        // 定义函数
        function formatNumber(num) {
            // 格式化数字，如果小于10则在前面加0
            return num < 10 ? "0" + num : num;
        }

        function updateSettings() {
            // 更新设置页面的显示
            hour.textContent = formatNumber(hourValue);
            minute.textContent = formatNumber(minuteValue);
            second.textContent = formatNumber(secondValue);
            hourPrev.textContent = formatNumber((hourValue + 23) % 24);
            minutePrev.textContent = formatNumber((minuteValue + 59) % 60);
            secondPrev.textContent = formatNumber((secondValue + 59) % 60);
            hourNext.textContent = formatNumber((hourValue + 1) % 24);
            minuteNext.textContent = formatNumber((minuteValue + 1) % 60);
            secondNext.textContent = formatNumber((secondValue + 1) % 60);
        }
        function updateTimer() {
            // 更新计时页面的显示
            time.textContent = 
                formatNumber(Math.floor(remaining / 3600)) + ":" + formatNumber(Math.floor(remaining / 60) % 60) + ":" + formatNumber(remaining % 60);
            // total.textContent = "共" + duration + "秒";
            // 根据设定时间分别显示共xx秒或共xx分xx秒或共xx小时xx分xx秒
            // Math.floor是向下取整
            if (duration < 60) {
                total.textContent = "共" + duration + "秒";
            } else if (duration < 3600) {
                total.textContent = "共" + Math.floor(duration / 60) + "分" + (duration % 60) + "秒";
            } else {
                total.textContent = "共" + Math.floor(duration / 3600) + "小时" + Math.floor(duration / 60) % 60 + "分" + (duration % 60) + "秒";
            }
            progress.style.strokeDashoffset = 880 * (1 - remaining_svg / (duration*50));
            // 根据剩余时间更新进度条progress的长度

        }

        function startTimer() {
            // 开始计时
            paused = false;
            progress.style.stroke = "rgb(19, 143, 184)";
            //将进度条描边设置为深蓝
            duration = hourValue * 3600 + minuteValue * 60 + secondValue;
            remaining = duration;
            remaining_svg = duration*50; //提高帧率
            if (duration > 0) {
                // 如果设定的时间大于0，则切换到计时页面，并设置定时器
                settings.style.display = "none";
                timer.style.display = "block";
                buttons.style.display = "flex";
                pause.textContent = "暂停";
                updateTimer();
                interval = setInterval(function () {
                    // 每隔20m秒，剩余时间减一，并更新显示
                    // remaining--;
                    // 每次循环剩余svg时间-1
                    remaining_svg--;
                    remaining = Math.ceil(remaining_svg/50);
                    //向上取整
                    updateTimer();
                    if (remaining <= 0) {
                        //如果剩余时间小于等于0，则停止计时，并播放一个提示音，然后切换回设置页面
                    clearInterval(interval);
                    playAudio();
                    showEndMessage();
                    timer.style.display = "none";
                    buttons.style.display = "none";
                    settings.style.display = "grid";
                }
            }, 20);
        } else {
            // 如果设定的时间等于0，则提示用户输入一个有效的时间
            showMessage("请输入一个有效的时间！");
            //alert("请输入一个有效的时间！");
        }
    }

    function showMessage(messagetext){
        var messageBox = document.getElementById("message-box");
        var messageText = document.getElementById("message-text");
        var okButton = document.getElementById("ok-button");

        // 为按钮添加点击事件监听器，关闭对话框
        okButton.addEventListener("click", function() {
            messageBox.close();
            stopAudio();
        });
        messageText.innerHTML = messagetext;
        messageBox.showModal();
    }

    function showEndMessage() {
        showMessage("倒计时结束！");
    }
    // function showEndMessage() {
    //         var alertBox = document.createElement("div");
    //         alertBox.className = "alert";
            
    //         var message = document.createElement("p");
    //         message.innerHTML = "倒计时结束！";
    //         message.style.fontSize = "24px";
    //         message.style.marginBottom = "10px";
            
    //         var closeButton = document.createElement("button");
    //         closeButton.innerHTML = "确定";
    //         closeButton.style.padding = "5px 10px";
    //         closeButton.style.fontSize = "16px";
    //         closeButton.style.backgroundColor = "#ccc";
    //         closeButton.style.border = "none";
    //         closeButton.style.borderRadius = "3px";
    //         closeButton.style.cursor = "pointer";
    //         closeButton.onclick = function() {
    //             document.body.removeChild(alertBox); // 点击关闭按钮时移除提示框
    //             stopAudio();
    //         };

    //         alertBox.appendChild(message);
    //         alertBox.appendChild(closeButton);

    //         document.body.appendChild(alertBox);
    //     }

    function playAudio() {
        audio.loop = true; // 设置循环播放
        audio.play();
    }

    function stopAudio() {
        audio.loop = false; // 取消循环播放
        audio.pause();
        audio.currentTime = 0;
    }
    function pauseTimer() {
        // 暂停或恢复计时
        if (paused) {
            progress.style.stroke = "rgb(19, 143, 184)";
            // 如果已经暂停，则恢复计时，并修改按钮的文本
            interval = setInterval(function () {
                remaining_svg--;
                //向上取整
                remaining = Math.ceil(remaining_svg/50);
                updateTimer();
                if (remaining <= 0) {
                    clearInterval(interval);
                    audio.play();
                    timer.style.display = "none";
                    buttons.style.display = "none";
                    settings.style.display = "grid";
                    showEndMessage();
                }
            }, 20);
            // }, 1000);
            pause.textContent = "暂停";
            paused = false;
        } else {
            // 如果正在计时，则暂停计时，并修改按钮的文本
            clearInterval(interval);
            pause.textContent = "继续";
            paused = true;
            //修改progress颜色为灰色
            progress.style.stroke = "gray";
        }
    }

    function stopTimer() {
        // 停止计时
        clearInterval(interval);
        timer.style.display = "none";
        buttons.style.display = "none";
        settings.style.display = "grid"; //用grid而不用block防止排版失效
    }

    function increaseHour() {
        // 增加小时的值，并更新设置页面的显示
        hourValue = (hourValue + 1) % 24;
        updateSettings();
    }

    function increaseMinute() {
        // 增加分钟的值，并更新设置页面的显示
        minuteValue = (minuteValue + 1) % 60;
        updateSettings();
    }

    function increaseSecond() {
        // 增加秒钟的值，并更新设置页面的显示
        secondValue = (secondValue + 1) % 60;
        updateSettings();
    }

    function decreaseHour() {
        // 减少小时的值，并更新设置页面的显示
        hourValue = (hourValue + 23) % 24;
        updateSettings();
    }

    function decreaseMinute() {
        // 减少分钟的值，并更新设置页面的显示
        minuteValue = (minuteValue + 59) % 60;
        updateSettings();
    }

    function decreaseSecond() {
        // 减少秒钟的值，并更新设置页面的显示
        secondValue = (secondValue + 59) % 60;
        updateSettings();
    }

    // 添加事件监听器
    start.addEventListener("click", startTimer);
    pause.addEventListener("click", pauseTimer);
    stop.addEventListener("click", stopTimer);
    hourIncrease.addEventListener("click", increaseHour);
    minuteIncrease.addEventListener("click", increaseMinute);
    secondIncrease.addEventListener("click", increaseSecond);
    hourDecrease.addEventListener("click", decreaseHour);
    minuteDecrease.addEventListener("click", decreaseMinute);
    secondDecrease.addEventListener("click", decreaseSecond);

    // 初始化设置页面的显示
    updateSettings();
