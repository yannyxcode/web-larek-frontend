import { ensureElement } from '../utils/utils';
import { Component } from './base/component';

// Интерфейс для определения действий с карточкой
export interface ICardAction {
	onClick: (event: MouseEvent) => void;
}

// Интерфейс, описывающий структуру данных карточки
export interface ICard {
	basketCardIndex?: string;
	buttonTitle?: string;
	id: string;
	title: string;
	image: string;
	category: string;
	description: string;
	price: number | null;
}

// Класс для создания и управления карточкой товара
export class Card<T> extends Component<ICard> {
	// Приватные поля для хранения элементов DOM
	private _price: HTMLElement;
	private _title: HTMLElement;
	private _button?: HTMLButtonElement;
	private _image?: HTMLImageElement;
	private _basketCardIndex?: HTMLElement;
	private _category?: HTMLElement;
	private _description?: HTMLElement;

	// Словарь для маппинга категорий на соответствующие CSS-классы
	private static readonly categoryKey: Record<string, string> = {
		'хард-скил': '_hard',
		'софт-скил': '_soft',
		дополнительное: '_additional',
		кнопка: '_button',
		другое: '_other',
	};

	// Конструктор класса Card
	constructor(container: HTMLElement, action?: ICardAction) {
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
		this._title = ensureElement<HTMLElement>(elements.title, container);
		this._price = ensureElement<HTMLElement>(elements.price, container);
		this._image = container.querySelector(elements.image);
		this._category = container.querySelector(elements.category);
		this._description = container.querySelector(elements.description);
		this._button = container.querySelector(elements.button);
		this._basketCardIndex = container.querySelector(elements.basketIndex);

		// Добавление обработчика клика
		if (action?.onClick) {
			const target = this._button || container;
			target.addEventListener('click', action.onClick);
		}
	}

	// Отключает кнопку, если цена равна null
	disableButton(value: number | null): void {
		if (!value && this._button) {
			this._button.disabled = true;
		}
	}

	// Устанавливает идентификатор карточки в data-атрибут контейнера
	set id(value: string) {
		this.container.dataset.id = value;
	}

	// Возвращает идентификатор карточки из data-атрибута контейнера
	get id(): string {
		return this.container.dataset.id || '';
	}

	// Устанавливает индекс карточки в корзине
	set basketCardIndex(value: string) {
		this._basketCardIndex.textContent = value;
	}

	// Возвращает индекс карточки в корзине
	get basketCardIndex(): string {
		return this._basketCardIndex.textContent || '';
	}

	// Устанавливает заголовок карточки
	set title(value: string) {
		this.setText(this._title, value);
	}

	// Возвращает текущий заголовок карточки
	get title(): string {
		return this._title.textContent || '';
	}

	// Устанавливает текст на кнопке карточки
	set buttonTitle(value: string) {
		if (this._button) {
			this._button.textContent = value;
		}
	}

	// Устанавливает изображение карточки
	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	// Устанавливает цену карточки и обновляет состояние кнопки
	set price(value: number | null) {
		this.setText(
			this._price,
			value ? `${value.toString()} синапсов` : 'Бесценно'
		);
		this.disableButton(value);
	}

	// Возвращает текущую цену карточки
	get price(): number {
		return Number(this._price.textContent || '');
	}

	// Устанавливает категорию карточки и соответствующий CSS-класс
	set category(value: string) {
		if (!this._category) return;

		this.setText(this._category, value);
		const baseClass = this._category.classList[0];
		this._category.className = baseClass;
		this._category.classList.add(`${baseClass}${Card.categoryKey[value]}`);
	}

	// Устанавливает описание карточки
	// Поддерживает как одиночные строки, так и массивы строк
	set description(value: string | string[]) {
		if (!this._description) return;

		if (Array.isArray(value)) {
			const fragments = value.map((str) => {
				const descTemplate = this._description!.cloneNode() as HTMLElement;
				this.setText(descTemplate, str);
				return descTemplate;
			});
			this._description.replaceWith(...fragments);
		} else {
			this.setText(this._description, value);
		}
	}
}
