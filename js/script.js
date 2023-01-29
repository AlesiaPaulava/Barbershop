const API_URL = 'https://pitch-fire-somersault.glitch.me/';

/*
GET /api - получить список услуг
GET /api?service={n} - получить список барберов
GET /api?spec={n} - получить список месяца работы барбера
GET /api?spec={n}&month={n} - получить список дней работы барбера
GET /api?spec={n}&month={n}&day={n} - получить список свободных часов барбера
POST /api/order - оформить заказ
*/

//добавляем прелоуд для слайдера
const addPreload = (elem) => {
  elem.classList.add('preload')
};

const removePreload = (elem) => {
  elem.classList.remove('preload')
};

//Слайдер
const startSLider = () => {    
  const sliderItems = document.querySelectorAll('.slider__item');
  const sliderList = document.querySelector('.slider__list');
  const btnPrevSlide = document.querySelector('.slider__arrow-left');
  const btnNextSlide = document.querySelector('.slider__arrow-right');

  let activeSlide = 1;
  let positiom = 0;

  const checkSlider = () => {
    if (activeSlide + 2 === sliderItems.length &&
      document.documentElement.offsetWidth > 560 ||
      activeSlide === sliderItems.length) {
      btnNextSlide.style.display = 'none';
    } else {
      btnNextSlide.style.display = '';
    }

    if (activeSlide === 1) {
      btnPrevSlide.style.display = 'none';
    } else {
      btnPrevSlide.style.display = '';
    }
  };

    checkSlider();

  const nextSlide = () => {
    sliderItems[activeSlide]?.classList.remove('slider__item-active');
    position = -sliderItems[0].clientWidth * activeSlide;

    sliderList.style.transform = `translateX(${position}px)`;
    activeSlide +=1;
    sliderItems[activeSlide]?.classList.add('slider__item-active');
    checkSlider();
  };

  const PrevSlide = () => {
    sliderItems[activeSlide]?.classList.remove('slider__item-active');
    position = -sliderItems[0].clientWidth * (activeSlide - 2);

    sliderList.style.transform = `translateX(${position}px)`;
    activeSlide -=1;
    sliderItems[activeSlide]?.classList.add('slider__item-active');
    checkSlider();
  };

  btnPrevSlide.addEventListener('click', PrevSlide);
  btnNextSlide.addEventListener('click', nextSlide);

  window.addEventListener('resize', () => {
    if (activeSlide +2 > sliderItems.length &&
      document.documentElement.offsetWidth > 560) {
        activeSlide = sliderItems.length - 2;
        sliderItems[activeSlide]?.classList.add('slider__item-active');
      }

    position = -sliderItems[0].clientWidth * (activeSlide - 1);
    sliderList.style.transform = `translateX(${position}px)`;
  })
};

const initSlider = () => {
  const slider = document.querySelector('.slider');
  const sliderContainer = document.querySelector('.slider__container');

  sliderContainer.style.display = 'none';
  addPreload(slider);

  window.addEventListener('load', () => {
    sliderContainer.style.display = '';
    removePreload(slider);

    startSLider();
  });
};


//Подключение прайса через api
//передаем данные в прайс
const renderPrice = (wrapper, data) => {             
  data.forEach((item) => {
    //создали li элемент
    const priceItem = document.createElement('li'); 
    //добавили класс price__item  
    priceItem.classList.add('price__item');           

    //в li вставили span
    priceItem.innerHTML = `                                 
      <span class="price__item-title">${item.name}</span>
      <span class="price__item-count">${item.price} руб</span>
    `;
    //вставляем в li прайс
    wrapper.append(priceItem);       
  });
};

const renderService = (wrapper, data) => {
  //создаем элемент label
  const labels = data.map(item => {
    const label = document.createElement('label')
    //добавили класс radio
    label.classList.add('radio')
    label.innerHTML = `
      <input class="radio__input" type="radio" name="service" value = "${item.id}">
      <span class="radio__label">${item.name}</span>
      `;
    //возвращаем переменную label, что бы она попала в labels
    return label;
  });

  //появление перечня услуг в Услуга
  wrapper.append(...labels);
};

