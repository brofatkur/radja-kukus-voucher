"use strict";
var InsForgeSDK = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require2() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
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
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/@supabase/node-fetch/browser.js
  var browser_exports = {};
  __export(browser_exports, {
    Headers: () => Headers2,
    Request: () => Request2,
    Response: () => Response2,
    default: () => browser_default,
    fetch: () => fetch2
  });
  var getGlobal, globalObject, fetch2, browser_default, Headers2, Request2, Response2;
  var init_browser = __esm({
    "node_modules/@supabase/node-fetch/browser.js"() {
      "use strict";
      getGlobal = function() {
        if (typeof self !== "undefined") {
          return self;
        }
        if (typeof window !== "undefined") {
          return window;
        }
        if (typeof global !== "undefined") {
          return global;
        }
        throw new Error("unable to locate global object");
      };
      globalObject = getGlobal();
      fetch2 = globalObject.fetch;
      browser_default = globalObject.fetch.bind(globalObject);
      Headers2 = globalObject.Headers;
      Request2 = globalObject.Request;
      Response2 = globalObject.Response;
    }
  });

  // node_modules/@supabase/postgrest-js/dist/cjs/PostgrestError.js
  var require_PostgrestError = __commonJS({
    "node_modules/@supabase/postgrest-js/dist/cjs/PostgrestError.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var PostgrestError = class extends Error {
        constructor(context) {
          super(context.message);
          this.name = "PostgrestError";
          this.details = context.details;
          this.hint = context.hint;
          this.code = context.code;
        }
      };
      exports.default = PostgrestError;
    }
  });

  // node_modules/@supabase/postgrest-js/dist/cjs/PostgrestBuilder.js
  var require_PostgrestBuilder = __commonJS({
    "node_modules/@supabase/postgrest-js/dist/cjs/PostgrestBuilder.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var node_fetch_1 = __importDefault((init_browser(), __toCommonJS(browser_exports)));
      var PostgrestError_1 = __importDefault(require_PostgrestError());
      var PostgrestBuilder = class {
        constructor(builder) {
          var _a, _b;
          this.shouldThrowOnError = false;
          this.method = builder.method;
          this.url = builder.url;
          this.headers = new Headers(builder.headers);
          this.schema = builder.schema;
          this.body = builder.body;
          this.shouldThrowOnError = (_a = builder.shouldThrowOnError) !== null && _a !== void 0 ? _a : false;
          this.signal = builder.signal;
          this.isMaybeSingle = (_b = builder.isMaybeSingle) !== null && _b !== void 0 ? _b : false;
          if (builder.fetch) {
            this.fetch = builder.fetch;
          } else if (typeof fetch === "undefined") {
            this.fetch = node_fetch_1.default;
          } else {
            this.fetch = fetch;
          }
        }
        /**
         * If there's an error with the query, throwOnError will reject the promise by
         * throwing the error instead of returning it as part of a successful response.
         *
         * {@link https://github.com/supabase/supabase-js/issues/92}
         */
        throwOnError() {
          this.shouldThrowOnError = true;
          return this;
        }
        /**
         * Set an HTTP header for the request.
         */
        setHeader(name, value2) {
          this.headers = new Headers(this.headers);
          this.headers.set(name, value2);
          return this;
        }
        then(onfulfilled, onrejected) {
          if (this.schema === void 0) {
          } else if (["GET", "HEAD"].includes(this.method)) {
            this.headers.set("Accept-Profile", this.schema);
          } else {
            this.headers.set("Content-Profile", this.schema);
          }
          if (this.method !== "GET" && this.method !== "HEAD") {
            this.headers.set("Content-Type", "application/json");
          }
          const _fetch = this.fetch;
          let res = _fetch(this.url.toString(), {
            method: this.method,
            headers: this.headers,
            body: JSON.stringify(this.body),
            signal: this.signal
          }).then(async (res2) => {
            var _a, _b, _c, _d;
            let error = null;
            let data = null;
            let count = null;
            let status = res2.status;
            let statusText = res2.statusText;
            if (res2.ok) {
              if (this.method !== "HEAD") {
                const body = await res2.text();
                if (body === "") {
                } else if (this.headers.get("Accept") === "text/csv") {
                  data = body;
                } else if (this.headers.get("Accept") && ((_a = this.headers.get("Accept")) === null || _a === void 0 ? void 0 : _a.includes("application/vnd.pgrst.plan+text"))) {
                  data = body;
                } else {
                  data = JSON.parse(body);
                }
              }
              const countHeader = (_b = this.headers.get("Prefer")) === null || _b === void 0 ? void 0 : _b.match(/count=(exact|planned|estimated)/);
              const contentRange = (_c = res2.headers.get("content-range")) === null || _c === void 0 ? void 0 : _c.split("/");
              if (countHeader && contentRange && contentRange.length > 1) {
                count = parseInt(contentRange[1]);
              }
              if (this.isMaybeSingle && this.method === "GET" && Array.isArray(data)) {
                if (data.length > 1) {
                  error = {
                    // https://github.com/PostgREST/postgrest/blob/a867d79c42419af16c18c3fb019eba8df992626f/src/PostgREST/Error.hs#L553
                    code: "PGRST116",
                    details: `Results contain ${data.length} rows, application/vnd.pgrst.object+json requires 1 row`,
                    hint: null,
                    message: "JSON object requested, multiple (or no) rows returned"
                  };
                  data = null;
                  count = null;
                  status = 406;
                  statusText = "Not Acceptable";
                } else if (data.length === 1) {
                  data = data[0];
                } else {
                  data = null;
                }
              }
            } else {
              const body = await res2.text();
              try {
                error = JSON.parse(body);
                if (Array.isArray(error) && res2.status === 404) {
                  data = [];
                  error = null;
                  status = 200;
                  statusText = "OK";
                }
              } catch (_e) {
                if (res2.status === 404 && body === "") {
                  status = 204;
                  statusText = "No Content";
                } else {
                  error = {
                    message: body
                  };
                }
              }
              if (error && this.isMaybeSingle && ((_d = error === null || error === void 0 ? void 0 : error.details) === null || _d === void 0 ? void 0 : _d.includes("0 rows"))) {
                error = null;
                status = 200;
                statusText = "OK";
              }
              if (error && this.shouldThrowOnError) {
                throw new PostgrestError_1.default(error);
              }
            }
            const postgrestResponse = {
              error,
              data,
              count,
              status,
              statusText
            };
            return postgrestResponse;
          });
          if (!this.shouldThrowOnError) {
            res = res.catch((fetchError) => {
              var _a, _b, _c;
              return {
                error: {
                  message: `${(_a = fetchError === null || fetchError === void 0 ? void 0 : fetchError.name) !== null && _a !== void 0 ? _a : "FetchError"}: ${fetchError === null || fetchError === void 0 ? void 0 : fetchError.message}`,
                  details: `${(_b = fetchError === null || fetchError === void 0 ? void 0 : fetchError.stack) !== null && _b !== void 0 ? _b : ""}`,
                  hint: "",
                  code: `${(_c = fetchError === null || fetchError === void 0 ? void 0 : fetchError.code) !== null && _c !== void 0 ? _c : ""}`
                },
                data: null,
                count: null,
                status: 0,
                statusText: ""
              };
            });
          }
          return res.then(onfulfilled, onrejected);
        }
        /**
         * Override the type of the returned `data`.
         *
         * @typeParam NewResult - The new result type to override with
         * @deprecated Use overrideTypes<yourType, { merge: false }>() method at the end of your call chain instead
         */
        returns() {
          return this;
        }
        /**
         * Override the type of the returned `data` field in the response.
         *
         * @typeParam NewResult - The new type to cast the response data to
         * @typeParam Options - Optional type configuration (defaults to { merge: true })
         * @typeParam Options.merge - When true, merges the new type with existing return type. When false, replaces the existing types entirely (defaults to true)
         * @example
         * ```typescript
         * // Merge with existing types (default behavior)
         * const query = supabase
         *   .from('users')
         *   .select()
         *   .overrideTypes<{ custom_field: string }>()
         *
         * // Replace existing types completely
         * const replaceQuery = supabase
         *   .from('users')
         *   .select()
         *   .overrideTypes<{ id: number; name: string }, { merge: false }>()
         * ```
         * @returns A PostgrestBuilder instance with the new type
         */
        overrideTypes() {
          return this;
        }
      };
      exports.default = PostgrestBuilder;
    }
  });

  // node_modules/@supabase/postgrest-js/dist/cjs/PostgrestTransformBuilder.js
  var require_PostgrestTransformBuilder = __commonJS({
    "node_modules/@supabase/postgrest-js/dist/cjs/PostgrestTransformBuilder.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var PostgrestBuilder_1 = __importDefault(require_PostgrestBuilder());
      var PostgrestTransformBuilder = class extends PostgrestBuilder_1.default {
        /**
         * Perform a SELECT on the query result.
         *
         * By default, `.insert()`, `.update()`, `.upsert()`, and `.delete()` do not
         * return modified rows. By calling this method, modified rows are returned in
         * `data`.
         *
         * @param columns - The columns to retrieve, separated by commas
         */
        select(columns) {
          let quoted = false;
          const cleanedColumns = (columns !== null && columns !== void 0 ? columns : "*").split("").map((c) => {
            if (/\s/.test(c) && !quoted) {
              return "";
            }
            if (c === '"') {
              quoted = !quoted;
            }
            return c;
          }).join("");
          this.url.searchParams.set("select", cleanedColumns);
          this.headers.append("Prefer", "return=representation");
          return this;
        }
        /**
         * Order the query result by `column`.
         *
         * You can call this method multiple times to order by multiple columns.
         *
         * You can order referenced tables, but it only affects the ordering of the
         * parent table if you use `!inner` in the query.
         *
         * @param column - The column to order by
         * @param options - Named parameters
         * @param options.ascending - If `true`, the result will be in ascending order
         * @param options.nullsFirst - If `true`, `null`s appear first. If `false`,
         * `null`s appear last.
         * @param options.referencedTable - Set this to order a referenced table by
         * its columns
         * @param options.foreignTable - Deprecated, use `options.referencedTable`
         * instead
         */
        order(column, { ascending = true, nullsFirst, foreignTable, referencedTable = foreignTable } = {}) {
          const key = referencedTable ? `${referencedTable}.order` : "order";
          const existingOrder = this.url.searchParams.get(key);
          this.url.searchParams.set(key, `${existingOrder ? `${existingOrder},` : ""}${column}.${ascending ? "asc" : "desc"}${nullsFirst === void 0 ? "" : nullsFirst ? ".nullsfirst" : ".nullslast"}`);
          return this;
        }
        /**
         * Limit the query result by `count`.
         *
         * @param count - The maximum number of rows to return
         * @param options - Named parameters
         * @param options.referencedTable - Set this to limit rows of referenced
         * tables instead of the parent table
         * @param options.foreignTable - Deprecated, use `options.referencedTable`
         * instead
         */
        limit(count, { foreignTable, referencedTable = foreignTable } = {}) {
          const key = typeof referencedTable === "undefined" ? "limit" : `${referencedTable}.limit`;
          this.url.searchParams.set(key, `${count}`);
          return this;
        }
        /**
         * Limit the query result by starting at an offset `from` and ending at the offset `to`.
         * Only records within this range are returned.
         * This respects the query order and if there is no order clause the range could behave unexpectedly.
         * The `from` and `to` values are 0-based and inclusive: `range(1, 3)` will include the second, third
         * and fourth rows of the query.
         *
         * @param from - The starting index from which to limit the result
         * @param to - The last index to which to limit the result
         * @param options - Named parameters
         * @param options.referencedTable - Set this to limit rows of referenced
         * tables instead of the parent table
         * @param options.foreignTable - Deprecated, use `options.referencedTable`
         * instead
         */
        range(from, to, { foreignTable, referencedTable = foreignTable } = {}) {
          const keyOffset = typeof referencedTable === "undefined" ? "offset" : `${referencedTable}.offset`;
          const keyLimit = typeof referencedTable === "undefined" ? "limit" : `${referencedTable}.limit`;
          this.url.searchParams.set(keyOffset, `${from}`);
          this.url.searchParams.set(keyLimit, `${to - from + 1}`);
          return this;
        }
        /**
         * Set the AbortSignal for the fetch request.
         *
         * @param signal - The AbortSignal to use for the fetch request
         */
        abortSignal(signal) {
          this.signal = signal;
          return this;
        }
        /**
         * Return `data` as a single object instead of an array of objects.
         *
         * Query result must be one row (e.g. using `.limit(1)`), otherwise this
         * returns an error.
         */
        single() {
          this.headers.set("Accept", "application/vnd.pgrst.object+json");
          return this;
        }
        /**
         * Return `data` as a single object instead of an array of objects.
         *
         * Query result must be zero or one row (e.g. using `.limit(1)`), otherwise
         * this returns an error.
         */
        maybeSingle() {
          if (this.method === "GET") {
            this.headers.set("Accept", "application/json");
          } else {
            this.headers.set("Accept", "application/vnd.pgrst.object+json");
          }
          this.isMaybeSingle = true;
          return this;
        }
        /**
         * Return `data` as a string in CSV format.
         */
        csv() {
          this.headers.set("Accept", "text/csv");
          return this;
        }
        /**
         * Return `data` as an object in [GeoJSON](https://geojson.org) format.
         */
        geojson() {
          this.headers.set("Accept", "application/geo+json");
          return this;
        }
        /**
         * Return `data` as the EXPLAIN plan for the query.
         *
         * You need to enable the
         * [db_plan_enabled](https://supabase.com/docs/guides/database/debugging-performance#enabling-explain)
         * setting before using this method.
         *
         * @param options - Named parameters
         *
         * @param options.analyze - If `true`, the query will be executed and the
         * actual run time will be returned
         *
         * @param options.verbose - If `true`, the query identifier will be returned
         * and `data` will include the output columns of the query
         *
         * @param options.settings - If `true`, include information on configuration
         * parameters that affect query planning
         *
         * @param options.buffers - If `true`, include information on buffer usage
         *
         * @param options.wal - If `true`, include information on WAL record generation
         *
         * @param options.format - The format of the output, can be `"text"` (default)
         * or `"json"`
         */
        explain({ analyze = false, verbose = false, settings = false, buffers = false, wal = false, format = "text" } = {}) {
          var _a;
          const options = [
            analyze ? "analyze" : null,
            verbose ? "verbose" : null,
            settings ? "settings" : null,
            buffers ? "buffers" : null,
            wal ? "wal" : null
          ].filter(Boolean).join("|");
          const forMediatype = (_a = this.headers.get("Accept")) !== null && _a !== void 0 ? _a : "application/json";
          this.headers.set("Accept", `application/vnd.pgrst.plan+${format}; for="${forMediatype}"; options=${options};`);
          if (format === "json") {
            return this;
          } else {
            return this;
          }
        }
        /**
         * Rollback the query.
         *
         * `data` will still be returned, but the query is not committed.
         */
        rollback() {
          this.headers.append("Prefer", "tx=rollback");
          return this;
        }
        /**
         * Override the type of the returned `data`.
         *
         * @typeParam NewResult - The new result type to override with
         * @deprecated Use overrideTypes<yourType, { merge: false }>() method at the end of your call chain instead
         */
        returns() {
          return this;
        }
        /**
         * Set the maximum number of rows that can be affected by the query.
         * Only available in PostgREST v13+ and only works with PATCH and DELETE methods.
         *
         * @param value - The maximum number of rows that can be affected
         */
        maxAffected(value2) {
          this.headers.append("Prefer", "handling=strict");
          this.headers.append("Prefer", `max-affected=${value2}`);
          return this;
        }
      };
      exports.default = PostgrestTransformBuilder;
    }
  });

  // node_modules/@supabase/postgrest-js/dist/cjs/PostgrestFilterBuilder.js
  var require_PostgrestFilterBuilder = __commonJS({
    "node_modules/@supabase/postgrest-js/dist/cjs/PostgrestFilterBuilder.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var PostgrestTransformBuilder_1 = __importDefault(require_PostgrestTransformBuilder());
      var PostgrestFilterBuilder = class extends PostgrestTransformBuilder_1.default {
        /**
         * Match only rows where `column` is equal to `value`.
         *
         * To check if the value of `column` is NULL, you should use `.is()` instead.
         *
         * @param column - The column to filter on
         * @param value - The value to filter with
         */
        eq(column, value2) {
          this.url.searchParams.append(column, `eq.${value2}`);
          return this;
        }
        /**
         * Match only rows where `column` is not equal to `value`.
         *
         * @param column - The column to filter on
         * @param value - The value to filter with
         */
        neq(column, value2) {
          this.url.searchParams.append(column, `neq.${value2}`);
          return this;
        }
        /**
         * Match only rows where `column` is greater than `value`.
         *
         * @param column - The column to filter on
         * @param value - The value to filter with
         */
        gt(column, value2) {
          this.url.searchParams.append(column, `gt.${value2}`);
          return this;
        }
        /**
         * Match only rows where `column` is greater than or equal to `value`.
         *
         * @param column - The column to filter on
         * @param value - The value to filter with
         */
        gte(column, value2) {
          this.url.searchParams.append(column, `gte.${value2}`);
          return this;
        }
        /**
         * Match only rows where `column` is less than `value`.
         *
         * @param column - The column to filter on
         * @param value - The value to filter with
         */
        lt(column, value2) {
          this.url.searchParams.append(column, `lt.${value2}`);
          return this;
        }
        /**
         * Match only rows where `column` is less than or equal to `value`.
         *
         * @param column - The column to filter on
         * @param value - The value to filter with
         */
        lte(column, value2) {
          this.url.searchParams.append(column, `lte.${value2}`);
          return this;
        }
        /**
         * Match only rows where `column` matches `pattern` case-sensitively.
         *
         * @param column - The column to filter on
         * @param pattern - The pattern to match with
         */
        like(column, pattern) {
          this.url.searchParams.append(column, `like.${pattern}`);
          return this;
        }
        /**
         * Match only rows where `column` matches all of `patterns` case-sensitively.
         *
         * @param column - The column to filter on
         * @param patterns - The patterns to match with
         */
        likeAllOf(column, patterns) {
          this.url.searchParams.append(column, `like(all).{${patterns.join(",")}}`);
          return this;
        }
        /**
         * Match only rows where `column` matches any of `patterns` case-sensitively.
         *
         * @param column - The column to filter on
         * @param patterns - The patterns to match with
         */
        likeAnyOf(column, patterns) {
          this.url.searchParams.append(column, `like(any).{${patterns.join(",")}}`);
          return this;
        }
        /**
         * Match only rows where `column` matches `pattern` case-insensitively.
         *
         * @param column - The column to filter on
         * @param pattern - The pattern to match with
         */
        ilike(column, pattern) {
          this.url.searchParams.append(column, `ilike.${pattern}`);
          return this;
        }
        /**
         * Match only rows where `column` matches all of `patterns` case-insensitively.
         *
         * @param column - The column to filter on
         * @param patterns - The patterns to match with
         */
        ilikeAllOf(column, patterns) {
          this.url.searchParams.append(column, `ilike(all).{${patterns.join(",")}}`);
          return this;
        }
        /**
         * Match only rows where `column` matches any of `patterns` case-insensitively.
         *
         * @param column - The column to filter on
         * @param patterns - The patterns to match with
         */
        ilikeAnyOf(column, patterns) {
          this.url.searchParams.append(column, `ilike(any).{${patterns.join(",")}}`);
          return this;
        }
        /**
         * Match only rows where `column` IS `value`.
         *
         * For non-boolean columns, this is only relevant for checking if the value of
         * `column` is NULL by setting `value` to `null`.
         *
         * For boolean columns, you can also set `value` to `true` or `false` and it
         * will behave the same way as `.eq()`.
         *
         * @param column - The column to filter on
         * @param value - The value to filter with
         */
        is(column, value2) {
          this.url.searchParams.append(column, `is.${value2}`);
          return this;
        }
        /**
         * Match only rows where `column` is included in the `values` array.
         *
         * @param column - The column to filter on
         * @param values - The values array to filter with
         */
        in(column, values) {
          const cleanedValues = Array.from(new Set(values)).map((s) => {
            if (typeof s === "string" && new RegExp("[,()]").test(s))
              return `"${s}"`;
            else
              return `${s}`;
          }).join(",");
          this.url.searchParams.append(column, `in.(${cleanedValues})`);
          return this;
        }
        /**
         * Only relevant for jsonb, array, and range columns. Match only rows where
         * `column` contains every element appearing in `value`.
         *
         * @param column - The jsonb, array, or range column to filter on
         * @param value - The jsonb, array, or range value to filter with
         */
        contains(column, value2) {
          if (typeof value2 === "string") {
            this.url.searchParams.append(column, `cs.${value2}`);
          } else if (Array.isArray(value2)) {
            this.url.searchParams.append(column, `cs.{${value2.join(",")}}`);
          } else {
            this.url.searchParams.append(column, `cs.${JSON.stringify(value2)}`);
          }
          return this;
        }
        /**
         * Only relevant for jsonb, array, and range columns. Match only rows where
         * every element appearing in `column` is contained by `value`.
         *
         * @param column - The jsonb, array, or range column to filter on
         * @param value - The jsonb, array, or range value to filter with
         */
        containedBy(column, value2) {
          if (typeof value2 === "string") {
            this.url.searchParams.append(column, `cd.${value2}`);
          } else if (Array.isArray(value2)) {
            this.url.searchParams.append(column, `cd.{${value2.join(",")}}`);
          } else {
            this.url.searchParams.append(column, `cd.${JSON.stringify(value2)}`);
          }
          return this;
        }
        /**
         * Only relevant for range columns. Match only rows where every element in
         * `column` is greater than any element in `range`.
         *
         * @param column - The range column to filter on
         * @param range - The range to filter with
         */
        rangeGt(column, range) {
          this.url.searchParams.append(column, `sr.${range}`);
          return this;
        }
        /**
         * Only relevant for range columns. Match only rows where every element in
         * `column` is either contained in `range` or greater than any element in
         * `range`.
         *
         * @param column - The range column to filter on
         * @param range - The range to filter with
         */
        rangeGte(column, range) {
          this.url.searchParams.append(column, `nxl.${range}`);
          return this;
        }
        /**
         * Only relevant for range columns. Match only rows where every element in
         * `column` is less than any element in `range`.
         *
         * @param column - The range column to filter on
         * @param range - The range to filter with
         */
        rangeLt(column, range) {
          this.url.searchParams.append(column, `sl.${range}`);
          return this;
        }
        /**
         * Only relevant for range columns. Match only rows where every element in
         * `column` is either contained in `range` or less than any element in
         * `range`.
         *
         * @param column - The range column to filter on
         * @param range - The range to filter with
         */
        rangeLte(column, range) {
          this.url.searchParams.append(column, `nxr.${range}`);
          return this;
        }
        /**
         * Only relevant for range columns. Match only rows where `column` is
         * mutually exclusive to `range` and there can be no element between the two
         * ranges.
         *
         * @param column - The range column to filter on
         * @param range - The range to filter with
         */
        rangeAdjacent(column, range) {
          this.url.searchParams.append(column, `adj.${range}`);
          return this;
        }
        /**
         * Only relevant for array and range columns. Match only rows where
         * `column` and `value` have an element in common.
         *
         * @param column - The array or range column to filter on
         * @param value - The array or range value to filter with
         */
        overlaps(column, value2) {
          if (typeof value2 === "string") {
            this.url.searchParams.append(column, `ov.${value2}`);
          } else {
            this.url.searchParams.append(column, `ov.{${value2.join(",")}}`);
          }
          return this;
        }
        /**
         * Only relevant for text and tsvector columns. Match only rows where
         * `column` matches the query string in `query`.
         *
         * @param column - The text or tsvector column to filter on
         * @param query - The query text to match with
         * @param options - Named parameters
         * @param options.config - The text search configuration to use
         * @param options.type - Change how the `query` text is interpreted
         */
        textSearch(column, query, { config, type } = {}) {
          let typePart = "";
          if (type === "plain") {
            typePart = "pl";
          } else if (type === "phrase") {
            typePart = "ph";
          } else if (type === "websearch") {
            typePart = "w";
          }
          const configPart = config === void 0 ? "" : `(${config})`;
          this.url.searchParams.append(column, `${typePart}fts${configPart}.${query}`);
          return this;
        }
        /**
         * Match only rows where each column in `query` keys is equal to its
         * associated value. Shorthand for multiple `.eq()`s.
         *
         * @param query - The object to filter with, with column names as keys mapped
         * to their filter values
         */
        match(query) {
          Object.entries(query).forEach(([column, value2]) => {
            this.url.searchParams.append(column, `eq.${value2}`);
          });
          return this;
        }
        /**
         * Match only rows which doesn't satisfy the filter.
         *
         * Unlike most filters, `opearator` and `value` are used as-is and need to
         * follow [PostgREST
         * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
         * to make sure they are properly sanitized.
         *
         * @param column - The column to filter on
         * @param operator - The operator to be negated to filter with, following
         * PostgREST syntax
         * @param value - The value to filter with, following PostgREST syntax
         */
        not(column, operator, value2) {
          this.url.searchParams.append(column, `not.${operator}.${value2}`);
          return this;
        }
        /**
         * Match only rows which satisfy at least one of the filters.
         *
         * Unlike most filters, `filters` is used as-is and needs to follow [PostgREST
         * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
         * to make sure it's properly sanitized.
         *
         * It's currently not possible to do an `.or()` filter across multiple tables.
         *
         * @param filters - The filters to use, following PostgREST syntax
         * @param options - Named parameters
         * @param options.referencedTable - Set this to filter on referenced tables
         * instead of the parent table
         * @param options.foreignTable - Deprecated, use `referencedTable` instead
         */
        or(filters, { foreignTable, referencedTable = foreignTable } = {}) {
          const key = referencedTable ? `${referencedTable}.or` : "or";
          this.url.searchParams.append(key, `(${filters})`);
          return this;
        }
        /**
         * Match only rows which satisfy the filter. This is an escape hatch - you
         * should use the specific filter methods wherever possible.
         *
         * Unlike most filters, `opearator` and `value` are used as-is and need to
         * follow [PostgREST
         * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
         * to make sure they are properly sanitized.
         *
         * @param column - The column to filter on
         * @param operator - The operator to filter with, following PostgREST syntax
         * @param value - The value to filter with, following PostgREST syntax
         */
        filter(column, operator, value2) {
          this.url.searchParams.append(column, `${operator}.${value2}`);
          return this;
        }
      };
      exports.default = PostgrestFilterBuilder;
    }
  });

  // node_modules/@supabase/postgrest-js/dist/cjs/PostgrestQueryBuilder.js
  var require_PostgrestQueryBuilder = __commonJS({
    "node_modules/@supabase/postgrest-js/dist/cjs/PostgrestQueryBuilder.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var PostgrestFilterBuilder_1 = __importDefault(require_PostgrestFilterBuilder());
      var PostgrestQueryBuilder = class {
        constructor(url2, { headers = {}, schema, fetch: fetch3 }) {
          this.url = url2;
          this.headers = new Headers(headers);
          this.schema = schema;
          this.fetch = fetch3;
        }
        /**
         * Perform a SELECT query on the table or view.
         *
         * @param columns - The columns to retrieve, separated by commas. Columns can be renamed when returned with `customName:columnName`
         *
         * @param options - Named parameters
         *
         * @param options.head - When set to `true`, `data` will not be returned.
         * Useful if you only need the count.
         *
         * @param options.count - Count algorithm to use to count rows in the table or view.
         *
         * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
         * hood.
         *
         * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
         * statistics under the hood.
         *
         * `"estimated"`: Uses exact count for low numbers and planned count for high
         * numbers.
         */
        select(columns, { head = false, count } = {}) {
          const method = head ? "HEAD" : "GET";
          let quoted = false;
          const cleanedColumns = (columns !== null && columns !== void 0 ? columns : "*").split("").map((c) => {
            if (/\s/.test(c) && !quoted) {
              return "";
            }
            if (c === '"') {
              quoted = !quoted;
            }
            return c;
          }).join("");
          this.url.searchParams.set("select", cleanedColumns);
          if (count) {
            this.headers.append("Prefer", `count=${count}`);
          }
          return new PostgrestFilterBuilder_1.default({
            method,
            url: this.url,
            headers: this.headers,
            schema: this.schema,
            fetch: this.fetch
          });
        }
        /**
         * Perform an INSERT into the table or view.
         *
         * By default, inserted rows are not returned. To return it, chain the call
         * with `.select()`.
         *
         * @param values - The values to insert. Pass an object to insert a single row
         * or an array to insert multiple rows.
         *
         * @param options - Named parameters
         *
         * @param options.count - Count algorithm to use to count inserted rows.
         *
         * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
         * hood.
         *
         * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
         * statistics under the hood.
         *
         * `"estimated"`: Uses exact count for low numbers and planned count for high
         * numbers.
         *
         * @param options.defaultToNull - Make missing fields default to `null`.
         * Otherwise, use the default value for the column. Only applies for bulk
         * inserts.
         */
        insert(values, { count, defaultToNull = true } = {}) {
          var _a;
          const method = "POST";
          if (count) {
            this.headers.append("Prefer", `count=${count}`);
          }
          if (!defaultToNull) {
            this.headers.append("Prefer", `missing=default`);
          }
          if (Array.isArray(values)) {
            const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), []);
            if (columns.length > 0) {
              const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`);
              this.url.searchParams.set("columns", uniqueColumns.join(","));
            }
          }
          return new PostgrestFilterBuilder_1.default({
            method,
            url: this.url,
            headers: this.headers,
            schema: this.schema,
            body: values,
            fetch: (_a = this.fetch) !== null && _a !== void 0 ? _a : fetch
          });
        }
        /**
         * Perform an UPSERT on the table or view. Depending on the column(s) passed
         * to `onConflict`, `.upsert()` allows you to perform the equivalent of
         * `.insert()` if a row with the corresponding `onConflict` columns doesn't
         * exist, or if it does exist, perform an alternative action depending on
         * `ignoreDuplicates`.
         *
         * By default, upserted rows are not returned. To return it, chain the call
         * with `.select()`.
         *
         * @param values - The values to upsert with. Pass an object to upsert a
         * single row or an array to upsert multiple rows.
         *
         * @param options - Named parameters
         *
         * @param options.onConflict - Comma-separated UNIQUE column(s) to specify how
         * duplicate rows are determined. Two rows are duplicates if all the
         * `onConflict` columns are equal.
         *
         * @param options.ignoreDuplicates - If `true`, duplicate rows are ignored. If
         * `false`, duplicate rows are merged with existing rows.
         *
         * @param options.count - Count algorithm to use to count upserted rows.
         *
         * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
         * hood.
         *
         * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
         * statistics under the hood.
         *
         * `"estimated"`: Uses exact count for low numbers and planned count for high
         * numbers.
         *
         * @param options.defaultToNull - Make missing fields default to `null`.
         * Otherwise, use the default value for the column. This only applies when
         * inserting new rows, not when merging with existing rows under
         * `ignoreDuplicates: false`. This also only applies when doing bulk upserts.
         */
        upsert(values, { onConflict, ignoreDuplicates = false, count, defaultToNull = true } = {}) {
          var _a;
          const method = "POST";
          this.headers.append("Prefer", `resolution=${ignoreDuplicates ? "ignore" : "merge"}-duplicates`);
          if (onConflict !== void 0)
            this.url.searchParams.set("on_conflict", onConflict);
          if (count) {
            this.headers.append("Prefer", `count=${count}`);
          }
          if (!defaultToNull) {
            this.headers.append("Prefer", "missing=default");
          }
          if (Array.isArray(values)) {
            const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), []);
            if (columns.length > 0) {
              const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`);
              this.url.searchParams.set("columns", uniqueColumns.join(","));
            }
          }
          return new PostgrestFilterBuilder_1.default({
            method,
            url: this.url,
            headers: this.headers,
            schema: this.schema,
            body: values,
            fetch: (_a = this.fetch) !== null && _a !== void 0 ? _a : fetch
          });
        }
        /**
         * Perform an UPDATE on the table or view.
         *
         * By default, updated rows are not returned. To return it, chain the call
         * with `.select()` after filters.
         *
         * @param values - The values to update with
         *
         * @param options - Named parameters
         *
         * @param options.count - Count algorithm to use to count updated rows.
         *
         * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
         * hood.
         *
         * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
         * statistics under the hood.
         *
         * `"estimated"`: Uses exact count for low numbers and planned count for high
         * numbers.
         */
        update(values, { count } = {}) {
          var _a;
          const method = "PATCH";
          if (count) {
            this.headers.append("Prefer", `count=${count}`);
          }
          return new PostgrestFilterBuilder_1.default({
            method,
            url: this.url,
            headers: this.headers,
            schema: this.schema,
            body: values,
            fetch: (_a = this.fetch) !== null && _a !== void 0 ? _a : fetch
          });
        }
        /**
         * Perform a DELETE on the table or view.
         *
         * By default, deleted rows are not returned. To return it, chain the call
         * with `.select()` after filters.
         *
         * @param options - Named parameters
         *
         * @param options.count - Count algorithm to use to count deleted rows.
         *
         * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
         * hood.
         *
         * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
         * statistics under the hood.
         *
         * `"estimated"`: Uses exact count for low numbers and planned count for high
         * numbers.
         */
        delete({ count } = {}) {
          var _a;
          const method = "DELETE";
          if (count) {
            this.headers.append("Prefer", `count=${count}`);
          }
          return new PostgrestFilterBuilder_1.default({
            method,
            url: this.url,
            headers: this.headers,
            schema: this.schema,
            fetch: (_a = this.fetch) !== null && _a !== void 0 ? _a : fetch
          });
        }
      };
      exports.default = PostgrestQueryBuilder;
    }
  });

  // node_modules/@supabase/postgrest-js/dist/cjs/PostgrestClient.js
  var require_PostgrestClient = __commonJS({
    "node_modules/@supabase/postgrest-js/dist/cjs/PostgrestClient.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var PostgrestQueryBuilder_1 = __importDefault(require_PostgrestQueryBuilder());
      var PostgrestFilterBuilder_1 = __importDefault(require_PostgrestFilterBuilder());
      var PostgrestClient = class _PostgrestClient {
        // TODO: Add back shouldThrowOnError once we figure out the typings
        /**
         * Creates a PostgREST client.
         *
         * @param url - URL of the PostgREST endpoint
         * @param options - Named parameters
         * @param options.headers - Custom headers
         * @param options.schema - Postgres schema to switch to
         * @param options.fetch - Custom fetch
         */
        constructor(url2, { headers = {}, schema, fetch: fetch3 } = {}) {
          this.url = url2;
          this.headers = new Headers(headers);
          this.schemaName = schema;
          this.fetch = fetch3;
        }
        /**
         * Perform a query on a table or a view.
         *
         * @param relation - The table or view name to query
         */
        from(relation) {
          const url2 = new URL(`${this.url}/${relation}`);
          return new PostgrestQueryBuilder_1.default(url2, {
            headers: new Headers(this.headers),
            schema: this.schemaName,
            fetch: this.fetch
          });
        }
        /**
         * Select a schema to query or perform an function (rpc) call.
         *
         * The schema needs to be on the list of exposed schemas inside Supabase.
         *
         * @param schema - The schema to query
         */
        schema(schema) {
          return new _PostgrestClient(this.url, {
            headers: this.headers,
            schema,
            fetch: this.fetch
          });
        }
        /**
         * Perform a function call.
         *
         * @param fn - The function name to call
         * @param args - The arguments to pass to the function call
         * @param options - Named parameters
         * @param options.head - When set to `true`, `data` will not be returned.
         * Useful if you only need the count.
         * @param options.get - When set to `true`, the function will be called with
         * read-only access mode.
         * @param options.count - Count algorithm to use to count rows returned by the
         * function. Only applicable for [set-returning
         * functions](https://www.postgresql.org/docs/current/functions-srf.html).
         *
         * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
         * hood.
         *
         * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
         * statistics under the hood.
         *
         * `"estimated"`: Uses exact count for low numbers and planned count for high
         * numbers.
         */
        rpc(fn, args = {}, { head = false, get = false, count } = {}) {
          var _a;
          let method;
          const url2 = new URL(`${this.url}/rpc/${fn}`);
          let body;
          if (head || get) {
            method = head ? "HEAD" : "GET";
            Object.entries(args).filter(([_, value2]) => value2 !== void 0).map(([name, value2]) => [name, Array.isArray(value2) ? `{${value2.join(",")}}` : `${value2}`]).forEach(([name, value2]) => {
              url2.searchParams.append(name, value2);
            });
          } else {
            method = "POST";
            body = args;
          }
          const headers = new Headers(this.headers);
          if (count) {
            headers.set("Prefer", `count=${count}`);
          }
          return new PostgrestFilterBuilder_1.default({
            method,
            url: url2,
            headers,
            schema: this.schemaName,
            body,
            fetch: (_a = this.fetch) !== null && _a !== void 0 ? _a : fetch
          });
        }
      };
      exports.default = PostgrestClient;
    }
  });

  // node_modules/@supabase/postgrest-js/dist/cjs/index.js
  var require_cjs = __commonJS({
    "node_modules/@supabase/postgrest-js/dist/cjs/index.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.PostgrestError = exports.PostgrestBuilder = exports.PostgrestTransformBuilder = exports.PostgrestFilterBuilder = exports.PostgrestQueryBuilder = exports.PostgrestClient = void 0;
      var PostgrestClient_1 = __importDefault(require_PostgrestClient());
      exports.PostgrestClient = PostgrestClient_1.default;
      var PostgrestQueryBuilder_1 = __importDefault(require_PostgrestQueryBuilder());
      exports.PostgrestQueryBuilder = PostgrestQueryBuilder_1.default;
      var PostgrestFilterBuilder_1 = __importDefault(require_PostgrestFilterBuilder());
      exports.PostgrestFilterBuilder = PostgrestFilterBuilder_1.default;
      var PostgrestTransformBuilder_1 = __importDefault(require_PostgrestTransformBuilder());
      exports.PostgrestTransformBuilder = PostgrestTransformBuilder_1.default;
      var PostgrestBuilder_1 = __importDefault(require_PostgrestBuilder());
      exports.PostgrestBuilder = PostgrestBuilder_1.default;
      var PostgrestError_1 = __importDefault(require_PostgrestError());
      exports.PostgrestError = PostgrestError_1.default;
      exports.default = {
        PostgrestClient: PostgrestClient_1.default,
        PostgrestQueryBuilder: PostgrestQueryBuilder_1.default,
        PostgrestFilterBuilder: PostgrestFilterBuilder_1.default,
        PostgrestTransformBuilder: PostgrestTransformBuilder_1.default,
        PostgrestBuilder: PostgrestBuilder_1.default,
        PostgrestError: PostgrestError_1.default
      };
    }
  });

  // node_modules/engine.io-parser/build/esm/commons.js
  var PACKET_TYPES, PACKET_TYPES_REVERSE, ERROR_PACKET;
  var init_commons = __esm({
    "node_modules/engine.io-parser/build/esm/commons.js"() {
      PACKET_TYPES = /* @__PURE__ */ Object.create(null);
      PACKET_TYPES["open"] = "0";
      PACKET_TYPES["close"] = "1";
      PACKET_TYPES["ping"] = "2";
      PACKET_TYPES["pong"] = "3";
      PACKET_TYPES["message"] = "4";
      PACKET_TYPES["upgrade"] = "5";
      PACKET_TYPES["noop"] = "6";
      PACKET_TYPES_REVERSE = /* @__PURE__ */ Object.create(null);
      Object.keys(PACKET_TYPES).forEach((key) => {
        PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
      });
      ERROR_PACKET = { type: "error", data: "parser error" };
    }
  });

  // node_modules/engine.io-parser/build/esm/encodePacket.browser.js
  function toArray(data) {
    if (data instanceof Uint8Array) {
      return data;
    } else if (data instanceof ArrayBuffer) {
      return new Uint8Array(data);
    } else {
      return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    }
  }
  function encodePacketToBinary(packet, callback) {
    if (withNativeBlob && packet.data instanceof Blob) {
      return packet.data.arrayBuffer().then(toArray).then(callback);
    } else if (withNativeArrayBuffer && (packet.data instanceof ArrayBuffer || isView(packet.data))) {
      return callback(toArray(packet.data));
    }
    encodePacket(packet, false, (encoded) => {
      if (!TEXT_ENCODER) {
        TEXT_ENCODER = new TextEncoder();
      }
      callback(TEXT_ENCODER.encode(encoded));
    });
  }
  var withNativeBlob, withNativeArrayBuffer, isView, encodePacket, encodeBlobAsBase64, TEXT_ENCODER;
  var init_encodePacket_browser = __esm({
    "node_modules/engine.io-parser/build/esm/encodePacket.browser.js"() {
      init_commons();
      withNativeBlob = typeof Blob === "function" || typeof Blob !== "undefined" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]";
      withNativeArrayBuffer = typeof ArrayBuffer === "function";
      isView = (obj) => {
        return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj && obj.buffer instanceof ArrayBuffer;
      };
      encodePacket = ({ type, data }, supportsBinary, callback) => {
        if (withNativeBlob && data instanceof Blob) {
          if (supportsBinary) {
            return callback(data);
          } else {
            return encodeBlobAsBase64(data, callback);
          }
        } else if (withNativeArrayBuffer && (data instanceof ArrayBuffer || isView(data))) {
          if (supportsBinary) {
            return callback(data);
          } else {
            return encodeBlobAsBase64(new Blob([data]), callback);
          }
        }
        return callback(PACKET_TYPES[type] + (data || ""));
      };
      encodeBlobAsBase64 = (data, callback) => {
        const fileReader = new FileReader();
        fileReader.onload = function() {
          const content = fileReader.result.split(",")[1];
          callback("b" + (content || ""));
        };
        return fileReader.readAsDataURL(data);
      };
    }
  });

  // node_modules/engine.io-parser/build/esm/contrib/base64-arraybuffer.js
  var chars, lookup, decode;
  var init_base64_arraybuffer = __esm({
    "node_modules/engine.io-parser/build/esm/contrib/base64-arraybuffer.js"() {
      chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      lookup = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
      for (let i = 0; i < chars.length; i++) {
        lookup[chars.charCodeAt(i)] = i;
      }
      decode = (base64) => {
        let bufferLength = base64.length * 0.75, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
        if (base64[base64.length - 1] === "=") {
          bufferLength--;
          if (base64[base64.length - 2] === "=") {
            bufferLength--;
          }
        }
        const arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
        for (i = 0; i < len; i += 4) {
          encoded1 = lookup[base64.charCodeAt(i)];
          encoded2 = lookup[base64.charCodeAt(i + 1)];
          encoded3 = lookup[base64.charCodeAt(i + 2)];
          encoded4 = lookup[base64.charCodeAt(i + 3)];
          bytes[p++] = encoded1 << 2 | encoded2 >> 4;
          bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
          bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
        }
        return arraybuffer;
      };
    }
  });

  // node_modules/engine.io-parser/build/esm/decodePacket.browser.js
  var withNativeArrayBuffer2, decodePacket, decodeBase64Packet, mapBinary;
  var init_decodePacket_browser = __esm({
    "node_modules/engine.io-parser/build/esm/decodePacket.browser.js"() {
      init_commons();
      init_base64_arraybuffer();
      withNativeArrayBuffer2 = typeof ArrayBuffer === "function";
      decodePacket = (encodedPacket, binaryType) => {
        if (typeof encodedPacket !== "string") {
          return {
            type: "message",
            data: mapBinary(encodedPacket, binaryType)
          };
        }
        const type = encodedPacket.charAt(0);
        if (type === "b") {
          return {
            type: "message",
            data: decodeBase64Packet(encodedPacket.substring(1), binaryType)
          };
        }
        const packetType = PACKET_TYPES_REVERSE[type];
        if (!packetType) {
          return ERROR_PACKET;
        }
        return encodedPacket.length > 1 ? {
          type: PACKET_TYPES_REVERSE[type],
          data: encodedPacket.substring(1)
        } : {
          type: PACKET_TYPES_REVERSE[type]
        };
      };
      decodeBase64Packet = (data, binaryType) => {
        if (withNativeArrayBuffer2) {
          const decoded = decode(data);
          return mapBinary(decoded, binaryType);
        } else {
          return { base64: true, data };
        }
      };
      mapBinary = (data, binaryType) => {
        switch (binaryType) {
          case "blob":
            if (data instanceof Blob) {
              return data;
            } else {
              return new Blob([data]);
            }
          case "arraybuffer":
          default:
            if (data instanceof ArrayBuffer) {
              return data;
            } else {
              return data.buffer;
            }
        }
      };
    }
  });

  // node_modules/engine.io-parser/build/esm/index.js
  function createPacketEncoderStream() {
    return new TransformStream({
      transform(packet, controller) {
        encodePacketToBinary(packet, (encodedPacket) => {
          const payloadLength = encodedPacket.length;
          let header;
          if (payloadLength < 126) {
            header = new Uint8Array(1);
            new DataView(header.buffer).setUint8(0, payloadLength);
          } else if (payloadLength < 65536) {
            header = new Uint8Array(3);
            const view = new DataView(header.buffer);
            view.setUint8(0, 126);
            view.setUint16(1, payloadLength);
          } else {
            header = new Uint8Array(9);
            const view = new DataView(header.buffer);
            view.setUint8(0, 127);
            view.setBigUint64(1, BigInt(payloadLength));
          }
          if (packet.data && typeof packet.data !== "string") {
            header[0] |= 128;
          }
          controller.enqueue(header);
          controller.enqueue(encodedPacket);
        });
      }
    });
  }
  function totalLength(chunks) {
    return chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  }
  function concatChunks(chunks, size) {
    if (chunks[0].length === size) {
      return chunks.shift();
    }
    const buffer = new Uint8Array(size);
    let j = 0;
    for (let i = 0; i < size; i++) {
      buffer[i] = chunks[0][j++];
      if (j === chunks[0].length) {
        chunks.shift();
        j = 0;
      }
    }
    if (chunks.length && j < chunks[0].length) {
      chunks[0] = chunks[0].slice(j);
    }
    return buffer;
  }
  function createPacketDecoderStream(maxPayload, binaryType) {
    if (!TEXT_DECODER) {
      TEXT_DECODER = new TextDecoder();
    }
    const chunks = [];
    let state = 0;
    let expectedLength = -1;
    let isBinary2 = false;
    return new TransformStream({
      transform(chunk, controller) {
        chunks.push(chunk);
        while (true) {
          if (state === 0) {
            if (totalLength(chunks) < 1) {
              break;
            }
            const header = concatChunks(chunks, 1);
            isBinary2 = (header[0] & 128) === 128;
            expectedLength = header[0] & 127;
            if (expectedLength < 126) {
              state = 3;
            } else if (expectedLength === 126) {
              state = 1;
            } else {
              state = 2;
            }
          } else if (state === 1) {
            if (totalLength(chunks) < 2) {
              break;
            }
            const headerArray = concatChunks(chunks, 2);
            expectedLength = new DataView(headerArray.buffer, headerArray.byteOffset, headerArray.length).getUint16(0);
            state = 3;
          } else if (state === 2) {
            if (totalLength(chunks) < 8) {
              break;
            }
            const headerArray = concatChunks(chunks, 8);
            const view = new DataView(headerArray.buffer, headerArray.byteOffset, headerArray.length);
            const n = view.getUint32(0);
            if (n > Math.pow(2, 53 - 32) - 1) {
              controller.enqueue(ERROR_PACKET);
              break;
            }
            expectedLength = n * Math.pow(2, 32) + view.getUint32(4);
            state = 3;
          } else {
            if (totalLength(chunks) < expectedLength) {
              break;
            }
            const data = concatChunks(chunks, expectedLength);
            controller.enqueue(decodePacket(isBinary2 ? data : TEXT_DECODER.decode(data), binaryType));
            state = 0;
          }
          if (expectedLength === 0 || expectedLength > maxPayload) {
            controller.enqueue(ERROR_PACKET);
            break;
          }
        }
      }
    });
  }
  var SEPARATOR, encodePayload, decodePayload, TEXT_DECODER, protocol;
  var init_esm = __esm({
    "node_modules/engine.io-parser/build/esm/index.js"() {
      init_encodePacket_browser();
      init_decodePacket_browser();
      init_commons();
      SEPARATOR = String.fromCharCode(30);
      encodePayload = (packets, callback) => {
        const length = packets.length;
        const encodedPackets = new Array(length);
        let count = 0;
        packets.forEach((packet, i) => {
          encodePacket(packet, false, (encodedPacket) => {
            encodedPackets[i] = encodedPacket;
            if (++count === length) {
              callback(encodedPackets.join(SEPARATOR));
            }
          });
        });
      };
      decodePayload = (encodedPayload, binaryType) => {
        const encodedPackets = encodedPayload.split(SEPARATOR);
        const packets = [];
        for (let i = 0; i < encodedPackets.length; i++) {
          const decodedPacket = decodePacket(encodedPackets[i], binaryType);
          packets.push(decodedPacket);
          if (decodedPacket.type === "error") {
            break;
          }
        }
        return packets;
      };
      protocol = 4;
    }
  });

  // node_modules/@socket.io/component-emitter/lib/esm/index.js
  function Emitter(obj) {
    if (obj) return mixin(obj);
  }
  function mixin(obj) {
    for (var key in Emitter.prototype) {
      obj[key] = Emitter.prototype[key];
    }
    return obj;
  }
  var init_esm2 = __esm({
    "node_modules/@socket.io/component-emitter/lib/esm/index.js"() {
      Emitter.prototype.on = Emitter.prototype.addEventListener = function(event, fn) {
        this._callbacks = this._callbacks || {};
        (this._callbacks["$" + event] = this._callbacks["$" + event] || []).push(fn);
        return this;
      };
      Emitter.prototype.once = function(event, fn) {
        function on2() {
          this.off(event, on2);
          fn.apply(this, arguments);
        }
        on2.fn = fn;
        this.on(event, on2);
        return this;
      };
      Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event, fn) {
        this._callbacks = this._callbacks || {};
        if (0 == arguments.length) {
          this._callbacks = {};
          return this;
        }
        var callbacks = this._callbacks["$" + event];
        if (!callbacks) return this;
        if (1 == arguments.length) {
          delete this._callbacks["$" + event];
          return this;
        }
        var cb;
        for (var i = 0; i < callbacks.length; i++) {
          cb = callbacks[i];
          if (cb === fn || cb.fn === fn) {
            callbacks.splice(i, 1);
            break;
          }
        }
        if (callbacks.length === 0) {
          delete this._callbacks["$" + event];
        }
        return this;
      };
      Emitter.prototype.emit = function(event) {
        this._callbacks = this._callbacks || {};
        var args = new Array(arguments.length - 1), callbacks = this._callbacks["$" + event];
        for (var i = 1; i < arguments.length; i++) {
          args[i - 1] = arguments[i];
        }
        if (callbacks) {
          callbacks = callbacks.slice(0);
          for (var i = 0, len = callbacks.length; i < len; ++i) {
            callbacks[i].apply(this, args);
          }
        }
        return this;
      };
      Emitter.prototype.emitReserved = Emitter.prototype.emit;
      Emitter.prototype.listeners = function(event) {
        this._callbacks = this._callbacks || {};
        return this._callbacks["$" + event] || [];
      };
      Emitter.prototype.hasListeners = function(event) {
        return !!this.listeners(event).length;
      };
    }
  });

  // node_modules/engine.io-client/build/esm/globals.js
  function createCookieJar() {
  }
  var nextTick, globalThisShim, defaultBinaryType;
  var init_globals = __esm({
    "node_modules/engine.io-client/build/esm/globals.js"() {
      nextTick = (() => {
        const isPromiseAvailable = typeof Promise === "function" && typeof Promise.resolve === "function";
        if (isPromiseAvailable) {
          return (cb) => Promise.resolve().then(cb);
        } else {
          return (cb, setTimeoutFn) => setTimeoutFn(cb, 0);
        }
      })();
      globalThisShim = (() => {
        if (typeof self !== "undefined") {
          return self;
        } else if (typeof window !== "undefined") {
          return window;
        } else {
          return Function("return this")();
        }
      })();
      defaultBinaryType = "arraybuffer";
    }
  });

  // node_modules/engine.io-client/build/esm/util.js
  function pick(obj, ...attr) {
    return attr.reduce((acc, k) => {
      if (obj.hasOwnProperty(k)) {
        acc[k] = obj[k];
      }
      return acc;
    }, {});
  }
  function installTimerFunctions(obj, opts) {
    if (opts.useNativeTimers) {
      obj.setTimeoutFn = NATIVE_SET_TIMEOUT.bind(globalThisShim);
      obj.clearTimeoutFn = NATIVE_CLEAR_TIMEOUT.bind(globalThisShim);
    } else {
      obj.setTimeoutFn = globalThisShim.setTimeout.bind(globalThisShim);
      obj.clearTimeoutFn = globalThisShim.clearTimeout.bind(globalThisShim);
    }
  }
  function byteLength(obj) {
    if (typeof obj === "string") {
      return utf8Length(obj);
    }
    return Math.ceil((obj.byteLength || obj.size) * BASE64_OVERHEAD);
  }
  function utf8Length(str) {
    let c = 0, length = 0;
    for (let i = 0, l = str.length; i < l; i++) {
      c = str.charCodeAt(i);
      if (c < 128) {
        length += 1;
      } else if (c < 2048) {
        length += 2;
      } else if (c < 55296 || c >= 57344) {
        length += 3;
      } else {
        i++;
        length += 4;
      }
    }
    return length;
  }
  function randomString() {
    return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
  }
  var NATIVE_SET_TIMEOUT, NATIVE_CLEAR_TIMEOUT, BASE64_OVERHEAD;
  var init_util = __esm({
    "node_modules/engine.io-client/build/esm/util.js"() {
      init_globals();
      NATIVE_SET_TIMEOUT = globalThisShim.setTimeout;
      NATIVE_CLEAR_TIMEOUT = globalThisShim.clearTimeout;
      BASE64_OVERHEAD = 1.33;
    }
  });

  // node_modules/engine.io-client/build/esm/contrib/parseqs.js
  function encode(obj) {
    let str = "";
    for (let i in obj) {
      if (obj.hasOwnProperty(i)) {
        if (str.length)
          str += "&";
        str += encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]);
      }
    }
    return str;
  }
  function decode2(qs) {
    let qry = {};
    let pairs = qs.split("&");
    for (let i = 0, l = pairs.length; i < l; i++) {
      let pair = pairs[i].split("=");
      qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    return qry;
  }
  var init_parseqs = __esm({
    "node_modules/engine.io-client/build/esm/contrib/parseqs.js"() {
    }
  });

  // node_modules/engine.io-client/build/esm/transport.js
  var TransportError, Transport;
  var init_transport = __esm({
    "node_modules/engine.io-client/build/esm/transport.js"() {
      init_esm();
      init_esm2();
      init_util();
      init_parseqs();
      TransportError = class extends Error {
        constructor(reason, description, context) {
          super(reason);
          this.description = description;
          this.context = context;
          this.type = "TransportError";
        }
      };
      Transport = class extends Emitter {
        /**
         * Transport abstract constructor.
         *
         * @param {Object} opts - options
         * @protected
         */
        constructor(opts) {
          super();
          this.writable = false;
          installTimerFunctions(this, opts);
          this.opts = opts;
          this.query = opts.query;
          this.socket = opts.socket;
          this.supportsBinary = !opts.forceBase64;
        }
        /**
         * Emits an error.
         *
         * @param {String} reason
         * @param description
         * @param context - the error context
         * @return {Transport} for chaining
         * @protected
         */
        onError(reason, description, context) {
          super.emitReserved("error", new TransportError(reason, description, context));
          return this;
        }
        /**
         * Opens the transport.
         */
        open() {
          this.readyState = "opening";
          this.doOpen();
          return this;
        }
        /**
         * Closes the transport.
         */
        close() {
          if (this.readyState === "opening" || this.readyState === "open") {
            this.doClose();
            this.onClose();
          }
          return this;
        }
        /**
         * Sends multiple packets.
         *
         * @param {Array} packets
         */
        send(packets) {
          if (this.readyState === "open") {
            this.write(packets);
          } else {
          }
        }
        /**
         * Called upon open
         *
         * @protected
         */
        onOpen() {
          this.readyState = "open";
          this.writable = true;
          super.emitReserved("open");
        }
        /**
         * Called with data.
         *
         * @param {String} data
         * @protected
         */
        onData(data) {
          const packet = decodePacket(data, this.socket.binaryType);
          this.onPacket(packet);
        }
        /**
         * Called with a decoded packet.
         *
         * @protected
         */
        onPacket(packet) {
          super.emitReserved("packet", packet);
        }
        /**
         * Called upon close.
         *
         * @protected
         */
        onClose(details) {
          this.readyState = "closed";
          super.emitReserved("close", details);
        }
        /**
         * Pauses the transport, in order not to lose packets during an upgrade.
         *
         * @param onPause
         */
        pause(onPause) {
        }
        createUri(schema, query = {}) {
          return schema + "://" + this._hostname() + this._port() + this.opts.path + this._query(query);
        }
        _hostname() {
          const hostname = this.opts.hostname;
          return hostname.indexOf(":") === -1 ? hostname : "[" + hostname + "]";
        }
        _port() {
          if (this.opts.port && (this.opts.secure && Number(this.opts.port) !== 443 || !this.opts.secure && Number(this.opts.port) !== 80)) {
            return ":" + this.opts.port;
          } else {
            return "";
          }
        }
        _query(query) {
          const encodedQuery = encode(query);
          return encodedQuery.length ? "?" + encodedQuery : "";
        }
      };
    }
  });

  // node_modules/engine.io-client/build/esm/transports/polling.js
  var Polling;
  var init_polling = __esm({
    "node_modules/engine.io-client/build/esm/transports/polling.js"() {
      init_transport();
      init_util();
      init_esm();
      Polling = class extends Transport {
        constructor() {
          super(...arguments);
          this._polling = false;
        }
        get name() {
          return "polling";
        }
        /**
         * Opens the socket (triggers polling). We write a PING message to determine
         * when the transport is open.
         *
         * @protected
         */
        doOpen() {
          this._poll();
        }
        /**
         * Pauses polling.
         *
         * @param {Function} onPause - callback upon buffers are flushed and transport is paused
         * @package
         */
        pause(onPause) {
          this.readyState = "pausing";
          const pause = () => {
            this.readyState = "paused";
            onPause();
          };
          if (this._polling || !this.writable) {
            let total = 0;
            if (this._polling) {
              total++;
              this.once("pollComplete", function() {
                --total || pause();
              });
            }
            if (!this.writable) {
              total++;
              this.once("drain", function() {
                --total || pause();
              });
            }
          } else {
            pause();
          }
        }
        /**
         * Starts polling cycle.
         *
         * @private
         */
        _poll() {
          this._polling = true;
          this.doPoll();
          this.emitReserved("poll");
        }
        /**
         * Overloads onData to detect payloads.
         *
         * @protected
         */
        onData(data) {
          const callback = (packet) => {
            if ("opening" === this.readyState && packet.type === "open") {
              this.onOpen();
            }
            if ("close" === packet.type) {
              this.onClose({ description: "transport closed by the server" });
              return false;
            }
            this.onPacket(packet);
          };
          decodePayload(data, this.socket.binaryType).forEach(callback);
          if ("closed" !== this.readyState) {
            this._polling = false;
            this.emitReserved("pollComplete");
            if ("open" === this.readyState) {
              this._poll();
            } else {
            }
          }
        }
        /**
         * For polling, send a close packet.
         *
         * @protected
         */
        doClose() {
          const close = () => {
            this.write([{ type: "close" }]);
          };
          if ("open" === this.readyState) {
            close();
          } else {
            this.once("open", close);
          }
        }
        /**
         * Writes a packets payload.
         *
         * @param {Array} packets - data packets
         * @protected
         */
        write(packets) {
          this.writable = false;
          encodePayload(packets, (data) => {
            this.doWrite(data, () => {
              this.writable = true;
              this.emitReserved("drain");
            });
          });
        }
        /**
         * Generates uri for connection.
         *
         * @private
         */
        uri() {
          const schema = this.opts.secure ? "https" : "http";
          const query = this.query || {};
          if (false !== this.opts.timestampRequests) {
            query[this.opts.timestampParam] = randomString();
          }
          if (!this.supportsBinary && !query.sid) {
            query.b64 = 1;
          }
          return this.createUri(schema, query);
        }
      };
    }
  });

  // node_modules/engine.io-client/build/esm/contrib/has-cors.js
  var value, hasCORS;
  var init_has_cors = __esm({
    "node_modules/engine.io-client/build/esm/contrib/has-cors.js"() {
      value = false;
      try {
        value = typeof XMLHttpRequest !== "undefined" && "withCredentials" in new XMLHttpRequest();
      } catch (err) {
      }
      hasCORS = value;
    }
  });

  // node_modules/engine.io-client/build/esm/transports/polling-xhr.js
  function empty() {
  }
  function unloadHandler() {
    for (let i in Request3.requests) {
      if (Request3.requests.hasOwnProperty(i)) {
        Request3.requests[i].abort();
      }
    }
  }
  function newRequest(opts) {
    const xdomain = opts.xdomain;
    try {
      if ("undefined" !== typeof XMLHttpRequest && (!xdomain || hasCORS)) {
        return new XMLHttpRequest();
      }
    } catch (e) {
    }
    if (!xdomain) {
      try {
        return new globalThisShim[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
      } catch (e) {
      }
    }
  }
  var BaseXHR, Request3, hasXHR2, XHR;
  var init_polling_xhr = __esm({
    "node_modules/engine.io-client/build/esm/transports/polling-xhr.js"() {
      init_polling();
      init_esm2();
      init_util();
      init_globals();
      init_has_cors();
      BaseXHR = class extends Polling {
        /**
         * XHR Polling constructor.
         *
         * @param {Object} opts
         * @package
         */
        constructor(opts) {
          super(opts);
          if (typeof location !== "undefined") {
            const isSSL = "https:" === location.protocol;
            let port = location.port;
            if (!port) {
              port = isSSL ? "443" : "80";
            }
            this.xd = typeof location !== "undefined" && opts.hostname !== location.hostname || port !== opts.port;
          }
        }
        /**
         * Sends data.
         *
         * @param {String} data - data to send.
         * @param {Function} fn - called upon flush.
         * @private
         */
        doWrite(data, fn) {
          const req = this.request({
            method: "POST",
            data
          });
          req.on("success", fn);
          req.on("error", (xhrStatus, context) => {
            this.onError("xhr post error", xhrStatus, context);
          });
        }
        /**
         * Starts a poll cycle.
         *
         * @private
         */
        doPoll() {
          const req = this.request();
          req.on("data", this.onData.bind(this));
          req.on("error", (xhrStatus, context) => {
            this.onError("xhr poll error", xhrStatus, context);
          });
          this.pollXhr = req;
        }
      };
      Request3 = class _Request extends Emitter {
        /**
         * Request constructor
         *
         * @param {Object} options
         * @package
         */
        constructor(createRequest, uri, opts) {
          super();
          this.createRequest = createRequest;
          installTimerFunctions(this, opts);
          this._opts = opts;
          this._method = opts.method || "GET";
          this._uri = uri;
          this._data = void 0 !== opts.data ? opts.data : null;
          this._create();
        }
        /**
         * Creates the XHR object and sends the request.
         *
         * @private
         */
        _create() {
          var _a;
          const opts = pick(this._opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
          opts.xdomain = !!this._opts.xd;
          const xhr = this._xhr = this.createRequest(opts);
          try {
            xhr.open(this._method, this._uri, true);
            try {
              if (this._opts.extraHeaders) {
                xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
                for (let i in this._opts.extraHeaders) {
                  if (this._opts.extraHeaders.hasOwnProperty(i)) {
                    xhr.setRequestHeader(i, this._opts.extraHeaders[i]);
                  }
                }
              }
            } catch (e) {
            }
            if ("POST" === this._method) {
              try {
                xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
              } catch (e) {
              }
            }
            try {
              xhr.setRequestHeader("Accept", "*/*");
            } catch (e) {
            }
            (_a = this._opts.cookieJar) === null || _a === void 0 ? void 0 : _a.addCookies(xhr);
            if ("withCredentials" in xhr) {
              xhr.withCredentials = this._opts.withCredentials;
            }
            if (this._opts.requestTimeout) {
              xhr.timeout = this._opts.requestTimeout;
            }
            xhr.onreadystatechange = () => {
              var _a2;
              if (xhr.readyState === 3) {
                (_a2 = this._opts.cookieJar) === null || _a2 === void 0 ? void 0 : _a2.parseCookies(
                  // @ts-ignore
                  xhr.getResponseHeader("set-cookie")
                );
              }
              if (4 !== xhr.readyState)
                return;
              if (200 === xhr.status || 1223 === xhr.status) {
                this._onLoad();
              } else {
                this.setTimeoutFn(() => {
                  this._onError(typeof xhr.status === "number" ? xhr.status : 0);
                }, 0);
              }
            };
            xhr.send(this._data);
          } catch (e) {
            this.setTimeoutFn(() => {
              this._onError(e);
            }, 0);
            return;
          }
          if (typeof document !== "undefined") {
            this._index = _Request.requestsCount++;
            _Request.requests[this._index] = this;
          }
        }
        /**
         * Called upon error.
         *
         * @private
         */
        _onError(err) {
          this.emitReserved("error", err, this._xhr);
          this._cleanup(true);
        }
        /**
         * Cleans up house.
         *
         * @private
         */
        _cleanup(fromError) {
          if ("undefined" === typeof this._xhr || null === this._xhr) {
            return;
          }
          this._xhr.onreadystatechange = empty;
          if (fromError) {
            try {
              this._xhr.abort();
            } catch (e) {
            }
          }
          if (typeof document !== "undefined") {
            delete _Request.requests[this._index];
          }
          this._xhr = null;
        }
        /**
         * Called upon load.
         *
         * @private
         */
        _onLoad() {
          const data = this._xhr.responseText;
          if (data !== null) {
            this.emitReserved("data", data);
            this.emitReserved("success");
            this._cleanup();
          }
        }
        /**
         * Aborts the request.
         *
         * @package
         */
        abort() {
          this._cleanup();
        }
      };
      Request3.requestsCount = 0;
      Request3.requests = {};
      if (typeof document !== "undefined") {
        if (typeof attachEvent === "function") {
          attachEvent("onunload", unloadHandler);
        } else if (typeof addEventListener === "function") {
          const terminationEvent = "onpagehide" in globalThisShim ? "pagehide" : "unload";
          addEventListener(terminationEvent, unloadHandler, false);
        }
      }
      hasXHR2 = (function() {
        const xhr = newRequest({
          xdomain: false
        });
        return xhr && xhr.responseType !== null;
      })();
      XHR = class extends BaseXHR {
        constructor(opts) {
          super(opts);
          const forceBase64 = opts && opts.forceBase64;
          this.supportsBinary = hasXHR2 && !forceBase64;
        }
        request(opts = {}) {
          Object.assign(opts, { xd: this.xd }, this.opts);
          return new Request3(newRequest, this.uri(), opts);
        }
      };
    }
  });

  // node_modules/engine.io-client/build/esm/transports/websocket.js
  var isReactNative, BaseWS, WebSocketCtor, WS;
  var init_websocket = __esm({
    "node_modules/engine.io-client/build/esm/transports/websocket.js"() {
      init_transport();
      init_util();
      init_esm();
      init_globals();
      isReactNative = typeof navigator !== "undefined" && typeof navigator.product === "string" && navigator.product.toLowerCase() === "reactnative";
      BaseWS = class extends Transport {
        get name() {
          return "websocket";
        }
        doOpen() {
          const uri = this.uri();
          const protocols = this.opts.protocols;
          const opts = isReactNative ? {} : pick(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
          if (this.opts.extraHeaders) {
            opts.headers = this.opts.extraHeaders;
          }
          try {
            this.ws = this.createSocket(uri, protocols, opts);
          } catch (err) {
            return this.emitReserved("error", err);
          }
          this.ws.binaryType = this.socket.binaryType;
          this.addEventListeners();
        }
        /**
         * Adds event listeners to the socket
         *
         * @private
         */
        addEventListeners() {
          this.ws.onopen = () => {
            if (this.opts.autoUnref) {
              this.ws._socket.unref();
            }
            this.onOpen();
          };
          this.ws.onclose = (closeEvent) => this.onClose({
            description: "websocket connection closed",
            context: closeEvent
          });
          this.ws.onmessage = (ev) => this.onData(ev.data);
          this.ws.onerror = (e) => this.onError("websocket error", e);
        }
        write(packets) {
          this.writable = false;
          for (let i = 0; i < packets.length; i++) {
            const packet = packets[i];
            const lastPacket = i === packets.length - 1;
            encodePacket(packet, this.supportsBinary, (data) => {
              try {
                this.doWrite(packet, data);
              } catch (e) {
              }
              if (lastPacket) {
                nextTick(() => {
                  this.writable = true;
                  this.emitReserved("drain");
                }, this.setTimeoutFn);
              }
            });
          }
        }
        doClose() {
          if (typeof this.ws !== "undefined") {
            this.ws.onerror = () => {
            };
            this.ws.close();
            this.ws = null;
          }
        }
        /**
         * Generates uri for connection.
         *
         * @private
         */
        uri() {
          const schema = this.opts.secure ? "wss" : "ws";
          const query = this.query || {};
          if (this.opts.timestampRequests) {
            query[this.opts.timestampParam] = randomString();
          }
          if (!this.supportsBinary) {
            query.b64 = 1;
          }
          return this.createUri(schema, query);
        }
      };
      WebSocketCtor = globalThisShim.WebSocket || globalThisShim.MozWebSocket;
      WS = class extends BaseWS {
        createSocket(uri, protocols, opts) {
          return !isReactNative ? protocols ? new WebSocketCtor(uri, protocols) : new WebSocketCtor(uri) : new WebSocketCtor(uri, protocols, opts);
        }
        doWrite(_packet, data) {
          this.ws.send(data);
        }
      };
    }
  });

  // node_modules/engine.io-client/build/esm/transports/webtransport.js
  var WT;
  var init_webtransport = __esm({
    "node_modules/engine.io-client/build/esm/transports/webtransport.js"() {
      init_transport();
      init_globals();
      init_esm();
      WT = class extends Transport {
        get name() {
          return "webtransport";
        }
        doOpen() {
          try {
            this._transport = new WebTransport(this.createUri("https"), this.opts.transportOptions[this.name]);
          } catch (err) {
            return this.emitReserved("error", err);
          }
          this._transport.closed.then(() => {
            this.onClose();
          }).catch((err) => {
            this.onError("webtransport error", err);
          });
          this._transport.ready.then(() => {
            this._transport.createBidirectionalStream().then((stream) => {
              const decoderStream = createPacketDecoderStream(Number.MAX_SAFE_INTEGER, this.socket.binaryType);
              const reader = stream.readable.pipeThrough(decoderStream).getReader();
              const encoderStream = createPacketEncoderStream();
              encoderStream.readable.pipeTo(stream.writable);
              this._writer = encoderStream.writable.getWriter();
              const read = () => {
                reader.read().then(({ done, value: value2 }) => {
                  if (done) {
                    return;
                  }
                  this.onPacket(value2);
                  read();
                }).catch((err) => {
                });
              };
              read();
              const packet = { type: "open" };
              if (this.query.sid) {
                packet.data = `{"sid":"${this.query.sid}"}`;
              }
              this._writer.write(packet).then(() => this.onOpen());
            });
          });
        }
        write(packets) {
          this.writable = false;
          for (let i = 0; i < packets.length; i++) {
            const packet = packets[i];
            const lastPacket = i === packets.length - 1;
            this._writer.write(packet).then(() => {
              if (lastPacket) {
                nextTick(() => {
                  this.writable = true;
                  this.emitReserved("drain");
                }, this.setTimeoutFn);
              }
            });
          }
        }
        doClose() {
          var _a;
          (_a = this._transport) === null || _a === void 0 ? void 0 : _a.close();
        }
      };
    }
  });

  // node_modules/engine.io-client/build/esm/transports/index.js
  var transports;
  var init_transports = __esm({
    "node_modules/engine.io-client/build/esm/transports/index.js"() {
      init_polling_xhr();
      init_websocket();
      init_webtransport();
      transports = {
        websocket: WS,
        webtransport: WT,
        polling: XHR
      };
    }
  });

  // node_modules/engine.io-client/build/esm/contrib/parseuri.js
  function parse(str) {
    if (str.length > 8e3) {
      throw "URI too long";
    }
    const src = str, b = str.indexOf("["), e = str.indexOf("]");
    if (b != -1 && e != -1) {
      str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ";") + str.substring(e, str.length);
    }
    let m = re.exec(str || ""), uri = {}, i = 14;
    while (i--) {
      uri[parts[i]] = m[i] || "";
    }
    if (b != -1 && e != -1) {
      uri.source = src;
      uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ":");
      uri.authority = uri.authority.replace("[", "").replace("]", "").replace(/;/g, ":");
      uri.ipv6uri = true;
    }
    uri.pathNames = pathNames(uri, uri["path"]);
    uri.queryKey = queryKey(uri, uri["query"]);
    return uri;
  }
  function pathNames(obj, path) {
    const regx = /\/{2,9}/g, names = path.replace(regx, "/").split("/");
    if (path.slice(0, 1) == "/" || path.length === 0) {
      names.splice(0, 1);
    }
    if (path.slice(-1) == "/") {
      names.splice(names.length - 1, 1);
    }
    return names;
  }
  function queryKey(uri, query) {
    const data = {};
    query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function($0, $1, $2) {
      if ($1) {
        data[$1] = $2;
      }
    });
    return data;
  }
  var re, parts;
  var init_parseuri = __esm({
    "node_modules/engine.io-client/build/esm/contrib/parseuri.js"() {
      re = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
      parts = [
        "source",
        "protocol",
        "authority",
        "userInfo",
        "user",
        "password",
        "host",
        "port",
        "relative",
        "path",
        "directory",
        "file",
        "query",
        "anchor"
      ];
    }
  });

  // node_modules/engine.io-client/build/esm/socket.js
  var withEventListeners, OFFLINE_EVENT_LISTENERS, SocketWithoutUpgrade, SocketWithUpgrade, Socket;
  var init_socket = __esm({
    "node_modules/engine.io-client/build/esm/socket.js"() {
      init_transports();
      init_util();
      init_parseqs();
      init_parseuri();
      init_esm2();
      init_esm();
      init_globals();
      withEventListeners = typeof addEventListener === "function" && typeof removeEventListener === "function";
      OFFLINE_EVENT_LISTENERS = [];
      if (withEventListeners) {
        addEventListener("offline", () => {
          OFFLINE_EVENT_LISTENERS.forEach((listener) => listener());
        }, false);
      }
      SocketWithoutUpgrade = class _SocketWithoutUpgrade extends Emitter {
        /**
         * Socket constructor.
         *
         * @param {String|Object} uri - uri or options
         * @param {Object} opts - options
         */
        constructor(uri, opts) {
          super();
          this.binaryType = defaultBinaryType;
          this.writeBuffer = [];
          this._prevBufferLen = 0;
          this._pingInterval = -1;
          this._pingTimeout = -1;
          this._maxPayload = -1;
          this._pingTimeoutTime = Infinity;
          if (uri && "object" === typeof uri) {
            opts = uri;
            uri = null;
          }
          if (uri) {
            const parsedUri = parse(uri);
            opts.hostname = parsedUri.host;
            opts.secure = parsedUri.protocol === "https" || parsedUri.protocol === "wss";
            opts.port = parsedUri.port;
            if (parsedUri.query)
              opts.query = parsedUri.query;
          } else if (opts.host) {
            opts.hostname = parse(opts.host).host;
          }
          installTimerFunctions(this, opts);
          this.secure = null != opts.secure ? opts.secure : typeof location !== "undefined" && "https:" === location.protocol;
          if (opts.hostname && !opts.port) {
            opts.port = this.secure ? "443" : "80";
          }
          this.hostname = opts.hostname || (typeof location !== "undefined" ? location.hostname : "localhost");
          this.port = opts.port || (typeof location !== "undefined" && location.port ? location.port : this.secure ? "443" : "80");
          this.transports = [];
          this._transportsByName = {};
          opts.transports.forEach((t) => {
            const transportName = t.prototype.name;
            this.transports.push(transportName);
            this._transportsByName[transportName] = t;
          });
          this.opts = Object.assign({
            path: "/engine.io",
            agent: false,
            withCredentials: false,
            upgrade: true,
            timestampParam: "t",
            rememberUpgrade: false,
            addTrailingSlash: true,
            rejectUnauthorized: true,
            perMessageDeflate: {
              threshold: 1024
            },
            transportOptions: {},
            closeOnBeforeunload: false
          }, opts);
          this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : "");
          if (typeof this.opts.query === "string") {
            this.opts.query = decode2(this.opts.query);
          }
          if (withEventListeners) {
            if (this.opts.closeOnBeforeunload) {
              this._beforeunloadEventListener = () => {
                if (this.transport) {
                  this.transport.removeAllListeners();
                  this.transport.close();
                }
              };
              addEventListener("beforeunload", this._beforeunloadEventListener, false);
            }
            if (this.hostname !== "localhost") {
              this._offlineEventListener = () => {
                this._onClose("transport close", {
                  description: "network connection lost"
                });
              };
              OFFLINE_EVENT_LISTENERS.push(this._offlineEventListener);
            }
          }
          if (this.opts.withCredentials) {
            this._cookieJar = createCookieJar();
          }
          this._open();
        }
        /**
         * Creates transport of the given type.
         *
         * @param {String} name - transport name
         * @return {Transport}
         * @private
         */
        createTransport(name) {
          const query = Object.assign({}, this.opts.query);
          query.EIO = protocol;
          query.transport = name;
          if (this.id)
            query.sid = this.id;
          const opts = Object.assign({}, this.opts, {
            query,
            socket: this,
            hostname: this.hostname,
            secure: this.secure,
            port: this.port
          }, this.opts.transportOptions[name]);
          return new this._transportsByName[name](opts);
        }
        /**
         * Initializes transport to use and starts probe.
         *
         * @private
         */
        _open() {
          if (this.transports.length === 0) {
            this.setTimeoutFn(() => {
              this.emitReserved("error", "No transports available");
            }, 0);
            return;
          }
          const transportName = this.opts.rememberUpgrade && _SocketWithoutUpgrade.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1 ? "websocket" : this.transports[0];
          this.readyState = "opening";
          const transport = this.createTransport(transportName);
          transport.open();
          this.setTransport(transport);
        }
        /**
         * Sets the current transport. Disables the existing one (if any).
         *
         * @private
         */
        setTransport(transport) {
          if (this.transport) {
            this.transport.removeAllListeners();
          }
          this.transport = transport;
          transport.on("drain", this._onDrain.bind(this)).on("packet", this._onPacket.bind(this)).on("error", this._onError.bind(this)).on("close", (reason) => this._onClose("transport close", reason));
        }
        /**
         * Called when connection is deemed open.
         *
         * @private
         */
        onOpen() {
          this.readyState = "open";
          _SocketWithoutUpgrade.priorWebsocketSuccess = "websocket" === this.transport.name;
          this.emitReserved("open");
          this.flush();
        }
        /**
         * Handles a packet.
         *
         * @private
         */
        _onPacket(packet) {
          if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
            this.emitReserved("packet", packet);
            this.emitReserved("heartbeat");
            switch (packet.type) {
              case "open":
                this.onHandshake(JSON.parse(packet.data));
                break;
              case "ping":
                this._sendPacket("pong");
                this.emitReserved("ping");
                this.emitReserved("pong");
                this._resetPingTimeout();
                break;
              case "error":
                const err = new Error("server error");
                err.code = packet.data;
                this._onError(err);
                break;
              case "message":
                this.emitReserved("data", packet.data);
                this.emitReserved("message", packet.data);
                break;
            }
          } else {
          }
        }
        /**
         * Called upon handshake completion.
         *
         * @param {Object} data - handshake obj
         * @private
         */
        onHandshake(data) {
          this.emitReserved("handshake", data);
          this.id = data.sid;
          this.transport.query.sid = data.sid;
          this._pingInterval = data.pingInterval;
          this._pingTimeout = data.pingTimeout;
          this._maxPayload = data.maxPayload;
          this.onOpen();
          if ("closed" === this.readyState)
            return;
          this._resetPingTimeout();
        }
        /**
         * Sets and resets ping timeout timer based on server pings.
         *
         * @private
         */
        _resetPingTimeout() {
          this.clearTimeoutFn(this._pingTimeoutTimer);
          const delay = this._pingInterval + this._pingTimeout;
          this._pingTimeoutTime = Date.now() + delay;
          this._pingTimeoutTimer = this.setTimeoutFn(() => {
            this._onClose("ping timeout");
          }, delay);
          if (this.opts.autoUnref) {
            this._pingTimeoutTimer.unref();
          }
        }
        /**
         * Called on `drain` event
         *
         * @private
         */
        _onDrain() {
          this.writeBuffer.splice(0, this._prevBufferLen);
          this._prevBufferLen = 0;
          if (0 === this.writeBuffer.length) {
            this.emitReserved("drain");
          } else {
            this.flush();
          }
        }
        /**
         * Flush write buffers.
         *
         * @private
         */
        flush() {
          if ("closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
            const packets = this._getWritablePackets();
            this.transport.send(packets);
            this._prevBufferLen = packets.length;
            this.emitReserved("flush");
          }
        }
        /**
         * Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
         * long-polling)
         *
         * @private
         */
        _getWritablePackets() {
          const shouldCheckPayloadSize = this._maxPayload && this.transport.name === "polling" && this.writeBuffer.length > 1;
          if (!shouldCheckPayloadSize) {
            return this.writeBuffer;
          }
          let payloadSize = 1;
          for (let i = 0; i < this.writeBuffer.length; i++) {
            const data = this.writeBuffer[i].data;
            if (data) {
              payloadSize += byteLength(data);
            }
            if (i > 0 && payloadSize > this._maxPayload) {
              return this.writeBuffer.slice(0, i);
            }
            payloadSize += 2;
          }
          return this.writeBuffer;
        }
        /**
         * Checks whether the heartbeat timer has expired but the socket has not yet been notified.
         *
         * Note: this method is private for now because it does not really fit the WebSocket API, but if we put it in the
         * `write()` method then the message would not be buffered by the Socket.IO client.
         *
         * @return {boolean}
         * @private
         */
        /* private */
        _hasPingExpired() {
          if (!this._pingTimeoutTime)
            return true;
          const hasExpired = Date.now() > this._pingTimeoutTime;
          if (hasExpired) {
            this._pingTimeoutTime = 0;
            nextTick(() => {
              this._onClose("ping timeout");
            }, this.setTimeoutFn);
          }
          return hasExpired;
        }
        /**
         * Sends a message.
         *
         * @param {String} msg - message.
         * @param {Object} options.
         * @param {Function} fn - callback function.
         * @return {Socket} for chaining.
         */
        write(msg, options, fn) {
          this._sendPacket("message", msg, options, fn);
          return this;
        }
        /**
         * Sends a message. Alias of {@link Socket#write}.
         *
         * @param {String} msg - message.
         * @param {Object} options.
         * @param {Function} fn - callback function.
         * @return {Socket} for chaining.
         */
        send(msg, options, fn) {
          this._sendPacket("message", msg, options, fn);
          return this;
        }
        /**
         * Sends a packet.
         *
         * @param {String} type - packet type.
         * @param {String} data.
         * @param {Object} options.
         * @param {Function} fn - callback function.
         * @private
         */
        _sendPacket(type, data, options, fn) {
          if ("function" === typeof data) {
            fn = data;
            data = void 0;
          }
          if ("function" === typeof options) {
            fn = options;
            options = null;
          }
          if ("closing" === this.readyState || "closed" === this.readyState) {
            return;
          }
          options = options || {};
          options.compress = false !== options.compress;
          const packet = {
            type,
            data,
            options
          };
          this.emitReserved("packetCreate", packet);
          this.writeBuffer.push(packet);
          if (fn)
            this.once("flush", fn);
          this.flush();
        }
        /**
         * Closes the connection.
         */
        close() {
          const close = () => {
            this._onClose("forced close");
            this.transport.close();
          };
          const cleanupAndClose = () => {
            this.off("upgrade", cleanupAndClose);
            this.off("upgradeError", cleanupAndClose);
            close();
          };
          const waitForUpgrade = () => {
            this.once("upgrade", cleanupAndClose);
            this.once("upgradeError", cleanupAndClose);
          };
          if ("opening" === this.readyState || "open" === this.readyState) {
            this.readyState = "closing";
            if (this.writeBuffer.length) {
              this.once("drain", () => {
                if (this.upgrading) {
                  waitForUpgrade();
                } else {
                  close();
                }
              });
            } else if (this.upgrading) {
              waitForUpgrade();
            } else {
              close();
            }
          }
          return this;
        }
        /**
         * Called upon transport error
         *
         * @private
         */
        _onError(err) {
          _SocketWithoutUpgrade.priorWebsocketSuccess = false;
          if (this.opts.tryAllTransports && this.transports.length > 1 && this.readyState === "opening") {
            this.transports.shift();
            return this._open();
          }
          this.emitReserved("error", err);
          this._onClose("transport error", err);
        }
        /**
         * Called upon transport close.
         *
         * @private
         */
        _onClose(reason, description) {
          if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
            this.clearTimeoutFn(this._pingTimeoutTimer);
            this.transport.removeAllListeners("close");
            this.transport.close();
            this.transport.removeAllListeners();
            if (withEventListeners) {
              if (this._beforeunloadEventListener) {
                removeEventListener("beforeunload", this._beforeunloadEventListener, false);
              }
              if (this._offlineEventListener) {
                const i = OFFLINE_EVENT_LISTENERS.indexOf(this._offlineEventListener);
                if (i !== -1) {
                  OFFLINE_EVENT_LISTENERS.splice(i, 1);
                }
              }
            }
            this.readyState = "closed";
            this.id = null;
            this.emitReserved("close", reason, description);
            this.writeBuffer = [];
            this._prevBufferLen = 0;
          }
        }
      };
      SocketWithoutUpgrade.protocol = protocol;
      SocketWithUpgrade = class extends SocketWithoutUpgrade {
        constructor() {
          super(...arguments);
          this._upgrades = [];
        }
        onOpen() {
          super.onOpen();
          if ("open" === this.readyState && this.opts.upgrade) {
            for (let i = 0; i < this._upgrades.length; i++) {
              this._probe(this._upgrades[i]);
            }
          }
        }
        /**
         * Probes a transport.
         *
         * @param {String} name - transport name
         * @private
         */
        _probe(name) {
          let transport = this.createTransport(name);
          let failed = false;
          SocketWithoutUpgrade.priorWebsocketSuccess = false;
          const onTransportOpen = () => {
            if (failed)
              return;
            transport.send([{ type: "ping", data: "probe" }]);
            transport.once("packet", (msg) => {
              if (failed)
                return;
              if ("pong" === msg.type && "probe" === msg.data) {
                this.upgrading = true;
                this.emitReserved("upgrading", transport);
                if (!transport)
                  return;
                SocketWithoutUpgrade.priorWebsocketSuccess = "websocket" === transport.name;
                this.transport.pause(() => {
                  if (failed)
                    return;
                  if ("closed" === this.readyState)
                    return;
                  cleanup();
                  this.setTransport(transport);
                  transport.send([{ type: "upgrade" }]);
                  this.emitReserved("upgrade", transport);
                  transport = null;
                  this.upgrading = false;
                  this.flush();
                });
              } else {
                const err = new Error("probe error");
                err.transport = transport.name;
                this.emitReserved("upgradeError", err);
              }
            });
          };
          function freezeTransport() {
            if (failed)
              return;
            failed = true;
            cleanup();
            transport.close();
            transport = null;
          }
          const onerror = (err) => {
            const error = new Error("probe error: " + err);
            error.transport = transport.name;
            freezeTransport();
            this.emitReserved("upgradeError", error);
          };
          function onTransportClose() {
            onerror("transport closed");
          }
          function onclose() {
            onerror("socket closed");
          }
          function onupgrade(to) {
            if (transport && to.name !== transport.name) {
              freezeTransport();
            }
          }
          const cleanup = () => {
            transport.removeListener("open", onTransportOpen);
            transport.removeListener("error", onerror);
            transport.removeListener("close", onTransportClose);
            this.off("close", onclose);
            this.off("upgrading", onupgrade);
          };
          transport.once("open", onTransportOpen);
          transport.once("error", onerror);
          transport.once("close", onTransportClose);
          this.once("close", onclose);
          this.once("upgrading", onupgrade);
          if (this._upgrades.indexOf("webtransport") !== -1 && name !== "webtransport") {
            this.setTimeoutFn(() => {
              if (!failed) {
                transport.open();
              }
            }, 200);
          } else {
            transport.open();
          }
        }
        onHandshake(data) {
          this._upgrades = this._filterUpgrades(data.upgrades);
          super.onHandshake(data);
        }
        /**
         * Filters upgrades, returning only those matching client transports.
         *
         * @param {Array} upgrades - server upgrades
         * @private
         */
        _filterUpgrades(upgrades) {
          const filteredUpgrades = [];
          for (let i = 0; i < upgrades.length; i++) {
            if (~this.transports.indexOf(upgrades[i]))
              filteredUpgrades.push(upgrades[i]);
          }
          return filteredUpgrades;
        }
      };
      Socket = class extends SocketWithUpgrade {
        constructor(uri, opts = {}) {
          const isOptionsOnly = typeof uri === "object";
          const o = isOptionsOnly ? { ...uri } : { ...opts };
          if (!o.transports || o.transports && typeof o.transports[0] === "string") {
            o.transports = (o.transports || ["polling", "websocket", "webtransport"]).map((transportName) => transports[transportName]).filter((t) => !!t);
          }
          super(isOptionsOnly ? o : uri, o);
        }
      };
    }
  });

  // node_modules/engine.io-client/build/esm/transports/polling-fetch.js
  var Fetch;
  var init_polling_fetch = __esm({
    "node_modules/engine.io-client/build/esm/transports/polling-fetch.js"() {
      init_polling();
      Fetch = class extends Polling {
        doPoll() {
          this._fetch().then((res) => {
            if (!res.ok) {
              return this.onError("fetch read error", res.status, res);
            }
            res.text().then((data) => this.onData(data));
          }).catch((err) => {
            this.onError("fetch read error", err);
          });
        }
        doWrite(data, callback) {
          this._fetch(data).then((res) => {
            if (!res.ok) {
              return this.onError("fetch write error", res.status, res);
            }
            callback();
          }).catch((err) => {
            this.onError("fetch write error", err);
          });
        }
        _fetch(data) {
          var _a;
          const isPost = data !== void 0;
          const headers = new Headers(this.opts.extraHeaders);
          if (isPost) {
            headers.set("content-type", "text/plain;charset=UTF-8");
          }
          (_a = this.socket._cookieJar) === null || _a === void 0 ? void 0 : _a.appendCookies(headers);
          return fetch(this.uri(), {
            method: isPost ? "POST" : "GET",
            body: isPost ? data : null,
            headers,
            credentials: this.opts.withCredentials ? "include" : "omit"
          }).then((res) => {
            var _a2;
            (_a2 = this.socket._cookieJar) === null || _a2 === void 0 ? void 0 : _a2.parseCookies(res.headers.getSetCookie());
            return res;
          });
        }
      };
    }
  });

  // node_modules/engine.io-client/build/esm/index.js
  var protocol2;
  var init_esm3 = __esm({
    "node_modules/engine.io-client/build/esm/index.js"() {
      init_socket();
      init_socket();
      init_transport();
      init_transports();
      init_util();
      init_parseuri();
      init_globals();
      init_polling_fetch();
      init_polling_xhr();
      init_polling_xhr();
      init_websocket();
      init_websocket();
      init_webtransport();
      protocol2 = Socket.protocol;
    }
  });

  // node_modules/socket.io-client/build/esm/url.js
  function url(uri, path = "", loc) {
    let obj = uri;
    loc = loc || typeof location !== "undefined" && location;
    if (null == uri)
      uri = loc.protocol + "//" + loc.host;
    if (typeof uri === "string") {
      if ("/" === uri.charAt(0)) {
        if ("/" === uri.charAt(1)) {
          uri = loc.protocol + uri;
        } else {
          uri = loc.host + uri;
        }
      }
      if (!/^(https?|wss?):\/\//.test(uri)) {
        if ("undefined" !== typeof loc) {
          uri = loc.protocol + "//" + uri;
        } else {
          uri = "https://" + uri;
        }
      }
      obj = parse(uri);
    }
    if (!obj.port) {
      if (/^(http|ws)$/.test(obj.protocol)) {
        obj.port = "80";
      } else if (/^(http|ws)s$/.test(obj.protocol)) {
        obj.port = "443";
      }
    }
    obj.path = obj.path || "/";
    const ipv6 = obj.host.indexOf(":") !== -1;
    const host = ipv6 ? "[" + obj.host + "]" : obj.host;
    obj.id = obj.protocol + "://" + host + ":" + obj.port + path;
    obj.href = obj.protocol + "://" + host + (loc && loc.port === obj.port ? "" : ":" + obj.port);
    return obj;
  }
  var init_url = __esm({
    "node_modules/socket.io-client/build/esm/url.js"() {
      init_esm3();
    }
  });

  // node_modules/socket.io-parser/build/esm/is-binary.js
  function isBinary(obj) {
    return withNativeArrayBuffer3 && (obj instanceof ArrayBuffer || isView2(obj)) || withNativeBlob2 && obj instanceof Blob || withNativeFile && obj instanceof File;
  }
  function hasBinary(obj, toJSON) {
    if (!obj || typeof obj !== "object") {
      return false;
    }
    if (Array.isArray(obj)) {
      for (let i = 0, l = obj.length; i < l; i++) {
        if (hasBinary(obj[i])) {
          return true;
        }
      }
      return false;
    }
    if (isBinary(obj)) {
      return true;
    }
    if (obj.toJSON && typeof obj.toJSON === "function" && arguments.length === 1) {
      return hasBinary(obj.toJSON(), true);
    }
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
        return true;
      }
    }
    return false;
  }
  var withNativeArrayBuffer3, isView2, toString, withNativeBlob2, withNativeFile;
  var init_is_binary = __esm({
    "node_modules/socket.io-parser/build/esm/is-binary.js"() {
      withNativeArrayBuffer3 = typeof ArrayBuffer === "function";
      isView2 = (obj) => {
        return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj.buffer instanceof ArrayBuffer;
      };
      toString = Object.prototype.toString;
      withNativeBlob2 = typeof Blob === "function" || typeof Blob !== "undefined" && toString.call(Blob) === "[object BlobConstructor]";
      withNativeFile = typeof File === "function" || typeof File !== "undefined" && toString.call(File) === "[object FileConstructor]";
    }
  });

  // node_modules/socket.io-parser/build/esm/binary.js
  function deconstructPacket(packet) {
    const buffers = [];
    const packetData = packet.data;
    const pack = packet;
    pack.data = _deconstructPacket(packetData, buffers);
    pack.attachments = buffers.length;
    return { packet: pack, buffers };
  }
  function _deconstructPacket(data, buffers, toJSON) {
    if (!data)
      return data;
    if (isBinary(data)) {
      const placeholder = { _placeholder: true, num: buffers.length };
      buffers.push(data);
      return placeholder;
    } else if (Array.isArray(data)) {
      const newData = new Array(data.length);
      for (let i = 0; i < data.length; i++) {
        newData[i] = _deconstructPacket(data[i], buffers);
      }
      return newData;
    } else if (typeof data === "object" && !(data instanceof Date)) {
      if (data.toJSON && typeof data.toJSON === "function" && !toJSON) {
        return _deconstructPacket(data.toJSON(), buffers, true);
      }
      const newData = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          newData[key] = _deconstructPacket(data[key], buffers);
        }
      }
      return newData;
    }
    return data;
  }
  function reconstructPacket(packet, buffers) {
    packet.data = _reconstructPacket(packet.data, buffers);
    delete packet.attachments;
    return packet;
  }
  function _reconstructPacket(data, buffers) {
    if (!data)
      return data;
    if (data && data._placeholder === true) {
      const isIndexValid = typeof data.num === "number" && data.num >= 0 && data.num < buffers.length;
      if (isIndexValid) {
        return buffers[data.num];
      } else {
        throw new Error("illegal attachments");
      }
    } else if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        data[i] = _reconstructPacket(data[i], buffers);
      }
    } else if (typeof data === "object") {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          data[key] = _reconstructPacket(data[key], buffers);
        }
      }
    }
    return data;
  }
  var init_binary = __esm({
    "node_modules/socket.io-parser/build/esm/binary.js"() {
      init_is_binary();
    }
  });

  // node_modules/socket.io-parser/build/esm/index.js
  var esm_exports = {};
  __export(esm_exports, {
    Decoder: () => Decoder,
    Encoder: () => Encoder,
    PacketType: () => PacketType,
    isPacketValid: () => isPacketValid,
    protocol: () => protocol3
  });
  function isNamespaceValid(nsp) {
    return typeof nsp === "string";
  }
  function isAckIdValid(id) {
    return id === void 0 || isInteger(id);
  }
  function isObject(value2) {
    return Object.prototype.toString.call(value2) === "[object Object]";
  }
  function isDataValid(type, payload) {
    switch (type) {
      case PacketType.CONNECT:
        return payload === void 0 || isObject(payload);
      case PacketType.DISCONNECT:
        return payload === void 0;
      case PacketType.EVENT:
        return Array.isArray(payload) && (typeof payload[0] === "number" || typeof payload[0] === "string" && RESERVED_EVENTS.indexOf(payload[0]) === -1);
      case PacketType.ACK:
        return Array.isArray(payload);
      case PacketType.CONNECT_ERROR:
        return typeof payload === "string" || isObject(payload);
      default:
        return false;
    }
  }
  function isPacketValid(packet) {
    return isNamespaceValid(packet.nsp) && isAckIdValid(packet.id) && isDataValid(packet.type, packet.data);
  }
  var RESERVED_EVENTS, protocol3, PacketType, Encoder, Decoder, BinaryReconstructor, isInteger;
  var init_esm4 = __esm({
    "node_modules/socket.io-parser/build/esm/index.js"() {
      init_esm2();
      init_binary();
      init_is_binary();
      RESERVED_EVENTS = [
        "connect",
        // used on the client side
        "connect_error",
        // used on the client side
        "disconnect",
        // used on both sides
        "disconnecting",
        // used on the server side
        "newListener",
        // used by the Node.js EventEmitter
        "removeListener"
        // used by the Node.js EventEmitter
      ];
      protocol3 = 5;
      (function(PacketType2) {
        PacketType2[PacketType2["CONNECT"] = 0] = "CONNECT";
        PacketType2[PacketType2["DISCONNECT"] = 1] = "DISCONNECT";
        PacketType2[PacketType2["EVENT"] = 2] = "EVENT";
        PacketType2[PacketType2["ACK"] = 3] = "ACK";
        PacketType2[PacketType2["CONNECT_ERROR"] = 4] = "CONNECT_ERROR";
        PacketType2[PacketType2["BINARY_EVENT"] = 5] = "BINARY_EVENT";
        PacketType2[PacketType2["BINARY_ACK"] = 6] = "BINARY_ACK";
      })(PacketType || (PacketType = {}));
      Encoder = class {
        /**
         * Encoder constructor
         *
         * @param {function} replacer - custom replacer to pass down to JSON.parse
         */
        constructor(replacer) {
          this.replacer = replacer;
        }
        /**
         * Encode a packet as a single string if non-binary, or as a
         * buffer sequence, depending on packet type.
         *
         * @param {Object} obj - packet object
         */
        encode(obj) {
          if (obj.type === PacketType.EVENT || obj.type === PacketType.ACK) {
            if (hasBinary(obj)) {
              return this.encodeAsBinary({
                type: obj.type === PacketType.EVENT ? PacketType.BINARY_EVENT : PacketType.BINARY_ACK,
                nsp: obj.nsp,
                data: obj.data,
                id: obj.id
              });
            }
          }
          return [this.encodeAsString(obj)];
        }
        /**
         * Encode packet as string.
         */
        encodeAsString(obj) {
          let str = "" + obj.type;
          if (obj.type === PacketType.BINARY_EVENT || obj.type === PacketType.BINARY_ACK) {
            str += obj.attachments + "-";
          }
          if (obj.nsp && "/" !== obj.nsp) {
            str += obj.nsp + ",";
          }
          if (null != obj.id) {
            str += obj.id;
          }
          if (null != obj.data) {
            str += JSON.stringify(obj.data, this.replacer);
          }
          return str;
        }
        /**
         * Encode packet as 'buffer sequence' by removing blobs, and
         * deconstructing packet into object with placeholders and
         * a list of buffers.
         */
        encodeAsBinary(obj) {
          const deconstruction = deconstructPacket(obj);
          const pack = this.encodeAsString(deconstruction.packet);
          const buffers = deconstruction.buffers;
          buffers.unshift(pack);
          return buffers;
        }
      };
      Decoder = class _Decoder extends Emitter {
        /**
         * Decoder constructor
         */
        constructor(opts) {
          super();
          this.opts = Object.assign({
            reviver: void 0,
            maxAttachments: 10
          }, typeof opts === "function" ? { reviver: opts } : opts);
        }
        /**
         * Decodes an encoded packet string into packet JSON.
         *
         * @param {String} obj - encoded packet
         */
        add(obj) {
          let packet;
          if (typeof obj === "string") {
            if (this.reconstructor) {
              throw new Error("got plaintext data when reconstructing a packet");
            }
            packet = this.decodeString(obj);
            const isBinaryEvent = packet.type === PacketType.BINARY_EVENT;
            if (isBinaryEvent || packet.type === PacketType.BINARY_ACK) {
              packet.type = isBinaryEvent ? PacketType.EVENT : PacketType.ACK;
              this.reconstructor = new BinaryReconstructor(packet);
            } else {
              super.emitReserved("decoded", packet);
            }
          } else if (isBinary(obj) || obj.base64) {
            if (!this.reconstructor) {
              throw new Error("got binary data when not reconstructing a packet");
            } else {
              packet = this.reconstructor.takeBinaryData(obj);
              if (packet) {
                this.reconstructor = null;
                super.emitReserved("decoded", packet);
              }
            }
          } else {
            throw new Error("Unknown type: " + obj);
          }
        }
        /**
         * Decode a packet String (JSON data)
         *
         * @param {String} str
         * @return {Object} packet
         */
        decodeString(str) {
          let i = 0;
          const p = {
            type: Number(str.charAt(0))
          };
          if (PacketType[p.type] === void 0) {
            throw new Error("unknown packet type " + p.type);
          }
          if (p.type === PacketType.BINARY_EVENT || p.type === PacketType.BINARY_ACK) {
            const start = i + 1;
            while (str.charAt(++i) !== "-" && i != str.length) {
            }
            const buf = str.substring(start, i);
            if (buf != Number(buf) || str.charAt(i) !== "-") {
              throw new Error("Illegal attachments");
            }
            const n = Number(buf);
            if (!isInteger(n) || n < 1) {
              throw new Error("Illegal attachments");
            } else if (n > this.opts.maxAttachments) {
              throw new Error("too many attachments");
            }
            p.attachments = n;
          }
          if ("/" === str.charAt(i + 1)) {
            const start = i + 1;
            while (++i) {
              const c = str.charAt(i);
              if ("," === c)
                break;
              if (i === str.length)
                break;
            }
            p.nsp = str.substring(start, i);
          } else {
            p.nsp = "/";
          }
          const next = str.charAt(i + 1);
          if ("" !== next && Number(next) == next) {
            const start = i + 1;
            while (++i) {
              const c = str.charAt(i);
              if (null == c || Number(c) != c) {
                --i;
                break;
              }
              if (i === str.length)
                break;
            }
            p.id = Number(str.substring(start, i + 1));
          }
          if (str.charAt(++i)) {
            const payload = this.tryParse(str.substr(i));
            if (_Decoder.isPayloadValid(p.type, payload)) {
              p.data = payload;
            } else {
              throw new Error("invalid payload");
            }
          }
          return p;
        }
        tryParse(str) {
          try {
            return JSON.parse(str, this.opts.reviver);
          } catch (e) {
            return false;
          }
        }
        static isPayloadValid(type, payload) {
          switch (type) {
            case PacketType.CONNECT:
              return isObject(payload);
            case PacketType.DISCONNECT:
              return payload === void 0;
            case PacketType.CONNECT_ERROR:
              return typeof payload === "string" || isObject(payload);
            case PacketType.EVENT:
            case PacketType.BINARY_EVENT:
              return Array.isArray(payload) && (typeof payload[0] === "number" || typeof payload[0] === "string" && RESERVED_EVENTS.indexOf(payload[0]) === -1);
            case PacketType.ACK:
            case PacketType.BINARY_ACK:
              return Array.isArray(payload);
          }
        }
        /**
         * Deallocates a parser's resources
         */
        destroy() {
          if (this.reconstructor) {
            this.reconstructor.finishedReconstruction();
            this.reconstructor = null;
          }
        }
      };
      BinaryReconstructor = class {
        constructor(packet) {
          this.packet = packet;
          this.buffers = [];
          this.reconPack = packet;
        }
        /**
         * Method to be called when binary data received from connection
         * after a BINARY_EVENT packet.
         *
         * @param {Buffer | ArrayBuffer} binData - the raw binary data received
         * @return {null | Object} returns null if more binary data is expected or
         *   a reconstructed packet object if all buffers have been received.
         */
        takeBinaryData(binData) {
          this.buffers.push(binData);
          if (this.buffers.length === this.reconPack.attachments) {
            const packet = reconstructPacket(this.reconPack, this.buffers);
            this.finishedReconstruction();
            return packet;
          }
          return null;
        }
        /**
         * Cleans up binary packet reconstruction variables.
         */
        finishedReconstruction() {
          this.reconPack = null;
          this.buffers = [];
        }
      };
      isInteger = Number.isInteger || function(value2) {
        return typeof value2 === "number" && isFinite(value2) && Math.floor(value2) === value2;
      };
    }
  });

  // node_modules/socket.io-client/build/esm/on.js
  function on(obj, ev, fn) {
    obj.on(ev, fn);
    return function subDestroy() {
      obj.off(ev, fn);
    };
  }
  var init_on = __esm({
    "node_modules/socket.io-client/build/esm/on.js"() {
    }
  });

  // node_modules/socket.io-client/build/esm/socket.js
  var RESERVED_EVENTS2, Socket2;
  var init_socket2 = __esm({
    "node_modules/socket.io-client/build/esm/socket.js"() {
      init_esm4();
      init_on();
      init_esm2();
      RESERVED_EVENTS2 = Object.freeze({
        connect: 1,
        connect_error: 1,
        disconnect: 1,
        disconnecting: 1,
        // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
        newListener: 1,
        removeListener: 1
      });
      Socket2 = class extends Emitter {
        /**
         * `Socket` constructor.
         */
        constructor(io, nsp, opts) {
          super();
          this.connected = false;
          this.recovered = false;
          this.receiveBuffer = [];
          this.sendBuffer = [];
          this._queue = [];
          this._queueSeq = 0;
          this.ids = 0;
          this.acks = {};
          this.flags = {};
          this.io = io;
          this.nsp = nsp;
          if (opts && opts.auth) {
            this.auth = opts.auth;
          }
          this._opts = Object.assign({}, opts);
          if (this.io._autoConnect)
            this.open();
        }
        /**
         * Whether the socket is currently disconnected
         *
         * @example
         * const socket = io();
         *
         * socket.on("connect", () => {
         *   console.log(socket.disconnected); // false
         * });
         *
         * socket.on("disconnect", () => {
         *   console.log(socket.disconnected); // true
         * });
         */
        get disconnected() {
          return !this.connected;
        }
        /**
         * Subscribe to open, close and packet events
         *
         * @private
         */
        subEvents() {
          if (this.subs)
            return;
          const io = this.io;
          this.subs = [
            on(io, "open", this.onopen.bind(this)),
            on(io, "packet", this.onpacket.bind(this)),
            on(io, "error", this.onerror.bind(this)),
            on(io, "close", this.onclose.bind(this))
          ];
        }
        /**
         * Whether the Socket will try to reconnect when its Manager connects or reconnects.
         *
         * @example
         * const socket = io();
         *
         * console.log(socket.active); // true
         *
         * socket.on("disconnect", (reason) => {
         *   if (reason === "io server disconnect") {
         *     // the disconnection was initiated by the server, you need to manually reconnect
         *     console.log(socket.active); // false
         *   }
         *   // else the socket will automatically try to reconnect
         *   console.log(socket.active); // true
         * });
         */
        get active() {
          return !!this.subs;
        }
        /**
         * "Opens" the socket.
         *
         * @example
         * const socket = io({
         *   autoConnect: false
         * });
         *
         * socket.connect();
         */
        connect() {
          if (this.connected)
            return this;
          this.subEvents();
          if (!this.io["_reconnecting"])
            this.io.open();
          if ("open" === this.io._readyState)
            this.onopen();
          return this;
        }
        /**
         * Alias for {@link connect()}.
         */
        open() {
          return this.connect();
        }
        /**
         * Sends a `message` event.
         *
         * This method mimics the WebSocket.send() method.
         *
         * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
         *
         * @example
         * socket.send("hello");
         *
         * // this is equivalent to
         * socket.emit("message", "hello");
         *
         * @return self
         */
        send(...args) {
          args.unshift("message");
          this.emit.apply(this, args);
          return this;
        }
        /**
         * Override `emit`.
         * If the event is in `events`, it's emitted normally.
         *
         * @example
         * socket.emit("hello", "world");
         *
         * // all serializable datastructures are supported (no need to call JSON.stringify)
         * socket.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
         *
         * // with an acknowledgement from the server
         * socket.emit("hello", "world", (val) => {
         *   // ...
         * });
         *
         * @return self
         */
        emit(ev, ...args) {
          var _a, _b, _c;
          if (RESERVED_EVENTS2.hasOwnProperty(ev)) {
            throw new Error('"' + ev.toString() + '" is a reserved event name');
          }
          args.unshift(ev);
          if (this._opts.retries && !this.flags.fromQueue && !this.flags.volatile) {
            this._addToQueue(args);
            return this;
          }
          const packet = {
            type: PacketType.EVENT,
            data: args
          };
          packet.options = {};
          packet.options.compress = this.flags.compress !== false;
          if ("function" === typeof args[args.length - 1]) {
            const id = this.ids++;
            const ack = args.pop();
            this._registerAckCallback(id, ack);
            packet.id = id;
          }
          const isTransportWritable = (_b = (_a = this.io.engine) === null || _a === void 0 ? void 0 : _a.transport) === null || _b === void 0 ? void 0 : _b.writable;
          const isConnected = this.connected && !((_c = this.io.engine) === null || _c === void 0 ? void 0 : _c._hasPingExpired());
          const discardPacket = this.flags.volatile && !isTransportWritable;
          if (discardPacket) {
          } else if (isConnected) {
            this.notifyOutgoingListeners(packet);
            this.packet(packet);
          } else {
            this.sendBuffer.push(packet);
          }
          this.flags = {};
          return this;
        }
        /**
         * @private
         */
        _registerAckCallback(id, ack) {
          var _a;
          const timeout = (_a = this.flags.timeout) !== null && _a !== void 0 ? _a : this._opts.ackTimeout;
          if (timeout === void 0) {
            this.acks[id] = ack;
            return;
          }
          const timer = this.io.setTimeoutFn(() => {
            delete this.acks[id];
            for (let i = 0; i < this.sendBuffer.length; i++) {
              if (this.sendBuffer[i].id === id) {
                this.sendBuffer.splice(i, 1);
              }
            }
            ack.call(this, new Error("operation has timed out"));
          }, timeout);
          const fn = (...args) => {
            this.io.clearTimeoutFn(timer);
            ack.apply(this, args);
          };
          fn.withError = true;
          this.acks[id] = fn;
        }
        /**
         * Emits an event and waits for an acknowledgement
         *
         * @example
         * // without timeout
         * const response = await socket.emitWithAck("hello", "world");
         *
         * // with a specific timeout
         * try {
         *   const response = await socket.timeout(1000).emitWithAck("hello", "world");
         * } catch (err) {
         *   // the server did not acknowledge the event in the given delay
         * }
         *
         * @return a Promise that will be fulfilled when the server acknowledges the event
         */
        emitWithAck(ev, ...args) {
          return new Promise((resolve, reject) => {
            const fn = (arg1, arg2) => {
              return arg1 ? reject(arg1) : resolve(arg2);
            };
            fn.withError = true;
            args.push(fn);
            this.emit(ev, ...args);
          });
        }
        /**
         * Add the packet to the queue.
         * @param args
         * @private
         */
        _addToQueue(args) {
          let ack;
          if (typeof args[args.length - 1] === "function") {
            ack = args.pop();
          }
          const packet = {
            id: this._queueSeq++,
            tryCount: 0,
            pending: false,
            args,
            flags: Object.assign({ fromQueue: true }, this.flags)
          };
          args.push((err, ...responseArgs) => {
            if (packet !== this._queue[0]) {
            }
            const hasError = err !== null;
            if (hasError) {
              if (packet.tryCount > this._opts.retries) {
                this._queue.shift();
                if (ack) {
                  ack(err);
                }
              }
            } else {
              this._queue.shift();
              if (ack) {
                ack(null, ...responseArgs);
              }
            }
            packet.pending = false;
            return this._drainQueue();
          });
          this._queue.push(packet);
          this._drainQueue();
        }
        /**
         * Send the first packet of the queue, and wait for an acknowledgement from the server.
         * @param force - whether to resend a packet that has not been acknowledged yet
         *
         * @private
         */
        _drainQueue(force = false) {
          if (!this.connected || this._queue.length === 0) {
            return;
          }
          const packet = this._queue[0];
          if (packet.pending && !force) {
            return;
          }
          packet.pending = true;
          packet.tryCount++;
          this.flags = packet.flags;
          this.emit.apply(this, packet.args);
        }
        /**
         * Sends a packet.
         *
         * @param packet
         * @private
         */
        packet(packet) {
          packet.nsp = this.nsp;
          this.io._packet(packet);
        }
        /**
         * Called upon engine `open`.
         *
         * @private
         */
        onopen() {
          if (typeof this.auth == "function") {
            this.auth((data) => {
              this._sendConnectPacket(data);
            });
          } else {
            this._sendConnectPacket(this.auth);
          }
        }
        /**
         * Sends a CONNECT packet to initiate the Socket.IO session.
         *
         * @param data
         * @private
         */
        _sendConnectPacket(data) {
          this.packet({
            type: PacketType.CONNECT,
            data: this._pid ? Object.assign({ pid: this._pid, offset: this._lastOffset }, data) : data
          });
        }
        /**
         * Called upon engine or manager `error`.
         *
         * @param err
         * @private
         */
        onerror(err) {
          if (!this.connected) {
            this.emitReserved("connect_error", err);
          }
        }
        /**
         * Called upon engine `close`.
         *
         * @param reason
         * @param description
         * @private
         */
        onclose(reason, description) {
          this.connected = false;
          delete this.id;
          this.emitReserved("disconnect", reason, description);
          this._clearAcks();
        }
        /**
         * Clears the acknowledgement handlers upon disconnection, since the client will never receive an acknowledgement from
         * the server.
         *
         * @private
         */
        _clearAcks() {
          Object.keys(this.acks).forEach((id) => {
            const isBuffered = this.sendBuffer.some((packet) => String(packet.id) === id);
            if (!isBuffered) {
              const ack = this.acks[id];
              delete this.acks[id];
              if (ack.withError) {
                ack.call(this, new Error("socket has been disconnected"));
              }
            }
          });
        }
        /**
         * Called with socket packet.
         *
         * @param packet
         * @private
         */
        onpacket(packet) {
          const sameNamespace = packet.nsp === this.nsp;
          if (!sameNamespace)
            return;
          switch (packet.type) {
            case PacketType.CONNECT:
              if (packet.data && packet.data.sid) {
                this.onconnect(packet.data.sid, packet.data.pid);
              } else {
                this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
              }
              break;
            case PacketType.EVENT:
            case PacketType.BINARY_EVENT:
              this.onevent(packet);
              break;
            case PacketType.ACK:
            case PacketType.BINARY_ACK:
              this.onack(packet);
              break;
            case PacketType.DISCONNECT:
              this.ondisconnect();
              break;
            case PacketType.CONNECT_ERROR:
              this.destroy();
              const err = new Error(packet.data.message);
              err.data = packet.data.data;
              this.emitReserved("connect_error", err);
              break;
          }
        }
        /**
         * Called upon a server event.
         *
         * @param packet
         * @private
         */
        onevent(packet) {
          const args = packet.data || [];
          if (null != packet.id) {
            args.push(this.ack(packet.id));
          }
          if (this.connected) {
            this.emitEvent(args);
          } else {
            this.receiveBuffer.push(Object.freeze(args));
          }
        }
        emitEvent(args) {
          if (this._anyListeners && this._anyListeners.length) {
            const listeners = this._anyListeners.slice();
            for (const listener of listeners) {
              listener.apply(this, args);
            }
          }
          super.emit.apply(this, args);
          if (this._pid && args.length && typeof args[args.length - 1] === "string") {
            this._lastOffset = args[args.length - 1];
          }
        }
        /**
         * Produces an ack callback to emit with an event.
         *
         * @private
         */
        ack(id) {
          const self2 = this;
          let sent = false;
          return function(...args) {
            if (sent)
              return;
            sent = true;
            self2.packet({
              type: PacketType.ACK,
              id,
              data: args
            });
          };
        }
        /**
         * Called upon a server acknowledgement.
         *
         * @param packet
         * @private
         */
        onack(packet) {
          const ack = this.acks[packet.id];
          if (typeof ack !== "function") {
            return;
          }
          delete this.acks[packet.id];
          if (ack.withError) {
            packet.data.unshift(null);
          }
          ack.apply(this, packet.data);
        }
        /**
         * Called upon server connect.
         *
         * @private
         */
        onconnect(id, pid) {
          this.id = id;
          this.recovered = pid && this._pid === pid;
          this._pid = pid;
          this.connected = true;
          this.emitBuffered();
          this._drainQueue(true);
          this.emitReserved("connect");
        }
        /**
         * Emit buffered events (received and emitted).
         *
         * @private
         */
        emitBuffered() {
          this.receiveBuffer.forEach((args) => this.emitEvent(args));
          this.receiveBuffer = [];
          this.sendBuffer.forEach((packet) => {
            this.notifyOutgoingListeners(packet);
            this.packet(packet);
          });
          this.sendBuffer = [];
        }
        /**
         * Called upon server disconnect.
         *
         * @private
         */
        ondisconnect() {
          this.destroy();
          this.onclose("io server disconnect");
        }
        /**
         * Called upon forced client/server side disconnections,
         * this method ensures the manager stops tracking us and
         * that reconnections don't get triggered for this.
         *
         * @private
         */
        destroy() {
          if (this.subs) {
            this.subs.forEach((subDestroy) => subDestroy());
            this.subs = void 0;
          }
          this.io["_destroy"](this);
        }
        /**
         * Disconnects the socket manually. In that case, the socket will not try to reconnect.
         *
         * If this is the last active Socket instance of the {@link Manager}, the low-level connection will be closed.
         *
         * @example
         * const socket = io();
         *
         * socket.on("disconnect", (reason) => {
         *   // console.log(reason); prints "io client disconnect"
         * });
         *
         * socket.disconnect();
         *
         * @return self
         */
        disconnect() {
          if (this.connected) {
            this.packet({ type: PacketType.DISCONNECT });
          }
          this.destroy();
          if (this.connected) {
            this.onclose("io client disconnect");
          }
          return this;
        }
        /**
         * Alias for {@link disconnect()}.
         *
         * @return self
         */
        close() {
          return this.disconnect();
        }
        /**
         * Sets the compress flag.
         *
         * @example
         * socket.compress(false).emit("hello");
         *
         * @param compress - if `true`, compresses the sending data
         * @return self
         */
        compress(compress) {
          this.flags.compress = compress;
          return this;
        }
        /**
         * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
         * ready to send messages.
         *
         * @example
         * socket.volatile.emit("hello"); // the server may or may not receive it
         *
         * @returns self
         */
        get volatile() {
          this.flags.volatile = true;
          return this;
        }
        /**
         * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
         * given number of milliseconds have elapsed without an acknowledgement from the server:
         *
         * @example
         * socket.timeout(5000).emit("my-event", (err) => {
         *   if (err) {
         *     // the server did not acknowledge the event in the given delay
         *   }
         * });
         *
         * @returns self
         */
        timeout(timeout) {
          this.flags.timeout = timeout;
          return this;
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback.
         *
         * @example
         * socket.onAny((event, ...args) => {
         *   console.log(`got ${event}`);
         * });
         *
         * @param listener
         */
        onAny(listener) {
          this._anyListeners = this._anyListeners || [];
          this._anyListeners.push(listener);
          return this;
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback. The listener is added to the beginning of the listeners array.
         *
         * @example
         * socket.prependAny((event, ...args) => {
         *   console.log(`got event ${event}`);
         * });
         *
         * @param listener
         */
        prependAny(listener) {
          this._anyListeners = this._anyListeners || [];
          this._anyListeners.unshift(listener);
          return this;
        }
        /**
         * Removes the listener that will be fired when any event is emitted.
         *
         * @example
         * const catchAllListener = (event, ...args) => {
         *   console.log(`got event ${event}`);
         * }
         *
         * socket.onAny(catchAllListener);
         *
         * // remove a specific listener
         * socket.offAny(catchAllListener);
         *
         * // or remove all listeners
         * socket.offAny();
         *
         * @param listener
         */
        offAny(listener) {
          if (!this._anyListeners) {
            return this;
          }
          if (listener) {
            const listeners = this._anyListeners;
            for (let i = 0; i < listeners.length; i++) {
              if (listener === listeners[i]) {
                listeners.splice(i, 1);
                return this;
              }
            }
          } else {
            this._anyListeners = [];
          }
          return this;
        }
        /**
         * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
         * e.g. to remove listeners.
         */
        listenersAny() {
          return this._anyListeners || [];
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback.
         *
         * Note: acknowledgements sent to the server are not included.
         *
         * @example
         * socket.onAnyOutgoing((event, ...args) => {
         *   console.log(`sent event ${event}`);
         * });
         *
         * @param listener
         */
        onAnyOutgoing(listener) {
          this._anyOutgoingListeners = this._anyOutgoingListeners || [];
          this._anyOutgoingListeners.push(listener);
          return this;
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback. The listener is added to the beginning of the listeners array.
         *
         * Note: acknowledgements sent to the server are not included.
         *
         * @example
         * socket.prependAnyOutgoing((event, ...args) => {
         *   console.log(`sent event ${event}`);
         * });
         *
         * @param listener
         */
        prependAnyOutgoing(listener) {
          this._anyOutgoingListeners = this._anyOutgoingListeners || [];
          this._anyOutgoingListeners.unshift(listener);
          return this;
        }
        /**
         * Removes the listener that will be fired when any event is emitted.
         *
         * @example
         * const catchAllListener = (event, ...args) => {
         *   console.log(`sent event ${event}`);
         * }
         *
         * socket.onAnyOutgoing(catchAllListener);
         *
         * // remove a specific listener
         * socket.offAnyOutgoing(catchAllListener);
         *
         * // or remove all listeners
         * socket.offAnyOutgoing();
         *
         * @param [listener] - the catch-all listener (optional)
         */
        offAnyOutgoing(listener) {
          if (!this._anyOutgoingListeners) {
            return this;
          }
          if (listener) {
            const listeners = this._anyOutgoingListeners;
            for (let i = 0; i < listeners.length; i++) {
              if (listener === listeners[i]) {
                listeners.splice(i, 1);
                return this;
              }
            }
          } else {
            this._anyOutgoingListeners = [];
          }
          return this;
        }
        /**
         * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
         * e.g. to remove listeners.
         */
        listenersAnyOutgoing() {
          return this._anyOutgoingListeners || [];
        }
        /**
         * Notify the listeners for each packet sent
         *
         * @param packet
         *
         * @private
         */
        notifyOutgoingListeners(packet) {
          if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
            const listeners = this._anyOutgoingListeners.slice();
            for (const listener of listeners) {
              listener.apply(this, packet.data);
            }
          }
        }
      };
    }
  });

  // node_modules/socket.io-client/build/esm/contrib/backo2.js
  function Backoff(opts) {
    opts = opts || {};
    this.ms = opts.min || 100;
    this.max = opts.max || 1e4;
    this.factor = opts.factor || 2;
    this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
    this.attempts = 0;
  }
  var init_backo2 = __esm({
    "node_modules/socket.io-client/build/esm/contrib/backo2.js"() {
      Backoff.prototype.duration = function() {
        var ms = this.ms * Math.pow(this.factor, this.attempts++);
        if (this.jitter) {
          var rand = Math.random();
          var deviation = Math.floor(rand * this.jitter * ms);
          ms = (Math.floor(rand * 10) & 1) == 0 ? ms - deviation : ms + deviation;
        }
        return Math.min(ms, this.max) | 0;
      };
      Backoff.prototype.reset = function() {
        this.attempts = 0;
      };
      Backoff.prototype.setMin = function(min) {
        this.ms = min;
      };
      Backoff.prototype.setMax = function(max) {
        this.max = max;
      };
      Backoff.prototype.setJitter = function(jitter) {
        this.jitter = jitter;
      };
    }
  });

  // node_modules/socket.io-client/build/esm/manager.js
  var Manager;
  var init_manager = __esm({
    "node_modules/socket.io-client/build/esm/manager.js"() {
      init_esm3();
      init_socket2();
      init_esm4();
      init_on();
      init_backo2();
      init_esm2();
      Manager = class extends Emitter {
        constructor(uri, opts) {
          var _a;
          super();
          this.nsps = {};
          this.subs = [];
          if (uri && "object" === typeof uri) {
            opts = uri;
            uri = void 0;
          }
          opts = opts || {};
          opts.path = opts.path || "/socket.io";
          this.opts = opts;
          installTimerFunctions(this, opts);
          this.reconnection(opts.reconnection !== false);
          this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
          this.reconnectionDelay(opts.reconnectionDelay || 1e3);
          this.reconnectionDelayMax(opts.reconnectionDelayMax || 5e3);
          this.randomizationFactor((_a = opts.randomizationFactor) !== null && _a !== void 0 ? _a : 0.5);
          this.backoff = new Backoff({
            min: this.reconnectionDelay(),
            max: this.reconnectionDelayMax(),
            jitter: this.randomizationFactor()
          });
          this.timeout(null == opts.timeout ? 2e4 : opts.timeout);
          this._readyState = "closed";
          this.uri = uri;
          const _parser = opts.parser || esm_exports;
          this.encoder = new _parser.Encoder();
          this.decoder = new _parser.Decoder();
          this._autoConnect = opts.autoConnect !== false;
          if (this._autoConnect)
            this.open();
        }
        reconnection(v) {
          if (!arguments.length)
            return this._reconnection;
          this._reconnection = !!v;
          if (!v) {
            this.skipReconnect = true;
          }
          return this;
        }
        reconnectionAttempts(v) {
          if (v === void 0)
            return this._reconnectionAttempts;
          this._reconnectionAttempts = v;
          return this;
        }
        reconnectionDelay(v) {
          var _a;
          if (v === void 0)
            return this._reconnectionDelay;
          this._reconnectionDelay = v;
          (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMin(v);
          return this;
        }
        randomizationFactor(v) {
          var _a;
          if (v === void 0)
            return this._randomizationFactor;
          this._randomizationFactor = v;
          (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setJitter(v);
          return this;
        }
        reconnectionDelayMax(v) {
          var _a;
          if (v === void 0)
            return this._reconnectionDelayMax;
          this._reconnectionDelayMax = v;
          (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMax(v);
          return this;
        }
        timeout(v) {
          if (!arguments.length)
            return this._timeout;
          this._timeout = v;
          return this;
        }
        /**
         * Starts trying to reconnect if reconnection is enabled and we have not
         * started reconnecting yet
         *
         * @private
         */
        maybeReconnectOnOpen() {
          if (!this._reconnecting && this._reconnection && this.backoff.attempts === 0) {
            this.reconnect();
          }
        }
        /**
         * Sets the current transport `socket`.
         *
         * @param {Function} fn - optional, callback
         * @return self
         * @public
         */
        open(fn) {
          if (~this._readyState.indexOf("open"))
            return this;
          this.engine = new Socket(this.uri, this.opts);
          const socket = this.engine;
          const self2 = this;
          this._readyState = "opening";
          this.skipReconnect = false;
          const openSubDestroy = on(socket, "open", function() {
            self2.onopen();
            fn && fn();
          });
          const onError = (err) => {
            this.cleanup();
            this._readyState = "closed";
            this.emitReserved("error", err);
            if (fn) {
              fn(err);
            } else {
              this.maybeReconnectOnOpen();
            }
          };
          const errorSub = on(socket, "error", onError);
          if (false !== this._timeout) {
            const timeout = this._timeout;
            const timer = this.setTimeoutFn(() => {
              openSubDestroy();
              onError(new Error("timeout"));
              socket.close();
            }, timeout);
            if (this.opts.autoUnref) {
              timer.unref();
            }
            this.subs.push(() => {
              this.clearTimeoutFn(timer);
            });
          }
          this.subs.push(openSubDestroy);
          this.subs.push(errorSub);
          return this;
        }
        /**
         * Alias for open()
         *
         * @return self
         * @public
         */
        connect(fn) {
          return this.open(fn);
        }
        /**
         * Called upon transport open.
         *
         * @private
         */
        onopen() {
          this.cleanup();
          this._readyState = "open";
          this.emitReserved("open");
          const socket = this.engine;
          this.subs.push(
            on(socket, "ping", this.onping.bind(this)),
            on(socket, "data", this.ondata.bind(this)),
            on(socket, "error", this.onerror.bind(this)),
            on(socket, "close", this.onclose.bind(this)),
            // @ts-ignore
            on(this.decoder, "decoded", this.ondecoded.bind(this))
          );
        }
        /**
         * Called upon a ping.
         *
         * @private
         */
        onping() {
          this.emitReserved("ping");
        }
        /**
         * Called with data.
         *
         * @private
         */
        ondata(data) {
          try {
            this.decoder.add(data);
          } catch (e) {
            this.onclose("parse error", e);
          }
        }
        /**
         * Called when parser fully decodes a packet.
         *
         * @private
         */
        ondecoded(packet) {
          nextTick(() => {
            this.emitReserved("packet", packet);
          }, this.setTimeoutFn);
        }
        /**
         * Called upon socket error.
         *
         * @private
         */
        onerror(err) {
          this.emitReserved("error", err);
        }
        /**
         * Creates a new socket for the given `nsp`.
         *
         * @return {Socket}
         * @public
         */
        socket(nsp, opts) {
          let socket = this.nsps[nsp];
          if (!socket) {
            socket = new Socket2(this, nsp, opts);
            this.nsps[nsp] = socket;
          } else if (this._autoConnect && !socket.active) {
            socket.connect();
          }
          return socket;
        }
        /**
         * Called upon a socket close.
         *
         * @param socket
         * @private
         */
        _destroy(socket) {
          const nsps = Object.keys(this.nsps);
          for (const nsp of nsps) {
            const socket2 = this.nsps[nsp];
            if (socket2.active) {
              return;
            }
          }
          this._close();
        }
        /**
         * Writes a packet.
         *
         * @param packet
         * @private
         */
        _packet(packet) {
          const encodedPackets = this.encoder.encode(packet);
          for (let i = 0; i < encodedPackets.length; i++) {
            this.engine.write(encodedPackets[i], packet.options);
          }
        }
        /**
         * Clean up transport subscriptions and packet buffer.
         *
         * @private
         */
        cleanup() {
          this.subs.forEach((subDestroy) => subDestroy());
          this.subs.length = 0;
          this.decoder.destroy();
        }
        /**
         * Close the current socket.
         *
         * @private
         */
        _close() {
          this.skipReconnect = true;
          this._reconnecting = false;
          this.onclose("forced close");
        }
        /**
         * Alias for close()
         *
         * @private
         */
        disconnect() {
          return this._close();
        }
        /**
         * Called when:
         *
         * - the low-level engine is closed
         * - the parser encountered a badly formatted packet
         * - all sockets are disconnected
         *
         * @private
         */
        onclose(reason, description) {
          var _a;
          this.cleanup();
          (_a = this.engine) === null || _a === void 0 ? void 0 : _a.close();
          this.backoff.reset();
          this._readyState = "closed";
          this.emitReserved("close", reason, description);
          if (this._reconnection && !this.skipReconnect) {
            this.reconnect();
          }
        }
        /**
         * Attempt a reconnection.
         *
         * @private
         */
        reconnect() {
          if (this._reconnecting || this.skipReconnect)
            return this;
          const self2 = this;
          if (this.backoff.attempts >= this._reconnectionAttempts) {
            this.backoff.reset();
            this.emitReserved("reconnect_failed");
            this._reconnecting = false;
          } else {
            const delay = this.backoff.duration();
            this._reconnecting = true;
            const timer = this.setTimeoutFn(() => {
              if (self2.skipReconnect)
                return;
              this.emitReserved("reconnect_attempt", self2.backoff.attempts);
              if (self2.skipReconnect)
                return;
              self2.open((err) => {
                if (err) {
                  self2._reconnecting = false;
                  self2.reconnect();
                  this.emitReserved("reconnect_error", err);
                } else {
                  self2.onreconnect();
                }
              });
            }, delay);
            if (this.opts.autoUnref) {
              timer.unref();
            }
            this.subs.push(() => {
              this.clearTimeoutFn(timer);
            });
          }
        }
        /**
         * Called upon successful reconnect.
         *
         * @private
         */
        onreconnect() {
          const attempt = this.backoff.attempts;
          this._reconnecting = false;
          this.backoff.reset();
          this.emitReserved("reconnect", attempt);
        }
      };
    }
  });

  // node_modules/socket.io-client/build/esm/index.js
  var esm_exports2 = {};
  __export(esm_exports2, {
    Fetch: () => Fetch,
    Manager: () => Manager,
    NodeWebSocket: () => WS,
    NodeXHR: () => XHR,
    Socket: () => Socket2,
    WebSocket: () => WS,
    WebTransport: () => WT,
    XHR: () => XHR,
    connect: () => lookup2,
    default: () => lookup2,
    io: () => lookup2,
    protocol: () => protocol3
  });
  function lookup2(uri, opts) {
    if (typeof uri === "object") {
      opts = uri;
      uri = void 0;
    }
    opts = opts || {};
    const parsed = url(uri, opts.path || "/socket.io");
    const source = parsed.source;
    const id = parsed.id;
    const path = parsed.path;
    const sameNamespace = cache[id] && path in cache[id]["nsps"];
    const newConnection = opts.forceNew || opts["force new connection"] || false === opts.multiplex || sameNamespace;
    let io;
    if (newConnection) {
      io = new Manager(source, opts);
    } else {
      if (!cache[id]) {
        cache[id] = new Manager(source, opts);
      }
      io = cache[id];
    }
    if (parsed.query && !opts.query) {
      opts.query = parsed.queryKey;
    }
    return io.socket(parsed.path, opts);
  }
  var cache;
  var init_esm5 = __esm({
    "node_modules/socket.io-client/build/esm/index.js"() {
      init_url();
      init_manager();
      init_socket2();
      init_esm4();
      init_esm3();
      cache = {};
      Object.assign(lookup2, {
        Manager,
        Socket: Socket2,
        io: lookup2,
        connect: lookup2
      });
    }
  });

  // node_modules/@insforge/sdk/dist/index.js
  var require_index = __commonJS({
    "node_modules/@insforge/sdk/dist/index.js"(exports, module) {
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export2 = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var src_exports = {};
      __export2(src_exports, {
        AI: () => AI,
        Auth: () => Auth,
        AuthChangeEvent: () => AuthChangeEvent,
        Database: () => Database,
        Emails: () => Emails,
        Functions: () => Functions,
        HttpClient: () => HttpClient,
        InsForgeClient: () => InsForgeClient,
        InsForgeError: () => InsForgeError,
        Logger: () => Logger,
        Payments: () => Payments,
        Realtime: () => Realtime,
        Storage: () => Storage,
        StorageBucket: () => StorageBucket,
        createAdminClient: () => createAdminClient,
        createClient: () => createClient,
        default: () => src_default
      });
      module.exports = __toCommonJS2(src_exports);
      var InsForgeError = class _InsForgeError extends Error {
        constructor(message, statusCode, error, nextActions) {
          super(message);
          this.name = "InsForgeError";
          this.statusCode = statusCode;
          this.error = error;
          this.nextActions = nextActions;
        }
        static fromApiError(apiError) {
          return new _InsForgeError(
            apiError.message,
            apiError.statusCode,
            apiError.error,
            apiError.nextActions
          );
        }
      };
      var SENSITIVE_HEADERS = ["authorization", "x-api-key", "cookie", "set-cookie"];
      var SENSITIVE_BODY_KEYS = [
        "password",
        "token",
        "accesstoken",
        "refreshtoken",
        "authorization",
        "secret",
        "apikey",
        "api_key",
        "email",
        "ssn",
        "creditcard",
        "credit_card"
      ];
      function redactHeaders(headers) {
        const redacted = {};
        for (const [key, value2] of Object.entries(headers)) {
          if (SENSITIVE_HEADERS.includes(key.toLowerCase())) {
            redacted[key] = "***REDACTED***";
          } else {
            redacted[key] = value2;
          }
        }
        return redacted;
      }
      function sanitizeBody(body) {
        if (body === null || body === void 0) {
          return body;
        }
        if (typeof body === "string") {
          try {
            const parsed = JSON.parse(body);
            return sanitizeBody(parsed);
          } catch {
            return body;
          }
        }
        if (Array.isArray(body)) {
          return body.map(sanitizeBody);
        }
        if (typeof body === "object") {
          const sanitized = {};
          for (const [key, value2] of Object.entries(body)) {
            if (SENSITIVE_BODY_KEYS.includes(key.toLowerCase().replace(/[-_]/g, ""))) {
              sanitized[key] = "***REDACTED***";
            } else {
              sanitized[key] = sanitizeBody(value2);
            }
          }
          return sanitized;
        }
        return body;
      }
      function formatBody(body) {
        if (body === void 0 || body === null) {
          return "";
        }
        if (typeof body === "string") {
          try {
            return JSON.stringify(JSON.parse(body), null, 2);
          } catch {
            return body;
          }
        }
        if (typeof FormData !== "undefined" && body instanceof FormData) {
          return "[FormData]";
        }
        try {
          return JSON.stringify(body, null, 2);
        } catch {
          return "[Unserializable body]";
        }
      }
      var Logger = class {
        /**
         * Creates a new Logger instance.
         * @param debug - Set to true to enable console logging, or pass a custom log function
         */
        constructor(debug) {
          if (typeof debug === "function") {
            this.enabled = true;
            this.customLog = debug;
          } else {
            this.enabled = !!debug;
            this.customLog = null;
          }
        }
        /**
         * Logs a debug message at the info level.
         * @param message - The message to log
         * @param args - Additional arguments to pass to the log function
         */
        log(message, ...args) {
          if (!this.enabled) {
            return;
          }
          const formatted = `[InsForge Debug] ${message}`;
          if (this.customLog) {
            this.customLog(formatted, ...args);
          } else {
            console.log(formatted, ...args);
          }
        }
        /**
         * Logs a debug message at the warning level.
         * @param message - The message to log
         * @param args - Additional arguments to pass to the log function
         */
        warn(message, ...args) {
          if (!this.enabled) {
            return;
          }
          const formatted = `[InsForge Debug] ${message}`;
          if (this.customLog) {
            this.customLog(formatted, ...args);
          } else {
            console.warn(formatted, ...args);
          }
        }
        /**
         * Logs a debug message at the error level.
         * @param message - The message to log
         * @param args - Additional arguments to pass to the log function
         */
        error(message, ...args) {
          if (!this.enabled) {
            return;
          }
          const formatted = `[InsForge Debug] ${message}`;
          if (this.customLog) {
            this.customLog(formatted, ...args);
          } else {
            console.error(formatted, ...args);
          }
        }
        /**
         * Logs an outgoing HTTP request with method, URL, headers, and body.
         * Sensitive headers and body fields are automatically redacted.
         * @param method - HTTP method (GET, POST, etc.)
         * @param url - The full request URL
         * @param headers - Request headers (sensitive values will be redacted)
         * @param body - Request body (sensitive fields will be masked)
         */
        logRequest(method, url2, headers, body) {
          if (!this.enabled) {
            return;
          }
          const parts2 = [`\u2192 ${method} ${url2}`];
          if (headers && Object.keys(headers).length > 0) {
            parts2.push(`  Headers: ${JSON.stringify(redactHeaders(headers))}`);
          }
          const formattedBody = formatBody(sanitizeBody(body));
          if (formattedBody) {
            const truncated = formattedBody.length > 1e3 ? formattedBody.slice(0, 1e3) + "... [truncated]" : formattedBody;
            parts2.push(`  Body: ${truncated}`);
          }
          this.log(parts2.join("\n"));
        }
        /**
         * Logs an incoming HTTP response with method, URL, status, duration, and body.
         * Error responses (4xx/5xx) are logged at the error level.
         * @param method - HTTP method (GET, POST, etc.)
         * @param url - The full request URL
         * @param status - HTTP response status code
         * @param durationMs - Request duration in milliseconds
         * @param body - Response body (sensitive fields will be masked, large bodies truncated)
         */
        logResponse(method, url2, status, durationMs, body) {
          if (!this.enabled) {
            return;
          }
          const parts2 = [`\u2190 ${method} ${url2} ${status} (${durationMs}ms)`];
          const formattedBody = formatBody(sanitizeBody(body));
          if (formattedBody) {
            const truncated = formattedBody.length > 1e3 ? formattedBody.slice(0, 1e3) + "... [truncated]" : formattedBody;
            parts2.push(`  Body: ${truncated}`);
          }
          if (status >= 400) {
            this.error(parts2.join("\n"));
          } else {
            this.log(parts2.join("\n"));
          }
        }
      };
      var AuthChangeEvent = {
        SIGNED_IN: "signedIn",
        SIGNED_OUT: "signedOut",
        TOKEN_REFRESHED: "tokenRefreshed"
      };
      var CSRF_TOKEN_COOKIE = "insforge_csrf_token";
      function getCsrfToken() {
        if (typeof document === "undefined") {
          return null;
        }
        const match = document.cookie.split(";").find((c) => c.trim().startsWith(`${CSRF_TOKEN_COOKIE}=`));
        if (!match) {
          return null;
        }
        return match.split("=")[1] || null;
      }
      function setCsrfToken(token) {
        if (typeof document === "undefined") {
          return;
        }
        const maxAge = 7 * 24 * 60 * 60;
        const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
        document.cookie = `${CSRF_TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
      }
      function clearCsrfToken() {
        if (typeof document === "undefined") {
          return;
        }
        const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
        document.cookie = `${CSRF_TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax${secure}`;
      }
      var TokenManager = class {
        constructor() {
          this.accessToken = null;
          this.user = null;
          this.authStateChangeCallbacks = /* @__PURE__ */ new Map();
        }
        /**
         * Save session in memory
         */
        saveSession(session, event = AuthChangeEvent.SIGNED_IN) {
          const tokenChanged = session.accessToken !== this.accessToken;
          this.accessToken = session.accessToken;
          this.user = session.user;
          if (tokenChanged) {
            this.notifyAuthStateChange(event);
          }
        }
        /**
         * Get current session
         */
        getSession() {
          if (!this.accessToken || !this.user) {
            return null;
          }
          return {
            accessToken: this.accessToken,
            user: this.user
          };
        }
        /**
         * Get access token
         */
        getAccessToken() {
          return this.accessToken;
        }
        /**
         * Set access token
         */
        setAccessToken(token, event = AuthChangeEvent.SIGNED_IN) {
          const tokenChanged = token !== this.accessToken;
          this.accessToken = token;
          if (tokenChanged) {
            this.notifyAuthStateChange(event);
          }
        }
        /**
         * Get user
         */
        getUser() {
          return this.user;
        }
        /**
         * Set user
         */
        setUser(user) {
          this.user = user;
        }
        /**
         * Clear in-memory session
         */
        clearSession() {
          const hadToken = this.accessToken !== null;
          this.accessToken = null;
          this.user = null;
          if (hadToken) {
            this.notifyAuthStateChange(AuthChangeEvent.SIGNED_OUT);
          }
        }
        onAuthStateChange(callback) {
          const id = /* @__PURE__ */ Symbol("auth-state-change");
          this.authStateChangeCallbacks.set(id, callback);
          return () => this.authStateChangeCallbacks.delete(id);
        }
        notifyAuthStateChange(event) {
          for (const callback of this.authStateChangeCallbacks.values()) {
            try {
              callback(event);
            } catch (error) {
              console.error("Error in auth state change callback:", error);
            }
          }
        }
      };
      function decodeBase64Url(input) {
        const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
        const padded = normalized.padEnd(normalized.length + (4 - normalized.length % 4) % 4, "=");
        const binary = atob(padded);
        const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
        return new TextDecoder().decode(bytes);
      }
      function getJwtExpiration(token) {
        if (!token) {
          return null;
        }
        const [, payload] = token.split(".");
        if (!payload) {
          return null;
        }
        try {
          const parsed = JSON.parse(decodeBase64Url(payload));
          if (typeof parsed.exp !== "number" || !Number.isFinite(parsed.exp)) {
            return null;
          }
          return new Date(parsed.exp * 1e3);
        } catch {
          return null;
        }
      }
      function isJwtExpiredOrExpiring(token, leewaySeconds = 60) {
        if (!token) {
          return false;
        }
        const expires = getJwtExpiration(token);
        if (!expires) {
          return true;
        }
        return expires.getTime() <= Date.now() + leewaySeconds * 1e3;
      }
      var RETRYABLE_STATUS_CODES = /* @__PURE__ */ new Set([500, 502, 503, 504]);
      var IDEMPOTENT_METHODS = /* @__PURE__ */ new Set(["GET", "HEAD", "PUT", "DELETE", "OPTIONS"]);
      var REFRESHABLE_AUTH_ERROR_CODES = /* @__PURE__ */ new Set(["AUTH_UNAUTHORIZED", "PGRST301"]);
      function serializeBody(method, body, headers) {
        if (body === void 0) {
          return void 0;
        }
        if (method === "GET" || method === "HEAD") {
          return void 0;
        }
        if (typeof FormData !== "undefined" && body instanceof FormData) {
          return body;
        }
        headers["Content-Type"] = "application/json;charset=UTF-8";
        return JSON.stringify(body);
      }
      async function parseResponse(response) {
        if (response.status === 204) {
          return void 0;
        }
        let data;
        const contentType = response.headers.get("content-type");
        try {
          if (contentType?.includes("json")) {
            data = await response.json();
          } else {
            data = await response.text();
          }
        } catch (parseErr) {
          throw new InsForgeError(
            `Failed to parse response body: ${parseErr?.message || "Unknown error"}`,
            response.status,
            response.ok ? "PARSE_ERROR" : "REQUEST_FAILED"
          );
        }
        if (!response.ok) {
          if (data && typeof data === "object" && "error" in data) {
            data.statusCode ?? (data.statusCode = data.status ?? response.status);
            const error = InsForgeError.fromApiError(data);
            Object.keys(data).forEach((key) => {
              if (key !== "error" && key !== "message" && key !== "statusCode") {
                error[key] = data[key];
              }
            });
            throw error;
          }
          throw new InsForgeError(
            `Request failed: ${response.statusText}`,
            response.status,
            "REQUEST_FAILED"
          );
        }
        return data;
      }
      var HttpClient = class {
        /**
         * Creates a new HttpClient instance.
         * @param config - SDK configuration including baseUrl, timeout, retry settings, and fetch implementation.
         * @param tokenManager - Token manager for session persistence.
         * @param logger - Optional logger instance for request/response debugging.
         */
        constructor(config, tokenManager, logger) {
          this.userToken = null;
          this.isRefreshing = false;
          this.refreshPromise = null;
          this.refreshToken = null;
          this.config = config;
          this.baseUrl = config.baseUrl || "http://localhost:7130";
          this.fetch = config.fetch || (globalThis.fetch ? globalThis.fetch.bind(globalThis) : void 0);
          this.anonKey = config.anonKey;
          this.defaultHeaders = {
            ...config.headers
          };
          this.tokenManager = tokenManager ?? new TokenManager();
          this.logger = logger || new Logger(false);
          this.timeout = config.timeout ?? 3e4;
          this.retryCount = config.retryCount ?? 3;
          this.retryDelay = config.retryDelay ?? 500;
          if (!this.fetch) {
            throw new Error(
              "Fetch is not available. Please provide a fetch implementation in the config."
            );
          }
        }
        /**
         * Builds a full URL from a path and optional query parameters.
         * Normalizes PostgREST select parameters for proper syntax.
         */
        buildUrl(path, params) {
          const url2 = new URL(path, this.baseUrl);
          if (params) {
            Object.entries(params).forEach(([key, value2]) => {
              if (key === "select") {
                let normalizedValue = value2.replace(/\s+/g, " ").trim();
                normalizedValue = normalizedValue.replace(/\s*\(\s*/g, "(").replace(/\s*\)\s*/g, ")").replace(/\(\s+/g, "(").replace(/\s+\)/g, ")").replace(/,\s+(?=[^()]*\))/g, ",");
                url2.searchParams.append(key, normalizedValue);
              } else {
                url2.searchParams.append(key, value2);
              }
            });
          }
          return url2.toString();
        }
        /** Checks if an HTTP status code is eligible for retry (5xx server errors). */
        isRetryableStatus(status) {
          return RETRYABLE_STATUS_CODES.has(status);
        }
        /**
         * Computes the delay before the next retry using exponential backoff with jitter.
         * @param attempt - The current retry attempt number (1-based).
         * @returns Delay in milliseconds.
         */
        computeRetryDelay(attempt) {
          const base = this.retryDelay * Math.pow(2, attempt - 1);
          const jitter = base * (0.85 + Math.random() * 0.3);
          return Math.round(jitter);
        }
        shouldRefreshAccessToken(statusCode, errorCode, authToken, options = {}) {
          return statusCode === 401 && REFRESHABLE_AUTH_ERROR_CODES.has(errorCode ?? "") && !this.config.isServerMode && !this.config.accessToken && !this.config.edgeFunctionToken && !options.skipAuthRefresh && authToken !== null;
        }
        async fetchWithRetry(args) {
          const { method, url: url2, headers, body, fetchOptions, callerSignal, maxAttempts } = args;
          let lastError;
          for (let attempt = 0; attempt <= maxAttempts; attempt++) {
            if (attempt > 0) {
              const delay = this.computeRetryDelay(attempt);
              this.logger.warn(`Retry ${attempt}/${maxAttempts} for ${method} ${url2} in ${delay}ms`);
              if (callerSignal?.aborted) {
                throw callerSignal.reason;
              }
              await new Promise((resolve, reject) => {
                const onAbort = () => {
                  clearTimeout(timer2);
                  reject(callerSignal.reason);
                };
                const timer2 = setTimeout(() => {
                  if (callerSignal) {
                    callerSignal.removeEventListener("abort", onAbort);
                  }
                  resolve();
                }, delay);
                if (callerSignal) {
                  callerSignal.addEventListener("abort", onAbort, { once: true });
                }
              });
            }
            let controller;
            let timer;
            if (this.timeout > 0 || callerSignal) {
              controller = new AbortController();
              if (this.timeout > 0) {
                timer = setTimeout(() => controller.abort(), this.timeout);
              }
              if (callerSignal) {
                if (callerSignal.aborted) {
                  controller.abort(callerSignal.reason);
                } else {
                  const onCallerAbort = () => controller.abort(callerSignal.reason);
                  callerSignal.addEventListener("abort", onCallerAbort, {
                    once: true
                  });
                  controller.signal.addEventListener(
                    "abort",
                    () => {
                      callerSignal.removeEventListener("abort", onCallerAbort);
                    },
                    { once: true }
                  );
                }
              }
            }
            try {
              const response = await this.fetch(url2, {
                method,
                headers,
                body,
                ...fetchOptions,
                ...controller ? { signal: controller.signal } : {}
              });
              if (this.isRetryableStatus(response.status) && attempt < maxAttempts) {
                if (timer !== void 0) {
                  clearTimeout(timer);
                }
                await response.body?.cancel();
                lastError = new InsForgeError(
                  `Server error: ${response.status} ${response.statusText}`,
                  response.status,
                  "SERVER_ERROR"
                );
                continue;
              }
              if (timer !== void 0) {
                clearTimeout(timer);
              }
              return response;
            } catch (err) {
              if (timer !== void 0) {
                clearTimeout(timer);
              }
              if (err?.name === "AbortError") {
                if (controller && controller.signal.aborted && this.timeout > 0 && !callerSignal?.aborted) {
                  throw new InsForgeError(
                    `Request timed out after ${this.timeout}ms`,
                    408,
                    "REQUEST_TIMEOUT"
                  );
                }
                throw err;
              }
              if (attempt < maxAttempts) {
                lastError = err;
                continue;
              }
              throw new InsForgeError(
                `Network request failed: ${err?.message || "Unknown error"}`,
                0,
                "NETWORK_ERROR"
              );
            }
          }
          throw lastError || new InsForgeError("Request failed after all retry attempts", 0, "NETWORK_ERROR");
        }
        /**
         * Performs an HTTP request with automatic retry and timeout handling.
         * Retries on network errors and 5xx server errors with exponential backoff.
         * Client errors (4xx) and timeouts are thrown immediately without retry.
         * @param method - HTTP method (GET, POST, PUT, PATCH, DELETE).
         * @param path - API path relative to the base URL.
         * @param options - Optional request configuration including headers, body, and query params.
         * @returns Parsed response data.
         * @throws {InsForgeError} On timeout, network failure, or HTTP error responses.
         */
        async handleRequest(method, path, options = {}, tokenOverride) {
          const {
            params,
            headers = {},
            body,
            skipAuthRefresh: _skipAuthRefresh,
            signal: callerSignal,
            ...fetchOptions
          } = options;
          const url2 = this.buildUrl(path, params);
          const startTime = Date.now();
          const canRetry = IDEMPOTENT_METHODS.has(method.toUpperCase()) || options.idempotent === true;
          const maxAttempts = canRetry ? this.retryCount : 0;
          const requestHeaders = {
            ...this.defaultHeaders
          };
          const authToken = tokenOverride ?? this.userToken ?? this.anonKey;
          if (authToken) {
            requestHeaders["Authorization"] = `Bearer ${authToken}`;
          }
          const processedBody = serializeBody(method, body, requestHeaders);
          const setRequestHeader = (key, value2) => {
            if (key.toLowerCase() === "authorization") {
              delete requestHeaders["Authorization"];
              delete requestHeaders["authorization"];
              requestHeaders["Authorization"] = value2;
              return;
            }
            requestHeaders[key] = value2;
          };
          if (headers instanceof Headers) {
            headers.forEach((value2, key) => {
              setRequestHeader(key, value2);
            });
          } else if (Array.isArray(headers)) {
            headers.forEach(([key, value2]) => {
              setRequestHeader(key, value2);
            });
          } else {
            Object.entries(headers).forEach(([key, value2]) => {
              setRequestHeader(key, value2);
            });
          }
          this.logger.logRequest(method, url2, requestHeaders, processedBody);
          const response = await this.fetchWithRetry({
            method,
            url: url2,
            headers: requestHeaders,
            body: processedBody,
            fetchOptions,
            callerSignal,
            maxAttempts
          });
          let data;
          try {
            data = await parseResponse(response);
          } catch (err) {
            if (err instanceof InsForgeError) {
              this.logger.logResponse(
                method,
                url2,
                err.statusCode || response.status,
                Date.now() - startTime,
                err
              );
            }
            throw err;
          }
          this.logger.logResponse(method, url2, response.status, Date.now() - startTime, data);
          return data;
        }
        async request(method, path, options = {}) {
          const tokenUsed = this.userToken;
          try {
            return await this.handleRequest(method, path, { ...options }, tokenUsed);
          } catch (error) {
            if (!(error instanceof InsForgeError) || !this.shouldRefreshAccessToken(error.statusCode, error.error, tokenUsed, options)) {
              throw error;
            }
            if (tokenUsed !== this.userToken) {
              if (this.userToken === null) {
                throw error;
              }
              return await this.handleRequest(
                method,
                path,
                {
                  ...options,
                  skipAuthRefresh: true
                },
                this.userToken
              );
            }
            try {
              await this.refreshAndSaveSession();
            } catch (error2) {
              if (error2 instanceof InsForgeError && (error2.statusCode === 401 || error2.statusCode === 403)) {
                this.clearAuthSession();
              }
              throw error2;
            }
            return await this.handleRequest(method, path, {
              ...options,
              skipAuthRefresh: true
            });
          }
        }
        /**
         * Performs an SDK-configured fetch and returns the raw Response.
         * This is used by clients such as postgrest-js that need to own response
         * parsing while still sharing SDK auth and refresh behavior.
         */
        async rawFetch(input, init, options = {}) {
          const request = typeof Request !== "undefined" && input instanceof Request ? input : void 0;
          const {
            method: initMethod,
            headers: initHeaders,
            body: initBody,
            signal: initSignal,
            ...fetchOptions
          } = init ?? {};
          const method = initMethod ?? request?.method ?? "GET";
          const url2 = request?.url ?? input.toString();
          const startTime = Date.now();
          const tokenUsed = this.userToken;
          const headers = new Headers({
            ...this.defaultHeaders
          });
          const authToken = tokenUsed ?? this.anonKey;
          if (authToken) {
            headers.set("Authorization", `Bearer ${authToken}`);
          }
          request?.headers.forEach((value2, key) => {
            headers.set(key, value2);
          });
          new Headers(initHeaders).forEach((value2, key) => {
            headers.set(key, value2);
          });
          const requestHeaders = {};
          headers.forEach((value2, key) => {
            requestHeaders[key] = value2;
          });
          const sourceBody = initBody ?? request?.body ?? void 0;
          let body = sourceBody;
          let retryInit = init;
          if (typeof ReadableStream !== "undefined" && sourceBody instanceof ReadableStream) {
            body = await new Response(sourceBody).arrayBuffer();
            retryInit = { ...init ?? {}, body };
          }
          const callerSignal = initSignal ?? request?.signal;
          const maxAttempts = IDEMPOTENT_METHODS.has(method.toUpperCase()) ? this.retryCount : 0;
          this.logger.logRequest(method, url2, requestHeaders, body);
          const response = await this.fetchWithRetry({
            method,
            url: url2,
            headers: requestHeaders,
            body,
            fetchOptions,
            callerSignal,
            maxAttempts
          });
          this.logger.logResponse(method, url2, response.status, Date.now() - startTime);
          let errorCode = null;
          if (response.status === 401) {
            try {
              const data = await response.clone().json();
              if (data && typeof data === "object") {
                const candidate = data.error ?? data.code;
                if (typeof candidate === "string") {
                  errorCode = candidate;
                }
              }
            } catch {
            }
          }
          if (!this.shouldRefreshAccessToken(response.status, errorCode, tokenUsed, options)) {
            return response;
          }
          if (tokenUsed !== this.userToken) {
            if (this.userToken === null) {
              return response;
            }
            const retryHeaders2 = new Headers(initHeaders);
            retryHeaders2.set("Authorization", `Bearer ${this.userToken}`);
            return await this.rawFetch(
              input,
              { ...retryInit, headers: retryHeaders2 },
              { skipAuthRefresh: true }
            );
          }
          let newTokenData;
          try {
            newTokenData = await this.refreshAndSaveSession();
          } catch (error) {
            if (error instanceof InsForgeError && (error.statusCode === 401 || error.statusCode === 403)) {
              this.clearAuthSession();
            }
            throw error;
          }
          const retryHeaders = new Headers(initHeaders);
          retryHeaders.set("Authorization", `Bearer ${newTokenData.accessToken}`);
          return await this.rawFetch(
            input,
            { ...retryInit, headers: retryHeaders },
            { skipAuthRefresh: true }
          );
        }
        /** Performs a GET request. */
        get(path, options) {
          return this.request("GET", path, options);
        }
        /** Performs a POST request with an optional JSON body. */
        post(path, body, options) {
          return this.request("POST", path, { ...options, body });
        }
        /** Performs a PUT request with an optional JSON body. */
        put(path, body, options) {
          return this.request("PUT", path, { ...options, body });
        }
        /** Performs a PATCH request with an optional JSON body. */
        patch(path, body, options) {
          return this.request("PATCH", path, { ...options, body });
        }
        /** Performs a DELETE request. */
        delete(path, options) {
          return this.request("DELETE", path, options);
        }
        /** Sets or clears the user authentication token for subsequent requests. */
        setAuthToken(token) {
          this.userToken = token;
        }
        setRefreshToken(token) {
          this.refreshToken = token;
        }
        /** Returns the current default headers including the authorization header if set. */
        getHeaders() {
          const headers = { ...this.defaultHeaders };
          const authToken = this.userToken || this.anonKey;
          if (authToken) {
            headers["Authorization"] = `Bearer ${authToken}`;
          }
          return headers;
        }
        async refreshAccessToken() {
          if (this.isRefreshing) {
            return this.refreshPromise;
          }
          this.isRefreshing = true;
          this.refreshPromise = (async () => {
            try {
              const csrfToken = getCsrfToken();
              const body = this.refreshToken ? { refreshToken: this.refreshToken } : void 0;
              const response = await this.handleRequest(
                "POST",
                this.refreshToken ? "/api/auth/refresh?client_type=mobile" : "/api/auth/refresh",
                {
                  body,
                  headers: csrfToken ? { "X-CSRF-Token": csrfToken } : {},
                  credentials: "include"
                }
              );
              return response;
            } finally {
              this.isRefreshing = false;
              this.refreshPromise = null;
            }
          })();
          return this.refreshPromise;
        }
        /** Returns a token safe to use for a new connection handshake. */
        async getValidAccessToken(leewaySeconds = 60) {
          const accessToken = this.tokenManager.getAccessToken() ?? this.userToken;
          if (!accessToken || !isJwtExpiredOrExpiring(accessToken, leewaySeconds)) {
            return accessToken;
          }
          const canRefresh = !this.config.isServerMode && !this.config.accessToken && !this.config.edgeFunctionToken && this.userToken !== null;
          if (!canRefresh) {
            return accessToken;
          }
          try {
            const refreshed = await this.refreshAndSaveSession();
            return refreshed.accessToken;
          } catch (error) {
            if (error instanceof InsForgeError && (error.statusCode === 401 || error.statusCode === 403) && this.userToken === accessToken) {
              this.clearAuthSession();
            }
            throw error;
          }
        }
        async refreshAndSaveSession() {
          const newTokenData = await this.refreshAccessToken();
          this.setAuthToken(newTokenData.accessToken);
          this.tokenManager.saveSession(newTokenData, AuthChangeEvent.TOKEN_REFRESHED);
          if (newTokenData.csrfToken) {
            setCsrfToken(newTokenData.csrfToken);
          }
          if (newTokenData.refreshToken) {
            this.setRefreshToken(newTokenData.refreshToken);
          }
          return newTokenData;
        }
        clearAuthSession() {
          this.tokenManager.clearSession();
          this.userToken = null;
          this.refreshToken = null;
          clearCsrfToken();
        }
      };
      var PKCE_VERIFIER_KEY = "insforge_pkce_verifier";
      async function getWebCrypto() {
        const webCrypto = globalThis.crypto;
        if (typeof webCrypto?.getRandomValues === "function" && webCrypto.subtle) {
          return webCrypto;
        }
        if (typeof process !== "undefined" && process.versions?.node) {
          const { webcrypto } = await import("crypto");
          return webcrypto;
        }
        throw new Error("Web Crypto API is not available in this environment");
      }
      function base64UrlEncode(buffer) {
        const base64 = btoa(String.fromCharCode(...buffer));
        return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      }
      async function generateCodeVerifier() {
        const webCrypto = await getWebCrypto();
        const array = new Uint8Array(32);
        webCrypto.getRandomValues(array);
        return base64UrlEncode(array);
      }
      async function generateCodeChallenge(verifier) {
        const webCrypto = await getWebCrypto();
        const encoder = new TextEncoder();
        const data = encoder.encode(verifier);
        const hash = await webCrypto.subtle.digest("SHA-256", data);
        return base64UrlEncode(new Uint8Array(hash));
      }
      function storePkceVerifier(verifier) {
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.setItem(PKCE_VERIFIER_KEY, verifier);
        }
      }
      function retrievePkceVerifier() {
        if (typeof sessionStorage === "undefined") {
          return null;
        }
        const verifier = sessionStorage.getItem(PKCE_VERIFIER_KEY);
        if (verifier) {
          sessionStorage.removeItem(PKCE_VERIFIER_KEY);
        }
        return verifier;
      }
      function wrapError(error, fallbackMessage) {
        if (error instanceof InsForgeError) {
          return { data: null, error };
        }
        return {
          data: null,
          error: new InsForgeError(
            error instanceof Error ? error.message : fallbackMessage,
            500,
            "UNEXPECTED_ERROR"
          )
        };
      }
      function cleanUrlParams(...params) {
        if (typeof window === "undefined") {
          return;
        }
        const url2 = new URL(window.location.href);
        params.forEach((p) => url2.searchParams.delete(p));
        window.history.replaceState({}, document.title, url2.toString());
      }
      var import_shared_schemas = __require("@insforge/shared-schemas");
      var Auth = class {
        constructor(http, tokenManager, options = {}) {
          this.http = http;
          this.tokenManager = tokenManager;
          this.options = options;
          this.authCallbackHandled = options.detectOAuthCallback === false ? Promise.resolve() : this.detectAuthCallback();
        }
        isServerMode() {
          return !!this.options.isServerMode;
        }
        /** Subscribe to SDK authentication state changes. */
        onAuthStateChange(callback) {
          return this.tokenManager.onAuthStateChange(callback);
        }
        /**
         * Save session from API response
         * Handles token storage, CSRF token, and HTTP auth header
         */
        saveSessionFromResponse(response, event = AuthChangeEvent.SIGNED_IN) {
          if (!response.accessToken || !response.user) {
            return false;
          }
          const session = {
            accessToken: response.accessToken,
            user: response.user
          };
          if (!this.isServerMode() && response.csrfToken) {
            setCsrfToken(response.csrfToken);
          }
          if (!this.isServerMode()) {
            this.tokenManager.saveSession(session, event);
          }
          this.http.setAuthToken(response.accessToken);
          this.http.setRefreshToken(response.refreshToken ?? null);
          return true;
        }
        // ============================================================================
        // OAuth Callback Detection (runs on initialization)
        // ============================================================================
        /**
         * Detect and handle OAuth callback parameters in URL
         * Supports PKCE flow (insforge_code)
         */
        async detectAuthCallback() {
          if (this.isServerMode() || typeof window === "undefined") {
            return;
          }
          try {
            const params = new URLSearchParams(window.location.search);
            const error = params.get("error");
            if (error) {
              cleanUrlParams("error");
              console.debug("OAuth callback error:", error);
              return;
            }
            const code = params.get("insforge_code");
            if (code) {
              cleanUrlParams("insforge_code");
              const { error: exchangeError } = await this.exchangeOAuthCode(code);
              if (exchangeError) {
                console.debug("OAuth code exchange failed:", exchangeError.message);
              }
              return;
            }
          } catch (error) {
            console.debug("OAuth callback detection skipped:", error);
          }
        }
        // ============================================================================
        // Sign Up / Sign In / Sign Out
        // ============================================================================
        async signUp(request) {
          try {
            const response = await this.http.post(
              this.isServerMode() ? "/api/auth/users?client_type=mobile" : "/api/auth/users",
              request,
              { credentials: "include", skipAuthRefresh: true }
            );
            if (response.accessToken && response.user) {
              this.saveSessionFromResponse(response);
            }
            if (response.refreshToken) {
              this.http.setRefreshToken(response.refreshToken);
            }
            return { data: response, error: null };
          } catch (error) {
            return wrapError(error, "An unexpected error occurred during sign up");
          }
        }
        async signInWithPassword(request) {
          try {
            const response = await this.http.post(
              this.isServerMode() ? "/api/auth/sessions?client_type=mobile" : "/api/auth/sessions",
              request,
              { credentials: "include", skipAuthRefresh: true }
            );
            this.saveSessionFromResponse(response);
            if (response.refreshToken) {
              this.http.setRefreshToken(response.refreshToken);
            }
            return { data: response, error: null };
          } catch (error) {
            return wrapError(error, "An unexpected error occurred during sign in");
          }
        }
        async signOut() {
          try {
            try {
              const serverMode = this.isServerMode();
              const csrfToken = !serverMode ? getCsrfToken() : null;
              await this.http.post(
                serverMode ? "/api/auth/logout?client_type=mobile" : "/api/auth/logout",
                void 0,
                {
                  credentials: "include",
                  skipAuthRefresh: true,
                  ...csrfToken ? { headers: { "X-CSRF-Token": csrfToken } } : {}
                }
              );
            } catch {
            }
            this.tokenManager.clearSession();
            this.http.setAuthToken(null);
            this.http.setRefreshToken(null);
            if (!this.isServerMode()) {
              clearCsrfToken();
            }
            return { error: null };
          } catch {
            return {
              error: new InsForgeError("Failed to sign out", 500, "SIGNOUT_ERROR")
            };
          }
        }
        async signInWithOAuth(providerOrOptions, options) {
          try {
            let signInOptions;
            if (typeof providerOrOptions === "object") {
              signInOptions = providerOrOptions;
            } else if (options) {
              signInOptions = { provider: providerOrOptions, ...options };
            } else {
              return {
                data: {},
                error: new InsForgeError(
                  "OAuth sign-in options are required",
                  400,
                  import_shared_schemas.ERROR_CODES.INVALID_INPUT
                )
              };
            }
            if (!signInOptions || !signInOptions.redirectTo) {
              return {
                data: {},
                error: new InsForgeError("Redirect URI is required", 400, import_shared_schemas.ERROR_CODES.INVALID_INPUT)
              };
            }
            const { provider } = signInOptions;
            const providerKey = encodeURIComponent(provider.toLowerCase());
            const codeVerifier = await generateCodeVerifier();
            const codeChallenge = await generateCodeChallenge(codeVerifier);
            storePkceVerifier(codeVerifier);
            const params = {
              ...signInOptions.additionalParams ?? {},
              redirect_uri: signInOptions.redirectTo,
              code_challenge: codeChallenge
            };
            const isBuiltInProvider = import_shared_schemas.oAuthProvidersSchema.options.includes(
              providerKey
            );
            const oauthPath = isBuiltInProvider ? `/api/auth/oauth/${providerKey}` : `/api/auth/oauth/custom/${providerKey}`;
            const response = await this.http.get(oauthPath, {
              params,
              skipAuthRefresh: true
            });
            if (!this.isServerMode() && typeof window !== "undefined" && !signInOptions.skipBrowserRedirect) {
              window.location.href = response.authUrl;
              return { data: {}, error: null };
            }
            return {
              data: { url: response.authUrl, provider: providerKey, codeVerifier },
              error: null
            };
          } catch (error) {
            if (error instanceof InsForgeError) {
              return { data: {}, error };
            }
            return {
              data: {},
              error: new InsForgeError(
                "An unexpected error occurred during OAuth initialization",
                500,
                "UNEXPECTED_ERROR"
              )
            };
          }
        }
        /**
         * Exchange OAuth authorization code for tokens (PKCE flow)
         * Called automatically on initialization when insforge_code is in URL
         */
        async exchangeOAuthCode(code, codeVerifier) {
          try {
            const verifier = codeVerifier ?? retrievePkceVerifier();
            if (!verifier) {
              return {
                data: null,
                error: new InsForgeError(
                  "PKCE code verifier not found. Ensure signInWithOAuth was called in the same browser session.",
                  400,
                  "PKCE_VERIFIER_MISSING"
                )
              };
            }
            const request = {
              code,
              code_verifier: verifier
            };
            const response = await this.http.post(
              this.isServerMode() ? "/api/auth/oauth/exchange?client_type=mobile" : "/api/auth/oauth/exchange",
              request,
              { credentials: "include", skipAuthRefresh: true }
            );
            this.saveSessionFromResponse(response);
            return {
              data: response,
              error: null
            };
          } catch (error) {
            return wrapError(error, "An unexpected error occurred during OAuth code exchange");
          }
        }
        /**
         * Sign in with an ID token from a native SDK (Google One Tap, etc.)
         * Use this for native mobile apps or Google One Tap on web.
         *
         * @param credentials.provider - The identity provider (currently only 'google' is supported)
         * @param credentials.token - The ID token from the native SDK
         */
        async signInWithIdToken(credentials) {
          try {
            const { provider, token } = credentials;
            const response = await this.http.post(
              "/api/auth/id-token?client_type=mobile",
              { provider, token },
              { credentials: "include", skipAuthRefresh: true }
            );
            this.saveSessionFromResponse(response);
            if (response.refreshToken) {
              this.http.setRefreshToken(response.refreshToken);
            }
            return {
              data: response,
              error: null
            };
          } catch (error) {
            return wrapError(error, "An unexpected error occurred during ID token sign in");
          }
        }
        // ============================================================================
        // Session Management
        // ============================================================================
        /**
         * Refresh the current auth session.
         *
         * Browser mode:
         * - Uses httpOnly refresh cookie and optional CSRF header.
         *
         * Legacy server mode (`isServerMode: true`):
         * - Uses mobile auth flow and requires `refreshToken` in request body.
         *
         * SSR apps should prefer `createRefreshAuthRouter()` / `refreshAuth()` from
         * `@insforge/sdk/ssr`.
         */
        async refreshSession(options) {
          try {
            if (this.isServerMode() && !options?.refreshToken) {
              return {
                data: null,
                error: new InsForgeError(
                  "refreshToken is required when refreshing session in server mode",
                  400,
                  import_shared_schemas.ERROR_CODES.AUTH_UNAUTHORIZED
                )
              };
            }
            const csrfToken = !this.isServerMode() ? getCsrfToken() : null;
            const response = await this.http.post(
              this.isServerMode() ? "/api/auth/refresh?client_type=mobile" : "/api/auth/refresh",
              this.isServerMode() ? { refresh_token: options?.refreshToken } : void 0,
              {
                headers: csrfToken ? { "X-CSRF-Token": csrfToken } : {},
                credentials: "include",
                skipAuthRefresh: true
              }
            );
            if (response.accessToken) {
              this.saveSessionFromResponse(response, AuthChangeEvent.TOKEN_REFRESHED);
            }
            return { data: response, error: null };
          } catch (error) {
            return wrapError(error, "An unexpected error occurred during session refresh");
          }
        }
        /**
         * Get current user, automatically waits for pending OAuth callback
         */
        async getCurrentUser() {
          await this.authCallbackHandled;
          try {
            if (this.isServerMode()) {
              const accessToken = this.tokenManager.getAccessToken();
              if (!accessToken) {
                return { data: { user: null }, error: null };
              }
              this.http.setAuthToken(accessToken);
              const response = await this.http.get("/api/auth/sessions/current");
              const user = response.user ?? null;
              return { data: { user }, error: null };
            }
            const session = this.tokenManager.getSession();
            if (session) {
              this.http.setAuthToken(session.accessToken);
              return { data: { user: session.user }, error: null };
            }
            if (typeof window !== "undefined") {
              const { data: refreshed, error: refreshError } = await this.refreshSession();
              if (refreshError) {
                return { data: { user: null }, error: refreshError };
              }
              if (refreshed?.accessToken) {
                return { data: { user: refreshed.user ?? null }, error: null };
              }
            }
            return { data: { user: null }, error: null };
          } catch (error) {
            if (error instanceof InsForgeError) {
              return { data: { user: null }, error };
            }
            return {
              data: { user: null },
              error: new InsForgeError(
                "An unexpected error occurred while getting user",
                500,
                "UNEXPECTED_ERROR"
              )
            };
          }
        }
        // ============================================================================
        // Profile Management
        // ============================================================================
        async getProfile(userId) {
          try {
            const response = await this.http.get(`/api/auth/profiles/${userId}`);
            return { data: response, error: null };
          } catch (error) {
            return wrapError(error, "An unexpected error occurred while fetching user profile");
          }
        }
        async setProfile(profile) {
          try {
            const response = await this.http.patch("/api/auth/profiles/current", {
              profile
            });
            const currentUser = this.tokenManager.getUser();
            if (!this.isServerMode() && currentUser && response.profile !== void 0) {
              this.tokenManager.setUser({
                ...currentUser,
                profile: response.profile
              });
            }
            return { data: response, error: null };
          } catch (error) {
            return wrapError(error, "An unexpected error occurred while updating user profile");
          }
        }
        // ============================================================================
        // Email Verification
        // ============================================================================
        async resendVerificationEmail(request) {
          try {
            const response = await this.http.post("/api/auth/email/send-verification", request, {
              skipAuthRefresh: true
            });
            return { data: response, error: null };
          } catch (error) {
            return wrapError(error, "An unexpected error occurred while sending verification email");
          }
        }
        async verifyEmail(request) {
          try {
            const response = await this.http.post(
              this.isServerMode() ? "/api/auth/email/verify?client_type=mobile" : "/api/auth/email/verify",
              request,
              { credentials: "include", skipAuthRefresh: true }
            );
            this.saveSessionFromResponse(response);
            if (response.refreshToken) {
              this.http.setRefreshToken(response.refreshToken);
            }
            return { data: response, error: null };
          } catch (error) {
            return wrapError(error, "An unexpected error occurred while verifying email");
          }
        }
        // ============================================================================
        // Password Reset
        // ============================================================================
        async sendResetPasswordEmail(request) {
          try {
            const response = await this.http.post("/api/auth/email/send-reset-password", request, {
              skipAuthRefresh: true
            });
            return { data: response, error: null };
          } catch (error) {
            return wrapError(error, "An unexpected error occurred while sending password reset email");
          }
        }
        async exchangeResetPasswordToken(request) {
          try {
            const response = await this.http.post(
              "/api/auth/email/exchange-reset-password-token",
              request,
              { skipAuthRefresh: true }
            );
            return { data: response, error: null };
          } catch (error) {
            return wrapError(error, "An unexpected error occurred while verifying reset code");
          }
        }
        async resetPassword(request) {
          try {
            const response = await this.http.post(
              "/api/auth/email/reset-password",
              request,
              { skipAuthRefresh: true }
            );
            return { data: response, error: null };
          } catch (error) {
            return wrapError(error, "An unexpected error occurred while resetting password");
          }
        }
        // ============================================================================
        // Configuration
        // ============================================================================
        async getPublicAuthConfig() {
          try {
            const response = await this.http.get("/api/auth/public-config", {
              skipAuthRefresh: true
            });
            return { data: response, error: null };
          } catch (error) {
            return wrapError(error, "An unexpected error occurred while fetching auth configuration");
          }
        }
      };
      var import_postgrest_js = require_cjs();
      function createInsForgePostgrestFetch(httpClient) {
        return async (input, init) => {
          const url2 = typeof input === "string" ? input : input.toString();
          const urlObj = new URL(url2);
          const pathname = urlObj.pathname.slice(1);
          const rpcMatch = pathname.match(/^rpc\/(.+)$/);
          const endpoint = rpcMatch ? `/api/database/rpc/${rpcMatch[1]}` : `/api/database/records/${pathname}`;
          const insforgeUrl = `${httpClient.baseUrl}${endpoint}${urlObj.search}`;
          const headers = new Headers(httpClient.getHeaders());
          new Headers(init?.headers).forEach((value2, key) => {
            headers.set(key, value2);
          });
          const response = await httpClient.rawFetch(insforgeUrl, {
            ...init,
            headers
          });
          return response;
        };
      }
      var Database = class {
        constructor(httpClient, defaultSchema) {
          this.postgrest = new import_postgrest_js.PostgrestClient("http://dummy", {
            fetch: createInsForgePostgrestFetch(httpClient),
            headers: {},
            ...defaultSchema ? { schema: defaultSchema } : {}
          });
        }
        /**
         * Select a non-default Postgres schema for the chained query. Maps to
         * PostgREST's `Accept-Profile` (reads) / `Content-Profile` (writes) header.
         * The schema must be exposed by the backend.
         *
         * @example
         * const { data } = await client.database
         *   .schema('analytics')
         *   .from('events')
         *   .select('*');
         *
         * @example
         * await client.database.schema('analytics').rpc('rollup', { day: '2026-01-01' });
         */
        schema(schemaName) {
          return this.postgrest.schema(schemaName);
        }
        /**
         * Create a query builder for a table
         *
         * @example
         * // Basic query
         * const { data, error } = await client.database
         *   .from('posts')
         *   .select('*')
         *   .eq('user_id', userId);
         *
         * // With count (Supabase style!)
         * const { data, error, count } = await client.database
         *   .from('posts')
         *   .select('*', { count: 'exact' })
         *   .range(0, 9);
         *
         * // Just get count, no data
         * const { count } = await client.database
         *   .from('posts')
         *   .select('*', { count: 'exact', head: true });
         *
         * // Complex queries with OR
         * const { data } = await client.database
         *   .from('posts')
         *   .select('*, users!inner(*)')
         *   .or('status.eq.active,status.eq.pending');
         *
         * // All features work:
         * - Nested selects
         * - Foreign key expansion
         * - OR/AND/NOT conditions
         * - Count with head
         * - Range pagination
         * - Upserts
         */
        from(table) {
          return this.postgrest.from(table);
        }
        /**
         * Call a PostgreSQL function (RPC)
         *
         * @example
         * // Call a function with parameters
         * const { data, error } = await client.database
         *   .rpc('get_user_stats', { user_id: 123 });
         *
         * // Call a function with no parameters
         * const { data, error } = await client.database
         *   .rpc('get_all_active_users');
         *
         * // With options (head, count, get)
         * const { data, count } = await client.database
         *   .rpc('search_posts', { query: 'hello' }, { count: 'exact' });
         */
        rpc(fn, args, options) {
          return this.postgrest.rpc(fn, args, options);
        }
      };
      function generateObjectKey(filename) {
        const dotIndex = filename.lastIndexOf(".");
        const hasExt = dotIndex > 0;
        const ext = hasExt ? filename.slice(dotIndex) : "";
        const base = hasExt ? filename.slice(0, dotIndex) : filename;
        const sanitizedBase = base.replace(/[^a-zA-Z0-9-_]/g, "-").slice(0, 32) || "file";
        const timestamp = Date.now();
        const random = Math.random().toString(36).slice(2, 8);
        return `${sanitizedBase}-${timestamp}-${random}${ext}`;
      }
      var StorageBucket = class {
        constructor(bucketName, http) {
          this.bucketName = bucketName;
          this.http = http;
        }
        /**
         * Upload a file to a specific key.
         * Uses the upload strategy from the backend (direct or presigned).
         * Standard PUT semantics: uploading to an existing key replaces the
         * current object in place.
         * @param path - The object key/path
         * @param file - File or Blob to upload
         */
        async upload(path, file) {
          try {
            const strategyResponse = await this.http.post(
              `/api/storage/buckets/${this.bucketName}/upload-strategy`,
              {
                filename: path,
                contentType: file.type || "application/octet-stream",
                size: file.size
              }
            );
            if (strategyResponse.method === "presigned") {
              return await this.uploadWithPresignedUrl(strategyResponse, file);
            }
            if (strategyResponse.method === "direct") {
              const formData = new FormData();
              formData.append("file", file);
              const response = await this.http.request(
                "PUT",
                `/api/storage/buckets/${this.bucketName}/objects/${encodeURIComponent(path)}`,
                {
                  body: formData,
                  headers: {
                    // Don't set Content-Type, let browser set multipart boundary
                  }
                }
              );
              return { data: response, error: null };
            }
            throw new InsForgeError(
              `Unsupported upload method: ${strategyResponse.method}`,
              500,
              "STORAGE_ERROR"
            );
          } catch (error) {
            return {
              data: null,
              error: error instanceof InsForgeError ? error : new InsForgeError("Upload failed", 500, "STORAGE_ERROR")
            };
          }
        }
        /**
         * Upload a file under an automatically generated, collision-free key.
         * The key is derived client-side from the filename (sanitized base +
         * timestamp + random suffix) and uploaded through the standard
         * {@link upload} path, so repeated uploads of the same file never
         * overwrite each other. Reads the filename structurally to avoid assuming
         * a global `File` (which Node 18 does not expose).
         * @param file - File or Blob to upload
         */
        async uploadAuto(file) {
          const filename = "name" in file && typeof file.name === "string" ? file.name : "file";
          return this.upload(generateObjectKey(filename), file);
        }
        /**
         * Internal method to handle presigned URL uploads
         */
        async uploadWithPresignedUrl(strategy, file) {
          try {
            const formData = new FormData();
            if (strategy.fields) {
              Object.entries(strategy.fields).forEach(([key, value2]) => {
                formData.append(key, value2);
              });
            }
            formData.append("file", file);
            const uploadResponse = await fetch(strategy.uploadUrl, {
              method: "POST",
              body: formData
            });
            if (!uploadResponse.ok) {
              throw new InsForgeError(
                `Upload to storage failed: ${uploadResponse.statusText}`,
                uploadResponse.status,
                "STORAGE_ERROR"
              );
            }
            if (strategy.confirmRequired && strategy.confirmUrl) {
              const confirmResponse = await this.http.post(strategy.confirmUrl, {
                size: file.size,
                contentType: file.type || "application/octet-stream"
              });
              return { data: confirmResponse, error: null };
            }
            return {
              data: {
                key: strategy.key,
                bucket: this.bucketName,
                size: file.size,
                mimeType: file.type || "application/octet-stream",
                uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
                url: this.getPublicUrl(strategy.key).data.publicUrl
              },
              error: null
            };
          } catch (error) {
            throw error instanceof InsForgeError ? error : new InsForgeError("Presigned upload failed", 500, "STORAGE_ERROR");
          }
        }
        /**
         * Download a file
         * Uses the download strategy from backend (direct or presigned)
         * @param path - The object key/path
         * Returns the file as a Blob
         */
        async download(path) {
          try {
            const encodedKey = encodeURIComponent(path);
            let strategyResponse;
            try {
              strategyResponse = await this.http.get(
                `/api/storage/buckets/${this.bucketName}/download-strategy/objects/${encodedKey}`
              );
            } catch (err) {
              const status = err instanceof InsForgeError ? err.statusCode : void 0;
              if (status === 404 || status === 405) {
                strategyResponse = await this.http.post(
                  `/api/storage/buckets/${this.bucketName}/objects/${encodedKey}/download-strategy`,
                  {}
                );
              } else {
                throw err;
              }
            }
            const downloadUrl = strategyResponse.url;
            const headers = {};
            if (strategyResponse.method === "direct") {
              Object.assign(headers, this.http.getHeaders());
            }
            const response = await fetch(downloadUrl, {
              method: "GET",
              headers
            });
            if (!response.ok) {
              try {
                const error = await response.json();
                throw InsForgeError.fromApiError(error);
              } catch {
                throw new InsForgeError(
                  `Download failed: ${response.statusText}`,
                  response.status,
                  "STORAGE_ERROR"
                );
              }
            }
            const blob = await response.blob();
            return { data: blob, error: null };
          } catch (error) {
            return {
              data: null,
              error: error instanceof InsForgeError ? error : new InsForgeError("Download failed", 500, "STORAGE_ERROR")
            };
          }
        }
        /**
         * Get the public URL for an object in a public bucket.
         *
         * Pure string construction — no network call, no auth. The URL only resolves
         * if the bucket is public; for private objects use {@link createSignedUrl}.
         *
         * @param path - The object key/path
         * @returns `{ data: { publicUrl }, error }` — matches the external SDK pattern,
         *   so `const { data } = getPublicUrl(path)` then `data.publicUrl`.
         */
        getPublicUrl(path) {
          const publicUrl = `${this.http.baseUrl}/api/storage/buckets/${this.bucketName}/objects/${encodeURIComponent(path)}`;
          return { data: { publicUrl }, error: null };
        }
        /**
         * Resolve a download strategy (signed or direct URL) for an object with a
         * caller-supplied TTL. Prefers the canonical GET route and falls back to the
         * legacy POST alias so signed-URL creation still works against older backends
         * that predate the GET route (they return 404/405 for it). A genuine
         * "object not found" (STORAGE_NOT_FOUND) is not retried.
         */
        async requestDownloadStrategy(path, expiresIn) {
          const encoded = encodeURIComponent(path);
          try {
            return await this.http.get(
              `/api/storage/buckets/${this.bucketName}/download-strategy/objects/${encoded}`,
              { params: { expiresIn: expiresIn.toString() } }
            );
          } catch (error) {
            const status = error instanceof InsForgeError ? error.statusCode : void 0;
            const isMissingRoute = (status === 404 || status === 405) && !(error instanceof InsForgeError && error.error === "STORAGE_NOT_FOUND");
            if (!isMissingRoute) {
              throw error;
            }
            return await this.http.post(
              `/api/storage/buckets/${this.bucketName}/objects/${encoded}/download-strategy`,
              { expiresIn }
            );
          }
        }
        /**
         * Create a signed URL for an object.
         *
         * Returns a time-limited, credential-free URL that can be handed directly to
         * a browser (`<img src>`), an email, or a third party — no SDK or session is
         * needed to fetch it. Authorization is enforced when the URL is minted (the
         * caller must be allowed to read the object), so the resulting link is a
         * pre-authorized capability scoped to this one object until it expires.
         *
         * @param path - The object key/path
         * @param expiresIn - Lifetime in seconds (default 3600 = 1h, max 604800 = 7d).
         *   Honored for private buckets; public buckets return their long-lived URL.
         */
        async createSignedUrl(path, expiresIn = 3600) {
          try {
            const strategy = await this.requestDownloadStrategy(path, expiresIn);
            return {
              data: {
                signedUrl: strategy.url,
                expiresAt: strategy.expiresAt ? new Date(strategy.expiresAt).toISOString() : null
              },
              error: null
            };
          } catch (error) {
            return {
              data: null,
              error: error instanceof InsForgeError ? error : new InsForgeError("Failed to create signed URL", 500, "STORAGE_ERROR")
            };
          }
        }
        /**
         * Create signed URLs for multiple objects in a single call.
         *
         * Each entry resolves independently: a failure on one key (not found / not
         * permitted) is reported on that entry's `error` without failing the rest.
         *
         * @param paths - The object keys/paths
         * @param expiresIn - Lifetime in seconds (default 3600 = 1h, max 604800 = 7d)
         */
        async createSignedUrls(paths, expiresIn = 3600) {
          try {
            const data = await Promise.all(
              paths.map(async (path) => {
                const { data: signed, error } = await this.createSignedUrl(path, expiresIn);
                return {
                  path,
                  signedUrl: signed?.signedUrl ?? null,
                  error: error ? error.message : null
                };
              })
            );
            return { data, error: null };
          } catch (error) {
            return {
              data: null,
              error: error instanceof InsForgeError ? error : new InsForgeError("Failed to create signed URLs", 500, "STORAGE_ERROR")
            };
          }
        }
        /**
         * List objects in the bucket
         * @param prefix - Filter by key prefix
         * @param search - Search in file names
         * @param limit - Maximum number of results (default: 100, max: 1000)
         * @param offset - Number of results to skip
         */
        async list(options) {
          try {
            const params = {};
            if (options?.prefix) {
              params.prefix = options.prefix;
            }
            if (options?.search) {
              params.search = options.search;
            }
            if (options?.limit) {
              params.limit = options.limit.toString();
            }
            if (options?.offset) {
              params.offset = options.offset.toString();
            }
            const response = await this.http.get(
              `/api/storage/buckets/${this.bucketName}/objects`,
              { params }
            );
            return { data: response, error: null };
          } catch (error) {
            return {
              data: null,
              error: error instanceof InsForgeError ? error : new InsForgeError("List failed", 500, "STORAGE_ERROR")
            };
          }
        }
        /**
         * Delete a file
         * @param path - The object key/path
         */
        async remove(path) {
          try {
            const response = await this.http.delete(
              `/api/storage/buckets/${this.bucketName}/objects/${encodeURIComponent(path)}`
            );
            return { data: response, error: null };
          } catch (error) {
            return {
              data: null,
              error: error instanceof InsForgeError ? error : new InsForgeError("Delete failed", 500, "STORAGE_ERROR")
            };
          }
        }
      };
      var Storage = class {
        constructor(http) {
          this.http = http;
        }
        /**
         * Get a bucket instance for operations
         * @param bucketName - Name of the bucket
         */
        from(bucketName) {
          return new StorageBucket(bucketName, this.http);
        }
      };
      var AI = class {
        constructor(http) {
          this.http = http;
          this.chat = new Chat(http);
          this.images = new Images(http);
          this.embeddings = new Embeddings(http);
        }
      };
      var Chat = class {
        constructor(http) {
          this.completions = new ChatCompletions(http);
        }
      };
      var ChatCompletions = class {
        constructor(http) {
          this.http = http;
        }
        /**
         * Create a chat completion - OpenAI-like response format
         *
         * @example
         * ```typescript
         * // Non-streaming
         * const completion = await client.ai.chat.completions.create({
         *   model: 'gpt-4',
         *   messages: [{ role: 'user', content: 'Hello!' }]
         * });
         * console.log(completion.choices[0].message.content);
         *
         * // With images (OpenAI-compatible format)
         * const response = await client.ai.chat.completions.create({
         *   model: 'gpt-4-vision',
         *   messages: [{
         *     role: 'user',
         *     content: [
         *       { type: 'text', text: 'What is in this image?' },
         *       { type: 'image_url', image_url: { url: 'https://example.com/image.jpg' } }
         *     ]
         *   }]
         * });
         *
         * // With PDF files
         * const pdfResponse = await client.ai.chat.completions.create({
         *   model: 'anthropic/claude-3.5-sonnet',
         *   messages: [{
         *     role: 'user',
         *     content: [
         *       { type: 'text', text: 'Summarize this document' },
         *       { type: 'file', file: { filename: 'doc.pdf', file_data: 'https://example.com/doc.pdf' } }
         *     ]
         *   }],
         *   fileParser: { enabled: true, pdf: { engine: 'mistral-ocr' } }
         * });
         *
         * // With web search
         * const searchResponse = await client.ai.chat.completions.create({
         *   model: 'openai/gpt-4',
         *   messages: [{ role: 'user', content: 'What are the latest news about AI?' }],
         *   webSearch: { enabled: true, maxResults: 5 }
         * });
         * // Access citations from response.choices[0].message.annotations
         *
         * // With thinking/reasoning mode (Anthropic models)
         * const thinkingResponse = await client.ai.chat.completions.create({
         *   model: 'anthropic/claude-3.5-sonnet',
         *   messages: [{ role: 'user', content: 'Solve this complex math problem...' }],
         *   thinking: true
         * });
         *
         * // Streaming - returns async iterable
         * const stream = await client.ai.chat.completions.create({
         *   model: 'gpt-4',
         *   messages: [{ role: 'user', content: 'Tell me a story' }],
         *   stream: true
         * });
         *
         * for await (const chunk of stream) {
         *   if (chunk.choices[0]?.delta?.content) {
         *     process.stdout.write(chunk.choices[0].delta.content);
         *   }
         * }
         * ```
         */
        async create(params) {
          const backendParams = {
            model: params.model,
            messages: params.messages,
            temperature: params.temperature,
            maxTokens: params.maxTokens,
            topP: params.topP,
            stream: params.stream,
            // New plugin options
            webSearch: params.webSearch,
            fileParser: params.fileParser,
            thinking: params.thinking,
            // Tool calling options
            tools: params.tools,
            toolChoice: params.toolChoice,
            parallelToolCalls: params.parallelToolCalls
          };
          if (params.stream) {
            const headers = this.http.getHeaders();
            headers["Content-Type"] = "application/json";
            const response2 = await this.http.fetch(`${this.http.baseUrl}/api/ai/chat/completion`, {
              method: "POST",
              headers,
              body: JSON.stringify(backendParams)
            });
            if (!response2.ok) {
              const error = await response2.json();
              throw new Error(error.error || "Stream request failed");
            }
            return this.parseSSEStream(response2, params.model);
          }
          const response = await this.http.post(
            "/api/ai/chat/completion",
            backendParams
          );
          const content = response.text || "";
          return {
            id: `chatcmpl-${Date.now()}`,
            object: "chat.completion",
            created: Math.floor(Date.now() / 1e3),
            model: response.metadata?.model,
            choices: [
              {
                index: 0,
                message: {
                  role: "assistant",
                  content,
                  // Include tool_calls if present (from tool calling)
                  ...response.tool_calls?.length && { tool_calls: response.tool_calls },
                  // Include annotations if present (from web search or file parsing)
                  ...response.annotations?.length && { annotations: response.annotations }
                },
                finish_reason: response.tool_calls?.length ? "tool_calls" : "stop"
              }
            ],
            usage: response.metadata?.usage || {
              prompt_tokens: 0,
              completion_tokens: 0,
              total_tokens: 0
            }
          };
        }
        /**
         * Parse SSE stream into async iterable of OpenAI-like chunks
         */
        async *parseSSEStream(response, model) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          try {
            while (true) {
              const { done, value: value2 } = await reader.read();
              if (done) {
                break;
              }
              buffer += decoder.decode(value2, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() || "";
              for (const line of lines) {
                if (line.startsWith("data: ")) {
                  const dataStr = line.slice(6).trim();
                  if (dataStr) {
                    try {
                      const data = JSON.parse(dataStr);
                      if (data.chunk || data.content) {
                        yield {
                          id: `chatcmpl-${Date.now()}`,
                          object: "chat.completion.chunk",
                          created: Math.floor(Date.now() / 1e3),
                          model,
                          choices: [
                            {
                              index: 0,
                              delta: {
                                content: data.chunk || data.content
                              },
                              finish_reason: null
                            }
                          ]
                        };
                      }
                      if (data.tool_calls?.length) {
                        yield {
                          id: `chatcmpl-${Date.now()}`,
                          object: "chat.completion.chunk",
                          created: Math.floor(Date.now() / 1e3),
                          model,
                          choices: [
                            {
                              index: 0,
                              delta: {
                                tool_calls: data.tool_calls
                              },
                              finish_reason: "tool_calls"
                            }
                          ]
                        };
                      }
                      if (data.done) {
                        reader.releaseLock();
                        return;
                      }
                    } catch {
                      console.warn("Failed to parse SSE data:", dataStr);
                    }
                  }
                }
              }
            }
          } finally {
            reader.releaseLock();
          }
        }
      };
      var Embeddings = class {
        constructor(http) {
          this.http = http;
        }
        /**
         * Create embeddings for text input - OpenAI-like response format
         *
         * @example
         * ```typescript
         * // Single text input
         * const response = await client.ai.embeddings.create({
         *   model: 'openai/text-embedding-3-small',
         *   input: 'Hello world'
         * });
         * console.log(response.data[0].embedding); // number[]
         *
         * // Multiple text inputs
         * const response = await client.ai.embeddings.create({
         *   model: 'openai/text-embedding-3-small',
         *   input: ['Hello world', 'Goodbye world']
         * });
         * response.data.forEach((item, i) => {
         *   console.log(`Embedding ${i}:`, item.embedding.slice(0, 5)); // First 5 dimensions
         * });
         *
         * // With custom dimensions (if supported by model)
         * const response = await client.ai.embeddings.create({
         *   model: 'openai/text-embedding-3-small',
         *   input: 'Hello world',
         *   dimensions: 256
         * });
         *
         * // With base64 encoding format
         * const response = await client.ai.embeddings.create({
         *   model: 'openai/text-embedding-3-small',
         *   input: 'Hello world',
         *   encoding_format: 'base64'
         * });
         * ```
         */
        async create(params) {
          const response = await this.http.post("/api/ai/embeddings", params);
          return {
            object: response.object,
            data: response.data,
            model: response.metadata?.model,
            usage: response.metadata?.usage ? {
              prompt_tokens: response.metadata.usage.promptTokens || 0,
              total_tokens: response.metadata.usage.totalTokens || 0
            } : {
              prompt_tokens: 0,
              total_tokens: 0
            }
          };
        }
      };
      var Images = class {
        constructor(http) {
          this.http = http;
        }
        /**
         * Generate images - OpenAI-like response format
         *
         * @example
         * ```typescript
         * // Text-to-image
         * const response = await client.ai.images.generate({
         *   model: 'dall-e-3',
         *   prompt: 'A sunset over mountains',
         * });
         * console.log(response.data[0].b64_json);
         *
         * // Image-to-image (with input images)
         * const response = await client.ai.images.generate({
         *   model: 'stable-diffusion-xl',
         *   prompt: 'Transform this into a watercolor painting',
         *   images: [
         *     { url: 'https://example.com/input.jpg' },
         *     // or base64-encoded Data URI:
         *     { url: 'data:image/jpeg;base64,/9j/4AAQ...' }
         *   ]
         * });
         * ```
         */
        async generate(params) {
          const response = await this.http.post(
            "/api/ai/image/generation",
            params
          );
          let data = [];
          if (response.images && response.images.length > 0) {
            data = response.images.map((img) => ({
              b64_json: img.imageUrl.replace(/^data:image\/\w+;base64,/, ""),
              content: response.text
            }));
          } else if (response.text) {
            data = [{ content: response.text }];
          }
          return {
            created: Math.floor(Date.now() / 1e3),
            data,
            ...response.metadata?.usage && {
              usage: {
                total_tokens: response.metadata.usage.totalTokens || 0,
                input_tokens: response.metadata.usage.promptTokens || 0,
                output_tokens: response.metadata.usage.completionTokens || 0
              }
            }
          };
        }
      };
      var Functions = class _Functions {
        constructor(http, functionsUrl) {
          this.http = http;
          this.functionsUrl = functionsUrl || _Functions.deriveSubhostingUrl(http.baseUrl);
        }
        /**
         * Derive the subhosting URL from the base URL.
         * Base URL pattern: https://{appKey}.{region}.insforge.app
         * Functions URL:    https://{appKey}.functions.insforge.app
         * Only applies to .insforge.app domains.
         */
        static deriveSubhostingUrl(baseUrl) {
          try {
            const { hostname } = new URL(baseUrl);
            if (!hostname.endsWith(".insforge.app")) {
              return void 0;
            }
            const appKey = hostname.split(".")[0];
            return `https://${appKey}.functions.insforge.app`;
          } catch {
            return void 0;
          }
        }
        /**
         * Build a Request for in-process dispatch. The host is a non-routable
         * placeholder; the router only reads pathname.
         */
        buildInProcessRequest(slug, method, body, callerHeaders) {
          const url2 = new URL("/" + slug, "http://insforge.local").toString();
          const headers = { ...this.http.getHeaders() };
          const reqBody = serializeBody(method, body, headers);
          Object.assign(headers, callerHeaders);
          return new Request(url2, {
            method,
            headers,
            body: reqBody
          });
        }
        /**
         * Invoke an Edge Function.
         *
         * Dispatch order:
         * 1. If `globalThis.__insforge_dispatch__` is present, call it in-process.
         *    This avoids Deno Subhosting's 508 Loop Detected when one bundled
         *    function invokes another inside the same deployment.
         * 2. Otherwise, try the configured subhosting URL.
         * 3. On 404 from subhosting, fall back to the proxy path.
         *
         * @param slug The function slug to invoke
         * @param options Request options
         */
        async invoke(slug, options = {}) {
          const { method = "POST", body, headers = {} } = options;
          const dispatch = globalThis.__insforge_dispatch__;
          const localFunctionsUrl = _Functions.deriveSubhostingUrl(this.http.baseUrl);
          if (typeof dispatch === "function" && !!localFunctionsUrl && this.functionsUrl === localFunctionsUrl) {
            try {
              const req = this.buildInProcessRequest(slug, method, body, headers);
              const res = await dispatch(req);
              const data = await parseResponse(res);
              return { data, error: null };
            } catch (error) {
              if (error instanceof Error && error.name === "AbortError") {
                throw error;
              }
              return {
                data: null,
                error: error instanceof InsForgeError ? error : new InsForgeError(
                  error instanceof Error ? error.message : "Function invocation failed",
                  500,
                  "FUNCTION_ERROR"
                )
              };
            }
          }
          if (this.functionsUrl) {
            try {
              const data = await this.http.request(method, `${this.functionsUrl}/${slug}`, {
                body,
                headers
              });
              return { data, error: null };
            } catch (error) {
              if (error instanceof Error && error.name === "AbortError") {
                throw error;
              }
              if (error instanceof InsForgeError && error.statusCode === 404) {
              } else {
                return {
                  data: null,
                  error: error instanceof InsForgeError ? error : new InsForgeError(
                    error instanceof Error ? error.message : "Function invocation failed",
                    500,
                    "FUNCTION_ERROR"
                  )
                };
              }
            }
          }
          try {
            const path = `/functions/${slug}`;
            const data = await this.http.request(method, path, { body, headers });
            return { data, error: null };
          } catch (error) {
            if (error instanceof Error && error.name === "AbortError") {
              throw error;
            }
            return {
              data: null,
              error: error instanceof InsForgeError ? error : new InsForgeError(
                error instanceof Error ? error.message : "Function invocation failed",
                500,
                "FUNCTION_ERROR"
              )
            };
          }
        }
      };
      var CONNECT_TIMEOUT = 1e4;
      var SUBSCRIBE_TIMEOUT = 1e4;
      var Realtime = class {
        constructor(baseUrl, tokenManager, anonKey, getValidAccessToken = async () => tokenManager.getAccessToken()) {
          this.baseUrl = baseUrl;
          this.tokenManager = tokenManager;
          this.anonKey = anonKey;
          this.getValidAccessToken = getValidAccessToken;
          this.socket = null;
          this.connectPromise = null;
          this.connectionAttempt = null;
          this.nextConnectionAttemptId = 0;
          this.subscriptions = /* @__PURE__ */ new Map();
          this.eventListeners = /* @__PURE__ */ new Map();
          this.tokenManager.onAuthStateChange((event) => {
            if (event !== AuthChangeEvent.TOKEN_REFRESHED) {
              this.reconnectForAuthChange();
            }
          });
        }
        notifyListeners(event, payload) {
          for (const callback of this.eventListeners.get(event) ?? []) {
            try {
              callback(payload);
            } catch (error) {
              console.error(`Error in ${event} callback:`, error);
            }
          }
        }
        async getHandshakeToken() {
          return await this.getValidAccessToken() ?? this.anonKey ?? null;
        }
        connect() {
          if (this.socket?.connected) {
            return Promise.resolve();
          }
          if (this.connectPromise) {
            return this.connectPromise;
          }
          const attemptId = ++this.nextConnectionAttemptId;
          const connection = (async () => {
            const { io } = await Promise.resolve().then(() => (init_esm5(), esm_exports2));
            if (attemptId !== this.nextConnectionAttemptId) {
              throw new Error("Connection cancelled");
            }
            await new Promise((resolve, reject) => {
              const socket = io(this.baseUrl, {
                transports: ["websocket"],
                auth: (callback) => {
                  void this.getHandshakeToken().then(
                    (token) => callback(token ? { token } : {}),
                    () => callback({})
                  );
                }
              });
              this.socket = socket;
              let initialConnection = true;
              let timeoutId = null;
              const clearConnectTimeout = () => {
                if (timeoutId) {
                  clearTimeout(timeoutId);
                  timeoutId = null;
                }
              };
              const dispose = () => {
                clearConnectTimeout();
                socket.off("connect", onConnect);
                socket.off("connect_error", onConnectError);
                socket.off("disconnect", onDisconnect);
                socket.off("realtime:error", onRealtimeError);
                socket.offAny(onAny);
                socket.disconnect();
                if (this.socket === socket) {
                  this.socket = null;
                }
                if (this.connectionAttempt?.id === attemptId) {
                  this.connectionAttempt = null;
                }
              };
              const fail = (error) => {
                if (!initialConnection) {
                  return;
                }
                initialConnection = false;
                dispose();
                reject(error);
              };
              const onConnect = () => {
                if (this.socket !== socket) {
                  return;
                }
                clearConnectTimeout();
                this.resubscribeChannels();
                this.notifyListeners("connect");
                if (initialConnection) {
                  initialConnection = false;
                  if (this.connectionAttempt?.id === attemptId) {
                    this.connectionAttempt = null;
                  }
                  resolve();
                }
              };
              const onConnectError = (error) => {
                clearConnectTimeout();
                this.notifyListeners("connect_error", error);
                if (initialConnection) {
                  fail(error);
                }
              };
              const onDisconnect = (reason) => {
                this.handleDisconnect(reason);
              };
              const onRealtimeError = (error) => {
                this.notifyListeners("error", error);
              };
              const onAny = (event, message) => {
                if (event === "realtime:error") {
                  return;
                }
                this.applyPresenceEvent(event, message);
                this.notifyListeners(event, message);
              };
              this.connectionAttempt = { id: attemptId, socket, cancel: fail };
              socket.on("connect", onConnect);
              socket.on("connect_error", onConnectError);
              socket.on("disconnect", onDisconnect);
              socket.on("realtime:error", onRealtimeError);
              socket.onAny(onAny);
              timeoutId = setTimeout(
                () => fail(new Error(`Connection timeout after ${CONNECT_TIMEOUT}ms`)),
                CONNECT_TIMEOUT
              );
            });
          })();
          const trackedConnection = connection.finally(() => {
            if (this.connectPromise === trackedConnection) {
              this.connectPromise = null;
            }
          });
          this.connectPromise = trackedConnection;
          return trackedConnection;
        }
        disconnect() {
          this.nextConnectionAttemptId++;
          this.connectionAttempt?.cancel(new Error("Disconnected"));
          this.socket?.disconnect();
          this.socket = null;
          this.connectPromise = null;
          for (const subscription of this.subscriptions.values()) {
            this.settleSubscription(
              subscription,
              {
                ok: false,
                channel: subscription.channel,
                error: { code: "DISCONNECTED", message: "Disconnected" }
              },
              false
            );
          }
          this.subscriptions.clear();
        }
        reconnectForAuthChange() {
          for (const subscription of this.subscriptions.values()) {
            if (subscription.status === "rejected") {
              subscription.status = "pending";
            }
          }
          if (!this.socket) {
            return;
          }
          this.socket.disconnect();
          this.socket.connect();
        }
        handleDisconnect(reason) {
          for (const subscription of this.subscriptions.values()) {
            if (subscription.status === "rejected") {
              continue;
            }
            subscription.status = "pending";
            this.settleSubscription(
              subscription,
              {
                ok: false,
                channel: subscription.channel,
                error: { code: "DISCONNECTED", message: "Connection lost before subscription completed" }
              },
              true
            );
          }
          this.notifyListeners("disconnect", reason);
        }
        resubscribeChannels() {
          for (const [channel, subscription] of this.subscriptions) {
            if (subscription.status === "pending") {
              this.requestSubscription(channel, subscription);
            }
          }
        }
        requestSubscription(channel, subscription) {
          if (subscription.pending) {
            return subscription.pending;
          }
          const socket = this.socket;
          if (!socket?.connected) {
            return Promise.resolve({
              ok: false,
              channel,
              error: { code: "CONNECTION_FAILED", message: "Not connected to realtime server" }
            });
          }
          subscription.status = "pending";
          const epoch = ++subscription.epoch;
          let timeoutId;
          subscription.pending = new Promise((resolve) => {
            subscription.settlePending = (response) => {
              if (timeoutId) {
                clearTimeout(timeoutId);
              }
              subscription.pending = void 0;
              subscription.settlePending = void 0;
              resolve(response);
            };
            timeoutId = setTimeout(() => {
              if (this.subscriptions.get(channel) === subscription && subscription.epoch === epoch) {
                this.settleSubscription(
                  subscription,
                  {
                    ok: false,
                    channel,
                    error: {
                      code: "SUBSCRIBE_TIMEOUT",
                      message: "Subscription acknowledgement timed out"
                    }
                  },
                  true
                );
              }
            }, SUBSCRIBE_TIMEOUT);
            socket.emit("realtime:subscribe", { channel }, (response) => {
              if (this.subscriptions.get(channel) !== subscription || subscription.epoch !== epoch) {
                return;
              }
              if (response.ok) {
                subscription.status = "subscribed";
                subscription.members = new Map(
                  response.presence.members.map((member) => [member.presenceId, member])
                );
              } else {
                subscription.status = "rejected";
                subscription.members.clear();
              }
              this.settleSubscription(subscription, response, false);
            });
          });
          return subscription.pending;
        }
        settleSubscription(subscription, response, incrementEpoch) {
          if (incrementEpoch) {
            subscription.epoch++;
          }
          subscription.settlePending?.(response);
        }
        applyPresenceEvent(event, message) {
          if (event !== "presence:join" && event !== "presence:leave") {
            return;
          }
          const presenceEvent = message;
          const channel = presenceEvent.meta?.channel;
          const member = presenceEvent.member;
          if (!channel || !member) {
            return;
          }
          const subscription = this.subscriptions.get(channel);
          if (!subscription) {
            return;
          }
          if (event === "presence:join") {
            subscription.members.set(member.presenceId, member);
          } else {
            subscription.members.delete(member.presenceId);
          }
        }
        get isConnected() {
          return this.socket?.connected ?? false;
        }
        get connectionState() {
          if (!this.socket) {
            return "disconnected";
          }
          return this.socket.connected ? "connected" : "connecting";
        }
        get socketId() {
          return this.socket?.id;
        }
        async subscribe(channel) {
          let subscription = this.subscriptions.get(channel);
          if (subscription) {
            if (subscription.pending) {
              return subscription.pending;
            }
            if (subscription.status === "subscribed") {
              return { ok: true, channel, presence: { members: [...subscription.members.values()] } };
            }
          } else {
            subscription = { channel, epoch: 0, status: "pending", members: /* @__PURE__ */ new Map() };
            this.subscriptions.set(channel, subscription);
          }
          if (!this.socket?.connected) {
            try {
              await this.connect();
            } catch (error) {
              if (this.subscriptions.get(channel) === subscription) {
                this.subscriptions.delete(channel);
              }
              const message = error instanceof Error ? error.message : "Connection failed";
              return { ok: false, channel, error: { code: "CONNECTION_FAILED", message } };
            }
          }
          return subscription.pending ?? this.requestSubscription(channel, subscription);
        }
        unsubscribe(channel) {
          const subscription = this.subscriptions.get(channel);
          if (!subscription) {
            return;
          }
          this.subscriptions.delete(channel);
          this.settleSubscription(
            subscription,
            {
              ok: false,
              channel,
              error: { code: "SUBSCRIPTION_CANCELLED", message: "Subscription cancelled" }
            },
            true
          );
          if (this.socket?.connected) {
            this.socket.emit("realtime:unsubscribe", { channel });
          }
        }
        async publish(channel, event, payload) {
          if (!this.socket?.connected) {
            throw new Error("Not connected to realtime server. Call connect() first.");
          }
          this.socket.emit("realtime:publish", { channel, event, payload });
        }
        on(event, callback) {
          const listeners = this.eventListeners.get(event) ?? /* @__PURE__ */ new Set();
          listeners.add(callback);
          this.eventListeners.set(event, listeners);
        }
        off(event, callback) {
          const listeners = this.eventListeners.get(event);
          listeners?.delete(callback);
          if (listeners?.size === 0) {
            this.eventListeners.delete(event);
          }
        }
        once(event, callback) {
          const wrapper = (payload) => {
            this.off(event, wrapper);
            callback(payload);
          };
          this.on(event, wrapper);
        }
        getSubscribedChannels() {
          return [...this.subscriptions.values()].filter((subscription) => subscription.status === "subscribed").map((subscription) => subscription.channel);
        }
        getPresenceState(channel) {
          return [...this.subscriptions.get(channel)?.members.values() ?? []];
        }
      };
      var Emails = class {
        constructor(http) {
          this.http = http;
        }
        /**
         * Send a custom HTML email
         * @param options Email options including recipients, subject, and HTML content
         */
        async send(options) {
          try {
            const data = await this.http.post("/api/email/send-raw", options);
            return { data, error: null };
          } catch (error) {
            if (error instanceof Error && error.name === "AbortError") {
              throw error;
            }
            return {
              data: null,
              error: error instanceof InsForgeError ? error : new InsForgeError(
                error instanceof Error ? error.message : "Email send failed",
                500,
                "EMAIL_ERROR"
              )
            };
          }
        }
      };
      function providerEnvironmentPath(provider, environment) {
        return `/api/payments/${provider}/${encodeURIComponent(environment)}`;
      }
      var StripePayments = class {
        constructor(http) {
          this.http = http;
        }
        /**
         * Create a Stripe Checkout Session through the InsForge backend.
         *
         * @example
         * ```typescript
         * const { data, error } = await client.payments.stripe.createCheckoutSession('test', {
         *   mode: 'payment',
         *   lineItems: [{ priceId: 'price_123', quantity: 1 }],
         *   successUrl: `${window.location.origin}/success`,
         *   cancelUrl: `${window.location.origin}/pricing`
         * });
         *
         * if (!error && data.checkoutSession.url) {
         *   window.location.assign(data.checkoutSession.url);
         * }
         * ```
         */
        async createCheckoutSession(environment, request) {
          try {
            const data = await this.http.post(
              `${providerEnvironmentPath("stripe", environment)}/checkout-sessions`,
              request,
              { idempotent: !!request.idempotencyKey }
            );
            return { data, error: null };
          } catch (error) {
            return wrapError(
              error,
              "Stripe checkout session creation failed"
            );
          }
        }
        /**
         * Create a Stripe Billing Portal Session for a mapped billing subject.
         */
        async createCustomerPortalSession(environment, request) {
          try {
            const data = await this.http.post(
              `${providerEnvironmentPath("stripe", environment)}/customer-portal-sessions`,
              request
            );
            return { data, error: null };
          } catch (error) {
            return wrapError(
              error,
              "Stripe customer portal session creation failed"
            );
          }
        }
      };
      var RazorpayPayments = class {
        constructor(http) {
          this.http = http;
        }
        async createOrder(environment, request) {
          try {
            const data = await this.http.post(
              `${providerEnvironmentPath("razorpay", environment)}/orders`,
              request
            );
            return { data, error: null };
          } catch (error) {
            return wrapError(error, "Razorpay order creation failed");
          }
        }
        async verifyOrder(environment, request) {
          try {
            const data = await this.http.post(
              `${providerEnvironmentPath("razorpay", environment)}/orders/verify`,
              request
            );
            return { data, error: null };
          } catch (error) {
            return wrapError(error, "Razorpay order verification failed");
          }
        }
        async createSubscription(environment, request) {
          try {
            const data = await this.http.post(
              `${providerEnvironmentPath("razorpay", environment)}/subscriptions`,
              request
            );
            return { data, error: null };
          } catch (error) {
            return wrapError(
              error,
              "Razorpay subscription creation failed"
            );
          }
        }
        async verifySubscription(environment, request) {
          try {
            const data = await this.http.post(
              `${providerEnvironmentPath("razorpay", environment)}/subscriptions/verify`,
              request
            );
            return { data, error: null };
          } catch (error) {
            return wrapError(
              error,
              "Razorpay subscription verification failed"
            );
          }
        }
        async cancelSubscription(environment, subscriptionId, request = {}) {
          try {
            const data = await this.http.post(
              `${providerEnvironmentPath("razorpay", environment)}/subscriptions/${encodeURIComponent(
                subscriptionId
              )}/cancel`,
              request
            );
            return { data, error: null };
          } catch (error) {
            return wrapError(
              error,
              "Razorpay subscription cancellation failed"
            );
          }
        }
        async pauseSubscription(environment, subscriptionId) {
          try {
            const data = await this.http.post(
              `${providerEnvironmentPath("razorpay", environment)}/subscriptions/${encodeURIComponent(
                subscriptionId
              )}/pause`,
              {}
            );
            return { data, error: null };
          } catch (error) {
            return wrapError(
              error,
              "Razorpay subscription pause failed"
            );
          }
        }
        async resumeSubscription(environment, subscriptionId) {
          try {
            const data = await this.http.post(
              `${providerEnvironmentPath("razorpay", environment)}/subscriptions/${encodeURIComponent(
                subscriptionId
              )}/resume`,
              {}
            );
            return { data, error: null };
          } catch (error) {
            return wrapError(
              error,
              "Razorpay subscription resume failed"
            );
          }
        }
      };
      var Payments = class {
        constructor(http) {
          this.stripe = new StripePayments(http);
          this.razorpay = new RazorpayPayments(http);
        }
      };
      var InsForgeClient = class {
        constructor(config = {}) {
          const logger = new Logger(config.debug);
          this.tokenManager = new TokenManager();
          this.http = new HttpClient(config, this.tokenManager, logger);
          const accessToken = config.accessToken ?? config.edgeFunctionToken;
          if (accessToken) {
            this.http.setAuthToken(accessToken);
            this.tokenManager.setAccessToken(accessToken);
          }
          this.auth = new Auth(this.http, this.tokenManager, {
            isServerMode: config.isServerMode ?? !!accessToken,
            detectOAuthCallback: config.auth?.detectOAuthCallback
          });
          this.database = new Database(this.http, config.db?.schema);
          this.storage = new Storage(this.http);
          this.ai = new AI(this.http);
          this.functions = new Functions(this.http, config.functionsUrl);
          this.realtime = new Realtime(
            this.http.baseUrl,
            this.tokenManager,
            config.anonKey,
            () => this.http.getValidAccessToken()
          );
          this.emails = new Emails(this.http);
          this.payments = new Payments(this.http);
        }
        /**
         * Get the underlying HTTP client for custom requests
         *
         * @example
         * ```typescript
         * const httpClient = client.getHttpClient();
         * const customData = await httpClient.get('/api/custom-endpoint');
         * ```
         */
        getHttpClient() {
          return this.http;
        }
        /**
         * Set the access token used by every SDK surface. Updates both the HTTP
         * client (database / storage / functions / AI / emails) and the realtime
         * token manager. Pass `null` to sign out. By default a token replacement is
         * treated as a sign-in boundary and reconnects realtime. Pass
         * `AuthChangeEvent.TOKEN_REFRESHED` for a same-identity refresh to preserve a live socket; the
         * refreshed token is then used at the next handshake.
         *
         * Use this when an external auth provider (Better Auth, Clerk, Auth0,
         * WorkOS, Kinde, Stytch, …) issues the JWT and you need to keep the
         * long-lived InsForge client in sync. Without this, you'd have to call
         * `client.getHttpClient().setAuthToken(token)` AND reach into the private
         * realtime token manager separately.
         *
         * @example
         * ```typescript
         * import { AuthChangeEvent } from '@insforge/sdk';
         *
         * // Refresh a third-party-issued JWT periodically
         * const { token } = await fetch('/api/insforge-token').then((r) => r.json());
         * client.setAccessToken(token, AuthChangeEvent.TOKEN_REFRESHED);
         *
         * // Sign-out
         * client.setAccessToken(null);
         * ```
         */
        setAccessToken(token, event = AuthChangeEvent.SIGNED_IN) {
          this.http.setAuthToken(token);
          if (token === null) {
            this.tokenManager.clearSession();
          } else {
            this.tokenManager.setAccessToken(token, event);
          }
        }
        /**
         * Future modules will be added here:
         * - database: Database operations
         * - storage: File storage operations
         * - functions: Serverless functions
         * - tables: Table management
         * - metadata: Backend metadata
         */
      };
      function createClient(config = {}) {
        return new InsForgeClient(config);
      }
      function createAdminClient(config) {
        const { apiKey: rawApiKey, ...clientConfig } = config ?? {};
        const apiKey = rawApiKey?.trim();
        if (!apiKey) {
          throw new Error("Missing apiKey. Pass apiKey to createAdminClient().");
        }
        return new InsForgeClient({
          ...clientConfig,
          accessToken: apiKey,
          isServerMode: true
        });
      }
      var src_default = InsForgeClient;
    }
  });
  return require_index();
})();
