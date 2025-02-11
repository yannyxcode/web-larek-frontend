import { Model } from './base/model';
export class AppState extends Model {
    constructor() {
        super(...arguments);
        // Массив товаров в корзине
        this.basket = [];
        // Информация о заказе
        this.order = {
            payment: '',
            address: '',
            email: '',
            phone: '',
            total: 0,
            items: [],
        };
        // Ошибки валидации формы
        this.formErrors = {};
    }
    // Добавление товара в корзину
    addToBasket(item) {
        if (item.price !== null && !this.basket.includes(item)) {
            this.basket.push(item);
            this.emitChanges('counter:changed', this.basket);
            this.emitChanges('basket:changed', this.basket);
        }
    }
    // Удаление товара из корзины
    removeBasketItem(item) {
        this.basket = this.basket.filter((it) => it != item);
        this.emitChanges('counter:changed', this.basket);
        this.emitChanges('basket:changed', this.basket);
    }
    // Очистка корзины
    clearBasket() {
        this.basket = [];
        this.emitChanges('counter:changed', this.basket);
        this.emitChanges('basket:changed', this.basket);
    }
    // Подсчет общей стоимости товаров в корзине
    getTotal() {
        return this.basket.reduce((total, item) => total + (item.price || 0), 0);
    }
    // Установка каталога товаров
    setCatalog(items) {
        this.catalog = items;
        this.emitChanges('items:changed', { catalog: this.catalog });
    }
    // Установка товара для предпросмотра
    setPreview(item) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }
    // Валидация формы заказа
    validateOrderForm() {
        const errors = {};
        // Проверка наличия способа оплаты
        if (!this.order.payment)
            errors.payment = 'Необходимо указать способ оплаты';
        // Проверка наличия адреса
        if (!this.order.address)
            errors.address = 'Необходимо указать адрес';
        // Проверка телефона
        if (!this.order.phone)
            errors.phone = 'Необходимо указать телефон';
        else if (!/^(\+7|8)\s?\(?\d{3}\)?\s?\d{3}\s?\d{2}\s?\d{2}$/.test(this.order.phone))
            errors.phone = 'Некорректный формат телефона';
        // Проверка email
        if (!this.order.email)
            errors.email = 'Необходимо указать email';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.order.email))
            errors.email = 'Некорректный формат email';
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
    // Установка значения поля заказа
    setOrderField(field, value) {
        if (field === 'total')
            this.order[field] = value;
        else if (field === 'items') {
            this.order[field].push(value);
        }
        else
            this.order[field] = value;
        if (this.validateOrderForm())
            this.events.emit('order:success', this.order);
    }
    // Сброс контактных данных
    resetContacts() {
        this.order.email = '';
        this.order.phone = '';
    }
}
