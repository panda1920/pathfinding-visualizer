class GraphNode {
    readonly edges: GraphEdge[];
    readonly html: HTMLElement;
    private readonly width = 32;
    private readonly height = 32;
    
    constructor(public readonly id: number) {
        this.edges = [];
        this.html = this.createHTML();
    }
    
    createHTML(): HTMLElement {
        const html = document.createElement('div');
        html.id = `${this.id}`;
        html.style.display = 'inline-block';
        html.style.width = `${this.width}px`;
        html.style.height = `${this.height}px`;
        html.style.border = `1px solid black`;
        html.style.borderCollapse = 'collapse';
        html.innerHTML = this.id.toString();

        return html;
    }

    addEdge(edge: GraphEdge): void {
        this.edges.push(edge);
    }

    isAttachedTo(node: GraphNode): boolean {
        if ( this.getAttachedNodes().find(attachedNode => attachedNode.id === node.id) )
            return true;
        else
            return false;
    }

    getAttachedNodes(): GraphNode[] {
        return this.edges.map(edge => {
            return edge.nodes.filter(node => node.id !== this.id)[0];
        });
    }
}

// A class that represents nodes in a grid
// Diffence between a generic node is that
// GridNode is aware of the fact that it is part of a grid,
// that it has maximum of 4 edges
class GridNode extends GraphNode {
    private gridWidth: number;
    private gridHeight: number;

    constructor(id: number, gridWidth: number, gridHeight: number) {
        super(id);
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
    }

    // getLeftEdge(): GraphEdge|null {
    //     const leftNodeId = this.id - 1;
    //     this.edges.find(edge => {
    //         edge.nodes[0] == 
    //     })
    // }
}

class GraphEdge {
    isBlocked: boolean;

    constructor(public readonly nodes: [GraphNode, GraphNode]) {

    }
}

class GridGraph {
    width: number;
    height: number;
    nodes: GraphNode[];
    edges: GraphEdge[];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.nodes = [];
        this.edges = [];

        this.createNodes();
        this.createEdges();
    }

    createNodes(): void {
        for (let y = 0; y < this.height; ++y) {
            for (let x = 0; x < this.width; ++x) {
                const nodeId = x + (y * this.width);
                this.nodes.push( new GridNode(nodeId, this.width, this.height) );
            }
        }
    }

    createEdges(): void {
        const isFirstRow = (node: GraphNode): boolean =>
            node.id < this.width;
        const isFirstCol = (node: GraphNode): boolean =>
            node.id % this.width === 0;

        this.nodes.forEach(node => {
            const connectedTo: GraphNode[] = [];
            if ( !isFirstRow(node) ) {
                const topNode = this.nodes[node.id - this.width];
                connectedTo.push(topNode);
            }
            if ( !isFirstCol(node) ) {
                const leftNode = this.nodes[node.id - 1];
                connectedTo.push(leftNode);
            }

            this.createEdge(node, connectedTo);
        });
    }

    createEdge(node: GraphNode, connectedTo: GraphNode[]): void {
        connectedTo.forEach(connectedNode => {
            const edge = new GraphEdge([node, connectedNode]);
            node.addEdge(edge);
            connectedNode.addEdge(edge);
            this.edges.push(edge);
        });
    }

    drawGraphOnHtml(html: HTMLElement): void {
        this.nodes.forEach((node, idx) => {
            if (idx % this.width === 0 && idx !== 0) {
                html.appendChild( document.createElement('br') );
            }
            html.appendChild( this.addClickHandler( node.html ) );
        });
    }

    addClickHandler(html: HTMLElement): HTMLElement {
        html.addEventListener('click', this.clickHandler);
        // html.addEventListener('click', (e) => {
        //     const target = e.target as HTMLElement;
        //     const id = parseInt( target.id );
        //     const node = this.nodes[id];
        //     console.log(node);
        // });
        // above code generates new function for every node
        // thought it would be more efficient to re-use the same function
        return html;
    }

    clickHandler = (e: Event): void => {
        const target = e.target as HTMLElement;
        const id = parseInt( target.id );
        const node = this.nodes[id];
        console.log(node);
    }
}

export default GridGraph;
