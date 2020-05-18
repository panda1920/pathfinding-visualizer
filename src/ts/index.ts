import { Dropdown } from './dropdown';
import { GridGraph, BlockedGraph } from './graph';
import { Algorithm, DijkstraAlgorithm } from './algorithm';
import { RandomBlocker } from './blocker';
import { GridSizeChoice, AlgoChoice, createKeysFromEnum } from './enums';
import AlgoRunner from './runner';

import '../styles/index.scss';

const $buttonChangeSize = document.querySelector('#change-size') as HTMLElement;
const $buttonReset = document.querySelector('#reset') as HTMLElement;
const $buttonAlgo = document.querySelector('#algorithm') as HTMLElement;
const $boxes = document.querySelector('#boxes') as HTMLElement;
let $sizeDropdown: Dropdown<typeof GridSizeChoice>;
let $algoDropdown: Dropdown<typeof AlgoChoice>;

interface AppState {
    graph: GridGraph;
    gridSize: GridSizeChoice;
    algoChoice: AlgoChoice;
    runner: AlgoRunner;
}
const appState: AppState = {
    graph: null,
    gridSize: GridSizeChoice.Small,
    algoChoice: AlgoChoice.Dijkstra,
    runner: null,
};
interface Dimension {
    width: number;
    height: number;
}

function convertGridSizeChoiceToDimension(gridSize: GridSizeChoice): Dimension {
    switch (gridSize) {
        case GridSizeChoice.Small: {
            return { width: 10, height: 8 };
        }
        case GridSizeChoice.Medium: {
            return { width: 20, height: 12 };
        }
        case GridSizeChoice.Large: {
            return { width: 30, height: 16 };
        }
    }
}

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

function createNewGraph(): void {
    const { width, height } = convertGridSizeChoiceToDimension(appState.gridSize);
    const blocker = new RandomBlocker(20);

    appState.graph = new BlockedGraph(width, height, blocker);
    appState.graph.drawGraphOnHtml($boxes);
    appState.runner = new AlgoRunner(appState.graph, algoFactory(appState));
    appState.graph.setRunCallback( () => appState.runner.run() );
}

function changeSize(sizeOption: string): void {
    appState.runner && appState.runner.stop();
    appState.graph && appState.graph.reset();
    $boxes.innerHTML = '';

    const gridSize = sizeOption as keyof typeof GridSizeChoice;
    appState.gridSize = GridSizeChoice[gridSize];

    createNewGraph();
}

function changeAlgo(algoOption: string): void {
    appState.runner && appState.runner.stop();
    appState.graph && appState.graph.reset();
    
    const algo = algoOption as keyof typeof AlgoChoice;
    appState.algoChoice = AlgoChoice[algo];
}

function initializeDropdowns(): void {
    const sizeChoices = createKeysFromEnum(GridSizeChoice) as (keyof typeof GridSizeChoice)[];
    $sizeDropdown = new Dropdown('sizes', sizeChoices, (size) => changeSize(size));
    $sizeDropdown.attachDropdown($buttonChangeSize);

    const algoChoices = createKeysFromEnum(AlgoChoice) as (keyof typeof AlgoChoice)[];
    $algoDropdown = new Dropdown('algos', algoChoices, (algo) => changeAlgo(algo));
    $algoDropdown.attachDropdown($buttonAlgo);
}

function initializeApp(): void {
    createNewGraph();
    $buttonReset.addEventListener('click', () => {
        appState.runner.stop();
        appState.graph.reset();
    });
}

initializeDropdowns();
initializeApp();
