import GridGraph, { GraphNode } from './graph';

// class to figure out how to place blockers on the grid
abstract class Blocker {
    abstract block(graph: GridGraph): void;
}

// places blockers randomly on the grid
// makes sure there won't be any unreachable node that is not blocked
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
        const targetRemainingNodeCount = 
            nonBlockedNodeIds.size - 
            Math.floor(graph.width * graph.height * this.percentageToBlock / 100);

        while (nonBlockedNodeIds.size > targetRemainingNodeCount) {
            this.blockNode(nonBlockedNodeIds);
        }
    }

    private blockNode(availableNodeIds: Set<number>): void {
        const nodeIds = Array.from(availableNodeIds);
        const nodeIdToBlock = this.selectNodeToBlock(nodeIds);

        this.currentGraph.nodes[nodeIdToBlock].block();

        availableNodeIds.delete(nodeIdToBlock);
    }

    private selectNodeToBlock(nodeIds: number[]): number {
        while (true) {
            const nodeIdToBlock = nodeIds[ Math.floor(Math.random() * nodeIds.length) ];
            if ( this.makesGraphUnreachable(nodeIdToBlock) )
                continue;
            return nodeIdToBlock;
        }
    }

    private makesGraphUnreachable(nodeId: number): boolean {
        const isNodeBlocked = (node: GraphNode): boolean =>
            (node.id === nodeId) ? true : node.isBlocked;
        
        const nodesOnSameRow = this.listNodesOnSameRow(nodeId);
        if ( nodesOnSameRow.every(isNodeBlocked) ) {
            return true;
        }

        const nodesOnSameCol = this.listNodesOnSameCol(nodeId);
        if ( nodesOnSameCol.every(isNodeBlocked) ) {
            return true;
        }

        return false;
    }

    private listNodesOnSameRow(nodeId: number): GraphNode[] {
        const nodeRow = Math.floor(nodeId / this.currentGraph.width);
        const nodes =
            [...Array(this.currentGraph.width).keys()]
            .map(i => this.currentGraph.nodes[ i + nodeRow * this.currentGraph.width ]);

        return nodes;
    }

    private listNodesOnSameCol(nodeId: number): GraphNode[] {
        const nodeCol = nodeId % this.currentGraph.width;
        const nodes = [...Array(this.currentGraph.height).keys()]
            .map(i => this.currentGraph.nodes[ nodeCol + i * this.currentGraph.width ]);

        return nodes;
    }
}

export { Blocker, RandomBlocker };
