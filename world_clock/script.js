// 获取模态元素
var modal = document.getElementById('modal');
// 获取打开模态的按钮
var btn = document.getElementById('add-country');
// 获取关闭模态的元素
var span = document.getElementsByClassName('close')[0];

// 点击按钮打开模态
btn.onclick = function() {
    modal.style.display = 'block';
}

// 点击 <span> (x) 关闭模态
span.onclick = function() {
    modal.style.display = 'none';
}

// 点击模态外部区域关闭模态
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
// 假设cities是从某个API或数据库中获取的城市数据
const cities = [
    { name: "北京", country: "中国", timezone: "GMT+8" },
    { name: "东京", country: "日本", timezone: "GMT+9" },
    // ... 其他城市
    ];
    
    // 创建菜单项并添加到菜单中
    function createMenu() {
        const menu = document.getElementById('city-menu');
        cities.forEach(city => {
        const menuItem = document.createElement('li');
        menuItem.textContent = `${city.name}, ${city.country}, ${city.timezone}`;
        menuItem.onclick = function() { addCityToPage(city); };
        menu.appendChild(menuItem);
        });
    }
    
    // 将选中的城市添加到网页中
    function addCityToPage(city) {
        const cityContainer = document.createElement('div');
        const time = new Date().toLocaleTimeString('en-US', { timeZone: city.timezone });
        const date = new Date().toLocaleDateString('en-US', { timeZone: city.timezone });
        const hoursDiff = (new Date().getTimezoneOffset() / 60) + parseInt(city.timezone.slice(3));
        const dayOrNight = hoursDiff > 0 ? '快' : '慢';
    
        cityContainer.innerHTML = `
        <div>
            <div>时间: ${time} 城市: ${city.name}</div>
            <div>日期: ${date} 相对本地时间: ${Math.abs(hoursDiff)}小时${dayOrNight}</div>
        </div>
        <div class="clock" style="background-color: ${isDaytime(city.timezone) ? 'white' : 'black'};"></div>
        `;
    
        document.body.appendChild(cityContainer);
    }
    
    // 判断是否为白天
    function isDaytime(timezone) {
        const hours = new Date().getHours();
        const offset = parseInt(timezone.slice(3));
        const localHours = (hours + offset) % 24;
        return localHours >= 6 && localHours <= 18;
    }
    
    // 初始化菜单
    createMenu();
    
// var searchValue
// // 搜索国家功能
// document.getElementById('search-country').addEventListener('input', function(e) {
//     searchValue = e.target.value.toLowerCase();
//     // var countryButtons = document.querySelectorAll('.country-btn');
//     var countryButtons = document.querySelectorAll('.country-menu li').forEach(function(countryList) {
//         var countryName = countryList.textContent.toLowerCase();
//         if (countryName.includes(searchValue)) {
//             countryList.style.display = 'block';
//         } else {
//             countryList.style.display = 'none';
//         }
//     });
// });

// // 控制大洲和国家列表显示的JavaScript代码
// document.querySelectorAll('.continent-menu li').forEach(function(elem) {
//     elem.addEventListener('click', function() {
//         var continent = this.getAttribute('data-continent');
//         // 隐藏所有国家列表
//         document.querySelectorAll('.country-menu').forEach(function(countryList) {
//             countryList.style.display = 'none';
//         });
//         // 显示选中大洲的国家列表
//         document.getElementById(continent + '-countries').style.display = 'block';
//     });
// });


// // 假设我们有一个包含国家和对应时区的对象
// var countryTimezones = {
//     'CN': 'Asia/Shanghai',
//     'JP': 'Asia/Tokyo',
//     'IN': 'Asia/Kolkata',
//     // 其他国家和时区...
// };

// // 动态创建国家时间显示元素的函数
// function createCountryTimeElement(countryName, timezone) {
//     // 创建包裹元素
//     var countryTimeWrapper = document.createElement('div');
//     countryTimeWrapper.className = 'country-time';
//     countryTimeWrapper.style.background = '#f9f9f9';
//     countryTimeWrapper.style.borderRadius = '10px';
//     countryTimeWrapper.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
//     countryTimeWrapper.style.marginBottom = '10px';
//     countryTimeWrapper.style.padding = '10px';
//     countryTimeWrapper.style.position = 'relative';
//     countryTimeWrapper.style.display = 'flex';
//     countryTimeWrapper.style.alignItems = 'center';
//     countryTimeWrapper.style.justifyContent = 'space-between';

//     // 创建国家名称元素
//     var countryNameSpan = document.createElement('span');
//     countryNameSpan.className = 'country-name';
//     countryNameSpan.style.fontWeight = 'bold';
//     countryNameSpan.textContent = countryName;

//     // 创建时间显示元素
//     var timeSpan = document.createElement('span');
//     timeSpan.className = 'country-current-time';
//     timeSpan.textContent = new Date().toLocaleString('en-US', { timeZone: timezone });

