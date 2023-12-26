var SERVER_HOST;
var myHeaders = new Headers();

document.addEventListener('DOMContentLoaded', (event) => {
  //从本地获取SEVERHOST
  SERVER_HOST = localStorage.getItem('SEVER-HOST');
  // 从本地获取token
  myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
  myHeaders.append("Content-Type", "application/json");
  token = localStorage.getItem('token');
  myHeaders.append("Authorization", token);
  
//获取当前用户闹钟
var pre_alarms=[];
var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};
fetch("//"+SERVER_HOST+":8080/clock", requestOptions)
    .then(response => response.json())
    .then(result => {
      // console.log(result);
      if(result.code === 1){
      pre_alarms=result.data.clocks;
      pre_alarms.forEach( pre_alarm => {
        // 从后端接收到的字符串转换为时间并添加闹钟
        var hour = parseInt(parseInt(pre_alarm.clock_time)/100); // 小时部分为第一个字符串
        var minute = parseInt(pre_alarm.clock_time)%100; // 分钟部分为第二个字符串
        var alarm = {
          hour: hour,
          minute: minute,
          active: pre_alarm.status,// 创建默认激活状态
          id:pre_alarm.id
          };
        alarmList.push(alarm);
        console.log(alarm);
        // 时钟按时间排序
        alarmList.sort(function(a, b) {
          return a.hour * 60 + a.minute - b.hour * 60 - b.minute;
        });
        // 渲染时钟列表
        renderAlarmList();
      })
      }else{
        console.log(result.msg);
      }
    })
    .catch(error => console.log('error', error));

  getCurrentTime();
})

// 禁止选中文本(防止误操作)
document.onselectstart = function() {
  return false;
}

var container = document.querySelector(".container");
var clock = document.querySelector(".clock");
var time = document.querySelector(".time");
var date = document.querySelector(".date");
var alarms = document.querySelector(".alarms");
var add = document.querySelector(".add-button");
var modal = document.querySelector(".modal");
var modalContent = document.querySelector(".modal-content");
var modalHeader = document.querySelector(".modal-header");
var modalTitle = document.querySelector(".modal-title");
var modalClose = document.querySelector(".modal-close");
var modalBody = document.querySelector(".modal-body");
var modalTime = document.querySelector(".modal-time");
var modalPicker = document.querySelector(".modal-picker");
var modalPickerHour = document.querySelector(".modal-picker-hour");
var modalPickerHourUp = document.querySelector(".modal-picker-hour-up");
var modalPickerHourValue = document.querySelector(".modal-picker-hour-value");
var modalPickerHourDown = document.querySelector(".modal-picker-hour-down");
var modalPickerMinute = document.querySelector(".modal-picker-minute");
var modalPickerMinuteUp = document.querySelector(".modal-picker-minute-up");
var modalPickerMinuteValue = document.querySelector(".modal-picker-minute-value");
var modalPickerMinuteDown = document.querySelector(".modal-picker-minute-down");
var modalFooter = document.querySelector(".modal-footer");
var modalSubmit = document.querySelector(".modal-submit");

var alarmList = []; // 闹钟数组
var currentAlarm = null; // 当前闹钟（只有编辑时不为空）submitModal用以判断是新建还是编辑
var alarmSound = new Audio("../Timer/Zelda’s Lullaby.ogg");


// 格式化显示时间
function formatTime(num) {
  // Convert a number to a two-digit string
  return num < 10 ? "0" + num : num.toString();
}

// 页面上方的本地时间显示
function getCurrentTime() {
  var date = new Date();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  // 更新显示时间
  time.innerHTML = formatTime(hour) + ":" + formatTime(minute) + ":" + formatTime(second);
  date.innerHTML = year + "-" + formatTime(month) + "-" + formatTime(day);
}

