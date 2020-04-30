import GridGraph from './graph';
import { Algorithm } from './algorithm';

class AlgoRunner {
    private readonly STEP_INTERVAL = 500;

    constructor(
        private graph: GridGraph,
        private algoFactory: () => Algorithm
    ) {

    }

    run(): void {
        if (this.graph.nodesClicked.length <  2)
            throw 'Must click on 2 nodes';

        const algo = this.algoFactory();
        
        this.stepThroughAlgoRecursivelyWithTimer(algo);
    }

    private stepThroughAlgoRecursivelyWithTimer(algo: Algorithm): void {
        if (algo.isCompleted)
            return;
        
        setTimeout(() => {
            this.stepThroughAlgo(algo);
            this.stepThroughAlgoRecursivelyWithTimer(algo);
        }, this.STEP_INTERVAL);
    }

    private stepThroughAlgo(algo: Algorithm): void {
        const prevVisited = [...algo.shortestDistances]; // create clone
        algo.step();
        const visited = algo.shortestDistances;

        const isNewlyVisited = (nodeId: number): boolean =>
            prevVisited[nodeId] === Infinity && visited[nodeId] !== Infinity;

        for (let nodeId = 0; nodeId < this.graph.nodes.length; ++nodeId) {
            if (isNewlyVisited(nodeId))
                this.graph.nodes[nodeId].visited();
        }
    }
}

export default AlgoRunner;
