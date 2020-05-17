import { GridGraph, GraphNode } from './graph';

// class to figure out how to place blockers on the grid
abstract class Blocker {
    abstract block(graph: GridGraph): void;
}

// places blockers randomly on the grid
// makes sure there won't be any unreachable node
class RandomBlocker extends Blocker {
    private currentGraph: GridGraph = null;

    constructor(private percentageToBlock = 20) {
        super();

        if (percentageToBlock > 100 || percentageToBlock < 0)
            throw 'Percentage must be <= 100 and >= 0';
    }

    block(graph: GridGraph): void {
        this.currentGraph = graph;
        const nonBlockedNodeIds = new Set<number>( graph.nodes.map(node => node.id) );
        const targetRemainingNodeCount = nonBlockedNodeIds.size - this.calculateNodeCountToBlock();

        while (nonBlockedNodeIds.size > targetRemainingNodeCount) {
            this.blockNode(nonBlockedNodeIds);
        }
    }

    private calculateNodeCountToBlock(): number {
        return Math.floor(this.currentGraph.nodes.length * this.percentageToBlock / 100);
    }

    private blockNode(availableNodeIds: Set<number>): void {
        const nodeIdToBlock = this.selectNodeToBlock(availableNodeIds);

        this.currentGraph.nodes[nodeIdToBlock].block();

        availableNodeIds.delete(nodeIdToBlock);
    }

    private selectNodeToBlock(availableNodeIds: Set<number>): number {
        const nodeIds = Array.from(availableNodeIds);

        while (true) {
            const nodeIdToBlock = nodeIds[ Math.floor(Math.random() * nodeIds.length) ];
            if ( this.makesGraphUnreachable(nodeIdToBlock, availableNodeIds) )
                continue;
            return nodeIdToBlock;
        }
    }

    private makesGraphUnreachable(nodeId: number, availableNodeIds: Set<number>): boolean {
        this.currentGraph.nodes[nodeId].block();

        const visited = new Set<number>();
        const toVisit = [ availableNodeIds.values().next().value ];
        this.traverseGraphBreadthFirst(visited, toVisit);

        this.currentGraph.nodes[nodeId].unblock();

        return visited.size !== availableNodeIds.size - 1;
    }

    private traverseGraphBreadthFirst(visited: Set<number>, toVisit: Array<number>): void {
        if (toVisit.length === 0)
            return;

        const currentNode = this.currentGraph.nodes[toVisit[0]];
        toVisit.splice(0, 1);

        if (!visited.has(currentNode.id)) {
            currentNode.getAttachedNodes().forEach(node => {
                if (!visited.has(node.id))
                    toVisit.push(node.id);
            });
        }

        visited.add(currentNode.id);
        this.traverseGraphBreadthFirst(visited, toVisit);
    }
}

export { Blocker, RandomBlocker };
