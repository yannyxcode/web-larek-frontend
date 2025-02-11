import { Api } from './base/api';
// Класс реализующий API для работы с магазином
export class LarekApi extends Api {
    // Конструктор класса
    constructor(cdn, baseUrl, options) {
        super(baseUrl, options);
        this.cdn = cdn;
    }
    // Получение списка товаров с сервера
    getProductItems() {
        return this.get('/product').then((data) => {
            const itemsWithCdn = data.items.map((item) => {
                const updatedItem = Object.assign(Object.assign({}, item), { image: this.cdn + item.image });
                return updatedItem;
            });
            return itemsWithCdn;
        });
    }
    // Отправка заказа на сервер
    order(order) {
        return this.post('/order', order).then((data) => {
            return data;
        });
    }
}