// 创建闹钟
function createAlarm(hour, minute) {
  // 向后端发创建请求
  var raw = JSON.stringify({
    "clock_time":hour *100 + minute
  });
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  fetch("//"+SERVER_HOST+":8080/clock", requestOptions)
   .then(response => response.json())
   .then(result => {
    if(result.code === 1){
    // console.log('success to add the alarm');
    // 创建并显示闹钟
    var alarm = {
    hour: hour,
    minute: minute,
    active: true ,// 默认激活
    id:result.data.clocks.id
    };
    // 加入数组并排序
    alarmList.push(alarm);
    alarmList.sort(function(a, b) {
    return a.hour * 60 + a.minute - b.hour * 60 - b.minute;
    });
    // 渲染时钟列表
    renderAlarmList();
    }
    else {
      console.log(result.msg);
      alert("新建失败，请重新添加");
    }
   })
   .catch(error => console.log('error', error));

}

// 删除闹钟
function deleteAlarm(index) {
  // 发删除请求
  var raw = JSON.stringify({
    "operation_type": 3,
    "clock_id": alarmList[index].id
  });
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  fetch("//"+SERVER_HOST+":8080/clock/update", requestOptions)
    .then(response => response.json())
    .then(result => {
      if(result.code === 1){
        // console.log("删除成功");
        // 本地删除
        alarmList.splice(index, 1);
        renderAlarmList();
      }
      else{
        console.log(result.msg);
      }
    })
    .catch(error => console.log('error', error));
}

// 闹钟激活状态更改
function toggleAlarm(index) {
  //发状态更改
  var raw = JSON.stringify({
    "operation_type": 1,
    "status": alarmList[index].active ? 0:1,
    "clock_id": alarmList[index].id
  });
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  fetch("//"+SERVER_HOST+":8080/clock/update", requestOptions)
    .then(response => response.json())
    .then(result => {
      if (result.code===1){
        // 本地更改
        alarmList[index].active = !alarmList[index].active;
        renderAlarmList();
      }
      else {
        console.log(result.msg);
        alert("修改失败，请重试");
      }
    })
    .catch(error => console.log('error', error));
}

// 编辑闹钟时间
function editAlarm(index, hour, minute) {

  //若编辑后时间改变闹钟激活（否则不更改状态也不发请求）
  if (alarmList[index].hour != hour || alarmList[index].minute != minute) {
    //发状态更改
    var raw = JSON.stringify({
      "operation_type": 1,
      "status": 1,
      "clock_id": alarmList[index].id
    });
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch("//"+SERVER_HOST+":8080/clock/update", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.code===1){
          console.log('success to correct the status');
          alarmList[index].active = true;
          renderAlarmList();
        }
        else {
          console.log(result.msg);
        }
      })
      .catch(error => console.log('error', error));
    //发时间更改
    var raw = JSON.stringify({
      "operation_type": 2,
      "clock_time":hour *100 + minute,
      "clock_id": alarmList[index].id
    });
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch("//"+SERVER_HOST+":8080/clock/update", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.code===1){
          alarmList[index].hour = hour;
          alarmList[index].minute = minute;
          alarmList.sort(function(a, b) {
            return a.hour * 60 + a.minute - b.hour * 60 - b.minute;
          });
          renderAlarmList();
          alert("修改成功");
        }
        else {
          console.log(result.msg);
          alert("修改失败");
        }
      })
      .catch(error => console.log('error', error));
  }
}

function showMessage(messagetext){
  var messageBox = document.getElementById("message-box");
  var messageText = document.getElementById("message-text");
  var okButton = document.getElementById("ok-button");
  // 为按钮添加点击事件监听器，关闭对话框，停止闹钟声音
  okButton.addEventListener("click", function() {
      messageBox.close();
      alarmSound.pause();
      alarmSound.currentTime = 0;
  });
  messageText.innerHTML = messagetext;
  messageBox.showModal();
}

