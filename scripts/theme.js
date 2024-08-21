'use strict'
let theme;
if (localStorage.getItem('theme')) {
    theme = JSON.parse(localStorage.getItem('theme'));
    document.documentElement.setAttribute('theme', theme);
}
