import GridGraph from './graph';
import { Algorithm } from './algorithm';

class AlgoRunner {
    private readonly STEP_INTERVAL = 200;
    private currentJobId: any = null;

    constructor(
        private graph: GridGraph,
        private algoFactory: () => Algorithm
    ) {

    }

    run(): void {
        const algo = this.algoFactory();
        
        this.stepThroughAlgoRecursivelyWithTimer(algo);
    }

    stop(): void {
        clearTimeout(this.currentJobId);
    }

    private stepThroughAlgoRecursivelyWithTimer(algo: Algorithm): void {
        if (algo.isCompleted) {
            const shortestPath = algo.calculateShortestPath();
            this.recursivelyDesignateShortestPathNodes(shortestPath);
            return;
        }

        this.currentJobId = setTimeout(() => {
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

        this.graph.nodes.forEach(node => {
            if (isNewlyVisited(node.id))
                node.visited();
        });
    }

    private recursivelyDesignateShortestPathNodes(shortestPath: number[]): void {
        if (shortestPath.length === 0)
            return;

        this.currentJobId = setTimeout(() => {
            const nodeInPath = this.graph.nodes[ shortestPath.pop() ];
            nodeInPath.designateShortestPath();
            this.recursivelyDesignateShortestPathNodes(shortestPath);
        }, this.STEP_INTERVAL);
    }
}

export default AlgoRunner;
