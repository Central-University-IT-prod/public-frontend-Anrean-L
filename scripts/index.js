'use strict'

const addDialog = document.getElementsByClassName('add-dialog')[0];
const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

let now = new Date();
now.setHours(0, -now.getTimezoneOffset(), 0, 0);
document.getElementsByName('now')[0].value = now.toISOString().substring(0, 10);
function changeTime() {
    if (document.getElementsByName('now')[0].value) {
        now = new Date(document.getElementsByName('now')[0].value);
        renderHabits();
    }
}

const fileBtn = document.getElementsByName('file')[0];
fileBtn.addEventListener('change', function (e) {
    let file = this.files[0];
    this.previousElementSibling.innerHTML = file.name;
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

function addDialogToggle() {
    let width = document.getElementsByClassName('add-dialog')[0].offsetWidth;
    document.getElementsByClassName('add-dialog')[0].setAttribute('style', 'width:' + (width - 38) + 'px');;
    document.getElementsByClassName('add-dialog__library')[0].classList.toggle('add-dialog__content--closed');
    document.getElementsByClassName('add-dialog__new')[0].classList.toggle('add-dialog__content--closed');
};

let createForm = document.forms.createForm;
createForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let habitsList = JSON.parse(localStorage.getItem('habits'));
    let historyList = JSON.parse(localStorage.getItem('history'));
    let newId = 1;
    habitsList.forEach(item => {
        if (+item.id >= newId) {
            newId = +item.id + 1;
        }
    })
    historyList.forEach(item => {
        if (+item.id >= newId) {
            newId = +item.id + 1;
        }
    })
    if (createForm.dataset.id) {
        newId = createForm.dataset.id;
        habitsList = habitsList.filter(item => item.id != newId);
    }
    let newHabit = {
        id: newId,
        title: createForm.title.value,
        category: createForm.category.value,
        addDate: now,
        period: createForm.period.value,
    }
    if (createForm.targetValue.value) {
        newHabit.targetValue = createForm.targetValue.value;
    }
    habitsList.push(newHabit);
    localStorage.setItem('habits', JSON.stringify(habitsList));
    renderHabits();
    addDialog.close();
    createForm.reset();
    checkAchievementHabitsCount();
});

function checkAchievementActionsCount(checkList) {
    let achievements = JSON.parse(localStorage.getItem('achievements')) || [];
    if (checkList.length == 10 && !achievements.includes('1')) {
        achievements.push('1');
        localStorage.setItem('achievements', JSON.stringify(achievements));
        document.getElementsByClassName('ach__img')[0].src = 'imgs/achs/1.jpeg';
        document.getElementsByClassName('ach')[0].showModal();
    } else if (checkList.length == 50 && !achievements.includes('2')) {
        achievements.push('2');
        localStorage.setItem('achievements', JSON.stringify(achievements));
        document.getElementsByClassName('ach__img')[0].src = 'imgs/achs/2.jpeg';
        document.getElementsByClassName('ach')[0].showModal();
    } else if (checkList.length == 100 && !achievements.includes('3')) {
        achievements.push('3');
        localStorage.setItem('achievements', JSON.stringify(achievements));
        document.getElementsByClassName('ach__img')[0].src = 'imgs/achs/3.jpeg';
        document.getElementsByClassName('ach')[0].showModal();
    }
}

function checkAchievementHabitsCount() {
    let habitsList = JSON.parse(localStorage.getItem('habits')) || [];
    let historyList = JSON.parse(localStorage.getItem('history')) || [];
    let achievements = JSON.parse(localStorage.getItem('achievements')) || [];
    if (!achievements.includes('7') && historyList.length + habitsList.length >= 10) {
        achievements.push('7');
        localStorage.setItem('achievements', JSON.stringify(achievements));
        document.getElementsByClassName('ach__img')[0].src = 'imgs/achs/7.jpeg';
        document.getElementsByClassName('ach')[0].showModal();
    }
};

