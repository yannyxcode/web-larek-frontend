import { Component } from './base/component';
import { ensureElement } from '../utils/utils';
// Класс для управления основной страницей
export class Page extends Component {
    // Инициализация компонента страницы
    constructor(container, events) {
        super(container);
        this.events = events;
        // Находим необходимые элементы на странице
        this._counter = ensureElement('.header__basket-counter');
        this._catalog = ensureElement('.gallery');
        this._wrapper = ensureElement('.page__wrapper');
        this._basket = ensureElement('.header__basket');
        // Добавляем обработчик клика по корзине
        this._basket.addEventListener('click', () => this.events.emit('basket:open'));
    }
    // Сеттер для обновления счетчика товаров
    set counter(value) {
        this.setText(this._counter, String(value));
    }
    // Сеттер для обновления каталога товаров
    set catalog(items) {
        this._catalog.replaceChildren(...items);
    }
    // Сеттер для управления блокировкой страницы
    set locked(value) {
        // Проверка состояния блокировки и добавление/удаление класса
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        }
        else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}
