/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}

/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "e04302f006ae2c9c7237"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				fn[name] = __webpack_require__[name];
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Game = __webpack_require__(2);
	__webpack_require__(11);

	React.render(React.createElement(Game, null), document.getElementById('container'));

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var StarsFrame = __webpack_require__(4);

	var ButtonFrame = __webpack_require__(5);

	var AnswerFrame = __webpack_require__(6);

	var NumbersFrame = __webpack_require__(7);

	var DoneFrame = __webpack_require__(3);

	var ScoreBoard = __webpack_require__(8);

	var TopScores = __webpack_require__(9);

	var PossibleCominationSum = __webpack_require__(10);

	var Game = React.createClass({
		displayName: 'Game',

		getInitialState: function getInitialState() {
			return {
				numberOfStars: this.randomNumber(),
				selectedNumbers: [],
				usedNumbers: [],
				redraws: 5,
				correct: null,
				doneStatus: null,
				score: 0,
				highScore: 0 };
		},
		getResetState: function getResetState() {
			var highScore = this.state.highScore;
			return {
				numberOfStars: this.randomNumber(),
				selectedNumbers: [],
				usedNumbers: [],
				redraws: 5,
				correct: null,
				doneStatus: null,
				score: 0,
				highScore: highScore };
		},
		resetGame: function resetGame() {
			this.replaceState(this.getResetState());
		},
		randomNumber: function randomNumber() {
			return Math.floor(Math.random() * 9) + 1;
		},
		possibleSolution: function possibleSolution() {
			var numberOfStars = this.state.numberOfStars;
			var usedNumbers = this.state.usedNumbers;
			var possibleNumbers = [];

			for (var i = 0; i <= 9; i++) {
				if (usedNumbers.indexOf(i) < 0) {
					possibleNumbers.push(i);
				}
			}

			return PossibleCominationSum(possibleNumbers, numberOfStars);
		},
		updateDoneStatus: function updateDoneStatus() {
			if (this.state.usedNumbers.length === 9) {
				this.setState({ doneStatus: 'You win!' });
				return;
			}

			if (this.state.redraws === 0 && !this.possibleSolution()) {
				this.setState({ doneStatus: 'You lose. Game over' });
			}

			if (this.state.score > this.state.highScore) {
				this.setState({ highScore: this.state.score });
			}
		},
		selectNumber: function selectNumber(clickedNumber) {
			if (this.state.selectedNumbers.indexOf(clickedNumber) < 0) {
				this.setState({ selectedNumbers: this.state.selectedNumbers.concat(clickedNumber),
					correct: null });
			}
		},
		unselectNumber: function unselectNumber(clickedNumber) {
			var selectedNumbers = this.state.selectedNumbers;
			var indexOfNumber = selectedNumbers.indexOf(clickedNumber);

			selectedNumbers.splice(indexOfNumber, 1);

			this.setState({ selectedNumbers: selectedNumbers, correct: null });
		},
		checkAnswer: function checkAnswer() {
			var correct = this.state.numberOfStars === this.sumOfSelectedNumbers();
			this.setState({ correct: correct });
		},
		sumOfSelectedNumbers: function sumOfSelectedNumbers() {
			return this.state.selectedNumbers.reduce(function (p, n) {
				return p + n;
			}, 0);
		},
		redraw: function redraw() {
			if (this.state.redraws > 0) {
				this.setState({
					numberOfStars: this.randomNumber(),
					selectedNumbers: [],
					correct: null,
					redraws: this.state.redraws - 1
				}, function () {
					this.updateDoneStatus();
				});
			}
		},
		acceptAnswer: function acceptAnswer() {
			var usedNumbers = this.state.usedNumbers.concat(this.state.selectedNumbers);
			this.setState({
				selectedNumbers: [],
				usedNumbers: usedNumbers,
				correct: null,
				numberOfStars: this.randomNumber(),
				score: this.state.score + 10
			}, function () {
				this.updateDoneStatus();
			});
		},
		render: function render() {
			var selectedNumbers = this.state.selectedNumbers;
			var usedNumbers = this.state.usedNumbers;
			var numberOfStars = this.state.numberOfStars;
			var correct = this.state.correct;
			var redraws = this.state.redraws;
			var doneStatus = this.state.doneStatus;
			var score = this.state.score;
			var highScore = this.state.highScore;
			var buttonFrame;

			if (doneStatus) {
				buttonFrame = React.createElement(DoneFrame, { doneStatus: doneStatus, resetGame: this.resetGame });
			} else {
				buttonFrame = React.createElement(NumbersFrame, { selectedNumbers: selectedNumbers, selectNumber: this.selectNumber, usedNumbers: usedNumbers });
			}

			return React.createElement(
				'div',
				{ id: "game" },
				React.createElement(
					'h2',
					null,
					'Play Nine'
				),
				React.createElement('hr', null),
				React.createElement(
					'div',
					{ className: "clearfix" },
					React.createElement(StarsFrame, { numberOfStars: numberOfStars }),
					React.createElement(ButtonFrame, { selectedNumbers: selectedNumbers, correct: correct, checkAnswer: this.checkAnswer,
						acceptAnswer: this.acceptAnswer, redraw: this.redraw, redraws: redraws }),
					React.createElement(AnswerFrame, { selectedNumbers: selectedNumbers, unselectNumber: this.unselectNumber })
				),
				buttonFrame,
				React.createElement('br', null),
				React.createElement('hr', null),
				React.createElement(
					'div',
					{ className: "clearfix" },
					React.createElement(ScoreBoard, { score: score, highScore: highScore }),
					React.createElement(TopScores, null)
				)
			);
		}
	});

	module.exports = Game;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	var DoneFrame = React.createClass({
		displayName: "DoneFrame",

		render: function render() {
			return React.createElement(
				"div",
				{ className: "well text-center" },
				React.createElement(
					"h2",
					null,
					this.props.doneStatus
				),
				React.createElement(
					"button",
					{ className: "btn btn-default", onClick: this.props.resetGame },
					"Play Again"
				)
			);
		}
	});

	module.exports = DoneFrame;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	var StarsFrame = React.createClass({
		displayName: "StarsFrame",

		render: function render() {
			var stars = [];
			for (var i = 0; i < this.props.numberOfStars; i++) {
				stars.push(React.createElement("span", { className: "glyphicon glyphicon-star" }));
			}
			return React.createElement(
				"div",
				{ id: "stars-frame" },
				React.createElement(
					"div",
					{ className: "well" },
					stars
				)
			);
		}
	});

	module.exports = StarsFrame;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	var ButtonFrame = React.createClass({
		displayName: "ButtonFrame",

		render: function render() {
			var disabled;
			var correct = this.props.correct;
			var button;
			switch (correct) {
				case true:
					button = React.createElement(
						"button",
						{ className: "btn btn-success btn-lg", onClick: this.props.acceptAnswer },
						React.createElement("span", { className: "glyphicon glyphicon-ok" })
					);
					break;
				case false:
					button = React.createElement(
						"button",
						{ className: "btn btn-danger btn-lg" },
						React.createElement("span", { className: "glyphicon glyphicon-remove" })
					);
					break;
				default:
					disabled = this.props.selectedNumbers.length === 0;
					button = React.createElement(
						"button",
						{ className: "btn btn-primary btn-lg", disabled: disabled, onClick: this.props.checkAnswer },
						"="
					);
			}

			return React.createElement(
				"div",
				{ id: "button-frame" },
				button,
				React.createElement("br", null),
				React.createElement("br", null),
				React.createElement(
					"button",
					{ className: "btn btn-warning btn-xs", onClick: this.props.redraw, disabled: this.props.redraws === 0 },
					React.createElement("span", { className: "glyphicon glyphicon-refresh" }),
					" ",
					this.props.redraws
				)
			);
		}
	});

	module.exports = ButtonFrame;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	var AnswerFrame = React.createClass({
		displayName: "AnswerFrame",

		render: function render() {
			var props = this.props;
			var selectedNumbers = props.selectedNumbers.map(function (i) {
				return React.createElement(
					"span",
					{ onClick: props.unselectNumber.bind(null, i) },
					i
				);
			});

			return React.createElement(
				"div",
				{ id: "answer-frame" },
				React.createElement(
					"div",
					{ className: "well" },
					selectedNumbers
				)
			);
		}
	});

	module.exports = AnswerFrame;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	var NumbersFrame = React.createClass({
		displayName: "NumbersFrame",

		render: function render() {
			var numbers = [];
			var className;
			var selectedNumbers = this.props.selectedNumbers;
			var usedNumbers = this.props.usedNumbers;
			var selectNumber = this.props.selectNumber;

			for (var i = 1; i <= 9; i++) {
				className = "number selected-" + (selectedNumbers.indexOf(i) >= 0);
				className += " used-" + (usedNumbers.indexOf(i) >= 0);
				numbers.push(React.createElement(
					"div",
					{ className: className, onClick: selectNumber.bind(null, i) },
					i
				));
			}

			return React.createElement(
				"div",
				{ id: "numbers-frame" },
				React.createElement(
					"div",
					{ className: "well" },
					numbers
				)
			);
		}
	});

	module.exports = NumbersFrame;

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	var ScoreBoard = React.createClass({
		displayName: "ScoreBoard",

		render: function render() {
			return React.createElement(
				"div",
				{ id: "scoreboard-frame" },
				React.createElement(
					"div",
					{ className: "well" },
					React.createElement(
						"h3",
						null,
						"Score"
					),
					React.createElement(
						"h4",
						null,
						this.props.score
					),
					React.createElement(
						"h3",
						null,
						"Your High Score"
					),
					React.createElement(
						"h4",
						null,
						this.props.highScore
					)
				)
			);
		}
	});

	module.exports = ScoreBoard;

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";

	var TopScores = React.createClass({
		displayName: "TopScores",

		render: function render() {
			return React.createElement(
				"div",
				{ id: "topscores-frame" },
				React.createElement(
					"div",
					{ className: "well" },
					React.createElement(
						"h3",
						null,
						"Top Scores"
					),
					React.createElement(
						"ol",
						null,
						React.createElement(
							"li",
							null,
							"1. Test - 10000"
						),
						React.createElement(
							"li",
							null,
							"2. Test2 - 9999"
						),
						React.createElement(
							"li",
							null,
							"3. Test3 - 888"
						)
					)
				)
			);
		}
	});

	module.exports = TopScores;

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";

	var PossibleCombinationSum = function PossibleCombinationSum(_x, _x2) {
	  var _again = true;

	  _function: while (_again) {
	    var arr = _x,
	        n = _x2;
	    listSize = combinationsCount = i = combinationSum = j = undefined;
	    _again = false;

	    if (arr.indexOf(n) >= 0) {
	      return true;
	    }
	    if (arr[0] > n) {
	      return false;
	    }
	    if (arr[arr.length - 1] > n) {
	      arr.pop();
	      _x = arr;
	      _x2 = n;
	      _again = true;
	      continue _function;
	    }
	    var listSize = arr.length,
	        combinationsCount = 1 << listSize;
	    for (var i = 1; i < combinationsCount; i++) {
	      var combinationSum = 0;
	      for (var j = 0; j < listSize; j++) {
	        if (i & 1 << j) {
	          combinationSum += arr[j];
	        }
	      }
	      if (n === combinationSum) {
	        return true;
	      }
	    }
	    return false;
	  }
	};

	module.exports = PossibleCombinationSum;

/***/ },
/* 11 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);