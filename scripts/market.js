'use strict'
let money;
if (localStorage.getItem('money')) {
    money = +JSON.parse(localStorage.getItem('money'));
} else {
    money = 0;
}

let themes;
if (localStorage.getItem('themes')) {
    themes = JSON.parse(localStorage.getItem('themes'));
} else {
    themes = ['sky'];
}

document.getElementsByClassName('heading__money')[0].innerHTML = money;

function checkAchievement(n, checkList) {
    let achievements = JSON.parse(localStorage.getItem('achievements')) || [];
    if (n == '11' && !achievements.includes('11') && checkList.length == 7 || n == '10' && !achievements.includes('10') && checkList.length == 9) {
        achievements.push(n);
        localStorage.setItem('achievements', JSON.stringify(achievements));
        document.getElementsByClassName('ach__img')[0].src = 'imgs/achs/' + n + '.jpeg';
        document.getElementsByClassName('ach')[0].showModal();
    }
}

function playGacha() {
    if (money >= 100) {
        if (document.getElementsByClassName('avatars__image--active').length) {
            document.getElementsByClassName('avatars__image--active')[0].classList.remove('avatars__image--active');
        }
        let dialog = document.getElementsByClassName('avatars')[0];
        dialog.showModal();
        let itemNum;
        let myPics;
        document.getElementsByClassName('avatars__close')[0].setAttribute('disabled', 'disabled');
        if (localStorage.getItem('myPics')) {
            myPics = JSON.parse(localStorage.getItem('myPics'));
        } else {
            myPics = ['0'];
        }

        for (let i = 0; i < 9; i++) {
            setTimeout(function () {
                itemNum = Math.floor(Math.random() * 9);
                document.getElementById('image-' + itemNum).classList.add('avatars__image--active');
                setTimeout(() => { document.getElementById('image-' + itemNum).classList.remove('avatars__image--active') }, 200);
            }, 300 * i);
        }

        setTimeout(() => {
            itemNum = Math.floor(Math.random() * 9);
            document.getElementById('image-' + itemNum).classList.add('avatars__image--active');
            money -= 100;
            localStorage.setItem('money', JSON.stringify(money));
            document.getElementsByClassName('heading__money')[0].innerHTML = money;
            if (!myPics.includes(itemNum)) {
                myPics.push(itemNum);
                localStorage.setItem('myPics', JSON.stringify(myPics));
                checkAchievement('10', myPics);
            }
        }, 300 * 9)
        document.getElementsByClassName('avatars__close')[0].removeAttribute('disabled')

    } else document.getElementsByClassName('insufficient-funds')[0].showModal();
}

function themeBuy(theme) {
    if (money >= 50) {
        money -= 50;
        localStorage.setItem('money', JSON.stringify(money));
        document.getElementsByClassName('heading__money')[0].innerHTML = money;
        themes.push(theme);
        localStorage.setItem('themes', JSON.stringify(themes));
        checkAchievement('11', themes)
        renderThemeMarket();
    } else document.getElementsByClassName('insufficient-funds')[0].showModal();
}

function renderThemeMarket() {
    themes.forEach(item => {
        if (JSON.parse(localStorage.getItem('theme')) == item || !JSON.parse(localStorage.getItem('theme')) && item == 'sky') {
            document.getElementById(item).getElementsByClassName('theme__amount')[0].innerHTML = `<p class="theme__active">Активно</p>`;
        } else document.getElementById(item).getElementsByClassName('theme__amount')[0].innerHTML = `<input type="button" value="Применить" class="theme__apply" onclick="selectTheme('${item}')">`;
    });
}

function selectTheme(theme) {
    localStorage.setItem('theme', JSON.stringify(theme));
    document.documentElement.setAttribute('theme', theme);
    renderThemeMarket();
}

renderThemeMarket();