(function() {
    angular
      .module('calendarApp', ['ngAnimate'])
      .controller('calendarController', calendarController);
  
    function calendarController($scope) {
      var vm = this,
        now = new Date(),
        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        jan = daysInMonth(1, now.getFullYear()),
        feb = daysInMonth(2, now.getFullYear()),
        mar = daysInMonth(3, now.getFullYear()),
        apr = daysInMonth(4, now.getFullYear()),
        may = daysInMonth(5, now.getFullYear()),
        jun = daysInMonth(6, now.getFullYear()),
        jul = daysInMonth(7, now.getFullYear()),
        aug = daysInMonth(8, now.getFullYear()),
        sep = daysInMonth(9, now.getFullYear()),
        oct = daysInMonth(10, now.getFullYear()),
        nov = daysInMonth(11, now.getFullYear()),
        dec = daysInMonth(12, now.getFullYear()),
        monthRef = [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec],
        month = now.getMonth(),
        monthDay = monthRef[now.getMonth()],
        n = now.getDate();
  
      vm.id = now.getDate().toString() + now.getMonth().toString();
      vm.dataId;
      vm.events = [];
      vm.description;
      vm.type = 'Social';
      vm.month = months[month];
      vm.next = next;
      vm.prev = prev;
      vm.add = add;
        
      // 突出今天
      function presentDay() {
        $(".date_item").eq(n - 1).addClass("present");
      }
  
      // 打印当前月份的日期列表
      function showDays(days) {
        for (var i = 1; i < days; i++) {
          var uidi = i;
          var uidm = month;
          var uid = uidi.toString() + uidm.toString();
          $(".calendar-days").append("<div class='date_item' data='" + uid + "'>" + i + "</div>");
        }
      }

  
      // 将事件添加到指定日期
      function add() {
        vm.events.push({
          id: vm.id,
          description: vm.description,
          type: vm.type
        });
  
        vm.description = "";
      }
  
      // 获取每个日期项的唯一ID
      $(".calendar-days").on("click", ".date_item",function() {
        vm.id = $(this).attr('data');
        // vm.dataId = $(this).attr('data');
        $(this).addClass("current-date").siblings().removeClass("current-date");
        $scope.$apply();
      });
  
      showDays(monthDay);
  
      presentDay();
  
      placeIt();
  
    }
  
  })();