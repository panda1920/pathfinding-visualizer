/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/ts/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/ts/graph.ts":
/*!*************************!*\
  !*** ./src/ts/graph.ts ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var GraphNode = /** @class */ (function () {
    function GraphNode(id) {
        this.width = 32;
        this.height = 32;
        this.id = id;
        this.edges = [];
    }
    GraphNode.prototype.createHTML = function () {
        var html = document.createElement('div');
        html.id = "" + this.id;
        html.style.display = 'inline-block';
        html.style.width = this.width + "px";
        html.style.height = this.height + "px";
        html.style.border = "1px solid black";
        html.style.borderCollapse = 'collapse';
        html.innerHTML = this.id.toString();
        return html;
    };
    GraphNode.prototype.addEdge = function (edge) {
        this.edges.push(edge);
    };
    return GraphNode;
}());
var GraphEdge = /** @class */ (function () {
    function GraphEdge() {
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        if (nodes.length !== 2)
            throw 'GraphEdge must be related to 2 nodes';
        this.nodes = nodes;
    }
    return GraphEdge;
}());
var GridGraph = /** @class */ (function () {
    function GridGraph(width, height) {
        var _this = this;
        this.clickHandler = function (e) {
            var target = e.target;
            var id = parseInt(target.id);
            var node = _this.nodes[id];
            console.log(node);
        };
        this.width = width;
        this.height = height;
        this.nodes = [];
        this.edges = [];
        this.createNodes();
        this.createEdges();
    }
    GridGraph.prototype.createNodes = function () {
        for (var y = 0; y < this.height; ++y) {
            for (var x = 0; x < this.width; ++x) {
                var nodeId = x + (y * this.width);
                this.nodes.push(new GraphNode(nodeId));
            }
        }
    };
    GridGraph.prototype.createEdges = function () {
        var _this = this;
        var isFirstRow = function (node) {
            return node.id < _this.width;
        };
        var isFirstCol = function (node) {
            return node.id % _this.width === 0;
        };
        this.nodes.forEach(function (node) {
            var connectedTo = [];
            if (!isFirstRow(node)) {
                var topNode = _this.nodes[node.id - _this.width];
                connectedTo.push(topNode);
            }
            if (!isFirstCol(node)) {
                var leftNode = _this.nodes[node.id - 1];
                connectedTo.push(leftNode);
            }
            _this.createEdge(node, connectedTo);
        });
    };
    GridGraph.prototype.createEdge = function (node, connectedTo) {
        var _this = this;
        connectedTo.forEach(function (connectedNode) {
            var edge = new GraphEdge(node, connectedNode);
            node.addEdge(edge);
            connectedNode.addEdge(edge);
            _this.edges.push(edge);
        });
    };
    GridGraph.prototype.drawGraphOnHtml = function (html) {
        var _this = this;
        this.nodes.forEach(function (node, idx) {
            if (idx % _this.width === 0 && idx !== 0) {
                html.appendChild(document.createElement('br'));
            }
            html.appendChild(_this.addClickHandler(node.createHTML()));
        });
    };
    GridGraph.prototype.addClickHandler = function (html) {
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
    };
    return GridGraph;
}());
/* harmony default export */ __webpack_exports__["default"] = (GridGraph);


/***/ }),

/***/ "./src/ts/index.ts":
/*!*************************!*\
  !*** ./src/ts/index.ts ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _graph__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./graph */ "./src/ts/graph.ts");

var $inputWeight = document.querySelector('#input-width');
var $inputHeight = document.querySelector('#input-height');
var $buttonChangeDimension = document.querySelector('#change-dimension');
var $boxes = document.querySelector('#boxes');
var appState = {
    graph: null,
};
$buttonChangeDimension.addEventListener('click', function () {
    $boxes.innerHTML = '';
    var width = parseInt($inputWeight.value);
    var height = parseInt($inputHeight.value);
    appState.graph = new _graph__WEBPACK_IMPORTED_MODULE_0__["default"](width, height);
    appState.graph.drawGraphOnHtml($boxes);
});


/***/ })

/******/ });
//# sourceMappingURL=index.bundle.js.map