//     // 创建时区显示元素
//     var timezoneSpan = document.createElement('span');
//     timezoneSpan.className = 'country-timezone';
//     timezoneSpan.textContent = timezone;

//     // 创建删除按钮
//     var deleteButton = document.createElement('button');
//     deleteButton.className = 'delete-country-time';
//     deleteButton.textContent = '删除';
//     deleteButton.onclick = function() {
//         countryTimeWrapper.remove();
//         // 从已添加国家数组中移除
//         var index = addedCountries.indexOf(countryName);
//         if (index > -1) {
//             addedCountries.splice(index, 1);
//         }
//     };

//     // 将子元素添加到包裹元素
//     countryTimeWrapper.appendChild(countryNameSpan);
//     countryTimeWrapper.appendChild(timeSpan);
//     countryTimeWrapper.appendChild(timezoneSpan);
//     countryTimeWrapper.appendChild(deleteButton);

//     // 将包裹元素添加到页面中
//     var countryTimesContainer = document.getElementById('country-times');
//     countryTimesContainer.appendChild(countryTimeWrapper);

//     // 定时更新时间
//     setInterval(function() {
//         timeSpan.textContent = new Date().toLocaleString('en-US', { timeZone: timezone });
//     }, 1000);
// }

// // 已添加国家的数组
// var addedCountries = [];

// // 当用户点击国家名称时，添加该国家的时间到网页中
// document.querySelectorAll('.country-menu li').forEach(function(countryElem) {
//     countryElem.addEventListener('click', function() {
//         var countryCode = this.getAttribute('data-country');
//         var countryName = this.textContent;
//         var timezone = countryTimezones[countryCode];
//             // 检查国家是否已添加
//         if (addedCountries.includes(countryName)) {
//             alert(countryName + ' 已经添加到列表中。');
//             return; // 如果已添加，则不再执行添加操作
//         }
//         createCountryTimeElement(countryName, timezone);
//         addedCountries.push(countryName);
//     });
// });

// // 示例：创建中国时间显示元素
// createCountryTimeElement('中国', 'Asia/Shanghai');
// addedCountries.push('中国');

/* */

// // 获取所有大洲列表项和国家列表
// var continentListItems = document.querySelectorAll('.continent-menu li');
// var countryLists = document.querySelectorAll('.country-menu');

// // 为每个大洲列表项添加点击事件监听器
// continentListItems.forEach(function(listItem) {
//     listItem.addEventListener('click', function() {
//         // 获取点击的列表项的data-continent属性值
//         var selectedContinent = this.getAttribute('data-continent');
        
//         // 遍历所有国家列表
//         countryLists.forEach(function(countryList) {
//             // 如果国家列表的ID与选中的大洲匹配，则显示，否则隐藏
//             if (countryList.id === selectedContinent + '-countries') {
//                 countryList.style.display = 'block';
//             } else {
//                 countryList.style.display = 'none';
//             }
//         });
//     });
// });

// // 选择国家并添加到列表
// var countryOptions = document.getElementById('country-options');
// countryOptions.addEventListener('click', function(e) {
//     if (e.target.classList.contains('country-btn')) {
//         var countryName = e.target.getAttribute('data-country');
//         var timezone = e.target.getAttribute('data-timezone');
//         addCountryToList(countryName, timezone);
//         document.getElementById('modal').style.display = 'none';
//     }
// });

// // 已添加国家的数组
// var addedCountries = [];

// // 添加国家和时区到列表的函数
// function addCountryToList(countryName, timezone) {
//     // 检查国家是否已添加
//     if (addedCountries.includes(countryName)) {
//         alert(countryName + ' 已经添加到列表中。');
//         return; // 如果已添加，则不再执行添加操作
//     }

//     // 获取当前时间并转换为指定时区的时间
//     var time = new Date().toLocaleString('en-US', { timeZone: timezone });
    
//     // 创建列表项
//     var li = document.createElement('li');
//     li.textContent = countryName + ' - ' + time + ' - ' + timezone;
    
//     // 创建删除按钮
//     var deleteButton = document.createElement('button');
//     deleteButton.textContent = '删除';
//     deleteButton.onclick = function() {
//         li.remove();
//         // 从已添加国家数组中移除
//         var index = addedCountries.indexOf(countryName);
//         if (index > -1) {
//             addedCountries.splice(index, 1);
//         }
//     };
    
//     // 将删除按钮添加到列表项
//     li.appendChild(deleteButton);
//     // 将列表项添加到国家列表
//     document.getElementById('country-list').appendChild(li);
    
//     // 添加国家到已添加国家数组
//     addedCountries.push(countryName);
    
//     // 定时更新时间
//     setInterval(function() {
//         li.firstChild.textContent = countryName + ' - ' + new Date().toLocaleString('en-US', { timeZone: timezone }) + ' - ' + timezone;
//     }, 1000);
// }
