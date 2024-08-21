'use strict'

if (localStorage.getItem('achievements')) {
    const achievements = JSON.parse(localStorage.getItem('achievements'));
    achievements.forEach(item => {
        document.getElementById(item).classList.add('achievements__item--gained');
    })
}