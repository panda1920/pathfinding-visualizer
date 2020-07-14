import { Dropdown } from './dropdown';
import { GridGraph, BlockedGraph } from './graph';
import { Algorithm, AstarAlgorithm, DijkstraAlgorithm } from './algorithm';
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

interface AppState {
    graph: GridGraph;
    gridSize: GridSizeChoice;
    algoChoice: AlgoChoice;
    runner: AlgoRunner;

    resetApp: () => void;
    algoFactory: () => () => Algorithm;
    createNewGraph: () => void;
    changeSize: (size: string) => void;
    changeAlgo: (algo: string) => void;
}

const appState: AppState = {
    graph: null,
    gridSize: GridSizeChoice.Small,
    algoChoice: AlgoChoice.Dijkstra,
    runner: null,
    
    resetApp(): void {
        this.runner && this.runner.stop();
        this.graph && this.graph.reset();
    },

    // returns a factory function that produces concrete algorithm object
    algoFactory(): () => Algorithm {
        return (): Algorithm => {
            switch (appState.algoChoice) {
                case AlgoChoice.Dijkstra: {
                    return new DijkstraAlgorithm(appState.graph);
                }
                case AlgoChoice.Astar: {
                    return new AstarAlgorithm(appState.graph);
                }
                default:
                    throw 'Undefined algorithm was chosen';
            }
        };
    },

    createNewGraph(): void {
        const { width, height } = convertGridSizeChoiceToDimension(this.gridSize);
        const blocker = new RandomBlocker(20);
    
        this.graph = new BlockedGraph(width, height, blocker);
        this.graph.drawGraphOnHtml($boxes);
        this.runner = new AlgoRunner(this.graph, this.algoFactory(this));
        this.graph.setRunCallback( () => this.runner.run() );
    },

    changeSize(sizeOption: string): void {
        this.resetApp();
        $boxes.innerHTML = '';
    
        const gridSize = sizeOption as keyof typeof GridSizeChoice;
        this.gridSize = GridSizeChoice[gridSize];
    
        this.createNewGraph();
    },
    
    changeAlgo(algoOption: string): void {
        this.resetApp();
        
        const algo = algoOption as keyof typeof AlgoChoice;
        this.algoChoice = AlgoChoice[algo];
    },
};

function initializeDropdowns(): void {
    const sizeChoices = createKeysFromEnum(GridSizeChoice) as (keyof typeof GridSizeChoice)[];
    $sizeDropdown = new Dropdown('sizes', sizeChoices, (size) => appState.changeSize(size));
    $sizeDropdown.attachDropdown($buttonChangeSize);

    const algoChoices = createKeysFromEnum(AlgoChoice) as (keyof typeof AlgoChoice)[];
    $algoDropdown = new Dropdown('algos', algoChoices, (algo) => appState.changeAlgo(algo));
    $algoDropdown.attachDropdown($buttonAlgo);
}

function initializeApp(): void {
    appState.createNewGraph();
    $buttonReset.addEventListener('click', () => {
        appState.resetApp();
    });
}

initializeDropdowns();
initializeApp();
