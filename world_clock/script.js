  // const cities = [
  //   { name: '北京', country: '中国', timezone: 'GMT+8:00', tzIdentifier: 'Asia/Shanghai' },
  //   { name: '东京', country: '日本', timezone: 'GMT+9:00', tzIdentifier: 'Asia/Tokyo' },
  //   { name: '纽约', country: '美国', timezone: 'GMT-5:00', tzIdentifier: 'America/New_York' },
  //   { name: '伦敦', country: '英国', timezone: 'GMT+0:00', tzIdentifier: 'Europe/London' },
  //   { name: '巴黎', country: '法国', timezone: 'GMT+1:00', tzIdentifier: 'Europe/Paris' },
  //   // 更多城市...
  // ];

  var cities = [] //用于接收文件里的城市列表
  document.addEventListener('DOMContentLoaded', (event) => {
    fetch('./cities.json')
      .then(response => response.json())
      .then( data => {
        // 确保data是一个数组
        if (Array.isArray(cities)) {
          // 使用从cities.json文件中获取的城市数据
          data.forEach(city => {
            // 处理每个城市的数据
            console.log(city.name); // 示例：打印城市名称
            // ...其余代码保持不变...
            cities = data
          });
        } else {
          console.error('Data is not an array:', data);
        }
      })
      .catch(error => {
        console.error('Error fetching cities:', error);
      });
  });
  
  
  
    let addedCities = [];
  
    function updateLocalTime() {
      const now = new Date();
      // document.getElementById('clock').innerHTML = now.toLocaleTimeString().slice(0, 5) + ' ' + now.toLocaleDateString();
      document.getElementById('clock').innerHTML = now.toLocaleTimeString() + ' ' + now.toLocaleDateString();
    }
    setInterval(updateLocalTime, 1000);
  
    function showMessage(text) {
      const messageDiv = document.getElementById('message');
      messageDiv.textContent = text;
      messageDiv.style.display = 'block';
      setTimeout(() => { messageDiv.style.display = 'none'; }, 3000);
    }
  
    function toggleMenu() {
      const menu = document.getElementById('city-menu');
      const overlay = document.querySelector('.overlay');
      const isMenuVisible = menu.style.display === 'block';
      menu.style.display = isMenuVisible ? 'none' : 'block';
      overlay.style.display = isMenuVisible ? 'none' : 'block';
      if (!isMenuVisible) populateCities();
    }
  
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
  
    function selectCity(city) {
      if (addedCities.includes(city.name)) {
        showMessage('该时区已存在');
        toggleMenu();
      } else {
        addedCities.push(city.name);
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
      deleteBtn.onclick = function() { cityDiv.remove(); addedCities = addedCities.filter(c => c !== name); };
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