// 检查闹钟是否到时间
function checkAlarm() {
  var date = new Date();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  for (var i = 0; i < alarmList.length; i++) {
    var alarm = alarmList[i];
    if (alarm.active && alarm.hour == hour && alarm.minute == minute && second == 0) {
      alarmSound.play();
      showMessage("闹钟响了！时间是 " + formatTime(hour) + ":" + formatTime(minute));
      // alarmSound.pause();
      // alarmSound.currentTime = 0;
    //   alarm.active = false;
      renderAlarmList();
      break;
    }
  }
}

// 模态窗口（添加/编辑）
function showModal(mode, index) {
  // mode: "add" or "edit"
  // index: 编辑闹钟的下标或"-1"添加闹钟
  modal.style.display = "block"; 
  // 添加闹钟
  if (mode == "add") {
    modalTitle.innerHTML = "添加闹钟";
    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    // 闹钟时间默认为打开时的系统时间
    modalPickerHourValue.innerHTML = formatTime(hour);
    modalPickerMinuteValue.innerHTML = formatTime(minute);
    updateModalTime(); // 显示“xx小时xx分钟后响铃”
    currentAlarm = null; 
  } 
  // 编辑闹钟  
  else if (mode == "edit") {
    modalTitle.innerHTML = "编辑闹钟";
    var alarm = alarmList[index]; // 获取被编辑的闹钟
    // var date = new Date();
    // var hour = date.getHours();
    // var minute = date.getMinutes();
    // var diff = (alarm.hour * 60 + alarm.minute) - (hour * 60 + minute); // Calculate the difference in minutes
    // if (diff < 0) diff += 24 * 60; // Adjust the difference if it is negative
    // modalTime.innerHTML = formatTime(Math.floor(diff / 60)) + "小时" + formatTime(diff % 60) + "分钟后响铃";
    modalPickerHourValue.innerHTML = formatTime(alarm.hour);
    modalPickerMinuteValue.innerHTML = formatTime(alarm.minute);
    updateModalTime();
    currentAlarm = alarm; // 编辑时，currentAlarm指向被编辑的闹钟
  }
  modalInterval = setInterval(updateModalTime, 1000); // 每秒更新一次模态时间
}

// 关闭模态窗口的操作
function hideModal() {
  modal.style.display = "none"; 
  modalTitle.innerHTML = ""; 
  modalTime.innerHTML = ""; 
  modalPickerHourValue.innerHTML = ""; 
  modalPickerMinuteValue.innerHTML = ""; 
  currentAlarm = null; 
  // stop updating the modal time
  clearInterval(modalInterval);
  modalInterval = null;
}

// 修改时间（按键响应）
function changeHour(direction) {
  // direction: "up" or "down"
  var hour = parseInt(modalPickerHourValue.innerHTML); 
  if (direction == "up") {
    hour = (hour + 1) % 24; // 模24的+1
  } else if (direction == "down") {
    hour = (hour + 23) % 24; // 模24的-1
  }
  modalPickerHourValue.innerHTML = formatTime(hour); // 更新设定时间
  updateModalTime(); // 更新模态时间
}
function changeMinute(direction) {
  var minute = parseInt(modalPickerMinuteValue.innerHTML); 
  if (direction == "up") {
    minute = (minute + 1) % 60; 
  } else if (direction == "down") {
    minute = (minute + 59) % 60; 
  }
  modalPickerMinuteValue.innerHTML = formatTime(minute); 
  updateModalTime();
}

// 更新模态时间的函数（显示“xx小时xx分钟后响铃”）
function updateModalTime() {
  // 设定的闹钟时间
  var hour = parseInt(modalPickerHourValue.innerHTML); 
  var minute = parseInt(modalPickerMinuteValue.innerHTML);
  // 系统时间
  var date = new Date();
  var currentHour = date.getHours();
  var currentMinute = date.getMinutes();
//   var diff = (hour * 60 + minute) - (currentHour * 60 + currentMinute); 
    var diff = (hour * 60 + minute) - (currentHour * 60 + currentMinute) - 1; //-1是为了符合实际情况，12:00的闹钟在12:00设定时第二天才会响
    if (diff < 0) diff += 24 * 60; // 调整为正值
    if (diff === 0) modalTime.innerHTML = "不到1分钟后响铃";
    else if (diff < 60) modalTime.innerHTML = diff + "分钟后响铃";
    else modalTime.innerHTML = Math.floor(diff / 60) + "小时" + diff % 60 + "分钟后响铃"; // Update the modal time
}

