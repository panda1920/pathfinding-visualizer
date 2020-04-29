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
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GraphNode = /*#__PURE__*/function () {
  function GraphNode(id) {
    _classCallCheck(this, GraphNode);

    this.width = 32;
    this.height = 32;
    this.id = id;
    this.edges = [];
    this.html = this.createHTML();
  }

  _createClass(GraphNode, [{
    key: "createHTML",
    value: function createHTML() {
      var html = document.createElement('div');
      html.id = "".concat(this.id);
      html.style.display = 'inline-block';
      html.style.width = "".concat(this.width, "px");
      html.style.height = "".concat(this.height, "px");
      html.style.border = "1px solid black";
      html.style.borderCollapse = 'collapse';
      html.innerHTML = this.id.toString();
      return html;
    }
  }, {
    key: "addEdge",
    value: function addEdge(edge) {
      this.edges.push(edge);
    }
  }, {
    key: "isAttachedTo",
    value: function isAttachedTo(node) {
      this.edges.forEach(function (edge) {
        if (edge.nodes.find(function (edgeNode) {
          return edgeNode.id === node.id;
        })) return true;
      });
      return false;
    }
  }]);

  return GraphNode;
}();

var GraphEdge = function GraphEdge(nodes) {
  _classCallCheck(this, GraphEdge);

  this.nodes = nodes;
};

var GridGraph = /*#__PURE__*/function () {
  function GridGraph(width, height) {
    var _this = this;

    _classCallCheck(this, GridGraph);

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

  _createClass(GridGraph, [{
    key: "createNodes",
    value: function createNodes() {
      for (var y = 0; y < this.height; ++y) {
        for (var x = 0; x < this.width; ++x) {
          var nodeId = x + y * this.width;
          this.nodes.push(new GraphNode(nodeId));
        }
      }
    }
  }, {
    key: "createEdges",
    value: function createEdges() {
      var _this2 = this;

      var isFirstRow = function isFirstRow(node) {
        return node.id < _this2.width;
      };

      var isFirstCol = function isFirstCol(node) {
        return node.id % _this2.width === 0;
      };

      this.nodes.forEach(function (node) {
        var connectedTo = [];

        if (!isFirstRow(node)) {
          var topNode = _this2.nodes[node.id - _this2.width];
          connectedTo.push(topNode);
        }

        if (!isFirstCol(node)) {
          var leftNode = _this2.nodes[node.id - 1];
          connectedTo.push(leftNode);
        }

        _this2.createEdge(node, connectedTo);
      });
    }
  }, {
    key: "createEdge",
    value: function createEdge(node, connectedTo) {
      var _this3 = this;

      connectedTo.forEach(function (connectedNode) {
        var edge = new GraphEdge([node, connectedNode]);
        node.addEdge(edge);
        connectedNode.addEdge(edge);

        _this3.edges.push(edge);
      });
    }
  }, {
    key: "drawGraphOnHtml",
    value: function drawGraphOnHtml(html) {
      var _this4 = this;

      this.nodes.forEach(function (node, idx) {
        if (idx % _this4.width === 0 && idx !== 0) {
          html.appendChild(document.createElement('br'));
        }

        html.appendChild(_this4.addClickHandler(node.html));
      });
    }
  }, {
    key: "addClickHandler",
    value: function addClickHandler(html) {
      html.addEventListener('click', this.clickHandler); // html.addEventListener('click', (e) => {
      //     const target = e.target as HTMLElement;
      //     const id = parseInt( target.id );
      //     const node = this.nodes[id];
      //     console.log(node);
      // });
      // above code generates new function for every node
      // thought it would be more efficient to re-use the same function

      return html;
    }
  }]);

  return GridGraph;
}();

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
  graph: null
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