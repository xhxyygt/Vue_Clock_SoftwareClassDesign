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
    console.log(result);
    if(result.code === 1){
    pre_alarms=result.data.clocks;
    pre_alarms.forEach( pre_alarm => {
      var hour = parseInt(parseInt(pre_alarm.clock_time)/100); // 小时部分为第一个字符串
      var minute = parseInt(pre_alarm.clock_time)%100; // 分钟部分为第二个字符串
      var alarm = {
        hour: hour,
        minute: minute,
        active: pre_alarm.status,// The alarm is active by default
        id:pre_alarm.id
        };
      alarmList.push(alarm);
      console.log(alarm);
        // Sort the alarm list by time
      alarmList.sort(function(a, b) {
         return a.hour * 60 + a.minute - b.hour * 60 - b.minute;
           });
      // Render the alarm list
      renderAlarmList();
    })
    }else{
      console.log(result.msg);
    }
   })
   .catch(error => console.log('error', error));

  getCurrentTime();
  // showMessage("Welcome to Alarm Clock!");
})




// Get the elements
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

// Initialize the variables
var alarmList = []; // An array of alarm objects
var currentAlarm = null; // The alarm object that is being edited or added
var alarmSound = new Audio("../Timer/Zelda’s Lullaby.ogg"); // The sound to play when the alarm goes off



   
// Define some helper functions
function formatTime(num) {
  // Convert a number to a two-digit string
  return num < 10 ? "0" + num : num.toString();
}

function getCurrentTime() {
  // Get the current local time and date
  var date = new Date();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  // Update the time and date elements
  time.innerHTML = formatTime(hour) + ":" + formatTime(minute) + ":" + formatTime(second);
  date.innerHTML = year + "-" + formatTime(month) + "-" + formatTime(day);
}

function createAlarm(hour, minute) {
  //保存闹钟
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
    console.log('success to add the alarm');
    // Create an alarm object with the given hour and minute
    var alarm = {
    hour: hour,
    minute: minute,
    active: true ,// The alarm is active by default
    id:result.data.clocks.id
    };
      // Add the alarm to the alarm list
    alarmList.push(alarm);
    // Sort the alarm list by time
    alarmList.sort(function(a, b) {
    return a.hour * 60 + a.minute - b.hour * 60 - b.minute;
       });
    // Render the alarm list
    renderAlarmList();
    }
    else {
      console.log(result.msg);
      alert("新建失败，请重新添加");
    }
   })
   .catch(error => console.log('error', error));

}

function deleteAlarm(index) {
  // Delete an alarm object with the given index
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
        console.log("删除成功");
        alarmList.splice(index, 1);
        // Render the alarm list
        renderAlarmList();
      }
      else{
        console.log(result.msg);
      }
    })
    .catch(error => console.log('error', error));
}

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
        console.log('success to correct the status');
        alarmList[index].active = !alarmList[index].active;
        // Render the alarm list
        renderAlarmList();
        alert("修改成功");
      }
      else {
        console.log(result.msg);
        alert("修改失败");
      }
    })
    .catch(error => console.log('error', error));
  // Toggle an alarm object's status with the given index
}

function editAlarm(index, hour, minute) {
  // Edit an alarm object's time with the given index, hour and minute
  //若编辑后时间改变闹钟激活（否则不更改状态）[待修改]
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
        alert("修改成功");
      }
      else {
        console.log(result.msg);
        alert("修改失败");
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
        console.log('success to correct the status');
        alarmList[index].hour = hour;
        alarmList[index].minute = minute;
        alert("修改成功");
        renderAlarmList();
      }
      else {
        console.log(result.msg);
        alert("修改失败");
      }
    })
    .catch(error => console.log('error', error));
  }


  // alarmList[index].active = true; // The alarm is active after editing
  // Sort the alarm list by time
  alarmList.sort(function(a, b) {
    return a.hour * 60 + a.minute - b.hour * 60 - b.minute;
  });
  // Render the alarm list
  renderAlarmList();
}

function showMessage(messagetext){
  var messageBox = document.getElementById("message-box");
  var messageText = document.getElementById("message-text");
  var okButton = document.getElementById("ok-button");

  // 为按钮添加点击事件监听器，关闭对话框
  okButton.addEventListener("click", function() {
      messageBox.close();
      // stopAudio();
      // Stop the alarm sound
      alarmSound.pause();
      alarmSound.currentTime = 0;
  });
  messageText.innerHTML = messagetext;
  messageBox.showModal();
}

