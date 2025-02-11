import { ensureElement } from '../utils/utils';
import { Component } from './base/component';
// Класс для создания и управления карточкой товара
export class Card extends Component {
    // Конструктор класса Card
    constructor(container, action) {
        super(container);
        // Объект с селекторами элементов карточки
        const elements = {
            title: '.card__title',
            price: '.card__price',
            image: '.card__image',
            category: '.card__category',
            description: '.card__text',
            button: '.card__button',
            basketIndex: '.basket__item-index',
        };
        // Инициализация DOM элементов
        this._title = ensureElement(elements.title, container);
        this._price = ensureElement(elements.price, container);
        this._image = container.querySelector(elements.image);
        this._category = container.querySelector(elements.category);
        this._description = container.querySelector(elements.description);
        this._button = container.querySelector(elements.button);
        this._basketCardIndex = container.querySelector(elements.basketIndex);
        // Добавление обработчика клика
        if (action === null || action === void 0 ? void 0 : action.onClick) {
            const target = this._button || container;
            target.addEventListener('click', action.onClick);
        }
    }
    // Отключает кнопку, если цена равна null
    disableButton(value) {
        if (!value && this._button) {
            this._button.disabled = true;
        }
    }
    // Устанавливает идентификатор карточки в data-атрибут контейнера
    set id(value) {
        this.container.dataset.id = value;
    }
    // Возвращает идентификатор карточки из data-атрибута контейнера
    get id() {
        return this.container.dataset.id || '';
    }
    // Устанавливает индекс карточки в корзине
    set basketCardIndex(value) {
        this._basketCardIndex.textContent = value;
    }
    // Возвращает индекс карточки в корзине
    get basketCardIndex() {
        return this._basketCardIndex.textContent || '';
    }
    // Устанавливает заголовок карточки
    set title(value) {
        this.setText(this._title, value);
    }
    // Возвращает текущий заголовок карточки
    get title() {
        return this._title.textContent || '';
    }
    // Устанавливает текст на кнопке карточки
    set buttonTitle(value) {
        if (this._button) {
            this._button.textContent = value;
        }
    }
    // Устанавливает изображение карточки
    set image(value) {
        this.setImage(this._image, value, this.title);
    }
    // Устанавливает цену карточки и обновляет состояние кнопки
    set price(value) {
        this.setText(this._price, value ? `${value.toString()} синапсов` : 'Бесценно');
        this.disableButton(value);
    }
    // Возвращает текущую цену карточки
    get price() {
        return Number(this._price.textContent || '');
    }
    // Устанавливает категорию карточки и соответствующий CSS-класс
    set category(value) {
        if (!this._category)
            return;
        this.setText(this._category, value);
        const baseClass = this._category.classList[0];
        this._category.className = baseClass;
        this._category.classList.add(`${baseClass}${Card.categoryKey[value]}`);
    }
    // Устанавливает описание карточки
    // Поддерживает как одиночные строки, так и массивы строк
    set description(value) {
        if (!this._description)
            return;
        if (Array.isArray(value)) {
            const fragments = value.map((str) => {
                const descTemplate = this._description.cloneNode();
                this.setText(descTemplate, str);
                return descTemplate;
            });
            this._description.replaceWith(...fragments);
        }
        else {
            this.setText(this._description, value);
        }
    }
}
// Словарь для маппинга категорий на соответствующие CSS-классы
Card.categoryKey = {
    'хард-скил': '_hard',
    'софт-скил': '_soft',
    дополнительное: '_additional',
    кнопка: '_button',
    другое: '_other',
};
