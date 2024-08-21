'use strict'

const addDialog = document.getElementsByClassName('addDialog')[0];
const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

const fileBtn = document.getElementsByName('file')[0];
fileBtn.addEventListener('change', function (e) {
    let file = this.files[0];
    this.nextElementSibling.innerHTML = file.name;
});

function applyFile() {
    let file = fileBtn.files[0];
    if (file) {
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function () {
            localStorage.setItem('habits', JSON.stringify(JSON.parse(reader.result).habits) || JSON.stringify([]));
            localStorage.setItem('actions', JSON.stringify(JSON.parse(reader.result).actions) || JSON.stringify([]));
            localStorage.setItem('history', JSON.stringify(JSON.parse(reader.result).history) || JSON.stringify([]));
            renderHabits();
        };
    };
};

let btnToCreate = document.getElementsByClassName('addDialog__create-btn')[0];
btnToCreate.addEventListener('click', function (e) {
    this.parentNode.classList.toggle('addDialog__content--closed');
    this.parentNode.nextElementSibling.classList.toggle('addDialog__content--closed');
});

let btnToLibrary = document.getElementsByClassName('addDialog__back-btn')[0];
btnToLibrary.addEventListener('click', function (e) {
    this.parentNode.classList.toggle('addDialog__content--closed');
    this.parentNode.previousElementSibling.classList.toggle('addDialog__content--closed');
});

let createForm = document.forms.createForm;
createForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let habitsList = JSON.parse(localStorage.getItem('habits'));
    let historyList = JSON.parse(localStorage.getItem('history'));
    let NewId = 1;
    habitsList.forEach(item => {
        if (item.id >= NewId) {
            NewId = item.id + 1;
        }
    })
    historyList.forEach(item => {
        if (item.id >= NewId) {
            NewId = item.id + 1;
        }
    })
    let construtor = {
        id: NewId,
        title: createForm.title.value,
        category: createForm.category.value,
        addDate: new Date(),
        period: createForm.period.value,
    }
    if (createForm.targetValue.value) {
        construtor.targetValue = createForm.targetValue.value;
    }
    habitsList.push(construtor);
    localStorage.setItem('habits', JSON.stringify(habitsList));
    renderHabits();
    addDialog.close()
})

function deleteHabit(id, isInHistory = false) {
    let deleteDialog = document.getElementsByClassName('deleteDialog')[0];
    if (isInHistory) {
        deleteDialog.innerHTML = `
        <input type="button" value="Удалить привычку с историей" onclick="deleteHabitWithHistory(${id})">
        <input type="button" value="Отмена" onclick="this.parentNode.close()">`
    } else {
        deleteDialog.innerHTML = `
        <input type="button" value="Удалить привычку с историей" onclick="deleteHabitWithHistory(${id})">
        <input type="button" value="Прекратить отслеживание привычки" onclick="stopTracking(${id})">
        <input type="button" value="Отмена" onclick="this.parentNode.close()">
        `
    }
    deleteDialog.showModal();
}

function deleteHabitWithHistory(id) {
    let habitsList = JSON.parse(localStorage.getItem('habits'));
    let actionsList = JSON.parse(localStorage.getItem('actions'));
    let historyList = JSON.parse(localStorage.getItem('history'));
    habitsList = habitsList.filter(item => item.id != id);
    historyList = historyList.filter(item => item.id != id);
    actionsList = actionsList.filter(item => item.id != id);
    localStorage.setItem('habits', JSON.stringify(habitsList));
    localStorage.setItem('actions', JSON.stringify(actionsList));
    localStorage.setItem('history', JSON.stringify(historyList));
    console.log(historyList);
    document.getElementsByClassName('deleteDialog')[0].close();
    renderHabits();
}

function stopTracking(id) {
    let habitsList = JSON.parse(localStorage.getItem('habits'));
    let historyList = JSON.parse(localStorage.getItem('history'));
    let habit = habitsList.findIndex(item => item.id == id);
    historyList.push(habitsList[habit]);
    habitsList.splice(habit, 1);
    localStorage.setItem('habits', JSON.stringify(habitsList));
    localStorage.setItem('history', JSON.stringify(historyList));
    document.getElementsByClassName('deleteDialog')[0].close();
    renderHabits();
}

