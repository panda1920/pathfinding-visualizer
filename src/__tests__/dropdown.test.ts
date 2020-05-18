import { Dropdown } from '../ts/dropdown';

describe('testing bahavior of Dropdown', () => {
    const uniqueName = 'dropdown';
    enum options {
        option1,
        option2,
        option3
    }
    const mockCallback = jest.fn().mockName('mocked callback');
    let dropdown: Dropdown<typeof options>;
    let toggle: HTMLElement;

    beforeEach(() => {
        toggle = document.createElement('div');
        toggle.id = 'toggle';
        window.document.body.appendChild(toggle);

        mockCallback.mockClear();
        
        dropdown = new Dropdown(
            uniqueName,
            ["option1", "option2", "option3"],
            mockCallback
        );
        dropdown.attachDropdown(toggle);
    });
    afterEach(() => {
        window.document.body.innerHTML = '';
    });

    test('should create element with id as uniquename', () => {
        const elements = Array.from(window.document.body.children);
        const dropdownContent = elements.find(el => el.id === uniqueName);
        
        expect(dropdownContent).not.toBeUndefined();
    });

    test('should create list of option elements', () => {
        const dropdownContent = document.querySelector(`#${uniqueName}`);
        const child = Array.from(dropdownContent.children);

        expect(child).toHaveLength(1);
        expect(child[0].tagName).toBe('UL');

        const optionsDOM = Array.from(child[0].children);

        expect(optionsDOM).toHaveLength(3);
        expect(optionsDOM[0].textContent).toBe(options[0]);
        expect(optionsDOM[1].textContent).toBe(options[1]);
        expect(optionsDOM[2].textContent).toBe(options[2]);
        expect(optionsDOM[0].classList.contains('dropdown-option')).toBe(true);
        expect(optionsDOM[1].classList.contains('dropdown-option')).toBe(true);
        expect(optionsDOM[2].classList.contains('dropdown-option')).toBe(true);
    });

    test('should attach itself to toggle element', () => {
        const uikitcomponent = dropdown.component as Record<string, any>;
        expect(uikitcomponent.toggle.$el).toEqual(toggle);
    });

    test('clicking on option should trigger callback', () => {
        const optionsDOM = document.querySelectorAll('.dropdown-option');

        (optionsDOM[1] as HTMLElement).click();

        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith(options[1]);
    });

    test('by default first option should be selected', () => {
        const optionsDOM = document.querySelectorAll('.dropdown-option');

        expect(optionsDOM[0].classList.contains('selected')).toBe(true);
        expect(optionsDOM[1].classList.contains('selected')).toBe(false);
        expect(optionsDOM[2].classList.contains('selected')).toBe(false);
    });

    test('clicking on option should apply selected class to clicked option', () => {
        const optionsDOM = document.querySelectorAll('.dropdown-option');

        (optionsDOM[1] as HTMLElement).click();

        expect(optionsDOM[0].classList.contains('selected')).toBe(false);
        expect(optionsDOM[1].classList.contains('selected')).toBe(true);
        expect(optionsDOM[2].classList.contains('selected')).toBe(false);
    });

    test('clicking on option already selected should not call callback', () => {
        const optionsDOM = document.querySelectorAll('.dropdown-option');

        (optionsDOM[0] as HTMLElement).click();

        expect(mockCallback).toHaveBeenCalledTimes(0);
    });
});
