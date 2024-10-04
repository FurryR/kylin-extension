// Name: Kylin
// ID: kylin
// Description: Tool to obfuscate your Scratch project.
// By: FurryR
// License: AGPL-3.0-only

(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/@jridgewell/source-map/dist/source-map.umd.js
  var require_source_map_umd = __commonJS({
    "node_modules/@jridgewell/source-map/dist/source-map.umd.js"(exports, module) {
      (function(global2, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, factory(global2.sourceMap = {}));
      })(exports, function(exports2) {
        "use strict";
        const comma = ",".charCodeAt(0);
        const semicolon = ";".charCodeAt(0);
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        const intToChar = new Uint8Array(64);
        const charToInt = new Uint8Array(128);
        for (let i = 0; i < chars.length; i++) {
          const c = chars.charCodeAt(i);
          intToChar[i] = c;
          charToInt[c] = i;
        }
        const td = typeof TextDecoder !== "undefined" ? /* @__PURE__ */ new TextDecoder() : typeof Buffer !== "undefined" ? {
          decode(buf) {
            const out = Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength);
            return out.toString();
          }
        } : {
          decode(buf) {
            let out = "";
            for (let i = 0; i < buf.length; i++) {
              out += String.fromCharCode(buf[i]);
            }
            return out;
          }
        };
        function decode(mappings) {
          const state = new Int32Array(5);
          const decoded = [];
          let index = 0;
          do {
            const semi = indexOf(mappings, index);
            const line = [];
            let sorted = true;
            let lastCol = 0;
            state[0] = 0;
            for (let i = index; i < semi; i++) {
              let seg;
              i = decodeInteger(mappings, i, state, 0);
              const col = state[0];
              if (col < lastCol)
                sorted = false;
              lastCol = col;
              if (hasMoreVlq(mappings, i, semi)) {
                i = decodeInteger(mappings, i, state, 1);
                i = decodeInteger(mappings, i, state, 2);
                i = decodeInteger(mappings, i, state, 3);
                if (hasMoreVlq(mappings, i, semi)) {
                  i = decodeInteger(mappings, i, state, 4);
                  seg = [col, state[1], state[2], state[3], state[4]];
                } else {
                  seg = [col, state[1], state[2], state[3]];
                }
              } else {
                seg = [col];
              }
              line.push(seg);
            }
            if (!sorted)
              sort(line);
            decoded.push(line);
            index = semi + 1;
          } while (index <= mappings.length);
          return decoded;
        }
        function indexOf(mappings, index) {
          const idx = mappings.indexOf(";", index);
          return idx === -1 ? mappings.length : idx;
        }
        function decodeInteger(mappings, pos, state, j) {
          let value = 0;
          let shift = 0;
          let integer = 0;
          do {
            const c = mappings.charCodeAt(pos++);
            integer = charToInt[c];
            value |= (integer & 31) << shift;
            shift += 5;
          } while (integer & 32);
          const shouldNegate = value & 1;
          value >>>= 1;
          if (shouldNegate) {
            value = -2147483648 | -value;
          }
          state[j] += value;
          return pos;
        }
        function hasMoreVlq(mappings, i, length) {
          if (i >= length)
            return false;
          return mappings.charCodeAt(i) !== comma;
        }
        function sort(line) {
          line.sort(sortComparator$1);
        }
        function sortComparator$1(a, b) {
          return a[0] - b[0];
        }
        function encode(decoded) {
          const state = new Int32Array(5);
          const bufLength = 1024 * 16;
          const subLength = bufLength - 36;
          const buf = new Uint8Array(bufLength);
          const sub = buf.subarray(0, subLength);
          let pos = 0;
          let out = "";
          for (let i = 0; i < decoded.length; i++) {
            const line = decoded[i];
            if (i > 0) {
              if (pos === bufLength) {
                out += td.decode(buf);
                pos = 0;
              }
              buf[pos++] = semicolon;
            }
            if (line.length === 0)
              continue;
            state[0] = 0;
            for (let j = 0; j < line.length; j++) {
              const segment = line[j];
              if (pos > subLength) {
                out += td.decode(sub);
                buf.copyWithin(0, subLength, pos);
                pos -= subLength;
              }
              if (j > 0)
                buf[pos++] = comma;
              pos = encodeInteger(buf, pos, state, segment, 0);
              if (segment.length === 1)
                continue;
              pos = encodeInteger(buf, pos, state, segment, 1);
              pos = encodeInteger(buf, pos, state, segment, 2);
              pos = encodeInteger(buf, pos, state, segment, 3);
              if (segment.length === 4)
                continue;
              pos = encodeInteger(buf, pos, state, segment, 4);
            }
          }
          return out + td.decode(buf.subarray(0, pos));
        }
        function encodeInteger(buf, pos, state, segment, j) {
          const next = segment[j];
          let num = next - state[j];
          state[j] = next;
          num = num < 0 ? -num << 1 | 1 : num << 1;
          do {
            let clamped = num & 31;
            num >>>= 5;
            if (num > 0)
              clamped |= 32;
            buf[pos++] = intToChar[clamped];
          } while (num > 0);
          return pos;
        }
        const schemeRegex = /^[\w+.-]+:\/\//;
        const urlRegex = /^([\w+.-]+:)\/\/([^@/#?]*@)?([^:/#?]*)(:\d+)?(\/[^#?]*)?(\?[^#]*)?(#.*)?/;
        const fileRegex = /^file:(?:\/\/((?![a-z]:)[^/#?]*)?)?(\/?[^#?]*)(\?[^#]*)?(#.*)?/i;
        function isAbsoluteUrl(input) {
          return schemeRegex.test(input);
        }
        function isSchemeRelativeUrl(input) {
          return input.startsWith("//");
        }
        function isAbsolutePath(input) {
          return input.startsWith("/");
        }
        function isFileUrl(input) {
          return input.startsWith("file:");
        }
        function isRelative(input) {
          return /^[.?#]/.test(input);
        }
        function parseAbsoluteUrl(input) {
          const match = urlRegex.exec(input);
          return makeUrl(match[1], match[2] || "", match[3], match[4] || "", match[5] || "/", match[6] || "", match[7] || "");
        }
        function parseFileUrl(input) {
          const match = fileRegex.exec(input);
          const path = match[2];
          return makeUrl("file:", "", match[1] || "", "", isAbsolutePath(path) ? path : "/" + path, match[3] || "", match[4] || "");
        }
        function makeUrl(scheme, user, host, port, path, query, hash) {
          return {
            scheme,
            user,
            host,
            port,
            path,
            query,
            hash,
            type: 7
          };
        }
        function parseUrl(input) {
          if (isSchemeRelativeUrl(input)) {
            const url2 = parseAbsoluteUrl("http:" + input);
            url2.scheme = "";
            url2.type = 6;
            return url2;
          }
          if (isAbsolutePath(input)) {
            const url2 = parseAbsoluteUrl("http://foo.com" + input);
            url2.scheme = "";
            url2.host = "";
            url2.type = 5;
            return url2;
          }
          if (isFileUrl(input))
            return parseFileUrl(input);
          if (isAbsoluteUrl(input))
            return parseAbsoluteUrl(input);
          const url = parseAbsoluteUrl("http://foo.com/" + input);
          url.scheme = "";
          url.host = "";
          url.type = input ? input.startsWith("?") ? 3 : input.startsWith("#") ? 2 : 4 : 1;
          return url;
        }
        function stripPathFilename(path) {
          if (path.endsWith("/.."))
            return path;
          const index = path.lastIndexOf("/");
          return path.slice(0, index + 1);
        }
        function mergePaths(url, base) {
          normalizePath(base, base.type);
          if (url.path === "/") {
            url.path = base.path;
          } else {
            url.path = stripPathFilename(base.path) + url.path;
          }
        }
        function normalizePath(url, type) {
          const rel = type <= 4;
          const pieces = url.path.split("/");
          let pointer = 1;
          let positive = 0;
          let addTrailingSlash = false;
          for (let i = 1; i < pieces.length; i++) {
            const piece = pieces[i];
            if (!piece) {
              addTrailingSlash = true;
              continue;
            }
            addTrailingSlash = false;
            if (piece === ".")
              continue;
            if (piece === "..") {
              if (positive) {
                addTrailingSlash = true;
                positive--;
                pointer--;
              } else if (rel) {
                pieces[pointer++] = piece;
              }
              continue;
            }
            pieces[pointer++] = piece;
            positive++;
          }
          let path = "";
          for (let i = 1; i < pointer; i++) {
            path += "/" + pieces[i];
          }
          if (!path || addTrailingSlash && !path.endsWith("/..")) {
            path += "/";
          }
          url.path = path;
        }
        function resolve$1(input, base) {
          if (!input && !base)
            return "";
          const url = parseUrl(input);
          let inputType = url.type;
          if (base && inputType !== 7) {
            const baseUrl = parseUrl(base);
            const baseType = baseUrl.type;
            switch (inputType) {
              case 1:
                url.hash = baseUrl.hash;
              // fall through
              case 2:
                url.query = baseUrl.query;
              // fall through
              case 3:
              case 4:
                mergePaths(url, baseUrl);
              // fall through
              case 5:
                url.user = baseUrl.user;
                url.host = baseUrl.host;
                url.port = baseUrl.port;
              // fall through
              case 6:
                url.scheme = baseUrl.scheme;
            }
            if (baseType > inputType)
              inputType = baseType;
          }
          normalizePath(url, inputType);
          const queryHash = url.query + url.hash;
          switch (inputType) {
            // This is impossible, because of the empty checks at the start of the function.
            // case UrlType.Empty:
            case 2:
            case 3:
              return queryHash;
            case 4: {
              const path = url.path.slice(1);
              if (!path)
                return queryHash || ".";
              if (isRelative(base || input) && !isRelative(path)) {
                return "./" + path + queryHash;
              }
              return path + queryHash;
            }
            case 5:
              return url.path + queryHash;
            default:
              return url.scheme + "//" + url.user + url.host + url.port + url.path + queryHash;
          }
        }
        function resolve(input, base) {
          if (base && !base.endsWith("/"))
            base += "/";
          return resolve$1(input, base);
        }
        function stripFilename(path) {
          if (!path)
            return "";
          const index = path.lastIndexOf("/");
          return path.slice(0, index + 1);
        }
        const COLUMN$1 = 0;
        const SOURCES_INDEX$1 = 1;
        const SOURCE_LINE$1 = 2;
        const SOURCE_COLUMN$1 = 3;
        const NAMES_INDEX$1 = 4;
        const REV_GENERATED_LINE = 1;
        const REV_GENERATED_COLUMN = 2;
        function maybeSort(mappings, owned) {
          const unsortedIndex = nextUnsortedSegmentLine(mappings, 0);
          if (unsortedIndex === mappings.length)
            return mappings;
          if (!owned)
            mappings = mappings.slice();
          for (let i = unsortedIndex; i < mappings.length; i = nextUnsortedSegmentLine(mappings, i + 1)) {
            mappings[i] = sortSegments(mappings[i], owned);
          }
          return mappings;
        }
        function nextUnsortedSegmentLine(mappings, start) {
          for (let i = start; i < mappings.length; i++) {
            if (!isSorted(mappings[i]))
              return i;
          }
          return mappings.length;
        }
        function isSorted(line) {
          for (let j = 1; j < line.length; j++) {
            if (line[j][COLUMN$1] < line[j - 1][COLUMN$1]) {
              return false;
            }
          }
          return true;
        }
        function sortSegments(line, owned) {
          if (!owned)
            line = line.slice();
          return line.sort(sortComparator);
        }
        function sortComparator(a, b) {
          return a[COLUMN$1] - b[COLUMN$1];
        }
        let found = false;
        function binarySearch(haystack, needle, low, high) {
          while (low <= high) {
            const mid = low + (high - low >> 1);
            const cmp = haystack[mid][COLUMN$1] - needle;
            if (cmp === 0) {
              found = true;
              return mid;
            }
            if (cmp < 0) {
              low = mid + 1;
            } else {
              high = mid - 1;
            }
          }
          found = false;
          return low - 1;
        }
        function upperBound(haystack, needle, index) {
          for (let i = index + 1; i < haystack.length; index = i++) {
            if (haystack[i][COLUMN$1] !== needle)
              break;
          }
          return index;
        }
        function lowerBound(haystack, needle, index) {
          for (let i = index - 1; i >= 0; index = i--) {
            if (haystack[i][COLUMN$1] !== needle)
              break;
          }
          return index;
        }
        function memoizedState() {
          return {
            lastKey: -1,
            lastNeedle: -1,
            lastIndex: -1
          };
        }
        function memoizedBinarySearch(haystack, needle, state, key) {
          const { lastKey, lastNeedle, lastIndex } = state;
          let low = 0;
          let high = haystack.length - 1;
          if (key === lastKey) {
            if (needle === lastNeedle) {
              found = lastIndex !== -1 && haystack[lastIndex][COLUMN$1] === needle;
              return lastIndex;
            }
            if (needle >= lastNeedle) {
              low = lastIndex === -1 ? 0 : lastIndex;
            } else {
              high = lastIndex;
            }
          }
          state.lastKey = key;
          state.lastNeedle = needle;
          return state.lastIndex = binarySearch(haystack, needle, low, high);
        }
        function buildBySources(decoded, memos) {
          const sources = memos.map(buildNullArray);
          for (let i = 0; i < decoded.length; i++) {
            const line = decoded[i];
            for (let j = 0; j < line.length; j++) {
              const seg = line[j];
              if (seg.length === 1)
                continue;
              const sourceIndex2 = seg[SOURCES_INDEX$1];
              const sourceLine = seg[SOURCE_LINE$1];
              const sourceColumn = seg[SOURCE_COLUMN$1];
              const originalSource = sources[sourceIndex2];
              const originalLine = originalSource[sourceLine] || (originalSource[sourceLine] = []);
              const memo = memos[sourceIndex2];
              let index = upperBound(originalLine, sourceColumn, memoizedBinarySearch(originalLine, sourceColumn, memo, sourceLine));
              memo.lastIndex = ++index;
              insert$1(originalLine, index, [sourceColumn, i, seg[COLUMN$1]]);
            }
          }
          return sources;
        }
        function insert$1(array, index, value) {
          for (let i = array.length; i > index; i--) {
            array[i] = array[i - 1];
          }
          array[index] = value;
        }
        function buildNullArray() {
          return { __proto__: null };
        }
        const AnyMap = function(map, mapUrl) {
          const parsed = parse2(map);
          if (!("sections" in parsed)) {
            return new TraceMap(parsed, mapUrl);
          }
          const mappings = [];
          const sources = [];
          const sourcesContent = [];
          const names = [];
          const ignoreList = [];
          recurse(parsed, mapUrl, mappings, sources, sourcesContent, names, ignoreList, 0, 0, Infinity, Infinity);
          const joined = {
            version: 3,
            file: parsed.file,
            names,
            sources,
            sourcesContent,
            mappings,
            ignoreList
          };
          return presortedDecodedMap(joined);
        };
        function parse2(map) {
          return typeof map === "string" ? JSON.parse(map) : map;
        }
        function recurse(input, mapUrl, mappings, sources, sourcesContent, names, ignoreList, lineOffset, columnOffset, stopLine, stopColumn) {
          const { sections } = input;
          for (let i = 0; i < sections.length; i++) {
            const { map, offset } = sections[i];
            let sl = stopLine;
            let sc = stopColumn;
            if (i + 1 < sections.length) {
              const nextOffset = sections[i + 1].offset;
              sl = Math.min(stopLine, lineOffset + nextOffset.line);
              if (sl === stopLine) {
                sc = Math.min(stopColumn, columnOffset + nextOffset.column);
              } else if (sl < stopLine) {
                sc = columnOffset + nextOffset.column;
              }
            }
            addSection(map, mapUrl, mappings, sources, sourcesContent, names, ignoreList, lineOffset + offset.line, columnOffset + offset.column, sl, sc);
          }
        }
        function addSection(input, mapUrl, mappings, sources, sourcesContent, names, ignoreList, lineOffset, columnOffset, stopLine, stopColumn) {
          const parsed = parse2(input);
          if ("sections" in parsed)
            return recurse(...arguments);
          const map = new TraceMap(parsed, mapUrl);
          const sourcesOffset = sources.length;
          const namesOffset = names.length;
          const decoded = decodedMappings(map);
          const { resolvedSources, sourcesContent: contents, ignoreList: ignores } = map;
          append(sources, resolvedSources);
          append(names, map.names);
          if (contents)
            append(sourcesContent, contents);
          else
            for (let i = 0; i < resolvedSources.length; i++)
              sourcesContent.push(null);
          if (ignores)
            for (let i = 0; i < ignores.length; i++)
              ignoreList.push(ignores[i] + sourcesOffset);
          for (let i = 0; i < decoded.length; i++) {
            const lineI = lineOffset + i;
            if (lineI > stopLine)
              return;
            const out = getLine$1(mappings, lineI);
            const cOffset = i === 0 ? columnOffset : 0;
            const line = decoded[i];
            for (let j = 0; j < line.length; j++) {
              const seg = line[j];
              const column = cOffset + seg[COLUMN$1];
              if (lineI === stopLine && column >= stopColumn)
                return;
              if (seg.length === 1) {
                out.push([column]);
                continue;
              }
              const sourcesIndex = sourcesOffset + seg[SOURCES_INDEX$1];
              const sourceLine = seg[SOURCE_LINE$1];
              const sourceColumn = seg[SOURCE_COLUMN$1];
              out.push(seg.length === 4 ? [column, sourcesIndex, sourceLine, sourceColumn] : [column, sourcesIndex, sourceLine, sourceColumn, namesOffset + seg[NAMES_INDEX$1]]);
            }
          }
        }
        function append(arr, other) {
          for (let i = 0; i < other.length; i++)
            arr.push(other[i]);
        }
        function getLine$1(arr, index) {
          for (let i = arr.length; i <= index; i++)
            arr[i] = [];
          return arr[index];
        }
        const LINE_GTR_ZERO = "`line` must be greater than 0 (lines start at line 1)";
        const COL_GTR_EQ_ZERO = "`column` must be greater than or equal to 0 (columns start at column 0)";
        const LEAST_UPPER_BOUND = -1;
        const GREATEST_LOWER_BOUND = 1;
        class TraceMap {
          constructor(map, mapUrl) {
            const isString = typeof map === "string";
            if (!isString && map._decodedMemo)
              return map;
            const parsed = isString ? JSON.parse(map) : map;
            const { version: version2, file, names, sourceRoot, sources, sourcesContent } = parsed;
            this.version = version2;
            this.file = file;
            this.names = names || [];
            this.sourceRoot = sourceRoot;
            this.sources = sources;
            this.sourcesContent = sourcesContent;
            this.ignoreList = parsed.ignoreList || parsed.x_google_ignoreList || void 0;
            const from = resolve(sourceRoot || "", stripFilename(mapUrl));
            this.resolvedSources = sources.map((s) => resolve(s || "", from));
            const { mappings } = parsed;
            if (typeof mappings === "string") {
              this._encoded = mappings;
              this._decoded = void 0;
            } else {
              this._encoded = void 0;
              this._decoded = maybeSort(mappings, isString);
            }
            this._decodedMemo = memoizedState();
            this._bySources = void 0;
            this._bySourceMemos = void 0;
          }
        }
        function cast$2(map) {
          return map;
        }
        function encodedMappings(map) {
          var _a;
          var _b;
          return (_a = (_b = cast$2(map))._encoded) !== null && _a !== void 0 ? _a : _b._encoded = encode(cast$2(map)._decoded);
        }
        function decodedMappings(map) {
          var _a;
          return (_a = cast$2(map))._decoded || (_a._decoded = decode(cast$2(map)._encoded));
        }
        function originalPositionFor(map, needle) {
          let { line, column, bias } = needle;
          line--;
          if (line < 0)
            throw new Error(LINE_GTR_ZERO);
          if (column < 0)
            throw new Error(COL_GTR_EQ_ZERO);
          const decoded = decodedMappings(map);
          if (line >= decoded.length)
            return OMapping(null, null, null, null);
          const segments = decoded[line];
          const index = traceSegmentInternal(segments, cast$2(map)._decodedMemo, line, column, bias || GREATEST_LOWER_BOUND);
          if (index === -1)
            return OMapping(null, null, null, null);
          const segment = segments[index];
          if (segment.length === 1)
            return OMapping(null, null, null, null);
          const { names, resolvedSources } = map;
          return OMapping(resolvedSources[segment[SOURCES_INDEX$1]], segment[SOURCE_LINE$1] + 1, segment[SOURCE_COLUMN$1], segment.length === 5 ? names[segment[NAMES_INDEX$1]] : null);
        }
        function generatedPositionFor(map, needle) {
          const { source, line, column, bias } = needle;
          return generatedPosition(map, source, line, column, bias || GREATEST_LOWER_BOUND, false);
        }
        function allGeneratedPositionsFor(map, needle) {
          const { source, line, column, bias } = needle;
          return generatedPosition(map, source, line, column, bias || LEAST_UPPER_BOUND, true);
        }
        function eachMapping(map, cb) {
          const decoded = decodedMappings(map);
          const { names, resolvedSources } = map;
          for (let i = 0; i < decoded.length; i++) {
            const line = decoded[i];
            for (let j = 0; j < line.length; j++) {
              const seg = line[j];
              const generatedLine = i + 1;
              const generatedColumn = seg[0];
              let source = null;
              let originalLine = null;
              let originalColumn = null;
              let name = null;
              if (seg.length !== 1) {
                source = resolvedSources[seg[1]];
                originalLine = seg[2] + 1;
                originalColumn = seg[3];
              }
              if (seg.length === 5)
                name = names[seg[4]];
              cb({
                generatedLine,
                generatedColumn,
                source,
                originalLine,
                originalColumn,
                name
              });
            }
          }
        }
        function sourceIndex(map, source) {
          const { sources, resolvedSources } = map;
          let index = sources.indexOf(source);
          if (index === -1)
            index = resolvedSources.indexOf(source);
          return index;
        }
        function sourceContentFor(map, source) {
          const { sourcesContent } = map;
          if (sourcesContent == null)
            return null;
          const index = sourceIndex(map, source);
          return index === -1 ? null : sourcesContent[index];
        }
        function presortedDecodedMap(map, mapUrl) {
          const tracer = new TraceMap(clone(map, []), mapUrl);
          cast$2(tracer)._decoded = map.mappings;
          return tracer;
        }
        function clone(map, mappings) {
          return {
            version: map.version,
            file: map.file,
            names: map.names,
            sourceRoot: map.sourceRoot,
            sources: map.sources,
            sourcesContent: map.sourcesContent,
            mappings,
            ignoreList: map.ignoreList || map.x_google_ignoreList
          };
        }
        function OMapping(source, line, column, name) {
          return { source, line, column, name };
        }
        function GMapping(line, column) {
          return { line, column };
        }
        function traceSegmentInternal(segments, memo, line, column, bias) {
          let index = memoizedBinarySearch(segments, column, memo, line);
          if (found) {
            index = (bias === LEAST_UPPER_BOUND ? upperBound : lowerBound)(segments, column, index);
          } else if (bias === LEAST_UPPER_BOUND)
            index++;
          if (index === -1 || index === segments.length)
            return -1;
          return index;
        }
        function sliceGeneratedPositions(segments, memo, line, column, bias) {
          let min = traceSegmentInternal(segments, memo, line, column, GREATEST_LOWER_BOUND);
          if (!found && bias === LEAST_UPPER_BOUND)
            min++;
          if (min === -1 || min === segments.length)
            return [];
          const matchedColumn = found ? column : segments[min][COLUMN$1];
          if (!found)
            min = lowerBound(segments, matchedColumn, min);
          const max = upperBound(segments, matchedColumn, min);
          const result = [];
          for (; min <= max; min++) {
            const segment = segments[min];
            result.push(GMapping(segment[REV_GENERATED_LINE] + 1, segment[REV_GENERATED_COLUMN]));
          }
          return result;
        }
        function generatedPosition(map, source, line, column, bias, all) {
          var _a;
          line--;
          if (line < 0)
            throw new Error(LINE_GTR_ZERO);
          if (column < 0)
            throw new Error(COL_GTR_EQ_ZERO);
          const { sources, resolvedSources } = map;
          let sourceIndex2 = sources.indexOf(source);
          if (sourceIndex2 === -1)
            sourceIndex2 = resolvedSources.indexOf(source);
          if (sourceIndex2 === -1)
            return all ? [] : GMapping(null, null);
          const generated = (_a = cast$2(map))._bySources || (_a._bySources = buildBySources(decodedMappings(map), cast$2(map)._bySourceMemos = sources.map(memoizedState)));
          const segments = generated[sourceIndex2][line];
          if (segments == null)
            return all ? [] : GMapping(null, null);
          const memo = cast$2(map)._bySourceMemos[sourceIndex2];
          if (all)
            return sliceGeneratedPositions(segments, memo, line, column, bias);
          const index = traceSegmentInternal(segments, memo, line, column, bias);
          if (index === -1)
            return GMapping(null, null);
          const segment = segments[index];
          return GMapping(segment[REV_GENERATED_LINE] + 1, segment[REV_GENERATED_COLUMN]);
        }
        class SetArray {
          constructor() {
            this._indexes = { __proto__: null };
            this.array = [];
          }
        }
        function cast$1(set) {
          return set;
        }
        function get(setarr, key) {
          return cast$1(setarr)._indexes[key];
        }
        function put(setarr, key) {
          const index = get(setarr, key);
          if (index !== void 0)
            return index;
          const { array, _indexes: indexes } = cast$1(setarr);
          const length = array.push(key);
          return indexes[key] = length - 1;
        }
        const COLUMN = 0;
        const SOURCES_INDEX = 1;
        const SOURCE_LINE = 2;
        const SOURCE_COLUMN = 3;
        const NAMES_INDEX = 4;
        const NO_NAME = -1;
        class GenMapping {
          constructor({ file, sourceRoot } = {}) {
            this._names = new SetArray();
            this._sources = new SetArray();
            this._sourcesContent = [];
            this._mappings = [];
            this.file = file;
            this.sourceRoot = sourceRoot;
            this._ignoreList = new SetArray();
          }
        }
        function cast(map) {
          return map;
        }
        const maybeAddMapping = (map, mapping) => {
          return addMappingInternal(true, map, mapping);
        };
        function setSourceContent(map, source, content) {
          const { _sources: sources, _sourcesContent: sourcesContent } = cast(map);
          const index = put(sources, source);
          sourcesContent[index] = content;
        }
        function toDecodedMap(map) {
          const { _mappings: mappings, _sources: sources, _sourcesContent: sourcesContent, _names: names, _ignoreList: ignoreList } = cast(map);
          removeEmptyFinalLines(mappings);
          return {
            version: 3,
            file: map.file || void 0,
            names: names.array,
            sourceRoot: map.sourceRoot || void 0,
            sources: sources.array,
            sourcesContent,
            mappings,
            ignoreList: ignoreList.array
          };
        }
        function toEncodedMap(map) {
          const decoded = toDecodedMap(map);
          return Object.assign(Object.assign({}, decoded), { mappings: encode(decoded.mappings) });
        }
        function fromMap(input) {
          const map = new TraceMap(input);
          const gen = new GenMapping({ file: map.file, sourceRoot: map.sourceRoot });
          putAll(cast(gen)._names, map.names);
          putAll(cast(gen)._sources, map.sources);
          cast(gen)._sourcesContent = map.sourcesContent || map.sources.map(() => null);
          cast(gen)._mappings = decodedMappings(map);
          if (map.ignoreList)
            putAll(cast(gen)._ignoreList, map.ignoreList);
          return gen;
        }
        function addSegmentInternal(skipable, map, genLine, genColumn, source, sourceLine, sourceColumn, name, content) {
          const { _mappings: mappings, _sources: sources, _sourcesContent: sourcesContent, _names: names } = cast(map);
          const line = getLine(mappings, genLine);
          const index = getColumnIndex(line, genColumn);
          if (!source) {
            if (skipable && skipSourceless(line, index))
              return;
            return insert(line, index, [genColumn]);
          }
          const sourcesIndex = put(sources, source);
          const namesIndex = name ? put(names, name) : NO_NAME;
          if (sourcesIndex === sourcesContent.length)
            sourcesContent[sourcesIndex] = content !== null && content !== void 0 ? content : null;
          if (skipable && skipSource(line, index, sourcesIndex, sourceLine, sourceColumn, namesIndex)) {
            return;
          }
          return insert(line, index, name ? [genColumn, sourcesIndex, sourceLine, sourceColumn, namesIndex] : [genColumn, sourcesIndex, sourceLine, sourceColumn]);
        }
        function getLine(mappings, index) {
          for (let i = mappings.length; i <= index; i++) {
            mappings[i] = [];
          }
          return mappings[index];
        }
        function getColumnIndex(line, genColumn) {
          let index = line.length;
          for (let i = index - 1; i >= 0; index = i--) {
            const current = line[i];
            if (genColumn >= current[COLUMN])
              break;
          }
          return index;
        }
        function insert(array, index, value) {
          for (let i = array.length; i > index; i--) {
            array[i] = array[i - 1];
          }
          array[index] = value;
        }
        function removeEmptyFinalLines(mappings) {
          const { length } = mappings;
          let len = length;
          for (let i = len - 1; i >= 0; len = i, i--) {
            if (mappings[i].length > 0)
              break;
          }
          if (len < length)
            mappings.length = len;
        }
        function putAll(setarr, array) {
          for (let i = 0; i < array.length; i++)
            put(setarr, array[i]);
        }
        function skipSourceless(line, index) {
          if (index === 0)
            return true;
          const prev = line[index - 1];
          return prev.length === 1;
        }
        function skipSource(line, index, sourcesIndex, sourceLine, sourceColumn, namesIndex) {
          if (index === 0)
            return false;
          const prev = line[index - 1];
          if (prev.length === 1)
            return false;
          return sourcesIndex === prev[SOURCES_INDEX] && sourceLine === prev[SOURCE_LINE] && sourceColumn === prev[SOURCE_COLUMN] && namesIndex === (prev.length === 5 ? prev[NAMES_INDEX] : NO_NAME);
        }
        function addMappingInternal(skipable, map, mapping) {
          const { generated, source, original, name, content } = mapping;
          if (!source) {
            return addSegmentInternal(skipable, map, generated.line - 1, generated.column, null, null, null, null, null);
          }
          return addSegmentInternal(skipable, map, generated.line - 1, generated.column, source, original.line - 1, original.column, name, content);
        }
        class SourceMapConsumer2 {
          constructor(map, mapUrl) {
            const trace = this._map = new AnyMap(map, mapUrl);
            this.file = trace.file;
            this.names = trace.names;
            this.sourceRoot = trace.sourceRoot;
            this.sources = trace.resolvedSources;
            this.sourcesContent = trace.sourcesContent;
            this.version = trace.version;
          }
          static fromSourceMap(map, mapUrl) {
            if (map.toDecodedMap) {
              return new SourceMapConsumer2(map.toDecodedMap(), mapUrl);
            }
            return new SourceMapConsumer2(map.toJSON(), mapUrl);
          }
          get mappings() {
            return encodedMappings(this._map);
          }
          originalPositionFor(needle) {
            return originalPositionFor(this._map, needle);
          }
          generatedPositionFor(originalPosition) {
            return generatedPositionFor(this._map, originalPosition);
          }
          allGeneratedPositionsFor(originalPosition) {
            return allGeneratedPositionsFor(this._map, originalPosition);
          }
          hasContentsOfAllSources() {
            if (!this.sourcesContent || this.sourcesContent.length !== this.sources.length) {
              return false;
            }
            for (const content of this.sourcesContent) {
              if (content == null) {
                return false;
              }
            }
            return true;
          }
          sourceContentFor(source, nullOnMissing) {
            const sourceContent = sourceContentFor(this._map, source);
            if (sourceContent != null) {
              return sourceContent;
            }
            if (nullOnMissing) {
              return null;
            }
            throw new Error(`"${source}" is not in the SourceMap.`);
          }
          eachMapping(callback, context) {
            eachMapping(this._map, context ? callback.bind(context) : callback);
          }
          destroy() {
          }
        }
        class SourceMapGenerator2 {
          constructor(opts) {
            this._map = opts instanceof GenMapping ? opts : new GenMapping(opts);
          }
          static fromSourceMap(consumer) {
            return new SourceMapGenerator2(fromMap(consumer));
          }
          addMapping(mapping) {
            maybeAddMapping(this._map, mapping);
          }
          setSourceContent(source, content) {
            setSourceContent(this._map, source, content);
          }
          toJSON() {
            return toEncodedMap(this._map);
          }
          toString() {
            return JSON.stringify(this.toJSON());
          }
          toDecodedMap() {
            return toDecodedMap(this._map);
          }
        }
        exports2.SourceMapConsumer = SourceMapConsumer2;
        exports2.SourceMapGenerator = SourceMapGenerator2;
        Object.defineProperty(exports2, "__esModule", { value: true });
      });
    }
  });

  // src/l10n/index.ts
  var l10n_default = {
    "zh-cn": {
      "kylin.error.noCompilerAvailable": "\u6CA1\u6709\u7F16\u8BD1\u5668\u53EF\u7528\u3002\u8BF7\u5728 Turbowarp \u4E0A\u8FD0\u884C\u6B64\u811A\u672C\u3002",
      "kylin.error.gandi": "\u5C1A\u672A\u652F\u6301 Gandi IDE\u3002\u8BF7\u5728 Turbowarp \u4E0A\u8FD0\u884C\u6B64\u811A\u672C\u3002",
      "kylin.hint.obfuscated": "\u6E90\u4EE3\u7801\u6DF7\u6DC6",
      "kylin.hint.precompiled": "\u9884\u7F16\u8BD1",
      "kylin.hint.comment": "\u6CE8\u91CA",
      "kylin.hint.about": "\u5173\u4E8E Kylin",
      "kylin.hint.loading": "\u7A0D\u5B89\u52FF\u8E81...",
      "kylin.button.comments": "\u6CE8\u91CA",
      "kylin.button.uuid": "UUID (\u9AD8\u7EA7)",
      "kylin.button.proceed": "\u6DF7\u6DC6",
      "kylin.popup.comment": "\u8BF7\u8F93\u5165\u4F5C\u54C1\u7684\u6CE8\u91CA\u3002",
      "kylin.popup.uuid": "\u8BF7\u8F93\u5165\u4F5C\u54C1\u7684 v4 UUID\u3002"
    },
    ja: {
      "kylin.error.noCompilerAvailable": "\u30B3\u30F3\u30D1\u30A4\u30E9\u30FC\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002Turbowarp \u3067\u3053\u306E\u30B9\u30AF\u30EA\u30D7\u30C8\u3092\u5B9F\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
      "kylin.error.gandi": "Gandi IDE \u306F\u307E\u3060\u30B5\u30DD\u30FC\u30C8\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002Turbowarp \u3067\u3053\u306E\u30B9\u30AF\u30EA\u30D7\u30C8\u3092\u5B9F\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
      "kylin.hint.obfuscated": "\u96E3\u8AAD\u5316",
      "kylin.hint.precompiled": "\u4E8B\u524D\u30B3\u30F3\u30D1\u30A4\u30EB",
      "kylin.hint.comment": "\u30B3\u30E1\u30F3\u30C8",
      "kylin.hint.about": "Kylin \u306B\u3064\u3044\u3066",
      "kylin.hint.loading": "\u5C11\u3005\u304A\u5F85\u3061\u304F\u3060\u3055\u3044\u3002",
      "kylin.button.comments": "\u30B3\u30E1\u30F3\u30C8",
      "kylin.button.uuid": "UUID (\u4E0A\u7D1A\u8005\u5411\u3051)",
      "kylin.button.proceed": "\u96E3\u8AAD\u5316\u3059\u308B",
      "kylin.popup.comment": "\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u306E\u30B3\u30E1\u30F3\u30C8\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
      "kylin.popup.uuid": "\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u306E v4 UUID \u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002"
    }
  };

  // package.json
  var version = "1.0.0";

  // node_modules/uuid/dist/esm-browser/stringify.js
  var byteToHex = [];
  for (i = 0; i < 256; ++i) {
    byteToHex.push((i + 256).toString(16).slice(1));
  }
  var i;
  function unsafeStringify(arr, offset = 0) {
    return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
  }

  // node_modules/uuid/dist/esm-browser/rng.js
  var getRandomValues;
  var rnds8 = new Uint8Array(16);
  function rng() {
    if (!getRandomValues) {
      getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
      if (!getRandomValues) {
        throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
      }
    }
    return getRandomValues(rnds8);
  }

  // node_modules/uuid/dist/esm-browser/native.js
  var randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
  var native_default = {
    randomUUID
  };

  // node_modules/uuid/dist/esm-browser/v4.js
  function v4(options, buf, offset) {
    if (native_default.randomUUID && !buf && !options) {
      return native_default.randomUUID();
    }
    options = options || {};
    var rnds = options.random || (options.rng || rng)();
    rnds[6] = rnds[6] & 15 | 64;
    rnds[8] = rnds[8] & 63 | 128;
    if (buf) {
      offset = offset || 0;
      for (var i = 0; i < 16; ++i) {
        buf[offset + i] = rnds[i];
      }
      return buf;
    }
    return unsafeStringify(rnds);
  }
  var v4_default = v4;

  // src/invisibleUUID.ts
  var InvisibleUUID = class _InvisibleUUID {
    static characters = [
      "\u200E",
      "\u200F",
      "\u200D",
      "\u202A",
      "\u202B",
      "\u202C",
      "\u206E",
      "\u206F",
      "\u206B",
      "\u206A",
      "\u206D",
      "\u206C",
      "\u202E",
      "\u200B",
      "\u2060",
      "\uFEFF"
    ];
    static hex = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f"
    ];
    static random() {
      return _InvisibleUUID.encrypt(v4_default());
    }
    /**
     *
     * @param uuid
     */
    static encrypt(uuid) {
      if (uuid.length !== 36) {
        throw new Error("Invalid v4 UUID");
      }
      return Array.from(uuid.toLowerCase()).filter((x) => x !== "-").map((x) => _InvisibleUUID.characters[_InvisibleUUID.hex.indexOf(x)]).join("");
    }
    /**
     *
     * @param str
     */
    static decrypt(str) {
      if (str.length !== 32) {
        throw new Error("Invalid v4 UUID");
      }
      const raw = Array.from(str).map((x) => _InvisibleUUID.hex[_InvisibleUUID.characters.indexOf(x)] ?? "?").join("");
      return `${raw.substring(0, 8)}-${raw.substring(8, 12)}-${raw.substring(
        12,
        16
      )}-${raw.substring(16, 20)}-${raw.substring(20)}`;
    }
  };

  // src/uid.ts
  var soup_ = "!#%()*+,-./:;=?@[]^_`{|}~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  function uid_default() {
    const length = 20;
    const soupLength = soup_.length;
    const id = [];
    for (let i = 0; i < length; i++) {
      id[i] = soup_.charAt(Math.random() * soupLength);
    }
    return id.join("");
  }

  // src/obfuscator.ts
  var Obfuscator = class _Obfuscator {
    static obfuscateProccode(str) {
      let state = 0;
      let final = "";
      for (const c of str) {
        if (c === "%") {
          if (state === 1) state = 0;
          else state = 1;
        } else if (state === 1) {
          final += `%${c} `;
          state = 0;
        }
      }
      return InvisibleUUID.random() + final;
    }
    static fetchMeta(targets) {
      let result = {
        isKylin: false,
        isCompiled: false,
        isObfuscated: false,
        uuid: "",
        comment: null
      };
      for (const target of targets) {
        if (target.isStage) {
          for (const block of Object.values(target.blocks._blocks)) {
            if (block.opcode === "procedures_call" && block.mutation?.isKylin === "true") {
              result.isKylin = true;
              result.isObfuscated = block.mutation?.isObfuscated === "true";
              result.isCompiled = block.mutation?.isCompiled === "true";
              result.uuid = InvisibleUUID.decrypt(block.mutation.uuid);
              if (block.mutation.comment) {
                result.comment = block.mutation.comment;
              }
              break;
            }
          }
          break;
        }
      }
      return result;
    }
    static addMeta(runtime, {
      uuid: projectUUID,
      comment,
      isCompiled,
      isObfuscated
    }) {
      const sprites = new Set(runtime.targets.map((v) => v.sprite));
      projectUUID = projectUUID ?? v4_default();
      for (const sprite of sprites) {
        if (sprite.clones[0].isStage) {
          const id = uid_default();
          sprite.blocks._blocks[id] = {
            id,
            opcode: "procedures_call",
            inputs: {},
            fields: {},
            next: null,
            topLevel: true,
            parent: null,
            shadow: true,
            mutation: {
              tagName: "mutation",
              isKylin: "true",
              isCompiled: `${isCompiled}`,
              isObfuscated: `${isObfuscated}`,
              uuid: InvisibleUUID.encrypt(projectUUID),
              ...comment ? { comment: String(comment) } : {},
              children: [],
              proccode: "",
              argumentids: "[]",
              warp: "true"
            }
          };
          sprite.blocks.resetCache();
          break;
        }
      }
      return { uuid: projectUUID, comment };
    }
    static obfuscate(runtime) {
      const obfuscatedSignatureMap = {};
      const obfuscatedVariableName = {};
      const sprites = new Set(runtime.targets.map((v) => v.sprite));
      for (const sprite of sprites) {
        const obfuscatedArgumentName = {};
        const currentName = sprite.name;
        const obfuscatedSignatureName = obfuscatedSignatureMap[currentName] = {};
        for (const block of Object.values(sprite.blocks._blocks)) {
          if (block.opcode === "data_showvariable" || block.opcode === "data_showlist" || block.opcode === "data_hidevariable" || block.opcode === "data_hidelist") {
            const field = block.fields.VARIABLE ?? block.fields.LIST;
            obfuscatedVariableName[field.value] = field.value;
          }
        }
        for (const variable of Object.values(sprite.clones[0].variables)) {
          if (!(variable.name in obfuscatedVariableName)) {
            if (variable.isCloud || variable.type === "broadcast_msg") {
              obfuscatedVariableName[variable.name] = variable.name;
            } else obfuscatedVariableName[variable.name] = InvisibleUUID.random();
          }
          variable.name = obfuscatedVariableName[variable.name];
        }
        for (const [blockId, block] of Object.entries(sprite.blocks._blocks)) {
          if (!sprite.blocks.getBlock(blockId)) continue;
          if (!block.parent && !runtime.getIsHat(block.opcode) && block.opcode !== "procedures_definition") {
            ;
            sprite.blocks.deleteBlock(block.id);
          } else {
            delete block.x;
            delete block.y;
            block.shadow = true;
            block.topLevel = true;
            if (block.fields?.VARIABLE) {
              block.fields.VARIABLE.value = obfuscatedVariableName[block.fields.VARIABLE.value];
            }
            if (block.fields?.LIST) {
              block.fields.LIST.value = obfuscatedVariableName[block.fields.LIST.value];
            }
            if (block.opcode === "procedures_call" && block.mutation) {
              if (!(block.mutation.proccode in obfuscatedSignatureName)) {
                obfuscatedSignatureName[block.mutation.proccode] = _Obfuscator.obfuscateProccode(block.mutation.proccode);
              }
              block.mutation.proccode = obfuscatedSignatureName[block.mutation.proccode];
            } else if (block.opcode === "procedures_prototype" && block.mutation) {
              ;
              block.mutation.argumentnames = JSON.stringify(
                JSON.parse(
                  block.mutation.argumentnames
                ).map((original) => {
                  if (!(original in obfuscatedArgumentName)) {
                    obfuscatedArgumentName[original] = InvisibleUUID.random();
                  }
                  return obfuscatedArgumentName[original];
                })
              );
              if (!(block.mutation.proccode in obfuscatedSignatureName)) {
                obfuscatedSignatureName[block.mutation.proccode] = _Obfuscator.obfuscateProccode(block.mutation.proccode);
              }
              block.mutation.proccode = obfuscatedSignatureName[block.mutation.proccode];
            } else if (block.opcode === "argument_reporter_string_number" || block.opcode === "argument_reporter_boolean") {
              if (!["is TurboWarp?", "is compiled?"].includes(
                block.fields.VALUE.value
              )) {
                if (!(block.fields.VALUE.value in obfuscatedArgumentName)) {
                  obfuscatedArgumentName[block.fields.VALUE.value] = InvisibleUUID.random();
                }
                block.fields.VALUE.value = obfuscatedArgumentName[block.fields.VALUE.value];
              }
            } else if (block.opcode === "sensing_of" && block.fields.PROPERTY) {
              if (block.fields.PROPERTY.value in obfuscatedVariableName) {
                block.fields.PROPERTY.value = obfuscatedVariableName[block.fields.PROPERTY.value];
              }
            }
          }
        }
        for (const [id, value] of Object.entries(
          sprite.clones[0].comments
        )) {
          if (sprite.clones[0].isStage && value.text.endsWith("// _twconfig_"))
            continue;
          delete sprite.clones[0].comments[id];
        }
        sprite.blocks.resetCache();
      }
    }
  };

  // node_modules/terser/lib/utils/index.js
  function characters(str) {
    return str.split("");
  }
  function member(name, array) {
    return array.includes(name);
  }
  var DefaultsError = class extends Error {
    constructor(msg, defs) {
      super();
      this.name = "DefaultsError";
      this.message = msg;
      this.defs = defs;
    }
  };
  function defaults(args, defs, croak) {
    if (args === true) {
      args = {};
    } else if (args != null && typeof args === "object") {
      args = { ...args };
    }
    const ret = args || {};
    if (croak) {
      for (const i in ret) if (HOP(ret, i) && !HOP(defs, i)) {
        throw new DefaultsError("`" + i + "` is not a supported option", defs);
      }
    }
    for (const i in defs) if (HOP(defs, i)) {
      if (!args || !HOP(args, i)) {
        ret[i] = defs[i];
      } else if (i === "ecma") {
        let ecma = args[i] | 0;
        if (ecma > 5 && ecma < 2015) ecma += 2009;
        ret[i] = ecma;
      } else {
        ret[i] = args && HOP(args, i) ? args[i] : defs[i];
      }
    }
    return ret;
  }
  function noop() {
  }
  function return_false() {
    return false;
  }
  function return_true() {
    return true;
  }
  function return_this() {
    return this;
  }
  function return_null() {
    return null;
  }
  var MAP = function() {
    function MAP2(a, tw, allow_splicing = true) {
      const new_a = [];
      for (let i = 0; i < a.length; ++i) {
        let item = a[i];
        let ret = item.transform(tw, allow_splicing);
        if (ret instanceof AST_Node) {
          new_a.push(ret);
        } else if (ret instanceof Splice) {
          new_a.push(...ret.v);
        }
      }
      return new_a;
    }
    MAP2.splice = function(val) {
      return new Splice(val);
    };
    MAP2.skip = {};
    function Splice(val) {
      this.v = val;
    }
    return MAP2;
  }();
  function make_node(ctor, orig, props) {
    if (!props) props = {};
    if (orig) {
      if (!props.start) props.start = orig.start;
      if (!props.end) props.end = orig.end;
    }
    return new ctor(props);
  }
  function push_uniq(array, el) {
    if (!array.includes(el))
      array.push(el);
  }
  function string_template(text, props) {
    return text.replace(/{(.+?)}/g, function(str, p) {
      return props && props[p];
    });
  }
  function remove(array, el) {
    for (var i = array.length; --i >= 0; ) {
      if (array[i] === el) array.splice(i, 1);
    }
  }
  function mergeSort(array, cmp) {
    if (array.length < 2) return array.slice();
    function merge(a, b) {
      var r = [], ai = 0, bi = 0, i = 0;
      while (ai < a.length && bi < b.length) {
        cmp(a[ai], b[bi]) <= 0 ? r[i++] = a[ai++] : r[i++] = b[bi++];
      }
      if (ai < a.length) r.push.apply(r, a.slice(ai));
      if (bi < b.length) r.push.apply(r, b.slice(bi));
      return r;
    }
    function _ms(a) {
      if (a.length <= 1)
        return a;
      var m = Math.floor(a.length / 2), left = a.slice(0, m), right = a.slice(m);
      left = _ms(left);
      right = _ms(right);
      return merge(left, right);
    }
    return _ms(array);
  }
  function makePredicate(words) {
    if (!Array.isArray(words)) words = words.split(" ");
    return new Set(words.sort());
  }
  function map_add(map, key, value) {
    if (map.has(key)) {
      map.get(key).push(value);
    } else {
      map.set(key, [value]);
    }
  }
  function map_from_object(obj) {
    var map = /* @__PURE__ */ new Map();
    for (var key in obj) {
      if (HOP(obj, key) && key.charAt(0) === "$") {
        map.set(key.substr(1), obj[key]);
      }
    }
    return map;
  }
  function map_to_object(map) {
    var obj = /* @__PURE__ */ Object.create(null);
    map.forEach(function(value, key) {
      obj["$" + key] = value;
    });
    return obj;
  }
  function HOP(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }
  function keep_name(keep_setting, name) {
    return keep_setting === true || keep_setting instanceof RegExp && keep_setting.test(name);
  }
  var lineTerminatorEscape = {
    "\0": "0",
    "\n": "n",
    "\r": "r",
    "\u2028": "u2028",
    "\u2029": "u2029"
  };
  function regexp_source_fix(source) {
    return source.replace(/[\0\n\r\u2028\u2029]/g, function(match, offset) {
      var escaped = source[offset - 1] == "\\" && (source[offset - 2] != "\\" || /(?:^|[^\\])(?:\\{2})*$/.test(source.slice(0, offset - 1)));
      return (escaped ? "" : "\\") + lineTerminatorEscape[match];
    });
  }
  var re_safe_regexp = /^[\\/|\0\s\w^$.[\]()]*$/;
  var regexp_is_safe = (source) => re_safe_regexp.test(source);
  var all_flags = "dgimsuyv";
  function sort_regexp_flags(flags) {
    const existing_flags = new Set(flags.split(""));
    let out = "";
    for (const flag of all_flags) {
      if (existing_flags.has(flag)) {
        out += flag;
        existing_flags.delete(flag);
      }
    }
    if (existing_flags.size) {
      existing_flags.forEach((flag) => {
        out += flag;
      });
    }
    return out;
  }
  function has_annotation(node, annotation) {
    return node._annotations & annotation;
  }
  function set_annotation(node, annotation) {
    node._annotations |= annotation;
  }
  function clear_annotation(node, annotation) {
    node._annotations &= ~annotation;
  }

  // node_modules/terser/lib/parse.js
  var LATEST_RAW = "";
  var TEMPLATE_RAWS = /* @__PURE__ */ new Map();
  var KEYWORDS = "break case catch class const continue debugger default delete do else export extends finally for function if in instanceof let new return switch throw try typeof var void while with";
  var KEYWORDS_ATOM = "false null true";
  var RESERVED_WORDS = "enum import super this " + KEYWORDS_ATOM + " " + KEYWORDS;
  var ALL_RESERVED_WORDS = "implements interface package private protected public static " + RESERVED_WORDS;
  var KEYWORDS_BEFORE_EXPRESSION = "return new delete throw else case yield await";
  KEYWORDS = makePredicate(KEYWORDS);
  RESERVED_WORDS = makePredicate(RESERVED_WORDS);
  KEYWORDS_BEFORE_EXPRESSION = makePredicate(KEYWORDS_BEFORE_EXPRESSION);
  KEYWORDS_ATOM = makePredicate(KEYWORDS_ATOM);
  ALL_RESERVED_WORDS = makePredicate(ALL_RESERVED_WORDS);
  var OPERATOR_CHARS = makePredicate(characters("+-*&%=<>!?|~^"));
  var RE_NUM_LITERAL = /[0-9a-f]/i;
  var RE_HEX_NUMBER = /^0x[0-9a-f]+$/i;
  var RE_OCT_NUMBER = /^0[0-7]+$/;
  var RE_ES6_OCT_NUMBER = /^0o[0-7]+$/i;
  var RE_BIN_NUMBER = /^0b[01]+$/i;
  var RE_DEC_NUMBER = /^\d*\.?\d*(?:e[+-]?\d*(?:\d\.?|\.?\d)\d*)?$/i;
  var RE_BIG_INT = /^(0[xob])?[0-9a-f]+n$/i;
  var OPERATORS = makePredicate([
    "in",
    "instanceof",
    "typeof",
    "new",
    "void",
    "delete",
    "++",
    "--",
    "+",
    "-",
    "!",
    "~",
    "&",
    "|",
    "^",
    "*",
    "**",
    "/",
    "%",
    ">>",
    "<<",
    ">>>",
    "<",
    ">",
    "<=",
    ">=",
    "==",
    "===",
    "!=",
    "!==",
    "?",
    "=",
    "+=",
    "-=",
    "||=",
    "&&=",
    "??=",
    "/=",
    "*=",
    "**=",
    "%=",
    ">>=",
    "<<=",
    ">>>=",
    "|=",
    "^=",
    "&=",
    "&&",
    "??",
    "||"
  ]);
  var WHITESPACE_CHARS = makePredicate(characters(" \xA0\n\r	\f\v\u200B\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF"));
  var NEWLINE_CHARS = makePredicate(characters("\n\r\u2028\u2029"));
  var PUNC_AFTER_EXPRESSION = makePredicate(characters(";]),:"));
  var PUNC_BEFORE_EXPRESSION = makePredicate(characters("[{(,;:"));
  var PUNC_CHARS = makePredicate(characters("[]{}(),;:"));
  var UNICODE = {
    ID_Start: /[$A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]/,
    ID_Continue: /(?:[$0-9A-Z_a-z\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF])+/
  };
  function get_full_char(str, pos) {
    if (is_surrogate_pair_head(str.charCodeAt(pos))) {
      if (is_surrogate_pair_tail(str.charCodeAt(pos + 1))) {
        return str.charAt(pos) + str.charAt(pos + 1);
      }
    } else if (is_surrogate_pair_tail(str.charCodeAt(pos))) {
      if (is_surrogate_pair_head(str.charCodeAt(pos - 1))) {
        return str.charAt(pos - 1) + str.charAt(pos);
      }
    }
    return str.charAt(pos);
  }
  function get_full_char_code(str, pos) {
    if (is_surrogate_pair_head(str.charCodeAt(pos))) {
      return 65536 + (str.charCodeAt(pos) - 55296 << 10) + str.charCodeAt(pos + 1) - 56320;
    }
    return str.charCodeAt(pos);
  }
  function get_full_char_length(str) {
    var surrogates = 0;
    for (var i = 0; i < str.length; i++) {
      if (is_surrogate_pair_head(str.charCodeAt(i)) && is_surrogate_pair_tail(str.charCodeAt(i + 1))) {
        surrogates++;
        i++;
      }
    }
    return str.length - surrogates;
  }
  function from_char_code(code) {
    if (code > 65535) {
      code -= 65536;
      return String.fromCharCode((code >> 10) + 55296) + String.fromCharCode(code % 1024 + 56320);
    }
    return String.fromCharCode(code);
  }
  function is_surrogate_pair_head(code) {
    return code >= 55296 && code <= 56319;
  }
  function is_surrogate_pair_tail(code) {
    return code >= 56320 && code <= 57343;
  }
  function is_digit(code) {
    return code >= 48 && code <= 57;
  }
  function is_identifier_start(ch) {
    return UNICODE.ID_Start.test(ch);
  }
  function is_identifier_char(ch) {
    return UNICODE.ID_Continue.test(ch);
  }
  var BASIC_IDENT = /^[a-z_$][a-z0-9_$]*$/i;
  function is_basic_identifier_string(str) {
    return BASIC_IDENT.test(str);
  }
  function is_identifier_string(str, allow_surrogates) {
    if (BASIC_IDENT.test(str)) {
      return true;
    }
    if (!allow_surrogates && /[\ud800-\udfff]/.test(str)) {
      return false;
    }
    var match = UNICODE.ID_Start.exec(str);
    if (!match || match.index !== 0) {
      return false;
    }
    str = str.slice(match[0].length);
    if (!str) {
      return true;
    }
    match = UNICODE.ID_Continue.exec(str);
    return !!match && match[0].length === str.length;
  }
  function parse_js_number(num, allow_e = true) {
    if (!allow_e && num.includes("e")) {
      return NaN;
    }
    if (RE_HEX_NUMBER.test(num)) {
      return parseInt(num.substr(2), 16);
    } else if (RE_OCT_NUMBER.test(num)) {
      return parseInt(num.substr(1), 8);
    } else if (RE_ES6_OCT_NUMBER.test(num)) {
      return parseInt(num.substr(2), 8);
    } else if (RE_BIN_NUMBER.test(num)) {
      return parseInt(num.substr(2), 2);
    } else if (RE_DEC_NUMBER.test(num)) {
      return parseFloat(num);
    } else {
      var val = parseFloat(num);
      if (val == num) return val;
    }
  }
  var JS_Parse_Error = class extends Error {
    constructor(message, filename, line, col, pos) {
      super();
      this.name = "SyntaxError";
      this.message = message;
      this.filename = filename;
      this.line = line;
      this.col = col;
      this.pos = pos;
    }
  };
  function js_error(message, filename, line, col, pos) {
    throw new JS_Parse_Error(message, filename, line, col, pos);
  }
  function is_token(token, type, val) {
    return token.type == type && (val == null || token.value == val);
  }
  var EX_EOF = {};
  function tokenizer($TEXT, filename, html5_comments, shebang) {
    var S = {
      text: $TEXT,
      filename,
      pos: 0,
      tokpos: 0,
      line: 1,
      tokline: 0,
      col: 0,
      tokcol: 0,
      newline_before: false,
      regex_allowed: false,
      brace_counter: 0,
      template_braces: [],
      comments_before: [],
      directives: {},
      directive_stack: []
    };
    function peek() {
      return get_full_char(S.text, S.pos);
    }
    function is_option_chain_op() {
      const must_be_dot = S.text.charCodeAt(S.pos + 1) === 46;
      if (!must_be_dot) return false;
      const cannot_be_digit = S.text.charCodeAt(S.pos + 2);
      return cannot_be_digit < 48 || cannot_be_digit > 57;
    }
    function next(signal_eof, in_string) {
      var ch = get_full_char(S.text, S.pos++);
      if (signal_eof && !ch)
        throw EX_EOF;
      if (NEWLINE_CHARS.has(ch)) {
        S.newline_before = S.newline_before || !in_string;
        ++S.line;
        S.col = 0;
        if (ch == "\r" && peek() == "\n") {
          ++S.pos;
          ch = "\n";
        }
      } else {
        if (ch.length > 1) {
          ++S.pos;
          ++S.col;
        }
        ++S.col;
      }
      return ch;
    }
    function forward(i) {
      while (i--) next();
    }
    function looking_at(str) {
      return S.text.substr(S.pos, str.length) == str;
    }
    function find_eol() {
      var text = S.text;
      for (var i = S.pos, n = S.text.length; i < n; ++i) {
        var ch = text[i];
        if (NEWLINE_CHARS.has(ch))
          return i;
      }
      return -1;
    }
    function find(what, signal_eof) {
      var pos = S.text.indexOf(what, S.pos);
      if (signal_eof && pos == -1) throw EX_EOF;
      return pos;
    }
    function start_token() {
      S.tokline = S.line;
      S.tokcol = S.col;
      S.tokpos = S.pos;
    }
    var prev_was_dot = false;
    var previous_token = null;
    function token(type, value, is_comment) {
      S.regex_allowed = type == "operator" && !UNARY_POSTFIX.has(value) || type == "keyword" && KEYWORDS_BEFORE_EXPRESSION.has(value) || type == "punc" && PUNC_BEFORE_EXPRESSION.has(value) || type == "arrow";
      if (type == "punc" && (value == "." || value == "?.")) {
        prev_was_dot = true;
      } else if (!is_comment) {
        prev_was_dot = false;
      }
      const line = S.tokline;
      const col = S.tokcol;
      const pos = S.tokpos;
      const nlb = S.newline_before;
      const file = filename;
      let comments_before = [];
      let comments_after = [];
      if (!is_comment) {
        comments_before = S.comments_before;
        comments_after = S.comments_before = [];
      }
      S.newline_before = false;
      const tok = new AST_Token(type, value, line, col, pos, nlb, comments_before, comments_after, file);
      if (!is_comment) previous_token = tok;
      return tok;
    }
    function skip_whitespace() {
      while (WHITESPACE_CHARS.has(peek()))
        next();
    }
    function read_while(pred) {
      var ret = "", ch, i = 0;
      while ((ch = peek()) && pred(ch, i++))
        ret += next();
      return ret;
    }
    function parse_error(err) {
      js_error(err, filename, S.tokline, S.tokcol, S.tokpos);
    }
    function read_num(prefix) {
      var has_e = false, after_e = false, has_x = false, has_dot = prefix == ".", is_big_int = false, numeric_separator = false;
      var num = read_while(function(ch, i) {
        if (is_big_int) return false;
        var code = ch.charCodeAt(0);
        switch (code) {
          case 95:
            return numeric_separator = true;
          case 98:
          case 66:
            return has_x = true;
          // Can occur in hex sequence, don't return false yet
          case 111:
          case 79:
          // oO
          case 120:
          case 88:
            return has_x ? false : has_x = true;
          case 101:
          case 69:
            return has_x ? true : has_e ? false : has_e = after_e = true;
          case 45:
            return after_e || i == 0 && !prefix;
          case 43:
            return after_e;
          case (after_e = false, 46):
            return !has_dot && !has_x && !has_e ? has_dot = true : false;
        }
        if (ch === "n") {
          is_big_int = true;
          return true;
        }
        return RE_NUM_LITERAL.test(ch);
      });
      if (prefix) num = prefix + num;
      LATEST_RAW = num;
      if (RE_OCT_NUMBER.test(num) && next_token.has_directive("use strict")) {
        parse_error("Legacy octal literals are not allowed in strict mode");
      }
      if (numeric_separator) {
        if (num.endsWith("_")) {
          parse_error("Numeric separators are not allowed at the end of numeric literals");
        } else if (num.includes("__")) {
          parse_error("Only one underscore is allowed as numeric separator");
        }
        num = num.replace(/_/g, "");
      }
      if (num.endsWith("n")) {
        const without_n = num.slice(0, -1);
        const allow_e = RE_HEX_NUMBER.test(without_n);
        const valid2 = parse_js_number(without_n, allow_e);
        if (!has_dot && RE_BIG_INT.test(num) && !isNaN(valid2))
          return token("big_int", without_n);
        parse_error("Invalid or unexpected token");
      }
      var valid = parse_js_number(num);
      if (!isNaN(valid)) {
        return token("num", valid);
      } else {
        parse_error("Invalid syntax: " + num);
      }
    }
    function is_octal(ch) {
      return ch >= "0" && ch <= "7";
    }
    function read_escaped_char(in_string, strict_hex, template_string) {
      var ch = next(true, in_string);
      switch (ch.charCodeAt(0)) {
        case 110:
          return "\n";
        case 114:
          return "\r";
        case 116:
          return "	";
        case 98:
          return "\b";
        case 118:
          return "\v";
        // \v
        case 102:
          return "\f";
        case 120:
          return String.fromCharCode(hex_bytes(2, strict_hex));
        // \x
        case 117:
          if (peek() == "{") {
            next(true);
            if (peek() === "}")
              parse_error("Expecting hex-character between {}");
            while (peek() == "0") next(true);
            var result, length = find("}", true) - S.pos;
            if (length > 6 || (result = hex_bytes(length, strict_hex)) > 1114111) {
              parse_error("Unicode reference out of bounds");
            }
            next(true);
            return from_char_code(result);
          }
          return String.fromCharCode(hex_bytes(4, strict_hex));
        case 10:
          return "";
        // newline
        case 13:
          if (peek() == "\n") {
            next(true, in_string);
            return "";
          }
      }
      if (is_octal(ch)) {
        if (template_string && strict_hex) {
          const represents_null_character = ch === "0" && !is_octal(peek());
          if (!represents_null_character) {
            parse_error("Octal escape sequences are not allowed in template strings");
          }
        }
        return read_octal_escape_sequence(ch, strict_hex);
      }
      return ch;
    }
    function read_octal_escape_sequence(ch, strict_octal) {
      var p = peek();
      if (p >= "0" && p <= "7") {
        ch += next(true);
        if (ch[0] <= "3" && (p = peek()) >= "0" && p <= "7")
          ch += next(true);
      }
      if (ch === "0") return "\0";
      if (ch.length > 0 && next_token.has_directive("use strict") && strict_octal)
        parse_error("Legacy octal escape sequences are not allowed in strict mode");
      return String.fromCharCode(parseInt(ch, 8));
    }
    function hex_bytes(n, strict_hex) {
      var num = 0;
      for (; n > 0; --n) {
        if (!strict_hex && isNaN(parseInt(peek(), 16))) {
          return parseInt(num, 16) || "";
        }
        var digit = next(true);
        if (isNaN(parseInt(digit, 16)))
          parse_error("Invalid hex-character pattern in string");
        num += digit;
      }
      return parseInt(num, 16);
    }
    var read_string = with_eof_error("Unterminated string constant", function() {
      const start_pos = S.pos;
      var quote = next(), ret = [];
      for (; ; ) {
        var ch = next(true, true);
        if (ch == "\\") ch = read_escaped_char(true, true);
        else if (ch == "\r" || ch == "\n") parse_error("Unterminated string constant");
        else if (ch == quote) break;
        ret.push(ch);
      }
      var tok = token("string", ret.join(""));
      LATEST_RAW = S.text.slice(start_pos, S.pos);
      tok.quote = quote;
      return tok;
    });
    var read_template_characters = with_eof_error("Unterminated template", function(begin) {
      if (begin) {
        S.template_braces.push(S.brace_counter);
      }
      var content = "", raw = "", ch, tok;
      next(true, true);
      while ((ch = next(true, true)) != "`") {
        if (ch == "\r") {
          if (peek() == "\n") ++S.pos;
          ch = "\n";
        } else if (ch == "$" && peek() == "{") {
          next(true, true);
          S.brace_counter++;
          tok = token(begin ? "template_head" : "template_substitution", content);
          TEMPLATE_RAWS.set(tok, raw);
          tok.template_end = false;
          return tok;
        }
        raw += ch;
        if (ch == "\\") {
          var tmp = S.pos;
          var prev_is_tag = previous_token && (previous_token.type === "name" || previous_token.type === "punc" && (previous_token.value === ")" || previous_token.value === "]"));
          ch = read_escaped_char(true, !prev_is_tag, true);
          raw += S.text.substr(tmp, S.pos - tmp);
        }
        content += ch;
      }
      S.template_braces.pop();
      tok = token(begin ? "template_head" : "template_substitution", content);
      TEMPLATE_RAWS.set(tok, raw);
      tok.template_end = true;
      return tok;
    });
    function skip_line_comment(type) {
      var regex_allowed = S.regex_allowed;
      var i = find_eol(), ret;
      if (i == -1) {
        ret = S.text.substr(S.pos);
        S.pos = S.text.length;
      } else {
        ret = S.text.substring(S.pos, i);
        S.pos = i;
      }
      S.col = S.tokcol + (S.pos - S.tokpos);
      S.comments_before.push(token(type, ret, true));
      S.regex_allowed = regex_allowed;
      return next_token;
    }
    var skip_multiline_comment = with_eof_error("Unterminated multiline comment", function() {
      var regex_allowed = S.regex_allowed;
      var i = find("*/", true);
      var text = S.text.substring(S.pos, i).replace(/\r\n|\r|\u2028|\u2029/g, "\n");
      forward(get_full_char_length(text) + 2);
      S.comments_before.push(token("comment2", text, true));
      S.newline_before = S.newline_before || text.includes("\n");
      S.regex_allowed = regex_allowed;
      return next_token;
    });
    var read_name = with_eof_error("Unterminated identifier name", function() {
      var name = [], ch, escaped = false;
      var read_escaped_identifier_char = function() {
        escaped = true;
        next();
        if (peek() !== "u") {
          parse_error("Expecting UnicodeEscapeSequence -- uXXXX or u{XXXX}");
        }
        return read_escaped_char(false, true);
      };
      if ((ch = peek()) === "\\") {
        ch = read_escaped_identifier_char();
        if (!is_identifier_start(ch)) {
          parse_error("First identifier char is an invalid identifier char");
        }
      } else if (is_identifier_start(ch)) {
        next();
      } else {
        return "";
      }
      name.push(ch);
      while ((ch = peek()) != null) {
        if ((ch = peek()) === "\\") {
          ch = read_escaped_identifier_char();
          if (!is_identifier_char(ch)) {
            parse_error("Invalid escaped identifier char");
          }
        } else {
          if (!is_identifier_char(ch)) {
            break;
          }
          next();
        }
        name.push(ch);
      }
      const name_str = name.join("");
      if (RESERVED_WORDS.has(name_str) && escaped) {
        parse_error("Escaped characters are not allowed in keywords");
      }
      return name_str;
    });
    var read_regexp = with_eof_error("Unterminated regular expression", function(source) {
      var prev_backslash = false, ch, in_class = false;
      while (ch = next(true)) if (NEWLINE_CHARS.has(ch)) {
        parse_error("Unexpected line terminator");
      } else if (prev_backslash) {
        if (/^[\u0000-\u007F]$/.test(ch)) {
          source += "\\" + ch;
        } else {
          source += ch;
        }
        prev_backslash = false;
      } else if (ch == "[") {
        in_class = true;
        source += ch;
      } else if (ch == "]" && in_class) {
        in_class = false;
        source += ch;
      } else if (ch == "/" && !in_class) {
        break;
      } else if (ch == "\\") {
        prev_backslash = true;
      } else {
        source += ch;
      }
      const flags = read_name();
      return token("regexp", "/" + source + "/" + flags);
    });
    function read_operator(prefix) {
      function grow(op) {
        if (!peek()) return op;
        var bigger = op + peek();
        if (OPERATORS.has(bigger)) {
          next();
          return grow(bigger);
        } else {
          return op;
        }
      }
      return token("operator", grow(prefix || next()));
    }
    function handle_slash() {
      next();
      switch (peek()) {
        case "/":
          next();
          return skip_line_comment("comment1");
        case "*":
          next();
          return skip_multiline_comment();
      }
      return S.regex_allowed ? read_regexp("") : read_operator("/");
    }
    function handle_eq_sign() {
      next();
      if (peek() === ">") {
        next();
        return token("arrow", "=>");
      } else {
        return read_operator("=");
      }
    }
    function handle_dot() {
      next();
      if (is_digit(peek().charCodeAt(0))) {
        return read_num(".");
      }
      if (peek() === ".") {
        next();
        next();
        return token("expand", "...");
      }
      return token("punc", ".");
    }
    function read_word() {
      var word = read_name();
      if (prev_was_dot) return token("name", word);
      return KEYWORDS_ATOM.has(word) ? token("atom", word) : !KEYWORDS.has(word) ? token("name", word) : OPERATORS.has(word) ? token("operator", word) : token("keyword", word);
    }
    function read_private_word() {
      next();
      return token("privatename", read_name());
    }
    function with_eof_error(eof_error, cont) {
      return function(x) {
        try {
          return cont(x);
        } catch (ex) {
          if (ex === EX_EOF) parse_error(eof_error);
          else throw ex;
        }
      };
    }
    function next_token(force_regexp) {
      if (force_regexp != null)
        return read_regexp(force_regexp);
      if (shebang && S.pos == 0 && looking_at("#!")) {
        start_token();
        forward(2);
        skip_line_comment("comment5");
      }
      for (; ; ) {
        skip_whitespace();
        start_token();
        if (html5_comments) {
          if (looking_at("<!--")) {
            forward(4);
            skip_line_comment("comment3");
            continue;
          }
          if (looking_at("-->") && S.newline_before) {
            forward(3);
            skip_line_comment("comment4");
            continue;
          }
        }
        var ch = peek();
        if (!ch) return token("eof");
        var code = ch.charCodeAt(0);
        switch (code) {
          case 34:
          case 39:
            return read_string();
          case 46:
            return handle_dot();
          case 47: {
            var tok = handle_slash();
            if (tok === next_token) continue;
            return tok;
          }
          case 61:
            return handle_eq_sign();
          case 63: {
            if (!is_option_chain_op()) break;
            next();
            next();
            return token("punc", "?.");
          }
          case 96:
            return read_template_characters(true);
          case 123:
            S.brace_counter++;
            break;
          case 125:
            S.brace_counter--;
            if (S.template_braces.length > 0 && S.template_braces[S.template_braces.length - 1] === S.brace_counter)
              return read_template_characters(false);
            break;
        }
        if (is_digit(code)) return read_num();
        if (PUNC_CHARS.has(ch)) return token("punc", next());
        if (OPERATOR_CHARS.has(ch)) return read_operator();
        if (code == 92 || is_identifier_start(ch)) return read_word();
        if (code == 35) return read_private_word();
        break;
      }
      parse_error("Unexpected character '" + ch + "'");
    }
    next_token.next = next;
    next_token.peek = peek;
    next_token.context = function(nc) {
      if (nc) S = nc;
      return S;
    };
    next_token.add_directive = function(directive) {
      S.directive_stack[S.directive_stack.length - 1].push(directive);
      if (S.directives[directive] === void 0) {
        S.directives[directive] = 1;
      } else {
        S.directives[directive]++;
      }
    };
    next_token.push_directives_stack = function() {
      S.directive_stack.push([]);
    };
    next_token.pop_directives_stack = function() {
      var directives2 = S.directive_stack[S.directive_stack.length - 1];
      for (var i = 0; i < directives2.length; i++) {
        S.directives[directives2[i]]--;
      }
      S.directive_stack.pop();
    };
    next_token.has_directive = function(directive) {
      return S.directives[directive] > 0;
    };
    return next_token;
  }
  var UNARY_PREFIX = makePredicate([
    "typeof",
    "void",
    "delete",
    "--",
    "++",
    "!",
    "~",
    "-",
    "+"
  ]);
  var UNARY_POSTFIX = makePredicate(["--", "++"]);
  var ASSIGNMENT = makePredicate(["=", "+=", "-=", "??=", "&&=", "||=", "/=", "*=", "**=", "%=", ">>=", "<<=", ">>>=", "|=", "^=", "&="]);
  var LOGICAL_ASSIGNMENT = makePredicate(["??=", "&&=", "||="]);
  var PRECEDENCE = function(a, ret) {
    for (var i = 0; i < a.length; ++i) {
      for (const op of a[i]) {
        ret[op] = i + 1;
      }
    }
    return ret;
  }(
    [
      ["||"],
      ["??"],
      ["&&"],
      ["|"],
      ["^"],
      ["&"],
      ["==", "===", "!=", "!=="],
      ["<", ">", "<=", ">=", "in", "instanceof"],
      [">>", "<<", ">>>"],
      ["+", "-"],
      ["*", "/", "%"],
      ["**"]
    ],
    {}
  );
  var ATOMIC_START_TOKEN = makePredicate(["atom", "num", "big_int", "string", "regexp", "name"]);
  function parse($TEXT, options) {
    const outer_comments_before_counts = /* @__PURE__ */ new WeakMap();
    options = defaults(options, {
      bare_returns: false,
      ecma: null,
      // Legacy
      expression: false,
      filename: null,
      html5_comments: true,
      module: false,
      shebang: true,
      strict: false,
      toplevel: null
    }, true);
    var S = {
      input: typeof $TEXT == "string" ? tokenizer(
        $TEXT,
        options.filename,
        options.html5_comments,
        options.shebang
      ) : $TEXT,
      token: null,
      prev: null,
      peeked: null,
      in_function: 0,
      in_async: -1,
      in_generator: -1,
      in_directives: true,
      in_loop: 0,
      labels: []
    };
    S.token = next();
    function is(type, value) {
      return is_token(S.token, type, value);
    }
    function peek() {
      return S.peeked || (S.peeked = S.input());
    }
    function next() {
      S.prev = S.token;
      if (!S.peeked) peek();
      S.token = S.peeked;
      S.peeked = null;
      S.in_directives = S.in_directives && (S.token.type == "string" || is("punc", ";"));
      return S.token;
    }
    function prev() {
      return S.prev;
    }
    function croak(msg, line, col, pos) {
      var ctx = S.input.context();
      js_error(
        msg,
        ctx.filename,
        line != null ? line : ctx.tokline,
        col != null ? col : ctx.tokcol,
        pos != null ? pos : ctx.tokpos
      );
    }
    function token_error(token, msg) {
      croak(msg, token.line, token.col);
    }
    function unexpected(token) {
      if (token == null)
        token = S.token;
      token_error(token, "Unexpected token: " + token.type + " (" + token.value + ")");
    }
    function expect_token(type, val) {
      if (is(type, val)) {
        return next();
      }
      token_error(S.token, "Unexpected token " + S.token.type + " \xAB" + S.token.value + "\xBB, expected " + type + " \xAB" + val + "\xBB");
    }
    function expect(punc) {
      return expect_token("punc", punc);
    }
    function has_newline_before(token) {
      return token.nlb || !token.comments_before.every((comment) => !comment.nlb);
    }
    function can_insert_semicolon() {
      return !options.strict && (is("eof") || is("punc", "}") || has_newline_before(S.token));
    }
    function is_in_generator() {
      return S.in_generator === S.in_function;
    }
    function is_in_async() {
      return S.in_async === S.in_function;
    }
    function can_await() {
      return S.in_async === S.in_function || S.in_function === 0 && S.input.has_directive("use strict");
    }
    function semicolon(optional) {
      if (is("punc", ";")) next();
      else if (!optional && !can_insert_semicolon()) unexpected();
    }
    function parenthesised() {
      expect("(");
      var exp = expression(true);
      expect(")");
      return exp;
    }
    function embed_tokens(parser) {
      return function _embed_tokens_wrapper(...args) {
        const start = S.token;
        const expr = parser(...args);
        expr.start = start;
        expr.end = prev();
        return expr;
      };
    }
    function handle_regexp() {
      if (is("operator", "/") || is("operator", "/=")) {
        S.peeked = null;
        S.token = S.input(S.token.value.substr(1));
      }
    }
    var statement = embed_tokens(function statement2(is_export_default, is_for_body, is_if_body) {
      handle_regexp();
      switch (S.token.type) {
        case "string":
          if (S.in_directives) {
            var token = peek();
            if (!LATEST_RAW.includes("\\") && (is_token(token, "punc", ";") || is_token(token, "punc", "}") || has_newline_before(token) || is_token(token, "eof"))) {
              S.input.add_directive(S.token.value);
            } else {
              S.in_directives = false;
            }
          }
          var dir = S.in_directives, stat = simple_statement();
          return dir && stat.body instanceof AST_String ? new AST_Directive(stat.body) : stat;
        case "template_head":
        case "num":
        case "big_int":
        case "regexp":
        case "operator":
        case "atom":
          return simple_statement();
        case "name":
        case "privatename":
          if (is("privatename") && !S.in_class)
            croak("Private field must be used in an enclosing class");
          if (S.token.value == "async" && is_token(peek(), "keyword", "function")) {
            next();
            next();
            if (is_for_body) {
              croak("functions are not allowed as the body of a loop");
            }
            return function_(AST_Defun, false, true, is_export_default);
          }
          if (S.token.value == "import" && !is_token(peek(), "punc", "(") && !is_token(peek(), "punc", ".")) {
            next();
            var node = import_statement();
            semicolon();
            return node;
          }
          return is_token(peek(), "punc", ":") ? labeled_statement() : simple_statement();
        case "punc":
          switch (S.token.value) {
            case "{":
              return new AST_BlockStatement({
                start: S.token,
                body: block_(),
                end: prev()
              });
            case "[":
            case "(":
              return simple_statement();
            case ";":
              S.in_directives = false;
              next();
              return new AST_EmptyStatement();
            default:
              unexpected();
          }
        case "keyword":
          switch (S.token.value) {
            case "break":
              next();
              return break_cont(AST_Break);
            case "continue":
              next();
              return break_cont(AST_Continue);
            case "debugger":
              next();
              semicolon();
              return new AST_Debugger();
            case "do":
              next();
              var body = in_loop(statement2);
              expect_token("keyword", "while");
              var condition = parenthesised();
              semicolon(true);
              return new AST_Do({
                body,
                condition
              });
            case "while":
              next();
              return new AST_While({
                condition: parenthesised(),
                body: in_loop(function() {
                  return statement2(false, true);
                })
              });
            case "for":
              next();
              return for_();
            case "class":
              next();
              if (is_for_body) {
                croak("classes are not allowed as the body of a loop");
              }
              if (is_if_body) {
                croak("classes are not allowed as the body of an if");
              }
              return class_(AST_DefClass, is_export_default);
            case "function":
              next();
              if (is_for_body) {
                croak("functions are not allowed as the body of a loop");
              }
              return function_(AST_Defun, false, false, is_export_default);
            case "if":
              next();
              return if_();
            case "return":
              if (S.in_function == 0 && !options.bare_returns)
                croak("'return' outside of function");
              next();
              var value = null;
              if (is("punc", ";")) {
                next();
              } else if (!can_insert_semicolon()) {
                value = expression(true);
                semicolon();
              }
              return new AST_Return({
                value
              });
            case "switch":
              next();
              return new AST_Switch({
                expression: parenthesised(),
                body: in_loop(switch_body_)
              });
            case "throw":
              next();
              if (has_newline_before(S.token))
                croak("Illegal newline after 'throw'");
              var value = expression(true);
              semicolon();
              return new AST_Throw({
                value
              });
            case "try":
              next();
              return try_();
            case "var":
              next();
              var node = var_();
              semicolon();
              return node;
            case "let":
              next();
              var node = let_();
              semicolon();
              return node;
            case "const":
              next();
              var node = const_();
              semicolon();
              return node;
            case "with":
              if (S.input.has_directive("use strict")) {
                croak("Strict mode may not include a with statement");
              }
              next();
              return new AST_With({
                expression: parenthesised(),
                body: statement2()
              });
            case "export":
              if (!is_token(peek(), "punc", "(")) {
                next();
                var node = export_statement();
                if (is("punc", ";")) semicolon();
                return node;
              }
          }
      }
      unexpected();
    });
    function labeled_statement() {
      var label = as_symbol(AST_Label);
      if (label.name === "await" && is_in_async()) {
        token_error(S.prev, "await cannot be used as label inside async function");
      }
      if (S.labels.some((l) => l.name === label.name)) {
        croak("Label " + label.name + " defined twice");
      }
      expect(":");
      S.labels.push(label);
      var stat = statement();
      S.labels.pop();
      if (!(stat instanceof AST_IterationStatement)) {
        label.references.forEach(function(ref) {
          if (ref instanceof AST_Continue) {
            ref = ref.label.start;
            croak(
              "Continue label `" + label.name + "` refers to non-IterationStatement.",
              ref.line,
              ref.col,
              ref.pos
            );
          }
        });
      }
      return new AST_LabeledStatement({ body: stat, label });
    }
    function simple_statement(tmp) {
      return new AST_SimpleStatement({ body: (tmp = expression(true), semicolon(), tmp) });
    }
    function break_cont(type) {
      var label = null, ldef;
      if (!can_insert_semicolon()) {
        label = as_symbol(AST_LabelRef, true);
      }
      if (label != null) {
        ldef = S.labels.find((l) => l.name === label.name);
        if (!ldef)
          croak("Undefined label " + label.name);
        label.thedef = ldef;
      } else if (S.in_loop == 0)
        croak(type.TYPE + " not inside a loop or switch");
      semicolon();
      var stat = new type({ label });
      if (ldef) ldef.references.push(stat);
      return stat;
    }
    function for_() {
      var for_await_error = "`for await` invalid in this context";
      var await_tok = S.token;
      if (await_tok.type == "name" && await_tok.value == "await") {
        if (!can_await()) {
          token_error(await_tok, for_await_error);
        }
        next();
      } else {
        await_tok = false;
      }
      expect("(");
      var init = null;
      if (!is("punc", ";")) {
        init = is("keyword", "var") ? (next(), var_(true)) : is("keyword", "let") ? (next(), let_(true)) : is("keyword", "const") ? (next(), const_(true)) : expression(true, true);
        var is_in = is("operator", "in");
        var is_of = is("name", "of");
        if (await_tok && !is_of) {
          token_error(await_tok, for_await_error);
        }
        if (is_in || is_of) {
          if (init instanceof AST_Definitions) {
            if (init.definitions.length > 1)
              token_error(init.start, "Only one variable declaration allowed in for..in loop");
          } else if (!(is_assignable(init) || (init = to_destructuring(init)) instanceof AST_Destructuring)) {
            token_error(init.start, "Invalid left-hand side in for..in loop");
          }
          next();
          if (is_in) {
            return for_in(init);
          } else {
            return for_of(init, !!await_tok);
          }
        }
      } else if (await_tok) {
        token_error(await_tok, for_await_error);
      }
      return regular_for(init);
    }
    function regular_for(init) {
      expect(";");
      var test = is("punc", ";") ? null : expression(true);
      expect(";");
      var step = is("punc", ")") ? null : expression(true);
      expect(")");
      return new AST_For({
        init,
        condition: test,
        step,
        body: in_loop(function() {
          return statement(false, true);
        })
      });
    }
    function for_of(init, is_await) {
      var lhs = init instanceof AST_Definitions ? init.definitions[0].name : null;
      var obj = expression(true);
      expect(")");
      return new AST_ForOf({
        await: is_await,
        init,
        name: lhs,
        object: obj,
        body: in_loop(function() {
          return statement(false, true);
        })
      });
    }
    function for_in(init) {
      var obj = expression(true);
      expect(")");
      return new AST_ForIn({
        init,
        object: obj,
        body: in_loop(function() {
          return statement(false, true);
        })
      });
    }
    var arrow_function = function(start, argnames, is_async) {
      if (has_newline_before(S.token)) {
        croak("Unexpected newline before arrow (=>)");
      }
      expect_token("arrow", "=>");
      var body = _function_body(is("punc", "{"), false, is_async);
      var end = body instanceof Array && body.length ? body[body.length - 1].end : body instanceof Array ? start : body.end;
      return new AST_Arrow({
        start,
        end,
        async: is_async,
        argnames,
        body
      });
    };
    var function_ = function(ctor, is_generator_property, is_async, is_export_default) {
      var in_statement = ctor === AST_Defun;
      var is_generator = is("operator", "*");
      if (is_generator) {
        next();
      }
      var name = is("name") ? as_symbol(in_statement ? AST_SymbolDefun : AST_SymbolLambda) : null;
      if (in_statement && !name) {
        if (is_export_default) {
          ctor = AST_Function;
        } else {
          unexpected();
        }
      }
      if (name && ctor !== AST_Accessor && !(name instanceof AST_SymbolDeclaration))
        unexpected(prev());
      var args = [];
      var body = _function_body(true, is_generator || is_generator_property, is_async, name, args);
      return new ctor({
        start: args.start,
        end: body.end,
        is_generator,
        async: is_async,
        name,
        argnames: args,
        body
      });
    };
    class UsedParametersTracker {
      constructor(is_parameter, strict, duplicates_ok = false) {
        this.is_parameter = is_parameter;
        this.duplicates_ok = duplicates_ok;
        this.parameters = /* @__PURE__ */ new Set();
        this.duplicate = null;
        this.default_assignment = false;
        this.spread = false;
        this.strict_mode = !!strict;
      }
      add_parameter(token) {
        if (this.parameters.has(token.value)) {
          if (this.duplicate === null) {
            this.duplicate = token;
          }
          this.check_strict();
        } else {
          this.parameters.add(token.value);
          if (this.is_parameter) {
            switch (token.value) {
              case "arguments":
              case "eval":
              case "yield":
                if (this.strict_mode) {
                  token_error(token, "Unexpected " + token.value + " identifier as parameter inside strict mode");
                }
                break;
              default:
                if (RESERVED_WORDS.has(token.value)) {
                  unexpected();
                }
            }
          }
        }
      }
      mark_default_assignment(token) {
        if (this.default_assignment === false) {
          this.default_assignment = token;
        }
      }
      mark_spread(token) {
        if (this.spread === false) {
          this.spread = token;
        }
      }
      mark_strict_mode() {
        this.strict_mode = true;
      }
      is_strict() {
        return this.default_assignment !== false || this.spread !== false || this.strict_mode;
      }
      check_strict() {
        if (this.is_strict() && this.duplicate !== null && !this.duplicates_ok) {
          token_error(this.duplicate, "Parameter " + this.duplicate.value + " was used already");
        }
      }
    }
    function parameters(params) {
      var used_parameters = new UsedParametersTracker(true, S.input.has_directive("use strict"));
      expect("(");
      while (!is("punc", ")")) {
        var param = parameter(used_parameters);
        params.push(param);
        if (!is("punc", ")")) {
          expect(",");
        }
        if (param instanceof AST_Expansion) {
          break;
        }
      }
      next();
    }
    function parameter(used_parameters, symbol_type) {
      var param;
      var expand = false;
      if (used_parameters === void 0) {
        used_parameters = new UsedParametersTracker(true, S.input.has_directive("use strict"));
      }
      if (is("expand", "...")) {
        expand = S.token;
        used_parameters.mark_spread(S.token);
        next();
      }
      param = binding_element(used_parameters, symbol_type);
      if (is("operator", "=") && expand === false) {
        used_parameters.mark_default_assignment(S.token);
        next();
        param = new AST_DefaultAssign({
          start: param.start,
          left: param,
          operator: "=",
          right: expression(false),
          end: S.token
        });
      }
      if (expand !== false) {
        if (!is("punc", ")")) {
          unexpected();
        }
        param = new AST_Expansion({
          start: expand,
          expression: param,
          end: expand
        });
      }
      used_parameters.check_strict();
      return param;
    }
    function binding_element(used_parameters, symbol_type) {
      var elements = [];
      var first = true;
      var is_expand = false;
      var expand_token;
      var first_token = S.token;
      if (used_parameters === void 0) {
        const strict = S.input.has_directive("use strict");
        const duplicates_ok = symbol_type === AST_SymbolVar;
        used_parameters = new UsedParametersTracker(false, strict, duplicates_ok);
      }
      symbol_type = symbol_type === void 0 ? AST_SymbolFunarg : symbol_type;
      if (is("punc", "[")) {
        next();
        while (!is("punc", "]")) {
          if (first) {
            first = false;
          } else {
            expect(",");
          }
          if (is("expand", "...")) {
            is_expand = true;
            expand_token = S.token;
            used_parameters.mark_spread(S.token);
            next();
          }
          if (is("punc")) {
            switch (S.token.value) {
              case ",":
                elements.push(new AST_Hole({
                  start: S.token,
                  end: S.token
                }));
                continue;
              case "]":
                break;
              case "[":
              case "{":
                elements.push(binding_element(used_parameters, symbol_type));
                break;
              default:
                unexpected();
            }
          } else if (is("name")) {
            used_parameters.add_parameter(S.token);
            elements.push(as_symbol(symbol_type));
          } else {
            croak("Invalid function parameter");
          }
          if (is("operator", "=") && is_expand === false) {
            used_parameters.mark_default_assignment(S.token);
            next();
            elements[elements.length - 1] = new AST_DefaultAssign({
              start: elements[elements.length - 1].start,
              left: elements[elements.length - 1],
              operator: "=",
              right: expression(false),
              end: S.token
            });
          }
          if (is_expand) {
            if (!is("punc", "]")) {
              croak("Rest element must be last element");
            }
            elements[elements.length - 1] = new AST_Expansion({
              start: expand_token,
              expression: elements[elements.length - 1],
              end: expand_token
            });
          }
        }
        expect("]");
        used_parameters.check_strict();
        return new AST_Destructuring({
          start: first_token,
          names: elements,
          is_array: true,
          end: prev()
        });
      } else if (is("punc", "{")) {
        next();
        while (!is("punc", "}")) {
          if (first) {
            first = false;
          } else {
            expect(",");
          }
          if (is("expand", "...")) {
            is_expand = true;
            expand_token = S.token;
            used_parameters.mark_spread(S.token);
            next();
          }
          if (is("name") && (is_token(peek(), "punc") || is_token(peek(), "operator")) && [",", "}", "="].includes(peek().value)) {
            used_parameters.add_parameter(S.token);
            var start = prev();
            var value = as_symbol(symbol_type);
            if (is_expand) {
              elements.push(new AST_Expansion({
                start: expand_token,
                expression: value,
                end: value.end
              }));
            } else {
              elements.push(new AST_ObjectKeyVal({
                start,
                key: value.name,
                value,
                end: value.end
              }));
            }
          } else if (is("punc", "}")) {
            continue;
          } else {
            var property_token = S.token;
            var property = as_property_name();
            if (property === null) {
              unexpected(prev());
            } else if (prev().type === "name" && !is("punc", ":")) {
              elements.push(new AST_ObjectKeyVal({
                start: prev(),
                key: property,
                value: new symbol_type({
                  start: prev(),
                  name: property,
                  end: prev()
                }),
                end: prev()
              }));
            } else {
              expect(":");
              elements.push(new AST_ObjectKeyVal({
                start: property_token,
                quote: property_token.quote,
                key: property,
                value: binding_element(used_parameters, symbol_type),
                end: prev()
              }));
            }
          }
          if (is_expand) {
            if (!is("punc", "}")) {
              croak("Rest element must be last element");
            }
          } else if (is("operator", "=")) {
            used_parameters.mark_default_assignment(S.token);
            next();
            elements[elements.length - 1].value = new AST_DefaultAssign({
              start: elements[elements.length - 1].value.start,
              left: elements[elements.length - 1].value,
              operator: "=",
              right: expression(false),
              end: S.token
            });
          }
        }
        expect("}");
        used_parameters.check_strict();
        return new AST_Destructuring({
          start: first_token,
          names: elements,
          is_array: false,
          end: prev()
        });
      } else if (is("name")) {
        used_parameters.add_parameter(S.token);
        return as_symbol(symbol_type);
      } else {
        croak("Invalid function parameter");
      }
    }
    function params_or_seq_(allow_arrows, maybe_sequence) {
      var spread_token;
      var invalid_sequence;
      var trailing_comma;
      var a = [];
      expect("(");
      while (!is("punc", ")")) {
        if (spread_token) unexpected(spread_token);
        if (is("expand", "...")) {
          spread_token = S.token;
          if (maybe_sequence) invalid_sequence = S.token;
          next();
          a.push(new AST_Expansion({
            start: prev(),
            expression: expression(),
            end: S.token
          }));
        } else {
          a.push(expression());
        }
        if (!is("punc", ")")) {
          expect(",");
          if (is("punc", ")")) {
            trailing_comma = prev();
            if (maybe_sequence) invalid_sequence = trailing_comma;
          }
        }
      }
      expect(")");
      if (allow_arrows && is("arrow", "=>")) {
        if (spread_token && trailing_comma) unexpected(trailing_comma);
      } else if (invalid_sequence) {
        unexpected(invalid_sequence);
      }
      return a;
    }
    function _function_body(block, generator, is_async, name, args) {
      var loop = S.in_loop;
      var labels = S.labels;
      var current_generator = S.in_generator;
      var current_async = S.in_async;
      ++S.in_function;
      if (generator)
        S.in_generator = S.in_function;
      if (is_async)
        S.in_async = S.in_function;
      if (args) parameters(args);
      if (block)
        S.in_directives = true;
      S.in_loop = 0;
      S.labels = [];
      if (block) {
        S.input.push_directives_stack();
        var a = block_();
        if (name) _verify_symbol(name);
        if (args) args.forEach(_verify_symbol);
        S.input.pop_directives_stack();
      } else {
        var a = [new AST_Return({
          start: S.token,
          value: expression(false),
          end: S.token
        })];
      }
      --S.in_function;
      S.in_loop = loop;
      S.labels = labels;
      S.in_generator = current_generator;
      S.in_async = current_async;
      return a;
    }
    function _await_expression() {
      if (!can_await()) {
        croak(
          "Unexpected await expression outside async function",
          S.prev.line,
          S.prev.col,
          S.prev.pos
        );
      }
      return new AST_Await({
        start: prev(),
        end: S.token,
        expression: maybe_unary(true)
      });
    }
    function _yield_expression() {
      if (!is_in_generator()) {
        croak(
          "Unexpected yield expression outside generator function",
          S.prev.line,
          S.prev.col,
          S.prev.pos
        );
      }
      var start = S.token;
      var star = false;
      var has_expression = true;
      if (can_insert_semicolon() || is("punc") && PUNC_AFTER_EXPRESSION.has(S.token.value)) {
        has_expression = false;
      } else if (is("operator", "*")) {
        star = true;
        next();
      }
      return new AST_Yield({
        start,
        is_star: star,
        expression: has_expression ? expression() : null,
        end: prev()
      });
    }
    function if_() {
      var cond = parenthesised(), body = statement(false, false, true), belse = null;
      if (is("keyword", "else")) {
        next();
        belse = statement(false, false, true);
      }
      return new AST_If({
        condition: cond,
        body,
        alternative: belse
      });
    }
    function block_() {
      expect("{");
      var a = [];
      while (!is("punc", "}")) {
        if (is("eof")) unexpected();
        a.push(statement());
      }
      next();
      return a;
    }
    function switch_body_() {
      expect("{");
      var a = [], cur = null, branch = null, tmp;
      while (!is("punc", "}")) {
        if (is("eof")) unexpected();
        if (is("keyword", "case")) {
          if (branch) branch.end = prev();
          cur = [];
          branch = new AST_Case({
            start: (tmp = S.token, next(), tmp),
            expression: expression(true),
            body: cur
          });
          a.push(branch);
          expect(":");
        } else if (is("keyword", "default")) {
          if (branch) branch.end = prev();
          cur = [];
          branch = new AST_Default({
            start: (tmp = S.token, next(), expect(":"), tmp),
            body: cur
          });
          a.push(branch);
        } else {
          if (!cur) unexpected();
          cur.push(statement());
        }
      }
      if (branch) branch.end = prev();
      next();
      return a;
    }
    function try_() {
      var body, bcatch = null, bfinally = null;
      body = new AST_TryBlock({
        start: S.token,
        body: block_(),
        end: prev()
      });
      if (is("keyword", "catch")) {
        var start = S.token;
        next();
        if (is("punc", "{")) {
          var name = null;
        } else {
          expect("(");
          var name = parameter(void 0, AST_SymbolCatch);
          expect(")");
        }
        bcatch = new AST_Catch({
          start,
          argname: name,
          body: block_(),
          end: prev()
        });
      }
      if (is("keyword", "finally")) {
        var start = S.token;
        next();
        bfinally = new AST_Finally({
          start,
          body: block_(),
          end: prev()
        });
      }
      if (!bcatch && !bfinally)
        croak("Missing catch/finally blocks");
      return new AST_Try({
        body,
        bcatch,
        bfinally
      });
    }
    function vardefs(no_in, kind) {
      var var_defs = [];
      var def;
      for (; ; ) {
        var sym_type = kind === "var" ? AST_SymbolVar : kind === "const" ? AST_SymbolConst : kind === "let" ? AST_SymbolLet : null;
        if (is("punc", "{") || is("punc", "[")) {
          def = new AST_VarDef({
            start: S.token,
            name: binding_element(void 0, sym_type),
            value: is("operator", "=") ? (expect_token("operator", "="), expression(false, no_in)) : null,
            end: prev()
          });
        } else {
          def = new AST_VarDef({
            start: S.token,
            name: as_symbol(sym_type),
            value: is("operator", "=") ? (next(), expression(false, no_in)) : !no_in && kind === "const" ? croak("Missing initializer in const declaration") : null,
            end: prev()
          });
          if (def.name.name == "import") croak("Unexpected token: import");
        }
        var_defs.push(def);
        if (!is("punc", ","))
          break;
        next();
      }
      return var_defs;
    }
    var var_ = function(no_in) {
      return new AST_Var({
        start: prev(),
        definitions: vardefs(no_in, "var"),
        end: prev()
      });
    };
    var let_ = function(no_in) {
      return new AST_Let({
        start: prev(),
        definitions: vardefs(no_in, "let"),
        end: prev()
      });
    };
    var const_ = function(no_in) {
      return new AST_Const({
        start: prev(),
        definitions: vardefs(no_in, "const"),
        end: prev()
      });
    };
    var new_ = function(allow_calls) {
      var start = S.token;
      expect_token("operator", "new");
      if (is("punc", ".")) {
        next();
        expect_token("name", "target");
        return subscripts(new AST_NewTarget({
          start,
          end: prev()
        }), allow_calls);
      }
      var newexp = expr_atom(false), args;
      if (is("punc", "(")) {
        next();
        args = expr_list(")", true);
      } else {
        args = [];
      }
      var call = new AST_New({
        start,
        expression: newexp,
        args,
        end: prev()
      });
      annotate(call);
      return subscripts(call, allow_calls);
    };
    function as_atom_node() {
      var tok = S.token, ret;
      switch (tok.type) {
        case "name":
          ret = _make_symbol(AST_SymbolRef);
          break;
        case "num":
          ret = new AST_Number({
            start: tok,
            end: tok,
            value: tok.value,
            raw: LATEST_RAW
          });
          break;
        case "big_int":
          ret = new AST_BigInt({ start: tok, end: tok, value: tok.value });
          break;
        case "string":
          ret = new AST_String({
            start: tok,
            end: tok,
            value: tok.value,
            quote: tok.quote
          });
          annotate(ret);
          break;
        case "regexp":
          const [_, source, flags] = tok.value.match(/^\/(.*)\/(\w*)$/);
          ret = new AST_RegExp({ start: tok, end: tok, value: { source, flags } });
          break;
        case "atom":
          switch (tok.value) {
            case "false":
              ret = new AST_False({ start: tok, end: tok });
              break;
            case "true":
              ret = new AST_True({ start: tok, end: tok });
              break;
            case "null":
              ret = new AST_Null({ start: tok, end: tok });
              break;
          }
          break;
      }
      next();
      return ret;
    }
    function to_fun_args(ex, default_seen_above) {
      var insert_default = function(ex2, default_value) {
        if (default_value) {
          return new AST_DefaultAssign({
            start: ex2.start,
            left: ex2,
            operator: "=",
            right: default_value,
            end: default_value.end
          });
        }
        return ex2;
      };
      if (ex instanceof AST_Object) {
        return insert_default(new AST_Destructuring({
          start: ex.start,
          end: ex.end,
          is_array: false,
          names: ex.properties.map((prop) => to_fun_args(prop))
        }), default_seen_above);
      } else if (ex instanceof AST_ObjectKeyVal) {
        ex.value = to_fun_args(ex.value);
        return insert_default(ex, default_seen_above);
      } else if (ex instanceof AST_Hole) {
        return ex;
      } else if (ex instanceof AST_Destructuring) {
        ex.names = ex.names.map((name) => to_fun_args(name));
        return insert_default(ex, default_seen_above);
      } else if (ex instanceof AST_SymbolRef) {
        return insert_default(new AST_SymbolFunarg({
          name: ex.name,
          start: ex.start,
          end: ex.end
        }), default_seen_above);
      } else if (ex instanceof AST_Expansion) {
        ex.expression = to_fun_args(ex.expression);
        return insert_default(ex, default_seen_above);
      } else if (ex instanceof AST_Array) {
        return insert_default(new AST_Destructuring({
          start: ex.start,
          end: ex.end,
          is_array: true,
          names: ex.elements.map((elm) => to_fun_args(elm))
        }), default_seen_above);
      } else if (ex instanceof AST_Assign) {
        return insert_default(to_fun_args(ex.left, ex.right), default_seen_above);
      } else if (ex instanceof AST_DefaultAssign) {
        ex.left = to_fun_args(ex.left);
        return ex;
      } else {
        croak("Invalid function parameter", ex.start.line, ex.start.col);
      }
    }
    var expr_atom = function(allow_calls, allow_arrows) {
      if (is("operator", "new")) {
        return new_(allow_calls);
      }
      if (is("name", "import") && is_token(peek(), "punc", ".")) {
        return import_meta(allow_calls);
      }
      var start = S.token;
      var peeked;
      var async = is("name", "async") && (peeked = peek()).value != "[" && peeked.type != "arrow" && as_atom_node();
      if (is("punc")) {
        switch (S.token.value) {
          case "(":
            if (async && !allow_calls) break;
            var exprs = params_or_seq_(allow_arrows, !async);
            if (allow_arrows && is("arrow", "=>")) {
              return arrow_function(start, exprs.map((e) => to_fun_args(e)), !!async);
            }
            var ex = async ? new AST_Call({
              expression: async,
              args: exprs
            }) : to_expr_or_sequence(start, exprs);
            if (ex.start) {
              const outer_comments_before = start.comments_before.length;
              outer_comments_before_counts.set(start, outer_comments_before);
              ex.start.comments_before.unshift(...start.comments_before);
              start.comments_before = ex.start.comments_before;
              if (outer_comments_before == 0 && start.comments_before.length > 0) {
                var comment = start.comments_before[0];
                if (!comment.nlb) {
                  comment.nlb = start.nlb;
                  start.nlb = false;
                }
              }
              start.comments_after = ex.start.comments_after;
            }
            ex.start = start;
            var end = prev();
            if (ex.end) {
              end.comments_before = ex.end.comments_before;
              ex.end.comments_after.push(...end.comments_after);
              end.comments_after = ex.end.comments_after;
            }
            ex.end = end;
            if (ex instanceof AST_Call) annotate(ex);
            return subscripts(ex, allow_calls);
          case "[":
            return subscripts(array_(), allow_calls);
          case "{":
            return subscripts(object_or_destructuring_(), allow_calls);
        }
        if (!async) unexpected();
      }
      if (allow_arrows && is("name") && is_token(peek(), "arrow")) {
        var param = new AST_SymbolFunarg({
          name: S.token.value,
          start,
          end: start
        });
        next();
        return arrow_function(start, [param], !!async);
      }
      if (is("keyword", "function")) {
        next();
        var func = function_(AST_Function, false, !!async);
        func.start = start;
        func.end = prev();
        return subscripts(func, allow_calls);
      }
      if (async) return subscripts(async, allow_calls);
      if (is("keyword", "class")) {
        next();
        var cls = class_(AST_ClassExpression);
        cls.start = start;
        cls.end = prev();
        return subscripts(cls, allow_calls);
      }
      if (is("template_head")) {
        return subscripts(template_string(), allow_calls);
      }
      if (ATOMIC_START_TOKEN.has(S.token.type)) {
        return subscripts(as_atom_node(), allow_calls);
      }
      unexpected();
    };
    function template_string() {
      var segments = [], start = S.token;
      segments.push(new AST_TemplateSegment({
        start: S.token,
        raw: TEMPLATE_RAWS.get(S.token),
        value: S.token.value,
        end: S.token
      }));
      while (!S.token.template_end) {
        next();
        handle_regexp();
        segments.push(expression(true));
        segments.push(new AST_TemplateSegment({
          start: S.token,
          raw: TEMPLATE_RAWS.get(S.token),
          value: S.token.value,
          end: S.token
        }));
      }
      next();
      return new AST_TemplateString({
        start,
        segments,
        end: S.token
      });
    }
    function expr_list(closing, allow_trailing_comma, allow_empty) {
      var first = true, a = [];
      while (!is("punc", closing)) {
        if (first) first = false;
        else expect(",");
        if (allow_trailing_comma && is("punc", closing)) break;
        if (is("punc", ",") && allow_empty) {
          a.push(new AST_Hole({ start: S.token, end: S.token }));
        } else if (is("expand", "...")) {
          next();
          a.push(new AST_Expansion({ start: prev(), expression: expression(), end: S.token }));
        } else {
          a.push(expression(false));
        }
      }
      next();
      return a;
    }
    var array_ = embed_tokens(function() {
      expect("[");
      return new AST_Array({
        elements: expr_list("]", !options.strict, true)
      });
    });
    var create_accessor = embed_tokens((is_generator, is_async) => {
      return function_(AST_Accessor, is_generator, is_async);
    });
    var object_or_destructuring_ = embed_tokens(function object_or_destructuring_2() {
      var start = S.token, first = true, a = [];
      expect("{");
      while (!is("punc", "}")) {
        if (first) first = false;
        else expect(",");
        if (!options.strict && is("punc", "}"))
          break;
        start = S.token;
        if (start.type == "expand") {
          next();
          a.push(new AST_Expansion({
            start,
            expression: expression(false),
            end: prev()
          }));
          continue;
        }
        if (is("privatename")) {
          croak("private fields are not allowed in an object");
        }
        var name = as_property_name();
        var value;
        if (!is("punc", ":")) {
          var concise = concise_method_or_getset(name, start);
          if (concise) {
            a.push(concise);
            continue;
          }
          value = new AST_SymbolRef({
            start: prev(),
            name,
            end: prev()
          });
        } else if (name === null) {
          unexpected(prev());
        } else {
          next();
          value = expression(false);
        }
        if (is("operator", "=")) {
          next();
          value = new AST_Assign({
            start,
            left: value,
            operator: "=",
            right: expression(false),
            logical: false,
            end: prev()
          });
        }
        const kv = new AST_ObjectKeyVal({
          start,
          quote: start.quote,
          key: name instanceof AST_Node ? name : "" + name,
          value,
          end: prev()
        });
        a.push(annotate(kv));
      }
      next();
      return new AST_Object({ properties: a });
    });
    function class_(KindOfClass, is_export_default) {
      var start, method, class_name, extends_, a = [];
      S.input.push_directives_stack();
      S.input.add_directive("use strict");
      if (S.token.type == "name" && S.token.value != "extends") {
        class_name = as_symbol(KindOfClass === AST_DefClass ? AST_SymbolDefClass : AST_SymbolClass);
      }
      if (KindOfClass === AST_DefClass && !class_name) {
        if (is_export_default) {
          KindOfClass = AST_ClassExpression;
        } else {
          unexpected();
        }
      }
      if (S.token.value == "extends") {
        next();
        extends_ = expression(true);
      }
      expect("{");
      const save_in_class = S.in_class;
      S.in_class = true;
      while (is("punc", ";")) {
        next();
      }
      while (!is("punc", "}")) {
        start = S.token;
        method = concise_method_or_getset(as_property_name(), start, true);
        if (!method) {
          unexpected();
        }
        a.push(method);
        while (is("punc", ";")) {
          next();
        }
      }
      S.in_class = save_in_class;
      S.input.pop_directives_stack();
      next();
      return new KindOfClass({
        start,
        name: class_name,
        extends: extends_,
        properties: a,
        end: prev()
      });
    }
    function concise_method_or_getset(name, start, is_class) {
      const get_symbol_ast = (name2, SymbolClass = AST_SymbolMethod) => {
        if (typeof name2 === "string" || typeof name2 === "number") {
          return new SymbolClass({
            start,
            name: "" + name2,
            end: prev()
          });
        } else if (name2 === null) {
          unexpected();
        }
        return name2;
      };
      const is_not_method_start = () => !is("punc", "(") && !is("punc", ",") && !is("punc", "}") && !is("punc", ";") && !is("operator", "=");
      var is_async = false;
      var is_static = false;
      var is_generator = false;
      var is_private = false;
      var accessor_type = null;
      if (is_class && name === "static" && is_not_method_start()) {
        const static_block = class_static_block();
        if (static_block != null) {
          return static_block;
        }
        is_static = true;
        name = as_property_name();
      }
      if (name === "async" && is_not_method_start()) {
        is_async = true;
        name = as_property_name();
      }
      if (prev().type === "operator" && prev().value === "*") {
        is_generator = true;
        name = as_property_name();
      }
      if ((name === "get" || name === "set") && is_not_method_start()) {
        accessor_type = name;
        name = as_property_name();
      }
      if (prev().type === "privatename") {
        is_private = true;
      }
      const property_token = prev();
      if (accessor_type != null) {
        if (!is_private) {
          const AccessorClass = accessor_type === "get" ? AST_ObjectGetter : AST_ObjectSetter;
          name = get_symbol_ast(name);
          return annotate(new AccessorClass({
            start,
            static: is_static,
            key: name,
            quote: name instanceof AST_SymbolMethod ? property_token.quote : void 0,
            value: create_accessor(),
            end: prev()
          }));
        } else {
          const AccessorClass = accessor_type === "get" ? AST_PrivateGetter : AST_PrivateSetter;
          return annotate(new AccessorClass({
            start,
            static: is_static,
            key: get_symbol_ast(name),
            value: create_accessor(),
            end: prev()
          }));
        }
      }
      if (is("punc", "(")) {
        name = get_symbol_ast(name);
        const AST_MethodVariant = is_private ? AST_PrivateMethod : AST_ConciseMethod;
        var node = new AST_MethodVariant({
          start,
          static: is_static,
          is_generator,
          async: is_async,
          key: name,
          quote: name instanceof AST_SymbolMethod ? property_token.quote : void 0,
          value: create_accessor(is_generator, is_async),
          end: prev()
        });
        return annotate(node);
      }
      if (is_class) {
        const key = get_symbol_ast(name, AST_SymbolClassProperty);
        const quote = key instanceof AST_SymbolClassProperty ? property_token.quote : void 0;
        const AST_ClassPropertyVariant = is_private ? AST_ClassPrivateProperty : AST_ClassProperty;
        if (is("operator", "=")) {
          next();
          return annotate(
            new AST_ClassPropertyVariant({
              start,
              static: is_static,
              quote,
              key,
              value: expression(false),
              end: prev()
            })
          );
        } else if (is("name") || is("privatename") || is("operator", "*") || is("punc", ";") || is("punc", "}")) {
          return annotate(
            new AST_ClassPropertyVariant({
              start,
              static: is_static,
              quote,
              key,
              end: prev()
            })
          );
        }
      }
    }
    function class_static_block() {
      if (!is("punc", "{")) {
        return null;
      }
      const start = S.token;
      const body = [];
      next();
      while (!is("punc", "}")) {
        body.push(statement());
      }
      next();
      return new AST_ClassStaticBlock({ start, body, end: prev() });
    }
    function maybe_import_assertion() {
      if (is("name", "assert") && !has_newline_before(S.token)) {
        next();
        return object_or_destructuring_();
      }
      return null;
    }
    function import_statement() {
      var start = prev();
      var imported_name;
      var imported_names;
      if (is("name")) {
        imported_name = as_symbol(AST_SymbolImport);
      }
      if (is("punc", ",")) {
        next();
      }
      imported_names = map_names(true);
      if (imported_names || imported_name) {
        expect_token("name", "from");
      }
      var mod_str = S.token;
      if (mod_str.type !== "string") {
        unexpected();
      }
      next();
      const assert_clause = maybe_import_assertion();
      return new AST_Import({
        start,
        imported_name,
        imported_names,
        module_name: new AST_String({
          start: mod_str,
          value: mod_str.value,
          quote: mod_str.quote,
          end: mod_str
        }),
        assert_clause,
        end: S.token
      });
    }
    function import_meta(allow_calls) {
      var start = S.token;
      expect_token("name", "import");
      expect_token("punc", ".");
      expect_token("name", "meta");
      return subscripts(new AST_ImportMeta({
        start,
        end: prev()
      }), allow_calls);
    }
    function map_name(is_import) {
      function make_symbol(type2, quote) {
        return new type2({
          name: as_property_name(),
          quote: quote || void 0,
          start: prev(),
          end: prev()
        });
      }
      var foreign_type = is_import ? AST_SymbolImportForeign : AST_SymbolExportForeign;
      var type = is_import ? AST_SymbolImport : AST_SymbolExport;
      var start = S.token;
      var foreign_name;
      var name;
      if (is_import) {
        foreign_name = make_symbol(foreign_type, start.quote);
      } else {
        name = make_symbol(type, start.quote);
      }
      if (is("name", "as")) {
        next();
        if (is_import) {
          name = make_symbol(type);
        } else {
          foreign_name = make_symbol(foreign_type, S.token.quote);
        }
      } else if (is_import) {
        name = new type(foreign_name);
      } else {
        foreign_name = new foreign_type(name);
      }
      return new AST_NameMapping({
        start,
        foreign_name,
        name,
        end: prev()
      });
    }
    function map_nameAsterisk(is_import, import_or_export_foreign_name) {
      var foreign_type = is_import ? AST_SymbolImportForeign : AST_SymbolExportForeign;
      var type = is_import ? AST_SymbolImport : AST_SymbolExport;
      var start = S.token;
      var name, foreign_name;
      var end = prev();
      if (is_import) {
        name = import_or_export_foreign_name;
      } else {
        foreign_name = import_or_export_foreign_name;
      }
      name = name || new type({
        start,
        name: "*",
        end
      });
      foreign_name = foreign_name || new foreign_type({
        start,
        name: "*",
        end
      });
      return new AST_NameMapping({
        start,
        foreign_name,
        name,
        end
      });
    }
    function map_names(is_import) {
      var names;
      if (is("punc", "{")) {
        next();
        names = [];
        while (!is("punc", "}")) {
          names.push(map_name(is_import));
          if (is("punc", ",")) {
            next();
          }
        }
        next();
      } else if (is("operator", "*")) {
        var name;
        next();
        if (is("name", "as")) {
          next();
          name = is_import ? as_symbol(AST_SymbolImport) : as_symbol_or_string(AST_SymbolExportForeign);
        }
        names = [map_nameAsterisk(is_import, name)];
      }
      return names;
    }
    function export_statement() {
      var start = S.token;
      var is_default;
      var exported_names;
      if (is("keyword", "default")) {
        is_default = true;
        next();
      } else if (exported_names = map_names(false)) {
        if (is("name", "from")) {
          next();
          var mod_str = S.token;
          if (mod_str.type !== "string") {
            unexpected();
          }
          next();
          const assert_clause = maybe_import_assertion();
          return new AST_Export({
            start,
            is_default,
            exported_names,
            module_name: new AST_String({
              start: mod_str,
              value: mod_str.value,
              quote: mod_str.quote,
              end: mod_str
            }),
            end: prev(),
            assert_clause
          });
        } else {
          return new AST_Export({
            start,
            is_default,
            exported_names,
            end: prev()
          });
        }
      }
      var node;
      var exported_value;
      var exported_definition;
      if (is("punc", "{") || is_default && (is("keyword", "class") || is("keyword", "function")) && is_token(peek(), "punc")) {
        exported_value = expression(false);
        semicolon();
      } else if ((node = statement(is_default)) instanceof AST_Definitions && is_default) {
        unexpected(node.start);
      } else if (node instanceof AST_Definitions || node instanceof AST_Defun || node instanceof AST_DefClass) {
        exported_definition = node;
      } else if (node instanceof AST_ClassExpression || node instanceof AST_Function) {
        exported_value = node;
      } else if (node instanceof AST_SimpleStatement) {
        exported_value = node.body;
      } else {
        unexpected(node.start);
      }
      return new AST_Export({
        start,
        is_default,
        exported_value,
        exported_definition,
        end: prev(),
        assert_clause: null
      });
    }
    function as_property_name() {
      var tmp = S.token;
      switch (tmp.type) {
        case "punc":
          if (tmp.value === "[") {
            next();
            var ex = expression(false);
            expect("]");
            return ex;
          } else unexpected(tmp);
        case "operator":
          if (tmp.value === "*") {
            next();
            return null;
          }
          if (!["delete", "in", "instanceof", "new", "typeof", "void"].includes(tmp.value)) {
            unexpected(tmp);
          }
        /* falls through */
        case "name":
        case "privatename":
        case "string":
        case "num":
        case "big_int":
        case "keyword":
        case "atom":
          next();
          return tmp.value;
        default:
          unexpected(tmp);
      }
    }
    function as_name() {
      var tmp = S.token;
      if (tmp.type != "name" && tmp.type != "privatename") unexpected();
      next();
      return tmp.value;
    }
    function _make_symbol(type) {
      var name = S.token.value;
      return new (name == "this" ? AST_This : name == "super" ? AST_Super : type)({
        name: String(name),
        start: S.token,
        end: S.token
      });
    }
    function _verify_symbol(sym) {
      var name = sym.name;
      if (is_in_generator() && name == "yield") {
        token_error(sym.start, "Yield cannot be used as identifier inside generators");
      }
      if (S.input.has_directive("use strict")) {
        if (name == "yield") {
          token_error(sym.start, "Unexpected yield identifier inside strict mode");
        }
        if (sym instanceof AST_SymbolDeclaration && (name == "arguments" || name == "eval")) {
          token_error(sym.start, "Unexpected " + name + " in strict mode");
        }
      }
    }
    function as_symbol(type, noerror) {
      if (!is("name")) {
        if (!noerror) croak("Name expected");
        return null;
      }
      var sym = _make_symbol(type);
      _verify_symbol(sym);
      next();
      return sym;
    }
    function as_symbol_or_string(type) {
      if (!is("name")) {
        if (!is("string")) {
          croak("Name or string expected");
        }
        var tok = S.token;
        var ret = new type({
          start: tok,
          end: tok,
          name: tok.value,
          quote: tok.quote
        });
        next();
        return ret;
      }
      var sym = _make_symbol(type);
      _verify_symbol(sym);
      next();
      return sym;
    }
    function annotate(node, before_token = node.start) {
      var comments = before_token.comments_before;
      const comments_outside_parens = outer_comments_before_counts.get(before_token);
      var i = comments_outside_parens != null ? comments_outside_parens : comments.length;
      while (--i >= 0) {
        var comment = comments[i];
        if (/[@#]__/.test(comment.value)) {
          if (/[@#]__PURE__/.test(comment.value)) {
            set_annotation(node, _PURE);
            break;
          }
          if (/[@#]__INLINE__/.test(comment.value)) {
            set_annotation(node, _INLINE);
            break;
          }
          if (/[@#]__NOINLINE__/.test(comment.value)) {
            set_annotation(node, _NOINLINE);
            break;
          }
          if (/[@#]__KEY__/.test(comment.value)) {
            set_annotation(node, _KEY);
            break;
          }
          if (/[@#]__MANGLE_PROP__/.test(comment.value)) {
            set_annotation(node, _MANGLEPROP);
            break;
          }
        }
      }
      return node;
    }
    var subscripts = function(expr, allow_calls, is_chain) {
      var start = expr.start;
      if (is("punc", ".")) {
        next();
        if (is("privatename") && !S.in_class)
          croak("Private field must be used in an enclosing class");
        const AST_DotVariant = is("privatename") ? AST_DotHash : AST_Dot;
        return annotate(subscripts(new AST_DotVariant({
          start,
          expression: expr,
          optional: false,
          property: as_name(),
          end: prev()
        }), allow_calls, is_chain));
      }
      if (is("punc", "[")) {
        next();
        var prop = expression(true);
        expect("]");
        return annotate(subscripts(new AST_Sub({
          start,
          expression: expr,
          optional: false,
          property: prop,
          end: prev()
        }), allow_calls, is_chain));
      }
      if (allow_calls && is("punc", "(")) {
        next();
        var call = new AST_Call({
          start,
          expression: expr,
          optional: false,
          args: call_args(),
          end: prev()
        });
        annotate(call);
        return subscripts(call, true, is_chain);
      }
      if (is("punc", "?.")) {
        next();
        let chain_contents;
        if (allow_calls && is("punc", "(")) {
          next();
          const call2 = new AST_Call({
            start,
            optional: true,
            expression: expr,
            args: call_args(),
            end: prev()
          });
          annotate(call2);
          chain_contents = subscripts(call2, true, true);
        } else if (is("name") || is("privatename")) {
          if (is("privatename") && !S.in_class)
            croak("Private field must be used in an enclosing class");
          const AST_DotVariant = is("privatename") ? AST_DotHash : AST_Dot;
          chain_contents = annotate(subscripts(new AST_DotVariant({
            start,
            expression: expr,
            optional: true,
            property: as_name(),
            end: prev()
          }), allow_calls, true));
        } else if (is("punc", "[")) {
          next();
          const property = expression(true);
          expect("]");
          chain_contents = annotate(subscripts(new AST_Sub({
            start,
            expression: expr,
            optional: true,
            property,
            end: prev()
          }), allow_calls, true));
        }
        if (!chain_contents) unexpected();
        if (chain_contents instanceof AST_Chain) return chain_contents;
        return new AST_Chain({
          start,
          expression: chain_contents,
          end: prev()
        });
      }
      if (is("template_head")) {
        if (is_chain) {
          unexpected();
        }
        return subscripts(new AST_PrefixedTemplateString({
          start,
          prefix: expr,
          template_string: template_string(),
          end: prev()
        }), allow_calls);
      }
      return expr;
    };
    function call_args() {
      var args = [];
      while (!is("punc", ")")) {
        if (is("expand", "...")) {
          next();
          args.push(new AST_Expansion({
            start: prev(),
            expression: expression(false),
            end: prev()
          }));
        } else {
          args.push(expression(false));
        }
        if (!is("punc", ")")) {
          expect(",");
        }
      }
      next();
      return args;
    }
    var maybe_unary = function(allow_calls, allow_arrows) {
      var start = S.token;
      if (start.type == "name" && start.value == "await" && can_await()) {
        next();
        return _await_expression();
      }
      if (is("operator") && UNARY_PREFIX.has(start.value)) {
        next();
        handle_regexp();
        var ex = make_unary(AST_UnaryPrefix, start, maybe_unary(allow_calls));
        ex.start = start;
        ex.end = prev();
        return ex;
      }
      var val = expr_atom(allow_calls, allow_arrows);
      while (is("operator") && UNARY_POSTFIX.has(S.token.value) && !has_newline_before(S.token)) {
        if (val instanceof AST_Arrow) unexpected();
        val = make_unary(AST_UnaryPostfix, S.token, val);
        val.start = start;
        val.end = S.token;
        next();
      }
      return val;
    };
    function make_unary(ctor, token, expr) {
      var op = token.value;
      switch (op) {
        case "++":
        case "--":
          if (!is_assignable(expr))
            croak("Invalid use of " + op + " operator", token.line, token.col, token.pos);
          break;
        case "delete":
          if (expr instanceof AST_SymbolRef && S.input.has_directive("use strict"))
            croak("Calling delete on expression not allowed in strict mode", expr.start.line, expr.start.col, expr.start.pos);
          break;
      }
      return new ctor({ operator: op, expression: expr });
    }
    var expr_op = function(left, min_prec, no_in) {
      var op = is("operator") ? S.token.value : null;
      if (op == "in" && no_in) op = null;
      if (op == "**" && left instanceof AST_UnaryPrefix && !is_token(left.start, "punc", "(") && left.operator !== "--" && left.operator !== "++")
        unexpected(left.start);
      var prec = op != null ? PRECEDENCE[op] : null;
      if (prec != null && (prec > min_prec || op === "**" && min_prec === prec)) {
        next();
        var right = expr_ops(no_in, prec, true);
        return expr_op(new AST_Binary({
          start: left.start,
          left,
          operator: op,
          right,
          end: right.end
        }), min_prec, no_in);
      }
      return left;
    };
    function expr_ops(no_in, min_prec, allow_calls, allow_arrows) {
      if (!no_in && min_prec < PRECEDENCE["in"] && is("privatename")) {
        if (!S.in_class) {
          croak("Private field must be used in an enclosing class");
        }
        const start = S.token;
        const key = new AST_SymbolPrivateProperty({
          start,
          name: start.value,
          end: start
        });
        next();
        expect_token("operator", "in");
        const private_in = new AST_PrivateIn({
          start,
          key,
          value: expr_ops(no_in, PRECEDENCE["in"], true),
          end: prev()
        });
        return expr_op(private_in, 0, no_in);
      } else {
        return expr_op(maybe_unary(allow_calls, allow_arrows), min_prec, no_in);
      }
    }
    var maybe_conditional = function(no_in) {
      var start = S.token;
      var expr = expr_ops(no_in, 0, true, true);
      if (is("operator", "?")) {
        next();
        var yes = expression(false);
        expect(":");
        return new AST_Conditional({
          start,
          condition: expr,
          consequent: yes,
          alternative: expression(false, no_in),
          end: prev()
        });
      }
      return expr;
    };
    function is_assignable(expr) {
      return expr instanceof AST_PropAccess || expr instanceof AST_SymbolRef;
    }
    function to_destructuring(node) {
      if (node instanceof AST_Object) {
        node = new AST_Destructuring({
          start: node.start,
          names: node.properties.map(to_destructuring),
          is_array: false,
          end: node.end
        });
      } else if (node instanceof AST_Array) {
        var names = [];
        for (var i = 0; i < node.elements.length; i++) {
          if (node.elements[i] instanceof AST_Expansion) {
            if (i + 1 !== node.elements.length) {
              token_error(node.elements[i].start, "Spread must the be last element in destructuring array");
            }
            node.elements[i].expression = to_destructuring(node.elements[i].expression);
          }
          names.push(to_destructuring(node.elements[i]));
        }
        node = new AST_Destructuring({
          start: node.start,
          names,
          is_array: true,
          end: node.end
        });
      } else if (node instanceof AST_ObjectProperty) {
        node.value = to_destructuring(node.value);
      } else if (node instanceof AST_Assign) {
        node = new AST_DefaultAssign({
          start: node.start,
          left: node.left,
          operator: "=",
          right: node.right,
          end: node.end
        });
      }
      return node;
    }
    var maybe_assign = function(no_in) {
      handle_regexp();
      var start = S.token;
      if (start.type == "name" && start.value == "yield") {
        if (is_in_generator()) {
          next();
          return _yield_expression();
        } else if (S.input.has_directive("use strict")) {
          token_error(S.token, "Unexpected yield identifier inside strict mode");
        }
      }
      var left = maybe_conditional(no_in);
      var val = S.token.value;
      if (is("operator") && ASSIGNMENT.has(val)) {
        if (is_assignable(left) || (left = to_destructuring(left)) instanceof AST_Destructuring) {
          next();
          return new AST_Assign({
            start,
            left,
            operator: val,
            right: maybe_assign(no_in),
            logical: LOGICAL_ASSIGNMENT.has(val),
            end: prev()
          });
        }
        croak("Invalid assignment");
      }
      return left;
    };
    var to_expr_or_sequence = function(start, exprs) {
      if (exprs.length === 1) {
        return exprs[0];
      } else if (exprs.length > 1) {
        return new AST_Sequence({ start, expressions: exprs, end: peek() });
      } else {
        croak("Invalid parenthesized expression");
      }
    };
    var expression = function(commas, no_in) {
      var start = S.token;
      var exprs = [];
      while (true) {
        exprs.push(maybe_assign(no_in));
        if (!commas || !is("punc", ",")) break;
        next();
        commas = true;
      }
      return to_expr_or_sequence(start, exprs);
    };
    function in_loop(cont) {
      ++S.in_loop;
      var ret = cont();
      --S.in_loop;
      return ret;
    }
    if (options.expression) {
      return expression(true);
    }
    return function parse_toplevel() {
      var start = S.token;
      var body = [];
      S.input.push_directives_stack();
      if (options.module) S.input.add_directive("use strict");
      while (!is("eof")) {
        body.push(statement());
      }
      S.input.pop_directives_stack();
      var end = prev();
      var toplevel = options.toplevel;
      if (toplevel) {
        toplevel.body = toplevel.body.concat(body);
        toplevel.end = end;
      } else {
        toplevel = new AST_Toplevel({ start, body, end });
      }
      TEMPLATE_RAWS = /* @__PURE__ */ new Map();
      return toplevel;
    }();
  }

  // node_modules/terser/lib/ast.js
  function DEFNODE(type, props, ctor, methods, base = AST_Node) {
    if (!props) props = [];
    else props = props.split(/\s+/);
    var self_props = props;
    if (base && base.PROPS)
      props = props.concat(base.PROPS);
    const proto = base && Object.create(base.prototype);
    if (proto) {
      ctor.prototype = proto;
      ctor.BASE = base;
    }
    if (base) base.SUBCLASSES.push(ctor);
    ctor.prototype.CTOR = ctor;
    ctor.prototype.constructor = ctor;
    ctor.PROPS = props || null;
    ctor.SELF_PROPS = self_props;
    ctor.SUBCLASSES = [];
    if (type) {
      ctor.prototype.TYPE = ctor.TYPE = type;
    }
    if (methods) {
      for (let i in methods) if (HOP(methods, i)) {
        if (i[0] === "$") {
          ctor[i.substr(1)] = methods[i];
        } else {
          ctor.prototype[i] = methods[i];
        }
      }
    }
    ctor.DEFMETHOD = function(name, method) {
      this.prototype[name] = method;
    };
    return ctor;
  }
  var has_tok_flag = (tok, flag) => Boolean(tok.flags & flag);
  var set_tok_flag = (tok, flag, truth) => {
    if (truth) {
      tok.flags |= flag;
    } else {
      tok.flags &= ~flag;
    }
  };
  var TOK_FLAG_NLB = 1;
  var TOK_FLAG_QUOTE_SINGLE = 2;
  var TOK_FLAG_QUOTE_EXISTS = 4;
  var TOK_FLAG_TEMPLATE_END = 8;
  var AST_Token = class {
    constructor(type, value, line, col, pos, nlb, comments_before, comments_after, file) {
      this.flags = nlb ? 1 : 0;
      this.type = type;
      this.value = value;
      this.line = line;
      this.col = col;
      this.pos = pos;
      this.comments_before = comments_before;
      this.comments_after = comments_after;
      this.file = file;
      Object.seal(this);
    }
    // Return a string summary of the token for node.js console.log
    [Symbol.for("nodejs.util.inspect.custom")](_depth, options) {
      const special = (str) => options.stylize(str, "special");
      const quote = typeof this.value === "string" && this.value.includes("`") ? "'" : "`";
      const value = `${quote}${this.value}${quote}`;
      return `${special("[AST_Token")} ${value} at ${this.line}:${this.col}${special("]")}`;
    }
    get nlb() {
      return has_tok_flag(this, TOK_FLAG_NLB);
    }
    set nlb(new_nlb) {
      set_tok_flag(this, TOK_FLAG_NLB, new_nlb);
    }
    get quote() {
      return !has_tok_flag(this, TOK_FLAG_QUOTE_EXISTS) ? "" : has_tok_flag(this, TOK_FLAG_QUOTE_SINGLE) ? "'" : '"';
    }
    set quote(quote_type) {
      set_tok_flag(this, TOK_FLAG_QUOTE_SINGLE, quote_type === "'");
      set_tok_flag(this, TOK_FLAG_QUOTE_EXISTS, !!quote_type);
    }
    get template_end() {
      return has_tok_flag(this, TOK_FLAG_TEMPLATE_END);
    }
    set template_end(new_template_end) {
      set_tok_flag(this, TOK_FLAG_TEMPLATE_END, new_template_end);
    }
  };
  var AST_Node = DEFNODE("Node", "start end", function AST_Node2(props) {
    if (props) {
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    _clone: function(deep) {
      if (deep) {
        var self2 = this.clone();
        return self2.transform(new TreeTransformer(function(node) {
          if (node !== self2) {
            return node.clone(true);
          }
        }));
      }
      return new this.CTOR(this);
    },
    clone: function(deep) {
      return this._clone(deep);
    },
    $documentation: "Base class of all AST nodes",
    $propdoc: {
      start: "[AST_Token] The first token of this node",
      end: "[AST_Token] The last token of this node"
    },
    _walk: function(visitor) {
      return visitor._visit(this);
    },
    walk: function(visitor) {
      return this._walk(visitor);
    },
    _children_backwards: () => {
    }
  }, null);
  var AST_Statement = DEFNODE("Statement", null, function AST_Statement2(props) {
    if (props) {
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "Base class of all statements"
  });
  var AST_Debugger = DEFNODE("Debugger", null, function AST_Debugger2(props) {
    if (props) {
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "Represents a debugger statement"
  }, AST_Statement);
  var AST_Directive = DEFNODE("Directive", "value quote", function AST_Directive2(props) {
    if (props) {
      this.value = props.value;
      this.quote = props.quote;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: 'Represents a directive, like "use strict";',
    $propdoc: {
      value: "[string] The value of this directive as a plain string (it's not an AST_String!)",
      quote: "[string] the original quote character"
    }
  }, AST_Statement);
  var AST_SimpleStatement = DEFNODE("SimpleStatement", "body", function AST_SimpleStatement2(props) {
    if (props) {
      this.body = props.body;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A statement consisting of an expression, i.e. a = 1 + 2",
    $propdoc: {
      body: "[AST_Node] an expression node (should not be instanceof AST_Statement)"
    },
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        this.body._walk(visitor);
      });
    },
    _children_backwards(push2) {
      push2(this.body);
    }
  }, AST_Statement);
  function walk_body(node, visitor) {
    const body = node.body;
    for (var i = 0, len = body.length; i < len; i++) {
      body[i]._walk(visitor);
    }
  }
  function clone_block_scope(deep) {
    var clone = this._clone(deep);
    if (this.block_scope) {
      clone.block_scope = this.block_scope.clone();
    }
    return clone;
  }
  var AST_Block = DEFNODE("Block", "body block_scope", function AST_Block2(props) {
    if (props) {
      this.body = props.body;
      this.block_scope = props.block_scope;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A body of statements (usually braced)",
    $propdoc: {
      body: "[AST_Statement*] an array of statements",
      block_scope: "[AST_Scope] the block scope"
    },
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        walk_body(this, visitor);
      });
    },
    _children_backwards(push2) {
      let i = this.body.length;
      while (i--) push2(this.body[i]);
    },
    clone: clone_block_scope
  }, AST_Statement);
  var AST_BlockStatement = DEFNODE("BlockStatement", null, function AST_BlockStatement2(props) {
    if (props) {
      this.body = props.body;
      this.block_scope = props.block_scope;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A block statement"
  }, AST_Block);
  var AST_EmptyStatement = DEFNODE("EmptyStatement", null, function AST_EmptyStatement2(props) {
    if (props) {
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "The empty statement (empty block or simply a semicolon)"
  }, AST_Statement);
  var AST_StatementWithBody = DEFNODE("StatementWithBody", "body", function AST_StatementWithBody2(props) {
    if (props) {
      this.body = props.body;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "Base class for all statements that contain one nested body: `For`, `ForIn`, `Do`, `While`, `With`",
    $propdoc: {
      body: "[AST_Statement] the body; this should always be present, even if it's an AST_EmptyStatement"
    }
  }, AST_Statement);
  var AST_LabeledStatement = DEFNODE("LabeledStatement", "label", function AST_LabeledStatement2(props) {
    if (props) {
      this.label = props.label;
      this.body = props.body;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "Statement with a label",
    $propdoc: {
      label: "[AST_Label] a label definition"
    },
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        this.label._walk(visitor);
        this.body._walk(visitor);
      });
    },
    _children_backwards(push2) {
      push2(this.body);
      push2(this.label);
    },
    clone: function(deep) {
      var node = this._clone(deep);
      if (deep) {
        var label = node.label;
        var def = this.label;
        node.walk(new TreeWalker(function(node2) {
          if (node2 instanceof AST_LoopControl && node2.label && node2.label.thedef === def) {
            node2.label.thedef = label;
            label.references.push(node2);
          }
        }));
      }
      return node;
    }
  }, AST_StatementWithBody);
  var AST_IterationStatement = DEFNODE(
    "IterationStatement",
    "block_scope",
    function AST_IterationStatement2(props) {
      if (props) {
        this.block_scope = props.block_scope;
        this.body = props.body;
        this.start = props.start;
        this.end = props.end;
      }
      this.flags = 0;
    },
    {
      $documentation: "Internal class.  All loops inherit from it.",
      $propdoc: {
        block_scope: "[AST_Scope] the block scope for this iteration statement."
      },
      clone: clone_block_scope
    },
    AST_StatementWithBody
  );
  var AST_DWLoop = DEFNODE("DWLoop", "condition", function AST_DWLoop2(props) {
    if (props) {
      this.condition = props.condition;
      this.block_scope = props.block_scope;
      this.body = props.body;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "Base class for do/while statements",
    $propdoc: {
      condition: "[AST_Node] the loop condition.  Should not be instanceof AST_Statement"
    }
  }, AST_IterationStatement);
  var AST_Do = DEFNODE("Do", null, function AST_Do2(props) {
    if (props) {
      this.condition = props.condition;
      this.block_scope = props.block_scope;
      this.body = props.body;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A `do` statement",
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        this.body._walk(visitor);
        this.condition._walk(visitor);
      });
    },
    _children_backwards(push2) {
      push2(this.condition);
      push2(this.body);
    }
  }, AST_DWLoop);
  var AST_While = DEFNODE("While", null, function AST_While2(props) {
    if (props) {
      this.condition = props.condition;
      this.block_scope = props.block_scope;
      this.body = props.body;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A `while` statement",
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        this.condition._walk(visitor);
        this.body._walk(visitor);
      });
    },
    _children_backwards(push2) {
      push2(this.body);
      push2(this.condition);
    }
  }, AST_DWLoop);
  var AST_For = DEFNODE("For", "init condition step", function AST_For2(props) {
    if (props) {
      this.init = props.init;
      this.condition = props.condition;
      this.step = props.step;
      this.block_scope = props.block_scope;
      this.body = props.body;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A `for` statement",
    $propdoc: {
      init: "[AST_Node?] the `for` initialization code, or null if empty",
      condition: "[AST_Node?] the `for` termination clause, or null if empty",
      step: "[AST_Node?] the `for` update clause, or null if empty"
    },
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        if (this.init) this.init._walk(visitor);
        if (this.condition) this.condition._walk(visitor);
        if (this.step) this.step._walk(visitor);
        this.body._walk(visitor);
      });
    },
    _children_backwards(push2) {
      push2(this.body);
      if (this.step) push2(this.step);
      if (this.condition) push2(this.condition);
      if (this.init) push2(this.init);
    }
  }, AST_IterationStatement);
  var AST_ForIn = DEFNODE("ForIn", "init object", function AST_ForIn2(props) {
    if (props) {
      this.init = props.init;
      this.object = props.object;
      this.block_scope = props.block_scope;
      this.body = props.body;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A `for ... in` statement",
    $propdoc: {
      init: "[AST_Node] the `for/in` initialization code",
      object: "[AST_Node] the object that we're looping through"
    },
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        this.init._walk(visitor);
        this.object._walk(visitor);
        this.body._walk(visitor);
      });
    },
    _children_backwards(push2) {
      push2(this.body);
      if (this.object) push2(this.object);
      if (this.init) push2(this.init);
    }
  }, AST_IterationStatement);
  var AST_ForOf = DEFNODE("ForOf", "await", function AST_ForOf2(props) {
    if (props) {
      this.await = props.await;
      this.init = props.init;
      this.object = props.object;
      this.block_scope = props.block_scope;
      this.body = props.body;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A `for ... of` statement"
  }, AST_ForIn);
  var AST_With = DEFNODE("With", "expression", function AST_With2(props) {
    if (props) {
      this.expression = props.expression;
      this.body = props.body;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A `with` statement",
    $propdoc: {
      expression: "[AST_Node] the `with` expression"
    },
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        this.expression._walk(visitor);
        this.body._walk(visitor);
      });
    },
    _children_backwards(push2) {
      push2(this.body);
      push2(this.expression);
    }
  }, AST_StatementWithBody);
  var AST_Scope = DEFNODE(
    "Scope",
    "variables uses_with uses_eval parent_scope enclosed cname",
    function AST_Scope2(props) {
      if (props) {
        this.variables = props.variables;
        this.uses_with = props.uses_with;
        this.uses_eval = props.uses_eval;
        this.parent_scope = props.parent_scope;
        this.enclosed = props.enclosed;
        this.cname = props.cname;
        this.body = props.body;
        this.block_scope = props.block_scope;
        this.start = props.start;
        this.end = props.end;
      }
      this.flags = 0;
    },
    {
      $documentation: "Base class for all statements introducing a lexical scope",
      $propdoc: {
        variables: "[Map/S] a map of name -> SymbolDef for all variables/functions defined in this scope",
        uses_with: "[boolean/S] tells whether this scope uses the `with` statement",
        uses_eval: "[boolean/S] tells whether this scope contains a direct call to the global `eval`",
        parent_scope: "[AST_Scope?/S] link to the parent scope",
        enclosed: "[SymbolDef*/S] a list of all symbol definitions that are accessed from this scope or any subscopes",
        cname: "[integer/S] current index for mangling variables (used internally by the mangler)"
      },
      get_defun_scope: function() {
        var self2 = this;
        while (self2.is_block_scope()) {
          self2 = self2.parent_scope;
        }
        return self2;
      },
      clone: function(deep, toplevel) {
        var node = this._clone(deep);
        if (deep && this.variables && toplevel && !this._block_scope) {
          node.figure_out_scope({}, {
            toplevel,
            parent_scope: this.parent_scope
          });
        } else {
          if (this.variables) node.variables = new Map(this.variables);
          if (this.enclosed) node.enclosed = this.enclosed.slice();
          if (this._block_scope) node._block_scope = this._block_scope;
        }
        return node;
      },
      pinned: function() {
        return this.uses_eval || this.uses_with;
      }
    },
    AST_Block
  );
  var AST_Toplevel = DEFNODE("Toplevel", "globals", function AST_Toplevel2(props) {
    if (props) {
      this.globals = props.globals;
      this.variables = props.variables;
      this.uses_with = props.uses_with;
      this.uses_eval = props.uses_eval;
      this.parent_scope = props.parent_scope;
      this.enclosed = props.enclosed;
      this.cname = props.cname;
      this.body = props.body;
      this.block_scope = props.block_scope;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "The toplevel scope",
    $propdoc: {
      globals: "[Map/S] a map of name -> SymbolDef for all undeclared names"
    },
    wrap_commonjs: function(name) {
      var body = this.body;
      var wrapped_tl = "(function(exports){'$ORIG';})(typeof " + name + "=='undefined'?(" + name + "={}):" + name + ");";
      wrapped_tl = parse(wrapped_tl);
      wrapped_tl = wrapped_tl.transform(new TreeTransformer(function(node) {
        if (node instanceof AST_Directive && node.value == "$ORIG") {
          return MAP.splice(body);
        }
      }));
      return wrapped_tl;
    },
    wrap_enclose: function(args_values) {
      if (typeof args_values != "string") args_values = "";
      var index = args_values.indexOf(":");
      if (index < 0) index = args_values.length;
      var body = this.body;
      return parse([
        "(function(",
        args_values.slice(0, index),
        '){"$ORIG"})(',
        args_values.slice(index + 1),
        ")"
      ].join("")).transform(new TreeTransformer(function(node) {
        if (node instanceof AST_Directive && node.value == "$ORIG") {
          return MAP.splice(body);
        }
      }));
    }
  }, AST_Scope);
  var AST_Expansion = DEFNODE("Expansion", "expression", function AST_Expansion2(props) {
    if (props) {
      this.expression = props.expression;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "An expandible argument, such as ...rest, a splat, such as [1,2,...all], or an expansion in a variable declaration, such as var [first, ...rest] = list",
    $propdoc: {
      expression: "[AST_Node] the thing to be expanded"
    },
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        this.expression.walk(visitor);
      });
    },
    _children_backwards(push2) {
      push2(this.expression);
    }
  });
  var AST_Lambda = DEFNODE(
    "Lambda",
    "name argnames uses_arguments is_generator async",
    function AST_Lambda2(props) {
      if (props) {
        this.name = props.name;
        this.argnames = props.argnames;
        this.uses_arguments = props.uses_arguments;
        this.is_generator = props.is_generator;
        this.async = props.async;
        this.variables = props.variables;
        this.uses_with = props.uses_with;
        this.uses_eval = props.uses_eval;
        this.parent_scope = props.parent_scope;
        this.enclosed = props.enclosed;
        this.cname = props.cname;
        this.body = props.body;
        this.block_scope = props.block_scope;
        this.start = props.start;
        this.end = props.end;
      }
      this.flags = 0;
    },
    {
      $documentation: "Base class for functions",
      $propdoc: {
        name: "[AST_SymbolDeclaration?] the name of this function",
        argnames: "[AST_SymbolFunarg|AST_Destructuring|AST_Expansion|AST_DefaultAssign*] array of function arguments, destructurings, or expanding arguments",
        uses_arguments: "[boolean/S] tells whether this function accesses the arguments array",
        is_generator: "[boolean] is this a generator method",
        async: "[boolean] is this method async"
      },
      args_as_names: function() {
        var out = [];
        for (var i = 0; i < this.argnames.length; i++) {
          if (this.argnames[i] instanceof AST_Destructuring) {
            out.push(...this.argnames[i].all_symbols());
          } else {
            out.push(this.argnames[i]);
          }
        }
        return out;
      },
      _walk: function(visitor) {
        return visitor._visit(this, function() {
          if (this.name) this.name._walk(visitor);
          var argnames = this.argnames;
          for (var i = 0, len = argnames.length; i < len; i++) {
            argnames[i]._walk(visitor);
          }
          walk_body(this, visitor);
        });
      },
      _children_backwards(push2) {
        let i = this.body.length;
        while (i--) push2(this.body[i]);
        i = this.argnames.length;
        while (i--) push2(this.argnames[i]);
        if (this.name) push2(this.name);
      },
      is_braceless() {
        return this.body[0] instanceof AST_Return && this.body[0].value;
      },
      // Default args and expansion don't count, so .argnames.length doesn't cut it
      length_property() {
        let length = 0;
        for (const arg of this.argnames) {
          if (arg instanceof AST_SymbolFunarg || arg instanceof AST_Destructuring) {
            length++;
          }
        }
        return length;
      }
    },
    AST_Scope
  );
  var AST_Accessor = DEFNODE("Accessor", null, function AST_Accessor2(props) {
    if (props) {
      this.name = props.name;
      this.argnames = props.argnames;
      this.uses_arguments = props.uses_arguments;
      this.is_generator = props.is_generator;
      this.async = props.async;
      this.variables = props.variables;
      this.uses_with = props.uses_with;
      this.uses_eval = props.uses_eval;
      this.parent_scope = props.parent_scope;
      this.enclosed = props.enclosed;
      this.cname = props.cname;
      this.body = props.body;
      this.block_scope = props.block_scope;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A setter/getter function.  The `name` property is always null."
  }, AST_Lambda);
  var AST_Function = DEFNODE("Function", null, function AST_Function2(props) {
    if (props) {
      this.name = props.name;
      this.argnames = props.argnames;
      this.uses_arguments = props.uses_arguments;
      this.is_generator = props.is_generator;
      this.async = props.async;
      this.variables = props.variables;
      this.uses_with = props.uses_with;
      this.uses_eval = props.uses_eval;
      this.parent_scope = props.parent_scope;
      this.enclosed = props.enclosed;
      this.cname = props.cname;
      this.body = props.body;
      this.block_scope = props.block_scope;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A function expression"
  }, AST_Lambda);
  var AST_Arrow = DEFNODE("Arrow", null, function AST_Arrow2(props) {
    if (props) {
      this.name = props.name;
      this.argnames = props.argnames;
      this.uses_arguments = props.uses_arguments;
      this.is_generator = props.is_generator;
      this.async = props.async;
      this.variables = props.variables;
      this.uses_with = props.uses_with;
      this.uses_eval = props.uses_eval;
      this.parent_scope = props.parent_scope;
      this.enclosed = props.enclosed;
      this.cname = props.cname;
      this.body = props.body;
      this.block_scope = props.block_scope;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "An ES6 Arrow function ((a) => b)"
  }, AST_Lambda);
  var AST_Defun = DEFNODE("Defun", null, function AST_Defun2(props) {
    if (props) {
      this.name = props.name;
      this.argnames = props.argnames;
      this.uses_arguments = props.uses_arguments;
      this.is_generator = props.is_generator;
      this.async = props.async;
      this.variables = props.variables;
      this.uses_with = props.uses_with;
      this.uses_eval = props.uses_eval;
      this.parent_scope = props.parent_scope;
      this.enclosed = props.enclosed;
      this.cname = props.cname;
      this.body = props.body;
      this.block_scope = props.block_scope;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A function definition"
  }, AST_Lambda);
  var AST_Destructuring = DEFNODE("Destructuring", "names is_array", function AST_Destructuring2(props) {
    if (props) {
      this.names = props.names;
      this.is_array = props.is_array;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A destructuring of several names. Used in destructuring assignment and with destructuring function argument names",
    $propdoc: {
      "names": "[AST_Node*] Array of properties or elements",
      "is_array": "[Boolean] Whether the destructuring represents an object or array"
    },
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        this.names.forEach(function(name) {
          name._walk(visitor);
        });
      });
    },
    _children_backwards(push2) {
      let i = this.names.length;
      while (i--) push2(this.names[i]);
    },
    all_symbols: function() {
      var out = [];
      walk(this, (node) => {
        if (node instanceof AST_SymbolDeclaration) {
          out.push(node);
        }
        if (node instanceof AST_Lambda) {
          return true;
        }
      });
      return out;
    }
  });
  var AST_PrefixedTemplateString = DEFNODE(
    "PrefixedTemplateString",
    "template_string prefix",
    function AST_PrefixedTemplateString2(props) {
      if (props) {
        this.template_string = props.template_string;
        this.prefix = props.prefix;
        this.start = props.start;
        this.end = props.end;
      }
      this.flags = 0;
    },
    {
      $documentation: "A templatestring with a prefix, such as String.raw`foobarbaz`",
      $propdoc: {
        template_string: "[AST_TemplateString] The template string",
        prefix: "[AST_Node] The prefix, which will get called."
      },
      _walk: function(visitor) {
        return visitor._visit(this, function() {
          this.prefix._walk(visitor);
          this.template_string._walk(visitor);
        });
      },
      _children_backwards(push2) {
        push2(this.template_string);
        push2(this.prefix);
      }
    }
  );
  var AST_TemplateString = DEFNODE("TemplateString", "segments", function AST_TemplateString2(props) {
    if (props) {
      this.segments = props.segments;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A template string literal",
    $propdoc: {
      segments: "[AST_Node*] One or more segments, starting with AST_TemplateSegment. AST_Node may follow AST_TemplateSegment, but each AST_Node must be followed by AST_TemplateSegment."
    },
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        this.segments.forEach(function(seg) {
          seg._walk(visitor);
        });
      });
    },
    _children_backwards(push2) {
      let i = this.segments.length;
      while (i--) push2(this.segments[i]);
    }
  });
  var AST_TemplateSegment = DEFNODE("TemplateSegment", "value raw", function AST_TemplateSegment2(props) {
    if (props) {
      this.value = props.value;
      this.raw = props.raw;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A segment of a template string literal",
    $propdoc: {
      value: "Content of the segment",
      raw: "Raw source of the segment"
    }
  });
  var AST_Jump = DEFNODE("Jump", null, function AST_Jump2(props) {
    if (props) {
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "Base class for \u201Cjumps\u201D (for now that's `return`, `throw`, `break` and `continue`)"
  }, AST_Statement);
  var AST_Exit = DEFNODE("Exit", "value", function AST_Exit2(props) {
    if (props) {
      this.value = props.value;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "Base class for \u201Cexits\u201D (`return` and `throw`)",
    $propdoc: {
      value: "[AST_Node?] the value returned or thrown by this statement; could be null for AST_Return"
    },
    _walk: function(visitor) {
      return visitor._visit(this, this.value && function() {
        this.value._walk(visitor);
      });
    },
    _children_backwards(push2) {
      if (this.value) push2(this.value);
    }
  }, AST_Jump);
  var AST_Return = DEFNODE("Return", null, function AST_Return2(props) {
    if (props) {
      this.value = props.value;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A `return` statement"
  }, AST_Exit);
  var AST_Throw = DEFNODE("Throw", null, function AST_Throw2(props) {
    if (props) {
      this.value = props.value;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A `throw` statement"
  }, AST_Exit);
  var AST_LoopControl = DEFNODE("LoopControl", "label", function AST_LoopControl2(props) {
    if (props) {
      this.label = props.label;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "Base class for loop control statements (`break` and `continue`)",
    $propdoc: {
      label: "[AST_LabelRef?] the label, or null if none"
    },
    _walk: function(visitor) {
      return visitor._visit(this, this.label && function() {
        this.label._walk(visitor);
      });
    },
    _children_backwards(push2) {
      if (this.label) push2(this.label);
    }
  }, AST_Jump);
  var AST_Break = DEFNODE("Break", null, function AST_Break2(props) {
    if (props) {
      this.label = props.label;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A `break` statement"
  }, AST_LoopControl);
  var AST_Continue = DEFNODE("Continue", null, function AST_Continue2(props) {
    if (props) {
      this.label = props.label;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A `continue` statement"
  }, AST_LoopControl);
  var AST_Await = DEFNODE("Await", "expression", function AST_Await2(props) {
    if (props) {
      this.expression = props.expression;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "An `await` statement",
    $propdoc: {
      expression: "[AST_Node] the mandatory expression being awaited"
    },
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        this.expression._walk(visitor);
      });
    },
    _children_backwards(push2) {
      push2(this.expression);
    }
  });
  var AST_Yield = DEFNODE("Yield", "expression is_star", function AST_Yield2(props) {
    if (props) {
      this.expression = props.expression;
      this.is_star = props.is_star;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A `yield` statement",
    $propdoc: {
      expression: "[AST_Node?] the value returned or thrown by this statement; could be null (representing undefined) but only when is_star is set to false",
      is_star: "[Boolean] Whether this is a yield or yield* statement"
    },
    _walk: function(visitor) {
      return visitor._visit(this, this.expression && function() {
        this.expression._walk(visitor);
      });
    },
    _children_backwards(push2) {
      if (this.expression) push2(this.expression);
    }
  });
  var AST_If = DEFNODE("If", "condition alternative", function AST_If2(props) {
    if (props) {
      this.condition = props.condition;
      this.alternative = props.alternative;
      this.body = props.body;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A `if` statement",
    $propdoc: {
      condition: "[AST_Node] the `if` condition",
      alternative: "[AST_Statement?] the `else` part, or null if not present"
    },
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        this.condition._walk(visitor);
        this.body._walk(visitor);
        if (this.alternative) this.alternative._walk(visitor);
      });
    },
    _children_backwards(push2) {
      if (this.alternative) {
        push2(this.alternative);
      }
      push2(this.body);
      push2(this.condition);
    }
  }, AST_StatementWithBody);
  var AST_Switch = DEFNODE("Switch", "expression", function AST_Switch2(props) {
    if (props) {
      this.expression = props.expression;
      this.body = props.body;
      this.block_scope = props.block_scope;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A `switch` statement",
    $propdoc: {
      expression: "[AST_Node] the `switch` \u201Cdiscriminant\u201D"
    },
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        this.expression._walk(visitor);
        walk_body(this, visitor);
      });
    },
    _children_backwards(push2) {
      let i = this.body.length;
      while (i--) push2(this.body[i]);
      push2(this.expression);
    }
  }, AST_Block);
  var AST_SwitchBranch = DEFNODE("SwitchBranch", null, function AST_SwitchBranch2(props) {
    if (props) {
      this.body = props.body;
      this.block_scope = props.block_scope;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "Base class for `switch` branches"
  }, AST_Block);
  var AST_Default = DEFNODE("Default", null, function AST_Default2(props) {
    if (props) {
      this.body = props.body;
      this.block_scope = props.block_scope;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A `default` switch branch"
  }, AST_SwitchBranch);
  var AST_Case = DEFNODE("Case", "expression", function AST_Case2(props) {
    if (props) {
      this.expression = props.expression;
      this.body = props.body;
      this.block_scope = props.block_scope;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A `case` switch branch",
    $propdoc: {
      expression: "[AST_Node] the `case` expression"
    },
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        this.expression._walk(visitor);
        walk_body(this, visitor);
      });
    },
    _children_backwards(push2) {
      let i = this.body.length;
      while (i--) push2(this.body[i]);
      push2(this.expression);
    }
  }, AST_SwitchBranch);
  var AST_Try = DEFNODE("Try", "body bcatch bfinally", function AST_Try2(props) {
    if (props) {
      this.body = props.body;
      this.bcatch = props.bcatch;
      this.bfinally = props.bfinally;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A `try` statement",
    $propdoc: {
      body: "[AST_TryBlock] the try block",
      bcatch: "[AST_Catch?] the catch block, or null if not present",
      bfinally: "[AST_Finally?] the finally block, or null if not present"
    },
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        this.body._walk(visitor);
        if (this.bcatch) this.bcatch._walk(visitor);
        if (this.bfinally) this.bfinally._walk(visitor);
      });
    },
    _children_backwards(push2) {
      if (this.bfinally) push2(this.bfinally);
      if (this.bcatch) push2(this.bcatch);
      push2(this.body);
    }
  }, AST_Statement);
  var AST_TryBlock = DEFNODE("TryBlock", null, function AST_TryBlock2(props) {
    if (props) {
      this.body = props.body;
      this.block_scope = props.block_scope;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "The `try` block of a try statement"
  }, AST_Block);
  var AST_Catch = DEFNODE("Catch", "argname", function AST_Catch2(props) {
    if (props) {
      this.argname = props.argname;
      this.body = props.body;
      this.block_scope = props.block_scope;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A `catch` node; only makes sense as part of a `try` statement",
    $propdoc: {
      argname: "[AST_SymbolCatch|AST_Destructuring|AST_Expansion|AST_DefaultAssign] symbol for the exception"
    },
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        if (this.argname) this.argname._walk(visitor);
        walk_body(this, visitor);
      });
    },
    _children_backwards(push2) {
      let i = this.body.length;
      while (i--) push2(this.body[i]);
      if (this.argname) push2(this.argname);
    }
  }, AST_Block);
  var AST_Finally = DEFNODE("Finally", null, function AST_Finally2(props) {
    if (props) {
      this.body = props.body;
      this.block_scope = props.block_scope;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A `finally` node; only makes sense as part of a `try` statement"
  }, AST_Block);
  var AST_Definitions = DEFNODE("Definitions", "definitions", function AST_Definitions2(props) {
    if (props) {
      this.definitions = props.definitions;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "Base class for `var` or `const` nodes (variable declarations/initializations)",
    $propdoc: {
      definitions: "[AST_VarDef*] array of variable definitions"
    },
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        var definitions = this.definitions;
        for (var i = 0, len = definitions.length; i < len; i++) {
          definitions[i]._walk(visitor);
        }
      });
    },
    _children_backwards(push2) {
      let i = this.definitions.length;
      while (i--) push2(this.definitions[i]);
    }
  }, AST_Statement);
  var AST_Var = DEFNODE("Var", null, function AST_Var2(props) {
    if (props) {
      this.definitions = props.definitions;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A `var` statement"
  }, AST_Definitions);
  var AST_Let = DEFNODE("Let", null, function AST_Let2(props) {
    if (props) {
      this.definitions = props.definitions;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A `let` statement"
  }, AST_Definitions);
  var AST_Const = DEFNODE("Const", null, function AST_Const2(props) {
    if (props) {
      this.definitions = props.definitions;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A `const` statement"
  }, AST_Definitions);
  var AST_VarDef = DEFNODE("VarDef", "name value", function AST_VarDef2(props) {
    if (props) {
      this.name = props.name;
      this.value = props.value;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A variable declaration; only appears in a AST_Definitions node",
    $propdoc: {
      name: "[AST_Destructuring|AST_SymbolConst|AST_SymbolLet|AST_SymbolVar] name of the variable",
      value: "[AST_Node?] initializer, or null of there's no initializer"
    },
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        this.name._walk(visitor);
        if (this.value) this.value._walk(visitor);
      });
    },
    _children_backwards(push2) {
      if (this.value) push2(this.value);
      push2(this.name);
    },
    declarations_as_names() {
      if (this.name instanceof AST_SymbolDeclaration) {
        return [this];
      } else {
        return this.name.all_symbols();
      }
    }
  });
  var AST_NameMapping = DEFNODE("NameMapping", "foreign_name name", function AST_NameMapping2(props) {
    if (props) {
      this.foreign_name = props.foreign_name;
      this.name = props.name;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "The part of the export/import statement that declare names from a module.",
    $propdoc: {
      foreign_name: "[AST_SymbolExportForeign|AST_SymbolImportForeign] The name being exported/imported (as specified in the module)",
      name: "[AST_SymbolExport|AST_SymbolImport] The name as it is visible to this module."
    },
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        this.foreign_name._walk(visitor);
        this.name._walk(visitor);
      });
    },
    _children_backwards(push2) {
      push2(this.name);
      push2(this.foreign_name);
    }
  });
  var AST_Import = DEFNODE(
    "Import",
    "imported_name imported_names module_name assert_clause",
    function AST_Import2(props) {
      if (props) {
        this.imported_name = props.imported_name;
        this.imported_names = props.imported_names;
        this.module_name = props.module_name;
        this.assert_clause = props.assert_clause;
        this.start = props.start;
        this.end = props.end;
      }
      this.flags = 0;
    },
    {
      $documentation: "An `import` statement",
      $propdoc: {
        imported_name: "[AST_SymbolImport] The name of the variable holding the module's default export.",
        imported_names: "[AST_NameMapping*] The names of non-default imported variables",
        module_name: "[AST_String] String literal describing where this module came from",
        assert_clause: "[AST_Object?] The import assertion"
      },
      _walk: function(visitor) {
        return visitor._visit(this, function() {
          if (this.imported_name) {
            this.imported_name._walk(visitor);
          }
          if (this.imported_names) {
            this.imported_names.forEach(function(name_import) {
              name_import._walk(visitor);
            });
          }
          this.module_name._walk(visitor);
        });
      },
      _children_backwards(push2) {
        push2(this.module_name);
        if (this.imported_names) {
          let i = this.imported_names.length;
          while (i--) push2(this.imported_names[i]);
        }
        if (this.imported_name) push2(this.imported_name);
      }
    }
  );
  var AST_ImportMeta = DEFNODE("ImportMeta", null, function AST_ImportMeta2(props) {
    if (props) {
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A reference to import.meta"
  });
  var AST_Export = DEFNODE(
    "Export",
    "exported_definition exported_value is_default exported_names module_name assert_clause",
    function AST_Export2(props) {
      if (props) {
        this.exported_definition = props.exported_definition;
        this.exported_value = props.exported_value;
        this.is_default = props.is_default;
        this.exported_names = props.exported_names;
        this.module_name = props.module_name;
        this.assert_clause = props.assert_clause;
        this.start = props.start;
        this.end = props.end;
      }
      this.flags = 0;
    },
    {
      $documentation: "An `export` statement",
      $propdoc: {
        exported_definition: "[AST_Defun|AST_Definitions|AST_DefClass?] An exported definition",
        exported_value: "[AST_Node?] An exported value",
        exported_names: "[AST_NameMapping*?] List of exported names",
        module_name: "[AST_String?] Name of the file to load exports from",
        is_default: "[Boolean] Whether this is the default exported value of this module",
        assert_clause: "[AST_Object?] The import assertion"
      },
      _walk: function(visitor) {
        return visitor._visit(this, function() {
          if (this.exported_definition) {
            this.exported_definition._walk(visitor);
          }
          if (this.exported_value) {
            this.exported_value._walk(visitor);
          }
          if (this.exported_names) {
            this.exported_names.forEach(function(name_export) {
              name_export._walk(visitor);
            });
          }
          if (this.module_name) {
            this.module_name._walk(visitor);
          }
        });
      },
      _children_backwards(push2) {
        if (this.module_name) push2(this.module_name);
        if (this.exported_names) {
          let i = this.exported_names.length;
          while (i--) push2(this.exported_names[i]);
        }
        if (this.exported_value) push2(this.exported_value);
        if (this.exported_definition) push2(this.exported_definition);
      }
    },
    AST_Statement
  );
  var AST_Call = DEFNODE(
    "Call",
    "expression args optional _annotations",
    function AST_Call2(props) {
      if (props) {
        this.expression = props.expression;
        this.args = props.args;
        this.optional = props.optional;
        this._annotations = props._annotations;
        this.start = props.start;
        this.end = props.end;
        this.initialize();
      }
      this.flags = 0;
    },
    {
      $documentation: "A function call expression",
      $propdoc: {
        expression: "[AST_Node] expression to invoke as function",
        args: "[AST_Node*] array of arguments",
        optional: "[boolean] whether this is an optional call (IE ?.() )",
        _annotations: "[number] bitfield containing information about the call"
      },
      initialize() {
        if (this._annotations == null) this._annotations = 0;
      },
      _walk(visitor) {
        return visitor._visit(this, function() {
          var args = this.args;
          for (var i = 0, len = args.length; i < len; i++) {
            args[i]._walk(visitor);
          }
          this.expression._walk(visitor);
        });
      },
      _children_backwards(push2) {
        let i = this.args.length;
        while (i--) push2(this.args[i]);
        push2(this.expression);
      }
    }
  );
  var AST_New = DEFNODE("New", null, function AST_New2(props) {
    if (props) {
      this.expression = props.expression;
      this.args = props.args;
      this.optional = props.optional;
      this._annotations = props._annotations;
      this.start = props.start;
      this.end = props.end;
      this.initialize();
    }
    this.flags = 0;
  }, {
    $documentation: "An object instantiation.  Derives from a function call since it has exactly the same properties"
  }, AST_Call);
  var AST_Sequence = DEFNODE("Sequence", "expressions", function AST_Sequence2(props) {
    if (props) {
      this.expressions = props.expressions;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A sequence expression (comma-separated expressions)",
    $propdoc: {
      expressions: "[AST_Node*] array of expressions (at least two)"
    },
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        this.expressions.forEach(function(node) {
          node._walk(visitor);
        });
      });
    },
    _children_backwards(push2) {
      let i = this.expressions.length;
      while (i--) push2(this.expressions[i]);
    }
  });
  var AST_PropAccess = DEFNODE(
    "PropAccess",
    "expression property optional",
    function AST_PropAccess2(props) {
      if (props) {
        this.expression = props.expression;
        this.property = props.property;
        this.optional = props.optional;
        this.start = props.start;
        this.end = props.end;
      }
      this.flags = 0;
    },
    {
      $documentation: 'Base class for property access expressions, i.e. `a.foo` or `a["foo"]`',
      $propdoc: {
        expression: "[AST_Node] the \u201Ccontainer\u201D expression",
        property: "[AST_Node|string] the property to access.  For AST_Dot & AST_DotHash this is always a plain string, while for AST_Sub it's an arbitrary AST_Node",
        optional: "[boolean] whether this is an optional property access (IE ?.)"
      }
    }
  );
  var AST_Dot = DEFNODE("Dot", "quote", function AST_Dot2(props) {
    if (props) {
      this.quote = props.quote;
      this.expression = props.expression;
      this.property = props.property;
      this.optional = props.optional;
      this._annotations = props._annotations;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A dotted property access expression",
    $propdoc: {
      quote: "[string] the original quote character when transformed from AST_Sub"
    },
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        this.expression._walk(visitor);
      });
    },
    _children_backwards(push2) {
      push2(this.expression);
    }
  }, AST_PropAccess);
  var AST_DotHash = DEFNODE("DotHash", "", function AST_DotHash2(props) {
    if (props) {
      this.expression = props.expression;
      this.property = props.property;
      this.optional = props.optional;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A dotted property access to a private property",
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        this.expression._walk(visitor);
      });
    },
    _children_backwards(push2) {
      push2(this.expression);
    }
  }, AST_PropAccess);
  var AST_Sub = DEFNODE("Sub", null, function AST_Sub2(props) {
    if (props) {
      this.expression = props.expression;
      this.property = props.property;
      this.optional = props.optional;
      this._annotations = props._annotations;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: 'Index-style property access, i.e. `a["foo"]`',
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        this.expression._walk(visitor);
        this.property._walk(visitor);
      });
    },
    _children_backwards(push2) {
      push2(this.property);
      push2(this.expression);
    }
  }, AST_PropAccess);
  var AST_Chain = DEFNODE("Chain", "expression", function AST_Chain2(props) {
    if (props) {
      this.expression = props.expression;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A chain expression like a?.b?.(c)?.[d]",
    $propdoc: {
      expression: "[AST_Call|AST_Dot|AST_DotHash|AST_Sub] chain element."
    },
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        this.expression._walk(visitor);
      });
    },
    _children_backwards(push2) {
      push2(this.expression);
    }
  });
  var AST_Unary = DEFNODE("Unary", "operator expression", function AST_Unary2(props) {
    if (props) {
      this.operator = props.operator;
      this.expression = props.expression;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "Base class for unary expressions",
    $propdoc: {
      operator: "[string] the operator",
      expression: "[AST_Node] expression that this unary operator applies to"
    },
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        this.expression._walk(visitor);
      });
    },
    _children_backwards(push2) {
      push2(this.expression);
    }
  });
  var AST_UnaryPrefix = DEFNODE("UnaryPrefix", null, function AST_UnaryPrefix2(props) {
    if (props) {
      this.operator = props.operator;
      this.expression = props.expression;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "Unary prefix expression, i.e. `typeof i` or `++i`"
  }, AST_Unary);
  var AST_UnaryPostfix = DEFNODE("UnaryPostfix", null, function AST_UnaryPostfix2(props) {
    if (props) {
      this.operator = props.operator;
      this.expression = props.expression;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "Unary postfix expression, i.e. `i++`"
  }, AST_Unary);
  var AST_Binary = DEFNODE("Binary", "operator left right", function AST_Binary2(props) {
    if (props) {
      this.operator = props.operator;
      this.left = props.left;
      this.right = props.right;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "Binary expression, i.e. `a + b`",
    $propdoc: {
      left: "[AST_Node] left-hand side expression",
      operator: "[string] the operator",
      right: "[AST_Node] right-hand side expression"
    },
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        this.left._walk(visitor);
        this.right._walk(visitor);
      });
    },
    _children_backwards(push2) {
      push2(this.right);
      push2(this.left);
    }
  });
  var AST_Conditional = DEFNODE(
    "Conditional",
    "condition consequent alternative",
    function AST_Conditional2(props) {
      if (props) {
        this.condition = props.condition;
        this.consequent = props.consequent;
        this.alternative = props.alternative;
        this.start = props.start;
        this.end = props.end;
      }
      this.flags = 0;
    },
    {
      $documentation: "Conditional expression using the ternary operator, i.e. `a ? b : c`",
      $propdoc: {
        condition: "[AST_Node]",
        consequent: "[AST_Node]",
        alternative: "[AST_Node]"
      },
      _walk: function(visitor) {
        return visitor._visit(this, function() {
          this.condition._walk(visitor);
          this.consequent._walk(visitor);
          this.alternative._walk(visitor);
        });
      },
      _children_backwards(push2) {
        push2(this.alternative);
        push2(this.consequent);
        push2(this.condition);
      }
    }
  );
  var AST_Assign = DEFNODE("Assign", "logical", function AST_Assign2(props) {
    if (props) {
      this.logical = props.logical;
      this.operator = props.operator;
      this.left = props.left;
      this.right = props.right;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "An assignment expression \u2014 `a = b + 5`",
    $propdoc: {
      logical: "Whether it's a logical assignment"
    }
  }, AST_Binary);
  var AST_DefaultAssign = DEFNODE("DefaultAssign", null, function AST_DefaultAssign2(props) {
    if (props) {
      this.operator = props.operator;
      this.left = props.left;
      this.right = props.right;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A default assignment expression like in `(a = 3) => a`"
  }, AST_Binary);
  var AST_Array = DEFNODE("Array", "elements", function AST_Array2(props) {
    if (props) {
      this.elements = props.elements;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "An array literal",
    $propdoc: {
      elements: "[AST_Node*] array of elements"
    },
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        var elements = this.elements;
        for (var i = 0, len = elements.length; i < len; i++) {
          elements[i]._walk(visitor);
        }
      });
    },
    _children_backwards(push2) {
      let i = this.elements.length;
      while (i--) push2(this.elements[i]);
    }
  });
  var AST_Object = DEFNODE("Object", "properties", function AST_Object2(props) {
    if (props) {
      this.properties = props.properties;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "An object literal",
    $propdoc: {
      properties: "[AST_ObjectProperty*] array of properties"
    },
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        var properties = this.properties;
        for (var i = 0, len = properties.length; i < len; i++) {
          properties[i]._walk(visitor);
        }
      });
    },
    _children_backwards(push2) {
      let i = this.properties.length;
      while (i--) push2(this.properties[i]);
    }
  });
  var AST_ObjectProperty = DEFNODE("ObjectProperty", "key value", function AST_ObjectProperty2(props) {
    if (props) {
      this.key = props.key;
      this.value = props.value;
      this.start = props.start;
      this.end = props.end;
      this._annotations = props._annotations;
    }
    this.flags = 0;
  }, {
    $documentation: "Base class for literal object properties",
    $propdoc: {
      key: "[string|AST_Node] property name. For ObjectKeyVal this is a string. For getters, setters and computed property this is an AST_Node.",
      value: "[AST_Node] property value.  For getters and setters this is an AST_Accessor."
    },
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        if (this.key instanceof AST_Node)
          this.key._walk(visitor);
        this.value._walk(visitor);
      });
    },
    _children_backwards(push2) {
      push2(this.value);
      if (this.key instanceof AST_Node) push2(this.key);
    }
  });
  var AST_ObjectKeyVal = DEFNODE("ObjectKeyVal", "quote", function AST_ObjectKeyVal2(props) {
    if (props) {
      this.quote = props.quote;
      this.key = props.key;
      this.value = props.value;
      this.start = props.start;
      this.end = props.end;
      this._annotations = props._annotations;
    }
    this.flags = 0;
  }, {
    $documentation: "A key: value object property",
    $propdoc: {
      quote: "[string] the original quote character"
    },
    computed_key() {
      return this.key instanceof AST_Node;
    }
  }, AST_ObjectProperty);
  var AST_PrivateSetter = DEFNODE("PrivateSetter", "static", function AST_PrivateSetter2(props) {
    if (props) {
      this.static = props.static;
      this.key = props.key;
      this.value = props.value;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $propdoc: {
      static: "[boolean] whether this is a static private setter"
    },
    $documentation: "A private setter property",
    computed_key() {
      return false;
    }
  }, AST_ObjectProperty);
  var AST_PrivateGetter = DEFNODE("PrivateGetter", "static", function AST_PrivateGetter2(props) {
    if (props) {
      this.static = props.static;
      this.key = props.key;
      this.value = props.value;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $propdoc: {
      static: "[boolean] whether this is a static private getter"
    },
    $documentation: "A private getter property",
    computed_key() {
      return false;
    }
  }, AST_ObjectProperty);
  var AST_ObjectSetter = DEFNODE("ObjectSetter", "quote static", function AST_ObjectSetter2(props) {
    if (props) {
      this.quote = props.quote;
      this.static = props.static;
      this.key = props.key;
      this.value = props.value;
      this.start = props.start;
      this.end = props.end;
      this._annotations = props._annotations;
    }
    this.flags = 0;
  }, {
    $propdoc: {
      quote: "[string|undefined] the original quote character, if any",
      static: "[boolean] whether this is a static setter (classes only)"
    },
    $documentation: "An object setter property",
    computed_key() {
      return !(this.key instanceof AST_SymbolMethod);
    }
  }, AST_ObjectProperty);
  var AST_ObjectGetter = DEFNODE("ObjectGetter", "quote static", function AST_ObjectGetter2(props) {
    if (props) {
      this.quote = props.quote;
      this.static = props.static;
      this.key = props.key;
      this.value = props.value;
      this.start = props.start;
      this.end = props.end;
      this._annotations = props._annotations;
    }
    this.flags = 0;
  }, {
    $propdoc: {
      quote: "[string|undefined] the original quote character, if any",
      static: "[boolean] whether this is a static getter (classes only)"
    },
    $documentation: "An object getter property",
    computed_key() {
      return !(this.key instanceof AST_SymbolMethod);
    }
  }, AST_ObjectProperty);
  var AST_ConciseMethod = DEFNODE(
    "ConciseMethod",
    "quote static is_generator async",
    function AST_ConciseMethod2(props) {
      if (props) {
        this.quote = props.quote;
        this.static = props.static;
        this.is_generator = props.is_generator;
        this.async = props.async;
        this.key = props.key;
        this.value = props.value;
        this.start = props.start;
        this.end = props.end;
        this._annotations = props._annotations;
      }
      this.flags = 0;
    },
    {
      $propdoc: {
        quote: "[string|undefined] the original quote character, if any",
        static: "[boolean] is this method static (classes only)",
        is_generator: "[boolean] is this a generator method",
        async: "[boolean] is this method async"
      },
      $documentation: "An ES6 concise method inside an object or class",
      computed_key() {
        return !(this.key instanceof AST_SymbolMethod);
      }
    },
    AST_ObjectProperty
  );
  var AST_PrivateMethod = DEFNODE("PrivateMethod", "", function AST_PrivateMethod2(props) {
    if (props) {
      this.quote = props.quote;
      this.static = props.static;
      this.is_generator = props.is_generator;
      this.async = props.async;
      this.key = props.key;
      this.value = props.value;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A private class method inside a class"
  }, AST_ConciseMethod);
  var AST_Class = DEFNODE(
    "Class",
    "name extends properties",
    function AST_Class2(props) {
      if (props) {
        this.name = props.name;
        this.extends = props.extends;
        this.properties = props.properties;
        this.variables = props.variables;
        this.uses_with = props.uses_with;
        this.uses_eval = props.uses_eval;
        this.parent_scope = props.parent_scope;
        this.enclosed = props.enclosed;
        this.cname = props.cname;
        this.body = props.body;
        this.block_scope = props.block_scope;
        this.start = props.start;
        this.end = props.end;
      }
      this.flags = 0;
    },
    {
      $propdoc: {
        name: "[AST_SymbolClass|AST_SymbolDefClass?] optional class name.",
        extends: "[AST_Node]? optional parent class",
        properties: "[AST_ObjectProperty*] array of properties"
      },
      $documentation: "An ES6 class",
      _walk: function(visitor) {
        return visitor._visit(this, function() {
          if (this.name) {
            this.name._walk(visitor);
          }
          if (this.extends) {
            this.extends._walk(visitor);
          }
          this.properties.forEach((prop) => prop._walk(visitor));
        });
      },
      _children_backwards(push2) {
        let i = this.properties.length;
        while (i--) push2(this.properties[i]);
        if (this.extends) push2(this.extends);
        if (this.name) push2(this.name);
      },
      /** go through the bits that are executed instantly, not when the class is `new`'d. Doesn't walk the name. */
      visit_nondeferred_class_parts(visitor) {
        if (this.extends) {
          this.extends._walk(visitor);
        }
        this.properties.forEach((prop) => {
          if (prop instanceof AST_ClassStaticBlock) {
            prop._walk(visitor);
            return;
          }
          if (prop.computed_key()) {
            visitor.push(prop);
            prop.key._walk(visitor);
            visitor.pop();
          }
          if ((prop instanceof AST_ClassPrivateProperty || prop instanceof AST_ClassProperty) && prop.static && prop.value) {
            visitor.push(prop);
            prop.value._walk(visitor);
            visitor.pop();
          }
        });
      },
      /** go through the bits that are executed later, when the class is `new`'d or a static method is called */
      visit_deferred_class_parts(visitor) {
        this.properties.forEach((prop) => {
          if (prop instanceof AST_ConciseMethod) {
            prop.walk(visitor);
          } else if (prop instanceof AST_ClassProperty && !prop.static && prop.value) {
            visitor.push(prop);
            prop.value._walk(visitor);
            visitor.pop();
          }
        });
      },
      is_self_referential: function() {
        const this_id = this.name && this.name.definition().id;
        let found = false;
        let class_this = true;
        this.visit_nondeferred_class_parts(new TreeWalker((node, descend) => {
          if (found) return true;
          if (node instanceof AST_This) return found = class_this;
          if (node instanceof AST_SymbolRef) return found = node.definition().id === this_id;
          if (node instanceof AST_Lambda && !(node instanceof AST_Arrow)) {
            const class_this_save = class_this;
            class_this = false;
            descend();
            class_this = class_this_save;
            return true;
          }
        }));
        return found;
      }
    },
    AST_Scope
    /* TODO a class might have a scope but it's not a scope */
  );
  var AST_ClassProperty = DEFNODE("ClassProperty", "static quote", function AST_ClassProperty2(props) {
    if (props) {
      this.static = props.static;
      this.quote = props.quote;
      this.key = props.key;
      this.value = props.value;
      this.start = props.start;
      this.end = props.end;
      this._annotations = props._annotations;
    }
    this.flags = 0;
  }, {
    $documentation: "A class property",
    $propdoc: {
      static: "[boolean] whether this is a static key",
      quote: "[string] which quote is being used"
    },
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        if (this.key instanceof AST_Node)
          this.key._walk(visitor);
        if (this.value instanceof AST_Node)
          this.value._walk(visitor);
      });
    },
    _children_backwards(push2) {
      if (this.value instanceof AST_Node) push2(this.value);
      if (this.key instanceof AST_Node) push2(this.key);
    },
    computed_key() {
      return !(this.key instanceof AST_SymbolClassProperty);
    }
  }, AST_ObjectProperty);
  var AST_ClassPrivateProperty = DEFNODE("ClassPrivateProperty", "", function AST_ClassPrivateProperty2(props) {
    if (props) {
      this.static = props.static;
      this.quote = props.quote;
      this.key = props.key;
      this.value = props.value;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A class property for a private property"
  }, AST_ClassProperty);
  var AST_PrivateIn = DEFNODE("PrivateIn", "key value", function AST_PrivateIn2(props) {
    if (props) {
      this.key = props.key;
      this.value = props.value;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "An `in` binop when the key is private, eg #x in this",
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        this.key._walk(visitor);
        this.value._walk(visitor);
      });
    },
    _children_backwards(push2) {
      push2(this.value);
      push2(this.key);
    }
  });
  var AST_DefClass = DEFNODE("DefClass", null, function AST_DefClass2(props) {
    if (props) {
      this.name = props.name;
      this.extends = props.extends;
      this.properties = props.properties;
      this.variables = props.variables;
      this.uses_with = props.uses_with;
      this.uses_eval = props.uses_eval;
      this.parent_scope = props.parent_scope;
      this.enclosed = props.enclosed;
      this.cname = props.cname;
      this.body = props.body;
      this.block_scope = props.block_scope;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A class definition"
  }, AST_Class);
  var AST_ClassStaticBlock = DEFNODE("ClassStaticBlock", "body block_scope", function AST_ClassStaticBlock2(props) {
    this.body = props.body;
    this.block_scope = props.block_scope;
    this.start = props.start;
    this.end = props.end;
  }, {
    $documentation: "A block containing statements to be executed in the context of the class",
    $propdoc: {
      body: "[AST_Statement*] an array of statements"
    },
    _walk: function(visitor) {
      return visitor._visit(this, function() {
        walk_body(this, visitor);
      });
    },
    _children_backwards(push2) {
      let i = this.body.length;
      while (i--) push2(this.body[i]);
    },
    clone: clone_block_scope,
    computed_key: () => false
  }, AST_Scope);
  var AST_ClassExpression = DEFNODE("ClassExpression", null, function AST_ClassExpression2(props) {
    if (props) {
      this.name = props.name;
      this.extends = props.extends;
      this.properties = props.properties;
      this.variables = props.variables;
      this.uses_with = props.uses_with;
      this.uses_eval = props.uses_eval;
      this.parent_scope = props.parent_scope;
      this.enclosed = props.enclosed;
      this.cname = props.cname;
      this.body = props.body;
      this.block_scope = props.block_scope;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A class expression."
  }, AST_Class);
  var AST_Symbol = DEFNODE("Symbol", "scope name thedef", function AST_Symbol2(props) {
    if (props) {
      this.scope = props.scope;
      this.name = props.name;
      this.thedef = props.thedef;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $propdoc: {
      name: "[string] name of this symbol",
      scope: "[AST_Scope/S] the current scope (not necessarily the definition scope)",
      thedef: "[SymbolDef/S] the definition of this symbol"
    },
    $documentation: "Base class for all symbols"
  });
  var AST_NewTarget = DEFNODE("NewTarget", null, function AST_NewTarget2(props) {
    if (props) {
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A reference to new.target"
  });
  var AST_SymbolDeclaration = DEFNODE("SymbolDeclaration", "init", function AST_SymbolDeclaration2(props) {
    if (props) {
      this.init = props.init;
      this.scope = props.scope;
      this.name = props.name;
      this.thedef = props.thedef;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A declaration symbol (symbol in var/const, function name or argument, symbol in catch)"
  }, AST_Symbol);
  var AST_SymbolVar = DEFNODE("SymbolVar", null, function AST_SymbolVar2(props) {
    if (props) {
      this.init = props.init;
      this.scope = props.scope;
      this.name = props.name;
      this.thedef = props.thedef;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "Symbol defining a variable"
  }, AST_SymbolDeclaration);
  var AST_SymbolBlockDeclaration = DEFNODE(
    "SymbolBlockDeclaration",
    null,
    function AST_SymbolBlockDeclaration2(props) {
      if (props) {
        this.init = props.init;
        this.scope = props.scope;
        this.name = props.name;
        this.thedef = props.thedef;
        this.start = props.start;
        this.end = props.end;
      }
      this.flags = 0;
    },
    {
      $documentation: "Base class for block-scoped declaration symbols"
    },
    AST_SymbolDeclaration
  );
  var AST_SymbolConst = DEFNODE("SymbolConst", null, function AST_SymbolConst2(props) {
    if (props) {
      this.init = props.init;
      this.scope = props.scope;
      this.name = props.name;
      this.thedef = props.thedef;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A constant declaration"
  }, AST_SymbolBlockDeclaration);
  var AST_SymbolLet = DEFNODE("SymbolLet", null, function AST_SymbolLet2(props) {
    if (props) {
      this.init = props.init;
      this.scope = props.scope;
      this.name = props.name;
      this.thedef = props.thedef;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A block-scoped `let` declaration"
  }, AST_SymbolBlockDeclaration);
  var AST_SymbolFunarg = DEFNODE("SymbolFunarg", null, function AST_SymbolFunarg2(props) {
    if (props) {
      this.init = props.init;
      this.scope = props.scope;
      this.name = props.name;
      this.thedef = props.thedef;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "Symbol naming a function argument"
  }, AST_SymbolVar);
  var AST_SymbolDefun = DEFNODE("SymbolDefun", null, function AST_SymbolDefun2(props) {
    if (props) {
      this.init = props.init;
      this.scope = props.scope;
      this.name = props.name;
      this.thedef = props.thedef;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "Symbol defining a function"
  }, AST_SymbolDeclaration);
  var AST_SymbolMethod = DEFNODE("SymbolMethod", null, function AST_SymbolMethod2(props) {
    if (props) {
      this.scope = props.scope;
      this.name = props.name;
      this.thedef = props.thedef;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "Symbol in an object defining a method"
  }, AST_Symbol);
  var AST_SymbolClassProperty = DEFNODE("SymbolClassProperty", null, function AST_SymbolClassProperty2(props) {
    if (props) {
      this.scope = props.scope;
      this.name = props.name;
      this.thedef = props.thedef;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "Symbol for a class property"
  }, AST_Symbol);
  var AST_SymbolLambda = DEFNODE("SymbolLambda", null, function AST_SymbolLambda2(props) {
    if (props) {
      this.init = props.init;
      this.scope = props.scope;
      this.name = props.name;
      this.thedef = props.thedef;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "Symbol naming a function expression"
  }, AST_SymbolDeclaration);
  var AST_SymbolDefClass = DEFNODE("SymbolDefClass", null, function AST_SymbolDefClass2(props) {
    if (props) {
      this.init = props.init;
      this.scope = props.scope;
      this.name = props.name;
      this.thedef = props.thedef;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "Symbol naming a class's name in a class declaration. Lexically scoped to its containing scope, and accessible within the class."
  }, AST_SymbolBlockDeclaration);
  var AST_SymbolClass = DEFNODE("SymbolClass", null, function AST_SymbolClass2(props) {
    if (props) {
      this.init = props.init;
      this.scope = props.scope;
      this.name = props.name;
      this.thedef = props.thedef;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "Symbol naming a class's name. Lexically scoped to the class."
  }, AST_SymbolDeclaration);
  var AST_SymbolCatch = DEFNODE("SymbolCatch", null, function AST_SymbolCatch2(props) {
    if (props) {
      this.init = props.init;
      this.scope = props.scope;
      this.name = props.name;
      this.thedef = props.thedef;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "Symbol naming the exception in catch"
  }, AST_SymbolBlockDeclaration);
  var AST_SymbolImport = DEFNODE("SymbolImport", null, function AST_SymbolImport2(props) {
    if (props) {
      this.init = props.init;
      this.scope = props.scope;
      this.name = props.name;
      this.thedef = props.thedef;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "Symbol referring to an imported name"
  }, AST_SymbolBlockDeclaration);
  var AST_SymbolImportForeign = DEFNODE("SymbolImportForeign", null, function AST_SymbolImportForeign2(props) {
    if (props) {
      this.scope = props.scope;
      this.name = props.name;
      this.thedef = props.thedef;
      this.quote = props.quote;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A symbol imported from a module, but it is defined in the other module, and its real name is irrelevant for this module's purposes"
  }, AST_Symbol);
  var AST_Label = DEFNODE("Label", "references", function AST_Label2(props) {
    if (props) {
      this.references = props.references;
      this.scope = props.scope;
      this.name = props.name;
      this.thedef = props.thedef;
      this.start = props.start;
      this.end = props.end;
      this.initialize();
    }
    this.flags = 0;
  }, {
    $documentation: "Symbol naming a label (declaration)",
    $propdoc: {
      references: "[AST_LoopControl*] a list of nodes referring to this label"
    },
    initialize: function() {
      this.references = [];
      this.thedef = this;
    }
  }, AST_Symbol);
  var AST_SymbolRef = DEFNODE("SymbolRef", null, function AST_SymbolRef2(props) {
    if (props) {
      this.scope = props.scope;
      this.name = props.name;
      this.thedef = props.thedef;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "Reference to some symbol (not definition/declaration)"
  }, AST_Symbol);
  var AST_SymbolExport = DEFNODE("SymbolExport", null, function AST_SymbolExport2(props) {
    if (props) {
      this.scope = props.scope;
      this.name = props.name;
      this.thedef = props.thedef;
      this.quote = props.quote;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "Symbol referring to a name to export"
  }, AST_SymbolRef);
  var AST_SymbolExportForeign = DEFNODE("SymbolExportForeign", null, function AST_SymbolExportForeign2(props) {
    if (props) {
      this.scope = props.scope;
      this.name = props.name;
      this.thedef = props.thedef;
      this.quote = props.quote;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A symbol exported from this module, but it is used in the other module, and its real name is irrelevant for this module's purposes"
  }, AST_Symbol);
  var AST_LabelRef = DEFNODE("LabelRef", null, function AST_LabelRef2(props) {
    if (props) {
      this.scope = props.scope;
      this.name = props.name;
      this.thedef = props.thedef;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "Reference to a label symbol"
  }, AST_Symbol);
  var AST_SymbolPrivateProperty = DEFNODE("SymbolPrivateProperty", null, function AST_SymbolPrivateProperty2(props) {
    if (props) {
      this.scope = props.scope;
      this.name = props.name;
      this.thedef = props.thedef;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A symbol that refers to a private property"
  }, AST_Symbol);
  var AST_This = DEFNODE("This", null, function AST_This2(props) {
    if (props) {
      this.scope = props.scope;
      this.name = props.name;
      this.thedef = props.thedef;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "The `this` symbol"
  }, AST_Symbol);
  var AST_Super = DEFNODE("Super", null, function AST_Super2(props) {
    if (props) {
      this.scope = props.scope;
      this.name = props.name;
      this.thedef = props.thedef;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "The `super` symbol"
  }, AST_This);
  var AST_Constant = DEFNODE("Constant", null, function AST_Constant2(props) {
    if (props) {
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "Base class for all constants",
    getValue: function() {
      return this.value;
    }
  });
  var AST_String = DEFNODE("String", "value quote", function AST_String2(props) {
    if (props) {
      this.value = props.value;
      this.quote = props.quote;
      this.start = props.start;
      this.end = props.end;
      this._annotations = props._annotations;
    }
    this.flags = 0;
  }, {
    $documentation: "A string literal",
    $propdoc: {
      value: "[string] the contents of this string",
      quote: "[string] the original quote character"
    }
  }, AST_Constant);
  var AST_Number = DEFNODE("Number", "value raw", function AST_Number2(props) {
    if (props) {
      this.value = props.value;
      this.raw = props.raw;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A number literal",
    $propdoc: {
      value: "[number] the numeric value",
      raw: "[string] numeric value as string"
    }
  }, AST_Constant);
  var AST_BigInt = DEFNODE("BigInt", "value", function AST_BigInt2(props) {
    if (props) {
      this.value = props.value;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A big int literal",
    $propdoc: {
      value: "[string] big int value"
    }
  }, AST_Constant);
  var AST_RegExp = DEFNODE("RegExp", "value", function AST_RegExp2(props) {
    if (props) {
      this.value = props.value;
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A regexp literal",
    $propdoc: {
      value: "[RegExp] the actual regexp"
    }
  }, AST_Constant);
  var AST_Atom = DEFNODE("Atom", null, function AST_Atom2(props) {
    if (props) {
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "Base class for atoms"
  }, AST_Constant);
  var AST_Null = DEFNODE("Null", null, function AST_Null2(props) {
    if (props) {
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "The `null` atom",
    value: null
  }, AST_Atom);
  var AST_NaN = DEFNODE("NaN", null, function AST_NaN2(props) {
    if (props) {
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "The impossible value",
    value: 0 / 0
  }, AST_Atom);
  var AST_Undefined = DEFNODE("Undefined", null, function AST_Undefined2(props) {
    if (props) {
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "The `undefined` value",
    value: /* @__PURE__ */ function() {
    }()
  }, AST_Atom);
  var AST_Hole = DEFNODE("Hole", null, function AST_Hole2(props) {
    if (props) {
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "A hole in an array",
    value: /* @__PURE__ */ function() {
    }()
  }, AST_Atom);
  var AST_Infinity = DEFNODE("Infinity", null, function AST_Infinity2(props) {
    if (props) {
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "The `Infinity` value",
    value: 1 / 0
  }, AST_Atom);
  var AST_Boolean = DEFNODE("Boolean", null, function AST_Boolean2(props) {
    if (props) {
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "Base class for booleans"
  }, AST_Atom);
  var AST_False = DEFNODE("False", null, function AST_False2(props) {
    if (props) {
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "The `false` atom",
    value: false
  }, AST_Boolean);
  var AST_True = DEFNODE("True", null, function AST_True2(props) {
    if (props) {
      this.start = props.start;
      this.end = props.end;
    }
    this.flags = 0;
  }, {
    $documentation: "The `true` atom",
    value: true
  }, AST_Boolean);
  function walk(node, cb, to_visit = [node]) {
    const push2 = to_visit.push.bind(to_visit);
    while (to_visit.length) {
      const node2 = to_visit.pop();
      const ret = cb(node2, to_visit);
      if (ret) {
        if (ret === walk_abort) return true;
        continue;
      }
      node2._children_backwards(push2);
    }
    return false;
  }
  function walk_parent(node, cb, initial_stack) {
    const to_visit = [node];
    const push2 = to_visit.push.bind(to_visit);
    const stack = initial_stack ? initial_stack.slice() : [];
    const parent_pop_indices = [];
    let current;
    const info = {
      parent: (n = 0) => {
        if (n === -1) {
          return current;
        }
        if (initial_stack && n >= stack.length) {
          n -= stack.length;
          return initial_stack[initial_stack.length - (n + 1)];
        }
        return stack[stack.length - (1 + n)];
      }
    };
    while (to_visit.length) {
      current = to_visit.pop();
      while (parent_pop_indices.length && to_visit.length == parent_pop_indices[parent_pop_indices.length - 1]) {
        stack.pop();
        parent_pop_indices.pop();
      }
      const ret = cb(current, info);
      if (ret) {
        if (ret === walk_abort) return true;
        continue;
      }
      const visit_length = to_visit.length;
      current._children_backwards(push2);
      if (to_visit.length > visit_length) {
        stack.push(current);
        parent_pop_indices.push(visit_length - 1);
      }
    }
    return false;
  }
  var walk_abort = Symbol("abort walk");
  var TreeWalker = class {
    constructor(callback) {
      this.visit = callback;
      this.stack = [];
      this.directives = /* @__PURE__ */ Object.create(null);
    }
    _visit(node, descend) {
      this.push(node);
      var ret = this.visit(node, descend ? function() {
        descend.call(node);
      } : noop);
      if (!ret && descend) {
        descend.call(node);
      }
      this.pop();
      return ret;
    }
    parent(n) {
      return this.stack[this.stack.length - 2 - (n || 0)];
    }
    push(node) {
      if (node instanceof AST_Lambda) {
        this.directives = Object.create(this.directives);
      } else if (node instanceof AST_Directive && !this.directives[node.value]) {
        this.directives[node.value] = node;
      } else if (node instanceof AST_Class) {
        this.directives = Object.create(this.directives);
        if (!this.directives["use strict"]) {
          this.directives["use strict"] = node;
        }
      }
      this.stack.push(node);
    }
    pop() {
      var node = this.stack.pop();
      if (node instanceof AST_Lambda || node instanceof AST_Class) {
        this.directives = Object.getPrototypeOf(this.directives);
      }
    }
    self() {
      return this.stack[this.stack.length - 1];
    }
    find_parent(type) {
      var stack = this.stack;
      for (var i = stack.length; --i >= 0; ) {
        var x = stack[i];
        if (x instanceof type) return x;
      }
    }
    find_scope() {
      var stack = this.stack;
      for (var i = stack.length; --i >= 0; ) {
        const p = stack[i];
        if (p instanceof AST_Toplevel) return p;
        if (p instanceof AST_Lambda) return p;
        if (p.block_scope) return p.block_scope;
      }
    }
    has_directive(type) {
      var dir = this.directives[type];
      if (dir) return dir;
      var node = this.stack[this.stack.length - 1];
      if (node instanceof AST_Scope && node.body) {
        for (var i = 0; i < node.body.length; ++i) {
          var st = node.body[i];
          if (!(st instanceof AST_Directive)) break;
          if (st.value == type) return st;
        }
      }
    }
    loopcontrol_target(node) {
      var stack = this.stack;
      if (node.label) for (var i = stack.length; --i >= 0; ) {
        var x = stack[i];
        if (x instanceof AST_LabeledStatement && x.label.name == node.label.name)
          return x.body;
      }
      else for (var i = stack.length; --i >= 0; ) {
        var x = stack[i];
        if (x instanceof AST_IterationStatement || node instanceof AST_Break && x instanceof AST_Switch)
          return x;
      }
    }
  };
  var TreeTransformer = class extends TreeWalker {
    constructor(before, after) {
      super();
      this.before = before;
      this.after = after;
    }
  };
  var _PURE = 1;
  var _INLINE = 2;
  var _NOINLINE = 4;
  var _KEY = 8;
  var _MANGLEPROP = 16;

  // node_modules/terser/lib/transform.js
  function def_transform(node, descend) {
    node.DEFMETHOD("transform", function(tw, in_list) {
      let transformed = void 0;
      tw.push(this);
      if (tw.before) transformed = tw.before(this, descend, in_list);
      if (transformed === void 0) {
        transformed = this;
        descend(transformed, tw);
        if (tw.after) {
          const after_ret = tw.after(transformed, in_list);
          if (after_ret !== void 0) transformed = after_ret;
        }
      }
      tw.pop();
      return transformed;
    });
  }
  def_transform(AST_Node, noop);
  def_transform(AST_LabeledStatement, function(self2, tw) {
    self2.label = self2.label.transform(tw);
    self2.body = self2.body.transform(tw);
  });
  def_transform(AST_SimpleStatement, function(self2, tw) {
    self2.body = self2.body.transform(tw);
  });
  def_transform(AST_Block, function(self2, tw) {
    self2.body = MAP(self2.body, tw);
  });
  def_transform(AST_Do, function(self2, tw) {
    self2.body = self2.body.transform(tw);
    self2.condition = self2.condition.transform(tw);
  });
  def_transform(AST_While, function(self2, tw) {
    self2.condition = self2.condition.transform(tw);
    self2.body = self2.body.transform(tw);
  });
  def_transform(AST_For, function(self2, tw) {
    if (self2.init) self2.init = self2.init.transform(tw);
    if (self2.condition) self2.condition = self2.condition.transform(tw);
    if (self2.step) self2.step = self2.step.transform(tw);
    self2.body = self2.body.transform(tw);
  });
  def_transform(AST_ForIn, function(self2, tw) {
    self2.init = self2.init.transform(tw);
    self2.object = self2.object.transform(tw);
    self2.body = self2.body.transform(tw);
  });
  def_transform(AST_With, function(self2, tw) {
    self2.expression = self2.expression.transform(tw);
    self2.body = self2.body.transform(tw);
  });
  def_transform(AST_Exit, function(self2, tw) {
    if (self2.value) self2.value = self2.value.transform(tw);
  });
  def_transform(AST_LoopControl, function(self2, tw) {
    if (self2.label) self2.label = self2.label.transform(tw);
  });
  def_transform(AST_If, function(self2, tw) {
    self2.condition = self2.condition.transform(tw);
    self2.body = self2.body.transform(tw);
    if (self2.alternative) self2.alternative = self2.alternative.transform(tw);
  });
  def_transform(AST_Switch, function(self2, tw) {
    self2.expression = self2.expression.transform(tw);
    self2.body = MAP(self2.body, tw);
  });
  def_transform(AST_Case, function(self2, tw) {
    self2.expression = self2.expression.transform(tw);
    self2.body = MAP(self2.body, tw);
  });
  def_transform(AST_Try, function(self2, tw) {
    self2.body = self2.body.transform(tw);
    if (self2.bcatch) self2.bcatch = self2.bcatch.transform(tw);
    if (self2.bfinally) self2.bfinally = self2.bfinally.transform(tw);
  });
  def_transform(AST_Catch, function(self2, tw) {
    if (self2.argname) self2.argname = self2.argname.transform(tw);
    self2.body = MAP(self2.body, tw);
  });
  def_transform(AST_Definitions, function(self2, tw) {
    self2.definitions = MAP(self2.definitions, tw);
  });
  def_transform(AST_VarDef, function(self2, tw) {
    self2.name = self2.name.transform(tw);
    if (self2.value) self2.value = self2.value.transform(tw);
  });
  def_transform(AST_Destructuring, function(self2, tw) {
    self2.names = MAP(self2.names, tw);
  });
  def_transform(AST_Lambda, function(self2, tw) {
    if (self2.name) self2.name = self2.name.transform(tw);
    self2.argnames = MAP(
      self2.argnames,
      tw,
      /* allow_splicing */
      false
    );
    if (self2.body instanceof AST_Node) {
      self2.body = self2.body.transform(tw);
    } else {
      self2.body = MAP(self2.body, tw);
    }
  });
  def_transform(AST_Call, function(self2, tw) {
    self2.expression = self2.expression.transform(tw);
    self2.args = MAP(
      self2.args,
      tw,
      /* allow_splicing */
      false
    );
  });
  def_transform(AST_Sequence, function(self2, tw) {
    const result = MAP(self2.expressions, tw);
    self2.expressions = result.length ? result : [new AST_Number({ value: 0 })];
  });
  def_transform(AST_PropAccess, function(self2, tw) {
    self2.expression = self2.expression.transform(tw);
  });
  def_transform(AST_Sub, function(self2, tw) {
    self2.expression = self2.expression.transform(tw);
    self2.property = self2.property.transform(tw);
  });
  def_transform(AST_Chain, function(self2, tw) {
    self2.expression = self2.expression.transform(tw);
  });
  def_transform(AST_Yield, function(self2, tw) {
    if (self2.expression) self2.expression = self2.expression.transform(tw);
  });
  def_transform(AST_Await, function(self2, tw) {
    self2.expression = self2.expression.transform(tw);
  });
  def_transform(AST_Unary, function(self2, tw) {
    self2.expression = self2.expression.transform(tw);
  });
  def_transform(AST_Binary, function(self2, tw) {
    self2.left = self2.left.transform(tw);
    self2.right = self2.right.transform(tw);
  });
  def_transform(AST_PrivateIn, function(self2, tw) {
    self2.key = self2.key.transform(tw);
    self2.value = self2.value.transform(tw);
  });
  def_transform(AST_Conditional, function(self2, tw) {
    self2.condition = self2.condition.transform(tw);
    self2.consequent = self2.consequent.transform(tw);
    self2.alternative = self2.alternative.transform(tw);
  });
  def_transform(AST_Array, function(self2, tw) {
    self2.elements = MAP(self2.elements, tw);
  });
  def_transform(AST_Object, function(self2, tw) {
    self2.properties = MAP(self2.properties, tw);
  });
  def_transform(AST_ObjectProperty, function(self2, tw) {
    if (self2.key instanceof AST_Node) {
      self2.key = self2.key.transform(tw);
    }
    if (self2.value) self2.value = self2.value.transform(tw);
  });
  def_transform(AST_Class, function(self2, tw) {
    if (self2.name) self2.name = self2.name.transform(tw);
    if (self2.extends) self2.extends = self2.extends.transform(tw);
    self2.properties = MAP(self2.properties, tw);
  });
  def_transform(AST_ClassStaticBlock, function(self2, tw) {
    self2.body = MAP(self2.body, tw);
  });
  def_transform(AST_Expansion, function(self2, tw) {
    self2.expression = self2.expression.transform(tw);
  });
  def_transform(AST_NameMapping, function(self2, tw) {
    self2.foreign_name = self2.foreign_name.transform(tw);
    self2.name = self2.name.transform(tw);
  });
  def_transform(AST_Import, function(self2, tw) {
    if (self2.imported_name) self2.imported_name = self2.imported_name.transform(tw);
    if (self2.imported_names) MAP(self2.imported_names, tw);
    self2.module_name = self2.module_name.transform(tw);
  });
  def_transform(AST_Export, function(self2, tw) {
    if (self2.exported_definition) self2.exported_definition = self2.exported_definition.transform(tw);
    if (self2.exported_value) self2.exported_value = self2.exported_value.transform(tw);
    if (self2.exported_names) MAP(self2.exported_names, tw);
    if (self2.module_name) self2.module_name = self2.module_name.transform(tw);
  });
  def_transform(AST_TemplateString, function(self2, tw) {
    self2.segments = MAP(self2.segments, tw);
  });
  def_transform(AST_PrefixedTemplateString, function(self2, tw) {
    self2.prefix = self2.prefix.transform(tw);
    self2.template_string = self2.template_string.transform(tw);
  });

  // node_modules/terser/lib/mozilla-ast.js
  (function() {
    var normalize_directives = function(body) {
      for (var i = 0; i < body.length; i++) {
        if (body[i] instanceof AST_Statement && body[i].body instanceof AST_String) {
          body[i] = new AST_Directive({
            start: body[i].start,
            end: body[i].end,
            value: body[i].body.value
          });
        } else {
          return body;
        }
      }
      return body;
    };
    const assert_clause_from_moz = (assertions) => {
      if (assertions && assertions.length > 0) {
        return new AST_Object({
          start: my_start_token(assertions),
          end: my_end_token(assertions),
          properties: assertions.map(
            (assertion_kv) => new AST_ObjectKeyVal({
              start: my_start_token(assertion_kv),
              end: my_end_token(assertion_kv),
              key: assertion_kv.key.name || assertion_kv.key.value,
              value: from_moz(assertion_kv.value)
            })
          )
        });
      }
      return null;
    };
    var MOZ_TO_ME = {
      Program: function(M) {
        return new AST_Toplevel({
          start: my_start_token(M),
          end: my_end_token(M),
          body: normalize_directives(M.body.map(from_moz))
        });
      },
      ArrayPattern: function(M) {
        return new AST_Destructuring({
          start: my_start_token(M),
          end: my_end_token(M),
          names: M.elements.map(function(elm) {
            if (elm === null) {
              return new AST_Hole();
            }
            return from_moz(elm);
          }),
          is_array: true
        });
      },
      ObjectPattern: function(M) {
        return new AST_Destructuring({
          start: my_start_token(M),
          end: my_end_token(M),
          names: M.properties.map(from_moz),
          is_array: false
        });
      },
      AssignmentPattern: function(M) {
        return new AST_DefaultAssign({
          start: my_start_token(M),
          end: my_end_token(M),
          left: from_moz(M.left),
          operator: "=",
          right: from_moz(M.right)
        });
      },
      SpreadElement: function(M) {
        return new AST_Expansion({
          start: my_start_token(M),
          end: my_end_token(M),
          expression: from_moz(M.argument)
        });
      },
      RestElement: function(M) {
        return new AST_Expansion({
          start: my_start_token(M),
          end: my_end_token(M),
          expression: from_moz(M.argument)
        });
      },
      TemplateElement: function(M) {
        return new AST_TemplateSegment({
          start: my_start_token(M),
          end: my_end_token(M),
          value: M.value.cooked,
          raw: M.value.raw
        });
      },
      TemplateLiteral: function(M) {
        var segments = [];
        for (var i = 0; i < M.quasis.length; i++) {
          segments.push(from_moz(M.quasis[i]));
          if (M.expressions[i]) {
            segments.push(from_moz(M.expressions[i]));
          }
        }
        return new AST_TemplateString({
          start: my_start_token(M),
          end: my_end_token(M),
          segments
        });
      },
      TaggedTemplateExpression: function(M) {
        return new AST_PrefixedTemplateString({
          start: my_start_token(M),
          end: my_end_token(M),
          template_string: from_moz(M.quasi),
          prefix: from_moz(M.tag)
        });
      },
      FunctionDeclaration: function(M) {
        return new AST_Defun({
          start: my_start_token(M),
          end: my_end_token(M),
          name: from_moz(M.id),
          argnames: M.params.map(from_moz),
          is_generator: M.generator,
          async: M.async,
          body: normalize_directives(from_moz(M.body).body)
        });
      },
      FunctionExpression: function(M) {
        return new AST_Function({
          start: my_start_token(M),
          end: my_end_token(M),
          name: from_moz(M.id),
          argnames: M.params.map(from_moz),
          is_generator: M.generator,
          async: M.async,
          body: normalize_directives(from_moz(M.body).body)
        });
      },
      ArrowFunctionExpression: function(M) {
        const body = M.body.type === "BlockStatement" ? from_moz(M.body).body : [make_node(AST_Return, {}, { value: from_moz(M.body) })];
        return new AST_Arrow({
          start: my_start_token(M),
          end: my_end_token(M),
          argnames: M.params.map(from_moz),
          body,
          async: M.async
        });
      },
      ExpressionStatement: function(M) {
        return new AST_SimpleStatement({
          start: my_start_token(M),
          end: my_end_token(M),
          body: from_moz(M.expression)
        });
      },
      TryStatement: function(M) {
        var handlers = M.handlers || [M.handler];
        if (handlers.length > 1 || M.guardedHandlers && M.guardedHandlers.length) {
          throw new Error("Multiple catch clauses are not supported.");
        }
        return new AST_Try({
          start: my_start_token(M),
          end: my_end_token(M),
          body: new AST_TryBlock(from_moz(M.block)),
          bcatch: from_moz(handlers[0]),
          bfinally: M.finalizer ? new AST_Finally(from_moz(M.finalizer)) : null
        });
      },
      Property: function(M) {
        var key = M.key;
        var args = {
          start: my_start_token(key || M.value),
          end: my_end_token(M.value),
          key: key.type == "Identifier" ? key.name : key.value,
          value: from_moz(M.value)
        };
        if (M.computed) {
          args.key = from_moz(M.key);
        }
        if (M.method) {
          args.is_generator = M.value.generator;
          args.async = M.value.async;
          if (!M.computed) {
            args.key = new AST_SymbolMethod({ name: args.key });
          } else {
            args.key = from_moz(M.key);
          }
          return new AST_ConciseMethod(args);
        }
        if (M.kind == "init") {
          if (key.type != "Identifier" && key.type != "Literal") {
            args.key = from_moz(key);
          }
          return new AST_ObjectKeyVal(args);
        }
        if (typeof args.key === "string" || typeof args.key === "number") {
          args.key = new AST_SymbolMethod({
            name: args.key
          });
        }
        args.value = new AST_Accessor(args.value);
        if (M.kind == "get") return new AST_ObjectGetter(args);
        if (M.kind == "set") return new AST_ObjectSetter(args);
        if (M.kind == "method") {
          args.async = M.value.async;
          args.is_generator = M.value.generator;
          args.quote = M.computed ? '"' : null;
          return new AST_ConciseMethod(args);
        }
      },
      MethodDefinition: function(M) {
        const is_private = M.key.type === "PrivateIdentifier";
        const key = M.computed ? from_moz(M.key) : new AST_SymbolMethod({ name: M.key.name || M.key.value });
        var args = {
          start: my_start_token(M),
          end: my_end_token(M),
          key,
          value: from_moz(M.value),
          static: M.static
        };
        if (M.kind == "get") {
          return new (is_private ? AST_PrivateGetter : AST_ObjectGetter)(args);
        }
        if (M.kind == "set") {
          return new (is_private ? AST_PrivateSetter : AST_ObjectSetter)(args);
        }
        args.is_generator = M.value.generator;
        args.async = M.value.async;
        return new (is_private ? AST_PrivateMethod : AST_ConciseMethod)(args);
      },
      FieldDefinition: function(M) {
        let key;
        if (M.computed) {
          key = from_moz(M.key);
        } else {
          if (M.key.type !== "Identifier") throw new Error("Non-Identifier key in FieldDefinition");
          key = from_moz(M.key);
        }
        return new AST_ClassProperty({
          start: my_start_token(M),
          end: my_end_token(M),
          key,
          value: from_moz(M.value),
          static: M.static
        });
      },
      PropertyDefinition: function(M) {
        let key;
        if (M.computed) {
          key = from_moz(M.key);
        } else if (M.key.type === "PrivateIdentifier") {
          return new AST_ClassPrivateProperty({
            start: my_start_token(M),
            end: my_end_token(M),
            key: from_moz(M.key),
            value: from_moz(M.value),
            static: M.static
          });
        } else {
          if (M.key.type !== "Identifier") {
            throw new Error("Non-Identifier key in PropertyDefinition");
          }
          key = from_moz(M.key);
        }
        return new AST_ClassProperty({
          start: my_start_token(M),
          end: my_end_token(M),
          key,
          value: from_moz(M.value),
          static: M.static
        });
      },
      PrivateIdentifier: function(M) {
        return new AST_SymbolPrivateProperty({
          start: my_start_token(M),
          end: my_end_token(M),
          name: M.name
        });
      },
      StaticBlock: function(M) {
        return new AST_ClassStaticBlock({
          start: my_start_token(M),
          end: my_end_token(M),
          body: M.body.map(from_moz)
        });
      },
      ArrayExpression: function(M) {
        return new AST_Array({
          start: my_start_token(M),
          end: my_end_token(M),
          elements: M.elements.map(function(elem) {
            return elem === null ? new AST_Hole() : from_moz(elem);
          })
        });
      },
      ObjectExpression: function(M) {
        return new AST_Object({
          start: my_start_token(M),
          end: my_end_token(M),
          properties: M.properties.map(function(prop) {
            if (prop.type === "SpreadElement") {
              return from_moz(prop);
            }
            prop.type = "Property";
            return from_moz(prop);
          })
        });
      },
      SequenceExpression: function(M) {
        return new AST_Sequence({
          start: my_start_token(M),
          end: my_end_token(M),
          expressions: M.expressions.map(from_moz)
        });
      },
      MemberExpression: function(M) {
        if (M.property.type === "PrivateIdentifier") {
          return new AST_DotHash({
            start: my_start_token(M),
            end: my_end_token(M),
            property: M.property.name,
            expression: from_moz(M.object),
            optional: M.optional || false
          });
        }
        return new (M.computed ? AST_Sub : AST_Dot)({
          start: my_start_token(M),
          end: my_end_token(M),
          property: M.computed ? from_moz(M.property) : M.property.name,
          expression: from_moz(M.object),
          optional: M.optional || false
        });
      },
      ChainExpression: function(M) {
        return new AST_Chain({
          start: my_start_token(M),
          end: my_end_token(M),
          expression: from_moz(M.expression)
        });
      },
      SwitchCase: function(M) {
        return new (M.test ? AST_Case : AST_Default)({
          start: my_start_token(M),
          end: my_end_token(M),
          expression: from_moz(M.test),
          body: M.consequent.map(from_moz)
        });
      },
      VariableDeclaration: function(M) {
        return new (M.kind === "const" ? AST_Const : M.kind === "let" ? AST_Let : AST_Var)({
          start: my_start_token(M),
          end: my_end_token(M),
          definitions: M.declarations.map(from_moz)
        });
      },
      ImportDeclaration: function(M) {
        var imported_name = null;
        var imported_names = null;
        M.specifiers.forEach(function(specifier) {
          if (specifier.type === "ImportSpecifier" || specifier.type === "ImportNamespaceSpecifier") {
            if (!imported_names) {
              imported_names = [];
            }
            imported_names.push(from_moz(specifier));
          } else if (specifier.type === "ImportDefaultSpecifier") {
            imported_name = from_moz(specifier);
          }
        });
        return new AST_Import({
          start: my_start_token(M),
          end: my_end_token(M),
          imported_name,
          imported_names,
          module_name: from_moz(M.source),
          assert_clause: assert_clause_from_moz(M.assertions)
        });
      },
      ImportSpecifier: function(M) {
        return new AST_NameMapping({
          start: my_start_token(M),
          end: my_end_token(M),
          foreign_name: from_moz(M.imported),
          name: from_moz(M.local)
        });
      },
      ImportDefaultSpecifier: function(M) {
        return from_moz(M.local);
      },
      ImportNamespaceSpecifier: function(M) {
        return new AST_NameMapping({
          start: my_start_token(M),
          end: my_end_token(M),
          foreign_name: new AST_SymbolImportForeign({ name: "*" }),
          name: from_moz(M.local)
        });
      },
      ImportExpression: function(M) {
        return new AST_Call({
          start: my_start_token(M),
          end: my_end_token(M),
          expression: from_moz({
            type: "Identifier",
            name: "import"
          }),
          optional: false,
          args: [from_moz(M.source)]
        });
      },
      ExportAllDeclaration: function(M) {
        var foreign_name = M.exported == null ? new AST_SymbolExportForeign({ name: "*" }) : from_moz(M.exported);
        return new AST_Export({
          start: my_start_token(M),
          end: my_end_token(M),
          exported_names: [
            new AST_NameMapping({
              name: new AST_SymbolExportForeign({ name: "*" }),
              foreign_name
            })
          ],
          module_name: from_moz(M.source),
          assert_clause: assert_clause_from_moz(M.assertions)
        });
      },
      ExportNamedDeclaration: function(M) {
        return new AST_Export({
          start: my_start_token(M),
          end: my_end_token(M),
          exported_definition: from_moz(M.declaration),
          exported_names: M.specifiers && M.specifiers.length ? M.specifiers.map(from_moz) : null,
          module_name: from_moz(M.source),
          assert_clause: assert_clause_from_moz(M.assertions)
        });
      },
      ExportDefaultDeclaration: function(M) {
        return new AST_Export({
          start: my_start_token(M),
          end: my_end_token(M),
          exported_value: from_moz(M.declaration),
          is_default: true
        });
      },
      ExportSpecifier: function(M) {
        return new AST_NameMapping({
          foreign_name: from_moz(M.exported),
          name: from_moz(M.local)
        });
      },
      Literal: function(M) {
        var val = M.value, args = {
          start: my_start_token(M),
          end: my_end_token(M)
        };
        var rx = M.regex;
        if (rx && rx.pattern) {
          args.value = {
            source: rx.pattern,
            flags: rx.flags
          };
          return new AST_RegExp(args);
        } else if (rx) {
          const rx_source = M.raw || val;
          const match = rx_source.match(/^\/(.*)\/(\w*)$/);
          if (!match) throw new Error("Invalid regex source " + rx_source);
          const [_, source, flags] = match;
          args.value = { source, flags };
          return new AST_RegExp(args);
        }
        const bi = typeof M.value === "bigint" ? M.value.toString() : M.bigint;
        if (typeof bi === "string") {
          args.value = bi;
          return new AST_BigInt(args);
        }
        if (val === null) return new AST_Null(args);
        switch (typeof val) {
          case "string":
            args.quote = '"';
            var p = FROM_MOZ_STACK[FROM_MOZ_STACK.length - 2];
            if (p.type == "ImportSpecifier") {
              args.name = val;
              return new AST_SymbolImportForeign(args);
            } else if (p.type == "ExportSpecifier") {
              args.name = val;
              if (M == p.exported) {
                return new AST_SymbolExportForeign(args);
              } else {
                return new AST_SymbolExport(args);
              }
            } else if (p.type == "ExportAllDeclaration" && M == p.exported) {
              args.name = val;
              return new AST_SymbolExportForeign(args);
            }
            args.value = val;
            return new AST_String(args);
          case "number":
            args.value = val;
            args.raw = M.raw || val.toString();
            return new AST_Number(args);
          case "boolean":
            return new (val ? AST_True : AST_False)(args);
        }
      },
      MetaProperty: function(M) {
        if (M.meta.name === "new" && M.property.name === "target") {
          return new AST_NewTarget({
            start: my_start_token(M),
            end: my_end_token(M)
          });
        } else if (M.meta.name === "import" && M.property.name === "meta") {
          return new AST_ImportMeta({
            start: my_start_token(M),
            end: my_end_token(M)
          });
        }
      },
      Identifier: function(M) {
        var p = FROM_MOZ_STACK[FROM_MOZ_STACK.length - 2];
        return new (p.type == "LabeledStatement" ? AST_Label : p.type == "VariableDeclarator" && p.id === M ? p.kind == "const" ? AST_SymbolConst : p.kind == "let" ? AST_SymbolLet : AST_SymbolVar : /Import.*Specifier/.test(p.type) ? p.local === M ? AST_SymbolImport : AST_SymbolImportForeign : p.type == "ExportSpecifier" ? p.local === M ? AST_SymbolExport : AST_SymbolExportForeign : p.type == "FunctionExpression" ? p.id === M ? AST_SymbolLambda : AST_SymbolFunarg : p.type == "FunctionDeclaration" ? p.id === M ? AST_SymbolDefun : AST_SymbolFunarg : p.type == "ArrowFunctionExpression" ? p.params.includes(M) ? AST_SymbolFunarg : AST_SymbolRef : p.type == "ClassExpression" ? p.id === M ? AST_SymbolClass : AST_SymbolRef : p.type == "Property" ? p.key === M && p.computed || p.value === M ? AST_SymbolRef : AST_SymbolMethod : p.type == "PropertyDefinition" || p.type === "FieldDefinition" ? p.key === M && p.computed || p.value === M ? AST_SymbolRef : AST_SymbolClassProperty : p.type == "ClassDeclaration" ? p.id === M ? AST_SymbolDefClass : AST_SymbolRef : p.type == "MethodDefinition" ? p.computed ? AST_SymbolRef : AST_SymbolMethod : p.type == "CatchClause" ? AST_SymbolCatch : p.type == "BreakStatement" || p.type == "ContinueStatement" ? AST_LabelRef : AST_SymbolRef)({
          start: my_start_token(M),
          end: my_end_token(M),
          name: M.name
        });
      },
      EmptyStatement: function(M) {
        return new AST_EmptyStatement({
          start: my_start_token(M),
          end: my_end_token(M)
        });
      },
      BlockStatement: function(M) {
        return new AST_BlockStatement({
          start: my_start_token(M),
          end: my_end_token(M),
          body: M.body.map(from_moz)
        });
      },
      IfStatement: function(M) {
        return new AST_If({
          start: my_start_token(M),
          end: my_end_token(M),
          condition: from_moz(M.test),
          body: from_moz(M.consequent),
          alternative: from_moz(M.alternate)
        });
      },
      LabeledStatement: function(M) {
        return new AST_LabeledStatement({
          start: my_start_token(M),
          end: my_end_token(M),
          label: from_moz(M.label),
          body: from_moz(M.body)
        });
      },
      BreakStatement: function(M) {
        return new AST_Break({
          start: my_start_token(M),
          end: my_end_token(M),
          label: from_moz(M.label)
        });
      },
      ContinueStatement: function(M) {
        return new AST_Continue({
          start: my_start_token(M),
          end: my_end_token(M),
          label: from_moz(M.label)
        });
      },
      WithStatement: function(M) {
        return new AST_With({
          start: my_start_token(M),
          end: my_end_token(M),
          expression: from_moz(M.object),
          body: from_moz(M.body)
        });
      },
      SwitchStatement: function(M) {
        return new AST_Switch({
          start: my_start_token(M),
          end: my_end_token(M),
          expression: from_moz(M.discriminant),
          body: M.cases.map(from_moz)
        });
      },
      ReturnStatement: function(M) {
        return new AST_Return({
          start: my_start_token(M),
          end: my_end_token(M),
          value: from_moz(M.argument)
        });
      },
      ThrowStatement: function(M) {
        return new AST_Throw({
          start: my_start_token(M),
          end: my_end_token(M),
          value: from_moz(M.argument)
        });
      },
      WhileStatement: function(M) {
        return new AST_While({
          start: my_start_token(M),
          end: my_end_token(M),
          condition: from_moz(M.test),
          body: from_moz(M.body)
        });
      },
      DoWhileStatement: function(M) {
        return new AST_Do({
          start: my_start_token(M),
          end: my_end_token(M),
          condition: from_moz(M.test),
          body: from_moz(M.body)
        });
      },
      ForStatement: function(M) {
        return new AST_For({
          start: my_start_token(M),
          end: my_end_token(M),
          init: from_moz(M.init),
          condition: from_moz(M.test),
          step: from_moz(M.update),
          body: from_moz(M.body)
        });
      },
      ForInStatement: function(M) {
        return new AST_ForIn({
          start: my_start_token(M),
          end: my_end_token(M),
          init: from_moz(M.left),
          object: from_moz(M.right),
          body: from_moz(M.body)
        });
      },
      ForOfStatement: function(M) {
        return new AST_ForOf({
          start: my_start_token(M),
          end: my_end_token(M),
          init: from_moz(M.left),
          object: from_moz(M.right),
          body: from_moz(M.body),
          await: M.await
        });
      },
      AwaitExpression: function(M) {
        return new AST_Await({
          start: my_start_token(M),
          end: my_end_token(M),
          expression: from_moz(M.argument)
        });
      },
      YieldExpression: function(M) {
        return new AST_Yield({
          start: my_start_token(M),
          end: my_end_token(M),
          expression: from_moz(M.argument),
          is_star: M.delegate
        });
      },
      DebuggerStatement: function(M) {
        return new AST_Debugger({
          start: my_start_token(M),
          end: my_end_token(M)
        });
      },
      VariableDeclarator: function(M) {
        return new AST_VarDef({
          start: my_start_token(M),
          end: my_end_token(M),
          name: from_moz(M.id),
          value: from_moz(M.init)
        });
      },
      CatchClause: function(M) {
        return new AST_Catch({
          start: my_start_token(M),
          end: my_end_token(M),
          argname: from_moz(M.param),
          body: from_moz(M.body).body
        });
      },
      ThisExpression: function(M) {
        return new AST_This({
          start: my_start_token(M),
          end: my_end_token(M)
        });
      },
      Super: function(M) {
        return new AST_Super({
          start: my_start_token(M),
          end: my_end_token(M)
        });
      },
      BinaryExpression: function(M) {
        if (M.left.type === "PrivateIdentifier") {
          return new AST_PrivateIn({
            start: my_start_token(M),
            end: my_end_token(M),
            key: new AST_SymbolPrivateProperty({
              start: my_start_token(M.left),
              end: my_end_token(M.left),
              name: M.left.name
            }),
            value: from_moz(M.right)
          });
        }
        return new AST_Binary({
          start: my_start_token(M),
          end: my_end_token(M),
          operator: M.operator,
          left: from_moz(M.left),
          right: from_moz(M.right)
        });
      },
      LogicalExpression: function(M) {
        return new AST_Binary({
          start: my_start_token(M),
          end: my_end_token(M),
          operator: M.operator,
          left: from_moz(M.left),
          right: from_moz(M.right)
        });
      },
      AssignmentExpression: function(M) {
        return new AST_Assign({
          start: my_start_token(M),
          end: my_end_token(M),
          operator: M.operator,
          left: from_moz(M.left),
          right: from_moz(M.right)
        });
      },
      ConditionalExpression: function(M) {
        return new AST_Conditional({
          start: my_start_token(M),
          end: my_end_token(M),
          condition: from_moz(M.test),
          consequent: from_moz(M.consequent),
          alternative: from_moz(M.alternate)
        });
      },
      NewExpression: function(M) {
        return new AST_New({
          start: my_start_token(M),
          end: my_end_token(M),
          expression: from_moz(M.callee),
          args: M.arguments.map(from_moz)
        });
      },
      CallExpression: function(M) {
        return new AST_Call({
          start: my_start_token(M),
          end: my_end_token(M),
          expression: from_moz(M.callee),
          optional: M.optional,
          args: M.arguments.map(from_moz)
        });
      }
    };
    MOZ_TO_ME.UpdateExpression = MOZ_TO_ME.UnaryExpression = function To_Moz_Unary(M) {
      var prefix = "prefix" in M ? M.prefix : M.type == "UnaryExpression" ? true : false;
      return new (prefix ? AST_UnaryPrefix : AST_UnaryPostfix)({
        start: my_start_token(M),
        end: my_end_token(M),
        operator: M.operator,
        expression: from_moz(M.argument)
      });
    };
    MOZ_TO_ME.ClassDeclaration = MOZ_TO_ME.ClassExpression = function From_Moz_Class(M) {
      return new (M.type === "ClassDeclaration" ? AST_DefClass : AST_ClassExpression)({
        start: my_start_token(M),
        end: my_end_token(M),
        name: from_moz(M.id),
        extends: from_moz(M.superClass),
        properties: M.body.body.map(from_moz)
      });
    };
    def_to_moz(AST_EmptyStatement, function To_Moz_EmptyStatement() {
      return {
        type: "EmptyStatement"
      };
    });
    def_to_moz(AST_BlockStatement, function To_Moz_BlockStatement(M) {
      return {
        type: "BlockStatement",
        body: M.body.map(to_moz)
      };
    });
    def_to_moz(AST_If, function To_Moz_IfStatement(M) {
      return {
        type: "IfStatement",
        test: to_moz(M.condition),
        consequent: to_moz(M.body),
        alternate: to_moz(M.alternative)
      };
    });
    def_to_moz(AST_LabeledStatement, function To_Moz_LabeledStatement(M) {
      return {
        type: "LabeledStatement",
        label: to_moz(M.label),
        body: to_moz(M.body)
      };
    });
    def_to_moz(AST_Break, function To_Moz_BreakStatement(M) {
      return {
        type: "BreakStatement",
        label: to_moz(M.label)
      };
    });
    def_to_moz(AST_Continue, function To_Moz_ContinueStatement(M) {
      return {
        type: "ContinueStatement",
        label: to_moz(M.label)
      };
    });
    def_to_moz(AST_With, function To_Moz_WithStatement(M) {
      return {
        type: "WithStatement",
        object: to_moz(M.expression),
        body: to_moz(M.body)
      };
    });
    def_to_moz(AST_Switch, function To_Moz_SwitchStatement(M) {
      return {
        type: "SwitchStatement",
        discriminant: to_moz(M.expression),
        cases: M.body.map(to_moz)
      };
    });
    def_to_moz(AST_Return, function To_Moz_ReturnStatement(M) {
      return {
        type: "ReturnStatement",
        argument: to_moz(M.value)
      };
    });
    def_to_moz(AST_Throw, function To_Moz_ThrowStatement(M) {
      return {
        type: "ThrowStatement",
        argument: to_moz(M.value)
      };
    });
    def_to_moz(AST_While, function To_Moz_WhileStatement(M) {
      return {
        type: "WhileStatement",
        test: to_moz(M.condition),
        body: to_moz(M.body)
      };
    });
    def_to_moz(AST_Do, function To_Moz_DoWhileStatement(M) {
      return {
        type: "DoWhileStatement",
        test: to_moz(M.condition),
        body: to_moz(M.body)
      };
    });
    def_to_moz(AST_For, function To_Moz_ForStatement(M) {
      return {
        type: "ForStatement",
        init: to_moz(M.init),
        test: to_moz(M.condition),
        update: to_moz(M.step),
        body: to_moz(M.body)
      };
    });
    def_to_moz(AST_ForIn, function To_Moz_ForInStatement(M) {
      return {
        type: "ForInStatement",
        left: to_moz(M.init),
        right: to_moz(M.object),
        body: to_moz(M.body)
      };
    });
    def_to_moz(AST_ForOf, function To_Moz_ForOfStatement(M) {
      return {
        type: "ForOfStatement",
        left: to_moz(M.init),
        right: to_moz(M.object),
        body: to_moz(M.body),
        await: M.await
      };
    });
    def_to_moz(AST_Await, function To_Moz_AwaitExpression(M) {
      return {
        type: "AwaitExpression",
        argument: to_moz(M.expression)
      };
    });
    def_to_moz(AST_Yield, function To_Moz_YieldExpression(M) {
      return {
        type: "YieldExpression",
        argument: to_moz(M.expression),
        delegate: M.is_star
      };
    });
    def_to_moz(AST_Debugger, function To_Moz_DebuggerStatement() {
      return {
        type: "DebuggerStatement"
      };
    });
    def_to_moz(AST_VarDef, function To_Moz_VariableDeclarator(M) {
      return {
        type: "VariableDeclarator",
        id: to_moz(M.name),
        init: to_moz(M.value)
      };
    });
    def_to_moz(AST_Catch, function To_Moz_CatchClause(M) {
      return {
        type: "CatchClause",
        param: to_moz(M.argname),
        body: to_moz_block(M)
      };
    });
    def_to_moz(AST_This, function To_Moz_ThisExpression() {
      return {
        type: "ThisExpression"
      };
    });
    def_to_moz(AST_Super, function To_Moz_Super() {
      return {
        type: "Super"
      };
    });
    def_to_moz(AST_Binary, function To_Moz_BinaryExpression(M) {
      return {
        type: "BinaryExpression",
        operator: M.operator,
        left: to_moz(M.left),
        right: to_moz(M.right)
      };
    });
    def_to_moz(AST_Binary, function To_Moz_LogicalExpression(M) {
      return {
        type: "LogicalExpression",
        operator: M.operator,
        left: to_moz(M.left),
        right: to_moz(M.right)
      };
    });
    def_to_moz(AST_Assign, function To_Moz_AssignmentExpression(M) {
      return {
        type: "AssignmentExpression",
        operator: M.operator,
        left: to_moz(M.left),
        right: to_moz(M.right)
      };
    });
    def_to_moz(AST_Conditional, function To_Moz_ConditionalExpression(M) {
      return {
        type: "ConditionalExpression",
        test: to_moz(M.condition),
        consequent: to_moz(M.consequent),
        alternate: to_moz(M.alternative)
      };
    });
    def_to_moz(AST_New, function To_Moz_NewExpression(M) {
      return {
        type: "NewExpression",
        callee: to_moz(M.expression),
        arguments: M.args.map(to_moz)
      };
    });
    def_to_moz(AST_Call, function To_Moz_CallExpression(M) {
      if (M.expression instanceof AST_SymbolRef && M.expression.name === "import") {
        const [source] = M.args.map(to_moz);
        return {
          type: "ImportExpression",
          source
        };
      }
      return {
        type: "CallExpression",
        callee: to_moz(M.expression),
        optional: M.optional,
        arguments: M.args.map(to_moz)
      };
    });
    def_to_moz(AST_Toplevel, function To_Moz_Program(M) {
      return to_moz_scope("Program", M);
    });
    def_to_moz(AST_Expansion, function To_Moz_Spread(M) {
      return {
        type: to_moz_in_destructuring() ? "RestElement" : "SpreadElement",
        argument: to_moz(M.expression)
      };
    });
    def_to_moz(AST_PrefixedTemplateString, function To_Moz_TaggedTemplateExpression(M) {
      return {
        type: "TaggedTemplateExpression",
        tag: to_moz(M.prefix),
        quasi: to_moz(M.template_string)
      };
    });
    def_to_moz(AST_TemplateString, function To_Moz_TemplateLiteral(M) {
      var quasis = [];
      var expressions = [];
      for (var i = 0; i < M.segments.length; i++) {
        if (i % 2 !== 0) {
          expressions.push(to_moz(M.segments[i]));
        } else {
          quasis.push({
            type: "TemplateElement",
            value: {
              raw: M.segments[i].raw,
              cooked: M.segments[i].value
            },
            tail: i === M.segments.length - 1
          });
        }
      }
      return {
        type: "TemplateLiteral",
        quasis,
        expressions
      };
    });
    def_to_moz(AST_Defun, function To_Moz_FunctionDeclaration(M) {
      return {
        type: "FunctionDeclaration",
        id: to_moz(M.name),
        params: M.argnames.map(to_moz),
        generator: M.is_generator,
        async: M.async,
        body: to_moz_scope("BlockStatement", M)
      };
    });
    def_to_moz(AST_Function, function To_Moz_FunctionExpression(M, parent) {
      var is_generator = parent.is_generator !== void 0 ? parent.is_generator : M.is_generator;
      return {
        type: "FunctionExpression",
        id: to_moz(M.name),
        params: M.argnames.map(to_moz),
        generator: is_generator,
        async: M.async,
        body: to_moz_scope("BlockStatement", M)
      };
    });
    def_to_moz(AST_Arrow, function To_Moz_ArrowFunctionExpression(M) {
      var body = {
        type: "BlockStatement",
        body: M.body.map(to_moz)
      };
      return {
        type: "ArrowFunctionExpression",
        params: M.argnames.map(to_moz),
        async: M.async,
        body
      };
    });
    def_to_moz(AST_Destructuring, function To_Moz_ObjectPattern(M) {
      if (M.is_array) {
        return {
          type: "ArrayPattern",
          elements: M.names.map(to_moz)
        };
      }
      return {
        type: "ObjectPattern",
        properties: M.names.map(to_moz)
      };
    });
    def_to_moz(AST_Directive, function To_Moz_Directive(M) {
      return {
        type: "ExpressionStatement",
        expression: {
          type: "Literal",
          value: M.value,
          raw: M.print_to_string()
        },
        directive: M.value
      };
    });
    def_to_moz(AST_SimpleStatement, function To_Moz_ExpressionStatement(M) {
      return {
        type: "ExpressionStatement",
        expression: to_moz(M.body)
      };
    });
    def_to_moz(AST_SwitchBranch, function To_Moz_SwitchCase(M) {
      return {
        type: "SwitchCase",
        test: to_moz(M.expression),
        consequent: M.body.map(to_moz)
      };
    });
    def_to_moz(AST_Try, function To_Moz_TryStatement(M) {
      return {
        type: "TryStatement",
        block: to_moz_block(M.body),
        handler: to_moz(M.bcatch),
        guardedHandlers: [],
        finalizer: to_moz(M.bfinally)
      };
    });
    def_to_moz(AST_Catch, function To_Moz_CatchClause(M) {
      return {
        type: "CatchClause",
        param: to_moz(M.argname),
        guard: null,
        body: to_moz_block(M)
      };
    });
    def_to_moz(AST_Definitions, function To_Moz_VariableDeclaration(M) {
      return {
        type: "VariableDeclaration",
        kind: M instanceof AST_Const ? "const" : M instanceof AST_Let ? "let" : "var",
        declarations: M.definitions.map(to_moz)
      };
    });
    const assert_clause_to_moz = (assert_clause) => {
      const assertions = [];
      if (assert_clause) {
        for (const { key, value } of assert_clause.properties) {
          const key_moz = is_basic_identifier_string(key) ? { type: "Identifier", name: key } : { type: "Literal", value: key, raw: JSON.stringify(key) };
          assertions.push({
            type: "ImportAttribute",
            key: key_moz,
            value: to_moz(value)
          });
        }
      }
      return assertions;
    };
    def_to_moz(AST_Export, function To_Moz_ExportDeclaration(M) {
      if (M.exported_names) {
        var first_exported = M.exported_names[0];
        var first_exported_name = first_exported.name;
        if (first_exported_name.name === "*" && !first_exported_name.quote) {
          var foreign_name = first_exported.foreign_name;
          var exported = foreign_name.name === "*" && !foreign_name.quote ? null : to_moz(foreign_name);
          return {
            type: "ExportAllDeclaration",
            source: to_moz(M.module_name),
            exported,
            assertions: assert_clause_to_moz(M.assert_clause)
          };
        }
        return {
          type: "ExportNamedDeclaration",
          specifiers: M.exported_names.map(function(name_mapping) {
            return {
              type: "ExportSpecifier",
              exported: to_moz(name_mapping.foreign_name),
              local: to_moz(name_mapping.name)
            };
          }),
          declaration: to_moz(M.exported_definition),
          source: to_moz(M.module_name),
          assertions: assert_clause_to_moz(M.assert_clause)
        };
      }
      return {
        type: M.is_default ? "ExportDefaultDeclaration" : "ExportNamedDeclaration",
        declaration: to_moz(M.exported_value || M.exported_definition)
      };
    });
    def_to_moz(AST_Import, function To_Moz_ImportDeclaration(M) {
      var specifiers = [];
      if (M.imported_name) {
        specifiers.push({
          type: "ImportDefaultSpecifier",
          local: to_moz(M.imported_name)
        });
      }
      if (M.imported_names) {
        var first_imported_foreign_name = M.imported_names[0].foreign_name;
        if (first_imported_foreign_name.name === "*" && !first_imported_foreign_name.quote) {
          specifiers.push({
            type: "ImportNamespaceSpecifier",
            local: to_moz(M.imported_names[0].name)
          });
        } else {
          M.imported_names.forEach(function(name_mapping) {
            specifiers.push({
              type: "ImportSpecifier",
              local: to_moz(name_mapping.name),
              imported: to_moz(name_mapping.foreign_name)
            });
          });
        }
      }
      return {
        type: "ImportDeclaration",
        specifiers,
        source: to_moz(M.module_name),
        assertions: assert_clause_to_moz(M.assert_clause)
      };
    });
    def_to_moz(AST_ImportMeta, function To_Moz_MetaProperty() {
      return {
        type: "MetaProperty",
        meta: {
          type: "Identifier",
          name: "import"
        },
        property: {
          type: "Identifier",
          name: "meta"
        }
      };
    });
    def_to_moz(AST_Sequence, function To_Moz_SequenceExpression(M) {
      return {
        type: "SequenceExpression",
        expressions: M.expressions.map(to_moz)
      };
    });
    def_to_moz(AST_DotHash, function To_Moz_PrivateMemberExpression(M) {
      return {
        type: "MemberExpression",
        object: to_moz(M.expression),
        computed: false,
        property: {
          type: "PrivateIdentifier",
          name: M.property
        },
        optional: M.optional
      };
    });
    def_to_moz(AST_PropAccess, function To_Moz_MemberExpression(M) {
      var isComputed = M instanceof AST_Sub;
      return {
        type: "MemberExpression",
        object: to_moz(M.expression),
        computed: isComputed,
        property: isComputed ? to_moz(M.property) : { type: "Identifier", name: M.property },
        optional: M.optional
      };
    });
    def_to_moz(AST_Chain, function To_Moz_ChainExpression(M) {
      return {
        type: "ChainExpression",
        expression: to_moz(M.expression)
      };
    });
    def_to_moz(AST_Unary, function To_Moz_Unary(M) {
      return {
        type: M.operator == "++" || M.operator == "--" ? "UpdateExpression" : "UnaryExpression",
        operator: M.operator,
        prefix: M instanceof AST_UnaryPrefix,
        argument: to_moz(M.expression)
      };
    });
    def_to_moz(AST_Binary, function To_Moz_BinaryExpression(M) {
      if (M.operator == "=" && to_moz_in_destructuring()) {
        return {
          type: "AssignmentPattern",
          left: to_moz(M.left),
          right: to_moz(M.right)
        };
      }
      const type = M.operator == "&&" || M.operator == "||" || M.operator === "??" ? "LogicalExpression" : "BinaryExpression";
      return {
        type,
        left: to_moz(M.left),
        operator: M.operator,
        right: to_moz(M.right)
      };
    });
    def_to_moz(AST_PrivateIn, function To_Moz_BinaryExpression_PrivateIn(M) {
      return {
        type: "BinaryExpression",
        left: { type: "PrivateIdentifier", name: M.key.name },
        operator: "in",
        right: to_moz(M.value)
      };
    });
    def_to_moz(AST_Array, function To_Moz_ArrayExpression(M) {
      return {
        type: "ArrayExpression",
        elements: M.elements.map(to_moz)
      };
    });
    def_to_moz(AST_Object, function To_Moz_ObjectExpression(M) {
      return {
        type: "ObjectExpression",
        properties: M.properties.map(to_moz)
      };
    });
    def_to_moz(AST_ObjectProperty, function To_Moz_Property(M, parent) {
      var key = M.key instanceof AST_Node ? to_moz(M.key) : {
        type: "Identifier",
        value: M.key
      };
      if (typeof M.key === "number") {
        key = {
          type: "Literal",
          value: Number(M.key)
        };
      }
      if (typeof M.key === "string") {
        key = {
          type: "Identifier",
          name: M.key
        };
      }
      var kind;
      var string_or_num = typeof M.key === "string" || typeof M.key === "number";
      var computed = string_or_num ? false : !(M.key instanceof AST_Symbol) || M.key instanceof AST_SymbolRef;
      if (M instanceof AST_ObjectKeyVal) {
        kind = "init";
        computed = !string_or_num;
      } else if (M instanceof AST_ObjectGetter) {
        kind = "get";
      } else if (M instanceof AST_ObjectSetter) {
        kind = "set";
      }
      if (M instanceof AST_PrivateGetter || M instanceof AST_PrivateSetter) {
        const kind2 = M instanceof AST_PrivateGetter ? "get" : "set";
        return {
          type: "MethodDefinition",
          computed: false,
          kind: kind2,
          static: M.static,
          key: {
            type: "PrivateIdentifier",
            name: M.key.name
          },
          value: to_moz(M.value)
        };
      }
      if (M instanceof AST_ClassPrivateProperty) {
        return {
          type: "PropertyDefinition",
          key: {
            type: "PrivateIdentifier",
            name: M.key.name
          },
          value: to_moz(M.value),
          computed: false,
          static: M.static
        };
      }
      if (M instanceof AST_ClassProperty) {
        return {
          type: "PropertyDefinition",
          key,
          value: to_moz(M.value),
          computed,
          static: M.static
        };
      }
      if (parent instanceof AST_Class) {
        return {
          type: "MethodDefinition",
          computed,
          kind,
          static: M.static,
          key: to_moz(M.key),
          value: to_moz(M.value)
        };
      }
      return {
        type: "Property",
        computed,
        kind,
        key,
        value: to_moz(M.value)
      };
    });
    def_to_moz(AST_ConciseMethod, function To_Moz_MethodDefinition(M, parent) {
      if (parent instanceof AST_Object) {
        return {
          type: "Property",
          computed: !(M.key instanceof AST_Symbol) || M.key instanceof AST_SymbolRef,
          kind: "init",
          method: true,
          shorthand: false,
          key: to_moz(M.key),
          value: to_moz(M.value)
        };
      }
      const key = M instanceof AST_PrivateMethod ? {
        type: "PrivateIdentifier",
        name: M.key.name
      } : to_moz(M.key);
      return {
        type: "MethodDefinition",
        kind: M.key === "constructor" ? "constructor" : "method",
        key,
        value: to_moz(M.value),
        computed: !(M.key instanceof AST_Symbol) || M.key instanceof AST_SymbolRef,
        static: M.static
      };
    });
    def_to_moz(AST_Class, function To_Moz_Class(M) {
      var type = M instanceof AST_ClassExpression ? "ClassExpression" : "ClassDeclaration";
      return {
        type,
        superClass: to_moz(M.extends),
        id: M.name ? to_moz(M.name) : null,
        body: {
          type: "ClassBody",
          body: M.properties.map(to_moz)
        }
      };
    });
    def_to_moz(AST_ClassStaticBlock, function To_Moz_StaticBlock(M) {
      return {
        type: "StaticBlock",
        body: M.body.map(to_moz)
      };
    });
    def_to_moz(AST_NewTarget, function To_Moz_MetaProperty() {
      return {
        type: "MetaProperty",
        meta: {
          type: "Identifier",
          name: "new"
        },
        property: {
          type: "Identifier",
          name: "target"
        }
      };
    });
    def_to_moz(AST_Symbol, function To_Moz_Identifier(M, parent) {
      if (M instanceof AST_SymbolMethod && parent.quote || (M instanceof AST_SymbolImportForeign || M instanceof AST_SymbolExportForeign || M instanceof AST_SymbolExport) && M.quote) {
        return {
          type: "Literal",
          value: M.name
        };
      }
      var def = M.definition();
      return {
        type: "Identifier",
        name: def ? def.mangled_name || def.name : M.name
      };
    });
    def_to_moz(AST_RegExp, function To_Moz_RegExpLiteral(M) {
      const pattern = M.value.source;
      const flags = M.value.flags;
      return {
        type: "Literal",
        value: null,
        raw: M.print_to_string(),
        regex: { pattern, flags }
      };
    });
    def_to_moz(AST_Constant, function To_Moz_Literal(M) {
      var value = M.value;
      return {
        type: "Literal",
        value,
        raw: M.raw || M.print_to_string()
      };
    });
    def_to_moz(AST_Atom, function To_Moz_Atom(M) {
      return {
        type: "Identifier",
        name: String(M.value)
      };
    });
    def_to_moz(AST_BigInt, (M) => ({
      type: "Literal",
      // value cannot be represented natively
      // see: https://github.com/estree/estree/blob/master/es2020.md#bigintliteral
      value: null,
      // `M.value` is a string that may be a hex number representation.
      // but "bigint" property should have only decimal digits
      bigint: typeof BigInt === "function" ? BigInt(M.value).toString() : M.value
    }));
    AST_Boolean.DEFMETHOD("to_mozilla_ast", AST_Constant.prototype.to_mozilla_ast);
    AST_Null.DEFMETHOD("to_mozilla_ast", AST_Constant.prototype.to_mozilla_ast);
    AST_Hole.DEFMETHOD("to_mozilla_ast", function To_Moz_ArrayHole() {
      return null;
    });
    AST_Block.DEFMETHOD("to_mozilla_ast", AST_BlockStatement.prototype.to_mozilla_ast);
    AST_Lambda.DEFMETHOD("to_mozilla_ast", AST_Function.prototype.to_mozilla_ast);
    function my_start_token(moznode) {
      var loc = moznode.loc, start = loc && loc.start;
      var range = moznode.range;
      return new AST_Token(
        "",
        "",
        start && start.line || 0,
        start && start.column || 0,
        range ? range[0] : moznode.start,
        false,
        [],
        [],
        loc && loc.source
      );
    }
    function my_end_token(moznode) {
      var loc = moznode.loc, end = loc && loc.end;
      var range = moznode.range;
      return new AST_Token(
        "",
        "",
        end && end.line || 0,
        end && end.column || 0,
        range ? range[0] : moznode.end,
        false,
        [],
        [],
        loc && loc.source
      );
    }
    var FROM_MOZ_STACK = null;
    function from_moz(node) {
      FROM_MOZ_STACK.push(node);
      var ret = node != null ? MOZ_TO_ME[node.type](node) : null;
      FROM_MOZ_STACK.pop();
      return ret;
    }
    AST_Node.from_mozilla_ast = function(node) {
      var save_stack = FROM_MOZ_STACK;
      FROM_MOZ_STACK = [];
      var ast = from_moz(node);
      FROM_MOZ_STACK = save_stack;
      return ast;
    };
    function set_moz_loc(mynode, moznode) {
      var start = mynode.start;
      var end = mynode.end;
      if (!(start && end)) {
        return moznode;
      }
      if (start.pos != null && end.endpos != null) {
        moznode.range = [start.pos, end.endpos];
      }
      if (start.line) {
        moznode.loc = {
          start: { line: start.line, column: start.col },
          end: end.endline ? { line: end.endline, column: end.endcol } : null
        };
        if (start.file) {
          moznode.loc.source = start.file;
        }
      }
      return moznode;
    }
    function def_to_moz(mytype, handler) {
      mytype.DEFMETHOD("to_mozilla_ast", function(parent) {
        return set_moz_loc(this, handler(this, parent));
      });
    }
    var TO_MOZ_STACK = null;
    function to_moz(node) {
      if (TO_MOZ_STACK === null) {
        TO_MOZ_STACK = [];
      }
      TO_MOZ_STACK.push(node);
      var ast = node != null ? node.to_mozilla_ast(TO_MOZ_STACK[TO_MOZ_STACK.length - 2]) : null;
      TO_MOZ_STACK.pop();
      if (TO_MOZ_STACK.length === 0) {
        TO_MOZ_STACK = null;
      }
      return ast;
    }
    function to_moz_in_destructuring() {
      var i = TO_MOZ_STACK.length;
      while (i--) {
        if (TO_MOZ_STACK[i] instanceof AST_Destructuring) {
          return true;
        }
      }
      return false;
    }
    function to_moz_block(node) {
      return {
        type: "BlockStatement",
        body: node.body.map(to_moz)
      };
    }
    function to_moz_scope(type, node) {
      var body = node.body.map(to_moz);
      if (node.body[0] instanceof AST_SimpleStatement && node.body[0].body instanceof AST_String) {
        body.unshift(to_moz(new AST_EmptyStatement(node.body[0])));
      }
      return {
        type,
        body
      };
    }
  })();

  // node_modules/terser/lib/utils/first_in_statement.js
  function first_in_statement(stack) {
    let node = stack.parent(-1);
    for (let i = 0, p; p = stack.parent(i); i++) {
      if (p instanceof AST_Statement && p.body === node)
        return true;
      if (p instanceof AST_Sequence && p.expressions[0] === node || p.TYPE === "Call" && p.expression === node || p instanceof AST_PrefixedTemplateString && p.prefix === node || p instanceof AST_Dot && p.expression === node || p instanceof AST_Sub && p.expression === node || p instanceof AST_Chain && p.expression === node || p instanceof AST_Conditional && p.condition === node || p instanceof AST_Binary && p.left === node || p instanceof AST_UnaryPostfix && p.expression === node) {
        node = p;
      } else {
        return false;
      }
    }
  }
  function left_is_object(node) {
    if (node instanceof AST_Object) return true;
    if (node instanceof AST_Sequence) return left_is_object(node.expressions[0]);
    if (node.TYPE === "Call") return left_is_object(node.expression);
    if (node instanceof AST_PrefixedTemplateString) return left_is_object(node.prefix);
    if (node instanceof AST_Dot || node instanceof AST_Sub) return left_is_object(node.expression);
    if (node instanceof AST_Chain) return left_is_object(node.expression);
    if (node instanceof AST_Conditional) return left_is_object(node.condition);
    if (node instanceof AST_Binary) return left_is_object(node.left);
    if (node instanceof AST_UnaryPostfix) return left_is_object(node.expression);
    return false;
  }

  // node_modules/terser/lib/output.js
  var CODE_LINE_BREAK = 10;
  var CODE_SPACE = 32;
  var r_annotation = /[@#]__(PURE|INLINE|NOINLINE)__/;
  function is_some_comments(comment) {
    return (comment.type === "comment2" || comment.type === "comment1") && /@preserve|@copyright|@lic|@cc_on|^\**!/i.test(comment.value);
  }
  var ROPE_COMMIT_WHEN = 8 * 1e3;
  var Rope = class {
    constructor() {
      this.committed = "";
      this.current = "";
    }
    append(str) {
      if (this.current.length > ROPE_COMMIT_WHEN) {
        this.committed += this.current + str;
        this.current = "";
      } else {
        this.current += str;
      }
    }
    insertAt(char, index) {
      const { committed, current } = this;
      if (index < committed.length) {
        this.committed = committed.slice(0, index) + char + committed.slice(index);
      } else if (index === committed.length) {
        this.committed += char;
      } else {
        index -= committed.length;
        this.committed += current.slice(0, index) + char;
        this.current = current.slice(index);
      }
    }
    charAt(index) {
      const { committed } = this;
      if (index < committed.length) return committed[index];
      return this.current[index - committed.length];
    }
    charCodeAt(index) {
      const { committed } = this;
      if (index < committed.length) return committed.charCodeAt(index);
      return this.current.charCodeAt(index - committed.length);
    }
    length() {
      return this.committed.length + this.current.length;
    }
    expectDirective() {
      let ch, n = this.length();
      if (n <= 0) return true;
      while ((ch = this.charCodeAt(--n)) && (ch == CODE_SPACE || ch == CODE_LINE_BREAK)) ;
      return !ch || ch === 59 || ch === 123;
    }
    hasNLB() {
      let n = this.length() - 1;
      while (n >= 0) {
        const code = this.charCodeAt(n--);
        if (code === CODE_LINE_BREAK) return true;
        if (code !== CODE_SPACE) return false;
      }
      return true;
    }
    toString() {
      return this.committed + this.current;
    }
  };
  function OutputStream(options) {
    var readonly = !options;
    options = defaults(options, {
      ascii_only: false,
      beautify: false,
      braces: false,
      comments: "some",
      ecma: 5,
      ie8: false,
      indent_level: 4,
      indent_start: 0,
      inline_script: true,
      keep_numbers: false,
      keep_quoted_props: false,
      max_line_len: false,
      preamble: null,
      preserve_annotations: false,
      quote_keys: false,
      quote_style: 0,
      safari10: false,
      semicolons: true,
      shebang: true,
      shorthand: void 0,
      source_map: null,
      webkit: false,
      width: 80,
      wrap_iife: false,
      wrap_func_args: true,
      _destroy_ast: false
    }, true);
    if (options.shorthand === void 0)
      options.shorthand = options.ecma > 5;
    var comment_filter = return_false;
    if (options.comments) {
      let comments = options.comments;
      if (typeof options.comments === "string" && /^\/.*\/[a-zA-Z]*$/.test(options.comments)) {
        var regex_pos = options.comments.lastIndexOf("/");
        comments = new RegExp(
          options.comments.substr(1, regex_pos - 1),
          options.comments.substr(regex_pos + 1)
        );
      }
      if (comments instanceof RegExp) {
        comment_filter = function(comment) {
          return comment.type != "comment5" && comments.test(comment.value);
        };
      } else if (typeof comments === "function") {
        comment_filter = function(comment) {
          return comment.type != "comment5" && comments(this, comment);
        };
      } else if (comments === "some") {
        comment_filter = is_some_comments;
      } else {
        comment_filter = return_true;
      }
    }
    if (options.preserve_annotations) {
      let prev_comment_filter = comment_filter;
      comment_filter = function(comment) {
        return r_annotation.test(comment.value) || prev_comment_filter.apply(this, arguments);
      };
    }
    var indentation = 0;
    var current_col = 0;
    var current_line = 1;
    var current_pos = 0;
    var OUTPUT = new Rope();
    let printed_comments = /* @__PURE__ */ new Set();
    var to_utf8 = options.ascii_only ? function(str, identifier = false, regexp = false) {
      if (options.ecma >= 2015 && !options.safari10 && !regexp) {
        str = str.replace(/[\ud800-\udbff][\udc00-\udfff]/g, function(ch) {
          var code = get_full_char_code(ch, 0).toString(16);
          return "\\u{" + code + "}";
        });
      }
      return str.replace(/[\u0000-\u001f\u007f-\uffff]/g, function(ch) {
        var code = ch.charCodeAt(0).toString(16);
        if (code.length <= 2 && !identifier) {
          while (code.length < 2) code = "0" + code;
          return "\\x" + code;
        } else {
          while (code.length < 4) code = "0" + code;
          return "\\u" + code;
        }
      });
    } : function(str) {
      return str.replace(/[\ud800-\udbff][\udc00-\udfff]|([\ud800-\udbff]|[\udc00-\udfff])/g, function(match, lone) {
        if (lone) {
          return "\\u" + lone.charCodeAt(0).toString(16);
        }
        return match;
      });
    };
    function make_string(str, quote) {
      var dq = 0, sq = 0;
      str = str.replace(
        /[\\\b\f\n\r\v\t\x22\x27\u2028\u2029\0\ufeff]/g,
        function(s, i) {
          switch (s) {
            case '"':
              ++dq;
              return '"';
            case "'":
              ++sq;
              return "'";
            case "\\":
              return "\\\\";
            case "\n":
              return "\\n";
            case "\r":
              return "\\r";
            case "	":
              return "\\t";
            case "\b":
              return "\\b";
            case "\f":
              return "\\f";
            case "\v":
              return options.ie8 ? "\\x0B" : "\\v";
            case "\u2028":
              return "\\u2028";
            case "\u2029":
              return "\\u2029";
            case "\uFEFF":
              return "\\ufeff";
            case "\0":
              return /[0-9]/.test(get_full_char(str, i + 1)) ? "\\x00" : "\\0";
          }
          return s;
        }
      );
      function quote_single() {
        return "'" + str.replace(/\x27/g, "\\'") + "'";
      }
      function quote_double() {
        return '"' + str.replace(/\x22/g, '\\"') + '"';
      }
      function quote_template() {
        return "`" + str.replace(/`/g, "\\`") + "`";
      }
      str = to_utf8(str);
      if (quote === "`") return quote_template();
      switch (options.quote_style) {
        case 1:
          return quote_single();
        case 2:
          return quote_double();
        case 3:
          return quote == "'" ? quote_single() : quote_double();
        default:
          return dq > sq ? quote_single() : quote_double();
      }
    }
    function encode_string(str, quote) {
      var ret = make_string(str, quote);
      if (options.inline_script) {
        ret = ret.replace(/<\x2f(script)([>\/\t\n\f\r ])/gi, "<\\/$1$2");
        ret = ret.replace(/\x3c!--/g, "\\x3c!--");
        ret = ret.replace(/--\x3e/g, "--\\x3e");
      }
      return ret;
    }
    function make_name(name) {
      name = name.toString();
      name = to_utf8(name, true);
      return name;
    }
    function make_indent(back) {
      return " ".repeat(options.indent_start + indentation - back * options.indent_level);
    }
    var has_parens = false;
    var might_need_space = false;
    var might_need_semicolon = false;
    var might_add_newline = 0;
    var need_newline_indented = false;
    var need_space = false;
    var newline_insert = -1;
    var last = "";
    var mapping_token, mapping_name, mappings = options.source_map && [];
    var do_add_mapping = mappings ? function() {
      mappings.forEach(function(mapping) {
        try {
          let { name, token } = mapping;
          if (name !== false) {
            if (token.type == "name" || token.type === "privatename") {
              name = token.value;
            } else if (name instanceof AST_Symbol) {
              name = token.type === "string" ? token.value : name.name;
            }
          }
          options.source_map.add(
            mapping.token.file,
            mapping.line,
            mapping.col,
            mapping.token.line,
            mapping.token.col,
            is_basic_identifier_string(name) ? name : void 0
          );
        } catch (ex) {
        }
      });
      mappings = [];
    } : noop;
    var ensure_line_len = options.max_line_len ? function() {
      if (current_col > options.max_line_len) {
        if (might_add_newline) {
          OUTPUT.insertAt("\n", might_add_newline);
          const len_after_newline = OUTPUT.length() - might_add_newline - 1;
          if (mappings) {
            var delta = len_after_newline - current_col;
            mappings.forEach(function(mapping) {
              mapping.line++;
              mapping.col += delta;
            });
          }
          current_line++;
          current_pos++;
          current_col = len_after_newline;
        }
      }
      if (might_add_newline) {
        might_add_newline = 0;
        do_add_mapping();
      }
    } : noop;
    var requireSemicolonChars = makePredicate("( [ + * / - , . `");
    function print(str) {
      str = String(str);
      var ch = get_full_char(str, 0);
      if (need_newline_indented && ch) {
        need_newline_indented = false;
        if (ch !== "\n") {
          print("\n");
          indent();
        }
      }
      if (need_space && ch) {
        need_space = false;
        if (!/[\s;})]/.test(ch)) {
          space();
        }
      }
      newline_insert = -1;
      var prev = last.charAt(last.length - 1);
      if (might_need_semicolon) {
        might_need_semicolon = false;
        if (prev === ":" && ch === "}" || (!ch || !";}".includes(ch)) && prev !== ";") {
          if (options.semicolons || requireSemicolonChars.has(ch)) {
            OUTPUT.append(";");
            current_col++;
            current_pos++;
          } else {
            ensure_line_len();
            if (current_col > 0) {
              OUTPUT.append("\n");
              current_pos++;
              current_line++;
              current_col = 0;
            }
            if (/^\s+$/.test(str)) {
              might_need_semicolon = true;
            }
          }
          if (!options.beautify)
            might_need_space = false;
        }
      }
      if (might_need_space) {
        if (is_identifier_char(prev) && (is_identifier_char(ch) || ch == "\\") || ch == "/" && ch == prev || (ch == "+" || ch == "-") && ch == last) {
          OUTPUT.append(" ");
          current_col++;
          current_pos++;
        }
        might_need_space = false;
      }
      if (mapping_token) {
        mappings.push({
          token: mapping_token,
          name: mapping_name,
          line: current_line,
          col: current_col
        });
        mapping_token = false;
        if (!might_add_newline) do_add_mapping();
      }
      OUTPUT.append(str);
      has_parens = str[str.length - 1] == "(";
      current_pos += str.length;
      var a = str.split(/\r?\n/), n = a.length - 1;
      current_line += n;
      current_col += a[0].length;
      if (n > 0) {
        ensure_line_len();
        current_col = a[n].length;
      }
      last = str;
    }
    var star = function() {
      print("*");
    };
    var space = options.beautify ? function() {
      print(" ");
    } : function() {
      might_need_space = true;
    };
    var indent = options.beautify ? function(half) {
      if (options.beautify) {
        print(make_indent(half ? 0.5 : 0));
      }
    } : noop;
    var with_indent = options.beautify ? function(col, cont) {
      if (col === true) col = next_indent();
      var save_indentation = indentation;
      indentation = col;
      var ret = cont();
      indentation = save_indentation;
      return ret;
    } : function(col, cont) {
      return cont();
    };
    var newline = options.beautify ? function() {
      if (newline_insert < 0) return print("\n");
      if (OUTPUT.charAt(newline_insert) != "\n") {
        OUTPUT.insertAt("\n", newline_insert);
        current_pos++;
        current_line++;
      }
      newline_insert++;
    } : options.max_line_len ? function() {
      ensure_line_len();
      might_add_newline = OUTPUT.length();
    } : noop;
    var semicolon = options.beautify ? function() {
      print(";");
    } : function() {
      might_need_semicolon = true;
    };
    function force_semicolon() {
      might_need_semicolon = false;
      print(";");
    }
    function next_indent() {
      return indentation + options.indent_level;
    }
    function with_block(cont) {
      var ret;
      print("{");
      newline();
      with_indent(next_indent(), function() {
        ret = cont();
      });
      indent();
      print("}");
      return ret;
    }
    function with_parens(cont) {
      print("(");
      var ret = cont();
      print(")");
      return ret;
    }
    function with_square(cont) {
      print("[");
      var ret = cont();
      print("]");
      return ret;
    }
    function comma() {
      print(",");
      space();
    }
    function colon() {
      print(":");
      space();
    }
    var add_mapping = mappings ? function(token, name) {
      mapping_token = token;
      mapping_name = name;
    } : noop;
    function get() {
      if (might_add_newline) {
        ensure_line_len();
      }
      return OUTPUT.toString();
    }
    function filter_comment(comment) {
      if (!options.preserve_annotations) {
        comment = comment.replace(r_annotation, " ");
      }
      if (/^\s*$/.test(comment)) {
        return "";
      }
      return comment.replace(/(<\s*\/\s*)(script)/i, "<\\/$2");
    }
    function prepend_comments(node) {
      var self2 = this;
      var start = node.start;
      if (!start) return;
      var printed_comments2 = self2.printed_comments;
      const keyword_with_value = node instanceof AST_Exit && node.value || (node instanceof AST_Await || node instanceof AST_Yield) && node.expression;
      if (start.comments_before && printed_comments2.has(start.comments_before)) {
        if (keyword_with_value) {
          start.comments_before = [];
        } else {
          return;
        }
      }
      var comments = start.comments_before;
      if (!comments) {
        comments = start.comments_before = [];
      }
      printed_comments2.add(comments);
      if (keyword_with_value) {
        var tw = new TreeWalker(function(node2) {
          var parent = tw.parent();
          if (parent instanceof AST_Exit || parent instanceof AST_Await || parent instanceof AST_Yield || parent instanceof AST_Binary && parent.left === node2 || parent.TYPE == "Call" && parent.expression === node2 || parent instanceof AST_Conditional && parent.condition === node2 || parent instanceof AST_Dot && parent.expression === node2 || parent instanceof AST_Sequence && parent.expressions[0] === node2 || parent instanceof AST_Sub && parent.expression === node2 || parent instanceof AST_UnaryPostfix) {
            if (!node2.start) return;
            var text = node2.start.comments_before;
            if (text && !printed_comments2.has(text)) {
              printed_comments2.add(text);
              comments = comments.concat(text);
            }
          } else {
            return true;
          }
        });
        tw.push(node);
        keyword_with_value.walk(tw);
      }
      if (current_pos == 0) {
        if (comments.length > 0 && options.shebang && comments[0].type === "comment5" && !printed_comments2.has(comments[0])) {
          print("#!" + comments.shift().value + "\n");
          indent();
        }
        var preamble = options.preamble;
        if (preamble) {
          print(preamble.replace(/\r\n?|[\n\u2028\u2029]|\s*$/g, "\n"));
        }
      }
      comments = comments.filter(comment_filter, node).filter((c) => !printed_comments2.has(c));
      if (comments.length == 0) return;
      var last_nlb = OUTPUT.hasNLB();
      comments.forEach(function(c, i) {
        printed_comments2.add(c);
        if (!last_nlb) {
          if (c.nlb) {
            print("\n");
            indent();
            last_nlb = true;
          } else if (i > 0) {
            space();
          }
        }
        if (/comment[134]/.test(c.type)) {
          var value = filter_comment(c.value);
          if (value) {
            print("//" + value + "\n");
            indent();
          }
          last_nlb = true;
        } else if (c.type == "comment2") {
          var value = filter_comment(c.value);
          if (value) {
            print("/*" + value + "*/");
          }
          last_nlb = false;
        }
      });
      if (!last_nlb) {
        if (start.nlb) {
          print("\n");
          indent();
        } else {
          space();
        }
      }
    }
    function append_comments(node, tail) {
      var self2 = this;
      var token = node.end;
      if (!token) return;
      var printed_comments2 = self2.printed_comments;
      var comments = token[tail ? "comments_before" : "comments_after"];
      if (!comments || printed_comments2.has(comments)) return;
      if (!(node instanceof AST_Statement || comments.every(
        (c) => !/comment[134]/.test(c.type)
      ))) return;
      printed_comments2.add(comments);
      var insert = OUTPUT.length();
      comments.filter(comment_filter, node).forEach(function(c, i) {
        if (printed_comments2.has(c)) return;
        printed_comments2.add(c);
        need_space = false;
        if (need_newline_indented) {
          print("\n");
          indent();
          need_newline_indented = false;
        } else if (c.nlb && (i > 0 || !OUTPUT.hasNLB())) {
          print("\n");
          indent();
        } else if (i > 0 || !tail) {
          space();
        }
        if (/comment[134]/.test(c.type)) {
          const value = filter_comment(c.value);
          if (value) {
            print("//" + value);
          }
          need_newline_indented = true;
        } else if (c.type == "comment2") {
          const value = filter_comment(c.value);
          if (value) {
            print("/*" + value + "*/");
          }
          need_space = true;
        }
      });
      if (OUTPUT.length() > insert) newline_insert = insert;
    }
    const gc_scope = options["_destroy_ast"] ? function gc_scope2(scope) {
      scope.body.length = 0;
      scope.argnames.length = 0;
    } : noop;
    var stack = [];
    return {
      get,
      toString: get,
      indent,
      in_directive: false,
      use_asm: null,
      active_scope: null,
      indentation: function() {
        return indentation;
      },
      current_width: function() {
        return current_col - indentation;
      },
      should_break: function() {
        return options.width && this.current_width() >= options.width;
      },
      has_parens: function() {
        return has_parens;
      },
      newline,
      print,
      star,
      space,
      comma,
      colon,
      last: function() {
        return last;
      },
      semicolon,
      force_semicolon,
      to_utf8,
      print_name: function(name) {
        print(make_name(name));
      },
      print_string: function(str, quote, escape_directive) {
        var encoded = encode_string(str, quote);
        if (escape_directive === true && !encoded.includes("\\")) {
          if (!OUTPUT.expectDirective()) {
            force_semicolon();
          }
          force_semicolon();
        }
        print(encoded);
      },
      print_template_string_chars: function(str) {
        var encoded = encode_string(str, "`").replace(/\${/g, "\\${");
        return print(encoded.substr(1, encoded.length - 2));
      },
      encode_string,
      next_indent,
      with_indent,
      with_block,
      with_parens,
      with_square,
      add_mapping,
      option: function(opt) {
        return options[opt];
      },
      gc_scope,
      printed_comments,
      prepend_comments: readonly ? noop : prepend_comments,
      append_comments: readonly || comment_filter === return_false ? noop : append_comments,
      line: function() {
        return current_line;
      },
      col: function() {
        return current_col;
      },
      pos: function() {
        return current_pos;
      },
      push_node: function(node) {
        stack.push(node);
      },
      pop_node: function() {
        return stack.pop();
      },
      parent: function(n) {
        return stack[stack.length - 2 - (n || 0)];
      }
    };
  }
  (function() {
    function DEFPRINT(nodetype, generator) {
      nodetype.DEFMETHOD("_codegen", generator);
    }
    AST_Node.DEFMETHOD("print", function(output, force_parens) {
      var self2 = this, generator = self2._codegen;
      if (self2 instanceof AST_Scope) {
        output.active_scope = self2;
      } else if (!output.use_asm && self2 instanceof AST_Directive && self2.value == "use asm") {
        output.use_asm = output.active_scope;
      }
      function doit() {
        output.prepend_comments(self2);
        self2.add_source_map(output);
        generator(self2, output);
        output.append_comments(self2);
      }
      output.push_node(self2);
      if (force_parens || self2.needs_parens(output)) {
        output.with_parens(doit);
      } else {
        doit();
      }
      output.pop_node();
      if (self2 === output.use_asm) {
        output.use_asm = null;
      }
    });
    AST_Node.DEFMETHOD("_print", AST_Node.prototype.print);
    AST_Node.DEFMETHOD("print_to_string", function(options) {
      var output = OutputStream(options);
      this.print(output);
      return output.get();
    });
    function PARENS(nodetype, func) {
      if (Array.isArray(nodetype)) {
        nodetype.forEach(function(nodetype2) {
          PARENS(nodetype2, func);
        });
      } else {
        nodetype.DEFMETHOD("needs_parens", func);
      }
    }
    PARENS(AST_Node, return_false);
    PARENS(AST_Function, function(output) {
      if (!output.has_parens() && first_in_statement(output)) {
        return true;
      }
      if (output.option("webkit")) {
        var p = output.parent();
        if (p instanceof AST_PropAccess && p.expression === this) {
          return true;
        }
      }
      if (output.option("wrap_iife")) {
        var p = output.parent();
        if (p instanceof AST_Call && p.expression === this) {
          return true;
        }
      }
      if (output.option("wrap_func_args")) {
        var p = output.parent();
        if (p instanceof AST_Call && p.args.includes(this)) {
          return true;
        }
      }
      return false;
    });
    PARENS(AST_Arrow, function(output) {
      var p = output.parent();
      if (output.option("wrap_func_args") && p instanceof AST_Call && p.args.includes(this)) {
        return true;
      }
      return p instanceof AST_PropAccess && p.expression === this || p instanceof AST_Conditional && p.condition === this;
    });
    PARENS(AST_Object, function(output) {
      return !output.has_parens() && first_in_statement(output);
    });
    PARENS(AST_ClassExpression, first_in_statement);
    PARENS(AST_Unary, function(output) {
      var p = output.parent();
      return p instanceof AST_PropAccess && p.expression === this || p instanceof AST_Call && p.expression === this || p instanceof AST_Binary && p.operator === "**" && this instanceof AST_UnaryPrefix && p.left === this && this.operator !== "++" && this.operator !== "--";
    });
    PARENS(AST_Await, function(output) {
      var p = output.parent();
      return p instanceof AST_PropAccess && p.expression === this || p instanceof AST_Call && p.expression === this || p instanceof AST_Binary && p.operator === "**" && p.left === this || output.option("safari10") && p instanceof AST_UnaryPrefix;
    });
    PARENS(AST_Sequence, function(output) {
      var p = output.parent();
      return p instanceof AST_Call || p instanceof AST_Unary || p instanceof AST_Binary || p instanceof AST_VarDef || p instanceof AST_PropAccess || p instanceof AST_Array || p instanceof AST_ObjectProperty || p instanceof AST_Conditional || p instanceof AST_Arrow || p instanceof AST_DefaultAssign || p instanceof AST_Expansion || p instanceof AST_ForOf && this === p.object || p instanceof AST_Yield || p instanceof AST_Export;
    });
    PARENS(AST_Binary, function(output) {
      var p = output.parent();
      if (p instanceof AST_Call && p.expression === this)
        return true;
      if (p instanceof AST_Unary)
        return true;
      if (p instanceof AST_PropAccess && p.expression === this)
        return true;
      if (p instanceof AST_Binary) {
        const parent_op = p.operator;
        const op = this.operator;
        if (op === "??" && (parent_op === "||" || parent_op === "&&")) {
          return true;
        }
        if (parent_op === "??" && (op === "||" || op === "&&")) {
          return true;
        }
        const pp = PRECEDENCE[parent_op];
        const sp = PRECEDENCE[op];
        if (pp > sp || pp == sp && (this === p.right || parent_op == "**")) {
          return true;
        }
      }
      if (p instanceof AST_PrivateIn) {
        const op = this.operator;
        const pp = PRECEDENCE["in"];
        const sp = PRECEDENCE[op];
        if (pp > sp || pp == sp && this === p.value) {
          return true;
        }
      }
    });
    PARENS(AST_PrivateIn, function(output) {
      var p = output.parent();
      if (p instanceof AST_Call && p.expression === this) {
        return true;
      }
      if (p instanceof AST_Unary) {
        return true;
      }
      if (p instanceof AST_PropAccess && p.expression === this) {
        return true;
      }
      if (p instanceof AST_Binary) {
        const parent_op = p.operator;
        const pp = PRECEDENCE[parent_op];
        const sp = PRECEDENCE["in"];
        if (pp > sp || pp == sp && (this === p.right || parent_op == "**")) {
          return true;
        }
      }
      if (p instanceof AST_PrivateIn && this === p.value) {
        return true;
      }
    });
    PARENS(AST_Yield, function(output) {
      var p = output.parent();
      if (p instanceof AST_Binary && p.operator !== "=")
        return true;
      if (p instanceof AST_Call && p.expression === this)
        return true;
      if (p instanceof AST_Conditional && p.condition === this)
        return true;
      if (p instanceof AST_Unary)
        return true;
      if (p instanceof AST_PropAccess && p.expression === this)
        return true;
    });
    PARENS(AST_Chain, function(output) {
      var p = output.parent();
      if (!(p instanceof AST_Call || p instanceof AST_PropAccess)) return false;
      return p.expression === this;
    });
    PARENS(AST_PropAccess, function(output) {
      var p = output.parent();
      if (p instanceof AST_New && p.expression === this) {
        return walk(this, (node) => {
          if (node instanceof AST_Scope) return true;
          if (node instanceof AST_Call) {
            return walk_abort;
          }
        });
      }
    });
    PARENS(AST_Call, function(output) {
      var p = output.parent(), p1;
      if (p instanceof AST_New && p.expression === this || p instanceof AST_Export && p.is_default && this.expression instanceof AST_Function)
        return true;
      return this.expression instanceof AST_Function && p instanceof AST_PropAccess && p.expression === this && (p1 = output.parent(1)) instanceof AST_Assign && p1.left === p;
    });
    PARENS(AST_New, function(output) {
      var p = output.parent();
      if (this.args.length === 0 && (p instanceof AST_PropAccess || p instanceof AST_Call && p.expression === this || p instanceof AST_PrefixedTemplateString && p.prefix === this))
        return true;
    });
    PARENS(AST_Number, function(output) {
      var p = output.parent();
      if (p instanceof AST_PropAccess && p.expression === this) {
        var value = this.getValue();
        if (value < 0 || /^0/.test(make_num(value))) {
          return true;
        }
      }
    });
    PARENS(AST_BigInt, function(output) {
      var p = output.parent();
      if (p instanceof AST_PropAccess && p.expression === this) {
        var value = this.getValue();
        if (value.startsWith("-")) {
          return true;
        }
      }
    });
    PARENS([AST_Assign, AST_Conditional], function(output) {
      var p = output.parent();
      if (p instanceof AST_Unary)
        return true;
      if (p instanceof AST_Binary && !(p instanceof AST_Assign))
        return true;
      if (p instanceof AST_Call && p.expression === this)
        return true;
      if (p instanceof AST_Conditional && p.condition === this)
        return true;
      if (p instanceof AST_PropAccess && p.expression === this)
        return true;
      if (this instanceof AST_Assign && this.left instanceof AST_Destructuring && this.left.is_array === false)
        return true;
    });
    DEFPRINT(AST_Directive, function(self2, output) {
      output.print_string(self2.value, self2.quote);
      output.semicolon();
    });
    DEFPRINT(AST_Expansion, function(self2, output) {
      output.print("...");
      self2.expression.print(output);
    });
    DEFPRINT(AST_Destructuring, function(self2, output) {
      output.print(self2.is_array ? "[" : "{");
      var len = self2.names.length;
      self2.names.forEach(function(name, i) {
        if (i > 0) output.comma();
        name.print(output);
        if (i == len - 1 && name instanceof AST_Hole) output.comma();
      });
      output.print(self2.is_array ? "]" : "}");
    });
    DEFPRINT(AST_Debugger, function(self2, output) {
      output.print("debugger");
      output.semicolon();
    });
    function display_body(body, is_toplevel, output, allow_directives) {
      var last = body.length - 1;
      output.in_directive = allow_directives;
      body.forEach(function(stmt, i) {
        if (output.in_directive === true && !(stmt instanceof AST_Directive || stmt instanceof AST_EmptyStatement || stmt instanceof AST_SimpleStatement && stmt.body instanceof AST_String)) {
          output.in_directive = false;
        }
        if (!(stmt instanceof AST_EmptyStatement)) {
          output.indent();
          stmt.print(output);
          if (!(i == last && is_toplevel)) {
            output.newline();
            if (is_toplevel) output.newline();
          }
        }
        if (output.in_directive === true && stmt instanceof AST_SimpleStatement && stmt.body instanceof AST_String) {
          output.in_directive = false;
        }
      });
      output.in_directive = false;
    }
    AST_StatementWithBody.DEFMETHOD("_do_print_body", function(output) {
      print_maybe_braced_body(this.body, output);
    });
    DEFPRINT(AST_Statement, function(self2, output) {
      self2.body.print(output);
      output.semicolon();
    });
    DEFPRINT(AST_Toplevel, function(self2, output) {
      display_body(self2.body, true, output, true);
      output.print("");
    });
    DEFPRINT(AST_LabeledStatement, function(self2, output) {
      self2.label.print(output);
      output.colon();
      self2.body.print(output);
    });
    DEFPRINT(AST_SimpleStatement, function(self2, output) {
      self2.body.print(output);
      output.semicolon();
    });
    function print_braced_empty(self2, output) {
      output.print("{");
      output.with_indent(output.next_indent(), function() {
        output.append_comments(self2, true);
      });
      output.add_mapping(self2.end);
      output.print("}");
    }
    function print_braced(self2, output, allow_directives) {
      if (self2.body.length > 0) {
        output.with_block(function() {
          display_body(self2.body, false, output, allow_directives);
          output.add_mapping(self2.end);
        });
      } else print_braced_empty(self2, output);
    }
    DEFPRINT(AST_BlockStatement, function(self2, output) {
      print_braced(self2, output);
    });
    DEFPRINT(AST_EmptyStatement, function(self2, output) {
      output.semicolon();
    });
    DEFPRINT(AST_Do, function(self2, output) {
      output.print("do");
      output.space();
      make_block(self2.body, output);
      output.space();
      output.print("while");
      output.space();
      output.with_parens(function() {
        self2.condition.print(output);
      });
      output.semicolon();
    });
    DEFPRINT(AST_While, function(self2, output) {
      output.print("while");
      output.space();
      output.with_parens(function() {
        self2.condition.print(output);
      });
      output.space();
      self2._do_print_body(output);
    });
    DEFPRINT(AST_For, function(self2, output) {
      output.print("for");
      output.space();
      output.with_parens(function() {
        if (self2.init) {
          if (self2.init instanceof AST_Definitions) {
            self2.init.print(output);
          } else {
            parenthesize_for_noin(self2.init, output, true);
          }
          output.print(";");
          output.space();
        } else {
          output.print(";");
        }
        if (self2.condition) {
          self2.condition.print(output);
          output.print(";");
          output.space();
        } else {
          output.print(";");
        }
        if (self2.step) {
          self2.step.print(output);
        }
      });
      output.space();
      self2._do_print_body(output);
    });
    DEFPRINT(AST_ForIn, function(self2, output) {
      output.print("for");
      if (self2.await) {
        output.space();
        output.print("await");
      }
      output.space();
      output.with_parens(function() {
        self2.init.print(output);
        output.space();
        output.print(self2 instanceof AST_ForOf ? "of" : "in");
        output.space();
        self2.object.print(output);
      });
      output.space();
      self2._do_print_body(output);
    });
    DEFPRINT(AST_With, function(self2, output) {
      output.print("with");
      output.space();
      output.with_parens(function() {
        self2.expression.print(output);
      });
      output.space();
      self2._do_print_body(output);
    });
    AST_Lambda.DEFMETHOD("_do_print", function(output, nokeyword) {
      var self2 = this;
      if (!nokeyword) {
        if (self2.async) {
          output.print("async");
          output.space();
        }
        output.print("function");
        if (self2.is_generator) {
          output.star();
        }
        if (self2.name) {
          output.space();
        }
      }
      if (self2.name instanceof AST_Symbol) {
        self2.name.print(output);
      } else if (nokeyword && self2.name instanceof AST_Node) {
        output.with_square(function() {
          self2.name.print(output);
        });
      }
      output.with_parens(function() {
        self2.argnames.forEach(function(arg, i) {
          if (i) output.comma();
          arg.print(output);
        });
      });
      output.space();
      print_braced(self2, output, true);
    });
    DEFPRINT(AST_Lambda, function(self2, output) {
      self2._do_print(output);
      output.gc_scope(self2);
    });
    DEFPRINT(AST_PrefixedTemplateString, function(self2, output) {
      var tag = self2.prefix;
      var parenthesize_tag = tag instanceof AST_Lambda || tag instanceof AST_Binary || tag instanceof AST_Conditional || tag instanceof AST_Sequence || tag instanceof AST_Unary || tag instanceof AST_Dot && tag.expression instanceof AST_Object;
      if (parenthesize_tag) output.print("(");
      self2.prefix.print(output);
      if (parenthesize_tag) output.print(")");
      self2.template_string.print(output);
    });
    DEFPRINT(AST_TemplateString, function(self2, output) {
      var is_tagged = output.parent() instanceof AST_PrefixedTemplateString;
      output.print("`");
      for (var i = 0; i < self2.segments.length; i++) {
        if (!(self2.segments[i] instanceof AST_TemplateSegment)) {
          output.print("${");
          self2.segments[i].print(output);
          output.print("}");
        } else if (is_tagged) {
          output.print(self2.segments[i].raw);
        } else {
          output.print_template_string_chars(self2.segments[i].value);
        }
      }
      output.print("`");
    });
    DEFPRINT(AST_TemplateSegment, function(self2, output) {
      output.print_template_string_chars(self2.value);
    });
    AST_Arrow.DEFMETHOD("_do_print", function(output) {
      var self2 = this;
      var parent = output.parent();
      var needs_parens = parent instanceof AST_Binary && !(parent instanceof AST_Assign) && !(parent instanceof AST_DefaultAssign) || parent instanceof AST_Unary || parent instanceof AST_Call && self2 === parent.expression;
      if (needs_parens) {
        output.print("(");
      }
      if (self2.async) {
        output.print("async");
        output.space();
      }
      if (self2.argnames.length === 1 && self2.argnames[0] instanceof AST_Symbol) {
        self2.argnames[0].print(output);
      } else {
        output.with_parens(function() {
          self2.argnames.forEach(function(arg, i) {
            if (i) output.comma();
            arg.print(output);
          });
        });
      }
      output.space();
      output.print("=>");
      output.space();
      const first_statement = self2.body[0];
      if (self2.body.length === 1 && first_statement instanceof AST_Return) {
        const returned = first_statement.value;
        if (!returned) {
          output.print("{}");
        } else if (left_is_object(returned)) {
          output.print("(");
          returned.print(output);
          output.print(")");
        } else {
          returned.print(output);
        }
      } else {
        print_braced(self2, output);
      }
      if (needs_parens) {
        output.print(")");
      }
      output.gc_scope(self2);
    });
    AST_Exit.DEFMETHOD("_do_print", function(output, kind) {
      output.print(kind);
      if (this.value) {
        output.space();
        const comments = this.value.start.comments_before;
        if (comments && comments.length && !output.printed_comments.has(comments)) {
          output.print("(");
          this.value.print(output);
          output.print(")");
        } else {
          this.value.print(output);
        }
      }
      output.semicolon();
    });
    DEFPRINT(AST_Return, function(self2, output) {
      self2._do_print(output, "return");
    });
    DEFPRINT(AST_Throw, function(self2, output) {
      self2._do_print(output, "throw");
    });
    DEFPRINT(AST_Yield, function(self2, output) {
      var star = self2.is_star ? "*" : "";
      output.print("yield" + star);
      if (self2.expression) {
        output.space();
        self2.expression.print(output);
      }
    });
    DEFPRINT(AST_Await, function(self2, output) {
      output.print("await");
      output.space();
      var e = self2.expression;
      var parens = !(e instanceof AST_Call || e instanceof AST_SymbolRef || e instanceof AST_PropAccess || e instanceof AST_Unary || e instanceof AST_Constant || e instanceof AST_Await || e instanceof AST_Object);
      if (parens) output.print("(");
      self2.expression.print(output);
      if (parens) output.print(")");
    });
    AST_LoopControl.DEFMETHOD("_do_print", function(output, kind) {
      output.print(kind);
      if (this.label) {
        output.space();
        this.label.print(output);
      }
      output.semicolon();
    });
    DEFPRINT(AST_Break, function(self2, output) {
      self2._do_print(output, "break");
    });
    DEFPRINT(AST_Continue, function(self2, output) {
      self2._do_print(output, "continue");
    });
    function make_then(self2, output) {
      var b = self2.body;
      if (output.option("braces") || output.option("ie8") && b instanceof AST_Do)
        return make_block(b, output);
      if (!b) return output.force_semicolon();
      while (true) {
        if (b instanceof AST_If) {
          if (!b.alternative) {
            make_block(self2.body, output);
            return;
          }
          b = b.alternative;
        } else if (b instanceof AST_StatementWithBody) {
          b = b.body;
        } else break;
      }
      print_maybe_braced_body(self2.body, output);
    }
    DEFPRINT(AST_If, function(self2, output) {
      output.print("if");
      output.space();
      output.with_parens(function() {
        self2.condition.print(output);
      });
      output.space();
      if (self2.alternative) {
        make_then(self2, output);
        output.space();
        output.print("else");
        output.space();
        if (self2.alternative instanceof AST_If)
          self2.alternative.print(output);
        else
          print_maybe_braced_body(self2.alternative, output);
      } else {
        self2._do_print_body(output);
      }
    });
    DEFPRINT(AST_Switch, function(self2, output) {
      output.print("switch");
      output.space();
      output.with_parens(function() {
        self2.expression.print(output);
      });
      output.space();
      var last = self2.body.length - 1;
      if (last < 0) print_braced_empty(self2, output);
      else output.with_block(function() {
        self2.body.forEach(function(branch, i) {
          output.indent(true);
          branch.print(output);
          if (i < last && branch.body.length > 0)
            output.newline();
        });
      });
    });
    AST_SwitchBranch.DEFMETHOD("_do_print_body", function(output) {
      output.newline();
      this.body.forEach(function(stmt) {
        output.indent();
        stmt.print(output);
        output.newline();
      });
    });
    DEFPRINT(AST_Default, function(self2, output) {
      output.print("default:");
      self2._do_print_body(output);
    });
    DEFPRINT(AST_Case, function(self2, output) {
      output.print("case");
      output.space();
      self2.expression.print(output);
      output.print(":");
      self2._do_print_body(output);
    });
    DEFPRINT(AST_Try, function(self2, output) {
      output.print("try");
      output.space();
      self2.body.print(output);
      if (self2.bcatch) {
        output.space();
        self2.bcatch.print(output);
      }
      if (self2.bfinally) {
        output.space();
        self2.bfinally.print(output);
      }
    });
    DEFPRINT(AST_TryBlock, function(self2, output) {
      print_braced(self2, output);
    });
    DEFPRINT(AST_Catch, function(self2, output) {
      output.print("catch");
      if (self2.argname) {
        output.space();
        output.with_parens(function() {
          self2.argname.print(output);
        });
      }
      output.space();
      print_braced(self2, output);
    });
    DEFPRINT(AST_Finally, function(self2, output) {
      output.print("finally");
      output.space();
      print_braced(self2, output);
    });
    AST_Definitions.DEFMETHOD("_do_print", function(output, kind) {
      output.print(kind);
      output.space();
      this.definitions.forEach(function(def, i) {
        if (i) output.comma();
        def.print(output);
      });
      var p = output.parent();
      var in_for = p instanceof AST_For || p instanceof AST_ForIn;
      var output_semicolon = !in_for || p && p.init !== this;
      if (output_semicolon)
        output.semicolon();
    });
    DEFPRINT(AST_Let, function(self2, output) {
      self2._do_print(output, "let");
    });
    DEFPRINT(AST_Var, function(self2, output) {
      self2._do_print(output, "var");
    });
    DEFPRINT(AST_Const, function(self2, output) {
      self2._do_print(output, "const");
    });
    DEFPRINT(AST_Import, function(self2, output) {
      output.print("import");
      output.space();
      if (self2.imported_name) {
        self2.imported_name.print(output);
      }
      if (self2.imported_name && self2.imported_names) {
        output.print(",");
        output.space();
      }
      if (self2.imported_names) {
        if (self2.imported_names.length === 1 && self2.imported_names[0].foreign_name.name === "*" && !self2.imported_names[0].foreign_name.quote) {
          self2.imported_names[0].print(output);
        } else {
          output.print("{");
          self2.imported_names.forEach(function(name_import, i) {
            output.space();
            name_import.print(output);
            if (i < self2.imported_names.length - 1) {
              output.print(",");
            }
          });
          output.space();
          output.print("}");
        }
      }
      if (self2.imported_name || self2.imported_names) {
        output.space();
        output.print("from");
        output.space();
      }
      self2.module_name.print(output);
      if (self2.assert_clause) {
        output.print("assert");
        self2.assert_clause.print(output);
      }
      output.semicolon();
    });
    DEFPRINT(AST_ImportMeta, function(self2, output) {
      output.print("import.meta");
    });
    DEFPRINT(AST_NameMapping, function(self2, output) {
      var is_import = output.parent() instanceof AST_Import;
      var definition = self2.name.definition();
      var foreign_name = self2.foreign_name;
      var names_are_different = (definition && definition.mangled_name || self2.name.name) !== foreign_name.name;
      if (!names_are_different && foreign_name.name === "*" && foreign_name.quote != self2.name.quote) {
        names_are_different = true;
      }
      var foreign_name_is_name = foreign_name.quote == null;
      if (names_are_different) {
        if (is_import) {
          if (foreign_name_is_name) {
            output.print(foreign_name.name);
          } else {
            output.print_string(foreign_name.name, foreign_name.quote);
          }
        } else {
          if (self2.name.quote == null) {
            self2.name.print(output);
          } else {
            output.print_string(self2.name.name, self2.name.quote);
          }
        }
        output.space();
        output.print("as");
        output.space();
        if (is_import) {
          self2.name.print(output);
        } else {
          if (foreign_name_is_name) {
            output.print(foreign_name.name);
          } else {
            output.print_string(foreign_name.name, foreign_name.quote);
          }
        }
      } else {
        if (self2.name.quote == null) {
          self2.name.print(output);
        } else {
          output.print_string(self2.name.name, self2.name.quote);
        }
      }
    });
    DEFPRINT(AST_Export, function(self2, output) {
      output.print("export");
      output.space();
      if (self2.is_default) {
        output.print("default");
        output.space();
      }
      if (self2.exported_names) {
        if (self2.exported_names.length === 1 && self2.exported_names[0].name.name === "*" && !self2.exported_names[0].name.quote) {
          self2.exported_names[0].print(output);
        } else {
          output.print("{");
          self2.exported_names.forEach(function(name_export, i) {
            output.space();
            name_export.print(output);
            if (i < self2.exported_names.length - 1) {
              output.print(",");
            }
          });
          output.space();
          output.print("}");
        }
      } else if (self2.exported_value) {
        self2.exported_value.print(output);
      } else if (self2.exported_definition) {
        self2.exported_definition.print(output);
        if (self2.exported_definition instanceof AST_Definitions) return;
      }
      if (self2.module_name) {
        output.space();
        output.print("from");
        output.space();
        self2.module_name.print(output);
      }
      if (self2.assert_clause) {
        output.print("assert");
        self2.assert_clause.print(output);
      }
      if (self2.exported_value && !(self2.exported_value instanceof AST_Defun || self2.exported_value instanceof AST_Function || self2.exported_value instanceof AST_Class) || self2.module_name || self2.exported_names) {
        output.semicolon();
      }
    });
    function parenthesize_for_noin(node, output, noin) {
      var parens = false;
      if (noin) {
        parens = walk(node, (node2) => {
          if (node2 instanceof AST_Scope && !(node2 instanceof AST_Arrow)) {
            return true;
          }
          if (node2 instanceof AST_Binary && node2.operator == "in" || node2 instanceof AST_PrivateIn) {
            return walk_abort;
          }
        });
      }
      node.print(output, parens);
    }
    DEFPRINT(AST_VarDef, function(self2, output) {
      self2.name.print(output);
      if (self2.value) {
        output.space();
        output.print("=");
        output.space();
        var p = output.parent(1);
        var noin = p instanceof AST_For || p instanceof AST_ForIn;
        parenthesize_for_noin(self2.value, output, noin);
      }
    });
    DEFPRINT(AST_Call, function(self2, output) {
      self2.expression.print(output);
      if (self2 instanceof AST_New && self2.args.length === 0)
        return;
      if (self2.expression instanceof AST_Call || self2.expression instanceof AST_Lambda) {
        output.add_mapping(self2.start);
      }
      if (self2.optional) output.print("?.");
      output.with_parens(function() {
        self2.args.forEach(function(expr, i) {
          if (i) output.comma();
          expr.print(output);
        });
      });
    });
    DEFPRINT(AST_New, function(self2, output) {
      output.print("new");
      output.space();
      AST_Call.prototype._codegen(self2, output);
    });
    AST_Sequence.DEFMETHOD("_do_print", function(output) {
      this.expressions.forEach(function(node, index) {
        if (index > 0) {
          output.comma();
          if (output.should_break()) {
            output.newline();
            output.indent();
          }
        }
        node.print(output);
      });
    });
    DEFPRINT(AST_Sequence, function(self2, output) {
      self2._do_print(output);
    });
    DEFPRINT(AST_Dot, function(self2, output) {
      var expr = self2.expression;
      expr.print(output);
      var prop = self2.property;
      var print_computed = ALL_RESERVED_WORDS.has(prop) ? output.option("ie8") : !is_identifier_string(
        prop,
        output.option("ecma") >= 2015 && !output.option("safari10")
      );
      if (self2.optional) output.print("?.");
      if (print_computed) {
        output.print("[");
        output.add_mapping(self2.end);
        output.print_string(prop);
        output.print("]");
      } else {
        if (expr instanceof AST_Number && expr.getValue() >= 0) {
          if (!/[xa-f.)]/i.test(output.last())) {
            output.print(".");
          }
        }
        if (!self2.optional) output.print(".");
        output.add_mapping(self2.end);
        output.print_name(prop);
      }
    });
    DEFPRINT(AST_DotHash, function(self2, output) {
      var expr = self2.expression;
      expr.print(output);
      var prop = self2.property;
      if (self2.optional) output.print("?");
      output.print(".#");
      output.add_mapping(self2.end);
      output.print_name(prop);
    });
    DEFPRINT(AST_Sub, function(self2, output) {
      self2.expression.print(output);
      if (self2.optional) output.print("?.");
      output.print("[");
      self2.property.print(output);
      output.print("]");
    });
    DEFPRINT(AST_Chain, function(self2, output) {
      self2.expression.print(output);
    });
    DEFPRINT(AST_UnaryPrefix, function(self2, output) {
      var op = self2.operator;
      if (op === "--" && output.last().endsWith("!")) {
        output.print(" ");
      }
      output.print(op);
      if (/^[a-z]/i.test(op) || /[+-]$/.test(op) && self2.expression instanceof AST_UnaryPrefix && /^[+-]/.test(self2.expression.operator)) {
        output.space();
      }
      self2.expression.print(output);
    });
    DEFPRINT(AST_UnaryPostfix, function(self2, output) {
      self2.expression.print(output);
      output.print(self2.operator);
    });
    DEFPRINT(AST_Binary, function(self2, output) {
      var op = self2.operator;
      self2.left.print(output);
      if (op[0] == ">" && output.last().endsWith("--")) {
        output.print(" ");
      } else {
        output.space();
      }
      output.print(op);
      output.space();
      self2.right.print(output);
    });
    DEFPRINT(AST_Conditional, function(self2, output) {
      self2.condition.print(output);
      output.space();
      output.print("?");
      output.space();
      self2.consequent.print(output);
      output.space();
      output.colon();
      self2.alternative.print(output);
    });
    DEFPRINT(AST_Array, function(self2, output) {
      output.with_square(function() {
        var a = self2.elements, len = a.length;
        if (len > 0) output.space();
        a.forEach(function(exp, i) {
          if (i) output.comma();
          exp.print(output);
          if (i === len - 1 && exp instanceof AST_Hole)
            output.comma();
        });
        if (len > 0) output.space();
      });
    });
    DEFPRINT(AST_Object, function(self2, output) {
      if (self2.properties.length > 0) output.with_block(function() {
        self2.properties.forEach(function(prop, i) {
          if (i) {
            output.print(",");
            output.newline();
          }
          output.indent();
          prop.print(output);
        });
        output.newline();
      });
      else print_braced_empty(self2, output);
    });
    DEFPRINT(AST_Class, function(self2, output) {
      output.print("class");
      output.space();
      if (self2.name) {
        self2.name.print(output);
        output.space();
      }
      if (self2.extends) {
        var parens = !(self2.extends instanceof AST_SymbolRef) && !(self2.extends instanceof AST_PropAccess) && !(self2.extends instanceof AST_ClassExpression) && !(self2.extends instanceof AST_Function);
        output.print("extends");
        if (parens) {
          output.print("(");
        } else {
          output.space();
        }
        self2.extends.print(output);
        if (parens) {
          output.print(")");
        } else {
          output.space();
        }
      }
      if (self2.properties.length > 0) output.with_block(function() {
        self2.properties.forEach(function(prop, i) {
          if (i) {
            output.newline();
          }
          output.indent();
          prop.print(output);
        });
        output.newline();
      });
      else output.print("{}");
    });
    DEFPRINT(AST_NewTarget, function(self2, output) {
      output.print("new.target");
    });
    function print_property_name(key, quote, output) {
      if (output.option("quote_keys")) {
        output.print_string(key);
        return false;
      }
      if ("" + +key == key && key >= 0) {
        if (output.option("keep_numbers")) {
          output.print(key);
          return false;
        }
        output.print(make_num(key));
        return false;
      }
      var print_string = ALL_RESERVED_WORDS.has(key) ? output.option("ie8") : output.option("ecma") < 2015 || output.option("safari10") ? !is_basic_identifier_string(key) : !is_identifier_string(key, true);
      if (print_string || quote && output.option("keep_quoted_props")) {
        output.print_string(key, quote);
        return false;
      }
      output.print_name(key);
      return true;
    }
    DEFPRINT(AST_ObjectKeyVal, function(self2, output) {
      function get_name(self3) {
        var def = self3.definition();
        return def ? def.mangled_name || def.name : self3.name;
      }
      const try_shorthand = output.option("shorthand") && !(self2.key instanceof AST_Node);
      if (try_shorthand && self2.value instanceof AST_Symbol && get_name(self2.value) === self2.key && !ALL_RESERVED_WORDS.has(self2.key)) {
        const was_shorthand = print_property_name(self2.key, self2.quote, output);
        if (!was_shorthand) {
          output.colon();
          self2.value.print(output);
        }
      } else if (try_shorthand && self2.value instanceof AST_DefaultAssign && self2.value.left instanceof AST_Symbol && get_name(self2.value.left) === self2.key) {
        const was_shorthand = print_property_name(self2.key, self2.quote, output);
        if (!was_shorthand) {
          output.colon();
          self2.value.left.print(output);
        }
        output.space();
        output.print("=");
        output.space();
        self2.value.right.print(output);
      } else {
        if (!(self2.key instanceof AST_Node)) {
          print_property_name(self2.key, self2.quote, output);
        } else {
          output.with_square(function() {
            self2.key.print(output);
          });
        }
        output.colon();
        self2.value.print(output);
      }
    });
    DEFPRINT(AST_ClassPrivateProperty, (self2, output) => {
      if (self2.static) {
        output.print("static");
        output.space();
      }
      output.print("#");
      print_property_name(self2.key.name, self2.quote, output);
      if (self2.value) {
        output.print("=");
        self2.value.print(output);
      }
      output.semicolon();
    });
    DEFPRINT(AST_ClassProperty, (self2, output) => {
      if (self2.static) {
        output.print("static");
        output.space();
      }
      if (self2.key instanceof AST_SymbolClassProperty) {
        print_property_name(self2.key.name, self2.quote, output);
      } else {
        output.print("[");
        self2.key.print(output);
        output.print("]");
      }
      if (self2.value) {
        output.print("=");
        self2.value.print(output);
      }
      output.semicolon();
    });
    AST_ObjectProperty.DEFMETHOD("_print_getter_setter", function(type, is_private, output) {
      var self2 = this;
      if (self2.static) {
        output.print("static");
        output.space();
      }
      if (type) {
        output.print(type);
        output.space();
      }
      if (self2.key instanceof AST_SymbolMethod) {
        if (is_private) output.print("#");
        print_property_name(self2.key.name, self2.quote, output);
        self2.key.add_source_map(output);
      } else {
        output.with_square(function() {
          self2.key.print(output);
        });
      }
      self2.value._do_print(output, true);
    });
    DEFPRINT(AST_ObjectSetter, function(self2, output) {
      self2._print_getter_setter("set", false, output);
    });
    DEFPRINT(AST_ObjectGetter, function(self2, output) {
      self2._print_getter_setter("get", false, output);
    });
    DEFPRINT(AST_PrivateSetter, function(self2, output) {
      self2._print_getter_setter("set", true, output);
    });
    DEFPRINT(AST_PrivateGetter, function(self2, output) {
      self2._print_getter_setter("get", true, output);
    });
    DEFPRINT(AST_PrivateMethod, function(self2, output) {
      var type;
      if (self2.is_generator && self2.async) {
        type = "async*";
      } else if (self2.is_generator) {
        type = "*";
      } else if (self2.async) {
        type = "async";
      }
      self2._print_getter_setter(type, true, output);
    });
    DEFPRINT(AST_PrivateIn, function(self2, output) {
      self2.key.print(output);
      output.space();
      output.print("in");
      output.space();
      self2.value.print(output);
    });
    DEFPRINT(AST_SymbolPrivateProperty, function(self2, output) {
      output.print("#" + self2.name);
    });
    DEFPRINT(AST_ConciseMethod, function(self2, output) {
      var type;
      if (self2.is_generator && self2.async) {
        type = "async*";
      } else if (self2.is_generator) {
        type = "*";
      } else if (self2.async) {
        type = "async";
      }
      self2._print_getter_setter(type, false, output);
    });
    DEFPRINT(AST_ClassStaticBlock, function(self2, output) {
      output.print("static");
      output.space();
      print_braced(self2, output);
    });
    AST_Symbol.DEFMETHOD("_do_print", function(output) {
      var def = this.definition();
      output.print_name(def ? def.mangled_name || def.name : this.name);
    });
    DEFPRINT(AST_Symbol, function(self2, output) {
      self2._do_print(output);
    });
    DEFPRINT(AST_Hole, noop);
    DEFPRINT(AST_This, function(self2, output) {
      output.print("this");
    });
    DEFPRINT(AST_Super, function(self2, output) {
      output.print("super");
    });
    DEFPRINT(AST_Constant, function(self2, output) {
      output.print(self2.getValue());
    });
    DEFPRINT(AST_String, function(self2, output) {
      output.print_string(self2.getValue(), self2.quote, output.in_directive);
    });
    DEFPRINT(AST_Number, function(self2, output) {
      if ((output.option("keep_numbers") || output.use_asm) && self2.raw) {
        output.print(self2.raw);
      } else {
        output.print(make_num(self2.getValue()));
      }
    });
    DEFPRINT(AST_BigInt, function(self2, output) {
      output.print(self2.getValue() + "n");
    });
    const r_slash_script = /(<\s*\/\s*script)/i;
    const r_starts_with_script = /^\s*script/i;
    const slash_script_replace = (_, $1) => $1.replace("/", "\\/");
    DEFPRINT(AST_RegExp, function(self2, output) {
      let { source, flags } = self2.getValue();
      source = regexp_source_fix(source);
      flags = flags ? sort_regexp_flags(flags) : "";
      source = source.replace(r_slash_script, slash_script_replace);
      if (r_starts_with_script.test(source) && output.last().endsWith("<")) {
        output.print(" ");
      }
      output.print(output.to_utf8(`/${source}/${flags}`, false, true));
      const parent = output.parent();
      if (parent instanceof AST_Binary && /^\w/.test(parent.operator) && parent.left === self2) {
        output.print(" ");
      }
    });
    function print_maybe_braced_body(stat, output) {
      if (output.option("braces")) {
        make_block(stat, output);
      } else {
        if (!stat || stat instanceof AST_EmptyStatement)
          output.force_semicolon();
        else if (stat instanceof AST_Let || stat instanceof AST_Const || stat instanceof AST_Class)
          make_block(stat, output);
        else
          stat.print(output);
      }
    }
    function best_of2(a) {
      var best = a[0], len = best.length;
      for (var i = 1; i < a.length; ++i) {
        if (a[i].length < len) {
          best = a[i];
          len = best.length;
        }
      }
      return best;
    }
    function make_num(num) {
      var str = num.toString(10).replace(/^0\./, ".").replace("e+", "e");
      var candidates = [str];
      if (Math.floor(num) === num) {
        if (num < 0) {
          candidates.push("-0x" + (-num).toString(16).toLowerCase());
        } else {
          candidates.push("0x" + num.toString(16).toLowerCase());
        }
      }
      var match, len, digits;
      if (match = /^\.0+/.exec(str)) {
        len = match[0].length;
        digits = str.slice(len);
        candidates.push(digits + "e-" + (digits.length + len - 1));
      } else if (match = /0+$/.exec(str)) {
        len = match[0].length;
        candidates.push(str.slice(0, -len) + "e" + len);
      } else if (match = /^(\d)\.(\d+)e(-?\d+)$/.exec(str)) {
        candidates.push(match[1] + match[2] + "e" + (match[3] - match[2].length));
      }
      return best_of2(candidates);
    }
    function make_block(stmt, output) {
      if (!stmt || stmt instanceof AST_EmptyStatement)
        output.print("{}");
      else if (stmt instanceof AST_BlockStatement)
        stmt.print(output);
      else output.with_block(function() {
        output.indent();
        stmt.print(output);
        output.newline();
      });
    }
    function DEFMAP(nodetype, generator) {
      nodetype.forEach(function(nodetype2) {
        nodetype2.DEFMETHOD("add_source_map", generator);
      });
    }
    DEFMAP([
      // We could easily add info for ALL nodes, but it seems to me that
      // would be quite wasteful, hence this noop in the base class.
      AST_Node,
      // since the label symbol will mark it
      AST_LabeledStatement,
      AST_Toplevel
    ], noop);
    DEFMAP([
      AST_Array,
      AST_BlockStatement,
      AST_Catch,
      AST_Class,
      AST_Constant,
      AST_Debugger,
      AST_Definitions,
      AST_Directive,
      AST_Finally,
      AST_Jump,
      AST_Lambda,
      AST_New,
      AST_Object,
      AST_StatementWithBody,
      AST_Symbol,
      AST_Switch,
      AST_SwitchBranch,
      AST_TemplateString,
      AST_TemplateSegment,
      AST_Try
    ], function(output) {
      output.add_mapping(this.start);
    });
    DEFMAP([
      AST_ObjectGetter,
      AST_ObjectSetter,
      AST_PrivateGetter,
      AST_PrivateSetter,
      AST_ConciseMethod,
      AST_PrivateMethod
    ], function(output) {
      output.add_mapping(
        this.start,
        false
        /*name handled below*/
      );
    });
    DEFMAP([
      AST_SymbolMethod,
      AST_SymbolPrivateProperty
    ], function(output) {
      const tok_type = this.end && this.end.type;
      if (tok_type === "name" || tok_type === "privatename") {
        output.add_mapping(this.end, this.name);
      } else {
        output.add_mapping(this.end);
      }
    });
    DEFMAP([AST_ObjectProperty], function(output) {
      output.add_mapping(this.start, this.key);
    });
  })();

  // node_modules/terser/lib/equivalent-to.js
  var shallow_cmp = (node1, node2) => {
    return node1 === null && node2 === null || node1.TYPE === node2.TYPE && node1.shallow_cmp(node2);
  };
  var equivalent_to = (tree1, tree2) => {
    if (!shallow_cmp(tree1, tree2)) return false;
    const walk_1_state = [tree1];
    const walk_2_state = [tree2];
    const walk_1_push = walk_1_state.push.bind(walk_1_state);
    const walk_2_push = walk_2_state.push.bind(walk_2_state);
    while (walk_1_state.length && walk_2_state.length) {
      const node_1 = walk_1_state.pop();
      const node_2 = walk_2_state.pop();
      if (!shallow_cmp(node_1, node_2)) return false;
      node_1._children_backwards(walk_1_push);
      node_2._children_backwards(walk_2_push);
      if (walk_1_state.length !== walk_2_state.length) {
        return false;
      }
    }
    return walk_1_state.length == 0 && walk_2_state.length == 0;
  };
  var pass_through = () => true;
  AST_Node.prototype.shallow_cmp = function() {
    throw new Error("did not find a shallow_cmp function for " + this.constructor.name);
  };
  AST_Debugger.prototype.shallow_cmp = pass_through;
  AST_Directive.prototype.shallow_cmp = function(other) {
    return this.value === other.value;
  };
  AST_SimpleStatement.prototype.shallow_cmp = pass_through;
  AST_Block.prototype.shallow_cmp = pass_through;
  AST_EmptyStatement.prototype.shallow_cmp = pass_through;
  AST_LabeledStatement.prototype.shallow_cmp = function(other) {
    return this.label.name === other.label.name;
  };
  AST_Do.prototype.shallow_cmp = pass_through;
  AST_While.prototype.shallow_cmp = pass_through;
  AST_For.prototype.shallow_cmp = function(other) {
    return (this.init == null ? other.init == null : this.init === other.init) && (this.condition == null ? other.condition == null : this.condition === other.condition) && (this.step == null ? other.step == null : this.step === other.step);
  };
  AST_ForIn.prototype.shallow_cmp = pass_through;
  AST_ForOf.prototype.shallow_cmp = pass_through;
  AST_With.prototype.shallow_cmp = pass_through;
  AST_Toplevel.prototype.shallow_cmp = pass_through;
  AST_Expansion.prototype.shallow_cmp = pass_through;
  AST_Lambda.prototype.shallow_cmp = function(other) {
    return this.is_generator === other.is_generator && this.async === other.async;
  };
  AST_Destructuring.prototype.shallow_cmp = function(other) {
    return this.is_array === other.is_array;
  };
  AST_PrefixedTemplateString.prototype.shallow_cmp = pass_through;
  AST_TemplateString.prototype.shallow_cmp = pass_through;
  AST_TemplateSegment.prototype.shallow_cmp = function(other) {
    return this.value === other.value;
  };
  AST_Jump.prototype.shallow_cmp = pass_through;
  AST_LoopControl.prototype.shallow_cmp = pass_through;
  AST_Await.prototype.shallow_cmp = pass_through;
  AST_Yield.prototype.shallow_cmp = function(other) {
    return this.is_star === other.is_star;
  };
  AST_If.prototype.shallow_cmp = function(other) {
    return this.alternative == null ? other.alternative == null : this.alternative === other.alternative;
  };
  AST_Switch.prototype.shallow_cmp = pass_through;
  AST_SwitchBranch.prototype.shallow_cmp = pass_through;
  AST_Try.prototype.shallow_cmp = function(other) {
    return this.body === other.body && (this.bcatch == null ? other.bcatch == null : this.bcatch === other.bcatch) && (this.bfinally == null ? other.bfinally == null : this.bfinally === other.bfinally);
  };
  AST_Catch.prototype.shallow_cmp = function(other) {
    return this.argname == null ? other.argname == null : this.argname === other.argname;
  };
  AST_Finally.prototype.shallow_cmp = pass_through;
  AST_Definitions.prototype.shallow_cmp = pass_through;
  AST_VarDef.prototype.shallow_cmp = function(other) {
    return this.value == null ? other.value == null : this.value === other.value;
  };
  AST_NameMapping.prototype.shallow_cmp = pass_through;
  AST_Import.prototype.shallow_cmp = function(other) {
    return (this.imported_name == null ? other.imported_name == null : this.imported_name === other.imported_name) && (this.imported_names == null ? other.imported_names == null : this.imported_names === other.imported_names);
  };
  AST_ImportMeta.prototype.shallow_cmp = pass_through;
  AST_Export.prototype.shallow_cmp = function(other) {
    return (this.exported_definition == null ? other.exported_definition == null : this.exported_definition === other.exported_definition) && (this.exported_value == null ? other.exported_value == null : this.exported_value === other.exported_value) && (this.exported_names == null ? other.exported_names == null : this.exported_names === other.exported_names) && this.module_name === other.module_name && this.is_default === other.is_default;
  };
  AST_Call.prototype.shallow_cmp = pass_through;
  AST_Sequence.prototype.shallow_cmp = pass_through;
  AST_PropAccess.prototype.shallow_cmp = pass_through;
  AST_Chain.prototype.shallow_cmp = pass_through;
  AST_Dot.prototype.shallow_cmp = function(other) {
    return this.property === other.property;
  };
  AST_DotHash.prototype.shallow_cmp = function(other) {
    return this.property === other.property;
  };
  AST_Unary.prototype.shallow_cmp = function(other) {
    return this.operator === other.operator;
  };
  AST_Binary.prototype.shallow_cmp = function(other) {
    return this.operator === other.operator;
  };
  AST_Conditional.prototype.shallow_cmp = pass_through;
  AST_Array.prototype.shallow_cmp = pass_through;
  AST_Object.prototype.shallow_cmp = pass_through;
  AST_ObjectProperty.prototype.shallow_cmp = pass_through;
  AST_ObjectKeyVal.prototype.shallow_cmp = function(other) {
    return this.key === other.key;
  };
  AST_ObjectSetter.prototype.shallow_cmp = function(other) {
    return this.static === other.static;
  };
  AST_ObjectGetter.prototype.shallow_cmp = function(other) {
    return this.static === other.static;
  };
  AST_ConciseMethod.prototype.shallow_cmp = function(other) {
    return this.static === other.static && this.is_generator === other.is_generator && this.async === other.async;
  };
  AST_Class.prototype.shallow_cmp = function(other) {
    return (this.name == null ? other.name == null : this.name === other.name) && (this.extends == null ? other.extends == null : this.extends === other.extends);
  };
  AST_ClassProperty.prototype.shallow_cmp = function(other) {
    return this.static === other.static;
  };
  AST_Symbol.prototype.shallow_cmp = function(other) {
    return this.name === other.name;
  };
  AST_NewTarget.prototype.shallow_cmp = pass_through;
  AST_This.prototype.shallow_cmp = pass_through;
  AST_Super.prototype.shallow_cmp = pass_through;
  AST_String.prototype.shallow_cmp = function(other) {
    return this.value === other.value;
  };
  AST_Number.prototype.shallow_cmp = function(other) {
    return this.value === other.value;
  };
  AST_BigInt.prototype.shallow_cmp = function(other) {
    return this.value === other.value;
  };
  AST_RegExp.prototype.shallow_cmp = function(other) {
    return this.value.flags === other.value.flags && this.value.source === other.value.source;
  };
  AST_Atom.prototype.shallow_cmp = pass_through;

  // node_modules/terser/lib/scope.js
  var MASK_EXPORT_DONT_MANGLE = 1 << 0;
  var MASK_EXPORT_WANT_MANGLE = 1 << 1;
  var function_defs = null;
  var unmangleable_names = null;
  var scopes_with_block_defuns = null;
  var SymbolDef = class _SymbolDef {
    constructor(scope, orig, init) {
      this.name = orig.name;
      this.orig = [orig];
      this.init = init;
      this.eliminated = 0;
      this.assignments = 0;
      this.scope = scope;
      this.replaced = 0;
      this.global = false;
      this.export = 0;
      this.mangled_name = null;
      this.undeclared = false;
      this.id = _SymbolDef.next_id++;
      this.chained = false;
      this.direct_access = false;
      this.escaped = 0;
      this.recursive_refs = 0;
      this.references = [];
      this.should_replace = void 0;
      this.single_use = false;
      this.fixed = false;
      Object.seal(this);
    }
    fixed_value() {
      if (!this.fixed || this.fixed instanceof AST_Node) return this.fixed;
      return this.fixed();
    }
    unmangleable(options) {
      if (!options) options = {};
      if (function_defs && function_defs.has(this.id) && keep_name(options.keep_fnames, this.orig[0].name)) return true;
      return this.global && !options.toplevel || this.export & MASK_EXPORT_DONT_MANGLE || this.undeclared || !options.eval && this.scope.pinned() || (this.orig[0] instanceof AST_SymbolLambda || this.orig[0] instanceof AST_SymbolDefun) && keep_name(options.keep_fnames, this.orig[0].name) || this.orig[0] instanceof AST_SymbolMethod || (this.orig[0] instanceof AST_SymbolClass || this.orig[0] instanceof AST_SymbolDefClass) && keep_name(options.keep_classnames, this.orig[0].name);
    }
    mangle(options) {
      const cache = options.cache && options.cache.props;
      if (this.global && cache && cache.has(this.name)) {
        this.mangled_name = cache.get(this.name);
      } else if (!this.mangled_name && !this.unmangleable(options)) {
        var s = this.scope;
        var sym = this.orig[0];
        if (options.ie8 && sym instanceof AST_SymbolLambda)
          s = s.parent_scope;
        const redefinition = redefined_catch_def(this);
        this.mangled_name = redefinition ? redefinition.mangled_name || redefinition.name : s.next_mangled(options, this);
        if (this.global && cache) {
          cache.set(this.name, this.mangled_name);
        }
      }
    }
  };
  SymbolDef.next_id = 1;
  function redefined_catch_def(def) {
    if (def.orig[0] instanceof AST_SymbolCatch && def.scope.is_block_scope()) {
      return def.scope.get_defun_scope().variables.get(def.name);
    }
  }
  AST_Scope.DEFMETHOD("figure_out_scope", function(options, { parent_scope = void 0, toplevel = this } = {}) {
    options = defaults(options, {
      cache: null,
      ie8: false,
      safari10: false,
      module: false
    });
    if (!(toplevel instanceof AST_Toplevel)) {
      throw new Error("Invalid toplevel scope");
    }
    var scope = this.parent_scope = parent_scope;
    var labels = /* @__PURE__ */ new Map();
    var defun = null;
    var in_destructuring = null;
    var for_scopes = [];
    var tw = new TreeWalker((node, descend) => {
      if (node.is_block_scope()) {
        const save_scope2 = scope;
        node.block_scope = scope = new AST_Scope(node);
        scope._block_scope = true;
        scope.init_scope_vars(save_scope2);
        scope.uses_with = save_scope2.uses_with;
        scope.uses_eval = save_scope2.uses_eval;
        if (options.safari10) {
          if (node instanceof AST_For || node instanceof AST_ForIn || node instanceof AST_ForOf) {
            for_scopes.push(scope);
          }
        }
        if (node instanceof AST_Switch) {
          const the_block_scope = scope;
          scope = save_scope2;
          node.expression.walk(tw);
          scope = the_block_scope;
          for (let i = 0; i < node.body.length; i++) {
            node.body[i].walk(tw);
          }
        } else {
          descend();
        }
        scope = save_scope2;
        return true;
      }
      if (node instanceof AST_Destructuring) {
        const save_destructuring = in_destructuring;
        in_destructuring = node;
        descend();
        in_destructuring = save_destructuring;
        return true;
      }
      if (node instanceof AST_Scope) {
        node.init_scope_vars(scope);
        var save_scope = scope;
        var save_defun = defun;
        var save_labels = labels;
        defun = scope = node;
        labels = /* @__PURE__ */ new Map();
        descend();
        scope = save_scope;
        defun = save_defun;
        labels = save_labels;
        return true;
      }
      if (node instanceof AST_LabeledStatement) {
        var l = node.label;
        if (labels.has(l.name)) {
          throw new Error(string_template("Label {name} defined twice", l));
        }
        labels.set(l.name, l);
        descend();
        labels.delete(l.name);
        return true;
      }
      if (node instanceof AST_With) {
        for (var s = scope; s; s = s.parent_scope)
          s.uses_with = true;
        return;
      }
      if (node instanceof AST_Symbol) {
        node.scope = scope;
      }
      if (node instanceof AST_Label) {
        node.thedef = node;
        node.references = [];
      }
      if (node instanceof AST_SymbolLambda) {
        defun.def_function(node, node.name == "arguments" ? void 0 : defun);
      } else if (node instanceof AST_SymbolDefun) {
        const closest_scope = defun.parent_scope;
        node.scope = tw.directives["use strict"] ? closest_scope : closest_scope.get_defun_scope();
        mark_export(node.scope.def_function(node, defun), 1);
      } else if (node instanceof AST_SymbolClass) {
        mark_export(defun.def_variable(node, defun), 1);
      } else if (node instanceof AST_SymbolImport) {
        scope.def_variable(node);
      } else if (node instanceof AST_SymbolDefClass) {
        mark_export((node.scope = defun.parent_scope).def_function(node, defun), 1);
      } else if (node instanceof AST_SymbolVar || node instanceof AST_SymbolLet || node instanceof AST_SymbolConst || node instanceof AST_SymbolCatch) {
        var def;
        if (node instanceof AST_SymbolBlockDeclaration) {
          def = scope.def_variable(node, null);
        } else {
          def = defun.def_variable(node, node.TYPE == "SymbolVar" ? null : void 0);
        }
        if (!def.orig.every((sym2) => {
          if (sym2 === node) return true;
          if (node instanceof AST_SymbolBlockDeclaration) {
            return sym2 instanceof AST_SymbolLambda;
          }
          return !(sym2 instanceof AST_SymbolLet || sym2 instanceof AST_SymbolConst);
        })) {
          js_error(
            `"${node.name}" is redeclared`,
            node.start.file,
            node.start.line,
            node.start.col,
            node.start.pos
          );
        }
        if (!(node instanceof AST_SymbolFunarg)) mark_export(def, 2);
        if (defun !== scope) {
          node.mark_enclosed();
          var def = scope.find_variable(node);
          if (node.thedef !== def) {
            node.thedef = def;
            node.reference();
          }
        }
      } else if (node instanceof AST_LabelRef) {
        var sym = labels.get(node.name);
        if (!sym) throw new Error(string_template("Undefined label {name} [{line},{col}]", {
          name: node.name,
          line: node.start.line,
          col: node.start.col
        }));
        node.thedef = sym;
      }
      if (!(scope instanceof AST_Toplevel) && (node instanceof AST_Export || node instanceof AST_Import)) {
        js_error(
          `"${node.TYPE}" statement may only appear at the top level`,
          node.start.file,
          node.start.line,
          node.start.col,
          node.start.pos
        );
      }
    });
    if (options.module) {
      tw.directives["use strict"] = true;
    }
    this.walk(tw);
    function mark_export(def, level) {
      if (in_destructuring) {
        var i = 0;
        do {
          level++;
        } while (tw.parent(i++) !== in_destructuring);
      }
      var node = tw.parent(level);
      if (def.export = node instanceof AST_Export ? MASK_EXPORT_DONT_MANGLE : 0) {
        var exported = node.exported_definition;
        if ((exported instanceof AST_Defun || exported instanceof AST_DefClass) && node.is_default) {
          def.export = MASK_EXPORT_WANT_MANGLE;
        }
      }
    }
    const is_toplevel = this instanceof AST_Toplevel;
    if (is_toplevel) {
      this.globals = /* @__PURE__ */ new Map();
    }
    var tw = new TreeWalker((node) => {
      if (node instanceof AST_LoopControl && node.label) {
        node.label.thedef.references.push(node);
        return true;
      }
      if (node instanceof AST_SymbolRef) {
        var name = node.name;
        if (name == "eval" && tw.parent() instanceof AST_Call) {
          for (var s = node.scope; s && !s.uses_eval; s = s.parent_scope) {
            s.uses_eval = true;
          }
        }
        var sym;
        if (tw.parent() instanceof AST_NameMapping && tw.parent(1).module_name || !(sym = node.scope.find_variable(name))) {
          sym = toplevel.def_global(node);
          if (node instanceof AST_SymbolExport) sym.export = MASK_EXPORT_DONT_MANGLE;
        } else if (sym.scope instanceof AST_Lambda && name == "arguments") {
          sym.scope.get_defun_scope().uses_arguments = true;
        }
        node.thedef = sym;
        node.reference();
        if (node.scope.is_block_scope() && !(sym.orig[0] instanceof AST_SymbolBlockDeclaration)) {
          node.scope = node.scope.get_defun_scope();
        }
        return true;
      }
      var def;
      if (node instanceof AST_SymbolCatch && (def = redefined_catch_def(node.definition()))) {
        var s = node.scope;
        while (s) {
          push_uniq(s.enclosed, def);
          if (s === def.scope) break;
          s = s.parent_scope;
        }
      }
    });
    this.walk(tw);
    if (options.ie8 || options.safari10) {
      walk(this, (node) => {
        if (node instanceof AST_SymbolCatch) {
          var name = node.name;
          var refs = node.thedef.references;
          var scope2 = node.scope.get_defun_scope();
          var def = scope2.find_variable(name) || toplevel.globals.get(name) || scope2.def_variable(node);
          refs.forEach(function(ref) {
            ref.thedef = def;
            ref.reference();
          });
          node.thedef = def;
          node.reference();
          return true;
        }
      });
    }
    if (options.safari10) {
      for (const scope2 of for_scopes) {
        scope2.parent_scope.variables.forEach(function(def) {
          push_uniq(scope2.enclosed, def);
        });
      }
    }
  });
  AST_Toplevel.DEFMETHOD("def_global", function(node) {
    var globals = this.globals, name = node.name;
    if (globals.has(name)) {
      return globals.get(name);
    } else {
      var g = new SymbolDef(this, node);
      g.undeclared = true;
      g.global = true;
      globals.set(name, g);
      return g;
    }
  });
  AST_Scope.DEFMETHOD("init_scope_vars", function(parent_scope) {
    this.variables = /* @__PURE__ */ new Map();
    this.uses_with = false;
    this.uses_eval = false;
    this.parent_scope = parent_scope;
    this.enclosed = [];
    this.cname = -1;
  });
  AST_Scope.DEFMETHOD("conflicting_def", function(name) {
    return this.enclosed.find((def) => def.name === name) || this.variables.has(name) || this.parent_scope && this.parent_scope.conflicting_def(name);
  });
  AST_Scope.DEFMETHOD("conflicting_def_shallow", function(name) {
    return this.enclosed.find((def) => def.name === name) || this.variables.has(name);
  });
  AST_Scope.DEFMETHOD("add_child_scope", function(scope) {
    if (scope.parent_scope === this) return;
    scope.parent_scope = this;
    if (scope instanceof AST_Arrow && (this instanceof AST_Lambda && !this.uses_arguments)) {
      this.uses_arguments = walk(scope, (node) => {
        if (node instanceof AST_SymbolRef && node.scope instanceof AST_Lambda && node.name === "arguments") {
          return walk_abort;
        }
        if (node instanceof AST_Lambda && !(node instanceof AST_Arrow)) {
          return true;
        }
      });
    }
    this.uses_with = this.uses_with || scope.uses_with;
    this.uses_eval = this.uses_eval || scope.uses_eval;
    const scope_ancestry = (() => {
      const ancestry = [];
      let cur = this;
      do {
        ancestry.push(cur);
      } while (cur = cur.parent_scope);
      ancestry.reverse();
      return ancestry;
    })();
    const new_scope_enclosed_set = new Set(scope.enclosed);
    const to_enclose = [];
    for (const scope_topdown of scope_ancestry) {
      to_enclose.forEach((e) => push_uniq(scope_topdown.enclosed, e));
      for (const def of scope_topdown.variables.values()) {
        if (new_scope_enclosed_set.has(def)) {
          push_uniq(to_enclose, def);
          push_uniq(scope_topdown.enclosed, def);
        }
      }
    }
  });
  function find_scopes_visible_from(scopes) {
    const found_scopes = /* @__PURE__ */ new Set();
    for (const scope of new Set(scopes)) {
      (function bubble_up(scope2) {
        if (scope2 == null || found_scopes.has(scope2)) return;
        found_scopes.add(scope2);
        bubble_up(scope2.parent_scope);
      })(scope);
    }
    return [...found_scopes];
  }
  AST_Scope.DEFMETHOD("create_symbol", function(SymClass, {
    source,
    tentative_name,
    scope,
    conflict_scopes = [scope],
    init = null
  } = {}) {
    let symbol_name;
    conflict_scopes = find_scopes_visible_from(conflict_scopes);
    if (tentative_name) {
      tentative_name = symbol_name = tentative_name.replace(/(?:^[^a-z_$]|[^a-z0-9_$])/ig, "_");
      let i = 0;
      while (conflict_scopes.find((s) => s.conflicting_def_shallow(symbol_name))) {
        symbol_name = tentative_name + "$" + i++;
      }
    }
    if (!symbol_name) {
      throw new Error("No symbol name could be generated in create_symbol()");
    }
    const symbol = make_node(SymClass, source, {
      name: symbol_name,
      scope
    });
    this.def_variable(symbol, init || null);
    symbol.mark_enclosed();
    return symbol;
  });
  AST_Node.DEFMETHOD("is_block_scope", return_false);
  AST_Class.DEFMETHOD("is_block_scope", return_false);
  AST_Lambda.DEFMETHOD("is_block_scope", return_false);
  AST_Toplevel.DEFMETHOD("is_block_scope", return_false);
  AST_SwitchBranch.DEFMETHOD("is_block_scope", return_false);
  AST_Block.DEFMETHOD("is_block_scope", return_true);
  AST_Scope.DEFMETHOD("is_block_scope", function() {
    return this._block_scope || false;
  });
  AST_IterationStatement.DEFMETHOD("is_block_scope", return_true);
  AST_Lambda.DEFMETHOD("init_scope_vars", function() {
    AST_Scope.prototype.init_scope_vars.apply(this, arguments);
    this.uses_arguments = false;
    this.def_variable(new AST_SymbolFunarg({
      name: "arguments",
      start: this.start,
      end: this.end
    }));
  });
  AST_Arrow.DEFMETHOD("init_scope_vars", function() {
    AST_Scope.prototype.init_scope_vars.apply(this, arguments);
    this.uses_arguments = false;
  });
  AST_Symbol.DEFMETHOD("mark_enclosed", function() {
    var def = this.definition();
    var s = this.scope;
    while (s) {
      push_uniq(s.enclosed, def);
      if (s === def.scope) break;
      s = s.parent_scope;
    }
  });
  AST_Symbol.DEFMETHOD("reference", function() {
    this.definition().references.push(this);
    this.mark_enclosed();
  });
  AST_Scope.DEFMETHOD("find_variable", function(name) {
    if (name instanceof AST_Symbol) name = name.name;
    return this.variables.get(name) || this.parent_scope && this.parent_scope.find_variable(name);
  });
  AST_Scope.DEFMETHOD("def_function", function(symbol, init) {
    var def = this.def_variable(symbol, init);
    if (!def.init || def.init instanceof AST_Defun) def.init = init;
    return def;
  });
  AST_Scope.DEFMETHOD("def_variable", function(symbol, init) {
    var def = this.variables.get(symbol.name);
    if (def) {
      def.orig.push(symbol);
      if (def.init && (def.scope !== symbol.scope || def.init instanceof AST_Function)) {
        def.init = init;
      }
    } else {
      def = new SymbolDef(this, symbol, init);
      this.variables.set(symbol.name, def);
      def.global = !this.parent_scope;
    }
    return symbol.thedef = def;
  });
  function next_mangled(scope, options) {
    let defun_scope;
    if (scopes_with_block_defuns && (defun_scope = scope.get_defun_scope()) && scopes_with_block_defuns.has(defun_scope)) {
      scope = defun_scope;
    }
    var ext = scope.enclosed;
    var nth_identifier = options.nth_identifier;
    out: while (true) {
      var m = nth_identifier.get(++scope.cname);
      if (ALL_RESERVED_WORDS.has(m)) continue;
      if (options.reserved.has(m)) continue;
      if (unmangleable_names && unmangleable_names.has(m)) continue out;
      for (let i = ext.length; --i >= 0; ) {
        const def = ext[i];
        const name = def.mangled_name || def.unmangleable(options) && def.name;
        if (m == name) continue out;
      }
      return m;
    }
  }
  AST_Scope.DEFMETHOD("next_mangled", function(options) {
    return next_mangled(this, options);
  });
  AST_Toplevel.DEFMETHOD("next_mangled", function(options) {
    let name;
    const mangled_names = this.mangled_names;
    do {
      name = next_mangled(this, options);
    } while (mangled_names.has(name));
    return name;
  });
  AST_Function.DEFMETHOD("next_mangled", function(options, def) {
    var tricky_def = def.orig[0] instanceof AST_SymbolFunarg && this.name && this.name.definition();
    var tricky_name = tricky_def ? tricky_def.mangled_name || tricky_def.name : null;
    while (true) {
      var name = next_mangled(this, options);
      if (!tricky_name || tricky_name != name)
        return name;
    }
  });
  AST_Symbol.DEFMETHOD("unmangleable", function(options) {
    var def = this.definition();
    return !def || def.unmangleable(options);
  });
  AST_Label.DEFMETHOD("unmangleable", return_false);
  AST_Symbol.DEFMETHOD("unreferenced", function() {
    return !this.definition().references.length && !this.scope.pinned();
  });
  AST_Symbol.DEFMETHOD("definition", function() {
    return this.thedef;
  });
  AST_Symbol.DEFMETHOD("global", function() {
    return this.thedef.global;
  });
  function format_mangler_options(options) {
    options = defaults(options, {
      eval: false,
      nth_identifier: base54,
      ie8: false,
      keep_classnames: false,
      keep_fnames: false,
      module: false,
      reserved: [],
      toplevel: false
    });
    if (options.module) options.toplevel = true;
    if (!Array.isArray(options.reserved) && !(options.reserved instanceof Set)) {
      options.reserved = [];
    }
    options.reserved = new Set(options.reserved);
    options.reserved.add("arguments");
    return options;
  }
  AST_Toplevel.DEFMETHOD("mangle_names", function(options) {
    options = format_mangler_options(options);
    var nth_identifier = options.nth_identifier;
    var lname = -1;
    var to_mangle = [];
    if (options.keep_fnames) {
      function_defs = /* @__PURE__ */ new Set();
    }
    const mangled_names = this.mangled_names = /* @__PURE__ */ new Set();
    unmangleable_names = /* @__PURE__ */ new Set();
    if (options.cache) {
      this.globals.forEach(collect);
      if (options.cache.props) {
        options.cache.props.forEach(function(mangled_name) {
          mangled_names.add(mangled_name);
        });
      }
    }
    var tw = new TreeWalker(function(node, descend) {
      if (node instanceof AST_LabeledStatement) {
        var save_nesting = lname;
        descend();
        lname = save_nesting;
        return true;
      }
      if (node instanceof AST_Defun && !(tw.parent() instanceof AST_Scope)) {
        scopes_with_block_defuns = scopes_with_block_defuns || /* @__PURE__ */ new Set();
        scopes_with_block_defuns.add(node.parent_scope.get_defun_scope());
      }
      if (node instanceof AST_Scope) {
        node.variables.forEach(collect);
        return;
      }
      if (node.is_block_scope()) {
        node.block_scope.variables.forEach(collect);
        return;
      }
      if (function_defs && node instanceof AST_VarDef && node.value instanceof AST_Lambda && !node.value.name && keep_name(options.keep_fnames, node.name.name)) {
        function_defs.add(node.name.definition().id);
        return;
      }
      if (node instanceof AST_Label) {
        let name;
        do {
          name = nth_identifier.get(++lname);
        } while (ALL_RESERVED_WORDS.has(name));
        node.mangled_name = name;
        return true;
      }
      if (!(options.ie8 || options.safari10) && node instanceof AST_SymbolCatch) {
        to_mangle.push(node.definition());
        return;
      }
    });
    this.walk(tw);
    if (options.keep_fnames || options.keep_classnames) {
      to_mangle.forEach((def) => {
        if (def.name.length < 6 && def.unmangleable(options)) {
          unmangleable_names.add(def.name);
        }
      });
    }
    to_mangle.forEach((def) => {
      def.mangle(options);
    });
    function_defs = null;
    unmangleable_names = null;
    scopes_with_block_defuns = null;
    function collect(symbol) {
      if (symbol.export & MASK_EXPORT_DONT_MANGLE) {
        unmangleable_names.add(symbol.name);
      } else if (!options.reserved.has(symbol.name)) {
        to_mangle.push(symbol);
      }
    }
  });
  AST_Toplevel.DEFMETHOD("find_colliding_names", function(options) {
    const cache = options.cache && options.cache.props;
    const avoid = /* @__PURE__ */ new Set();
    options.reserved.forEach(to_avoid);
    this.globals.forEach(add_def);
    this.walk(new TreeWalker(function(node) {
      if (node instanceof AST_Scope) node.variables.forEach(add_def);
      if (node instanceof AST_SymbolCatch) add_def(node.definition());
    }));
    return avoid;
    function to_avoid(name) {
      avoid.add(name);
    }
    function add_def(def) {
      var name = def.name;
      if (def.global && cache && cache.has(name)) name = cache.get(name);
      else if (!def.unmangleable(options)) return;
      to_avoid(name);
    }
  });
  AST_Toplevel.DEFMETHOD("expand_names", function(options) {
    options = format_mangler_options(options);
    var nth_identifier = options.nth_identifier;
    if (nth_identifier.reset && nth_identifier.sort) {
      nth_identifier.reset();
      nth_identifier.sort();
    }
    var avoid = this.find_colliding_names(options);
    var cname = 0;
    this.globals.forEach(rename);
    this.walk(new TreeWalker(function(node) {
      if (node instanceof AST_Scope) node.variables.forEach(rename);
      if (node instanceof AST_SymbolCatch) rename(node.definition());
    }));
    function next_name() {
      var name;
      do {
        name = nth_identifier.get(cname++);
      } while (avoid.has(name) || ALL_RESERVED_WORDS.has(name));
      return name;
    }
    function rename(def) {
      if (def.global && options.cache) return;
      if (def.unmangleable(options)) return;
      if (options.reserved.has(def.name)) return;
      const redefinition = redefined_catch_def(def);
      const name = def.name = redefinition ? redefinition.name : next_name();
      def.orig.forEach(function(sym) {
        sym.name = name;
      });
      def.references.forEach(function(sym) {
        sym.name = name;
      });
    }
  });
  AST_Node.DEFMETHOD("tail_node", return_this);
  AST_Sequence.DEFMETHOD("tail_node", function() {
    return this.expressions[this.expressions.length - 1];
  });
  AST_Toplevel.DEFMETHOD("compute_char_frequency", function(options) {
    options = format_mangler_options(options);
    var nth_identifier = options.nth_identifier;
    if (!nth_identifier.reset || !nth_identifier.consider || !nth_identifier.sort) {
      return;
    }
    nth_identifier.reset();
    try {
      AST_Node.prototype.print = function(stream, force_parens) {
        this._print(stream, force_parens);
        if (this instanceof AST_Symbol && !this.unmangleable(options)) {
          nth_identifier.consider(this.name, -1);
        } else if (options.properties) {
          if (this instanceof AST_DotHash) {
            nth_identifier.consider("#" + this.property, -1);
          } else if (this instanceof AST_Dot) {
            nth_identifier.consider(this.property, -1);
          } else if (this instanceof AST_Sub) {
            skip_string(this.property);
          }
        }
      };
      nth_identifier.consider(this.print_to_string(), 1);
    } finally {
      AST_Node.prototype.print = AST_Node.prototype._print;
    }
    nth_identifier.sort();
    function skip_string(node) {
      if (node instanceof AST_String) {
        nth_identifier.consider(node.value, -1);
      } else if (node instanceof AST_Conditional) {
        skip_string(node.consequent);
        skip_string(node.alternative);
      } else if (node instanceof AST_Sequence) {
        skip_string(node.tail_node());
      }
    }
  });
  var base54 = (() => {
    const leading = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_".split("");
    const digits = "0123456789".split("");
    let chars;
    let frequency;
    function reset() {
      frequency = /* @__PURE__ */ new Map();
      leading.forEach(function(ch) {
        frequency.set(ch, 0);
      });
      digits.forEach(function(ch) {
        frequency.set(ch, 0);
      });
    }
    function consider(str, delta) {
      for (var i = str.length; --i >= 0; ) {
        frequency.set(str[i], frequency.get(str[i]) + delta);
      }
    }
    function compare(a, b) {
      return frequency.get(b) - frequency.get(a);
    }
    function sort() {
      chars = mergeSort(leading, compare).concat(mergeSort(digits, compare));
    }
    reset();
    sort();
    function base542(num) {
      var ret = "", base = 54;
      num++;
      do {
        num--;
        ret += chars[num % base];
        num = Math.floor(num / base);
        base = 64;
      } while (num > 0);
      return ret;
    }
    return {
      get: base542,
      consider,
      reset,
      sort
    };
  })();

  // node_modules/terser/lib/size.js
  var mangle_options = void 0;
  AST_Node.prototype.size = function(compressor, stack) {
    mangle_options = compressor && compressor._mangle_options;
    let size = 0;
    walk_parent(this, (node, info) => {
      size += node._size(info);
      if (node instanceof AST_Arrow && node.is_braceless()) {
        size += node.body[0].value._size(info);
        return true;
      }
    }, stack || compressor && compressor.stack);
    mangle_options = void 0;
    return size;
  };
  AST_Node.prototype._size = () => 0;
  AST_Debugger.prototype._size = () => 8;
  AST_Directive.prototype._size = function() {
    return 2 + this.value.length;
  };
  var list_overhead = (array) => array.length && array.length - 1;
  AST_Block.prototype._size = function() {
    return 2 + list_overhead(this.body);
  };
  AST_Toplevel.prototype._size = function() {
    return list_overhead(this.body);
  };
  AST_EmptyStatement.prototype._size = () => 1;
  AST_LabeledStatement.prototype._size = () => 2;
  AST_Do.prototype._size = () => 9;
  AST_While.prototype._size = () => 7;
  AST_For.prototype._size = () => 8;
  AST_ForIn.prototype._size = () => 8;
  AST_With.prototype._size = () => 6;
  AST_Expansion.prototype._size = () => 3;
  var lambda_modifiers = (func) => (func.is_generator ? 1 : 0) + (func.async ? 6 : 0);
  AST_Accessor.prototype._size = function() {
    return lambda_modifiers(this) + 4 + list_overhead(this.argnames) + list_overhead(this.body);
  };
  AST_Function.prototype._size = function(info) {
    const first = !!first_in_statement(info);
    return first * 2 + lambda_modifiers(this) + 12 + list_overhead(this.argnames) + list_overhead(this.body);
  };
  AST_Defun.prototype._size = function() {
    return lambda_modifiers(this) + 13 + list_overhead(this.argnames) + list_overhead(this.body);
  };
  AST_Arrow.prototype._size = function() {
    let args_and_arrow = 2 + list_overhead(this.argnames);
    if (!(this.argnames.length === 1 && this.argnames[0] instanceof AST_Symbol)) {
      args_and_arrow += 2;
    }
    const body_overhead = this.is_braceless() ? 0 : list_overhead(this.body) + 2;
    return lambda_modifiers(this) + args_and_arrow + body_overhead;
  };
  AST_Destructuring.prototype._size = () => 2;
  AST_TemplateString.prototype._size = function() {
    return 2 + Math.floor(this.segments.length / 2) * 3;
  };
  AST_TemplateSegment.prototype._size = function() {
    return this.value.length;
  };
  AST_Return.prototype._size = function() {
    return this.value ? 7 : 6;
  };
  AST_Throw.prototype._size = () => 6;
  AST_Break.prototype._size = function() {
    return this.label ? 6 : 5;
  };
  AST_Continue.prototype._size = function() {
    return this.label ? 9 : 8;
  };
  AST_If.prototype._size = () => 4;
  AST_Switch.prototype._size = function() {
    return 8 + list_overhead(this.body);
  };
  AST_Case.prototype._size = function() {
    return 5 + list_overhead(this.body);
  };
  AST_Default.prototype._size = function() {
    return 8 + list_overhead(this.body);
  };
  AST_Try.prototype._size = () => 3;
  AST_Catch.prototype._size = function() {
    let size = 7 + list_overhead(this.body);
    if (this.argname) {
      size += 2;
    }
    return size;
  };
  AST_Finally.prototype._size = function() {
    return 7 + list_overhead(this.body);
  };
  AST_Var.prototype._size = function() {
    return 4 + list_overhead(this.definitions);
  };
  AST_Let.prototype._size = function() {
    return 4 + list_overhead(this.definitions);
  };
  AST_Const.prototype._size = function() {
    return 6 + list_overhead(this.definitions);
  };
  AST_VarDef.prototype._size = function() {
    return this.value ? 1 : 0;
  };
  AST_NameMapping.prototype._size = function() {
    return this.name ? 4 : 0;
  };
  AST_Import.prototype._size = function() {
    let size = 6;
    if (this.imported_name) size += 1;
    if (this.imported_name || this.imported_names) size += 5;
    if (this.imported_names) {
      size += 2 + list_overhead(this.imported_names);
    }
    return size;
  };
  AST_ImportMeta.prototype._size = () => 11;
  AST_Export.prototype._size = function() {
    let size = 7 + (this.is_default ? 8 : 0);
    if (this.exported_value) {
      size += this.exported_value._size();
    }
    if (this.exported_names) {
      size += 2 + list_overhead(this.exported_names);
    }
    if (this.module_name) {
      size += 5;
    }
    return size;
  };
  AST_Call.prototype._size = function() {
    if (this.optional) {
      return 4 + list_overhead(this.args);
    }
    return 2 + list_overhead(this.args);
  };
  AST_New.prototype._size = function() {
    return 6 + list_overhead(this.args);
  };
  AST_Sequence.prototype._size = function() {
    return list_overhead(this.expressions);
  };
  AST_Dot.prototype._size = function() {
    if (this.optional) {
      return this.property.length + 2;
    }
    return this.property.length + 1;
  };
  AST_DotHash.prototype._size = function() {
    if (this.optional) {
      return this.property.length + 3;
    }
    return this.property.length + 2;
  };
  AST_Sub.prototype._size = function() {
    return this.optional ? 4 : 2;
  };
  AST_Unary.prototype._size = function() {
    if (this.operator === "typeof") return 7;
    if (this.operator === "void") return 5;
    return this.operator.length;
  };
  AST_Binary.prototype._size = function(info) {
    if (this.operator === "in") return 4;
    let size = this.operator.length;
    if ((this.operator === "+" || this.operator === "-") && this.right instanceof AST_Unary && this.right.operator === this.operator) {
      size += 1;
    }
    if (this.needs_parens(info)) {
      size += 2;
    }
    return size;
  };
  AST_Conditional.prototype._size = () => 3;
  AST_Array.prototype._size = function() {
    return 2 + list_overhead(this.elements);
  };
  AST_Object.prototype._size = function(info) {
    let base = 2;
    if (first_in_statement(info)) {
      base += 2;
    }
    return base + list_overhead(this.properties);
  };
  var key_size = (key) => typeof key === "string" ? key.length : 0;
  AST_ObjectKeyVal.prototype._size = function() {
    return key_size(this.key) + 1;
  };
  var static_size = (is_static) => is_static ? 7 : 0;
  AST_ObjectGetter.prototype._size = function() {
    return 5 + static_size(this.static) + key_size(this.key);
  };
  AST_ObjectSetter.prototype._size = function() {
    return 5 + static_size(this.static) + key_size(this.key);
  };
  AST_ConciseMethod.prototype._size = function() {
    return static_size(this.static) + key_size(this.key) + lambda_modifiers(this);
  };
  AST_PrivateMethod.prototype._size = function() {
    return AST_ConciseMethod.prototype._size.call(this) + 1;
  };
  AST_PrivateGetter.prototype._size = AST_PrivateSetter.prototype._size = function() {
    return AST_ConciseMethod.prototype._size.call(this) + 4;
  };
  AST_PrivateIn.prototype._size = function() {
    return 5;
  };
  AST_Class.prototype._size = function() {
    return (this.name ? 8 : 7) + (this.extends ? 8 : 0);
  };
  AST_ClassStaticBlock.prototype._size = function() {
    return 8 + list_overhead(this.body);
  };
  AST_ClassProperty.prototype._size = function() {
    return static_size(this.static) + (typeof this.key === "string" ? this.key.length + 2 : 0) + (this.value ? 1 : 0);
  };
  AST_ClassPrivateProperty.prototype._size = function() {
    return AST_ClassProperty.prototype._size.call(this) + 1;
  };
  AST_Symbol.prototype._size = function() {
    if (!(mangle_options && this.thedef && !this.thedef.unmangleable(mangle_options))) {
      return this.name.length;
    } else {
      return 1;
    }
  };
  AST_SymbolClassProperty.prototype._size = function() {
    return this.name.length;
  };
  AST_SymbolRef.prototype._size = AST_SymbolDeclaration.prototype._size = function() {
    if (this.name === "arguments") return 9;
    return AST_Symbol.prototype._size.call(this);
  };
  AST_NewTarget.prototype._size = () => 10;
  AST_SymbolImportForeign.prototype._size = function() {
    return this.name.length;
  };
  AST_SymbolExportForeign.prototype._size = function() {
    return this.name.length;
  };
  AST_This.prototype._size = () => 4;
  AST_Super.prototype._size = () => 5;
  AST_String.prototype._size = function() {
    return this.value.length + 2;
  };
  AST_Number.prototype._size = function() {
    const { value } = this;
    if (value === 0) return 1;
    if (value > 0 && Math.floor(value) === value) {
      return Math.floor(Math.log10(value) + 1);
    }
    return value.toString().length;
  };
  AST_BigInt.prototype._size = function() {
    return this.value.length;
  };
  AST_RegExp.prototype._size = function() {
    return this.value.toString().length;
  };
  AST_Null.prototype._size = () => 4;
  AST_NaN.prototype._size = () => 3;
  AST_Undefined.prototype._size = () => 6;
  AST_Hole.prototype._size = () => 0;
  AST_Infinity.prototype._size = () => 8;
  AST_True.prototype._size = () => 4;
  AST_False.prototype._size = () => 5;
  AST_Await.prototype._size = () => 6;
  AST_Yield.prototype._size = () => 6;

  // node_modules/terser/lib/compress/compressor-flags.js
  var UNUSED = 1;
  var TRUTHY = 2;
  var FALSY = 4;
  var UNDEFINED = 8;
  var INLINED = 16;
  var WRITE_ONLY = 32;
  var SQUEEZED = 256;
  var OPTIMIZED = 512;
  var TOP = 1024;
  var CLEAR_BETWEEN_PASSES = SQUEEZED | OPTIMIZED | TOP;
  var has_flag = (node, flag) => node.flags & flag;
  var set_flag = (node, flag) => {
    node.flags |= flag;
  };
  var clear_flag = (node, flag) => {
    node.flags &= ~flag;
  };

  // node_modules/terser/lib/compress/common.js
  function merge_sequence(array, node) {
    if (node instanceof AST_Sequence) {
      array.push(...node.expressions);
    } else {
      array.push(node);
    }
    return array;
  }
  function make_sequence(orig, expressions) {
    if (expressions.length == 1) return expressions[0];
    if (expressions.length == 0) throw new Error("trying to create a sequence with length zero!");
    return make_node(AST_Sequence, orig, {
      expressions: expressions.reduce(merge_sequence, [])
    });
  }
  function make_empty_function(self2) {
    return make_node(AST_Function, self2, {
      uses_arguments: false,
      argnames: [],
      body: [],
      is_generator: false,
      async: false,
      variables: /* @__PURE__ */ new Map(),
      uses_with: false,
      uses_eval: false,
      parent_scope: null,
      enclosed: [],
      cname: 0,
      block_scope: void 0
    });
  }
  function make_node_from_constant(val, orig) {
    switch (typeof val) {
      case "string":
        return make_node(AST_String, orig, {
          value: val
        });
      case "number":
        if (isNaN(val)) return make_node(AST_NaN, orig);
        if (isFinite(val)) {
          return 1 / val < 0 ? make_node(AST_UnaryPrefix, orig, {
            operator: "-",
            expression: make_node(AST_Number, orig, { value: -val })
          }) : make_node(AST_Number, orig, { value: val });
        }
        return val < 0 ? make_node(AST_UnaryPrefix, orig, {
          operator: "-",
          expression: make_node(AST_Infinity, orig)
        }) : make_node(AST_Infinity, orig);
      case "bigint":
        return make_node(AST_BigInt, orig, { value: val.toString() });
      case "boolean":
        return make_node(val ? AST_True : AST_False, orig);
      case "undefined":
        return make_node(AST_Undefined, orig);
      default:
        if (val === null) {
          return make_node(AST_Null, orig, { value: null });
        }
        if (val instanceof RegExp) {
          return make_node(AST_RegExp, orig, {
            value: {
              source: regexp_source_fix(val.source),
              flags: val.flags
            }
          });
        }
        throw new Error(string_template("Can't handle constant of type: {type}", {
          type: typeof val
        }));
    }
  }
  function best_of_expression(ast1, ast2) {
    return ast1.size() > ast2.size() ? ast2 : ast1;
  }
  function best_of_statement(ast1, ast2) {
    return best_of_expression(
      make_node(AST_SimpleStatement, ast1, {
        body: ast1
      }),
      make_node(AST_SimpleStatement, ast2, {
        body: ast2
      })
    ).body;
  }
  function best_of(compressor, ast1, ast2) {
    if (first_in_statement(compressor)) {
      return best_of_statement(ast1, ast2);
    } else {
      return best_of_expression(ast1, ast2);
    }
  }
  function get_simple_key(key) {
    if (key instanceof AST_Constant) {
      return key.getValue();
    }
    if (key instanceof AST_UnaryPrefix && key.operator == "void" && key.expression instanceof AST_Constant) {
      return;
    }
    return key;
  }
  function read_property(obj, key) {
    key = get_simple_key(key);
    if (key instanceof AST_Node) return;
    var value;
    if (obj instanceof AST_Array) {
      var elements = obj.elements;
      if (key == "length") return make_node_from_constant(elements.length, obj);
      if (typeof key == "number" && key in elements) value = elements[key];
    } else if (obj instanceof AST_Object) {
      key = "" + key;
      var props = obj.properties;
      for (var i = props.length; --i >= 0; ) {
        var prop = props[i];
        if (!(prop instanceof AST_ObjectKeyVal)) return;
        if (!value && props[i].key === key) value = props[i].value;
      }
    }
    return value instanceof AST_SymbolRef && value.fixed_value() || value;
  }
  function has_break_or_continue(loop, parent) {
    var found = false;
    var tw = new TreeWalker(function(node) {
      if (found || node instanceof AST_Scope) return true;
      if (node instanceof AST_LoopControl && tw.loopcontrol_target(node) === loop) {
        return found = true;
      }
    });
    if (parent instanceof AST_LabeledStatement) tw.push(parent);
    tw.push(loop);
    loop.body.walk(tw);
    return found;
  }
  function maintain_this_binding(parent, orig, val) {
    if (requires_sequence_to_maintain_binding(parent, orig, val)) {
      const zero = make_node(AST_Number, orig, { value: 0 });
      return make_sequence(orig, [zero, val]);
    } else {
      return val;
    }
  }
  function requires_sequence_to_maintain_binding(parent, orig, val) {
    return parent instanceof AST_UnaryPrefix && parent.operator == "delete" || parent instanceof AST_Call && parent.expression === orig && (val instanceof AST_Chain || val instanceof AST_PropAccess || val instanceof AST_SymbolRef && val.name == "eval");
  }
  function is_func_expr(node) {
    return node instanceof AST_Arrow || node instanceof AST_Function;
  }
  function is_iife_call(node) {
    if (node.TYPE != "Call") return false;
    return node.expression instanceof AST_Function || is_iife_call(node.expression);
  }
  function is_empty(thing) {
    if (thing === null) return true;
    if (thing instanceof AST_EmptyStatement) return true;
    if (thing instanceof AST_BlockStatement) return thing.body.length == 0;
    return false;
  }
  var identifier_atom = makePredicate("Infinity NaN undefined");
  function is_identifier_atom(node) {
    return node instanceof AST_Infinity || node instanceof AST_NaN || node instanceof AST_Undefined;
  }
  function is_ref_of(ref, type) {
    if (!(ref instanceof AST_SymbolRef)) return false;
    var orig = ref.definition().orig;
    for (var i = orig.length; --i >= 0; ) {
      if (orig[i] instanceof type) return true;
    }
  }
  function can_be_evicted_from_block(node) {
    return !(node instanceof AST_DefClass || node instanceof AST_Defun || node instanceof AST_Let || node instanceof AST_Const || node instanceof AST_Export || node instanceof AST_Import);
  }
  function as_statement_array(thing) {
    if (thing === null) return [];
    if (thing instanceof AST_BlockStatement) return thing.body;
    if (thing instanceof AST_EmptyStatement) return [];
    if (thing instanceof AST_Statement) return [thing];
    throw new Error("Can't convert thing to statement array");
  }
  function is_reachable(scope_node, defs) {
    const find_ref = (node) => {
      if (node instanceof AST_SymbolRef && defs.includes(node.definition())) {
        return walk_abort;
      }
    };
    return walk_parent(scope_node, (node, info) => {
      if (node instanceof AST_Scope && node !== scope_node) {
        var parent = info.parent();
        if (parent instanceof AST_Call && parent.expression === node && !(node.async || node.is_generator)) {
          return;
        }
        if (walk(node, find_ref)) return walk_abort;
        return true;
      }
    });
  }
  function is_recursive_ref(tw, def) {
    var node;
    for (var i = 0; node = tw.parent(i); i++) {
      if (node instanceof AST_Lambda || node instanceof AST_Class) {
        var name = node.name;
        if (name && name.definition() === def) {
          return true;
        }
      }
    }
    return false;
  }
  function retain_top_func(fn, compressor) {
    return compressor.top_retain && fn instanceof AST_Defun && has_flag(fn, TOP) && fn.name && compressor.top_retain(fn.name.definition());
  }

  // node_modules/terser/lib/compress/native-objects.js
  function make_nested_lookup(obj) {
    const out = /* @__PURE__ */ new Map();
    for (var key of Object.keys(obj)) {
      out.set(key, makePredicate(obj[key]));
    }
    const does_have = (global_name, fname) => {
      const inner_map = out.get(global_name);
      return inner_map != null && inner_map.has(fname);
    };
    return does_have;
  }
  var pure_prop_access_globals = /* @__PURE__ */ new Set([
    "Number",
    "String",
    "Array",
    "Object",
    "Function",
    "Promise"
  ]);
  var object_methods = [
    "constructor",
    "toString",
    "valueOf"
  ];
  var is_pure_native_method = make_nested_lookup({
    Array: [
      "at",
      "flat",
      "includes",
      "indexOf",
      "join",
      "lastIndexOf",
      "slice",
      ...object_methods
    ],
    Boolean: object_methods,
    Function: object_methods,
    Number: [
      "toExponential",
      "toFixed",
      "toPrecision",
      ...object_methods
    ],
    Object: object_methods,
    RegExp: [
      "test",
      ...object_methods
    ],
    String: [
      "at",
      "charAt",
      "charCodeAt",
      "charPointAt",
      "concat",
      "endsWith",
      "fromCharCode",
      "fromCodePoint",
      "includes",
      "indexOf",
      "italics",
      "lastIndexOf",
      "localeCompare",
      "match",
      "matchAll",
      "normalize",
      "padStart",
      "padEnd",
      "repeat",
      "replace",
      "replaceAll",
      "search",
      "slice",
      "split",
      "startsWith",
      "substr",
      "substring",
      "repeat",
      "toLocaleLowerCase",
      "toLocaleUpperCase",
      "toLowerCase",
      "toUpperCase",
      "trim",
      "trimEnd",
      "trimStart",
      ...object_methods
    ]
  });
  var is_pure_native_fn = make_nested_lookup({
    Array: [
      "isArray"
    ],
    Math: [
      "abs",
      "acos",
      "asin",
      "atan",
      "ceil",
      "cos",
      "exp",
      "floor",
      "log",
      "round",
      "sin",
      "sqrt",
      "tan",
      "atan2",
      "pow",
      "max",
      "min"
    ],
    Number: [
      "isFinite",
      "isNaN"
    ],
    Object: [
      "create",
      "getOwnPropertyDescriptor",
      "getOwnPropertyNames",
      "getPrototypeOf",
      "isExtensible",
      "isFrozen",
      "isSealed",
      "hasOwn",
      "keys"
    ],
    String: [
      "fromCharCode"
    ]
  });
  var is_pure_native_value = make_nested_lookup({
    Math: [
      "E",
      "LN10",
      "LN2",
      "LOG2E",
      "LOG10E",
      "PI",
      "SQRT1_2",
      "SQRT2"
    ],
    Number: [
      "MAX_VALUE",
      "MIN_VALUE",
      "NaN",
      "NEGATIVE_INFINITY",
      "POSITIVE_INFINITY"
    ]
  });

  // node_modules/terser/lib/compress/inference.js
  var is_undeclared_ref = (node) => node instanceof AST_SymbolRef && node.definition().undeclared;
  var bitwise_binop = makePredicate("<<< >> << & | ^ ~");
  var lazy_op = makePredicate("&& || ??");
  var unary_side_effects = makePredicate("delete ++ --");
  (function(def_is_boolean) {
    const unary_bool = makePredicate("! delete");
    const binary_bool = makePredicate("in instanceof == != === !== < <= >= >");
    def_is_boolean(AST_Node, return_false);
    def_is_boolean(AST_UnaryPrefix, function() {
      return unary_bool.has(this.operator);
    });
    def_is_boolean(AST_Binary, function() {
      return binary_bool.has(this.operator) || lazy_op.has(this.operator) && this.left.is_boolean() && this.right.is_boolean();
    });
    def_is_boolean(AST_Conditional, function() {
      return this.consequent.is_boolean() && this.alternative.is_boolean();
    });
    def_is_boolean(AST_Assign, function() {
      return this.operator == "=" && this.right.is_boolean();
    });
    def_is_boolean(AST_Sequence, function() {
      return this.tail_node().is_boolean();
    });
    def_is_boolean(AST_True, return_true);
    def_is_boolean(AST_False, return_true);
  })(function(node, func) {
    node.DEFMETHOD("is_boolean", func);
  });
  (function(def_is_number) {
    def_is_number(AST_Node, return_false);
    def_is_number(AST_Number, return_true);
    const unary = makePredicate("+ - ~ ++ --");
    def_is_number(AST_Unary, function() {
      return unary.has(this.operator) && !(this.expression instanceof AST_BigInt);
    });
    const numeric_ops = makePredicate("- * / % & | ^ << >> >>>");
    def_is_number(AST_Binary, function(compressor) {
      return numeric_ops.has(this.operator) || this.operator == "+" && this.left.is_number(compressor) && this.right.is_number(compressor);
    });
    def_is_number(AST_Assign, function(compressor) {
      return numeric_ops.has(this.operator.slice(0, -1)) || this.operator == "=" && this.right.is_number(compressor);
    });
    def_is_number(AST_Sequence, function(compressor) {
      return this.tail_node().is_number(compressor);
    });
    def_is_number(AST_Conditional, function(compressor) {
      return this.consequent.is_number(compressor) && this.alternative.is_number(compressor);
    });
  })(function(node, func) {
    node.DEFMETHOD("is_number", func);
  });
  (function(def_is_32_bit_integer) {
    def_is_32_bit_integer(AST_Node, return_false);
    def_is_32_bit_integer(AST_Number, function() {
      return this.value === (this.value | 0);
    });
    def_is_32_bit_integer(AST_UnaryPrefix, function() {
      return this.operator == "~" ? this.expression.is_number() : this.operator === "+" ? this.expression.is_32_bit_integer() : false;
    });
    def_is_32_bit_integer(AST_Binary, function() {
      return bitwise_binop.has(this.operator);
    });
  })(function(node, func) {
    node.DEFMETHOD("is_32_bit_integer", func);
  });
  (function(def_is_string) {
    def_is_string(AST_Node, return_false);
    def_is_string(AST_String, return_true);
    def_is_string(AST_TemplateString, return_true);
    def_is_string(AST_UnaryPrefix, function() {
      return this.operator == "typeof";
    });
    def_is_string(AST_Binary, function(compressor) {
      return this.operator == "+" && (this.left.is_string(compressor) || this.right.is_string(compressor));
    });
    def_is_string(AST_Assign, function(compressor) {
      return (this.operator == "=" || this.operator == "+=") && this.right.is_string(compressor);
    });
    def_is_string(AST_Sequence, function(compressor) {
      return this.tail_node().is_string(compressor);
    });
    def_is_string(AST_Conditional, function(compressor) {
      return this.consequent.is_string(compressor) && this.alternative.is_string(compressor);
    });
  })(function(node, func) {
    node.DEFMETHOD("is_string", func);
  });
  function is_undefined(node, compressor) {
    return has_flag(node, UNDEFINED) || node instanceof AST_Undefined || node instanceof AST_UnaryPrefix && node.operator == "void" && !node.expression.has_side_effects(compressor);
  }
  function is_null_or_undefined(node, compressor) {
    let fixed;
    return node instanceof AST_Null || is_undefined(node, compressor) || node instanceof AST_SymbolRef && (fixed = node.definition().fixed) instanceof AST_Node && is_nullish(fixed, compressor);
  }
  function is_nullish_shortcircuited(node, compressor) {
    if (node instanceof AST_PropAccess || node instanceof AST_Call) {
      return node.optional && is_null_or_undefined(node.expression, compressor) || is_nullish_shortcircuited(node.expression, compressor);
    }
    if (node instanceof AST_Chain) return is_nullish_shortcircuited(node.expression, compressor);
    return false;
  }
  function is_nullish(node, compressor) {
    if (is_null_or_undefined(node, compressor)) return true;
    return is_nullish_shortcircuited(node, compressor);
  }
  (function(def_has_side_effects) {
    def_has_side_effects(AST_Node, return_true);
    def_has_side_effects(AST_EmptyStatement, return_false);
    def_has_side_effects(AST_Constant, return_false);
    def_has_side_effects(AST_This, return_false);
    function any(list, compressor) {
      for (var i = list.length; --i >= 0; )
        if (list[i].has_side_effects(compressor))
          return true;
      return false;
    }
    def_has_side_effects(AST_Block, function(compressor) {
      return any(this.body, compressor);
    });
    def_has_side_effects(AST_Call, function(compressor) {
      if (!this.is_callee_pure(compressor) && (!this.expression.is_call_pure(compressor) || this.expression.has_side_effects(compressor))) {
        return true;
      }
      return any(this.args, compressor);
    });
    def_has_side_effects(AST_Switch, function(compressor) {
      return this.expression.has_side_effects(compressor) || any(this.body, compressor);
    });
    def_has_side_effects(AST_Case, function(compressor) {
      return this.expression.has_side_effects(compressor) || any(this.body, compressor);
    });
    def_has_side_effects(AST_Try, function(compressor) {
      return this.body.has_side_effects(compressor) || this.bcatch && this.bcatch.has_side_effects(compressor) || this.bfinally && this.bfinally.has_side_effects(compressor);
    });
    def_has_side_effects(AST_If, function(compressor) {
      return this.condition.has_side_effects(compressor) || this.body && this.body.has_side_effects(compressor) || this.alternative && this.alternative.has_side_effects(compressor);
    });
    def_has_side_effects(AST_ImportMeta, return_false);
    def_has_side_effects(AST_LabeledStatement, function(compressor) {
      return this.body.has_side_effects(compressor);
    });
    def_has_side_effects(AST_SimpleStatement, function(compressor) {
      return this.body.has_side_effects(compressor);
    });
    def_has_side_effects(AST_Lambda, return_false);
    def_has_side_effects(AST_Class, function(compressor) {
      if (this.extends && this.extends.has_side_effects(compressor)) {
        return true;
      }
      return any(this.properties, compressor);
    });
    def_has_side_effects(AST_ClassStaticBlock, function(compressor) {
      return any(this.body, compressor);
    });
    def_has_side_effects(AST_Binary, function(compressor) {
      return this.left.has_side_effects(compressor) || this.right.has_side_effects(compressor);
    });
    def_has_side_effects(AST_Assign, return_true);
    def_has_side_effects(AST_Conditional, function(compressor) {
      return this.condition.has_side_effects(compressor) || this.consequent.has_side_effects(compressor) || this.alternative.has_side_effects(compressor);
    });
    def_has_side_effects(AST_Unary, function(compressor) {
      return unary_side_effects.has(this.operator) || this.expression.has_side_effects(compressor);
    });
    def_has_side_effects(AST_SymbolRef, function(compressor) {
      return !this.is_declared(compressor) && !pure_prop_access_globals.has(this.name);
    });
    def_has_side_effects(AST_SymbolClassProperty, return_false);
    def_has_side_effects(AST_SymbolDeclaration, return_false);
    def_has_side_effects(AST_Object, function(compressor) {
      return any(this.properties, compressor);
    });
    def_has_side_effects(AST_ObjectProperty, function(compressor) {
      return this.computed_key() && this.key.has_side_effects(compressor) || this.value && this.value.has_side_effects(compressor);
    });
    def_has_side_effects(AST_ClassProperty, function(compressor) {
      return this.computed_key() && this.key.has_side_effects(compressor) || this.static && this.value && this.value.has_side_effects(compressor);
    });
    def_has_side_effects(AST_ConciseMethod, function(compressor) {
      return this.computed_key() && this.key.has_side_effects(compressor);
    });
    def_has_side_effects(AST_ObjectGetter, function(compressor) {
      return this.computed_key() && this.key.has_side_effects(compressor);
    });
    def_has_side_effects(AST_ObjectSetter, function(compressor) {
      return this.computed_key() && this.key.has_side_effects(compressor);
    });
    def_has_side_effects(AST_Array, function(compressor) {
      return any(this.elements, compressor);
    });
    def_has_side_effects(AST_Dot, function(compressor) {
      if (is_nullish(this, compressor)) {
        return this.expression.has_side_effects(compressor);
      }
      if (!this.optional && this.expression.may_throw_on_access(compressor)) {
        return true;
      }
      return this.expression.has_side_effects(compressor);
    });
    def_has_side_effects(AST_Sub, function(compressor) {
      if (is_nullish(this, compressor)) {
        return this.expression.has_side_effects(compressor);
      }
      if (!this.optional && this.expression.may_throw_on_access(compressor)) {
        return true;
      }
      var property = this.property.has_side_effects(compressor);
      if (property && this.optional) return true;
      return property || this.expression.has_side_effects(compressor);
    });
    def_has_side_effects(AST_Chain, function(compressor) {
      return this.expression.has_side_effects(compressor);
    });
    def_has_side_effects(AST_Sequence, function(compressor) {
      return any(this.expressions, compressor);
    });
    def_has_side_effects(AST_Definitions, function(compressor) {
      return any(this.definitions, compressor);
    });
    def_has_side_effects(AST_VarDef, function() {
      return this.value != null;
    });
    def_has_side_effects(AST_TemplateSegment, return_false);
    def_has_side_effects(AST_TemplateString, function(compressor) {
      return any(this.segments, compressor);
    });
  })(function(node, func) {
    node.DEFMETHOD("has_side_effects", func);
  });
  (function(def_may_throw) {
    def_may_throw(AST_Node, return_true);
    def_may_throw(AST_Constant, return_false);
    def_may_throw(AST_EmptyStatement, return_false);
    def_may_throw(AST_Lambda, return_false);
    def_may_throw(AST_SymbolDeclaration, return_false);
    def_may_throw(AST_This, return_false);
    def_may_throw(AST_ImportMeta, return_false);
    function any(list, compressor) {
      for (var i = list.length; --i >= 0; )
        if (list[i].may_throw(compressor))
          return true;
      return false;
    }
    def_may_throw(AST_Class, function(compressor) {
      if (this.extends && this.extends.may_throw(compressor)) return true;
      return any(this.properties, compressor);
    });
    def_may_throw(AST_ClassStaticBlock, function(compressor) {
      return any(this.body, compressor);
    });
    def_may_throw(AST_Array, function(compressor) {
      return any(this.elements, compressor);
    });
    def_may_throw(AST_Assign, function(compressor) {
      if (this.right.may_throw(compressor)) return true;
      if (!compressor.has_directive("use strict") && this.operator == "=" && this.left instanceof AST_SymbolRef) {
        return false;
      }
      return this.left.may_throw(compressor);
    });
    def_may_throw(AST_Binary, function(compressor) {
      return this.left.may_throw(compressor) || this.right.may_throw(compressor);
    });
    def_may_throw(AST_Block, function(compressor) {
      return any(this.body, compressor);
    });
    def_may_throw(AST_Call, function(compressor) {
      if (is_nullish(this, compressor)) return false;
      if (any(this.args, compressor)) return true;
      if (this.is_callee_pure(compressor)) return false;
      if (this.expression.may_throw(compressor)) return true;
      return !(this.expression instanceof AST_Lambda) || any(this.expression.body, compressor);
    });
    def_may_throw(AST_Case, function(compressor) {
      return this.expression.may_throw(compressor) || any(this.body, compressor);
    });
    def_may_throw(AST_Conditional, function(compressor) {
      return this.condition.may_throw(compressor) || this.consequent.may_throw(compressor) || this.alternative.may_throw(compressor);
    });
    def_may_throw(AST_Definitions, function(compressor) {
      return any(this.definitions, compressor);
    });
    def_may_throw(AST_If, function(compressor) {
      return this.condition.may_throw(compressor) || this.body && this.body.may_throw(compressor) || this.alternative && this.alternative.may_throw(compressor);
    });
    def_may_throw(AST_LabeledStatement, function(compressor) {
      return this.body.may_throw(compressor);
    });
    def_may_throw(AST_Object, function(compressor) {
      return any(this.properties, compressor);
    });
    def_may_throw(AST_ObjectProperty, function(compressor) {
      return this.value ? this.value.may_throw(compressor) : false;
    });
    def_may_throw(AST_ClassProperty, function(compressor) {
      return this.computed_key() && this.key.may_throw(compressor) || this.static && this.value && this.value.may_throw(compressor);
    });
    def_may_throw(AST_ConciseMethod, function(compressor) {
      return this.computed_key() && this.key.may_throw(compressor);
    });
    def_may_throw(AST_ObjectGetter, function(compressor) {
      return this.computed_key() && this.key.may_throw(compressor);
    });
    def_may_throw(AST_ObjectSetter, function(compressor) {
      return this.computed_key() && this.key.may_throw(compressor);
    });
    def_may_throw(AST_Return, function(compressor) {
      return this.value && this.value.may_throw(compressor);
    });
    def_may_throw(AST_Sequence, function(compressor) {
      return any(this.expressions, compressor);
    });
    def_may_throw(AST_SimpleStatement, function(compressor) {
      return this.body.may_throw(compressor);
    });
    def_may_throw(AST_Dot, function(compressor) {
      if (is_nullish(this, compressor)) return false;
      return !this.optional && this.expression.may_throw_on_access(compressor) || this.expression.may_throw(compressor);
    });
    def_may_throw(AST_Sub, function(compressor) {
      if (is_nullish(this, compressor)) return false;
      return !this.optional && this.expression.may_throw_on_access(compressor) || this.expression.may_throw(compressor) || this.property.may_throw(compressor);
    });
    def_may_throw(AST_Chain, function(compressor) {
      return this.expression.may_throw(compressor);
    });
    def_may_throw(AST_Switch, function(compressor) {
      return this.expression.may_throw(compressor) || any(this.body, compressor);
    });
    def_may_throw(AST_SymbolRef, function(compressor) {
      return !this.is_declared(compressor) && !pure_prop_access_globals.has(this.name);
    });
    def_may_throw(AST_SymbolClassProperty, return_false);
    def_may_throw(AST_Try, function(compressor) {
      return this.bcatch ? this.bcatch.may_throw(compressor) : this.body.may_throw(compressor) || this.bfinally && this.bfinally.may_throw(compressor);
    });
    def_may_throw(AST_Unary, function(compressor) {
      if (this.operator == "typeof" && this.expression instanceof AST_SymbolRef)
        return false;
      return this.expression.may_throw(compressor);
    });
    def_may_throw(AST_VarDef, function(compressor) {
      if (!this.value) return false;
      return this.value.may_throw(compressor);
    });
  })(function(node, func) {
    node.DEFMETHOD("may_throw", func);
  });
  (function(def_is_constant_expression) {
    function all_refs_local(scope) {
      let result = true;
      walk(this, (node) => {
        if (node instanceof AST_SymbolRef) {
          if (has_flag(this, INLINED)) {
            result = false;
            return walk_abort;
          }
          var def = node.definition();
          if (member(def, this.enclosed) && !this.variables.has(def.name)) {
            if (scope) {
              var scope_def = scope.find_variable(node);
              if (def.undeclared ? !scope_def : scope_def === def) {
                result = "f";
                return true;
              }
            }
            result = false;
            return walk_abort;
          }
          return true;
        }
        if (node instanceof AST_This && this instanceof AST_Arrow) {
          result = false;
          return walk_abort;
        }
      });
      return result;
    }
    def_is_constant_expression(AST_Node, return_false);
    def_is_constant_expression(AST_Constant, return_true);
    def_is_constant_expression(AST_Class, function(scope) {
      if (this.extends && !this.extends.is_constant_expression(scope)) {
        return false;
      }
      for (const prop of this.properties) {
        if (prop.computed_key() && !prop.key.is_constant_expression(scope)) {
          return false;
        }
        if (prop.static && prop.value && !prop.value.is_constant_expression(scope)) {
          return false;
        }
        if (prop instanceof AST_ClassStaticBlock) {
          return false;
        }
      }
      return all_refs_local.call(this, scope);
    });
    def_is_constant_expression(AST_Lambda, all_refs_local);
    def_is_constant_expression(AST_Unary, function() {
      return this.expression.is_constant_expression();
    });
    def_is_constant_expression(AST_Binary, function() {
      return this.left.is_constant_expression() && this.right.is_constant_expression();
    });
    def_is_constant_expression(AST_Array, function() {
      return this.elements.every((l) => l.is_constant_expression());
    });
    def_is_constant_expression(AST_Object, function() {
      return this.properties.every((l) => l.is_constant_expression());
    });
    def_is_constant_expression(AST_ObjectProperty, function() {
      return !!(!(this.key instanceof AST_Node) && this.value && this.value.is_constant_expression());
    });
  })(function(node, func) {
    node.DEFMETHOD("is_constant_expression", func);
  });
  (function(def_may_throw_on_access) {
    AST_Node.DEFMETHOD("may_throw_on_access", function(compressor) {
      return !compressor.option("pure_getters") || this._dot_throw(compressor);
    });
    function is_strict(compressor) {
      return /strict/.test(compressor.option("pure_getters"));
    }
    def_may_throw_on_access(AST_Node, is_strict);
    def_may_throw_on_access(AST_Null, return_true);
    def_may_throw_on_access(AST_Undefined, return_true);
    def_may_throw_on_access(AST_Constant, return_false);
    def_may_throw_on_access(AST_Array, return_false);
    def_may_throw_on_access(AST_Object, function(compressor) {
      if (!is_strict(compressor)) return false;
      for (var i = this.properties.length; --i >= 0; )
        if (this.properties[i]._dot_throw(compressor)) return true;
      return false;
    });
    def_may_throw_on_access(AST_Class, return_false);
    def_may_throw_on_access(AST_ObjectProperty, return_false);
    def_may_throw_on_access(AST_ObjectGetter, return_true);
    def_may_throw_on_access(AST_Expansion, function(compressor) {
      return this.expression._dot_throw(compressor);
    });
    def_may_throw_on_access(AST_Function, return_false);
    def_may_throw_on_access(AST_Arrow, return_false);
    def_may_throw_on_access(AST_UnaryPostfix, return_false);
    def_may_throw_on_access(AST_UnaryPrefix, function() {
      return this.operator == "void";
    });
    def_may_throw_on_access(AST_Binary, function(compressor) {
      return (this.operator == "&&" || this.operator == "||" || this.operator == "??") && (this.left._dot_throw(compressor) || this.right._dot_throw(compressor));
    });
    def_may_throw_on_access(AST_Assign, function(compressor) {
      if (this.logical) return true;
      return this.operator == "=" && this.right._dot_throw(compressor);
    });
    def_may_throw_on_access(AST_Conditional, function(compressor) {
      return this.consequent._dot_throw(compressor) || this.alternative._dot_throw(compressor);
    });
    def_may_throw_on_access(AST_Dot, function(compressor) {
      if (!is_strict(compressor)) return false;
      if (this.property == "prototype") {
        return !(this.expression instanceof AST_Function || this.expression instanceof AST_Class);
      }
      return true;
    });
    def_may_throw_on_access(AST_Chain, function(compressor) {
      return this.expression._dot_throw(compressor);
    });
    def_may_throw_on_access(AST_Sequence, function(compressor) {
      return this.tail_node()._dot_throw(compressor);
    });
    def_may_throw_on_access(AST_SymbolRef, function(compressor) {
      if (this.name === "arguments" && this.scope instanceof AST_Lambda) return false;
      if (has_flag(this, UNDEFINED)) return true;
      if (!is_strict(compressor)) return false;
      if (is_undeclared_ref(this) && this.is_declared(compressor)) return false;
      if (this.is_immutable()) return false;
      var fixed = this.fixed_value();
      return !fixed || fixed._dot_throw(compressor);
    });
  })(function(node, func) {
    node.DEFMETHOD("_dot_throw", func);
  });
  function is_lhs(node, parent) {
    if (parent instanceof AST_Unary && unary_side_effects.has(parent.operator)) return parent.expression;
    if (parent instanceof AST_Assign && parent.left === node) return node;
    if (parent instanceof AST_ForIn && parent.init === node) return node;
  }
  (function(def_negate) {
    function basic_negation(exp) {
      return make_node(AST_UnaryPrefix, exp, {
        operator: "!",
        expression: exp
      });
    }
    function best(orig, alt, first_in_statement2) {
      var negated = basic_negation(orig);
      if (first_in_statement2) {
        var stat = make_node(AST_SimpleStatement, alt, {
          body: alt
        });
        return best_of_expression(negated, stat) === stat ? alt : negated;
      }
      return best_of_expression(negated, alt);
    }
    def_negate(AST_Node, function() {
      return basic_negation(this);
    });
    def_negate(AST_Statement, function() {
      throw new Error("Cannot negate a statement");
    });
    def_negate(AST_Function, function() {
      return basic_negation(this);
    });
    def_negate(AST_Class, function() {
      return basic_negation(this);
    });
    def_negate(AST_Arrow, function() {
      return basic_negation(this);
    });
    def_negate(AST_UnaryPrefix, function() {
      if (this.operator == "!")
        return this.expression;
      return basic_negation(this);
    });
    def_negate(AST_Sequence, function(compressor) {
      var expressions = this.expressions.slice();
      expressions.push(expressions.pop().negate(compressor));
      return make_sequence(this, expressions);
    });
    def_negate(AST_Conditional, function(compressor, first_in_statement2) {
      var self2 = this.clone();
      self2.consequent = self2.consequent.negate(compressor);
      self2.alternative = self2.alternative.negate(compressor);
      return best(this, self2, first_in_statement2);
    });
    def_negate(AST_Binary, function(compressor, first_in_statement2) {
      var self2 = this.clone(), op = this.operator;
      if (compressor.option("unsafe_comps")) {
        switch (op) {
          case "<=":
            self2.operator = ">";
            return self2;
          case "<":
            self2.operator = ">=";
            return self2;
          case ">=":
            self2.operator = "<";
            return self2;
          case ">":
            self2.operator = "<=";
            return self2;
        }
      }
      switch (op) {
        case "==":
          self2.operator = "!=";
          return self2;
        case "!=":
          self2.operator = "==";
          return self2;
        case "===":
          self2.operator = "!==";
          return self2;
        case "!==":
          self2.operator = "===";
          return self2;
        case "&&":
          self2.operator = "||";
          self2.left = self2.left.negate(compressor, first_in_statement2);
          self2.right = self2.right.negate(compressor);
          return best(this, self2, first_in_statement2);
        case "||":
          self2.operator = "&&";
          self2.left = self2.left.negate(compressor, first_in_statement2);
          self2.right = self2.right.negate(compressor);
          return best(this, self2, first_in_statement2);
      }
      return basic_negation(this);
    });
  })(function(node, func) {
    node.DEFMETHOD("negate", function(compressor, first_in_statement2) {
      return func.call(this, compressor, first_in_statement2);
    });
  });
  (function(def_bitwise_negate) {
    function basic_negation(exp) {
      return make_node(AST_UnaryPrefix, exp, {
        operator: "~",
        expression: exp
      });
    }
    def_bitwise_negate(AST_Node, function() {
      return basic_negation(this);
    });
    def_bitwise_negate(AST_Number, function() {
      const neg = ~this.value;
      if (neg.toString().length > this.value.toString().length) {
        return basic_negation(this);
      }
      return make_node(AST_Number, this, { value: neg });
    });
    def_bitwise_negate(AST_UnaryPrefix, function(in_32_bit_context) {
      if (this.operator == "~" && (in_32_bit_context || this.expression.is_32_bit_integer())) {
        return this.expression;
      } else {
        return basic_negation(this);
      }
    });
  })(function(node, func) {
    node.DEFMETHOD("bitwise_negate", func);
  });
  var global_pure_fns = makePredicate("Boolean decodeURI decodeURIComponent Date encodeURI encodeURIComponent Error escape EvalError isFinite isNaN Number Object parseFloat parseInt RangeError ReferenceError String SyntaxError TypeError unescape URIError");
  AST_Call.DEFMETHOD("is_callee_pure", function(compressor) {
    if (compressor.option("unsafe")) {
      var expr = this.expression;
      var first_arg = this.args && this.args[0] && this.args[0].evaluate(compressor);
      if (expr.expression && expr.expression.name === "hasOwnProperty" && (first_arg == null || first_arg.thedef && first_arg.thedef.undeclared)) {
        return false;
      }
      if (is_undeclared_ref(expr) && global_pure_fns.has(expr.name)) return true;
      if (expr instanceof AST_Dot && is_undeclared_ref(expr.expression) && is_pure_native_fn(expr.expression.name, expr.property)) {
        return true;
      }
    }
    if (this instanceof AST_New && compressor.option("pure_new")) {
      return true;
    }
    if (compressor.option("side_effects") && has_annotation(this, _PURE)) {
      return true;
    }
    return !compressor.pure_funcs(this);
  });
  AST_Node.DEFMETHOD("is_call_pure", return_false);
  AST_Dot.DEFMETHOD("is_call_pure", function(compressor) {
    if (!compressor.option("unsafe")) return;
    const expr = this.expression;
    let native_obj;
    if (expr instanceof AST_Array) {
      native_obj = "Array";
    } else if (expr.is_boolean()) {
      native_obj = "Boolean";
    } else if (expr.is_number(compressor)) {
      native_obj = "Number";
    } else if (expr instanceof AST_RegExp) {
      native_obj = "RegExp";
    } else if (expr.is_string(compressor)) {
      native_obj = "String";
    } else if (!this.may_throw_on_access(compressor)) {
      native_obj = "Object";
    }
    return native_obj != null && is_pure_native_method(native_obj, this.property);
  });
  var aborts = (thing) => thing && thing.aborts();
  (function(def_aborts) {
    def_aborts(AST_Statement, return_null);
    def_aborts(AST_Jump, return_this);
    function block_aborts() {
      for (var i = 0; i < this.body.length; i++) {
        if (aborts(this.body[i])) {
          return this.body[i];
        }
      }
      return null;
    }
    def_aborts(AST_Import, return_null);
    def_aborts(AST_BlockStatement, block_aborts);
    def_aborts(AST_SwitchBranch, block_aborts);
    def_aborts(AST_DefClass, function() {
      for (const prop of this.properties) {
        if (prop instanceof AST_ClassStaticBlock) {
          if (prop.aborts()) return prop;
        }
      }
      return null;
    });
    def_aborts(AST_ClassStaticBlock, block_aborts);
    def_aborts(AST_If, function() {
      return this.alternative && aborts(this.body) && aborts(this.alternative) && this;
    });
  })(function(node, func) {
    node.DEFMETHOD("aborts", func);
  });
  AST_Node.DEFMETHOD("contains_this", function() {
    return walk(this, (node) => {
      if (node instanceof AST_This) return walk_abort;
      if (node !== this && node instanceof AST_Scope && !(node instanceof AST_Arrow)) {
        return true;
      }
    });
  });
  function is_modified(compressor, tw, node, value, level, immutable) {
    var parent = tw.parent(level);
    var lhs = is_lhs(node, parent);
    if (lhs) return lhs;
    if (!immutable && parent instanceof AST_Call && parent.expression === node && !(value instanceof AST_Arrow) && !(value instanceof AST_Class) && !parent.is_callee_pure(compressor) && (!(value instanceof AST_Function) || !(parent instanceof AST_New) && value.contains_this())) {
      return true;
    }
    if (parent instanceof AST_Array) {
      return is_modified(compressor, tw, parent, parent, level + 1);
    }
    if (parent instanceof AST_ObjectKeyVal && node === parent.value) {
      var obj = tw.parent(level + 1);
      return is_modified(compressor, tw, obj, obj, level + 2);
    }
    if (parent instanceof AST_PropAccess && parent.expression === node) {
      var prop = read_property(value, parent.property);
      return !immutable && is_modified(compressor, tw, parent, prop, level + 1);
    }
  }
  function is_used_in_expression(tw) {
    for (let p = -1, node, parent; node = tw.parent(p), parent = tw.parent(p + 1); p++) {
      if (parent instanceof AST_Sequence) {
        const nth_expression = parent.expressions.indexOf(node);
        if (nth_expression !== parent.expressions.length - 1) {
          const grandparent = tw.parent(p + 2);
          if (parent.expressions.length > 2 || parent.expressions.length === 1 || !requires_sequence_to_maintain_binding(grandparent, parent, parent.expressions[1])) {
            return false;
          }
          return true;
        } else {
          continue;
        }
      }
      if (parent instanceof AST_Unary) {
        const op = parent.operator;
        if (op === "void") {
          return false;
        }
        if (op === "typeof" || op === "+" || op === "-" || op === "!" || op === "~") {
          continue;
        }
      }
      if (parent instanceof AST_SimpleStatement || parent instanceof AST_LabeledStatement) {
        return false;
      }
      if (parent instanceof AST_Scope) {
        return false;
      }
      return true;
    }
    return true;
  }

  // node_modules/terser/lib/compress/evaluate.js
  function def_eval(node, func) {
    node.DEFMETHOD("_eval", func);
  }
  var nullish = Symbol("This AST_Chain is nullish");
  AST_Node.DEFMETHOD("evaluate", function(compressor) {
    if (!compressor.option("evaluate"))
      return this;
    var val = this._eval(compressor, 1);
    if (!val || val instanceof RegExp)
      return val;
    if (typeof val == "function" || typeof val == "object" || val == nullish)
      return this;
    if (typeof val === "string") {
      const unevaluated_size = this.size(compressor);
      if (val.length + 2 > unevaluated_size) return this;
    }
    return val;
  });
  var unaryPrefix = makePredicate("! ~ - + void");
  AST_Node.DEFMETHOD("is_constant", function() {
    if (this instanceof AST_Constant) {
      return !(this instanceof AST_RegExp);
    } else {
      return this instanceof AST_UnaryPrefix && this.expression instanceof AST_Constant && unaryPrefix.has(this.operator);
    }
  });
  def_eval(AST_Statement, function() {
    throw new Error(string_template("Cannot evaluate a statement [{file}:{line},{col}]", this.start));
  });
  def_eval(AST_Lambda, return_this);
  def_eval(AST_Class, return_this);
  def_eval(AST_Node, return_this);
  def_eval(AST_Constant, function() {
    return this.getValue();
  });
  var supports_bigint = typeof BigInt === "function";
  def_eval(AST_BigInt, function() {
    if (supports_bigint) {
      return BigInt(this.value);
    } else {
      return this;
    }
  });
  def_eval(AST_RegExp, function(compressor) {
    let evaluated = compressor.evaluated_regexps.get(this.value);
    if (evaluated === void 0 && regexp_is_safe(this.value.source)) {
      try {
        const { source, flags } = this.value;
        evaluated = new RegExp(source, flags);
      } catch (e) {
        evaluated = null;
      }
      compressor.evaluated_regexps.set(this.value, evaluated);
    }
    return evaluated || this;
  });
  def_eval(AST_TemplateString, function() {
    if (this.segments.length !== 1) return this;
    return this.segments[0].value;
  });
  def_eval(AST_Function, function(compressor) {
    if (compressor.option("unsafe")) {
      var fn = function() {
      };
      fn.node = this;
      fn.toString = () => this.print_to_string();
      return fn;
    }
    return this;
  });
  def_eval(AST_Array, function(compressor, depth) {
    if (compressor.option("unsafe")) {
      var elements = [];
      for (var i = 0, len = this.elements.length; i < len; i++) {
        var element = this.elements[i];
        var value = element._eval(compressor, depth);
        if (element === value)
          return this;
        elements.push(value);
      }
      return elements;
    }
    return this;
  });
  def_eval(AST_Object, function(compressor, depth) {
    if (compressor.option("unsafe")) {
      var val = {};
      for (var i = 0, len = this.properties.length; i < len; i++) {
        var prop = this.properties[i];
        if (prop instanceof AST_Expansion)
          return this;
        var key = prop.key;
        if (key instanceof AST_Symbol) {
          key = key.name;
        } else if (key instanceof AST_Node) {
          key = key._eval(compressor, depth);
          if (key === prop.key)
            return this;
        }
        if (typeof Object.prototype[key] === "function") {
          return this;
        }
        if (prop.value instanceof AST_Function)
          continue;
        val[key] = prop.value._eval(compressor, depth);
        if (val[key] === prop.value)
          return this;
      }
      return val;
    }
    return this;
  });
  var non_converting_unary = makePredicate("! typeof void");
  def_eval(AST_UnaryPrefix, function(compressor, depth) {
    var e = this.expression;
    if (compressor.option("typeofs") && this.operator == "typeof") {
      if (e instanceof AST_Lambda || e instanceof AST_SymbolRef && e.fixed_value() instanceof AST_Lambda) {
        return "function";
      }
      if ((e instanceof AST_Object || e instanceof AST_Array || e instanceof AST_SymbolRef && (e.fixed_value() instanceof AST_Object || e.fixed_value() instanceof AST_Array)) && !e.has_side_effects(compressor)) {
        return typeof {};
      }
    }
    if (!non_converting_unary.has(this.operator))
      depth++;
    e = e._eval(compressor, depth);
    if (e === this.expression)
      return this;
    switch (this.operator) {
      case "!":
        return !e;
      case "typeof":
        if (e instanceof RegExp)
          return this;
        return typeof e;
      case "void":
        return void 0;
      case "~":
        return ~e;
      case "-":
        return -e;
      case "+":
        return +e;
    }
    return this;
  });
  var non_converting_binary = makePredicate("&& || ?? === !==");
  var identity_comparison = makePredicate("== != === !==");
  var has_identity = (value) => typeof value === "object" || typeof value === "function" || typeof value === "symbol";
  def_eval(AST_Binary, function(compressor, depth) {
    if (!non_converting_binary.has(this.operator))
      depth++;
    var left = this.left._eval(compressor, depth);
    if (left === this.left)
      return this;
    var right = this.right._eval(compressor, depth);
    if (right === this.right)
      return this;
    if (left != null && right != null && identity_comparison.has(this.operator) && has_identity(left) && has_identity(right) && typeof left === typeof right) {
      return this;
    }
    if (typeof left === "bigint" !== (typeof right === "bigint") || typeof left === "bigint" && (this.operator === ">>>" || this.operator === "/" && Number(right) === 0)) {
      return this;
    }
    var result;
    switch (this.operator) {
      case "&&":
        result = left && right;
        break;
      case "||":
        result = left || right;
        break;
      case "??":
        result = left != null ? left : right;
        break;
      case "|":
        result = left | right;
        break;
      case "&":
        result = left & right;
        break;
      case "^":
        result = left ^ right;
        break;
      case "+":
        result = left + right;
        break;
      case "*":
        result = left * right;
        break;
      case "**":
        result = left ** right;
        break;
      case "/":
        result = left / right;
        break;
      case "%":
        result = left % right;
        break;
      case "-":
        result = left - right;
        break;
      case "<<":
        result = left << right;
        break;
      case ">>":
        result = left >> right;
        break;
      case ">>>":
        result = left >>> right;
        break;
      case "==":
        result = left == right;
        break;
      case "===":
        result = left === right;
        break;
      case "!=":
        result = left != right;
        break;
      case "!==":
        result = left !== right;
        break;
      case "<":
        result = left < right;
        break;
      case "<=":
        result = left <= right;
        break;
      case ">":
        result = left > right;
        break;
      case ">=":
        result = left >= right;
        break;
      default:
        return this;
    }
    if (typeof result === "number" && isNaN(result) && compressor.find_parent(AST_With)) {
      return this;
    }
    return result;
  });
  def_eval(AST_Conditional, function(compressor, depth) {
    var condition = this.condition._eval(compressor, depth);
    if (condition === this.condition)
      return this;
    var node = condition ? this.consequent : this.alternative;
    var value = node._eval(compressor, depth);
    return value === node ? this : value;
  });
  var reentrant_ref_eval = /* @__PURE__ */ new Set();
  def_eval(AST_SymbolRef, function(compressor, depth) {
    if (reentrant_ref_eval.has(this))
      return this;
    var fixed = this.fixed_value();
    if (!fixed)
      return this;
    reentrant_ref_eval.add(this);
    const value = fixed._eval(compressor, depth);
    reentrant_ref_eval.delete(this);
    if (value === fixed)
      return this;
    if (value && typeof value == "object") {
      var escaped = this.definition().escaped;
      if (escaped && depth > escaped)
        return this;
    }
    return value;
  });
  var global_objs = { Array, Math, Number, Object, String };
  var regexp_flags = /* @__PURE__ */ new Set([
    "dotAll",
    "global",
    "ignoreCase",
    "multiline",
    "sticky",
    "unicode"
  ]);
  def_eval(AST_PropAccess, function(compressor, depth) {
    let obj = this.expression._eval(compressor, depth + 1);
    if (obj === nullish || this.optional && obj == null) return nullish;
    if (this.property === "length") {
      if (typeof obj === "string") {
        return obj.length;
      }
      const is_spreadless_array = obj instanceof AST_Array && obj.elements.every((el) => !(el instanceof AST_Expansion));
      if (is_spreadless_array && obj.elements.every((el) => !el.has_side_effects(compressor))) {
        return obj.elements.length;
      }
    }
    if (compressor.option("unsafe")) {
      var key = this.property;
      if (key instanceof AST_Node) {
        key = key._eval(compressor, depth);
        if (key === this.property)
          return this;
      }
      var exp = this.expression;
      if (is_undeclared_ref(exp)) {
        var aa;
        var first_arg = exp.name === "hasOwnProperty" && key === "call" && (aa = compressor.parent() && compressor.parent().args) && (aa && aa[0] && aa[0].evaluate(compressor));
        first_arg = first_arg instanceof AST_Dot ? first_arg.expression : first_arg;
        if (first_arg == null || first_arg.thedef && first_arg.thedef.undeclared) {
          return this.clone();
        }
        if (!is_pure_native_value(exp.name, key))
          return this;
        obj = global_objs[exp.name];
      } else {
        if (obj instanceof RegExp) {
          if (key == "source") {
            return regexp_source_fix(obj.source);
          } else if (key == "flags" || regexp_flags.has(key)) {
            return obj[key];
          }
        }
        if (!obj || obj === exp || !HOP(obj, key))
          return this;
        if (typeof obj == "function")
          switch (key) {
            case "name":
              return obj.node.name ? obj.node.name.name : "";
            case "length":
              return obj.node.length_property();
            default:
              return this;
          }
      }
      return obj[key];
    }
    return this;
  });
  def_eval(AST_Chain, function(compressor, depth) {
    const evaluated = this.expression._eval(compressor, depth);
    return evaluated === nullish ? void 0 : evaluated === this.expression ? this : evaluated;
  });
  def_eval(AST_Call, function(compressor, depth) {
    var exp = this.expression;
    const callee = exp._eval(compressor, depth);
    if (callee === nullish || this.optional && callee == null) return nullish;
    if (compressor.option("unsafe") && exp instanceof AST_PropAccess) {
      var key = exp.property;
      if (key instanceof AST_Node) {
        key = key._eval(compressor, depth);
        if (key === exp.property)
          return this;
      }
      var val;
      var e = exp.expression;
      if (is_undeclared_ref(e)) {
        var first_arg = e.name === "hasOwnProperty" && key === "call" && (this.args[0] && this.args[0].evaluate(compressor));
        first_arg = first_arg instanceof AST_Dot ? first_arg.expression : first_arg;
        if (first_arg == null || first_arg.thedef && first_arg.thedef.undeclared) {
          return this.clone();
        }
        if (!is_pure_native_fn(e.name, key)) return this;
        val = global_objs[e.name];
      } else {
        val = e._eval(compressor, depth + 1);
        if (val === e || !val)
          return this;
        if (!is_pure_native_method(val.constructor.name, key))
          return this;
      }
      var args = [];
      for (var i = 0, len = this.args.length; i < len; i++) {
        var arg = this.args[i];
        var value = arg._eval(compressor, depth);
        if (arg === value)
          return this;
        if (arg instanceof AST_Lambda)
          return this;
        args.push(value);
      }
      try {
        return val[key].apply(val, args);
      } catch (ex) {
      }
    }
    return this;
  });
  def_eval(AST_New, return_this);

  // node_modules/terser/lib/compress/drop-side-effect-free.js
  function def_drop_side_effect_free(node, func) {
    node.DEFMETHOD("drop_side_effect_free", func);
  }
  function trim(nodes, compressor, first_in_statement2) {
    var len = nodes.length;
    if (!len) return null;
    var ret = [], changed = false;
    for (var i = 0; i < len; i++) {
      var node = nodes[i].drop_side_effect_free(compressor, first_in_statement2);
      changed |= node !== nodes[i];
      if (node) {
        ret.push(node);
        first_in_statement2 = false;
      }
    }
    return changed ? ret.length ? ret : null : nodes;
  }
  def_drop_side_effect_free(AST_Node, return_this);
  def_drop_side_effect_free(AST_Constant, return_null);
  def_drop_side_effect_free(AST_This, return_null);
  def_drop_side_effect_free(AST_Call, function(compressor, first_in_statement2) {
    if (is_nullish_shortcircuited(this, compressor)) {
      return this.expression.drop_side_effect_free(compressor, first_in_statement2);
    }
    if (!this.is_callee_pure(compressor)) {
      if (this.expression.is_call_pure(compressor)) {
        var exprs = this.args.slice();
        exprs.unshift(this.expression.expression);
        exprs = trim(exprs, compressor, first_in_statement2);
        return exprs && make_sequence(this, exprs);
      }
      if (is_func_expr(this.expression) && (!this.expression.name || !this.expression.name.definition().references.length)) {
        var node = this.clone();
        node.expression.process_expression(false, compressor);
        return node;
      }
      return this;
    }
    var args = trim(this.args, compressor, first_in_statement2);
    return args && make_sequence(this, args);
  });
  def_drop_side_effect_free(AST_Accessor, return_null);
  def_drop_side_effect_free(AST_Function, return_null);
  def_drop_side_effect_free(AST_Arrow, return_null);
  def_drop_side_effect_free(AST_Class, function(compressor) {
    const with_effects = [];
    if (this.is_self_referential() && this.has_side_effects(compressor)) {
      return this;
    }
    const trimmed_extends = this.extends && this.extends.drop_side_effect_free(compressor);
    if (trimmed_extends) with_effects.push(trimmed_extends);
    for (const prop of this.properties) {
      if (prop instanceof AST_ClassStaticBlock) {
        if (prop.has_side_effects(compressor)) {
          return this;
        }
      } else {
        const trimmed_prop = prop.drop_side_effect_free(compressor);
        if (trimmed_prop) with_effects.push(trimmed_prop);
      }
    }
    if (!with_effects.length)
      return null;
    const exprs = make_sequence(this, with_effects);
    if (this instanceof AST_DefClass) {
      return make_node(AST_SimpleStatement, this, { body: exprs });
    } else {
      return exprs;
    }
  });
  def_drop_side_effect_free(AST_ClassProperty, function(compressor) {
    const key = this.computed_key() && this.key.drop_side_effect_free(compressor);
    const value = this.static && this.value && this.value.drop_side_effect_free(compressor);
    if (key && value)
      return make_sequence(this, [key, value]);
    return key || value || null;
  });
  def_drop_side_effect_free(AST_Binary, function(compressor, first_in_statement2) {
    var right = this.right.drop_side_effect_free(compressor);
    if (!right)
      return this.left.drop_side_effect_free(compressor, first_in_statement2);
    if (lazy_op.has(this.operator)) {
      if (right === this.right)
        return this;
      var node = this.clone();
      node.right = right;
      return node;
    } else {
      var left = this.left.drop_side_effect_free(compressor, first_in_statement2);
      if (!left)
        return this.right.drop_side_effect_free(compressor, first_in_statement2);
      return make_sequence(this, [left, right]);
    }
  });
  def_drop_side_effect_free(AST_Assign, function(compressor) {
    if (this.logical)
      return this;
    var left = this.left;
    if (left.has_side_effects(compressor) || compressor.has_directive("use strict") && left instanceof AST_PropAccess && left.expression.is_constant()) {
      return this;
    }
    set_flag(this, WRITE_ONLY);
    while (left instanceof AST_PropAccess) {
      left = left.expression;
    }
    if (left.is_constant_expression(compressor.find_parent(AST_Scope))) {
      return this.right.drop_side_effect_free(compressor);
    }
    return this;
  });
  def_drop_side_effect_free(AST_Conditional, function(compressor) {
    var consequent = this.consequent.drop_side_effect_free(compressor);
    var alternative = this.alternative.drop_side_effect_free(compressor);
    if (consequent === this.consequent && alternative === this.alternative)
      return this;
    if (!consequent)
      return alternative ? make_node(AST_Binary, this, {
        operator: "||",
        left: this.condition,
        right: alternative
      }) : this.condition.drop_side_effect_free(compressor);
    if (!alternative)
      return make_node(AST_Binary, this, {
        operator: "&&",
        left: this.condition,
        right: consequent
      });
    var node = this.clone();
    node.consequent = consequent;
    node.alternative = alternative;
    return node;
  });
  def_drop_side_effect_free(AST_Unary, function(compressor, first_in_statement2) {
    if (unary_side_effects.has(this.operator)) {
      if (!this.expression.has_side_effects(compressor)) {
        set_flag(this, WRITE_ONLY);
      } else {
        clear_flag(this, WRITE_ONLY);
      }
      return this;
    }
    if (this.operator == "typeof" && this.expression instanceof AST_SymbolRef)
      return null;
    var expression = this.expression.drop_side_effect_free(compressor, first_in_statement2);
    if (first_in_statement2 && expression && is_iife_call(expression)) {
      if (expression === this.expression && this.operator == "!")
        return this;
      return expression.negate(compressor, first_in_statement2);
    }
    return expression;
  });
  def_drop_side_effect_free(AST_SymbolRef, function(compressor) {
    const safe_access = this.is_declared(compressor) || pure_prop_access_globals.has(this.name);
    return safe_access ? null : this;
  });
  def_drop_side_effect_free(AST_Object, function(compressor, first_in_statement2) {
    var values = trim(this.properties, compressor, first_in_statement2);
    return values && make_sequence(this, values);
  });
  def_drop_side_effect_free(AST_ObjectProperty, function(compressor, first_in_statement2) {
    const computed_key = this instanceof AST_ObjectKeyVal && this.key instanceof AST_Node;
    const key = computed_key && this.key.drop_side_effect_free(compressor, first_in_statement2);
    const value = this.value && this.value.drop_side_effect_free(compressor, first_in_statement2);
    if (key && value) {
      return make_sequence(this, [key, value]);
    }
    return key || value;
  });
  def_drop_side_effect_free(AST_ConciseMethod, function() {
    return this.computed_key() ? this.key : null;
  });
  def_drop_side_effect_free(AST_ObjectGetter, function() {
    return this.computed_key() ? this.key : null;
  });
  def_drop_side_effect_free(AST_ObjectSetter, function() {
    return this.computed_key() ? this.key : null;
  });
  def_drop_side_effect_free(AST_Array, function(compressor, first_in_statement2) {
    var values = trim(this.elements, compressor, first_in_statement2);
    return values && make_sequence(this, values);
  });
  def_drop_side_effect_free(AST_Dot, function(compressor, first_in_statement2) {
    if (is_nullish_shortcircuited(this, compressor)) {
      return this.expression.drop_side_effect_free(compressor, first_in_statement2);
    }
    if (!this.optional && this.expression.may_throw_on_access(compressor)) {
      return this;
    }
    return this.expression.drop_side_effect_free(compressor, first_in_statement2);
  });
  def_drop_side_effect_free(AST_Sub, function(compressor, first_in_statement2) {
    if (is_nullish_shortcircuited(this, compressor)) {
      return this.expression.drop_side_effect_free(compressor, first_in_statement2);
    }
    if (!this.optional && this.expression.may_throw_on_access(compressor)) {
      return this;
    }
    var property = this.property.drop_side_effect_free(compressor);
    if (property && this.optional) return this;
    var expression = this.expression.drop_side_effect_free(compressor, first_in_statement2);
    if (expression && property) return make_sequence(this, [expression, property]);
    return expression || property;
  });
  def_drop_side_effect_free(AST_Chain, function(compressor, first_in_statement2) {
    return this.expression.drop_side_effect_free(compressor, first_in_statement2);
  });
  def_drop_side_effect_free(AST_Sequence, function(compressor) {
    var last = this.tail_node();
    var expr = last.drop_side_effect_free(compressor);
    if (expr === last)
      return this;
    var expressions = this.expressions.slice(0, -1);
    if (expr)
      expressions.push(expr);
    if (!expressions.length) {
      return make_node(AST_Number, this, { value: 0 });
    }
    return make_sequence(this, expressions);
  });
  def_drop_side_effect_free(AST_Expansion, function(compressor, first_in_statement2) {
    return this.expression.drop_side_effect_free(compressor, first_in_statement2);
  });
  def_drop_side_effect_free(AST_TemplateSegment, return_null);
  def_drop_side_effect_free(AST_TemplateString, function(compressor) {
    var values = trim(this.segments, compressor, first_in_statement);
    return values && make_sequence(this, values);
  });

  // node_modules/terser/lib/compress/drop-unused.js
  var r_keep_assign = /keep_assign/;
  AST_Scope.DEFMETHOD("drop_unused", function(compressor) {
    if (!compressor.option("unused")) return;
    if (compressor.has_directive("use asm")) return;
    if (!this.variables) return;
    var self2 = this;
    if (self2.pinned()) return;
    var drop_funcs = !(self2 instanceof AST_Toplevel) || compressor.toplevel.funcs;
    var drop_vars = !(self2 instanceof AST_Toplevel) || compressor.toplevel.vars;
    const assign_as_unused = r_keep_assign.test(compressor.option("unused")) ? return_false : function(node) {
      if (node instanceof AST_Assign && !node.logical && (has_flag(node, WRITE_ONLY) || node.operator == "=")) {
        return node.left;
      }
      if (node instanceof AST_Unary && has_flag(node, WRITE_ONLY)) {
        return node.expression;
      }
    };
    var in_use_ids = /* @__PURE__ */ new Map();
    var fixed_ids = /* @__PURE__ */ new Map();
    if (self2 instanceof AST_Toplevel && compressor.top_retain) {
      self2.variables.forEach(function(def) {
        if (compressor.top_retain(def)) {
          in_use_ids.set(def.id, def);
        }
      });
    }
    var var_defs_by_id = /* @__PURE__ */ new Map();
    var initializations = /* @__PURE__ */ new Map();
    var scope = this;
    var tw = new TreeWalker(function(node, descend) {
      if (node instanceof AST_Lambda && node.uses_arguments && !tw.has_directive("use strict")) {
        node.argnames.forEach(function(argname) {
          if (!(argname instanceof AST_SymbolDeclaration)) return;
          var def = argname.definition();
          in_use_ids.set(def.id, def);
        });
      }
      if (node === self2) return;
      if (node instanceof AST_Class && node.has_side_effects(compressor)) {
        if (node.is_self_referential()) {
          descend();
        } else {
          node.visit_nondeferred_class_parts(tw);
        }
      }
      if (node instanceof AST_Defun || node instanceof AST_DefClass) {
        var node_def = node.name.definition();
        const in_export = tw.parent() instanceof AST_Export;
        if (in_export || !drop_funcs && scope === self2) {
          if (node_def.global) {
            in_use_ids.set(node_def.id, node_def);
          }
        }
        map_add(initializations, node_def.id, node);
        return true;
      }
      const in_root_scope = scope === self2;
      if (node instanceof AST_SymbolFunarg && in_root_scope) {
        map_add(var_defs_by_id, node.definition().id, node);
      }
      if (node instanceof AST_Definitions && in_root_scope) {
        const in_export = tw.parent() instanceof AST_Export;
        node.definitions.forEach(function(def) {
          if (def.name instanceof AST_SymbolVar) {
            map_add(var_defs_by_id, def.name.definition().id, def);
          }
          if (in_export || !drop_vars) {
            walk(def.name, (node2) => {
              if (node2 instanceof AST_SymbolDeclaration) {
                const def2 = node2.definition();
                if (def2.global) {
                  in_use_ids.set(def2.id, def2);
                }
              }
            });
          }
          if (def.name instanceof AST_Destructuring) {
            def.walk(tw);
          }
          if (def.name instanceof AST_SymbolDeclaration && def.value) {
            var node_def2 = def.name.definition();
            map_add(initializations, node_def2.id, def.value);
            if (!node_def2.chained && def.name.fixed_value() === def.value) {
              fixed_ids.set(node_def2.id, def);
            }
            if (def.value.has_side_effects(compressor)) {
              def.value.walk(tw);
            }
          }
        });
        return true;
      }
      return scan_ref_scoped(node, descend);
    });
    self2.walk(tw);
    tw = new TreeWalker(scan_ref_scoped);
    in_use_ids.forEach(function(def) {
      var init = initializations.get(def.id);
      if (init) init.forEach(function(init2) {
        init2.walk(tw);
      });
    });
    var tt = new TreeTransformer(
      function before(node, descend, in_list) {
        var parent = tt.parent();
        if (drop_vars) {
          const sym2 = assign_as_unused(node);
          if (sym2 instanceof AST_SymbolRef) {
            var def = sym2.definition();
            var in_use = in_use_ids.has(def.id);
            if (node instanceof AST_Assign) {
              if (!in_use || fixed_ids.has(def.id) && fixed_ids.get(def.id) !== node) {
                const assignee = node.right.transform(tt);
                if (!in_use && !assignee.has_side_effects(compressor) && !is_used_in_expression(tt)) {
                  return in_list ? MAP.skip : make_node(AST_Number, node, { value: 0 });
                }
                return maintain_this_binding(parent, node, assignee);
              }
            } else if (!in_use) {
              return in_list ? MAP.skip : make_node(AST_Number, node, { value: 0 });
            }
          }
        }
        if (scope !== self2) return;
        var def;
        if (node.name && (node instanceof AST_ClassExpression && !keep_name(compressor.option("keep_classnames"), (def = node.name.definition()).name) || node instanceof AST_Function && !keep_name(compressor.option("keep_fnames"), (def = node.name.definition()).name))) {
          if (!in_use_ids.has(def.id) || def.orig.length > 1) node.name = null;
        }
        if (node instanceof AST_Lambda && !(node instanceof AST_Accessor)) {
          var trim2 = !compressor.option("keep_fargs") || parent instanceof AST_Call && parent.expression === node && !node.pinned() && (!node.name || node.name.unreferenced());
          for (var a = node.argnames, i = a.length; --i >= 0; ) {
            var sym = a[i];
            if (sym instanceof AST_Expansion) {
              sym = sym.expression;
            }
            if (sym instanceof AST_DefaultAssign) {
              sym = sym.left;
            }
            if (!(sym instanceof AST_Destructuring) && !in_use_ids.has(sym.definition().id)) {
              set_flag(sym, UNUSED);
              if (trim2) {
                a.pop();
              }
            } else {
              trim2 = false;
            }
          }
        }
        if (node instanceof AST_DefClass && node !== self2) {
          const def2 = node.name.definition();
          descend(node, this);
          const keep_class = def2.global && !drop_funcs || in_use_ids.has(def2.id);
          if (!keep_class) {
            const kept = node.drop_side_effect_free(compressor);
            if (kept == null) {
              def2.eliminated++;
              return in_list ? MAP.skip : make_node(AST_EmptyStatement, node);
            }
            return kept;
          }
          return node;
        }
        if (node instanceof AST_Defun && node !== self2) {
          const def2 = node.name.definition();
          const keep = def2.global && !drop_funcs || in_use_ids.has(def2.id);
          if (!keep) {
            def2.eliminated++;
            return in_list ? MAP.skip : make_node(AST_EmptyStatement, node);
          }
        }
        if (node instanceof AST_Definitions && !(parent instanceof AST_ForIn && parent.init === node)) {
          var drop_block = !(parent instanceof AST_Toplevel) && !(node instanceof AST_Var);
          var body = [], head = [], tail = [];
          var side_effects = [];
          node.definitions.forEach(function(def2) {
            if (def2.value) def2.value = def2.value.transform(tt);
            var is_destructure = def2.name instanceof AST_Destructuring;
            var sym2 = is_destructure ? new SymbolDef(null, { name: "<destructure>" }) : def2.name.definition();
            if (drop_block && sym2.global) return tail.push(def2);
            if (!(drop_vars || drop_block) || is_destructure && (def2.name.names.length || def2.name.is_array || compressor.option("pure_getters") != true) || in_use_ids.has(sym2.id)) {
              if (def2.value && fixed_ids.has(sym2.id) && fixed_ids.get(sym2.id) !== def2) {
                def2.value = def2.value.drop_side_effect_free(compressor);
              }
              if (def2.name instanceof AST_SymbolVar) {
                var var_defs = var_defs_by_id.get(sym2.id);
                if (var_defs.length > 1 && (!def2.value || sym2.orig.indexOf(def2.name) > sym2.eliminated)) {
                  if (def2.value) {
                    var ref = make_node(AST_SymbolRef, def2.name, def2.name);
                    sym2.references.push(ref);
                    var assign = make_node(AST_Assign, def2, {
                      operator: "=",
                      logical: false,
                      left: ref,
                      right: def2.value
                    });
                    if (fixed_ids.get(sym2.id) === def2) {
                      fixed_ids.set(sym2.id, assign);
                    }
                    side_effects.push(assign.transform(tt));
                  }
                  remove(var_defs, def2);
                  sym2.eliminated++;
                  return;
                }
              }
              if (def2.value) {
                if (side_effects.length > 0) {
                  if (tail.length > 0) {
                    side_effects.push(def2.value);
                    def2.value = make_sequence(def2.value, side_effects);
                  } else {
                    body.push(make_node(AST_SimpleStatement, node, {
                      body: make_sequence(node, side_effects)
                    }));
                  }
                  side_effects = [];
                }
                tail.push(def2);
              } else {
                head.push(def2);
              }
            } else if (sym2.orig[0] instanceof AST_SymbolCatch) {
              var value = def2.value && def2.value.drop_side_effect_free(compressor);
              if (value) side_effects.push(value);
              def2.value = null;
              head.push(def2);
            } else {
              var value = def2.value && def2.value.drop_side_effect_free(compressor);
              if (value) {
                side_effects.push(value);
              }
              sym2.eliminated++;
            }
          });
          if (head.length > 0 || tail.length > 0) {
            node.definitions = head.concat(tail);
            body.push(node);
          }
          if (side_effects.length > 0) {
            body.push(make_node(AST_SimpleStatement, node, {
              body: make_sequence(node, side_effects)
            }));
          }
          switch (body.length) {
            case 0:
              return in_list ? MAP.skip : make_node(AST_EmptyStatement, node);
            case 1:
              return body[0];
            default:
              return in_list ? MAP.splice(body) : make_node(AST_BlockStatement, node, { body });
          }
        }
        if (node instanceof AST_For) {
          descend(node, this);
          var block;
          if (node.init instanceof AST_BlockStatement) {
            block = node.init;
            node.init = block.body.pop();
            block.body.push(node);
          }
          if (node.init instanceof AST_SimpleStatement) {
            node.init = node.init.body;
          } else if (is_empty(node.init)) {
            node.init = null;
          }
          return !block ? node : in_list ? MAP.splice(block.body) : block;
        }
        if (node instanceof AST_LabeledStatement && node.body instanceof AST_For) {
          descend(node, this);
          if (node.body instanceof AST_BlockStatement) {
            var block = node.body;
            node.body = block.body.pop();
            block.body.push(node);
            return in_list ? MAP.splice(block.body) : block;
          }
          return node;
        }
        if (node instanceof AST_BlockStatement) {
          descend(node, this);
          if (in_list && node.body.every(can_be_evicted_from_block)) {
            return MAP.splice(node.body);
          }
          return node;
        }
        if (node instanceof AST_Scope && !(node instanceof AST_ClassStaticBlock)) {
          const save_scope = scope;
          scope = node;
          descend(node, this);
          scope = save_scope;
          return node;
        }
      },
      function after(node, in_list) {
        if (node instanceof AST_Sequence) {
          switch (node.expressions.length) {
            case 0:
              return in_list ? MAP.skip : make_node(AST_Number, node, { value: 0 });
            case 1:
              return node.expressions[0];
          }
        }
      }
    );
    self2.transform(tt);
    function scan_ref_scoped(node, descend) {
      var node_def;
      const sym = assign_as_unused(node);
      if (sym instanceof AST_SymbolRef && !is_ref_of(node.left, AST_SymbolBlockDeclaration) && self2.variables.get(sym.name) === (node_def = sym.definition())) {
        if (node instanceof AST_Assign) {
          node.right.walk(tw);
          if (!node_def.chained && node.left.fixed_value() === node.right) {
            fixed_ids.set(node_def.id, node);
          }
        }
        return true;
      }
      if (node instanceof AST_SymbolRef) {
        node_def = node.definition();
        if (!in_use_ids.has(node_def.id)) {
          in_use_ids.set(node_def.id, node_def);
          if (node_def.orig[0] instanceof AST_SymbolCatch) {
            const redef = node_def.scope.is_block_scope() && node_def.scope.get_defun_scope().variables.get(node_def.name);
            if (redef) in_use_ids.set(redef.id, redef);
          }
        }
        return true;
      }
      if (node instanceof AST_Class) {
        descend();
        return true;
      }
      if (node instanceof AST_Scope && !(node instanceof AST_ClassStaticBlock)) {
        var save_scope = scope;
        scope = node;
        descend();
        scope = save_scope;
        return true;
      }
    }
  });

  // node_modules/terser/lib/compress/reduce-vars.js
  function def_reduce_vars(node, func) {
    node.DEFMETHOD("reduce_vars", func);
  }
  def_reduce_vars(AST_Node, noop);
  function reset_def(compressor, def) {
    def.assignments = 0;
    def.chained = false;
    def.direct_access = false;
    def.escaped = 0;
    def.recursive_refs = 0;
    def.references = [];
    def.single_use = void 0;
    if (def.scope.pinned() || def.orig[0] instanceof AST_SymbolFunarg && def.scope.uses_arguments) {
      def.fixed = false;
    } else if (def.orig[0] instanceof AST_SymbolConst || !compressor.exposed(def)) {
      def.fixed = def.init;
    } else {
      def.fixed = false;
    }
  }
  function reset_variables(tw, compressor, node) {
    node.variables.forEach(function(def) {
      reset_def(compressor, def);
      if (def.fixed === null) {
        tw.defs_to_safe_ids.set(def.id, tw.safe_ids);
        mark(tw, def, true);
      } else if (def.fixed) {
        tw.loop_ids.set(def.id, tw.in_loop);
        mark(tw, def, true);
      }
    });
  }
  function reset_block_variables(compressor, node) {
    if (node.block_scope) node.block_scope.variables.forEach((def) => {
      reset_def(compressor, def);
    });
  }
  function push(tw) {
    tw.safe_ids = Object.create(tw.safe_ids);
  }
  function pop(tw) {
    tw.safe_ids = Object.getPrototypeOf(tw.safe_ids);
  }
  function mark(tw, def, safe) {
    tw.safe_ids[def.id] = safe;
  }
  function safe_to_read(tw, def) {
    if (def.single_use == "m") return false;
    if (tw.safe_ids[def.id]) {
      if (def.fixed == null) {
        var orig = def.orig[0];
        if (orig instanceof AST_SymbolFunarg || orig.name == "arguments") return false;
        def.fixed = make_node(AST_Undefined, orig);
      }
      return true;
    }
    return def.fixed instanceof AST_Defun;
  }
  function safe_to_assign(tw, def, scope, value) {
    if (def.fixed === void 0) return true;
    let def_safe_ids;
    if (def.fixed === null && (def_safe_ids = tw.defs_to_safe_ids.get(def.id))) {
      def_safe_ids[def.id] = false;
      tw.defs_to_safe_ids.delete(def.id);
      return true;
    }
    if (!HOP(tw.safe_ids, def.id)) return false;
    if (!safe_to_read(tw, def)) return false;
    if (def.fixed === false) return false;
    if (def.fixed != null && (!value || def.references.length > def.assignments)) return false;
    if (def.fixed instanceof AST_Defun) {
      return value instanceof AST_Node && def.fixed.parent_scope === scope;
    }
    return def.orig.every((sym) => {
      return !(sym instanceof AST_SymbolConst || sym instanceof AST_SymbolDefun || sym instanceof AST_SymbolLambda);
    });
  }
  function ref_once(tw, compressor, def) {
    return compressor.option("unused") && !def.scope.pinned() && def.references.length - def.recursive_refs == 1 && tw.loop_ids.get(def.id) === tw.in_loop;
  }
  function is_immutable(value) {
    if (!value) return false;
    return value.is_constant() || value instanceof AST_Lambda || value instanceof AST_This;
  }
  function mark_escaped(tw, d, scope, node, value, level = 0, depth = 1) {
    var parent = tw.parent(level);
    if (value) {
      if (value.is_constant()) return;
      if (value instanceof AST_ClassExpression) return;
    }
    if (parent instanceof AST_Assign && (parent.operator === "=" || parent.logical) && node === parent.right || parent instanceof AST_Call && (node !== parent.expression || parent instanceof AST_New) || parent instanceof AST_Exit && node === parent.value && node.scope !== d.scope || parent instanceof AST_VarDef && node === parent.value || parent instanceof AST_Yield && node === parent.value && node.scope !== d.scope) {
      if (depth > 1 && !(value && value.is_constant_expression(scope))) depth = 1;
      if (!d.escaped || d.escaped > depth) d.escaped = depth;
      return;
    } else if (parent instanceof AST_Array || parent instanceof AST_Await || parent instanceof AST_Binary && lazy_op.has(parent.operator) || parent instanceof AST_Conditional && node !== parent.condition || parent instanceof AST_Expansion || parent instanceof AST_Sequence && node === parent.tail_node()) {
      mark_escaped(tw, d, scope, parent, parent, level + 1, depth);
    } else if (parent instanceof AST_ObjectKeyVal && node === parent.value) {
      var obj = tw.parent(level + 1);
      mark_escaped(tw, d, scope, obj, obj, level + 2, depth);
    } else if (parent instanceof AST_PropAccess && node === parent.expression) {
      value = read_property(value, parent.property);
      mark_escaped(tw, d, scope, parent, value, level + 1, depth + 1);
      if (value) return;
    }
    if (level > 0) return;
    if (parent instanceof AST_Sequence && node !== parent.tail_node()) return;
    if (parent instanceof AST_SimpleStatement) return;
    d.direct_access = true;
  }
  var suppress = (node) => walk(node, (node2) => {
    if (!(node2 instanceof AST_Symbol)) return;
    var d = node2.definition();
    if (!d) return;
    if (node2 instanceof AST_SymbolRef) d.references.push(node2);
    d.fixed = false;
  });
  def_reduce_vars(AST_Accessor, function(tw, descend, compressor) {
    push(tw);
    reset_variables(tw, compressor, this);
    descend();
    pop(tw);
    return true;
  });
  def_reduce_vars(AST_Assign, function(tw, descend, compressor) {
    var node = this;
    if (node.left instanceof AST_Destructuring) {
      suppress(node.left);
      return;
    }
    const finish_walk = () => {
      if (node.logical) {
        node.left.walk(tw);
        push(tw);
        node.right.walk(tw);
        pop(tw);
        return true;
      }
    };
    var sym = node.left;
    if (!(sym instanceof AST_SymbolRef)) return finish_walk();
    var def = sym.definition();
    var safe = safe_to_assign(tw, def, sym.scope, node.right);
    def.assignments++;
    if (!safe) return finish_walk();
    var fixed = def.fixed;
    if (!fixed && node.operator != "=" && !node.logical) return finish_walk();
    var eq = node.operator == "=";
    var value = eq ? node.right : node;
    if (is_modified(compressor, tw, node, value, 0)) return finish_walk();
    def.references.push(sym);
    if (!node.logical) {
      if (!eq) def.chained = true;
      def.fixed = eq ? function() {
        return node.right;
      } : function() {
        return make_node(AST_Binary, node, {
          operator: node.operator.slice(0, -1),
          left: fixed instanceof AST_Node ? fixed : fixed(),
          right: node.right
        });
      };
    }
    if (node.logical) {
      mark(tw, def, false);
      push(tw);
      node.right.walk(tw);
      pop(tw);
      return true;
    }
    mark(tw, def, false);
    node.right.walk(tw);
    mark(tw, def, true);
    mark_escaped(tw, def, sym.scope, node, value, 0, 1);
    return true;
  });
  def_reduce_vars(AST_Binary, function(tw) {
    if (!lazy_op.has(this.operator)) return;
    this.left.walk(tw);
    push(tw);
    this.right.walk(tw);
    pop(tw);
    return true;
  });
  def_reduce_vars(AST_Block, function(tw, descend, compressor) {
    reset_block_variables(compressor, this);
  });
  def_reduce_vars(AST_Case, function(tw) {
    push(tw);
    this.expression.walk(tw);
    pop(tw);
    push(tw);
    walk_body(this, tw);
    pop(tw);
    return true;
  });
  def_reduce_vars(AST_Class, function(tw, descend) {
    clear_flag(this, INLINED);
    push(tw);
    descend();
    pop(tw);
    return true;
  });
  def_reduce_vars(AST_ClassStaticBlock, function(tw, descend, compressor) {
    reset_block_variables(compressor, this);
  });
  def_reduce_vars(AST_Conditional, function(tw) {
    this.condition.walk(tw);
    push(tw);
    this.consequent.walk(tw);
    pop(tw);
    push(tw);
    this.alternative.walk(tw);
    pop(tw);
    return true;
  });
  def_reduce_vars(AST_Chain, function(tw, descend) {
    const safe_ids = tw.safe_ids;
    descend();
    tw.safe_ids = safe_ids;
    return true;
  });
  def_reduce_vars(AST_Call, function(tw) {
    this.expression.walk(tw);
    if (this.optional) {
      push(tw);
    }
    for (const arg of this.args) arg.walk(tw);
    return true;
  });
  def_reduce_vars(AST_PropAccess, function(tw) {
    if (!this.optional) return;
    this.expression.walk(tw);
    push(tw);
    if (this.property instanceof AST_Node) this.property.walk(tw);
    return true;
  });
  def_reduce_vars(AST_Default, function(tw, descend) {
    push(tw);
    descend();
    pop(tw);
    return true;
  });
  function mark_lambda(tw, descend, compressor) {
    clear_flag(this, INLINED);
    push(tw);
    reset_variables(tw, compressor, this);
    var iife;
    if (!this.name && !this.uses_arguments && !this.pinned() && (iife = tw.parent()) instanceof AST_Call && iife.expression === this && !iife.args.some((arg) => arg instanceof AST_Expansion) && this.argnames.every((arg_name) => arg_name instanceof AST_Symbol)) {
      this.argnames.forEach((arg, i) => {
        if (!arg.definition) return;
        var d = arg.definition();
        if (d.orig.length > 1) return;
        if (d.fixed === void 0 && (!this.uses_arguments || tw.has_directive("use strict"))) {
          d.fixed = function() {
            return iife.args[i] || make_node(AST_Undefined, iife);
          };
          tw.loop_ids.set(d.id, tw.in_loop);
          mark(tw, d, true);
        } else {
          d.fixed = false;
        }
      });
    }
    descend();
    pop(tw);
    handle_defined_after_hoist(this);
    return true;
  }
  function handle_defined_after_hoist(parent) {
    const defuns = [];
    walk(parent, (node) => {
      if (node === parent) return;
      if (node instanceof AST_Defun) {
        defuns.push(node);
        return true;
      }
      if (node instanceof AST_Scope || node instanceof AST_SimpleStatement) return true;
    });
    const defun_dependencies_map = /* @__PURE__ */ new Map();
    const dependencies_map = /* @__PURE__ */ new Map();
    const symbols_of_interest = /* @__PURE__ */ new Set();
    const defuns_of_interest = /* @__PURE__ */ new Set();
    for (const defun of defuns) {
      const fname_def = defun.name.definition();
      const enclosing_defs = [];
      for (const def of defun.enclosed) {
        if (def.fixed === false || def === fname_def || def.scope.get_defun_scope() !== parent) {
          continue;
        }
        symbols_of_interest.add(def.id);
        if (def.assignments === 0 && def.orig.length === 1 && def.orig[0] instanceof AST_SymbolDefun) {
          defuns_of_interest.add(def.id);
          symbols_of_interest.add(def.id);
          defuns_of_interest.add(fname_def.id);
          symbols_of_interest.add(fname_def.id);
          if (!defun_dependencies_map.has(fname_def.id)) {
            defun_dependencies_map.set(fname_def.id, []);
          }
          defun_dependencies_map.get(fname_def.id).push(def.id);
          continue;
        }
        enclosing_defs.push(def);
      }
      if (enclosing_defs.length) {
        dependencies_map.set(fname_def.id, enclosing_defs);
        defuns_of_interest.add(fname_def.id);
        symbols_of_interest.add(fname_def.id);
      }
    }
    if (!dependencies_map.size) {
      return;
    }
    let symbol_index = 1;
    const defun_first_read_map = /* @__PURE__ */ new Map();
    const symbol_last_write_map = /* @__PURE__ */ new Map();
    walk_parent(parent, (node, walk_info) => {
      if (node instanceof AST_Symbol && node.thedef) {
        const id = node.definition().id;
        symbol_index++;
        if (symbols_of_interest.has(id)) {
          if (node instanceof AST_SymbolDeclaration || is_lhs(node, walk_info.parent())) {
            symbol_last_write_map.set(id, symbol_index);
          }
        }
        if (defuns_of_interest.has(id)) {
          if (!defun_first_read_map.has(id) && !is_recursive_ref(walk_info, id)) {
            defun_first_read_map.set(id, symbol_index);
          }
        }
      }
    });
    for (const [defun, defun_first_read] of defun_first_read_map) {
      const queue = new Set(defun_dependencies_map.get(defun));
      for (const enclosed_defun of queue) {
        let enclosed_defun_first_read = defun_first_read_map.get(enclosed_defun);
        if (enclosed_defun_first_read != null && enclosed_defun_first_read < defun_first_read) {
          continue;
        }
        defun_first_read_map.set(enclosed_defun, defun_first_read);
        for (const enclosed_enclosed_defun of defun_dependencies_map.get(enclosed_defun) || []) {
          queue.add(enclosed_enclosed_defun);
        }
      }
    }
    for (const [defun, defs] of dependencies_map) {
      const defun_first_read = defun_first_read_map.get(defun);
      if (defun_first_read === void 0) {
        continue;
      }
      for (const def of defs) {
        if (def.fixed === false) {
          continue;
        }
        let def_last_write = symbol_last_write_map.get(def.id) || 0;
        if (defun_first_read < def_last_write) {
          def.fixed = false;
        }
      }
    }
  }
  def_reduce_vars(AST_Lambda, mark_lambda);
  def_reduce_vars(AST_Do, function(tw, descend, compressor) {
    reset_block_variables(compressor, this);
    const saved_loop = tw.in_loop;
    tw.in_loop = this;
    push(tw);
    this.body.walk(tw);
    if (has_break_or_continue(this)) {
      pop(tw);
      push(tw);
    }
    this.condition.walk(tw);
    pop(tw);
    tw.in_loop = saved_loop;
    return true;
  });
  def_reduce_vars(AST_For, function(tw, descend, compressor) {
    reset_block_variables(compressor, this);
    if (this.init) this.init.walk(tw);
    const saved_loop = tw.in_loop;
    tw.in_loop = this;
    push(tw);
    if (this.condition) this.condition.walk(tw);
    this.body.walk(tw);
    if (this.step) {
      if (has_break_or_continue(this)) {
        pop(tw);
        push(tw);
      }
      this.step.walk(tw);
    }
    pop(tw);
    tw.in_loop = saved_loop;
    return true;
  });
  def_reduce_vars(AST_ForIn, function(tw, descend, compressor) {
    reset_block_variables(compressor, this);
    suppress(this.init);
    this.object.walk(tw);
    const saved_loop = tw.in_loop;
    tw.in_loop = this;
    push(tw);
    this.body.walk(tw);
    pop(tw);
    tw.in_loop = saved_loop;
    return true;
  });
  def_reduce_vars(AST_If, function(tw) {
    this.condition.walk(tw);
    push(tw);
    this.body.walk(tw);
    pop(tw);
    if (this.alternative) {
      push(tw);
      this.alternative.walk(tw);
      pop(tw);
    }
    return true;
  });
  def_reduce_vars(AST_LabeledStatement, function(tw) {
    push(tw);
    this.body.walk(tw);
    pop(tw);
    return true;
  });
  def_reduce_vars(AST_SymbolCatch, function() {
    this.definition().fixed = false;
  });
  def_reduce_vars(AST_SymbolRef, function(tw, descend, compressor) {
    var d = this.definition();
    d.references.push(this);
    if (d.references.length == 1 && !d.fixed && d.orig[0] instanceof AST_SymbolDefun) {
      tw.loop_ids.set(d.id, tw.in_loop);
    }
    var fixed_value;
    if (d.fixed === void 0 || !safe_to_read(tw, d)) {
      d.fixed = false;
    } else if (d.fixed) {
      fixed_value = this.fixed_value();
      if (fixed_value instanceof AST_Lambda && is_recursive_ref(tw, d)) {
        d.recursive_refs++;
      } else if (fixed_value && !compressor.exposed(d) && ref_once(tw, compressor, d)) {
        d.single_use = fixed_value instanceof AST_Lambda && !fixed_value.pinned() || fixed_value instanceof AST_Class || d.scope === this.scope && fixed_value.is_constant_expression();
      } else {
        d.single_use = false;
      }
      if (is_modified(compressor, tw, this, fixed_value, 0, is_immutable(fixed_value))) {
        if (d.single_use) {
          d.single_use = "m";
        } else {
          d.fixed = false;
        }
      }
    }
    mark_escaped(tw, d, this.scope, this, fixed_value, 0, 1);
  });
  def_reduce_vars(AST_Toplevel, function(tw, descend, compressor) {
    this.globals.forEach(function(def) {
      reset_def(compressor, def);
    });
    reset_variables(tw, compressor, this);
    descend();
    handle_defined_after_hoist(this);
    return true;
  });
  def_reduce_vars(AST_Try, function(tw, descend, compressor) {
    reset_block_variables(compressor, this);
    push(tw);
    this.body.walk(tw);
    pop(tw);
    if (this.bcatch) {
      push(tw);
      this.bcatch.walk(tw);
      pop(tw);
    }
    if (this.bfinally) this.bfinally.walk(tw);
    return true;
  });
  def_reduce_vars(AST_Unary, function(tw) {
    var node = this;
    if (node.operator !== "++" && node.operator !== "--") return;
    var exp = node.expression;
    if (!(exp instanceof AST_SymbolRef)) return;
    var def = exp.definition();
    var safe = safe_to_assign(tw, def, exp.scope, true);
    def.assignments++;
    if (!safe) return;
    var fixed = def.fixed;
    if (!fixed) return;
    def.references.push(exp);
    def.chained = true;
    def.fixed = function() {
      return make_node(AST_Binary, node, {
        operator: node.operator.slice(0, -1),
        left: make_node(AST_UnaryPrefix, node, {
          operator: "+",
          expression: fixed instanceof AST_Node ? fixed : fixed()
        }),
        right: make_node(AST_Number, node, {
          value: 1
        })
      });
    };
    mark(tw, def, true);
    return true;
  });
  def_reduce_vars(AST_VarDef, function(tw, descend) {
    var node = this;
    if (node.name instanceof AST_Destructuring) {
      suppress(node.name);
      return;
    }
    var d = node.name.definition();
    if (node.value) {
      if (safe_to_assign(tw, d, node.name.scope, node.value)) {
        d.fixed = function() {
          return node.value;
        };
        tw.loop_ids.set(d.id, tw.in_loop);
        mark(tw, d, false);
        descend();
        mark(tw, d, true);
        return true;
      } else {
        d.fixed = false;
      }
    }
  });
  def_reduce_vars(AST_While, function(tw, descend, compressor) {
    reset_block_variables(compressor, this);
    const saved_loop = tw.in_loop;
    tw.in_loop = this;
    push(tw);
    descend();
    pop(tw);
    tw.in_loop = saved_loop;
    return true;
  });

  // node_modules/terser/lib/compress/tighten-body.js
  function loop_body(x) {
    if (x instanceof AST_IterationStatement) {
      return x.body instanceof AST_BlockStatement ? x.body : x;
    }
    return x;
  }
  function is_lhs_read_only(lhs) {
    if (lhs instanceof AST_This) return true;
    if (lhs instanceof AST_SymbolRef) return lhs.definition().orig[0] instanceof AST_SymbolLambda;
    if (lhs instanceof AST_PropAccess) {
      lhs = lhs.expression;
      if (lhs instanceof AST_SymbolRef) {
        if (lhs.is_immutable()) return false;
        lhs = lhs.fixed_value();
      }
      if (!lhs) return true;
      if (lhs instanceof AST_RegExp) return false;
      if (lhs instanceof AST_Constant) return true;
      return is_lhs_read_only(lhs);
    }
    return false;
  }
  function remove_initializers(var_statement) {
    var decls = [];
    var_statement.definitions.forEach(function(def) {
      if (def.name instanceof AST_SymbolDeclaration) {
        def.value = null;
        decls.push(def);
      } else {
        def.declarations_as_names().forEach((name) => {
          decls.push(make_node(AST_VarDef, def, {
            name,
            value: null
          }));
        });
      }
    });
    return decls.length ? make_node(AST_Var, var_statement, { definitions: decls }) : null;
  }
  function trim_unreachable_code(compressor, stat, target) {
    walk(stat, (node) => {
      if (node instanceof AST_Var) {
        const no_initializers = remove_initializers(node);
        if (no_initializers) target.push(no_initializers);
        return true;
      }
      if (node instanceof AST_Defun && (node === stat || !compressor.has_directive("use strict"))) {
        target.push(node === stat ? node : make_node(AST_Var, node, {
          definitions: [
            make_node(AST_VarDef, node, {
              name: make_node(AST_SymbolVar, node.name, node.name),
              value: null
            })
          ]
        }));
        return true;
      }
      if (node instanceof AST_Export || node instanceof AST_Import) {
        target.push(node);
        return true;
      }
      if (node instanceof AST_Scope) {
        return true;
      }
    });
  }
  function tighten_body(statements, compressor) {
    const nearest_scope = compressor.find_scope();
    const defun_scope = nearest_scope.get_defun_scope();
    const { in_loop, in_try } = find_loop_scope_try();
    var CHANGED, max_iter = 10;
    do {
      CHANGED = false;
      eliminate_spurious_blocks(statements);
      if (compressor.option("dead_code")) {
        eliminate_dead_code(statements, compressor);
      }
      if (compressor.option("if_return")) {
        handle_if_return(statements, compressor);
      }
      if (compressor.sequences_limit > 0) {
        sequencesize(statements, compressor);
        sequencesize_2(statements, compressor);
      }
      if (compressor.option("join_vars")) {
        join_consecutive_vars(statements);
      }
      if (compressor.option("collapse_vars")) {
        collapse(statements, compressor);
      }
    } while (CHANGED && max_iter-- > 0);
    function find_loop_scope_try() {
      var node = compressor.self(), level = 0, in_loop2 = false, in_try2 = false;
      do {
        if (node instanceof AST_IterationStatement) {
          in_loop2 = true;
        } else if (node instanceof AST_Scope) {
          break;
        } else if (node instanceof AST_TryBlock) {
          in_try2 = true;
        }
      } while (node = compressor.parent(level++));
      return { in_loop: in_loop2, in_try: in_try2 };
    }
    function collapse(statements2, compressor2) {
      if (nearest_scope.pinned() || defun_scope.pinned())
        return statements2;
      var args;
      var candidates = [];
      var stat_index = statements2.length;
      var scanner = new TreeTransformer(function(node) {
        if (abort)
          return node;
        if (!hit) {
          if (node !== hit_stack[hit_index])
            return node;
          hit_index++;
          if (hit_index < hit_stack.length)
            return handle_custom_scan_order(node);
          hit = true;
          stop_after = find_stop(node, 0);
          if (stop_after === node)
            abort = true;
          return node;
        }
        var parent = scanner.parent();
        if (node instanceof AST_Assign && (node.logical || node.operator != "=" && lhs.equivalent_to(node.left)) || node instanceof AST_Await || node instanceof AST_Call && lhs instanceof AST_PropAccess && lhs.equivalent_to(node.expression) || (node instanceof AST_Call || node instanceof AST_PropAccess) && node.optional || node instanceof AST_Debugger || node instanceof AST_Destructuring || node instanceof AST_Expansion && node.expression instanceof AST_Symbol && (node.expression instanceof AST_This || node.expression.definition().references.length > 1) || node instanceof AST_IterationStatement && !(node instanceof AST_For) || node instanceof AST_LoopControl || node instanceof AST_Try || node instanceof AST_With || node instanceof AST_Yield || node instanceof AST_Export || node instanceof AST_Class || parent instanceof AST_For && node !== parent.init || !replace_all && (node instanceof AST_SymbolRef && !node.is_declared(compressor2) && !pure_prop_access_globals.has(node)) || node instanceof AST_SymbolRef && parent instanceof AST_Call && has_annotation(parent, _NOINLINE) || node instanceof AST_ObjectProperty && node.key instanceof AST_Node) {
          abort = true;
          return node;
        }
        if (!stop_if_hit && (!lhs_local || !replace_all) && (parent instanceof AST_Binary && lazy_op.has(parent.operator) && parent.left !== node || parent instanceof AST_Conditional && parent.condition !== node || parent instanceof AST_If && parent.condition !== node)) {
          stop_if_hit = parent;
        }
        if (can_replace && !(node instanceof AST_SymbolDeclaration) && lhs.equivalent_to(node) && !shadows(scanner.find_scope() || nearest_scope, lvalues)) {
          if (stop_if_hit) {
            abort = true;
            return node;
          }
          if (is_lhs(node, parent)) {
            if (value_def)
              replaced++;
            return node;
          } else {
            replaced++;
            if (value_def && candidate instanceof AST_VarDef)
              return node;
          }
          CHANGED = abort = true;
          if (candidate instanceof AST_UnaryPostfix) {
            return make_node(AST_UnaryPrefix, candidate, candidate);
          }
          if (candidate instanceof AST_VarDef) {
            var def2 = candidate.name.definition();
            var value = candidate.value;
            if (def2.references.length - def2.replaced == 1 && !compressor2.exposed(def2)) {
              def2.replaced++;
              if (funarg && is_identifier_atom(value)) {
                return value.transform(compressor2);
              } else {
                return maintain_this_binding(parent, node, value);
              }
            }
            return make_node(AST_Assign, candidate, {
              operator: "=",
              logical: false,
              left: make_node(AST_SymbolRef, candidate.name, candidate.name),
              right: value
            });
          }
          clear_flag(candidate, WRITE_ONLY);
          return candidate;
        }
        var sym;
        if (node instanceof AST_Call || node instanceof AST_Exit && (side_effects || lhs instanceof AST_PropAccess || may_modify(lhs)) || node instanceof AST_PropAccess && (side_effects || node.expression.may_throw_on_access(compressor2)) || node instanceof AST_SymbolRef && (lvalues.has(node.name) && lvalues.get(node.name).modified || side_effects && may_modify(node)) || node instanceof AST_VarDef && node.value && (lvalues.has(node.name.name) || side_effects && may_modify(node.name)) || (sym = is_lhs(node.left, node)) && (sym instanceof AST_PropAccess || lvalues.has(sym.name)) || may_throw && (in_try ? node.has_side_effects(compressor2) : side_effects_external(node))) {
          stop_after = node;
          if (node instanceof AST_Scope)
            abort = true;
        }
        return handle_custom_scan_order(node);
      }, function(node) {
        if (abort)
          return;
        if (stop_after === node)
          abort = true;
        if (stop_if_hit === node)
          stop_if_hit = null;
      });
      var multi_replacer = new TreeTransformer(function(node) {
        if (abort)
          return node;
        if (!hit) {
          if (node !== hit_stack[hit_index])
            return node;
          hit_index++;
          if (hit_index < hit_stack.length)
            return;
          hit = true;
          return node;
        }
        if (node instanceof AST_SymbolRef && node.name == def.name) {
          if (!--replaced)
            abort = true;
          if (is_lhs(node, multi_replacer.parent()))
            return node;
          def.replaced++;
          value_def.replaced--;
          return candidate.value;
        }
        if (node instanceof AST_Default || node instanceof AST_Scope)
          return node;
      });
      while (--stat_index >= 0) {
        if (stat_index == 0 && compressor2.option("unused"))
          extract_args();
        var hit_stack = [];
        extract_candidates(statements2[stat_index]);
        while (candidates.length > 0) {
          hit_stack = candidates.pop();
          var hit_index = 0;
          var candidate = hit_stack[hit_stack.length - 1];
          var value_def = null;
          var stop_after = null;
          var stop_if_hit = null;
          var lhs = get_lhs(candidate);
          if (!lhs || is_lhs_read_only(lhs) || lhs.has_side_effects(compressor2))
            continue;
          var lvalues = get_lvalues(candidate);
          var lhs_local = is_lhs_local(lhs);
          if (lhs instanceof AST_SymbolRef) {
            lvalues.set(lhs.name, { def: lhs.definition(), modified: false });
          }
          var side_effects = value_has_side_effects(candidate);
          var replace_all = replace_all_symbols();
          var may_throw = candidate.may_throw(compressor2);
          var funarg = candidate.name instanceof AST_SymbolFunarg;
          var hit = funarg;
          var abort = false, replaced = 0, can_replace = !args || !hit;
          if (!can_replace) {
            for (let j = compressor2.self().argnames.lastIndexOf(candidate.name) + 1; !abort && j < args.length; j++) {
              args[j].transform(scanner);
            }
            can_replace = true;
          }
          for (var i = stat_index; !abort && i < statements2.length; i++) {
            statements2[i].transform(scanner);
          }
          if (value_def) {
            var def = candidate.name.definition();
            if (abort && def.references.length - def.replaced > replaced)
              replaced = false;
            else {
              abort = false;
              hit_index = 0;
              hit = funarg;
              for (var i = stat_index; !abort && i < statements2.length; i++) {
                statements2[i].transform(multi_replacer);
              }
              value_def.single_use = false;
            }
          }
          if (replaced && !remove_candidate(candidate))
            statements2.splice(stat_index, 1);
        }
      }
      function handle_custom_scan_order(node) {
        if (node instanceof AST_Scope)
          return node;
        if (node instanceof AST_Switch) {
          node.expression = node.expression.transform(scanner);
          for (var i2 = 0, len = node.body.length; !abort && i2 < len; i2++) {
            var branch = node.body[i2];
            if (branch instanceof AST_Case) {
              if (!hit) {
                if (branch !== hit_stack[hit_index])
                  continue;
                hit_index++;
              }
              branch.expression = branch.expression.transform(scanner);
              if (!replace_all)
                break;
            }
          }
          abort = true;
          return node;
        }
      }
      function redefined_within_scope(def2, scope) {
        if (def2.global)
          return false;
        let cur_scope = def2.scope;
        while (cur_scope && cur_scope !== scope) {
          if (cur_scope.variables.has(def2.name)) {
            return true;
          }
          cur_scope = cur_scope.parent_scope;
        }
        return false;
      }
      function has_overlapping_symbol(fn, arg, fn_strict) {
        var found = false, scan_this = !(fn instanceof AST_Arrow);
        arg.walk(new TreeWalker(function(node, descend) {
          if (found)
            return true;
          if (node instanceof AST_SymbolRef && (fn.variables.has(node.name) || redefined_within_scope(node.definition(), fn))) {
            var s = node.definition().scope;
            if (s !== defun_scope)
              while (s = s.parent_scope) {
                if (s === defun_scope)
                  return true;
              }
            return found = true;
          }
          if ((fn_strict || scan_this) && node instanceof AST_This) {
            return found = true;
          }
          if (node instanceof AST_Scope && !(node instanceof AST_Arrow)) {
            var prev = scan_this;
            scan_this = false;
            descend();
            scan_this = prev;
            return true;
          }
        }));
        return found;
      }
      function arg_is_injectable(arg) {
        if (arg instanceof AST_Expansion) return false;
        const contains_await = walk(arg, (node) => {
          if (node instanceof AST_Await) return walk_abort;
        });
        if (contains_await) return false;
        return true;
      }
      function extract_args() {
        var iife, fn = compressor2.self();
        if (is_func_expr(fn) && !fn.name && !fn.uses_arguments && !fn.pinned() && (iife = compressor2.parent()) instanceof AST_Call && iife.expression === fn && iife.args.every(arg_is_injectable)) {
          var fn_strict = compressor2.has_directive("use strict");
          if (fn_strict && !member(fn_strict, fn.body))
            fn_strict = false;
          var len = fn.argnames.length;
          args = iife.args.slice(len);
          var names = /* @__PURE__ */ new Set();
          for (var i2 = len; --i2 >= 0; ) {
            var sym = fn.argnames[i2];
            var arg = iife.args[i2];
            const def2 = sym.definition && sym.definition();
            const is_reassigned = def2 && def2.orig.length > 1;
            if (is_reassigned)
              continue;
            args.unshift(make_node(AST_VarDef, sym, {
              name: sym,
              value: arg
            }));
            if (names.has(sym.name))
              continue;
            names.add(sym.name);
            if (sym instanceof AST_Expansion) {
              var elements = iife.args.slice(i2);
              if (elements.every(
                (arg2) => !has_overlapping_symbol(fn, arg2, fn_strict)
              )) {
                candidates.unshift([make_node(AST_VarDef, sym, {
                  name: sym.expression,
                  value: make_node(AST_Array, iife, {
                    elements
                  })
                })]);
              }
            } else {
              if (!arg) {
                arg = make_node(AST_Undefined, sym).transform(compressor2);
              } else if (arg instanceof AST_Lambda && arg.pinned() || has_overlapping_symbol(fn, arg, fn_strict)) {
                arg = null;
              }
              if (arg)
                candidates.unshift([make_node(AST_VarDef, sym, {
                  name: sym,
                  value: arg
                })]);
            }
          }
        }
      }
      function extract_candidates(expr) {
        hit_stack.push(expr);
        if (expr instanceof AST_Assign) {
          if (!expr.left.has_side_effects(compressor2) && !(expr.right instanceof AST_Chain)) {
            candidates.push(hit_stack.slice());
          }
          extract_candidates(expr.right);
        } else if (expr instanceof AST_Binary) {
          extract_candidates(expr.left);
          extract_candidates(expr.right);
        } else if (expr instanceof AST_Call && !has_annotation(expr, _NOINLINE)) {
          extract_candidates(expr.expression);
          expr.args.forEach(extract_candidates);
        } else if (expr instanceof AST_Case) {
          extract_candidates(expr.expression);
        } else if (expr instanceof AST_Conditional) {
          extract_candidates(expr.condition);
          extract_candidates(expr.consequent);
          extract_candidates(expr.alternative);
        } else if (expr instanceof AST_Definitions) {
          var len = expr.definitions.length;
          var i2 = len - 200;
          if (i2 < 0)
            i2 = 0;
          for (; i2 < len; i2++) {
            extract_candidates(expr.definitions[i2]);
          }
        } else if (expr instanceof AST_DWLoop) {
          extract_candidates(expr.condition);
          if (!(expr.body instanceof AST_Block)) {
            extract_candidates(expr.body);
          }
        } else if (expr instanceof AST_Exit) {
          if (expr.value)
            extract_candidates(expr.value);
        } else if (expr instanceof AST_For) {
          if (expr.init)
            extract_candidates(expr.init);
          if (expr.condition)
            extract_candidates(expr.condition);
          if (expr.step)
            extract_candidates(expr.step);
          if (!(expr.body instanceof AST_Block)) {
            extract_candidates(expr.body);
          }
        } else if (expr instanceof AST_ForIn) {
          extract_candidates(expr.object);
          if (!(expr.body instanceof AST_Block)) {
            extract_candidates(expr.body);
          }
        } else if (expr instanceof AST_If) {
          extract_candidates(expr.condition);
          if (!(expr.body instanceof AST_Block)) {
            extract_candidates(expr.body);
          }
          if (expr.alternative && !(expr.alternative instanceof AST_Block)) {
            extract_candidates(expr.alternative);
          }
        } else if (expr instanceof AST_Sequence) {
          expr.expressions.forEach(extract_candidates);
        } else if (expr instanceof AST_SimpleStatement) {
          extract_candidates(expr.body);
        } else if (expr instanceof AST_Switch) {
          extract_candidates(expr.expression);
          expr.body.forEach(extract_candidates);
        } else if (expr instanceof AST_Unary) {
          if (expr.operator == "++" || expr.operator == "--") {
            candidates.push(hit_stack.slice());
          }
        } else if (expr instanceof AST_VarDef) {
          if (expr.value && !(expr.value instanceof AST_Chain)) {
            candidates.push(hit_stack.slice());
            extract_candidates(expr.value);
          }
        }
        hit_stack.pop();
      }
      function find_stop(node, level, write_only) {
        var parent = scanner.parent(level);
        if (parent instanceof AST_Assign) {
          if (write_only && !parent.logical && !(parent.left instanceof AST_PropAccess || lvalues.has(parent.left.name))) {
            return find_stop(parent, level + 1, write_only);
          }
          return node;
        }
        if (parent instanceof AST_Binary) {
          if (write_only && (!lazy_op.has(parent.operator) || parent.left === node)) {
            return find_stop(parent, level + 1, write_only);
          }
          return node;
        }
        if (parent instanceof AST_Call)
          return node;
        if (parent instanceof AST_Case)
          return node;
        if (parent instanceof AST_Conditional) {
          if (write_only && parent.condition === node) {
            return find_stop(parent, level + 1, write_only);
          }
          return node;
        }
        if (parent instanceof AST_Definitions) {
          return find_stop(parent, level + 1, true);
        }
        if (parent instanceof AST_Exit) {
          return write_only ? find_stop(parent, level + 1, write_only) : node;
        }
        if (parent instanceof AST_If) {
          if (write_only && parent.condition === node) {
            return find_stop(parent, level + 1, write_only);
          }
          return node;
        }
        if (parent instanceof AST_IterationStatement)
          return node;
        if (parent instanceof AST_Sequence) {
          return find_stop(parent, level + 1, parent.tail_node() !== node);
        }
        if (parent instanceof AST_SimpleStatement) {
          return find_stop(parent, level + 1, true);
        }
        if (parent instanceof AST_Switch)
          return node;
        if (parent instanceof AST_VarDef)
          return node;
        return null;
      }
      function mangleable_var(var_def) {
        var value = var_def.value;
        if (!(value instanceof AST_SymbolRef))
          return;
        if (value.name == "arguments")
          return;
        var def2 = value.definition();
        if (def2.undeclared)
          return;
        return value_def = def2;
      }
      function get_lhs(expr) {
        if (expr instanceof AST_Assign && expr.logical) {
          return false;
        } else if (expr instanceof AST_VarDef && expr.name instanceof AST_SymbolDeclaration) {
          var def2 = expr.name.definition();
          if (!member(expr.name, def2.orig))
            return;
          var referenced = def2.references.length - def2.replaced;
          if (!referenced)
            return;
          var declared = def2.orig.length - def2.eliminated;
          if (declared > 1 && !(expr.name instanceof AST_SymbolFunarg) || (referenced > 1 ? mangleable_var(expr) : !compressor2.exposed(def2))) {
            return make_node(AST_SymbolRef, expr.name, expr.name);
          }
        } else {
          const lhs2 = expr instanceof AST_Assign ? expr.left : expr.expression;
          return !is_ref_of(lhs2, AST_SymbolConst) && !is_ref_of(lhs2, AST_SymbolLet) && lhs2;
        }
      }
      function get_rvalue(expr) {
        if (expr instanceof AST_Assign) {
          return expr.right;
        } else {
          return expr.value;
        }
      }
      function get_lvalues(expr) {
        var lvalues2 = /* @__PURE__ */ new Map();
        if (expr instanceof AST_Unary)
          return lvalues2;
        var tw = new TreeWalker(function(node) {
          var sym = node;
          while (sym instanceof AST_PropAccess)
            sym = sym.expression;
          if (sym instanceof AST_SymbolRef) {
            const prev = lvalues2.get(sym.name);
            if (!prev || !prev.modified) {
              lvalues2.set(sym.name, {
                def: sym.definition(),
                modified: is_modified(compressor2, tw, node, node, 0)
              });
            }
          }
        });
        get_rvalue(expr).walk(tw);
        return lvalues2;
      }
      function remove_candidate(expr) {
        if (expr.name instanceof AST_SymbolFunarg) {
          var iife = compressor2.parent(), argnames = compressor2.self().argnames;
          var index = argnames.indexOf(expr.name);
          if (index < 0) {
            iife.args.length = Math.min(iife.args.length, argnames.length - 1);
          } else {
            var args2 = iife.args;
            if (args2[index])
              args2[index] = make_node(AST_Number, args2[index], {
                value: 0
              });
          }
          return true;
        }
        var found = false;
        return statements2[stat_index].transform(new TreeTransformer(function(node, descend, in_list) {
          if (found)
            return node;
          if (node === expr || node.body === expr) {
            found = true;
            if (node instanceof AST_VarDef) {
              node.value = node.name instanceof AST_SymbolConst ? make_node(AST_Undefined, node.value) : null;
              return node;
            }
            return in_list ? MAP.skip : null;
          }
        }, function(node) {
          if (node instanceof AST_Sequence)
            switch (node.expressions.length) {
              case 0:
                return null;
              case 1:
                return node.expressions[0];
            }
        }));
      }
      function is_lhs_local(lhs2) {
        while (lhs2 instanceof AST_PropAccess)
          lhs2 = lhs2.expression;
        return lhs2 instanceof AST_SymbolRef && lhs2.definition().scope.get_defun_scope() === defun_scope && !(in_loop && (lvalues.has(lhs2.name) || candidate instanceof AST_Unary || candidate instanceof AST_Assign && !candidate.logical && candidate.operator != "="));
      }
      function value_has_side_effects(expr) {
        if (expr instanceof AST_Unary)
          return unary_side_effects.has(expr.operator);
        return get_rvalue(expr).has_side_effects(compressor2);
      }
      function replace_all_symbols() {
        if (side_effects)
          return false;
        if (value_def)
          return true;
        if (lhs instanceof AST_SymbolRef) {
          var def2 = lhs.definition();
          if (def2.references.length - def2.replaced == (candidate instanceof AST_VarDef ? 1 : 2)) {
            return true;
          }
        }
        return false;
      }
      function may_modify(sym) {
        if (!sym.definition)
          return true;
        var def2 = sym.definition();
        if (def2.orig.length == 1 && def2.orig[0] instanceof AST_SymbolDefun)
          return false;
        if (def2.scope.get_defun_scope() !== defun_scope)
          return true;
        return def2.references.some(
          (ref) => ref.scope.get_defun_scope() !== defun_scope
        );
      }
      function side_effects_external(node, lhs2) {
        if (node instanceof AST_Assign)
          return side_effects_external(node.left, true);
        if (node instanceof AST_Unary)
          return side_effects_external(node.expression, true);
        if (node instanceof AST_VarDef)
          return node.value && side_effects_external(node.value);
        if (lhs2) {
          if (node instanceof AST_Dot)
            return side_effects_external(node.expression, true);
          if (node instanceof AST_Sub)
            return side_effects_external(node.expression, true);
          if (node instanceof AST_SymbolRef)
            return node.definition().scope.get_defun_scope() !== defun_scope;
        }
        return false;
      }
      function shadows(my_scope, lvalues2) {
        for (const { def: def2 } of lvalues2.values()) {
          const looked_up = my_scope.find_variable(def2.name);
          if (looked_up) {
            if (looked_up === def2) continue;
            return true;
          }
        }
        return false;
      }
    }
    function eliminate_spurious_blocks(statements2) {
      var seen_dirs = [];
      for (var i = 0; i < statements2.length; ) {
        var stat = statements2[i];
        if (stat instanceof AST_BlockStatement && stat.body.every(can_be_evicted_from_block)) {
          CHANGED = true;
          eliminate_spurious_blocks(stat.body);
          statements2.splice(i, 1, ...stat.body);
          i += stat.body.length;
        } else if (stat instanceof AST_EmptyStatement) {
          CHANGED = true;
          statements2.splice(i, 1);
        } else if (stat instanceof AST_Directive) {
          if (seen_dirs.indexOf(stat.value) < 0) {
            i++;
            seen_dirs.push(stat.value);
          } else {
            CHANGED = true;
            statements2.splice(i, 1);
          }
        } else
          i++;
      }
    }
    function handle_if_return(statements2, compressor2) {
      var self2 = compressor2.self();
      var multiple_if_returns = has_multiple_if_returns(statements2);
      var in_lambda = self2 instanceof AST_Lambda;
      const iteration_start = Math.min(statements2.length, 500);
      for (var i = iteration_start; --i >= 0; ) {
        var stat = statements2[i];
        var j = next_index(i);
        var next = statements2[j];
        if (in_lambda && !next && stat instanceof AST_Return) {
          if (!stat.value) {
            CHANGED = true;
            statements2.splice(i, 1);
            continue;
          }
          if (stat.value instanceof AST_UnaryPrefix && stat.value.operator == "void") {
            CHANGED = true;
            statements2[i] = make_node(AST_SimpleStatement, stat, {
              body: stat.value.expression
            });
            continue;
          }
        }
        if (stat instanceof AST_If) {
          let ab, new_else;
          ab = aborts(stat.body);
          if (can_merge_flow(ab) && (new_else = as_statement_array_with_return(stat.body, ab))) {
            if (ab.label) {
              remove(ab.label.thedef.references, ab);
            }
            CHANGED = true;
            stat = stat.clone();
            stat.condition = stat.condition.negate(compressor2);
            stat.body = make_node(AST_BlockStatement, stat, {
              body: as_statement_array(stat.alternative).concat(extract_functions())
            });
            stat.alternative = make_node(AST_BlockStatement, stat, {
              body: new_else
            });
            statements2[i] = stat.transform(compressor2);
            continue;
          }
          ab = aborts(stat.alternative);
          if (can_merge_flow(ab) && (new_else = as_statement_array_with_return(stat.alternative, ab))) {
            if (ab.label) {
              remove(ab.label.thedef.references, ab);
            }
            CHANGED = true;
            stat = stat.clone();
            stat.body = make_node(AST_BlockStatement, stat.body, {
              body: as_statement_array(stat.body).concat(extract_functions())
            });
            stat.alternative = make_node(AST_BlockStatement, stat.alternative, {
              body: new_else
            });
            statements2[i] = stat.transform(compressor2);
            continue;
          }
        }
        if (stat instanceof AST_If && stat.body instanceof AST_Return) {
          var value = stat.body.value;
          if (!value && !stat.alternative && (in_lambda && !next || next instanceof AST_Return && !next.value)) {
            CHANGED = true;
            statements2[i] = make_node(AST_SimpleStatement, stat.condition, {
              body: stat.condition
            });
            continue;
          }
          if (value && !stat.alternative && next instanceof AST_Return && next.value) {
            CHANGED = true;
            stat = stat.clone();
            stat.alternative = next;
            statements2[i] = stat.transform(compressor2);
            statements2.splice(j, 1);
            continue;
          }
          if (value && !stat.alternative && (!next && in_lambda && multiple_if_returns || next instanceof AST_Return)) {
            CHANGED = true;
            stat = stat.clone();
            stat.alternative = next || make_node(AST_Return, stat, {
              value: null
            });
            statements2[i] = stat.transform(compressor2);
            if (next)
              statements2.splice(j, 1);
            continue;
          }
          var prev = statements2[prev_index(i)];
          if (compressor2.option("sequences") && in_lambda && !stat.alternative && prev instanceof AST_If && prev.body instanceof AST_Return && next_index(j) == statements2.length && next instanceof AST_SimpleStatement) {
            CHANGED = true;
            stat = stat.clone();
            stat.alternative = make_node(AST_BlockStatement, next, {
              body: [
                next,
                make_node(AST_Return, next, {
                  value: null
                })
              ]
            });
            statements2[i] = stat.transform(compressor2);
            statements2.splice(j, 1);
            continue;
          }
        }
      }
      function has_multiple_if_returns(statements3) {
        var n = 0;
        for (var i2 = statements3.length; --i2 >= 0; ) {
          var stat2 = statements3[i2];
          if (stat2 instanceof AST_If && stat2.body instanceof AST_Return) {
            if (++n > 1)
              return true;
          }
        }
        return false;
      }
      function is_return_void(value2) {
        return !value2 || value2 instanceof AST_UnaryPrefix && value2.operator == "void";
      }
      function can_merge_flow(ab) {
        if (!ab)
          return false;
        for (var j2 = i + 1, len = statements2.length; j2 < len; j2++) {
          var stat2 = statements2[j2];
          if (stat2 instanceof AST_Const || stat2 instanceof AST_Let)
            return false;
        }
        var lct = ab instanceof AST_LoopControl ? compressor2.loopcontrol_target(ab) : null;
        return ab instanceof AST_Return && in_lambda && is_return_void(ab.value) || ab instanceof AST_Continue && self2 === loop_body(lct) || ab instanceof AST_Break && lct instanceof AST_BlockStatement && self2 === lct;
      }
      function extract_functions() {
        var tail = statements2.slice(i + 1);
        statements2.length = i + 1;
        return tail.filter(function(stat2) {
          if (stat2 instanceof AST_Defun) {
            statements2.push(stat2);
            return false;
          }
          return true;
        });
      }
      function as_statement_array_with_return(node, ab) {
        var body = as_statement_array(node);
        if (ab !== body[body.length - 1]) {
          return void 0;
        }
        body = body.slice(0, -1);
        if (ab.value) {
          body.push(make_node(AST_SimpleStatement, ab.value, {
            body: ab.value.expression
          }));
        }
        return body;
      }
      function next_index(i2) {
        for (var j2 = i2 + 1, len = statements2.length; j2 < len; j2++) {
          var stat2 = statements2[j2];
          if (!(stat2 instanceof AST_Var && declarations_only(stat2))) {
            break;
          }
        }
        return j2;
      }
      function prev_index(i2) {
        for (var j2 = i2; --j2 >= 0; ) {
          var stat2 = statements2[j2];
          if (!(stat2 instanceof AST_Var && declarations_only(stat2))) {
            break;
          }
        }
        return j2;
      }
    }
    function eliminate_dead_code(statements2, compressor2) {
      var has_quit;
      var self2 = compressor2.self();
      for (var i = 0, n = 0, len = statements2.length; i < len; i++) {
        var stat = statements2[i];
        if (stat instanceof AST_LoopControl) {
          var lct = compressor2.loopcontrol_target(stat);
          if (stat instanceof AST_Break && !(lct instanceof AST_IterationStatement) && loop_body(lct) === self2 || stat instanceof AST_Continue && loop_body(lct) === self2) {
            if (stat.label) {
              remove(stat.label.thedef.references, stat);
            }
          } else {
            statements2[n++] = stat;
          }
        } else {
          statements2[n++] = stat;
        }
        if (aborts(stat)) {
          has_quit = statements2.slice(i + 1);
          break;
        }
      }
      statements2.length = n;
      CHANGED = n != len;
      if (has_quit)
        has_quit.forEach(function(stat2) {
          trim_unreachable_code(compressor2, stat2, statements2);
        });
    }
    function declarations_only(node) {
      return node.definitions.every((var_def) => !var_def.value);
    }
    function sequencesize(statements2, compressor2) {
      if (statements2.length < 2)
        return;
      var seq = [], n = 0;
      function push_seq() {
        if (!seq.length)
          return;
        var body2 = make_sequence(seq[0], seq);
        statements2[n++] = make_node(AST_SimpleStatement, body2, { body: body2 });
        seq = [];
      }
      for (var i = 0, len = statements2.length; i < len; i++) {
        var stat = statements2[i];
        if (stat instanceof AST_SimpleStatement) {
          if (seq.length >= compressor2.sequences_limit)
            push_seq();
          var body = stat.body;
          if (seq.length > 0)
            body = body.drop_side_effect_free(compressor2);
          if (body)
            merge_sequence(seq, body);
        } else if (stat instanceof AST_Definitions && declarations_only(stat) || stat instanceof AST_Defun) {
          statements2[n++] = stat;
        } else {
          push_seq();
          statements2[n++] = stat;
        }
      }
      push_seq();
      statements2.length = n;
      if (n != len)
        CHANGED = true;
    }
    function to_simple_statement(block, decls) {
      if (!(block instanceof AST_BlockStatement))
        return block;
      var stat = null;
      for (var i = 0, len = block.body.length; i < len; i++) {
        var line = block.body[i];
        if (line instanceof AST_Var && declarations_only(line)) {
          decls.push(line);
        } else if (stat || line instanceof AST_Const || line instanceof AST_Let) {
          return false;
        } else {
          stat = line;
        }
      }
      return stat;
    }
    function sequencesize_2(statements2, compressor2) {
      function cons_seq(right) {
        n--;
        CHANGED = true;
        var left = prev.body;
        return make_sequence(left, [left, right]).transform(compressor2);
      }
      var n = 0, prev;
      for (var i = 0; i < statements2.length; i++) {
        var stat = statements2[i];
        if (prev) {
          if (stat instanceof AST_Exit) {
            stat.value = cons_seq(stat.value || make_node(AST_Undefined, stat).transform(compressor2));
          } else if (stat instanceof AST_For) {
            if (!(stat.init instanceof AST_Definitions)) {
              const abort = walk(prev.body, (node) => {
                if (node instanceof AST_Scope)
                  return true;
                if (node instanceof AST_Binary && node.operator === "in") {
                  return walk_abort;
                }
              });
              if (!abort) {
                if (stat.init)
                  stat.init = cons_seq(stat.init);
                else {
                  stat.init = prev.body;
                  n--;
                  CHANGED = true;
                }
              }
            }
          } else if (stat instanceof AST_ForIn) {
            if (!(stat.init instanceof AST_Const) && !(stat.init instanceof AST_Let)) {
              stat.object = cons_seq(stat.object);
            }
          } else if (stat instanceof AST_If) {
            stat.condition = cons_seq(stat.condition);
          } else if (stat instanceof AST_Switch) {
            stat.expression = cons_seq(stat.expression);
          } else if (stat instanceof AST_With) {
            stat.expression = cons_seq(stat.expression);
          }
        }
        if (compressor2.option("conditionals") && stat instanceof AST_If) {
          var decls = [];
          var body = to_simple_statement(stat.body, decls);
          var alt = to_simple_statement(stat.alternative, decls);
          if (body !== false && alt !== false && decls.length > 0) {
            var len = decls.length;
            decls.push(make_node(AST_If, stat, {
              condition: stat.condition,
              body: body || make_node(AST_EmptyStatement, stat.body),
              alternative: alt
            }));
            decls.unshift(n, 1);
            [].splice.apply(statements2, decls);
            i += len;
            n += len + 1;
            prev = null;
            CHANGED = true;
            continue;
          }
        }
        statements2[n++] = stat;
        prev = stat instanceof AST_SimpleStatement ? stat : null;
      }
      statements2.length = n;
    }
    function join_object_assignments(defn, body) {
      if (!(defn instanceof AST_Definitions))
        return;
      var def = defn.definitions[defn.definitions.length - 1];
      if (!(def.value instanceof AST_Object))
        return;
      var exprs;
      if (body instanceof AST_Assign && !body.logical) {
        exprs = [body];
      } else if (body instanceof AST_Sequence) {
        exprs = body.expressions.slice();
      }
      if (!exprs)
        return;
      var trimmed = false;
      do {
        var node = exprs[0];
        if (!(node instanceof AST_Assign))
          break;
        if (node.operator != "=")
          break;
        if (!(node.left instanceof AST_PropAccess))
          break;
        var sym = node.left.expression;
        if (!(sym instanceof AST_SymbolRef))
          break;
        if (def.name.name != sym.name)
          break;
        if (!node.right.is_constant_expression(nearest_scope))
          break;
        var prop = node.left.property;
        if (prop instanceof AST_Node) {
          prop = prop.evaluate(compressor);
        }
        if (prop instanceof AST_Node)
          break;
        prop = "" + prop;
        var diff = compressor.option("ecma") < 2015 && compressor.has_directive("use strict") ? function(node2) {
          return node2.key != prop && (node2.key && node2.key.name != prop);
        } : function(node2) {
          return node2.key && node2.key.name != prop;
        };
        if (!def.value.properties.every(diff))
          break;
        var p = def.value.properties.filter(function(p2) {
          return p2.key === prop;
        })[0];
        if (!p) {
          def.value.properties.push(make_node(AST_ObjectKeyVal, node, {
            key: prop,
            value: node.right
          }));
        } else {
          p.value = new AST_Sequence({
            start: p.start,
            expressions: [p.value.clone(), node.right.clone()],
            end: p.end
          });
        }
        exprs.shift();
        trimmed = true;
      } while (exprs.length);
      return trimmed && exprs;
    }
    function join_consecutive_vars(statements2) {
      var defs;
      for (var i = 0, j = -1, len = statements2.length; i < len; i++) {
        var stat = statements2[i];
        var prev = statements2[j];
        if (stat instanceof AST_Definitions) {
          if (prev && prev.TYPE == stat.TYPE) {
            prev.definitions = prev.definitions.concat(stat.definitions);
            CHANGED = true;
          } else if (defs && defs.TYPE == stat.TYPE && declarations_only(stat)) {
            defs.definitions = defs.definitions.concat(stat.definitions);
            CHANGED = true;
          } else {
            statements2[++j] = stat;
            defs = stat;
          }
        } else if (stat instanceof AST_Exit) {
          stat.value = extract_object_assignments(stat.value);
        } else if (stat instanceof AST_For) {
          var exprs = join_object_assignments(prev, stat.init);
          if (exprs) {
            CHANGED = true;
            stat.init = exprs.length ? make_sequence(stat.init, exprs) : null;
            statements2[++j] = stat;
          } else if (prev instanceof AST_Var && (!stat.init || stat.init.TYPE == prev.TYPE)) {
            if (stat.init) {
              prev.definitions = prev.definitions.concat(stat.init.definitions);
            }
            stat.init = prev;
            statements2[j] = stat;
            CHANGED = true;
          } else if (defs instanceof AST_Var && stat.init instanceof AST_Var && declarations_only(stat.init)) {
            defs.definitions = defs.definitions.concat(stat.init.definitions);
            stat.init = null;
            statements2[++j] = stat;
            CHANGED = true;
          } else {
            statements2[++j] = stat;
          }
        } else if (stat instanceof AST_ForIn) {
          stat.object = extract_object_assignments(stat.object);
        } else if (stat instanceof AST_If) {
          stat.condition = extract_object_assignments(stat.condition);
        } else if (stat instanceof AST_SimpleStatement) {
          var exprs = join_object_assignments(prev, stat.body);
          if (exprs) {
            CHANGED = true;
            if (!exprs.length)
              continue;
            stat.body = make_sequence(stat.body, exprs);
          }
          statements2[++j] = stat;
        } else if (stat instanceof AST_Switch) {
          stat.expression = extract_object_assignments(stat.expression);
        } else if (stat instanceof AST_With) {
          stat.expression = extract_object_assignments(stat.expression);
        } else {
          statements2[++j] = stat;
        }
      }
      statements2.length = j + 1;
      function extract_object_assignments(value) {
        statements2[++j] = stat;
        var exprs2 = join_object_assignments(prev, value);
        if (exprs2) {
          CHANGED = true;
          if (exprs2.length) {
            return make_sequence(value, exprs2);
          } else if (value instanceof AST_Sequence) {
            return value.tail_node().left;
          } else {
            return value.left;
          }
        }
        return value;
      }
    }
  }

  // node_modules/terser/lib/compress/inline.js
  function within_array_or_object_literal(compressor) {
    var node, level = 0;
    while (node = compressor.parent(level++)) {
      if (node instanceof AST_Statement) return false;
      if (node instanceof AST_Array || node instanceof AST_ObjectKeyVal || node instanceof AST_Object) {
        return true;
      }
    }
    return false;
  }
  function scope_encloses_variables_in_this_scope(scope, pulled_scope) {
    for (const enclosed of pulled_scope.enclosed) {
      if (pulled_scope.variables.has(enclosed.name)) {
        continue;
      }
      const looked_up = scope.find_variable(enclosed.name);
      if (looked_up) {
        if (looked_up === enclosed) continue;
        return true;
      }
    }
    return false;
  }
  function is_const_symbol_short_than_init_value(def, fixed_value) {
    if (def.orig.length === 1 && fixed_value) {
      const init_value_length = fixed_value.size();
      const identifer_length = def.name.length;
      return init_value_length > identifer_length;
    }
    return true;
  }
  function inline_into_symbolref(self2, compressor) {
    if (compressor.in_computed_key()) return self2;
    const parent = compressor.parent();
    const def = self2.definition();
    const nearest_scope = compressor.find_scope();
    let fixed = self2.fixed_value();
    if (compressor.top_retain && def.global && compressor.top_retain(def) && // when identifier is in top_retain option dose not mean we can always inline it.
    // if identifier name is longer then init value, we can replace it.
    is_const_symbol_short_than_init_value(def, fixed)) {
      def.fixed = false;
      def.single_use = false;
      return self2;
    }
    let single_use = def.single_use && !(parent instanceof AST_Call && parent.is_callee_pure(compressor) || has_annotation(parent, _NOINLINE)) && !(parent instanceof AST_Export && fixed instanceof AST_Lambda && fixed.name);
    if (single_use && fixed instanceof AST_Node) {
      single_use = !fixed.has_side_effects(compressor) && !fixed.may_throw(compressor);
    }
    if (fixed instanceof AST_Class && def.scope !== self2.scope) {
      return self2;
    }
    if (single_use && (fixed instanceof AST_Lambda || fixed instanceof AST_Class)) {
      if (retain_top_func(fixed, compressor)) {
        single_use = false;
      } else if (def.scope !== self2.scope && (def.escaped == 1 || has_flag(fixed, INLINED) || within_array_or_object_literal(compressor) || !compressor.option("reduce_funcs"))) {
        single_use = false;
      } else if (is_recursive_ref(compressor, def)) {
        single_use = false;
      } else if (def.scope !== self2.scope || def.orig[0] instanceof AST_SymbolFunarg) {
        single_use = fixed.is_constant_expression(self2.scope);
        if (single_use == "f") {
          var scope = self2.scope;
          do {
            if (scope instanceof AST_Defun || is_func_expr(scope)) {
              set_flag(scope, INLINED);
            }
          } while (scope = scope.parent_scope);
        }
      }
    }
    if (single_use && (fixed instanceof AST_Lambda || fixed instanceof AST_Class)) {
      single_use = def.scope === self2.scope && !scope_encloses_variables_in_this_scope(nearest_scope, fixed) || parent instanceof AST_Call && parent.expression === self2 && !scope_encloses_variables_in_this_scope(nearest_scope, fixed) && !(fixed.name && fixed.name.definition().recursive_refs > 0);
    }
    if (single_use && fixed) {
      if (fixed instanceof AST_DefClass) {
        set_flag(fixed, SQUEEZED);
        fixed = make_node(AST_ClassExpression, fixed, fixed);
      }
      if (fixed instanceof AST_Defun) {
        set_flag(fixed, SQUEEZED);
        fixed = make_node(AST_Function, fixed, fixed);
      }
      if (def.recursive_refs > 0 && fixed.name instanceof AST_SymbolDefun) {
        const defun_def = fixed.name.definition();
        let lambda_def = fixed.variables.get(fixed.name.name);
        let name = lambda_def && lambda_def.orig[0];
        if (!(name instanceof AST_SymbolLambda)) {
          name = make_node(AST_SymbolLambda, fixed.name, fixed.name);
          name.scope = fixed;
          fixed.name = name;
          lambda_def = fixed.def_function(name);
        }
        walk(fixed, (node) => {
          if (node instanceof AST_SymbolRef && node.definition() === defun_def) {
            node.thedef = lambda_def;
            lambda_def.references.push(node);
          }
        });
      }
      if ((fixed instanceof AST_Lambda || fixed instanceof AST_Class) && fixed.parent_scope !== nearest_scope) {
        fixed = fixed.clone(true, compressor.get_toplevel());
        nearest_scope.add_child_scope(fixed);
      }
      return fixed.optimize(compressor);
    }
    if (fixed) {
      let replace;
      if (fixed instanceof AST_This) {
        if (!(def.orig[0] instanceof AST_SymbolFunarg) && def.references.every(
          (ref) => def.scope === ref.scope
        )) {
          replace = fixed;
        }
      } else {
        var ev = fixed.evaluate(compressor);
        if (ev !== fixed && (compressor.option("unsafe_regexp") || !(ev instanceof RegExp))) {
          replace = make_node_from_constant(ev, fixed);
        }
      }
      if (replace) {
        const name_length = self2.size(compressor);
        const replace_size = replace.size(compressor);
        let overhead = 0;
        if (compressor.option("unused") && !compressor.exposed(def)) {
          overhead = (name_length + 2 + fixed.size(compressor)) / (def.references.length - def.assignments);
        }
        if (replace_size <= name_length + overhead) {
          return replace;
        }
      }
    }
    return self2;
  }
  function inline_into_call(self2, compressor) {
    if (compressor.in_computed_key()) return self2;
    var exp = self2.expression;
    var fn = exp;
    var simple_args = self2.args.every((arg) => !(arg instanceof AST_Expansion));
    if (compressor.option("reduce_vars") && fn instanceof AST_SymbolRef && !has_annotation(self2, _NOINLINE)) {
      const fixed = fn.fixed_value();
      if (retain_top_func(fixed, compressor) || !compressor.toplevel.funcs && exp.definition().global) {
        return self2;
      }
      fn = fixed;
    }
    var is_func = fn instanceof AST_Lambda;
    var stat = is_func && fn.body[0];
    var is_regular_func = is_func && !fn.is_generator && !fn.async;
    var can_inline = is_regular_func && compressor.option("inline") && !self2.is_callee_pure(compressor);
    if (can_inline && stat instanceof AST_Return) {
      let returned = stat.value;
      if (!returned || returned.is_constant_expression()) {
        if (returned) {
          returned = returned.clone(true);
        } else {
          returned = make_node(AST_Undefined, self2);
        }
        const args2 = self2.args.concat(returned);
        return make_sequence(self2, args2).optimize(compressor);
      }
      if (fn.argnames.length === 1 && fn.argnames[0] instanceof AST_SymbolFunarg && self2.args.length < 2 && !(self2.args[0] instanceof AST_Expansion) && returned instanceof AST_SymbolRef && returned.name === fn.argnames[0].name) {
        const replacement = (self2.args[0] || make_node(AST_Undefined)).optimize(compressor);
        let parent;
        if (replacement instanceof AST_PropAccess && (parent = compressor.parent()) instanceof AST_Call && parent.expression === self2) {
          return make_sequence(self2, [
            make_node(AST_Number, self2, { value: 0 }),
            replacement
          ]);
        }
        return replacement;
      }
    }
    if (can_inline) {
      var scope, in_loop, level = -1;
      let def;
      let returned_value;
      let nearest_scope;
      if (simple_args && !fn.uses_arguments && !(compressor.parent() instanceof AST_Class) && !(fn.name && fn instanceof AST_Function) && (returned_value = can_flatten_body(stat)) && (exp === fn || has_annotation(self2, _INLINE) || compressor.option("unused") && (def = exp.definition()).references.length == 1 && !is_recursive_ref(compressor, def) && fn.is_constant_expression(exp.scope)) && !has_annotation(self2, _PURE | _NOINLINE) && !fn.contains_this() && can_inject_symbols() && (nearest_scope = compressor.find_scope()) && !scope_encloses_variables_in_this_scope(nearest_scope, fn) && !function in_default_assign() {
        let i = 0;
        let p;
        while (p = compressor.parent(i++)) {
          if (p instanceof AST_DefaultAssign) return true;
          if (p instanceof AST_Block) break;
        }
        return false;
      }() && !(scope instanceof AST_Class)) {
        set_flag(fn, SQUEEZED);
        nearest_scope.add_child_scope(fn);
        return make_sequence(self2, flatten_fn(returned_value)).optimize(compressor);
      }
    }
    if (can_inline && has_annotation(self2, _INLINE)) {
      set_flag(fn, SQUEEZED);
      fn = make_node(fn.CTOR === AST_Defun ? AST_Function : fn.CTOR, fn, fn);
      fn = fn.clone(true);
      fn.figure_out_scope({}, {
        parent_scope: compressor.find_scope(),
        toplevel: compressor.get_toplevel()
      });
      return make_node(AST_Call, self2, {
        expression: fn,
        args: self2.args
      }).optimize(compressor);
    }
    const can_drop_this_call = is_regular_func && compressor.option("side_effects") && fn.body.every(is_empty);
    if (can_drop_this_call) {
      var args = self2.args.concat(make_node(AST_Undefined, self2));
      return make_sequence(self2, args).optimize(compressor);
    }
    if (compressor.option("negate_iife") && compressor.parent() instanceof AST_SimpleStatement && is_iife_call(self2)) {
      return self2.negate(compressor, true);
    }
    var ev = self2.evaluate(compressor);
    if (ev !== self2) {
      ev = make_node_from_constant(ev, self2).optimize(compressor);
      return best_of(compressor, ev, self2);
    }
    return self2;
    function return_value(stat2) {
      if (!stat2) return make_node(AST_Undefined, self2);
      if (stat2 instanceof AST_Return) {
        if (!stat2.value) return make_node(AST_Undefined, self2);
        return stat2.value.clone(true);
      }
      if (stat2 instanceof AST_SimpleStatement) {
        return make_node(AST_UnaryPrefix, stat2, {
          operator: "void",
          expression: stat2.body.clone(true)
        });
      }
    }
    function can_flatten_body(stat2) {
      var body = fn.body;
      var len = body.length;
      if (compressor.option("inline") < 3) {
        return len == 1 && return_value(stat2);
      }
      stat2 = null;
      for (var i = 0; i < len; i++) {
        var line = body[i];
        if (line instanceof AST_Var) {
          if (stat2 && !line.definitions.every(
            (var_def) => !var_def.value
          )) {
            return false;
          }
        } else if (stat2) {
          return false;
        } else if (!(line instanceof AST_EmptyStatement)) {
          stat2 = line;
        }
      }
      return return_value(stat2);
    }
    function can_inject_args(block_scoped, safe_to_inject) {
      for (var i = 0, len = fn.argnames.length; i < len; i++) {
        var arg = fn.argnames[i];
        if (arg instanceof AST_DefaultAssign) {
          if (has_flag(arg.left, UNUSED)) continue;
          return false;
        }
        if (arg instanceof AST_Destructuring) return false;
        if (arg instanceof AST_Expansion) {
          if (has_flag(arg.expression, UNUSED)) continue;
          return false;
        }
        if (has_flag(arg, UNUSED)) continue;
        if (!safe_to_inject || block_scoped.has(arg.name) || identifier_atom.has(arg.name) || scope.conflicting_def(arg.name)) {
          return false;
        }
        if (in_loop) in_loop.push(arg.definition());
      }
      return true;
    }
    function can_inject_vars(block_scoped, safe_to_inject) {
      var len = fn.body.length;
      for (var i = 0; i < len; i++) {
        var stat2 = fn.body[i];
        if (!(stat2 instanceof AST_Var)) continue;
        if (!safe_to_inject) return false;
        for (var j = stat2.definitions.length; --j >= 0; ) {
          var name = stat2.definitions[j].name;
          if (name instanceof AST_Destructuring || block_scoped.has(name.name) || identifier_atom.has(name.name) || scope.conflicting_def(name.name)) {
            return false;
          }
          if (in_loop) in_loop.push(name.definition());
        }
      }
      return true;
    }
    function can_inject_symbols() {
      var block_scoped = /* @__PURE__ */ new Set();
      do {
        scope = compressor.parent(++level);
        if (scope.is_block_scope() && scope.block_scope) {
          scope.block_scope.variables.forEach(function(variable) {
            block_scoped.add(variable.name);
          });
        }
        if (scope instanceof AST_Catch) {
          if (scope.argname) {
            block_scoped.add(scope.argname.name);
          }
        } else if (scope instanceof AST_IterationStatement) {
          in_loop = [];
        } else if (scope instanceof AST_SymbolRef) {
          if (scope.fixed_value() instanceof AST_Scope) return false;
        }
      } while (!(scope instanceof AST_Scope));
      var safe_to_inject = !(scope instanceof AST_Toplevel) || compressor.toplevel.vars;
      var inline = compressor.option("inline");
      if (!can_inject_vars(block_scoped, inline >= 3 && safe_to_inject)) return false;
      if (!can_inject_args(block_scoped, inline >= 2 && safe_to_inject)) return false;
      return !in_loop || in_loop.length == 0 || !is_reachable(fn, in_loop);
    }
    function append_var(decls, expressions, name, value) {
      var def = name.definition();
      const already_appended = scope.variables.has(name.name);
      if (!already_appended) {
        scope.variables.set(name.name, def);
        scope.enclosed.push(def);
        decls.push(make_node(AST_VarDef, name, {
          name,
          value: null
        }));
      }
      var sym = make_node(AST_SymbolRef, name, name);
      def.references.push(sym);
      if (value) expressions.push(make_node(AST_Assign, self2, {
        operator: "=",
        logical: false,
        left: sym,
        right: value.clone()
      }));
    }
    function flatten_args(decls, expressions) {
      var len = fn.argnames.length;
      for (var i = self2.args.length; --i >= len; ) {
        expressions.push(self2.args[i]);
      }
      for (i = len; --i >= 0; ) {
        var name = fn.argnames[i];
        var value = self2.args[i];
        if (has_flag(name, UNUSED) || !name.name || scope.conflicting_def(name.name)) {
          if (value) expressions.push(value);
        } else {
          var symbol = make_node(AST_SymbolVar, name, name);
          name.definition().orig.push(symbol);
          if (!value && in_loop) value = make_node(AST_Undefined, self2);
          append_var(decls, expressions, symbol, value);
        }
      }
      decls.reverse();
      expressions.reverse();
    }
    function flatten_vars(decls, expressions) {
      var pos = expressions.length;
      for (var i = 0, lines = fn.body.length; i < lines; i++) {
        var stat2 = fn.body[i];
        if (!(stat2 instanceof AST_Var)) continue;
        for (var j = 0, defs = stat2.definitions.length; j < defs; j++) {
          var var_def = stat2.definitions[j];
          var name = var_def.name;
          append_var(decls, expressions, name, var_def.value);
          if (in_loop && fn.argnames.every(
            (argname) => argname.name != name.name
          )) {
            var def = fn.variables.get(name.name);
            var sym = make_node(AST_SymbolRef, name, name);
            def.references.push(sym);
            expressions.splice(pos++, 0, make_node(AST_Assign, var_def, {
              operator: "=",
              logical: false,
              left: sym,
              right: make_node(AST_Undefined, name)
            }));
          }
        }
      }
    }
    function flatten_fn(returned_value) {
      var decls = [];
      var expressions = [];
      flatten_args(decls, expressions);
      flatten_vars(decls, expressions);
      expressions.push(returned_value);
      if (decls.length) {
        const i = scope.body.indexOf(compressor.parent(level - 1)) + 1;
        scope.body.splice(i, 0, make_node(AST_Var, fn, {
          definitions: decls
        }));
      }
      return expressions.map((exp2) => exp2.clone(true));
    }
  }

  // node_modules/terser/lib/compress/global-defs.js
  (function(def_find_defs) {
    function to_node(value, orig) {
      if (value instanceof AST_Node) {
        if (!(value instanceof AST_Constant)) {
          value = value.clone(true);
        }
        return make_node(value.CTOR, orig, value);
      }
      if (Array.isArray(value)) return make_node(AST_Array, orig, {
        elements: value.map(function(value2) {
          return to_node(value2, orig);
        })
      });
      if (value && typeof value == "object") {
        var props = [];
        for (var key in value) if (HOP(value, key)) {
          props.push(make_node(AST_ObjectKeyVal, orig, {
            key,
            value: to_node(value[key], orig)
          }));
        }
        return make_node(AST_Object, orig, {
          properties: props
        });
      }
      return make_node_from_constant(value, orig);
    }
    AST_Toplevel.DEFMETHOD("resolve_defines", function(compressor) {
      if (!compressor.option("global_defs")) return this;
      this.figure_out_scope({ ie8: compressor.option("ie8") });
      return this.transform(new TreeTransformer(function(node) {
        var def = node._find_defs(compressor, "");
        if (!def) return;
        var level = 0, child = node, parent;
        while (parent = this.parent(level++)) {
          if (!(parent instanceof AST_PropAccess)) break;
          if (parent.expression !== child) break;
          child = parent;
        }
        if (is_lhs(child, parent)) {
          return;
        }
        return def;
      }));
    });
    def_find_defs(AST_Node, noop);
    def_find_defs(AST_Chain, function(compressor, suffix) {
      return this.expression._find_defs(compressor, suffix);
    });
    def_find_defs(AST_Dot, function(compressor, suffix) {
      return this.expression._find_defs(compressor, "." + this.property + suffix);
    });
    def_find_defs(AST_SymbolDeclaration, function() {
      if (!this.global()) return;
    });
    def_find_defs(AST_SymbolRef, function(compressor, suffix) {
      if (!this.global()) return;
      var defines = compressor.option("global_defs");
      var name = this.name + suffix;
      if (HOP(defines, name)) return to_node(defines[name], this);
    });
    def_find_defs(AST_ImportMeta, function(compressor, suffix) {
      var defines = compressor.option("global_defs");
      var name = "import.meta" + suffix;
      if (HOP(defines, name)) return to_node(defines[name], this);
    });
  })(function(node, func) {
    node.DEFMETHOD("_find_defs", func);
  });

  // node_modules/terser/lib/compress/index.js
  var Compressor = class extends TreeWalker {
    constructor(options, { false_by_default = false, mangle_options: mangle_options2 = false }) {
      super();
      if (options.defaults !== void 0 && !options.defaults) false_by_default = true;
      this.options = defaults(options, {
        arguments: false,
        arrows: !false_by_default,
        booleans: !false_by_default,
        booleans_as_integers: false,
        collapse_vars: !false_by_default,
        comparisons: !false_by_default,
        computed_props: !false_by_default,
        conditionals: !false_by_default,
        dead_code: !false_by_default,
        defaults: true,
        directives: !false_by_default,
        drop_console: false,
        drop_debugger: !false_by_default,
        ecma: 5,
        evaluate: !false_by_default,
        expression: false,
        global_defs: false,
        hoist_funs: false,
        hoist_props: !false_by_default,
        hoist_vars: false,
        ie8: false,
        if_return: !false_by_default,
        inline: !false_by_default,
        join_vars: !false_by_default,
        keep_classnames: false,
        keep_fargs: true,
        keep_fnames: false,
        keep_infinity: false,
        lhs_constants: !false_by_default,
        loops: !false_by_default,
        module: false,
        negate_iife: !false_by_default,
        passes: 1,
        properties: !false_by_default,
        pure_getters: !false_by_default && "strict",
        pure_funcs: null,
        pure_new: false,
        reduce_funcs: !false_by_default,
        reduce_vars: !false_by_default,
        sequences: !false_by_default,
        side_effects: !false_by_default,
        switches: !false_by_default,
        top_retain: null,
        toplevel: !!(options && options["top_retain"]),
        typeofs: !false_by_default,
        unsafe: false,
        unsafe_arrows: false,
        unsafe_comps: false,
        unsafe_Function: false,
        unsafe_math: false,
        unsafe_symbols: false,
        unsafe_methods: false,
        unsafe_proto: false,
        unsafe_regexp: false,
        unsafe_undefined: false,
        unused: !false_by_default,
        warnings: false
        // legacy
      }, true);
      var global_defs = this.options["global_defs"];
      if (typeof global_defs == "object") for (var key in global_defs) {
        if (key[0] === "@" && HOP(global_defs, key)) {
          global_defs[key.slice(1)] = parse(global_defs[key], {
            expression: true
          });
        }
      }
      if (this.options["inline"] === true) this.options["inline"] = 3;
      var pure_funcs = this.options["pure_funcs"];
      if (typeof pure_funcs == "function") {
        this.pure_funcs = pure_funcs;
      } else {
        this.pure_funcs = pure_funcs ? function(node) {
          return !pure_funcs.includes(node.expression.print_to_string());
        } : return_true;
      }
      var top_retain = this.options["top_retain"];
      if (top_retain instanceof RegExp) {
        this.top_retain = function(def) {
          return top_retain.test(def.name);
        };
      } else if (typeof top_retain == "function") {
        this.top_retain = top_retain;
      } else if (top_retain) {
        if (typeof top_retain == "string") {
          top_retain = top_retain.split(/,/);
        }
        this.top_retain = function(def) {
          return top_retain.includes(def.name);
        };
      }
      if (this.options["module"]) {
        this.directives["use strict"] = true;
        this.options["toplevel"] = true;
      }
      var toplevel = this.options["toplevel"];
      this.toplevel = typeof toplevel == "string" ? {
        funcs: /funcs/.test(toplevel),
        vars: /vars/.test(toplevel)
      } : {
        funcs: toplevel,
        vars: toplevel
      };
      var sequences = this.options["sequences"];
      this.sequences_limit = sequences == 1 ? 800 : sequences | 0;
      this.evaluated_regexps = /* @__PURE__ */ new Map();
      this._toplevel = void 0;
      this._mangle_options = mangle_options2 ? format_mangler_options(mangle_options2) : mangle_options2;
    }
    mangle_options() {
      var nth_identifier = this._mangle_options && this._mangle_options.nth_identifier || base54;
      var module = this._mangle_options && this._mangle_options.module || this.option("module");
      return { ie8: this.option("ie8"), nth_identifier, module };
    }
    option(key) {
      return this.options[key];
    }
    exposed(def) {
      if (def.export) return true;
      if (def.global) {
        for (var i = 0, len = def.orig.length; i < len; i++)
          if (!this.toplevel[def.orig[i] instanceof AST_SymbolDefun ? "funcs" : "vars"])
            return true;
      }
      return false;
    }
    in_boolean_context() {
      if (!this.option("booleans")) return false;
      var self2 = this.self();
      for (var i = 0, p; p = this.parent(i); i++) {
        if (p instanceof AST_SimpleStatement || p instanceof AST_Conditional && p.condition === self2 || p instanceof AST_DWLoop && p.condition === self2 || p instanceof AST_For && p.condition === self2 || p instanceof AST_If && p.condition === self2 || p instanceof AST_UnaryPrefix && p.operator == "!" && p.expression === self2) {
          return true;
        }
        if (p instanceof AST_Binary && (p.operator == "&&" || p.operator == "||" || p.operator == "??") || p instanceof AST_Conditional || p.tail_node() === self2) {
          self2 = p;
        } else {
          return false;
        }
      }
    }
    in_32_bit_context() {
      if (!this.option("evaluate")) return false;
      var self2 = this.self();
      for (var i = 0, p; p = this.parent(i); i++) {
        if (p instanceof AST_Binary && bitwise_binop.has(p.operator)) {
          return true;
        }
        if (p instanceof AST_UnaryPrefix) {
          return p.operator === "~";
        }
        if (p instanceof AST_Binary && (p.operator == "&&" || p.operator == "||" || p.operator == "??") || p instanceof AST_Conditional && p.condition !== self2 || p.tail_node() === self2) {
          self2 = p;
        } else {
          return false;
        }
      }
    }
    in_computed_key() {
      if (!this.option("evaluate")) return false;
      var self2 = this.self();
      for (var i = 0, p; p = this.parent(i); i++) {
        if (p instanceof AST_ObjectProperty && p.key === self2) {
          return true;
        }
      }
      return false;
    }
    get_toplevel() {
      return this._toplevel;
    }
    compress(toplevel) {
      toplevel = toplevel.resolve_defines(this);
      this._toplevel = toplevel;
      if (this.option("expression")) {
        this._toplevel.process_expression(true);
      }
      var passes = +this.options.passes || 1;
      var min_count = 1 / 0;
      var stopping = false;
      var mangle = this.mangle_options();
      for (var pass = 0; pass < passes; pass++) {
        this._toplevel.figure_out_scope(mangle);
        if (pass === 0 && this.option("drop_console")) {
          this._toplevel = this._toplevel.drop_console(this.option("drop_console"));
        }
        if (pass > 0 || this.option("reduce_vars")) {
          this._toplevel.reset_opt_flags(this);
        }
        this._toplevel = this._toplevel.transform(this);
        if (passes > 1) {
          let count = 0;
          walk(this._toplevel, () => {
            count++;
          });
          if (count < min_count) {
            min_count = count;
            stopping = false;
          } else if (stopping) {
            break;
          } else {
            stopping = true;
          }
        }
      }
      if (this.option("expression")) {
        this._toplevel.process_expression(false);
      }
      toplevel = this._toplevel;
      this._toplevel = void 0;
      return toplevel;
    }
    before(node, descend) {
      if (has_flag(node, SQUEEZED)) return node;
      var was_scope = false;
      if (node instanceof AST_Scope) {
        node = node.hoist_properties(this);
        node = node.hoist_declarations(this);
        was_scope = true;
      }
      descend(node, this);
      descend(node, this);
      var opt = node.optimize(this);
      if (was_scope && opt instanceof AST_Scope) {
        opt.drop_unused(this);
        descend(opt, this);
      }
      if (opt === node) set_flag(opt, SQUEEZED);
      return opt;
    }
    /** Alternative to plain is_lhs() which doesn't work within .optimize() */
    is_lhs() {
      const self2 = this.stack[this.stack.length - 1];
      const parent = this.stack[this.stack.length - 2];
      return is_lhs(self2, parent);
    }
  };
  function def_optimize(node, optimizer) {
    node.DEFMETHOD("optimize", function(compressor) {
      var self2 = this;
      if (has_flag(self2, OPTIMIZED)) return self2;
      if (compressor.has_directive("use asm")) return self2;
      var opt = optimizer(self2, compressor);
      set_flag(opt, OPTIMIZED);
      return opt;
    });
  }
  def_optimize(AST_Node, function(self2) {
    return self2;
  });
  AST_Toplevel.DEFMETHOD("drop_console", function(options) {
    const isArray = Array.isArray(options);
    const tt = new TreeTransformer(function(self2) {
      if (self2.TYPE !== "Call") {
        return;
      }
      var exp = self2.expression;
      if (!(exp instanceof AST_PropAccess)) {
        return;
      }
      if (isArray && !options.includes(exp.property)) {
        return;
      }
      var name = exp.expression;
      var depth = 2;
      while (name.expression) {
        name = name.expression;
        depth++;
      }
      if (is_undeclared_ref(name) && name.name == "console") {
        if (depth === 3 && !["call", "apply"].includes(exp.property) && is_used_in_expression(tt)) {
          exp.expression = make_empty_function(self2);
          set_flag(exp.expression, SQUEEZED);
          self2.args = [];
        } else {
          return make_node(AST_Undefined, self2);
        }
      }
    });
    return this.transform(tt);
  });
  AST_Node.DEFMETHOD("equivalent_to", function(node) {
    return equivalent_to(this, node);
  });
  AST_Scope.DEFMETHOD("process_expression", function(insert, compressor) {
    var self2 = this;
    var tt = new TreeTransformer(function(node) {
      if (insert && node instanceof AST_SimpleStatement) {
        return make_node(AST_Return, node, {
          value: node.body
        });
      }
      if (!insert && node instanceof AST_Return) {
        if (compressor) {
          var value = node.value && node.value.drop_side_effect_free(compressor, true);
          return value ? make_node(AST_SimpleStatement, node, { body: value }) : make_node(AST_EmptyStatement, node);
        }
        return make_node(AST_SimpleStatement, node, {
          body: node.value || make_node(AST_UnaryPrefix, node, {
            operator: "void",
            expression: make_node(AST_Number, node, {
              value: 0
            })
          })
        });
      }
      if (node instanceof AST_Class || node instanceof AST_Lambda && node !== self2) {
        return node;
      }
      if (node instanceof AST_Block) {
        var index = node.body.length - 1;
        if (index >= 0) {
          node.body[index] = node.body[index].transform(tt);
        }
      } else if (node instanceof AST_If) {
        node.body = node.body.transform(tt);
        if (node.alternative) {
          node.alternative = node.alternative.transform(tt);
        }
      } else if (node instanceof AST_With) {
        node.body = node.body.transform(tt);
      }
      return node;
    });
    self2.transform(tt);
  });
  AST_Toplevel.DEFMETHOD("reset_opt_flags", function(compressor) {
    const self2 = this;
    const reduce_vars = compressor.option("reduce_vars");
    const preparation = new TreeWalker(function(node, descend) {
      clear_flag(node, CLEAR_BETWEEN_PASSES);
      if (reduce_vars) {
        if (compressor.top_retain && node instanceof AST_Defun && preparation.parent() === self2) {
          set_flag(node, TOP);
        }
        return node.reduce_vars(preparation, descend, compressor);
      }
    });
    preparation.safe_ids = /* @__PURE__ */ Object.create(null);
    preparation.in_loop = null;
    preparation.loop_ids = /* @__PURE__ */ new Map();
    preparation.defs_to_safe_ids = /* @__PURE__ */ new Map();
    self2.walk(preparation);
  });
  AST_Symbol.DEFMETHOD("fixed_value", function() {
    var fixed = this.thedef.fixed;
    if (!fixed || fixed instanceof AST_Node) return fixed;
    return fixed();
  });
  AST_SymbolRef.DEFMETHOD("is_immutable", function() {
    var orig = this.definition().orig;
    return orig.length == 1 && orig[0] instanceof AST_SymbolLambda;
  });
  function find_variable(compressor, name) {
    var scope, i = 0;
    while (scope = compressor.parent(i++)) {
      if (scope instanceof AST_Scope) break;
      if (scope instanceof AST_Catch && scope.argname) {
        scope = scope.argname.definition().scope;
        break;
      }
    }
    return scope.find_variable(name);
  }
  var global_names = makePredicate("Array Boolean clearInterval clearTimeout console Date decodeURI decodeURIComponent encodeURI encodeURIComponent Error escape eval EvalError Function isFinite isNaN JSON Math Number parseFloat parseInt RangeError ReferenceError RegExp Object setInterval setTimeout String SyntaxError TypeError unescape URIError");
  AST_SymbolRef.DEFMETHOD("is_declared", function(compressor) {
    return !this.definition().undeclared || compressor.option("unsafe") && global_names.has(this.name);
  });
  var directives = /* @__PURE__ */ new Set(["use asm", "use strict"]);
  def_optimize(AST_Directive, function(self2, compressor) {
    if (compressor.option("directives") && (!directives.has(self2.value) || compressor.has_directive(self2.value) !== self2)) {
      return make_node(AST_EmptyStatement, self2);
    }
    return self2;
  });
  def_optimize(AST_Debugger, function(self2, compressor) {
    if (compressor.option("drop_debugger"))
      return make_node(AST_EmptyStatement, self2);
    return self2;
  });
  def_optimize(AST_LabeledStatement, function(self2, compressor) {
    if (self2.body instanceof AST_Break && compressor.loopcontrol_target(self2.body) === self2.body) {
      return make_node(AST_EmptyStatement, self2);
    }
    return self2.label.references.length == 0 ? self2.body : self2;
  });
  def_optimize(AST_Block, function(self2, compressor) {
    tighten_body(self2.body, compressor);
    return self2;
  });
  function can_be_extracted_from_if_block(node) {
    return !(node instanceof AST_Const || node instanceof AST_Let || node instanceof AST_Class);
  }
  def_optimize(AST_BlockStatement, function(self2, compressor) {
    tighten_body(self2.body, compressor);
    switch (self2.body.length) {
      case 1:
        if (!compressor.has_directive("use strict") && compressor.parent() instanceof AST_If && can_be_extracted_from_if_block(self2.body[0]) || can_be_evicted_from_block(self2.body[0])) {
          return self2.body[0];
        }
        break;
      case 0:
        return make_node(AST_EmptyStatement, self2);
    }
    return self2;
  });
  function opt_AST_Lambda(self2, compressor) {
    tighten_body(self2.body, compressor);
    if (compressor.option("side_effects") && self2.body.length == 1 && self2.body[0] === compressor.has_directive("use strict")) {
      self2.body.length = 0;
    }
    return self2;
  }
  def_optimize(AST_Lambda, opt_AST_Lambda);
  AST_Scope.DEFMETHOD("hoist_declarations", function(compressor) {
    var self2 = this;
    if (compressor.has_directive("use asm")) return self2;
    var hoist_funs = compressor.option("hoist_funs");
    var hoist_vars = compressor.option("hoist_vars");
    if (hoist_funs || hoist_vars) {
      var dirs = [];
      var hoisted = [];
      var vars = /* @__PURE__ */ new Map(), vars_found = 0, var_decl = 0;
      walk(self2, (node) => {
        if (node instanceof AST_Scope && node !== self2)
          return true;
        if (node instanceof AST_Var) {
          ++var_decl;
          return true;
        }
      });
      hoist_vars = hoist_vars && var_decl > 1;
      var tt = new TreeTransformer(
        function before(node) {
          if (node !== self2) {
            if (node instanceof AST_Directive) {
              dirs.push(node);
              return make_node(AST_EmptyStatement, node);
            }
            if (hoist_funs && node instanceof AST_Defun && !(tt.parent() instanceof AST_Export) && tt.parent() === self2) {
              hoisted.push(node);
              return make_node(AST_EmptyStatement, node);
            }
            if (hoist_vars && node instanceof AST_Var && !node.definitions.some((def3) => def3.name instanceof AST_Destructuring)) {
              node.definitions.forEach(function(def3) {
                vars.set(def3.name.name, def3);
                ++vars_found;
              });
              var seq = node.to_assignments(compressor);
              var p = tt.parent();
              if (p instanceof AST_ForIn && p.init === node) {
                if (seq == null) {
                  var def2 = node.definitions[0].name;
                  return make_node(AST_SymbolRef, def2, def2);
                }
                return seq;
              }
              if (p instanceof AST_For && p.init === node) {
                return seq;
              }
              if (!seq) return make_node(AST_EmptyStatement, node);
              return make_node(AST_SimpleStatement, node, {
                body: seq
              });
            }
            if (node instanceof AST_Scope)
              return node;
          }
        }
      );
      self2 = self2.transform(tt);
      if (vars_found > 0) {
        var defs = [];
        const is_lambda = self2 instanceof AST_Lambda;
        const args_as_names = is_lambda ? self2.args_as_names() : null;
        vars.forEach((def2, name) => {
          if (is_lambda && args_as_names.some((x) => x.name === def2.name.name)) {
            vars.delete(name);
          } else {
            def2 = def2.clone();
            def2.value = null;
            defs.push(def2);
            vars.set(name, def2);
          }
        });
        if (defs.length > 0) {
          for (var i = 0; i < self2.body.length; ) {
            if (self2.body[i] instanceof AST_SimpleStatement) {
              var expr = self2.body[i].body, sym, assign;
              if (expr instanceof AST_Assign && expr.operator == "=" && (sym = expr.left) instanceof AST_Symbol && vars.has(sym.name)) {
                var def = vars.get(sym.name);
                if (def.value) break;
                def.value = expr.right;
                remove(defs, def);
                defs.push(def);
                self2.body.splice(i, 1);
                continue;
              }
              if (expr instanceof AST_Sequence && (assign = expr.expressions[0]) instanceof AST_Assign && assign.operator == "=" && (sym = assign.left) instanceof AST_Symbol && vars.has(sym.name)) {
                var def = vars.get(sym.name);
                if (def.value) break;
                def.value = assign.right;
                remove(defs, def);
                defs.push(def);
                self2.body[i].body = make_sequence(expr, expr.expressions.slice(1));
                continue;
              }
            }
            if (self2.body[i] instanceof AST_EmptyStatement) {
              self2.body.splice(i, 1);
              continue;
            }
            if (self2.body[i] instanceof AST_BlockStatement) {
              self2.body.splice(i, 1, ...self2.body[i].body);
              continue;
            }
            break;
          }
          defs = make_node(AST_Var, self2, {
            definitions: defs
          });
          hoisted.push(defs);
        }
      }
      self2.body = dirs.concat(hoisted, self2.body);
    }
    return self2;
  });
  AST_Scope.DEFMETHOD("hoist_properties", function(compressor) {
    var self2 = this;
    if (!compressor.option("hoist_props") || compressor.has_directive("use asm")) return self2;
    var top_retain = self2 instanceof AST_Toplevel && compressor.top_retain || return_false;
    var defs_by_id = /* @__PURE__ */ new Map();
    var hoister = new TreeTransformer(function(node, descend) {
      if (node instanceof AST_VarDef) {
        const sym = node.name;
        let def;
        let value;
        if (sym.scope === self2 && (def = sym.definition()).escaped != 1 && !def.assignments && !def.direct_access && !def.single_use && !compressor.exposed(def) && !top_retain(def) && (value = sym.fixed_value()) === node.value && value instanceof AST_Object && !value.properties.some(
          (prop) => prop instanceof AST_Expansion || prop.computed_key()
        )) {
          descend(node, this);
          const defs = /* @__PURE__ */ new Map();
          const assignments = [];
          value.properties.forEach(({ key, value: value2 }) => {
            const scope = hoister.find_scope();
            const symbol = self2.create_symbol(sym.CTOR, {
              source: sym,
              scope,
              conflict_scopes: /* @__PURE__ */ new Set([
                scope,
                ...sym.definition().references.map((ref) => ref.scope)
              ]),
              tentative_name: sym.name + "_" + key
            });
            defs.set(String(key), symbol.definition());
            assignments.push(make_node(AST_VarDef, node, {
              name: symbol,
              value: value2
            }));
          });
          defs_by_id.set(def.id, defs);
          return MAP.splice(assignments);
        }
      } else if (node instanceof AST_PropAccess && node.expression instanceof AST_SymbolRef) {
        const defs = defs_by_id.get(node.expression.definition().id);
        if (defs) {
          const def = defs.get(String(get_simple_key(node.property)));
          const sym = make_node(AST_SymbolRef, node, {
            name: def.name,
            scope: node.expression.scope,
            thedef: def
          });
          sym.reference({});
          return sym;
        }
      }
    });
    return self2.transform(hoister);
  });
  def_optimize(AST_SimpleStatement, function(self2, compressor) {
    if (compressor.option("side_effects")) {
      var body = self2.body;
      var node = body.drop_side_effect_free(compressor, true);
      if (!node) {
        return make_node(AST_EmptyStatement, self2);
      }
      if (node !== body) {
        return make_node(AST_SimpleStatement, self2, { body: node });
      }
    }
    return self2;
  });
  def_optimize(AST_While, function(self2, compressor) {
    return compressor.option("loops") ? make_node(AST_For, self2, self2).optimize(compressor) : self2;
  });
  def_optimize(AST_Do, function(self2, compressor) {
    if (!compressor.option("loops")) return self2;
    var cond = self2.condition.tail_node().evaluate(compressor);
    if (!(cond instanceof AST_Node)) {
      if (cond) return make_node(AST_For, self2, {
        body: make_node(AST_BlockStatement, self2.body, {
          body: [
            self2.body,
            make_node(AST_SimpleStatement, self2.condition, {
              body: self2.condition
            })
          ]
        })
      }).optimize(compressor);
      if (!has_break_or_continue(self2, compressor.parent())) {
        return make_node(AST_BlockStatement, self2.body, {
          body: [
            self2.body,
            make_node(AST_SimpleStatement, self2.condition, {
              body: self2.condition
            })
          ]
        }).optimize(compressor);
      }
    }
    return self2;
  });
  function if_break_in_loop(self2, compressor) {
    var first = self2.body instanceof AST_BlockStatement ? self2.body.body[0] : self2.body;
    if (compressor.option("dead_code") && is_break(first)) {
      var body = [];
      if (self2.init instanceof AST_Statement) {
        body.push(self2.init);
      } else if (self2.init) {
        body.push(make_node(AST_SimpleStatement, self2.init, {
          body: self2.init
        }));
      }
      if (self2.condition) {
        body.push(make_node(AST_SimpleStatement, self2.condition, {
          body: self2.condition
        }));
      }
      trim_unreachable_code(compressor, self2.body, body);
      return make_node(AST_BlockStatement, self2, {
        body
      });
    }
    if (first instanceof AST_If) {
      if (is_break(first.body)) {
        if (self2.condition) {
          self2.condition = make_node(AST_Binary, self2.condition, {
            left: self2.condition,
            operator: "&&",
            right: first.condition.negate(compressor)
          });
        } else {
          self2.condition = first.condition.negate(compressor);
        }
        drop_it(first.alternative);
      } else if (is_break(first.alternative)) {
        if (self2.condition) {
          self2.condition = make_node(AST_Binary, self2.condition, {
            left: self2.condition,
            operator: "&&",
            right: first.condition
          });
        } else {
          self2.condition = first.condition;
        }
        drop_it(first.body);
      }
    }
    return self2;
    function is_break(node) {
      return node instanceof AST_Break && compressor.loopcontrol_target(node) === compressor.self();
    }
    function drop_it(rest) {
      rest = as_statement_array(rest);
      if (self2.body instanceof AST_BlockStatement) {
        self2.body = self2.body.clone();
        self2.body.body = rest.concat(self2.body.body.slice(1));
        self2.body = self2.body.transform(compressor);
      } else {
        self2.body = make_node(AST_BlockStatement, self2.body, {
          body: rest
        }).transform(compressor);
      }
      self2 = if_break_in_loop(self2, compressor);
    }
  }
  def_optimize(AST_For, function(self2, compressor) {
    if (!compressor.option("loops")) return self2;
    if (compressor.option("side_effects") && self2.init) {
      self2.init = self2.init.drop_side_effect_free(compressor);
    }
    if (self2.condition) {
      var cond = self2.condition.evaluate(compressor);
      if (!(cond instanceof AST_Node)) {
        if (cond) self2.condition = null;
        else if (!compressor.option("dead_code")) {
          var orig = self2.condition;
          self2.condition = make_node_from_constant(cond, self2.condition);
          self2.condition = best_of_expression(self2.condition.transform(compressor), orig);
        }
      }
      if (compressor.option("dead_code")) {
        if (cond instanceof AST_Node) cond = self2.condition.tail_node().evaluate(compressor);
        if (!cond) {
          var body = [];
          trim_unreachable_code(compressor, self2.body, body);
          if (self2.init instanceof AST_Statement) {
            body.push(self2.init);
          } else if (self2.init) {
            body.push(make_node(AST_SimpleStatement, self2.init, {
              body: self2.init
            }));
          }
          body.push(make_node(AST_SimpleStatement, self2.condition, {
            body: self2.condition
          }));
          return make_node(AST_BlockStatement, self2, { body }).optimize(compressor);
        }
      }
    }
    return if_break_in_loop(self2, compressor);
  });
  def_optimize(AST_If, function(self2, compressor) {
    if (is_empty(self2.alternative)) self2.alternative = null;
    if (!compressor.option("conditionals")) return self2;
    var cond = self2.condition.evaluate(compressor);
    if (!compressor.option("dead_code") && !(cond instanceof AST_Node)) {
      var orig = self2.condition;
      self2.condition = make_node_from_constant(cond, orig);
      self2.condition = best_of_expression(self2.condition.transform(compressor), orig);
    }
    if (compressor.option("dead_code")) {
      if (cond instanceof AST_Node) cond = self2.condition.tail_node().evaluate(compressor);
      if (!cond) {
        var body = [];
        trim_unreachable_code(compressor, self2.body, body);
        body.push(make_node(AST_SimpleStatement, self2.condition, {
          body: self2.condition
        }));
        if (self2.alternative) body.push(self2.alternative);
        return make_node(AST_BlockStatement, self2, { body }).optimize(compressor);
      } else if (!(cond instanceof AST_Node)) {
        var body = [];
        body.push(make_node(AST_SimpleStatement, self2.condition, {
          body: self2.condition
        }));
        body.push(self2.body);
        if (self2.alternative) {
          trim_unreachable_code(compressor, self2.alternative, body);
        }
        return make_node(AST_BlockStatement, self2, { body }).optimize(compressor);
      }
    }
    var negated = self2.condition.negate(compressor);
    var self_condition_length = self2.condition.size();
    var negated_length = negated.size();
    var negated_is_best = negated_length < self_condition_length;
    if (self2.alternative && negated_is_best) {
      negated_is_best = false;
      self2.condition = negated;
      var tmp = self2.body;
      self2.body = self2.alternative || make_node(AST_EmptyStatement, self2);
      self2.alternative = tmp;
    }
    if (is_empty(self2.body) && is_empty(self2.alternative)) {
      return make_node(AST_SimpleStatement, self2.condition, {
        body: self2.condition.clone()
      }).optimize(compressor);
    }
    if (self2.body instanceof AST_SimpleStatement && self2.alternative instanceof AST_SimpleStatement) {
      return make_node(AST_SimpleStatement, self2, {
        body: make_node(AST_Conditional, self2, {
          condition: self2.condition,
          consequent: self2.body.body,
          alternative: self2.alternative.body
        })
      }).optimize(compressor);
    }
    if (is_empty(self2.alternative) && self2.body instanceof AST_SimpleStatement) {
      if (self_condition_length === negated_length && !negated_is_best && self2.condition instanceof AST_Binary && self2.condition.operator == "||") {
        negated_is_best = true;
      }
      if (negated_is_best) return make_node(AST_SimpleStatement, self2, {
        body: make_node(AST_Binary, self2, {
          operator: "||",
          left: negated,
          right: self2.body.body
        })
      }).optimize(compressor);
      return make_node(AST_SimpleStatement, self2, {
        body: make_node(AST_Binary, self2, {
          operator: "&&",
          left: self2.condition,
          right: self2.body.body
        })
      }).optimize(compressor);
    }
    if (self2.body instanceof AST_EmptyStatement && self2.alternative instanceof AST_SimpleStatement) {
      return make_node(AST_SimpleStatement, self2, {
        body: make_node(AST_Binary, self2, {
          operator: "||",
          left: self2.condition,
          right: self2.alternative.body
        })
      }).optimize(compressor);
    }
    if (self2.body instanceof AST_Exit && self2.alternative instanceof AST_Exit && self2.body.TYPE == self2.alternative.TYPE) {
      return make_node(self2.body.CTOR, self2, {
        value: make_node(AST_Conditional, self2, {
          condition: self2.condition,
          consequent: self2.body.value || make_node(AST_Undefined, self2.body),
          alternative: self2.alternative.value || make_node(AST_Undefined, self2.alternative)
        }).transform(compressor)
      }).optimize(compressor);
    }
    if (self2.body instanceof AST_If && !self2.body.alternative && !self2.alternative) {
      self2 = make_node(AST_If, self2, {
        condition: make_node(AST_Binary, self2.condition, {
          operator: "&&",
          left: self2.condition,
          right: self2.body.condition
        }),
        body: self2.body.body,
        alternative: null
      });
    }
    if (aborts(self2.body)) {
      if (self2.alternative) {
        var alt = self2.alternative;
        self2.alternative = null;
        return make_node(AST_BlockStatement, self2, {
          body: [self2, alt]
        }).optimize(compressor);
      }
    }
    if (aborts(self2.alternative)) {
      var body = self2.body;
      self2.body = self2.alternative;
      self2.condition = negated_is_best ? negated : self2.condition.negate(compressor);
      self2.alternative = null;
      return make_node(AST_BlockStatement, self2, {
        body: [self2, body]
      }).optimize(compressor);
    }
    return self2;
  });
  def_optimize(AST_Switch, function(self2, compressor) {
    if (!compressor.option("switches")) return self2;
    var branch;
    var value = self2.expression.evaluate(compressor);
    if (!(value instanceof AST_Node)) {
      var orig = self2.expression;
      self2.expression = make_node_from_constant(value, orig);
      self2.expression = best_of_expression(self2.expression.transform(compressor), orig);
    }
    if (!compressor.option("dead_code")) return self2;
    if (value instanceof AST_Node) {
      value = self2.expression.tail_node().evaluate(compressor);
    }
    var decl = [];
    var body = [];
    var default_branch;
    var exact_match;
    for (var i = 0, len = self2.body.length; i < len && !exact_match; i++) {
      branch = self2.body[i];
      if (branch instanceof AST_Default) {
        if (!default_branch) {
          default_branch = branch;
        } else {
          eliminate_branch(branch, body[body.length - 1]);
        }
      } else if (!(value instanceof AST_Node)) {
        var exp = branch.expression.evaluate(compressor);
        if (!(exp instanceof AST_Node) && exp !== value) {
          eliminate_branch(branch, body[body.length - 1]);
          continue;
        }
        if (exp instanceof AST_Node && !exp.has_side_effects(compressor)) {
          exp = branch.expression.tail_node().evaluate(compressor);
        }
        if (exp === value) {
          exact_match = branch;
          if (default_branch) {
            var default_index = body.indexOf(default_branch);
            body.splice(default_index, 1);
            eliminate_branch(default_branch, body[default_index - 1]);
            default_branch = null;
          }
        }
      }
      body.push(branch);
    }
    while (i < len) eliminate_branch(self2.body[i++], body[body.length - 1]);
    self2.body = body;
    let default_or_exact = default_branch || exact_match;
    default_branch = null;
    exact_match = null;
    if (body.every((branch2, i2) => (branch2 === default_or_exact || branch2.expression instanceof AST_Constant) && (branch2.body.length === 0 || aborts(branch2) || body.length - 1 === i2))) {
      for (let i2 = 0; i2 < body.length; i2++) {
        const branch2 = body[i2];
        for (let j = i2 + 1; j < body.length; j++) {
          const next = body[j];
          if (next.body.length === 0) continue;
          const last_branch = j === body.length - 1;
          const equivalentBranch = branches_equivalent(next, branch2, false);
          if (equivalentBranch || last_branch && branches_equivalent(next, branch2, true)) {
            if (!equivalentBranch && last_branch) {
              next.body.push(make_node(AST_Break));
            }
            let x = j - 1;
            let fallthroughDepth = 0;
            while (x > i2) {
              if (is_inert_body(body[x--])) {
                fallthroughDepth++;
              } else {
                break;
              }
            }
            const plucked = body.splice(j - fallthroughDepth, 1 + fallthroughDepth);
            body.splice(i2 + 1, 0, ...plucked);
            i2 += plucked.length;
          }
        }
      }
    }
    for (let i2 = 0; i2 < body.length; i2++) {
      let branch2 = body[i2];
      if (branch2.body.length === 0) continue;
      if (!aborts(branch2)) continue;
      for (let j = i2 + 1; j < body.length; i2++, j++) {
        let next = body[j];
        if (next.body.length === 0) continue;
        if (branches_equivalent(next, branch2, false) || j === body.length - 1 && branches_equivalent(next, branch2, true)) {
          branch2.body = [];
          branch2 = next;
          continue;
        }
        break;
      }
    }
    {
      let i2 = body.length - 1;
      for (; i2 >= 0; i2--) {
        let bbody = body[i2].body;
        if (is_break(bbody[bbody.length - 1], compressor)) bbody.pop();
        if (!is_inert_body(body[i2])) break;
      }
      i2++;
      if (!default_or_exact || body.indexOf(default_or_exact) >= i2) {
        for (let j = body.length - 1; j >= i2; j--) {
          let branch2 = body[j];
          if (branch2 === default_or_exact) {
            default_or_exact = null;
            body.pop();
          } else if (!branch2.expression.has_side_effects(compressor)) {
            body.pop();
          } else {
            break;
          }
        }
      }
    }
    DEFAULT: if (default_or_exact) {
      let default_index2 = body.indexOf(default_or_exact);
      let default_body_index = default_index2;
      for (; default_body_index < body.length - 1; default_body_index++) {
        if (!is_inert_body(body[default_body_index])) break;
      }
      if (default_body_index < body.length - 1) {
        break DEFAULT;
      }
      let side_effect_index = body.length - 1;
      for (; side_effect_index >= 0; side_effect_index--) {
        let branch2 = body[side_effect_index];
        if (branch2 === default_or_exact) continue;
        if (branch2.expression.has_side_effects(compressor)) break;
      }
      if (default_body_index > side_effect_index) {
        let prev_body_index = default_index2 - 1;
        for (; prev_body_index >= 0; prev_body_index--) {
          if (!is_inert_body(body[prev_body_index])) break;
        }
        let before = Math.max(side_effect_index, prev_body_index) + 1;
        let after = default_index2;
        if (side_effect_index > default_index2) {
          after = side_effect_index;
          body[side_effect_index].body = body[default_body_index].body;
        } else {
          default_or_exact.body = body[default_body_index].body;
        }
        body.splice(after + 1, default_body_index - after);
        body.splice(before, default_index2 - before);
      }
    }
    DEFAULT: if (default_or_exact) {
      let i2 = body.findIndex((branch2) => !is_inert_body(branch2));
      let caseBody;
      if (i2 === body.length - 1) {
        let branch2 = body[i2];
        if (has_nested_break(self2)) break DEFAULT;
        caseBody = make_node(AST_BlockStatement, branch2, {
          body: branch2.body
        });
        branch2.body = [];
      } else if (i2 !== -1) {
        break DEFAULT;
      }
      let sideEffect = body.find(
        (branch2) => branch2 !== default_or_exact && branch2.expression.has_side_effects(compressor)
      );
      if (!sideEffect) {
        return make_node(AST_BlockStatement, self2, {
          body: decl.concat(
            statement(self2.expression),
            default_or_exact.expression ? statement(default_or_exact.expression) : [],
            caseBody || []
          )
        }).optimize(compressor);
      }
      const default_index2 = body.indexOf(default_or_exact);
      body.splice(default_index2, 1);
      default_or_exact = null;
      if (caseBody) {
        return make_node(AST_BlockStatement, self2, {
          body: decl.concat(self2, caseBody)
        }).optimize(compressor);
      }
    }
    if (body.length > 0) {
      body[0].body = decl.concat(body[0].body);
    }
    if (body.length == 0) {
      return make_node(AST_BlockStatement, self2, {
        body: decl.concat(statement(self2.expression))
      }).optimize(compressor);
    }
    if (body.length == 1 && !has_nested_break(self2)) {
      let branch2 = body[0];
      return make_node(AST_If, self2, {
        condition: make_node(AST_Binary, self2, {
          operator: "===",
          left: self2.expression,
          right: branch2.expression
        }),
        body: make_node(AST_BlockStatement, branch2, {
          body: branch2.body
        }),
        alternative: null
      }).optimize(compressor);
    }
    if (body.length === 2 && default_or_exact && !has_nested_break(self2)) {
      let branch2 = body[0] === default_or_exact ? body[1] : body[0];
      let exact_exp = default_or_exact.expression && statement(default_or_exact.expression);
      if (aborts(body[0])) {
        let first = body[0];
        if (is_break(first.body[first.body.length - 1], compressor)) {
          first.body.pop();
        }
        return make_node(AST_If, self2, {
          condition: make_node(AST_Binary, self2, {
            operator: "===",
            left: self2.expression,
            right: branch2.expression
          }),
          body: make_node(AST_BlockStatement, branch2, {
            body: branch2.body
          }),
          alternative: make_node(AST_BlockStatement, default_or_exact, {
            body: [].concat(
              exact_exp || [],
              default_or_exact.body
            )
          })
        }).optimize(compressor);
      }
      let operator = "===";
      let consequent = make_node(AST_BlockStatement, branch2, {
        body: branch2.body
      });
      let always = make_node(AST_BlockStatement, default_or_exact, {
        body: [].concat(
          exact_exp || [],
          default_or_exact.body
        )
      });
      if (body[0] === default_or_exact) {
        operator = "!==";
        let tmp = always;
        always = consequent;
        consequent = tmp;
      }
      return make_node(AST_BlockStatement, self2, {
        body: [
          make_node(AST_If, self2, {
            condition: make_node(AST_Binary, self2, {
              operator,
              left: self2.expression,
              right: branch2.expression
            }),
            body: consequent,
            alternative: null
          }),
          always
        ]
      }).optimize(compressor);
    }
    return self2;
    function eliminate_branch(branch2, prev) {
      if (prev && !aborts(prev)) {
        prev.body = prev.body.concat(branch2.body);
      } else {
        trim_unreachable_code(compressor, branch2, decl);
      }
    }
    function branches_equivalent(branch2, prev, insertBreak) {
      let bbody = branch2.body;
      let pbody = prev.body;
      if (insertBreak) {
        bbody = bbody.concat(make_node(AST_Break));
      }
      if (bbody.length !== pbody.length) return false;
      let bblock = make_node(AST_BlockStatement, branch2, { body: bbody });
      let pblock = make_node(AST_BlockStatement, prev, { body: pbody });
      return bblock.equivalent_to(pblock);
    }
    function statement(body2) {
      return make_node(AST_SimpleStatement, body2, { body: body2 });
    }
    function has_nested_break(root) {
      let has_break = false;
      let tw = new TreeWalker((node) => {
        if (has_break) return true;
        if (node instanceof AST_Lambda) return true;
        if (node instanceof AST_SimpleStatement) return true;
        if (!is_break(node, tw)) return;
        let parent = tw.parent();
        if (parent instanceof AST_SwitchBranch && parent.body[parent.body.length - 1] === node) {
          return;
        }
        has_break = true;
      });
      root.walk(tw);
      return has_break;
    }
    function is_break(node, stack) {
      return node instanceof AST_Break && stack.loopcontrol_target(node) === self2;
    }
    function is_inert_body(branch2) {
      return !aborts(branch2) && !make_node(AST_BlockStatement, branch2, {
        body: branch2.body
      }).has_side_effects(compressor);
    }
  });
  def_optimize(AST_Try, function(self2, compressor) {
    if (self2.bcatch && self2.bfinally && self2.bfinally.body.every(is_empty)) self2.bfinally = null;
    if (compressor.option("dead_code") && self2.body.body.every(is_empty)) {
      var body = [];
      if (self2.bcatch) {
        trim_unreachable_code(compressor, self2.bcatch, body);
      }
      if (self2.bfinally) body.push(...self2.bfinally.body);
      return make_node(AST_BlockStatement, self2, {
        body
      }).optimize(compressor);
    }
    return self2;
  });
  AST_Definitions.DEFMETHOD("to_assignments", function(compressor) {
    var reduce_vars = compressor.option("reduce_vars");
    var assignments = [];
    for (const def of this.definitions) {
      if (def.value) {
        var name = make_node(AST_SymbolRef, def.name, def.name);
        assignments.push(make_node(AST_Assign, def, {
          operator: "=",
          logical: false,
          left: name,
          right: def.value
        }));
        if (reduce_vars) name.definition().fixed = false;
      }
      const thedef = def.name.definition();
      thedef.eliminated++;
      thedef.replaced--;
    }
    if (assignments.length == 0) return null;
    return make_sequence(this, assignments);
  });
  def_optimize(AST_Definitions, function(self2) {
    if (self2.definitions.length == 0) {
      return make_node(AST_EmptyStatement, self2);
    }
    return self2;
  });
  def_optimize(AST_VarDef, function(self2, compressor) {
    if (self2.name instanceof AST_SymbolLet && self2.value != null && is_undefined(self2.value, compressor)) {
      self2.value = null;
    }
    return self2;
  });
  def_optimize(AST_Import, function(self2) {
    return self2;
  });
  def_optimize(AST_Call, function(self2, compressor) {
    var exp = self2.expression;
    var fn = exp;
    inline_array_like_spread(self2.args);
    var simple_args = self2.args.every((arg2) => !(arg2 instanceof AST_Expansion));
    if (compressor.option("reduce_vars") && fn instanceof AST_SymbolRef) {
      fn = fn.fixed_value();
    }
    var is_func = fn instanceof AST_Lambda;
    if (is_func && fn.pinned()) return self2;
    if (compressor.option("unused") && simple_args && is_func && !fn.uses_arguments) {
      var pos = 0, last = 0;
      for (var i = 0, len = self2.args.length; i < len; i++) {
        if (fn.argnames[i] instanceof AST_Expansion) {
          if (has_flag(fn.argnames[i].expression, UNUSED)) while (i < len) {
            var node = self2.args[i++].drop_side_effect_free(compressor);
            if (node) {
              self2.args[pos++] = node;
            }
          }
          else while (i < len) {
            self2.args[pos++] = self2.args[i++];
          }
          last = pos;
          break;
        }
        var trim2 = i >= fn.argnames.length;
        if (trim2 || has_flag(fn.argnames[i], UNUSED)) {
          var node = self2.args[i].drop_side_effect_free(compressor);
          if (node) {
            self2.args[pos++] = node;
          } else if (!trim2) {
            self2.args[pos++] = make_node(AST_Number, self2.args[i], {
              value: 0
            });
            continue;
          }
        } else {
          self2.args[pos++] = self2.args[i];
        }
        last = pos;
      }
      self2.args.length = last;
    }
    if (compressor.option("unsafe") && !exp.contains_optional()) {
      if (exp instanceof AST_Dot && exp.start.value === "Array" && exp.property === "from" && self2.args.length === 1) {
        const [argument] = self2.args;
        if (argument instanceof AST_Array) {
          return make_node(AST_Array, argument, {
            elements: argument.elements
          }).optimize(compressor);
        }
      }
      if (is_undeclared_ref(exp)) switch (exp.name) {
        case "Array":
          if (self2.args.length != 1) {
            return make_node(AST_Array, self2, {
              elements: self2.args
            }).optimize(compressor);
          } else if (self2.args[0] instanceof AST_Number && self2.args[0].value <= 11) {
            const elements2 = [];
            for (let i2 = 0; i2 < self2.args[0].value; i2++) elements2.push(new AST_Hole());
            return new AST_Array({ elements: elements2 });
          }
          break;
        case "Object":
          if (self2.args.length == 0) {
            return make_node(AST_Object, self2, {
              properties: []
            });
          }
          break;
        case "String":
          if (self2.args.length == 0) return make_node(AST_String, self2, {
            value: ""
          });
          if (self2.args.length <= 1) return make_node(AST_Binary, self2, {
            left: self2.args[0],
            operator: "+",
            right: make_node(AST_String, self2, { value: "" })
          }).optimize(compressor);
          break;
        case "Number":
          if (self2.args.length == 0) return make_node(AST_Number, self2, {
            value: 0
          });
          if (self2.args.length == 1 && compressor.option("unsafe_math")) {
            return make_node(AST_UnaryPrefix, self2, {
              expression: self2.args[0],
              operator: "+"
            }).optimize(compressor);
          }
          break;
        case "Symbol":
          if (self2.args.length == 1 && self2.args[0] instanceof AST_String && compressor.option("unsafe_symbols"))
            self2.args.length = 0;
          break;
        case "Boolean":
          if (self2.args.length == 0) return make_node(AST_False, self2);
          if (self2.args.length == 1) return make_node(AST_UnaryPrefix, self2, {
            expression: make_node(AST_UnaryPrefix, self2, {
              expression: self2.args[0],
              operator: "!"
            }),
            operator: "!"
          }).optimize(compressor);
          break;
        case "RegExp":
          var params = [];
          if (self2.args.length >= 1 && self2.args.length <= 2 && self2.args.every((arg2) => {
            var value2 = arg2.evaluate(compressor);
            params.push(value2);
            return arg2 !== value2;
          }) && regexp_is_safe(params[0])) {
            let [source, flags] = params;
            source = regexp_source_fix(new RegExp(source).source);
            const rx = make_node(AST_RegExp, self2, {
              value: { source, flags }
            });
            if (rx._eval(compressor) !== rx) {
              return rx;
            }
          }
          break;
      }
      else if (exp instanceof AST_Dot) switch (exp.property) {
        case "toString":
          if (self2.args.length == 0 && !exp.expression.may_throw_on_access(compressor)) {
            return make_node(AST_Binary, self2, {
              left: make_node(AST_String, self2, { value: "" }),
              operator: "+",
              right: exp.expression
            }).optimize(compressor);
          }
          break;
        case "join":
          if (exp.expression instanceof AST_Array) EXIT: {
            var separator;
            if (self2.args.length > 0) {
              separator = self2.args[0].evaluate(compressor);
              if (separator === self2.args[0]) break EXIT;
            }
            var elements = [];
            var consts = [];
            for (var i = 0, len = exp.expression.elements.length; i < len; i++) {
              var el = exp.expression.elements[i];
              if (el instanceof AST_Expansion) break EXIT;
              var value = el.evaluate(compressor);
              if (value !== el) {
                consts.push(value);
              } else {
                if (consts.length > 0) {
                  elements.push(make_node(AST_String, self2, {
                    value: consts.join(separator)
                  }));
                  consts.length = 0;
                }
                elements.push(el);
              }
            }
            if (consts.length > 0) {
              elements.push(make_node(AST_String, self2, {
                value: consts.join(separator)
              }));
            }
            if (elements.length == 0) return make_node(AST_String, self2, { value: "" });
            if (elements.length == 1) {
              if (elements[0].is_string(compressor)) {
                return elements[0];
              }
              return make_node(AST_Binary, elements[0], {
                operator: "+",
                left: make_node(AST_String, self2, { value: "" }),
                right: elements[0]
              });
            }
            if (separator == "") {
              var first;
              if (elements[0].is_string(compressor) || elements[1].is_string(compressor)) {
                first = elements.shift();
              } else {
                first = make_node(AST_String, self2, { value: "" });
              }
              return elements.reduce(function(prev, el2) {
                return make_node(AST_Binary, el2, {
                  operator: "+",
                  left: prev,
                  right: el2
                });
              }, first).optimize(compressor);
            }
            var node = self2.clone();
            node.expression = node.expression.clone();
            node.expression.expression = node.expression.expression.clone();
            node.expression.expression.elements = elements;
            return best_of(compressor, self2, node);
          }
          break;
        case "charAt":
          if (exp.expression.is_string(compressor)) {
            var arg = self2.args[0];
            var index = arg ? arg.evaluate(compressor) : 0;
            if (index !== arg) {
              return make_node(AST_Sub, exp, {
                expression: exp.expression,
                property: make_node_from_constant(index | 0, arg || exp)
              }).optimize(compressor);
            }
          }
          break;
        case "apply":
          if (self2.args.length == 2 && self2.args[1] instanceof AST_Array) {
            var args = self2.args[1].elements.slice();
            args.unshift(self2.args[0]);
            return make_node(AST_Call, self2, {
              expression: make_node(AST_Dot, exp, {
                expression: exp.expression,
                optional: false,
                property: "call"
              }),
              args
            }).optimize(compressor);
          }
          break;
        case "call":
          var func = exp.expression;
          if (func instanceof AST_SymbolRef) {
            func = func.fixed_value();
          }
          if (func instanceof AST_Lambda && !func.contains_this()) {
            return (self2.args.length ? make_sequence(this, [
              self2.args[0],
              make_node(AST_Call, self2, {
                expression: exp.expression,
                args: self2.args.slice(1)
              })
            ]) : make_node(AST_Call, self2, {
              expression: exp.expression,
              args: []
            })).optimize(compressor);
          }
          break;
      }
    }
    if (compressor.option("unsafe_Function") && is_undeclared_ref(exp) && exp.name == "Function") {
      if (self2.args.length == 0) return make_empty_function(self2).optimize(compressor);
      if (self2.args.every((x) => x instanceof AST_String)) {
        try {
          var code = "n(function(" + self2.args.slice(0, -1).map(function(arg2) {
            return arg2.value;
          }).join(",") + "){" + self2.args[self2.args.length - 1].value + "})";
          var ast = parse(code);
          var mangle = compressor.mangle_options();
          ast.figure_out_scope(mangle);
          var comp = new Compressor(compressor.options, {
            mangle_options: compressor._mangle_options
          });
          ast = ast.transform(comp);
          ast.figure_out_scope(mangle);
          ast.compute_char_frequency(mangle);
          ast.mangle_names(mangle);
          var fun;
          walk(ast, (node2) => {
            if (is_func_expr(node2)) {
              fun = node2;
              return walk_abort;
            }
          });
          var code = OutputStream();
          AST_BlockStatement.prototype._codegen.call(fun, fun, code);
          self2.args = [
            make_node(AST_String, self2, {
              value: fun.argnames.map(function(arg2) {
                return arg2.print_to_string();
              }).join(",")
            }),
            make_node(AST_String, self2.args[self2.args.length - 1], {
              value: code.get().replace(/^{|}$/g, "")
            })
          ];
          return self2;
        } catch (ex) {
          if (!(ex instanceof JS_Parse_Error)) {
            throw ex;
          }
        }
      }
    }
    return inline_into_call(self2, compressor);
  });
  AST_Node.DEFMETHOD("contains_optional", function() {
    if (this instanceof AST_PropAccess || this instanceof AST_Call || this instanceof AST_Chain) {
      if (this.optional) {
        return true;
      } else {
        return this.expression.contains_optional();
      }
    } else {
      return false;
    }
  });
  def_optimize(AST_New, function(self2, compressor) {
    if (compressor.option("unsafe") && is_undeclared_ref(self2.expression) && ["Object", "RegExp", "Function", "Error", "Array"].includes(self2.expression.name)) return make_node(AST_Call, self2, self2).transform(compressor);
    return self2;
  });
  def_optimize(AST_Sequence, function(self2, compressor) {
    if (!compressor.option("side_effects")) return self2;
    var expressions = [];
    filter_for_side_effects();
    var end = expressions.length - 1;
    trim_right_for_undefined();
    if (end == 0) {
      self2 = maintain_this_binding(compressor.parent(), compressor.self(), expressions[0]);
      if (!(self2 instanceof AST_Sequence)) self2 = self2.optimize(compressor);
      return self2;
    }
    self2.expressions = expressions;
    return self2;
    function filter_for_side_effects() {
      var first = first_in_statement(compressor);
      var last = self2.expressions.length - 1;
      self2.expressions.forEach(function(expr, index) {
        if (index < last) expr = expr.drop_side_effect_free(compressor, first);
        if (expr) {
          merge_sequence(expressions, expr);
          first = false;
        }
      });
    }
    function trim_right_for_undefined() {
      while (end > 0 && is_undefined(expressions[end], compressor)) end--;
      if (end < expressions.length - 1) {
        expressions[end] = make_node(AST_UnaryPrefix, self2, {
          operator: "void",
          expression: expressions[end]
        });
        expressions.length = end + 1;
      }
    }
  });
  AST_Unary.DEFMETHOD("lift_sequences", function(compressor) {
    if (compressor.option("sequences")) {
      if (this.expression instanceof AST_Sequence) {
        var x = this.expression.expressions.slice();
        var e = this.clone();
        e.expression = x.pop();
        x.push(e);
        return make_sequence(this, x).optimize(compressor);
      }
    }
    return this;
  });
  def_optimize(AST_UnaryPostfix, function(self2, compressor) {
    return self2.lift_sequences(compressor);
  });
  def_optimize(AST_UnaryPrefix, function(self2, compressor) {
    var e = self2.expression;
    if (self2.operator == "delete" && !(e instanceof AST_SymbolRef || e instanceof AST_PropAccess || e instanceof AST_Chain || is_identifier_atom(e))) {
      return make_sequence(self2, [e, make_node(AST_True, self2)]).optimize(compressor);
    }
    var seq = self2.lift_sequences(compressor);
    if (seq !== self2) {
      return seq;
    }
    if (compressor.option("side_effects") && self2.operator == "void") {
      e = e.drop_side_effect_free(compressor);
      if (e) {
        self2.expression = e;
        return self2;
      } else {
        return make_node(AST_Undefined, self2).optimize(compressor);
      }
    }
    if (compressor.in_boolean_context()) {
      switch (self2.operator) {
        case "!":
          if (e instanceof AST_UnaryPrefix && e.operator == "!") {
            return e.expression;
          }
          if (e instanceof AST_Binary) {
            self2 = best_of(compressor, self2, e.negate(compressor, first_in_statement(compressor)));
          }
          break;
        case "typeof":
          return (e instanceof AST_SymbolRef ? make_node(AST_True, self2) : make_sequence(self2, [
            e,
            make_node(AST_True, self2)
          ])).optimize(compressor);
      }
    }
    if (self2.operator == "-" && e instanceof AST_Infinity) {
      e = e.transform(compressor);
    }
    if (e instanceof AST_Binary && (self2.operator == "+" || self2.operator == "-") && (e.operator == "*" || e.operator == "/" || e.operator == "%")) {
      return make_node(AST_Binary, self2, {
        operator: e.operator,
        left: make_node(AST_UnaryPrefix, e.left, {
          operator: self2.operator,
          expression: e.left
        }),
        right: e.right
      });
    }
    if (compressor.option("evaluate")) {
      if (self2.operator === "~" && self2.expression instanceof AST_UnaryPrefix && self2.expression.operator === "~" && (compressor.in_32_bit_context() || self2.expression.expression.is_32_bit_integer())) {
        return self2.expression.expression;
      }
      if (self2.operator === "~" && e instanceof AST_Binary && e.operator === "^") {
        if (e.left instanceof AST_UnaryPrefix && e.left.operator === "~") {
          e.left = e.left.bitwise_negate(true);
        } else {
          e.right = e.right.bitwise_negate(true);
        }
        return e;
      }
    }
    if (self2.operator != "-" || !(e instanceof AST_Number || e instanceof AST_Infinity || e instanceof AST_BigInt)) {
      var ev = self2.evaluate(compressor);
      if (ev !== self2) {
        ev = make_node_from_constant(ev, self2).optimize(compressor);
        return best_of(compressor, ev, self2);
      }
    }
    return self2;
  });
  AST_Binary.DEFMETHOD("lift_sequences", function(compressor) {
    if (compressor.option("sequences")) {
      if (this.left instanceof AST_Sequence) {
        var x = this.left.expressions.slice();
        var e = this.clone();
        e.left = x.pop();
        x.push(e);
        return make_sequence(this, x).optimize(compressor);
      }
      if (this.right instanceof AST_Sequence && !this.left.has_side_effects(compressor)) {
        var assign = this.operator == "=" && this.left instanceof AST_SymbolRef;
        var x = this.right.expressions;
        var last = x.length - 1;
        for (var i = 0; i < last; i++) {
          if (!assign && x[i].has_side_effects(compressor)) break;
        }
        if (i == last) {
          x = x.slice();
          var e = this.clone();
          e.right = x.pop();
          x.push(e);
          return make_sequence(this, x).optimize(compressor);
        } else if (i > 0) {
          var e = this.clone();
          e.right = make_sequence(this.right, x.slice(i));
          x = x.slice(0, i);
          x.push(e);
          return make_sequence(this, x).optimize(compressor);
        }
      }
    }
    return this;
  });
  var commutativeOperators = makePredicate("== === != !== * & | ^");
  function is_object(node) {
    return node instanceof AST_Array || node instanceof AST_Lambda || node instanceof AST_Object || node instanceof AST_Class;
  }
  def_optimize(AST_Binary, function(self2, compressor) {
    function reversible() {
      return self2.left.is_constant() || self2.right.is_constant() || !self2.left.has_side_effects(compressor) && !self2.right.has_side_effects(compressor);
    }
    function reverse(op) {
      if (reversible()) {
        if (op) self2.operator = op;
        var tmp = self2.left;
        self2.left = self2.right;
        self2.right = tmp;
      }
    }
    if (compressor.option("lhs_constants") && commutativeOperators.has(self2.operator)) {
      if (self2.right.is_constant() && !self2.left.is_constant()) {
        if (!(self2.left instanceof AST_Binary && PRECEDENCE[self2.left.operator] >= PRECEDENCE[self2.operator])) {
          reverse();
        }
      }
    }
    self2 = self2.lift_sequences(compressor);
    if (compressor.option("comparisons")) switch (self2.operator) {
      case "===":
      case "!==":
        var is_strict_comparison = true;
        if (self2.left.is_string(compressor) && self2.right.is_string(compressor) || self2.left.is_number(compressor) && self2.right.is_number(compressor) || self2.left.is_boolean() && self2.right.is_boolean() || self2.left.equivalent_to(self2.right)) {
          self2.operator = self2.operator.substr(0, 2);
        }
      // XXX: intentionally falling down to the next case
      case "==":
      case "!=":
        if (!is_strict_comparison && is_undefined(self2.left, compressor)) {
          self2.left = make_node(AST_Null, self2.left);
        } else if (!is_strict_comparison && is_undefined(self2.right, compressor)) {
          self2.right = make_node(AST_Null, self2.right);
        } else if (compressor.option("typeofs") && self2.left instanceof AST_String && self2.left.value == "undefined" && self2.right instanceof AST_UnaryPrefix && self2.right.operator == "typeof") {
          var expr = self2.right.expression;
          if (expr instanceof AST_SymbolRef ? expr.is_declared(compressor) : !(expr instanceof AST_PropAccess && compressor.option("ie8"))) {
            self2.right = expr;
            self2.left = make_node(AST_Undefined, self2.left).optimize(compressor);
            if (self2.operator.length == 2) self2.operator += "=";
          }
        } else if (compressor.option("typeofs") && self2.left instanceof AST_UnaryPrefix && self2.left.operator == "typeof" && self2.right instanceof AST_String && self2.right.value == "undefined") {
          var expr = self2.left.expression;
          if (expr instanceof AST_SymbolRef ? expr.is_declared(compressor) : !(expr instanceof AST_PropAccess && compressor.option("ie8"))) {
            self2.left = expr;
            self2.right = make_node(AST_Undefined, self2.right).optimize(compressor);
            if (self2.operator.length == 2) self2.operator += "=";
          }
        } else if (self2.left instanceof AST_SymbolRef && self2.right instanceof AST_SymbolRef && self2.left.definition() === self2.right.definition() && is_object(self2.left.fixed_value())) {
          return make_node(self2.operator[0] == "=" ? AST_True : AST_False, self2);
        } else if (self2.left.is_32_bit_integer() && self2.right.is_32_bit_integer()) {
          const not = (node) => make_node(AST_UnaryPrefix, node, {
            operator: "!",
            expression: node
          });
          const booleanify = (node, truthy) => {
            if (truthy) {
              return compressor.in_boolean_context() ? node : not(not(node));
            } else {
              return not(node);
            }
          };
          if (self2.left instanceof AST_Number && self2.left.value === 0) {
            return booleanify(self2.right, self2.operator[0] === "!");
          }
          if (self2.right instanceof AST_Number && self2.right.value === 0) {
            return booleanify(self2.left, self2.operator[0] === "!");
          }
          let and_op, x, mask;
          if ((and_op = self2.left instanceof AST_Binary ? self2.left : self2.right instanceof AST_Binary ? self2.right : null) && (mask = and_op === self2.left ? self2.right : self2.left) && and_op.operator === "&" && mask instanceof AST_Number && mask.is_32_bit_integer() && (x = and_op.left.equivalent_to(mask) ? and_op.right : and_op.right.equivalent_to(mask) ? and_op.left : null)) {
            let optimized = booleanify(make_node(AST_Binary, self2, {
              operator: "&",
              left: mask,
              right: make_node(AST_UnaryPrefix, self2, {
                operator: "~",
                expression: x
              })
            }), self2.operator[0] === "!");
            return best_of(compressor, optimized, self2);
          }
        }
        break;
      case "&&":
      case "||":
        var lhs = self2.left;
        if (lhs.operator == self2.operator) {
          lhs = lhs.right;
        }
        if (lhs instanceof AST_Binary && lhs.operator == (self2.operator == "&&" ? "!==" : "===") && self2.right instanceof AST_Binary && lhs.operator == self2.right.operator && (is_undefined(lhs.left, compressor) && self2.right.left instanceof AST_Null || lhs.left instanceof AST_Null && is_undefined(self2.right.left, compressor)) && !lhs.right.has_side_effects(compressor) && lhs.right.equivalent_to(self2.right.right)) {
          var combined = make_node(AST_Binary, self2, {
            operator: lhs.operator.slice(0, -1),
            left: make_node(AST_Null, self2),
            right: lhs.right
          });
          if (lhs !== self2.left) {
            combined = make_node(AST_Binary, self2, {
              operator: self2.operator,
              left: self2.left.left,
              right: combined
            });
          }
          return combined;
        }
        break;
    }
    if (self2.operator == "+" && compressor.in_boolean_context()) {
      var ll = self2.left.evaluate(compressor);
      var rr = self2.right.evaluate(compressor);
      if (ll && typeof ll == "string") {
        return make_sequence(self2, [
          self2.right,
          make_node(AST_True, self2)
        ]).optimize(compressor);
      }
      if (rr && typeof rr == "string") {
        return make_sequence(self2, [
          self2.left,
          make_node(AST_True, self2)
        ]).optimize(compressor);
      }
    }
    if (compressor.option("comparisons") && self2.is_boolean()) {
      if (!(compressor.parent() instanceof AST_Binary) || compressor.parent() instanceof AST_Assign) {
        var negated = make_node(AST_UnaryPrefix, self2, {
          operator: "!",
          expression: self2.negate(compressor, first_in_statement(compressor))
        });
        self2 = best_of(compressor, self2, negated);
      }
      if (compressor.option("unsafe_comps")) {
        switch (self2.operator) {
          case "<":
            reverse(">");
            break;
          case "<=":
            reverse(">=");
            break;
        }
      }
    }
    if (self2.operator == "+") {
      if (self2.right instanceof AST_String && self2.right.getValue() == "" && self2.left.is_string(compressor)) {
        return self2.left;
      }
      if (self2.left instanceof AST_String && self2.left.getValue() == "" && self2.right.is_string(compressor)) {
        return self2.right;
      }
      if (self2.left instanceof AST_Binary && self2.left.operator == "+" && self2.left.left instanceof AST_String && self2.left.left.getValue() == "" && self2.right.is_string(compressor)) {
        self2.left = self2.left.right;
        return self2;
      }
    }
    if (compressor.option("evaluate")) {
      switch (self2.operator) {
        case "&&":
          var ll = has_flag(self2.left, TRUTHY) ? true : has_flag(self2.left, FALSY) ? false : self2.left.evaluate(compressor);
          if (!ll) {
            return maintain_this_binding(compressor.parent(), compressor.self(), self2.left).optimize(compressor);
          } else if (!(ll instanceof AST_Node)) {
            return make_sequence(self2, [self2.left, self2.right]).optimize(compressor);
          }
          var rr = self2.right.evaluate(compressor);
          if (!rr) {
            if (compressor.in_boolean_context()) {
              return make_sequence(self2, [
                self2.left,
                make_node(AST_False, self2)
              ]).optimize(compressor);
            } else {
              set_flag(self2, FALSY);
            }
          } else if (!(rr instanceof AST_Node)) {
            var parent = compressor.parent();
            if (parent.operator == "&&" && parent.left === compressor.self() || compressor.in_boolean_context()) {
              return self2.left.optimize(compressor);
            }
          }
          if (self2.left.operator == "||") {
            var lr = self2.left.right.evaluate(compressor);
            if (!lr) return make_node(AST_Conditional, self2, {
              condition: self2.left.left,
              consequent: self2.right,
              alternative: self2.left.right
            }).optimize(compressor);
          }
          break;
        case "||":
          var ll = has_flag(self2.left, TRUTHY) ? true : has_flag(self2.left, FALSY) ? false : self2.left.evaluate(compressor);
          if (!ll) {
            return make_sequence(self2, [self2.left, self2.right]).optimize(compressor);
          } else if (!(ll instanceof AST_Node)) {
            return maintain_this_binding(compressor.parent(), compressor.self(), self2.left).optimize(compressor);
          }
          var rr = self2.right.evaluate(compressor);
          if (!rr) {
            var parent = compressor.parent();
            if (parent.operator == "||" && parent.left === compressor.self() || compressor.in_boolean_context()) {
              return self2.left.optimize(compressor);
            }
          } else if (!(rr instanceof AST_Node)) {
            if (compressor.in_boolean_context()) {
              return make_sequence(self2, [
                self2.left,
                make_node(AST_True, self2)
              ]).optimize(compressor);
            } else {
              set_flag(self2, TRUTHY);
            }
          }
          if (self2.left.operator == "&&") {
            var lr = self2.left.right.evaluate(compressor);
            if (lr && !(lr instanceof AST_Node)) return make_node(AST_Conditional, self2, {
              condition: self2.left.left,
              consequent: self2.left.right,
              alternative: self2.right
            }).optimize(compressor);
          }
          break;
        case "??":
          if (is_nullish(self2.left, compressor)) {
            return self2.right;
          }
          var ll = self2.left.evaluate(compressor);
          if (!(ll instanceof AST_Node)) {
            return ll == null ? self2.right : self2.left;
          }
          if (compressor.in_boolean_context()) {
            const rr2 = self2.right.evaluate(compressor);
            if (!(rr2 instanceof AST_Node) && !rr2) {
              return self2.left;
            }
          }
      }
      var associative = true;
      switch (self2.operator) {
        case "+":
          if (self2.right instanceof AST_Constant && self2.left instanceof AST_Binary && self2.left.operator == "+" && self2.left.is_string(compressor)) {
            var binary = make_node(AST_Binary, self2, {
              operator: "+",
              left: self2.left.right,
              right: self2.right
            });
            var r = binary.optimize(compressor);
            if (binary !== r) {
              self2 = make_node(AST_Binary, self2, {
                operator: "+",
                left: self2.left.left,
                right: r
              });
            }
          }
          if (self2.left instanceof AST_Binary && self2.left.operator == "+" && self2.left.is_string(compressor) && self2.right instanceof AST_Binary && self2.right.operator == "+" && self2.right.is_string(compressor)) {
            var binary = make_node(AST_Binary, self2, {
              operator: "+",
              left: self2.left.right,
              right: self2.right.left
            });
            var m = binary.optimize(compressor);
            if (binary !== m) {
              self2 = make_node(AST_Binary, self2, {
                operator: "+",
                left: make_node(AST_Binary, self2.left, {
                  operator: "+",
                  left: self2.left.left,
                  right: m
                }),
                right: self2.right.right
              });
            }
          }
          if (self2.right instanceof AST_UnaryPrefix && self2.right.operator == "-" && self2.left.is_number(compressor)) {
            self2 = make_node(AST_Binary, self2, {
              operator: "-",
              left: self2.left,
              right: self2.right.expression
            });
            break;
          }
          if (self2.left instanceof AST_UnaryPrefix && self2.left.operator == "-" && reversible() && self2.right.is_number(compressor)) {
            self2 = make_node(AST_Binary, self2, {
              operator: "-",
              left: self2.right,
              right: self2.left.expression
            });
            break;
          }
          if (self2.left instanceof AST_TemplateString) {
            var l = self2.left;
            var r = self2.right.evaluate(compressor);
            if (r != self2.right) {
              l.segments[l.segments.length - 1].value += String(r);
              return l;
            }
          }
          if (self2.right instanceof AST_TemplateString) {
            var r = self2.right;
            var l = self2.left.evaluate(compressor);
            if (l != self2.left) {
              r.segments[0].value = String(l) + r.segments[0].value;
              return r;
            }
          }
          if (self2.left instanceof AST_TemplateString && self2.right instanceof AST_TemplateString) {
            var l = self2.left;
            var segments = l.segments;
            var r = self2.right;
            segments[segments.length - 1].value += r.segments[0].value;
            for (var i = 1; i < r.segments.length; i++) {
              segments.push(r.segments[i]);
            }
            return l;
          }
        case "*":
          associative = compressor.option("unsafe_math");
        case "&":
        case "|":
        case "^":
          if (self2.left.is_number(compressor) && self2.right.is_number(compressor) && reversible() && !(self2.left instanceof AST_Binary && self2.left.operator != self2.operator && PRECEDENCE[self2.left.operator] >= PRECEDENCE[self2.operator])) {
            var reversed = make_node(AST_Binary, self2, {
              operator: self2.operator,
              left: self2.right,
              right: self2.left
            });
            if (self2.right instanceof AST_Constant && !(self2.left instanceof AST_Constant)) {
              self2 = best_of(compressor, reversed, self2);
            } else {
              self2 = best_of(compressor, self2, reversed);
            }
          }
          if (associative && self2.is_number(compressor)) {
            if (self2.right instanceof AST_Binary && self2.right.operator == self2.operator) {
              self2 = make_node(AST_Binary, self2, {
                operator: self2.operator,
                left: make_node(AST_Binary, self2.left, {
                  operator: self2.operator,
                  left: self2.left,
                  right: self2.right.left,
                  start: self2.left.start,
                  end: self2.right.left.end
                }),
                right: self2.right.right
              });
            }
            if (self2.right instanceof AST_Constant && self2.left instanceof AST_Binary && self2.left.operator == self2.operator) {
              if (self2.left.left instanceof AST_Constant) {
                self2 = make_node(AST_Binary, self2, {
                  operator: self2.operator,
                  left: make_node(AST_Binary, self2.left, {
                    operator: self2.operator,
                    left: self2.left.left,
                    right: self2.right,
                    start: self2.left.left.start,
                    end: self2.right.end
                  }),
                  right: self2.left.right
                });
              } else if (self2.left.right instanceof AST_Constant) {
                self2 = make_node(AST_Binary, self2, {
                  operator: self2.operator,
                  left: make_node(AST_Binary, self2.left, {
                    operator: self2.operator,
                    left: self2.left.right,
                    right: self2.right,
                    start: self2.left.right.start,
                    end: self2.right.end
                  }),
                  right: self2.left.left
                });
              }
            }
            if (self2.left instanceof AST_Binary && self2.left.operator == self2.operator && self2.left.right instanceof AST_Constant && self2.right instanceof AST_Binary && self2.right.operator == self2.operator && self2.right.left instanceof AST_Constant) {
              self2 = make_node(AST_Binary, self2, {
                operator: self2.operator,
                left: make_node(AST_Binary, self2.left, {
                  operator: self2.operator,
                  left: make_node(AST_Binary, self2.left.left, {
                    operator: self2.operator,
                    left: self2.left.right,
                    right: self2.right.left,
                    start: self2.left.right.start,
                    end: self2.right.left.end
                  }),
                  right: self2.left.left
                }),
                right: self2.right.right
              });
            }
          }
      }
      if (bitwise_binop.has(self2.operator)) {
        let y, z, x_node, y_node, z_node = self2.left;
        if (self2.operator === "&" && self2.right instanceof AST_Binary && self2.right.operator === "|" && typeof (z = self2.left.evaluate(compressor)) === "number") {
          if (typeof (y = self2.right.right.evaluate(compressor)) === "number") {
            x_node = self2.right.left;
            y_node = self2.right.right;
          } else if (typeof (y = self2.right.left.evaluate(compressor)) === "number") {
            x_node = self2.right.right;
            y_node = self2.right.left;
          }
          if (x_node && y_node) {
            if ((y & z) === 0) {
              self2 = make_node(AST_Binary, self2, {
                operator: self2.operator,
                left: z_node,
                right: x_node
              });
            } else {
              const reordered_ops = make_node(AST_Binary, self2, {
                operator: "|",
                left: make_node(AST_Binary, self2, {
                  operator: "&",
                  left: x_node,
                  right: z_node
                }),
                right: make_node_from_constant(y & z, y_node)
              });
              self2 = best_of(compressor, self2, reordered_ops);
            }
          }
        }
        const same_operands = self2.left.equivalent_to(self2.right) && !self2.left.has_side_effects(compressor);
        if (same_operands) {
          if (self2.operator === "^") {
            return make_node(AST_Number, self2, { value: 0 });
          }
          if (self2.operator === "|" || self2.operator === "&") {
            self2.left = make_node(AST_Number, self2, { value: 0 });
            self2.operator = "|";
          }
        }
        if ((self2.operator === "<<" || self2.operator === ">>") && self2.right instanceof AST_Number && self2.right.value === 0) {
          self2.operator = "|";
        }
        const zero_side = self2.right instanceof AST_Number && self2.right.value === 0 ? self2.right : self2.left instanceof AST_Number && self2.left.value === 0 ? self2.left : null;
        const non_zero_side = zero_side && (zero_side === self2.right ? self2.left : self2.right);
        if (zero_side && (self2.operator === "|" || self2.operator === "^") && (non_zero_side.is_32_bit_integer() || compressor.in_32_bit_context())) {
          return non_zero_side;
        }
        if (zero_side && self2.operator === "&" && !non_zero_side.has_side_effects(compressor)) {
          return zero_side;
        }
        const is_full_mask = (node) => node instanceof AST_Number && node.value === -1 || node instanceof AST_UnaryPrefix && (node.operator === "-" && node.expression instanceof AST_Number && node.expression.value === 1 || node.operator === "~" && node.expression instanceof AST_Number && node.expression.value === 0);
        const full_mask = is_full_mask(self2.right) ? self2.right : is_full_mask(self2.left) ? self2.left : null;
        const non_full_mask_side = full_mask && (full_mask === self2.right ? self2.left : self2.right);
        switch (self2.operator) {
          case "|":
            if (full_mask && !non_full_mask_side.has_side_effects(compressor)) {
              return full_mask;
            }
            break;
          case "&":
            if (full_mask && (non_full_mask_side.is_32_bit_integer() || compressor.in_32_bit_context())) {
              return non_full_mask_side;
            }
            break;
          case "^":
            if (full_mask) {
              return non_full_mask_side.bitwise_negate(compressor.in_32_bit_context());
            }
            if (self2.left instanceof AST_UnaryPrefix && self2.left.operator === "~" && self2.right instanceof AST_UnaryPrefix && self2.right.operator === "~") {
              self2 = make_node(AST_Binary, self2, {
                operator: "^",
                left: self2.left.expression,
                right: self2.right.expression
              });
            }
            break;
        }
      }
    }
    if (self2.right instanceof AST_Binary && self2.right.operator == self2.operator && (lazy_op.has(self2.operator) || self2.operator == "+" && (self2.right.left.is_string(compressor) || self2.left.is_string(compressor) && self2.right.right.is_string(compressor)))) {
      self2.left = make_node(AST_Binary, self2.left, {
        operator: self2.operator,
        left: self2.left.transform(compressor),
        right: self2.right.left.transform(compressor)
      });
      self2.right = self2.right.right.transform(compressor);
      return self2.transform(compressor);
    }
    var ev = self2.evaluate(compressor);
    if (ev !== self2) {
      ev = make_node_from_constant(ev, self2).optimize(compressor);
      return best_of(compressor, ev, self2);
    }
    return self2;
  });
  def_optimize(AST_SymbolExport, function(self2) {
    return self2;
  });
  def_optimize(AST_SymbolRef, function(self2, compressor) {
    if (!compressor.option("ie8") && is_undeclared_ref(self2) && !compressor.find_parent(AST_With)) {
      switch (self2.name) {
        case "undefined":
          return make_node(AST_Undefined, self2).optimize(compressor);
        case "NaN":
          return make_node(AST_NaN, self2).optimize(compressor);
        case "Infinity":
          return make_node(AST_Infinity, self2).optimize(compressor);
      }
    }
    if (compressor.option("reduce_vars") && !compressor.is_lhs()) {
      return inline_into_symbolref(self2, compressor);
    } else {
      return self2;
    }
  });
  function is_atomic(lhs, self2) {
    return lhs instanceof AST_SymbolRef || lhs.TYPE === self2.TYPE;
  }
  def_optimize(AST_Undefined, function(self2, compressor) {
    if (compressor.option("unsafe_undefined")) {
      var undef = find_variable(compressor, "undefined");
      if (undef) {
        var ref = make_node(AST_SymbolRef, self2, {
          name: "undefined",
          scope: undef.scope,
          thedef: undef
        });
        set_flag(ref, UNDEFINED);
        return ref;
      }
    }
    var lhs = compressor.is_lhs();
    if (lhs && is_atomic(lhs, self2)) return self2;
    return make_node(AST_UnaryPrefix, self2, {
      operator: "void",
      expression: make_node(AST_Number, self2, {
        value: 0
      })
    });
  });
  def_optimize(AST_Infinity, function(self2, compressor) {
    var lhs = compressor.is_lhs();
    if (lhs && is_atomic(lhs, self2)) return self2;
    if (compressor.option("keep_infinity") && !(lhs && !is_atomic(lhs, self2)) && !find_variable(compressor, "Infinity")) {
      return self2;
    }
    return make_node(AST_Binary, self2, {
      operator: "/",
      left: make_node(AST_Number, self2, {
        value: 1
      }),
      right: make_node(AST_Number, self2, {
        value: 0
      })
    });
  });
  def_optimize(AST_NaN, function(self2, compressor) {
    var lhs = compressor.is_lhs();
    if (lhs && !is_atomic(lhs, self2) || find_variable(compressor, "NaN")) {
      return make_node(AST_Binary, self2, {
        operator: "/",
        left: make_node(AST_Number, self2, {
          value: 0
        }),
        right: make_node(AST_Number, self2, {
          value: 0
        })
      });
    }
    return self2;
  });
  var ASSIGN_OPS = makePredicate("+ - / * % >> << >>> | ^ &");
  var ASSIGN_OPS_COMMUTATIVE = makePredicate("* | ^ &");
  def_optimize(AST_Assign, function(self2, compressor) {
    if (self2.logical) {
      return self2.lift_sequences(compressor);
    }
    var def;
    if (self2.operator === "=" && self2.left instanceof AST_SymbolRef && self2.left.name !== "arguments" && !(def = self2.left.definition()).undeclared && self2.right.equivalent_to(self2.left)) {
      return self2.right;
    }
    if (compressor.option("dead_code") && self2.left instanceof AST_SymbolRef && (def = self2.left.definition()).scope === compressor.find_parent(AST_Lambda)) {
      var level = 0, node, parent = self2;
      do {
        node = parent;
        parent = compressor.parent(level++);
        if (parent instanceof AST_Exit) {
          if (in_try(level, parent)) break;
          if (is_reachable(def.scope, [def])) break;
          if (self2.operator == "=") return self2.right;
          def.fixed = false;
          return make_node(AST_Binary, self2, {
            operator: self2.operator.slice(0, -1),
            left: self2.left,
            right: self2.right
          }).optimize(compressor);
        }
      } while (parent instanceof AST_Binary && parent.right === node || parent instanceof AST_Sequence && parent.tail_node() === node);
    }
    self2 = self2.lift_sequences(compressor);
    if (self2.operator == "=" && self2.left instanceof AST_SymbolRef && self2.right instanceof AST_Binary) {
      if (self2.right.left instanceof AST_SymbolRef && self2.right.left.name == self2.left.name && ASSIGN_OPS.has(self2.right.operator)) {
        self2.operator = self2.right.operator + "=";
        self2.right = self2.right.right;
      } else if (self2.right.right instanceof AST_SymbolRef && self2.right.right.name == self2.left.name && ASSIGN_OPS_COMMUTATIVE.has(self2.right.operator) && !self2.right.left.has_side_effects(compressor)) {
        self2.operator = self2.right.operator + "=";
        self2.right = self2.right.left;
      }
    }
    return self2;
    function in_try(level2, node2) {
      function may_assignment_throw() {
        const right = self2.right;
        self2.right = make_node(AST_Null, right);
        const may_throw = node2.may_throw(compressor);
        self2.right = right;
        return may_throw;
      }
      var stop_at = self2.left.definition().scope.get_defun_scope();
      var parent2;
      while ((parent2 = compressor.parent(level2++)) !== stop_at) {
        if (parent2 instanceof AST_Try) {
          if (parent2.bfinally) return true;
          if (parent2.bcatch && may_assignment_throw()) return true;
        }
      }
    }
  });
  def_optimize(AST_DefaultAssign, function(self2, compressor) {
    if (!compressor.option("evaluate")) {
      return self2;
    }
    var evaluateRight = self2.right.evaluate(compressor);
    let lambda, iife;
    if (evaluateRight === void 0) {
      if ((lambda = compressor.parent()) instanceof AST_Lambda ? compressor.option("keep_fargs") === false || (iife = compressor.parent(1)).TYPE === "Call" && iife.expression === lambda : true) {
        self2 = self2.left;
      }
    } else if (evaluateRight !== self2.right) {
      evaluateRight = make_node_from_constant(evaluateRight, self2.right);
      self2.right = best_of_expression(evaluateRight, self2.right);
    }
    return self2;
  });
  function is_nullish_check(check, check_subject, compressor) {
    if (check_subject.may_throw(compressor)) return false;
    let nullish_side;
    if (check instanceof AST_Binary && check.operator === "==" && ((nullish_side = is_nullish(check.left, compressor) && check.left) || (nullish_side = is_nullish(check.right, compressor) && check.right)) && (nullish_side === check.left ? check.right : check.left).equivalent_to(check_subject)) {
      return true;
    }
    if (check instanceof AST_Binary && check.operator === "||") {
      let null_cmp;
      let undefined_cmp;
      const find_comparison = (cmp) => {
        if (!(cmp instanceof AST_Binary && (cmp.operator === "===" || cmp.operator === "=="))) {
          return false;
        }
        let found = 0;
        let defined_side;
        if (cmp.left instanceof AST_Null) {
          found++;
          null_cmp = cmp;
          defined_side = cmp.right;
        }
        if (cmp.right instanceof AST_Null) {
          found++;
          null_cmp = cmp;
          defined_side = cmp.left;
        }
        if (is_undefined(cmp.left, compressor)) {
          found++;
          undefined_cmp = cmp;
          defined_side = cmp.right;
        }
        if (is_undefined(cmp.right, compressor)) {
          found++;
          undefined_cmp = cmp;
          defined_side = cmp.left;
        }
        if (found !== 1) {
          return false;
        }
        if (!defined_side.equivalent_to(check_subject)) {
          return false;
        }
        return true;
      };
      if (!find_comparison(check.left)) return false;
      if (!find_comparison(check.right)) return false;
      if (null_cmp && undefined_cmp && null_cmp !== undefined_cmp) {
        return true;
      }
    }
    return false;
  }
  def_optimize(AST_Conditional, function(self2, compressor) {
    if (!compressor.option("conditionals")) return self2;
    if (self2.condition instanceof AST_Sequence) {
      var expressions = self2.condition.expressions.slice();
      self2.condition = expressions.pop();
      expressions.push(self2);
      return make_sequence(self2, expressions);
    }
    var cond = self2.condition.evaluate(compressor);
    if (cond !== self2.condition) {
      if (cond) {
        return maintain_this_binding(compressor.parent(), compressor.self(), self2.consequent);
      } else {
        return maintain_this_binding(compressor.parent(), compressor.self(), self2.alternative);
      }
    }
    var negated = cond.negate(compressor, first_in_statement(compressor));
    if (best_of(compressor, cond, negated) === negated) {
      self2 = make_node(AST_Conditional, self2, {
        condition: negated,
        consequent: self2.alternative,
        alternative: self2.consequent
      });
    }
    var condition = self2.condition;
    var consequent = self2.consequent;
    var alternative = self2.alternative;
    if (condition instanceof AST_SymbolRef && consequent instanceof AST_SymbolRef && condition.definition() === consequent.definition()) {
      return make_node(AST_Binary, self2, {
        operator: "||",
        left: condition,
        right: alternative
      });
    }
    if (consequent instanceof AST_Assign && alternative instanceof AST_Assign && consequent.operator === alternative.operator && consequent.logical === alternative.logical && consequent.left.equivalent_to(alternative.left) && (!self2.condition.has_side_effects(compressor) || consequent.operator == "=" && !consequent.left.has_side_effects(compressor))) {
      return make_node(AST_Assign, self2, {
        operator: consequent.operator,
        left: consequent.left,
        logical: consequent.logical,
        right: make_node(AST_Conditional, self2, {
          condition: self2.condition,
          consequent: consequent.right,
          alternative: alternative.right
        })
      });
    }
    var arg_index;
    if (consequent instanceof AST_Call && alternative.TYPE === consequent.TYPE && consequent.args.length > 0 && consequent.args.length == alternative.args.length && consequent.expression.equivalent_to(alternative.expression) && !self2.condition.has_side_effects(compressor) && !consequent.expression.has_side_effects(compressor) && typeof (arg_index = single_arg_diff()) == "number") {
      var node = consequent.clone();
      node.args[arg_index] = make_node(AST_Conditional, self2, {
        condition: self2.condition,
        consequent: consequent.args[arg_index],
        alternative: alternative.args[arg_index]
      });
      return node;
    }
    if (alternative instanceof AST_Conditional && consequent.equivalent_to(alternative.consequent)) {
      return make_node(AST_Conditional, self2, {
        condition: make_node(AST_Binary, self2, {
          operator: "||",
          left: condition,
          right: alternative.condition
        }),
        consequent,
        alternative: alternative.alternative
      }).optimize(compressor);
    }
    if (compressor.option("ecma") >= 2020 && is_nullish_check(condition, alternative, compressor)) {
      return make_node(AST_Binary, self2, {
        operator: "??",
        left: alternative,
        right: consequent
      }).optimize(compressor);
    }
    if (alternative instanceof AST_Sequence && consequent.equivalent_to(alternative.expressions[alternative.expressions.length - 1])) {
      return make_sequence(self2, [
        make_node(AST_Binary, self2, {
          operator: "||",
          left: condition,
          right: make_sequence(self2, alternative.expressions.slice(0, -1))
        }),
        consequent
      ]).optimize(compressor);
    }
    if (alternative instanceof AST_Binary && alternative.operator == "&&" && consequent.equivalent_to(alternative.right)) {
      return make_node(AST_Binary, self2, {
        operator: "&&",
        left: make_node(AST_Binary, self2, {
          operator: "||",
          left: condition,
          right: alternative.left
        }),
        right: consequent
      }).optimize(compressor);
    }
    if (consequent instanceof AST_Conditional && consequent.alternative.equivalent_to(alternative)) {
      return make_node(AST_Conditional, self2, {
        condition: make_node(AST_Binary, self2, {
          left: self2.condition,
          operator: "&&",
          right: consequent.condition
        }),
        consequent: consequent.consequent,
        alternative
      });
    }
    if (consequent.equivalent_to(alternative)) {
      return make_sequence(self2, [
        self2.condition,
        consequent
      ]).optimize(compressor);
    }
    if (consequent instanceof AST_Binary && consequent.operator == "||" && consequent.right.equivalent_to(alternative)) {
      return make_node(AST_Binary, self2, {
        operator: "||",
        left: make_node(AST_Binary, self2, {
          operator: "&&",
          left: self2.condition,
          right: consequent.left
        }),
        right: alternative
      }).optimize(compressor);
    }
    const in_bool = compressor.in_boolean_context();
    if (is_true(self2.consequent)) {
      if (is_false(self2.alternative)) {
        return booleanize(self2.condition);
      }
      return make_node(AST_Binary, self2, {
        operator: "||",
        left: booleanize(self2.condition),
        right: self2.alternative
      });
    }
    if (is_false(self2.consequent)) {
      if (is_true(self2.alternative)) {
        return booleanize(self2.condition.negate(compressor));
      }
      return make_node(AST_Binary, self2, {
        operator: "&&",
        left: booleanize(self2.condition.negate(compressor)),
        right: self2.alternative
      });
    }
    if (is_true(self2.alternative)) {
      return make_node(AST_Binary, self2, {
        operator: "||",
        left: booleanize(self2.condition.negate(compressor)),
        right: self2.consequent
      });
    }
    if (is_false(self2.alternative)) {
      return make_node(AST_Binary, self2, {
        operator: "&&",
        left: booleanize(self2.condition),
        right: self2.consequent
      });
    }
    return self2;
    function booleanize(node2) {
      if (node2.is_boolean()) return node2;
      return make_node(AST_UnaryPrefix, node2, {
        operator: "!",
        expression: node2.negate(compressor)
      });
    }
    function is_true(node2) {
      return node2 instanceof AST_True || in_bool && node2 instanceof AST_Constant && node2.getValue() || node2 instanceof AST_UnaryPrefix && node2.operator == "!" && node2.expression instanceof AST_Constant && !node2.expression.getValue();
    }
    function is_false(node2) {
      return node2 instanceof AST_False || in_bool && node2 instanceof AST_Constant && !node2.getValue() || node2 instanceof AST_UnaryPrefix && node2.operator == "!" && node2.expression instanceof AST_Constant && node2.expression.getValue();
    }
    function single_arg_diff() {
      var a = consequent.args;
      var b = alternative.args;
      for (var i = 0, len = a.length; i < len; i++) {
        if (a[i] instanceof AST_Expansion) return;
        if (!a[i].equivalent_to(b[i])) {
          if (b[i] instanceof AST_Expansion) return;
          for (var j = i + 1; j < len; j++) {
            if (a[j] instanceof AST_Expansion) return;
            if (!a[j].equivalent_to(b[j])) return;
          }
          return i;
        }
      }
    }
  });
  def_optimize(AST_Boolean, function(self2, compressor) {
    if (compressor.in_boolean_context()) return make_node(AST_Number, self2, {
      value: +self2.value
    });
    var p = compressor.parent();
    if (compressor.option("booleans_as_integers")) {
      if (p instanceof AST_Binary && (p.operator == "===" || p.operator == "!==")) {
        p.operator = p.operator.replace(/=$/, "");
      }
      return make_node(AST_Number, self2, {
        value: +self2.value
      });
    }
    if (compressor.option("booleans")) {
      if (p instanceof AST_Binary && (p.operator == "==" || p.operator == "!=")) {
        return make_node(AST_Number, self2, {
          value: +self2.value
        });
      }
      return make_node(AST_UnaryPrefix, self2, {
        operator: "!",
        expression: make_node(AST_Number, self2, {
          value: 1 - self2.value
        })
      });
    }
    return self2;
  });
  function safe_to_flatten(value, compressor) {
    if (value instanceof AST_SymbolRef) {
      value = value.fixed_value();
    }
    if (!value) return false;
    if (!(value instanceof AST_Lambda || value instanceof AST_Class)) return true;
    if (!(value instanceof AST_Lambda && value.contains_this())) return true;
    return compressor.parent() instanceof AST_New;
  }
  AST_PropAccess.DEFMETHOD("flatten_object", function(key, compressor) {
    if (!compressor.option("properties")) return;
    if (key === "__proto__") return;
    var arrows = compressor.option("unsafe_arrows") && compressor.option("ecma") >= 2015;
    var expr = this.expression;
    if (expr instanceof AST_Object) {
      var props = expr.properties;
      for (var i = props.length; --i >= 0; ) {
        var prop = props[i];
        if ("" + (prop instanceof AST_ConciseMethod ? prop.key.name : prop.key) == key) {
          const all_props_flattenable = props.every(
            (p) => (p instanceof AST_ObjectKeyVal || arrows && p instanceof AST_ConciseMethod && !p.is_generator) && !p.computed_key()
          );
          if (!all_props_flattenable) return;
          if (!safe_to_flatten(prop.value, compressor)) return;
          return make_node(AST_Sub, this, {
            expression: make_node(AST_Array, expr, {
              elements: props.map(function(prop2) {
                var v = prop2.value;
                if (v instanceof AST_Accessor) {
                  v = make_node(AST_Function, v, v);
                }
                var k = prop2.key;
                if (k instanceof AST_Node && !(k instanceof AST_SymbolMethod)) {
                  return make_sequence(prop2, [k, v]);
                }
                return v;
              })
            }),
            property: make_node(AST_Number, this, {
              value: i
            })
          });
        }
      }
    }
  });
  def_optimize(AST_Sub, function(self2, compressor) {
    var expr = self2.expression;
    var prop = self2.property;
    if (compressor.option("properties")) {
      var key = prop.evaluate(compressor);
      if (key !== prop) {
        if (typeof key == "string") {
          if (key == "undefined") {
            key = void 0;
          } else {
            var value = parseFloat(key);
            if (value.toString() == key) {
              key = value;
            }
          }
        }
        prop = self2.property = best_of_expression(
          prop,
          make_node_from_constant(key, prop).transform(compressor)
        );
        var property = "" + key;
        if (is_basic_identifier_string(property) && property.length <= prop.size() + 1) {
          return make_node(AST_Dot, self2, {
            expression: expr,
            optional: self2.optional,
            property,
            quote: prop.quote
          }).optimize(compressor);
        }
      }
    }
    var fn;
    OPT_ARGUMENTS: if (compressor.option("arguments") && expr instanceof AST_SymbolRef && expr.name == "arguments" && expr.definition().orig.length == 1 && (fn = expr.scope) instanceof AST_Lambda && fn.uses_arguments && !(fn instanceof AST_Arrow) && prop instanceof AST_Number) {
      var index = prop.getValue();
      var params = /* @__PURE__ */ new Set();
      var argnames = fn.argnames;
      for (var n = 0; n < argnames.length; n++) {
        if (!(argnames[n] instanceof AST_SymbolFunarg)) {
          break OPT_ARGUMENTS;
        }
        var param = argnames[n].name;
        if (params.has(param)) {
          break OPT_ARGUMENTS;
        }
        params.add(param);
      }
      var argname = fn.argnames[index];
      if (argname && compressor.has_directive("use strict")) {
        var def = argname.definition();
        if (!compressor.option("reduce_vars") || def.assignments || def.orig.length > 1) {
          argname = null;
        }
      } else if (!argname && !compressor.option("keep_fargs") && index < fn.argnames.length + 5) {
        while (index >= fn.argnames.length) {
          argname = fn.create_symbol(AST_SymbolFunarg, {
            source: fn,
            scope: fn,
            tentative_name: "argument_" + fn.argnames.length
          });
          fn.argnames.push(argname);
        }
      }
      if (argname) {
        var sym = make_node(AST_SymbolRef, self2, argname);
        sym.reference({});
        clear_flag(argname, UNUSED);
        return sym;
      }
    }
    if (compressor.is_lhs()) return self2;
    if (key !== prop) {
      var sub = self2.flatten_object(property, compressor);
      if (sub) {
        expr = self2.expression = sub.expression;
        prop = self2.property = sub.property;
      }
    }
    if (compressor.option("properties") && compressor.option("side_effects") && prop instanceof AST_Number && expr instanceof AST_Array) {
      var index = prop.getValue();
      var elements = expr.elements;
      var retValue = elements[index];
      FLATTEN: if (safe_to_flatten(retValue, compressor)) {
        var flatten = true;
        var values = [];
        for (var i = elements.length; --i > index; ) {
          var value = elements[i].drop_side_effect_free(compressor);
          if (value) {
            values.unshift(value);
            if (flatten && value.has_side_effects(compressor)) flatten = false;
          }
        }
        if (retValue instanceof AST_Expansion) break FLATTEN;
        retValue = retValue instanceof AST_Hole ? make_node(AST_Undefined, retValue) : retValue;
        if (!flatten) values.unshift(retValue);
        while (--i >= 0) {
          var value = elements[i];
          if (value instanceof AST_Expansion) break FLATTEN;
          value = value.drop_side_effect_free(compressor);
          if (value) values.unshift(value);
          else index--;
        }
        if (flatten) {
          values.push(retValue);
          return make_sequence(self2, values).optimize(compressor);
        } else return make_node(AST_Sub, self2, {
          expression: make_node(AST_Array, expr, {
            elements: values
          }),
          property: make_node(AST_Number, prop, {
            value: index
          })
        });
      }
    }
    var ev = self2.evaluate(compressor);
    if (ev !== self2) {
      ev = make_node_from_constant(ev, self2).optimize(compressor);
      return best_of(compressor, ev, self2);
    }
    return self2;
  });
  def_optimize(AST_Chain, function(self2, compressor) {
    if (is_nullish(self2.expression, compressor)) {
      let parent = compressor.parent();
      if (parent instanceof AST_UnaryPrefix && parent.operator === "delete") {
        return make_node_from_constant(0, self2);
      }
      return make_node(AST_Undefined, self2);
    }
    return self2;
  });
  def_optimize(AST_Dot, function(self2, compressor) {
    const parent = compressor.parent();
    if (compressor.is_lhs()) return self2;
    if (compressor.option("unsafe_proto") && self2.expression instanceof AST_Dot && self2.expression.property == "prototype") {
      var exp = self2.expression.expression;
      if (is_undeclared_ref(exp)) switch (exp.name) {
        case "Array":
          self2.expression = make_node(AST_Array, self2.expression, {
            elements: []
          });
          break;
        case "Function":
          self2.expression = make_empty_function(self2.expression);
          break;
        case "Number":
          self2.expression = make_node(AST_Number, self2.expression, {
            value: 0
          });
          break;
        case "Object":
          self2.expression = make_node(AST_Object, self2.expression, {
            properties: []
          });
          break;
        case "RegExp":
          self2.expression = make_node(AST_RegExp, self2.expression, {
            value: { source: "t", flags: "" }
          });
          break;
        case "String":
          self2.expression = make_node(AST_String, self2.expression, {
            value: ""
          });
          break;
      }
    }
    if (!(parent instanceof AST_Call) || !has_annotation(parent, _NOINLINE)) {
      const sub = self2.flatten_object(self2.property, compressor);
      if (sub) return sub.optimize(compressor);
    }
    if (self2.expression instanceof AST_PropAccess && parent instanceof AST_PropAccess) {
      return self2;
    }
    let ev = self2.evaluate(compressor);
    if (ev !== self2) {
      ev = make_node_from_constant(ev, self2).optimize(compressor);
      return best_of(compressor, ev, self2);
    }
    return self2;
  });
  function literals_in_boolean_context(self2, compressor) {
    if (compressor.in_boolean_context()) {
      return best_of(compressor, self2, make_sequence(self2, [
        self2,
        make_node(AST_True, self2)
      ]).optimize(compressor));
    }
    return self2;
  }
  function inline_array_like_spread(elements) {
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      if (el instanceof AST_Expansion) {
        var expr = el.expression;
        if (expr instanceof AST_Array && !expr.elements.some((elm) => elm instanceof AST_Hole)) {
          elements.splice(i, 1, ...expr.elements);
          i--;
        }
      }
    }
  }
  def_optimize(AST_Array, function(self2, compressor) {
    var optimized = literals_in_boolean_context(self2, compressor);
    if (optimized !== self2) {
      return optimized;
    }
    inline_array_like_spread(self2.elements);
    return self2;
  });
  function inline_object_prop_spread(props) {
    for (var i = 0; i < props.length; i++) {
      var prop = props[i];
      if (prop instanceof AST_Expansion) {
        const expr = prop.expression;
        if (expr instanceof AST_Object && expr.properties.every((prop2) => prop2 instanceof AST_ObjectKeyVal)) {
          props.splice(i, 1, ...expr.properties);
          i--;
        } else if (
          // `expr.is_constant()` returns `false` for `AST_RegExp`, so need both.
          (expr instanceof AST_Constant || expr.is_constant()) && !(expr instanceof AST_String)
        ) {
          props.splice(i, 1);
          i--;
        }
      }
    }
  }
  def_optimize(AST_Object, function(self2, compressor) {
    var optimized = literals_in_boolean_context(self2, compressor);
    if (optimized !== self2) {
      return optimized;
    }
    inline_object_prop_spread(self2.properties);
    return self2;
  });
  def_optimize(AST_RegExp, literals_in_boolean_context);
  def_optimize(AST_Return, function(self2, compressor) {
    if (self2.value && is_undefined(self2.value, compressor)) {
      self2.value = null;
    }
    return self2;
  });
  def_optimize(AST_Arrow, opt_AST_Lambda);
  def_optimize(AST_Function, function(self2, compressor) {
    self2 = opt_AST_Lambda(self2, compressor);
    if (compressor.option("unsafe_arrows") && compressor.option("ecma") >= 2015 && !self2.name && !self2.is_generator && !self2.uses_arguments && !self2.pinned()) {
      const uses_this = walk(self2, (node) => {
        if (node instanceof AST_This) return walk_abort;
      });
      if (!uses_this) return make_node(AST_Arrow, self2, self2).optimize(compressor);
    }
    return self2;
  });
  def_optimize(AST_Class, function(self2) {
    for (let i = 0; i < self2.properties.length; i++) {
      const prop = self2.properties[i];
      if (prop instanceof AST_ClassStaticBlock && prop.body.length == 0) {
        self2.properties.splice(i, 1);
        i--;
      }
    }
    return self2;
  });
  def_optimize(AST_ClassStaticBlock, function(self2, compressor) {
    tighten_body(self2.body, compressor);
    return self2;
  });
  def_optimize(AST_Yield, function(self2, compressor) {
    if (self2.expression && !self2.is_star && is_undefined(self2.expression, compressor)) {
      self2.expression = null;
    }
    return self2;
  });
  def_optimize(AST_TemplateString, function(self2, compressor) {
    if (!compressor.option("evaluate") || compressor.parent() instanceof AST_PrefixedTemplateString) {
      return self2;
    }
    var segments = [];
    for (var i = 0; i < self2.segments.length; i++) {
      var segment = self2.segments[i];
      if (segment instanceof AST_Node) {
        var result = segment.evaluate(compressor);
        if (result !== segment && (result + "").length <= segment.size() + "${}".length) {
          segments[segments.length - 1].value = segments[segments.length - 1].value + result + self2.segments[++i].value;
          continue;
        }
        if (segment instanceof AST_TemplateString) {
          var inners = segment.segments;
          segments[segments.length - 1].value += inners[0].value;
          for (var j = 1; j < inners.length; j++) {
            segment = inners[j];
            segments.push(segment);
          }
          continue;
        }
      }
      segments.push(segment);
    }
    self2.segments = segments;
    if (segments.length == 1) {
      return make_node(AST_String, self2, segments[0]);
    }
    if (segments.length === 3 && segments[1] instanceof AST_Node && (segments[1].is_string(compressor) || segments[1].is_number(compressor) || is_nullish(segments[1], compressor) || compressor.option("unsafe"))) {
      if (segments[2].value === "") {
        return make_node(AST_Binary, self2, {
          operator: "+",
          left: make_node(AST_String, self2, {
            value: segments[0].value
          }),
          right: segments[1]
        });
      }
      if (segments[0].value === "") {
        return make_node(AST_Binary, self2, {
          operator: "+",
          left: segments[1],
          right: make_node(AST_String, self2, {
            value: segments[2].value
          })
        });
      }
    }
    return self2;
  });
  def_optimize(AST_PrefixedTemplateString, function(self2) {
    return self2;
  });
  function lift_key(self2, compressor) {
    if (!compressor.option("computed_props")) return self2;
    if (!(self2.key instanceof AST_Constant)) return self2;
    if (self2.key instanceof AST_String || self2.key instanceof AST_Number) {
      const key = self2.key.value.toString();
      if (key === "__proto__") return self2;
      if (key == "constructor" && compressor.parent() instanceof AST_Class) return self2;
      if (self2 instanceof AST_ObjectKeyVal) {
        self2.quote = self2.key.quote;
        self2.key = key;
      } else if (self2 instanceof AST_ClassProperty) {
        self2.quote = self2.key.quote;
        self2.key = make_node(AST_SymbolClassProperty, self2.key, {
          name: key
        });
      } else {
        self2.quote = self2.key.quote;
        self2.key = make_node(AST_SymbolMethod, self2.key, {
          name: key
        });
      }
    }
    return self2;
  }
  def_optimize(AST_ObjectProperty, lift_key);
  def_optimize(AST_ConciseMethod, function(self2, compressor) {
    lift_key(self2, compressor);
    if (compressor.option("arrows") && compressor.parent() instanceof AST_Object && !self2.is_generator && !self2.value.uses_arguments && !self2.value.pinned() && self2.value.body.length == 1 && self2.value.body[0] instanceof AST_Return && self2.value.body[0].value && !self2.value.contains_this()) {
      var arrow = make_node(AST_Arrow, self2.value, self2.value);
      arrow.async = self2.async;
      arrow.is_generator = self2.is_generator;
      return make_node(AST_ObjectKeyVal, self2, {
        key: self2.key instanceof AST_SymbolMethod ? self2.key.name : self2.key,
        value: arrow,
        quote: self2.quote
      });
    }
    return self2;
  });
  def_optimize(AST_ObjectKeyVal, function(self2, compressor) {
    lift_key(self2, compressor);
    var unsafe_methods = compressor.option("unsafe_methods");
    if (unsafe_methods && compressor.option("ecma") >= 2015 && (!(unsafe_methods instanceof RegExp) || unsafe_methods.test(self2.key + ""))) {
      var key = self2.key;
      var value = self2.value;
      var is_arrow_with_block = value instanceof AST_Arrow && Array.isArray(value.body) && !value.contains_this();
      if ((is_arrow_with_block || value instanceof AST_Function) && !value.name) {
        return make_node(AST_ConciseMethod, self2, {
          async: value.async,
          is_generator: value.is_generator,
          key: key instanceof AST_Node ? key : make_node(AST_SymbolMethod, self2, {
            name: key
          }),
          value: make_node(AST_Accessor, value, value),
          quote: self2.quote
        });
      }
    }
    return self2;
  });
  def_optimize(AST_Destructuring, function(self2, compressor) {
    if (compressor.option("pure_getters") == true && compressor.option("unused") && !self2.is_array && Array.isArray(self2.names) && !is_destructuring_export_decl(compressor) && !(self2.names[self2.names.length - 1] instanceof AST_Expansion)) {
      var keep = [];
      for (var i = 0; i < self2.names.length; i++) {
        var elem = self2.names[i];
        if (!(elem instanceof AST_ObjectKeyVal && typeof elem.key == "string" && elem.value instanceof AST_SymbolDeclaration && !should_retain(compressor, elem.value.definition()))) {
          keep.push(elem);
        }
      }
      if (keep.length != self2.names.length) {
        self2.names = keep;
      }
    }
    return self2;
    function is_destructuring_export_decl(compressor2) {
      var ancestors = [/^VarDef$/, /^(Const|Let|Var)$/, /^Export$/];
      for (var a = 0, p = 0, len = ancestors.length; a < len; p++) {
        var parent = compressor2.parent(p);
        if (!parent) return false;
        if (a === 0 && parent.TYPE == "Destructuring") continue;
        if (!ancestors[a].test(parent.TYPE)) {
          return false;
        }
        a++;
      }
      return true;
    }
    function should_retain(compressor2, def) {
      if (def.references.length) return true;
      if (!def.global) return false;
      if (compressor2.toplevel.vars) {
        if (compressor2.top_retain) {
          return compressor2.top_retain(def);
        }
        return false;
      }
      return true;
    }
  });

  // node_modules/terser/lib/sourcemap.js
  var import_source_map = __toESM(require_source_map_umd(), 1);
  function* SourceMap(options) {
    options = defaults(options, {
      file: null,
      root: null,
      orig: null,
      files: {}
    });
    var orig_map;
    var generator = new import_source_map.SourceMapGenerator({
      file: options.file,
      sourceRoot: options.root
    });
    let sourcesContent = { __proto__: null };
    let files = options.files;
    for (var name in files) if (HOP(files, name)) {
      sourcesContent[name] = files[name];
    }
    if (options.orig) {
      orig_map = yield new import_source_map.SourceMapConsumer(options.orig);
      if (orig_map.sourcesContent) {
        orig_map.sources.forEach(function(source, i) {
          var content = orig_map.sourcesContent[i];
          if (content) {
            sourcesContent[source] = content;
          }
        });
      }
    }
    function add(source, gen_line, gen_col, orig_line, orig_col, name2) {
      let generatedPos = { line: gen_line, column: gen_col };
      if (orig_map) {
        var info = orig_map.originalPositionFor({
          line: orig_line,
          column: orig_col
        });
        if (info.source === null) {
          generator.addMapping({
            generated: generatedPos,
            original: null,
            source: null,
            name: null
          });
          return;
        }
        source = info.source;
        orig_line = info.line;
        orig_col = info.column;
        name2 = info.name || name2;
      }
      generator.addMapping({
        generated: generatedPos,
        original: { line: orig_line, column: orig_col },
        source,
        name: name2
      });
      generator.setSourceContent(source, sourcesContent[source]);
    }
    function clean(map) {
      const allNull = map.sourcesContent && map.sourcesContent.every((c) => c == null);
      if (allNull) delete map.sourcesContent;
      if (map.file === void 0) delete map.file;
      if (map.sourceRoot === void 0) delete map.sourceRoot;
      return map;
    }
    function getDecoded() {
      if (!generator.toDecodedMap) return null;
      return clean(generator.toDecodedMap());
    }
    function getEncoded() {
      return clean(generator.toJSON());
    }
    function destroy() {
      if (orig_map && orig_map.destroy) orig_map.destroy();
    }
    return {
      add,
      getDecoded,
      getEncoded,
      destroy
    };
  }

  // node_modules/terser/tools/domprops.js
  var domprops = [
    "$&",
    "$'",
    "$*",
    "$+",
    "$1",
    "$2",
    "$3",
    "$4",
    "$5",
    "$6",
    "$7",
    "$8",
    "$9",
    "$_",
    "$`",
    "$input",
    "-moz-animation",
    "-moz-animation-delay",
    "-moz-animation-direction",
    "-moz-animation-duration",
    "-moz-animation-fill-mode",
    "-moz-animation-iteration-count",
    "-moz-animation-name",
    "-moz-animation-play-state",
    "-moz-animation-timing-function",
    "-moz-appearance",
    "-moz-backface-visibility",
    "-moz-border-end",
    "-moz-border-end-color",
    "-moz-border-end-style",
    "-moz-border-end-width",
    "-moz-border-image",
    "-moz-border-start",
    "-moz-border-start-color",
    "-moz-border-start-style",
    "-moz-border-start-width",
    "-moz-box-align",
    "-moz-box-direction",
    "-moz-box-flex",
    "-moz-box-ordinal-group",
    "-moz-box-orient",
    "-moz-box-pack",
    "-moz-box-sizing",
    "-moz-float-edge",
    "-moz-font-feature-settings",
    "-moz-font-language-override",
    "-moz-force-broken-image-icon",
    "-moz-hyphens",
    "-moz-image-region",
    "-moz-margin-end",
    "-moz-margin-start",
    "-moz-orient",
    "-moz-osx-font-smoothing",
    "-moz-outline-radius",
    "-moz-outline-radius-bottomleft",
    "-moz-outline-radius-bottomright",
    "-moz-outline-radius-topleft",
    "-moz-outline-radius-topright",
    "-moz-padding-end",
    "-moz-padding-start",
    "-moz-perspective",
    "-moz-perspective-origin",
    "-moz-tab-size",
    "-moz-text-size-adjust",
    "-moz-transform",
    "-moz-transform-origin",
    "-moz-transform-style",
    "-moz-transition",
    "-moz-transition-delay",
    "-moz-transition-duration",
    "-moz-transition-property",
    "-moz-transition-timing-function",
    "-moz-user-focus",
    "-moz-user-input",
    "-moz-user-modify",
    "-moz-user-select",
    "-moz-window-dragging",
    "-webkit-align-content",
    "-webkit-align-items",
    "-webkit-align-self",
    "-webkit-animation",
    "-webkit-animation-delay",
    "-webkit-animation-direction",
    "-webkit-animation-duration",
    "-webkit-animation-fill-mode",
    "-webkit-animation-iteration-count",
    "-webkit-animation-name",
    "-webkit-animation-play-state",
    "-webkit-animation-timing-function",
    "-webkit-appearance",
    "-webkit-backface-visibility",
    "-webkit-background-clip",
    "-webkit-background-origin",
    "-webkit-background-size",
    "-webkit-border-bottom-left-radius",
    "-webkit-border-bottom-right-radius",
    "-webkit-border-image",
    "-webkit-border-radius",
    "-webkit-border-top-left-radius",
    "-webkit-border-top-right-radius",
    "-webkit-box-align",
    "-webkit-box-direction",
    "-webkit-box-flex",
    "-webkit-box-ordinal-group",
    "-webkit-box-orient",
    "-webkit-box-pack",
    "-webkit-box-shadow",
    "-webkit-box-sizing",
    "-webkit-clip-path",
    "-webkit-filter",
    "-webkit-flex",
    "-webkit-flex-basis",
    "-webkit-flex-direction",
    "-webkit-flex-flow",
    "-webkit-flex-grow",
    "-webkit-flex-shrink",
    "-webkit-flex-wrap",
    "-webkit-justify-content",
    "-webkit-line-clamp",
    "-webkit-mask",
    "-webkit-mask-clip",
    "-webkit-mask-composite",
    "-webkit-mask-image",
    "-webkit-mask-origin",
    "-webkit-mask-position",
    "-webkit-mask-position-x",
    "-webkit-mask-position-y",
    "-webkit-mask-repeat",
    "-webkit-mask-size",
    "-webkit-order",
    "-webkit-perspective",
    "-webkit-perspective-origin",
    "-webkit-text-fill-color",
    "-webkit-text-security",
    "-webkit-text-size-adjust",
    "-webkit-text-stroke",
    "-webkit-text-stroke-color",
    "-webkit-text-stroke-width",
    "-webkit-transform",
    "-webkit-transform-origin",
    "-webkit-transform-style",
    "-webkit-transition",
    "-webkit-transition-delay",
    "-webkit-transition-duration",
    "-webkit-transition-property",
    "-webkit-transition-timing-function",
    "-webkit-user-select",
    "0",
    "1",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "2",
    "20",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "@@iterator",
    "ABORT_ERR",
    "ACTIVE",
    "ACTIVE_ATTRIBUTES",
    "ACTIVE_TEXTURE",
    "ACTIVE_UNIFORMS",
    "ACTIVE_UNIFORM_BLOCKS",
    "ADDITION",
    "ALIASED_LINE_WIDTH_RANGE",
    "ALIASED_POINT_SIZE_RANGE",
    "ALL",
    "ALLOW_KEYBOARD_INPUT",
    "ALLPASS",
    "ALPHA",
    "ALPHA_BITS",
    "ALREADY_SIGNALED",
    "ALT_MASK",
    "ALWAYS",
    "ANY_SAMPLES_PASSED",
    "ANY_SAMPLES_PASSED_CONSERVATIVE",
    "ANY_TYPE",
    "ANY_UNORDERED_NODE_TYPE",
    "ARRAY_BUFFER",
    "ARRAY_BUFFER_BINDING",
    "ATTACHED_SHADERS",
    "ATTRIBUTE_NODE",
    "AT_TARGET",
    "AbortController",
    "AbortSignal",
    "AbsoluteOrientationSensor",
    "AbstractRange",
    "Accelerometer",
    "AddSearchProvider",
    "AggregateError",
    "AnalyserNode",
    "Animation",
    "AnimationEffect",
    "AnimationEvent",
    "AnimationPlaybackEvent",
    "AnimationTimeline",
    "AnonXMLHttpRequest",
    "Any",
    "ApplicationCache",
    "ApplicationCacheErrorEvent",
    "Array",
    "ArrayBuffer",
    "ArrayType",
    "Atomics",
    "Attr",
    "Audio",
    "AudioBuffer",
    "AudioBufferSourceNode",
    "AudioContext",
    "AudioData",
    "AudioDecoder",
    "AudioDestinationNode",
    "AudioEncoder",
    "AudioListener",
    "AudioNode",
    "AudioParam",
    "AudioParamMap",
    "AudioProcessingEvent",
    "AudioScheduledSourceNode",
    "AudioSinkInfo",
    "AudioStreamTrack",
    "AudioWorklet",
    "AudioWorkletNode",
    "AuthenticatorAssertionResponse",
    "AuthenticatorAttestationResponse",
    "AuthenticatorResponse",
    "AutocompleteErrorEvent",
    "BACK",
    "BAD_BOUNDARYPOINTS_ERR",
    "BAD_REQUEST",
    "BANDPASS",
    "BLEND",
    "BLEND_COLOR",
    "BLEND_DST_ALPHA",
    "BLEND_DST_RGB",
    "BLEND_EQUATION",
    "BLEND_EQUATION_ALPHA",
    "BLEND_EQUATION_RGB",
    "BLEND_SRC_ALPHA",
    "BLEND_SRC_RGB",
    "BLUE",
    "BLUE_BITS",
    "BLUR",
    "BOOL",
    "BOOLEAN_TYPE",
    "BOOL_VEC2",
    "BOOL_VEC3",
    "BOOL_VEC4",
    "BOTH",
    "BROWSER_DEFAULT_WEBGL",
    "BUBBLING_PHASE",
    "BUFFER_SIZE",
    "BUFFER_USAGE",
    "BYTE",
    "BYTES_PER_ELEMENT",
    "BackgroundFetchManager",
    "BackgroundFetchRecord",
    "BackgroundFetchRegistration",
    "BarProp",
    "BarcodeDetector",
    "BaseAudioContext",
    "BaseHref",
    "BatteryManager",
    "BeforeInstallPromptEvent",
    "BeforeLoadEvent",
    "BeforeUnloadEvent",
    "BigInt",
    "BigInt64Array",
    "BigUint64Array",
    "BiquadFilterNode",
    "Blob",
    "BlobEvent",
    "Bluetooth",
    "BluetoothCharacteristicProperties",
    "BluetoothDevice",
    "BluetoothRemoteGATTCharacteristic",
    "BluetoothRemoteGATTDescriptor",
    "BluetoothRemoteGATTServer",
    "BluetoothRemoteGATTService",
    "BluetoothUUID",
    "Boolean",
    "BroadcastChannel",
    "BrowserCaptureMediaStreamTrack",
    "ByteLengthQueuingStrategy",
    "CAPTURING_PHASE",
    "CCW",
    "CDATASection",
    "CDATA_SECTION_NODE",
    "CHANGE",
    "CHARSET_RULE",
    "CHECKING",
    "CLAMP_TO_EDGE",
    "CLICK",
    "CLOSED",
    "CLOSING",
    "COLOR",
    "COLOR_ATTACHMENT0",
    "COLOR_ATTACHMENT1",
    "COLOR_ATTACHMENT10",
    "COLOR_ATTACHMENT11",
    "COLOR_ATTACHMENT12",
    "COLOR_ATTACHMENT13",
    "COLOR_ATTACHMENT14",
    "COLOR_ATTACHMENT15",
    "COLOR_ATTACHMENT2",
    "COLOR_ATTACHMENT3",
    "COLOR_ATTACHMENT4",
    "COLOR_ATTACHMENT5",
    "COLOR_ATTACHMENT6",
    "COLOR_ATTACHMENT7",
    "COLOR_ATTACHMENT8",
    "COLOR_ATTACHMENT9",
    "COLOR_BUFFER_BIT",
    "COLOR_CLEAR_VALUE",
    "COLOR_WRITEMASK",
    "COMMENT_NODE",
    "COMPARE_REF_TO_TEXTURE",
    "COMPILE_STATUS",
    "COMPLETION_STATUS_KHR",
    "COMPRESSED_RGBA_S3TC_DXT1_EXT",
    "COMPRESSED_RGBA_S3TC_DXT3_EXT",
    "COMPRESSED_RGBA_S3TC_DXT5_EXT",
    "COMPRESSED_RGB_S3TC_DXT1_EXT",
    "COMPRESSED_TEXTURE_FORMATS",
    "COMPUTE",
    "CONDITION_SATISFIED",
    "CONFIGURATION_UNSUPPORTED",
    "CONNECTING",
    "CONSTANT_ALPHA",
    "CONSTANT_COLOR",
    "CONSTRAINT_ERR",
    "CONTEXT_LOST_WEBGL",
    "CONTROL_MASK",
    "COPY_DST",
    "COPY_READ_BUFFER",
    "COPY_READ_BUFFER_BINDING",
    "COPY_SRC",
    "COPY_WRITE_BUFFER",
    "COPY_WRITE_BUFFER_BINDING",
    "COUNTER_STYLE_RULE",
    "CSS",
    "CSS2Properties",
    "CSSAnimation",
    "CSSCharsetRule",
    "CSSConditionRule",
    "CSSContainerRule",
    "CSSCounterStyleRule",
    "CSSFontFaceRule",
    "CSSFontFeatureValuesRule",
    "CSSFontPaletteValuesRule",
    "CSSGroupingRule",
    "CSSImageValue",
    "CSSImportRule",
    "CSSKeyframeRule",
    "CSSKeyframesRule",
    "CSSKeywordValue",
    "CSSLayerBlockRule",
    "CSSLayerStatementRule",
    "CSSMathClamp",
    "CSSMathInvert",
    "CSSMathMax",
    "CSSMathMin",
    "CSSMathNegate",
    "CSSMathProduct",
    "CSSMathSum",
    "CSSMathValue",
    "CSSMatrixComponent",
    "CSSMediaRule",
    "CSSMozDocumentRule",
    "CSSNameSpaceRule",
    "CSSNamespaceRule",
    "CSSNumericArray",
    "CSSNumericValue",
    "CSSPageRule",
    "CSSPerspective",
    "CSSPositionValue",
    "CSSPrimitiveValue",
    "CSSPropertyRule",
    "CSSRotate",
    "CSSRule",
    "CSSRuleList",
    "CSSScale",
    "CSSScopeRule",
    "CSSSkew",
    "CSSSkewX",
    "CSSSkewY",
    "CSSStartingStyleRule",
    "CSSStyleDeclaration",
    "CSSStyleRule",
    "CSSStyleSheet",
    "CSSStyleValue",
    "CSSSupportsRule",
    "CSSTransformComponent",
    "CSSTransformValue",
    "CSSTransition",
    "CSSTranslate",
    "CSSUnitValue",
    "CSSUnknownRule",
    "CSSUnparsedValue",
    "CSSValue",
    "CSSValueList",
    "CSSVariableReferenceValue",
    "CSSVariablesDeclaration",
    "CSSVariablesRule",
    "CSSViewportRule",
    "CSS_ATTR",
    "CSS_CM",
    "CSS_COUNTER",
    "CSS_CUSTOM",
    "CSS_DEG",
    "CSS_DIMENSION",
    "CSS_EMS",
    "CSS_EXS",
    "CSS_FILTER_BLUR",
    "CSS_FILTER_BRIGHTNESS",
    "CSS_FILTER_CONTRAST",
    "CSS_FILTER_CUSTOM",
    "CSS_FILTER_DROP_SHADOW",
    "CSS_FILTER_GRAYSCALE",
    "CSS_FILTER_HUE_ROTATE",
    "CSS_FILTER_INVERT",
    "CSS_FILTER_OPACITY",
    "CSS_FILTER_REFERENCE",
    "CSS_FILTER_SATURATE",
    "CSS_FILTER_SEPIA",
    "CSS_GRAD",
    "CSS_HZ",
    "CSS_IDENT",
    "CSS_IN",
    "CSS_INHERIT",
    "CSS_KHZ",
    "CSS_MATRIX",
    "CSS_MATRIX3D",
    "CSS_MM",
    "CSS_MS",
    "CSS_NUMBER",
    "CSS_PC",
    "CSS_PERCENTAGE",
    "CSS_PERSPECTIVE",
    "CSS_PRIMITIVE_VALUE",
    "CSS_PT",
    "CSS_PX",
    "CSS_RAD",
    "CSS_RECT",
    "CSS_RGBCOLOR",
    "CSS_ROTATE",
    "CSS_ROTATE3D",
    "CSS_ROTATEX",
    "CSS_ROTATEY",
    "CSS_ROTATEZ",
    "CSS_S",
    "CSS_SCALE",
    "CSS_SCALE3D",
    "CSS_SCALEX",
    "CSS_SCALEY",
    "CSS_SCALEZ",
    "CSS_SKEW",
    "CSS_SKEWX",
    "CSS_SKEWY",
    "CSS_STRING",
    "CSS_TRANSLATE",
    "CSS_TRANSLATE3D",
    "CSS_TRANSLATEX",
    "CSS_TRANSLATEY",
    "CSS_TRANSLATEZ",
    "CSS_UNKNOWN",
    "CSS_URI",
    "CSS_VALUE_LIST",
    "CSS_VH",
    "CSS_VMAX",
    "CSS_VMIN",
    "CSS_VW",
    "CULL_FACE",
    "CULL_FACE_MODE",
    "CURRENT_PROGRAM",
    "CURRENT_QUERY",
    "CURRENT_VERTEX_ATTRIB",
    "CUSTOM",
    "CW",
    "Cache",
    "CacheStorage",
    "CanvasCaptureMediaStream",
    "CanvasCaptureMediaStreamTrack",
    "CanvasGradient",
    "CanvasPattern",
    "CanvasRenderingContext2D",
    "CaptureController",
    "CaretPosition",
    "ChannelMergerNode",
    "ChannelSplitterNode",
    "CharacterBoundsUpdateEvent",
    "CharacterData",
    "ClientRect",
    "ClientRectList",
    "Clipboard",
    "ClipboardEvent",
    "ClipboardItem",
    "CloseEvent",
    "Collator",
    "CommandEvent",
    "Comment",
    "CompileError",
    "CompositionEvent",
    "CompressionStream",
    "Console",
    "ConstantSourceNode",
    "ContentVisibilityAutoStateChangeEvent",
    "Controllers",
    "ConvolverNode",
    "CookieChangeEvent",
    "CookieStore",
    "CookieStoreManager",
    "CountQueuingStrategy",
    "Counter",
    "Credential",
    "CredentialsContainer",
    "CropTarget",
    "Crypto",
    "CryptoKey",
    "CustomElementRegistry",
    "CustomEvent",
    "CustomStateSet",
    "DATABASE_ERR",
    "DATA_CLONE_ERR",
    "DATA_ERR",
    "DBLCLICK",
    "DECR",
    "DECR_WRAP",
    "DELETE_STATUS",
    "DEPTH",
    "DEPTH24_STENCIL8",
    "DEPTH32F_STENCIL8",
    "DEPTH_ATTACHMENT",
    "DEPTH_BITS",
    "DEPTH_BUFFER_BIT",
    "DEPTH_CLEAR_VALUE",
    "DEPTH_COMPONENT",
    "DEPTH_COMPONENT16",
    "DEPTH_COMPONENT24",
    "DEPTH_COMPONENT32F",
    "DEPTH_FUNC",
    "DEPTH_RANGE",
    "DEPTH_STENCIL",
    "DEPTH_STENCIL_ATTACHMENT",
    "DEPTH_TEST",
    "DEPTH_WRITEMASK",
    "DEVICE_INELIGIBLE",
    "DIRECTION_DOWN",
    "DIRECTION_LEFT",
    "DIRECTION_RIGHT",
    "DIRECTION_UP",
    "DISABLED",
    "DISPATCH_REQUEST_ERR",
    "DITHER",
    "DOCUMENT_FRAGMENT_NODE",
    "DOCUMENT_NODE",
    "DOCUMENT_POSITION_CONTAINED_BY",
    "DOCUMENT_POSITION_CONTAINS",
    "DOCUMENT_POSITION_DISCONNECTED",
    "DOCUMENT_POSITION_FOLLOWING",
    "DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC",
    "DOCUMENT_POSITION_PRECEDING",
    "DOCUMENT_TYPE_NODE",
    "DOMCursor",
    "DOMError",
    "DOMException",
    "DOMImplementation",
    "DOMImplementationLS",
    "DOMMatrix",
    "DOMMatrixReadOnly",
    "DOMParser",
    "DOMPoint",
    "DOMPointReadOnly",
    "DOMQuad",
    "DOMRect",
    "DOMRectList",
    "DOMRectReadOnly",
    "DOMRequest",
    "DOMSTRING_SIZE_ERR",
    "DOMSettableTokenList",
    "DOMStringList",
    "DOMStringMap",
    "DOMTokenList",
    "DOMTransactionEvent",
    "DOM_DELTA_LINE",
    "DOM_DELTA_PAGE",
    "DOM_DELTA_PIXEL",
    "DOM_INPUT_METHOD_DROP",
    "DOM_INPUT_METHOD_HANDWRITING",
    "DOM_INPUT_METHOD_IME",
    "DOM_INPUT_METHOD_KEYBOARD",
    "DOM_INPUT_METHOD_MULTIMODAL",
    "DOM_INPUT_METHOD_OPTION",
    "DOM_INPUT_METHOD_PASTE",
    "DOM_INPUT_METHOD_SCRIPT",
    "DOM_INPUT_METHOD_UNKNOWN",
    "DOM_INPUT_METHOD_VOICE",
    "DOM_KEY_LOCATION_JOYSTICK",
    "DOM_KEY_LOCATION_LEFT",
    "DOM_KEY_LOCATION_MOBILE",
    "DOM_KEY_LOCATION_NUMPAD",
    "DOM_KEY_LOCATION_RIGHT",
    "DOM_KEY_LOCATION_STANDARD",
    "DOM_VK_0",
    "DOM_VK_1",
    "DOM_VK_2",
    "DOM_VK_3",
    "DOM_VK_4",
    "DOM_VK_5",
    "DOM_VK_6",
    "DOM_VK_7",
    "DOM_VK_8",
    "DOM_VK_9",
    "DOM_VK_A",
    "DOM_VK_ACCEPT",
    "DOM_VK_ADD",
    "DOM_VK_ALT",
    "DOM_VK_ALTGR",
    "DOM_VK_AMPERSAND",
    "DOM_VK_ASTERISK",
    "DOM_VK_AT",
    "DOM_VK_ATTN",
    "DOM_VK_B",
    "DOM_VK_BACKSPACE",
    "DOM_VK_BACK_QUOTE",
    "DOM_VK_BACK_SLASH",
    "DOM_VK_BACK_SPACE",
    "DOM_VK_C",
    "DOM_VK_CANCEL",
    "DOM_VK_CAPS_LOCK",
    "DOM_VK_CIRCUMFLEX",
    "DOM_VK_CLEAR",
    "DOM_VK_CLOSE_BRACKET",
    "DOM_VK_CLOSE_CURLY_BRACKET",
    "DOM_VK_CLOSE_PAREN",
    "DOM_VK_COLON",
    "DOM_VK_COMMA",
    "DOM_VK_CONTEXT_MENU",
    "DOM_VK_CONTROL",
    "DOM_VK_CONVERT",
    "DOM_VK_CRSEL",
    "DOM_VK_CTRL",
    "DOM_VK_D",
    "DOM_VK_DECIMAL",
    "DOM_VK_DELETE",
    "DOM_VK_DIVIDE",
    "DOM_VK_DOLLAR",
    "DOM_VK_DOUBLE_QUOTE",
    "DOM_VK_DOWN",
    "DOM_VK_E",
    "DOM_VK_EISU",
    "DOM_VK_END",
    "DOM_VK_ENTER",
    "DOM_VK_EQUALS",
    "DOM_VK_EREOF",
    "DOM_VK_ESCAPE",
    "DOM_VK_EXCLAMATION",
    "DOM_VK_EXECUTE",
    "DOM_VK_EXSEL",
    "DOM_VK_F",
    "DOM_VK_F1",
    "DOM_VK_F10",
    "DOM_VK_F11",
    "DOM_VK_F12",
    "DOM_VK_F13",
    "DOM_VK_F14",
    "DOM_VK_F15",
    "DOM_VK_F16",
    "DOM_VK_F17",
    "DOM_VK_F18",
    "DOM_VK_F19",
    "DOM_VK_F2",
    "DOM_VK_F20",
    "DOM_VK_F21",
    "DOM_VK_F22",
    "DOM_VK_F23",
    "DOM_VK_F24",
    "DOM_VK_F25",
    "DOM_VK_F26",
    "DOM_VK_F27",
    "DOM_VK_F28",
    "DOM_VK_F29",
    "DOM_VK_F3",
    "DOM_VK_F30",
    "DOM_VK_F31",
    "DOM_VK_F32",
    "DOM_VK_F33",
    "DOM_VK_F34",
    "DOM_VK_F35",
    "DOM_VK_F36",
    "DOM_VK_F4",
    "DOM_VK_F5",
    "DOM_VK_F6",
    "DOM_VK_F7",
    "DOM_VK_F8",
    "DOM_VK_F9",
    "DOM_VK_FINAL",
    "DOM_VK_FRONT",
    "DOM_VK_G",
    "DOM_VK_GREATER_THAN",
    "DOM_VK_H",
    "DOM_VK_HANGUL",
    "DOM_VK_HANJA",
    "DOM_VK_HASH",
    "DOM_VK_HELP",
    "DOM_VK_HK_TOGGLE",
    "DOM_VK_HOME",
    "DOM_VK_HYPHEN_MINUS",
    "DOM_VK_I",
    "DOM_VK_INSERT",
    "DOM_VK_J",
    "DOM_VK_JUNJA",
    "DOM_VK_K",
    "DOM_VK_KANA",
    "DOM_VK_KANJI",
    "DOM_VK_L",
    "DOM_VK_LEFT",
    "DOM_VK_LEFT_TAB",
    "DOM_VK_LESS_THAN",
    "DOM_VK_M",
    "DOM_VK_META",
    "DOM_VK_MODECHANGE",
    "DOM_VK_MULTIPLY",
    "DOM_VK_N",
    "DOM_VK_NONCONVERT",
    "DOM_VK_NUMPAD0",
    "DOM_VK_NUMPAD1",
    "DOM_VK_NUMPAD2",
    "DOM_VK_NUMPAD3",
    "DOM_VK_NUMPAD4",
    "DOM_VK_NUMPAD5",
    "DOM_VK_NUMPAD6",
    "DOM_VK_NUMPAD7",
    "DOM_VK_NUMPAD8",
    "DOM_VK_NUMPAD9",
    "DOM_VK_NUM_LOCK",
    "DOM_VK_O",
    "DOM_VK_OEM_1",
    "DOM_VK_OEM_102",
    "DOM_VK_OEM_2",
    "DOM_VK_OEM_3",
    "DOM_VK_OEM_4",
    "DOM_VK_OEM_5",
    "DOM_VK_OEM_6",
    "DOM_VK_OEM_7",
    "DOM_VK_OEM_8",
    "DOM_VK_OEM_COMMA",
    "DOM_VK_OEM_MINUS",
    "DOM_VK_OEM_PERIOD",
    "DOM_VK_OEM_PLUS",
    "DOM_VK_OPEN_BRACKET",
    "DOM_VK_OPEN_CURLY_BRACKET",
    "DOM_VK_OPEN_PAREN",
    "DOM_VK_P",
    "DOM_VK_PA1",
    "DOM_VK_PAGEDOWN",
    "DOM_VK_PAGEUP",
    "DOM_VK_PAGE_DOWN",
    "DOM_VK_PAGE_UP",
    "DOM_VK_PAUSE",
    "DOM_VK_PERCENT",
    "DOM_VK_PERIOD",
    "DOM_VK_PIPE",
    "DOM_VK_PLAY",
    "DOM_VK_PLUS",
    "DOM_VK_PRINT",
    "DOM_VK_PRINTSCREEN",
    "DOM_VK_PROCESSKEY",
    "DOM_VK_PROPERITES",
    "DOM_VK_Q",
    "DOM_VK_QUESTION_MARK",
    "DOM_VK_QUOTE",
    "DOM_VK_R",
    "DOM_VK_REDO",
    "DOM_VK_RETURN",
    "DOM_VK_RIGHT",
    "DOM_VK_S",
    "DOM_VK_SCROLL_LOCK",
    "DOM_VK_SELECT",
    "DOM_VK_SEMICOLON",
    "DOM_VK_SEPARATOR",
    "DOM_VK_SHIFT",
    "DOM_VK_SLASH",
    "DOM_VK_SLEEP",
    "DOM_VK_SPACE",
    "DOM_VK_SUBTRACT",
    "DOM_VK_T",
    "DOM_VK_TAB",
    "DOM_VK_TILDE",
    "DOM_VK_U",
    "DOM_VK_UNDERSCORE",
    "DOM_VK_UNDO",
    "DOM_VK_UNICODE",
    "DOM_VK_UP",
    "DOM_VK_V",
    "DOM_VK_VOLUME_DOWN",
    "DOM_VK_VOLUME_MUTE",
    "DOM_VK_VOLUME_UP",
    "DOM_VK_W",
    "DOM_VK_WIN",
    "DOM_VK_WINDOW",
    "DOM_VK_WIN_ICO_00",
    "DOM_VK_WIN_ICO_CLEAR",
    "DOM_VK_WIN_ICO_HELP",
    "DOM_VK_WIN_OEM_ATTN",
    "DOM_VK_WIN_OEM_AUTO",
    "DOM_VK_WIN_OEM_BACKTAB",
    "DOM_VK_WIN_OEM_CLEAR",
    "DOM_VK_WIN_OEM_COPY",
    "DOM_VK_WIN_OEM_CUSEL",
    "DOM_VK_WIN_OEM_ENLW",
    "DOM_VK_WIN_OEM_FINISH",
    "DOM_VK_WIN_OEM_FJ_JISHO",
    "DOM_VK_WIN_OEM_FJ_LOYA",
    "DOM_VK_WIN_OEM_FJ_MASSHOU",
    "DOM_VK_WIN_OEM_FJ_ROYA",
    "DOM_VK_WIN_OEM_FJ_TOUROKU",
    "DOM_VK_WIN_OEM_JUMP",
    "DOM_VK_WIN_OEM_PA1",
    "DOM_VK_WIN_OEM_PA2",
    "DOM_VK_WIN_OEM_PA3",
    "DOM_VK_WIN_OEM_RESET",
    "DOM_VK_WIN_OEM_WSCTRL",
    "DOM_VK_X",
    "DOM_VK_XF86XK_ADD_FAVORITE",
    "DOM_VK_XF86XK_APPLICATION_LEFT",
    "DOM_VK_XF86XK_APPLICATION_RIGHT",
    "DOM_VK_XF86XK_AUDIO_CYCLE_TRACK",
    "DOM_VK_XF86XK_AUDIO_FORWARD",
    "DOM_VK_XF86XK_AUDIO_LOWER_VOLUME",
    "DOM_VK_XF86XK_AUDIO_MEDIA",
    "DOM_VK_XF86XK_AUDIO_MUTE",
    "DOM_VK_XF86XK_AUDIO_NEXT",
    "DOM_VK_XF86XK_AUDIO_PAUSE",
    "DOM_VK_XF86XK_AUDIO_PLAY",
    "DOM_VK_XF86XK_AUDIO_PREV",
    "DOM_VK_XF86XK_AUDIO_RAISE_VOLUME",
    "DOM_VK_XF86XK_AUDIO_RANDOM_PLAY",
    "DOM_VK_XF86XK_AUDIO_RECORD",
    "DOM_VK_XF86XK_AUDIO_REPEAT",
    "DOM_VK_XF86XK_AUDIO_REWIND",
    "DOM_VK_XF86XK_AUDIO_STOP",
    "DOM_VK_XF86XK_AWAY",
    "DOM_VK_XF86XK_BACK",
    "DOM_VK_XF86XK_BACK_FORWARD",
    "DOM_VK_XF86XK_BATTERY",
    "DOM_VK_XF86XK_BLUE",
    "DOM_VK_XF86XK_BLUETOOTH",
    "DOM_VK_XF86XK_BOOK",
    "DOM_VK_XF86XK_BRIGHTNESS_ADJUST",
    "DOM_VK_XF86XK_CALCULATOR",
    "DOM_VK_XF86XK_CALENDAR",
    "DOM_VK_XF86XK_CD",
    "DOM_VK_XF86XK_CLOSE",
    "DOM_VK_XF86XK_COMMUNITY",
    "DOM_VK_XF86XK_CONTRAST_ADJUST",
    "DOM_VK_XF86XK_COPY",
    "DOM_VK_XF86XK_CUT",
    "DOM_VK_XF86XK_CYCLE_ANGLE",
    "DOM_VK_XF86XK_DISPLAY",
    "DOM_VK_XF86XK_DOCUMENTS",
    "DOM_VK_XF86XK_DOS",
    "DOM_VK_XF86XK_EJECT",
    "DOM_VK_XF86XK_EXCEL",
    "DOM_VK_XF86XK_EXPLORER",
    "DOM_VK_XF86XK_FAVORITES",
    "DOM_VK_XF86XK_FINANCE",
    "DOM_VK_XF86XK_FORWARD",
    "DOM_VK_XF86XK_FRAME_BACK",
    "DOM_VK_XF86XK_FRAME_FORWARD",
    "DOM_VK_XF86XK_GAME",
    "DOM_VK_XF86XK_GO",
    "DOM_VK_XF86XK_GREEN",
    "DOM_VK_XF86XK_HIBERNATE",
    "DOM_VK_XF86XK_HISTORY",
    "DOM_VK_XF86XK_HOME_PAGE",
    "DOM_VK_XF86XK_HOT_LINKS",
    "DOM_VK_XF86XK_I_TOUCH",
    "DOM_VK_XF86XK_KBD_BRIGHTNESS_DOWN",
    "DOM_VK_XF86XK_KBD_BRIGHTNESS_UP",
    "DOM_VK_XF86XK_KBD_LIGHT_ON_OFF",
    "DOM_VK_XF86XK_LAUNCH0",
    "DOM_VK_XF86XK_LAUNCH1",
    "DOM_VK_XF86XK_LAUNCH2",
    "DOM_VK_XF86XK_LAUNCH3",
    "DOM_VK_XF86XK_LAUNCH4",
    "DOM_VK_XF86XK_LAUNCH5",
    "DOM_VK_XF86XK_LAUNCH6",
    "DOM_VK_XF86XK_LAUNCH7",
    "DOM_VK_XF86XK_LAUNCH8",
    "DOM_VK_XF86XK_LAUNCH9",
    "DOM_VK_XF86XK_LAUNCH_A",
    "DOM_VK_XF86XK_LAUNCH_B",
    "DOM_VK_XF86XK_LAUNCH_C",
    "DOM_VK_XF86XK_LAUNCH_D",
    "DOM_VK_XF86XK_LAUNCH_E",
    "DOM_VK_XF86XK_LAUNCH_F",
    "DOM_VK_XF86XK_LIGHT_BULB",
    "DOM_VK_XF86XK_LOG_OFF",
    "DOM_VK_XF86XK_MAIL",
    "DOM_VK_XF86XK_MAIL_FORWARD",
    "DOM_VK_XF86XK_MARKET",
    "DOM_VK_XF86XK_MEETING",
    "DOM_VK_XF86XK_MEMO",
    "DOM_VK_XF86XK_MENU_KB",
    "DOM_VK_XF86XK_MENU_PB",
    "DOM_VK_XF86XK_MESSENGER",
    "DOM_VK_XF86XK_MON_BRIGHTNESS_DOWN",
    "DOM_VK_XF86XK_MON_BRIGHTNESS_UP",
    "DOM_VK_XF86XK_MUSIC",
    "DOM_VK_XF86XK_MY_COMPUTER",
    "DOM_VK_XF86XK_MY_SITES",
    "DOM_VK_XF86XK_NEW",
    "DOM_VK_XF86XK_NEWS",
    "DOM_VK_XF86XK_OFFICE_HOME",
    "DOM_VK_XF86XK_OPEN",
    "DOM_VK_XF86XK_OPEN_URL",
    "DOM_VK_XF86XK_OPTION",
    "DOM_VK_XF86XK_PASTE",
    "DOM_VK_XF86XK_PHONE",
    "DOM_VK_XF86XK_PICTURES",
    "DOM_VK_XF86XK_POWER_DOWN",
    "DOM_VK_XF86XK_POWER_OFF",
    "DOM_VK_XF86XK_RED",
    "DOM_VK_XF86XK_REFRESH",
    "DOM_VK_XF86XK_RELOAD",
    "DOM_VK_XF86XK_REPLY",
    "DOM_VK_XF86XK_ROCKER_DOWN",
    "DOM_VK_XF86XK_ROCKER_ENTER",
    "DOM_VK_XF86XK_ROCKER_UP",
    "DOM_VK_XF86XK_ROTATE_WINDOWS",
    "DOM_VK_XF86XK_ROTATION_KB",
    "DOM_VK_XF86XK_ROTATION_PB",
    "DOM_VK_XF86XK_SAVE",
    "DOM_VK_XF86XK_SCREEN_SAVER",
    "DOM_VK_XF86XK_SCROLL_CLICK",
    "DOM_VK_XF86XK_SCROLL_DOWN",
    "DOM_VK_XF86XK_SCROLL_UP",
    "DOM_VK_XF86XK_SEARCH",
    "DOM_VK_XF86XK_SEND",
    "DOM_VK_XF86XK_SHOP",
    "DOM_VK_XF86XK_SPELL",
    "DOM_VK_XF86XK_SPLIT_SCREEN",
    "DOM_VK_XF86XK_STANDBY",
    "DOM_VK_XF86XK_START",
    "DOM_VK_XF86XK_STOP",
    "DOM_VK_XF86XK_SUBTITLE",
    "DOM_VK_XF86XK_SUPPORT",
    "DOM_VK_XF86XK_SUSPEND",
    "DOM_VK_XF86XK_TASK_PANE",
    "DOM_VK_XF86XK_TERMINAL",
    "DOM_VK_XF86XK_TIME",
    "DOM_VK_XF86XK_TOOLS",
    "DOM_VK_XF86XK_TOP_MENU",
    "DOM_VK_XF86XK_TO_DO_LIST",
    "DOM_VK_XF86XK_TRAVEL",
    "DOM_VK_XF86XK_USER1KB",
    "DOM_VK_XF86XK_USER2KB",
    "DOM_VK_XF86XK_USER_PB",
    "DOM_VK_XF86XK_UWB",
    "DOM_VK_XF86XK_VENDOR_HOME",
    "DOM_VK_XF86XK_VIDEO",
    "DOM_VK_XF86XK_VIEW",
    "DOM_VK_XF86XK_WAKE_UP",
    "DOM_VK_XF86XK_WEB_CAM",
    "DOM_VK_XF86XK_WHEEL_BUTTON",
    "DOM_VK_XF86XK_WLAN",
    "DOM_VK_XF86XK_WORD",
    "DOM_VK_XF86XK_WWW",
    "DOM_VK_XF86XK_XFER",
    "DOM_VK_XF86XK_YELLOW",
    "DOM_VK_XF86XK_ZOOM_IN",
    "DOM_VK_XF86XK_ZOOM_OUT",
    "DOM_VK_Y",
    "DOM_VK_Z",
    "DOM_VK_ZOOM",
    "DONE",
    "DONT_CARE",
    "DOWNLOADING",
    "DRAGDROP",
    "DRAW_BUFFER0",
    "DRAW_BUFFER1",
    "DRAW_BUFFER10",
    "DRAW_BUFFER11",
    "DRAW_BUFFER12",
    "DRAW_BUFFER13",
    "DRAW_BUFFER14",
    "DRAW_BUFFER15",
    "DRAW_BUFFER2",
    "DRAW_BUFFER3",
    "DRAW_BUFFER4",
    "DRAW_BUFFER5",
    "DRAW_BUFFER6",
    "DRAW_BUFFER7",
    "DRAW_BUFFER8",
    "DRAW_BUFFER9",
    "DRAW_FRAMEBUFFER",
    "DRAW_FRAMEBUFFER_BINDING",
    "DST_ALPHA",
    "DST_COLOR",
    "DYNAMIC_COPY",
    "DYNAMIC_DRAW",
    "DYNAMIC_READ",
    "DataChannel",
    "DataTransfer",
    "DataTransferItem",
    "DataTransferItemList",
    "DataView",
    "Date",
    "DateTimeFormat",
    "DecompressionStream",
    "DelayNode",
    "DelegatedInkTrailPresenter",
    "DeprecationReportBody",
    "DesktopNotification",
    "DesktopNotificationCenter",
    "DeviceLightEvent",
    "DeviceMotionEvent",
    "DeviceMotionEventAcceleration",
    "DeviceMotionEventRotationRate",
    "DeviceOrientationEvent",
    "DeviceProximityEvent",
    "DeviceStorage",
    "DeviceStorageChangeEvent",
    "Directory",
    "DisplayNames",
    "Document",
    "DocumentFragment",
    "DocumentPictureInPicture",
    "DocumentPictureInPictureEvent",
    "DocumentTimeline",
    "DocumentType",
    "DragEvent",
    "DynamicsCompressorNode",
    "E",
    "ELEMENT_ARRAY_BUFFER",
    "ELEMENT_ARRAY_BUFFER_BINDING",
    "ELEMENT_NODE",
    "EMPTY",
    "ENCODING_ERR",
    "ENDED",
    "END_TO_END",
    "END_TO_START",
    "ENTITY_NODE",
    "ENTITY_REFERENCE_NODE",
    "EPSILON",
    "EQUAL",
    "EQUALPOWER",
    "ERROR",
    "EXPONENTIAL_DISTANCE",
    "EditContext",
    "Element",
    "ElementInternals",
    "ElementQuery",
    "EncodedAudioChunk",
    "EncodedVideoChunk",
    "EnterPictureInPictureEvent",
    "Entity",
    "EntityReference",
    "Error",
    "ErrorEvent",
    "EvalError",
    "Event",
    "EventCounts",
    "EventException",
    "EventSource",
    "EventTarget",
    "Exception",
    "External",
    "EyeDropper",
    "FASTEST",
    "FIDOSDK",
    "FILTER_ACCEPT",
    "FILTER_INTERRUPT",
    "FILTER_REJECT",
    "FILTER_SKIP",
    "FINISHED_STATE",
    "FIRST_ORDERED_NODE_TYPE",
    "FLOAT",
    "FLOAT_32_UNSIGNED_INT_24_8_REV",
    "FLOAT_MAT2",
    "FLOAT_MAT2x3",
    "FLOAT_MAT2x4",
    "FLOAT_MAT3",
    "FLOAT_MAT3x2",
    "FLOAT_MAT3x4",
    "FLOAT_MAT4",
    "FLOAT_MAT4x2",
    "FLOAT_MAT4x3",
    "FLOAT_VEC2",
    "FLOAT_VEC3",
    "FLOAT_VEC4",
    "FOCUS",
    "FONT_FACE_RULE",
    "FONT_FEATURE_VALUES_RULE",
    "FRAGMENT",
    "FRAGMENT_SHADER",
    "FRAGMENT_SHADER_DERIVATIVE_HINT",
    "FRAGMENT_SHADER_DERIVATIVE_HINT_OES",
    "FRAMEBUFFER",
    "FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE",
    "FRAMEBUFFER_ATTACHMENT_BLUE_SIZE",
    "FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING",
    "FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE",
    "FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE",
    "FRAMEBUFFER_ATTACHMENT_GREEN_SIZE",
    "FRAMEBUFFER_ATTACHMENT_OBJECT_NAME",
    "FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE",
    "FRAMEBUFFER_ATTACHMENT_RED_SIZE",
    "FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE",
    "FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE",
    "FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER",
    "FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL",
    "FRAMEBUFFER_BINDING",
    "FRAMEBUFFER_COMPLETE",
    "FRAMEBUFFER_DEFAULT",
    "FRAMEBUFFER_INCOMPLETE_ATTACHMENT",
    "FRAMEBUFFER_INCOMPLETE_DIMENSIONS",
    "FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT",
    "FRAMEBUFFER_INCOMPLETE_MULTISAMPLE",
    "FRAMEBUFFER_UNSUPPORTED",
    "FRONT",
    "FRONT_AND_BACK",
    "FRONT_FACE",
    "FUNC_ADD",
    "FUNC_REVERSE_SUBTRACT",
    "FUNC_SUBTRACT",
    "FeaturePolicy",
    "FeaturePolicyViolationReportBody",
    "FederatedCredential",
    "Feed",
    "FeedEntry",
    "Fence",
    "FencedFrameConfig",
    "File",
    "FileError",
    "FileList",
    "FileReader",
    "FileSystem",
    "FileSystemDirectoryEntry",
    "FileSystemDirectoryHandle",
    "FileSystemDirectoryReader",
    "FileSystemEntry",
    "FileSystemFileEntry",
    "FileSystemFileHandle",
    "FileSystemHandle",
    "FileSystemWritableFileStream",
    "FinalizationRegistry",
    "FindInPage",
    "Float32Array",
    "Float64Array",
    "FocusEvent",
    "FontData",
    "FontFace",
    "FontFaceSet",
    "FontFaceSetLoadEvent",
    "FormData",
    "FormDataEvent",
    "FragmentDirective",
    "Function",
    "GENERATE_MIPMAP_HINT",
    "GEQUAL",
    "GPU",
    "GPUAdapter",
    "GPUAdapterInfo",
    "GPUBindGroup",
    "GPUBindGroupLayout",
    "GPUBuffer",
    "GPUBufferUsage",
    "GPUCanvasContext",
    "GPUColorWrite",
    "GPUCommandBuffer",
    "GPUCommandEncoder",
    "GPUCompilationInfo",
    "GPUCompilationMessage",
    "GPUComputePassEncoder",
    "GPUComputePipeline",
    "GPUDevice",
    "GPUDeviceLostInfo",
    "GPUError",
    "GPUExternalTexture",
    "GPUInternalError",
    "GPUMapMode",
    "GPUOutOfMemoryError",
    "GPUPipelineError",
    "GPUPipelineLayout",
    "GPUQuerySet",
    "GPUQueue",
    "GPURenderBundle",
    "GPURenderBundleEncoder",
    "GPURenderPassEncoder",
    "GPURenderPipeline",
    "GPUSampler",
    "GPUShaderModule",
    "GPUShaderStage",
    "GPUSupportedFeatures",
    "GPUSupportedLimits",
    "GPUTexture",
    "GPUTextureUsage",
    "GPUTextureView",
    "GPUUncapturedErrorEvent",
    "GPUValidationError",
    "GREATER",
    "GREEN",
    "GREEN_BITS",
    "GainNode",
    "Gamepad",
    "GamepadAxisMoveEvent",
    "GamepadButton",
    "GamepadButtonEvent",
    "GamepadEvent",
    "GamepadHapticActuator",
    "GamepadPose",
    "Geolocation",
    "GeolocationCoordinates",
    "GeolocationPosition",
    "GeolocationPositionError",
    "GestureEvent",
    "Global",
    "GravitySensor",
    "Gyroscope",
    "HALF_FLOAT",
    "HAVE_CURRENT_DATA",
    "HAVE_ENOUGH_DATA",
    "HAVE_FUTURE_DATA",
    "HAVE_METADATA",
    "HAVE_NOTHING",
    "HEADERS_RECEIVED",
    "HID",
    "HIDConnectionEvent",
    "HIDDEN",
    "HIDDevice",
    "HIDInputReportEvent",
    "HIERARCHY_REQUEST_ERR",
    "HIGHPASS",
    "HIGHSHELF",
    "HIGH_FLOAT",
    "HIGH_INT",
    "HORIZONTAL",
    "HORIZONTAL_AXIS",
    "HRTF",
    "HTMLAllCollection",
    "HTMLAnchorElement",
    "HTMLAppletElement",
    "HTMLAreaElement",
    "HTMLAudioElement",
    "HTMLBRElement",
    "HTMLBaseElement",
    "HTMLBaseFontElement",
    "HTMLBlockquoteElement",
    "HTMLBodyElement",
    "HTMLButtonElement",
    "HTMLCanvasElement",
    "HTMLCollection",
    "HTMLCommandElement",
    "HTMLContentElement",
    "HTMLDListElement",
    "HTMLDataElement",
    "HTMLDataListElement",
    "HTMLDetailsElement",
    "HTMLDialogElement",
    "HTMLDirectoryElement",
    "HTMLDivElement",
    "HTMLDocument",
    "HTMLElement",
    "HTMLEmbedElement",
    "HTMLFencedFrameElement",
    "HTMLFieldSetElement",
    "HTMLFontElement",
    "HTMLFormControlsCollection",
    "HTMLFormElement",
    "HTMLFrameElement",
    "HTMLFrameSetElement",
    "HTMLHRElement",
    "HTMLHeadElement",
    "HTMLHeadingElement",
    "HTMLHtmlElement",
    "HTMLIFrameElement",
    "HTMLImageElement",
    "HTMLInputElement",
    "HTMLIsIndexElement",
    "HTMLKeygenElement",
    "HTMLLIElement",
    "HTMLLabelElement",
    "HTMLLegendElement",
    "HTMLLinkElement",
    "HTMLMapElement",
    "HTMLMarqueeElement",
    "HTMLMediaElement",
    "HTMLMenuElement",
    "HTMLMenuItemElement",
    "HTMLMetaElement",
    "HTMLMeterElement",
    "HTMLModElement",
    "HTMLOListElement",
    "HTMLObjectElement",
    "HTMLOptGroupElement",
    "HTMLOptionElement",
    "HTMLOptionsCollection",
    "HTMLOutputElement",
    "HTMLParagraphElement",
    "HTMLParamElement",
    "HTMLPictureElement",
    "HTMLPreElement",
    "HTMLProgressElement",
    "HTMLPropertiesCollection",
    "HTMLQuoteElement",
    "HTMLScriptElement",
    "HTMLSelectElement",
    "HTMLShadowElement",
    "HTMLSlotElement",
    "HTMLSourceElement",
    "HTMLSpanElement",
    "HTMLStyleElement",
    "HTMLTableCaptionElement",
    "HTMLTableCellElement",
    "HTMLTableColElement",
    "HTMLTableElement",
    "HTMLTableRowElement",
    "HTMLTableSectionElement",
    "HTMLTemplateElement",
    "HTMLTextAreaElement",
    "HTMLTimeElement",
    "HTMLTitleElement",
    "HTMLTrackElement",
    "HTMLUListElement",
    "HTMLUnknownElement",
    "HTMLVideoElement",
    "HashChangeEvent",
    "Headers",
    "Highlight",
    "HighlightRegistry",
    "History",
    "Hz",
    "ICE_CHECKING",
    "ICE_CLOSED",
    "ICE_COMPLETED",
    "ICE_CONNECTED",
    "ICE_FAILED",
    "ICE_GATHERING",
    "ICE_WAITING",
    "IDBCursor",
    "IDBCursorWithValue",
    "IDBDatabase",
    "IDBDatabaseException",
    "IDBFactory",
    "IDBFileHandle",
    "IDBFileRequest",
    "IDBIndex",
    "IDBKeyRange",
    "IDBMutableFile",
    "IDBObjectStore",
    "IDBOpenDBRequest",
    "IDBRequest",
    "IDBTransaction",
    "IDBVersionChangeEvent",
    "IDLE",
    "IIRFilterNode",
    "IMPLEMENTATION_COLOR_READ_FORMAT",
    "IMPLEMENTATION_COLOR_READ_TYPE",
    "IMPORT_RULE",
    "INCR",
    "INCR_WRAP",
    "INDEX",
    "INDEX_SIZE_ERR",
    "INDIRECT",
    "INT",
    "INTERLEAVED_ATTRIBS",
    "INT_2_10_10_10_REV",
    "INT_SAMPLER_2D",
    "INT_SAMPLER_2D_ARRAY",
    "INT_SAMPLER_3D",
    "INT_SAMPLER_CUBE",
    "INT_VEC2",
    "INT_VEC3",
    "INT_VEC4",
    "INUSE_ATTRIBUTE_ERR",
    "INVALID_ACCESS_ERR",
    "INVALID_CHARACTER_ERR",
    "INVALID_ENUM",
    "INVALID_EXPRESSION_ERR",
    "INVALID_FRAMEBUFFER_OPERATION",
    "INVALID_INDEX",
    "INVALID_MODIFICATION_ERR",
    "INVALID_NODE_TYPE_ERR",
    "INVALID_OPERATION",
    "INVALID_STATE_ERR",
    "INVALID_VALUE",
    "INVERSE_DISTANCE",
    "INVERT",
    "IceCandidate",
    "IdentityCredential",
    "IdentityCredentialError",
    "IdentityProvider",
    "IdleDeadline",
    "IdleDetector",
    "Image",
    "ImageBitmap",
    "ImageBitmapRenderingContext",
    "ImageCapture",
    "ImageData",
    "ImageDecoder",
    "ImageTrack",
    "ImageTrackList",
    "Infinity",
    "Ink",
    "InputDeviceCapabilities",
    "InputDeviceInfo",
    "InputEvent",
    "InputMethodContext",
    "InstallTrigger",
    "InstallTriggerImpl",
    "Instance",
    "Int16Array",
    "Int32Array",
    "Int8Array",
    "Intent",
    "InternalError",
    "IntersectionObserver",
    "IntersectionObserverEntry",
    "Intl",
    "IsSearchProviderInstalled",
    "Iterator",
    "JSON",
    "JSTag",
    "KEEP",
    "KEYDOWN",
    "KEYFRAMES_RULE",
    "KEYFRAME_RULE",
    "KEYPRESS",
    "KEYUP",
    "KeyEvent",
    "Keyboard",
    "KeyboardEvent",
    "KeyboardLayoutMap",
    "KeyframeEffect",
    "LENGTHADJUST_SPACING",
    "LENGTHADJUST_SPACINGANDGLYPHS",
    "LENGTHADJUST_UNKNOWN",
    "LEQUAL",
    "LESS",
    "LINEAR",
    "LINEAR_DISTANCE",
    "LINEAR_MIPMAP_LINEAR",
    "LINEAR_MIPMAP_NEAREST",
    "LINES",
    "LINE_LOOP",
    "LINE_STRIP",
    "LINE_WIDTH",
    "LINK_STATUS",
    "LIVE",
    "LN10",
    "LN2",
    "LOADED",
    "LOADING",
    "LOG10E",
    "LOG2E",
    "LOWPASS",
    "LOWSHELF",
    "LOW_FLOAT",
    "LOW_INT",
    "LSException",
    "LSParserFilter",
    "LUMINANCE",
    "LUMINANCE_ALPHA",
    "LargestContentfulPaint",
    "LaunchParams",
    "LaunchQueue",
    "LayoutShift",
    "LayoutShiftAttribution",
    "LinearAccelerationSensor",
    "LinkError",
    "ListFormat",
    "LocalMediaStream",
    "Locale",
    "Location",
    "Lock",
    "LockManager",
    "MAP_READ",
    "MAP_WRITE",
    "MAX",
    "MAX_3D_TEXTURE_SIZE",
    "MAX_ARRAY_TEXTURE_LAYERS",
    "MAX_CLIENT_WAIT_TIMEOUT_WEBGL",
    "MAX_COLOR_ATTACHMENTS",
    "MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS",
    "MAX_COMBINED_TEXTURE_IMAGE_UNITS",
    "MAX_COMBINED_UNIFORM_BLOCKS",
    "MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS",
    "MAX_CUBE_MAP_TEXTURE_SIZE",
    "MAX_DRAW_BUFFERS",
    "MAX_ELEMENTS_INDICES",
    "MAX_ELEMENTS_VERTICES",
    "MAX_ELEMENT_INDEX",
    "MAX_FRAGMENT_INPUT_COMPONENTS",
    "MAX_FRAGMENT_UNIFORM_BLOCKS",
    "MAX_FRAGMENT_UNIFORM_COMPONENTS",
    "MAX_FRAGMENT_UNIFORM_VECTORS",
    "MAX_PROGRAM_TEXEL_OFFSET",
    "MAX_RENDERBUFFER_SIZE",
    "MAX_SAFE_INTEGER",
    "MAX_SAMPLES",
    "MAX_SERVER_WAIT_TIMEOUT",
    "MAX_TEXTURE_IMAGE_UNITS",
    "MAX_TEXTURE_LOD_BIAS",
    "MAX_TEXTURE_MAX_ANISOTROPY_EXT",
    "MAX_TEXTURE_SIZE",
    "MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS",
    "MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS",
    "MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS",
    "MAX_UNIFORM_BLOCK_SIZE",
    "MAX_UNIFORM_BUFFER_BINDINGS",
    "MAX_VALUE",
    "MAX_VARYING_COMPONENTS",
    "MAX_VARYING_VECTORS",
    "MAX_VERTEX_ATTRIBS",
    "MAX_VERTEX_OUTPUT_COMPONENTS",
    "MAX_VERTEX_TEXTURE_IMAGE_UNITS",
    "MAX_VERTEX_UNIFORM_BLOCKS",
    "MAX_VERTEX_UNIFORM_COMPONENTS",
    "MAX_VERTEX_UNIFORM_VECTORS",
    "MAX_VIEWPORT_DIMS",
    "MEDIA_ERR_ABORTED",
    "MEDIA_ERR_DECODE",
    "MEDIA_ERR_ENCRYPTED",
    "MEDIA_ERR_NETWORK",
    "MEDIA_ERR_SRC_NOT_SUPPORTED",
    "MEDIA_KEYERR_CLIENT",
    "MEDIA_KEYERR_DOMAIN",
    "MEDIA_KEYERR_HARDWARECHANGE",
    "MEDIA_KEYERR_OUTPUT",
    "MEDIA_KEYERR_SERVICE",
    "MEDIA_KEYERR_UNKNOWN",
    "MEDIA_RULE",
    "MEDIUM_FLOAT",
    "MEDIUM_INT",
    "META_MASK",
    "MIDIAccess",
    "MIDIConnectionEvent",
    "MIDIInput",
    "MIDIInputMap",
    "MIDIMessageEvent",
    "MIDIOutput",
    "MIDIOutputMap",
    "MIDIPort",
    "MIN",
    "MIN_PROGRAM_TEXEL_OFFSET",
    "MIN_SAFE_INTEGER",
    "MIN_VALUE",
    "MIRRORED_REPEAT",
    "MODE_ASYNCHRONOUS",
    "MODE_SYNCHRONOUS",
    "MODIFICATION",
    "MOUSEDOWN",
    "MOUSEDRAG",
    "MOUSEMOVE",
    "MOUSEOUT",
    "MOUSEOVER",
    "MOUSEUP",
    "MOZ_KEYFRAMES_RULE",
    "MOZ_KEYFRAME_RULE",
    "MOZ_SOURCE_CURSOR",
    "MOZ_SOURCE_ERASER",
    "MOZ_SOURCE_KEYBOARD",
    "MOZ_SOURCE_MOUSE",
    "MOZ_SOURCE_PEN",
    "MOZ_SOURCE_TOUCH",
    "MOZ_SOURCE_UNKNOWN",
    "MSGESTURE_FLAG_BEGIN",
    "MSGESTURE_FLAG_CANCEL",
    "MSGESTURE_FLAG_END",
    "MSGESTURE_FLAG_INERTIA",
    "MSGESTURE_FLAG_NONE",
    "MSPOINTER_TYPE_MOUSE",
    "MSPOINTER_TYPE_PEN",
    "MSPOINTER_TYPE_TOUCH",
    "MS_ASYNC_CALLBACK_STATUS_ASSIGN_DELEGATE",
    "MS_ASYNC_CALLBACK_STATUS_CANCEL",
    "MS_ASYNC_CALLBACK_STATUS_CHOOSEANY",
    "MS_ASYNC_CALLBACK_STATUS_ERROR",
    "MS_ASYNC_CALLBACK_STATUS_JOIN",
    "MS_ASYNC_OP_STATUS_CANCELED",
    "MS_ASYNC_OP_STATUS_ERROR",
    "MS_ASYNC_OP_STATUS_SUCCESS",
    "MS_MANIPULATION_STATE_ACTIVE",
    "MS_MANIPULATION_STATE_CANCELLED",
    "MS_MANIPULATION_STATE_COMMITTED",
    "MS_MANIPULATION_STATE_DRAGGING",
    "MS_MANIPULATION_STATE_INERTIA",
    "MS_MANIPULATION_STATE_PRESELECT",
    "MS_MANIPULATION_STATE_SELECTING",
    "MS_MANIPULATION_STATE_STOPPED",
    "MS_MEDIA_ERR_ENCRYPTED",
    "MS_MEDIA_KEYERR_CLIENT",
    "MS_MEDIA_KEYERR_DOMAIN",
    "MS_MEDIA_KEYERR_HARDWARECHANGE",
    "MS_MEDIA_KEYERR_OUTPUT",
    "MS_MEDIA_KEYERR_SERVICE",
    "MS_MEDIA_KEYERR_UNKNOWN",
    "Map",
    "Math",
    "MathMLElement",
    "MediaCapabilities",
    "MediaCapabilitiesInfo",
    "MediaController",
    "MediaDeviceInfo",
    "MediaDevices",
    "MediaElementAudioSourceNode",
    "MediaEncryptedEvent",
    "MediaError",
    "MediaKeyError",
    "MediaKeyEvent",
    "MediaKeyMessageEvent",
    "MediaKeyNeededEvent",
    "MediaKeySession",
    "MediaKeyStatusMap",
    "MediaKeySystemAccess",
    "MediaKeys",
    "MediaList",
    "MediaMetadata",
    "MediaQueryList",
    "MediaQueryListEvent",
    "MediaRecorder",
    "MediaRecorderErrorEvent",
    "MediaSession",
    "MediaSettingsRange",
    "MediaSource",
    "MediaSourceHandle",
    "MediaStream",
    "MediaStreamAudioDestinationNode",
    "MediaStreamAudioSourceNode",
    "MediaStreamEvent",
    "MediaStreamTrack",
    "MediaStreamTrackAudioSourceNode",
    "MediaStreamTrackEvent",
    "MediaStreamTrackGenerator",
    "MediaStreamTrackProcessor",
    "MediaStreamTrackVideoStats",
    "Memory",
    "MessageChannel",
    "MessageEvent",
    "MessagePort",
    "Methods",
    "MimeType",
    "MimeTypeArray",
    "Module",
    "MouseEvent",
    "MouseScrollEvent",
    "MozAnimation",
    "MozAnimationDelay",
    "MozAnimationDirection",
    "MozAnimationDuration",
    "MozAnimationFillMode",
    "MozAnimationIterationCount",
    "MozAnimationName",
    "MozAnimationPlayState",
    "MozAnimationTimingFunction",
    "MozAppearance",
    "MozBackfaceVisibility",
    "MozBinding",
    "MozBorderBottomColors",
    "MozBorderEnd",
    "MozBorderEndColor",
    "MozBorderEndStyle",
    "MozBorderEndWidth",
    "MozBorderImage",
    "MozBorderLeftColors",
    "MozBorderRightColors",
    "MozBorderStart",
    "MozBorderStartColor",
    "MozBorderStartStyle",
    "MozBorderStartWidth",
    "MozBorderTopColors",
    "MozBoxAlign",
    "MozBoxDirection",
    "MozBoxFlex",
    "MozBoxOrdinalGroup",
    "MozBoxOrient",
    "MozBoxPack",
    "MozBoxSizing",
    "MozCSSKeyframeRule",
    "MozCSSKeyframesRule",
    "MozColumnCount",
    "MozColumnFill",
    "MozColumnGap",
    "MozColumnRule",
    "MozColumnRuleColor",
    "MozColumnRuleStyle",
    "MozColumnRuleWidth",
    "MozColumnWidth",
    "MozColumns",
    "MozContactChangeEvent",
    "MozFloatEdge",
    "MozFontFeatureSettings",
    "MozFontLanguageOverride",
    "MozForceBrokenImageIcon",
    "MozHyphens",
    "MozImageRegion",
    "MozMarginEnd",
    "MozMarginStart",
    "MozMmsEvent",
    "MozMmsMessage",
    "MozMobileMessageThread",
    "MozOSXFontSmoothing",
    "MozOrient",
    "MozOsxFontSmoothing",
    "MozOutlineRadius",
    "MozOutlineRadiusBottomleft",
    "MozOutlineRadiusBottomright",
    "MozOutlineRadiusTopleft",
    "MozOutlineRadiusTopright",
    "MozPaddingEnd",
    "MozPaddingStart",
    "MozPerspective",
    "MozPerspectiveOrigin",
    "MozPowerManager",
    "MozSettingsEvent",
    "MozSmsEvent",
    "MozSmsMessage",
    "MozStackSizing",
    "MozTabSize",
    "MozTextAlignLast",
    "MozTextDecorationColor",
    "MozTextDecorationLine",
    "MozTextDecorationStyle",
    "MozTextSizeAdjust",
    "MozTransform",
    "MozTransformOrigin",
    "MozTransformStyle",
    "MozTransition",
    "MozTransitionDelay",
    "MozTransitionDuration",
    "MozTransitionProperty",
    "MozTransitionTimingFunction",
    "MozUserFocus",
    "MozUserInput",
    "MozUserModify",
    "MozUserSelect",
    "MozWindowDragging",
    "MozWindowShadow",
    "MutationEvent",
    "MutationObserver",
    "MutationRecord",
    "NAMESPACE_ERR",
    "NAMESPACE_RULE",
    "NEAREST",
    "NEAREST_MIPMAP_LINEAR",
    "NEAREST_MIPMAP_NEAREST",
    "NEGATIVE_INFINITY",
    "NETWORK_EMPTY",
    "NETWORK_ERR",
    "NETWORK_IDLE",
    "NETWORK_LOADED",
    "NETWORK_LOADING",
    "NETWORK_NO_SOURCE",
    "NEVER",
    "NEW",
    "NEXT",
    "NEXT_NO_DUPLICATE",
    "NICEST",
    "NODE_AFTER",
    "NODE_BEFORE",
    "NODE_BEFORE_AND_AFTER",
    "NODE_INSIDE",
    "NONE",
    "NON_TRANSIENT_ERR",
    "NOTATION_NODE",
    "NOTCH",
    "NOTEQUAL",
    "NOT_ALLOWED_ERR",
    "NOT_FOUND_ERR",
    "NOT_READABLE_ERR",
    "NOT_SUPPORTED_ERR",
    "NO_DATA_ALLOWED_ERR",
    "NO_ERR",
    "NO_ERROR",
    "NO_MODIFICATION_ALLOWED_ERR",
    "NUMBER_TYPE",
    "NUM_COMPRESSED_TEXTURE_FORMATS",
    "NaN",
    "NamedNodeMap",
    "NavigateEvent",
    "Navigation",
    "NavigationActivation",
    "NavigationCurrentEntryChangeEvent",
    "NavigationDestination",
    "NavigationHistoryEntry",
    "NavigationPreloadManager",
    "NavigationTransition",
    "Navigator",
    "NavigatorLogin",
    "NavigatorManagedData",
    "NavigatorUAData",
    "NearbyLinks",
    "NetworkInformation",
    "Node",
    "NodeFilter",
    "NodeIterator",
    "NodeList",
    "NotRestoredReasonDetails",
    "NotRestoredReasons",
    "Notation",
    "Notification",
    "NotifyPaintEvent",
    "Number",
    "NumberFormat",
    "OBJECT_TYPE",
    "OBSOLETE",
    "OK",
    "ONE",
    "ONE_MINUS_CONSTANT_ALPHA",
    "ONE_MINUS_CONSTANT_COLOR",
    "ONE_MINUS_DST_ALPHA",
    "ONE_MINUS_DST_COLOR",
    "ONE_MINUS_SRC_ALPHA",
    "ONE_MINUS_SRC_COLOR",
    "OPEN",
    "OPENED",
    "OPENING",
    "ORDERED_NODE_ITERATOR_TYPE",
    "ORDERED_NODE_SNAPSHOT_TYPE",
    "OTHER_ERROR",
    "OTPCredential",
    "OUT_OF_MEMORY",
    "Object",
    "OfflineAudioCompletionEvent",
    "OfflineAudioContext",
    "OfflineResourceList",
    "OffscreenCanvas",
    "OffscreenCanvasRenderingContext2D",
    "Option",
    "OrientationSensor",
    "OscillatorNode",
    "OverconstrainedError",
    "OverflowEvent",
    "PACK_ALIGNMENT",
    "PACK_ROW_LENGTH",
    "PACK_SKIP_PIXELS",
    "PACK_SKIP_ROWS",
    "PAGE_RULE",
    "PARSE_ERR",
    "PATHSEG_ARC_ABS",
    "PATHSEG_ARC_REL",
    "PATHSEG_CLOSEPATH",
    "PATHSEG_CURVETO_CUBIC_ABS",
    "PATHSEG_CURVETO_CUBIC_REL",
    "PATHSEG_CURVETO_CUBIC_SMOOTH_ABS",
    "PATHSEG_CURVETO_CUBIC_SMOOTH_REL",
    "PATHSEG_CURVETO_QUADRATIC_ABS",
    "PATHSEG_CURVETO_QUADRATIC_REL",
    "PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS",
    "PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL",
    "PATHSEG_LINETO_ABS",
    "PATHSEG_LINETO_HORIZONTAL_ABS",
    "PATHSEG_LINETO_HORIZONTAL_REL",
    "PATHSEG_LINETO_REL",
    "PATHSEG_LINETO_VERTICAL_ABS",
    "PATHSEG_LINETO_VERTICAL_REL",
    "PATHSEG_MOVETO_ABS",
    "PATHSEG_MOVETO_REL",
    "PATHSEG_UNKNOWN",
    "PATH_EXISTS_ERR",
    "PEAKING",
    "PERMISSION_DENIED",
    "PERSISTENT",
    "PI",
    "PIXEL_PACK_BUFFER",
    "PIXEL_PACK_BUFFER_BINDING",
    "PIXEL_UNPACK_BUFFER",
    "PIXEL_UNPACK_BUFFER_BINDING",
    "PLAYING_STATE",
    "POINTS",
    "POLYGON_OFFSET_FACTOR",
    "POLYGON_OFFSET_FILL",
    "POLYGON_OFFSET_UNITS",
    "POSITION_UNAVAILABLE",
    "POSITIVE_INFINITY",
    "PREV",
    "PREV_NO_DUPLICATE",
    "PROCESSING_INSTRUCTION_NODE",
    "PageChangeEvent",
    "PageRevealEvent",
    "PageSwapEvent",
    "PageTransitionEvent",
    "PaintRequest",
    "PaintRequestList",
    "PannerNode",
    "PasswordCredential",
    "Path2D",
    "PaymentAddress",
    "PaymentInstruments",
    "PaymentManager",
    "PaymentMethodChangeEvent",
    "PaymentRequest",
    "PaymentRequestUpdateEvent",
    "PaymentResponse",
    "Performance",
    "PerformanceElementTiming",
    "PerformanceEntry",
    "PerformanceEventTiming",
    "PerformanceLongAnimationFrameTiming",
    "PerformanceLongTaskTiming",
    "PerformanceMark",
    "PerformanceMeasure",
    "PerformanceNavigation",
    "PerformanceNavigationTiming",
    "PerformanceObserver",
    "PerformanceObserverEntryList",
    "PerformancePaintTiming",
    "PerformanceResourceTiming",
    "PerformanceScriptTiming",
    "PerformanceServerTiming",
    "PerformanceTiming",
    "PeriodicSyncManager",
    "PeriodicWave",
    "PermissionStatus",
    "Permissions",
    "PhotoCapabilities",
    "PictureInPictureEvent",
    "PictureInPictureWindow",
    "Plugin",
    "PluginArray",
    "PluralRules",
    "PointerEvent",
    "PopStateEvent",
    "PopupBlockedEvent",
    "Presentation",
    "PresentationAvailability",
    "PresentationConnection",
    "PresentationConnectionAvailableEvent",
    "PresentationConnectionCloseEvent",
    "PresentationConnectionList",
    "PresentationReceiver",
    "PresentationRequest",
    "ProcessingInstruction",
    "Profiler",
    "ProgressEvent",
    "Promise",
    "PromiseRejectionEvent",
    "PropertyNodeList",
    "Proxy",
    "PublicKeyCredential",
    "PushManager",
    "PushSubscription",
    "PushSubscriptionOptions",
    "Q",
    "QUERY_RESOLVE",
    "QUERY_RESULT",
    "QUERY_RESULT_AVAILABLE",
    "QUOTA_ERR",
    "QUOTA_EXCEEDED_ERR",
    "QueryInterface",
    "R11F_G11F_B10F",
    "R16F",
    "R16I",
    "R16UI",
    "R32F",
    "R32I",
    "R32UI",
    "R8",
    "R8I",
    "R8UI",
    "R8_SNORM",
    "RASTERIZER_DISCARD",
    "READ",
    "READ_BUFFER",
    "READ_FRAMEBUFFER",
    "READ_FRAMEBUFFER_BINDING",
    "READ_ONLY",
    "READ_ONLY_ERR",
    "READ_WRITE",
    "RED",
    "RED_BITS",
    "RED_INTEGER",
    "REMOVAL",
    "RENDERBUFFER",
    "RENDERBUFFER_ALPHA_SIZE",
    "RENDERBUFFER_BINDING",
    "RENDERBUFFER_BLUE_SIZE",
    "RENDERBUFFER_DEPTH_SIZE",
    "RENDERBUFFER_GREEN_SIZE",
    "RENDERBUFFER_HEIGHT",
    "RENDERBUFFER_INTERNAL_FORMAT",
    "RENDERBUFFER_RED_SIZE",
    "RENDERBUFFER_SAMPLES",
    "RENDERBUFFER_STENCIL_SIZE",
    "RENDERBUFFER_WIDTH",
    "RENDERER",
    "RENDERING_INTENT_ABSOLUTE_COLORIMETRIC",
    "RENDERING_INTENT_AUTO",
    "RENDERING_INTENT_PERCEPTUAL",
    "RENDERING_INTENT_RELATIVE_COLORIMETRIC",
    "RENDERING_INTENT_SATURATION",
    "RENDERING_INTENT_UNKNOWN",
    "RENDER_ATTACHMENT",
    "REPEAT",
    "REPLACE",
    "RG",
    "RG16F",
    "RG16I",
    "RG16UI",
    "RG32F",
    "RG32I",
    "RG32UI",
    "RG8",
    "RG8I",
    "RG8UI",
    "RG8_SNORM",
    "RGB",
    "RGB10_A2",
    "RGB10_A2UI",
    "RGB16F",
    "RGB16I",
    "RGB16UI",
    "RGB32F",
    "RGB32I",
    "RGB32UI",
    "RGB565",
    "RGB5_A1",
    "RGB8",
    "RGB8I",
    "RGB8UI",
    "RGB8_SNORM",
    "RGB9_E5",
    "RGBA",
    "RGBA16F",
    "RGBA16I",
    "RGBA16UI",
    "RGBA32F",
    "RGBA32I",
    "RGBA32UI",
    "RGBA4",
    "RGBA8",
    "RGBA8I",
    "RGBA8UI",
    "RGBA8_SNORM",
    "RGBA_INTEGER",
    "RGBColor",
    "RGB_INTEGER",
    "RG_INTEGER",
    "ROTATION_CLOCKWISE",
    "ROTATION_COUNTERCLOCKWISE",
    "RTCCertificate",
    "RTCDTMFSender",
    "RTCDTMFToneChangeEvent",
    "RTCDataChannel",
    "RTCDataChannelEvent",
    "RTCDtlsTransport",
    "RTCEncodedAudioFrame",
    "RTCEncodedVideoFrame",
    "RTCError",
    "RTCErrorEvent",
    "RTCIceCandidate",
    "RTCIceTransport",
    "RTCPeerConnection",
    "RTCPeerConnectionIceErrorEvent",
    "RTCPeerConnectionIceEvent",
    "RTCRtpReceiver",
    "RTCRtpScriptTransform",
    "RTCRtpSender",
    "RTCRtpTransceiver",
    "RTCSctpTransport",
    "RTCSessionDescription",
    "RTCStatsReport",
    "RTCTrackEvent",
    "RadioNodeList",
    "Range",
    "RangeError",
    "RangeException",
    "ReadableByteStreamController",
    "ReadableStream",
    "ReadableStreamBYOBReader",
    "ReadableStreamBYOBRequest",
    "ReadableStreamDefaultController",
    "ReadableStreamDefaultReader",
    "RecordErrorEvent",
    "Rect",
    "ReferenceError",
    "Reflect",
    "RegExp",
    "RelativeOrientationSensor",
    "RelativeTimeFormat",
    "RemotePlayback",
    "Report",
    "ReportBody",
    "ReportingObserver",
    "Request",
    "ResizeObserver",
    "ResizeObserverEntry",
    "ResizeObserverSize",
    "Response",
    "RuntimeError",
    "SAMPLER_2D",
    "SAMPLER_2D_ARRAY",
    "SAMPLER_2D_ARRAY_SHADOW",
    "SAMPLER_2D_SHADOW",
    "SAMPLER_3D",
    "SAMPLER_BINDING",
    "SAMPLER_CUBE",
    "SAMPLER_CUBE_SHADOW",
    "SAMPLES",
    "SAMPLE_ALPHA_TO_COVERAGE",
    "SAMPLE_BUFFERS",
    "SAMPLE_COVERAGE",
    "SAMPLE_COVERAGE_INVERT",
    "SAMPLE_COVERAGE_VALUE",
    "SAWTOOTH",
    "SCHEDULED_STATE",
    "SCISSOR_BOX",
    "SCISSOR_TEST",
    "SCROLL_PAGE_DOWN",
    "SCROLL_PAGE_UP",
    "SDP_ANSWER",
    "SDP_OFFER",
    "SDP_PRANSWER",
    "SECURITY_ERR",
    "SELECT",
    "SEPARATE_ATTRIBS",
    "SERIALIZE_ERR",
    "SEVERITY_ERROR",
    "SEVERITY_FATAL_ERROR",
    "SEVERITY_WARNING",
    "SHADER_COMPILER",
    "SHADER_TYPE",
    "SHADING_LANGUAGE_VERSION",
    "SHIFT_MASK",
    "SHORT",
    "SHOWING",
    "SHOW_ALL",
    "SHOW_ATTRIBUTE",
    "SHOW_CDATA_SECTION",
    "SHOW_COMMENT",
    "SHOW_DOCUMENT",
    "SHOW_DOCUMENT_FRAGMENT",
    "SHOW_DOCUMENT_TYPE",
    "SHOW_ELEMENT",
    "SHOW_ENTITY",
    "SHOW_ENTITY_REFERENCE",
    "SHOW_NOTATION",
    "SHOW_PROCESSING_INSTRUCTION",
    "SHOW_TEXT",
    "SIGNALED",
    "SIGNED_NORMALIZED",
    "SINE",
    "SOUNDFIELD",
    "SQLException",
    "SQRT1_2",
    "SQRT2",
    "SQUARE",
    "SRC_ALPHA",
    "SRC_ALPHA_SATURATE",
    "SRC_COLOR",
    "SRGB",
    "SRGB8",
    "SRGB8_ALPHA8",
    "START_TO_END",
    "START_TO_START",
    "STATIC_COPY",
    "STATIC_DRAW",
    "STATIC_READ",
    "STENCIL",
    "STENCIL_ATTACHMENT",
    "STENCIL_BACK_FAIL",
    "STENCIL_BACK_FUNC",
    "STENCIL_BACK_PASS_DEPTH_FAIL",
    "STENCIL_BACK_PASS_DEPTH_PASS",
    "STENCIL_BACK_REF",
    "STENCIL_BACK_VALUE_MASK",
    "STENCIL_BACK_WRITEMASK",
    "STENCIL_BITS",
    "STENCIL_BUFFER_BIT",
    "STENCIL_CLEAR_VALUE",
    "STENCIL_FAIL",
    "STENCIL_FUNC",
    "STENCIL_INDEX",
    "STENCIL_INDEX8",
    "STENCIL_PASS_DEPTH_FAIL",
    "STENCIL_PASS_DEPTH_PASS",
    "STENCIL_REF",
    "STENCIL_TEST",
    "STENCIL_VALUE_MASK",
    "STENCIL_WRITEMASK",
    "STORAGE",
    "STORAGE_BINDING",
    "STREAM_COPY",
    "STREAM_DRAW",
    "STREAM_READ",
    "STRING_TYPE",
    "STYLE_RULE",
    "SUBPIXEL_BITS",
    "SUPPORTS_RULE",
    "SVGAElement",
    "SVGAltGlyphDefElement",
    "SVGAltGlyphElement",
    "SVGAltGlyphItemElement",
    "SVGAngle",
    "SVGAnimateColorElement",
    "SVGAnimateElement",
    "SVGAnimateMotionElement",
    "SVGAnimateTransformElement",
    "SVGAnimatedAngle",
    "SVGAnimatedBoolean",
    "SVGAnimatedEnumeration",
    "SVGAnimatedInteger",
    "SVGAnimatedLength",
    "SVGAnimatedLengthList",
    "SVGAnimatedNumber",
    "SVGAnimatedNumberList",
    "SVGAnimatedPreserveAspectRatio",
    "SVGAnimatedRect",
    "SVGAnimatedString",
    "SVGAnimatedTransformList",
    "SVGAnimationElement",
    "SVGCircleElement",
    "SVGClipPathElement",
    "SVGColor",
    "SVGComponentTransferFunctionElement",
    "SVGCursorElement",
    "SVGDefsElement",
    "SVGDescElement",
    "SVGDiscardElement",
    "SVGDocument",
    "SVGElement",
    "SVGElementInstance",
    "SVGElementInstanceList",
    "SVGEllipseElement",
    "SVGException",
    "SVGFEBlendElement",
    "SVGFEColorMatrixElement",
    "SVGFEComponentTransferElement",
    "SVGFECompositeElement",
    "SVGFEConvolveMatrixElement",
    "SVGFEDiffuseLightingElement",
    "SVGFEDisplacementMapElement",
    "SVGFEDistantLightElement",
    "SVGFEDropShadowElement",
    "SVGFEFloodElement",
    "SVGFEFuncAElement",
    "SVGFEFuncBElement",
    "SVGFEFuncGElement",
    "SVGFEFuncRElement",
    "SVGFEGaussianBlurElement",
    "SVGFEImageElement",
    "SVGFEMergeElement",
    "SVGFEMergeNodeElement",
    "SVGFEMorphologyElement",
    "SVGFEOffsetElement",
    "SVGFEPointLightElement",
    "SVGFESpecularLightingElement",
    "SVGFESpotLightElement",
    "SVGFETileElement",
    "SVGFETurbulenceElement",
    "SVGFilterElement",
    "SVGFontElement",
    "SVGFontFaceElement",
    "SVGFontFaceFormatElement",
    "SVGFontFaceNameElement",
    "SVGFontFaceSrcElement",
    "SVGFontFaceUriElement",
    "SVGForeignObjectElement",
    "SVGGElement",
    "SVGGeometryElement",
    "SVGGlyphElement",
    "SVGGlyphRefElement",
    "SVGGradientElement",
    "SVGGraphicsElement",
    "SVGHKernElement",
    "SVGImageElement",
    "SVGLength",
    "SVGLengthList",
    "SVGLineElement",
    "SVGLinearGradientElement",
    "SVGMPathElement",
    "SVGMarkerElement",
    "SVGMaskElement",
    "SVGMatrix",
    "SVGMetadataElement",
    "SVGMissingGlyphElement",
    "SVGNumber",
    "SVGNumberList",
    "SVGPaint",
    "SVGPathElement",
    "SVGPathSeg",
    "SVGPathSegArcAbs",
    "SVGPathSegArcRel",
    "SVGPathSegClosePath",
    "SVGPathSegCurvetoCubicAbs",
    "SVGPathSegCurvetoCubicRel",
    "SVGPathSegCurvetoCubicSmoothAbs",
    "SVGPathSegCurvetoCubicSmoothRel",
    "SVGPathSegCurvetoQuadraticAbs",
    "SVGPathSegCurvetoQuadraticRel",
    "SVGPathSegCurvetoQuadraticSmoothAbs",
    "SVGPathSegCurvetoQuadraticSmoothRel",
    "SVGPathSegLinetoAbs",
    "SVGPathSegLinetoHorizontalAbs",
    "SVGPathSegLinetoHorizontalRel",
    "SVGPathSegLinetoRel",
    "SVGPathSegLinetoVerticalAbs",
    "SVGPathSegLinetoVerticalRel",
    "SVGPathSegList",
    "SVGPathSegMovetoAbs",
    "SVGPathSegMovetoRel",
    "SVGPatternElement",
    "SVGPoint",
    "SVGPointList",
    "SVGPolygonElement",
    "SVGPolylineElement",
    "SVGPreserveAspectRatio",
    "SVGRadialGradientElement",
    "SVGRect",
    "SVGRectElement",
    "SVGRenderingIntent",
    "SVGSVGElement",
    "SVGScriptElement",
    "SVGSetElement",
    "SVGStopElement",
    "SVGStringList",
    "SVGStyleElement",
    "SVGSwitchElement",
    "SVGSymbolElement",
    "SVGTRefElement",
    "SVGTSpanElement",
    "SVGTextContentElement",
    "SVGTextElement",
    "SVGTextPathElement",
    "SVGTextPositioningElement",
    "SVGTitleElement",
    "SVGTransform",
    "SVGTransformList",
    "SVGUnitTypes",
    "SVGUseElement",
    "SVGVKernElement",
    "SVGViewElement",
    "SVGViewSpec",
    "SVGZoomAndPan",
    "SVGZoomEvent",
    "SVG_ANGLETYPE_DEG",
    "SVG_ANGLETYPE_GRAD",
    "SVG_ANGLETYPE_RAD",
    "SVG_ANGLETYPE_UNKNOWN",
    "SVG_ANGLETYPE_UNSPECIFIED",
    "SVG_CHANNEL_A",
    "SVG_CHANNEL_B",
    "SVG_CHANNEL_G",
    "SVG_CHANNEL_R",
    "SVG_CHANNEL_UNKNOWN",
    "SVG_COLORTYPE_CURRENTCOLOR",
    "SVG_COLORTYPE_RGBCOLOR",
    "SVG_COLORTYPE_RGBCOLOR_ICCCOLOR",
    "SVG_COLORTYPE_UNKNOWN",
    "SVG_EDGEMODE_DUPLICATE",
    "SVG_EDGEMODE_NONE",
    "SVG_EDGEMODE_UNKNOWN",
    "SVG_EDGEMODE_WRAP",
    "SVG_FEBLEND_MODE_COLOR",
    "SVG_FEBLEND_MODE_COLOR_BURN",
    "SVG_FEBLEND_MODE_COLOR_DODGE",
    "SVG_FEBLEND_MODE_DARKEN",
    "SVG_FEBLEND_MODE_DIFFERENCE",
    "SVG_FEBLEND_MODE_EXCLUSION",
    "SVG_FEBLEND_MODE_HARD_LIGHT",
    "SVG_FEBLEND_MODE_HUE",
    "SVG_FEBLEND_MODE_LIGHTEN",
    "SVG_FEBLEND_MODE_LUMINOSITY",
    "SVG_FEBLEND_MODE_MULTIPLY",
    "SVG_FEBLEND_MODE_NORMAL",
    "SVG_FEBLEND_MODE_OVERLAY",
    "SVG_FEBLEND_MODE_SATURATION",
    "SVG_FEBLEND_MODE_SCREEN",
    "SVG_FEBLEND_MODE_SOFT_LIGHT",
    "SVG_FEBLEND_MODE_UNKNOWN",
    "SVG_FECOLORMATRIX_TYPE_HUEROTATE",
    "SVG_FECOLORMATRIX_TYPE_LUMINANCETOALPHA",
    "SVG_FECOLORMATRIX_TYPE_MATRIX",
    "SVG_FECOLORMATRIX_TYPE_SATURATE",
    "SVG_FECOLORMATRIX_TYPE_UNKNOWN",
    "SVG_FECOMPONENTTRANSFER_TYPE_DISCRETE",
    "SVG_FECOMPONENTTRANSFER_TYPE_GAMMA",
    "SVG_FECOMPONENTTRANSFER_TYPE_IDENTITY",
    "SVG_FECOMPONENTTRANSFER_TYPE_LINEAR",
    "SVG_FECOMPONENTTRANSFER_TYPE_TABLE",
    "SVG_FECOMPONENTTRANSFER_TYPE_UNKNOWN",
    "SVG_FECOMPOSITE_OPERATOR_ARITHMETIC",
    "SVG_FECOMPOSITE_OPERATOR_ATOP",
    "SVG_FECOMPOSITE_OPERATOR_IN",
    "SVG_FECOMPOSITE_OPERATOR_LIGHTER",
    "SVG_FECOMPOSITE_OPERATOR_OUT",
    "SVG_FECOMPOSITE_OPERATOR_OVER",
    "SVG_FECOMPOSITE_OPERATOR_UNKNOWN",
    "SVG_FECOMPOSITE_OPERATOR_XOR",
    "SVG_INVALID_VALUE_ERR",
    "SVG_LENGTHTYPE_CM",
    "SVG_LENGTHTYPE_EMS",
    "SVG_LENGTHTYPE_EXS",
    "SVG_LENGTHTYPE_IN",
    "SVG_LENGTHTYPE_MM",
    "SVG_LENGTHTYPE_NUMBER",
    "SVG_LENGTHTYPE_PC",
    "SVG_LENGTHTYPE_PERCENTAGE",
    "SVG_LENGTHTYPE_PT",
    "SVG_LENGTHTYPE_PX",
    "SVG_LENGTHTYPE_UNKNOWN",
    "SVG_MARKERUNITS_STROKEWIDTH",
    "SVG_MARKERUNITS_UNKNOWN",
    "SVG_MARKERUNITS_USERSPACEONUSE",
    "SVG_MARKER_ORIENT_ANGLE",
    "SVG_MARKER_ORIENT_AUTO",
    "SVG_MARKER_ORIENT_AUTO_START_REVERSE",
    "SVG_MARKER_ORIENT_UNKNOWN",
    "SVG_MASKTYPE_ALPHA",
    "SVG_MASKTYPE_LUMINANCE",
    "SVG_MATRIX_NOT_INVERTABLE",
    "SVG_MEETORSLICE_MEET",
    "SVG_MEETORSLICE_SLICE",
    "SVG_MEETORSLICE_UNKNOWN",
    "SVG_MORPHOLOGY_OPERATOR_DILATE",
    "SVG_MORPHOLOGY_OPERATOR_ERODE",
    "SVG_MORPHOLOGY_OPERATOR_UNKNOWN",
    "SVG_PAINTTYPE_CURRENTCOLOR",
    "SVG_PAINTTYPE_NONE",
    "SVG_PAINTTYPE_RGBCOLOR",
    "SVG_PAINTTYPE_RGBCOLOR_ICCCOLOR",
    "SVG_PAINTTYPE_UNKNOWN",
    "SVG_PAINTTYPE_URI",
    "SVG_PAINTTYPE_URI_CURRENTCOLOR",
    "SVG_PAINTTYPE_URI_NONE",
    "SVG_PAINTTYPE_URI_RGBCOLOR",
    "SVG_PAINTTYPE_URI_RGBCOLOR_ICCCOLOR",
    "SVG_PRESERVEASPECTRATIO_NONE",
    "SVG_PRESERVEASPECTRATIO_UNKNOWN",
    "SVG_PRESERVEASPECTRATIO_XMAXYMAX",
    "SVG_PRESERVEASPECTRATIO_XMAXYMID",
    "SVG_PRESERVEASPECTRATIO_XMAXYMIN",
    "SVG_PRESERVEASPECTRATIO_XMIDYMAX",
    "SVG_PRESERVEASPECTRATIO_XMIDYMID",
    "SVG_PRESERVEASPECTRATIO_XMIDYMIN",
    "SVG_PRESERVEASPECTRATIO_XMINYMAX",
    "SVG_PRESERVEASPECTRATIO_XMINYMID",
    "SVG_PRESERVEASPECTRATIO_XMINYMIN",
    "SVG_SPREADMETHOD_PAD",
    "SVG_SPREADMETHOD_REFLECT",
    "SVG_SPREADMETHOD_REPEAT",
    "SVG_SPREADMETHOD_UNKNOWN",
    "SVG_STITCHTYPE_NOSTITCH",
    "SVG_STITCHTYPE_STITCH",
    "SVG_STITCHTYPE_UNKNOWN",
    "SVG_TRANSFORM_MATRIX",
    "SVG_TRANSFORM_ROTATE",
    "SVG_TRANSFORM_SCALE",
    "SVG_TRANSFORM_SKEWX",
    "SVG_TRANSFORM_SKEWY",
    "SVG_TRANSFORM_TRANSLATE",
    "SVG_TRANSFORM_UNKNOWN",
    "SVG_TURBULENCE_TYPE_FRACTALNOISE",
    "SVG_TURBULENCE_TYPE_TURBULENCE",
    "SVG_TURBULENCE_TYPE_UNKNOWN",
    "SVG_UNIT_TYPE_OBJECTBOUNDINGBOX",
    "SVG_UNIT_TYPE_UNKNOWN",
    "SVG_UNIT_TYPE_USERSPACEONUSE",
    "SVG_WRONG_TYPE_ERR",
    "SVG_ZOOMANDPAN_DISABLE",
    "SVG_ZOOMANDPAN_MAGNIFY",
    "SVG_ZOOMANDPAN_UNKNOWN",
    "SYNC_CONDITION",
    "SYNC_FENCE",
    "SYNC_FLAGS",
    "SYNC_FLUSH_COMMANDS_BIT",
    "SYNC_GPU_COMMANDS_COMPLETE",
    "SYNC_STATUS",
    "SYNTAX_ERR",
    "SavedPages",
    "Scheduler",
    "Scheduling",
    "Screen",
    "ScreenDetailed",
    "ScreenDetails",
    "ScreenOrientation",
    "Script",
    "ScriptProcessorNode",
    "ScrollAreaEvent",
    "ScrollTimeline",
    "SecurityPolicyViolationEvent",
    "Segmenter",
    "Selection",
    "Sensor",
    "SensorErrorEvent",
    "Serial",
    "SerialPort",
    "ServiceWorker",
    "ServiceWorkerContainer",
    "ServiceWorkerRegistration",
    "SessionDescription",
    "Set",
    "ShadowRoot",
    "SharedArrayBuffer",
    "SharedStorage",
    "SharedStorageWorklet",
    "SharedWorker",
    "SimpleGestureEvent",
    "SourceBuffer",
    "SourceBufferList",
    "SpeechSynthesis",
    "SpeechSynthesisErrorEvent",
    "SpeechSynthesisEvent",
    "SpeechSynthesisUtterance",
    "SpeechSynthesisVoice",
    "StaticRange",
    "StereoPannerNode",
    "StopIteration",
    "Storage",
    "StorageBucket",
    "StorageBucketManager",
    "StorageEvent",
    "StorageManager",
    "String",
    "StructType",
    "StylePropertyMap",
    "StylePropertyMapReadOnly",
    "StyleSheet",
    "StyleSheetList",
    "SubmitEvent",
    "SubtleCrypto",
    "Symbol",
    "SyncManager",
    "SyntaxError",
    "TEMPORARY",
    "TEXTPATH_METHODTYPE_ALIGN",
    "TEXTPATH_METHODTYPE_STRETCH",
    "TEXTPATH_METHODTYPE_UNKNOWN",
    "TEXTPATH_SPACINGTYPE_AUTO",
    "TEXTPATH_SPACINGTYPE_EXACT",
    "TEXTPATH_SPACINGTYPE_UNKNOWN",
    "TEXTURE",
    "TEXTURE0",
    "TEXTURE1",
    "TEXTURE10",
    "TEXTURE11",
    "TEXTURE12",
    "TEXTURE13",
    "TEXTURE14",
    "TEXTURE15",
    "TEXTURE16",
    "TEXTURE17",
    "TEXTURE18",
    "TEXTURE19",
    "TEXTURE2",
    "TEXTURE20",
    "TEXTURE21",
    "TEXTURE22",
    "TEXTURE23",
    "TEXTURE24",
    "TEXTURE25",
    "TEXTURE26",
    "TEXTURE27",
    "TEXTURE28",
    "TEXTURE29",
    "TEXTURE3",
    "TEXTURE30",
    "TEXTURE31",
    "TEXTURE4",
    "TEXTURE5",
    "TEXTURE6",
    "TEXTURE7",
    "TEXTURE8",
    "TEXTURE9",
    "TEXTURE_2D",
    "TEXTURE_2D_ARRAY",
    "TEXTURE_3D",
    "TEXTURE_BASE_LEVEL",
    "TEXTURE_BINDING",
    "TEXTURE_BINDING_2D",
    "TEXTURE_BINDING_2D_ARRAY",
    "TEXTURE_BINDING_3D",
    "TEXTURE_BINDING_CUBE_MAP",
    "TEXTURE_COMPARE_FUNC",
    "TEXTURE_COMPARE_MODE",
    "TEXTURE_CUBE_MAP",
    "TEXTURE_CUBE_MAP_NEGATIVE_X",
    "TEXTURE_CUBE_MAP_NEGATIVE_Y",
    "TEXTURE_CUBE_MAP_NEGATIVE_Z",
    "TEXTURE_CUBE_MAP_POSITIVE_X",
    "TEXTURE_CUBE_MAP_POSITIVE_Y",
    "TEXTURE_CUBE_MAP_POSITIVE_Z",
    "TEXTURE_IMMUTABLE_FORMAT",
    "TEXTURE_IMMUTABLE_LEVELS",
    "TEXTURE_MAG_FILTER",
    "TEXTURE_MAX_ANISOTROPY_EXT",
    "TEXTURE_MAX_LEVEL",
    "TEXTURE_MAX_LOD",
    "TEXTURE_MIN_FILTER",
    "TEXTURE_MIN_LOD",
    "TEXTURE_WRAP_R",
    "TEXTURE_WRAP_S",
    "TEXTURE_WRAP_T",
    "TEXT_NODE",
    "TIMEOUT",
    "TIMEOUT_ERR",
    "TIMEOUT_EXPIRED",
    "TIMEOUT_IGNORED",
    "TOO_LARGE_ERR",
    "TRANSACTION_INACTIVE_ERR",
    "TRANSFORM_FEEDBACK",
    "TRANSFORM_FEEDBACK_ACTIVE",
    "TRANSFORM_FEEDBACK_BINDING",
    "TRANSFORM_FEEDBACK_BUFFER",
    "TRANSFORM_FEEDBACK_BUFFER_BINDING",
    "TRANSFORM_FEEDBACK_BUFFER_MODE",
    "TRANSFORM_FEEDBACK_BUFFER_SIZE",
    "TRANSFORM_FEEDBACK_BUFFER_START",
    "TRANSFORM_FEEDBACK_PAUSED",
    "TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN",
    "TRANSFORM_FEEDBACK_VARYINGS",
    "TRIANGLE",
    "TRIANGLES",
    "TRIANGLE_FAN",
    "TRIANGLE_STRIP",
    "TYPE_BACK_FORWARD",
    "TYPE_ERR",
    "TYPE_MISMATCH_ERR",
    "TYPE_NAVIGATE",
    "TYPE_RELOAD",
    "TYPE_RESERVED",
    "Table",
    "Tag",
    "TaskAttributionTiming",
    "TaskController",
    "TaskPriorityChangeEvent",
    "TaskSignal",
    "Text",
    "TextDecoder",
    "TextDecoderStream",
    "TextEncoder",
    "TextEncoderStream",
    "TextEvent",
    "TextFormat",
    "TextFormatUpdateEvent",
    "TextMetrics",
    "TextTrack",
    "TextTrackCue",
    "TextTrackCueList",
    "TextTrackList",
    "TextUpdateEvent",
    "TimeEvent",
    "TimeRanges",
    "ToggleEvent",
    "Touch",
    "TouchEvent",
    "TouchList",
    "TrackEvent",
    "TransformStream",
    "TransformStreamDefaultController",
    "TransitionEvent",
    "TreeWalker",
    "TrustedHTML",
    "TrustedScript",
    "TrustedScriptURL",
    "TrustedTypePolicy",
    "TrustedTypePolicyFactory",
    "TypeError",
    "TypedObject",
    "U2F",
    "UIEvent",
    "UNCACHED",
    "UNIFORM",
    "UNIFORM_ARRAY_STRIDE",
    "UNIFORM_BLOCK_ACTIVE_UNIFORMS",
    "UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES",
    "UNIFORM_BLOCK_BINDING",
    "UNIFORM_BLOCK_DATA_SIZE",
    "UNIFORM_BLOCK_INDEX",
    "UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER",
    "UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER",
    "UNIFORM_BUFFER",
    "UNIFORM_BUFFER_BINDING",
    "UNIFORM_BUFFER_OFFSET_ALIGNMENT",
    "UNIFORM_BUFFER_SIZE",
    "UNIFORM_BUFFER_START",
    "UNIFORM_IS_ROW_MAJOR",
    "UNIFORM_MATRIX_STRIDE",
    "UNIFORM_OFFSET",
    "UNIFORM_SIZE",
    "UNIFORM_TYPE",
    "UNKNOWN_ERR",
    "UNKNOWN_RULE",
    "UNMASKED_RENDERER_WEBGL",
    "UNMASKED_VENDOR_WEBGL",
    "UNORDERED_NODE_ITERATOR_TYPE",
    "UNORDERED_NODE_SNAPSHOT_TYPE",
    "UNPACK_ALIGNMENT",
    "UNPACK_COLORSPACE_CONVERSION_WEBGL",
    "UNPACK_FLIP_Y_WEBGL",
    "UNPACK_IMAGE_HEIGHT",
    "UNPACK_PREMULTIPLY_ALPHA_WEBGL",
    "UNPACK_ROW_LENGTH",
    "UNPACK_SKIP_IMAGES",
    "UNPACK_SKIP_PIXELS",
    "UNPACK_SKIP_ROWS",
    "UNSCHEDULED_STATE",
    "UNSENT",
    "UNSIGNALED",
    "UNSIGNED_BYTE",
    "UNSIGNED_INT",
    "UNSIGNED_INT_10F_11F_11F_REV",
    "UNSIGNED_INT_24_8",
    "UNSIGNED_INT_2_10_10_10_REV",
    "UNSIGNED_INT_5_9_9_9_REV",
    "UNSIGNED_INT_SAMPLER_2D",
    "UNSIGNED_INT_SAMPLER_2D_ARRAY",
    "UNSIGNED_INT_SAMPLER_3D",
    "UNSIGNED_INT_SAMPLER_CUBE",
    "UNSIGNED_INT_VEC2",
    "UNSIGNED_INT_VEC3",
    "UNSIGNED_INT_VEC4",
    "UNSIGNED_NORMALIZED",
    "UNSIGNED_SHORT",
    "UNSIGNED_SHORT_4_4_4_4",
    "UNSIGNED_SHORT_5_5_5_1",
    "UNSIGNED_SHORT_5_6_5",
    "UNSPECIFIED_EVENT_TYPE_ERR",
    "UPDATEREADY",
    "URIError",
    "URL",
    "URLPattern",
    "URLSearchParams",
    "URLUnencoded",
    "URL_MISMATCH_ERR",
    "USB",
    "USBAlternateInterface",
    "USBConfiguration",
    "USBConnectionEvent",
    "USBDevice",
    "USBEndpoint",
    "USBInTransferResult",
    "USBInterface",
    "USBIsochronousInTransferPacket",
    "USBIsochronousInTransferResult",
    "USBIsochronousOutTransferPacket",
    "USBIsochronousOutTransferResult",
    "USBOutTransferResult",
    "UTC",
    "Uint16Array",
    "Uint32Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "UserActivation",
    "UserMessageHandler",
    "UserMessageHandlersNamespace",
    "UserProximityEvent",
    "VALIDATE_STATUS",
    "VALIDATION_ERR",
    "VARIABLES_RULE",
    "VENDOR",
    "VERSION",
    "VERSION_CHANGE",
    "VERSION_ERR",
    "VERTEX",
    "VERTEX_ARRAY_BINDING",
    "VERTEX_ATTRIB_ARRAY_BUFFER_BINDING",
    "VERTEX_ATTRIB_ARRAY_DIVISOR",
    "VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE",
    "VERTEX_ATTRIB_ARRAY_ENABLED",
    "VERTEX_ATTRIB_ARRAY_INTEGER",
    "VERTEX_ATTRIB_ARRAY_NORMALIZED",
    "VERTEX_ATTRIB_ARRAY_POINTER",
    "VERTEX_ATTRIB_ARRAY_SIZE",
    "VERTEX_ATTRIB_ARRAY_STRIDE",
    "VERTEX_ATTRIB_ARRAY_TYPE",
    "VERTEX_SHADER",
    "VERTICAL",
    "VERTICAL_AXIS",
    "VER_ERR",
    "VIEWPORT",
    "VIEWPORT_RULE",
    "VRDisplay",
    "VRDisplayCapabilities",
    "VRDisplayEvent",
    "VREyeParameters",
    "VRFieldOfView",
    "VRFrameData",
    "VRPose",
    "VRStageParameters",
    "VTTCue",
    "VTTRegion",
    "ValidityState",
    "VideoColorSpace",
    "VideoDecoder",
    "VideoEncoder",
    "VideoFrame",
    "VideoPlaybackQuality",
    "VideoStreamTrack",
    "ViewTimeline",
    "ViewTransition",
    "VirtualKeyboard",
    "VirtualKeyboardGeometryChangeEvent",
    "VisibilityStateEntry",
    "VisualViewport",
    "WAIT_FAILED",
    "WEBKIT_FILTER_RULE",
    "WEBKIT_KEYFRAMES_RULE",
    "WEBKIT_KEYFRAME_RULE",
    "WEBKIT_REGION_RULE",
    "WGSLLanguageFeatures",
    "WRITE",
    "WRONG_DOCUMENT_ERR",
    "WakeLock",
    "WakeLockSentinel",
    "WasmAnyRef",
    "WaveShaperNode",
    "WeakMap",
    "WeakRef",
    "WeakSet",
    "WebAssembly",
    "WebGL2RenderingContext",
    "WebGLActiveInfo",
    "WebGLBuffer",
    "WebGLContextEvent",
    "WebGLFramebuffer",
    "WebGLProgram",
    "WebGLQuery",
    "WebGLRenderbuffer",
    "WebGLRenderingContext",
    "WebGLSampler",
    "WebGLShader",
    "WebGLShaderPrecisionFormat",
    "WebGLSync",
    "WebGLTexture",
    "WebGLTransformFeedback",
    "WebGLUniformLocation",
    "WebGLVertexArray",
    "WebGLVertexArrayObject",
    "WebKitAnimationEvent",
    "WebKitBlobBuilder",
    "WebKitCSSFilterRule",
    "WebKitCSSFilterValue",
    "WebKitCSSKeyframeRule",
    "WebKitCSSKeyframesRule",
    "WebKitCSSMatrix",
    "WebKitCSSRegionRule",
    "WebKitCSSTransformValue",
    "WebKitDataCue",
    "WebKitGamepad",
    "WebKitMediaKeyError",
    "WebKitMediaKeyMessageEvent",
    "WebKitMediaKeySession",
    "WebKitMediaKeys",
    "WebKitMediaSource",
    "WebKitMutationObserver",
    "WebKitNamespace",
    "WebKitPlaybackTargetAvailabilityEvent",
    "WebKitPoint",
    "WebKitShadowRoot",
    "WebKitSourceBuffer",
    "WebKitSourceBufferList",
    "WebKitTransitionEvent",
    "WebSocket",
    "WebSocketError",
    "WebSocketStream",
    "WebTransport",
    "WebTransportBidirectionalStream",
    "WebTransportDatagramDuplexStream",
    "WebTransportError",
    "WebTransportReceiveStream",
    "WebTransportSendStream",
    "WebkitAlignContent",
    "WebkitAlignItems",
    "WebkitAlignSelf",
    "WebkitAnimation",
    "WebkitAnimationDelay",
    "WebkitAnimationDirection",
    "WebkitAnimationDuration",
    "WebkitAnimationFillMode",
    "WebkitAnimationIterationCount",
    "WebkitAnimationName",
    "WebkitAnimationPlayState",
    "WebkitAnimationTimingFunction",
    "WebkitAppearance",
    "WebkitBackfaceVisibility",
    "WebkitBackgroundClip",
    "WebkitBackgroundOrigin",
    "WebkitBackgroundSize",
    "WebkitBorderBottomLeftRadius",
    "WebkitBorderBottomRightRadius",
    "WebkitBorderImage",
    "WebkitBorderRadius",
    "WebkitBorderTopLeftRadius",
    "WebkitBorderTopRightRadius",
    "WebkitBoxAlign",
    "WebkitBoxDirection",
    "WebkitBoxFlex",
    "WebkitBoxOrdinalGroup",
    "WebkitBoxOrient",
    "WebkitBoxPack",
    "WebkitBoxShadow",
    "WebkitBoxSizing",
    "WebkitClipPath",
    "WebkitFilter",
    "WebkitFlex",
    "WebkitFlexBasis",
    "WebkitFlexDirection",
    "WebkitFlexFlow",
    "WebkitFlexGrow",
    "WebkitFlexShrink",
    "WebkitFlexWrap",
    "WebkitJustifyContent",
    "WebkitLineClamp",
    "WebkitMask",
    "WebkitMaskClip",
    "WebkitMaskComposite",
    "WebkitMaskImage",
    "WebkitMaskOrigin",
    "WebkitMaskPosition",
    "WebkitMaskPositionX",
    "WebkitMaskPositionY",
    "WebkitMaskRepeat",
    "WebkitMaskSize",
    "WebkitOrder",
    "WebkitPerspective",
    "WebkitPerspectiveOrigin",
    "WebkitTextFillColor",
    "WebkitTextSecurity",
    "WebkitTextSizeAdjust",
    "WebkitTextStroke",
    "WebkitTextStrokeColor",
    "WebkitTextStrokeWidth",
    "WebkitTransform",
    "WebkitTransformOrigin",
    "WebkitTransformStyle",
    "WebkitTransition",
    "WebkitTransitionDelay",
    "WebkitTransitionDuration",
    "WebkitTransitionProperty",
    "WebkitTransitionTimingFunction",
    "WebkitUserSelect",
    "WheelEvent",
    "Window",
    "WindowControlsOverlay",
    "WindowControlsOverlayGeometryChangeEvent",
    "Worker",
    "Worklet",
    "WritableStream",
    "WritableStreamDefaultController",
    "WritableStreamDefaultWriter",
    "XMLDocument",
    "XMLHttpRequest",
    "XMLHttpRequestEventTarget",
    "XMLHttpRequestException",
    "XMLHttpRequestProgressEvent",
    "XMLHttpRequestUpload",
    "XMLSerializer",
    "XMLStylesheetProcessingInstruction",
    "XPathEvaluator",
    "XPathException",
    "XPathExpression",
    "XPathNSResolver",
    "XPathResult",
    "XRAnchor",
    "XRAnchorSet",
    "XRBoundedReferenceSpace",
    "XRCPUDepthInformation",
    "XRCamera",
    "XRDOMOverlayState",
    "XRDepthInformation",
    "XRFrame",
    "XRHitTestResult",
    "XRHitTestSource",
    "XRInputSource",
    "XRInputSourceArray",
    "XRInputSourceEvent",
    "XRInputSourcesChangeEvent",
    "XRLayer",
    "XRLightEstimate",
    "XRLightProbe",
    "XRPose",
    "XRRay",
    "XRReferenceSpace",
    "XRReferenceSpaceEvent",
    "XRRenderState",
    "XRRigidTransform",
    "XRSession",
    "XRSessionEvent",
    "XRSpace",
    "XRSystem",
    "XRTransientInputHitTestResult",
    "XRTransientInputHitTestSource",
    "XRView",
    "XRViewerPose",
    "XRViewport",
    "XRWebGLBinding",
    "XRWebGLDepthInformation",
    "XRWebGLLayer",
    "XSLTProcessor",
    "ZERO",
    "_XD0M_",
    "_YD0M_",
    "__REACT_DEVTOOLS_GLOBAL_HOOK__",
    "__brand",
    "__defineGetter__",
    "__defineSetter__",
    "__lookupGetter__",
    "__lookupSetter__",
    "__opera",
    "__proto__",
    "_browserjsran",
    "a",
    "aLink",
    "abbr",
    "abort",
    "aborted",
    "abs",
    "absolute",
    "acceleration",
    "accelerationIncludingGravity",
    "accelerator",
    "accent-color",
    "accentColor",
    "accept",
    "acceptCharset",
    "acceptNode",
    "access",
    "accessKey",
    "accessKeyLabel",
    "accuracy",
    "acos",
    "acosh",
    "action",
    "actionURL",
    "actions",
    "activated",
    "activation",
    "activationStart",
    "active",
    "activeCues",
    "activeElement",
    "activeSourceBuffers",
    "activeSourceCount",
    "activeTexture",
    "activeVRDisplays",
    "actualBoundingBoxAscent",
    "actualBoundingBoxDescent",
    "actualBoundingBoxLeft",
    "actualBoundingBoxRight",
    "adAuctionComponents",
    "adAuctionHeaders",
    "add",
    "addAll",
    "addBehavior",
    "addCandidate",
    "addColorStop",
    "addCue",
    "addElement",
    "addEventListener",
    "addFilter",
    "addFromString",
    "addFromUri",
    "addIceCandidate",
    "addImport",
    "addListener",
    "addModule",
    "addNamed",
    "addPageRule",
    "addPath",
    "addPointer",
    "addRange",
    "addRegion",
    "addRule",
    "addSearchEngine",
    "addSourceBuffer",
    "addStream",
    "addTextTrack",
    "addTrack",
    "addTransceiver",
    "addWakeLockListener",
    "added",
    "addedNodes",
    "additionalName",
    "additiveSymbols",
    "addons",
    "address",
    "addressLine",
    "addressModeU",
    "addressModeV",
    "addressModeW",
    "adoptNode",
    "adoptedCallback",
    "adoptedStyleSheets",
    "adr",
    "advance",
    "after",
    "album",
    "alert",
    "algorithm",
    "align",
    "align-content",
    "align-items",
    "align-self",
    "alignContent",
    "alignItems",
    "alignSelf",
    "alignmentBaseline",
    "alinkColor",
    "all",
    "allSettled",
    "allocationSize",
    "allow",
    "allowFullscreen",
    "allowPaymentRequest",
    "allowedDirections",
    "allowedFeatures",
    "allowedToPlay",
    "allowsFeature",
    "alpha",
    "alphaMode",
    "alphaToCoverageEnabled",
    "alphabeticBaseline",
    "alt",
    "altGraphKey",
    "altHtml",
    "altKey",
    "altLeft",
    "alternate",
    "alternateSetting",
    "alternates",
    "altitude",
    "altitudeAccuracy",
    "altitudeAngle",
    "amplitude",
    "ancestorOrigins",
    "anchor",
    "anchorNode",
    "anchorOffset",
    "anchorSpace",
    "anchors",
    "and",
    "angle",
    "angularAcceleration",
    "angularVelocity",
    "animVal",
    "animate",
    "animated",
    "animatedInstanceRoot",
    "animatedNormalizedPathSegList",
    "animatedPathSegList",
    "animatedPoints",
    "animation",
    "animation-composition",
    "animation-delay",
    "animation-direction",
    "animation-duration",
    "animation-fill-mode",
    "animation-iteration-count",
    "animation-name",
    "animation-play-state",
    "animation-timing-function",
    "animationComposition",
    "animationDelay",
    "animationDirection",
    "animationDuration",
    "animationFillMode",
    "animationIterationCount",
    "animationName",
    "animationPlayState",
    "animationStartTime",
    "animationTimingFunction",
    "animationsPaused",
    "anniversary",
    "antialias",
    "anticipatedRemoval",
    "any",
    "app",
    "appCodeName",
    "appMinorVersion",
    "appName",
    "appNotifications",
    "appVersion",
    "appearance",
    "append",
    "appendBuffer",
    "appendChild",
    "appendData",
    "appendItem",
    "appendMedium",
    "appendNamed",
    "appendRule",
    "appendStream",
    "appendWindowEnd",
    "appendWindowStart",
    "applets",
    "applicationCache",
    "applicationServerKey",
    "apply",
    "applyConstraints",
    "applyElement",
    "arc",
    "arcTo",
    "architecture",
    "archive",
    "areas",
    "arguments",
    "ariaAtomic",
    "ariaAutoComplete",
    "ariaBrailleLabel",
    "ariaBrailleRoleDescription",
    "ariaBusy",
    "ariaChecked",
    "ariaColCount",
    "ariaColIndex",
    "ariaColIndexText",
    "ariaColSpan",
    "ariaCurrent",
    "ariaDescription",
    "ariaDisabled",
    "ariaExpanded",
    "ariaHasPopup",
    "ariaHidden",
    "ariaInvalid",
    "ariaKeyShortcuts",
    "ariaLabel",
    "ariaLevel",
    "ariaLive",
    "ariaModal",
    "ariaMultiLine",
    "ariaMultiSelectable",
    "ariaOrientation",
    "ariaPlaceholder",
    "ariaPosInSet",
    "ariaPressed",
    "ariaReadOnly",
    "ariaRelevant",
    "ariaRequired",
    "ariaRoleDescription",
    "ariaRowCount",
    "ariaRowIndex",
    "ariaRowIndexText",
    "ariaRowSpan",
    "ariaSelected",
    "ariaSetSize",
    "ariaSort",
    "ariaValueMax",
    "ariaValueMin",
    "ariaValueNow",
    "ariaValueText",
    "arrayBuffer",
    "arrayLayerCount",
    "arrayStride",
    "artist",
    "artwork",
    "as",
    "asIntN",
    "asUintN",
    "ascentOverride",
    "asin",
    "asinh",
    "aspect",
    "aspect-ratio",
    "aspectRatio",
    "assert",
    "assign",
    "assignedElements",
    "assignedNodes",
    "assignedSlot",
    "async",
    "asyncIterator",
    "at",
    "atEnd",
    "atan",
    "atan2",
    "atanh",
    "atob",
    "attachEvent",
    "attachInternals",
    "attachShader",
    "attachShadow",
    "attachedElements",
    "attachments",
    "attack",
    "attestationObject",
    "attrChange",
    "attrName",
    "attributeChangedCallback",
    "attributeFilter",
    "attributeName",
    "attributeNamespace",
    "attributeOldValue",
    "attributeStyleMap",
    "attributes",
    "attribution",
    "attributionSrc",
    "audioBitrateMode",
    "audioBitsPerSecond",
    "audioTracks",
    "audioWorklet",
    "authenticatedSignedWrites",
    "authenticatorAttachment",
    "authenticatorData",
    "autoIncrement",
    "autobuffer",
    "autocapitalize",
    "autocomplete",
    "autocorrect",
    "autofocus",
    "automationRate",
    "autoplay",
    "availHeight",
    "availLeft",
    "availTop",
    "availWidth",
    "availability",
    "available",
    "aversion",
    "ax",
    "axes",
    "axis",
    "ay",
    "azimuth",
    "azimuthAngle",
    "b",
    "back",
    "backdrop-filter",
    "backdropFilter",
    "backends",
    "backface-visibility",
    "backfaceVisibility",
    "background",
    "background-attachment",
    "background-blend-mode",
    "background-clip",
    "background-color",
    "background-image",
    "background-origin",
    "background-position",
    "background-position-x",
    "background-position-y",
    "background-repeat",
    "background-size",
    "backgroundAttachment",
    "backgroundBlendMode",
    "backgroundClip",
    "backgroundColor",
    "backgroundFetch",
    "backgroundImage",
    "backgroundOrigin",
    "backgroundPosition",
    "backgroundPositionX",
    "backgroundPositionY",
    "backgroundRepeat",
    "backgroundSize",
    "badInput",
    "badge",
    "balance",
    "baseArrayLayer",
    "baseFrequencyX",
    "baseFrequencyY",
    "baseLatency",
    "baseLayer",
    "baseMipLevel",
    "baseNode",
    "baseOffset",
    "basePalette",
    "baseURI",
    "baseVal",
    "baseline-source",
    "baselineShift",
    "baselineSource",
    "battery",
    "bday",
    "before",
    "beginComputePass",
    "beginElement",
    "beginElementAt",
    "beginOcclusionQuery",
    "beginPath",
    "beginQuery",
    "beginRenderPass",
    "beginTransformFeedback",
    "beginningOfPassWriteIndex",
    "behavior",
    "behaviorCookie",
    "behaviorPart",
    "behaviorUrns",
    "beta",
    "bezierCurveTo",
    "bgColor",
    "bgProperties",
    "bias",
    "big",
    "bigint64",
    "biguint64",
    "binaryType",
    "bind",
    "bindAttribLocation",
    "bindBuffer",
    "bindBufferBase",
    "bindBufferRange",
    "bindFramebuffer",
    "bindGroupLayouts",
    "bindRenderbuffer",
    "bindSampler",
    "bindTexture",
    "bindTransformFeedback",
    "bindVertexArray",
    "binding",
    "bitness",
    "blend",
    "blendColor",
    "blendEquation",
    "blendEquationSeparate",
    "blendFunc",
    "blendFuncSeparate",
    "blink",
    "blitFramebuffer",
    "blob",
    "block-size",
    "blockDirection",
    "blockSize",
    "blockedURI",
    "blocking",
    "blockingDuration",
    "blue",
    "bluetooth",
    "blur",
    "body",
    "bodyUsed",
    "bold",
    "bookmarks",
    "booleanValue",
    "border",
    "border-block",
    "border-block-color",
    "border-block-end",
    "border-block-end-color",
    "border-block-end-style",
    "border-block-end-width",
    "border-block-start",
    "border-block-start-color",
    "border-block-start-style",
    "border-block-start-width",
    "border-block-style",
    "border-block-width",
    "border-bottom",
    "border-bottom-color",
    "border-bottom-left-radius",
    "border-bottom-right-radius",
    "border-bottom-style",
    "border-bottom-width",
    "border-collapse",
    "border-color",
    "border-end-end-radius",
    "border-end-start-radius",
    "border-image",
    "border-image-outset",
    "border-image-repeat",
    "border-image-slice",
    "border-image-source",
    "border-image-width",
    "border-inline",
    "border-inline-color",
    "border-inline-end",
    "border-inline-end-color",
    "border-inline-end-style",
    "border-inline-end-width",
    "border-inline-start",
    "border-inline-start-color",
    "border-inline-start-style",
    "border-inline-start-width",
    "border-inline-style",
    "border-inline-width",
    "border-left",
    "border-left-color",
    "border-left-style",
    "border-left-width",
    "border-radius",
    "border-right",
    "border-right-color",
    "border-right-style",
    "border-right-width",
    "border-spacing",
    "border-start-end-radius",
    "border-start-start-radius",
    "border-style",
    "border-top",
    "border-top-color",
    "border-top-left-radius",
    "border-top-right-radius",
    "border-top-style",
    "border-top-width",
    "border-width",
    "borderBlock",
    "borderBlockColor",
    "borderBlockEnd",
    "borderBlockEndColor",
    "borderBlockEndStyle",
    "borderBlockEndWidth",
    "borderBlockStart",
    "borderBlockStartColor",
    "borderBlockStartStyle",
    "borderBlockStartWidth",
    "borderBlockStyle",
    "borderBlockWidth",
    "borderBottom",
    "borderBottomColor",
    "borderBottomLeftRadius",
    "borderBottomRightRadius",
    "borderBottomStyle",
    "borderBottomWidth",
    "borderBoxSize",
    "borderCollapse",
    "borderColor",
    "borderColorDark",
    "borderColorLight",
    "borderEndEndRadius",
    "borderEndStartRadius",
    "borderImage",
    "borderImageOutset",
    "borderImageRepeat",
    "borderImageSlice",
    "borderImageSource",
    "borderImageWidth",
    "borderInline",
    "borderInlineColor",
    "borderInlineEnd",
    "borderInlineEndColor",
    "borderInlineEndStyle",
    "borderInlineEndWidth",
    "borderInlineStart",
    "borderInlineStartColor",
    "borderInlineStartStyle",
    "borderInlineStartWidth",
    "borderInlineStyle",
    "borderInlineWidth",
    "borderLeft",
    "borderLeftColor",
    "borderLeftStyle",
    "borderLeftWidth",
    "borderRadius",
    "borderRight",
    "borderRightColor",
    "borderRightStyle",
    "borderRightWidth",
    "borderSpacing",
    "borderStartEndRadius",
    "borderStartStartRadius",
    "borderStyle",
    "borderTop",
    "borderTopColor",
    "borderTopLeftRadius",
    "borderTopRightRadius",
    "borderTopStyle",
    "borderTopWidth",
    "borderWidth",
    "bottom",
    "bottomMargin",
    "bound",
    "boundElements",
    "boundingClientRect",
    "boundingHeight",
    "boundingLeft",
    "boundingRect",
    "boundingTop",
    "boundingWidth",
    "bounds",
    "boundsGeometry",
    "box-decoration-break",
    "box-shadow",
    "box-sizing",
    "boxDecorationBreak",
    "boxShadow",
    "boxSizing",
    "brand",
    "brands",
    "break-after",
    "break-before",
    "break-inside",
    "breakAfter",
    "breakBefore",
    "breakInside",
    "broadcast",
    "browserLanguage",
    "browsingTopics",
    "btoa",
    "bubbles",
    "buffer",
    "bufferData",
    "bufferDepth",
    "bufferSize",
    "bufferSubData",
    "buffered",
    "bufferedAmount",
    "bufferedAmountLowThreshold",
    "buffers",
    "buildID",
    "buildNumber",
    "button",
    "buttonID",
    "buttons",
    "byobRequest",
    "byteLength",
    "byteOffset",
    "bytesPerRow",
    "bytesWritten",
    "c",
    "cache",
    "caches",
    "call",
    "caller",
    "camera",
    "canBeFormatted",
    "canBeMounted",
    "canBeShared",
    "canConstructInDedicatedWorker",
    "canGoBack",
    "canGoForward",
    "canHaveChildren",
    "canHaveHTML",
    "canInsertDTMF",
    "canIntercept",
    "canLoadAdAuctionFencedFrame",
    "canLoadOpaqueURL",
    "canMakePayment",
    "canParse",
    "canPlayType",
    "canPresent",
    "canShare",
    "canTransition",
    "canTrickleIceCandidates",
    "cancel",
    "cancelAndHoldAtTime",
    "cancelAnimationFrame",
    "cancelBubble",
    "cancelIdleCallback",
    "cancelScheduledValues",
    "cancelVideoFrameCallback",
    "cancelWatchAvailability",
    "cancelable",
    "candidate",
    "canonicalUUID",
    "canvas",
    "cap",
    "capabilities",
    "caption",
    "caption-side",
    "captionSide",
    "capture",
    "captureEvents",
    "captureStackTrace",
    "captureStream",
    "caret-color",
    "caretBidiLevel",
    "caretColor",
    "caretPositionFromPoint",
    "caretRangeFromPoint",
    "cast",
    "catch",
    "category",
    "cbrt",
    "cd",
    "ceil",
    "cellIndex",
    "cellPadding",
    "cellSpacing",
    "cells",
    "ch",
    "chOff",
    "chain",
    "challenge",
    "changeType",
    "changed",
    "changedTouches",
    "channel",
    "channelCount",
    "channelCountMode",
    "channelInterpretation",
    "char",
    "charAt",
    "charCode",
    "charCodeAt",
    "charIndex",
    "charLength",
    "characterBounds",
    "characterBoundsRangeStart",
    "characterData",
    "characterDataOldValue",
    "characterSet",
    "characteristic",
    "charging",
    "chargingTime",
    "charset",
    "check",
    "checkDCE",
    "checkEnclosure",
    "checkFramebufferStatus",
    "checkIntersection",
    "checkValidity",
    "checkVisibility",
    "checked",
    "childElementCount",
    "childList",
    "childNodes",
    "children",
    "chrome",
    "ciphertext",
    "cite",
    "city",
    "claimInterface",
    "claimed",
    "classList",
    "className",
    "classid",
    "clear",
    "clearAppBadge",
    "clearAttributes",
    "clearBuffer",
    "clearBufferfi",
    "clearBufferfv",
    "clearBufferiv",
    "clearBufferuiv",
    "clearColor",
    "clearData",
    "clearDepth",
    "clearHalt",
    "clearImmediate",
    "clearInterval",
    "clearLiveSeekableRange",
    "clearMarks",
    "clearMaxGCPauseAccumulator",
    "clearMeasures",
    "clearOriginJoinedAdInterestGroups",
    "clearParameters",
    "clearRect",
    "clearResourceTimings",
    "clearShadow",
    "clearStencil",
    "clearTimeout",
    "clearValue",
    "clearWatch",
    "click",
    "clickCount",
    "clientDataJSON",
    "clientHeight",
    "clientInformation",
    "clientLeft",
    "clientRect",
    "clientRects",
    "clientTop",
    "clientWaitSync",
    "clientWidth",
    "clientX",
    "clientY",
    "clip",
    "clip-path",
    "clip-rule",
    "clipBottom",
    "clipLeft",
    "clipPath",
    "clipPathUnits",
    "clipRight",
    "clipRule",
    "clipTop",
    "clipboard",
    "clipboardData",
    "clonable",
    "clone",
    "cloneContents",
    "cloneNode",
    "cloneRange",
    "close",
    "closeCode",
    "closePath",
    "closed",
    "closest",
    "clz",
    "clz32",
    "cm",
    "cmp",
    "code",
    "codeBase",
    "codePointAt",
    "codeType",
    "codedHeight",
    "codedRect",
    "codedWidth",
    "colSpan",
    "collapse",
    "collapseToEnd",
    "collapseToStart",
    "collapsed",
    "collect",
    "collections",
    "colno",
    "color",
    "color-adjust",
    "color-interpolation",
    "color-interpolation-filters",
    "color-scheme",
    "colorAdjust",
    "colorAttachments",
    "colorDepth",
    "colorFormats",
    "colorInterpolation",
    "colorInterpolationFilters",
    "colorMask",
    "colorScheme",
    "colorSpace",
    "colorType",
    "cols",
    "column-count",
    "column-fill",
    "column-gap",
    "column-rule",
    "column-rule-color",
    "column-rule-style",
    "column-rule-width",
    "column-span",
    "column-width",
    "columnCount",
    "columnFill",
    "columnGap",
    "columnNumber",
    "columnRule",
    "columnRuleColor",
    "columnRuleStyle",
    "columnRuleWidth",
    "columnSpan",
    "columnWidth",
    "columns",
    "command",
    "commit",
    "commitPreferences",
    "commitStyles",
    "commonAncestorContainer",
    "compact",
    "compare",
    "compareBoundaryPoints",
    "compareDocumentPosition",
    "compareEndPoints",
    "compareExchange",
    "compareNode",
    "comparePoint",
    "compatMode",
    "compatible",
    "compile",
    "compileShader",
    "compileStreaming",
    "complete",
    "completed",
    "component",
    "componentFromPoint",
    "composed",
    "composedPath",
    "composite",
    "compositionEndOffset",
    "compositionStartOffset",
    "compressedTexImage2D",
    "compressedTexImage3D",
    "compressedTexSubImage2D",
    "compressedTexSubImage3D",
    "compute",
    "computedStyleMap",
    "concat",
    "conditionText",
    "coneInnerAngle",
    "coneOuterAngle",
    "coneOuterGain",
    "config",
    "configurable",
    "configuration",
    "configurationName",
    "configurationValue",
    "configurations",
    "configure",
    "confirm",
    "confirmComposition",
    "confirmSiteSpecificTrackingException",
    "confirmWebWideTrackingException",
    "congestionControl",
    "connect",
    "connectEnd",
    "connectShark",
    "connectStart",
    "connected",
    "connectedCallback",
    "connection",
    "connectionList",
    "connectionSpeed",
    "connectionState",
    "connections",
    "console",
    "consolidate",
    "constants",
    "constraint",
    "constrictionActive",
    "construct",
    "constructor",
    "contactID",
    "contain",
    "contain-intrinsic-block-size",
    "contain-intrinsic-height",
    "contain-intrinsic-inline-size",
    "contain-intrinsic-size",
    "contain-intrinsic-width",
    "containIntrinsicBlockSize",
    "containIntrinsicHeight",
    "containIntrinsicInlineSize",
    "containIntrinsicSize",
    "containIntrinsicWidth",
    "container",
    "container-name",
    "container-type",
    "containerId",
    "containerName",
    "containerQuery",
    "containerSrc",
    "containerType",
    "contains",
    "containsNode",
    "content",
    "content-visibility",
    "contentBoxSize",
    "contentDocument",
    "contentEditable",
    "contentHint",
    "contentOverflow",
    "contentRect",
    "contentScriptType",
    "contentStyleType",
    "contentType",
    "contentVisibility",
    "contentWindow",
    "context",
    "contextMenu",
    "contextmenu",
    "continue",
    "continuePrimaryKey",
    "continuous",
    "control",
    "controlTransferIn",
    "controlTransferOut",
    "controller",
    "controls",
    "controlsList",
    "convertPointFromNode",
    "convertQuadFromNode",
    "convertRectFromNode",
    "convertToBlob",
    "convertToSpecifiedUnits",
    "cookie",
    "cookieEnabled",
    "cookieStore",
    "cookies",
    "coords",
    "copyBufferSubData",
    "copyBufferToBuffer",
    "copyBufferToTexture",
    "copyExternalImageToTexture",
    "copyFromChannel",
    "copyTexImage2D",
    "copyTexSubImage2D",
    "copyTexSubImage3D",
    "copyTextureToBuffer",
    "copyTextureToTexture",
    "copyTo",
    "copyToChannel",
    "copyWithin",
    "correspondingElement",
    "correspondingUseElement",
    "corruptedVideoFrames",
    "cos",
    "cosh",
    "count",
    "countReset",
    "counter-increment",
    "counter-reset",
    "counter-set",
    "counterIncrement",
    "counterReset",
    "counterSet",
    "country",
    "cpuClass",
    "cpuSleepAllowed",
    "cqb",
    "cqh",
    "cqi",
    "cqmax",
    "cqmin",
    "cqw",
    "create",
    "createAnalyser",
    "createAnchor",
    "createAnswer",
    "createAttribute",
    "createAttributeNS",
    "createAuctionNonce",
    "createBidirectionalStream",
    "createBindGroup",
    "createBindGroupLayout",
    "createBiquadFilter",
    "createBuffer",
    "createBufferSource",
    "createCDATASection",
    "createCSSStyleSheet",
    "createCaption",
    "createChannelMerger",
    "createChannelSplitter",
    "createCommandEncoder",
    "createComment",
    "createComputePipeline",
    "createComputePipelineAsync",
    "createConicGradient",
    "createConstantSource",
    "createContextualFragment",
    "createControlRange",
    "createConvolver",
    "createDTMFSender",
    "createDataChannel",
    "createDelay",
    "createDelayNode",
    "createDocument",
    "createDocumentFragment",
    "createDocumentType",
    "createDynamicsCompressor",
    "createElement",
    "createElementNS",
    "createEncodedStreams",
    "createEntityReference",
    "createEvent",
    "createEventObject",
    "createExpression",
    "createFramebuffer",
    "createFunction",
    "createGain",
    "createGainNode",
    "createHTML",
    "createHTMLDocument",
    "createIIRFilter",
    "createImageBitmap",
    "createImageData",
    "createIndex",
    "createJavaScriptNode",
    "createLinearGradient",
    "createMediaElementSource",
    "createMediaKeys",
    "createMediaStreamDestination",
    "createMediaStreamSource",
    "createMediaStreamTrackSource",
    "createMutableFile",
    "createNSResolver",
    "createNodeIterator",
    "createNotification",
    "createObjectStore",
    "createObjectURL",
    "createOffer",
    "createOscillator",
    "createPanner",
    "createPattern",
    "createPeriodicWave",
    "createPipelineLayout",
    "createPolicy",
    "createPopup",
    "createProcessingInstruction",
    "createProgram",
    "createQuery",
    "createQuerySet",
    "createRadialGradient",
    "createRange",
    "createRangeCollection",
    "createReader",
    "createRenderBundleEncoder",
    "createRenderPipeline",
    "createRenderPipelineAsync",
    "createRenderbuffer",
    "createSVGAngle",
    "createSVGLength",
    "createSVGMatrix",
    "createSVGNumber",
    "createSVGPathSegArcAbs",
    "createSVGPathSegArcRel",
    "createSVGPathSegClosePath",
    "createSVGPathSegCurvetoCubicAbs",
    "createSVGPathSegCurvetoCubicRel",
    "createSVGPathSegCurvetoCubicSmoothAbs",
    "createSVGPathSegCurvetoCubicSmoothRel",
    "createSVGPathSegCurvetoQuadraticAbs",
    "createSVGPathSegCurvetoQuadraticRel",
    "createSVGPathSegCurvetoQuadraticSmoothAbs",
    "createSVGPathSegCurvetoQuadraticSmoothRel",
    "createSVGPathSegLinetoAbs",
    "createSVGPathSegLinetoHorizontalAbs",
    "createSVGPathSegLinetoHorizontalRel",
    "createSVGPathSegLinetoRel",
    "createSVGPathSegLinetoVerticalAbs",
    "createSVGPathSegLinetoVerticalRel",
    "createSVGPathSegMovetoAbs",
    "createSVGPathSegMovetoRel",
    "createSVGPoint",
    "createSVGRect",
    "createSVGTransform",
    "createSVGTransformFromMatrix",
    "createSampler",
    "createScript",
    "createScriptProcessor",
    "createScriptURL",
    "createSession",
    "createShader",
    "createShaderModule",
    "createShadowRoot",
    "createStereoPanner",
    "createStyleSheet",
    "createTBody",
    "createTFoot",
    "createTHead",
    "createTask",
    "createTextNode",
    "createTextRange",
    "createTexture",
    "createTouch",
    "createTouchList",
    "createTransformFeedback",
    "createTreeWalker",
    "createUnidirectionalStream",
    "createVertexArray",
    "createView",
    "createWaveShaper",
    "createWritable",
    "creationTime",
    "credentialless",
    "credentials",
    "criticalCHRestart",
    "cropTo",
    "crossOrigin",
    "crossOriginIsolated",
    "crypto",
    "csi",
    "csp",
    "cssFloat",
    "cssRules",
    "cssText",
    "cssValueType",
    "ctrlKey",
    "ctrlLeft",
    "cues",
    "cullFace",
    "cullMode",
    "currentDirection",
    "currentEntry",
    "currentLocalDescription",
    "currentNode",
    "currentPage",
    "currentRect",
    "currentRemoteDescription",
    "currentScale",
    "currentScreen",
    "currentScript",
    "currentSrc",
    "currentState",
    "currentStyle",
    "currentTarget",
    "currentTime",
    "currentTranslate",
    "currentView",
    "cursor",
    "curve",
    "customElements",
    "customError",
    "cx",
    "cy",
    "d",
    "data",
    "dataFld",
    "dataFormatAs",
    "dataLoss",
    "dataLossMessage",
    "dataPageSize",
    "dataSrc",
    "dataTransfer",
    "database",
    "databases",
    "datagrams",
    "dataset",
    "dateTime",
    "db",
    "debug",
    "debuggerEnabled",
    "declare",
    "decode",
    "decodeAudioData",
    "decodeQueueSize",
    "decodeURI",
    "decodeURIComponent",
    "decodedBodySize",
    "decoding",
    "decodingInfo",
    "decrypt",
    "default",
    "defaultCharset",
    "defaultChecked",
    "defaultMuted",
    "defaultPlaybackRate",
    "defaultPolicy",
    "defaultPrevented",
    "defaultQueue",
    "defaultRequest",
    "defaultSelected",
    "defaultStatus",
    "defaultURL",
    "defaultValue",
    "defaultView",
    "defaultstatus",
    "defer",
    "define",
    "defineMagicFunction",
    "defineMagicVariable",
    "defineProperties",
    "defineProperty",
    "deg",
    "delay",
    "delayTime",
    "delegatesFocus",
    "delete",
    "deleteBuffer",
    "deleteCaption",
    "deleteCell",
    "deleteContents",
    "deleteData",
    "deleteDatabase",
    "deleteFramebuffer",
    "deleteFromDocument",
    "deleteIndex",
    "deleteMedium",
    "deleteObjectStore",
    "deleteProgram",
    "deleteProperty",
    "deleteQuery",
    "deleteRenderbuffer",
    "deleteRow",
    "deleteRule",
    "deleteSampler",
    "deleteShader",
    "deleteSync",
    "deleteTFoot",
    "deleteTHead",
    "deleteTexture",
    "deleteTransformFeedback",
    "deleteVertexArray",
    "deleted",
    "deliverChangeRecords",
    "deliveredFrames",
    "delivery",
    "deliveryInfo",
    "deliveryStatus",
    "deliveryTimestamp",
    "deliveryType",
    "delta",
    "deltaMode",
    "deltaX",
    "deltaY",
    "deltaZ",
    "dependentLocality",
    "deprecatedReplaceInURN",
    "deprecatedRunAdAuctionEnforcesKAnonymity",
    "deprecatedURNToURL",
    "depthBias",
    "depthBiasClamp",
    "depthBiasSlopeScale",
    "depthClearValue",
    "depthCompare",
    "depthDataFormat",
    "depthFailOp",
    "depthFar",
    "depthFunc",
    "depthLoadOp",
    "depthMask",
    "depthNear",
    "depthOrArrayLayers",
    "depthRange",
    "depthReadOnly",
    "depthStencil",
    "depthStencilAttachment",
    "depthStencilFormat",
    "depthStoreOp",
    "depthUsage",
    "depthWriteEnabled",
    "deref",
    "deriveBits",
    "deriveKey",
    "descentOverride",
    "description",
    "deselectAll",
    "designMode",
    "desiredSize",
    "destination",
    "destinationURL",
    "destroy",
    "detach",
    "detachEvent",
    "detachShader",
    "detached",
    "detail",
    "details",
    "detect",
    "detune",
    "device",
    "deviceClass",
    "deviceId",
    "deviceMemory",
    "devicePixelContentBoxSize",
    "devicePixelRatio",
    "deviceProtocol",
    "deviceSubclass",
    "deviceVersionMajor",
    "deviceVersionMinor",
    "deviceVersionSubminor",
    "deviceXDPI",
    "deviceYDPI",
    "didTimeout",
    "difference",
    "diffuseConstant",
    "digest",
    "dimension",
    "dimensions",
    "dir",
    "dirName",
    "direction",
    "dirxml",
    "disable",
    "disablePictureInPicture",
    "disableRemotePlayback",
    "disableVertexAttribArray",
    "disabled",
    "discardedFrames",
    "dischargingTime",
    "disconnect",
    "disconnectShark",
    "disconnectedCallback",
    "dispatchEvent",
    "dispatchWorkgroups",
    "dispatchWorkgroupsIndirect",
    "display",
    "displayHeight",
    "displayId",
    "displayName",
    "displayWidth",
    "disposition",
    "distanceModel",
    "div",
    "divisor",
    "djsapi",
    "djsproxy",
    "doImport",
    "doNotTrack",
    "doScroll",
    "doctype",
    "document",
    "documentElement",
    "documentMode",
    "documentPictureInPicture",
    "documentURI",
    "dolphin",
    "dolphinGameCenter",
    "dolphininfo",
    "dolphinmeta",
    "domComplete",
    "domContentLoadedEventEnd",
    "domContentLoadedEventStart",
    "domInteractive",
    "domLoading",
    "domOverlayState",
    "domain",
    "domainLookupEnd",
    "domainLookupStart",
    "dominant-baseline",
    "dominantBaseline",
    "done",
    "dopplerFactor",
    "dotAll",
    "downDegrees",
    "downlink",
    "download",
    "downloadRequest",
    "downloadTotal",
    "downloaded",
    "dpcm",
    "dpi",
    "dppx",
    "dragDrop",
    "draggable",
    "draw",
    "drawArrays",
    "drawArraysInstanced",
    "drawArraysInstancedANGLE",
    "drawBuffers",
    "drawCustomFocusRing",
    "drawElements",
    "drawElementsInstanced",
    "drawElementsInstancedANGLE",
    "drawFocusIfNeeded",
    "drawImage",
    "drawImageFromRect",
    "drawIndexed",
    "drawIndexedIndirect",
    "drawIndirect",
    "drawRangeElements",
    "drawSystemFocusRing",
    "drawingBufferColorSpace",
    "drawingBufferFormat",
    "drawingBufferHeight",
    "drawingBufferStorage",
    "drawingBufferWidth",
    "drop",
    "dropEffect",
    "droppedVideoFrames",
    "dropzone",
    "dstFactor",
    "dtmf",
    "dump",
    "dumpProfile",
    "duplicate",
    "durability",
    "duration",
    "dvb",
    "dvh",
    "dvi",
    "dvmax",
    "dvmin",
    "dvname",
    "dvnum",
    "dvw",
    "dx",
    "dy",
    "dynsrc",
    "e",
    "edgeMode",
    "editContext",
    "effect",
    "effectAllowed",
    "effectiveDirective",
    "effectiveType",
    "elapsedTime",
    "element",
    "elementFromPoint",
    "elementTiming",
    "elements",
    "elementsFromPoint",
    "elevation",
    "ellipse",
    "em",
    "emHeightAscent",
    "emHeightDescent",
    "email",
    "embeds",
    "emit",
    "emma",
    "empty",
    "empty-cells",
    "emptyCells",
    "emptyHTML",
    "emptyScript",
    "emulatedPosition",
    "enable",
    "enableBackground",
    "enableDelegations",
    "enableStyleSheetsForSet",
    "enableVertexAttribArray",
    "enabled",
    "enabledFeatures",
    "enabledPlugin",
    "encode",
    "encodeInto",
    "encodeQueueSize",
    "encodeURI",
    "encodeURIComponent",
    "encodedBodySize",
    "encoding",
    "encodingInfo",
    "encrypt",
    "enctype",
    "end",
    "endContainer",
    "endElement",
    "endElementAt",
    "endOcclusionQuery",
    "endOfPassWriteIndex",
    "endOfStream",
    "endOffset",
    "endQuery",
    "endTime",
    "endTransformFeedback",
    "ended",
    "endpoint",
    "endpointNumber",
    "endpoints",
    "endsWith",
    "enqueue",
    "enterKeyHint",
    "entities",
    "entries",
    "entry",
    "entryPoint",
    "entryType",
    "enumerable",
    "enumerate",
    "enumerateDevices",
    "enumerateEditable",
    "environmentBlendMode",
    "equals",
    "error",
    "errorCode",
    "errorDetail",
    "errorText",
    "escape",
    "estimate",
    "eval",
    "evaluate",
    "event",
    "eventCounts",
    "eventPhase",
    "every",
    "ex",
    "exception",
    "exchange",
    "exec",
    "execCommand",
    "execCommandShowHelp",
    "execScript",
    "executeBundles",
    "executionStart",
    "exitFullscreen",
    "exitPictureInPicture",
    "exitPointerLock",
    "exitPresent",
    "exp",
    "expand",
    "expandEntityReferences",
    "expando",
    "expansion",
    "expectedImprovement",
    "expiration",
    "expirationTime",
    "expires",
    "expiryDate",
    "explicitOriginalTarget",
    "expm1",
    "exponent",
    "exponentialRampToValueAtTime",
    "exportKey",
    "exports",
    "extend",
    "extensions",
    "extentNode",
    "extentOffset",
    "external",
    "externalResourcesRequired",
    "externalTexture",
    "extractContents",
    "extractable",
    "eye",
    "f",
    "face",
    "factoryReset",
    "failOp",
    "failureReason",
    "fallback",
    "family",
    "familyName",
    "farthestViewportElement",
    "fastSeek",
    "fatal",
    "featureId",
    "featurePolicy",
    "featureSettings",
    "features",
    "fence",
    "fenceSync",
    "fetch",
    "fetchPriority",
    "fetchStart",
    "fftSize",
    "fgColor",
    "fieldOfView",
    "file",
    "fileCreatedDate",
    "fileHandle",
    "fileModifiedDate",
    "fileName",
    "fileSize",
    "fileUpdatedDate",
    "filename",
    "files",
    "filesystem",
    "fill",
    "fill-opacity",
    "fill-rule",
    "fillLightMode",
    "fillOpacity",
    "fillRect",
    "fillRule",
    "fillStyle",
    "fillText",
    "filter",
    "filterResX",
    "filterResY",
    "filterUnits",
    "filters",
    "finally",
    "find",
    "findIndex",
    "findLast",
    "findLastIndex",
    "findRule",
    "findText",
    "finish",
    "finished",
    "fireEvent",
    "firesTouchEvents",
    "firstChild",
    "firstElementChild",
    "firstInterimResponseStart",
    "firstPage",
    "firstUIEventTimestamp",
    "fixed",
    "flags",
    "flat",
    "flatMap",
    "flex",
    "flex-basis",
    "flex-direction",
    "flex-flow",
    "flex-grow",
    "flex-shrink",
    "flex-wrap",
    "flexBasis",
    "flexDirection",
    "flexFlow",
    "flexGrow",
    "flexShrink",
    "flexWrap",
    "flipX",
    "flipY",
    "float",
    "float32",
    "float64",
    "flood-color",
    "flood-opacity",
    "floodColor",
    "floodOpacity",
    "floor",
    "flush",
    "focus",
    "focusNode",
    "focusOffset",
    "font",
    "font-family",
    "font-feature-settings",
    "font-kerning",
    "font-language-override",
    "font-optical-sizing",
    "font-palette",
    "font-size",
    "font-size-adjust",
    "font-stretch",
    "font-style",
    "font-synthesis",
    "font-synthesis-position",
    "font-synthesis-small-caps",
    "font-synthesis-style",
    "font-synthesis-weight",
    "font-variant",
    "font-variant-alternates",
    "font-variant-caps",
    "font-variant-east-asian",
    "font-variant-ligatures",
    "font-variant-numeric",
    "font-variant-position",
    "font-variation-settings",
    "font-weight",
    "fontBoundingBoxAscent",
    "fontBoundingBoxDescent",
    "fontFamily",
    "fontFeatureSettings",
    "fontKerning",
    "fontLanguageOverride",
    "fontOpticalSizing",
    "fontPalette",
    "fontSize",
    "fontSizeAdjust",
    "fontSmoothingEnabled",
    "fontStretch",
    "fontStyle",
    "fontSynthesis",
    "fontSynthesisPosition",
    "fontSynthesisSmallCaps",
    "fontSynthesisStyle",
    "fontSynthesisWeight",
    "fontVariant",
    "fontVariantAlternates",
    "fontVariantCaps",
    "fontVariantEastAsian",
    "fontVariantLigatures",
    "fontVariantNumeric",
    "fontVariantPosition",
    "fontVariationSettings",
    "fontWeight",
    "fontcolor",
    "fontfaces",
    "fonts",
    "fontsize",
    "for",
    "forEach",
    "force",
    "forceFallbackAdapter",
    "forceRedraw",
    "forced-color-adjust",
    "forcedColorAdjust",
    "forcedStyleAndLayoutDuration",
    "forget",
    "form",
    "formAction",
    "formData",
    "formEnctype",
    "formMethod",
    "formNoValidate",
    "formTarget",
    "format",
    "formatToParts",
    "forms",
    "forward",
    "forwardX",
    "forwardY",
    "forwardZ",
    "foundation",
    "fr",
    "fragment",
    "fragmentDirective",
    "frame",
    "frameBorder",
    "frameCount",
    "frameElement",
    "frameSpacing",
    "framebuffer",
    "framebufferHeight",
    "framebufferRenderbuffer",
    "framebufferTexture2D",
    "framebufferTextureLayer",
    "framebufferWidth",
    "frames",
    "freeSpace",
    "freeze",
    "frequency",
    "frequencyBinCount",
    "from",
    "fromAsync",
    "fromCharCode",
    "fromCodePoint",
    "fromElement",
    "fromEntries",
    "fromFloat32Array",
    "fromFloat64Array",
    "fromMatrix",
    "fromPoint",
    "fromQuad",
    "fromRect",
    "frontFace",
    "fround",
    "fullName",
    "fullPath",
    "fullRange",
    "fullScreen",
    "fullVersionList",
    "fullscreen",
    "fullscreenElement",
    "fullscreenEnabled",
    "fx",
    "fy",
    "g",
    "gain",
    "gamepad",
    "gamma",
    "gap",
    "gatheringState",
    "gatt",
    "genderIdentity",
    "generateCertificate",
    "generateKey",
    "generateMipmap",
    "generateRequest",
    "geolocation",
    "gestureObject",
    "get",
    "getActiveAttrib",
    "getActiveUniform",
    "getActiveUniformBlockName",
    "getActiveUniformBlockParameter",
    "getActiveUniforms",
    "getAdjacentText",
    "getAll",
    "getAllKeys",
    "getAllResponseHeaders",
    "getAllowlistForFeature",
    "getAnimations",
    "getAsFile",
    "getAsFileSystemHandle",
    "getAsString",
    "getAttachedShaders",
    "getAttribLocation",
    "getAttribute",
    "getAttributeNS",
    "getAttributeNames",
    "getAttributeNode",
    "getAttributeNodeNS",
    "getAttributeType",
    "getAudioTracks",
    "getAuthenticatorData",
    "getAutoplayPolicy",
    "getAvailability",
    "getBBox",
    "getBattery",
    "getBigInt64",
    "getBigUint64",
    "getBindGroupLayout",
    "getBlob",
    "getBookmark",
    "getBoundingClientRect",
    "getBounds",
    "getBoxQuads",
    "getBufferParameter",
    "getBufferSubData",
    "getByteFrequencyData",
    "getByteTimeDomainData",
    "getCSSCanvasContext",
    "getCTM",
    "getCameraImage",
    "getCandidateWindowClientRect",
    "getCanonicalLocales",
    "getCapabilities",
    "getCaptureHandle",
    "getChannelData",
    "getCharNumAtPosition",
    "getCharacteristic",
    "getCharacteristics",
    "getClientExtensionResults",
    "getClientRect",
    "getClientRects",
    "getCoalescedEvents",
    "getCompilationInfo",
    "getCompositionAlternatives",
    "getComputedStyle",
    "getComputedTextLength",
    "getComputedTiming",
    "getConfiguration",
    "getConstraints",
    "getContext",
    "getContextAttributes",
    "getContributingSources",
    "getCounterValue",
    "getCueAsHTML",
    "getCueById",
    "getCurrentPosition",
    "getCurrentTexture",
    "getCurrentTime",
    "getData",
    "getDatabaseNames",
    "getDate",
    "getDay",
    "getDefaultComputedStyle",
    "getDepthInMeters",
    "getDepthInformation",
    "getDescriptor",
    "getDescriptors",
    "getDestinationInsertionPoints",
    "getDevices",
    "getDirectory",
    "getDirectoryHandle",
    "getDisplayMedia",
    "getDistributedNodes",
    "getEditable",
    "getElementById",
    "getElementsByClassName",
    "getElementsByName",
    "getElementsByTagName",
    "getElementsByTagNameNS",
    "getEnclosureList",
    "getEndPositionOfChar",
    "getEntries",
    "getEntriesByName",
    "getEntriesByType",
    "getError",
    "getExtension",
    "getExtentOfChar",
    "getEyeParameters",
    "getFeature",
    "getFiberRoots",
    "getFile",
    "getFileHandle",
    "getFiles",
    "getFilesAndDirectories",
    "getFingerprints",
    "getFloat32",
    "getFloat64",
    "getFloatFrequencyData",
    "getFloatTimeDomainData",
    "getFloatValue",
    "getFragDataLocation",
    "getFrameData",
    "getFramebufferAttachmentParameter",
    "getFrequencyResponse",
    "getFullYear",
    "getGamepads",
    "getHeaderExtensionsToNegotiate",
    "getHighEntropyValues",
    "getHitTestResults",
    "getHitTestResultsForTransientInput",
    "getHours",
    "getIdentityAssertion",
    "getIds",
    "getImageData",
    "getIndexedParameter",
    "getInfo",
    "getInnerHTML",
    "getInstalledRelatedApps",
    "getInt16",
    "getInt32",
    "getInt8",
    "getInternalModuleRanges",
    "getInternalformatParameter",
    "getIntersectionList",
    "getItem",
    "getItems",
    "getKey",
    "getKeyframes",
    "getLayers",
    "getLayoutMap",
    "getLightEstimate",
    "getLineDash",
    "getLocalCandidates",
    "getLocalParameters",
    "getLocalStreams",
    "getManagedConfiguration",
    "getMappedRange",
    "getMarks",
    "getMatchedCSSRules",
    "getMaxGCPauseSinceClear",
    "getMeasures",
    "getMetadata",
    "getMilliseconds",
    "getMinutes",
    "getModifierState",
    "getMonth",
    "getName",
    "getNamedItem",
    "getNamedItemNS",
    "getNativeFramebufferScaleFactor",
    "getNegotiatedHeaderExtensions",
    "getNestedConfigs",
    "getNotifications",
    "getNotifier",
    "getNumberOfChars",
    "getOffsetReferenceSpace",
    "getOutputTimestamp",
    "getOverrideHistoryNavigationMode",
    "getOverrideStyle",
    "getOwnPropertyDescriptor",
    "getOwnPropertyDescriptors",
    "getOwnPropertyNames",
    "getOwnPropertySymbols",
    "getParameter",
    "getParameters",
    "getParent",
    "getPathSegAtLength",
    "getPhotoCapabilities",
    "getPhotoSettings",
    "getPointAtLength",
    "getPorts",
    "getPose",
    "getPredictedEvents",
    "getPreference",
    "getPreferenceDefault",
    "getPreferredCanvasFormat",
    "getPresentationAttribute",
    "getPreventDefault",
    "getPrimaryService",
    "getPrimaryServices",
    "getProgramInfoLog",
    "getProgramParameter",
    "getPropertyCSSValue",
    "getPropertyPriority",
    "getPropertyShorthand",
    "getPropertyType",
    "getPropertyValue",
    "getPrototypeOf",
    "getPublicKey",
    "getPublicKeyAlgorithm",
    "getQuery",
    "getQueryParameter",
    "getRGBColorValue",
    "getRandomValues",
    "getRangeAt",
    "getReader",
    "getReceivers",
    "getRectValue",
    "getReflectionCubeMap",
    "getRegistration",
    "getRegistrations",
    "getRemoteCandidates",
    "getRemoteCertificates",
    "getRemoteParameters",
    "getRemoteStreams",
    "getRenderbufferParameter",
    "getResponseHeader",
    "getRoot",
    "getRootNode",
    "getRotationOfChar",
    "getSVGDocument",
    "getSamplerParameter",
    "getScreenCTM",
    "getScreenDetails",
    "getSeconds",
    "getSelectedCandidatePair",
    "getSelection",
    "getSenders",
    "getService",
    "getSetCookie",
    "getSettings",
    "getShaderInfoLog",
    "getShaderParameter",
    "getShaderPrecisionFormat",
    "getShaderSource",
    "getSignals",
    "getSimpleDuration",
    "getSiteIcons",
    "getSources",
    "getSpeculativeParserUrls",
    "getStartPositionOfChar",
    "getStartTime",
    "getState",
    "getStats",
    "getStatusForPolicy",
    "getStorageUpdates",
    "getStreamById",
    "getStringValue",
    "getSubStringLength",
    "getSubscription",
    "getSubscriptions",
    "getSupportedConstraints",
    "getSupportedExtensions",
    "getSupportedFormats",
    "getSyncParameter",
    "getSynchronizationSources",
    "getTags",
    "getTargetRanges",
    "getTexParameter",
    "getTextFormats",
    "getTime",
    "getTimezoneOffset",
    "getTiming",
    "getTitlebarAreaRect",
    "getTotalLength",
    "getTrackById",
    "getTracks",
    "getTransceivers",
    "getTransform",
    "getTransformFeedbackVarying",
    "getTransformToElement",
    "getTransports",
    "getType",
    "getTypeMapping",
    "getUTCDate",
    "getUTCDay",
    "getUTCFullYear",
    "getUTCHours",
    "getUTCMilliseconds",
    "getUTCMinutes",
    "getUTCMonth",
    "getUTCSeconds",
    "getUint16",
    "getUint32",
    "getUint8",
    "getUniform",
    "getUniformBlockIndex",
    "getUniformIndices",
    "getUniformLocation",
    "getUserInfo",
    "getUserMedia",
    "getVRDisplays",
    "getValues",
    "getVarDate",
    "getVariableValue",
    "getVertexAttrib",
    "getVertexAttribOffset",
    "getVideoPlaybackQuality",
    "getVideoTracks",
    "getViewerPose",
    "getViewport",
    "getVoices",
    "getWakeLockState",
    "getWriter",
    "getYear",
    "givenName",
    "global",
    "globalAlpha",
    "globalCompositeOperation",
    "globalPrivacyControl",
    "globalThis",
    "glyphOrientationHorizontal",
    "glyphOrientationVertical",
    "glyphRef",
    "go",
    "gpu",
    "grabFrame",
    "grad",
    "gradientTransform",
    "gradientUnits",
    "grammars",
    "green",
    "grid",
    "grid-area",
    "grid-auto-columns",
    "grid-auto-flow",
    "grid-auto-rows",
    "grid-column",
    "grid-column-end",
    "grid-column-gap",
    "grid-column-start",
    "grid-gap",
    "grid-row",
    "grid-row-end",
    "grid-row-gap",
    "grid-row-start",
    "grid-template",
    "grid-template-areas",
    "grid-template-columns",
    "grid-template-rows",
    "gridArea",
    "gridAutoColumns",
    "gridAutoFlow",
    "gridAutoRows",
    "gridColumn",
    "gridColumnEnd",
    "gridColumnGap",
    "gridColumnStart",
    "gridGap",
    "gridRow",
    "gridRowEnd",
    "gridRowGap",
    "gridRowStart",
    "gridTemplate",
    "gridTemplateAreas",
    "gridTemplateColumns",
    "gridTemplateRows",
    "gripSpace",
    "group",
    "groupBy",
    "groupCollapsed",
    "groupEnd",
    "groupId",
    "groups",
    "hadRecentInput",
    "hand",
    "handedness",
    "hangingBaseline",
    "hapticActuators",
    "hardwareConcurrency",
    "has",
    "hasAttribute",
    "hasAttributeNS",
    "hasAttributes",
    "hasBeenActive",
    "hasChildNodes",
    "hasComposition",
    "hasDynamicOffset",
    "hasEnrolledInstrument",
    "hasExtension",
    "hasExternalDisplay",
    "hasFeature",
    "hasFocus",
    "hasIndices",
    "hasInstance",
    "hasLayout",
    "hasOrientation",
    "hasOwn",
    "hasOwnProperty",
    "hasPointerCapture",
    "hasPosition",
    "hasPrivateToken",
    "hasReading",
    "hasRedemptionRecord",
    "hasRegExpGroups",
    "hasStorageAccess",
    "hasUAVisualTransition",
    "hash",
    "hashChange",
    "head",
    "headers",
    "heading",
    "height",
    "hid",
    "hidden",
    "hide",
    "hideFocus",
    "hidePopover",
    "high",
    "highWaterMark",
    "highlights",
    "hint",
    "hints",
    "history",
    "honorificPrefix",
    "honorificSuffix",
    "horizontalOverflow",
    "host",
    "hostCandidate",
    "hostname",
    "href",
    "hrefTranslate",
    "hreflang",
    "hspace",
    "html5TagCheckInerface",
    "htmlFor",
    "htmlText",
    "httpEquiv",
    "httpRequestStatusCode",
    "hwTimestamp",
    "hyphenate-character",
    "hyphenateCharacter",
    "hyphens",
    "hypot",
    "ic",
    "iccId",
    "iceConnectionState",
    "iceGatheringState",
    "iceTransport",
    "icon",
    "iconURL",
    "id",
    "identifier",
    "identity",
    "ideographicBaseline",
    "idpLoginUrl",
    "ignoreBOM",
    "ignoreCase",
    "ignoreDepthValues",
    "image",
    "image-orientation",
    "image-rendering",
    "imageHeight",
    "imageOrientation",
    "imageRendering",
    "imageSizes",
    "imageSmoothingEnabled",
    "imageSmoothingQuality",
    "imageSrcset",
    "imageWidth",
    "images",
    "ime-mode",
    "imeMode",
    "implementation",
    "importExternalTexture",
    "importKey",
    "importNode",
    "importStylesheet",
    "imports",
    "impp",
    "imul",
    "in",
    "in1",
    "in2",
    "inBandMetadataTrackDispatchType",
    "inRange",
    "includes",
    "incomingBidirectionalStreams",
    "incomingHighWaterMark",
    "incomingMaxAge",
    "incomingUnidirectionalStreams",
    "incremental",
    "indeterminate",
    "index",
    "indexNames",
    "indexOf",
    "indexedDB",
    "indicate",
    "indices",
    "inert",
    "inertiaDestinationX",
    "inertiaDestinationY",
    "info",
    "inherits",
    "init",
    "initAnimationEvent",
    "initBeforeLoadEvent",
    "initClipboardEvent",
    "initCloseEvent",
    "initCommandEvent",
    "initCompositionEvent",
    "initCustomEvent",
    "initData",
    "initDataType",
    "initDeviceMotionEvent",
    "initDeviceOrientationEvent",
    "initDragEvent",
    "initErrorEvent",
    "initEvent",
    "initFocusEvent",
    "initGestureEvent",
    "initHashChangeEvent",
    "initKeyEvent",
    "initKeyboardEvent",
    "initMSManipulationEvent",
    "initMessageEvent",
    "initMouseEvent",
    "initMouseScrollEvent",
    "initMouseWheelEvent",
    "initMutationEvent",
    "initNSMouseEvent",
    "initOverflowEvent",
    "initPageEvent",
    "initPageTransitionEvent",
    "initPointerEvent",
    "initPopStateEvent",
    "initProgressEvent",
    "initScrollAreaEvent",
    "initSimpleGestureEvent",
    "initStorageEvent",
    "initTextEvent",
    "initTimeEvent",
    "initTouchEvent",
    "initTransitionEvent",
    "initUIEvent",
    "initWebKitAnimationEvent",
    "initWebKitTransitionEvent",
    "initWebKitWheelEvent",
    "initWheelEvent",
    "initialTime",
    "initialValue",
    "initialize",
    "initiatorType",
    "inject",
    "ink",
    "inline-size",
    "inlineSize",
    "inlineVerticalFieldOfView",
    "inner",
    "innerHTML",
    "innerHeight",
    "innerText",
    "innerWidth",
    "input",
    "inputBuffer",
    "inputEncoding",
    "inputMethod",
    "inputMode",
    "inputSource",
    "inputSources",
    "inputType",
    "inputs",
    "insertAdjacentElement",
    "insertAdjacentHTML",
    "insertAdjacentText",
    "insertBefore",
    "insertCell",
    "insertDTMF",
    "insertData",
    "insertDebugMarker",
    "insertItemBefore",
    "insertNode",
    "insertRow",
    "insertRule",
    "inset",
    "inset-block",
    "inset-block-end",
    "inset-block-start",
    "inset-inline",
    "inset-inline-end",
    "inset-inline-start",
    "insetBlock",
    "insetBlockEnd",
    "insetBlockStart",
    "insetInline",
    "insetInlineEnd",
    "insetInlineStart",
    "installing",
    "instanceRoot",
    "instantiate",
    "instantiateStreaming",
    "instruments",
    "int16",
    "int32",
    "int8",
    "integrity",
    "interactionId",
    "interactionMode",
    "intercept",
    "interfaceClass",
    "interfaceName",
    "interfaceNumber",
    "interfaceProtocol",
    "interfaceSubclass",
    "interfaces",
    "interimResults",
    "internalSubset",
    "interpretation",
    "intersection",
    "intersectionRatio",
    "intersectionRect",
    "intersectsNode",
    "interval",
    "invalidIteratorState",
    "invalidateFramebuffer",
    "invalidateSubFramebuffer",
    "inverse",
    "invertSelf",
    "invoker",
    "invokerType",
    "is",
    "is2D",
    "isActive",
    "isAlternate",
    "isArray",
    "isAutoSelected",
    "isBingCurrentSearchDefault",
    "isBuffer",
    "isCandidateWindowVisible",
    "isChar",
    "isCollapsed",
    "isComposing",
    "isConcatSpreadable",
    "isConditionalMediationAvailable",
    "isConfigSupported",
    "isConnected",
    "isContentEditable",
    "isContentHandlerRegistered",
    "isContextLost",
    "isDefaultNamespace",
    "isDirectory",
    "isDisabled",
    "isDisjointFrom",
    "isEnabled",
    "isEqual",
    "isEqualNode",
    "isExtended",
    "isExtensible",
    "isExternalCTAP2SecurityKeySupported",
    "isFallbackAdapter",
    "isFile",
    "isFinite",
    "isFirstPersonObserver",
    "isFramebuffer",
    "isFrozen",
    "isGenerator",
    "isHTML",
    "isHistoryNavigation",
    "isId",
    "isIdentity",
    "isInjected",
    "isInputPending",
    "isInteger",
    "isInternal",
    "isIntersecting",
    "isLockFree",
    "isMap",
    "isMultiLine",
    "isNaN",
    "isOpen",
    "isPointInFill",
    "isPointInPath",
    "isPointInRange",
    "isPointInStroke",
    "isPrefAlternate",
    "isPresenting",
    "isPrimary",
    "isProgram",
    "isPropertyImplicit",
    "isProtocolHandlerRegistered",
    "isPrototypeOf",
    "isQuery",
    "isRawJSON",
    "isRenderbuffer",
    "isSafeInteger",
    "isSameEntry",
    "isSameNode",
    "isSampler",
    "isScript",
    "isScriptURL",
    "isSealed",
    "isSecureContext",
    "isSessionSupported",
    "isShader",
    "isSubsetOf",
    "isSupersetOf",
    "isSupported",
    "isSync",
    "isTextEdit",
    "isTexture",
    "isTransformFeedback",
    "isTrusted",
    "isTypeSupported",
    "isUserVerifyingPlatformAuthenticatorAvailable",
    "isVertexArray",
    "isView",
    "isVisible",
    "isWellFormed",
    "isochronousTransferIn",
    "isochronousTransferOut",
    "isolation",
    "italics",
    "item",
    "itemId",
    "itemProp",
    "itemRef",
    "itemScope",
    "itemType",
    "itemValue",
    "items",
    "iterateNext",
    "iterationComposite",
    "iterator",
    "javaEnabled",
    "jitterBufferTarget",
    "jobTitle",
    "join",
    "joinAdInterestGroup",
    "json",
    "justify-content",
    "justify-items",
    "justify-self",
    "justifyContent",
    "justifyItems",
    "justifySelf",
    "k1",
    "k2",
    "k3",
    "k4",
    "kHz",
    "keepalive",
    "kernelMatrix",
    "kernelUnitLengthX",
    "kernelUnitLengthY",
    "kerning",
    "key",
    "keyCode",
    "keyFor",
    "keyIdentifier",
    "keyLightEnabled",
    "keyLocation",
    "keyPath",
    "keyStatuses",
    "keySystem",
    "keyText",
    "keyUsage",
    "keyboard",
    "keys",
    "keytype",
    "kind",
    "knee",
    "label",
    "labels",
    "lang",
    "language",
    "languages",
    "largeArcFlag",
    "lastChild",
    "lastElementChild",
    "lastEventId",
    "lastIndex",
    "lastIndexOf",
    "lastInputTime",
    "lastMatch",
    "lastMessageSubject",
    "lastMessageType",
    "lastModified",
    "lastModifiedDate",
    "lastPage",
    "lastParen",
    "lastState",
    "lastStyleSheetSet",
    "latitude",
    "launchQueue",
    "layerName",
    "layerX",
    "layerY",
    "layout",
    "layoutFlow",
    "layoutGrid",
    "layoutGridChar",
    "layoutGridLine",
    "layoutGridMode",
    "layoutGridType",
    "lbound",
    "leaveAdInterestGroup",
    "left",
    "leftContext",
    "leftDegrees",
    "leftMargin",
    "leftProjectionMatrix",
    "leftViewMatrix",
    "length",
    "lengthAdjust",
    "lengthComputable",
    "letter-spacing",
    "letterSpacing",
    "level",
    "lh",
    "lighting-color",
    "lightingColor",
    "limitingConeAngle",
    "limits",
    "line",
    "line-break",
    "line-height",
    "lineAlign",
    "lineBreak",
    "lineCap",
    "lineDashOffset",
    "lineGapOverride",
    "lineHeight",
    "lineJoin",
    "lineNum",
    "lineNumber",
    "linePos",
    "lineTo",
    "lineWidth",
    "linearAcceleration",
    "linearRampToValueAtTime",
    "linearVelocity",
    "lineno",
    "lines",
    "link",
    "linkColor",
    "linkProgram",
    "links",
    "list",
    "list-style",
    "list-style-image",
    "list-style-position",
    "list-style-type",
    "listStyle",
    "listStyleImage",
    "listStylePosition",
    "listStyleType",
    "listener",
    "listeners",
    "load",
    "loadEventEnd",
    "loadEventStart",
    "loadOp",
    "loadTime",
    "loadTimes",
    "loaded",
    "loading",
    "localDescription",
    "localName",
    "localService",
    "localStorage",
    "locale",
    "localeCompare",
    "location",
    "locationbar",
    "lock",
    "locked",
    "lockedFile",
    "locks",
    "lodMaxClamp",
    "lodMinClamp",
    "log",
    "log10",
    "log1p",
    "log2",
    "logicalXDPI",
    "logicalYDPI",
    "login",
    "loglevel",
    "longDesc",
    "longitude",
    "lookupNamespaceURI",
    "lookupPrefix",
    "loop",
    "loopEnd",
    "loopStart",
    "looping",
    "lost",
    "low",
    "lower",
    "lowerBound",
    "lowerOpen",
    "lowsrc",
    "lvb",
    "lvh",
    "lvi",
    "lvmax",
    "lvmin",
    "lvw",
    "m11",
    "m12",
    "m13",
    "m14",
    "m21",
    "m22",
    "m23",
    "m24",
    "m31",
    "m32",
    "m33",
    "m34",
    "m41",
    "m42",
    "m43",
    "m44",
    "magFilter",
    "makeXRCompatible",
    "managed",
    "manifest",
    "manufacturer",
    "manufacturerName",
    "map",
    "mapAsync",
    "mapState",
    "mappedAtCreation",
    "mapping",
    "margin",
    "margin-block",
    "margin-block-end",
    "margin-block-start",
    "margin-bottom",
    "margin-inline",
    "margin-inline-end",
    "margin-inline-start",
    "margin-left",
    "margin-right",
    "margin-top",
    "marginBlock",
    "marginBlockEnd",
    "marginBlockStart",
    "marginBottom",
    "marginHeight",
    "marginInline",
    "marginInlineEnd",
    "marginInlineStart",
    "marginLeft",
    "marginRight",
    "marginTop",
    "marginWidth",
    "mark",
    "marker",
    "marker-end",
    "marker-mid",
    "marker-offset",
    "marker-start",
    "markerEnd",
    "markerHeight",
    "markerMid",
    "markerOffset",
    "markerStart",
    "markerUnits",
    "markerWidth",
    "marks",
    "mask",
    "mask-clip",
    "mask-composite",
    "mask-image",
    "mask-mode",
    "mask-origin",
    "mask-position",
    "mask-position-x",
    "mask-position-y",
    "mask-repeat",
    "mask-size",
    "mask-type",
    "maskClip",
    "maskComposite",
    "maskContentUnits",
    "maskImage",
    "maskMode",
    "maskOrigin",
    "maskPosition",
    "maskPositionX",
    "maskPositionY",
    "maskRepeat",
    "maskSize",
    "maskType",
    "maskUnits",
    "match",
    "matchAll",
    "matchMedia",
    "matchMedium",
    "matches",
    "math-depth",
    "math-style",
    "mathDepth",
    "mathStyle",
    "matrix",
    "matrixTransform",
    "max",
    "max-block-size",
    "max-height",
    "max-inline-size",
    "max-width",
    "maxActions",
    "maxAlternatives",
    "maxAnisotropy",
    "maxBindGroups",
    "maxBindGroupsPlusVertexBuffers",
    "maxBindingsPerBindGroup",
    "maxBlockSize",
    "maxBufferSize",
    "maxByteLength",
    "maxChannelCount",
    "maxChannels",
    "maxColorAttachmentBytesPerSample",
    "maxColorAttachments",
    "maxComputeInvocationsPerWorkgroup",
    "maxComputeWorkgroupSizeX",
    "maxComputeWorkgroupSizeY",
    "maxComputeWorkgroupSizeZ",
    "maxComputeWorkgroupStorageSize",
    "maxComputeWorkgroupsPerDimension",
    "maxConnectionsPerServer",
    "maxDatagramSize",
    "maxDecibels",
    "maxDistance",
    "maxDrawCount",
    "maxDynamicStorageBuffersPerPipelineLayout",
    "maxDynamicUniformBuffersPerPipelineLayout",
    "maxHeight",
    "maxInlineSize",
    "maxInterStageShaderComponents",
    "maxInterStageShaderVariables",
    "maxLayers",
    "maxLength",
    "maxMessageSize",
    "maxPacketLifeTime",
    "maxRetransmits",
    "maxSampledTexturesPerShaderStage",
    "maxSamplersPerShaderStage",
    "maxStorageBufferBindingSize",
    "maxStorageBuffersPerShaderStage",
    "maxStorageTexturesPerShaderStage",
    "maxTextureArrayLayers",
    "maxTextureDimension1D",
    "maxTextureDimension2D",
    "maxTextureDimension3D",
    "maxTouchPoints",
    "maxUniformBufferBindingSize",
    "maxUniformBuffersPerShaderStage",
    "maxValue",
    "maxVertexAttributes",
    "maxVertexBufferArrayStride",
    "maxVertexBuffers",
    "maxWidth",
    "measure",
    "measureText",
    "media",
    "mediaCapabilities",
    "mediaDevices",
    "mediaElement",
    "mediaGroup",
    "mediaKeys",
    "mediaSession",
    "mediaStream",
    "mediaText",
    "meetOrSlice",
    "memory",
    "menubar",
    "mergeAttributes",
    "message",
    "messageClass",
    "messageHandlers",
    "messageType",
    "messages",
    "metaKey",
    "metadata",
    "method",
    "methodDetails",
    "methodName",
    "mid",
    "mimeType",
    "mimeTypes",
    "min",
    "min-block-size",
    "min-height",
    "min-inline-size",
    "min-width",
    "minBindingSize",
    "minBlockSize",
    "minDecibels",
    "minFilter",
    "minHeight",
    "minInlineSize",
    "minLength",
    "minStorageBufferOffsetAlignment",
    "minUniformBufferOffsetAlignment",
    "minValue",
    "minWidth",
    "mipLevel",
    "mipLevelCount",
    "mipmapFilter",
    "miterLimit",
    "mix-blend-mode",
    "mixBlendMode",
    "mm",
    "mobile",
    "mode",
    "model",
    "modify",
    "module",
    "mount",
    "move",
    "moveBy",
    "moveEnd",
    "moveFirst",
    "moveFocusDown",
    "moveFocusLeft",
    "moveFocusRight",
    "moveFocusUp",
    "moveNext",
    "moveRow",
    "moveStart",
    "moveTo",
    "moveToBookmark",
    "moveToElementText",
    "moveToPoint",
    "movementX",
    "movementY",
    "mozAdd",
    "mozAnimationStartTime",
    "mozAnon",
    "mozApps",
    "mozAudioCaptured",
    "mozAudioChannelType",
    "mozAutoplayEnabled",
    "mozCancelAnimationFrame",
    "mozCancelFullScreen",
    "mozCancelRequestAnimationFrame",
    "mozCaptureStream",
    "mozCaptureStreamUntilEnded",
    "mozClearDataAt",
    "mozContact",
    "mozContacts",
    "mozCreateFileHandle",
    "mozCurrentTransform",
    "mozCurrentTransformInverse",
    "mozCursor",
    "mozDash",
    "mozDashOffset",
    "mozDecodedFrames",
    "mozExitPointerLock",
    "mozFillRule",
    "mozFragmentEnd",
    "mozFrameDelay",
    "mozFullScreen",
    "mozFullScreenElement",
    "mozFullScreenEnabled",
    "mozGetAll",
    "mozGetAllKeys",
    "mozGetAsFile",
    "mozGetDataAt",
    "mozGetMetadata",
    "mozGetUserMedia",
    "mozHasAudio",
    "mozHasItem",
    "mozHidden",
    "mozImageSmoothingEnabled",
    "mozIndexedDB",
    "mozInnerScreenX",
    "mozInnerScreenY",
    "mozInputSource",
    "mozIsTextField",
    "mozItem",
    "mozItemCount",
    "mozItems",
    "mozLength",
    "mozLockOrientation",
    "mozMatchesSelector",
    "mozMovementX",
    "mozMovementY",
    "mozOpaque",
    "mozOrientation",
    "mozPaintCount",
    "mozPaintedFrames",
    "mozParsedFrames",
    "mozPay",
    "mozPointerLockElement",
    "mozPresentedFrames",
    "mozPreservesPitch",
    "mozPressure",
    "mozPrintCallback",
    "mozRTCIceCandidate",
    "mozRTCPeerConnection",
    "mozRTCSessionDescription",
    "mozRemove",
    "mozRequestAnimationFrame",
    "mozRequestFullScreen",
    "mozRequestPointerLock",
    "mozSetDataAt",
    "mozSetImageElement",
    "mozSourceNode",
    "mozSrcObject",
    "mozSystem",
    "mozTCPSocket",
    "mozTextStyle",
    "mozTypesAt",
    "mozUnlockOrientation",
    "mozUserCancelled",
    "mozVisibilityState",
    "ms",
    "msAnimation",
    "msAnimationDelay",
    "msAnimationDirection",
    "msAnimationDuration",
    "msAnimationFillMode",
    "msAnimationIterationCount",
    "msAnimationName",
    "msAnimationPlayState",
    "msAnimationStartTime",
    "msAnimationTimingFunction",
    "msBackfaceVisibility",
    "msBlockProgression",
    "msCSSOMElementFloatMetrics",
    "msCaching",
    "msCachingEnabled",
    "msCancelRequestAnimationFrame",
    "msCapsLockWarningOff",
    "msClearImmediate",
    "msClose",
    "msContentZoomChaining",
    "msContentZoomFactor",
    "msContentZoomLimit",
    "msContentZoomLimitMax",
    "msContentZoomLimitMin",
    "msContentZoomSnap",
    "msContentZoomSnapPoints",
    "msContentZoomSnapType",
    "msContentZooming",
    "msConvertURL",
    "msCrypto",
    "msDoNotTrack",
    "msElementsFromPoint",
    "msElementsFromRect",
    "msExitFullscreen",
    "msExtendedCode",
    "msFillRule",
    "msFirstPaint",
    "msFlex",
    "msFlexAlign",
    "msFlexDirection",
    "msFlexFlow",
    "msFlexItemAlign",
    "msFlexLinePack",
    "msFlexNegative",
    "msFlexOrder",
    "msFlexPack",
    "msFlexPositive",
    "msFlexPreferredSize",
    "msFlexWrap",
    "msFlowFrom",
    "msFlowInto",
    "msFontFeatureSettings",
    "msFullscreenElement",
    "msFullscreenEnabled",
    "msGetInputContext",
    "msGetRegionContent",
    "msGetUntransformedBounds",
    "msGraphicsTrustStatus",
    "msGridColumn",
    "msGridColumnAlign",
    "msGridColumnSpan",
    "msGridColumns",
    "msGridRow",
    "msGridRowAlign",
    "msGridRowSpan",
    "msGridRows",
    "msHidden",
    "msHighContrastAdjust",
    "msHyphenateLimitChars",
    "msHyphenateLimitLines",
    "msHyphenateLimitZone",
    "msHyphens",
    "msImageSmoothingEnabled",
    "msImeAlign",
    "msIndexedDB",
    "msInterpolationMode",
    "msIsStaticHTML",
    "msKeySystem",
    "msKeys",
    "msLaunchUri",
    "msLockOrientation",
    "msManipulationViewsEnabled",
    "msMatchMedia",
    "msMatchesSelector",
    "msMaxTouchPoints",
    "msOrientation",
    "msOverflowStyle",
    "msPerspective",
    "msPerspectiveOrigin",
    "msPlayToDisabled",
    "msPlayToPreferredSourceUri",
    "msPlayToPrimary",
    "msPointerEnabled",
    "msRegionOverflow",
    "msReleasePointerCapture",
    "msRequestAnimationFrame",
    "msRequestFullscreen",
    "msSaveBlob",
    "msSaveOrOpenBlob",
    "msScrollChaining",
    "msScrollLimit",
    "msScrollLimitXMax",
    "msScrollLimitXMin",
    "msScrollLimitYMax",
    "msScrollLimitYMin",
    "msScrollRails",
    "msScrollSnapPointsX",
    "msScrollSnapPointsY",
    "msScrollSnapType",
    "msScrollSnapX",
    "msScrollSnapY",
    "msScrollTranslation",
    "msSetImmediate",
    "msSetMediaKeys",
    "msSetPointerCapture",
    "msTextCombineHorizontal",
    "msTextSizeAdjust",
    "msToBlob",
    "msTouchAction",
    "msTouchSelect",
    "msTraceAsyncCallbackCompleted",
    "msTraceAsyncCallbackStarting",
    "msTraceAsyncOperationCompleted",
    "msTraceAsyncOperationStarting",
    "msTransform",
    "msTransformOrigin",
    "msTransformStyle",
    "msTransition",
    "msTransitionDelay",
    "msTransitionDuration",
    "msTransitionProperty",
    "msTransitionTimingFunction",
    "msUnlockOrientation",
    "msUpdateAsyncCallbackRelation",
    "msUserSelect",
    "msVisibilityState",
    "msWrapFlow",
    "msWrapMargin",
    "msWrapThrough",
    "msWriteProfilerMark",
    "msZoom",
    "msZoomTo",
    "mt",
    "mul",
    "multiEntry",
    "multiSelectionObj",
    "multiline",
    "multiple",
    "multiply",
    "multiplySelf",
    "multisample",
    "multisampled",
    "mutableFile",
    "muted",
    "n",
    "name",
    "nameList",
    "nameProp",
    "namedItem",
    "namedRecordset",
    "names",
    "namespaceURI",
    "namespaces",
    "nativeMap",
    "nativeObjectCreate",
    "nativeSet",
    "nativeWeakMap",
    "naturalHeight",
    "naturalWidth",
    "navigate",
    "navigation",
    "navigationMode",
    "navigationPreload",
    "navigationStart",
    "navigationType",
    "navigator",
    "near",
    "nearestViewportElement",
    "negative",
    "negotiated",
    "netscape",
    "networkState",
    "newScale",
    "newState",
    "newTranslate",
    "newURL",
    "newValue",
    "newValueSpecifiedUnits",
    "newVersion",
    "newhome",
    "next",
    "nextElementSibling",
    "nextHopProtocol",
    "nextNode",
    "nextPage",
    "nextSibling",
    "nickname",
    "noHref",
    "noModule",
    "noResize",
    "noShade",
    "noValidate",
    "noWrap",
    "node",
    "nodeName",
    "nodeType",
    "nodeValue",
    "nonce",
    "normDepthBufferFromNormView",
    "normalize",
    "normalizedPathSegList",
    "notRestoredReasons",
    "notationName",
    "notations",
    "note",
    "noteGrainOn",
    "noteOff",
    "noteOn",
    "notify",
    "now",
    "numOctaves",
    "number",
    "numberOfChannels",
    "numberOfFrames",
    "numberOfInputs",
    "numberOfItems",
    "numberOfOutputs",
    "numberValue",
    "oMatchesSelector",
    "object",
    "object-fit",
    "object-position",
    "objectFit",
    "objectPosition",
    "objectStore",
    "objectStoreNames",
    "objectType",
    "observe",
    "occlusionQuerySet",
    "of",
    "off",
    "offscreenBuffering",
    "offset",
    "offset-anchor",
    "offset-distance",
    "offset-path",
    "offset-position",
    "offset-rotate",
    "offsetAnchor",
    "offsetDistance",
    "offsetHeight",
    "offsetLeft",
    "offsetNode",
    "offsetParent",
    "offsetPath",
    "offsetPosition",
    "offsetRotate",
    "offsetTop",
    "offsetWidth",
    "offsetX",
    "offsetY",
    "ok",
    "oldState",
    "oldURL",
    "oldValue",
    "oldVersion",
    "olderShadowRoot",
    "on",
    "onCommitFiberRoot",
    "onCommitFiberUnmount",
    "onLine",
    "onPostCommitFiberRoot",
    "onSubmittedWorkDone",
    "onabort",
    "onabsolutedeviceorientation",
    "onactivate",
    "onactive",
    "onaddsourcebuffer",
    "onaddstream",
    "onaddtrack",
    "onafterprint",
    "onafterscriptexecute",
    "onafterupdate",
    "onanimationcancel",
    "onanimationend",
    "onanimationiteration",
    "onanimationstart",
    "onappinstalled",
    "onaudioend",
    "onaudioprocess",
    "onaudiostart",
    "onautocomplete",
    "onautocompleteerror",
    "onauxclick",
    "onbeforeactivate",
    "onbeforecopy",
    "onbeforecut",
    "onbeforedeactivate",
    "onbeforeeditfocus",
    "onbeforeinput",
    "onbeforeinstallprompt",
    "onbeforematch",
    "onbeforepaste",
    "onbeforeprint",
    "onbeforescriptexecute",
    "onbeforetoggle",
    "onbeforeunload",
    "onbeforeupdate",
    "onbeforexrselect",
    "onbegin",
    "onblocked",
    "onblur",
    "onbounce",
    "onboundary",
    "onbufferedamountlow",
    "oncached",
    "oncancel",
    "oncandidatewindowhide",
    "oncandidatewindowshow",
    "oncandidatewindowupdate",
    "oncanplay",
    "oncanplaythrough",
    "oncapturehandlechange",
    "once",
    "oncellchange",
    "onchange",
    "oncharacterboundsupdate",
    "oncharacteristicvaluechanged",
    "onchargingchange",
    "onchargingtimechange",
    "onchecking",
    "onclick",
    "onclose",
    "onclosing",
    "oncompassneedscalibration",
    "oncomplete",
    "oncompositionend",
    "oncompositionstart",
    "onconnect",
    "onconnecting",
    "onconnectionavailable",
    "onconnectionstatechange",
    "oncontentvisibilityautostatechange",
    "oncontextlost",
    "oncontextmenu",
    "oncontextrestored",
    "oncontrollerchange",
    "oncontrolselect",
    "oncopy",
    "oncuechange",
    "oncurrententrychange",
    "oncurrentscreenchange",
    "oncut",
    "ondataavailable",
    "ondatachannel",
    "ondatasetchanged",
    "ondatasetcomplete",
    "ondblclick",
    "ondeactivate",
    "ondequeue",
    "ondevicechange",
    "ondevicelight",
    "ondevicemotion",
    "ondeviceorientation",
    "ondeviceorientationabsolute",
    "ondeviceproximity",
    "ondischargingtimechange",
    "ondisconnect",
    "ondisplay",
    "ondispose",
    "ondownloading",
    "ondrag",
    "ondragend",
    "ondragenter",
    "ondragexit",
    "ondragleave",
    "ondragover",
    "ondragstart",
    "ondrop",
    "ondurationchange",
    "onemptied",
    "onencrypted",
    "onend",
    "onended",
    "onenter",
    "onenterpictureinpicture",
    "onerror",
    "onerrorupdate",
    "onexit",
    "onfencedtreeclick",
    "onfilterchange",
    "onfinish",
    "onfocus",
    "onfocusin",
    "onfocusout",
    "onformdata",
    "onfreeze",
    "onfullscreenchange",
    "onfullscreenerror",
    "ongamepadconnected",
    "ongamepaddisconnected",
    "ongatheringstatechange",
    "ongattserverdisconnected",
    "ongeometrychange",
    "ongesturechange",
    "ongestureend",
    "ongesturestart",
    "ongotpointercapture",
    "onhashchange",
    "onhelp",
    "onicecandidate",
    "onicecandidateerror",
    "oniceconnectionstatechange",
    "onicegatheringstatechange",
    "oninactive",
    "oninput",
    "oninputreport",
    "oninputsourceschange",
    "oninvalid",
    "onkeydown",
    "onkeypress",
    "onkeystatuseschange",
    "onkeyup",
    "onlanguagechange",
    "onlayoutcomplete",
    "onleavepictureinpicture",
    "onlevelchange",
    "onload",
    "onloadeddata",
    "onloadedmetadata",
    "onloadend",
    "onloading",
    "onloadingdone",
    "onloadingerror",
    "onloadstart",
    "onlosecapture",
    "onlostpointercapture",
    "only",
    "onmanagedconfigurationchange",
    "onmark",
    "onmessage",
    "onmessageerror",
    "onmidimessage",
    "onmousedown",
    "onmouseenter",
    "onmouseleave",
    "onmousemove",
    "onmouseout",
    "onmouseover",
    "onmouseup",
    "onmousewheel",
    "onmove",
    "onmoveend",
    "onmovestart",
    "onmozfullscreenchange",
    "onmozfullscreenerror",
    "onmozorientationchange",
    "onmozpointerlockchange",
    "onmozpointerlockerror",
    "onmscontentzoom",
    "onmsfullscreenchange",
    "onmsfullscreenerror",
    "onmsgesturechange",
    "onmsgesturedoubletap",
    "onmsgestureend",
    "onmsgesturehold",
    "onmsgesturestart",
    "onmsgesturetap",
    "onmsgotpointercapture",
    "onmsinertiastart",
    "onmslostpointercapture",
    "onmsmanipulationstatechanged",
    "onmsneedkey",
    "onmsorientationchange",
    "onmspointercancel",
    "onmspointerdown",
    "onmspointerenter",
    "onmspointerhover",
    "onmspointerleave",
    "onmspointermove",
    "onmspointerout",
    "onmspointerover",
    "onmspointerup",
    "onmssitemodejumplistitemremoved",
    "onmsthumbnailclick",
    "onmute",
    "onnavigate",
    "onnavigateerror",
    "onnavigatesuccess",
    "onnegotiationneeded",
    "onnomatch",
    "onnoupdate",
    "onobsolete",
    "onoffline",
    "ononline",
    "onopen",
    "onorientationchange",
    "onpagechange",
    "onpagehide",
    "onpagereveal",
    "onpageshow",
    "onpageswap",
    "onpaste",
    "onpause",
    "onpayerdetailchange",
    "onpaymentmethodchange",
    "onplay",
    "onplaying",
    "onpluginstreamstart",
    "onpointercancel",
    "onpointerdown",
    "onpointerenter",
    "onpointerleave",
    "onpointerlockchange",
    "onpointerlockerror",
    "onpointermove",
    "onpointerout",
    "onpointerover",
    "onpointerrawupdate",
    "onpointerup",
    "onpopstate",
    "onprerenderingchange",
    "onprioritychange",
    "onprocessorerror",
    "onprogress",
    "onpropertychange",
    "onratechange",
    "onreading",
    "onreadystatechange",
    "onreflectionchange",
    "onrejectionhandled",
    "onrelease",
    "onremove",
    "onremovesourcebuffer",
    "onremovestream",
    "onremovetrack",
    "onrepeat",
    "onreset",
    "onresize",
    "onresizeend",
    "onresizestart",
    "onresourcetimingbufferfull",
    "onresult",
    "onresume",
    "onrowenter",
    "onrowexit",
    "onrowsdelete",
    "onrowsinserted",
    "onscreenschange",
    "onscroll",
    "onscrollend",
    "onsearch",
    "onsecuritypolicyviolation",
    "onseeked",
    "onseeking",
    "onselect",
    "onselectedcandidatepairchange",
    "onselectend",
    "onselectionchange",
    "onselectstart",
    "onshippingaddresschange",
    "onshippingoptionchange",
    "onshow",
    "onsignalingstatechange",
    "onsinkchange",
    "onslotchange",
    "onsoundend",
    "onsoundstart",
    "onsourceclose",
    "onsourceclosed",
    "onsourceended",
    "onsourceopen",
    "onspeechend",
    "onspeechstart",
    "onsqueeze",
    "onsqueezeend",
    "onsqueezestart",
    "onstalled",
    "onstart",
    "onstatechange",
    "onstop",
    "onstorage",
    "onstoragecommit",
    "onsubmit",
    "onsuccess",
    "onsuspend",
    "onterminate",
    "ontextformatupdate",
    "ontextinput",
    "ontextupdate",
    "ontimeout",
    "ontimeupdate",
    "ontoggle",
    "ontonechange",
    "ontouchcancel",
    "ontouchend",
    "ontouchmove",
    "ontouchstart",
    "ontrack",
    "ontransitioncancel",
    "ontransitionend",
    "ontransitionrun",
    "ontransitionstart",
    "onuncapturederror",
    "onunhandledrejection",
    "onunload",
    "onunmute",
    "onupdate",
    "onupdateend",
    "onupdatefound",
    "onupdateready",
    "onupdatestart",
    "onupgradeneeded",
    "onuserproximity",
    "onversionchange",
    "onvisibilitychange",
    "onvoiceschanged",
    "onvolumechange",
    "onvrdisplayactivate",
    "onvrdisplayconnect",
    "onvrdisplaydeactivate",
    "onvrdisplaydisconnect",
    "onvrdisplaypresentchange",
    "onwaiting",
    "onwaitingforkey",
    "onwarning",
    "onwebkitanimationend",
    "onwebkitanimationiteration",
    "onwebkitanimationstart",
    "onwebkitcurrentplaybacktargetiswirelesschanged",
    "onwebkitfullscreenchange",
    "onwebkitfullscreenerror",
    "onwebkitkeyadded",
    "onwebkitkeyerror",
    "onwebkitkeymessage",
    "onwebkitneedkey",
    "onwebkitorientationchange",
    "onwebkitplaybacktargetavailabilitychanged",
    "onwebkitpointerlockchange",
    "onwebkitpointerlockerror",
    "onwebkitresourcetimingbufferfull",
    "onwebkittransitionend",
    "onwheel",
    "onzoom",
    "opacity",
    "open",
    "openCursor",
    "openDatabase",
    "openKeyCursor",
    "opened",
    "opener",
    "opera",
    "operation",
    "operationType",
    "operator",
    "opr",
    "optimum",
    "options",
    "or",
    "order",
    "orderX",
    "orderY",
    "ordered",
    "org",
    "organization",
    "orient",
    "orientAngle",
    "orientType",
    "orientation",
    "orientationX",
    "orientationY",
    "orientationZ",
    "origin",
    "originAgentCluster",
    "originalPolicy",
    "originalTarget",
    "orphans",
    "oscpu",
    "outerHTML",
    "outerHeight",
    "outerText",
    "outerWidth",
    "outgoingHighWaterMark",
    "outgoingMaxAge",
    "outline",
    "outline-color",
    "outline-offset",
    "outline-style",
    "outline-width",
    "outlineColor",
    "outlineOffset",
    "outlineStyle",
    "outlineWidth",
    "outputBuffer",
    "outputChannelCount",
    "outputLatency",
    "outputs",
    "overflow",
    "overflow-anchor",
    "overflow-block",
    "overflow-clip-margin",
    "overflow-inline",
    "overflow-wrap",
    "overflow-x",
    "overflow-y",
    "overflowAnchor",
    "overflowBlock",
    "overflowClipMargin",
    "overflowInline",
    "overflowWrap",
    "overflowX",
    "overflowY",
    "overlaysContent",
    "overrideColors",
    "overrideMimeType",
    "oversample",
    "overscroll-behavior",
    "overscroll-behavior-block",
    "overscroll-behavior-inline",
    "overscroll-behavior-x",
    "overscroll-behavior-y",
    "overscrollBehavior",
    "overscrollBehaviorBlock",
    "overscrollBehaviorInline",
    "overscrollBehaviorX",
    "overscrollBehaviorY",
    "ownKeys",
    "ownerDocument",
    "ownerElement",
    "ownerNode",
    "ownerRule",
    "ownerSVGElement",
    "owningElement",
    "p1",
    "p2",
    "p3",
    "p4",
    "packetSize",
    "packets",
    "pad",
    "padEnd",
    "padStart",
    "padding",
    "padding-block",
    "padding-block-end",
    "padding-block-start",
    "padding-bottom",
    "padding-inline",
    "padding-inline-end",
    "padding-inline-start",
    "padding-left",
    "padding-right",
    "padding-top",
    "paddingBlock",
    "paddingBlockEnd",
    "paddingBlockStart",
    "paddingBottom",
    "paddingInline",
    "paddingInlineEnd",
    "paddingInlineStart",
    "paddingLeft",
    "paddingRight",
    "paddingTop",
    "page",
    "page-break-after",
    "page-break-before",
    "page-break-inside",
    "pageBreakAfter",
    "pageBreakBefore",
    "pageBreakInside",
    "pageCount",
    "pageLeft",
    "pageTop",
    "pageX",
    "pageXOffset",
    "pageY",
    "pageYOffset",
    "pages",
    "paint-order",
    "paintOrder",
    "paintRequests",
    "paintType",
    "paintWorklet",
    "palette",
    "pan",
    "panningModel",
    "parameterData",
    "parameters",
    "parent",
    "parentElement",
    "parentNode",
    "parentRule",
    "parentStyleSheet",
    "parentTextEdit",
    "parentWindow",
    "parse",
    "parseAll",
    "parseCreationOptionsFromJSON",
    "parseFloat",
    "parseFromString",
    "parseHTMLUnsafe",
    "parseInt",
    "parseRequestOptionsFromJSON",
    "part",
    "participants",
    "passOp",
    "passive",
    "password",
    "pasteHTML",
    "path",
    "pathLength",
    "pathSegList",
    "pathSegType",
    "pathSegTypeAsLetter",
    "pathname",
    "pattern",
    "patternContentUnits",
    "patternMismatch",
    "patternTransform",
    "patternUnits",
    "pause",
    "pauseAnimations",
    "pauseDuration",
    "pauseOnExit",
    "pauseProfilers",
    "pauseTransformFeedback",
    "paused",
    "payerEmail",
    "payerName",
    "payerPhone",
    "paymentManager",
    "pc",
    "pdfViewerEnabled",
    "peerIdentity",
    "pending",
    "pendingLocalDescription",
    "pendingRemoteDescription",
    "percent",
    "performance",
    "periodicSync",
    "permission",
    "permissionState",
    "permissions",
    "persist",
    "persisted",
    "personalbar",
    "perspective",
    "perspective-origin",
    "perspectiveOrigin",
    "phone",
    "phoneticFamilyName",
    "phoneticGivenName",
    "photo",
    "pictureInPictureElement",
    "pictureInPictureEnabled",
    "pictureInPictureWindow",
    "ping",
    "pipeThrough",
    "pipeTo",
    "pitch",
    "pixelBottom",
    "pixelDepth",
    "pixelHeight",
    "pixelLeft",
    "pixelRight",
    "pixelStorei",
    "pixelTop",
    "pixelUnitToMillimeterX",
    "pixelUnitToMillimeterY",
    "pixelWidth",
    "place-content",
    "place-items",
    "place-self",
    "placeContent",
    "placeItems",
    "placeSelf",
    "placeholder",
    "platform",
    "platformVersion",
    "platforms",
    "play",
    "playEffect",
    "playState",
    "playbackRate",
    "playbackState",
    "playbackTime",
    "played",
    "playoutDelayHint",
    "playsInline",
    "plugins",
    "pluginspage",
    "pname",
    "pointer-events",
    "pointerBeforeReferenceNode",
    "pointerEnabled",
    "pointerEvents",
    "pointerId",
    "pointerLockElement",
    "pointerType",
    "points",
    "pointsAtX",
    "pointsAtY",
    "pointsAtZ",
    "polygonOffset",
    "pop",
    "popDebugGroup",
    "popErrorScope",
    "popover",
    "popoverTargetAction",
    "popoverTargetElement",
    "populateMatrix",
    "popupWindowFeatures",
    "popupWindowName",
    "popupWindowURI",
    "port",
    "port1",
    "port2",
    "ports",
    "posBottom",
    "posHeight",
    "posLeft",
    "posRight",
    "posTop",
    "posWidth",
    "pose",
    "position",
    "positionAlign",
    "positionX",
    "positionY",
    "positionZ",
    "postError",
    "postMessage",
    "postTask",
    "postalCode",
    "poster",
    "postscriptName",
    "pow",
    "powerEfficient",
    "powerOff",
    "powerPreference",
    "preMultiplySelf",
    "precision",
    "preferredReflectionFormat",
    "preferredStyleSheetSet",
    "preferredStylesheetSet",
    "prefix",
    "preload",
    "premultipliedAlpha",
    "prepend",
    "prerendering",
    "presentation",
    "presentationArea",
    "preserveAlpha",
    "preserveAspectRatio",
    "preserveAspectRatioString",
    "preservesPitch",
    "pressed",
    "pressure",
    "prevValue",
    "preventDefault",
    "preventExtensions",
    "preventSilentAccess",
    "previousElementSibling",
    "previousNode",
    "previousPage",
    "previousPriority",
    "previousRect",
    "previousScale",
    "previousSibling",
    "previousTranslate",
    "primaries",
    "primaryKey",
    "primaryLightDirection",
    "primaryLightIntensity",
    "primitive",
    "primitiveType",
    "primitiveUnits",
    "principals",
    "print",
    "print-color-adjust",
    "printColorAdjust",
    "priority",
    "privateKey",
    "privateToken",
    "probablySupportsContext",
    "probeSpace",
    "process",
    "processIceMessage",
    "processingEnd",
    "processingStart",
    "processorOptions",
    "product",
    "productId",
    "productName",
    "productSub",
    "profile",
    "profileEnd",
    "profiles",
    "projectionMatrix",
    "promise",
    "prompt",
    "properties",
    "propertyIsEnumerable",
    "propertyName",
    "protocol",
    "protocolLong",
    "prototype",
    "provider",
    "pseudoClass",
    "pseudoElement",
    "pt",
    "publicId",
    "publicKey",
    "published",
    "pulse",
    "push",
    "pushDebugGroup",
    "pushErrorScope",
    "pushManager",
    "pushNotification",
    "pushState",
    "put",
    "putImageData",
    "px",
    "quadraticCurveTo",
    "qualifier",
    "quaternion",
    "query",
    "queryCommandEnabled",
    "queryCommandIndeterm",
    "queryCommandState",
    "queryCommandSupported",
    "queryCommandText",
    "queryCommandValue",
    "queryLocalFonts",
    "queryPermission",
    "querySelector",
    "querySelectorAll",
    "querySet",
    "queue",
    "queueMicrotask",
    "quote",
    "quotes",
    "r",
    "r1",
    "r2",
    "race",
    "rad",
    "radiogroup",
    "radiusX",
    "radiusY",
    "random",
    "randomUUID",
    "range",
    "rangeCount",
    "rangeEnd",
    "rangeMax",
    "rangeMin",
    "rangeOffset",
    "rangeOverflow",
    "rangeParent",
    "rangeStart",
    "rangeUnderflow",
    "rate",
    "ratio",
    "raw",
    "rawId",
    "rawJSON",
    "rawValueToMeters",
    "rcap",
    "rch",
    "read",
    "readAsArrayBuffer",
    "readAsBinaryString",
    "readAsBlob",
    "readAsDataURL",
    "readAsText",
    "readBuffer",
    "readEntries",
    "readOnly",
    "readPixels",
    "readReportRequested",
    "readText",
    "readValue",
    "readable",
    "ready",
    "readyState",
    "reason",
    "reasons",
    "reboot",
    "receiveFeatureReport",
    "receivedAlert",
    "receiver",
    "receivers",
    "recipient",
    "recommendedViewportScale",
    "reconnect",
    "recordNumber",
    "recordsAvailable",
    "recordset",
    "rect",
    "red",
    "redEyeReduction",
    "redirect",
    "redirectCount",
    "redirectEnd",
    "redirectStart",
    "redirected",
    "reduce",
    "reduceRight",
    "reduction",
    "refDistance",
    "refX",
    "refY",
    "referenceNode",
    "referenceSpace",
    "referrer",
    "referrerPolicy",
    "refresh",
    "region",
    "regionAnchorX",
    "regionAnchorY",
    "regionId",
    "regions",
    "register",
    "registerContentHandler",
    "registerElement",
    "registerInternalModuleStart",
    "registerInternalModuleStop",
    "registerProperty",
    "registerProtocolHandler",
    "reject",
    "rel",
    "relList",
    "relatedAddress",
    "relatedNode",
    "relatedPort",
    "relatedTarget",
    "relayProtocol",
    "release",
    "releaseCapture",
    "releaseEvents",
    "releaseInterface",
    "releaseLock",
    "releasePointerCapture",
    "releaseShaderCompiler",
    "released",
    "reliability",
    "reliable",
    "reliableWrite",
    "reload",
    "rem",
    "remainingSpace",
    "remote",
    "remoteDescription",
    "remove",
    "removeAllRanges",
    "removeAttribute",
    "removeAttributeNS",
    "removeAttributeNode",
    "removeBehavior",
    "removeChild",
    "removeCue",
    "removeEntry",
    "removeEventListener",
    "removeFilter",
    "removeImport",
    "removeItem",
    "removeListener",
    "removeNamedItem",
    "removeNamedItemNS",
    "removeNode",
    "removeParameter",
    "removeProperty",
    "removeRange",
    "removeRegion",
    "removeRule",
    "removeSiteSpecificTrackingException",
    "removeSourceBuffer",
    "removeStream",
    "removeTrack",
    "removeVariable",
    "removeWakeLockListener",
    "removeWebWideTrackingException",
    "removed",
    "removedNodes",
    "renderBlockingStatus",
    "renderHeight",
    "renderStart",
    "renderState",
    "renderTime",
    "renderWidth",
    "renderbufferStorage",
    "renderbufferStorageMultisample",
    "renderedBuffer",
    "rendererInterfaces",
    "renderers",
    "renderingMode",
    "renotify",
    "repeat",
    "repetitionCount",
    "replace",
    "replaceAdjacentText",
    "replaceAll",
    "replaceChild",
    "replaceChildren",
    "replaceData",
    "replaceId",
    "replaceItem",
    "replaceNode",
    "replaceState",
    "replaceSync",
    "replaceTrack",
    "replaceWholeText",
    "replaceWith",
    "reportError",
    "reportEvent",
    "reportId",
    "reportValidity",
    "request",
    "requestAdapter",
    "requestAdapterInfo",
    "requestAnimationFrame",
    "requestAutocomplete",
    "requestData",
    "requestDevice",
    "requestFrame",
    "requestFullscreen",
    "requestHitTestSource",
    "requestHitTestSourceForTransientInput",
    "requestId",
    "requestIdleCallback",
    "requestLightProbe",
    "requestMIDIAccess",
    "requestMediaKeySystemAccess",
    "requestPermission",
    "requestPictureInPicture",
    "requestPointerLock",
    "requestPort",
    "requestPresent",
    "requestPresenter",
    "requestReferenceSpace",
    "requestSession",
    "requestStart",
    "requestStorageAccess",
    "requestStorageAccessFor",
    "requestSubmit",
    "requestVideoFrameCallback",
    "requestViewportScale",
    "requestWindow",
    "requestingWindow",
    "requireInteraction",
    "required",
    "requiredExtensions",
    "requiredFeatures",
    "requiredLimits",
    "reset",
    "resetPose",
    "resetTransform",
    "resizable",
    "resize",
    "resizeBy",
    "resizeTo",
    "resolve",
    "resolveQuerySet",
    "resolveTarget",
    "resource",
    "respond",
    "respondWithNewView",
    "response",
    "responseBody",
    "responseEnd",
    "responseReady",
    "responseStart",
    "responseStatus",
    "responseText",
    "responseType",
    "responseURL",
    "responseXML",
    "restartIce",
    "restore",
    "result",
    "resultIndex",
    "resultType",
    "results",
    "resume",
    "resumeProfilers",
    "resumeTransformFeedback",
    "retry",
    "returnValue",
    "rev",
    "reverse",
    "reversed",
    "revocable",
    "revokeObjectURL",
    "rex",
    "rgbColor",
    "ric",
    "right",
    "rightContext",
    "rightDegrees",
    "rightMargin",
    "rightProjectionMatrix",
    "rightViewMatrix",
    "rlh",
    "role",
    "rolloffFactor",
    "root",
    "rootBounds",
    "rootElement",
    "rootMargin",
    "rotate",
    "rotateAxisAngle",
    "rotateAxisAngleSelf",
    "rotateFromVector",
    "rotateFromVectorSelf",
    "rotateSelf",
    "rotation",
    "rotationAngle",
    "rotationRate",
    "round",
    "roundRect",
    "row-gap",
    "rowGap",
    "rowIndex",
    "rowSpan",
    "rows",
    "rowsPerImage",
    "rtcpTransport",
    "rtt",
    "ruby-align",
    "ruby-position",
    "rubyAlign",
    "rubyOverhang",
    "rubyPosition",
    "rules",
    "run",
    "runAdAuction",
    "runtime",
    "runtimeStyle",
    "rx",
    "ry",
    "s",
    "safari",
    "sameDocument",
    "sample",
    "sampleCount",
    "sampleCoverage",
    "sampleInterval",
    "sampleRate",
    "sampleType",
    "sampler",
    "samplerParameterf",
    "samplerParameteri",
    "sandbox",
    "save",
    "saveData",
    "scale",
    "scale3d",
    "scale3dSelf",
    "scaleNonUniform",
    "scaleNonUniformSelf",
    "scaleSelf",
    "scheduler",
    "scheduling",
    "scheme",
    "scissor",
    "scope",
    "scopeName",
    "scoped",
    "screen",
    "screenBrightness",
    "screenEnabled",
    "screenLeft",
    "screenPixelToMillimeterX",
    "screenPixelToMillimeterY",
    "screenState",
    "screenTop",
    "screenX",
    "screenY",
    "screens",
    "scriptURL",
    "scripts",
    "scroll",
    "scroll-behavior",
    "scroll-margin",
    "scroll-margin-block",
    "scroll-margin-block-end",
    "scroll-margin-block-start",
    "scroll-margin-bottom",
    "scroll-margin-inline",
    "scroll-margin-inline-end",
    "scroll-margin-inline-start",
    "scroll-margin-left",
    "scroll-margin-right",
    "scroll-margin-top",
    "scroll-padding",
    "scroll-padding-block",
    "scroll-padding-block-end",
    "scroll-padding-block-start",
    "scroll-padding-bottom",
    "scroll-padding-inline",
    "scroll-padding-inline-end",
    "scroll-padding-inline-start",
    "scroll-padding-left",
    "scroll-padding-right",
    "scroll-padding-top",
    "scroll-snap-align",
    "scroll-snap-stop",
    "scroll-snap-type",
    "scrollAmount",
    "scrollBehavior",
    "scrollBy",
    "scrollByLines",
    "scrollByPages",
    "scrollDelay",
    "scrollHeight",
    "scrollIntoView",
    "scrollIntoViewIfNeeded",
    "scrollLeft",
    "scrollLeftMax",
    "scrollMargin",
    "scrollMarginBlock",
    "scrollMarginBlockEnd",
    "scrollMarginBlockStart",
    "scrollMarginBottom",
    "scrollMarginInline",
    "scrollMarginInlineEnd",
    "scrollMarginInlineStart",
    "scrollMarginLeft",
    "scrollMarginRight",
    "scrollMarginTop",
    "scrollMaxX",
    "scrollMaxY",
    "scrollPadding",
    "scrollPaddingBlock",
    "scrollPaddingBlockEnd",
    "scrollPaddingBlockStart",
    "scrollPaddingBottom",
    "scrollPaddingInline",
    "scrollPaddingInlineEnd",
    "scrollPaddingInlineStart",
    "scrollPaddingLeft",
    "scrollPaddingRight",
    "scrollPaddingTop",
    "scrollRestoration",
    "scrollSnapAlign",
    "scrollSnapStop",
    "scrollSnapType",
    "scrollTo",
    "scrollTop",
    "scrollTopMax",
    "scrollWidth",
    "scrollX",
    "scrollY",
    "scrollbar-color",
    "scrollbar-gutter",
    "scrollbar-width",
    "scrollbar3dLightColor",
    "scrollbarArrowColor",
    "scrollbarBaseColor",
    "scrollbarColor",
    "scrollbarDarkShadowColor",
    "scrollbarFaceColor",
    "scrollbarGutter",
    "scrollbarHighlightColor",
    "scrollbarShadowColor",
    "scrollbarTrackColor",
    "scrollbarWidth",
    "scrollbars",
    "scrolling",
    "scrollingElement",
    "sctp",
    "sctpCauseCode",
    "sdp",
    "sdpLineNumber",
    "sdpMLineIndex",
    "sdpMid",
    "seal",
    "search",
    "searchBox",
    "searchBoxJavaBridge_",
    "searchParams",
    "sectionRowIndex",
    "secureConnectionStart",
    "security",
    "seed",
    "seek",
    "seekToNextFrame",
    "seekable",
    "seeking",
    "select",
    "selectAllChildren",
    "selectAlternateInterface",
    "selectAudioOutput",
    "selectConfiguration",
    "selectNode",
    "selectNodeContents",
    "selectNodes",
    "selectSingleNode",
    "selectSubString",
    "selectURL",
    "selected",
    "selectedIndex",
    "selectedOptions",
    "selectedStyleSheetSet",
    "selectedStylesheetSet",
    "selectedTrack",
    "selection",
    "selectionDirection",
    "selectionEnd",
    "selectionStart",
    "selector",
    "selectorText",
    "self",
    "send",
    "sendAsBinary",
    "sendBeacon",
    "sendFeatureReport",
    "sendOrder",
    "sendReport",
    "sender",
    "sentAlert",
    "sentTimestamp",
    "separator",
    "serial",
    "serialNumber",
    "serializeToString",
    "serverTiming",
    "service",
    "serviceWorker",
    "session",
    "sessionId",
    "sessionStorage",
    "set",
    "setActionHandler",
    "setActive",
    "setAlpha",
    "setAppBadge",
    "setAttribute",
    "setAttributeNS",
    "setAttributeNode",
    "setAttributeNodeNS",
    "setAttributionReporting",
    "setBaseAndExtent",
    "setBigInt64",
    "setBigUint64",
    "setBindGroup",
    "setBingCurrentSearchDefault",
    "setBlendConstant",
    "setCameraActive",
    "setCapture",
    "setCaptureHandleConfig",
    "setCodecPreferences",
    "setColor",
    "setCompositeOperation",
    "setConfiguration",
    "setConsumer",
    "setCurrentTime",
    "setCustomValidity",
    "setData",
    "setDate",
    "setDragImage",
    "setEnd",
    "setEndAfter",
    "setEndBefore",
    "setEndPoint",
    "setExpires",
    "setFillColor",
    "setFilterRes",
    "setFloat32",
    "setFloat64",
    "setFloatValue",
    "setFocusBehavior",
    "setFormValue",
    "setFullYear",
    "setHTMLUnsafe",
    "setHeaderExtensionsToNegotiate",
    "setHeaderValue",
    "setHours",
    "setIdentityProvider",
    "setImmediate",
    "setIndexBuffer",
    "setInt16",
    "setInt32",
    "setInt8",
    "setInterval",
    "setItem",
    "setKeyframes",
    "setLineCap",
    "setLineDash",
    "setLineJoin",
    "setLineWidth",
    "setLiveSeekableRange",
    "setLocalDescription",
    "setMatrix",
    "setMatrixValue",
    "setMediaKeys",
    "setMicrophoneActive",
    "setMilliseconds",
    "setMinutes",
    "setMiterLimit",
    "setMonth",
    "setNamedItem",
    "setNamedItemNS",
    "setNonUserCodeExceptions",
    "setOrientToAngle",
    "setOrientToAuto",
    "setOrientation",
    "setOverrideHistoryNavigationMode",
    "setPaint",
    "setParameter",
    "setParameters",
    "setPeriodicWave",
    "setPipeline",
    "setPointerCapture",
    "setPosition",
    "setPositionState",
    "setPreference",
    "setPriority",
    "setPrivateToken",
    "setProperty",
    "setPrototypeOf",
    "setRGBColor",
    "setRGBColorICCColor",
    "setRadius",
    "setRangeText",
    "setRemoteDescription",
    "setReportEventDataForAutomaticBeacons",
    "setRequestHeader",
    "setResizable",
    "setResourceTimingBufferSize",
    "setRotate",
    "setScale",
    "setScissorRect",
    "setSeconds",
    "setSelectionRange",
    "setServerCertificate",
    "setShadow",
    "setSharedStorageContext",
    "setSignals",
    "setSinkId",
    "setSkewX",
    "setSkewY",
    "setStart",
    "setStartAfter",
    "setStartBefore",
    "setStatus",
    "setStdDeviation",
    "setStencilReference",
    "setStreams",
    "setStrictMode",
    "setStringValue",
    "setStrokeColor",
    "setSuggestResult",
    "setTargetAtTime",
    "setTargetValueAtTime",
    "setTime",
    "setTimeout",
    "setTransform",
    "setTranslate",
    "setUTCDate",
    "setUTCFullYear",
    "setUTCHours",
    "setUTCMilliseconds",
    "setUTCMinutes",
    "setUTCMonth",
    "setUTCSeconds",
    "setUint16",
    "setUint32",
    "setUint8",
    "setUri",
    "setValidity",
    "setValueAtTime",
    "setValueCurveAtTime",
    "setVariable",
    "setVelocity",
    "setVersion",
    "setVertexBuffer",
    "setViewport",
    "setYear",
    "settingName",
    "settingValue",
    "sex",
    "shaderLocation",
    "shaderSource",
    "shadowBlur",
    "shadowColor",
    "shadowOffsetX",
    "shadowOffsetY",
    "shadowRoot",
    "shadowRootClonable",
    "shadowRootDelegatesFocus",
    "shadowRootMode",
    "shape",
    "shape-image-threshold",
    "shape-margin",
    "shape-outside",
    "shape-rendering",
    "shapeImageThreshold",
    "shapeMargin",
    "shapeOutside",
    "shapeRendering",
    "share",
    "sharedStorage",
    "sharedStorageWritable",
    "sheet",
    "shift",
    "shiftKey",
    "shiftLeft",
    "shippingAddress",
    "shippingOption",
    "shippingType",
    "show",
    "showDirectoryPicker",
    "showHelp",
    "showModal",
    "showModalDialog",
    "showModelessDialog",
    "showNotification",
    "showOpenFilePicker",
    "showPicker",
    "showPopover",
    "showSaveFilePicker",
    "sidebar",
    "sign",
    "signal",
    "signalingState",
    "signature",
    "silent",
    "sin",
    "singleNodeValue",
    "sinh",
    "sinkId",
    "sittingToStandingTransform",
    "size",
    "sizeAdjust",
    "sizeToContent",
    "sizeX",
    "sizeZ",
    "sizes",
    "skewX",
    "skewXSelf",
    "skewY",
    "skewYSelf",
    "skipTransition",
    "skipped",
    "slice",
    "slope",
    "slot",
    "slotAssignment",
    "small",
    "smil",
    "smooth",
    "smoothingTimeConstant",
    "snapToLines",
    "snapshotItem",
    "snapshotLength",
    "some",
    "sort",
    "sortingCode",
    "source",
    "sourceBuffer",
    "sourceBuffers",
    "sourceCapabilities",
    "sourceCharPosition",
    "sourceFile",
    "sourceFunctionName",
    "sourceIndex",
    "sourceMap",
    "sourceURL",
    "sources",
    "spacing",
    "span",
    "speak",
    "speakAs",
    "speaking",
    "species",
    "specified",
    "specularConstant",
    "specularExponent",
    "speechSynthesis",
    "speed",
    "speedOfSound",
    "spellcheck",
    "sphericalHarmonicsCoefficients",
    "splice",
    "split",
    "splitText",
    "spreadMethod",
    "sqrt",
    "src",
    "srcElement",
    "srcFactor",
    "srcFilter",
    "srcObject",
    "srcUrn",
    "srcdoc",
    "srclang",
    "srcset",
    "stack",
    "stackTraceLimit",
    "stacktrace",
    "stageParameters",
    "standalone",
    "standby",
    "start",
    "startContainer",
    "startIce",
    "startMessages",
    "startNotifications",
    "startOffset",
    "startProfiling",
    "startRendering",
    "startShark",
    "startTime",
    "startViewTransition",
    "startsWith",
    "state",
    "states",
    "stats",
    "status",
    "statusCode",
    "statusMessage",
    "statusText",
    "statusbar",
    "stdDeviationX",
    "stdDeviationY",
    "stencilBack",
    "stencilClearValue",
    "stencilFront",
    "stencilFunc",
    "stencilFuncSeparate",
    "stencilLoadOp",
    "stencilMask",
    "stencilMaskSeparate",
    "stencilOp",
    "stencilOpSeparate",
    "stencilReadMask",
    "stencilReadOnly",
    "stencilStoreOp",
    "stencilWriteMask",
    "step",
    "stepDown",
    "stepMismatch",
    "stepMode",
    "stepUp",
    "sticky",
    "stitchTiles",
    "stop",
    "stop-color",
    "stop-opacity",
    "stopColor",
    "stopImmediatePropagation",
    "stopNotifications",
    "stopOpacity",
    "stopProfiling",
    "stopPropagation",
    "stopShark",
    "stopped",
    "storage",
    "storageArea",
    "storageBuckets",
    "storageName",
    "storageStatus",
    "storageTexture",
    "store",
    "storeOp",
    "storeSiteSpecificTrackingException",
    "storeWebWideTrackingException",
    "stpVersion",
    "stream",
    "streamErrorCode",
    "streams",
    "stretch",
    "strike",
    "string",
    "stringValue",
    "stringify",
    "stripIndexFormat",
    "stroke",
    "stroke-dasharray",
    "stroke-dashoffset",
    "stroke-linecap",
    "stroke-linejoin",
    "stroke-miterlimit",
    "stroke-opacity",
    "stroke-width",
    "strokeDasharray",
    "strokeDashoffset",
    "strokeLinecap",
    "strokeLinejoin",
    "strokeMiterlimit",
    "strokeOpacity",
    "strokeRect",
    "strokeStyle",
    "strokeText",
    "strokeWidth",
    "structuredClone",
    "style",
    "styleAndLayoutStart",
    "styleFloat",
    "styleMap",
    "styleMedia",
    "styleSheet",
    "styleSheetSets",
    "styleSheets",
    "sub",
    "subarray",
    "subject",
    "submit",
    "submitFrame",
    "submitter",
    "subscribe",
    "substr",
    "substring",
    "substringData",
    "subtle",
    "subtree",
    "suffix",
    "suffixes",
    "summary",
    "sup",
    "supported",
    "supportedContentEncodings",
    "supportedEntryTypes",
    "supportedValuesOf",
    "supports",
    "supportsFiber",
    "supportsSession",
    "supportsText",
    "surfaceScale",
    "surroundContents",
    "suspend",
    "suspendRedraw",
    "svb",
    "svh",
    "svi",
    "svmax",
    "svmin",
    "svw",
    "swapCache",
    "swapNode",
    "sweepFlag",
    "symbols",
    "symmetricDifference",
    "sync",
    "syntax",
    "sysexEnabled",
    "system",
    "systemCode",
    "systemId",
    "systemLanguage",
    "systemXDPI",
    "systemYDPI",
    "tBodies",
    "tFoot",
    "tHead",
    "tab-size",
    "tabIndex",
    "tabSize",
    "table",
    "table-layout",
    "tableLayout",
    "tableValues",
    "tag",
    "tagName",
    "tagUrn",
    "tags",
    "taintEnabled",
    "take",
    "takePhoto",
    "takeRecords",
    "tan",
    "tangentialPressure",
    "tanh",
    "target",
    "targetAddressSpace",
    "targetElement",
    "targetRayMode",
    "targetRaySpace",
    "targetTouches",
    "targetURL",
    "targetX",
    "targetY",
    "targets",
    "tcpType",
    "tee",
    "tel",
    "terminate",
    "test",
    "texImage2D",
    "texImage3D",
    "texParameterf",
    "texParameteri",
    "texStorage2D",
    "texStorage3D",
    "texSubImage2D",
    "texSubImage3D",
    "text",
    "text-align",
    "text-align-last",
    "text-anchor",
    "text-combine-upright",
    "text-decoration",
    "text-decoration-color",
    "text-decoration-line",
    "text-decoration-skip-ink",
    "text-decoration-style",
    "text-decoration-thickness",
    "text-emphasis",
    "text-emphasis-color",
    "text-emphasis-position",
    "text-emphasis-style",
    "text-indent",
    "text-justify",
    "text-orientation",
    "text-overflow",
    "text-rendering",
    "text-shadow",
    "text-transform",
    "text-underline-offset",
    "text-underline-position",
    "text-wrap",
    "text-wrap-mode",
    "text-wrap-style",
    "textAlign",
    "textAlignLast",
    "textAnchor",
    "textAutospace",
    "textBaseline",
    "textCombineUpright",
    "textContent",
    "textDecoration",
    "textDecorationBlink",
    "textDecorationColor",
    "textDecorationLine",
    "textDecorationLineThrough",
    "textDecorationNone",
    "textDecorationOverline",
    "textDecorationSkipInk",
    "textDecorationStyle",
    "textDecorationThickness",
    "textDecorationUnderline",
    "textEmphasis",
    "textEmphasisColor",
    "textEmphasisPosition",
    "textEmphasisStyle",
    "textIndent",
    "textJustify",
    "textJustifyTrim",
    "textKashida",
    "textKashidaSpace",
    "textLength",
    "textOrientation",
    "textOverflow",
    "textRendering",
    "textShadow",
    "textTracks",
    "textTransform",
    "textUnderlineOffset",
    "textUnderlinePosition",
    "textWrap",
    "textWrapMode",
    "textWrapStyle",
    "texture",
    "then",
    "threadId",
    "threshold",
    "thresholds",
    "throwIfAborted",
    "tiltX",
    "tiltY",
    "time",
    "timeEnd",
    "timeLog",
    "timeOrigin",
    "timeRemaining",
    "timeStamp",
    "timecode",
    "timeline",
    "timelineTime",
    "timeout",
    "timestamp",
    "timestampOffset",
    "timestampWrites",
    "timing",
    "title",
    "titlebarAreaRect",
    "to",
    "toArray",
    "toBlob",
    "toDataURL",
    "toDateString",
    "toElement",
    "toExponential",
    "toFixed",
    "toFloat32Array",
    "toFloat64Array",
    "toGMTString",
    "toISOString",
    "toJSON",
    "toLocaleDateString",
    "toLocaleFormat",
    "toLocaleLowerCase",
    "toLocaleString",
    "toLocaleTimeString",
    "toLocaleUpperCase",
    "toLowerCase",
    "toMatrix",
    "toMethod",
    "toPrecision",
    "toPrimitive",
    "toReversed",
    "toSdp",
    "toSorted",
    "toSource",
    "toSpliced",
    "toStaticHTML",
    "toString",
    "toStringTag",
    "toSum",
    "toTimeString",
    "toUTCString",
    "toUpperCase",
    "toWellFormed",
    "toggle",
    "toggleAttribute",
    "toggleLongPressEnabled",
    "togglePopover",
    "token",
    "tone",
    "toneBuffer",
    "tooLong",
    "tooShort",
    "toolbar",
    "top",
    "topMargin",
    "topology",
    "total",
    "totalFrameDelay",
    "totalFrames",
    "totalVideoFrames",
    "touch-action",
    "touchAction",
    "touched",
    "touches",
    "trace",
    "track",
    "trackVisibility",
    "trackedAnchors",
    "tracks",
    "transaction",
    "transactions",
    "transceiver",
    "transfer",
    "transferControlToOffscreen",
    "transferFromImageBitmap",
    "transferImageBitmap",
    "transferIn",
    "transferOut",
    "transferSize",
    "transferToFixedLength",
    "transferToImageBitmap",
    "transform",
    "transform-box",
    "transform-origin",
    "transform-style",
    "transformBox",
    "transformFeedbackVaryings",
    "transformOrigin",
    "transformPoint",
    "transformString",
    "transformStyle",
    "transformToDocument",
    "transformToFragment",
    "transition",
    "transition-delay",
    "transition-duration",
    "transition-property",
    "transition-timing-function",
    "transitionDelay",
    "transitionDuration",
    "transitionProperty",
    "transitionTimingFunction",
    "translate",
    "translateSelf",
    "translationX",
    "translationY",
    "transport",
    "traverseTo",
    "trim",
    "trimEnd",
    "trimLeft",
    "trimRight",
    "trimStart",
    "trueSpeed",
    "trunc",
    "truncate",
    "trustedTypes",
    "turn",
    "twist",
    "type",
    "typeDetail",
    "typeMismatch",
    "typeMustMatch",
    "types",
    "u2f",
    "ubound",
    "uint16",
    "uint32",
    "uint8",
    "uint8Clamped",
    "unadjustedMovement",
    "unclippedDepth",
    "unconfigure",
    "undefined",
    "underlineStyle",
    "underlineThickness",
    "unescape",
    "uneval",
    "unicode",
    "unicode-bidi",
    "unicodeBidi",
    "unicodeRange",
    "unicodeSets",
    "uniform1f",
    "uniform1fv",
    "uniform1i",
    "uniform1iv",
    "uniform1ui",
    "uniform1uiv",
    "uniform2f",
    "uniform2fv",
    "uniform2i",
    "uniform2iv",
    "uniform2ui",
    "uniform2uiv",
    "uniform3f",
    "uniform3fv",
    "uniform3i",
    "uniform3iv",
    "uniform3ui",
    "uniform3uiv",
    "uniform4f",
    "uniform4fv",
    "uniform4i",
    "uniform4iv",
    "uniform4ui",
    "uniform4uiv",
    "uniformBlockBinding",
    "uniformMatrix2fv",
    "uniformMatrix2x3fv",
    "uniformMatrix2x4fv",
    "uniformMatrix3fv",
    "uniformMatrix3x2fv",
    "uniformMatrix3x4fv",
    "uniformMatrix4fv",
    "uniformMatrix4x2fv",
    "uniformMatrix4x3fv",
    "union",
    "unique",
    "uniqueID",
    "uniqueNumber",
    "unit",
    "unitType",
    "units",
    "unloadEventEnd",
    "unloadEventStart",
    "unlock",
    "unmap",
    "unmount",
    "unobserve",
    "unpackColorSpace",
    "unpause",
    "unpauseAnimations",
    "unreadCount",
    "unregister",
    "unregisterContentHandler",
    "unregisterProtocolHandler",
    "unscopables",
    "unselectable",
    "unshift",
    "unsubscribe",
    "unsuspendRedraw",
    "unsuspendRedrawAll",
    "unwatch",
    "unwrapKey",
    "upDegrees",
    "upX",
    "upY",
    "upZ",
    "update",
    "updateAdInterestGroups",
    "updateCallbackDone",
    "updateCharacterBounds",
    "updateCommands",
    "updateControlBounds",
    "updateCurrentEntry",
    "updateIce",
    "updateInkTrailStartPoint",
    "updateInterval",
    "updatePlaybackRate",
    "updateRangeEnd",
    "updateRangeStart",
    "updateRenderState",
    "updateSelection",
    "updateSelectionBounds",
    "updateSettings",
    "updateText",
    "updateTiming",
    "updateViaCache",
    "updateWith",
    "updated",
    "updating",
    "upgrade",
    "upload",
    "uploadTotal",
    "uploaded",
    "upper",
    "upperBound",
    "upperOpen",
    "uri",
    "url",
    "urn",
    "urns",
    "usage",
    "usages",
    "usb",
    "usbVersionMajor",
    "usbVersionMinor",
    "usbVersionSubminor",
    "useCurrentView",
    "useMap",
    "useProgram",
    "usedSpace",
    "user-select",
    "userActivation",
    "userAgent",
    "userAgentData",
    "userChoice",
    "userHandle",
    "userHint",
    "userInitiated",
    "userLanguage",
    "userSelect",
    "userState",
    "userVisibleOnly",
    "username",
    "usernameFragment",
    "utterance",
    "uuid",
    "v8BreakIterator",
    "vAlign",
    "vLink",
    "valid",
    "validate",
    "validateProgram",
    "validationMessage",
    "validity",
    "value",
    "valueAsDate",
    "valueAsNumber",
    "valueAsString",
    "valueInSpecifiedUnits",
    "valueMissing",
    "valueOf",
    "valueText",
    "valueType",
    "values",
    "variable",
    "variant",
    "variationSettings",
    "vb",
    "vector-effect",
    "vectorEffect",
    "velocityAngular",
    "velocityExpansion",
    "velocityX",
    "velocityY",
    "vendor",
    "vendorId",
    "vendorSub",
    "verify",
    "version",
    "vertex",
    "vertexAttrib1f",
    "vertexAttrib1fv",
    "vertexAttrib2f",
    "vertexAttrib2fv",
    "vertexAttrib3f",
    "vertexAttrib3fv",
    "vertexAttrib4f",
    "vertexAttrib4fv",
    "vertexAttribDivisor",
    "vertexAttribDivisorANGLE",
    "vertexAttribI4i",
    "vertexAttribI4iv",
    "vertexAttribI4ui",
    "vertexAttribI4uiv",
    "vertexAttribIPointer",
    "vertexAttribPointer",
    "vertical",
    "vertical-align",
    "verticalAlign",
    "verticalOverflow",
    "vh",
    "vi",
    "vibrate",
    "vibrationActuator",
    "videoBitsPerSecond",
    "videoHeight",
    "videoTracks",
    "videoWidth",
    "view",
    "viewBox",
    "viewBoxString",
    "viewDimension",
    "viewFormats",
    "viewTarget",
    "viewTargetString",
    "viewport",
    "viewportAnchorX",
    "viewportAnchorY",
    "viewportElement",
    "views",
    "violatedDirective",
    "virtualKeyboard",
    "virtualKeyboardPolicy",
    "visibility",
    "visibilityState",
    "visible",
    "visibleRect",
    "visualViewport",
    "vlinkColor",
    "vmax",
    "vmin",
    "voice",
    "voiceURI",
    "volume",
    "vrml",
    "vspace",
    "vw",
    "w",
    "wait",
    "waitAsync",
    "waitSync",
    "waiting",
    "wake",
    "wakeLock",
    "wand",
    "warn",
    "wasClean",
    "wasDiscarded",
    "watch",
    "watchAvailability",
    "watchPosition",
    "webdriver",
    "webkitAddKey",
    "webkitAlignContent",
    "webkitAlignItems",
    "webkitAlignSelf",
    "webkitAnimation",
    "webkitAnimationDelay",
    "webkitAnimationDirection",
    "webkitAnimationDuration",
    "webkitAnimationFillMode",
    "webkitAnimationIterationCount",
    "webkitAnimationName",
    "webkitAnimationPlayState",
    "webkitAnimationTimingFunction",
    "webkitAppearance",
    "webkitAudioContext",
    "webkitAudioDecodedByteCount",
    "webkitAudioPannerNode",
    "webkitBackfaceVisibility",
    "webkitBackground",
    "webkitBackgroundAttachment",
    "webkitBackgroundClip",
    "webkitBackgroundColor",
    "webkitBackgroundImage",
    "webkitBackgroundOrigin",
    "webkitBackgroundPosition",
    "webkitBackgroundPositionX",
    "webkitBackgroundPositionY",
    "webkitBackgroundRepeat",
    "webkitBackgroundSize",
    "webkitBackingStorePixelRatio",
    "webkitBorderBottomLeftRadius",
    "webkitBorderBottomRightRadius",
    "webkitBorderImage",
    "webkitBorderImageOutset",
    "webkitBorderImageRepeat",
    "webkitBorderImageSlice",
    "webkitBorderImageSource",
    "webkitBorderImageWidth",
    "webkitBorderRadius",
    "webkitBorderTopLeftRadius",
    "webkitBorderTopRightRadius",
    "webkitBoxAlign",
    "webkitBoxDirection",
    "webkitBoxFlex",
    "webkitBoxOrdinalGroup",
    "webkitBoxOrient",
    "webkitBoxPack",
    "webkitBoxShadow",
    "webkitBoxSizing",
    "webkitCancelAnimationFrame",
    "webkitCancelFullScreen",
    "webkitCancelKeyRequest",
    "webkitCancelRequestAnimationFrame",
    "webkitClearResourceTimings",
    "webkitClipPath",
    "webkitClosedCaptionsVisible",
    "webkitConvertPointFromNodeToPage",
    "webkitConvertPointFromPageToNode",
    "webkitCreateShadowRoot",
    "webkitCurrentFullScreenElement",
    "webkitCurrentPlaybackTargetIsWireless",
    "webkitDecodedFrameCount",
    "webkitDirectionInvertedFromDevice",
    "webkitDisplayingFullscreen",
    "webkitDroppedFrameCount",
    "webkitEnterFullScreen",
    "webkitEnterFullscreen",
    "webkitEntries",
    "webkitExitFullScreen",
    "webkitExitFullscreen",
    "webkitExitPointerLock",
    "webkitFilter",
    "webkitFlex",
    "webkitFlexBasis",
    "webkitFlexDirection",
    "webkitFlexFlow",
    "webkitFlexGrow",
    "webkitFlexShrink",
    "webkitFlexWrap",
    "webkitFullScreenKeyboardInputAllowed",
    "webkitFullscreenElement",
    "webkitFullscreenEnabled",
    "webkitGenerateKeyRequest",
    "webkitGetAsEntry",
    "webkitGetDatabaseNames",
    "webkitGetEntries",
    "webkitGetEntriesByName",
    "webkitGetEntriesByType",
    "webkitGetFlowByName",
    "webkitGetGamepads",
    "webkitGetImageDataHD",
    "webkitGetNamedFlows",
    "webkitGetRegionFlowRanges",
    "webkitGetUserMedia",
    "webkitHasClosedCaptions",
    "webkitHidden",
    "webkitIDBCursor",
    "webkitIDBDatabase",
    "webkitIDBDatabaseError",
    "webkitIDBDatabaseException",
    "webkitIDBFactory",
    "webkitIDBIndex",
    "webkitIDBKeyRange",
    "webkitIDBObjectStore",
    "webkitIDBRequest",
    "webkitIDBTransaction",
    "webkitImageSmoothingEnabled",
    "webkitIndexedDB",
    "webkitInitMessageEvent",
    "webkitIsFullScreen",
    "webkitJustifyContent",
    "webkitKeys",
    "webkitLineClamp",
    "webkitLineDashOffset",
    "webkitLockOrientation",
    "webkitMask",
    "webkitMaskClip",
    "webkitMaskComposite",
    "webkitMaskImage",
    "webkitMaskOrigin",
    "webkitMaskPosition",
    "webkitMaskPositionX",
    "webkitMaskPositionY",
    "webkitMaskRepeat",
    "webkitMaskSize",
    "webkitMatchesSelector",
    "webkitMediaStream",
    "webkitNotifications",
    "webkitOfflineAudioContext",
    "webkitOrder",
    "webkitOrientation",
    "webkitPeerConnection00",
    "webkitPersistentStorage",
    "webkitPerspective",
    "webkitPerspectiveOrigin",
    "webkitPointerLockElement",
    "webkitPostMessage",
    "webkitPreservesPitch",
    "webkitPutImageDataHD",
    "webkitRTCPeerConnection",
    "webkitRegionOverset",
    "webkitRelativePath",
    "webkitRequestAnimationFrame",
    "webkitRequestFileSystem",
    "webkitRequestFullScreen",
    "webkitRequestFullscreen",
    "webkitRequestPointerLock",
    "webkitResolveLocalFileSystemURL",
    "webkitSetMediaKeys",
    "webkitSetResourceTimingBufferSize",
    "webkitShadowRoot",
    "webkitShowPlaybackTargetPicker",
    "webkitSlice",
    "webkitSpeechGrammar",
    "webkitSpeechGrammarList",
    "webkitSpeechRecognition",
    "webkitSpeechRecognitionError",
    "webkitSpeechRecognitionEvent",
    "webkitStorageInfo",
    "webkitSupportsFullscreen",
    "webkitTemporaryStorage",
    "webkitTextFillColor",
    "webkitTextSecurity",
    "webkitTextSizeAdjust",
    "webkitTextStroke",
    "webkitTextStrokeColor",
    "webkitTextStrokeWidth",
    "webkitTransform",
    "webkitTransformOrigin",
    "webkitTransformStyle",
    "webkitTransition",
    "webkitTransitionDelay",
    "webkitTransitionDuration",
    "webkitTransitionProperty",
    "webkitTransitionTimingFunction",
    "webkitURL",
    "webkitUnlockOrientation",
    "webkitUserSelect",
    "webkitVideoDecodedByteCount",
    "webkitVisibilityState",
    "webkitWirelessVideoPlaybackDisabled",
    "webkitdirectory",
    "webkitdropzone",
    "webstore",
    "weight",
    "wgslLanguageFeatures",
    "whatToShow",
    "wheelDelta",
    "wheelDeltaX",
    "wheelDeltaY",
    "whenDefined",
    "which",
    "white-space",
    "white-space-collapse",
    "whiteSpace",
    "whiteSpaceCollapse",
    "wholeText",
    "widows",
    "width",
    "will-change",
    "willChange",
    "willValidate",
    "window",
    "windowAttribution",
    "windowControlsOverlay",
    "with",
    "withCredentials",
    "withResolvers",
    "word-break",
    "word-spacing",
    "word-wrap",
    "wordBreak",
    "wordSpacing",
    "wordWrap",
    "workerStart",
    "worklet",
    "wow64",
    "wrap",
    "wrapKey",
    "writable",
    "writableAuxiliaries",
    "write",
    "writeBuffer",
    "writeMask",
    "writeText",
    "writeTexture",
    "writeTimestamp",
    "writeValue",
    "writeValueWithResponse",
    "writeValueWithoutResponse",
    "writeWithoutResponse",
    "writeln",
    "writing-mode",
    "writingMode",
    "writingSuggestions",
    "x",
    "x1",
    "x2",
    "xChannelSelector",
    "xmlEncoding",
    "xmlStandalone",
    "xmlVersion",
    "xmlbase",
    "xmllang",
    "xmlspace",
    "xor",
    "xr",
    "y",
    "y1",
    "y2",
    "yChannelSelector",
    "yandex",
    "z",
    "z-index",
    "zIndex",
    "zoom",
    "zoomAndPan",
    "zoomRectScreen"
  ];

  // node_modules/terser/lib/propmangle.js
  function find_builtins(reserved) {
    domprops.forEach(add);
    var new_globals = ["Symbol", "Map", "Promise", "Proxy", "Reflect", "Set", "WeakMap", "WeakSet"];
    var objects = {};
    var global_ref = typeof global === "object" ? global : self;
    new_globals.forEach(function(new_global) {
      objects[new_global] = global_ref[new_global] || function() {
      };
    });
    [
      "null",
      "true",
      "false",
      "NaN",
      "Infinity",
      "-Infinity",
      "undefined"
    ].forEach(add);
    [
      Object,
      Array,
      Function,
      Number,
      String,
      Boolean,
      Error,
      Math,
      Date,
      RegExp,
      objects.Symbol,
      ArrayBuffer,
      DataView,
      decodeURI,
      decodeURIComponent,
      encodeURI,
      encodeURIComponent,
      eval,
      EvalError,
      Float32Array,
      Float64Array,
      Int8Array,
      Int16Array,
      Int32Array,
      isFinite,
      isNaN,
      JSON,
      objects.Map,
      parseFloat,
      parseInt,
      objects.Promise,
      objects.Proxy,
      RangeError,
      ReferenceError,
      objects.Reflect,
      objects.Set,
      SyntaxError,
      TypeError,
      Uint8Array,
      Uint8ClampedArray,
      Uint16Array,
      Uint32Array,
      URIError,
      objects.WeakMap,
      objects.WeakSet
    ].forEach(function(ctor) {
      Object.getOwnPropertyNames(ctor).map(add);
      if (ctor.prototype) {
        Object.getOwnPropertyNames(ctor.prototype).map(add);
      }
    });
    function add(name) {
      reserved.add(name);
    }
  }
  function reserve_quoted_keys(ast, reserved) {
    function add(name) {
      push_uniq(reserved, name);
    }
    ast.walk(new TreeWalker(function(node) {
      if (node instanceof AST_ObjectKeyVal && node.quote) {
        add(node.key);
      } else if (node instanceof AST_ObjectProperty && node.quote) {
        add(node.key.name);
      } else if (node instanceof AST_Sub) {
        addStrings(node.property, add);
      }
    }));
  }
  function addStrings(node, add) {
    node.walk(new TreeWalker(function(node2) {
      if (node2 instanceof AST_Sequence) {
        addStrings(node2.tail_node(), add);
      } else if (node2 instanceof AST_String) {
        add(node2.value);
      } else if (node2 instanceof AST_Conditional) {
        addStrings(node2.consequent, add);
        addStrings(node2.alternative, add);
      }
      return true;
    }));
  }
  function mangle_private_properties(ast, options) {
    var cprivate = -1;
    var private_cache = /* @__PURE__ */ new Map();
    var nth_identifier = options.nth_identifier || base54;
    ast = ast.transform(new TreeTransformer(function(node) {
      if (node instanceof AST_ClassPrivateProperty || node instanceof AST_PrivateMethod || node instanceof AST_PrivateGetter || node instanceof AST_PrivateSetter || node instanceof AST_PrivateIn) {
        node.key.name = mangle_private(node.key.name);
      } else if (node instanceof AST_DotHash) {
        node.property = mangle_private(node.property);
      }
    }));
    return ast;
    function mangle_private(name) {
      let mangled = private_cache.get(name);
      if (!mangled) {
        mangled = nth_identifier.get(++cprivate);
        private_cache.set(name, mangled);
      }
      return mangled;
    }
  }
  function find_annotated_props(ast) {
    var annotated_props = /* @__PURE__ */ new Set();
    walk(ast, (node) => {
      if (node instanceof AST_ClassPrivateProperty || node instanceof AST_PrivateMethod || node instanceof AST_PrivateGetter || node instanceof AST_PrivateSetter || node instanceof AST_DotHash) {
      } else if (node instanceof AST_ObjectKeyVal) {
        if (typeof node.key == "string" && has_annotation(node, _MANGLEPROP)) {
          annotated_props.add(node.key);
        }
      } else if (node instanceof AST_ObjectProperty) {
        if (has_annotation(node, _MANGLEPROP)) {
          annotated_props.add(node.key.name);
        }
      } else if (node instanceof AST_Dot) {
        if (has_annotation(node, _MANGLEPROP)) {
          annotated_props.add(node.property);
        }
      } else if (node instanceof AST_Sub) {
        if (node.property instanceof AST_String && has_annotation(node, _MANGLEPROP)) {
          annotated_props.add(node.property.value);
        }
      }
    });
    return annotated_props;
  }
  function mangle_properties(ast, options, annotated_props = find_annotated_props(ast)) {
    options = defaults(options, {
      builtins: false,
      cache: null,
      debug: false,
      keep_quoted: false,
      nth_identifier: base54,
      only_cache: false,
      regex: null,
      reserved: null,
      undeclared: false,
      only_annotated: false
    }, true);
    var nth_identifier = options.nth_identifier;
    var reserved_option = options.reserved;
    if (!Array.isArray(reserved_option)) reserved_option = [reserved_option];
    var reserved = new Set(reserved_option);
    if (!options.builtins) find_builtins(reserved);
    var cname = -1;
    var cache;
    if (options.cache) {
      cache = options.cache.props;
    } else {
      cache = /* @__PURE__ */ new Map();
    }
    var only_annotated = options.only_annotated;
    var regex = options.regex && new RegExp(options.regex);
    var debug = options.debug !== false;
    var debug_name_suffix;
    if (debug) {
      debug_name_suffix = options.debug === true ? "" : options.debug;
    }
    var names_to_mangle = /* @__PURE__ */ new Set();
    var unmangleable = /* @__PURE__ */ new Set();
    cache.forEach((mangled_name) => unmangleable.add(mangled_name));
    var keep_quoted = !!options.keep_quoted;
    ast.walk(new TreeWalker(function(node) {
      if (node instanceof AST_ClassPrivateProperty || node instanceof AST_PrivateMethod || node instanceof AST_PrivateGetter || node instanceof AST_PrivateSetter || node instanceof AST_DotHash) {
      } else if (node instanceof AST_ObjectKeyVal) {
        if (typeof node.key == "string" && (!keep_quoted || !node.quote)) {
          add(node.key);
        }
      } else if (node instanceof AST_ObjectProperty) {
        if (!keep_quoted || !node.quote) {
          add(node.key.name);
        }
      } else if (node instanceof AST_Dot) {
        var declared = !!options.undeclared;
        if (!declared) {
          var root = node;
          while (root.expression) {
            root = root.expression;
          }
          declared = !(root.thedef && root.thedef.undeclared);
        }
        if (declared && (!keep_quoted || !node.quote)) {
          add(node.property);
        }
      } else if (node instanceof AST_Sub) {
        if (!keep_quoted) {
          addStrings(node.property, add);
        }
      } else if (node instanceof AST_Call && node.expression.print_to_string() == "Object.defineProperty") {
        addStrings(node.args[1], add);
      } else if (node instanceof AST_Binary && node.operator === "in") {
        addStrings(node.left, add);
      } else if (node instanceof AST_String && has_annotation(node, _KEY)) {
        add(node.value);
      }
    }));
    return ast.transform(new TreeTransformer(function(node) {
      if (node instanceof AST_ClassPrivateProperty || node instanceof AST_PrivateMethod || node instanceof AST_PrivateGetter || node instanceof AST_PrivateSetter || node instanceof AST_DotHash) {
      } else if (node instanceof AST_ObjectKeyVal) {
        if (typeof node.key == "string" && (!keep_quoted || !node.quote)) {
          node.key = mangle(node.key);
        }
      } else if (node instanceof AST_ObjectProperty) {
        if (!keep_quoted || !node.quote) {
          if (!node.computed_key()) {
            node.key.name = mangle(node.key.name);
          }
        }
      } else if (node instanceof AST_Dot) {
        if (!keep_quoted || !node.quote) {
          node.property = mangle(node.property);
        }
      } else if (!keep_quoted && node instanceof AST_Sub) {
        node.property = mangleStrings(node.property);
      } else if (node instanceof AST_Call && node.expression.print_to_string() == "Object.defineProperty") {
        node.args[1] = mangleStrings(node.args[1]);
      } else if (node instanceof AST_Binary && node.operator === "in") {
        node.left = mangleStrings(node.left);
      } else if (node instanceof AST_String && has_annotation(node, _KEY)) {
        clear_annotation(node, _KEY);
        node.value = mangle(node.value);
      }
    }));
    function can_mangle(name) {
      if (unmangleable.has(name)) return false;
      if (reserved.has(name)) return false;
      if (options.only_cache) {
        return cache.has(name);
      }
      if (/^-?[0-9]+(\.[0-9]+)?(e[+-][0-9]+)?$/.test(name)) return false;
      return true;
    }
    function should_mangle(name) {
      if (only_annotated && !annotated_props.has(name)) return false;
      if (regex && !regex.test(name)) {
        return annotated_props.has(name);
      }
      if (reserved.has(name)) return false;
      return cache.has(name) || names_to_mangle.has(name);
    }
    function add(name) {
      if (can_mangle(name)) {
        names_to_mangle.add(name);
      }
      if (!should_mangle(name)) {
        unmangleable.add(name);
      }
    }
    function mangle(name) {
      if (!should_mangle(name)) {
        return name;
      }
      var mangled = cache.get(name);
      if (!mangled) {
        if (debug) {
          var debug_mangled = "_$" + name + "$" + debug_name_suffix + "_";
          if (can_mangle(debug_mangled)) {
            mangled = debug_mangled;
          }
        }
        if (!mangled) {
          do {
            mangled = nth_identifier.get(++cname);
          } while (!can_mangle(mangled));
        }
        cache.set(name, mangled);
      }
      return mangled;
    }
    function mangleStrings(node) {
      return node.transform(new TreeTransformer(function(node2) {
        if (node2 instanceof AST_Sequence) {
          var last = node2.expressions.length - 1;
          node2.expressions[last] = mangleStrings(node2.expressions[last]);
        } else if (node2 instanceof AST_String) {
          clear_annotation(node2, _KEY);
          node2.value = mangle(node2.value);
        } else if (node2 instanceof AST_Conditional) {
          node2.consequent = mangleStrings(node2.consequent);
          node2.alternative = mangleStrings(node2.alternative);
        }
        return node2;
      }));
    }
  }

  // node_modules/terser/lib/minify.js
  var to_ascii = typeof Buffer !== "undefined" ? (b64) => Buffer.from(b64, "base64").toString() : (b64) => decodeURIComponent(escape(atob(b64)));
  var to_base64 = typeof Buffer !== "undefined" ? (str) => Buffer.from(str).toString("base64") : (str) => btoa(unescape(encodeURIComponent(str)));
  function read_source_map(code) {
    var match = /(?:^|[^.])\/\/# sourceMappingURL=data:application\/json(;[\w=-]*)?;base64,([+/0-9A-Za-z]*=*)\s*$/.exec(code);
    if (!match) {
      console.warn("inline source map not found");
      return null;
    }
    return to_ascii(match[2]);
  }
  function set_shorthand(name, options, keys) {
    if (options[name]) {
      keys.forEach(function(key) {
        if (options[key]) {
          if (typeof options[key] != "object") options[key] = {};
          if (!(name in options[key])) options[key][name] = options[name];
        }
      });
    }
  }
  function init_cache(cache) {
    if (!cache) return;
    if (!("props" in cache)) {
      cache.props = /* @__PURE__ */ new Map();
    } else if (!(cache.props instanceof Map)) {
      cache.props = map_from_object(cache.props);
    }
  }
  function cache_to_json(cache) {
    return {
      props: map_to_object(cache.props)
    };
  }
  function log_input(files, options, fs, debug_folder) {
    if (!(fs && fs.writeFileSync && fs.mkdirSync)) {
      return;
    }
    try {
      fs.mkdirSync(debug_folder);
    } catch (e) {
      if (e.code !== "EEXIST") throw e;
    }
    const log_path = `${debug_folder}/terser-debug-${Math.random() * 9999999 | 0}.log`;
    options = options || {};
    const options_str = JSON.stringify(options, (_key, thing) => {
      if (typeof thing === "function") return "[Function " + thing.toString() + "]";
      if (thing instanceof RegExp) return "[RegExp " + thing.toString() + "]";
      return thing;
    }, 4);
    const files_str = (file) => {
      if (typeof file === "object" && options.parse && options.parse.spidermonkey) {
        return JSON.stringify(file, null, 2);
      } else if (typeof file === "object") {
        return Object.keys(file).map((key) => key + ": " + files_str(file[key])).join("\n\n");
      } else if (typeof file === "string") {
        return "```\n" + file + "\n```";
      } else {
        return file;
      }
    };
    fs.writeFileSync(log_path, "Options: \n" + options_str + "\n\nInput files:\n\n" + files_str(files) + "\n");
  }
  function* minify_sync_or_async(files, options, _fs_module) {
    if (_fs_module && typeof process === "object" && process.env && typeof process.env.TERSER_DEBUG_DIR === "string") {
      log_input(files, options, _fs_module, process.env.TERSER_DEBUG_DIR);
    }
    options = defaults(options, {
      compress: {},
      ecma: void 0,
      enclose: false,
      ie8: false,
      keep_classnames: void 0,
      keep_fnames: false,
      mangle: {},
      module: false,
      nameCache: null,
      output: null,
      format: null,
      parse: {},
      rename: void 0,
      safari10: false,
      sourceMap: false,
      spidermonkey: false,
      timings: false,
      toplevel: false,
      warnings: false,
      wrap: false
    }, true);
    var timings = options.timings && {
      start: Date.now()
    };
    if (options.keep_classnames === void 0) {
      options.keep_classnames = options.keep_fnames;
    }
    if (options.rename === void 0) {
      options.rename = options.compress && options.mangle;
    }
    if (options.output && options.format) {
      throw new Error("Please only specify either output or format option, preferrably format.");
    }
    options.format = options.format || options.output || {};
    set_shorthand("ecma", options, ["parse", "compress", "format"]);
    set_shorthand("ie8", options, ["compress", "mangle", "format"]);
    set_shorthand("keep_classnames", options, ["compress", "mangle"]);
    set_shorthand("keep_fnames", options, ["compress", "mangle"]);
    set_shorthand("module", options, ["parse", "compress", "mangle"]);
    set_shorthand("safari10", options, ["mangle", "format"]);
    set_shorthand("toplevel", options, ["compress", "mangle"]);
    set_shorthand("warnings", options, ["compress"]);
    var quoted_props;
    if (options.mangle) {
      options.mangle = defaults(options.mangle, {
        cache: options.nameCache && (options.nameCache.vars || {}),
        eval: false,
        ie8: false,
        keep_classnames: false,
        keep_fnames: false,
        module: false,
        nth_identifier: base54,
        properties: false,
        reserved: [],
        safari10: false,
        toplevel: false
      }, true);
      if (options.mangle.properties) {
        if (typeof options.mangle.properties != "object") {
          options.mangle.properties = {};
        }
        if (options.mangle.properties.keep_quoted) {
          quoted_props = options.mangle.properties.reserved;
          if (!Array.isArray(quoted_props)) quoted_props = [];
          options.mangle.properties.reserved = quoted_props;
        }
        if (options.nameCache && !("cache" in options.mangle.properties)) {
          options.mangle.properties.cache = options.nameCache.props || {};
        }
      }
      init_cache(options.mangle.cache);
      init_cache(options.mangle.properties.cache);
    }
    if (options.sourceMap) {
      options.sourceMap = defaults(options.sourceMap, {
        asObject: false,
        content: null,
        filename: null,
        includeSources: false,
        root: null,
        url: null
      }, true);
    }
    if (timings) timings.parse = Date.now();
    var toplevel;
    if (files instanceof AST_Toplevel) {
      toplevel = files;
    } else {
      if (typeof files == "string" || options.parse.spidermonkey && !Array.isArray(files)) {
        files = [files];
      }
      options.parse = options.parse || {};
      options.parse.toplevel = null;
      if (options.parse.spidermonkey) {
        options.parse.toplevel = AST_Node.from_mozilla_ast(Object.keys(files).reduce(function(toplevel2, name2) {
          if (!toplevel2) return files[name2];
          toplevel2.body = toplevel2.body.concat(files[name2].body);
          return toplevel2;
        }, null));
      } else {
        delete options.parse.spidermonkey;
        for (var name in files) if (HOP(files, name)) {
          options.parse.filename = name;
          options.parse.toplevel = parse(files[name], options.parse);
          if (options.sourceMap && options.sourceMap.content == "inline") {
            if (Object.keys(files).length > 1)
              throw new Error("inline source map only works with singular input");
            options.sourceMap.content = read_source_map(files[name]);
          }
        }
      }
      if (options.parse.toplevel === null) {
        throw new Error("no source file given");
      }
      toplevel = options.parse.toplevel;
    }
    if (quoted_props && options.mangle.properties.keep_quoted !== "strict") {
      reserve_quoted_keys(toplevel, quoted_props);
    }
    var annotated_props;
    if (options.mangle && options.mangle.properties) {
      annotated_props = find_annotated_props(toplevel);
    }
    if (options.wrap) {
      toplevel = toplevel.wrap_commonjs(options.wrap);
    }
    if (options.enclose) {
      toplevel = toplevel.wrap_enclose(options.enclose);
    }
    if (timings) timings.rename = Date.now();
    if (0) {
      toplevel.figure_out_scope(options.mangle);
      toplevel.expand_names(options.mangle);
    }
    if (timings) timings.compress = Date.now();
    if (options.compress) {
      toplevel = new Compressor(options.compress, {
        mangle_options: options.mangle
      }).compress(toplevel);
    }
    if (timings) timings.scope = Date.now();
    if (options.mangle) toplevel.figure_out_scope(options.mangle);
    if (timings) timings.mangle = Date.now();
    if (options.mangle) {
      toplevel.compute_char_frequency(options.mangle);
      toplevel.mangle_names(options.mangle);
      toplevel = mangle_private_properties(toplevel, options.mangle);
    }
    if (timings) timings.properties = Date.now();
    if (options.mangle && options.mangle.properties) {
      toplevel = mangle_properties(toplevel, options.mangle.properties, annotated_props);
    }
    if (timings) timings.format = Date.now();
    var result = {};
    if (options.format.ast) {
      result.ast = toplevel;
    }
    if (options.format.spidermonkey) {
      result.ast = toplevel.to_mozilla_ast();
    }
    let format_options;
    if (!HOP(options.format, "code") || options.format.code) {
      format_options = { ...options.format };
      if (!format_options.ast) {
        format_options._destroy_ast = true;
        walk(toplevel, (node) => {
          if (node instanceof AST_Scope) {
            node.variables = void 0;
            node.enclosed = void 0;
            node.parent_scope = void 0;
          }
          if (node.block_scope) {
            node.block_scope.variables = void 0;
            node.block_scope.enclosed = void 0;
            node.block_scope.parent_scope = void 0;
          }
        });
      }
      if (options.sourceMap) {
        if (options.sourceMap.includeSources && files instanceof AST_Toplevel) {
          throw new Error("original source content unavailable");
        }
        format_options.source_map = yield* SourceMap({
          file: options.sourceMap.filename,
          orig: options.sourceMap.content,
          root: options.sourceMap.root,
          files: options.sourceMap.includeSources ? files : null
        });
      }
      delete format_options.ast;
      delete format_options.code;
      delete format_options.spidermonkey;
      var stream = OutputStream(format_options);
      toplevel.print(stream);
      result.code = stream.get();
      if (options.sourceMap) {
        Object.defineProperty(result, "map", {
          configurable: true,
          enumerable: true,
          get() {
            const map = format_options.source_map.getEncoded();
            return result.map = options.sourceMap.asObject ? map : JSON.stringify(map);
          },
          set(value) {
            Object.defineProperty(result, "map", {
              value,
              writable: true
            });
          }
        });
        result.decoded_map = format_options.source_map.getDecoded();
        if (options.sourceMap.url == "inline") {
          var sourceMap = typeof result.map === "object" ? JSON.stringify(result.map) : result.map;
          result.code += "\n//# sourceMappingURL=data:application/json;charset=utf-8;base64," + to_base64(sourceMap);
        } else if (options.sourceMap.url) {
          result.code += "\n//# sourceMappingURL=" + options.sourceMap.url;
        }
      }
    }
    if (options.nameCache && options.mangle) {
      if (options.mangle.cache) options.nameCache.vars = cache_to_json(options.mangle.cache);
      if (options.mangle.properties && options.mangle.properties.cache) {
        options.nameCache.props = cache_to_json(options.mangle.properties.cache);
      }
    }
    if (format_options && format_options.source_map) {
      format_options.source_map.destroy();
    }
    if (timings) {
      timings.end = Date.now();
      result.timings = {
        parse: 1e-3 * (timings.rename - timings.parse),
        rename: 1e-3 * (timings.compress - timings.rename),
        compress: 1e-3 * (timings.scope - timings.compress),
        scope: 1e-3 * (timings.mangle - timings.scope),
        mangle: 1e-3 * (timings.properties - timings.mangle),
        properties: 1e-3 * (timings.format - timings.properties),
        format: 1e-3 * (timings.end - timings.format),
        total: 1e-3 * (timings.end - timings.start)
      };
    }
    return result;
  }
  async function minify(files, options, _fs_module) {
    const gen = minify_sync_or_async(files, options, _fs_module);
    let yielded;
    let val;
    do {
      val = gen.next(await yielded);
      yielded = val.value;
    } while (!val.done);
    return val.value;
  }

  // src/compile.ts
  async function compile(runtime) {
    const compiledCode = [];
    async function obfuscateCode(code) {
      const result = await minify(code, {
        compress: true
      });
      return result.code;
    }
    function nextCompiledCode(code) {
      return compiledCode.push(code) - 1;
    }
    const yOffset = 150;
    const xOffset = 250;
    const stageSprite = runtime.getTargetForStage().sprite;
    const loadedExtensions = runtime.extensionManager._loadedExtensions;
    const workerURLs = runtime.extensionManager.workerURLs;
    const sprites = new Set(runtime.targets.map((v) => v.sprite));
    const extensionBlocks = {};
    if (loadedExtensions.size > 0) {
      for (const extension of loadedExtensions.keys()) {
        if (extension === "kylin") continue;
        let opcode = null;
        for (const sprite of sprites) {
          for (const block of Object.values(sprite.blocks._blocks)) {
            if (block.opcode.startsWith(`${extension}_`)) {
              opcode = block.opcode;
              break;
            }
          }
          if (opcode !== null) {
            break;
          }
        }
        if (opcode !== null) {
          console.log(`\u{1F512} Adding extension '${extension}' as dependency`);
          const id = uid_default();
          extensionBlocks[id] = {
            id,
            opcode,
            next: null,
            parent: null,
            inputs: {},
            fields: {},
            mutation: null,
            shadow: true,
            topLevel: true
          };
        } else {
          console.log(
            `\u274C Failed to add extension '${extension}' as dependency: skipping`
          );
        }
      }
    }
    console.log("\u{1F916} Compiling the project");
    runtime.precompile();
    console.groupCollapsed("\u{1F6E0}\uFE0F Rebuilding the project with compiled code");
    let spriteNumber = 0;
    for (const sprite of sprites) {
      console.groupCollapsed(`\u{1F47E} Working in sprite ${++spriteNumber}`);
      let hasBlock = false;
      let yIndex = 0;
      let xIndex = 0;
      const newBlocks = {};
      for (const [id, value] of Object.entries(sprite.clones[0].comments)) {
        if (sprite.clones[0].isStage && value.text.endsWith("// _twconfig_"))
          continue;
        delete sprite.clones[0].comments[id];
      }
      for (const [hatId, compiledResult] of Object.entries(
        sprite.blocks._cache.compiledScripts
      )) {
        if (compiledResult.success) {
          const hat = newBlocks[hatId] = structuredClone(
            sprite.blocks.getBlock(hatId)
          );
          if (hat.x !== void 0 && hat.x !== void 0) {
            if (yIndex > 5) {
              yIndex = 0;
              xIndex++;
            }
            ;
            hat.x = xIndex * xOffset;
            hat.y = yIndex * yOffset;
            yIndex++;
          }
          if (hat.next) {
            hasBlock = true;
            newBlocks[hat.next] = {
              id: hat.next,
              opcode: "kylinRuntime_compile",
              next: null,
              parent: hatId,
              inputs: {},
              mutation: null,
              fields: {
                code: {
                  id: null,
                  name: "code",
                  value: String(
                    nextCompiledCode(
                      await obfuscateCode(
                        compiledResult.value.startingFunction.toString()
                      )
                    )
                  )
                }
              },
              shadow: hat.shadow,
              topLevel: false
            };
            console.log(`\u{1F58B}\uFE0F Rebuilding hat ${hatId}`);
          }
        } else {
          console.error(`\u274C Failed to rebuild hat ${hatId}: compilation failed`);
        }
      }
      for (const procedureInfo of Object.values(
        sprite.blocks._cache.compiledProcedures
      )) {
        const definition = newBlocks[procedureInfo.topBlockId] = structuredClone(
          sprite.blocks.getBlock(procedureInfo.topBlockId)
        );
        if (definition.x !== void 0 && definition.y !== void 0) {
          if (yIndex > 5) {
            yIndex = 0;
            xIndex++;
          }
          ;
          definition.x = xIndex * xOffset;
          definition.y = yIndex * yOffset;
          yIndex++;
        }
        const prototype = newBlocks[definition.inputs.custom_block.block] = structuredClone(
          sprite.blocks.getBlock(definition.inputs.custom_block.block)
        );
        for (const parameterId of Object.values(prototype.inputs)) {
          if (!parameterId.block) continue;
          newBlocks[parameterId.block] = structuredClone(
            sprite.blocks.getBlock(parameterId.block)
          );
        }
        if (definition.next) {
          hasBlock = true;
          console.log(`\u{1F58B}\uFE0F Rebuilding procedure ${procedureInfo.topBlockId}`);
          newBlocks[definition.next] = {
            id: definition.next,
            opcode: "kylinRuntime_compile",
            next: null,
            parent: procedureInfo.topBlockId,
            inputs: {},
            mutation: null,
            fields: {
              code: {
                id: null,
                name: "code",
                value: String(
                  nextCompiledCode(
                    await obfuscateCode(
                      procedureInfo.cachedCompileResult.toString()
                    )
                  )
                )
              }
            },
            shadow: definition.shadow,
            topLevel: false
          };
        }
      }
      sprite.blocks._blocks = newBlocks;
      sprite.blocks.resetCache();
      if (!hasBlock) console.log("\u2139\uFE0F Nothing to do in this sprite");
      console.groupEnd();
    }
    const extensionData = `data:text/javascript;base64,${btoa(
      Array.from(
        new TextEncoder().encode(
          `// You need to allow this extension to load unsandboxed in order to run the project.
${(await minify(
            `(${async function(Scratch2, version2, sourceMap) {
              if (Scratch2.extensions.unsandboxed === false) {
                throw new Error(
                  "Kylin Runtime needs to be loaded unsandboxed."
                );
              }
              const vm = Scratch2.vm;
              const runtime2 = vm.runtime;
              if (!runtime2.precompile) {
                alert(
                  "No compiler available. Please run this project on Turbowarp."
                );
                throw new Error("No compiler available.");
              }
              Scratch2.translate.setup({
                "zh-cn": {
                  "kylinRuntime.about": "\u5173\u4E8E Kylin",
                  "kylinRuntime.compile": "(\u5DF2\u7F16\u8BD1)"
                },
                ja: {
                  "kylinRuntime.about": "Kylin \u306B\u3064\u3044\u3066",
                  "kylinRuntime.compile": "(\u30B3\u30F3\u30D1\u30A4\u30EB\u6E08)"
                }
              });
              const [baseRuntime, runtimeFunctions] = await (async () => {
                const code = await (await fetch(
                  "https://cdn.jsdelivr.net/gh/turbowarp/scratch-vm@develop/src/compiler/jsexecute.js"
                )).text();
                return new Function(
                  "require",
                  "module",
                  code + ";return [baseRuntime, runtimeFunctions]"
                )(() => void 0, { exports: {} });
              })();
              const compatBlockUtilityCode = await (async () => {
                return (await fetch(
                  "https://cdn.jsdelivr.net/gh/turbowarp/scratch-vm@develop/src/compiler/compat-block-utility.js"
                )).text();
              })();
              function requireCompatBlockUtility(util) {
                if (requireCompatBlockUtility.cache)
                  return requireCompatBlockUtility.cache;
                const module = { exports: {} };
                new Function("require", "module", compatBlockUtilityCode)(
                  () => util.constructor,
                  module
                );
                return requireCompatBlockUtility.cache = module.exports;
              }
              requireCompatBlockUtility.cache = null;
              const procedureCache = {};
              const insertRuntime = (source) => {
                let result = baseRuntime;
                for (const functionName of Object.keys(runtimeFunctions)) {
                  if (source.includes(functionName)) {
                    result += `${runtimeFunctions[functionName]};`;
                  }
                }
                result += `return ${source}`;
                return result;
              };
              const globalState = {
                Cast: Scratch2.Cast,
                log: {},
                thread: null,
                Timer: null,
                blockUtility: null
              };
              const kylinCompilerExecute = (thread) => {
                globalState.thread = thread;
                const result = thread.kylin.next();
                if (result.done && thread.status === thread.constructor.STATUS_RUNNING) {
                  thread.target.runtime.sequencer.retireThread(thread);
                }
              };
              function kylinCompileGenerator(code) {
                return new Function("globalState", insertRuntime(code))(
                  globalState
                );
              }
              console.groupCollapsed(`\u{1F6E0}\uFE0F Kylin Runtime v${version2}`);
              console.log("Kylin is based on Turbowarp compiler.");
              console.log("Kylin is distributed under the AGPL-3.0 license.");
              console.log("Copyright (c) 2024 FurryR, inspired by VeroFess");
              console.groupCollapsed("\u{1F43A} Precompiling function cache");
              const functionMap = sourceMap.map((v, index, arr) => {
                console.log(
                  `\u{1F996} Compiled function (${index + 1}/${arr.length})`
                );
                return kylinCompileGenerator(v);
              });
              console.log("\u2B50 Done!");
              console.groupEnd();
              console.groupEnd();
              class Kylin {
                constructor() {
                  const Sequencer = vm.runtime.sequencer.constructor;
                  const _stepThread = Sequencer.prototype.stepThread;
                  Sequencer.prototype.stepThread = function(thread) {
                    if (thread.kylin) {
                      kylinCompilerExecute(thread);
                    } else {
                      _stepThread.call(this, thread);
                      if (thread.kylin && thread.status === thread.constructor.STATUS_YIELD_TICK) {
                        thread.status = thread.constructor.STATUS_RUNNING;
                        kylinCompilerExecute(thread);
                      }
                    }
                  };
                }
                getInfo() {
                  return {
                    id: "kylinRuntime",
                    name: `\u{1F6E0}\uFE0F Kylin Runtime v${version2}`,
                    color1: "#00ffda",
                    blocks: [
                      {
                        blockType: Scratch2.BlockType.BUTTON,
                        text: `\u{1F916} ${Scratch2.translate({
                          id: "kylinRuntime.about",
                          default: "About Kylin",
                          description: "About"
                        })}`,
                        func: "project"
                      },
                      {
                        blockType: Scratch2.BlockType.COMMAND,
                        opcode: "compile",
                        text: Scratch2.translate({
                          id: "kylinRuntime.compile",
                          default: "(Compiled)",
                          description: "Precompile"
                        }),
                        hideFromPalette: true
                      }
                    ]
                  };
                }
                project() {
                  const link = document.createElement("a");
                  link.href = "https://github.com/FurryR/kylin-extension";
                  link.target = "_blank";
                  link.click();
                }
                compile({ code }, util) {
                  const thread = util.thread;
                  if (!globalState.Timer) {
                    util.startStackTimer(0);
                    globalState.blockUtility = requireCompatBlockUtility(util);
                    globalState.Timer = util.stackFrame.timer.constructor;
                    delete util.stackFrame.timer;
                  }
                  const fn = functionMap[Number(code)](thread);
                  if (fn instanceof function* () {
                  }.constructor) {
                    thread.kylin = fn();
                  } else {
                    thread.kylin = function* () {
                      return fn();
                    }();
                  }
                  thread.procedures = new Proxy(
                    {},
                    {
                      get(_, procedureSignature) {
                        if (typeof procedureSignature === "symbol")
                          throw new Error("Unexpected procedure signature");
                        let realSignature = procedureSignature.substring(1);
                        const spriteName = thread.target.sprite.name;
                        if (spriteName in procedureCache && realSignature in procedureCache[spriteName]) {
                          return procedureCache[spriteName][realSignature](
                            thread
                          );
                        }
                        const prototypes = Object.values(
                          thread.blockContainer._blocks
                        ).filter(
                          (v) => v.opcode === "procedures_definition"
                        ).map(
                          (v) => thread.blockContainer._blocks[v.inputs.custom_block.block]
                        );
                        for (const prototype of prototypes) {
                          const rawSignature = prototype.mutation.proccode;
                          if (realSignature === rawSignature) {
                            const definition = thread.blockContainer._blocks[prototype.parent];
                            const compileCode = definition.next ? thread.blockContainer._blocks[definition.next] : null;
                            if (compileCode && compileCode.opcode === "kylinRuntime_compile") {
                              if (!(spriteName in procedureCache))
                                procedureCache[spriteName] = {};
                              return (procedureCache[spriteName][realSignature] = functionMap[Number(compileCode.fields.code.value)])(thread);
                            }
                            break;
                          }
                        }
                        return function() {
                          console.error(
                            `Kylin: Unknown procedure signature ${procedureSignature}`
                          );
                          return {
                            [Symbol.iterator]: () => ({
                              next: () => ({
                                done: true,
                                value: ""
                              })
                            })
                          };
                        };
                      }
                    }
                  );
                  return util.yieldTick();
                }
              }
              Scratch2.extensions.register(new Kylin());
            }.toString()})(Scratch, ${JSON.stringify(version)}, ${JSON.stringify(compiledCode)})`
          )).code}`
        )
      ).map((v) => String.fromCodePoint(v)).join("")
    )}`;
    Object.assign(stageSprite.blocks._blocks, extensionBlocks);
    console.log("\u{1F53D} Injecting Kylin Runtime");
    if (loadedExtensions.has("kylinRuntime")) {
      const serviceName = loadedExtensions.get("kylinRuntime");
      const workerIndex = Number(serviceName.split(".")[1]);
      workerURLs[workerIndex] = extensionData;
    } else {
      loadedExtensions.set(
        "kylinRuntime",
        `unsandboxed.${workerURLs.length}.kylinRuntime`
      );
      workerURLs.push(extensionData);
    }
    console.groupEnd();
  }

  // src/index.ts
  (async function(Scratch2) {
    if (Scratch2.extensions.unsandboxed === false) {
      throw new Error("Sandboxed mode is not supported");
    }
    const vm = Scratch2.vm;
    const runtime = vm.runtime;
    if (!runtime.precompile) {
      alert(
        Scratch2.translate({
          id: "kylin.error.noCompilerAvailable",
          default: "No compiler available. Please run this script on Turbowarp.",
          description: "No compiler available right now."
        })
      );
      throw new Error("No compiler available.");
    }
    if (runtime.gandi) {
      alert(
        Scratch2.translate({
          id: "kylin.error.gandi",
          default: "Gandi IDE is not supported yet. Please run this script on Turbowarp.",
          description: "Gandi IDE is not supported."
        })
      );
      throw new Error("Gandi IDE is not supported.");
    }
    console.groupCollapsed(`\u{1F6E0}\uFE0F Kylin v${version}`);
    console.log("Kylin is based on Turbowarp compiler.");
    console.log("Kylin compiler is distributed under the AGPL-3.0 license.");
    console.log("Copyright (c) 2024 FurryR, inspired by VeroFess");
    console.groupEnd();
    class KylinScratch {
      enableCompile = true;
      enableObfuscate = true;
      compiling = false;
      inputComment;
      inputUUID;
      meta = {
        isKylin: false,
        isObfuscated: false,
        isCompiled: false,
        uuid: null,
        comment: null
      };
      constructor() {
        const update = (isWorkspaceUpdate) => {
          this.meta = Obfuscator.fetchMeta(runtime.targets);
          if (isWorkspaceUpdate) vm.extensionManager.refreshBlocks();
        };
        vm.on("workspaceUpdate", () => update(true));
        update(false);
      }
      getInfo() {
        return {
          id: "kylin",
          name: `\u{1F6E0}\uFE0F Kylin v${version}`,
          color1: "#00ffda",
          blocks: this.meta.isKylin && !this.compiling ? [
            {
              blockType: Scratch2.BlockType.BUTTON,
              text: `\u{1F50D} ${Scratch2.translate({ id: "kylin.hint.about", default: "About Kylin", description: "About kylin obfuscator" })}`,
              func: "project"
            },
            "---",
            {
              blockType: Scratch2.BlockType.LABEL,
              text: `${this.meta.isObfuscated ? "\u2705" : "\u274C"} ${Scratch2.translate({ id: "kylin.hint.obfuscated", default: "Obfuscation", description: "Is the project obfuscated?" })}`
            },
            {
              blockType: Scratch2.BlockType.LABEL,
              text: `${this.meta.isCompiled ? "\u2705" : "\u274C"} ${Scratch2.translate({ id: "kylin.hint.precompiled", default: "Precompilation", description: "Is the project precompiled?" })}`
            },
            ...this.meta.comment ? [
              {
                blockType: Scratch2.BlockType.LABEL,
                text: `\u{1F4C4} ${Scratch2.translate({ id: "kylin.hint.comment", default: "Comment", description: "Comment" })}: ${this.meta.comment}`
              }
            ] : [],
            {
              blockType: Scratch2.BlockType.LABEL,
              text: `\u{1F511} UUID: ${this.meta.uuid}`
            }
          ] : this.compiling ? [
            {
              blockType: Scratch2.BlockType.BUTTON,
              text: `\u{1F50D} ${Scratch2.translate({ id: "kylin.hint.about", default: "About Kylin", description: "About kylin obfuscator" })}`,
              func: "project"
            },
            "---",
            {
              blockType: Scratch2.BlockType.LABEL,
              text: `\u{1F43A} ${Scratch2.translate({ id: "kylin.hint.loading", default: "Loading...", description: "Loading placeholder" })}`
            }
          ] : [
            {
              blockType: Scratch2.BlockType.BUTTON,
              text: `\u{1F50D} ${Scratch2.translate({ id: "kylin.hint.about", default: "About Kylin", description: "About kylin obfuscator" })}`,
              func: "project"
            },
            "---",
            {
              blockType: Scratch2.BlockType.BUTTON,
              text: `${this.enableObfuscate ? "\u2705" : "\u274C"} ${Scratch2.translate({ id: "kylin.hint.obfuscated", default: "Obfuscation", description: "Enable/disable source code protection." })}`,
              func: "switchObfuscate"
            },
            {
              blockType: Scratch2.BlockType.BUTTON,
              text: `${this.enableCompile ? "\u2705" : "\u274C"} ${Scratch2.translate({ id: "kylin.hint.precompiled", default: "Precompilation", description: "Enable/disable precompilation." })}`,
              func: "switchPrecompile"
            },
            "---",
            {
              blockType: Scratch2.BlockType.BUTTON,
              text: `\u{1F4C4} ${Scratch2.translate({ id: "kylin.button.comments", default: "Comments", description: "Editing comments." })}`,
              func: "comment"
            },
            {
              blockType: Scratch2.BlockType.BUTTON,
              text: `\u{1F511} ${Scratch2.translate({ id: "kylin.button.uuid", default: "UUID (Advanced)", description: "Editing UUID (advanced)." })}`,
              func: "uuid"
            },
            "---",
            {
              blockType: Scratch2.BlockType.BUTTON,
              text: `\u{1F916} ${Scratch2.translate({ id: "kylin.button.proceed", default: "Proceed", description: "Proceed button." })}`,
              func: "start"
            }
          ]
        };
      }
      project() {
        const link = document.createElement("a");
        link.href = "https://github.com/FurryR/kylin-extension";
        link.target = "_blank";
        link.click();
      }
      switchObfuscate() {
        if (this.compiling) return;
        this.enableObfuscate = !this.enableObfuscate;
        vm.extensionManager.refreshBlocks();
      }
      switchPrecompile() {
        if (this.compiling) return;
        this.enableCompile = !this.enableCompile;
        vm.extensionManager.refreshBlocks();
      }
      comment() {
        this.inputComment = window.prompt(
          Scratch2.translate({
            id: "kylin.popup.comment",
            default: "Please input the project's comment.",
            description: "Editing comment popup."
          }),
          this.inputComment ?? ""
        );
      }
      uuid() {
        const uuid = window.prompt(
          Scratch2.translate({
            id: "kylin.popup.uuid",
            default: "Please input the project's v4 UUID.",
            description: "Editing UUID popup."
          }),
          this.inputUUID ?? ""
        );
        if (!uuid) return;
        if (uuid.length !== 36 || !Array.from(uuid.toLowerCase()).filter((x) => x !== "-").every((x) => InvisibleUUID.hex.includes(x))) {
          alert("Invalid v4 UUID.");
          return;
        }
        this.inputUUID = uuid.toLowerCase();
      }
      async start() {
        this.compiling = true;
        vm.extensionManager.refreshBlocks();
        const _step = runtime._step;
        runtime._step = function() {
        };
        if (this.enableObfuscate) Obfuscator.obfuscate(runtime);
        if (this.enableCompile) await compile(runtime);
        Obfuscator.addMeta(runtime, {
          isObfuscated: this.enableObfuscate,
          isCompiled: this.enableCompile,
          comment: this.inputComment,
          uuid: this.inputUUID
        });
        console.log("\u{1F4C2} Repacking the project.");
        const blob = await vm.saveProjectSb3();
        if (!runtime._primitives["kylinRuntime_compile"]) {
          const loadedExtensions = runtime.extensionManager._loadedExtensions;
          const workerURLs = runtime.extensionManager.workerURLs;
          const serviceName = loadedExtensions.get("kylinRuntime");
          if (serviceName) {
            const workerIndex = Number(serviceName.split(".")[1]);
            workerURLs[workerIndex] = "";
          }
          loadedExtensions.delete("kylinRuntime");
        }
        this.compiling = false;
        await vm.loadProject(await blob.arrayBuffer());
        runtime._step = _step;
      }
    }
    Scratch2.extensions.register(new KylinScratch());
  })(Scratch);

  // src/withL10n.ts
  (function(Scratch2) {
    Scratch2.translate.setup(l10n_default);
  })(Scratch);
})();
