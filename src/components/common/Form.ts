import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

// Интерфейс для определения состояния формы
interface IFormState {
	valid: boolean; // Валидность формы
	errors: string[]; // Массив ошибок
}

// Базовый класс для работы с формами
export class Form<T> extends Component<IFormState> {
	// Защищенные свойства для элементов формы
	protected readonly _submit: HTMLButtonElement; // Кнопка отправки формы
	protected readonly _errors: HTMLElement; // Контейнер для ошибок

	// Инициализация формы
	constructor(
		protected container: HTMLFormElement,
		protected events: IEvents
	) {
		super(container);

		// Находим необходимые элементы формы
		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		// Добавляем обработчик изменения полей формы
		this.container.addEventListener('input', this.handleInput);

		// Добавляем обработчик отправки формы
		this.container.addEventListener('submit', this.handleSubmit);
	}

	// Обработчик события ввода в поля формы
	private handleInput = (e: Event): void => {
		const target = e.target as HTMLInputElement;
		this.onInputChange(target.name as keyof T, target.value);
	};

	// Обработчик отправки формы
	private handleSubmit = (e: Event): void => {
		e.preventDefault();
		this.events.emit(`${this.container.name}:submit`);
	};

	// Метод обработки изменения значения поля
	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value,
		});
	}

	// Сеттер для управления активностью кнопки отправки
	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	// Сеттер для отображения ошибок формы
	set errors(value: string) {
		this.setText(this._errors, value);
	}

	// Метод рендеринга формы
	render(state: Partial<T> & IFormState) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		return Object.assign(this, inputs).container;
	}
}