const initService = () => {
  const priceList = document.querySelector('.price__list');
  const reserveFieldsetService = document.querySelector('.reserve__fieldset-service')
  //удаляем текст из прайса
  priceList.textContent = '';    
  //вешаем прелоудер на прайс                 
  addPreload(priceList);  

  //перезапсываем legend и удаляем чекбоксы из раздела Услуга
  reserveFieldsetService.innerHTML =' <legend class="reserve__legend">Услуга</legend>';
  //вешаем прелоудер на Услуга                
  addPreload(reserveFieldsetService); 

 //берем данные из api json для прайса
  fetch(`${API_URL}/api`)                                
    .then(response => response.json())
    .then(data => {
      renderPrice(priceList, data);
      //удаляем прелоуд после загрузки
      removePreload(priceList); 
      //передаем данные дальне для их использование в другом месте
      return data;
    })
    .then(data => {
      renderService(reserveFieldsetService, data)
      //удаляем прелоуд после загрузки
      removePreload(reserveFieldsetService); 
      //передаем данные дальне для их использование в другом месте
      return data;
    })
};

//функция перебирает массив и делает неактивной(disabled)
const addDisabled = (arr) => {
  arr.forEach(elem => {
    elem.disabled = true;
  })
};

//функция перебирает массив и удаляет disabled
const removeDisabled = (arr) => {
  arr.forEach(elem => {
    elem.disabled = false;
  })
}

const renderSpec = (wrapper, data) => {
  //создаем элемент label
  const labels = data.map((item) => {
    const label = document.createElement('label')
    //добавили класс radio
    label.classList.add('radio');
    //вставляем разметку и подключаем фото специалистов
    label.innerHTML = `
    <input class="radio__input" type="radio" name="spec" value = "${item.id}">
    <span class="radio__label radio__label-spec" style="--bg-image: url(${API_URL}${item.img})">${item.name}</span>
      `;
    //возвращаем переменную label, что бы она попала в labels
    return label;
  });

  //появление перечня услуг в Услуга
  wrapper.append(...labels);

}

const renderMonth = (wrapper, data) => {
  //создаем элемент label
  const labels = data.map((month) => {
    const label = document.createElement('label');
    //добавили класс radio
    label.classList.add('radio');
    //вставляем разметку и формат даты
    label.innerHTML = `
      <input class="radio__input" type="radio" name="month" value="${month}">
      <span class="radio__label">${new Intl.DateTimeFormat('ru-RU', {
      month: 'long'
    }).format(new Date(month))}</span>   
    `;
    //возвращаем переменную label, что бы она попала в labels
    return label;    
  });
  //появление перечня услуг в Услуга
  wrapper.append(...labels);
};

const renderDay = (wrapper, data, month) => {
  //создаем элемент label
  const labels = data.map((day) => {
    const label = document.createElement('label');
    //добавили класс radio
    label.classList.add('radio');
    //вставляем разметку и формат даты
    label.innerHTML = `
      <input class="radio__input" type="radio" name="day" value="${day}">
      <span class="radio__label">${new Intl.DateTimeFormat('ru-RU', {
      month: 'long', day: 'numeric'
    }).format(new Date(`${month}/${day}`))}</span>   
    `;
    //возвращаем переменную label, что бы она попала в labels
    return label;    
  });
  //появление перечня услуг в Услуга
  wrapper.append(...labels);
};

const renderTime = (wrapper, data) => {
  //создаем элемент label
  const labels = data.map((time) => {
    const label = document.createElement('label');
    //добавили класс radio
    label.classList.add('radio');
    //вставляем разметку 
    label.innerHTML = `
      <input class="radio__input" type="radio" name="time" value="${time}">
      <span class="radio__label">${time}</span>   
    `;
    //возвращаем переменную label, что бы она попала в labels
    return label;    
  });
  //появление перечня услуг в Услуга
  wrapper.append(...labels);
}

