import { Form } from './common/Form';
import { ensureAllElements } from '../utils/utils';
// Класс для управления формой заказа
export class Order extends Form {
    // Инициализация формы заказа
    constructor(container, events) {
        super(container, events);
        // Находим все кнопки оплаты и добавляем обработчики
        this._payment = ensureAllElements('.button_alt', container);
        this._payment.forEach((button) => button.addEventListener('click', () => this.selected(button.name)));
    }
    // Сеттер для установки адреса доставки
    set address(value) {
        const addressInput = this.container.elements.namedItem('address');
        addressInput.value = value;
    }
    // Сеттер для установки email
    set email(value) {
        const emailInput = this.container.elements.namedItem('email');
        emailInput.value = value;
    }
    // Сеттер для установки телефона
    set phone(value) {
        const phoneInput = this.container.elements.namedItem('phone');
        phoneInput.value = value;
    }
    // Сеттер для управления активностью кнопки отправки формы
    set valid(value) {
        this._submit.disabled = !value;
    }
    // Обработка выбора способа оплаты
    selected(name) {
        this._payment.forEach((button) => {
            const isSelected = button.name === name;
            this.toggleClass(button, 'button_alt-active', isSelected);
        });
        this.events.emit('order.payment:change', { name });
    }
}
