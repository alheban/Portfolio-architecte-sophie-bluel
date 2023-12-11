export function createElement(args) {
    const element = document.createElement(args.tag);
    element.innerText = args.text;
    element.classList.add(args.className);

    if (args.whereAppend) {
        args.whereAppend.appendChild(element);
    }

    return element;
}


