import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
// Класс для управления модальным окном
export class Modal extends Component {
    // Инициализация модального окна
    constructor(container, events) {
        super(container);
        this.events = events;
        // Обработчики событий как приватные методы
        this.handleClose = () => {
            this.close();
        };
        this.handleContentClick = (event) => {
            event.stopPropagation();
        };
        // Инициализация DOM-элементов с использованием приватных readonly свойств
        this._closeButton = ensureElement('.modal__close', container);
        this._content = ensureElement('.modal__content', container);
        // Привязка обработчиков событий с использованием стрелочных функций
        this._closeButton.addEventListener('click', this.handleClose);
        this.container.addEventListener('click', this.handleClose);
        this._content.addEventListener('click', this.handleContentClick);
    }
    // Сеттер для обновления содержимого модального окна
    set content(value) {
        this._content.replaceChildren(value);
    }
    // Метод открытия модального окна
    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }
    // Метод закрытия модального окна
    close() {
        this.container.classList.remove('modal_active');
        this.content = null;
        this.events.emit('modal:close');
    }
    // Метод рендеринга модального окна
    render(data) {
        super.render(data);
        this.open();
        return this.container;
    }
}
