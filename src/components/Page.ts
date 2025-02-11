import { Component } from './base/component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

// Интерфейс для определения состояния страницы
interface IPage {
	counter: number; // Количество товаров в корзине
	catalog: HTMLElement[]; // Элементы каталога
	locked: boolean; // Состояние блокировки страницы
}

// Класс для управления основной страницей
export class Page extends Component<IPage> {
	// Защищенные свойства для хранения элементов DOM
	protected _counter: HTMLElement; // Счетчик товаров в корзине
	protected _catalog: HTMLElement; // Контейнер каталога
	protected _wrapper: HTMLElement; // Обертка страницы
	protected _basket: HTMLElement; // Кнопка корзины

	// Инициализация компонента страницы
	constructor(
		container: HTMLElement,
		protected events: IEvents
	) {
		super(container);

		// Находим необходимые элементы на странице
		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._catalog = ensureElement<HTMLElement>('.gallery');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basket = ensureElement<HTMLElement>('.header__basket');

		// Добавляем обработчик клика по корзине
		this._basket.addEventListener('click', () =>
			this.events.emit('basket:open')
		);
	}

	// Сеттер для обновления счетчика товаров
	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	// Сеттер для обновления каталога товаров
	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	// Сеттер для управления блокировкой страницы
	set locked(value: boolean) {
		// Проверка состояния блокировки и добавление/удаление класса
		if (value) {
			this._wrapper.classList.add('page__wrapper_locked');
		} else {
			this._wrapper.classList.remove('page__wrapper_locked');
		}
	}
}