function resumeHabit(id) {
    let historyList = JSON.parse(localStorage.getItem('history'));
    let habitsList = JSON.parse(localStorage.getItem('habits'));
    let habit = historyList.findIndex(item => item.id == id);
    habitsList.push(historyList[habit]);
    historyList.splice(habit, 1);
    localStorage.setItem('habits', JSON.stringify(habitsList));
    localStorage.setItem('history', JSON.stringify(historyList));
    document.getElementsByClassName('deleteDialog')[0].close();
    renderHabits();
}

let now = new Date();
now.setHours(0, -now.getTimezoneOffset(), 0, 0);
function changeTime() {
    if (document.getElementsByName('now')[0].value) {
        now = new Date(document.getElementsByName('now')[0].value);
        renderHabits();
    }
}

function checkDate(date, period) {
    date.setHours(0, -now.getTimezoneOffset(), 0, 0);
    let dateEnd = new Date(date);
    dateEnd.setDate(date.getDate() + 1);
    if (period == 'weekly') {
        date.setDate(date.getDate() - date.getDay() + 1);
        dateEnd.setDate(date.getDate() + 7);
    } else if (period == 'monthly') {
        date.setDate(1);
        dateEnd.setMonth(date.getMonth() + 1);
        dateEnd.setDate(1);
    }
    return (now - date >= 0 && dateEnd - now > 0);
}

function markHabit(id) {
    let actionsList = JSON.parse(localStorage.getItem('actions'));
    let habitsList = JSON.parse(localStorage.getItem('habits'));
    if (document.getElementById(`habit${id}`).getElementsByClassName('habit__mark')[0].classList.contains('habit__mark--checked')) {
        let habit = habitsList.find(element => element.id == id);
        actionsList = actionsList.filter(item => item.id != id || (item.id == id && !checkDate((new Date(item.date)), habit.period)));
    } else if (document.getElementById(`habit${id}__number`)) {
        let habit = habitsList.find(element => element.id == id);
        actionsList = actionsList.filter(item => item.id != id || (item.id == id && !checkDate((new Date(item.date)), habit.period)));
        if (document.getElementById(`habit${id}`).getElementsByClassName('habit__number')[0].value) {
            actionsList.push({
                id: id,
                date: now,
                value: document.getElementById(`habit${id}`).getElementsByClassName('habit__number')[0].value,
            })
        }
    } else {
        actionsList.push({
            id: id,
            date: now,
        })
    }
    localStorage.setItem('actions', JSON.stringify(actionsList));
    renderHabits();
}

