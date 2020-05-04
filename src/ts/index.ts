import { GridGraph, BlockedGraph } from './graph';
import { Algorithm, DijkstraAlgorithm } from './algorithm';
import { RandomBlocker } from './blocker';
import AlgoRunner from './runner';

import '../styles/index.scss';

const $inputWeight = document.querySelector('#input-width') as HTMLInputElement;
const $inputHeight = document.querySelector('#input-height') as HTMLInputElement;
const $buttonChangeDimension = document.querySelector('#change-dimension') as HTMLElement;
const $buttonReset = document.querySelector('#reset') as HTMLElement;
const $boxes = document.querySelector('#boxes') as HTMLElement;

enum AlgoChoice {
    Dijkstra,
}
interface AppState {
    graph: GridGraph;
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
    const blocker = new RandomBlocker(20);

    appState.graph = new BlockedGraph(width, height, blocker);
    appState.graph.drawGraphOnHtml($boxes);
    appState.runner = new AlgoRunner(appState.graph, algoFactory(appState));
    appState.graph.setRunCallback( () => appState.runner.run() );
});

$buttonReset.addEventListener('click', () => {
    appState.runner.stop();
    appState.graph.reset();
});
