document.addEventListener('DOMContentLoaded', (event) => {
  for (let year = 1940; year <= 2024; year++) {
    let options = document.createElement("OPTION");
    options.innerHTML = year;
    options.value = year;
    document.getElementById("year").appendChild(options);
  }

  for (let day = 1; day <= 31; day++) {
    let options = document.createElement("OPTION");
    let dayValue = String(day).padStart(2, '0');
    options.innerHTML = day;
    options.value = dayValue;
    document.getElementById("day").appendChild(options);
  }
});

function toggleFields(parentId) {
  const selectElement = document.getElementById(parentId).querySelector('select');
  const selectedValue = selectElement.value;

  const fields = document.getElementById(parentId).querySelectorAll('.fullName, .job, .position, .phoneNumber');

  fields.forEach(field => {
    if (selectedValue === 'deceased') {
      field.style.display = 'none';
      const input = field.querySelector('input');
      if (input) input.value = '';  
    } else {
      field.style.display = 'block';
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
  document.getElementById("city").removeAttribute("list");
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

document.getElementById('dataForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const submitButton = document.getElementById('submitButton');
  const confirmationDialog = document.getElementById('confirmationDialog');
  const documentType = document.getElementById('documentType').value;
  
  toggleLoadingState(submitButton, true);

  const formData = new FormData(event.target);
  const formObj = buildFormObject(formData);

  try {
    const orders = await fetchOrders();
    orders.students.push(formObj);
    
    // Post updated orders
    await postOrder(orders);

    toggleLoadingState(submitButton, false);
    showConfirmation(confirmationDialog);
  } catch (error) {
    console.error('Error during fetch operation:', error);
    toggleLoadingState(submitButton, false);
    alert('Ошибка при отправке данных.');
  }
});

function toggleLoadingState(button, isLoading) {
  button.innerHTML = isLoading ? '<div class="loading-spinner" id="loadingSpinner"></div>' : 'Отправить';
}

function showConfirmation(dialog) {
  dialog.style.display = 'block';
}

function buildFormObject(formData) {
  const formObj = {};

  const brsm = document.getElementById('brsm');
  formObj['brsm'] = brsm.checked ? 'Состою' : 'Не состою';

  const chernobyl = document.getElementById('chernobyl');
  formObj['chernobyl'] = chernobyl.checked ? 'Являюсь ' : 'Не являюсь';

  formData.forEach((value, key) => {
    if (key === 'brsm' || key === 'chernobyl') {
      return;
    } else if (key === 'family') {
      formObj[key] = getSelectedFamilyValue(key);
    } else if (key === 'article') {
      if (formObj['chernobyl'] === 'Являюсь ') {
        formObj['chernobyl'] += `Ст: ${value}`;
      }
    } else if (key === 'passportSerialNumber') {
      formObj[key] = `(${documentType})\n${value}`;
    } else {
      formObj[key] = value;
    }
  });

  return formObj;
}

function getSelectedFamilyValue(key) {
  const checkboxes = document.querySelectorAll(`[name="${key}"]`);
  let selectedValue = null;

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedValue = checkbox.id;
    }
  });

  return selectedValue;
}

function closeDialog() {
  document.getElementById('confirmationDialog').style.display = 'none';
}

function handleInputFormatting(inputElement, regexPattern, formatMessage, formatRules) {
  inputElement.addEventListener('input', function (e) {
    const input = e.target.value.toUpperCase();
    let formattedValue = '';

    for (let i = 0; i < input.length; i++) {
      if (formatRules(i, input[i])) {
        formattedValue += input[i];
      }
    }

    e.target.value = formattedValue;

    if (!regexPattern.test(formattedValue)) {
      e.target.setCustomValidity(formatMessage);
    } else {
      e.target.setCustomValidity('');
    }
  });
}

function passportIDNumberRules(index, char) {
  return (
    (index < 7 && /\d/.test(char)) ||
    (index === 7 && /[A-Z]/.test(char)) ||
    (index > 7 && index < 11 && /\d/.test(char)) ||
    (index > 10 && index < 13 && /[A-Z]/.test(char)) ||
    (index === 13 && /\d/.test(char))
  );
}

function passportSerialNumberRules(index, char) {
  return (index < 2 && /[A-Z]/.test(char)) || (index >= 2 && /\d/.test(char));
}

handleInputFormatting(
  document.getElementById('passportIDNumber'),
  /^\d{0,7}[A-Z]{0,1}\d{0,3}[A-Z]{0,2}\d{0,1}$/,
  'Введите идентификационный номер в правильном формате: 1111111A111AA1',
  passportIDNumberRules
);

handleInputFormatting(
  document.getElementById('passportSerialNumber'),
  /^[A-Z]{0,2}\d{0,7}$/,
  'Введите номер паспорта в правильном формате: AA1234567',
  passportSerialNumberRules
);

handleInputFormatting(
  document.getElementById('idCardIDNumber'),
  /^\d{0,7}[A-Z]{0,1}\d{0,3}[A-Z]{0,2}\d{0,1}$/,
  'Введите идентификационный номер в правильном формате: 1111111A111AA1',
  passportIDNumberRules
);

handleInputFormatting(
  document.getElementById('idCardNumber'),
  /^[A-Z]{0,2}\d{0,7}$/,
  'Введите номер паспорта в правильном формате: AA1234567',
  passportSerialNumberRules
);


function toggleArticleField() {
  const chernobylCheckbox = document.getElementById('chernobyl');
  const articleField = document.getElementById('articleField');
  
  if (chernobylCheckbox.checked) {
    articleField.style.display = 'block';
  } else {
    articleField.style.display = 'none';
  }
}

document.getElementById('documentType').addEventListener('change', function() {
  var documentType = this.value;
  if (documentType === 'Паспорт') {
      document.getElementById('passportFields').style.display = 'block';
      document.getElementById('idCardFields').style.display = 'none';
  } else if (documentType === 'ID карта') {
      document.getElementById('passportFields').style.display = 'none';
      document.getElementById('idCardFields').style.display = 'block';
  }
});