function renderHabits() {
    let habitsPresentation = document.getElementsByClassName('habits-list')[0];
    if (localStorage.getItem('habits')) {
        habitsPresentation.innerHTML = ''
        let habitsList = JSON.parse(localStorage.getItem('habits'));
        let date;
        habitsList.forEach(item => {
            date = new Date(item.addDate);
            date.setHours(0, -date.getTimezoneOffset(), 0, 0);
            habitsPresentation.insertAdjacentHTML('afterbegin', `
        <div class="habits-list__item habit" id="habit${item.id}">
                    <div class="habit__row">
                        <h3 class="habit__name">${item.title}</h3>
                        <div class="habit__actions">
                            <span>с ${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}.${date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}.${date.getFullYear()}</span>
                            <input class="habit__acions-open" type="button" value="⋮"
                                onclick="this.nextElementSibling.style.opacity = -this.nextElementSibling.style.opacity + 1">
                            <ul class="habit__actions-menu">
                                <li><input type="button" value="Редактировать" onclick="editHabit(${item.id})"></li>
                                <li><input type="button" value="Удалить" onclick="deleteHabit(${item.id})"></li>
                            </ul>
                        </div>
                    </div>
                    <p class="habit__category">${item.category.toLowerCase()}</p>
                    <p class="habit__regularity">${item.period == 'weekly' ? 'еженедельно' : item.period == 'monthly' ? 'ежемесячно' : 'ежедневно'}</p>
                    <div class="habit__row">
                        <p class="habit__duration"><b>0</b> <span></span></p>
                        <div class="habit__row-wrapper">
                            <input class="habit__mark" type="button" value="&#160;" onclick="markHabit(${item.id})">
                        </div>
                    </div >
                    <button class="habit__info-open"  onclick="openInfo(this.nextElementSibling, ${item.id})">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                        width="1.5rem" height="1.5rem" viewBox="-4.5 0 20 20" version="1.1">
                        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="Dribbble-Light-Preview" transform="translate(-305.000000, -6679.000000)"
                                fill="#000000">
                                <g id="icons" transform="translate(56.000000, 160.000000)">
                                    <path
                                        d="M249.365851,6538.70769 L249.365851,6538.70769 C249.770764,6539.09744 250.426289,6539.09744 250.830166,6538.70769 L259.393407,6530.44413 C260.202198,6529.66364 260.202198,6528.39747 259.393407,6527.61699 L250.768031,6519.29246 C250.367261,6518.90671 249.720021,6518.90172 249.314072,6519.28247 L249.314072,6519.28247 C248.899839,6519.67121 248.894661,6520.31179 249.302681,6520.70653 L257.196934,6528.32352 C257.601847,6528.71426 257.601847,6529.34685 257.196934,6529.73759 L249.365851,6537.29462 C248.960938,6537.68437 248.960938,6538.31795 249.365851,6538.70769"
                                        id="arrow_right">
                                    </path>
                                </g>
                            </g>
                        </g>
                    </svg>
                </button>
                <div class="habit__info toggle-element">
                        <div class="habit__calendar-wrapper">
                            <div class="habit__calendar"></div>
                        </div>
                        <div class="habit__day-info">
                            <p>20 сентября</p>
                        </div>
                    </div>
                </div>`);
            if (item.targetValue) {
                let numWrapper = document.getElementById(`habit${item.id}`).getElementsByClassName('habit__row-wrapper')[0];
                numWrapper.insertAdjacentHTML('afterbegin', `<input class="habit__number" id="habit${item.id}__number" type="number" 
                    onfocus="this.classList.remove('habit__number--checked');this.nextElementSibling.classList.remove('habit__mark--checked');">`)
                numWrapper.insertAdjacentHTML('afterbegin', `<p>цель: ${item.targetValue}</p>`)
            }
        });
        renderHistory(JSON.parse(localStorage.getItem('history')));
        renderActions(habitsList);
    } else {
        localStorage.setItem('habits', JSON.stringify([]));
        localStorage.setItem('actions', JSON.stringify([]));
        localStorage.setItem('history', JSON.stringify([]));
    }
}

function renderHistory(historyList) {
    let date;
    if (document.getElementsByClassName('history-list')[0]) {
        document.getElementsByClassName('history-list')[0].remove()
    };
    if (historyList.length) {
        document.getElementsByClassName('main__container')[0].insertAdjacentHTML('beforeend', '<section class="history-list"><h2>Завершенные привычки</h2></section>');
    }
    let historyPresentation = document.getElementsByClassName('history-list')[0];
    historyList.forEach(item => {
        date = new Date(item.addDate);
        date.setHours(0, -date.getTimezoneOffset(), 0, 0);
        historyPresentation.insertAdjacentHTML('beforeend', `
        <div class="habits-list__item habit" id="habit${item.id}">
                    <div class="habit__row">
                        <h3 class="habit__name">${item.title}</h3>
                        <div class="habit__actions">
                            <span>с ${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}.${date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}.${date.getFullYear()}</span>
                            <input class="habit__acions-open" type="button" value="⋮"
                                onclick="this.nextElementSibling.style.opacity = -this.nextElementSibling.style.opacity + 1">
                            <ul class="habit__actions-menu">
                                <li><input type="button" value="Возобновить" onclick="resumeHabit(${item.id})"></li>
                                <li><input type="button" value="Редактировать" onclick="editHabit(${item.id})"></li>
                                <li><input type="button" value="Удалить" onclick="deleteHabit(${item.id}, true)"></li>
                            </ul>
                        </div>
                    </div>
                    <p class="habit__category">${item.category.toLowerCase()}</p>
                    <p class="habit__regularity">${item.period == 'weekly' ? 'еженедельно' : item.period == 'monthly' ? 'ежемесячно' : 'ежедневно'}</p>
                    <div class="habit__row">
                        <p class="habit__duration"><b>0</b> <span></span></p>
                    </div >
                    <button class="habit__info-open"  onclick="openInfo(this.nextElementSibling, ${item.id})">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                        width="1.5rem" height="1.5rem" viewBox="-4.5 0 20 20" version="1.1">
                        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="Dribbble-Light-Preview" transform="translate(-305.000000, -6679.000000)"
                                fill="#000000">
                                <g id="icons" transform="translate(56.000000, 160.000000)">
                                    <path
                                        d="M249.365851,6538.70769 L249.365851,6538.70769 C249.770764,6539.09744 250.426289,6539.09744 250.830166,6538.70769 L259.393407,6530.44413 C260.202198,6529.66364 260.202198,6528.39747 259.393407,6527.61699 L250.768031,6519.29246 C250.367261,6518.90671 249.720021,6518.90172 249.314072,6519.28247 L249.314072,6519.28247 C248.899839,6519.67121 248.894661,6520.31179 249.302681,6520.70653 L257.196934,6528.32352 C257.601847,6528.71426 257.601847,6529.34685 257.196934,6529.73759 L249.365851,6537.29462 C248.960938,6537.68437 248.960938,6538.31795 249.365851,6538.70769"
                                        id="arrow_right">
                                    </path>
                                </g>
                            </g>
                        </g>
                    </svg>
                </button>
                <div class="habit__info toggle-element">
                        <div class="habit__calendar-wrapper">
                            <div class="habit__calendar"></div>
                        </div>
                    </div>
                </div>`);
    });
}

