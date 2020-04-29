import GridGraph from './graph';

const $inputWeight = document.querySelector('#input-width') as HTMLInputElement;
const $inputHeight = document.querySelector('#input-height') as HTMLInputElement;
const $buttonChangeDimension = document.querySelector('#change-dimension') as HTMLElement;
const $boxes = document.querySelector('#boxes') as HTMLElement;

interface AppState { graph: GridGraph|null }
const appState: AppState = {
    graph: null,
};

$buttonChangeDimension.addEventListener('click', () => {
    $boxes.innerHTML = '';

    const width = parseInt( $inputWeight.value );
    const height = parseInt( $inputHeight.value );

    appState.graph = new GridGraph(width, height);
    appState.graph.drawGraphOnHtml($boxes);
});
