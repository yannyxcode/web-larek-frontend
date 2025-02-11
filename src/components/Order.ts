import { Form } from './common/Form';
import { IContactsForm, IDeliveryForm } from '../types/types';
import { IEvents } from './base/events';
import { ensureAllElements } from '../utils/utils';

// Класс для управления формой заказа
export class Order extends Form<IDeliveryForm & IContactsForm> {
	// Массив кнопок для выбора способа оплаты
	protected _payment: HTMLButtonElement[];

	// Инициализация формы заказа
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		// Находим все кнопки оплаты и добавляем обработчики
		this._payment = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			container
		);
		this._payment.forEach((button) =>
			button.addEventListener('click', () => this.selected(button.name))
		);
	}

	// Сеттер для установки адреса доставки
	set address(value: string) {
		const addressInput = this.container.elements.namedItem(
			'address'
		) as HTMLInputElement;
		addressInput.value = value;
	}

	// Сеттер для установки email
	set email(value: string) {
		const emailInput = this.container.elements.namedItem(
			'email'
		) as HTMLInputElement;
		emailInput.value = value;
	}

	// Сеттер для установки телефона
	set phone(value: string) {
		const phoneInput = this.container.elements.namedItem(
			'phone'
		) as HTMLInputElement;
		phoneInput.value = value;
	}

	// Сеттер для управления активностью кнопки отправки формы
	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	// Обработка выбора способа оплаты
	selected(name: string) {
		this._payment.forEach((button) => {
			const isSelected = button.name === name;
			this.toggleClass(button, 'button_alt-active', isSelected);
		});
		this.events.emit('order.payment:change', { name });
	}
}
