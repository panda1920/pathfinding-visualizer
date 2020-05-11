import UIkit from 'uikit';

class Option {
    public dom: HTMLElement;

    constructor(
        public optionString: string,
        clickHandler: (event: Event) => void
    ) {
        this.createHTML(optionString, clickHandler);
    }

    public select(): void {
        this.dom.classList.add('selected');
    }

    public deselect(): void {
        this.dom.classList.remove('selected');
    }

    public isSelected(): boolean {
        return this.dom.classList.contains('selected');
    }

    private createHTML(
        optionString: string,
        clickHandler: (event: Event) => void
    ): void {
        this.dom = document.createElement('li');
        this.dom.textContent = optionString;
        this.dom.classList.add('dropdown-option');
        this.dom.addEventListener('click', clickHandler);
    }
}

class Dropdown {
    // private readonly component: 
    private dropdown: HTMLElement;
    private _component: UIkit.UIkitDropdownElement;
    private options: Option[];

    constructor(
        uniqueName: string,
        optionStrings: string[],
        private callback: (choice: string) => void,
    ) {
        this.dropdown = this.createHTML(uniqueName, optionStrings, callback);
        document.body.appendChild(this.dropdown);
    }

    attachDropdown(html: HTMLElement): void {
        this._component = UIkit.dropdown(this.dropdown, {
            toggle: `#${html.id}`,
            mode: 'click',
        });
    }

    get component(): UIkit.UIkitDropdownElement {
        return this._component;
    }

    private createHTML(
        uniqueName: string,
        optionStrings: string[],
        callback: (choice: string) => void
    ): HTMLElement {
        const dropdown = document.createElement('div');
        dropdown.classList.add('dropdown-container');
        dropdown.id = uniqueName;
        
        const listContainer = document.createElement('ul');
        listContainer.classList.add('uk-nav');
        listContainer.classList.add('uk-dropdown-nav');
        dropdown.appendChild(listContainer);

        this.options = [];
        optionStrings.forEach((str, idx) => {
            const option = new Option(str, this.createClickHandler())
            if (idx === 0)
                option.select();
            listContainer.appendChild(option.dom);
            this.options.push(option);
        });

        return dropdown;
    }

    private createClickHandler(): (event: Event) => void {
        return (event: Event): void => {
            const choice = (event.target as HTMLElement).textContent;

            for (const option of this.options) {
                if (option.optionString === choice && option.isSelected())
                    return;
                else if (option.optionString === choice)
                    option.select();
                else
                    option.deselect();
            }

            this.callback(choice);
        };
    }
}


export { Dropdown };
