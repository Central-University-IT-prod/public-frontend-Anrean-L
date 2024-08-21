'use strict'
function slideToggle(container) {
    if (!container.classList.contains('toggle-element-active')) {
        container.classList.add('toggle-element-active');
        container.style.height = 'auto';
        container.style.height = '0px';
        setTimeout(function () {
            if (getComputedStyle(container).display == 'flex') {
                container.style.height = 380 + 'px';
            } else {
                container.style.height = 38 + container.getElementsByClassName('habit__day-info')[0].clientHeight + container.getElementsByClassName('habit__calendar-wrapper')[0].clientHeight + 'px';
            }
        }, 0);
    } else {
        container.style.height = '0px';
        container.addEventListener('transitionend', function () {
            container.classList.remove('toggle-element-active');
        }, {
            once: true
        });
    }
}