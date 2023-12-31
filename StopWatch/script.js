        // 获取元素
        var timer = document.getElementById("timer");
        var start = document.getElementById("start");
        var record = document.getElementById("record");
        var pause = document.getElementById("pause");
        var resume = document.getElementById("resume");
        var stop = document.getElementById("stop");
        var recordList = document.getElementById("record-list");

        // 定义变量
        var startTime = 0; // 开始时间
        var pauseTime = 0; // 暂停时间
        var pause_period = 0; // 暂停时长
        var interval = null; // 计时器
        var recordCount = 0; // 记录次数
        var lastRecordTime = 0; // 上一次记录时间

        // 定义函数
        // 格式化时间
        function formatTime(time) {
            // time = time / 1000;
            var minutes = Math.floor(time / 60000);
            var seconds = Math.floor((time % 60000) / 1000);
            var milliseconds = Math.floor(time % 1000);
            return (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds) + "." + (milliseconds < 10 ? "00" + milliseconds : milliseconds < 100 ? "0" + milliseconds : milliseconds);
        }

        // 更新时间
        function updateTime() {
            var currentTime = Date.now();
            var elapsedTime = currentTime - startTime - pause_period;
            timer.textContent = formatTime(elapsedTime);
            return elapsedTime;
        }

        // 开始计时
        function startTimer() {
            startTime = Date.now();
            interval = setInterval(updateTime, 1);
            start.style.display = "none";
            record.style.display = "inline";
            pause.style.display = "inline";
        }

        // 暂停计时
        function pauseTimer() {

            clearInterval(interval);
            pauseTime = Date.now();
            // pauseTime += Date.now() - startTime;
            record.style.display = "none";
            pause.style.display = "none";
            // 点击暂停之后暂停按钮变成继续按钮，记录按钮变为停止按钮
            stop.style.display = "inline";
            resume.style.display = "inline";
        }

        // 继续计时
        function resumeTimer() {
            pause_period += Date.now() - pauseTime;
            // startTime = Date.now();
            interval = setInterval(updateTime, 1);
            resume.style.display = "none";
            stop.style.display = "none";
            record.style.display = "inline";
            pause.style.display = "inline";
        }

        // 结束计时
        function stopTimer() {
            clearInterval(interval);
            timer.textContent = "00:00.00";
            recordList.innerHTML = "";
            resume.style.display = "none";
            stop.style.display = "none";
            start.style.display = "inline";
            recordList.style.display = "none";
            startTime = 0;
            pauseTime = 0;
            pause_period = 0;
            recordCount = 0;
            lastRecordTime = 0;
        }

        // 记录时间
        function recordTimer() {
            recordList.style.display = "block";
            recordCount++;
            var currentTime = updateTime();
            var diffTime = currentTime - lastRecordTime;
            lastRecordTime = currentTime;
            var recordItem = document.createElement("li");
            recordItem.innerHTML = "<span>" + (recordCount < 10 ? "0" + recordCount : recordCount) + 
                "</span><span>+" + formatTime(diffTime) + "</span><span>" + formatTime(currentTime) + "</span>";
            recordList.appendChild(recordItem);
        }

        // 添加事件监听
        start.addEventListener("click", startTimer);
        pause.addEventListener("click", pauseTimer);
        resume.addEventListener("click", resumeTimer);
        stop.addEventListener("click", stopTimer);
        record.addEventListener("click", recordTimer);
