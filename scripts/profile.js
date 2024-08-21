'use strict'
document.getElementsByClassName('profile-head__name-apply')[0].addEventListener('click', () => {
    if (document.getElementsByClassName('profile-head__name-input')[0].value) {
        localStorage.setItem('name', document.getElementsByClassName('profile-head__name-input')[0].value);
        document.getElementsByClassName('profile-head__name')[0].innerHTML = document.getElementsByClassName('profile-head__name-input')[0].value
        document.getElementsByClassName('profile-head__edit')[0].classList.toggle('profile-head__edit--closed');
        let achievements = JSON.parse(localStorage.getItem('achievements')) || [];
        if (!achievements.includes('9')) {
            document.getElementsByClassName('ach')[0].showModal();
            achievements.push('9');
            localStorage.setItem('achievements', JSON.stringify(achievements));
        }
    }
})

function changeAvatar(n) {
    const myPics = JSON.parse(localStorage.getItem('myPics'));
    if (n == 0 || myPics && myPics.includes(n)) {
        localStorage.setItem('pic', n);
        if (n < 9) document.getElementsByClassName('profile-head__image')[0].src = 'imgs/profile/' + n + '.jpg';
    }
    document.getElementsByClassName('avatars')[0].close();
}

if (localStorage.getItem('name')) {
    document.getElementsByClassName('profile-head__name')[0].innerHTML = localStorage.getItem('name');
}

if (localStorage.getItem('pic') && localStorage.getItem('pic') < 9) {
    document.getElementsByClassName('profile-head__image')[0].src = 'imgs/profile/' + localStorage.getItem('pic') + '.jpg';
}

if (localStorage.getItem('myPics')) {
    const myPics = JSON.parse(localStorage.getItem('myPics'));
    myPics.forEach(item => {
        document.getElementById('image-btn-' + item).classList.remove('avatars__btn--disabled');
        document.getElementById('image-btn-' + item).removeAttribute('disabled')
    })
}

let actionsList = JSON.parse(localStorage.getItem('actions')) || [];
let dateCounts = new Map();
let date;
actionsList.forEach(item => {
    date = item.date.substring(0, 10);
    dateCounts.set(date, (dateCounts.get(date) || 0) + 1);
});
let chartData = Array.from(dateCounts, ([date, count]) => ({ x: date, y: count }));
chartData.sort((a, b) => a.x.localeCompare(b.x));
const ctx = document.getElementsByClassName('statistics__chart')[0];
new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
            label: 'График привычек',
            data: chartData,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    },
    options: {
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    displayFormats: {
                        day: 'dd.MM.yyyy'
                    }
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    }
});

let notifyBtn = document.getElementsByClassName('profile-head__notifications')[0];
notifyBtn.addEventListener('click', () => {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            console.log('object');
            window.addEventListener('load', function () {
                navigator.serviceWorker.register('./notify.js')
                    .then(() => navigator.serviceWorker.ready.then((worker) => {
                        worker.sync.register('syncdata');
                    }))
                    .catch((err) => console.log(err));
            });
            document.getElementsByClassName('profile-head__notifications-info')[0].innerHTML = 'Не закрывайте вкладку, уведомления будут отправляться каждый час'
        } else {
            document.getElementsByClassName('profile-head__notifications-info')[0].innerHTML = 'Уведомления не разрешены'
        }
    });
})
if (!('Notification' in window) || !('serviceWorker' in navigator)) {
    notifyBtn.style.display = 'none'
}

