// Находим элементы на странице
const form = document.querySelector('.form');
const input = document.querySelector('.form__field');
const list = document.querySelector('.list');
const emptyList = document.querySelector('.list__item_empty');

// Добавляем слушатели
form.addEventListener('submit', addTask);
list.addEventListener('click', deleteTask);
list.addEventListener('click', successTask);

// Создаем массив для задач
let tasks = [];

// Проверяем массив на наличие данных и выводим их
if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask(task));
};

// Проверка на наличие задач
checkEmptyList();

//Добвляем задачу
function addTask(event) {

    // Отключаем обновление страницы при действии
    event.preventDefault();

    // Сохраняем введенные данные
    const taskText = input.value;

    // Назначаем атрибуты элемента
    const newTask = {
        id: Date.now(),
        text: taskText,
        success: false
    };

    // Добавляем задачу в список и выводим ее
    tasks.push(newTask);
    saveToLocal();
    renderTask(newTask);

    // Очищаем и фокусируем поле ввода
    input.value = '';
    input.focus();

    // Проверяем список на наличие задач
    checkEmptyList();
};

// Удаляем задачу
function deleteTask(event) {

    // Проверяем задачу, с которой взаимодействуем
    if (event.target.dataset.action !== 'delete') {
        return
    };

    // Проверяем статус задачи по id
    const eventTask = event.target.closest('.list__item');
    const id = Number(eventTask.id);
    const index = tasks.findIndex((task) => task.id === id);

    // Удаляем задачу из массива
    tasks.splice(index, 1);
    saveToLocal();

    // Удаляем задачу и проверяем список на наличие задач
    eventTask.remove();
    checkEmptyList();
};

// Меняем статус задачи
function successTask(event) {

    // Проверяем статус задачи по id
    if (event.target.dataset.action === 'success') {
        const eventTask = event.target.closest('.list__item');
        const id = Number(eventTask.id);
        const taskSuccess = tasks.find((task) => task.id === id);

        taskSuccess.success = !taskSuccess.success;
        saveToLocal();

        // Заменяем классы CSS при изменении статуса задачи
        const task = eventTask.querySelector('.list__item-text');
        task.classList.toggle('list__item-text_success');
        const button = eventTask.querySelector('.button_success');
        button.classList.toggle('button_transparent');
    };

};

// Проверка на наличие задач
function checkEmptyList() {

    // Если задач нет выводим уведомление
    if (tasks.length === 0) {
        const emptyListItem = `<li class="list__item list__item_empty">
                                <span class="list__item-text list__item-text_empty">Список дел пуст</span>
                           </li>`;
        list.insertAdjacentHTML('afterbegin', emptyListItem);
    };

    // Если задачи есть убираем уведомление
    if (tasks.length > 0) {
        const emptyListElement = document.querySelector('.list__item_empty');
        emptyListElement ? emptyListElement.remove() : null;
    }
};

// Сохоанение данных в браузере
function saveToLocal() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Рендер задач
function renderTask(task) {

    // Проверка состояния объектов и изменение класов CSS
    const successTextClass = task.success ? 'list__item-text list__item-text_success' : 'list__item-text';
    const successButtonClass = task.success ? 'button button_success button_transparent' : 'button button_success';

    // Разметка задачи
    const taskCard = `<li id='${task.id}' class="list__item">
                        <p class="${successTextClass}">${task.text}</p>
                        <div class="list__btn-group">
                            <button type="button" data-action='success' class="${successButtonClass}"></button>
                            <button type="button" data-action='delete' class="button button_delete"></button>
                        </div>
                      </li>`

    // Помещение задачи в список
    list.insertAdjacentHTML('beforeend', taskCard);
};
