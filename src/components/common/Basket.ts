import { Component } from '../base/component';
import { EventEmitter } from '../base/events';
import { ensureElement, createElement } from '../../utils/utils';
import { IBasketItem } from '../../types/types';

// Интерфейс для определения представления корзины
interface IBasketView {
	items: HTMLElement[]; // Массив элементов товаров
	total: number; // Общая сумма
	selected: string[]; // Выбранные товары
}

// Класс для управления корзиной
export class Basket extends Component<IBasketView> {
	// Защищенные свойства для элементов DOM
	protected _list: HTMLElement; // Список товаров
	protected _total: HTMLElement; // Элемент с общей суммой
	protected _button: HTMLElement; // Кнопка оформления заказа

	// Инициализация компонента корзины
	constructor(
		container: HTMLElement,
		protected events: EventEmitter
	) {
		super(container);

		// Находим необходимые элементы
		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		// Добавляем обработчик клика по кнопке оформления заказа
		this._button?.addEventListener('click', () =>
			this.events.emit('order:open')
		);
		this.items = [];
	}

	// Сеттер для обновления списка товаров
	set items(items: HTMLElement[]) {
		if (items.length) {
			// Если есть товары, отображаем их
			this._list.replaceChildren(...items);
		} else {
			// Если корзина пуста, показываем сообщение
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	// Сеттер для управления состоянием кнопки заказа
	set selected(items: IBasketItem[]) {
		if (items.length) {
			// Активируем кнопку если есть товары
			this.setDisabled(this._button, false);
		} else {
			// Деактивируем кнопку если корзина пуста
			this.setDisabled(this._button, true);
		}
	}

	// Сеттер для обновления общей суммы
	set total(total: number) {
		this.setText(this._total, `${total.toString()}` + ' синапсов');
	}
}
