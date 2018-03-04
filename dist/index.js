module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading wasm modules
/******/ 	var installedWasmModules = {};
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
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
/******/ 	// object with all compiled WebAssembly.Modules
/******/ 	__webpack_require__.w = {};
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./.rootrc":
/*!*****************!*\
  !*** ./.rootrc ***!
  \*****************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {"var":"var/"}

/***/ }),

/***/ "./src/dbRouter.js":
/*!*************************!*\
  !*** ./src/dbRouter.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var koa_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! koa-router */ "koa-router");
/* harmony import */ var koa_router__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(koa_router__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var koa_bodyparser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! koa-bodyparser */ "koa-bodyparser");
/* harmony import */ var koa_bodyparser__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(koa_bodyparser__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _dbs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dbs */ "./src/dbs.js");





const router = new koa_router__WEBPACK_IMPORTED_MODULE_0___default.a();

const mapDbKeys = ({ name, temp, created }) => ({ name, temp, created });

router.use(koa_bodyparser__WEBPACK_IMPORTED_MODULE_1___default()({
  enableTypes: ['json']
})).get('/', async ctx => {
  const list = await _dbs__WEBPACK_IMPORTED_MODULE_2__["index"]().find({});

  ctx.body = {
    data: {
      databases: list.map(mapDbKeys)
    }
  };
}).get('/:name', async ctx => {
  ctx.assert(_dbs__WEBPACK_IMPORTED_MODULE_2__["has"](ctx.params.name), 404);

  const db = await _dbs__WEBPACK_IMPORTED_MODULE_2__["index"]().findOne({ name: ctx.params.name });

  ctx.body = {
    data: mapDbKeys(db)
  };
}).post('/:name/:method', async ctx => {
  const db = _dbs__WEBPACK_IMPORTED_MODULE_2__["get"](ctx.params.name);

  ctx.assert(typeof db[ctx.params.method] == 'function', 400, `Unknown nedb instance method: '${ctx.params.method}'`);

  const data = await db[ctx.params.method](ctx.request.body);

  ctx.body = {
    data
  };
}).post('/', async ctx => {
  await _dbs__WEBPACK_IMPORTED_MODULE_2__["create"](ctx.request.body.name, ctx.request.body.temp);

  ctx.status = 201;
}).delete('/:name', async ctx => {
  await _dbs__WEBPACK_IMPORTED_MODULE_2__["remove"](ctx.params.name);

  ctx.status = 204;
});

/* harmony default export */ __webpack_exports__["default"] = (router);

/***/ }),

/***/ "./src/dbs.js":
/*!********************!*\
  !*** ./src/dbs.js ***!
  \********************/
/*! exports provided: create, remove, index, get, has */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create", function() { return create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "remove", function() { return remove; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "index", function() { return index; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get", function() { return get; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "has", function() { return has; });
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var async__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! async */ "async");
/* harmony import */ var async__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(async__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var nedb_promise__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! nedb-promise */ "nedb-promise");
/* harmony import */ var nedb_promise__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(nedb_promise__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var http_errors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! http-errors */ "http-errors");
/* harmony import */ var http_errors__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(http_errors__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _paths__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ~paths */ "./.rootrc");
/* harmony import */ var _paths__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_paths__WEBPACK_IMPORTED_MODULE_5__);








const MAX_NAME_LENGTH = 32;
const indexDbName = '_index';
const dbs = new Map();

const createPath = name => path__WEBPACK_IMPORTED_MODULE_0___default.a.resolve(_paths__WEBPACK_IMPORTED_MODULE_5___default.a.var, `${name}.db`);

const createDb = (name, temp) => {
  if (typeof name != 'string') {
    throw new http_errors__WEBPACK_IMPORTED_MODULE_4___default.a(400, 'Database name should be a string');
  }

  if (!name.length || name.length > MAX_NAME_LENGTH) {
    throw new http_errors__WEBPACK_IMPORTED_MODULE_4___default.a(400, `Database name length should contain 1-${MAX_NAME_LENGTH}`);
  }

  if (dbs.has(name)) {
    throw new http_errors__WEBPACK_IMPORTED_MODULE_4___default.a(400, 'Database name already exists');
  }

  const db = new nedb_promise__WEBPACK_IMPORTED_MODULE_3___default.a({
    autoload: true,
    filename: temp ? undefined : createPath(name)
  });

  dbs.set(name, db);

  return db;
};

(async function init() {
  try {
    const indexDb = await createDb(indexDbName, false);

    const dbNames = await indexDb.find({});

    async__WEBPACK_IMPORTED_MODULE_2___default.a.forEach(dbNames, async ({ name, temp }) => {
      await createDb(name, temp);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();

const create = async (name, temp) => {
  if (name == indexDbName) {
    throw new http_errors__WEBPACK_IMPORTED_MODULE_4___default.a(400, 'Could not use reserved database name');
  }

  const db = createDb(name, temp);

  await dbs.get(indexDbName).insert({
    name,
    temp: !!temp,
    created: Date.now()
  });

  return db;
};

const remove = async name => {
  if (typeof name != 'string' || !name.length) {
    throw new http_errors__WEBPACK_IMPORTED_MODULE_4___default.a(400, 'Database name should be a string');
  }

  if (!dbs.has(name)) {
    throw new http_errors__WEBPACK_IMPORTED_MODULE_4___default.a(404, 'Database does not exist');
  }

  await dbs.get(indexDbName).remove({ name });

  await new Promise((resolve, reject) => {
    fs__WEBPACK_IMPORTED_MODULE_1___default.a.unlink(createPath(name), err => err ? reject() : resolve());
  });

  dbs.delete(name);
};

const index = () => dbs.get(indexDbName);

const get = name => dbs.get(name);
const has = name => dbs.has(name);

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var koa__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! koa */ "koa");
/* harmony import */ var koa__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(koa__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _dbRouter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dbRouter */ "./src/dbRouter.js");




const app = new koa__WEBPACK_IMPORTED_MODULE_0___default.a();

app.use(_dbRouter__WEBPACK_IMPORTED_MODULE_1__["default"].routes());
app.use(_dbRouter__WEBPACK_IMPORTED_MODULE_1__["default"].allowedMethods());

const PORT = 27001;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Listening on ${HOST}:${PORT}`);
});

/* harmony default export */ __webpack_exports__["default"] = (app);

/***/ }),

/***/ "async":
/*!************************!*\
  !*** external "async" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("async");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "http-errors":
/*!******************************!*\
  !*** external "http-errors" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http-errors");

/***/ }),

/***/ "koa":
/*!**********************!*\
  !*** external "koa" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("koa");

/***/ }),

/***/ "koa-bodyparser":
/*!*********************************!*\
  !*** external "koa-bodyparser" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("koa-bodyparser");

/***/ }),

/***/ "koa-router":
/*!*****************************!*\
  !*** external "koa-router" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("koa-router");

/***/ }),

/***/ "nedb-promise":
/*!*******************************!*\
  !*** external "nedb-promise" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("nedb-promise");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ })

/******/ });
//# sourceMappingURL=index.js.map