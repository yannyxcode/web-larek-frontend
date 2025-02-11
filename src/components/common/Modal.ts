import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

// Интерфейс для определения данных модального окна
interface IModalData {
	content: HTMLElement; // Содержимое модального окна
}

// Класс для управления модальным окном
export class Modal extends Component<IModalData> {
	// Защищенные свойства для элементов DOM
	private readonly _content: HTMLElement; // Контейнер для контента
	private readonly _closeButton: HTMLButtonElement; // Кнопка закрытия

	// Инициализация модального окна
	constructor(
		container: HTMLElement,
		protected events: IEvents
	) {
		super(container);

		// Инициализация DOM-элементов с использованием приватных readonly свойств
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		// Привязка обработчиков событий с использованием стрелочных функций
		this._closeButton.addEventListener('click', this.handleClose);
		this.container.addEventListener('click', this.handleClose);
		this._content.addEventListener('click', this.handleContentClick);
	}

	// Обработчики событий как приватные методы
	private handleClose = (): void => {
		this.close();
	};

	private handleContentClick = (event: Event): void => {
		event.stopPropagation();
	};

	// Сеттер для обновления содержимого модального окна
	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	// Метод открытия модального окна
	public open(): void {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	// Метод закрытия модального окна
	public close(): void {
		this.container.classList.remove('modal_active');
		this.content = null;
		this.events.emit('modal:close');
	}

	// Метод рендеринга модального окна
	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
