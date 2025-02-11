import { IOrder, IOrderResult, IProductItem } from '../types/types';
import { Api, ApiListResponse } from './base/api';

// Интерфейс определяющий методы API для работы с магазином
export interface ILarekApi {
	getProductItems: () => Promise<IProductItem[]>;
	order: (order: IOrder) => Promise<IOrderResult>;
}

// Класс реализующий API для работы с магазином
export class LarekApi extends Api implements ILarekApi {
	// URL путь до CDN сервера
	readonly cdn: string;

	// Конструктор класса
	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	// Получение списка товаров с сервера
	getProductItems(): Promise<IProductItem[]> {
		return this.get('/product').then((data: ApiListResponse<IProductItem>) => {
			const itemsWithCdn = data.items.map((item) => {
				const updatedItem = {
					...item,
					image: this.cdn + item.image,
				};
				return updatedItem;
			});
			return itemsWithCdn;
		});
	}

	// Отправка заказа на сервер
	order(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => {
			return data;
		});
	}
}
