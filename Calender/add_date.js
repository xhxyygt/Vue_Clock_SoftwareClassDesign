var SERVER_HOST
var myHeaders = new Headers();
var addedSchedules = [];

document.addEventListener('DOMContentLoaded', (event) => {
  //从本地获取SEVERHOST
  SERVER_HOST = localStorage.getItem('SEVER-HOST');
  // 从本地获取token
  myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
  myHeaders.append("Content-Type", "application/json");
  token = localStorage.getItem('token');
  myHeaders.append("Authorization", token);

  //2.获取用户已添加的日程
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
 };
 
 fetch("//"+SERVER_HOST+":8080/schedule", requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log(result);
      if(result.code === 1){
        addedSchedule = result.data.schedules;
        addedSchedule.forEach( schedule => {
          // var 
          // createScheduleItem(schedule)
          var newItem = {
            task: schedule.content,
            startTime: schedule.start_time,
            endTime: schedule.end_time,
            id: schedule.id
          };

          var scheduleItem = createScheduleItem(newItem);
          scheduleItems.appendChild(scheduleItem);
      })
      }else{
        console.log(result.msg);
      }
    })
    .catch(error => console.log('error', error));
  })

var overlay = document.querySelector('.overlay');
    var popup = document.querySelector('.popup');
    var popupTitle = document.querySelector('#popupTitle');
    var taskInput = document.getElementById('taskInput');
    var startTimeInput = document.getElementById('startTimeInput');
    var endTimeInput = document.getElementById('endTimeInput');
    var scheduleItems = document.getElementById('scheduleItems');
    var editItem = null;
    //弹出提示框
    //startTimeInput.value输入框的内容  item.startTime显示条目的内容
    function showPopup(type, item) {
        if (type === 'add') {
        popupTitle.textContent = '新建日程';
        taskInput.value = '';
        startTimeInput.value = getCurrentDateTime(); // 设置开始时间为当前时间
        endTimeInput.value = getCurrentDateTime(); // 设置结束时间为当前时间
        editItem = null;
        } else if (type === 'edit') {
        popupTitle.textContent = '编辑日程';
        taskInput.value = item.task;
        startTimeInput.value = item.startTime;
        endTimeInput.value = item.endTime;
        editItem = item;
        console.log(editItem);
       }
       overlay.style.display = 'flex';
       }
      //获取当前日期和时间
      function getCurrentDateTime() {
        var now = new Date();
        var year = now.getFullYear();
        var month = ('0' + (now.getMonth() + 1)).slice(-2);
        var day = ('0' + now.getDate()).slice(-2);
        var hours = ('0' + now.getHours()).slice(-2);
        var minutes = ('0' + now.getMinutes()).slice(-2);
        return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
      }
    //隐藏提示框
    function hidePopup() {
      overlay.style.display = 'none';
    }
    //添加日程
    function addSchedule() {
      var task = taskInput.value.trim();
      var startTime = startTimeInput.value;

      var endTime = endTimeInput.value;

      if (task === '' || startTime === '' || endTime === '') {
        alert('请输入完整的日程信息');//
        return;
      }

      //向后端发送添加消息
      var raw = JSON.stringify({
        "content": task,
        "start_time": startTime,
        "end_time": endTime,
        // "start_date": 1218,
        // "end_date": 1219
     });
     
     var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
     };
     
    fetch("//"+SERVER_HOST+":8080/schedule", requestOptions)
      .then(response => response.json())
      .then(result => {
        // console.log(result);
        if(result.code === 1){
          console.log('success to add the task');
          var newItem = {
            task: task,
            startTime: startTime,
            endTime: endTime,
            id: result.data.schedules.id
          };

          var scheduleItem = createScheduleItem(newItem);
          scheduleItems.appendChild(scheduleItem);
    
          hidePopup();
          // addedSchedules.push(newItem);
          alert('新建日程成功');//
        }
        else {
          console.log(result.data.msg);
          alert("新建失败，请重新添加");
        }
      })
      .catch(error => console.log('error', error));


    }
    //保存日程信息，点击完成键执行，包括修改日程的功能
    function saveSchedule() {
      var newTask = taskInput.value.trim();
      var newStartTime = startTimeInput.value;
      var newEndTime = endTimeInput.value;

      if (newTask === '' || newStartTime === '' || newEndTime === '') {
        alert('请输入完整的日程信息');
        return;
      }

      if (editItem === null) {
        addSchedule();
      } else {
        //向后端发送更改信息
        var raw = JSON.stringify({
          "id": editItem.id,
          "content": newTask,
          "start_time": newStartTime,
          "end_time": newEndTime,
          // "start_date": 1218,
          // "end_date": 1219
       });
       
       var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
       };
       
      fetch("//"+SERVER_HOST+":8080/schedule/update", requestOptions)
        .then(response => response.json())
        .then(result => {
          // console.log(result);
          if(result.code === 1){
            console.log('success to correct the task');
            editItem.task = newTask;
            editItem.startTime = newStartTime;
            editItem.endTime = newEndTime;
    
            editItem.element.querySelector('h3').textContent = newTask;
            editItem.element.querySelector('.startTimeText').textContent = '开始时间: ' + newStartTime.replace('T',' ');
            editItem.element.querySelector('.endTimeText').textContent = '结束时间: ' + newEndTime.replace('T',' ');
    
            taskInput.value = '';
            startTimeInput.value = '';
            endTimeInput.value = '';
    
            hidePopup();
            alert('修改日程成功');
          }
          else {
            console.log(result.data.msg);
            alert("修改失败");
          }
        })
        .catch(error => console.log('error', error));


      }
    }
    //取消按键
    function cancelSchedule() {
      hidePopup();
    }
    //创建日程表项，显示于下方
    function createScheduleItem(item) {
      var id = item.id;
      var scheduleItem = document.createElement('li');
      scheduleItem.classList.add('schedule-item');

      var taskTitle = document.createElement('h3');
      taskTitle.textContent = item.task;
      scheduleItem.appendChild(taskTitle);

      var startTimeText = document.createElement('p');
      startTimeText.classList.add('startTimeText');
      startTimeText.textContent = '开始时间: ' + item.startTime.replace('T',' ');
      scheduleItem.appendChild(startTimeText);

      var endTimeText = document.createElement('p');
      endTimeText.classList.add('endTimeText');
      endTimeText.textContent = '结束时间: ' + item.endTime.replace('T',' ');
      scheduleItem.appendChild(endTimeText);

      var editButton = document.createElement('button');
      editButton.textContent = '编辑';
      editButton.classList.add('edit-button');
      editButton.addEventListener('click', function() {
        showPopup('edit', item);
      });

      scheduleItem.appendChild(editButton);

      var deleteButton = document.createElement('button');
      deleteButton.textContent = '删除';
      deleteButton.addEventListener('click', function() {
        //向后端发送删除信息
        var requestOptions = {
          method: 'DELETE',
          headers: myHeaders,
          redirect: 'follow'
       };
       
       fetch("//"+SERVER_HOST+":8080/schedule?sid="+item.id.toString(), requestOptions)
          .then(response => response.json())
          .then(result => {
            // console.log(result)
            if(result.code === 1){
              console.log("删除成功");
              scheduleItems.removeChild(scheduleItem);
            }else{
              console.log(result.msg);
            }
          })
          .catch(error => console.log('error', error));
 

      });

      scheduleItem.appendChild(deleteButton);

      item.element = scheduleItem;

      return scheduleItem;
    }