function checkAchievementActionsForHabit(id) {
    let achievements = JSON.parse(localStorage.getItem('achievements')) || [];
    let actionsList = JSON.parse(localStorage.getItem('actions')) || [];
    if (!achievements.includes('8') && actionsList.filter(item => item.id == id).length >= 30) {
        achievements.push('8');
        localStorage.setItem('achievements', JSON.stringify(achievements));
        document.getElementsByClassName('ach__img')[0].src = 'imgs/achs/8.jpeg';
        document.getElementsByClassName('ach')[0].showModal();
    }
}

function checkAchievementActionsForHabit(id) {
    let achievements = JSON.parse(localStorage.getItem('achievements')) || [];
    let actionsList = JSON.parse(localStorage.getItem('actions')) || [];
    let dates = [];
    actionsList.forEach(item => {
        if (!dates.includes(item.date.substring(0, 10))) {
            dates.push(item.date.substring(0, 10));
        }
    });
    if (!achievements.includes('6') && dates.length >= 90) {
        achievements.push('6');
        localStorage.setItem('achievements', JSON.stringify(achievements));
        document.getElementsByClassName('ach__img')[0].src = 'imgs/achs/6.jpeg';
        document.getElementsByClassName('ach')[0].showModal();
    }
    if (!achievements.includes('5') && dates.length >= 30) {
        achievements.push('5');
        localStorage.setItem('achievements', JSON.stringify(achievements));
        document.getElementsByClassName('ach__img')[0].src = 'imgs/achs/5.jpeg';
        document.getElementsByClassName('ach')[0].showModal();
    }
    if (!achievements.includes('4') && dates.length >= 7) {
        achievements.push('4');
        localStorage.setItem('achievements', JSON.stringify(achievements));
        document.getElementsByClassName('ach__img')[0].src = 'imgs/achs/4.jpeg';
        document.getElementsByClassName('ach')[0].showModal();
    }
}

function addLibraryHabit(el) {
    let habitsList = JSON.parse(localStorage.getItem('habits'));
    let historyList = JSON.parse(localStorage.getItem('history'));
    let newId = 1;
    let newHabit = JSON.parse(el.value);
    habitsList.forEach(item => {
        if (item.id >= newId) {
            newId = item.id + 1;
        }
    })
    historyList.forEach(item => {
        if (item.id >= newId) {
            newId = item.id + 1;
        }
    })
    newHabit.id = newId;
    newHabit.addDate = new Date();
    habitsList.push(newHabit);
    localStorage.setItem('habits', JSON.stringify(habitsList));
    renderHabits();
    addDialog.close();
    checkAchievementHabitsCount()
}

