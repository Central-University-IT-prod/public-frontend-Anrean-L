'use strict'
function progressBarUpdate() {
    const progressBar = document.getElementsByClassName('progress-bar__active')[0];
    let listOfHabits = document.getElementsByClassName('habit__mark');
    let listOfMarkedHabits = document.getElementsByClassName('habit__mark--checked');
    if (listOfHabits.length) {
        progressBar.style.width = listOfMarkedHabits.length / listOfHabits.length * 100 + '%'
    } else {
        progressBar.style.width = 0
    }
}