function renderActions(habitsList) {
    let habit;
    let historyList = JSON.parse(localStorage.getItem('history'));
    let actionsList = JSON.parse(localStorage.getItem('actions'));
    actionsList.forEach(item => {
        habit = habitsList.find(element => element.id == item.id) || historyList.find(element => element.id == item.id);
        if (habit) {
            let runtime;
            if (+habit.targetValue > +item.value) {
                runtime = document.getElementById(`habit${habit.id}`).getElementsByClassName('habit__duration')[0].firstElementChild.innerHTML;
            } else {
                runtime = ++document.getElementById(`habit${habit.id}`).getElementsByClassName('habit__duration')[0].firstElementChild.innerHTML;
            }
            if (habit.period == 'daily') {
                document.getElementById(`habit${habit.id}`).getElementsByClassName('habit__duration')[0].lastElementChild.innerHTML = runtime % 100 < 15 && runtime % 100 > 10 ? 'дней' : runtime % 10 == 1 ? 'день' : runtime % 10 < 5 && runtime % 10 != 0 ? 'дня' : 'дней';
            } else if (habit.period == 'weekly') {
                document.getElementById(`habit${habit.id}`).getElementsByClassName('habit__duration')[0].lastElementChild.innerHTML = runtime % 100 < 15 && runtime % 100 > 10 ? 'недель' : runtime % 10 == 1 ? 'неделя' : runtime % 10 < 5 && runtime % 10 != 0 ? 'недели' : 'дней';
            } else {
                document.getElementById(`habit${habit.id}`).getElementsByClassName('habit__duration')[0].lastElementChild.innerHTML = runtime % 100 < 15 && runtime % 100 > 10 ? 'месяцев' : runtime % 10 == 1 ? 'месяц' : runtime % 10 < 5 && runtime % 10 != 0 ? 'месяца' : 'дней';
            }
            if (!(historyList.find(element => element.id == item.id)) && checkDate((new Date(item.date)), habit.period)) {
                if (item.value) {
                    document.getElementById(`habit${item.id}__number`).value = item.value;
                    document.getElementById(`habit${item.id}__number`).classList.add('habit__number--checked')
                }
                if (!item.value || +item.value >= +habit.targetValue) {
                    document.getElementById(`habit${item.id}`).getElementsByClassName('habit__mark')[0].classList.add('habit__mark--checked');
                }
            }
        }
    });
}

function dateClick(info) {
    alert(info.dateStr);
}

