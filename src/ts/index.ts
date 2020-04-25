import GridGraph from './graph';

const $inputWeight: HTMLInputElement = document.querySelector('#input-width');
const $inputHeight: HTMLInputElement = document.querySelector('#input-height');
const $buttonChangeDimension: HTMLElement = document.querySelector('#change-dimension');
const $boxes: HTMLElement = document.querySelector('#boxes');

const appState = {
    graph: null,
};

$buttonChangeDimension.addEventListener('click', () => {
    $boxes.innerHTML = '';

    const width = parseInt( $inputWeight.value );
    const height = parseInt( $inputHeight.value );

    appState.graph = new GridGraph(width, height);
    appState.graph.drawGraphOnHtml($boxes);
});
