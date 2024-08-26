for (let year = 1940; year <= 2024; year++) {
  let options = document.createElement("OPTION");
  document.getElementById("year").appendChild(options).innerHTML = year;
  document.getElementById("year").appendChild(options).value = year;
}

for (let day = 1; day <= 31; day++) {
  let options = document.createElement("OPTION");
  let dayValue = String(day).padStart(2, '0'); // Добавляем ведущий ноль
  options.innerHTML = day;
  options.value = dayValue;
  document.getElementById("day").appendChild(options);
}

function toggleFields(parentId) {
  const selectedValue = document.getElementById(parentId).querySelector('select').value;

  const fields = document.getElementById(parentId).querySelectorAll('div[class="fullName"], div[class="job"], div[class="position"], div[class="phoneNumber"]');

  fields.forEach(field => {
    if (selectedValue === 'deceased' || selectedValue === 'divorced') {
      field.style.display = "none";
      if (field.tagName === 'INPUT') {
        field.value = '';
      }
    } else if (['father', 'stepfather', 'mother', 'stepmother'].includes(selectedValue)) {
      field.style.display = "block";
    }
  });
}

const regions = {
  "Брестская": [
    "Антополь", "Барановичи", "Белоозерск", "Береза", "Береза Картуска", "Брест", "Высокое", "Ганцевичи", 
    "Городище", "Давид-Городок", "Домачево", "Дрогичин", "Жабинка", "Иваново", "Ивацевичи", "Каменец", 
    "Кобрин", "Коссово", "Лунинец", "Ляховичи", "Малорита", "Микашевичи", "Пинск", "Пружаны", "Столин"
  ],
  "Витебская": [
    "Барань", "Бегомль", "Бешенковичи", "Богушевск", "Браслав", "Верхнедвинск", "Ветрино", "Видзы", 
    "Витебск", "Воропаево", "Глубокое", "Городок", "Дисна", "Докшицы", "Друя", "Дубровно", "Езерище", 
    "Лепель", "Лиозно", "Миоры", "Новолукомль", "Новополоцк", "Орша", "Полоцк", "Поставы", "Россоны", 
    "Сенно", "Толочин", "Ушачи", "Чашники", "Шарковщина", "Шумилино"
  ],
  "Гомельская": [
    "Белицк", "Большевик","Брагин","Буда-Кошелево","Василевичи","Васильевка","Ветка","Гомель",
    "Добруш","Ельск","Житковичи","Жлобин","Калинковичи","Корма","Лельчицы","Лоев",
    "Мозырь","Наровля","Октябрьский","Петриков","Речица","Рогачев","Светлогорск","Туров",
    "Хойники","Чечерск"
  ],
  "Гродненская": [
    "Берёзовка","Большая Берестовица","Волковыск","Вороново","Гродно","Дятлово","Желудок",
    "Зельва","Ивье","Козловщина","Кореличи","Лида","Мосты","Новогрудок","Островец","Ошмяны",
    "Свислочь","Скидель","Слоним","Сморгонь","Щучин"
  ],
  "Минская": [
    "Березино","Бобр","Борисов","Вилейка","Воложин","Городея","Дзержинск","Жодино",
    "Заславль","Зеленый Бор","Ивенец","Клецк","Копыль","Крупки","Логойск","Любань","Марьина горка",
    "Минск","Молодечно","Мядель","Несвиж","Пуховичи","Раков","Руденск","Слуцк","Смолевичи","Солигорск",
    "Старые дороги","Столбцы","Узда","Фаниполь","Червень"
  ],
  "Могилёвская": [
    "Асеньковичи","Белыничи","Бобруйск","Быхов","Глуск","Глуша","Горки","Гродзянка",
    "Елизово","Дрибин","Кировск","Климовичи","Кличев","Костюковичи","Краснополье","Кричев","Круглое",
    "Могилев","Мстиславль","Осиповичи","Славгород","Хотимск","Чаусы","Чериков","Шклов"
  ]
}

function setRegion() {
  const cityInput = document.getElementById("city");
  cityInput.removeAttribute("list");
}