function checkAlarm() {
  // Check if any alarm has reached the set time
  var date = new Date();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  for (var i = 0; i < alarmList.length; i++) {
    var alarm = alarmList[i];
    if (alarm.active && alarm.hour == hour && alarm.minute == minute && second == 0) {
      // Play the alarm sound
      alarmSound.play();
      // Show an alert message
      // alert("闹钟响了！时间是 " + formatTime(hour) + ":" + formatTime(minute));
      showMessage("闹钟响了！时间是 " + formatTime(hour) + ":" + formatTime(minute));
      // // Stop the alarm sound
      // alarmSound.pause();
      // alarmSound.currentTime = 0;
    //   // Turn off the alarm
    //   alarm.active = false;
      // Render the alarm list
      renderAlarmList();
      // Break the loop
      break;
    }
  }
}

function showModal(mode, index) {
  // Show the modal window with the given mode and index
  // The mode can be either "add" or "edit"
  // The index is the index of the alarm to be edited, or -1 for adding a new alarm
  modal.style.display = "block"; // Show the modal element
  if (mode == "add") {
    // Initialize the modal content for adding a new alarm
    modalTitle.innerHTML = "添加闹钟";
    // Get the current system time
    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    // Set the modal hour and minute values to the current system time
    modalPickerHourValue.innerHTML = formatTime(hour);
    modalPickerMinuteValue.innerHTML = formatTime(minute);
    // Update the modal time
    updateModalTime();
    currentAlarm = null; // There is no current alarm
  } else if (mode == "edit") {
    // Initialize the modal content for editing an existing alarm
    modalTitle.innerHTML = "编辑闹钟";
    var alarm = alarmList[index]; // Get the alarm object
    // var date = new Date();
    // var hour = date.getHours();
    // var minute = date.getMinutes();
    // var diff = (alarm.hour * 60 + alarm.minute) - (hour * 60 + minute); // Calculate the difference in minutes
    // if (diff < 0) diff += 24 * 60; // Adjust the difference if it is negative
    // modalTime.innerHTML = formatTime(Math.floor(diff / 60)) + "小时" + formatTime(diff % 60) + "分钟后响铃";
    modalPickerHourValue.innerHTML = formatTime(alarm.hour);
    modalPickerMinuteValue.innerHTML = formatTime(alarm.minute);
    updateModalTime(); // Update the modal time
    currentAlarm = alarm; // Set the current alarm
  }
  modalInterval = setInterval(updateModalTime, 1000); // 每秒更新一次模态时间
}


function hideModal() {
  // Hide the modal window
  modal.style.display = "none"; // Hide the modal element
  modalTitle.innerHTML = ""; // Clear the modal title
  modalTime.innerHTML = ""; // Clear the modal time
  modalPickerHourValue.innerHTML = ""; // Clear the modal hour value
  modalPickerMinuteValue.innerHTML = ""; // Clear the modal minute value
  currentAlarm = null; // Clear the current alarm
  // Clear the interval to stop updating the modal time
  clearInterval(modalInterval);
  modalInterval = null;
}

function changeHour(direction) {
  // Change the modal hour value according to the given direction
  // The direction can be either "up" or "down"
  var hour = parseInt(modalPickerHourValue.innerHTML); // Get the current hour value
  if (direction == "up") {
    hour = (hour + 1) % 24; // Increase the hour by 1, and wrap around if it exceeds 23
  } else if (direction == "down") {
    hour = (hour + 23) % 24; // Decrease the hour by 1, and wrap around if it is less than 0
  }
  modalPickerHourValue.innerHTML = formatTime(hour); // Update the modal hour value
  updateModalTime(); // Update the modal time
}

function changeMinute(direction) {
  // Change the modal minute value according to the given direction
  // The direction can be either "up" or "down"
  var minute = parseInt(modalPickerMinuteValue.innerHTML); // Get the current minute value
  if (direction == "up") {
    minute = (minute + 1) % 60; // Increase the minute by 1, and wrap around if it exceeds 59
  } else if (direction == "down") {
    minute = (minute + 59) % 60; // Decrease the minute by 1, and wrap around if it is less than 0
  }
  modalPickerMinuteValue.innerHTML = formatTime(minute); // Update the modal minute value
  updateModalTime(); // Update the modal time
}

//更新模态时间的函数（显示“xx小时xx分钟后响铃”）
function updateModalTime() {
  // Update the modal time according to the modal hour and minute values
//   设定的闹钟时间
  var hour = parseInt(modalPickerHourValue.innerHTML); // Get the modal hour value
  var minute = parseInt(modalPickerMinuteValue.innerHTML); // Get the modal minute value
//   系统时间
  var date = new Date();
  var currentHour = date.getHours();
  var currentMinute = date.getMinutes();
//   var diff = (hour * 60 + minute) - (currentHour * 60 + currentMinute); // Calculate the difference in minutes
    var diff = (hour * 60 + minute) - (currentHour * 60 + currentMinute) - 1; //-1是为了符合实际情况，12:00的闹钟在12:00设定时第二天才会响
    if (diff < 0) diff += 24 * 60; // Adjust the difference if it is negative
    if (diff === 0) modalTime.innerHTML = "不到1分钟后响铃";
    else if (diff < 60) modalTime.innerHTML = diff + "分钟后响铃";
    else modalTime.innerHTML = Math.floor(diff / 60) + "小时" + diff % 60 + "分钟后响铃"; // Update the modal time
}