function openInfo(element, id) {
    if (document.getElementsByClassName('toggle-element-active')[0]) {
        slideToggle(document.getElementsByClassName('toggle-element-active')[0], 380);
    }
    let habitsList = JSON.parse(localStorage.getItem('habits'));
    let historyList = JSON.parse(localStorage.getItem('history'));
    let habit = habitsList.find(item => item.id == id) || historyList.find(item => item.id == id)
    let calendar = new FullCalendar.Calendar(element.getElementsByClassName('habit__calendar')[0], {
        locale: 'ru',
        firstDay: 1,
        height: 'auto',
        initialDate: now,
        eventBackgroundColor: '#9195F6',
        headerToolbar: {
            start: 'title',
            center: '',
            end: 'prev,next',
        },

    });
    slideToggle(element);
    calendar.gotoDate(now.toISOString().substring(0, 10));
    calendar.addEvent({
        title: 'Сегодня',
        start: now.toISOString().substring(0, 10),
        allDay: true,
        backgroundColor: '#B7C9F2',
        borderColor: '#B7C9F2',
        textColor: '#000000',
    });

    addEvents(calendar, habit);
    if (document.getElementById(`habit${id}`).getElementsByClassName('habit__mark')[0].classList.contains('habit__mark--checked')) {
        document.getElementById(`habit${id}`).getElementsByClassName('habit__day-info')[0].innerHTML = `
        <p class="habit__selected-day">${now.getDate()} ${monthNames[now.getMonth()]}</p>
        <p class="habit__day-info">в этот день привычка была отмечена как выполненная</p>`
    } else {
        document.getElementById(`habit${id}`).getElementsByClassName('habit__day-info')[0].innerHTML = `
        <p class="habit__selected-day">${now.getDate()} ${monthNames[now.getMonth()]}</p>
        <p class="habit__day-info">в этот день привычка не была отмечена как выполненная</p>`
    }
    calendar.render();
}

function addEvents(calendar, habit) {
    let actionsList = JSON.parse(localStorage.getItem('actions'));
    calendar.on('dateClick', function (info) {
        let date = new Date(info.dateStr);
        date.setHours(0, -date.getTimezoneOffset(), 0, 0);
        let action = actionsList.find(item => item.id == habit.id && item.date.substring(0, 10) == info.dateStr);
        if (action && (!action.value || +action.value >= +habit.targetValue)) {
            document.getElementById(`habit${habit.id}`).getElementsByClassName('habit__day-info')[0].innerHTML = `
            <p class="habit__selected-day">${date.getDate()} ${monthNames[date.getMonth()]}</p>
            <p class="habit__day-info">в этот день привычка была отмечена как выполненная</p>`
        } else {
            document.getElementById(`habit${habit.id}`).getElementsByClassName('habit__day-info')[0].innerHTML = `
            <p class="habit__selected-day">${date.getDate()} ${monthNames[date.getMonth()]}</p>
            <p class="habit__day-info">в этот день привычка не была отмечена как выполненная</p>`
        }
        if (action && action.value) {
            document.getElementById(`habit${habit.id}`).getElementsByClassName('habit__day-info')[0].insertAdjacentHTML('beforeend', `<p class="habit__day-info">Вы установили отметку <span>${action.value}</span></p>`)
        }
    });
    actionsList.forEach(item => {
        if (item.id == habit.id && (!item.value || +item.value >= +habit.targetValue)) {
            let dateStart = new Date(item.date);
            dateStart.setHours(0, -now.getTimezoneOffset(), 0, 0);
            let dateEnd = new Date(dateStart);
            dateEnd.setDate(dateStart.getDate() + 1);
            if (habit.period == 'weekly') {
                dateStart.setDate(dateStart.getDate() - dateStart.getDay() + 1);
                dateEnd.setDate(dateStart.getDate() + 7);
            } else if (habit.period == 'monthly') {
                dateStart.setDate(1);
                dateEnd.setMonth(dateStart.getMonth() + 1);
                dateEnd.setDate(1);
            }
            let newEvent = {
                start: dateStart.toISOString().substring(0, 10),
                end: dateEnd.toISOString().substring(0, 10),
                display: 'background',
            };
            if (item.value) {
                newEvent.value = item.value;
            }
            calendar.addEvent(newEvent);
        }
    });
}

renderHabits();