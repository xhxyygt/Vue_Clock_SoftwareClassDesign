  // const cities = [
  //   { name: '北京', country: '中国', timezone: 'GMT+8:00', tzIdentifier: 'Asia/Shanghai' },
  //   { name: '东京', country: '日本', timezone: 'GMT+9:00', tzIdentifier: 'Asia/Tokyo' },
  //   { name: '纽约', country: '美国', timezone: 'GMT-5:00', tzIdentifier: 'America/New_York' },
  //   { name: '伦敦', country: '英国', timezone: 'GMT+0:00', tzIdentifier: 'Europe/London' },
  //   { name: '巴黎', country: '法国', timezone: 'GMT+1:00', tzIdentifier: 'Europe/Paris' },
  //   // 更多城市...
  // ];

  // 从cities.json文件中获取城市列表
  var cities = [] //用于接收文件里的城市列表
  var addedCities = []; // 用于存储已添加的城市名称

  document.addEventListener('DOMContentLoaded', (event) => {
    fetch('./cities.json')
    // 使用 then 方法指定第一个回调函数，用于处理响应对象
      .then(response => response.json()) // 返回一个 Promise 对象，用于等待响应对象的 json 方法返回一个 JavaScript 对象
      // 使用 then 方法指定第二个回调函数，用于处理 JavaScript 对象
      .then( data => {
        // 确保data是一个数组
        if (Array.isArray(cities)) {
          // 使用从cities.json文件中获取的城市数据
          cities = data;
          // 调试用，打印城市列表
          // data.forEach(city => { 
          //   console.log(city.name); 
          // });

          //从本地存储中获取已添加的城市列表(用then方法，确保数据已经获取到)
          const storedCities = localStorage.getItem('addedCities');
          if (storedCities) {
            addedCities = JSON.parse(storedCities);
            // console.log(addedCities);
            // console.log(cities);
            addedCities.forEach(cityName => {
              // console.log(cityName);
              const city = cities.find(function(c){
                return c.name === cityName;
              });
              // console.log(city);
              // 加判断是为了防止cities.json文件中的城市列表发生变化，导致本地存储的addedCities在cities中找不到
              if(city){displayCity(city.name, city.timezone, city.tzIdentifier);}
              // 发现city不存在后删除本地存储中的城市名称(不运行下边这一段就只是不显示，但是本地存储中还是有的)
              else {
                addedCities.splice(addedCities.indexOf(cityName), 1); //删掉过时的城市名称并更新本地存储
                localStorage.setItem('addedCities', JSON.stringify(addedCities));
                //解决删除后造成的遍历移位问题，重新遍历一遍addedCities即可
                addedCities.forEach(cityName => {
                  // console.log(cityName);
                  const city = cities.find(function(c){
                    return c.name === cityName;
                  });
                  // console.log(city);
                  if(city){displayCity(city.name, city.timezone, city.tzIdentifier);}
                }
                )
              }
            });
          }

        } else {
          console.error('Data is not an array:', data);
        }
      })
      .catch(error => {
        console.error('Error fetching cities:', error);
      });
    

    // // 从本地存储中获取已添加的城市列表
    // const storedCities = localStorage.getItem('addedCities');
    // if (storedCities) {
    //   addedCities = JSON.parse(storedCities);
    //   console.log(addedCities);
    //   console.log(cities);
    //   addedCities.forEach(cityName => {
    //     console.log(cityName);
    //     const city = cities.find(function(c){
    //       return c.name === cityName;
    //     });
    //     console.log(city);
    //     // displayCity(city.name, city.timezone, city.tzIdentifier);
    //   });
    // }



      // addedCities.forEach(cityName => {
      //   const city = cities.find(c => c.name === cityName);
      //   if (city) displayCity(city.name, city.timezone, city.tzIdentifier);
      // });
      updateLocalTime(); //打开后立即更新本地时间（防止隔1秒才出现造成卡顿效果）
  });
  



    // 更新本地时间
    function updateLocalTime() {
      const now = new Date();
      // document.getElementById('clock').innerHTML = now.toLocaleTimeString().slice(0, 5) + ' ' + now.toLocaleDateString(); //小时和分钟
      document.getElementById('clock').innerHTML = now.toLocaleTimeString() + ' ' + now.toLocaleDateString(); //小时、分钟和秒
      //改为12小时制
      // document.getElementById('clock').innerHTML = now.toLocaleTimeString('en-US', { hour12: true  }) + ' ' + now.toLocaleDateString(); 
    }
    setInterval(updateLocalTime, 1000);
    
    // 消息模块，3s后消失
    function showMessage(text) {
      const messageDiv = document.getElementById('message');
      messageDiv.textContent = text;
      messageDiv.style.display = 'block';
      setTimeout(() => { messageDiv.style.display = 'none'; }, 3000);
    }

    // 打开/关闭城市列表
    function toggleMenu() {
      const menu = document.getElementById('city-menu');
      const overlay = document.querySelector('.overlay');  // 遮罩层
      const isMenuVisible = menu.style.display === 'block';
      menu.style.display = isMenuVisible ? 'none' : 'block'; // 切换菜单的显示状态（打开->关闭 关闭->打开）
      overlay.style.display = isMenuVisible ? 'none' : 'block';
      if (!isMenuVisible) populateCities(); 
    }
    
    // 显示城市列表并相应点击
    function populateCities() {
      const cityList = document.getElementById('city-list');
      cityList.innerHTML = '';
      cities.forEach(city => {
        const li = document.createElement('li'); 
        li.innerHTML = `<span class="city-name">${city.name}</span> - ${city.country} - ${city.timezone}`;
        li.onclick = function() { selectCity(city); };
        cityList.appendChild(li);
      });
    }

    // 搜索城市
    function filterCities() {
      const search = document.getElementById('search').value.toLowerCase();
      const filteredCities = cities.filter(city => {
        return city.name.toLowerCase().includes(search) ||
              city.country.toLowerCase().includes(search) ||
              city.timezone.toLowerCase().includes(search);
      });
      const cityList = document.getElementById('city-list');
      cityList.innerHTML = '';
      filteredCities.forEach(city => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="city-name">${city.name}</span> - ${city.country} - ${city.timezone}`;
        li.onclick = function() { selectCity(city); };
        cityList.appendChild(li);
      });
    }
    
    // 点击城市的响应
    function selectCity(city) {
      if (addedCities.includes(city.name)) {
        showMessage('该时区已存在');
        toggleMenu(); // 关闭菜单
      } else {
        addedCities.push(city.name); // 将城市名称添加到addedCities数组中
        localStorage.setItem('addedCities', JSON.stringify(addedCities)); // 将addedCities数组存储到本地
        displayCity(city.name, city.timezone, city.tzIdentifier);
        toggleMenu();
      }
    }
  
    function displayCity(name, timezone, tzIdentifier) {
      const cityDiv = document.createElement('div');
      cityDiv.className = 'city';
      const cityInfo = document.createElement('div');
      cityInfo.className = 'city-info';
      const cityTime = document.createElement('div');
      cityTime.className = 'city-time';
      const cityDate = document.createElement('div');
      cityDate.className = 'city-date';
      const deleteBtn = document.createElement('div');
      deleteBtn.className = 'delete-btn';
      deleteBtn.innerHTML = '删除';
      deleteBtn.onclick = function() {
        cityDiv.remove(); 
        addedCities = addedCities.filter(c => c !== name);
        localStorage.setItem('addedCities', JSON.stringify(addedCities)); // 删除后也要更新本地
      };
      
      cityInfo.appendChild(cityTime);
      cityInfo.appendChild(cityDate);
      cityDiv.appendChild(cityInfo);
      cityDiv.appendChild(deleteBtn);
      document.getElementById('cities').appendChild(cityDiv);
  
      function updateCityTime() {
        const now = new Date();
        const cityDateObj = new Date(now.toLocaleString('en-US', {timeZone: tzIdentifier}));
        const timeDifference = (cityDateObj - now) / 3600000;
        const timeDiffFormatted = Math.abs(timeDifference) < 0.01 ? '与本地时间相同' : (timeDifference > 0 ? `快${Math.round(timeDifference)}小时` : `慢${Math.abs(Math.round(timeDifference))}小时`);
        cityTime.innerHTML = `<strong>${cityDateObj.toLocaleTimeString().slice(0, 5)}</strong> ${name}`;
        cityDate.innerHTML = cityDateObj.toLocaleDateString().replace(/\//g, '-') + ' | ' + timeDiffFormatted;
      }
      updateCityTime(); // 立即更新时间，避免卡顿
      setInterval(updateCityTime, 1000);
    }