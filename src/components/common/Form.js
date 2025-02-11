var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
// Базовый класс для работы с формами
export class Form extends Component {
    // Инициализация формы
    constructor(container, events) {
        super(container);
        this.container = container;
        this.events = events;
        // Обработчик события ввода в поля формы
        this.handleInput = (e) => {
            const target = e.target;
            this.onInputChange(target.name, target.value);
        };
        // Обработчик отправки формы
        this.handleSubmit = (e) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        };
        // Находим необходимые элементы формы
        this._submit = ensureElement('button[type=submit]', this.container);
        this._errors = ensureElement('.form__errors', this.container);
        // Добавляем обработчик изменения полей формы
        this.container.addEventListener('input', this.handleInput);
        // Добавляем обработчик отправки формы
        this.container.addEventListener('submit', this.handleSubmit);
    }
    // Метод обработки изменения значения поля
    onInputChange(field, value) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value,
        });
    }
    // Сеттер для управления активностью кнопки отправки
    set valid(value) {
        this._submit.disabled = !value;
    }
    // Сеттер для отображения ошибок формы
    set errors(value) {
        this.setText(this._errors, value);
    }
    // Метод рендеринга формы
    render(state) {
        const { valid, errors } = state, inputs = __rest(state, ["valid", "errors"]);
        super.render({ valid, errors });
        return Object.assign(this, inputs).container;
    }
}
