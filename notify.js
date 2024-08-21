self.addEventListener('activate', (event) => {
    setInterval(() => {
        self.registration.showNotification('Напоминание', {
            body: 'Пора выполнять привычки!',
            icon: 'imgs/icons/icon96.png'
        });
    }, 3600000);
});

