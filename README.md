# Habits

https://habits-tracher.vercel.app

Трекер полезных привычек — это веб-приложение, созданное для помощи в отслеживании и поддержке ваших полезных привычек. Проект выполнен на чистом HTML, CSS и JavaScript, с использованием библиотек FullCalendar.js и Chart.js.

## Функциональность

- **Создание и редактирование привычек**: Добавляйте и изменяйте привычки с помощью удобного интерфейса.я
- **Визуализация прогресса**: Анализируйте свой прогресс с помощью графиков и диаграмм. ([Chart.js](https://www.chartjs.org/))
- **Локальное хранение данных**: Ваши данные о привычках сохраняются локально, позволяя легко к ним возвращаться.
- **Магазин тем и аватаров**: В приложение встроен магазин, в котором вы можете купить темы оформления или выиграть аватары. Валюты вы можете получить выполняя привычки.
- **Достижения**: Вас ждут 12 достижений, выполняя которые вы получите красивые значки, которыми можно соревноваться с друзьями.
- **Отметки на календаре**: Открывая информацию о привычке, вы видите календарь с отмеченными днями выполнения. ([FullCalendar](https://fullcalendar.io/))

## Локальный запуск проекта

### Клонирование репозитория

Клонируйте репозиторий следующей командой:

```bash
git clone https://example.com/your-project-repo.git
```

### Предварительные требования

Убедитесь, что на вашем компьютере установлен Node.js. Если нет, вы можете скачать и установить его с официального сайта:

- [Скачать Node.js](https://nodejs.org/)

### Установка

Поскольку проект не использует внешние зависимости, установка `live-server` через `npm` будет единственным шагом установки, необходимым для запуска проекта локально.

1. Установите `live-server` глобально с помощью `npm`:

    ```bash
    npm install -g live-server
    ```

### Запуск проекта

1. Откройте терминал и перейдите в директорию вашего проекта:

    ```bash
    cd путь/к/проекту
    ```

2. Запустите локальный сервер с помощью команды `live-server`:

    ```bash
    live-server
    ```

    Эта команда автоматически откроет ваш проект в браузере по умолчанию. Любые изменения в файлах проекта будут автоматически применяться, и страница будет перезагружаться.

Приятного использования!