import { Component } from '../base/component';
import { ensureElement, createElement } from '../../utils/utils';
// Класс для управления корзиной
export class Basket extends Component {
    // Инициализация компонента корзины
    constructor(container, events) {
        var _a;
        super(container);
        this.events = events;
        // Находим необходимые элементы
        this._list = ensureElement('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');
        // Добавляем обработчик клика по кнопке оформления заказа
        (_a = this._button) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => this.events.emit('order:open'));
        this.items = [];
    }
    // Сеттер для обновления списка товаров
    set items(items) {
        if (items.length) {
            // Если есть товары, отображаем их
            this._list.replaceChildren(...items);
        }
        else {
            // Если корзина пуста, показываем сообщение
            this._list.replaceChildren(createElement('p', {
                textContent: 'Корзина пуста',
            }));
        }
    }
    // Сеттер для управления состоянием кнопки заказа
    set selected(items) {
        if (items.length) {
            // Активируем кнопку если есть товары
            this.setDisabled(this._button, false);
        }
        else {
            // Деактивируем кнопку если корзина пуста
            this.setDisabled(this._button, true);
        }
    }
    // Сеттер для обновления общей суммы
    set total(total) {
        this.setText(this._total, `${total.toString()}` + ' синапсов');
    }
}
