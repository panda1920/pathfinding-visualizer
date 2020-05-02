import GridGraph from './graph';
import { Algorithm, DijkstraAlgorithm } from './algorithm';
import AlgoRunner from './runner';

const $inputWeight = document.querySelector('#input-width') as HTMLInputElement;
const $inputHeight = document.querySelector('#input-height') as HTMLInputElement;
const $buttonChangeDimension = document.querySelector('#change-dimension') as HTMLElement;
const $buttonReset = document.querySelector('#reset') as HTMLElement;
const $boxes = document.querySelector('#boxes') as HTMLElement;

enum AlgoChoice {
    Dijkstra,
}
interface AppState {
    graph: GridGraph|null;
    algoChoice: AlgoChoice;
    runner: AlgoRunner;
}
const appState: AppState = {
    graph: null,
    algoChoice: AlgoChoice.Dijkstra,
    runner: null,
};

// returns a factory function that produces concrete algorithm object
function algoFactory(appState: AppState): () => Algorithm {
    return (): Algorithm => {
        switch(appState.algoChoice) {
            case AlgoChoice.Dijkstra: {
                return new DijkstraAlgorithm(appState.graph);
            }
            default:
                throw 'Undefined algorithm was chosen';
        }
    };
}

$buttonChangeDimension.addEventListener('click', () => {
    appState.runner && appState.runner.stop();
    appState.graph && appState.graph.reset();
    $boxes.innerHTML = '';

    const width = parseInt( $inputWeight.value );
    const height = parseInt( $inputHeight.value );

    appState.graph = new GridGraph(width, height);
    appState.graph.drawGraphOnHtml($boxes);
    appState.runner = new AlgoRunner(appState.graph, algoFactory(appState));
    appState.graph.setRunCallback( () => appState.runner.run() );
});

$buttonReset.addEventListener('click', () => {
    appState.runner.stop();
    appState.graph.reset();
});
