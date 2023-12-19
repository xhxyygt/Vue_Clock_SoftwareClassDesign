function $(id) {
    return document.getElementById(id);
}

window.onload = function() {
    var count = 0;
    var timer = null;
    var recordList = $("recordList");
    var index = 1;
    var isRunning = false;
    var startPauseBtn = $("startPause");
    var startPauseImg = $("startPauseImg");
    var endBtn = $("end");

    startPauseBtn.onclick = function() {
        if (isRunning) {
            clearInterval(timer);
            startPauseImg.src = "images/start.png";
            isRunning = false;
            endBtn.style.display = "inline-block";
        } else {
            clearInterval(timer);
            timer = setInterval(function() {
                count++;
                $("id_MS").innerHTML = showNum(count % 100);
                $("id_S").innerHTML = showNum(parseInt(count / 100) % 60);
                $("id_M").innerHTML = showNum(parseInt(count / 6000) % 60);
            }, 10);
            startPauseImg.src = "images/pause.png";
            isRunning = true;
            endBtn.style.display = "inline-block";
        }
    }

    $("end").onclick = function() {
        clearInterval(timer);
        count = 0;
        $("id_MS").innerHTML = "00";
        $("id_S").innerHTML = "00";
        $("id_M").innerHTML = "00";
        recordList.innerHTML = '';
        index = 1;
        startPauseImg.src = "images/start.png";
        isRunning = false;
        endBtn.style.display = "none";
    }

    $("record").onclick = function() {
        var time = $("id_M").innerHTML + ':' + $("id_S").innerHTML + ':' + $("id_MS").innerHTML;
        var li = document.createElement('li');
        li.className = 'record';
        li.innerHTML = '<span class="record-index">' + index + '</span>' +
                        '<span class="record-time">' + time + '</span>';
        recordList.appendChild(li);
        index++;
    }
}

function showNum(num) {
    if (num < 10) {
        return "0" + num;
    } else {
        return num;
    }
}