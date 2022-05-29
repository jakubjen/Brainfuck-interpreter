const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(((resolve) => { resolve(value); })); }
  return new (P || (P = Promise))(((resolve, reject) => {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  }));
};
const __generator = (this && this.__generator) || function (thisArg, body) {
  let _ = {
    label: 0, sent() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [],
  }; let f; let y; let t; let
    g;
  return g = { next: verb(0), throw: verb(1), return: verb(2) }, typeof Symbol === 'function' && (g[Symbol.iterator] = function () { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
    if (f) throw new TypeError('Generator is already executing.');
    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y.return : op[0] ? y.throw || ((t = y.return) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0: case 1: t = op; break;
          case 4: _.label++; return { value: op[1], done: false };
          case 5: _.label++; y = op[1]; op = [0]; continue;
          case 7: op = _.ops.pop(); _.trys.pop(); continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
            if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
            if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
            if (t[2]) _.ops.pop();
            _.trys.pop(); continue;
        }
        op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
    }
    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
};
/* eslint-disable */
var Interpreter = /** @class */ (function () {
    function Interpreter(memory) {
        this.memory = memory;
    }
    Interpreter.prototype.run = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resole) { return __awaiter(_this, void 0, void 0, function () {
                        var memory, i, command, endBracket, codeInLoop;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    memory = this.memory;
                                    i = 0;
                                    _a.label = 1;
                                case 1:
                                    if (!(i < code.length)) return [3 /*break*/, 8];
                                    command = code[i];
                                    if (!(command != '[' && command != ']')) return [3 /*break*/, 3];
                                    return [4 /*yield*/, this.execute(command)];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 7];
                                case 3:
                                    if (!(command == '[')) return [3 /*break*/, 7];
                                    endBracket = this.findEndBracket(code, i);
                                    codeInLoop = code.slice(i + 1, endBracket);
                                    _a.label = 4;
                                case 4:
                                    if (!(memory.getValue() != 0)) return [3 /*break*/, 6];
                                    return [4 /*yield*/, this.run(codeInLoop)];
                                case 5:
                                    _a.sent();
                                    return [3 /*break*/, 4];
                                case 6:
                                    i = endBracket;
                                    _a.label = 7;
                                case 7:
                                    i++;
                                    return [3 /*break*/, 1];
                                case 8:
                                    resole('');
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    Interpreter.prototype.findEndBracket = function (code, i) {
        var nested = 0;
        for (var j = i; j < code.length; j++) {
            if (code[j] == '[') {
                nested++;
            }
            else if (code[j] == ']') {
                nested--;
                if (nested == 0) {
                    return j;
                }
            }
        }
        throw ('Syntax error');
    };
    Interpreter.prototype.execute = function (command) {
        return __awaiter(this, void 0, void 0, function () {
            var memory, parentPort, char, assciCode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        memory = this.memory;
                        parentPort = require('worker_threads').parentPort;
                        if (!(command == '>')) return [3 /*break*/, 1];
                        memory.increasePointer();
                        return [3 /*break*/, 7];
                    case 1:
                        if (!(command == '<')) return [3 /*break*/, 2];
                        memory.decreasePointer();
                        return [3 /*break*/, 7];
                    case 2:
                        if (!(command == '+')) return [3 /*break*/, 3];
                        memory.increaseValue();
                        return [3 /*break*/, 7];
                    case 3:
                        if (!(command == '-')) return [3 /*break*/, 4];
                        memory.decreaseValue();
                        return [3 /*break*/, 7];
                    case 4:
                        if (!(command == '.')) return [3 /*break*/, 5];
                        char = String.fromCharCode(memory.getValue());
                        parentPort.postMessage({ name: 'printChar', value: char });
                        return [3 /*break*/, 7];
                    case 5:
                        if (!(command == ',')) return [3 /*break*/, 7];
                        parentPort.postMessage({ name: 'userNeedEnterKey', value: '' });
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var assciCode = '0';
                                parentPort.once('message', function (_a) {
                                    var name = _a.name, value = _a.value;
                                    if (name === 'insertChar') {
                                        assciCode = value.charCodeAt(0);
                                        resolve(assciCode);
                                    }
                                });
                            })];
                    case 6:
                        assciCode = _a.sent();
                        this.memory.setValue(assciCode);
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return Interpreter;
}());
module.exports = Interpreter;
