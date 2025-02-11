import { Model } from './base/model';
import {
	IAppState,
	IBasketItem,
	ICatalogItem,
	IOrder,
	FormErrors,
} from '../types/types';
import { ICard } from './Card';

export interface CatalogChangeEvent {
	products: ICatalogItem[];
}

export class AppState extends Model<IAppState> {
	// Массив товаров в корзине
	basket: IBasketItem[] = [];
	// Каталог всех доступных товаров
	catalog: ICatalogItem[];
	// Флаг загрузки
	loading: boolean;
	// Информация о заказе
	order: IOrder = {
		payment: '',
		address: '',
		email: '',
		phone: '',
		total: 0,
		items: [],
	};

	// ID товара для предпросмотра
	preview: string | null;
	// Ошибки валидации формы
	formErrors: FormErrors = {};

	// Добавление товара в корзину
	addToBasket(item: IBasketItem) {
		if (item.price !== null && !this.basket.includes(item)) {
			this.basket.push(item);
			this.emitChanges('counter:changed', this.basket);
			this.emitChanges('basket:changed', this.basket);
		}
	}

	// Удаление товара из корзины
	removeBasketItem(item: IBasketItem) {
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
	getTotal(): number {
		return this.basket.reduce((total, item) => total + (item.price || 0), 0);
	}

	// Установка каталога товаров
	setCatalog(items: ICard[]) {
		this.catalog = items;
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	// Установка товара для предпросмотра
	setPreview(item: ICard) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	// Валидация формы заказа
	validateOrderForm(): boolean {
		const errors: FormErrors = {};

		// Проверка наличия способа оплаты
		if (!this.order.payment)
			errors.payment = 'Необходимо указать способ оплаты';
		// Проверка наличия адреса
		if (!this.order.address) errors.address = 'Необходимо указать адрес';

		// Проверка телефона
		if (!this.order.phone) errors.phone = 'Необходимо указать телефон';
		else if (
			!/^(\+7|8)\s?\(?\d{3}\)?\s?\d{3}\s?\d{2}\s?\d{2}$/.test(this.order.phone)
		)
			errors.phone = 'Некорректный формат телефона';
		// Проверка email
		if (!this.order.email) errors.email = 'Необходимо указать email';
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.order.email))
			errors.email = 'Некорректный формат email';

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}

	// Установка значения поля заказа
	setOrderField(field: keyof IOrder, value: string | number) {
		if (field === 'total') this.order[field] = value as number;
		else if (field === 'items') {
			this.order[field].push(value as string);
		} else this.order[field] = value as string;
		if (this.validateOrderForm()) this.events.emit('order:success', this.order);
	}

	// Сброс контактных данных
	resetContacts() {
		this.order.email = '';
		this.order.phone = '';
	}
}
