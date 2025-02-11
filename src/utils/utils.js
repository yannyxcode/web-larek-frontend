export function pascalToKebab(value) {
    return value.replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase();
}
export function isSelector(x) {
    return (typeof x === "string") && x.length > 1;
}
export function isEmpty(value) {
    return value === null || value === undefined;
}
export function ensureAllElements(selectorElement, context = document) {
    if (isSelector(selectorElement)) {
        return Array.from(context.querySelectorAll(selectorElement));
    }
    if (selectorElement instanceof NodeList) {
        return Array.from(selectorElement);
    }
    if (Array.isArray(selectorElement)) {
        return selectorElement;
    }
    throw new Error(`Unknown selector element`);
}
export function ensureElement(selectorElement, context) {
    if (isSelector(selectorElement)) {
        const elements = ensureAllElements(selectorElement, context);
        if (elements.length > 1) {
            console.warn(`selector ${selectorElement} return more then one element`);
        }
        if (elements.length === 0) {
            throw new Error(`selector ${selectorElement} return nothing`);
        }
        return elements.pop();
    }
    if (selectorElement instanceof HTMLElement) {
        return selectorElement;
    }
    throw new Error('Unknown selector element');
}
export function cloneTemplate(query) {
    const template = ensureElement(query);
    return template.content.firstElementChild.cloneNode(true);
}
export function bem(block, element, modifier) {
    let name = block;
    if (element)
        name += `__${element}`;
    if (modifier)
        name += `_${modifier}`;
    return {
        name,
        class: `.${name}`
    };
}
export function getObjectProperties(obj, filter) {
    return Object.entries(Object.getOwnPropertyDescriptors(Object.getPrototypeOf(obj)))
        .filter(([name, prop]) => filter ? filter(name, prop) : (name !== 'constructor'))
        .map(([name, prop]) => name);
}
/**
 * Устанавливает dataset атрибуты элемента
 */
export function setElementData(el, data) {
    for (const key in data) {
        el.dataset[key] = String(data[key]);
    }
}
/**
 * Получает типизированные данные из dataset атрибутов элемента
 */
export function getElementData(el, scheme) {
    const data = {};
    for (const key in el.dataset) {
        data[key] = scheme[key](el.dataset[key]);
    }
    return data;
}
/**
 * Проверка на простой объект
 */
export function isPlainObject(obj) {
    const prototype = Object.getPrototypeOf(obj);
    return prototype === Object.getPrototypeOf({}) ||
        prototype === null;
}
export function isBoolean(v) {
    return typeof v === 'boolean';
}
/**
 * Фабрика DOM-элементов в простейшей реализации
 * здесь не учтено много факторов
 * в интернет можно найти более полные реализации
 */
export function createElement(tagName, props, children) {
    const element = document.createElement(tagName);
    if (props) {
        for (const key in props) {
            const value = props[key];
            if (isPlainObject(value) && key === 'dataset') {
                setElementData(element, value);
            }
            else {
                // @ts-expect-error fix indexing later
                element[key] = isBoolean(value) ? value : String(value);
            }
        }
    }
    if (children) {
        for (const child of Array.isArray(children) ? children : [children]) {
            element.append(child);
        }
    }
    return element;
}
