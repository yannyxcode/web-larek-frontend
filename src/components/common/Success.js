import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
// Класс для отображения успешного оформления заказа
export class Success extends Component {
    // Инициализация компонента
    constructor(container, actions) {
        super(container);
        this.actions = actions;
        // Находим необходимые элементы на странице
        this._total = ensureElement('.order-success__description', this.container);
        this._closeButton = ensureElement('.order-success__close', this.container);
        // Добавляем обработчик клика, используя опциональную цепочку
        (actions === null || actions === void 0 ? void 0 : actions.onClick) &&
            this._closeButton.addEventListener('click', actions.onClick);
    }
    // Сеттер для установки итоговой суммы заказа
    set total(value) {
        this.setText(this._total, value);
    }
}