// 提交模态窗口的操作
function submitModal() {
  var hour = parseInt(modalPickerHourValue.innerHTML); 
  var minute = parseInt(modalPickerMinuteValue.innerHTML);
  if (currentAlarm == null) { // 创建闹钟
    createAlarm(hour, minute); 
  } else { // 编辑闹钟
    var index = alarmList.indexOf(currentAlarm); 
    editAlarm(index, hour, minute);
  }
  hideModal();
}

// 渲染闹钟列表
function renderAlarmList() {
  // 先清除（防止重叠显示）
  alarms.innerHTML = "";
  if(alarmList.length === 0)
    alarms.style.display = "none";
  else
    alarms.style.display = "block";
  for (var i = 0; i < alarmList.length; i++) {
    var alarm = alarmList[i]; 
    // 闹钟相关元素的显示
    var alarmElement = document.createElement("div");
    alarmElement.className = "alarm";
    var alarmTime = document.createElement("div");
    alarmTime.className = "alarm-time";
    alarmTime.innerHTML = formatTime(alarm.hour) + ":" + formatTime(alarm.minute);
    var alarmButtons = document.createElement("div");
    alarmButtons.className = "alarm-buttons";
    var toggleButton = document.createElement("div");
    toggleButton.className = "alarm-button toggle-button";
    if (alarm.active) {
      // 闹钟激活状态的按钮样式
      toggleButton.classList.add("active");
    }
    var deleteButton = document.createElement("div");
    deleteButton.className = "alarm-button delete-button";
    deleteButton.innerHTML = "✖";
    alarmButtons.appendChild(toggleButton);
    alarmButtons.appendChild(deleteButton);
    alarmElement.appendChild(alarmTime);
    alarmElement.appendChild(alarmButtons);
    alarms.appendChild(alarmElement);

    // 点击闹钟编辑
    alarmElement.addEventListener("click", function(event) {
      event.stopPropagation(); // 阻止事件冒泡(防止触发父元素的事件)
      var index = Array.prototype.indexOf.call(alarms.children, this);
      showModal("edit", index);
    });
    // 闹钟状态按钮
    toggleButton.addEventListener("click", function(event) {
      event.stopPropagation();
      var index = Array.prototype.indexOf.call(alarms.children, this.parentNode.parentNode);
      toggleAlarm(index);
    });
    // 删除闹钟按钮
    deleteButton.addEventListener("click", function(event) {
      event.stopPropagation();
      var index = Array.prototype.indexOf.call(alarms.children, this.parentNode.parentNode);
      deleteAlarm(index);
    });
  }
}

/*-------按钮事件监听-------*/
// 添加闹钟
add.addEventListener("click", function() {
  // mode:add index:-1
  showModal("add", -1);
});
// 关闭模态窗口
modalClose.addEventListener("click", function() {
  hideModal();
});

// 闹钟时间设定
modalPickerHourUp.addEventListener("click", function() {
  changeHour("up");
});
modalPickerHourDown.addEventListener("click", function() {
  changeHour("down");
});
modalPickerMinuteUp.addEventListener("click", function() {
  changeMinute("up");
});
modalPickerMinuteDown.addEventListener("click", function() {
  changeMinute("down");
});

// 提交闹钟时间
modalSubmit.addEventListener("click", function() {
  submitModal();
});

// 每秒检查闹钟和更新系统时间
setInterval(getCurrentTime, 1000);
setInterval(checkAlarm, 1000);