function deleteHabit(id, isInHistory = false) {
    let deleteDialog = document.getElementsByClassName('delete-dialog')[0];
    if (isInHistory) {
        deleteDialog.innerHTML = `
        <input class="delete-dialog__btn" type="button" value="Удалить привычку с историей" onclick="deleteHabitWithHistory(${id})">
        <input class="dialog__btn" type="button" value="Отмена" onclick="this.parentNode.close()">`
    } else {
        deleteDialog.innerHTML = `
        <input class="delete-dialog__btn" type="button" value="Удалить привычку с историей" onclick="deleteHabitWithHistory(${id})">
        <input class="delete-dialog__btn" type="button" value="Прекратить отслеживание" onclick="stopTracking(${id})">
        <input class="dialog__btn" type="button" value="Отмена" onclick="this.parentNode.close()">
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
    document.getElementsByClassName('delete-dialog')[0].close();
    renderHabits();
}

function editHabit(id) {
    let habitsList = JSON.parse(localStorage.getItem('habits'));
    if (document.getElementsByClassName('add-dialog__new')[0].classList.contains('add-dialog__content--closed')) addDialogToggle();
    addDialog.showModal();
    let habit = habitsList.find(item => item.id == id);
    createForm.title.value = habit.title;
    if (['Саморазвитие', 'Физическая активность', 'Финансовая грамотность', 'Социальные связи', 'Языки', 'Здоровье', 'Уход за домом', 'Уход за животными'].includes(habit.category)) {
        createForm.category.value = habit.category;
    } else {
        createForm.category.value = 'Другое';
    }
    createForm.period.value = habit.period;
    createForm.dataset.id = id;
    if (habit.targetValue) {
        createForm.targetValue.value = habit.targetValue;
    }
}

function stopTracking(id) {
    let habitsList = JSON.parse(localStorage.getItem('habits'));
    let historyList = JSON.parse(localStorage.getItem('history'));
    let habit = habitsList.findIndex(item => item.id == id);
    historyList.push(habitsList[habit]);
    habitsList.splice(habit, 1);
    localStorage.setItem('habits', JSON.stringify(habitsList));
    localStorage.setItem('history', JSON.stringify(historyList));
    document.getElementsByClassName('delete-dialog')[0].close();
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
    document.getElementsByClassName('delete-dialog')[0].close();
    renderHabits();
}

function checkDate(date, period) {
    date.setHours(0, -now.getTimezoneOffset(), 0, 0);
    let dateEnd = new Date(date);
    dateEnd.setDate(date.getDate() + 1);
    if (period == 'weekly') {
        if (date.getDay()) {
            date.setDate(date.getDate() - date.getDay() + 1);
        } else {
            date.setDate(date.getDate() - 6);
        }
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
    let money = JSON.parse(localStorage.getItem('money'));
    if (document.getElementById(`habit${id}`).getElementsByClassName('habit__mark')[0].classList.contains('habit__mark--checked')) {
        let habit = habitsList.find(element => element.id == id);
        actionsList = actionsList.filter(item => item.id != id || (item.id == id && !checkDate((new Date(item.date)), habit.period)));
        money -= 10;
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
        money += 10;
    } else {
        actionsList.push({
            id: id,
            date: now,
        })
        money += 10;
    }
    localStorage.setItem('actions', JSON.stringify(actionsList));
    localStorage.setItem('money', JSON.stringify(money));
    renderHabits();
    checkAchievementActionsCount(actionsList);
    checkAchievementActionsForHabit(id);
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
                            <button class="habit__acions-open" area-label="Открыть меня взаимодействия"
                                onclick="this.nextElementSibling.classList.toggle('habit__actions-menu--opened')"><?xml version="1.0" encoding="UTF-8"?>
                                <svg width="32" height="32" version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                    <g stroke-width=".90185">
                                        <circle cx="16.511" cy="15.68" r="2.7485" />
                                        <circle cx="16.535" cy="25.951" r="2.7485" />
                                        <circle cx="16.477" cy="5.6823" r="2.7485" />
                                    </g>
                                </svg>
                                </button>
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
                            <div class="habit__row-mark">
                                <button class="habit__mark" type="button" onclick="markHabit(${item.id})" label-area="Отметить привычку выполненной">
                                <svg width="512" height="512" version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="m113.68 258.27 92.923 129.35a8.6127 8.6127 3.0662 0 0 13.413 0.71848l226.69-253.31a22.494 22.494 84.241 0 0-3.3329-33.046l-0.80748-0.60091a24.471 24.471 174.56 0 0-32.664 3.112l-185.44 202.66a7.2447 7.2447 2.4101 0 1-11.082-0.46642l-60.22-78.087a23.445 23.445 4.9734 0 0-34.379-2.9917l-1.8855 1.7226a23.415 23.415 95.946 0 0-3.2235 30.948z"
                                        fill="#333" />
                                </svg></button>
                            </div>
                        </div>
                    </div >
                    <button class="habit__info-open"  onclick="openInfo(this.nextElementSibling, ${item.id})" area-label="Открыть подродную информацию о привычке">
                    <svg width="32" height="32" version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <path d="m7.3963 11.072 8.4847 7.0432a0.57294 0.57294 0.1971 0 0 0.72885 0.0025l8.7146-7.1334a0.79047 0.79047 4.9987 0 1 1.1 0.09621l0.1121 0.13032a0.75943 0.75943 94.748 0 1-0.08959 1.0787l-9.6732 8.0604a0.92522 0.92522 0.016253 0 1-1.185-3.36e-4l-9.4384-7.8738a0.74814 0.74814 85.714 0 1-0.08028-1.0711l0.22051-0.24845a0.79736 0.79736 175.64 0 1 1.1056-0.08423z"/>
                    </svg>
                </button>
                <div class="habit__info toggle-element">
                        <div class="habit__calendar-wrapper">
                            <div class="habit__calendar"></div>
                        </div>
                        <div class="habit__day-info">
                        </div>
                    </div>
                </div>`);
            if (item.targetValue) {
                let numWrapper = document.getElementById(`habit${item.id}`).getElementsByClassName('habit__row-mark')[0];
                numWrapper.insertAdjacentHTML('afterbegin', `<input class="habit__number" id="habit${item.id}__number" type="number" 
                    onfocus="this.classList.remove('habit__number--checked');this.nextElementSibling.classList.remove('habit__mark--checked');">`)
                numWrapper.insertAdjacentHTML('beforebegin', `<p>цель: ${item.targetValue}</p>`)
            }
        });
        renderHistory(JSON.parse(localStorage.getItem('history')));
        renderActions(habitsList);
        progressBarUpdate();
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
                            <button class="habit__acions-open" area-label="открыть меню взаимодействия"
                                onclick="this.nextElementSibling.classList.toggle('habit__actions-menu--opened')">
                                <svg width="32" height="32" version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                    <g stroke-width=".90185">
                                        <circle cx="16.511" cy="15.68" r="2.7485" />
                                        <circle cx="16.535" cy="25.951" r="2.7485" />
                                        <circle cx="16.477" cy="5.6823" r="2.7485" />
                                    </g>
                                </svg>
                                </button>
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
                    <button class="habit__info-open"  onclick="openInfo(this.nextElementSibling, ${item.id})" area-label="Открыть подродную информацию о привычке">
                    <svg width="32" height="32" version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <path d="m7.3963 11.072 8.4847 7.0432a0.57294 0.57294 0.1971 0 0 0.72885 0.0025l8.7146-7.1334a0.79047 0.79047 4.9987 0 1 1.1 0.09621l0.1121 0.13032a0.75943 0.75943 94.748 0 1-0.08959 1.0787l-9.6732 8.0604a0.92522 0.92522 0.016253 0 1-1.185-3.36e-4l-9.4384-7.8738a0.74814 0.74814 85.714 0 1-0.08028-1.0711l0.22051-0.24845a0.79736 0.79736 175.64 0 1 1.1056-0.08423z"/>
                    </svg>
                </button>
                <div class="habit__info toggle-element">
                        <div class="habit__calendar-wrapper">
                            <div class="habit__calendar"></div>
                        </div>
                        <div class="habit__day-info">
                        </div>
                    </div>
                </div>`);
    });
}

function renderActions(habitsList) {
    let habit;
    let historyList = JSON.parse(localStorage.getItem('history'));
    let actionsList = JSON.parse(localStorage.getItem('actions'));
    actionsList.forEach((item, index) => {
        habit = habitsList.find(element => element.id == item.id) || historyList.find(element => element.id == item.id);
        if (habit) {
            let runtime;
            let dateStart = new Date(item.date);
            dateStart.setHours(0, -now.getTimezoneOffset(), 0, 0);
            let dateEnd = new Date(dateStart);
            dateEnd.setDate(dateStart.getDate() + 1);
            if (habit.period == 'weekly') {
                if (dateStart.getDay()) {
                    dateStart.setDate(dateStart.getDate() - dateStart.getDay() + 1);
                } else {
                    dateStart.setDate(dateStart.getDate() - 6);
                }
                dateEnd.setDate(dateStart.getDate() + 7);
            } else if (habit.period == 'monthly') {
                dateStart.setDate(1);
                dateEnd.setMonth(dateStart.getMonth() + 1);
                dateEnd.setDate(1);
            }
            let isRepeated = actionsList.find(action => {
                let date = new Date(action.date);
                date.setHours(0, -now.getTimezoneOffset(), 0, 0);
                return action.id == habit.id && date - dateStart >= 0 && dateEnd - date >= 0 && item.date > action.date;
            })
            if (+habit.targetValue > +item.value || isRepeated) {
                runtime = document.getElementById(`habit${habit.id}`).getElementsByClassName('habit__duration')[0].firstElementChild.innerHTML;
            } else {
                runtime = ++document.getElementById(`habit${habit.id}`).getElementsByClassName('habit__duration')[0].firstElementChild.innerHTML;
            }
            if (habit.period == 'daily') {
                document.getElementById(`habit${habit.id}`).getElementsByClassName('habit__duration')[0].lastElementChild.innerHTML = runtime % 100 < 15 && runtime % 100 > 10 ? 'дней' : runtime % 10 == 1 ? 'день' : runtime % 10 < 5 && runtime % 10 != 0 ? 'дня' : 'дней';
            } else if (habit.period == 'weekly') {
                document.getElementById(`habit${habit.id}`).getElementsByClassName('habit__duration')[0].lastElementChild.innerHTML = runtime % 100 < 15 && runtime % 100 > 10 ? 'недель' : runtime % 10 == 1 ? 'неделя' : runtime % 10 < 5 && runtime % 10 != 0 ? 'недели' : 'недель';
            } else {
                document.getElementById(`habit${habit.id}`).getElementsByClassName('habit__duration')[0].lastElementChild.innerHTML = runtime % 100 < 15 && runtime % 100 > 10 ? 'месяцев' : runtime % 10 == 1 ? 'месяц' : runtime % 10 < 5 && runtime % 10 != 0 ? 'месяца' : 'месяцев';
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

function openInfo(element, id) {
    if (document.getElementsByClassName('toggle-element-active')[0]) {
        slideToggle(document.getElementsByClassName('toggle-element-active')[0]);
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

    calendar.gotoDate(now.toISOString().substring(0, 10));
    calendar.addEvent({
        title: 'now',
        start: now.toISOString().substring(0, 10),
        allDay: true,
        backgroundColor: '#B7C9F2',
        borderColor: '#B7C9F2',
        textColor: '#000000',
    });
    addEvents(calendar, habit);
    document.getElementById(`habit${id}`).getElementsByClassName('habit__day-info')[0].innerHTML = `
        <p class="habit__selected-day">${now.getDate()} ${monthNames[now.getMonth()]}</p>
        <p class="habit__day-info">в этот день привычка ${document.getElementById(`habit${id}`).getElementsByClassName('habit__mark')[0].classList.contains('habit__mark--checked') ? '' : 'не '}была отмечена как выполненная</p>`
    let startNumberField = document.getElementById(`habit${habit.id}`).getElementsByClassName('habit__number')[0];
    if (startNumberField && startNumberField.value) {
        document.getElementById(`habit${habit.id}`).getElementsByClassName('habit__day-info')[0].insertAdjacentHTML('beforeend', `<p class="habit__day-info">Вы установили отметку <span>${startNumberField.value}</span></p>`)
    }
    slideToggle(element);
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
                if (dateStart.getDay()) {
                    dateStart.setDate(dateStart.getDate() - dateStart.getDay() + 1);
                } else {
                    dateStart.setDate(dateStart.getDate() - 6);
                }
                dateEnd.setDate(dateStart.getDate() + 7);
            } else if (habit.period == 'monthly') {
                dateStart.setDate(1);
                dateEnd.setMonth(dateStart.getMonth() + 1);
                dateEnd.setDate(1);
            }
            if (!calendar.getEvents().slice(1).find(event => event.start.setHours(0, -now.getTimezoneOffset(), 0, 0) - dateStart == 0)) {
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
        }
    });
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('./sw.js')
            .then(() => navigator.serviceWorker.ready.then((worker) => {
                worker.sync.register('syncdata');
            }))
            .catch((err) => console.log(err));
    });
}


renderHabits();