function inputCity() {
  const regionInput = document.getElementById("region");
  const cityInput = document.getElementById("city");

  const cities = regions[regionInput.value] || [];

  cityInput.setAttribute("list", "city_list");

  let dataList = document.getElementById("city_list");
  if (!dataList) {
    dataList = document.createElement("datalist");
    dataList.id = "city_list";
  }
  dataList.innerHTML = '';

  cities.forEach(city => {
    const option = document.createElement("option");
    option.value = city;
    dataList.appendChild(option);
  });

  cityInput.parentNode.insertBefore(dataList, cityInput.nextSibling);
}

async function fetchOrders() {
  const response = await fetch("https://api.jsonbin.io/v3/b/6664b1e2e41b4d34e40074ee", {
    method: "GET",
    headers: {
      'X-Master-Key': '$2a$10$Hq5gKFixg3LMVqftryL4cOi9Kq1PgXDCCPezf1eQews5pxBDg2Zi.'
    }
  });
  const json = await response.json();
  return json['record'];
}

async function postOrder(data) {
  return fetch("https://api.jsonbin.io/v3/b/6664b1e2e41b4d34e40074ee", {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': '$2a$10$Hq5gKFixg3LMVqftryL4cOi9Kq1PgXDCCPezf1eQews5pxBDg2Zi.'
    },
    body: JSON.stringify(data)
  });
}

document.getElementById('dataForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const submitButton = document.getElementById('submitButton');
  const loadingSpinner = document.getElementById('loadingSpinner');
  const confirmationDialog = document.getElementById('confirmationDialog');

  submitButton.innerHTML = '<div class="loading-spinner" id="loadingSpinner">';

  const formData = new FormData(this);
  const formObj = {};
  formData.forEach((value, key) => {
    if (key === 'family') {
      const checkboxes = document.querySelectorAll(`[name="${key}"]`);
      let selectedValue = null;
  
      checkboxes.forEach((checkbox) => {
          if (checkbox.checked) {
              selectedValue = checkbox.id; // Or use checkbox.value if you want the value instead of the id
          }
      });
  
      formObj[key] = selectedValue;
  } else {
      formObj[key] = value;
    }
  });

  try {
    const orders = await fetchOrders();
    orders.students.push(formObj);
    await postOrder(orders);

    submitButton.innerHTML = 'Отправить';

    confirmationDialog.style.display = 'block';
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);

    submitButton.innerHTML = 'Отправить';

    confirmationDialog.style.display = 'block';
    alert('Ошибка при отправке данных.');
  }
});

function closeDialog() {
  document.getElementById('confirmationDialog').style.display = 'none';
}

document.getElementById('passportIDNumber').addEventListener('input', function (e) {
  let input = e.target.value.toUpperCase();
  let newValue = '';
  let regex = /^\d{0,7}[A-Z]{0,1}\d{0,3}[A-Z]{0,2}\d{0,1}$/;

  for (let i = 0; i < input.length; i++) {
    if (i < 7 && /\d/.test(input[i])) {
      newValue += input[i];
    } else if (i === 7 && /[A-Z]/.test(input[i])) {
      newValue += input[i];
    } else if (i > 7 && i < 11 && /\d/.test(input[i])) {
      newValue += input[i];
    } else if (i > 10 && i < 13 && /[A-Z]/.test(input[i])) {
      newValue += input[i];
    } else if (i === 13 && /\d/.test(input[i])) {
      newValue += input[i];
    }
  }

  e.target.value = newValue; 
  

  if (!regex.test(input)) {
    e.target.setCustomValidity('Введите идентификационный номер в правильном формате: 1111111A111AA1');
  } else {
    e.target.setCustomValidity('');
  }
});

document.getElementById('passportSerialNumber').addEventListener('input', function (e) {
  let input = e.target.value.toUpperCase();
  let newValue = '';
  let regex = /^[A-Z]{0,2}\d{0,7}$/;

  for (let i = 0; i < input.length; i++) {
    if (i < 2 && /[A-Z]/.test(input[i])) {
      newValue += input[i];
    } else if (i >= 2 && /\d/.test(input[i])) {
      newValue += input[i];
    }
  }

  e.target.value = newValue; 
  

  if (!regex.test(input)) {
    e.target.setCustomValidity('Введите номер паспорта в правильном формате: AA1234567');
  } else {
    e.target.setCustomValidity('');
  }
});

function toggleArticleField() {
  const chernobylCheckbox = document.getElementById('chernobyl');
  const articleField = document.getElementById('articleField');
  
  if (chernobylCheckbox.checked) {
    articleField.style.display = 'block';
  } else {
    articleField.style.display = 'none';
  }
}
