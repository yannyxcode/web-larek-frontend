// Импортируем основные стили приложения
import './scss/styles.scss';
// Импортируем основные компоненты и утилиты
import { LarekApi } from './components/LarekApi';
import { EventEmitter } from './components/base/events';
import { Page } from './components/Page';
import { AppState, CatalogChangeEvent } from './components/AppData';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Basket } from './components/common/Basket';
import { Order } from './components/Order';
import { Modal } from './components/common/Modal';
import { Card, ICard } from './components/Card';
import { Success } from './components/common/Success';
import { IContactsForm, IDeliveryForm, IOrderForm } from './types/types';
import { API_URL, CDN_URL } from './utils/constants';

// Инициализация основных компонентов приложения
// EventEmitter для управления событиями в приложении
const events = new EventEmitter();
// API для взаимодействия с сервером
const api = new LarekApi(CDN_URL, API_URL);

// Инициализация шаблонов для различных компонентов интерфейса
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Инициализация глобального состояния приложения
const appData = new AppState({}, events);

// Инициализация основных контейнеров приложения
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Инициализация переиспользуемых компонентов интерфейса
const success = new Success(cloneTemplate(successTemplate), {
	onClick: () => {
		modal.close();
	},
});
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Order(cloneTemplate(contactsTemplate), events);

// Загрузка начальных данных: получение списка товаров с сервера
api
	.getProductItems()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.log(err);
	});

// Отладочный монитор всех событий в приложении
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Обработчик изменения каталога товаров
events.on<CatalogChangeEvent>('items:changed', () => {
	// Создание карточек товаров для каталога
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});

		return card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
		});
	});
});

// Обработчик выбора карточки товара в каталоге
events.on('card:select', (item: ICard) => appData.setPreview(item));

// Обработчик изменения предпросмотра товара
events.on('preview:changed', (item: ICard) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('card:toBasket', item);
			// Обновление текста кнопки в зависимости от наличия товара в корзине
			card.buttonTitle =
				appData.basket.indexOf(item) !== -1
					? 'Удалить из корзины'
					: 'В корзину';
		},
	});

	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			category: item.category,
			description: item.description,
			price: item.price,
			buttonTitle: appData.basket.includes(item)
				? 'Удалить из корзины'
				: 'В корзину',
		}),
	});
});

// Обработчик добавления/удаления товара в корзину
events.on('card:toBasket', (item: ICard) => {
	if (appData.basket.indexOf(item) < 0) {
		events.emit('product:add', item);
	} else {
		events.emit('product:delete', item);
	}
});

// Обработчики блокировки/разблокировки страницы при открытии/закрытии модального окна
events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

// Обработчик открытия корзины
events.on('basket:open', () => {
	basket.selected = appData.basket;
	modal.render({
		content: basket.render({}),
	});
});

// Обработчики управления товарами в корзине
events.on('product:add', (item: ICard) => {
	appData.addToBasket(item);
});

events.on('product:delete', (item: ICard) => {
	appData.removeBasketItem(item);
	basket.selected = appData.basket;
});

// Обработчик обновления счетчика товаров в корзине
events.on('counter:changed', () => (page.counter = appData.basket.length));

// Обработчик изменения состава корзины
events.on('basket:changed', (items: ICard[]) => {
	// Создание карточек товаров для корзины
	basket.items = items.map((item, basketCardIndex) => {
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('product:delete', item);
			},
		});
		return card.render({
			basketCardIndex: (basketCardIndex + 1).toString(),
			title: item.title,
			price: item.price,
		});
	});
	// Подсчет общей стоимости корзины
	const total = items.reduce((total, item) => total + item.price, 0);
	basket.total = total;
	appData.order.total = total;
});

// Обработчики форм заказа и контактов
events.on('order:open', () => {
	appData.order.items = appData.basket.map((item) => item.id);
	modal.render({
		content: order.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('order:submit', () => {
	appData.resetContacts();
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// Обработчики изменения полей форм
events.on(
	/^order\..*:change/,
	(data: { field: keyof IDeliveryForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContactsForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Обработчики валидации форм
events.on('order.payment:change', ({ name }: { name: string }) => {
	appData.order.payment = name;
	appData.validateOrderForm();
});

events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { payment, address, email, phone } = errors;

	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Обработчик отправки заказа
events.on('contacts:submit', () => {
	api
		.order(appData.order)
		.then(() => {
			success.total = `Списано ${appData.order.total} синапсов`;
			appData.clearBasket();
			modal.render({
				content: success.render({}),
			});
		})
		.catch((err) => console.error(err));
});
