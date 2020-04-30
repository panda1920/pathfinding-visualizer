import GridGraph from './graph';

abstract class Algorithm {
    readonly shortestDistances: number[];
    private _isCompleted = false;

    protected constructor(
        protected graph: GridGraph,
        protected initialNodeId: number,
        protected targetNodeId: number
    ) {
        this.shortestDistances = graph.nodes.map(() => Infinity);
        this.shortestDistances[initialNodeId] = 0;
    }

    get isCompleted(): boolean {
        return this._isCompleted;
    }

    protected complete(): void {
        this._isCompleted = true;
    }

    abstract step(): void;
}

class DijkstraAlgorithm extends Algorithm {
    private unvisitedNodes: Set<number>;

    constructor(graph: GridGraph, initialNodeId: number, targetNodeId: number) {
        super(graph, initialNodeId, targetNodeId);

        this.unvisitedNodes = new Set( graph.nodes.map(node => node.id) );
    }

    step(): void {
        const currentNodeId = this.getCurrentNode();
        const newDist = this.shortestDistances[currentNodeId] + 1;
        const attachedNodes = this.graph.nodes[currentNodeId].getAttachedNodes();
        
        attachedNodes.forEach(node => {
            const nodeDist = this.shortestDistances[node.id];
            this.shortestDistances[node.id] = Math.min(newDist, nodeDist);
        });

        this.determineCompletion();
    }

    private getCurrentNode(): number {
        let minId: number;
        let minDistance = Infinity;
        const isNotVisited = (nodeId: number): boolean => this.unvisitedNodes.has(nodeId);

        this.shortestDistances.forEach((dist, nodeId) => {
            if ( isNotVisited(nodeId) && dist < minDistance ) {
                minId = nodeId;
                minDistance = dist;
            }
        });

        this.unvisitedNodes.delete(minId);
        return minId;
    }

    private determineCompletion(): void {
        if (!this.unvisitedNodes.has(this.targetNodeId))
            this.complete();
    }
}

export { Algorithm, DijkstraAlgorithm };
