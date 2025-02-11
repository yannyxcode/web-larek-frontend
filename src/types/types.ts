// Интерфейс и типы данных, описывающие карточку товара
export interface IProductItem {
	id: string;
	title: string;
	image: string;
	category: string;
	description: string;
	price: number | null;
}

export type IBasketItem = Pick<IProductItem, 'id' | 'title' | 'price'>;
// Тип, описывающий элементы каталога
export type ICatalogItem = Pick<
	IProductItem,
	'id' | 'title' | 'price' | 'image' | 'category'
>;

// Интерфейс, описывающий информацию о пользователе
export interface IUserInfo {
	payment: string;
	address: string;
	email: string;
	phone: string;
}

// Интерфейс, описывающий поля форм заказа товара
export type IDeliveryForm = Pick<IUserInfo, 'payment' | 'address'>;
export type IContactsForm = Pick<IUserInfo, 'email' | 'phone'>;
export type IOrderForm = IDeliveryForm & IContactsForm;

// Интерфейс, описывающий заказ
export interface IOrder extends IOrderForm {
	items: string[];
	total: number;
}

// Интерфейс, описывающий результат оформления заказа
export interface IOrderResult {
	id: string;
	total: number;
}
export type ISuccess = Pick<IOrderResult, 'total'>;

// Интерфейс, описывающий состояние приложения
export interface IAppState {
	catalog: ICatalogItem[]; // Список товаров в каталоге
	basket: IBasketItem[]; // Список товаров в корзине
	preview: string | null; // Предварительный просмотр
	order: IOrder | null; // Заказ
	orderResponse: IOrderResult | null; // Ответ на заказ
	loading: boolean; // Статус загрузки
}

// Тип, описывающий ошибки валидации форм
export type FormErrors = Partial<Record<keyof IOrder, string>>;
