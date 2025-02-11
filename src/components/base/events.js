/**
 * Брокер событий, классическая реализация
 * В расширенных вариантах есть возможность подписаться на все события
 * или слушать события по шаблону например
 */
export class EventEmitter {
    constructor() {
        this._events = new Map();
    }
    /**
     * Установить обработчик на событие
     */
    on(eventName, callback) {
        var _a;
        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set());
        }
        (_a = this._events.get(eventName)) === null || _a === void 0 ? void 0 : _a.add(callback);
    }
    /**
     * Снять обработчик с события
     */
    off(eventName, callback) {
        var _a;
        if (this._events.has(eventName)) {
            this._events.get(eventName).delete(callback);
            if (((_a = this._events.get(eventName)) === null || _a === void 0 ? void 0 : _a.size) === 0) {
                this._events.delete(eventName);
            }
        }
    }
    /**
     * Инициировать событие с данными
     */
    emit(eventName, data) {
        this._events.forEach((subscribers, name) => {
            if (name === '*')
                subscribers.forEach(callback => callback({
                    eventName,
                    data
                }));
            if (name instanceof RegExp && name.test(eventName) || name === eventName) {
                subscribers.forEach(callback => callback(data));
            }
        });
    }
    /**
     * Слушать все события
     */
    onAll(callback) {
        this.on("*", callback);
    }
    /**
     * Сбросить все обработчики
     */
    offAll() {
        this._events = new Map();
    }
    /**
     * Сделать коллбек триггер, генерирующий событие при вызове
     */
    trigger(eventName, context) {
        return (event = {}) => {
            this.emit(eventName, Object.assign(Object.assign({}, (event || {})), (context || {})));
        };
    }
}