function submitModal() {
  // Submit the modal content
  var hour = parseInt(modalPickerHourValue.innerHTML); // Get the modal hour value
  var minute = parseInt(modalPickerMinuteValue.innerHTML); // Get the modal minute value
  if (currentAlarm == null) {
    // If there is no current alarm, it means adding a new alarm
    createAlarm(hour, minute); // Call the createAlarm function
  } else {
    // If there is a current alarm, it means editing an existing alarm
    var index = alarmList.indexOf(currentAlarm); // Get the index of the current alarm
    editAlarm(index, hour, minute); // Call the editAlarm function
  }
  hideModal(); // Hide the modal window
}

// Define a function to render the alarm list
function renderAlarmList() {
  // Clear the alarms element
  alarms.innerHTML = "";
  // Loop through the alarm list
  if(alarmList.length === 0) { alarms.style.display = "none"; }
  else { alarms.style.display = "block";}
  for (var i = 0; i < alarmList.length; i++) {
    var alarm = alarmList[i]; // Get the alarm object
    // Create an alarm element
    var alarmElement = document.createElement("div");
    alarmElement.className = "alarm";
    // Create an alarm time element
    var alarmTime = document.createElement("div");
    alarmTime.className = "alarm-time";
    alarmTime.innerHTML = formatTime(alarm.hour) + ":" + formatTime(alarm.minute);
    // Create an alarm buttons element
    var alarmButtons = document.createElement("div");
    alarmButtons.className = "alarm-buttons";
    // Create a toggle button element
    var toggleButton = document.createElement("div");
    toggleButton.className = "alarm-button toggle-button";
    if (alarm.active) {
      // If the alarm is active, add the active class
      toggleButton.classList.add("active");
    }
    // Create a delete button element
    var deleteButton = document.createElement("div");
    deleteButton.className = "alarm-button delete-button";
    deleteButton.innerHTML = "✖";
    // Append the elements to the alarm buttons element
    alarmButtons.appendChild(toggleButton);
    alarmButtons.appendChild(deleteButton);
    // Append the elements to the alarm element
    alarmElement.appendChild(alarmTime);
    alarmElement.appendChild(alarmButtons);
    // Append the alarm element to the alarms element
    alarms.appendChild(alarmElement);
    // Add event listeners to the alarm element and its buttons
    alarmElement.addEventListener("click", function(event) {
      // Prevent the event from bubbling up to the parent elements
      event.stopPropagation();
      // Get the index of the clicked alarm
      var index = Array.prototype.indexOf.call(alarms.children, this);
      // Show the modal window with the edit mode and the index
      showModal("edit", index);
    });
    toggleButton.addEventListener("click", function(event) {
      // Prevent the event from bubbling up to the parent elements
      event.stopPropagation();
      // Get the index of the clicked alarm
      var index = Array.prototype.indexOf.call(alarms.children, this.parentNode.parentNode);
      // Toggle the alarm status with the index
      toggleAlarm(index);
    });
    deleteButton.addEventListener("click", function(event) {
      // Prevent the event from bubbling up to the parent elements
      event.stopPropagation();
      // Get the index of the clicked alarm
      var index = Array.prototype.indexOf.call(alarms.children, this.parentNode.parentNode);
      // Delete the alarm with the index
      deleteAlarm(index);
    });
  }
}

// Add event listeners to the add button and the modal elements
add.addEventListener("click", function() {
  // Show the modal window with the add mode and -1 as the index
  showModal("add", -1);
});
modalClose.addEventListener("click", function() {
  // Hide the modal window
  hideModal();
});
modalPickerHourUp.addEventListener("click", function() {
  // Change the modal hour value up
  changeHour("up");
});
modalPickerHourDown.addEventListener("click", function() {
  // Change the modal hour value down
  changeHour("down");
});
modalPickerMinuteUp.addEventListener("click", function() {
  // Change the modal minute value up
  changeMinute("up");
});
modalPickerMinuteDown.addEventListener("click", function() {
  // Change the modal minute value down
  changeMinute("down");
});
modalSubmit.addEventListener("click", function() {
  // Submit the modal content
  submitModal();
});

// Call the getCurrentTime function every second
setInterval(getCurrentTime, 1000);

// Call the checkAlarm function every minute
setInterval(checkAlarm, 1000);