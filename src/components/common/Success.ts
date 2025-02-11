import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { ISuccess } from '../../types/types';

// Интерфейс для определения действий при успешном заказе
interface ISuccessActions {
	onClick: () => void; // Обработчик клика по кнопке закрытия
}

// Класс для отображения успешного оформления заказа
export class Success extends Component<ISuccess> {
	// Защищенные свойства для элементов DOM
	private readonly _total: HTMLElement; // Элемент с суммой заказа
	private readonly _closeButton: HTMLButtonElement; // Кнопка закрытия

	// Инициализация компонента
	constructor(
		container: HTMLElement,
		protected actions?: ISuccessActions
	) {
		super(container);

		// Находим необходимые элементы на странице
		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);

		// Добавляем обработчик клика, используя опциональную цепочку
		actions?.onClick &&
			this._closeButton.addEventListener('click', actions.onClick);
	}

	// Сеттер для установки итоговой суммы заказа
	set total(value: string) {
		this.setText(this._total, value);
	}
}