const initReserve = () => {
  const reserveForm = document.querySelector('.reserve__form');
  //диструктивное присвоение
  const {fieldservice, fieldspec, fielddata, fieldmonth, fieldday, fieldtime, btn} = 
    reserveForm;
 
  //добавляем disabled (неактивность)
  addDisabled([fieldspec, fielddata, fieldmonth, fieldday, fieldtime, btn]);
  
  //обработчик события, смотрит прошло ли изменение внутри формы
  reserveForm.addEventListener('change', async event => {
    const target = event.target;
    

    if (target.name === 'service') {
      addDisabled([fieldspec, fielddata, fieldmonth, fieldday, fieldtime, btn]);
      fieldspec.innerHTML = '<legend class="reserve__legend">Специалист</legend>';
      //вешаем прелоудер на Специалист                
      addPreload(fieldspec);
  
      const response = await fetch(`${API_URL}/api?service=${target.value}`);
      //вытаскиваем данные с json
      const data = await response.json();

      //почистить renderSpec
      renderSpec(fieldspec, data);
      removePreload(fieldspec);
      removeDisabled([fieldspec]);
    }

    if (target.name === 'spec') {
      addDisabled([fielddata, fieldmonth, fieldday, fieldtime, btn]);
      
      //вешаем прелоудер на Специалист                
      addPreload(fieldmonth);
  
      const response = await fetch(`${API_URL}/api?spec=${target.value}`);
      //вытаскиваем данные с json
      const data = await response.json();
      //очищаем элементы месяц
      fieldmonth.textContent = '';

      //почистить renderMonth
      renderMonth(fieldmonth, data);
      removePreload(fieldmonth);
      removeDisabled([fielddata, fieldmonth]);
    }

    if (target.name === 'month') {
      addDisabled([fieldday, fieldtime, btn]);
      
      //вешаем прелоудер на Специалист                
      addPreload(fieldday);
  
      const response = await fetch(`${API_URL}/api?spec=${reserveForm.spec.value}&month=${reserveForm.month.value}`);
      //вытаскиваем данные с json
      const data = await response.json();
      //очищаем элементы день
      fieldday.textContent = '';

      //почистить renderDay
      renderDay(fieldday, data, reserveForm.month.value);
      removePreload(fieldday);
      removeDisabled([fieldday]);
    };

    if (target.name === 'day') {
      addDisabled([fieldtime, btn]);
      
      //вешаем прелоудер на Специалист                
      addPreload(fieldtime);
  
      const response = await fetch(`${API_URL}/api?spec=${reserveForm.spec.value}&month=${reserveForm.month.value}&day=${target.value}`);
      //вытаскиваем данные с json
      const data = await response.json();
      //очищаем элементы время
      fieldtime.textContent = '';

      //почистить renderTime
      renderTime(fieldtime, data);
      removePreload(fieldtime);
      removeDisabled([fieldtime]);
    };

    if (target.name === 'time') {
      //разблокировка кнопки Записаться
     removeDisabled([btn]);
    };
  });

  //отправка формы на почту
  reserveForm.addEventListener('submit', async (e) => {
    //отмена перезагрузки страницы при отправке 
    e.preventDefault();

    //формируем хранилище для данных из формы
    const formData = new FormData(reserveForm);
    //приводим объект в json формат
    const json = JSON.stringify(Object.fromEntries(formData));
    //отправляем на сервер
    const response = await fetch(`${API_URL}api/order`, {
      method: 'post',
      body: json,
    });

    //ответ от сервера
    const data = await response.json();
     //заблокируем полностью форму
     addDisabled([
      fieldservice, 
      fieldspec, 
      fielddata, 
      fieldmonth, 
      fieldday, 
      fieldtime, 
      btn]);
      //сообщение после отправки Записи на сервер
      const saccess = document.createElement('p');
      //стилизовать сообщение добавив класс
      saccess.classList.add('servise__saccess');
      saccess.textContent = `
        Спасибо за бронь #${data.id}!
        Ждем Вас ${new Intl.DateTimeFormat('ru-RU', {
          month: 'long',
          day: 'numeric',
        }).format(new Date(`${data.month}/${data.day}`))},
        время ${data.time}
      `;

      //добавляем в reserveForm saccess
      reserveForm.append(saccess);

  });
};

const init = () => {
  initSlider();
  initService();
  initReserve();
};

window.addEventListener('DOMContentLoaded', init);

