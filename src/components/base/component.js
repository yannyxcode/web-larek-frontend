export class Component {
    constructor(container) {
        this.container = container;
    }
    // Переключить класс
    toggleClass(element, className, force) {
        element.classList.toggle(className, force);
    }
    // Установить текстовое содержимое
    setText(element, value) {
        if (element)
            element.textContent = String(value);
    }
    // Сменить статус блокировки
    setDisabled(element, state) {
        if (element) {
            if (state)
                element.setAttribute('disabled', 'disabled');
            else
                element.removeAttribute('disabled');
        }
    }
    // Скрыть
    setHidden(element) {
        element.style.display = 'none';
    }
    // Показать
    setVisible(element) {
        element.style.removeProperty('display');
    }
    // Установить изображение с алтернативным текстом
    setImage(element, src, alt) {
        if (element) {
            element.src = src;
            if (alt)
                element.alt = alt;
        }
    }
    // Вернуть корневой DOM-элемент
    render(data) {
        Object.assign(this, data !== null && data !== void 0 ? data : {});
        return this.container;
    }
}
