/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@supabase/auth-js/dist/module/AuthAdminApi.js":
/*!********************************************************************!*\
  !*** ./node_modules/@supabase/auth-js/dist/module/AuthAdminApi.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _GoTrueAdminApi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GoTrueAdminApi */ "./node_modules/@supabase/auth-js/dist/module/GoTrueAdminApi.js");

const AuthAdminApi = _GoTrueAdminApi__WEBPACK_IMPORTED_MODULE_0__["default"];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AuthAdminApi);
//# sourceMappingURL=AuthAdminApi.js.map

/***/ }),

/***/ "./node_modules/@supabase/auth-js/dist/module/AuthClient.js":
/*!******************************************************************!*\
  !*** ./node_modules/@supabase/auth-js/dist/module/AuthClient.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _GoTrueClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GoTrueClient */ "./node_modules/@supabase/auth-js/dist/module/GoTrueClient.js");

const AuthClient = _GoTrueClient__WEBPACK_IMPORTED_MODULE_0__["default"];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AuthClient);
//# sourceMappingURL=AuthClient.js.map

/***/ }),

/***/ "./node_modules/@supabase/auth-js/dist/module/GoTrueAdminApi.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@supabase/auth-js/dist/module/GoTrueAdminApi.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GoTrueAdminApi)
/* harmony export */ });
/* harmony import */ var _lib_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/fetch */ "./node_modules/@supabase/auth-js/dist/module/lib/fetch.js");
/* harmony import */ var _lib_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/helpers */ "./node_modules/@supabase/auth-js/dist/module/lib/helpers.js");
/* harmony import */ var _lib_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/errors */ "./node_modules/@supabase/auth-js/dist/module/lib/errors.js");
var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};



class GoTrueAdminApi {
    constructor({ url = '', headers = {}, fetch, }) {
        this.url = url;
        this.headers = headers;
        this.fetch = (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_1__.resolveFetch)(fetch);
        this.mfa = {
            listFactors: this._listFactors.bind(this),
            deleteFactor: this._deleteFactor.bind(this),
        };
    }
    /**
     * Removes a logged-in session.
     * @param jwt A valid, logged-in JWT.
     * @param scope The logout sope.
     */
    async signOut(jwt, scope = 'global') {
        try {
            await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_0__._request)(this.fetch, 'POST', `${this.url}/logout?scope=${scope}`, {
                headers: this.headers,
                jwt,
                noResolveJson: true,
            });
            return { data: null, error: null };
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return { data: null, error };
            }
            throw error;
        }
    }
    /**
     * Sends an invite link to an email address.
     * @param email The email address of the user.
     * @param options Additional options to be included when inviting.
     */
    async inviteUserByEmail(email, options = {}) {
        try {
            return await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_0__._request)(this.fetch, 'POST', `${this.url}/invite`, {
                body: { email, data: options.data },
                headers: this.headers,
                redirectTo: options.redirectTo,
                xform: _lib_fetch__WEBPACK_IMPORTED_MODULE_0__._userResponse,
            });
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return { data: { user: null }, error };
            }
            throw error;
        }
    }
    /**
     * Generates email links and OTPs to be sent via a custom email provider.
     * @param email The user's email.
     * @param options.password User password. For signup only.
     * @param options.data Optional user metadata. For signup only.
     * @param options.redirectTo The redirect url which should be appended to the generated link
     */
    async generateLink(params) {
        try {
            const { options } = params, rest = __rest(params, ["options"]);
            const body = Object.assign(Object.assign({}, rest), options);
            if ('newEmail' in rest) {
                // replace newEmail with new_email in request body
                body.new_email = rest === null || rest === void 0 ? void 0 : rest.newEmail;
                delete body['newEmail'];
            }
            return await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_0__._request)(this.fetch, 'POST', `${this.url}/admin/generate_link`, {
                body: body,
                headers: this.headers,
                xform: _lib_fetch__WEBPACK_IMPORTED_MODULE_0__._generateLinkResponse,
                redirectTo: options === null || options === void 0 ? void 0 : options.redirectTo,
            });
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return {
                    data: {
                        properties: null,
                        user: null,
                    },
                    error,
                };
            }
            throw error;
        }
    }
    // User Admin API
    /**
     * Creates a new user.
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    async createUser(attributes) {
        try {
            return await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_0__._request)(this.fetch, 'POST', `${this.url}/admin/users`, {
                body: attributes,
                headers: this.headers,
                xform: _lib_fetch__WEBPACK_IMPORTED_MODULE_0__._userResponse,
            });
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return { data: { user: null }, error };
            }
            throw error;
        }
    }
    /**
     * Get a list of users.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     * @param params An object which supports `page` and `perPage` as numbers, to alter the paginated results.
     */
    async listUsers(params) {
        var _a, _b, _c, _d, _e, _f, _g;
        try {
            const pagination = { nextPage: null, lastPage: 0, total: 0 };
            const response = await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_0__._request)(this.fetch, 'GET', `${this.url}/admin/users`, {
                headers: this.headers,
                noResolveJson: true,
                query: {
                    page: (_b = (_a = params === null || params === void 0 ? void 0 : params.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '',
                    per_page: (_d = (_c = params === null || params === void 0 ? void 0 : params.perPage) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : '',
                },
                xform: _lib_fetch__WEBPACK_IMPORTED_MODULE_0__._noResolveJsonResponse,
            });
            if (response.error)
                throw response.error;
            const users = await response.json();
            const total = (_e = response.headers.get('x-total-count')) !== null && _e !== void 0 ? _e : 0;
            const links = (_g = (_f = response.headers.get('link')) === null || _f === void 0 ? void 0 : _f.split(',')) !== null && _g !== void 0 ? _g : [];
            if (links.length > 0) {
                links.forEach((link) => {
                    const page = parseInt(link.split(';')[0].split('=')[1].substring(0, 1));
                    const rel = JSON.parse(link.split(';')[1].split('=')[1]);
                    pagination[`${rel}Page`] = page;
                });
                pagination.total = parseInt(total);
            }
            return { data: Object.assign(Object.assign({}, users), pagination), error: null };
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return { data: { users: [] }, error };
            }
            throw error;
        }
    }
    /**
     * Get user by id.
     *
     * @param uid The user's unique identifier
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    async getUserById(uid) {
        try {
            return await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_0__._request)(this.fetch, 'GET', `${this.url}/admin/users/${uid}`, {
                headers: this.headers,
                xform: _lib_fetch__WEBPACK_IMPORTED_MODULE_0__._userResponse,
            });
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return { data: { user: null }, error };
            }
            throw error;
        }
    }
    /**
     * Updates the user data.
     *
     * @param attributes The data you want to update.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    async updateUserById(uid, attributes) {
        try {
            return await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_0__._request)(this.fetch, 'PUT', `${this.url}/admin/users/${uid}`, {
                body: attributes,
                headers: this.headers,
                xform: _lib_fetch__WEBPACK_IMPORTED_MODULE_0__._userResponse,
            });
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return { data: { user: null }, error };
            }
            throw error;
        }
    }
    /**
     * Delete a user. Requires a `service_role` key.
     *
     * @param id The user id you want to remove.
     * @param shouldSoftDelete If true, then the user will be soft-deleted from the auth schema. Soft deletion allows user identification from the hashed user ID but is not reversible.
     * Defaults to false for backward compatibility.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    async deleteUser(id, shouldSoftDelete = false) {
        try {
            return await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_0__._request)(this.fetch, 'DELETE', `${this.url}/admin/users/${id}`, {
                headers: this.headers,
                body: {
                    should_soft_delete: shouldSoftDelete,
                },
                xform: _lib_fetch__WEBPACK_IMPORTED_MODULE_0__._userResponse,
            });
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return { data: { user: null }, error };
            }
            throw error;
        }
    }
    async _listFactors(params) {
        try {
            const { data, error } = await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_0__._request)(this.fetch, 'GET', `${this.url}/admin/users/${params.userId}/factors`, {
                headers: this.headers,
                xform: (factors) => {
                    return { data: { factors }, error: null };
                },
            });
            return { data, error };
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return { data: null, error };
            }
            throw error;
        }
    }
    async _deleteFactor(params) {
        try {
            const data = await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_0__._request)(this.fetch, 'DELETE', `${this.url}/admin/users/${params.userId}/factors/${params.id}`, {
                headers: this.headers,
            });
            return { data, error: null };
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return { data: null, error };
            }
            throw error;
        }
    }
}
//# sourceMappingURL=GoTrueAdminApi.js.map

/***/ }),

/***/ "./node_modules/@supabase/auth-js/dist/module/GoTrueClient.js":
/*!********************************************************************!*\
  !*** ./node_modules/@supabase/auth-js/dist/module/GoTrueClient.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GoTrueClient)
/* harmony export */ });
/* harmony import */ var _GoTrueAdminApi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GoTrueAdminApi */ "./node_modules/@supabase/auth-js/dist/module/GoTrueAdminApi.js");
/* harmony import */ var _lib_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/constants */ "./node_modules/@supabase/auth-js/dist/module/lib/constants.js");
/* harmony import */ var _lib_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/errors */ "./node_modules/@supabase/auth-js/dist/module/lib/errors.js");
/* harmony import */ var _lib_fetch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/fetch */ "./node_modules/@supabase/auth-js/dist/module/lib/fetch.js");
/* harmony import */ var _lib_helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lib/helpers */ "./node_modules/@supabase/auth-js/dist/module/lib/helpers.js");
/* harmony import */ var _lib_local_storage__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./lib/local-storage */ "./node_modules/@supabase/auth-js/dist/module/lib/local-storage.js");
/* harmony import */ var _lib_polyfills__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./lib/polyfills */ "./node_modules/@supabase/auth-js/dist/module/lib/polyfills.js");
/* harmony import */ var _lib_version__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./lib/version */ "./node_modules/@supabase/auth-js/dist/module/lib/version.js");
/* harmony import */ var _lib_locks__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./lib/locks */ "./node_modules/@supabase/auth-js/dist/module/lib/locks.js");









(0,_lib_polyfills__WEBPACK_IMPORTED_MODULE_6__.polyfillGlobalThis)(); // Make "globalThis" available
const DEFAULT_OPTIONS = {
    url: _lib_constants__WEBPACK_IMPORTED_MODULE_1__.GOTRUE_URL,
    storageKey: _lib_constants__WEBPACK_IMPORTED_MODULE_1__.STORAGE_KEY,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    headers: _lib_constants__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_HEADERS,
    flowType: 'implicit',
    debug: false,
    hasCustomAuthorizationHeader: false,
};
async function lockNoOp(name, acquireTimeout, fn) {
    return await fn();
}
class GoTrueClient {
    /**
     * Create a new client for use in the browser.
     */
    constructor(options) {
        var _a, _b;
        this.memoryStorage = null;
        this.stateChangeEmitters = new Map();
        this.autoRefreshTicker = null;
        this.visibilityChangedCallback = null;
        this.refreshingDeferred = null;
        /**
         * Keeps track of the async client initialization.
         * When null or not yet resolved the auth state is `unknown`
         * Once resolved the the auth state is known and it's save to call any further client methods.
         * Keep extra care to never reject or throw uncaught errors
         */
        this.initializePromise = null;
        this.detectSessionInUrl = true;
        this.hasCustomAuthorizationHeader = false;
        this.suppressGetSessionWarning = false;
        this.lockAcquired = false;
        this.pendingInLock = [];
        /**
         * Used to broadcast state change events to other tabs listening.
         */
        this.broadcastChannel = null;
        this.logger = console.log;
        this.instanceID = GoTrueClient.nextInstanceID;
        GoTrueClient.nextInstanceID += 1;
        if (this.instanceID > 0 && (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.isBrowser)()) {
            console.warn('Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.');
        }
        const settings = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options);
        this.logDebugMessages = !!settings.debug;
        if (typeof settings.debug === 'function') {
            this.logger = settings.debug;
        }
        this.persistSession = settings.persistSession;
        this.storageKey = settings.storageKey;
        this.autoRefreshToken = settings.autoRefreshToken;
        this.admin = new _GoTrueAdminApi__WEBPACK_IMPORTED_MODULE_0__["default"]({
            url: settings.url,
            headers: settings.headers,
            fetch: settings.fetch,
        });
        this.url = settings.url;
        this.headers = settings.headers;
        this.fetch = (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.resolveFetch)(settings.fetch);
        this.lock = settings.lock || lockNoOp;
        this.detectSessionInUrl = settings.detectSessionInUrl;
        this.flowType = settings.flowType;
        this.hasCustomAuthorizationHeader = settings.hasCustomAuthorizationHeader;
        if (settings.lock) {
            this.lock = settings.lock;
        }
        else if ((0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.isBrowser)() && ((_a = globalThis === null || globalThis === void 0 ? void 0 : globalThis.navigator) === null || _a === void 0 ? void 0 : _a.locks)) {
            this.lock = _lib_locks__WEBPACK_IMPORTED_MODULE_8__.navigatorLock;
        }
        else {
            this.lock = lockNoOp;
        }
        this.mfa = {
            verify: this._verify.bind(this),
            enroll: this._enroll.bind(this),
            unenroll: this._unenroll.bind(this),
            challenge: this._challenge.bind(this),
            listFactors: this._listFactors.bind(this),
            challengeAndVerify: this._challengeAndVerify.bind(this),
            getAuthenticatorAssuranceLevel: this._getAuthenticatorAssuranceLevel.bind(this),
        };
        if (this.persistSession) {
            if (settings.storage) {
                this.storage = settings.storage;
            }
            else {
                if ((0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.supportsLocalStorage)()) {
                    this.storage = _lib_local_storage__WEBPACK_IMPORTED_MODULE_5__.localStorageAdapter;
                }
                else {
                    this.memoryStorage = {};
                    this.storage = (0,_lib_local_storage__WEBPACK_IMPORTED_MODULE_5__.memoryLocalStorageAdapter)(this.memoryStorage);
                }
            }
        }
        else {
            this.memoryStorage = {};
            this.storage = (0,_lib_local_storage__WEBPACK_IMPORTED_MODULE_5__.memoryLocalStorageAdapter)(this.memoryStorage);
        }
        if ((0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.isBrowser)() && globalThis.BroadcastChannel && this.persistSession && this.storageKey) {
            try {
                this.broadcastChannel = new globalThis.BroadcastChannel(this.storageKey);
            }
            catch (e) {
                console.error('Failed to create a new BroadcastChannel, multi-tab state changes will not be available', e);
            }
            (_b = this.broadcastChannel) === null || _b === void 0 ? void 0 : _b.addEventListener('message', async (event) => {
                this._debug('received broadcast notification from other tab or client', event);
                await this._notifyAllSubscribers(event.data.event, event.data.session, false); // broadcast = false so we don't get an endless loop of messages
            });
        }
        this.initialize();
    }
    _debug(...args) {
        if (this.logDebugMessages) {
            this.logger(`GoTrueClient@${this.instanceID} (${_lib_version__WEBPACK_IMPORTED_MODULE_7__.version}) ${new Date().toISOString()}`, ...args);
        }
        return this;
    }
    /**
     * Initializes the client session either from the url or from storage.
     * This method is automatically called when instantiating the client, but should also be called
     * manually when checking for an error from an auth redirect (oauth, magiclink, password recovery, etc).
     */
    async initialize() {
        if (this.initializePromise) {
            return await this.initializePromise;
        }
        this.initializePromise = (async () => {
            return await this._acquireLock(-1, async () => {
                return await this._initialize();
            });
        })();
        return await this.initializePromise;
    }
    /**
     * IMPORTANT:
     * 1. Never throw in this method, as it is called from the constructor
     * 2. Never return a session from this method as it would be cached over
     *    the whole lifetime of the client
     */
    async _initialize() {
        var _a;
        try {
            const params = (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.parseParametersFromURL)(window.location.href);
            let callbackUrlType = 'none';
            if (this._isImplicitGrantCallback(params)) {
                callbackUrlType = 'implicit';
            }
            else if (await this._isPKCECallback(params)) {
                callbackUrlType = 'pkce';
            }
            /**
             * Attempt to get the session from the URL only if these conditions are fulfilled
             *
             * Note: If the URL isn't one of the callback url types (implicit or pkce),
             * then there could be an existing session so we don't want to prematurely remove it
             */
            if ((0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.isBrowser)() && this.detectSessionInUrl && callbackUrlType !== 'none') {
                const { data, error } = await this._getSessionFromURL(params, callbackUrlType);
                if (error) {
                    this._debug('#_initialize()', 'error detecting session from URL', error);
                    if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthImplicitGrantRedirectError)(error)) {
                        const errorCode = (_a = error.details) === null || _a === void 0 ? void 0 : _a.code;
                        if (errorCode === 'identity_already_exists' ||
                            errorCode === 'identity_not_found' ||
                            errorCode === 'single_identity_not_deletable') {
                            return { error };
                        }
                    }
                    // failed login attempt via url,
                    // remove old session as in verifyOtp, signUp and signInWith*
                    await this._removeSession();
                    return { error };
                }
                const { session, redirectType } = data;
                this._debug('#_initialize()', 'detected session in URL', session, 'redirect type', redirectType);
                await this._saveSession(session);
                setTimeout(async () => {
                    if (redirectType === 'recovery') {
                        await this._notifyAllSubscribers('PASSWORD_RECOVERY', session);
                    }
                    else {
                        await this._notifyAllSubscribers('SIGNED_IN', session);
                    }
                }, 0);
                return { error: null };
            }
            // no login attempt via callback url try to recover session from storage
            await this._recoverAndRefresh();
            return { error: null };
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return { error };
            }
            return {
                error: new _lib_errors__WEBPACK_IMPORTED_MODULE_2__.AuthUnknownError('Unexpected error during initialization', error),
            };
        }
        finally {
            await this._handleVisibilityChange();
            this._debug('#_initialize()', 'end');
        }
    }
    /**
     * Creates a new anonymous user.
     *
     * @returns A session where the is_anonymous claim in the access token JWT set to true
     */
    async signInAnonymously(credentials) {
        var _a, _b, _c;
        try {
            const res = await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_3__._request)(this.fetch, 'POST', `${this.url}/signup`, {
                headers: this.headers,
                body: {
                    data: (_b = (_a = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : {},
                    gotrue_meta_security: { captcha_token: (_c = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _c === void 0 ? void 0 : _c.captchaToken },
                },
                xform: _lib_fetch__WEBPACK_IMPORTED_MODULE_3__._sessionResponse,
            });
            const { data, error } = res;
            if (error || !data) {
                return { data: { user: null, session: null }, error: error };
            }
            const session = data.session;
            const user = data.user;
            if (data.session) {
                await this._saveSession(data.session);
                await this._notifyAllSubscribers('SIGNED_IN', session);
            }
            return { data: { user, session }, error: null };
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return { data: { user: null, session: null }, error };
            }
            throw error;
        }
    }
    /**
     * Creates a new user.
     *
     * Be aware that if a user account exists in the system you may get back an
     * error message that attempts to hide this information from the user.
     * This method has support for PKCE via email signups. The PKCE flow cannot be used when autoconfirm is enabled.
     *
     * @returns A logged-in session if the server has "autoconfirm" ON
     * @returns A user if the server has "autoconfirm" OFF
     */
    async signUp(credentials) {
        var _a, _b, _c;
        try {
            let res;
            if ('email' in credentials) {
                const { email, password, options } = credentials;
                let codeChallenge = null;
                let codeChallengeMethod = null;
                if (this.flowType === 'pkce') {
                    ;
                    [codeChallenge, codeChallengeMethod] = await (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.getCodeChallengeAndMethod)(this.storage, this.storageKey);
                }
                res = await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_3__._request)(this.fetch, 'POST', `${this.url}/signup`, {
                    headers: this.headers,
                    redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo,
                    body: {
                        email,
                        password,
                        data: (_a = options === null || options === void 0 ? void 0 : options.data) !== null && _a !== void 0 ? _a : {},
                        gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
                        code_challenge: codeChallenge,
                        code_challenge_method: codeChallengeMethod,
                    },
                    xform: _lib_fetch__WEBPACK_IMPORTED_MODULE_3__._sessionResponse,
                });
            }
            else if ('phone' in credentials) {
                const { phone, password, options } = credentials;
                res = await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_3__._request)(this.fetch, 'POST', `${this.url}/signup`, {
                    headers: this.headers,
                    body: {
                        phone,
                        password,
                        data: (_b = options === null || options === void 0 ? void 0 : options.data) !== null && _b !== void 0 ? _b : {},
                        channel: (_c = options === null || options === void 0 ? void 0 : options.channel) !== null && _c !== void 0 ? _c : 'sms',
                        gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
                    },
                    xform: _lib_fetch__WEBPACK_IMPORTED_MODULE_3__._sessionResponse,
                });
            }
            else {
                throw new _lib_errors__WEBPACK_IMPORTED_MODULE_2__.AuthInvalidCredentialsError('You must provide either an email or phone number and a password');
            }
            const { data, error } = res;
            if (error || !data) {
                return { data: { user: null, session: null }, error: error };
            }
            const session = data.session;
            const user = data.user;
            if (data.session) {
                await this._saveSession(data.session);
                await this._notifyAllSubscribers('SIGNED_IN', session);
            }
            return { data: { user, session }, error: null };
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return { data: { user: null, session: null }, error };
            }
            throw error;
        }
    }
    /**
     * Log in an existing user with an email and password or phone and password.
     *
     * Be aware that you may get back an error message that will not distinguish
     * between the cases where the account does not exist or that the
     * email/phone and password combination is wrong or that the account can only
     * be accessed via social login.
     */
    async signInWithPassword(credentials) {
        try {
            let res;
            if ('email' in credentials) {
                const { email, password, options } = credentials;
                res = await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_3__._request)(this.fetch, 'POST', `${this.url}/token?grant_type=password`, {
                    headers: this.headers,
                    body: {
                        email,
                        password,
                        gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
                    },
                    xform: _lib_fetch__WEBPACK_IMPORTED_MODULE_3__._sessionResponsePassword,
                });
            }
            else if ('phone' in credentials) {
                const { phone, password, options } = credentials;
                res = await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_3__._request)(this.fetch, 'POST', `${this.url}/token?grant_type=password`, {
                    headers: this.headers,
                    body: {
                        phone,
                        password,
                        gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
                    },
                    xform: _lib_fetch__WEBPACK_IMPORTED_MODULE_3__._sessionResponsePassword,
                });
            }
            else {
                throw new _lib_errors__WEBPACK_IMPORTED_MODULE_2__.AuthInvalidCredentialsError('You must provide either an email or phone number and a password');
            }
            const { data, error } = res;
            if (error) {
                return { data: { user: null, session: null }, error };
            }
            else if (!data || !data.session || !data.user) {
                return { data: { user: null, session: null }, error: new _lib_errors__WEBPACK_IMPORTED_MODULE_2__.AuthInvalidTokenResponseError() };
            }
            if (data.session) {
                await this._saveSession(data.session);
                await this._notifyAllSubscribers('SIGNED_IN', data.session);
            }
            return {
                data: Object.assign({ user: data.user, session: data.session }, (data.weak_password ? { weakPassword: data.weak_password } : null)),
                error,
            };
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return { data: { user: null, session: null }, error };
            }
            throw error;
        }
    }
    /**
     * Log in an existing user via a third-party provider.
     * This method supports the PKCE flow.
     */
    async signInWithOAuth(credentials) {
        var _a, _b, _c, _d;
        return await this._handleProviderSignIn(credentials.provider, {
            redirectTo: (_a = credentials.options) === null || _a === void 0 ? void 0 : _a.redirectTo,
            scopes: (_b = credentials.options) === null || _b === void 0 ? void 0 : _b.scopes,
            queryParams: (_c = credentials.options) === null || _c === void 0 ? void 0 : _c.queryParams,
            skipBrowserRedirect: (_d = credentials.options) === null || _d === void 0 ? void 0 : _d.skipBrowserRedirect,
        });
    }
    /**
     * Log in an existing user by exchanging an Auth Code issued during the PKCE flow.
     */
    async exchangeCodeForSession(authCode) {
        await this.initializePromise;
        return this._acquireLock(-1, async () => {
            return this._exchangeCodeForSession(authCode);
        });
    }
    async _exchangeCodeForSession(authCode) {
        const storageItem = await (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.getItemAsync)(this.storage, `${this.storageKey}-code-verifier`);
        const [codeVerifier, redirectType] = (storageItem !== null && storageItem !== void 0 ? storageItem : '').split('/');
        try {
            const { data, error } = await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_3__._request)(this.fetch, 'POST', `${this.url}/token?grant_type=pkce`, {
                headers: this.headers,
                body: {
                    auth_code: authCode,
                    code_verifier: codeVerifier,
                },
                xform: _lib_fetch__WEBPACK_IMPORTED_MODULE_3__._sessionResponse,
            });
            await (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.removeItemAsync)(this.storage, `${this.storageKey}-code-verifier`);
            if (error) {
                throw error;
            }
            if (!data || !data.session || !data.user) {
                return {
                    data: { user: null, session: null, redirectType: null },
                    error: new _lib_errors__WEBPACK_IMPORTED_MODULE_2__.AuthInvalidTokenResponseError(),
                };
            }
            if (data.session) {
                await this._saveSession(data.session);
                await this._notifyAllSubscribers('SIGNED_IN', data.session);
            }
            return { data: Object.assign(Object.assign({}, data), { redirectType: redirectType !== null && redirectType !== void 0 ? redirectType : null }), error };
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return { data: { user: null, session: null, redirectType: null }, error };
            }
            throw error;
        }
    }
    /**
     * Allows signing in with an OIDC ID token. The authentication provider used
     * should be enabled and configured.
     */
    async signInWithIdToken(credentials) {
        try {
            const { options, provider, token, access_token, nonce } = credentials;
            const res = await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_3__._request)(this.fetch, 'POST', `${this.url}/token?grant_type=id_token`, {
                headers: this.headers,
                body: {
                    provider,
                    id_token: token,
                    access_token,
                    nonce,
                    gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
                },
                xform: _lib_fetch__WEBPACK_IMPORTED_MODULE_3__._sessionResponse,
            });
            const { data, error } = res;
            if (error) {
                return { data: { user: null, session: null }, error };
            }
            else if (!data || !data.session || !data.user) {
                return {
                    data: { user: null, session: null },
                    error: new _lib_errors__WEBPACK_IMPORTED_MODULE_2__.AuthInvalidTokenResponseError(),
                };
            }
            if (data.session) {
                await this._saveSession(data.session);
                await this._notifyAllSubscribers('SIGNED_IN', data.session);
            }
            return { data, error };
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return { data: { user: null, session: null }, error };
            }
            throw error;
        }
    }
    /**
     * Log in a user using magiclink or a one-time password (OTP).
     *
     * If the `{{ .ConfirmationURL }}` variable is specified in the email template, a magiclink will be sent.
     * If the `{{ .Token }}` variable is specified in the email template, an OTP will be sent.
     * If you're using phone sign-ins, only an OTP will be sent. You won't be able to send a magiclink for phone sign-ins.
     *
     * Be aware that you may get back an error message that will not distinguish
     * between the cases where the account does not exist or, that the account
     * can only be accessed via social login.
     *
     * Do note that you will need to configure a Whatsapp sender on Twilio
     * if you are using phone sign in with the 'whatsapp' channel. The whatsapp
     * channel is not supported on other providers
     * at this time.
     * This method supports PKCE when an email is passed.
     */
    async signInWithOtp(credentials) {
        var _a, _b, _c, _d, _e;
        try {
            if ('email' in credentials) {
                const { email, options } = credentials;
                let codeChallenge = null;
                let codeChallengeMethod = null;
                if (this.flowType === 'pkce') {
                    ;
                    [codeChallenge, codeChallengeMethod] = await (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.getCodeChallengeAndMethod)(this.storage, this.storageKey);
                }
                const { error } = await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_3__._request)(this.fetch, 'POST', `${this.url}/otp`, {
                    headers: this.headers,
                    body: {
                        email,
                        data: (_a = options === null || options === void 0 ? void 0 : options.data) !== null && _a !== void 0 ? _a : {},
                        create_user: (_b = options === null || options === void 0 ? void 0 : options.shouldCreateUser) !== null && _b !== void 0 ? _b : true,
                        gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
                        code_challenge: codeChallenge,
                        code_challenge_method: codeChallengeMethod,
                    },
                    redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo,
                });
                return { data: { user: null, session: null }, error };
            }
            if ('phone' in credentials) {
                const { phone, options } = credentials;
                const { data, error } = await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_3__._request)(this.fetch, 'POST', `${this.url}/otp`, {
                    headers: this.headers,
                    body: {
                        phone,
                        data: (_c = options === null || options === void 0 ? void 0 : options.data) !== null && _c !== void 0 ? _c : {},
                        create_user: (_d = options === null || options === void 0 ? void 0 : options.shouldCreateUser) !== null && _d !== void 0 ? _d : true,
                        gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
                        channel: (_e = options === null || options === void 0 ? void 0 : options.channel) !== null && _e !== void 0 ? _e : 'sms',
                    },
                });
                return { data: { user: null, session: null, messageId: data === null || data === void 0 ? void 0 : data.message_id }, error };
            }
            throw new _lib_errors__WEBPACK_IMPORTED_MODULE_2__.AuthInvalidCredentialsError('You must provide either an email or phone number.');
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return { data: { user: null, session: null }, error };
            }
            throw error;
        }
    }
    /**
     * Log in a user given a User supplied OTP or TokenHash received through mobile or email.
     */
    async verifyOtp(params) {
        var _a, _b;
        try {
            let redirectTo = undefined;
            let captchaToken = undefined;
            if ('options' in params) {
                redirectTo = (_a = params.options) === null || _a === void 0 ? void 0 : _a.redirectTo;
                captchaToken = (_b = params.options) === null || _b === void 0 ? void 0 : _b.captchaToken;
            }
            const { data, error } = await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_3__._request)(this.fetch, 'POST', `${this.url}/verify`, {
                headers: this.headers,
                body: Object.assign(Object.assign({}, params), { gotrue_meta_security: { captcha_token: captchaToken } }),
                redirectTo,
                xform: _lib_fetch__WEBPACK_IMPORTED_MODULE_3__._sessionResponse,
            });
            if (error) {
                throw error;
            }
            if (!data) {
                throw new Error('An error occurred on token verification.');
            }
            const session = data.session;
            const user = data.user;
            if (session === null || session === void 0 ? void 0 : session.access_token) {
                await this._saveSession(session);
                await this._notifyAllSubscribers(params.type == 'recovery' ? 'PASSWORD_RECOVERY' : 'SIGNED_IN', session);
            }
            return { data: { user, session }, error: null };
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return { data: { user: null, session: null }, error };
            }
            throw error;
        }
    }
    /**
     * Attempts a single-sign on using an enterprise Identity Provider. A
     * successful SSO attempt will redirect the current page to the identity
     * provider authorization page. The redirect URL is implementation and SSO
     * protocol specific.
     *
     * You can use it by providing a SSO domain. Typically you can extract this
     * domain by asking users for their email address. If this domain is
     * registered on the Auth instance the redirect will use that organization's
     * currently active SSO Identity Provider for the login.
     *
     * If you have built an organization-specific login page, you can use the
     * organization's SSO Identity Provider UUID directly instead.
     */
    async signInWithSSO(params) {
        var _a, _b, _c;
        try {
            let codeChallenge = null;
            let codeChallengeMethod = null;
            if (this.flowType === 'pkce') {
                ;
                [codeChallenge, codeChallengeMethod] = await (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.getCodeChallengeAndMethod)(this.storage, this.storageKey);
            }
            return await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_3__._request)(this.fetch, 'POST', `${this.url}/sso`, {
                body: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, ('providerId' in params ? { provider_id: params.providerId } : null)), ('domain' in params ? { domain: params.domain } : null)), { redirect_to: (_b = (_a = params.options) === null || _a === void 0 ? void 0 : _a.redirectTo) !== null && _b !== void 0 ? _b : undefined }), (((_c = params === null || params === void 0 ? void 0 : params.options) === null || _c === void 0 ? void 0 : _c.captchaToken)
                    ? { gotrue_meta_security: { captcha_token: params.options.captchaToken } }
                    : null)), { skip_http_redirect: true, code_challenge: codeChallenge, code_challenge_method: codeChallengeMethod }),
                headers: this.headers,
                xform: _lib_fetch__WEBPACK_IMPORTED_MODULE_3__._ssoResponse,
            });
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return { data: null, error };
            }
            throw error;
        }
    }
    /**
     * Sends a reauthentication OTP to the user's email or phone number.
     * Requires the user to be signed-in.
     */
    async reauthenticate() {
        await this.initializePromise;
        return await this._acquireLock(-1, async () => {
            return await this._reauthenticate();
        });
    }
    async _reauthenticate() {
        try {
            return await this._useSession(async (result) => {
                const { data: { session }, error: sessionError, } = result;
                if (sessionError)
                    throw sessionError;
                if (!session)
                    throw new _lib_errors__WEBPACK_IMPORTED_MODULE_2__.AuthSessionMissingError();
                const { error } = await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_3__._request)(this.fetch, 'GET', `${this.url}/reauthenticate`, {
                    headers: this.headers,
                    jwt: session.access_token,
                });
                return { data: { user: null, session: null }, error };
            });
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return { data: { user: null, session: null }, error };
            }
            throw error;
        }
    }
    /**
     * Resends an existing signup confirmation email, email change email, SMS OTP or phone change OTP.
     */
    async resend(credentials) {
        try {
            const endpoint = `${this.url}/resend`;
            if ('email' in credentials) {
                const { email, type, options } = credentials;
                const { error } = await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_3__._request)(this.fetch, 'POST', endpoint, {
                    headers: this.headers,
                    body: {
                        email,
                        type,
                        gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
                    },
                    redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo,
                });
                return { data: { user: null, session: null }, error };
            }
            else if ('phone' in credentials) {
                const { phone, type, options } = credentials;
                const { data, error } = await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_3__._request)(this.fetch, 'POST', endpoint, {
                    headers: this.headers,
                    body: {
                        phone,
                        type,
                        gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
                    },
                });
                return { data: { user: null, session: null, messageId: data === null || data === void 0 ? void 0 : data.message_id }, error };
            }
            throw new _lib_errors__WEBPACK_IMPORTED_MODULE_2__.AuthInvalidCredentialsError('You must provide either an email or phone number and a type');
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return { data: { user: null, session: null }, error };
            }
            throw error;
        }
    }
    /**
     * Returns the session, refreshing it if necessary.
     *
     * The session returned can be null if the session is not detected which can happen in the event a user is not signed-in or has logged out.
     *
     * **IMPORTANT:** This method loads values directly from the storage attached
     * to the client. If that storage is based on request cookies for example,
     * the values in it may not be authentic and therefore it's strongly advised
     * against using this method and its results in such circumstances. A warning
     * will be emitted if this is detected. Use {@link #getUser()} instead.
     */
    async getSession() {
        await this.initializePromise;
        const result = await this._acquireLock(-1, async () => {
            return this._useSession(async (result) => {
                return result;
            });
        });
        return result;
    }
    /**
     * Acquires a global lock based on the storage key.
     */
    async _acquireLock(acquireTimeout, fn) {
        this._debug('#_acquireLock', 'begin', acquireTimeout);
        try {
            if (this.lockAcquired) {
                const last = this.pendingInLock.length
                    ? this.pendingInLock[this.pendingInLock.length - 1]
                    : Promise.resolve();
                const result = (async () => {
                    await last;
                    return await fn();
                })();
                this.pendingInLock.push((async () => {
                    try {
                        await result;
                    }
                    catch (e) {
                        // we just care if it finished
                    }
                })());
                return result;
            }
            return await this.lock(`lock:${this.storageKey}`, acquireTimeout, async () => {
                this._debug('#_acquireLock', 'lock acquired for storage key', this.storageKey);
                try {
                    this.lockAcquired = true;
                    const result = fn();
                    this.pendingInLock.push((async () => {
                        try {
                            await result;
                        }
                        catch (e) {
                            // we just care if it finished
                        }
                    })());
                    await result;
                    // keep draining the queue until there's nothing to wait on
                    while (this.pendingInLock.length) {
                        const waitOn = [...this.pendingInLock];
                        await Promise.all(waitOn);
                        this.pendingInLock.splice(0, waitOn.length);
                    }
                    return await result;
                }
                finally {
                    this._debug('#_acquireLock', 'lock released for storage key', this.storageKey);
                    this.lockAcquired = false;
                }
            });
        }
        finally {
            this._debug('#_acquireLock', 'end');
        }
    }
    /**
     * Use instead of {@link #getSession} inside the library. It is
     * semantically usually what you want, as getting a session involves some
     * processing afterwards that requires only one client operating on the
     * session at once across multiple tabs or processes.
     */
    async _useSession(fn) {
        this._debug('#_useSession', 'begin');
        try {
            // the use of __loadSession here is the only correct use of the function!
            const result = await this.__loadSession();
            return await fn(result);
        }
        finally {
            this._debug('#_useSession', 'end');
        }
    }
    /**
     * NEVER USE DIRECTLY!
     *
     * Always use {@link #_useSession}.
     */
    async __loadSession() {
        this._debug('#__loadSession()', 'begin');
        if (!this.lockAcquired) {
            this._debug('#__loadSession()', 'used outside of an acquired lock!', new Error().stack);
        }
        try {
            let currentSession = null;
            const maybeSession = await (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.getItemAsync)(this.storage, this.storageKey);
            this._debug('#getSession()', 'session from storage', maybeSession);
            if (maybeSession !== null) {
                if (this._isValidSession(maybeSession)) {
                    currentSession = maybeSession;
                }
                else {
                    this._debug('#getSession()', 'session from storage is not valid');
                    await this._removeSession();
                }
            }
            if (!currentSession) {
                return { data: { session: null }, error: null };
            }
            // A session is considered expired before the access token _actually_
            // expires. When the autoRefreshToken option is off (or when the tab is
            // in the background), very eager users of getSession() -- like
            // realtime-js -- might send a valid JWT which will expire by the time it
            // reaches the server.
            const hasExpired = currentSession.expires_at
                ? currentSession.expires_at * 1000 - Date.now() < _lib_constants__WEBPACK_IMPORTED_MODULE_1__.EXPIRY_MARGIN_MS
                : false;
            this._debug('#__loadSession()', `session has${hasExpired ? '' : ' not'} expired`, 'expires_at', currentSession.expires_at);
            if (!hasExpired) {
                if (this.storage.isServer) {
                    let suppressWarning = this.suppressGetSessionWarning;
                    const proxySession = new Proxy(currentSession, {
                        get: (target, prop, receiver) => {
                            if (!suppressWarning && prop === 'user') {
                                // only show warning when the user object is being accessed from the server
                                console.warn('Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.');
                                suppressWarning = true; // keeps this proxy instance from logging additional warnings
                                this.suppressGetSessionWarning = true; // keeps this client's future proxy instances from warning
                            }
                            return Reflect.get(target, prop, receiver);
                        },
                    });
                    currentSession = proxySession;
                }
                return { data: { session: currentSession }, error: null };
            }
            const { session, error } = await this._callRefreshToken(currentSession.refresh_token);
            if (error) {
                return { data: { session: null }, error };
            }
            return { data: { session }, error: null };
        }
        finally {
            this._debug('#__loadSession()', 'end');
        }
    }
    /**
     * Gets the current user details if there is an existing session. This method
     * performs a network request to the Supabase Auth server, so the returned
     * value is authentic and can be used to base authorization rules on.
     *
     * @param jwt Takes in an optional access token JWT. If no JWT is provided, the JWT from the current session is used.
     */
    async getUser(jwt) {
        if (jwt) {
            return await this._getUser(jwt);
        }
        await this.initializePromise;
        const result = await this._acquireLock(-1, async () => {
            return await this._getUser();
        });
        return result;
    }
    async _getUser(jwt) {
        try {
            if (jwt) {
                return await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_3__._request)(this.fetch, 'GET', `${this.url}/user`, {
                    headers: this.headers,
                    jwt: jwt,
                    xform: _lib_fetch__WEBPACK_IMPORTED_MODULE_3__._userResponse,
                });
            }
            return await this._useSession(async (result) => {
                var _a, _b, _c;
                const { data, error } = result;
                if (error) {
                    throw error;
                }
                // returns an error if there is no access_token or custom authorization header
                if (!((_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) && !this.hasCustomAuthorizationHeader) {
                    return { data: { user: null }, error: new _lib_errors__WEBPACK_IMPORTED_MODULE_2__.AuthSessionMissingError() };
                }
                return await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_3__._request)(this.fetch, 'GET', `${this.url}/user`, {
                    headers: this.headers,
                    jwt: (_c = (_b = data.session) === null || _b === void 0 ? void 0 : _b.access_token) !== null && _c !== void 0 ? _c : undefined,
                    xform: _lib_fetch__WEBPACK_IMPORTED_MODULE_3__._userResponse,
                });
            });
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthSessionMissingError)(error)) {
                    // JWT contains a `session_id` which does not correspond to an active
                    // session in the database, indicating the user is signed out.
                    await this._removeSession();
                    await (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.removeItemAsync)(this.storage, `${this.storageKey}-code-verifier`);
                }
                return { data: { user: null }, error };
            }
            throw error;
        }
    }
    /**
     * Updates user data for a logged in user.
     */
    async updateUser(attributes, options = {}) {
        await this.initializePromise;
        return await this._acquireLock(-1, async () => {
            return await this._updateUser(attributes, options);
        });
    }
    async _updateUser(attributes, options = {}) {
        try {
            return await this._useSession(async (result) => {
                const { data: sessionData, error: sessionError } = result;
                if (sessionError) {
                    throw sessionError;
                }
                if (!sessionData.session) {
                    throw new _lib_errors__WEBPACK_IMPORTED_MODULE_2__.AuthSessionMissingError();
                }
                const session = sessionData.session;
                let codeChallenge = null;
                let codeChallengeMethod = null;
                if (this.flowType === 'pkce' && attributes.email != null) {
                    ;
                    [codeChallenge, codeChallengeMethod] = await (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.getCodeChallengeAndMethod)(this.storage, this.storageKey);
                }
                const { data, error: userError } = await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_3__._request)(this.fetch, 'PUT', `${this.url}/user`, {
                    headers: this.headers,
                    redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo,
                    body: Object.assign(Object.assign({}, attributes), { code_challenge: codeChallenge, code_challenge_method: codeChallengeMethod }),
                    jwt: session.access_token,
                    xform: _lib_fetch__WEBPACK_IMPORTED_MODULE_3__._userResponse,
                });
                if (userError)
                    throw userError;
                session.user = data.user;
                await this._saveSession(session);
                await this._notifyAllSubscribers('USER_UPDATED', session);
                return { data: { user: session.user }, error: null };
            });
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return { data: { user: null }, error };
            }
            throw error;
        }
    }
    /**
     * Decodes a JWT (without performing any validation).
     */
    _decodeJWT(jwt) {
        return (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.decodeJWTPayload)(jwt);
    }
    /**
     * Sets the session data from the current session. If the current session is expired, setSession will take care of refreshing it to obtain a new session.
     * If the refresh token or access token in the current session is invalid, an error will be thrown.
     * @param currentSession The current session that minimally contains an access token and refresh token.
     */
    async setSession(currentSession) {
        await this.initializePromise;
        return await this._acquireLock(-1, async () => {
            return await this._setSession(currentSession);
        });
    }
    async _setSession(currentSession) {
        try {
            if (!currentSession.access_token || !currentSession.refresh_token) {
                throw new _lib_errors__WEBPACK_IMPORTED_MODULE_2__.AuthSessionMissingError();
            }
            const timeNow = Date.now() / 1000;
            let expiresAt = timeNow;
            let hasExpired = true;
            let session = null;
            const payload = (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.decodeJWTPayload)(currentSession.access_token);
            if (payload.exp) {
                expiresAt = payload.exp;
                hasExpired = expiresAt <= timeNow;
            }
            if (hasExpired) {
                const { session: refreshedSession, error } = await this._callRefreshToken(currentSession.refresh_token);
                if (error) {
                    return { data: { user: null, session: null }, error: error };
                }
                if (!refreshedSession) {
                    return { data: { user: null, session: null }, error: null };
                }
                session = refreshedSession;
            }
            else {
                const { data, error } = await this._getUser(currentSession.access_token);
                if (error) {
                    throw error;
                }
                session = {
                    access_token: currentSession.access_token,
                    refresh_token: currentSession.refresh_token,
                    user: data.user,
                    token_type: 'bearer',
                    expires_in: expiresAt - timeNow,
                    expires_at: expiresAt,
                };
                await this._saveSession(session);
                await this._notifyAllSubscribers('SIGNED_IN', session);
            }
            return { data: { user: session.user, session }, error: null };
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return { data: { session: null, user: null }, error };
            }
            throw error;
        }
    }
    /**
     * Returns a new session, regardless of expiry status.
     * Takes in an optional current session. If not passed in, then refreshSession() will attempt to retrieve it from getSession().
     * If the current session's refresh token is invalid, an error will be thrown.
     * @param currentSession The current session. If passed in, it must contain a refresh token.
     */
    async refreshSession(currentSession) {
        await this.initializePromise;
        return await this._acquireLock(-1, async () => {
            return await this._refreshSession(currentSession);
        });
    }
    async _refreshSession(currentSession) {
        try {
            return await this._useSession(async (result) => {
                var _a;
                if (!currentSession) {
                    const { data, error } = result;
                    if (error) {
                        throw error;
                    }
                    currentSession = (_a = data.session) !== null && _a !== void 0 ? _a : undefined;
                }
                if (!(currentSession === null || currentSession === void 0 ? void 0 : currentSession.refresh_token)) {
                    throw new _lib_errors__WEBPACK_IMPORTED_MODULE_2__.AuthSessionMissingError();
                }
                const { session, error } = await this._callRefreshToken(currentSession.refresh_token);
                if (error) {
                    return { data: { user: null, session: null }, error: error };
                }
                if (!session) {
                    return { data: { user: null, session: null }, error: null };
                }
                return { data: { user: session.user, session }, error: null };
            });
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return { data: { user: null, session: null }, error };
            }
            throw error;
        }
    }
    /**
     * Gets the session data from a URL string
     */
    async _getSessionFromURL(params, callbackUrlType) {
        try {
            if (!(0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.isBrowser)())
                throw new _lib_errors__WEBPACK_IMPORTED_MODULE_2__.AuthImplicitGrantRedirectError('No browser detected.');
            // If there's an error in the URL, it doesn't matter what flow it is, we just return the error.
            if (params.error || params.error_description || params.error_code) {
                // The error class returned implies that the redirect is from an implicit grant flow
                // but it could also be from a redirect error from a PKCE flow.
                throw new _lib_errors__WEBPACK_IMPORTED_MODULE_2__.AuthImplicitGrantRedirectError(params.error_description || 'Error in URL with unspecified error_description', {
                    error: params.error || 'unspecified_error',
                    code: params.error_code || 'unspecified_code',
                });
            }
            // Checks for mismatches between the flowType initialised in the client and the URL parameters
            switch (callbackUrlType) {
                case 'implicit':
                    if (this.flowType === 'pkce') {
                        throw new _lib_errors__WEBPACK_IMPORTED_MODULE_2__.AuthPKCEGrantCodeExchangeError('Not a valid PKCE flow url.');
                    }
                    break;
                case 'pkce':
                    if (this.flowType === 'implicit') {
                        throw new _lib_errors__WEBPACK_IMPORTED_MODULE_2__.AuthImplicitGrantRedirectError('Not a valid implicit grant flow url.');
                    }
                    break;
                default:
                // there's no mismatch so we continue
            }
            // Since this is a redirect for PKCE, we attempt to retrieve the code from the URL for the code exchange
            if (callbackUrlType === 'pkce') {
                this._debug('#_initialize()', 'begin', 'is PKCE flow', true);
                if (!params.code)
                    throw new _lib_errors__WEBPACK_IMPORTED_MODULE_2__.AuthPKCEGrantCodeExchangeError('No code detected.');
                const { data, error } = await this._exchangeCodeForSession(params.code);
                if (error)
                    throw error;
                const url = new URL(window.location.href);
                url.searchParams.delete('code');
                window.history.replaceState(window.history.state, '', url.toString());
                return { data: { session: data.session, redirectType: null }, error: null };
            }
            const { provider_token, provider_refresh_token, access_token, refresh_token, expires_in, expires_at, token_type, } = params;
            if (!access_token || !expires_in || !refresh_token || !token_type) {
                throw new _lib_errors__WEBPACK_IMPORTED_MODULE_2__.AuthImplicitGrantRedirectError('No session defined in URL');
            }
            const timeNow = Math.round(Date.now() / 1000);
            const expiresIn = parseInt(expires_in);
            let expiresAt = timeNow + expiresIn;
            if (expires_at) {
                expiresAt = parseInt(expires_at);
            }
            const actuallyExpiresIn = expiresAt - timeNow;
            if (actuallyExpiresIn * 1000 <= _lib_constants__WEBPACK_IMPORTED_MODULE_1__.AUTO_REFRESH_TICK_DURATION_MS) {
                console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${actuallyExpiresIn}s, should have been closer to ${expiresIn}s`);
            }
            const issuedAt = expiresAt - expiresIn;
            if (timeNow - issuedAt >= 120) {
                console.warn('@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale', issuedAt, expiresAt, timeNow);
            }
            else if (timeNow - issuedAt < 0) {
                console.warn('@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clock for skew', issuedAt, expiresAt, timeNow);
            }
            const { data, error } = await this._getUser(access_token);
            if (error)
                throw error;
            const session = {
                provider_token,
                provider_refresh_token,
                access_token,
                expires_in: expiresIn,
                expires_at: expiresAt,
                refresh_token,
                token_type,
                user: data.user,
            };
            // Remove tokens from URL
            window.location.hash = '';
            this._debug('#_getSessionFromURL()', 'clearing window.location.hash');
            return { data: { session, redirectType: params.type }, error: null };
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return { data: { session: null, redirectType: null }, error };
            }
            throw error;
        }
    }
    /**
     * Checks if the current URL contains parameters given by an implicit oauth grant flow (https://www.rfc-editor.org/rfc/rfc6749.html#section-4.2)
     */
    _isImplicitGrantCallback(params) {
        return Boolean(params.access_token || params.error_description);
    }
    /**
     * Checks if the current URL and backing storage contain parameters given by a PKCE flow
     */
    async _isPKCECallback(params) {
        const currentStorageContent = await (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.getItemAsync)(this.storage, `${this.storageKey}-code-verifier`);
        return !!(params.code && currentStorageContent);
    }
    /**
     * Inside a browser context, `signOut()` will remove the logged in user from the browser session and log them out - removing all items from localstorage and then trigger a `"SIGNED_OUT"` event.
     *
     * For server-side management, you can revoke all refresh tokens for a user by passing a user's JWT through to `auth.api.signOut(JWT: string)`.
     * There is no way to revoke a user's access token jwt until it expires. It is recommended to set a shorter expiry on the jwt for this reason.
     *
     * If using `others` scope, no `SIGNED_OUT` event is fired!
     */
    async signOut(options = { scope: 'global' }) {
        await this.initializePromise;
        return await this._acquireLock(-1, async () => {
            return await this._signOut(options);
        });
    }
    async _signOut({ scope } = { scope: 'global' }) {
        return await this._useSession(async (result) => {
            var _a;
            const { data, error: sessionError } = result;
            if (sessionError) {
                return { error: sessionError };
            }
            const accessToken = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token;
            if (accessToken) {
                const { error } = await this.admin.signOut(accessToken, scope);
                if (error) {
                    // ignore 404s since user might not exist anymore
                    // ignore 401s since an invalid or expired JWT should sign out the current session
                    if (!((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthApiError)(error) &&
                        (error.status === 404 || error.status === 401 || error.status === 403))) {
                        return { error };
                    }
                }
            }
            if (scope !== 'others') {
                await this._removeSession();
                await (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.removeItemAsync)(this.storage, `${this.storageKey}-code-verifier`);
            }
            return { error: null };
        });
    }
    /**
     * Receive a notification every time an auth event happens.
     * @param callback A callback function to be invoked when an auth event happens.
     */
    onAuthStateChange(callback) {
        const id = (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.uuid)();
        const subscription = {
            id,
            callback,
            unsubscribe: () => {
                this._debug('#unsubscribe()', 'state change callback with id removed', id);
                this.stateChangeEmitters.delete(id);
            },
        };
        this._debug('#onAuthStateChange()', 'registered callback with id', id);
        this.stateChangeEmitters.set(id, subscription);
        (async () => {
            await this.initializePromise;
            await this._acquireLock(-1, async () => {
                this._emitInitialSession(id);
            });
        })();
        return { data: { subscription } };
    }
    async _emitInitialSession(id) {
        return await this._useSession(async (result) => {
            var _a, _b;
            try {
                const { data: { session }, error, } = result;
                if (error)
                    throw error;
                await ((_a = this.stateChangeEmitters.get(id)) === null || _a === void 0 ? void 0 : _a.callback('INITIAL_SESSION', session));
                this._debug('INITIAL_SESSION', 'callback id', id, 'session', session);
            }
            catch (err) {
                await ((_b = this.stateChangeEmitters.get(id)) === null || _b === void 0 ? void 0 : _b.callback('INITIAL_SESSION', null));
                this._debug('INITIAL_SESSION', 'callback id', id, 'error', err);
                console.error(err);
            }
        });
    }
    /**
     * Sends a password reset request to an email address. This method supports the PKCE flow.
     *
     * @param email The email address of the user.
     * @param options.redirectTo The URL to send the user to after they click the password reset link.
     * @param options.captchaToken Verification token received when the user completes the captcha on the site.
     */
    async resetPasswordForEmail(email, options = {}) {
        let codeChallenge = null;
        let codeChallengeMethod = null;
        if (this.flowType === 'pkce') {
            ;
            [codeChallenge, codeChallengeMethod] = await (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.getCodeChallengeAndMethod)(this.storage, this.storageKey, true // isPasswordRecovery
            );
        }
        try {
            return await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_3__._request)(this.fetch, 'POST', `${this.url}/recover`, {
                body: {
                    email,
                    code_challenge: codeChallenge,
                    code_challenge_method: codeChallengeMethod,
                    gotrue_meta_security: { captcha_token: options.captchaToken },
                },
                headers: this.headers,
                redirectTo: options.redirectTo,
            });
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return { data: null, error };
            }
            throw error;
        }
    }
    /**
     * Gets all the identities linked to a user.
     */
    async getUserIdentities() {
        var _a;
        try {
            const { data, error } = await this.getUser();
            if (error)
                throw error;
            return { data: { identities: (_a = data.user.identities) !== null && _a !== void 0 ? _a : [] }, error: null };
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return { data: null, error };
            }
            throw error;
        }
    }
    /**
     * Links an oauth identity to an existing user.
     * This method supports the PKCE flow.
     */
    async linkIdentity(credentials) {
        var _a;
        try {
            const { data, error } = await this._useSession(async (result) => {
                var _a, _b, _c, _d, _e;
                const { data, error } = result;
                if (error)
                    throw error;
                const url = await this._getUrlForProvider(`${this.url}/user/identities/authorize`, credentials.provider, {
                    redirectTo: (_a = credentials.options) === null || _a === void 0 ? void 0 : _a.redirectTo,
                    scopes: (_b = credentials.options) === null || _b === void 0 ? void 0 : _b.scopes,
                    queryParams: (_c = credentials.options) === null || _c === void 0 ? void 0 : _c.queryParams,
                    skipBrowserRedirect: true,
                });
                return await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_3__._request)(this.fetch, 'GET', url, {
                    headers: this.headers,
                    jwt: (_e = (_d = data.session) === null || _d === void 0 ? void 0 : _d.access_token) !== null && _e !== void 0 ? _e : undefined,
                });
            });
            if (error)
                throw error;
            if ((0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.isBrowser)() && !((_a = credentials.options) === null || _a === void 0 ? void 0 : _a.skipBrowserRedirect)) {
                window.location.assign(data === null || data === void 0 ? void 0 : data.url);
            }
            return { data: { provider: credentials.provider, url: data === null || data === void 0 ? void 0 : data.url }, error: null };
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return { data: { provider: credentials.provider, url: null }, error };
            }
            throw error;
        }
    }
    /**
     * Unlinks an identity from a user by deleting it. The user will no longer be able to sign in with that identity once it's unlinked.
     */
    async unlinkIdentity(identity) {
        try {
            return await this._useSession(async (result) => {
                var _a, _b;
                const { data, error } = result;
                if (error) {
                    throw error;
                }
                return await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_3__._request)(this.fetch, 'DELETE', `${this.url}/user/identities/${identity.identity_id}`, {
                    headers: this.headers,
                    jwt: (_b = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : undefined,
                });
            });
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return { data: null, error };
            }
            throw error;
        }
    }
    /**
     * Generates a new JWT.
     * @param refreshToken A valid refresh token that was returned on login.
     */
    async _refreshAccessToken(refreshToken) {
        const debugName = `#_refreshAccessToken(${refreshToken.substring(0, 5)}...)`;
        this._debug(debugName, 'begin');
        try {
            const startedAt = Date.now();
            // will attempt to refresh the token with exponential backoff
            return await (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.retryable)(async (attempt) => {
                if (attempt > 0) {
                    await (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.sleep)(200 * Math.pow(2, attempt - 1)); // 200, 400, 800, ...
                }
                this._debug(debugName, 'refreshing attempt', attempt);
                return await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_3__._request)(this.fetch, 'POST', `${this.url}/token?grant_type=refresh_token`, {
                    body: { refresh_token: refreshToken },
                    headers: this.headers,
                    xform: _lib_fetch__WEBPACK_IMPORTED_MODULE_3__._sessionResponse,
                });
            }, (attempt, error) => {
                const nextBackOffInterval = 200 * Math.pow(2, attempt);
                return (error &&
                    (0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthRetryableFetchError)(error) &&
                    // retryable only if the request can be sent before the backoff overflows the tick duration
                    Date.now() + nextBackOffInterval - startedAt < _lib_constants__WEBPACK_IMPORTED_MODULE_1__.AUTO_REFRESH_TICK_DURATION_MS);
            });
        }
        catch (error) {
            this._debug(debugName, 'error', error);
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return { data: { session: null, user: null }, error };
            }
            throw error;
        }
        finally {
            this._debug(debugName, 'end');
        }
    }
    _isValidSession(maybeSession) {
        const isValidSession = typeof maybeSession === 'object' &&
            maybeSession !== null &&
            'access_token' in maybeSession &&
            'refresh_token' in maybeSession &&
            'expires_at' in maybeSession;
        return isValidSession;
    }
    async _handleProviderSignIn(provider, options) {
        const url = await this._getUrlForProvider(`${this.url}/authorize`, provider, {
            redirectTo: options.redirectTo,
            scopes: options.scopes,
            queryParams: options.queryParams,
        });
        this._debug('#_handleProviderSignIn()', 'provider', provider, 'options', options, 'url', url);
        // try to open on the browser
        if ((0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.isBrowser)() && !options.skipBrowserRedirect) {
            window.location.assign(url);
        }
        return { data: { provider, url }, error: null };
    }
    /**
     * Recovers the session from LocalStorage and refreshes the token
     * Note: this method is async to accommodate for AsyncStorage e.g. in React native.
     */
    async _recoverAndRefresh() {
        var _a;
        const debugName = '#_recoverAndRefresh()';
        this._debug(debugName, 'begin');
        try {
            const currentSession = await (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.getItemAsync)(this.storage, this.storageKey);
            this._debug(debugName, 'session from storage', currentSession);
            if (!this._isValidSession(currentSession)) {
                this._debug(debugName, 'session is not valid');
                if (currentSession !== null) {
                    await this._removeSession();
                }
                return;
            }
            const expiresWithMargin = ((_a = currentSession.expires_at) !== null && _a !== void 0 ? _a : Infinity) * 1000 - Date.now() < _lib_constants__WEBPACK_IMPORTED_MODULE_1__.EXPIRY_MARGIN_MS;
            this._debug(debugName, `session has${expiresWithMargin ? '' : ' not'} expired with margin of ${_lib_constants__WEBPACK_IMPORTED_MODULE_1__.EXPIRY_MARGIN_MS}s`);
            if (expiresWithMargin) {
                if (this.autoRefreshToken && currentSession.refresh_token) {
                    const { error } = await this._callRefreshToken(currentSession.refresh_token);
                    if (error) {
                        console.error(error);
                        if (!(0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthRetryableFetchError)(error)) {
                            this._debug(debugName, 'refresh failed with a non-retryable error, removing the session', error);
                            await this._removeSession();
                        }
                    }
                }
            }
            else {
                // no need to persist currentSession again, as we just loaded it from
                // local storage; persisting it again may overwrite a value saved by
                // another client with access to the same local storage
                await this._notifyAllSubscribers('SIGNED_IN', currentSession);
            }
        }
        catch (err) {
            this._debug(debugName, 'error', err);
            console.error(err);
            return;
        }
        finally {
            this._debug(debugName, 'end');
        }
    }
    async _callRefreshToken(refreshToken) {
        var _a, _b;
        if (!refreshToken) {
            throw new _lib_errors__WEBPACK_IMPORTED_MODULE_2__.AuthSessionMissingError();
        }
        // refreshing is already in progress
        if (this.refreshingDeferred) {
            return this.refreshingDeferred.promise;
        }
        const debugName = `#_callRefreshToken(${refreshToken.substring(0, 5)}...)`;
        this._debug(debugName, 'begin');
        try {
            this.refreshingDeferred = new _lib_helpers__WEBPACK_IMPORTED_MODULE_4__.Deferred();
            const { data, error } = await this._refreshAccessToken(refreshToken);
            if (error)
                throw error;
            if (!data.session)
                throw new _lib_errors__WEBPACK_IMPORTED_MODULE_2__.AuthSessionMissingError();
            await this._saveSession(data.session);
            await this._notifyAllSubscribers('TOKEN_REFRESHED', data.session);
            const result = { session: data.session, error: null };
            this.refreshingDeferred.resolve(result);
            return result;
        }
        catch (error) {
            this._debug(debugName, 'error', error);
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                const result = { session: null, error };
                if (!(0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthRetryableFetchError)(error)) {
                    await this._removeSession();
                }
                (_a = this.refreshingDeferred) === null || _a === void 0 ? void 0 : _a.resolve(result);
                return result;
            }
            (_b = this.refreshingDeferred) === null || _b === void 0 ? void 0 : _b.reject(error);
            throw error;
        }
        finally {
            this.refreshingDeferred = null;
            this._debug(debugName, 'end');
        }
    }
    async _notifyAllSubscribers(event, session, broadcast = true) {
        const debugName = `#_notifyAllSubscribers(${event})`;
        this._debug(debugName, 'begin', session, `broadcast = ${broadcast}`);
        try {
            if (this.broadcastChannel && broadcast) {
                this.broadcastChannel.postMessage({ event, session });
            }
            const errors = [];
            const promises = Array.from(this.stateChangeEmitters.values()).map(async (x) => {
                try {
                    await x.callback(event, session);
                }
                catch (e) {
                    errors.push(e);
                }
            });
            await Promise.all(promises);
            if (errors.length > 0) {
                for (let i = 0; i < errors.length; i += 1) {
                    console.error(errors[i]);
                }
                throw errors[0];
            }
        }
        finally {
            this._debug(debugName, 'end');
        }
    }
    /**
     * set currentSession and currentUser
     * process to _startAutoRefreshToken if possible
     */
    async _saveSession(session) {
        this._debug('#_saveSession()', session);
        // _saveSession is always called whenever a new session has been acquired
        // so we can safely suppress the warning returned by future getSession calls
        this.suppressGetSessionWarning = true;
        await (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.setItemAsync)(this.storage, this.storageKey, session);
    }
    async _removeSession() {
        this._debug('#_removeSession()');
        await (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.removeItemAsync)(this.storage, this.storageKey);
        await this._notifyAllSubscribers('SIGNED_OUT', null);
    }
    /**
     * Removes any registered visibilitychange callback.
     *
     * {@see #startAutoRefresh}
     * {@see #stopAutoRefresh}
     */
    _removeVisibilityChangedCallback() {
        this._debug('#_removeVisibilityChangedCallback()');
        const callback = this.visibilityChangedCallback;
        this.visibilityChangedCallback = null;
        try {
            if (callback && (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.isBrowser)() && (window === null || window === void 0 ? void 0 : window.removeEventListener)) {
                window.removeEventListener('visibilitychange', callback);
            }
        }
        catch (e) {
            console.error('removing visibilitychange callback failed', e);
        }
    }
    /**
     * This is the private implementation of {@link #startAutoRefresh}. Use this
     * within the library.
     */
    async _startAutoRefresh() {
        await this._stopAutoRefresh();
        this._debug('#_startAutoRefresh()');
        const ticker = setInterval(() => this._autoRefreshTokenTick(), _lib_constants__WEBPACK_IMPORTED_MODULE_1__.AUTO_REFRESH_TICK_DURATION_MS);
        this.autoRefreshTicker = ticker;
        if (ticker && typeof ticker === 'object' && typeof ticker.unref === 'function') {
            // ticker is a NodeJS Timeout object that has an `unref` method
            // https://nodejs.org/api/timers.html#timeoutunref
            // When auto refresh is used in NodeJS (like for testing) the
            // `setInterval` is preventing the process from being marked as
            // finished and tests run endlessly. This can be prevented by calling
            // `unref()` on the returned object.
            ticker.unref();
            // @ts-expect-error TS has no context of Deno
        }
        else if (typeof Deno !== 'undefined' && typeof Deno.unrefTimer === 'function') {
            // similar like for NodeJS, but with the Deno API
            // https://deno.land/api@latest?unstable&s=Deno.unrefTimer
            // @ts-expect-error TS has no context of Deno
            Deno.unrefTimer(ticker);
        }
        // run the tick immediately, but in the next pass of the event loop so that
        // #_initialize can be allowed to complete without recursively waiting on
        // itself
        setTimeout(async () => {
            await this.initializePromise;
            await this._autoRefreshTokenTick();
        }, 0);
    }
    /**
     * This is the private implementation of {@link #stopAutoRefresh}. Use this
     * within the library.
     */
    async _stopAutoRefresh() {
        this._debug('#_stopAutoRefresh()');
        const ticker = this.autoRefreshTicker;
        this.autoRefreshTicker = null;
        if (ticker) {
            clearInterval(ticker);
        }
    }
    /**
     * Starts an auto-refresh process in the background. The session is checked
     * every few seconds. Close to the time of expiration a process is started to
     * refresh the session. If refreshing fails it will be retried for as long as
     * necessary.
     *
     * If you set the {@link GoTrueClientOptions#autoRefreshToken} you don't need
     * to call this function, it will be called for you.
     *
     * On browsers the refresh process works only when the tab/window is in the
     * foreground to conserve resources as well as prevent race conditions and
     * flooding auth with requests. If you call this method any managed
     * visibility change callback will be removed and you must manage visibility
     * changes on your own.
     *
     * On non-browser platforms the refresh process works *continuously* in the
     * background, which may not be desirable. You should hook into your
     * platform's foreground indication mechanism and call these methods
     * appropriately to conserve resources.
     *
     * {@see #stopAutoRefresh}
     */
    async startAutoRefresh() {
        this._removeVisibilityChangedCallback();
        await this._startAutoRefresh();
    }
    /**
     * Stops an active auto refresh process running in the background (if any).
     *
     * If you call this method any managed visibility change callback will be
     * removed and you must manage visibility changes on your own.
     *
     * See {@link #startAutoRefresh} for more details.
     */
    async stopAutoRefresh() {
        this._removeVisibilityChangedCallback();
        await this._stopAutoRefresh();
    }
    /**
     * Runs the auto refresh token tick.
     */
    async _autoRefreshTokenTick() {
        this._debug('#_autoRefreshTokenTick()', 'begin');
        try {
            await this._acquireLock(0, async () => {
                try {
                    const now = Date.now();
                    try {
                        return await this._useSession(async (result) => {
                            const { data: { session }, } = result;
                            if (!session || !session.refresh_token || !session.expires_at) {
                                this._debug('#_autoRefreshTokenTick()', 'no session');
                                return;
                            }
                            // session will expire in this many ticks (or has already expired if <= 0)
                            const expiresInTicks = Math.floor((session.expires_at * 1000 - now) / _lib_constants__WEBPACK_IMPORTED_MODULE_1__.AUTO_REFRESH_TICK_DURATION_MS);
                            this._debug('#_autoRefreshTokenTick()', `access token expires in ${expiresInTicks} ticks, a tick lasts ${_lib_constants__WEBPACK_IMPORTED_MODULE_1__.AUTO_REFRESH_TICK_DURATION_MS}ms, refresh threshold is ${_lib_constants__WEBPACK_IMPORTED_MODULE_1__.AUTO_REFRESH_TICK_THRESHOLD} ticks`);
                            if (expiresInTicks <= _lib_constants__WEBPACK_IMPORTED_MODULE_1__.AUTO_REFRESH_TICK_THRESHOLD) {
                                await this._callRefreshToken(session.refresh_token);
                            }
                        });
                    }
                    catch (e) {
                        console.error('Auto refresh tick failed with error. This is likely a transient error.', e);
                    }
                }
                finally {
                    this._debug('#_autoRefreshTokenTick()', 'end');
                }
            });
        }
        catch (e) {
            if (e.isAcquireTimeout || e instanceof _lib_locks__WEBPACK_IMPORTED_MODULE_8__.LockAcquireTimeoutError) {
                this._debug('auto refresh token tick lock not available');
            }
            else {
                throw e;
            }
        }
    }
    /**
     * Registers callbacks on the browser / platform, which in-turn run
     * algorithms when the browser window/tab are in foreground. On non-browser
     * platforms it assumes always foreground.
     */
    async _handleVisibilityChange() {
        this._debug('#_handleVisibilityChange()');
        if (!(0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.isBrowser)() || !(window === null || window === void 0 ? void 0 : window.addEventListener)) {
            if (this.autoRefreshToken) {
                // in non-browser environments the refresh token ticker runs always
                this.startAutoRefresh();
            }
            return false;
        }
        try {
            this.visibilityChangedCallback = async () => await this._onVisibilityChanged(false);
            window === null || window === void 0 ? void 0 : window.addEventListener('visibilitychange', this.visibilityChangedCallback);
            // now immediately call the visbility changed callback to setup with the
            // current visbility state
            await this._onVisibilityChanged(true); // initial call
        }
        catch (error) {
            console.error('_handleVisibilityChange', error);
        }
    }
    /**
     * Callback registered with `window.addEventListener('visibilitychange')`.
     */
    async _onVisibilityChanged(calledFromInitialize) {
        const methodName = `#_onVisibilityChanged(${calledFromInitialize})`;
        this._debug(methodName, 'visibilityState', document.visibilityState);
        if (document.visibilityState === 'visible') {
            if (this.autoRefreshToken) {
                // in browser environments the refresh token ticker runs only on focused tabs
                // which prevents race conditions
                this._startAutoRefresh();
            }
            if (!calledFromInitialize) {
                // called when the visibility has changed, i.e. the browser
                // transitioned from hidden -> visible so we need to see if the session
                // should be recovered immediately... but to do that we need to acquire
                // the lock first asynchronously
                await this.initializePromise;
                await this._acquireLock(-1, async () => {
                    if (document.visibilityState !== 'visible') {
                        this._debug(methodName, 'acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting');
                        // visibility has changed while waiting for the lock, abort
                        return;
                    }
                    // recover the session
                    await this._recoverAndRefresh();
                });
            }
        }
        else if (document.visibilityState === 'hidden') {
            if (this.autoRefreshToken) {
                this._stopAutoRefresh();
            }
        }
    }
    /**
     * Generates the relevant login URL for a third-party provider.
     * @param options.redirectTo A URL or mobile address to send the user to after they are confirmed.
     * @param options.scopes A space-separated list of scopes granted to the OAuth application.
     * @param options.queryParams An object of key-value pairs containing query parameters granted to the OAuth application.
     */
    async _getUrlForProvider(url, provider, options) {
        const urlParams = [`provider=${encodeURIComponent(provider)}`];
        if (options === null || options === void 0 ? void 0 : options.redirectTo) {
            urlParams.push(`redirect_to=${encodeURIComponent(options.redirectTo)}`);
        }
        if (options === null || options === void 0 ? void 0 : options.scopes) {
            urlParams.push(`scopes=${encodeURIComponent(options.scopes)}`);
        }
        if (this.flowType === 'pkce') {
            const [codeChallenge, codeChallengeMethod] = await (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_4__.getCodeChallengeAndMethod)(this.storage, this.storageKey);
            const flowParams = new URLSearchParams({
                code_challenge: `${encodeURIComponent(codeChallenge)}`,
                code_challenge_method: `${encodeURIComponent(codeChallengeMethod)}`,
            });
            urlParams.push(flowParams.toString());
        }
        if (options === null || options === void 0 ? void 0 : options.queryParams) {
            const query = new URLSearchParams(options.queryParams);
            urlParams.push(query.toString());
        }
        if (options === null || options === void 0 ? void 0 : options.skipBrowserRedirect) {
            urlParams.push(`skip_http_redirect=${options.skipBrowserRedirect}`);
        }
        return `${url}?${urlParams.join('&')}`;
    }
    async _unenroll(params) {
        try {
            return await this._useSession(async (result) => {
                var _a;
                const { data: sessionData, error: sessionError } = result;
                if (sessionError) {
                    return { data: null, error: sessionError };
                }
                return await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_3__._request)(this.fetch, 'DELETE', `${this.url}/factors/${params.factorId}`, {
                    headers: this.headers,
                    jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token,
                });
            });
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return { data: null, error };
            }
            throw error;
        }
    }
    async _enroll(params) {
        try {
            return await this._useSession(async (result) => {
                var _a, _b;
                const { data: sessionData, error: sessionError } = result;
                if (sessionError) {
                    return { data: null, error: sessionError };
                }
                const body = Object.assign({ friendly_name: params.friendlyName, factor_type: params.factorType }, (params.factorType === 'phone' ? { phone: params.phone } : { issuer: params.issuer }));
                const { data, error } = await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_3__._request)(this.fetch, 'POST', `${this.url}/factors`, {
                    body,
                    headers: this.headers,
                    jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token,
                });
                if (error) {
                    return { data: null, error };
                }
                if (params.factorType === 'totp' && ((_b = data === null || data === void 0 ? void 0 : data.totp) === null || _b === void 0 ? void 0 : _b.qr_code)) {
                    data.totp.qr_code = `data:image/svg+xml;utf-8,${data.totp.qr_code}`;
                }
                return { data, error: null };
            });
        }
        catch (error) {
            if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                return { data: null, error };
            }
            throw error;
        }
    }
    /**
     * {@see GoTrueMFAApi#verify}
     */
    async _verify(params) {
        return this._acquireLock(-1, async () => {
            try {
                return await this._useSession(async (result) => {
                    var _a;
                    const { data: sessionData, error: sessionError } = result;
                    if (sessionError) {
                        return { data: null, error: sessionError };
                    }
                    const { data, error } = await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_3__._request)(this.fetch, 'POST', `${this.url}/factors/${params.factorId}/verify`, {
                        body: { code: params.code, challenge_id: params.challengeId },
                        headers: this.headers,
                        jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token,
                    });
                    if (error) {
                        return { data: null, error };
                    }
                    await this._saveSession(Object.assign({ expires_at: Math.round(Date.now() / 1000) + data.expires_in }, data));
                    await this._notifyAllSubscribers('MFA_CHALLENGE_VERIFIED', data);
                    return { data, error };
                });
            }
            catch (error) {
                if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                    return { data: null, error };
                }
                throw error;
            }
        });
    }
    /**
     * {@see GoTrueMFAApi#challenge}
     */
    async _challenge(params) {
        return this._acquireLock(-1, async () => {
            try {
                return await this._useSession(async (result) => {
                    var _a;
                    const { data: sessionData, error: sessionError } = result;
                    if (sessionError) {
                        return { data: null, error: sessionError };
                    }
                    return await (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_3__._request)(this.fetch, 'POST', `${this.url}/factors/${params.factorId}/challenge`, {
                        body: { channel: params.channel },
                        headers: this.headers,
                        jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token,
                    });
                });
            }
            catch (error) {
                if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_2__.isAuthError)(error)) {
                    return { data: null, error };
                }
                throw error;
            }
        });
    }
    /**
     * {@see GoTrueMFAApi#challengeAndVerify}
     */
    async _challengeAndVerify(params) {
        // both _challenge and _verify independently acquire the lock, so no need
        // to acquire it here
        const { data: challengeData, error: challengeError } = await this._challenge({
            factorId: params.factorId,
        });
        if (challengeError) {
            return { data: null, error: challengeError };
        }
        return await this._verify({
            factorId: params.factorId,
            challengeId: challengeData.id,
            code: params.code,
        });
    }
    /**
     * {@see GoTrueMFAApi#listFactors}
     */
    async _listFactors() {
        // use #getUser instead of #_getUser as the former acquires a lock
        const { data: { user }, error: userError, } = await this.getUser();
        if (userError) {
            return { data: null, error: userError };
        }
        const factors = (user === null || user === void 0 ? void 0 : user.factors) || [];
        const totp = factors.filter((factor) => factor.factor_type === 'totp' && factor.status === 'verified');
        const phone = factors.filter((factor) => factor.factor_type === 'phone' && factor.status === 'verified');
        return {
            data: {
                all: factors,
                totp,
                phone,
            },
            error: null,
        };
    }
    /**
     * {@see GoTrueMFAApi#getAuthenticatorAssuranceLevel}
     */
    async _getAuthenticatorAssuranceLevel() {
        return this._acquireLock(-1, async () => {
            return await this._useSession(async (result) => {
                var _a, _b;
                const { data: { session }, error: sessionError, } = result;
                if (sessionError) {
                    return { data: null, error: sessionError };
                }
                if (!session) {
                    return {
                        data: { currentLevel: null, nextLevel: null, currentAuthenticationMethods: [] },
                        error: null,
                    };
                }
                const payload = this._decodeJWT(session.access_token);
                let currentLevel = null;
                if (payload.aal) {
                    currentLevel = payload.aal;
                }
                let nextLevel = currentLevel;
                const verifiedFactors = (_b = (_a = session.user.factors) === null || _a === void 0 ? void 0 : _a.filter((factor) => factor.status === 'verified')) !== null && _b !== void 0 ? _b : [];
                if (verifiedFactors.length > 0) {
                    nextLevel = 'aal2';
                }
                const currentAuthenticationMethods = payload.amr || [];
                return { data: { currentLevel, nextLevel, currentAuthenticationMethods }, error: null };
            });
        });
    }
}
GoTrueClient.nextInstanceID = 0;
//# sourceMappingURL=GoTrueClient.js.map

/***/ }),

/***/ "./node_modules/@supabase/auth-js/dist/module/index.js":
/*!*************************************************************!*\
  !*** ./node_modules/@supabase/auth-js/dist/module/index.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthAdminApi: () => (/* reexport safe */ _AuthAdminApi__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   AuthApiError: () => (/* reexport safe */ _lib_errors__WEBPACK_IMPORTED_MODULE_5__.AuthApiError),
/* harmony export */   AuthClient: () => (/* reexport safe */ _AuthClient__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   AuthError: () => (/* reexport safe */ _lib_errors__WEBPACK_IMPORTED_MODULE_5__.AuthError),
/* harmony export */   AuthImplicitGrantRedirectError: () => (/* reexport safe */ _lib_errors__WEBPACK_IMPORTED_MODULE_5__.AuthImplicitGrantRedirectError),
/* harmony export */   AuthInvalidCredentialsError: () => (/* reexport safe */ _lib_errors__WEBPACK_IMPORTED_MODULE_5__.AuthInvalidCredentialsError),
/* harmony export */   AuthInvalidTokenResponseError: () => (/* reexport safe */ _lib_errors__WEBPACK_IMPORTED_MODULE_5__.AuthInvalidTokenResponseError),
/* harmony export */   AuthPKCEGrantCodeExchangeError: () => (/* reexport safe */ _lib_errors__WEBPACK_IMPORTED_MODULE_5__.AuthPKCEGrantCodeExchangeError),
/* harmony export */   AuthRetryableFetchError: () => (/* reexport safe */ _lib_errors__WEBPACK_IMPORTED_MODULE_5__.AuthRetryableFetchError),
/* harmony export */   AuthSessionMissingError: () => (/* reexport safe */ _lib_errors__WEBPACK_IMPORTED_MODULE_5__.AuthSessionMissingError),
/* harmony export */   AuthUnknownError: () => (/* reexport safe */ _lib_errors__WEBPACK_IMPORTED_MODULE_5__.AuthUnknownError),
/* harmony export */   AuthWeakPasswordError: () => (/* reexport safe */ _lib_errors__WEBPACK_IMPORTED_MODULE_5__.AuthWeakPasswordError),
/* harmony export */   CustomAuthError: () => (/* reexport safe */ _lib_errors__WEBPACK_IMPORTED_MODULE_5__.CustomAuthError),
/* harmony export */   GoTrueAdminApi: () => (/* reexport safe */ _GoTrueAdminApi__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   GoTrueClient: () => (/* reexport safe */ _GoTrueClient__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   NavigatorLockAcquireTimeoutError: () => (/* reexport safe */ _lib_locks__WEBPACK_IMPORTED_MODULE_6__.NavigatorLockAcquireTimeoutError),
/* harmony export */   isAuthApiError: () => (/* reexport safe */ _lib_errors__WEBPACK_IMPORTED_MODULE_5__.isAuthApiError),
/* harmony export */   isAuthError: () => (/* reexport safe */ _lib_errors__WEBPACK_IMPORTED_MODULE_5__.isAuthError),
/* harmony export */   isAuthImplicitGrantRedirectError: () => (/* reexport safe */ _lib_errors__WEBPACK_IMPORTED_MODULE_5__.isAuthImplicitGrantRedirectError),
/* harmony export */   isAuthRetryableFetchError: () => (/* reexport safe */ _lib_errors__WEBPACK_IMPORTED_MODULE_5__.isAuthRetryableFetchError),
/* harmony export */   isAuthSessionMissingError: () => (/* reexport safe */ _lib_errors__WEBPACK_IMPORTED_MODULE_5__.isAuthSessionMissingError),
/* harmony export */   isAuthWeakPasswordError: () => (/* reexport safe */ _lib_errors__WEBPACK_IMPORTED_MODULE_5__.isAuthWeakPasswordError),
/* harmony export */   lockInternals: () => (/* reexport safe */ _lib_locks__WEBPACK_IMPORTED_MODULE_6__.internals),
/* harmony export */   navigatorLock: () => (/* reexport safe */ _lib_locks__WEBPACK_IMPORTED_MODULE_6__.navigatorLock)
/* harmony export */ });
/* harmony import */ var _GoTrueAdminApi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GoTrueAdminApi */ "./node_modules/@supabase/auth-js/dist/module/GoTrueAdminApi.js");
/* harmony import */ var _GoTrueClient__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./GoTrueClient */ "./node_modules/@supabase/auth-js/dist/module/GoTrueClient.js");
/* harmony import */ var _AuthAdminApi__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AuthAdminApi */ "./node_modules/@supabase/auth-js/dist/module/AuthAdminApi.js");
/* harmony import */ var _AuthClient__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AuthClient */ "./node_modules/@supabase/auth-js/dist/module/AuthClient.js");
/* harmony import */ var _lib_types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lib/types */ "./node_modules/@supabase/auth-js/dist/module/lib/types.js");
/* harmony import */ var _lib_errors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./lib/errors */ "./node_modules/@supabase/auth-js/dist/module/lib/errors.js");
/* harmony import */ var _lib_locks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./lib/locks */ "./node_modules/@supabase/auth-js/dist/module/lib/locks.js");








//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@supabase/auth-js/dist/module/lib/constants.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@supabase/auth-js/dist/module/lib/constants.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   API_VERSIONS: () => (/* binding */ API_VERSIONS),
/* harmony export */   API_VERSION_HEADER_NAME: () => (/* binding */ API_VERSION_HEADER_NAME),
/* harmony export */   AUDIENCE: () => (/* binding */ AUDIENCE),
/* harmony export */   AUTO_REFRESH_TICK_DURATION_MS: () => (/* binding */ AUTO_REFRESH_TICK_DURATION_MS),
/* harmony export */   AUTO_REFRESH_TICK_THRESHOLD: () => (/* binding */ AUTO_REFRESH_TICK_THRESHOLD),
/* harmony export */   DEFAULT_HEADERS: () => (/* binding */ DEFAULT_HEADERS),
/* harmony export */   EXPIRY_MARGIN_MS: () => (/* binding */ EXPIRY_MARGIN_MS),
/* harmony export */   GOTRUE_URL: () => (/* binding */ GOTRUE_URL),
/* harmony export */   NETWORK_FAILURE: () => (/* binding */ NETWORK_FAILURE),
/* harmony export */   STORAGE_KEY: () => (/* binding */ STORAGE_KEY)
/* harmony export */ });
/* harmony import */ var _version__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./version */ "./node_modules/@supabase/auth-js/dist/module/lib/version.js");

/** Current session will be checked for refresh at this interval. */
const AUTO_REFRESH_TICK_DURATION_MS = 30 * 1000;
/**
 * A token refresh will be attempted this many ticks before the current session expires. */
const AUTO_REFRESH_TICK_THRESHOLD = 3;
/*
 * Earliest time before an access token expires that the session should be refreshed.
 */
const EXPIRY_MARGIN_MS = AUTO_REFRESH_TICK_THRESHOLD * AUTO_REFRESH_TICK_DURATION_MS;
const GOTRUE_URL = 'http://localhost:9999';
const STORAGE_KEY = 'supabase.auth.token';
const AUDIENCE = '';
const DEFAULT_HEADERS = { 'X-Client-Info': `gotrue-js/${_version__WEBPACK_IMPORTED_MODULE_0__.version}` };
const NETWORK_FAILURE = {
    MAX_RETRIES: 10,
    RETRY_INTERVAL: 2, // in deciseconds
};
const API_VERSION_HEADER_NAME = 'X-Supabase-Api-Version';
const API_VERSIONS = {
    '2024-01-01': {
        timestamp: Date.parse('2024-01-01T00:00:00.0Z'),
        name: '2024-01-01',
    },
};
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ "./node_modules/@supabase/auth-js/dist/module/lib/errors.js":
/*!******************************************************************!*\
  !*** ./node_modules/@supabase/auth-js/dist/module/lib/errors.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthApiError: () => (/* binding */ AuthApiError),
/* harmony export */   AuthError: () => (/* binding */ AuthError),
/* harmony export */   AuthImplicitGrantRedirectError: () => (/* binding */ AuthImplicitGrantRedirectError),
/* harmony export */   AuthInvalidCredentialsError: () => (/* binding */ AuthInvalidCredentialsError),
/* harmony export */   AuthInvalidTokenResponseError: () => (/* binding */ AuthInvalidTokenResponseError),
/* harmony export */   AuthPKCEGrantCodeExchangeError: () => (/* binding */ AuthPKCEGrantCodeExchangeError),
/* harmony export */   AuthRetryableFetchError: () => (/* binding */ AuthRetryableFetchError),
/* harmony export */   AuthSessionMissingError: () => (/* binding */ AuthSessionMissingError),
/* harmony export */   AuthUnknownError: () => (/* binding */ AuthUnknownError),
/* harmony export */   AuthWeakPasswordError: () => (/* binding */ AuthWeakPasswordError),
/* harmony export */   CustomAuthError: () => (/* binding */ CustomAuthError),
/* harmony export */   isAuthApiError: () => (/* binding */ isAuthApiError),
/* harmony export */   isAuthError: () => (/* binding */ isAuthError),
/* harmony export */   isAuthImplicitGrantRedirectError: () => (/* binding */ isAuthImplicitGrantRedirectError),
/* harmony export */   isAuthRetryableFetchError: () => (/* binding */ isAuthRetryableFetchError),
/* harmony export */   isAuthSessionMissingError: () => (/* binding */ isAuthSessionMissingError),
/* harmony export */   isAuthWeakPasswordError: () => (/* binding */ isAuthWeakPasswordError)
/* harmony export */ });
class AuthError extends Error {
    constructor(message, status, code) {
        super(message);
        this.__isAuthError = true;
        this.name = 'AuthError';
        this.status = status;
        this.code = code;
    }
}
function isAuthError(error) {
    return typeof error === 'object' && error !== null && '__isAuthError' in error;
}
class AuthApiError extends AuthError {
    constructor(message, status, code) {
        super(message, status, code);
        this.name = 'AuthApiError';
        this.status = status;
        this.code = code;
    }
}
function isAuthApiError(error) {
    return isAuthError(error) && error.name === 'AuthApiError';
}
class AuthUnknownError extends AuthError {
    constructor(message, originalError) {
        super(message);
        this.name = 'AuthUnknownError';
        this.originalError = originalError;
    }
}
class CustomAuthError extends AuthError {
    constructor(message, name, status, code) {
        super(message, status, code);
        this.name = name;
        this.status = status;
    }
}
class AuthSessionMissingError extends CustomAuthError {
    constructor() {
        super('Auth session missing!', 'AuthSessionMissingError', 400, undefined);
    }
}
function isAuthSessionMissingError(error) {
    return isAuthError(error) && error.name === 'AuthSessionMissingError';
}
class AuthInvalidTokenResponseError extends CustomAuthError {
    constructor() {
        super('Auth session or user missing', 'AuthInvalidTokenResponseError', 500, undefined);
    }
}
class AuthInvalidCredentialsError extends CustomAuthError {
    constructor(message) {
        super(message, 'AuthInvalidCredentialsError', 400, undefined);
    }
}
class AuthImplicitGrantRedirectError extends CustomAuthError {
    constructor(message, details = null) {
        super(message, 'AuthImplicitGrantRedirectError', 500, undefined);
        this.details = null;
        this.details = details;
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            status: this.status,
            details: this.details,
        };
    }
}
function isAuthImplicitGrantRedirectError(error) {
    return isAuthError(error) && error.name === 'AuthImplicitGrantRedirectError';
}
class AuthPKCEGrantCodeExchangeError extends CustomAuthError {
    constructor(message, details = null) {
        super(message, 'AuthPKCEGrantCodeExchangeError', 500, undefined);
        this.details = null;
        this.details = details;
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            status: this.status,
            details: this.details,
        };
    }
}
class AuthRetryableFetchError extends CustomAuthError {
    constructor(message, status) {
        super(message, 'AuthRetryableFetchError', status, undefined);
    }
}
function isAuthRetryableFetchError(error) {
    return isAuthError(error) && error.name === 'AuthRetryableFetchError';
}
/**
 * This error is thrown on certain methods when the password used is deemed
 * weak. Inspect the reasons to identify what password strength rules are
 * inadequate.
 */
class AuthWeakPasswordError extends CustomAuthError {
    constructor(message, status, reasons) {
        super(message, 'AuthWeakPasswordError', status, 'weak_password');
        this.reasons = reasons;
    }
}
function isAuthWeakPasswordError(error) {
    return isAuthError(error) && error.name === 'AuthWeakPasswordError';
}
//# sourceMappingURL=errors.js.map

/***/ }),

/***/ "./node_modules/@supabase/auth-js/dist/module/lib/fetch.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@supabase/auth-js/dist/module/lib/fetch.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _generateLinkResponse: () => (/* binding */ _generateLinkResponse),
/* harmony export */   _noResolveJsonResponse: () => (/* binding */ _noResolveJsonResponse),
/* harmony export */   _request: () => (/* binding */ _request),
/* harmony export */   _sessionResponse: () => (/* binding */ _sessionResponse),
/* harmony export */   _sessionResponsePassword: () => (/* binding */ _sessionResponsePassword),
/* harmony export */   _ssoResponse: () => (/* binding */ _ssoResponse),
/* harmony export */   _userResponse: () => (/* binding */ _userResponse),
/* harmony export */   handleError: () => (/* binding */ handleError)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./node_modules/@supabase/auth-js/dist/module/lib/constants.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers */ "./node_modules/@supabase/auth-js/dist/module/lib/helpers.js");
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./errors */ "./node_modules/@supabase/auth-js/dist/module/lib/errors.js");
var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};



const _getErrorMessage = (err) => err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
const NETWORK_ERROR_CODES = [502, 503, 504];
async function handleError(error) {
    var _a;
    if (!(0,_helpers__WEBPACK_IMPORTED_MODULE_1__.looksLikeFetchResponse)(error)) {
        throw new _errors__WEBPACK_IMPORTED_MODULE_2__.AuthRetryableFetchError(_getErrorMessage(error), 0);
    }
    if (NETWORK_ERROR_CODES.includes(error.status)) {
        // status in 500...599 range - server had an error, request might be retryed.
        throw new _errors__WEBPACK_IMPORTED_MODULE_2__.AuthRetryableFetchError(_getErrorMessage(error), error.status);
    }
    let data;
    try {
        data = await error.json();
    }
    catch (e) {
        throw new _errors__WEBPACK_IMPORTED_MODULE_2__.AuthUnknownError(_getErrorMessage(e), e);
    }
    let errorCode = undefined;
    const responseAPIVersion = (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.parseResponseAPIVersion)(error);
    if (responseAPIVersion &&
        responseAPIVersion.getTime() >= _constants__WEBPACK_IMPORTED_MODULE_0__.API_VERSIONS['2024-01-01'].timestamp &&
        typeof data === 'object' &&
        data &&
        typeof data.code === 'string') {
        errorCode = data.code;
    }
    else if (typeof data === 'object' && data && typeof data.error_code === 'string') {
        errorCode = data.error_code;
    }
    if (!errorCode) {
        // Legacy support for weak password errors, when there were no error codes
        if (typeof data === 'object' &&
            data &&
            typeof data.weak_password === 'object' &&
            data.weak_password &&
            Array.isArray(data.weak_password.reasons) &&
            data.weak_password.reasons.length &&
            data.weak_password.reasons.reduce((a, i) => a && typeof i === 'string', true)) {
            throw new _errors__WEBPACK_IMPORTED_MODULE_2__.AuthWeakPasswordError(_getErrorMessage(data), error.status, data.weak_password.reasons);
        }
    }
    else if (errorCode === 'weak_password') {
        throw new _errors__WEBPACK_IMPORTED_MODULE_2__.AuthWeakPasswordError(_getErrorMessage(data), error.status, ((_a = data.weak_password) === null || _a === void 0 ? void 0 : _a.reasons) || []);
    }
    else if (errorCode === 'session_not_found') {
        // The `session_id` inside the JWT does not correspond to a row in the
        // `sessions` table. This usually means the user has signed out, has been
        // deleted, or their session has somehow been terminated.
        throw new _errors__WEBPACK_IMPORTED_MODULE_2__.AuthSessionMissingError();
    }
    throw new _errors__WEBPACK_IMPORTED_MODULE_2__.AuthApiError(_getErrorMessage(data), error.status || 500, errorCode);
}
const _getRequestParams = (method, options, parameters, body) => {
    const params = { method, headers: (options === null || options === void 0 ? void 0 : options.headers) || {} };
    if (method === 'GET') {
        return params;
    }
    params.headers = Object.assign({ 'Content-Type': 'application/json;charset=UTF-8' }, options === null || options === void 0 ? void 0 : options.headers);
    params.body = JSON.stringify(body);
    return Object.assign(Object.assign({}, params), parameters);
};
async function _request(fetcher, method, url, options) {
    var _a;
    const headers = Object.assign({}, options === null || options === void 0 ? void 0 : options.headers);
    if (!headers[_constants__WEBPACK_IMPORTED_MODULE_0__.API_VERSION_HEADER_NAME]) {
        headers[_constants__WEBPACK_IMPORTED_MODULE_0__.API_VERSION_HEADER_NAME] = _constants__WEBPACK_IMPORTED_MODULE_0__.API_VERSIONS['2024-01-01'].name;
    }
    if (options === null || options === void 0 ? void 0 : options.jwt) {
        headers['Authorization'] = `Bearer ${options.jwt}`;
    }
    const qs = (_a = options === null || options === void 0 ? void 0 : options.query) !== null && _a !== void 0 ? _a : {};
    if (options === null || options === void 0 ? void 0 : options.redirectTo) {
        qs['redirect_to'] = options.redirectTo;
    }
    const queryString = Object.keys(qs).length ? '?' + new URLSearchParams(qs).toString() : '';
    const data = await _handleRequest(fetcher, method, url + queryString, {
        headers,
        noResolveJson: options === null || options === void 0 ? void 0 : options.noResolveJson,
    }, {}, options === null || options === void 0 ? void 0 : options.body);
    return (options === null || options === void 0 ? void 0 : options.xform) ? options === null || options === void 0 ? void 0 : options.xform(data) : { data: Object.assign({}, data), error: null };
}
async function _handleRequest(fetcher, method, url, options, parameters, body) {
    const requestParams = _getRequestParams(method, options, parameters, body);
    let result;
    try {
        result = await fetcher(url, Object.assign({}, requestParams));
    }
    catch (e) {
        console.error(e);
        // fetch failed, likely due to a network or CORS error
        throw new _errors__WEBPACK_IMPORTED_MODULE_2__.AuthRetryableFetchError(_getErrorMessage(e), 0);
    }
    if (!result.ok) {
        await handleError(result);
    }
    if (options === null || options === void 0 ? void 0 : options.noResolveJson) {
        return result;
    }
    try {
        return await result.json();
    }
    catch (e) {
        await handleError(e);
    }
}
function _sessionResponse(data) {
    var _a;
    let session = null;
    if (hasSession(data)) {
        session = Object.assign({}, data);
        if (!data.expires_at) {
            session.expires_at = (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.expiresAt)(data.expires_in);
        }
    }
    const user = (_a = data.user) !== null && _a !== void 0 ? _a : data;
    return { data: { session, user }, error: null };
}
function _sessionResponsePassword(data) {
    const response = _sessionResponse(data);
    if (!response.error &&
        data.weak_password &&
        typeof data.weak_password === 'object' &&
        Array.isArray(data.weak_password.reasons) &&
        data.weak_password.reasons.length &&
        data.weak_password.message &&
        typeof data.weak_password.message === 'string' &&
        data.weak_password.reasons.reduce((a, i) => a && typeof i === 'string', true)) {
        response.data.weak_password = data.weak_password;
    }
    return response;
}
function _userResponse(data) {
    var _a;
    const user = (_a = data.user) !== null && _a !== void 0 ? _a : data;
    return { data: { user }, error: null };
}
function _ssoResponse(data) {
    return { data, error: null };
}
function _generateLinkResponse(data) {
    const { action_link, email_otp, hashed_token, redirect_to, verification_type } = data, rest = __rest(data, ["action_link", "email_otp", "hashed_token", "redirect_to", "verification_type"]);
    const properties = {
        action_link,
        email_otp,
        hashed_token,
        redirect_to,
        verification_type,
    };
    const user = Object.assign({}, rest);
    return {
        data: {
            properties,
            user,
        },
        error: null,
    };
}
function _noResolveJsonResponse(data) {
    return data;
}
/**
 * hasSession checks if the response object contains a valid session
 * @param data A response object
 * @returns true if a session is in the response
 */
function hasSession(data) {
    return data.access_token && data.refresh_token && data.expires_in;
}
//# sourceMappingURL=fetch.js.map

/***/ }),

/***/ "./node_modules/@supabase/auth-js/dist/module/lib/helpers.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@supabase/auth-js/dist/module/lib/helpers.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Deferred: () => (/* binding */ Deferred),
/* harmony export */   decodeBase64URL: () => (/* binding */ decodeBase64URL),
/* harmony export */   decodeJWTPayload: () => (/* binding */ decodeJWTPayload),
/* harmony export */   expiresAt: () => (/* binding */ expiresAt),
/* harmony export */   generatePKCEChallenge: () => (/* binding */ generatePKCEChallenge),
/* harmony export */   generatePKCEVerifier: () => (/* binding */ generatePKCEVerifier),
/* harmony export */   getCodeChallengeAndMethod: () => (/* binding */ getCodeChallengeAndMethod),
/* harmony export */   getItemAsync: () => (/* binding */ getItemAsync),
/* harmony export */   isBrowser: () => (/* binding */ isBrowser),
/* harmony export */   looksLikeFetchResponse: () => (/* binding */ looksLikeFetchResponse),
/* harmony export */   parseParametersFromURL: () => (/* binding */ parseParametersFromURL),
/* harmony export */   parseResponseAPIVersion: () => (/* binding */ parseResponseAPIVersion),
/* harmony export */   removeItemAsync: () => (/* binding */ removeItemAsync),
/* harmony export */   resolveFetch: () => (/* binding */ resolveFetch),
/* harmony export */   retryable: () => (/* binding */ retryable),
/* harmony export */   setItemAsync: () => (/* binding */ setItemAsync),
/* harmony export */   sleep: () => (/* binding */ sleep),
/* harmony export */   supportsLocalStorage: () => (/* binding */ supportsLocalStorage),
/* harmony export */   uuid: () => (/* binding */ uuid)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./node_modules/@supabase/auth-js/dist/module/lib/constants.js");

function expiresAt(expiresIn) {
    const timeNow = Math.round(Date.now() / 1000);
    return timeNow + expiresIn;
}
function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';
const localStorageWriteTests = {
    tested: false,
    writable: false,
};
/**
 * Checks whether localStorage is supported on this browser.
 */
const supportsLocalStorage = () => {
    if (!isBrowser()) {
        return false;
    }
    try {
        if (typeof globalThis.localStorage !== 'object') {
            return false;
        }
    }
    catch (e) {
        // DOM exception when accessing `localStorage`
        return false;
    }
    if (localStorageWriteTests.tested) {
        return localStorageWriteTests.writable;
    }
    const randomKey = `lswt-${Math.random()}${Math.random()}`;
    try {
        globalThis.localStorage.setItem(randomKey, randomKey);
        globalThis.localStorage.removeItem(randomKey);
        localStorageWriteTests.tested = true;
        localStorageWriteTests.writable = true;
    }
    catch (e) {
        // localStorage can't be written to
        // https://www.chromium.org/for-testers/bug-reporting-guidelines/uncaught-securityerror-failed-to-read-the-localstorage-property-from-window-access-is-denied-for-this-document
        localStorageWriteTests.tested = true;
        localStorageWriteTests.writable = false;
    }
    return localStorageWriteTests.writable;
};
/**
 * Extracts parameters encoded in the URL both in the query and fragment.
 */
function parseParametersFromURL(href) {
    const result = {};
    const url = new URL(href);
    if (url.hash && url.hash[0] === '#') {
        try {
            const hashSearchParams = new URLSearchParams(url.hash.substring(1));
            hashSearchParams.forEach((value, key) => {
                result[key] = value;
            });
        }
        catch (e) {
            // hash is not a query string
        }
    }
    // search parameters take precedence over hash parameters
    url.searchParams.forEach((value, key) => {
        result[key] = value;
    });
    return result;
}
const resolveFetch = (customFetch) => {
    let _fetch;
    if (customFetch) {
        _fetch = customFetch;
    }
    else if (typeof fetch === 'undefined') {
        _fetch = (...args) => Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! @supabase/node-fetch */ "./node_modules/@supabase/node-fetch/browser.js")).then(({ default: fetch }) => fetch(...args));
    }
    else {
        _fetch = fetch;
    }
    return (...args) => _fetch(...args);
};
const looksLikeFetchResponse = (maybeResponse) => {
    return (typeof maybeResponse === 'object' &&
        maybeResponse !== null &&
        'status' in maybeResponse &&
        'ok' in maybeResponse &&
        'json' in maybeResponse &&
        typeof maybeResponse.json === 'function');
};
// Storage helpers
const setItemAsync = async (storage, key, data) => {
    await storage.setItem(key, JSON.stringify(data));
};
const getItemAsync = async (storage, key) => {
    const value = await storage.getItem(key);
    if (!value) {
        return null;
    }
    try {
        return JSON.parse(value);
    }
    catch (_a) {
        return value;
    }
};
const removeItemAsync = async (storage, key) => {
    await storage.removeItem(key);
};
function decodeBase64URL(value) {
    const key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let base64 = '';
    let chr1, chr2, chr3;
    let enc1, enc2, enc3, enc4;
    let i = 0;
    value = value.replace('-', '+').replace('_', '/');
    while (i < value.length) {
        enc1 = key.indexOf(value.charAt(i++));
        enc2 = key.indexOf(value.charAt(i++));
        enc3 = key.indexOf(value.charAt(i++));
        enc4 = key.indexOf(value.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        base64 = base64 + String.fromCharCode(chr1);
        if (enc3 != 64 && chr2 != 0) {
            base64 = base64 + String.fromCharCode(chr2);
        }
        if (enc4 != 64 && chr3 != 0) {
            base64 = base64 + String.fromCharCode(chr3);
        }
    }
    return base64;
}
/**
 * A deferred represents some asynchronous work that is not yet finished, which
 * may or may not culminate in a value.
 * Taken from: https://github.com/mike-north/types/blob/master/src/async.ts
 */
class Deferred {
    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-extra-semi
        ;
        this.promise = new Deferred.promiseConstructor((res, rej) => {
            // eslint-disable-next-line @typescript-eslint/no-extra-semi
            ;
            this.resolve = res;
            this.reject = rej;
        });
    }
}
Deferred.promiseConstructor = Promise;
// Taken from: https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
function decodeJWTPayload(token) {
    // Regex checks for base64url format
    const base64UrlRegex = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}=?$|[a-z0-9_-]{2}(==)?$)$/i;
    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('JWT is not valid: not a JWT structure');
    }
    if (!base64UrlRegex.test(parts[1])) {
        throw new Error('JWT is not valid: payload is not in base64url format');
    }
    const base64Url = parts[1];
    return JSON.parse(decodeBase64URL(base64Url));
}
/**
 * Creates a promise that resolves to null after some time.
 */
async function sleep(time) {
    return await new Promise((accept) => {
        setTimeout(() => accept(null), time);
    });
}
/**
 * Converts the provided async function into a retryable function. Each result
 * or thrown error is sent to the isRetryable function which should return true
 * if the function should run again.
 */
function retryable(fn, isRetryable) {
    const promise = new Promise((accept, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-extra-semi
        ;
        (async () => {
            for (let attempt = 0; attempt < Infinity; attempt++) {
                try {
                    const result = await fn(attempt);
                    if (!isRetryable(attempt, null, result)) {
                        accept(result);
                        return;
                    }
                }
                catch (e) {
                    if (!isRetryable(attempt, e)) {
                        reject(e);
                        return;
                    }
                }
            }
        })();
    });
    return promise;
}
function dec2hex(dec) {
    return ('0' + dec.toString(16)).substr(-2);
}
// Functions below taken from: https://stackoverflow.com/questions/63309409/creating-a-code-verifier-and-challenge-for-pkce-auth-on-spotify-api-in-reactjs
function generatePKCEVerifier() {
    const verifierLength = 56;
    const array = new Uint32Array(verifierLength);
    if (typeof crypto === 'undefined') {
        const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
        const charSetLen = charSet.length;
        let verifier = '';
        for (let i = 0; i < verifierLength; i++) {
            verifier += charSet.charAt(Math.floor(Math.random() * charSetLen));
        }
        return verifier;
    }
    crypto.getRandomValues(array);
    return Array.from(array, dec2hex).join('');
}
async function sha256(randomString) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(randomString);
    const hash = await crypto.subtle.digest('SHA-256', encodedData);
    const bytes = new Uint8Array(hash);
    return Array.from(bytes)
        .map((c) => String.fromCharCode(c))
        .join('');
}
function base64urlencode(str) {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
async function generatePKCEChallenge(verifier) {
    const hasCryptoSupport = typeof crypto !== 'undefined' &&
        typeof crypto.subtle !== 'undefined' &&
        typeof TextEncoder !== 'undefined';
    if (!hasCryptoSupport) {
        console.warn('WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256.');
        return verifier;
    }
    const hashed = await sha256(verifier);
    return base64urlencode(hashed);
}
async function getCodeChallengeAndMethod(storage, storageKey, isPasswordRecovery = false) {
    const codeVerifier = generatePKCEVerifier();
    let storedCodeVerifier = codeVerifier;
    if (isPasswordRecovery) {
        storedCodeVerifier += '/PASSWORD_RECOVERY';
    }
    await setItemAsync(storage, `${storageKey}-code-verifier`, storedCodeVerifier);
    const codeChallenge = await generatePKCEChallenge(codeVerifier);
    const codeChallengeMethod = codeVerifier === codeChallenge ? 'plain' : 's256';
    return [codeChallenge, codeChallengeMethod];
}
/** Parses the API version which is 2YYY-MM-DD. */
const API_VERSION_REGEX = /^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i;
function parseResponseAPIVersion(response) {
    const apiVersion = response.headers.get(_constants__WEBPACK_IMPORTED_MODULE_0__.API_VERSION_HEADER_NAME);
    if (!apiVersion) {
        return null;
    }
    if (!apiVersion.match(API_VERSION_REGEX)) {
        return null;
    }
    try {
        const date = new Date(`${apiVersion}T00:00:00.0Z`);
        return date;
    }
    catch (e) {
        return null;
    }
}
//# sourceMappingURL=helpers.js.map

/***/ }),

/***/ "./node_modules/@supabase/auth-js/dist/module/lib/local-storage.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@supabase/auth-js/dist/module/lib/local-storage.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   localStorageAdapter: () => (/* binding */ localStorageAdapter),
/* harmony export */   memoryLocalStorageAdapter: () => (/* binding */ memoryLocalStorageAdapter)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "./node_modules/@supabase/auth-js/dist/module/lib/helpers.js");

/**
 * Provides safe access to the globalThis.localStorage property.
 */
const localStorageAdapter = {
    getItem: (key) => {
        if (!(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.supportsLocalStorage)()) {
            return null;
        }
        return globalThis.localStorage.getItem(key);
    },
    setItem: (key, value) => {
        if (!(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.supportsLocalStorage)()) {
            return;
        }
        globalThis.localStorage.setItem(key, value);
    },
    removeItem: (key) => {
        if (!(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.supportsLocalStorage)()) {
            return;
        }
        globalThis.localStorage.removeItem(key);
    },
};
/**
 * Returns a localStorage-like object that stores the key-value pairs in
 * memory.
 */
function memoryLocalStorageAdapter(store = {}) {
    return {
        getItem: (key) => {
            return store[key] || null;
        },
        setItem: (key, value) => {
            store[key] = value;
        },
        removeItem: (key) => {
            delete store[key];
        },
    };
}
//# sourceMappingURL=local-storage.js.map

/***/ }),

/***/ "./node_modules/@supabase/auth-js/dist/module/lib/locks.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@supabase/auth-js/dist/module/lib/locks.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LockAcquireTimeoutError: () => (/* binding */ LockAcquireTimeoutError),
/* harmony export */   NavigatorLockAcquireTimeoutError: () => (/* binding */ NavigatorLockAcquireTimeoutError),
/* harmony export */   ProcessLockAcquireTimeoutError: () => (/* binding */ ProcessLockAcquireTimeoutError),
/* harmony export */   internals: () => (/* binding */ internals),
/* harmony export */   navigatorLock: () => (/* binding */ navigatorLock),
/* harmony export */   processLock: () => (/* binding */ processLock)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "./node_modules/@supabase/auth-js/dist/module/lib/helpers.js");

/**
 * @experimental
 */
const internals = {
    /**
     * @experimental
     */
    debug: !!(globalThis &&
        (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.supportsLocalStorage)() &&
        globalThis.localStorage &&
        globalThis.localStorage.getItem('supabase.gotrue-js.locks.debug') === 'true'),
};
/**
 * An error thrown when a lock cannot be acquired after some amount of time.
 *
 * Use the {@link #isAcquireTimeout} property instead of checking with `instanceof`.
 */
class LockAcquireTimeoutError extends Error {
    constructor(message) {
        super(message);
        this.isAcquireTimeout = true;
    }
}
class NavigatorLockAcquireTimeoutError extends LockAcquireTimeoutError {
}
class ProcessLockAcquireTimeoutError extends LockAcquireTimeoutError {
}
/**
 * Implements a global exclusive lock using the Navigator LockManager API. It
 * is available on all browsers released after 2022-03-15 with Safari being the
 * last one to release support. If the API is not available, this function will
 * throw. Make sure you check availablility before configuring {@link
 * GoTrueClient}.
 *
 * You can turn on debugging by setting the `supabase.gotrue-js.locks.debug`
 * local storage item to `true`.
 *
 * Internals:
 *
 * Since the LockManager API does not preserve stack traces for the async
 * function passed in the `request` method, a trick is used where acquiring the
 * lock releases a previously started promise to run the operation in the `fn`
 * function. The lock waits for that promise to finish (with or without error),
 * while the function will finally wait for the result anyway.
 *
 * @param name Name of the lock to be acquired.
 * @param acquireTimeout If negative, no timeout. If 0 an error is thrown if
 *                       the lock can't be acquired without waiting. If positive, the lock acquire
 *                       will time out after so many milliseconds. An error is
 *                       a timeout if it has `isAcquireTimeout` set to true.
 * @param fn The operation to run once the lock is acquired.
 */
async function navigatorLock(name, acquireTimeout, fn) {
    if (internals.debug) {
        console.log('@supabase/gotrue-js: navigatorLock: acquire lock', name, acquireTimeout);
    }
    const abortController = new globalThis.AbortController();
    if (acquireTimeout > 0) {
        setTimeout(() => {
            abortController.abort();
            if (internals.debug) {
                console.log('@supabase/gotrue-js: navigatorLock acquire timed out', name);
            }
        }, acquireTimeout);
    }
    // MDN article: https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request
    // Wrapping navigator.locks.request() with a plain Promise is done as some
    // libraries like zone.js patch the Promise object to track the execution
    // context. However, it appears that most browsers use an internal promise
    // implementation when using the navigator.locks.request() API causing them
    // to lose context and emit confusing log messages or break certain features.
    // This wrapping is believed to help zone.js track the execution context
    // better.
    return await Promise.resolve().then(() => globalThis.navigator.locks.request(name, acquireTimeout === 0
        ? {
            mode: 'exclusive',
            ifAvailable: true,
        }
        : {
            mode: 'exclusive',
            signal: abortController.signal,
        }, async (lock) => {
        if (lock) {
            if (internals.debug) {
                console.log('@supabase/gotrue-js: navigatorLock: acquired', name, lock.name);
            }
            try {
                return await fn();
            }
            finally {
                if (internals.debug) {
                    console.log('@supabase/gotrue-js: navigatorLock: released', name, lock.name);
                }
            }
        }
        else {
            if (acquireTimeout === 0) {
                if (internals.debug) {
                    console.log('@supabase/gotrue-js: navigatorLock: not immediately available', name);
                }
                throw new NavigatorLockAcquireTimeoutError(`Acquiring an exclusive Navigator LockManager lock "${name}" immediately failed`);
            }
            else {
                if (internals.debug) {
                    try {
                        const result = await globalThis.navigator.locks.query();
                        console.log('@supabase/gotrue-js: Navigator LockManager state', JSON.stringify(result, null, '  '));
                    }
                    catch (e) {
                        console.warn('@supabase/gotrue-js: Error when querying Navigator LockManager state', e);
                    }
                }
                // Browser is not following the Navigator LockManager spec, it
                // returned a null lock when we didn't use ifAvailable. So we can
                // pretend the lock is acquired in the name of backward compatibility
                // and user experience and just run the function.
                console.warn('@supabase/gotrue-js: Navigator LockManager returned a null lock when using #request without ifAvailable set to true, it appears this browser is not following the LockManager spec https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request');
                return await fn();
            }
        }
    }));
}
const PROCESS_LOCKS = {};
/**
 * Implements a global exclusive lock that works only in the current process.
 * Useful for environments like React Native or other non-browser
 * single-process (i.e. no concept of "tabs") environments.
 *
 * Use {@link #navigatorLock} in browser environments.
 *
 * @param name Name of the lock to be acquired.
 * @param acquireTimeout If negative, no timeout. If 0 an error is thrown if
 *                       the lock can't be acquired without waiting. If positive, the lock acquire
 *                       will time out after so many milliseconds. An error is
 *                       a timeout if it has `isAcquireTimeout` set to true.
 * @param fn The operation to run once the lock is acquired.
 */
async function processLock(name, acquireTimeout, fn) {
    var _a;
    const previousOperation = (_a = PROCESS_LOCKS[name]) !== null && _a !== void 0 ? _a : Promise.resolve();
    const currentOperation = Promise.race([
        previousOperation.catch(() => {
            // ignore error of previous operation that we're waiting to finish
            return null;
        }),
        acquireTimeout >= 0
            ? new Promise((_, reject) => {
                setTimeout(() => {
                    reject(new ProcessLockAcquireTimeoutError(`Acquring process lock with name "${name}" timed out`));
                }, acquireTimeout);
            })
            : null,
    ].filter((x) => x))
        .catch((e) => {
        if (e && e.isAcquireTimeout) {
            throw e;
        }
        return null;
    })
        .then(async () => {
        // previous operations finished and we didn't get a race on the acquire
        // timeout, so the current operation can finally start
        return await fn();
    });
    PROCESS_LOCKS[name] = currentOperation.catch(async (e) => {
        if (e && e.isAcquireTimeout) {
            // if the current operation timed out, it doesn't mean that the previous
            // operation finished, so we need contnue waiting for it to finish
            await previousOperation;
            return null;
        }
        throw e;
    });
    // finally wait for the current operation to finish successfully, with an
    // error or with an acquire timeout error
    return await currentOperation;
}
//# sourceMappingURL=locks.js.map

/***/ }),

/***/ "./node_modules/@supabase/auth-js/dist/module/lib/polyfills.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@supabase/auth-js/dist/module/lib/polyfills.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   polyfillGlobalThis: () => (/* binding */ polyfillGlobalThis)
/* harmony export */ });
/**
 * https://mathiasbynens.be/notes/globalthis
 */
function polyfillGlobalThis() {
    if (typeof globalThis === 'object')
        return;
    try {
        Object.defineProperty(Object.prototype, '__magic__', {
            get: function () {
                return this;
            },
            configurable: true,
        });
        // @ts-expect-error 'Allow access to magic'
        __magic__.globalThis = __magic__;
        // @ts-expect-error 'Allow access to magic'
        delete Object.prototype.__magic__;
    }
    catch (e) {
        if (typeof self !== 'undefined') {
            // @ts-expect-error 'Allow access to globals'
            self.globalThis = self;
        }
    }
}
//# sourceMappingURL=polyfills.js.map

/***/ }),

/***/ "./node_modules/@supabase/auth-js/dist/module/lib/types.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@supabase/auth-js/dist/module/lib/types.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=types.js.map

/***/ }),

/***/ "./node_modules/@supabase/auth-js/dist/module/lib/version.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@supabase/auth-js/dist/module/lib/version.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   version: () => (/* binding */ version)
/* harmony export */ });
const version = '2.68.0';
//# sourceMappingURL=version.js.map

/***/ }),

/***/ "./node_modules/@supabase/functions-js/dist/module/FunctionsClient.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@supabase/functions-js/dist/module/FunctionsClient.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FunctionsClient: () => (/* binding */ FunctionsClient)
/* harmony export */ });
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helper */ "./node_modules/@supabase/functions-js/dist/module/helper.js");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./node_modules/@supabase/functions-js/dist/module/types.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


class FunctionsClient {
    constructor(url, { headers = {}, customFetch, region = _types__WEBPACK_IMPORTED_MODULE_0__.FunctionRegion.Any, } = {}) {
        this.url = url;
        this.headers = headers;
        this.region = region;
        this.fetch = (0,_helper__WEBPACK_IMPORTED_MODULE_1__.resolveFetch)(customFetch);
    }
    /**
     * Updates the authorization header
     * @param token - the new jwt token sent in the authorisation header
     */
    setAuth(token) {
        this.headers.Authorization = `Bearer ${token}`;
    }
    /**
     * Invokes a function
     * @param functionName - The name of the Function to invoke.
     * @param options - Options for invoking the Function.
     */
    invoke(functionName, options = {}) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { headers, method, body: functionArgs } = options;
                let _headers = {};
                let { region } = options;
                if (!region) {
                    region = this.region;
                }
                if (region && region !== 'any') {
                    _headers['x-region'] = region;
                }
                let body;
                if (functionArgs &&
                    ((headers && !Object.prototype.hasOwnProperty.call(headers, 'Content-Type')) || !headers)) {
                    if ((typeof Blob !== 'undefined' && functionArgs instanceof Blob) ||
                        functionArgs instanceof ArrayBuffer) {
                        // will work for File as File inherits Blob
                        // also works for ArrayBuffer as it is the same underlying structure as a Blob
                        _headers['Content-Type'] = 'application/octet-stream';
                        body = functionArgs;
                    }
                    else if (typeof functionArgs === 'string') {
                        // plain string
                        _headers['Content-Type'] = 'text/plain';
                        body = functionArgs;
                    }
                    else if (typeof FormData !== 'undefined' && functionArgs instanceof FormData) {
                        // don't set content-type headers
                        // Request will automatically add the right boundary value
                        body = functionArgs;
                    }
                    else {
                        // default, assume this is JSON
                        _headers['Content-Type'] = 'application/json';
                        body = JSON.stringify(functionArgs);
                    }
                }
                const response = yield this.fetch(`${this.url}/${functionName}`, {
                    method: method || 'POST',
                    // headers priority is (high to low):
                    // 1. invoke-level headers
                    // 2. client-level headers
                    // 3. default Content-Type header
                    headers: Object.assign(Object.assign(Object.assign({}, _headers), this.headers), headers),
                    body,
                }).catch((fetchError) => {
                    throw new _types__WEBPACK_IMPORTED_MODULE_0__.FunctionsFetchError(fetchError);
                });
                const isRelayError = response.headers.get('x-relay-error');
                if (isRelayError && isRelayError === 'true') {
                    throw new _types__WEBPACK_IMPORTED_MODULE_0__.FunctionsRelayError(response);
                }
                if (!response.ok) {
                    throw new _types__WEBPACK_IMPORTED_MODULE_0__.FunctionsHttpError(response);
                }
                let responseType = ((_a = response.headers.get('Content-Type')) !== null && _a !== void 0 ? _a : 'text/plain').split(';')[0].trim();
                let data;
                if (responseType === 'application/json') {
                    data = yield response.json();
                }
                else if (responseType === 'application/octet-stream') {
                    data = yield response.blob();
                }
                else if (responseType === 'text/event-stream') {
                    data = response;
                }
                else if (responseType === 'multipart/form-data') {
                    data = yield response.formData();
                }
                else {
                    // default to text
                    data = yield response.text();
                }
                return { data, error: null };
            }
            catch (error) {
                return { data: null, error };
            }
        });
    }
}
//# sourceMappingURL=FunctionsClient.js.map

/***/ }),

/***/ "./node_modules/@supabase/functions-js/dist/module/helper.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@supabase/functions-js/dist/module/helper.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   resolveFetch: () => (/* binding */ resolveFetch)
/* harmony export */ });
const resolveFetch = (customFetch) => {
    let _fetch;
    if (customFetch) {
        _fetch = customFetch;
    }
    else if (typeof fetch === 'undefined') {
        _fetch = (...args) => Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! @supabase/node-fetch */ "./node_modules/@supabase/node-fetch/browser.js")).then(({ default: fetch }) => fetch(...args));
    }
    else {
        _fetch = fetch;
    }
    return (...args) => _fetch(...args);
};
//# sourceMappingURL=helper.js.map

/***/ }),

/***/ "./node_modules/@supabase/functions-js/dist/module/types.js":
/*!******************************************************************!*\
  !*** ./node_modules/@supabase/functions-js/dist/module/types.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FunctionRegion: () => (/* binding */ FunctionRegion),
/* harmony export */   FunctionsError: () => (/* binding */ FunctionsError),
/* harmony export */   FunctionsFetchError: () => (/* binding */ FunctionsFetchError),
/* harmony export */   FunctionsHttpError: () => (/* binding */ FunctionsHttpError),
/* harmony export */   FunctionsRelayError: () => (/* binding */ FunctionsRelayError)
/* harmony export */ });
class FunctionsError extends Error {
    constructor(message, name = 'FunctionsError', context) {
        super(message);
        this.name = name;
        this.context = context;
    }
}
class FunctionsFetchError extends FunctionsError {
    constructor(context) {
        super('Failed to send a request to the Edge Function', 'FunctionsFetchError', context);
    }
}
class FunctionsRelayError extends FunctionsError {
    constructor(context) {
        super('Relay Error invoking the Edge Function', 'FunctionsRelayError', context);
    }
}
class FunctionsHttpError extends FunctionsError {
    constructor(context) {
        super('Edge Function returned a non-2xx status code', 'FunctionsHttpError', context);
    }
}
// Define the enum for the 'region' property
var FunctionRegion;
(function (FunctionRegion) {
    FunctionRegion["Any"] = "any";
    FunctionRegion["ApNortheast1"] = "ap-northeast-1";
    FunctionRegion["ApNortheast2"] = "ap-northeast-2";
    FunctionRegion["ApSouth1"] = "ap-south-1";
    FunctionRegion["ApSoutheast1"] = "ap-southeast-1";
    FunctionRegion["ApSoutheast2"] = "ap-southeast-2";
    FunctionRegion["CaCentral1"] = "ca-central-1";
    FunctionRegion["EuCentral1"] = "eu-central-1";
    FunctionRegion["EuWest1"] = "eu-west-1";
    FunctionRegion["EuWest2"] = "eu-west-2";
    FunctionRegion["EuWest3"] = "eu-west-3";
    FunctionRegion["SaEast1"] = "sa-east-1";
    FunctionRegion["UsEast1"] = "us-east-1";
    FunctionRegion["UsWest1"] = "us-west-1";
    FunctionRegion["UsWest2"] = "us-west-2";
})(FunctionRegion || (FunctionRegion = {}));
//# sourceMappingURL=types.js.map

/***/ }),

/***/ "./node_modules/@supabase/node-fetch/browser.js":
/*!******************************************************!*\
  !*** ./node_modules/@supabase/node-fetch/browser.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Headers: () => (/* binding */ Headers),
/* harmony export */   Request: () => (/* binding */ Request),
/* harmony export */   Response: () => (/* binding */ Response),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   fetch: () => (/* binding */ fetch)
/* harmony export */ });


// ref: https://github.com/tc39/proposal-global
var getGlobal = function() {
    // the only reliable means to get the global object is
    // `Function('return this')()`
    // However, this causes CSP violations in Chrome apps.
    if (typeof self !== 'undefined') { return self; }
    if (typeof window !== 'undefined') { return window; }
    if (typeof __webpack_require__.g !== 'undefined') { return __webpack_require__.g; }
    throw new Error('unable to locate global object');
}

var globalObject = getGlobal();

const fetch = globalObject.fetch;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (globalObject.fetch.bind(globalObject));

const Headers = globalObject.Headers;
const Request = globalObject.Request;
const Response = globalObject.Response;


/***/ }),

/***/ "./node_modules/@supabase/postgrest-js/dist/cjs/PostgrestBuilder.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@supabase/postgrest-js/dist/cjs/PostgrestBuilder.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// @ts-ignore
const node_fetch_1 = __importDefault(__webpack_require__(/*! @supabase/node-fetch */ "./node_modules/@supabase/node-fetch/browser.js"));
const PostgrestError_1 = __importDefault(__webpack_require__(/*! ./PostgrestError */ "./node_modules/@supabase/postgrest-js/dist/cjs/PostgrestError.js"));
class PostgrestBuilder {
    constructor(builder) {
        this.shouldThrowOnError = false;
        this.method = builder.method;
        this.url = builder.url;
        this.headers = builder.headers;
        this.schema = builder.schema;
        this.body = builder.body;
        this.shouldThrowOnError = builder.shouldThrowOnError;
        this.signal = builder.signal;
        this.isMaybeSingle = builder.isMaybeSingle;
        if (builder.fetch) {
            this.fetch = builder.fetch;
        }
        else if (typeof fetch === 'undefined') {
            this.fetch = node_fetch_1.default;
        }
        else {
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
    setHeader(name, value) {
        this.headers = Object.assign({}, this.headers);
        this.headers[name] = value;
        return this;
    }
    then(onfulfilled, onrejected) {
        // https://postgrest.org/en/stable/api.html#switching-schemas
        if (this.schema === undefined) {
            // skip
        }
        else if (['GET', 'HEAD'].includes(this.method)) {
            this.headers['Accept-Profile'] = this.schema;
        }
        else {
            this.headers['Content-Profile'] = this.schema;
        }
        if (this.method !== 'GET' && this.method !== 'HEAD') {
            this.headers['Content-Type'] = 'application/json';
        }
        // NOTE: Invoke w/o `this` to avoid illegal invocation error.
        // https://github.com/supabase/postgrest-js/pull/247
        const _fetch = this.fetch;
        let res = _fetch(this.url.toString(), {
            method: this.method,
            headers: this.headers,
            body: JSON.stringify(this.body),
            signal: this.signal,
        }).then(async (res) => {
            var _a, _b, _c;
            let error = null;
            let data = null;
            let count = null;
            let status = res.status;
            let statusText = res.statusText;
            if (res.ok) {
                if (this.method !== 'HEAD') {
                    const body = await res.text();
                    if (body === '') {
                        // Prefer: return=minimal
                    }
                    else if (this.headers['Accept'] === 'text/csv') {
                        data = body;
                    }
                    else if (this.headers['Accept'] &&
                        this.headers['Accept'].includes('application/vnd.pgrst.plan+text')) {
                        data = body;
                    }
                    else {
                        data = JSON.parse(body);
                    }
                }
                const countHeader = (_a = this.headers['Prefer']) === null || _a === void 0 ? void 0 : _a.match(/count=(exact|planned|estimated)/);
                const contentRange = (_b = res.headers.get('content-range')) === null || _b === void 0 ? void 0 : _b.split('/');
                if (countHeader && contentRange && contentRange.length > 1) {
                    count = parseInt(contentRange[1]);
                }
                // Temporary partial fix for https://github.com/supabase/postgrest-js/issues/361
                // Issue persists e.g. for `.insert([...]).select().maybeSingle()`
                if (this.isMaybeSingle && this.method === 'GET' && Array.isArray(data)) {
                    if (data.length > 1) {
                        error = {
                            // https://github.com/PostgREST/postgrest/blob/a867d79c42419af16c18c3fb019eba8df992626f/src/PostgREST/Error.hs#L553
                            code: 'PGRST116',
                            details: `Results contain ${data.length} rows, application/vnd.pgrst.object+json requires 1 row`,
                            hint: null,
                            message: 'JSON object requested, multiple (or no) rows returned',
                        };
                        data = null;
                        count = null;
                        status = 406;
                        statusText = 'Not Acceptable';
                    }
                    else if (data.length === 1) {
                        data = data[0];
                    }
                    else {
                        data = null;
                    }
                }
            }
            else {
                const body = await res.text();
                try {
                    error = JSON.parse(body);
                    // Workaround for https://github.com/supabase/postgrest-js/issues/295
                    if (Array.isArray(error) && res.status === 404) {
                        data = [];
                        error = null;
                        status = 200;
                        statusText = 'OK';
                    }
                }
                catch (_d) {
                    // Workaround for https://github.com/supabase/postgrest-js/issues/295
                    if (res.status === 404 && body === '') {
                        status = 204;
                        statusText = 'No Content';
                    }
                    else {
                        error = {
                            message: body,
                        };
                    }
                }
                if (error && this.isMaybeSingle && ((_c = error === null || error === void 0 ? void 0 : error.details) === null || _c === void 0 ? void 0 : _c.includes('0 rows'))) {
                    error = null;
                    status = 200;
                    statusText = 'OK';
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
                statusText,
            };
            return postgrestResponse;
        });
        if (!this.shouldThrowOnError) {
            res = res.catch((fetchError) => {
                var _a, _b, _c;
                return ({
                    error: {
                        message: `${(_a = fetchError === null || fetchError === void 0 ? void 0 : fetchError.name) !== null && _a !== void 0 ? _a : 'FetchError'}: ${fetchError === null || fetchError === void 0 ? void 0 : fetchError.message}`,
                        details: `${(_b = fetchError === null || fetchError === void 0 ? void 0 : fetchError.stack) !== null && _b !== void 0 ? _b : ''}`,
                        hint: '',
                        code: `${(_c = fetchError === null || fetchError === void 0 ? void 0 : fetchError.code) !== null && _c !== void 0 ? _c : ''}`,
                    },
                    data: null,
                    count: null,
                    status: 0,
                    statusText: '',
                });
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
        /* istanbul ignore next */
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
}
exports["default"] = PostgrestBuilder;
//# sourceMappingURL=PostgrestBuilder.js.map

/***/ }),

/***/ "./node_modules/@supabase/postgrest-js/dist/cjs/PostgrestClient.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@supabase/postgrest-js/dist/cjs/PostgrestClient.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const PostgrestQueryBuilder_1 = __importDefault(__webpack_require__(/*! ./PostgrestQueryBuilder */ "./node_modules/@supabase/postgrest-js/dist/cjs/PostgrestQueryBuilder.js"));
const PostgrestFilterBuilder_1 = __importDefault(__webpack_require__(/*! ./PostgrestFilterBuilder */ "./node_modules/@supabase/postgrest-js/dist/cjs/PostgrestFilterBuilder.js"));
const constants_1 = __webpack_require__(/*! ./constants */ "./node_modules/@supabase/postgrest-js/dist/cjs/constants.js");
/**
 * PostgREST client.
 *
 * @typeParam Database - Types for the schema from the [type
 * generator](https://supabase.com/docs/reference/javascript/next/typescript-support)
 *
 * @typeParam SchemaName - Postgres schema to switch to. Must be a string
 * literal, the same one passed to the constructor. If the schema is not
 * `"public"`, this must be supplied manually.
 */
class PostgrestClient {
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
    constructor(url, { headers = {}, schema, fetch, } = {}) {
        this.url = url;
        this.headers = Object.assign(Object.assign({}, constants_1.DEFAULT_HEADERS), headers);
        this.schemaName = schema;
        this.fetch = fetch;
    }
    /**
     * Perform a query on a table or a view.
     *
     * @param relation - The table or view name to query
     */
    from(relation) {
        const url = new URL(`${this.url}/${relation}`);
        return new PostgrestQueryBuilder_1.default(url, {
            headers: Object.assign({}, this.headers),
            schema: this.schemaName,
            fetch: this.fetch,
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
        return new PostgrestClient(this.url, {
            headers: this.headers,
            schema,
            fetch: this.fetch,
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
    rpc(fn, args = {}, { head = false, get = false, count, } = {}) {
        let method;
        const url = new URL(`${this.url}/rpc/${fn}`);
        let body;
        if (head || get) {
            method = head ? 'HEAD' : 'GET';
            Object.entries(args)
                // params with undefined value needs to be filtered out, otherwise it'll
                // show up as `?param=undefined`
                .filter(([_, value]) => value !== undefined)
                // array values need special syntax
                .map(([name, value]) => [name, Array.isArray(value) ? `{${value.join(',')}}` : `${value}`])
                .forEach(([name, value]) => {
                url.searchParams.append(name, value);
            });
        }
        else {
            method = 'POST';
            body = args;
        }
        const headers = Object.assign({}, this.headers);
        if (count) {
            headers['Prefer'] = `count=${count}`;
        }
        return new PostgrestFilterBuilder_1.default({
            method,
            url,
            headers,
            schema: this.schemaName,
            body,
            fetch: this.fetch,
            allowEmpty: false,
        });
    }
}
exports["default"] = PostgrestClient;
//# sourceMappingURL=PostgrestClient.js.map

/***/ }),

/***/ "./node_modules/@supabase/postgrest-js/dist/cjs/PostgrestError.js":
/*!************************************************************************!*\
  !*** ./node_modules/@supabase/postgrest-js/dist/cjs/PostgrestError.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Error format
 *
 * {@link https://postgrest.org/en/stable/api.html?highlight=options#errors-and-http-status-codes}
 */
class PostgrestError extends Error {
    constructor(context) {
        super(context.message);
        this.name = 'PostgrestError';
        this.details = context.details;
        this.hint = context.hint;
        this.code = context.code;
    }
}
exports["default"] = PostgrestError;
//# sourceMappingURL=PostgrestError.js.map

/***/ }),

/***/ "./node_modules/@supabase/postgrest-js/dist/cjs/PostgrestFilterBuilder.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@supabase/postgrest-js/dist/cjs/PostgrestFilterBuilder.js ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const PostgrestTransformBuilder_1 = __importDefault(__webpack_require__(/*! ./PostgrestTransformBuilder */ "./node_modules/@supabase/postgrest-js/dist/cjs/PostgrestTransformBuilder.js"));
class PostgrestFilterBuilder extends PostgrestTransformBuilder_1.default {
    /**
     * Match only rows where `column` is equal to `value`.
     *
     * To check if the value of `column` is NULL, you should use `.is()` instead.
     *
     * @param column - The column to filter on
     * @param value - The value to filter with
     */
    eq(column, value) {
        this.url.searchParams.append(column, `eq.${value}`);
        return this;
    }
    /**
     * Match only rows where `column` is not equal to `value`.
     *
     * @param column - The column to filter on
     * @param value - The value to filter with
     */
    neq(column, value) {
        this.url.searchParams.append(column, `neq.${value}`);
        return this;
    }
    /**
     * Match only rows where `column` is greater than `value`.
     *
     * @param column - The column to filter on
     * @param value - The value to filter with
     */
    gt(column, value) {
        this.url.searchParams.append(column, `gt.${value}`);
        return this;
    }
    /**
     * Match only rows where `column` is greater than or equal to `value`.
     *
     * @param column - The column to filter on
     * @param value - The value to filter with
     */
    gte(column, value) {
        this.url.searchParams.append(column, `gte.${value}`);
        return this;
    }
    /**
     * Match only rows where `column` is less than `value`.
     *
     * @param column - The column to filter on
     * @param value - The value to filter with
     */
    lt(column, value) {
        this.url.searchParams.append(column, `lt.${value}`);
        return this;
    }
    /**
     * Match only rows where `column` is less than or equal to `value`.
     *
     * @param column - The column to filter on
     * @param value - The value to filter with
     */
    lte(column, value) {
        this.url.searchParams.append(column, `lte.${value}`);
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
        this.url.searchParams.append(column, `like(all).{${patterns.join(',')}}`);
        return this;
    }
    /**
     * Match only rows where `column` matches any of `patterns` case-sensitively.
     *
     * @param column - The column to filter on
     * @param patterns - The patterns to match with
     */
    likeAnyOf(column, patterns) {
        this.url.searchParams.append(column, `like(any).{${patterns.join(',')}}`);
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
        this.url.searchParams.append(column, `ilike(all).{${patterns.join(',')}}`);
        return this;
    }
    /**
     * Match only rows where `column` matches any of `patterns` case-insensitively.
     *
     * @param column - The column to filter on
     * @param patterns - The patterns to match with
     */
    ilikeAnyOf(column, patterns) {
        this.url.searchParams.append(column, `ilike(any).{${patterns.join(',')}}`);
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
    is(column, value) {
        this.url.searchParams.append(column, `is.${value}`);
        return this;
    }
    /**
     * Match only rows where `column` is included in the `values` array.
     *
     * @param column - The column to filter on
     * @param values - The values array to filter with
     */
    in(column, values) {
        const cleanedValues = Array.from(new Set(values))
            .map((s) => {
            // handle postgrest reserved characters
            // https://postgrest.org/en/v7.0.0/api.html#reserved-characters
            if (typeof s === 'string' && new RegExp('[,()]').test(s))
                return `"${s}"`;
            else
                return `${s}`;
        })
            .join(',');
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
    contains(column, value) {
        if (typeof value === 'string') {
            // range types can be inclusive '[', ']' or exclusive '(', ')' so just
            // keep it simple and accept a string
            this.url.searchParams.append(column, `cs.${value}`);
        }
        else if (Array.isArray(value)) {
            // array
            this.url.searchParams.append(column, `cs.{${value.join(',')}}`);
        }
        else {
            // json
            this.url.searchParams.append(column, `cs.${JSON.stringify(value)}`);
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
    containedBy(column, value) {
        if (typeof value === 'string') {
            // range
            this.url.searchParams.append(column, `cd.${value}`);
        }
        else if (Array.isArray(value)) {
            // array
            this.url.searchParams.append(column, `cd.{${value.join(',')}}`);
        }
        else {
            // json
            this.url.searchParams.append(column, `cd.${JSON.stringify(value)}`);
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
    overlaps(column, value) {
        if (typeof value === 'string') {
            // range
            this.url.searchParams.append(column, `ov.${value}`);
        }
        else {
            // array
            this.url.searchParams.append(column, `ov.{${value.join(',')}}`);
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
        let typePart = '';
        if (type === 'plain') {
            typePart = 'pl';
        }
        else if (type === 'phrase') {
            typePart = 'ph';
        }
        else if (type === 'websearch') {
            typePart = 'w';
        }
        const configPart = config === undefined ? '' : `(${config})`;
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
        Object.entries(query).forEach(([column, value]) => {
            this.url.searchParams.append(column, `eq.${value}`);
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
    not(column, operator, value) {
        this.url.searchParams.append(column, `not.${operator}.${value}`);
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
    or(filters, { foreignTable, referencedTable = foreignTable, } = {}) {
        const key = referencedTable ? `${referencedTable}.or` : 'or';
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
    filter(column, operator, value) {
        this.url.searchParams.append(column, `${operator}.${value}`);
        return this;
    }
}
exports["default"] = PostgrestFilterBuilder;
//# sourceMappingURL=PostgrestFilterBuilder.js.map

/***/ }),

/***/ "./node_modules/@supabase/postgrest-js/dist/cjs/PostgrestQueryBuilder.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@supabase/postgrest-js/dist/cjs/PostgrestQueryBuilder.js ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const PostgrestFilterBuilder_1 = __importDefault(__webpack_require__(/*! ./PostgrestFilterBuilder */ "./node_modules/@supabase/postgrest-js/dist/cjs/PostgrestFilterBuilder.js"));
class PostgrestQueryBuilder {
    constructor(url, { headers = {}, schema, fetch, }) {
        this.url = url;
        this.headers = headers;
        this.schema = schema;
        this.fetch = fetch;
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
    select(columns, { head = false, count, } = {}) {
        const method = head ? 'HEAD' : 'GET';
        // Remove whitespaces except when quoted
        let quoted = false;
        const cleanedColumns = (columns !== null && columns !== void 0 ? columns : '*')
            .split('')
            .map((c) => {
            if (/\s/.test(c) && !quoted) {
                return '';
            }
            if (c === '"') {
                quoted = !quoted;
            }
            return c;
        })
            .join('');
        this.url.searchParams.set('select', cleanedColumns);
        if (count) {
            this.headers['Prefer'] = `count=${count}`;
        }
        return new PostgrestFilterBuilder_1.default({
            method,
            url: this.url,
            headers: this.headers,
            schema: this.schema,
            fetch: this.fetch,
            allowEmpty: false,
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
    insert(values, { count, defaultToNull = true, } = {}) {
        const method = 'POST';
        const prefersHeaders = [];
        if (this.headers['Prefer']) {
            prefersHeaders.push(this.headers['Prefer']);
        }
        if (count) {
            prefersHeaders.push(`count=${count}`);
        }
        if (!defaultToNull) {
            prefersHeaders.push('missing=default');
        }
        this.headers['Prefer'] = prefersHeaders.join(',');
        if (Array.isArray(values)) {
            const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), []);
            if (columns.length > 0) {
                const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`);
                this.url.searchParams.set('columns', uniqueColumns.join(','));
            }
        }
        return new PostgrestFilterBuilder_1.default({
            method,
            url: this.url,
            headers: this.headers,
            schema: this.schema,
            body: values,
            fetch: this.fetch,
            allowEmpty: false,
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
    upsert(values, { onConflict, ignoreDuplicates = false, count, defaultToNull = true, } = {}) {
        const method = 'POST';
        const prefersHeaders = [`resolution=${ignoreDuplicates ? 'ignore' : 'merge'}-duplicates`];
        if (onConflict !== undefined)
            this.url.searchParams.set('on_conflict', onConflict);
        if (this.headers['Prefer']) {
            prefersHeaders.push(this.headers['Prefer']);
        }
        if (count) {
            prefersHeaders.push(`count=${count}`);
        }
        if (!defaultToNull) {
            prefersHeaders.push('missing=default');
        }
        this.headers['Prefer'] = prefersHeaders.join(',');
        if (Array.isArray(values)) {
            const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), []);
            if (columns.length > 0) {
                const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`);
                this.url.searchParams.set('columns', uniqueColumns.join(','));
            }
        }
        return new PostgrestFilterBuilder_1.default({
            method,
            url: this.url,
            headers: this.headers,
            schema: this.schema,
            body: values,
            fetch: this.fetch,
            allowEmpty: false,
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
    update(values, { count, } = {}) {
        const method = 'PATCH';
        const prefersHeaders = [];
        if (this.headers['Prefer']) {
            prefersHeaders.push(this.headers['Prefer']);
        }
        if (count) {
            prefersHeaders.push(`count=${count}`);
        }
        this.headers['Prefer'] = prefersHeaders.join(',');
        return new PostgrestFilterBuilder_1.default({
            method,
            url: this.url,
            headers: this.headers,
            schema: this.schema,
            body: values,
            fetch: this.fetch,
            allowEmpty: false,
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
    delete({ count, } = {}) {
        const method = 'DELETE';
        const prefersHeaders = [];
        if (count) {
            prefersHeaders.push(`count=${count}`);
        }
        if (this.headers['Prefer']) {
            prefersHeaders.unshift(this.headers['Prefer']);
        }
        this.headers['Prefer'] = prefersHeaders.join(',');
        return new PostgrestFilterBuilder_1.default({
            method,
            url: this.url,
            headers: this.headers,
            schema: this.schema,
            fetch: this.fetch,
            allowEmpty: false,
        });
    }
}
exports["default"] = PostgrestQueryBuilder;
//# sourceMappingURL=PostgrestQueryBuilder.js.map

/***/ }),

/***/ "./node_modules/@supabase/postgrest-js/dist/cjs/PostgrestTransformBuilder.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@supabase/postgrest-js/dist/cjs/PostgrestTransformBuilder.js ***!
  \***********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const PostgrestBuilder_1 = __importDefault(__webpack_require__(/*! ./PostgrestBuilder */ "./node_modules/@supabase/postgrest-js/dist/cjs/PostgrestBuilder.js"));
class PostgrestTransformBuilder extends PostgrestBuilder_1.default {
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
        // Remove whitespaces except when quoted
        let quoted = false;
        const cleanedColumns = (columns !== null && columns !== void 0 ? columns : '*')
            .split('')
            .map((c) => {
            if (/\s/.test(c) && !quoted) {
                return '';
            }
            if (c === '"') {
                quoted = !quoted;
            }
            return c;
        })
            .join('');
        this.url.searchParams.set('select', cleanedColumns);
        if (this.headers['Prefer']) {
            this.headers['Prefer'] += ',';
        }
        this.headers['Prefer'] += 'return=representation';
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
    order(column, { ascending = true, nullsFirst, foreignTable, referencedTable = foreignTable, } = {}) {
        const key = referencedTable ? `${referencedTable}.order` : 'order';
        const existingOrder = this.url.searchParams.get(key);
        this.url.searchParams.set(key, `${existingOrder ? `${existingOrder},` : ''}${column}.${ascending ? 'asc' : 'desc'}${nullsFirst === undefined ? '' : nullsFirst ? '.nullsfirst' : '.nullslast'}`);
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
    limit(count, { foreignTable, referencedTable = foreignTable, } = {}) {
        const key = typeof referencedTable === 'undefined' ? 'limit' : `${referencedTable}.limit`;
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
    range(from, to, { foreignTable, referencedTable = foreignTable, } = {}) {
        const keyOffset = typeof referencedTable === 'undefined' ? 'offset' : `${referencedTable}.offset`;
        const keyLimit = typeof referencedTable === 'undefined' ? 'limit' : `${referencedTable}.limit`;
        this.url.searchParams.set(keyOffset, `${from}`);
        // Range is inclusive, so add 1
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
        this.headers['Accept'] = 'application/vnd.pgrst.object+json';
        return this;
    }
    /**
     * Return `data` as a single object instead of an array of objects.
     *
     * Query result must be zero or one row (e.g. using `.limit(1)`), otherwise
     * this returns an error.
     */
    maybeSingle() {
        // Temporary partial fix for https://github.com/supabase/postgrest-js/issues/361
        // Issue persists e.g. for `.insert([...]).select().maybeSingle()`
        if (this.method === 'GET') {
            this.headers['Accept'] = 'application/json';
        }
        else {
            this.headers['Accept'] = 'application/vnd.pgrst.object+json';
        }
        this.isMaybeSingle = true;
        return this;
    }
    /**
     * Return `data` as a string in CSV format.
     */
    csv() {
        this.headers['Accept'] = 'text/csv';
        return this;
    }
    /**
     * Return `data` as an object in [GeoJSON](https://geojson.org) format.
     */
    geojson() {
        this.headers['Accept'] = 'application/geo+json';
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
    explain({ analyze = false, verbose = false, settings = false, buffers = false, wal = false, format = 'text', } = {}) {
        var _a;
        const options = [
            analyze ? 'analyze' : null,
            verbose ? 'verbose' : null,
            settings ? 'settings' : null,
            buffers ? 'buffers' : null,
            wal ? 'wal' : null,
        ]
            .filter(Boolean)
            .join('|');
        // An Accept header can carry multiple media types but postgrest-js always sends one
        const forMediatype = (_a = this.headers['Accept']) !== null && _a !== void 0 ? _a : 'application/json';
        this.headers['Accept'] = `application/vnd.pgrst.plan+${format}; for="${forMediatype}"; options=${options};`;
        if (format === 'json')
            return this;
        else
            return this;
    }
    /**
     * Rollback the query.
     *
     * `data` will still be returned, but the query is not committed.
     */
    rollback() {
        var _a;
        if (((_a = this.headers['Prefer']) !== null && _a !== void 0 ? _a : '').trim().length > 0) {
            this.headers['Prefer'] += ',tx=rollback';
        }
        else {
            this.headers['Prefer'] = 'tx=rollback';
        }
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
}
exports["default"] = PostgrestTransformBuilder;
//# sourceMappingURL=PostgrestTransformBuilder.js.map

/***/ }),

/***/ "./node_modules/@supabase/postgrest-js/dist/cjs/constants.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@supabase/postgrest-js/dist/cjs/constants.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DEFAULT_HEADERS = void 0;
const version_1 = __webpack_require__(/*! ./version */ "./node_modules/@supabase/postgrest-js/dist/cjs/version.js");
exports.DEFAULT_HEADERS = { 'X-Client-Info': `postgrest-js/${version_1.version}` };
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ "./node_modules/@supabase/postgrest-js/dist/cjs/index.js":
/*!***************************************************************!*\
  !*** ./node_modules/@supabase/postgrest-js/dist/cjs/index.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PostgrestError = exports.PostgrestBuilder = exports.PostgrestTransformBuilder = exports.PostgrestFilterBuilder = exports.PostgrestQueryBuilder = exports.PostgrestClient = void 0;
// Always update wrapper.mjs when updating this file.
const PostgrestClient_1 = __importDefault(__webpack_require__(/*! ./PostgrestClient */ "./node_modules/@supabase/postgrest-js/dist/cjs/PostgrestClient.js"));
exports.PostgrestClient = PostgrestClient_1.default;
const PostgrestQueryBuilder_1 = __importDefault(__webpack_require__(/*! ./PostgrestQueryBuilder */ "./node_modules/@supabase/postgrest-js/dist/cjs/PostgrestQueryBuilder.js"));
exports.PostgrestQueryBuilder = PostgrestQueryBuilder_1.default;
const PostgrestFilterBuilder_1 = __importDefault(__webpack_require__(/*! ./PostgrestFilterBuilder */ "./node_modules/@supabase/postgrest-js/dist/cjs/PostgrestFilterBuilder.js"));
exports.PostgrestFilterBuilder = PostgrestFilterBuilder_1.default;
const PostgrestTransformBuilder_1 = __importDefault(__webpack_require__(/*! ./PostgrestTransformBuilder */ "./node_modules/@supabase/postgrest-js/dist/cjs/PostgrestTransformBuilder.js"));
exports.PostgrestTransformBuilder = PostgrestTransformBuilder_1.default;
const PostgrestBuilder_1 = __importDefault(__webpack_require__(/*! ./PostgrestBuilder */ "./node_modules/@supabase/postgrest-js/dist/cjs/PostgrestBuilder.js"));
exports.PostgrestBuilder = PostgrestBuilder_1.default;
const PostgrestError_1 = __importDefault(__webpack_require__(/*! ./PostgrestError */ "./node_modules/@supabase/postgrest-js/dist/cjs/PostgrestError.js"));
exports.PostgrestError = PostgrestError_1.default;
exports["default"] = {
    PostgrestClient: PostgrestClient_1.default,
    PostgrestQueryBuilder: PostgrestQueryBuilder_1.default,
    PostgrestFilterBuilder: PostgrestFilterBuilder_1.default,
    PostgrestTransformBuilder: PostgrestTransformBuilder_1.default,
    PostgrestBuilder: PostgrestBuilder_1.default,
    PostgrestError: PostgrestError_1.default,
};
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@supabase/postgrest-js/dist/cjs/version.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@supabase/postgrest-js/dist/cjs/version.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.version = void 0;
exports.version = '0.0.0-automated';
//# sourceMappingURL=version.js.map

/***/ }),

/***/ "./node_modules/@supabase/postgrest-js/dist/esm/wrapper.mjs":
/*!******************************************************************!*\
  !*** ./node_modules/@supabase/postgrest-js/dist/esm/wrapper.mjs ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PostgrestBuilder: () => (/* binding */ PostgrestBuilder),
/* harmony export */   PostgrestClient: () => (/* binding */ PostgrestClient),
/* harmony export */   PostgrestError: () => (/* binding */ PostgrestError),
/* harmony export */   PostgrestFilterBuilder: () => (/* binding */ PostgrestFilterBuilder),
/* harmony export */   PostgrestQueryBuilder: () => (/* binding */ PostgrestQueryBuilder),
/* harmony export */   PostgrestTransformBuilder: () => (/* binding */ PostgrestTransformBuilder),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cjs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../cjs/index.js */ "./node_modules/@supabase/postgrest-js/dist/cjs/index.js");

const {
  PostgrestClient,
  PostgrestQueryBuilder,
  PostgrestFilterBuilder,
  PostgrestTransformBuilder,
  PostgrestBuilder,
  PostgrestError,
} = _cjs_index_js__WEBPACK_IMPORTED_MODULE_0__



// compatibility with CJS output
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  PostgrestClient,
  PostgrestQueryBuilder,
  PostgrestFilterBuilder,
  PostgrestTransformBuilder,
  PostgrestBuilder,
  PostgrestError,
});


/***/ }),

/***/ "./node_modules/@supabase/realtime-js/dist/module/RealtimeChannel.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@supabase/realtime-js/dist/module/RealtimeChannel.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   REALTIME_CHANNEL_STATES: () => (/* binding */ REALTIME_CHANNEL_STATES),
/* harmony export */   REALTIME_LISTEN_TYPES: () => (/* binding */ REALTIME_LISTEN_TYPES),
/* harmony export */   REALTIME_POSTGRES_CHANGES_LISTEN_EVENT: () => (/* binding */ REALTIME_POSTGRES_CHANGES_LISTEN_EVENT),
/* harmony export */   REALTIME_SUBSCRIBE_STATES: () => (/* binding */ REALTIME_SUBSCRIBE_STATES),
/* harmony export */   "default": () => (/* binding */ RealtimeChannel)
/* harmony export */ });
/* harmony import */ var _lib_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/constants */ "./node_modules/@supabase/realtime-js/dist/module/lib/constants.js");
/* harmony import */ var _lib_push__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/push */ "./node_modules/@supabase/realtime-js/dist/module/lib/push.js");
/* harmony import */ var _lib_timer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/timer */ "./node_modules/@supabase/realtime-js/dist/module/lib/timer.js");
/* harmony import */ var _RealtimePresence__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./RealtimePresence */ "./node_modules/@supabase/realtime-js/dist/module/RealtimePresence.js");
/* harmony import */ var _lib_transformers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lib/transformers */ "./node_modules/@supabase/realtime-js/dist/module/lib/transformers.js");






var REALTIME_POSTGRES_CHANGES_LISTEN_EVENT;
(function (REALTIME_POSTGRES_CHANGES_LISTEN_EVENT) {
    REALTIME_POSTGRES_CHANGES_LISTEN_EVENT["ALL"] = "*";
    REALTIME_POSTGRES_CHANGES_LISTEN_EVENT["INSERT"] = "INSERT";
    REALTIME_POSTGRES_CHANGES_LISTEN_EVENT["UPDATE"] = "UPDATE";
    REALTIME_POSTGRES_CHANGES_LISTEN_EVENT["DELETE"] = "DELETE";
})(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT || (REALTIME_POSTGRES_CHANGES_LISTEN_EVENT = {}));
var REALTIME_LISTEN_TYPES;
(function (REALTIME_LISTEN_TYPES) {
    REALTIME_LISTEN_TYPES["BROADCAST"] = "broadcast";
    REALTIME_LISTEN_TYPES["PRESENCE"] = "presence";
    REALTIME_LISTEN_TYPES["POSTGRES_CHANGES"] = "postgres_changes";
    REALTIME_LISTEN_TYPES["SYSTEM"] = "system";
})(REALTIME_LISTEN_TYPES || (REALTIME_LISTEN_TYPES = {}));
var REALTIME_SUBSCRIBE_STATES;
(function (REALTIME_SUBSCRIBE_STATES) {
    REALTIME_SUBSCRIBE_STATES["SUBSCRIBED"] = "SUBSCRIBED";
    REALTIME_SUBSCRIBE_STATES["TIMED_OUT"] = "TIMED_OUT";
    REALTIME_SUBSCRIBE_STATES["CLOSED"] = "CLOSED";
    REALTIME_SUBSCRIBE_STATES["CHANNEL_ERROR"] = "CHANNEL_ERROR";
})(REALTIME_SUBSCRIBE_STATES || (REALTIME_SUBSCRIBE_STATES = {}));
const REALTIME_CHANNEL_STATES = _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES;
/** A channel is the basic building block of Realtime
 * and narrows the scope of data flow to subscribed clients.
 * You can think of a channel as a chatroom where participants are able to see who's online
 * and send and receive messages.
 */
class RealtimeChannel {
    constructor(
    /** Topic name can be any string. */
    topic, params = { config: {} }, socket) {
        this.topic = topic;
        this.params = params;
        this.socket = socket;
        this.bindings = {};
        this.state = _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.closed;
        this.joinedOnce = false;
        this.pushBuffer = [];
        this.subTopic = topic.replace(/^realtime:/i, '');
        this.params.config = Object.assign({
            broadcast: { ack: false, self: false },
            presence: { key: '' },
            private: false,
        }, params.config);
        this.timeout = this.socket.timeout;
        this.joinPush = new _lib_push__WEBPACK_IMPORTED_MODULE_1__["default"](this, _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_EVENTS.join, this.params, this.timeout);
        this.rejoinTimer = new _lib_timer__WEBPACK_IMPORTED_MODULE_2__["default"](() => this._rejoinUntilConnected(), this.socket.reconnectAfterMs);
        this.joinPush.receive('ok', () => {
            this.state = _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.joined;
            this.rejoinTimer.reset();
            this.pushBuffer.forEach((pushEvent) => pushEvent.send());
            this.pushBuffer = [];
        });
        this._onClose(() => {
            this.rejoinTimer.reset();
            this.socket.log('channel', `close ${this.topic} ${this._joinRef()}`);
            this.state = _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.closed;
            this.socket._remove(this);
        });
        this._onError((reason) => {
            if (this._isLeaving() || this._isClosed()) {
                return;
            }
            this.socket.log('channel', `error ${this.topic}`, reason);
            this.state = _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.errored;
            this.rejoinTimer.scheduleTimeout();
        });
        this.joinPush.receive('timeout', () => {
            if (!this._isJoining()) {
                return;
            }
            this.socket.log('channel', `timeout ${this.topic}`, this.joinPush.timeout);
            this.state = _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.errored;
            this.rejoinTimer.scheduleTimeout();
        });
        this._on(_lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_EVENTS.reply, {}, (payload, ref) => {
            this._trigger(this._replyEventName(ref), payload);
        });
        this.presence = new _RealtimePresence__WEBPACK_IMPORTED_MODULE_3__["default"](this);
        this.broadcastEndpointURL =
            (0,_lib_transformers__WEBPACK_IMPORTED_MODULE_4__.httpEndpointURL)(this.socket.endPoint) + '/api/broadcast';
        this.private = this.params.config.private || false;
    }
    /** Subscribe registers your client with the server */
    subscribe(callback, timeout = this.timeout) {
        var _a, _b;
        if (!this.socket.isConnected()) {
            this.socket.connect();
        }
        if (this.joinedOnce) {
            throw `tried to subscribe multiple times. 'subscribe' can only be called a single time per channel instance`;
        }
        else {
            const { config: { broadcast, presence, private: isPrivate }, } = this.params;
            this._onError((e) => callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR, e));
            this._onClose(() => callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CLOSED));
            const accessTokenPayload = {};
            const config = {
                broadcast,
                presence,
                postgres_changes: (_b = (_a = this.bindings.postgres_changes) === null || _a === void 0 ? void 0 : _a.map((r) => r.filter)) !== null && _b !== void 0 ? _b : [],
                private: isPrivate,
            };
            if (this.socket.accessTokenValue) {
                accessTokenPayload.access_token = this.socket.accessTokenValue;
            }
            this.updateJoinPayload(Object.assign({ config }, accessTokenPayload));
            this.joinedOnce = true;
            this._rejoin(timeout);
            this.joinPush
                .receive('ok', async ({ postgres_changes }) => {
                var _a;
                this.socket.setAuth();
                if (postgres_changes === undefined) {
                    callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.SUBSCRIBED);
                    return;
                }
                else {
                    const clientPostgresBindings = this.bindings.postgres_changes;
                    const bindingsLen = (_a = clientPostgresBindings === null || clientPostgresBindings === void 0 ? void 0 : clientPostgresBindings.length) !== null && _a !== void 0 ? _a : 0;
                    const newPostgresBindings = [];
                    for (let i = 0; i < bindingsLen; i++) {
                        const clientPostgresBinding = clientPostgresBindings[i];
                        const { filter: { event, schema, table, filter }, } = clientPostgresBinding;
                        const serverPostgresFilter = postgres_changes && postgres_changes[i];
                        if (serverPostgresFilter &&
                            serverPostgresFilter.event === event &&
                            serverPostgresFilter.schema === schema &&
                            serverPostgresFilter.table === table &&
                            serverPostgresFilter.filter === filter) {
                            newPostgresBindings.push(Object.assign(Object.assign({}, clientPostgresBinding), { id: serverPostgresFilter.id }));
                        }
                        else {
                            this.unsubscribe();
                            callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR, new Error('mismatch between server and client bindings for postgres changes'));
                            return;
                        }
                    }
                    this.bindings.postgres_changes = newPostgresBindings;
                    callback && callback(REALTIME_SUBSCRIBE_STATES.SUBSCRIBED);
                    return;
                }
            })
                .receive('error', (error) => {
                callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR, new Error(JSON.stringify(Object.values(error).join(', ') || 'error')));
                return;
            })
                .receive('timeout', () => {
                callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.TIMED_OUT);
                return;
            });
        }
        return this;
    }
    presenceState() {
        return this.presence.state;
    }
    async track(payload, opts = {}) {
        return await this.send({
            type: 'presence',
            event: 'track',
            payload,
        }, opts.timeout || this.timeout);
    }
    async untrack(opts = {}) {
        return await this.send({
            type: 'presence',
            event: 'untrack',
        }, opts);
    }
    on(type, filter, callback) {
        return this._on(type, filter, callback);
    }
    /**
     * Sends a message into the channel.
     *
     * @param args Arguments to send to channel
     * @param args.type The type of event to send
     * @param args.event The name of the event being sent
     * @param args.payload Payload to be sent
     * @param opts Options to be used during the send process
     */
    async send(args, opts = {}) {
        var _a, _b;
        if (!this._canPush() && args.type === 'broadcast') {
            const { event, payload: endpoint_payload } = args;
            const authorization = this.socket.accessTokenValue
                ? `Bearer ${this.socket.accessTokenValue}`
                : '';
            const options = {
                method: 'POST',
                headers: {
                    Authorization: authorization,
                    apikey: this.socket.apiKey ? this.socket.apiKey : '',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [
                        {
                            topic: this.subTopic,
                            event,
                            payload: endpoint_payload,
                            private: this.private,
                        },
                    ],
                }),
            };
            try {
                const response = await this._fetchWithTimeout(this.broadcastEndpointURL, options, (_a = opts.timeout) !== null && _a !== void 0 ? _a : this.timeout);
                await ((_b = response.body) === null || _b === void 0 ? void 0 : _b.cancel());
                return response.ok ? 'ok' : 'error';
            }
            catch (error) {
                if (error.name === 'AbortError') {
                    return 'timed out';
                }
                else {
                    return 'error';
                }
            }
        }
        else {
            return new Promise((resolve) => {
                var _a, _b, _c;
                const push = this._push(args.type, args, opts.timeout || this.timeout);
                if (args.type === 'broadcast' && !((_c = (_b = (_a = this.params) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.broadcast) === null || _c === void 0 ? void 0 : _c.ack)) {
                    resolve('ok');
                }
                push.receive('ok', () => resolve('ok'));
                push.receive('error', () => resolve('error'));
                push.receive('timeout', () => resolve('timed out'));
            });
        }
    }
    updateJoinPayload(payload) {
        this.joinPush.updatePayload(payload);
    }
    /**
     * Leaves the channel.
     *
     * Unsubscribes from server events, and instructs channel to terminate on server.
     * Triggers onClose() hooks.
     *
     * To receive leave acknowledgements, use the a `receive` hook to bind to the server ack, ie:
     * channel.unsubscribe().receive("ok", () => alert("left!") )
     */
    unsubscribe(timeout = this.timeout) {
        this.state = _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.leaving;
        const onClose = () => {
            this.socket.log('channel', `leave ${this.topic}`);
            this._trigger(_lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_EVENTS.close, 'leave', this._joinRef());
        };
        this.rejoinTimer.reset();
        // Destroy joinPush to avoid connection timeouts during unscription phase
        this.joinPush.destroy();
        return new Promise((resolve) => {
            const leavePush = new _lib_push__WEBPACK_IMPORTED_MODULE_1__["default"](this, _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_EVENTS.leave, {}, timeout);
            leavePush
                .receive('ok', () => {
                onClose();
                resolve('ok');
            })
                .receive('timeout', () => {
                onClose();
                resolve('timed out');
            })
                .receive('error', () => {
                resolve('error');
            });
            leavePush.send();
            if (!this._canPush()) {
                leavePush.trigger('ok', {});
            }
        });
    }
    /** @internal */
    async _fetchWithTimeout(url, options, timeout) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        const response = await this.socket.fetch(url, Object.assign(Object.assign({}, options), { signal: controller.signal }));
        clearTimeout(id);
        return response;
    }
    /** @internal */
    _push(event, payload, timeout = this.timeout) {
        if (!this.joinedOnce) {
            throw `tried to push '${event}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
        }
        let pushEvent = new _lib_push__WEBPACK_IMPORTED_MODULE_1__["default"](this, event, payload, timeout);
        if (this._canPush()) {
            pushEvent.send();
        }
        else {
            pushEvent.startTimeout();
            this.pushBuffer.push(pushEvent);
        }
        return pushEvent;
    }
    /**
     * Overridable message hook
     *
     * Receives all events for specialized message handling before dispatching to the channel callbacks.
     * Must return the payload, modified or unmodified.
     *
     * @internal
     */
    _onMessage(_event, payload, _ref) {
        return payload;
    }
    /** @internal */
    _isMember(topic) {
        return this.topic === topic;
    }
    /** @internal */
    _joinRef() {
        return this.joinPush.ref;
    }
    /** @internal */
    _trigger(type, payload, ref) {
        var _a, _b;
        const typeLower = type.toLocaleLowerCase();
        const { close, error, leave, join } = _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_EVENTS;
        const events = [close, error, leave, join];
        if (ref && events.indexOf(typeLower) >= 0 && ref !== this._joinRef()) {
            return;
        }
        let handledPayload = this._onMessage(typeLower, payload, ref);
        if (payload && !handledPayload) {
            throw 'channel onMessage callbacks must return the payload, modified or unmodified';
        }
        if (['insert', 'update', 'delete'].includes(typeLower)) {
            (_a = this.bindings.postgres_changes) === null || _a === void 0 ? void 0 : _a.filter((bind) => {
                var _a, _b, _c;
                return (((_a = bind.filter) === null || _a === void 0 ? void 0 : _a.event) === '*' ||
                    ((_c = (_b = bind.filter) === null || _b === void 0 ? void 0 : _b.event) === null || _c === void 0 ? void 0 : _c.toLocaleLowerCase()) === typeLower);
            }).map((bind) => bind.callback(handledPayload, ref));
        }
        else {
            (_b = this.bindings[typeLower]) === null || _b === void 0 ? void 0 : _b.filter((bind) => {
                var _a, _b, _c, _d, _e, _f;
                if (['broadcast', 'presence', 'postgres_changes'].includes(typeLower)) {
                    if ('id' in bind) {
                        const bindId = bind.id;
                        const bindEvent = (_a = bind.filter) === null || _a === void 0 ? void 0 : _a.event;
                        return (bindId &&
                            ((_b = payload.ids) === null || _b === void 0 ? void 0 : _b.includes(bindId)) &&
                            (bindEvent === '*' ||
                                (bindEvent === null || bindEvent === void 0 ? void 0 : bindEvent.toLocaleLowerCase()) ===
                                    ((_c = payload.data) === null || _c === void 0 ? void 0 : _c.type.toLocaleLowerCase())));
                    }
                    else {
                        const bindEvent = (_e = (_d = bind === null || bind === void 0 ? void 0 : bind.filter) === null || _d === void 0 ? void 0 : _d.event) === null || _e === void 0 ? void 0 : _e.toLocaleLowerCase();
                        return (bindEvent === '*' ||
                            bindEvent === ((_f = payload === null || payload === void 0 ? void 0 : payload.event) === null || _f === void 0 ? void 0 : _f.toLocaleLowerCase()));
                    }
                }
                else {
                    return bind.type.toLocaleLowerCase() === typeLower;
                }
            }).map((bind) => {
                if (typeof handledPayload === 'object' && 'ids' in handledPayload) {
                    const postgresChanges = handledPayload.data;
                    const { schema, table, commit_timestamp, type, errors } = postgresChanges;
                    const enrichedPayload = {
                        schema: schema,
                        table: table,
                        commit_timestamp: commit_timestamp,
                        eventType: type,
                        new: {},
                        old: {},
                        errors: errors,
                    };
                    handledPayload = Object.assign(Object.assign({}, enrichedPayload), this._getPayloadRecords(postgresChanges));
                }
                bind.callback(handledPayload, ref);
            });
        }
    }
    /** @internal */
    _isClosed() {
        return this.state === _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.closed;
    }
    /** @internal */
    _isJoined() {
        return this.state === _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.joined;
    }
    /** @internal */
    _isJoining() {
        return this.state === _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.joining;
    }
    /** @internal */
    _isLeaving() {
        return this.state === _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.leaving;
    }
    /** @internal */
    _replyEventName(ref) {
        return `chan_reply_${ref}`;
    }
    /** @internal */
    _on(type, filter, callback) {
        const typeLower = type.toLocaleLowerCase();
        const binding = {
            type: typeLower,
            filter: filter,
            callback: callback,
        };
        if (this.bindings[typeLower]) {
            this.bindings[typeLower].push(binding);
        }
        else {
            this.bindings[typeLower] = [binding];
        }
        return this;
    }
    /** @internal */
    _off(type, filter) {
        const typeLower = type.toLocaleLowerCase();
        this.bindings[typeLower] = this.bindings[typeLower].filter((bind) => {
            var _a;
            return !(((_a = bind.type) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase()) === typeLower &&
                RealtimeChannel.isEqual(bind.filter, filter));
        });
        return this;
    }
    /** @internal */
    static isEqual(obj1, obj2) {
        if (Object.keys(obj1).length !== Object.keys(obj2).length) {
            return false;
        }
        for (const k in obj1) {
            if (obj1[k] !== obj2[k]) {
                return false;
            }
        }
        return true;
    }
    /** @internal */
    _rejoinUntilConnected() {
        this.rejoinTimer.scheduleTimeout();
        if (this.socket.isConnected()) {
            this._rejoin();
        }
    }
    /**
     * Registers a callback that will be executed when the channel closes.
     *
     * @internal
     */
    _onClose(callback) {
        this._on(_lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_EVENTS.close, {}, callback);
    }
    /**
     * Registers a callback that will be executed when the channel encounteres an error.
     *
     * @internal
     */
    _onError(callback) {
        this._on(_lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_EVENTS.error, {}, (reason) => callback(reason));
    }
    /**
     * Returns `true` if the socket is connected and the channel has been joined.
     *
     * @internal
     */
    _canPush() {
        return this.socket.isConnected() && this._isJoined();
    }
    /** @internal */
    _rejoin(timeout = this.timeout) {
        if (this._isLeaving()) {
            return;
        }
        this.socket._leaveOpenTopic(this.topic);
        this.state = _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_STATES.joining;
        this.joinPush.resend(timeout);
    }
    /** @internal */
    _getPayloadRecords(payload) {
        const records = {
            new: {},
            old: {},
        };
        if (payload.type === 'INSERT' || payload.type === 'UPDATE') {
            records.new = _lib_transformers__WEBPACK_IMPORTED_MODULE_4__.convertChangeData(payload.columns, payload.record);
        }
        if (payload.type === 'UPDATE' || payload.type === 'DELETE') {
            records.old = _lib_transformers__WEBPACK_IMPORTED_MODULE_4__.convertChangeData(payload.columns, payload.old_record);
        }
        return records;
    }
}
//# sourceMappingURL=RealtimeChannel.js.map

/***/ }),

/***/ "./node_modules/@supabase/realtime-js/dist/module/RealtimeClient.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@supabase/realtime-js/dist/module/RealtimeClient.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RealtimeClient)
/* harmony export */ });
/* harmony import */ var _lib_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/constants */ "./node_modules/@supabase/realtime-js/dist/module/lib/constants.js");
/* harmony import */ var _lib_serializer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/serializer */ "./node_modules/@supabase/realtime-js/dist/module/lib/serializer.js");
/* harmony import */ var _lib_timer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/timer */ "./node_modules/@supabase/realtime-js/dist/module/lib/timer.js");
/* harmony import */ var _lib_transformers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/transformers */ "./node_modules/@supabase/realtime-js/dist/module/lib/transformers.js");
/* harmony import */ var _RealtimeChannel__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./RealtimeChannel */ "./node_modules/@supabase/realtime-js/dist/module/RealtimeChannel.js");





const noop = () => { };
const NATIVE_WEBSOCKET_AVAILABLE = typeof WebSocket !== 'undefined';
const WORKER_SCRIPT = `
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`;
class RealtimeClient {
    /**
     * Initializes the Socket.
     *
     * @param endPoint The string WebSocket endpoint, ie, "ws://example.com/socket", "wss://example.com", "/socket" (inherited host & protocol)
     * @param httpEndpoint The string HTTP endpoint, ie, "https://example.com", "/" (inherited host & protocol)
     * @param options.transport The Websocket Transport, for example WebSocket.
     * @param options.timeout The default timeout in milliseconds to trigger push timeouts.
     * @param options.params The optional params to pass when connecting.
     * @param options.headers The optional headers to pass when connecting.
     * @param options.heartbeatIntervalMs The millisec interval to send a heartbeat message.
     * @param options.logger The optional function for specialized logging, ie: logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
     * @param options.encode The function to encode outgoing messages. Defaults to JSON: (payload, callback) => callback(JSON.stringify(payload))
     * @param options.decode The function to decode incoming messages. Defaults to Serializer's decode.
     * @param options.reconnectAfterMs he optional function that returns the millsec reconnect interval. Defaults to stepped backoff off.
     * @param options.worker Use Web Worker to set a side flow. Defaults to false.
     * @param options.workerUrl The URL of the worker script. Defaults to https://realtime.supabase.com/worker.js that includes a heartbeat event call to keep the connection alive.
     */
    constructor(endPoint, options) {
        var _a;
        this.accessTokenValue = null;
        this.apiKey = null;
        this.channels = [];
        this.endPoint = '';
        this.httpEndpoint = '';
        this.headers = _lib_constants__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_HEADERS;
        this.params = {};
        this.timeout = _lib_constants__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_TIMEOUT;
        this.heartbeatIntervalMs = 30000;
        this.heartbeatTimer = undefined;
        this.pendingHeartbeatRef = null;
        this.ref = 0;
        this.logger = noop;
        this.conn = null;
        this.sendBuffer = [];
        this.serializer = new _lib_serializer__WEBPACK_IMPORTED_MODULE_1__["default"]();
        this.stateChangeCallbacks = {
            open: [],
            close: [],
            error: [],
            message: [],
        };
        this.accessToken = null;
        /**
         * Use either custom fetch, if provided, or default fetch to make HTTP requests
         *
         * @internal
         */
        this._resolveFetch = (customFetch) => {
            let _fetch;
            if (customFetch) {
                _fetch = customFetch;
            }
            else if (typeof fetch === 'undefined') {
                _fetch = (...args) => Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! @supabase/node-fetch */ "./node_modules/@supabase/node-fetch/browser.js")).then(({ default: fetch }) => fetch(...args));
            }
            else {
                _fetch = fetch;
            }
            return (...args) => _fetch(...args);
        };
        this.endPoint = `${endPoint}/${_lib_constants__WEBPACK_IMPORTED_MODULE_0__.TRANSPORTS.websocket}`;
        this.httpEndpoint = (0,_lib_transformers__WEBPACK_IMPORTED_MODULE_3__.httpEndpointURL)(endPoint);
        if (options === null || options === void 0 ? void 0 : options.transport) {
            this.transport = options.transport;
        }
        else {
            this.transport = null;
        }
        if (options === null || options === void 0 ? void 0 : options.params)
            this.params = options.params;
        if (options === null || options === void 0 ? void 0 : options.headers)
            this.headers = Object.assign(Object.assign({}, this.headers), options.headers);
        if (options === null || options === void 0 ? void 0 : options.timeout)
            this.timeout = options.timeout;
        if (options === null || options === void 0 ? void 0 : options.logger)
            this.logger = options.logger;
        if (options === null || options === void 0 ? void 0 : options.heartbeatIntervalMs)
            this.heartbeatIntervalMs = options.heartbeatIntervalMs;
        const accessTokenValue = (_a = options === null || options === void 0 ? void 0 : options.params) === null || _a === void 0 ? void 0 : _a.apikey;
        if (accessTokenValue) {
            this.accessTokenValue = accessTokenValue;
            this.apiKey = accessTokenValue;
        }
        this.reconnectAfterMs = (options === null || options === void 0 ? void 0 : options.reconnectAfterMs)
            ? options.reconnectAfterMs
            : (tries) => {
                return [1000, 2000, 5000, 10000][tries - 1] || 10000;
            };
        this.encode = (options === null || options === void 0 ? void 0 : options.encode)
            ? options.encode
            : (payload, callback) => {
                return callback(JSON.stringify(payload));
            };
        this.decode = (options === null || options === void 0 ? void 0 : options.decode)
            ? options.decode
            : this.serializer.decode.bind(this.serializer);
        this.reconnectTimer = new _lib_timer__WEBPACK_IMPORTED_MODULE_2__["default"](async () => {
            this.disconnect();
            this.connect();
        }, this.reconnectAfterMs);
        this.fetch = this._resolveFetch(options === null || options === void 0 ? void 0 : options.fetch);
        if (options === null || options === void 0 ? void 0 : options.worker) {
            if (typeof window !== 'undefined' && !window.Worker) {
                throw new Error('Web Worker is not supported');
            }
            this.worker = (options === null || options === void 0 ? void 0 : options.worker) || false;
            this.workerUrl = options === null || options === void 0 ? void 0 : options.workerUrl;
        }
        this.accessToken = (options === null || options === void 0 ? void 0 : options.accessToken) || null;
    }
    /**
     * Connects the socket, unless already connected.
     */
    connect() {
        if (this.conn) {
            return;
        }
        if (this.transport) {
            this.conn = new this.transport(this.endpointURL(), undefined, {
                headers: this.headers,
            });
            return;
        }
        if (NATIVE_WEBSOCKET_AVAILABLE) {
            this.conn = new WebSocket(this.endpointURL());
            this.setupConnection();
            return;
        }
        this.conn = new WSWebSocketDummy(this.endpointURL(), undefined, {
            close: () => {
                this.conn = null;
            },
        });
        __webpack_require__.e(/*! import() */ "node_modules_ws_browser_js").then(__webpack_require__.t.bind(__webpack_require__, /*! ws */ "./node_modules/ws/browser.js", 23)).then(({ default: WS }) => {
            this.conn = new WS(this.endpointURL(), undefined, {
                headers: this.headers,
            });
            this.setupConnection();
        });
    }
    /**
     * Returns the URL of the websocket.
     * @returns string The URL of the websocket.
     */
    endpointURL() {
        return this._appendParams(this.endPoint, Object.assign({}, this.params, { vsn: _lib_constants__WEBPACK_IMPORTED_MODULE_0__.VSN }));
    }
    /**
     * Disconnects the socket.
     *
     * @param code A numeric status code to send on disconnect.
     * @param reason A custom reason for the disconnect.
     */
    disconnect(code, reason) {
        if (this.conn) {
            this.conn.onclose = function () { }; // noop
            if (code) {
                this.conn.close(code, reason !== null && reason !== void 0 ? reason : '');
            }
            else {
                this.conn.close();
            }
            this.conn = null;
            // remove open handles
            this.heartbeatTimer && clearInterval(this.heartbeatTimer);
            this.reconnectTimer.reset();
        }
    }
    /**
     * Returns all created channels
     */
    getChannels() {
        return this.channels;
    }
    /**
     * Unsubscribes and removes a single channel
     * @param channel A RealtimeChannel instance
     */
    async removeChannel(channel) {
        const status = await channel.unsubscribe();
        if (this.channels.length === 0) {
            this.disconnect();
        }
        return status;
    }
    /**
     * Unsubscribes and removes all channels
     */
    async removeAllChannels() {
        const values_1 = await Promise.all(this.channels.map((channel) => channel.unsubscribe()));
        this.disconnect();
        return values_1;
    }
    /**
     * Logs the message.
     *
     * For customized logging, `this.logger` can be overridden.
     */
    log(kind, msg, data) {
        this.logger(kind, msg, data);
    }
    /**
     * Returns the current state of the socket.
     */
    connectionState() {
        switch (this.conn && this.conn.readyState) {
            case _lib_constants__WEBPACK_IMPORTED_MODULE_0__.SOCKET_STATES.connecting:
                return _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CONNECTION_STATE.Connecting;
            case _lib_constants__WEBPACK_IMPORTED_MODULE_0__.SOCKET_STATES.open:
                return _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CONNECTION_STATE.Open;
            case _lib_constants__WEBPACK_IMPORTED_MODULE_0__.SOCKET_STATES.closing:
                return _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CONNECTION_STATE.Closing;
            default:
                return _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CONNECTION_STATE.Closed;
        }
    }
    /**
     * Returns `true` is the connection is open.
     */
    isConnected() {
        return this.connectionState() === _lib_constants__WEBPACK_IMPORTED_MODULE_0__.CONNECTION_STATE.Open;
    }
    channel(topic, params = { config: {} }) {
        const chan = new _RealtimeChannel__WEBPACK_IMPORTED_MODULE_4__["default"](`realtime:${topic}`, params, this);
        this.channels.push(chan);
        return chan;
    }
    /**
     * Push out a message if the socket is connected.
     *
     * If the socket is not connected, the message gets enqueued within a local buffer, and sent out when a connection is next established.
     */
    push(data) {
        const { topic, event, payload, ref } = data;
        const callback = () => {
            this.encode(data, (result) => {
                var _a;
                (_a = this.conn) === null || _a === void 0 ? void 0 : _a.send(result);
            });
        };
        this.log('push', `${topic} ${event} (${ref})`, payload);
        if (this.isConnected()) {
            callback();
        }
        else {
            this.sendBuffer.push(callback);
        }
    }
    /**
     * Sets the JWT access token used for channel subscription authorization and Realtime RLS.
     *
     * If param is null it will use the `accessToken` callback function or the token set on the client.
     *
     * On callback used, it will set the value of the token internal to the client.
     *
     * @param token A JWT string to override the token set on the client.
     */
    async setAuth(token = null) {
        let tokenToSend = token ||
            (this.accessToken && (await this.accessToken())) ||
            this.accessTokenValue;
        if (tokenToSend) {
            let parsed = null;
            try {
                parsed = JSON.parse(atob(tokenToSend.split('.')[1]));
            }
            catch (_error) { }
            if (parsed && parsed.exp) {
                let now = Math.floor(Date.now() / 1000);
                let valid = now - parsed.exp < 0;
                if (!valid) {
                    this.log('auth', `InvalidJWTToken: Invalid value for JWT claim "exp" with value ${parsed.exp}`);
                    return Promise.reject(`InvalidJWTToken: Invalid value for JWT claim "exp" with value ${parsed.exp}`);
                }
            }
            this.accessTokenValue = tokenToSend;
            this.channels.forEach((channel) => {
                tokenToSend && channel.updateJoinPayload({ access_token: tokenToSend });
                if (channel.joinedOnce && channel._isJoined()) {
                    channel._push(_lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_EVENTS.access_token, {
                        access_token: tokenToSend,
                    });
                }
            });
        }
    }
    /**
     * Sends a heartbeat message if the socket is connected.
     */
    async sendHeartbeat() {
        var _a;
        if (!this.isConnected()) {
            return;
        }
        if (this.pendingHeartbeatRef) {
            this.pendingHeartbeatRef = null;
            this.log('transport', 'heartbeat timeout. Attempting to re-establish connection');
            (_a = this.conn) === null || _a === void 0 ? void 0 : _a.close(_lib_constants__WEBPACK_IMPORTED_MODULE_0__.WS_CLOSE_NORMAL, 'hearbeat timeout');
            return;
        }
        this.pendingHeartbeatRef = this._makeRef();
        this.push({
            topic: 'phoenix',
            event: 'heartbeat',
            payload: {},
            ref: this.pendingHeartbeatRef,
        });
        this.setAuth();
    }
    /**
     * Flushes send buffer
     */
    flushSendBuffer() {
        if (this.isConnected() && this.sendBuffer.length > 0) {
            this.sendBuffer.forEach((callback) => callback());
            this.sendBuffer = [];
        }
    }
    /**
     * Return the next message ref, accounting for overflows
     *
     * @internal
     */
    _makeRef() {
        let newRef = this.ref + 1;
        if (newRef === this.ref) {
            this.ref = 0;
        }
        else {
            this.ref = newRef;
        }
        return this.ref.toString();
    }
    /**
     * Unsubscribe from channels with the specified topic.
     *
     * @internal
     */
    _leaveOpenTopic(topic) {
        let dupChannel = this.channels.find((c) => c.topic === topic && (c._isJoined() || c._isJoining()));
        if (dupChannel) {
            this.log('transport', `leaving duplicate topic "${topic}"`);
            dupChannel.unsubscribe();
        }
    }
    /**
     * Removes a subscription from the socket.
     *
     * @param channel An open subscription.
     *
     * @internal
     */
    _remove(channel) {
        this.channels = this.channels.filter((c) => c._joinRef() !== channel._joinRef());
    }
    /**
     * Sets up connection handlers.
     *
     * @internal
     */
    setupConnection() {
        if (this.conn) {
            this.conn.binaryType = 'arraybuffer';
            this.conn.onopen = () => this._onConnOpen();
            this.conn.onerror = (error) => this._onConnError(error);
            this.conn.onmessage = (event) => this._onConnMessage(event);
            this.conn.onclose = (event) => this._onConnClose(event);
        }
    }
    /** @internal */
    _onConnMessage(rawMessage) {
        this.decode(rawMessage.data, (msg) => {
            let { topic, event, payload, ref } = msg;
            if (ref && ref === this.pendingHeartbeatRef) {
                this.pendingHeartbeatRef = null;
            }
            this.log('receive', `${payload.status || ''} ${topic} ${event} ${(ref && '(' + ref + ')') || ''}`, payload);
            this.channels
                .filter((channel) => channel._isMember(topic))
                .forEach((channel) => channel._trigger(event, payload, ref));
            this.stateChangeCallbacks.message.forEach((callback) => callback(msg));
        });
    }
    /** @internal */
    async _onConnOpen() {
        this.log('transport', `connected to ${this.endpointURL()}`);
        this.flushSendBuffer();
        this.reconnectTimer.reset();
        if (!this.worker) {
            this.heartbeatTimer && clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = setInterval(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
        }
        else {
            if (this.workerUrl) {
                this.log('worker', `starting worker for from ${this.workerUrl}`);
            }
            else {
                this.log('worker', `starting default worker`);
            }
            const objectUrl = this._workerObjectUrl(this.workerUrl);
            this.workerRef = new Worker(objectUrl);
            this.workerRef.onerror = (error) => {
                this.log('worker', 'worker error', error.message);
                this.workerRef.terminate();
            };
            this.workerRef.onmessage = (event) => {
                if (event.data.event === 'keepAlive') {
                    this.sendHeartbeat();
                }
            };
            this.workerRef.postMessage({
                event: 'start',
                interval: this.heartbeatIntervalMs,
            });
        }
        this.stateChangeCallbacks.open.forEach((callback) => callback());
    }
    /** @internal */
    _onConnClose(event) {
        this.log('transport', 'close', event);
        this._triggerChanError();
        this.heartbeatTimer && clearInterval(this.heartbeatTimer);
        this.reconnectTimer.scheduleTimeout();
        this.stateChangeCallbacks.close.forEach((callback) => callback(event));
    }
    /** @internal */
    _onConnError(error) {
        this.log('transport', error.message);
        this._triggerChanError();
        this.stateChangeCallbacks.error.forEach((callback) => callback(error));
    }
    /** @internal */
    _triggerChanError() {
        this.channels.forEach((channel) => channel._trigger(_lib_constants__WEBPACK_IMPORTED_MODULE_0__.CHANNEL_EVENTS.error));
    }
    /** @internal */
    _appendParams(url, params) {
        if (Object.keys(params).length === 0) {
            return url;
        }
        const prefix = url.match(/\?/) ? '&' : '?';
        const query = new URLSearchParams(params);
        return `${url}${prefix}${query}`;
    }
    _workerObjectUrl(url) {
        let result_url;
        if (url) {
            result_url = url;
        }
        else {
            const blob = new Blob([WORKER_SCRIPT], { type: 'application/javascript' });
            result_url = URL.createObjectURL(blob);
        }
        return result_url;
    }
}
class WSWebSocketDummy {
    constructor(address, _protocols, options) {
        this.binaryType = 'arraybuffer';
        this.onclose = () => { };
        this.onerror = () => { };
        this.onmessage = () => { };
        this.onopen = () => { };
        this.readyState = _lib_constants__WEBPACK_IMPORTED_MODULE_0__.SOCKET_STATES.connecting;
        this.send = () => { };
        this.url = null;
        this.url = address;
        this.close = options.close;
    }
}
//# sourceMappingURL=RealtimeClient.js.map

/***/ }),

/***/ "./node_modules/@supabase/realtime-js/dist/module/RealtimePresence.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@supabase/realtime-js/dist/module/RealtimePresence.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   REALTIME_PRESENCE_LISTEN_EVENTS: () => (/* binding */ REALTIME_PRESENCE_LISTEN_EVENTS),
/* harmony export */   "default": () => (/* binding */ RealtimePresence)
/* harmony export */ });
/*
  This file draws heavily from https://github.com/phoenixframework/phoenix/blob/d344ec0a732ab4ee204215b31de69cf4be72e3bf/assets/js/phoenix/presence.js
  License: https://github.com/phoenixframework/phoenix/blob/d344ec0a732ab4ee204215b31de69cf4be72e3bf/LICENSE.md
*/
var REALTIME_PRESENCE_LISTEN_EVENTS;
(function (REALTIME_PRESENCE_LISTEN_EVENTS) {
    REALTIME_PRESENCE_LISTEN_EVENTS["SYNC"] = "sync";
    REALTIME_PRESENCE_LISTEN_EVENTS["JOIN"] = "join";
    REALTIME_PRESENCE_LISTEN_EVENTS["LEAVE"] = "leave";
})(REALTIME_PRESENCE_LISTEN_EVENTS || (REALTIME_PRESENCE_LISTEN_EVENTS = {}));
class RealtimePresence {
    /**
     * Initializes the Presence.
     *
     * @param channel - The RealtimeChannel
     * @param opts - The options,
     *        for example `{events: {state: 'state', diff: 'diff'}}`
     */
    constructor(channel, opts) {
        this.channel = channel;
        this.state = {};
        this.pendingDiffs = [];
        this.joinRef = null;
        this.caller = {
            onJoin: () => { },
            onLeave: () => { },
            onSync: () => { },
        };
        const events = (opts === null || opts === void 0 ? void 0 : opts.events) || {
            state: 'presence_state',
            diff: 'presence_diff',
        };
        this.channel._on(events.state, {}, (newState) => {
            const { onJoin, onLeave, onSync } = this.caller;
            this.joinRef = this.channel._joinRef();
            this.state = RealtimePresence.syncState(this.state, newState, onJoin, onLeave);
            this.pendingDiffs.forEach((diff) => {
                this.state = RealtimePresence.syncDiff(this.state, diff, onJoin, onLeave);
            });
            this.pendingDiffs = [];
            onSync();
        });
        this.channel._on(events.diff, {}, (diff) => {
            const { onJoin, onLeave, onSync } = this.caller;
            if (this.inPendingSyncState()) {
                this.pendingDiffs.push(diff);
            }
            else {
                this.state = RealtimePresence.syncDiff(this.state, diff, onJoin, onLeave);
                onSync();
            }
        });
        this.onJoin((key, currentPresences, newPresences) => {
            this.channel._trigger('presence', {
                event: 'join',
                key,
                currentPresences,
                newPresences,
            });
        });
        this.onLeave((key, currentPresences, leftPresences) => {
            this.channel._trigger('presence', {
                event: 'leave',
                key,
                currentPresences,
                leftPresences,
            });
        });
        this.onSync(() => {
            this.channel._trigger('presence', { event: 'sync' });
        });
    }
    /**
     * Used to sync the list of presences on the server with the
     * client's state.
     *
     * An optional `onJoin` and `onLeave` callback can be provided to
     * react to changes in the client's local presences across
     * disconnects and reconnects with the server.
     *
     * @internal
     */
    static syncState(currentState, newState, onJoin, onLeave) {
        const state = this.cloneDeep(currentState);
        const transformedState = this.transformState(newState);
        const joins = {};
        const leaves = {};
        this.map(state, (key, presences) => {
            if (!transformedState[key]) {
                leaves[key] = presences;
            }
        });
        this.map(transformedState, (key, newPresences) => {
            const currentPresences = state[key];
            if (currentPresences) {
                const newPresenceRefs = newPresences.map((m) => m.presence_ref);
                const curPresenceRefs = currentPresences.map((m) => m.presence_ref);
                const joinedPresences = newPresences.filter((m) => curPresenceRefs.indexOf(m.presence_ref) < 0);
                const leftPresences = currentPresences.filter((m) => newPresenceRefs.indexOf(m.presence_ref) < 0);
                if (joinedPresences.length > 0) {
                    joins[key] = joinedPresences;
                }
                if (leftPresences.length > 0) {
                    leaves[key] = leftPresences;
                }
            }
            else {
                joins[key] = newPresences;
            }
        });
        return this.syncDiff(state, { joins, leaves }, onJoin, onLeave);
    }
    /**
     * Used to sync a diff of presence join and leave events from the
     * server, as they happen.
     *
     * Like `syncState`, `syncDiff` accepts optional `onJoin` and
     * `onLeave` callbacks to react to a user joining or leaving from a
     * device.
     *
     * @internal
     */
    static syncDiff(state, diff, onJoin, onLeave) {
        const { joins, leaves } = {
            joins: this.transformState(diff.joins),
            leaves: this.transformState(diff.leaves),
        };
        if (!onJoin) {
            onJoin = () => { };
        }
        if (!onLeave) {
            onLeave = () => { };
        }
        this.map(joins, (key, newPresences) => {
            var _a;
            const currentPresences = (_a = state[key]) !== null && _a !== void 0 ? _a : [];
            state[key] = this.cloneDeep(newPresences);
            if (currentPresences.length > 0) {
                const joinedPresenceRefs = state[key].map((m) => m.presence_ref);
                const curPresences = currentPresences.filter((m) => joinedPresenceRefs.indexOf(m.presence_ref) < 0);
                state[key].unshift(...curPresences);
            }
            onJoin(key, currentPresences, newPresences);
        });
        this.map(leaves, (key, leftPresences) => {
            let currentPresences = state[key];
            if (!currentPresences)
                return;
            const presenceRefsToRemove = leftPresences.map((m) => m.presence_ref);
            currentPresences = currentPresences.filter((m) => presenceRefsToRemove.indexOf(m.presence_ref) < 0);
            state[key] = currentPresences;
            onLeave(key, currentPresences, leftPresences);
            if (currentPresences.length === 0)
                delete state[key];
        });
        return state;
    }
    /** @internal */
    static map(obj, func) {
        return Object.getOwnPropertyNames(obj).map((key) => func(key, obj[key]));
    }
    /**
     * Remove 'metas' key
     * Change 'phx_ref' to 'presence_ref'
     * Remove 'phx_ref' and 'phx_ref_prev'
     *
     * @example
     * // returns {
     *  abc123: [
     *    { presence_ref: '2', user_id: 1 },
     *    { presence_ref: '3', user_id: 2 }
     *  ]
     * }
     * RealtimePresence.transformState({
     *  abc123: {
     *    metas: [
     *      { phx_ref: '2', phx_ref_prev: '1' user_id: 1 },
     *      { phx_ref: '3', user_id: 2 }
     *    ]
     *  }
     * })
     *
     * @internal
     */
    static transformState(state) {
        state = this.cloneDeep(state);
        return Object.getOwnPropertyNames(state).reduce((newState, key) => {
            const presences = state[key];
            if ('metas' in presences) {
                newState[key] = presences.metas.map((presence) => {
                    presence['presence_ref'] = presence['phx_ref'];
                    delete presence['phx_ref'];
                    delete presence['phx_ref_prev'];
                    return presence;
                });
            }
            else {
                newState[key] = presences;
            }
            return newState;
        }, {});
    }
    /** @internal */
    static cloneDeep(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    /** @internal */
    onJoin(callback) {
        this.caller.onJoin = callback;
    }
    /** @internal */
    onLeave(callback) {
        this.caller.onLeave = callback;
    }
    /** @internal */
    onSync(callback) {
        this.caller.onSync = callback;
    }
    /** @internal */
    inPendingSyncState() {
        return !this.joinRef || this.joinRef !== this.channel._joinRef();
    }
}
//# sourceMappingURL=RealtimePresence.js.map

/***/ }),

/***/ "./node_modules/@supabase/realtime-js/dist/module/index.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@supabase/realtime-js/dist/module/index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   REALTIME_CHANNEL_STATES: () => (/* reexport safe */ _RealtimeChannel__WEBPACK_IMPORTED_MODULE_1__.REALTIME_CHANNEL_STATES),
/* harmony export */   REALTIME_LISTEN_TYPES: () => (/* reexport safe */ _RealtimeChannel__WEBPACK_IMPORTED_MODULE_1__.REALTIME_LISTEN_TYPES),
/* harmony export */   REALTIME_POSTGRES_CHANGES_LISTEN_EVENT: () => (/* reexport safe */ _RealtimeChannel__WEBPACK_IMPORTED_MODULE_1__.REALTIME_POSTGRES_CHANGES_LISTEN_EVENT),
/* harmony export */   REALTIME_PRESENCE_LISTEN_EVENTS: () => (/* reexport safe */ _RealtimePresence__WEBPACK_IMPORTED_MODULE_2__.REALTIME_PRESENCE_LISTEN_EVENTS),
/* harmony export */   REALTIME_SUBSCRIBE_STATES: () => (/* reexport safe */ _RealtimeChannel__WEBPACK_IMPORTED_MODULE_1__.REALTIME_SUBSCRIBE_STATES),
/* harmony export */   RealtimeChannel: () => (/* reexport safe */ _RealtimeChannel__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   RealtimeClient: () => (/* reexport safe */ _RealtimeClient__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   RealtimePresence: () => (/* reexport safe */ _RealtimePresence__WEBPACK_IMPORTED_MODULE_2__["default"])
/* harmony export */ });
/* harmony import */ var _RealtimeClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./RealtimeClient */ "./node_modules/@supabase/realtime-js/dist/module/RealtimeClient.js");
/* harmony import */ var _RealtimeChannel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./RealtimeChannel */ "./node_modules/@supabase/realtime-js/dist/module/RealtimeChannel.js");
/* harmony import */ var _RealtimePresence__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./RealtimePresence */ "./node_modules/@supabase/realtime-js/dist/module/RealtimePresence.js");




//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@supabase/realtime-js/dist/module/lib/constants.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@supabase/realtime-js/dist/module/lib/constants.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CHANNEL_EVENTS: () => (/* binding */ CHANNEL_EVENTS),
/* harmony export */   CHANNEL_STATES: () => (/* binding */ CHANNEL_STATES),
/* harmony export */   CONNECTION_STATE: () => (/* binding */ CONNECTION_STATE),
/* harmony export */   DEFAULT_HEADERS: () => (/* binding */ DEFAULT_HEADERS),
/* harmony export */   DEFAULT_TIMEOUT: () => (/* binding */ DEFAULT_TIMEOUT),
/* harmony export */   SOCKET_STATES: () => (/* binding */ SOCKET_STATES),
/* harmony export */   TRANSPORTS: () => (/* binding */ TRANSPORTS),
/* harmony export */   VSN: () => (/* binding */ VSN),
/* harmony export */   WS_CLOSE_NORMAL: () => (/* binding */ WS_CLOSE_NORMAL)
/* harmony export */ });
/* harmony import */ var _version__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./version */ "./node_modules/@supabase/realtime-js/dist/module/lib/version.js");

const DEFAULT_HEADERS = { 'X-Client-Info': `realtime-js/${_version__WEBPACK_IMPORTED_MODULE_0__.version}` };
const VSN = '1.0.0';
const DEFAULT_TIMEOUT = 10000;
const WS_CLOSE_NORMAL = 1000;
var SOCKET_STATES;
(function (SOCKET_STATES) {
    SOCKET_STATES[SOCKET_STATES["connecting"] = 0] = "connecting";
    SOCKET_STATES[SOCKET_STATES["open"] = 1] = "open";
    SOCKET_STATES[SOCKET_STATES["closing"] = 2] = "closing";
    SOCKET_STATES[SOCKET_STATES["closed"] = 3] = "closed";
})(SOCKET_STATES || (SOCKET_STATES = {}));
var CHANNEL_STATES;
(function (CHANNEL_STATES) {
    CHANNEL_STATES["closed"] = "closed";
    CHANNEL_STATES["errored"] = "errored";
    CHANNEL_STATES["joined"] = "joined";
    CHANNEL_STATES["joining"] = "joining";
    CHANNEL_STATES["leaving"] = "leaving";
})(CHANNEL_STATES || (CHANNEL_STATES = {}));
var CHANNEL_EVENTS;
(function (CHANNEL_EVENTS) {
    CHANNEL_EVENTS["close"] = "phx_close";
    CHANNEL_EVENTS["error"] = "phx_error";
    CHANNEL_EVENTS["join"] = "phx_join";
    CHANNEL_EVENTS["reply"] = "phx_reply";
    CHANNEL_EVENTS["leave"] = "phx_leave";
    CHANNEL_EVENTS["access_token"] = "access_token";
})(CHANNEL_EVENTS || (CHANNEL_EVENTS = {}));
var TRANSPORTS;
(function (TRANSPORTS) {
    TRANSPORTS["websocket"] = "websocket";
})(TRANSPORTS || (TRANSPORTS = {}));
var CONNECTION_STATE;
(function (CONNECTION_STATE) {
    CONNECTION_STATE["Connecting"] = "connecting";
    CONNECTION_STATE["Open"] = "open";
    CONNECTION_STATE["Closing"] = "closing";
    CONNECTION_STATE["Closed"] = "closed";
})(CONNECTION_STATE || (CONNECTION_STATE = {}));
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ "./node_modules/@supabase/realtime-js/dist/module/lib/push.js":
/*!********************************************************************!*\
  !*** ./node_modules/@supabase/realtime-js/dist/module/lib/push.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Push)
/* harmony export */ });
/* harmony import */ var _lib_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/constants */ "./node_modules/@supabase/realtime-js/dist/module/lib/constants.js");

class Push {
    /**
     * Initializes the Push
     *
     * @param channel The Channel
     * @param event The event, for example `"phx_join"`
     * @param payload The payload, for example `{user_id: 123}`
     * @param timeout The push timeout in milliseconds
     */
    constructor(channel, event, payload = {}, timeout = _lib_constants__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_TIMEOUT) {
        this.channel = channel;
        this.event = event;
        this.payload = payload;
        this.timeout = timeout;
        this.sent = false;
        this.timeoutTimer = undefined;
        this.ref = '';
        this.receivedResp = null;
        this.recHooks = [];
        this.refEvent = null;
    }
    resend(timeout) {
        this.timeout = timeout;
        this._cancelRefEvent();
        this.ref = '';
        this.refEvent = null;
        this.receivedResp = null;
        this.sent = false;
        this.send();
    }
    send() {
        if (this._hasReceived('timeout')) {
            return;
        }
        this.startTimeout();
        this.sent = true;
        this.channel.socket.push({
            topic: this.channel.topic,
            event: this.event,
            payload: this.payload,
            ref: this.ref,
            join_ref: this.channel._joinRef(),
        });
    }
    updatePayload(payload) {
        this.payload = Object.assign(Object.assign({}, this.payload), payload);
    }
    receive(status, callback) {
        var _a;
        if (this._hasReceived(status)) {
            callback((_a = this.receivedResp) === null || _a === void 0 ? void 0 : _a.response);
        }
        this.recHooks.push({ status, callback });
        return this;
    }
    startTimeout() {
        if (this.timeoutTimer) {
            return;
        }
        this.ref = this.channel.socket._makeRef();
        this.refEvent = this.channel._replyEventName(this.ref);
        const callback = (payload) => {
            this._cancelRefEvent();
            this._cancelTimeout();
            this.receivedResp = payload;
            this._matchReceive(payload);
        };
        this.channel._on(this.refEvent, {}, callback);
        this.timeoutTimer = setTimeout(() => {
            this.trigger('timeout', {});
        }, this.timeout);
    }
    trigger(status, response) {
        if (this.refEvent)
            this.channel._trigger(this.refEvent, { status, response });
    }
    destroy() {
        this._cancelRefEvent();
        this._cancelTimeout();
    }
    _cancelRefEvent() {
        if (!this.refEvent) {
            return;
        }
        this.channel._off(this.refEvent, {});
    }
    _cancelTimeout() {
        clearTimeout(this.timeoutTimer);
        this.timeoutTimer = undefined;
    }
    _matchReceive({ status, response, }) {
        this.recHooks
            .filter((h) => h.status === status)
            .forEach((h) => h.callback(response));
    }
    _hasReceived(status) {
        return this.receivedResp && this.receivedResp.status === status;
    }
}
//# sourceMappingURL=push.js.map

/***/ }),

/***/ "./node_modules/@supabase/realtime-js/dist/module/lib/serializer.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@supabase/realtime-js/dist/module/lib/serializer.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Serializer)
/* harmony export */ });
// This file draws heavily from https://github.com/phoenixframework/phoenix/commit/cf098e9cf7a44ee6479d31d911a97d3c7430c6fe
// License: https://github.com/phoenixframework/phoenix/blob/master/LICENSE.md
class Serializer {
    constructor() {
        this.HEADER_LENGTH = 1;
    }
    decode(rawPayload, callback) {
        if (rawPayload.constructor === ArrayBuffer) {
            return callback(this._binaryDecode(rawPayload));
        }
        if (typeof rawPayload === 'string') {
            return callback(JSON.parse(rawPayload));
        }
        return callback({});
    }
    _binaryDecode(buffer) {
        const view = new DataView(buffer);
        const decoder = new TextDecoder();
        return this._decodeBroadcast(buffer, view, decoder);
    }
    _decodeBroadcast(buffer, view, decoder) {
        const topicSize = view.getUint8(1);
        const eventSize = view.getUint8(2);
        let offset = this.HEADER_LENGTH + 2;
        const topic = decoder.decode(buffer.slice(offset, offset + topicSize));
        offset = offset + topicSize;
        const event = decoder.decode(buffer.slice(offset, offset + eventSize));
        offset = offset + eventSize;
        const data = JSON.parse(decoder.decode(buffer.slice(offset, buffer.byteLength)));
        return { ref: null, topic: topic, event: event, payload: data };
    }
}
//# sourceMappingURL=serializer.js.map

/***/ }),

/***/ "./node_modules/@supabase/realtime-js/dist/module/lib/timer.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@supabase/realtime-js/dist/module/lib/timer.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Timer)
/* harmony export */ });
/**
 * Creates a timer that accepts a `timerCalc` function to perform calculated timeout retries, such as exponential backoff.
 *
 * @example
 *    let reconnectTimer = new Timer(() => this.connect(), function(tries){
 *      return [1000, 5000, 10000][tries - 1] || 10000
 *    })
 *    reconnectTimer.scheduleTimeout() // fires after 1000
 *    reconnectTimer.scheduleTimeout() // fires after 5000
 *    reconnectTimer.reset()
 *    reconnectTimer.scheduleTimeout() // fires after 1000
 */
class Timer {
    constructor(callback, timerCalc) {
        this.callback = callback;
        this.timerCalc = timerCalc;
        this.timer = undefined;
        this.tries = 0;
        this.callback = callback;
        this.timerCalc = timerCalc;
    }
    reset() {
        this.tries = 0;
        clearTimeout(this.timer);
    }
    // Cancels any previous scheduleTimeout and schedules callback
    scheduleTimeout() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.tries = this.tries + 1;
            this.callback();
        }, this.timerCalc(this.tries + 1));
    }
}
//# sourceMappingURL=timer.js.map

/***/ }),

/***/ "./node_modules/@supabase/realtime-js/dist/module/lib/transformers.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@supabase/realtime-js/dist/module/lib/transformers.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PostgresTypes: () => (/* binding */ PostgresTypes),
/* harmony export */   convertCell: () => (/* binding */ convertCell),
/* harmony export */   convertChangeData: () => (/* binding */ convertChangeData),
/* harmony export */   convertColumn: () => (/* binding */ convertColumn),
/* harmony export */   httpEndpointURL: () => (/* binding */ httpEndpointURL),
/* harmony export */   toArray: () => (/* binding */ toArray),
/* harmony export */   toBoolean: () => (/* binding */ toBoolean),
/* harmony export */   toJson: () => (/* binding */ toJson),
/* harmony export */   toNumber: () => (/* binding */ toNumber),
/* harmony export */   toTimestampString: () => (/* binding */ toTimestampString)
/* harmony export */ });
/**
 * Helpers to convert the change Payload into native JS types.
 */
// Adapted from epgsql (src/epgsql_binary.erl), this module licensed under
// 3-clause BSD found here: https://raw.githubusercontent.com/epgsql/epgsql/devel/LICENSE
var PostgresTypes;
(function (PostgresTypes) {
    PostgresTypes["abstime"] = "abstime";
    PostgresTypes["bool"] = "bool";
    PostgresTypes["date"] = "date";
    PostgresTypes["daterange"] = "daterange";
    PostgresTypes["float4"] = "float4";
    PostgresTypes["float8"] = "float8";
    PostgresTypes["int2"] = "int2";
    PostgresTypes["int4"] = "int4";
    PostgresTypes["int4range"] = "int4range";
    PostgresTypes["int8"] = "int8";
    PostgresTypes["int8range"] = "int8range";
    PostgresTypes["json"] = "json";
    PostgresTypes["jsonb"] = "jsonb";
    PostgresTypes["money"] = "money";
    PostgresTypes["numeric"] = "numeric";
    PostgresTypes["oid"] = "oid";
    PostgresTypes["reltime"] = "reltime";
    PostgresTypes["text"] = "text";
    PostgresTypes["time"] = "time";
    PostgresTypes["timestamp"] = "timestamp";
    PostgresTypes["timestamptz"] = "timestamptz";
    PostgresTypes["timetz"] = "timetz";
    PostgresTypes["tsrange"] = "tsrange";
    PostgresTypes["tstzrange"] = "tstzrange";
})(PostgresTypes || (PostgresTypes = {}));
/**
 * Takes an array of columns and an object of string values then converts each string value
 * to its mapped type.
 *
 * @param {{name: String, type: String}[]} columns
 * @param {Object} record
 * @param {Object} options The map of various options that can be applied to the mapper
 * @param {Array} options.skipTypes The array of types that should not be converted
 *
 * @example convertChangeData([{name: 'first_name', type: 'text'}, {name: 'age', type: 'int4'}], {first_name: 'Paul', age:'33'}, {})
 * //=>{ first_name: 'Paul', age: 33 }
 */
const convertChangeData = (columns, record, options = {}) => {
    var _a;
    const skipTypes = (_a = options.skipTypes) !== null && _a !== void 0 ? _a : [];
    return Object.keys(record).reduce((acc, rec_key) => {
        acc[rec_key] = convertColumn(rec_key, columns, record, skipTypes);
        return acc;
    }, {});
};
/**
 * Converts the value of an individual column.
 *
 * @param {String} columnName The column that you want to convert
 * @param {{name: String, type: String}[]} columns All of the columns
 * @param {Object} record The map of string values
 * @param {Array} skipTypes An array of types that should not be converted
 * @return {object} Useless information
 *
 * @example convertColumn('age', [{name: 'first_name', type: 'text'}, {name: 'age', type: 'int4'}], {first_name: 'Paul', age: '33'}, [])
 * //=> 33
 * @example convertColumn('age', [{name: 'first_name', type: 'text'}, {name: 'age', type: 'int4'}], {first_name: 'Paul', age: '33'}, ['int4'])
 * //=> "33"
 */
const convertColumn = (columnName, columns, record, skipTypes) => {
    const column = columns.find((x) => x.name === columnName);
    const colType = column === null || column === void 0 ? void 0 : column.type;
    const value = record[columnName];
    if (colType && !skipTypes.includes(colType)) {
        return convertCell(colType, value);
    }
    return noop(value);
};
/**
 * If the value of the cell is `null`, returns null.
 * Otherwise converts the string value to the correct type.
 * @param {String} type A postgres column type
 * @param {String} value The cell value
 *
 * @example convertCell('bool', 't')
 * //=> true
 * @example convertCell('int8', '10')
 * //=> 10
 * @example convertCell('_int4', '{1,2,3,4}')
 * //=> [1,2,3,4]
 */
const convertCell = (type, value) => {
    // if data type is an array
    if (type.charAt(0) === '_') {
        const dataType = type.slice(1, type.length);
        return toArray(value, dataType);
    }
    // If not null, convert to correct type.
    switch (type) {
        case PostgresTypes.bool:
            return toBoolean(value);
        case PostgresTypes.float4:
        case PostgresTypes.float8:
        case PostgresTypes.int2:
        case PostgresTypes.int4:
        case PostgresTypes.int8:
        case PostgresTypes.numeric:
        case PostgresTypes.oid:
            return toNumber(value);
        case PostgresTypes.json:
        case PostgresTypes.jsonb:
            return toJson(value);
        case PostgresTypes.timestamp:
            return toTimestampString(value); // Format to be consistent with PostgREST
        case PostgresTypes.abstime: // To allow users to cast it based on Timezone
        case PostgresTypes.date: // To allow users to cast it based on Timezone
        case PostgresTypes.daterange:
        case PostgresTypes.int4range:
        case PostgresTypes.int8range:
        case PostgresTypes.money:
        case PostgresTypes.reltime: // To allow users to cast it based on Timezone
        case PostgresTypes.text:
        case PostgresTypes.time: // To allow users to cast it based on Timezone
        case PostgresTypes.timestamptz: // To allow users to cast it based on Timezone
        case PostgresTypes.timetz: // To allow users to cast it based on Timezone
        case PostgresTypes.tsrange:
        case PostgresTypes.tstzrange:
            return noop(value);
        default:
            // Return the value for remaining types
            return noop(value);
    }
};
const noop = (value) => {
    return value;
};
const toBoolean = (value) => {
    switch (value) {
        case 't':
            return true;
        case 'f':
            return false;
        default:
            return value;
    }
};
const toNumber = (value) => {
    if (typeof value === 'string') {
        const parsedValue = parseFloat(value);
        if (!Number.isNaN(parsedValue)) {
            return parsedValue;
        }
    }
    return value;
};
const toJson = (value) => {
    if (typeof value === 'string') {
        try {
            return JSON.parse(value);
        }
        catch (error) {
            console.log(`JSON parse error: ${error}`);
            return value;
        }
    }
    return value;
};
/**
 * Converts a Postgres Array into a native JS array
 *
 * @example toArray('{}', 'int4')
 * //=> []
 * @example toArray('{"[2021-01-01,2021-12-31)","(2021-01-01,2021-12-32]"}', 'daterange')
 * //=> ['[2021-01-01,2021-12-31)', '(2021-01-01,2021-12-32]']
 * @example toArray([1,2,3,4], 'int4')
 * //=> [1,2,3,4]
 */
const toArray = (value, type) => {
    if (typeof value !== 'string') {
        return value;
    }
    const lastIdx = value.length - 1;
    const closeBrace = value[lastIdx];
    const openBrace = value[0];
    // Confirm value is a Postgres array by checking curly brackets
    if (openBrace === '{' && closeBrace === '}') {
        let arr;
        const valTrim = value.slice(1, lastIdx);
        // TODO: find a better solution to separate Postgres array data
        try {
            arr = JSON.parse('[' + valTrim + ']');
        }
        catch (_) {
            // WARNING: splitting on comma does not cover all edge cases
            arr = valTrim ? valTrim.split(',') : [];
        }
        return arr.map((val) => convertCell(type, val));
    }
    return value;
};
/**
 * Fixes timestamp to be ISO-8601. Swaps the space between the date and time for a 'T'
 * See https://github.com/supabase/supabase/issues/18
 *
 * @example toTimestampString('2019-09-10 00:00:00')
 * //=> '2019-09-10T00:00:00'
 */
const toTimestampString = (value) => {
    if (typeof value === 'string') {
        return value.replace(' ', 'T');
    }
    return value;
};
const httpEndpointURL = (socketUrl) => {
    let url = socketUrl;
    url = url.replace(/^ws/i, 'http');
    url = url.replace(/(\/socket\/websocket|\/socket|\/websocket)\/?$/i, '');
    return url.replace(/\/+$/, '');
};
//# sourceMappingURL=transformers.js.map

/***/ }),

/***/ "./node_modules/@supabase/realtime-js/dist/module/lib/version.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@supabase/realtime-js/dist/module/lib/version.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   version: () => (/* binding */ version)
/* harmony export */ });
const version = '2.11.2';
//# sourceMappingURL=version.js.map

/***/ }),

/***/ "./node_modules/@supabase/storage-js/dist/module/StorageClient.js":
/*!************************************************************************!*\
  !*** ./node_modules/@supabase/storage-js/dist/module/StorageClient.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StorageClient: () => (/* binding */ StorageClient)
/* harmony export */ });
/* harmony import */ var _packages_StorageFileApi__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./packages/StorageFileApi */ "./node_modules/@supabase/storage-js/dist/module/packages/StorageFileApi.js");
/* harmony import */ var _packages_StorageBucketApi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./packages/StorageBucketApi */ "./node_modules/@supabase/storage-js/dist/module/packages/StorageBucketApi.js");


class StorageClient extends _packages_StorageBucketApi__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(url, headers = {}, fetch) {
        super(url, headers, fetch);
    }
    /**
     * Perform file operation in a bucket.
     *
     * @param id The bucket id to operate on.
     */
    from(id) {
        return new _packages_StorageFileApi__WEBPACK_IMPORTED_MODULE_1__["default"](this.url, this.headers, id, this.fetch);
    }
}
//# sourceMappingURL=StorageClient.js.map

/***/ }),

/***/ "./node_modules/@supabase/storage-js/dist/module/lib/constants.js":
/*!************************************************************************!*\
  !*** ./node_modules/@supabase/storage-js/dist/module/lib/constants.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_HEADERS: () => (/* binding */ DEFAULT_HEADERS)
/* harmony export */ });
/* harmony import */ var _version__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./version */ "./node_modules/@supabase/storage-js/dist/module/lib/version.js");

const DEFAULT_HEADERS = { 'X-Client-Info': `storage-js/${_version__WEBPACK_IMPORTED_MODULE_0__.version}` };
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ "./node_modules/@supabase/storage-js/dist/module/lib/errors.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@supabase/storage-js/dist/module/lib/errors.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StorageApiError: () => (/* binding */ StorageApiError),
/* harmony export */   StorageError: () => (/* binding */ StorageError),
/* harmony export */   StorageUnknownError: () => (/* binding */ StorageUnknownError),
/* harmony export */   isStorageError: () => (/* binding */ isStorageError)
/* harmony export */ });
class StorageError extends Error {
    constructor(message) {
        super(message);
        this.__isStorageError = true;
        this.name = 'StorageError';
    }
}
function isStorageError(error) {
    return typeof error === 'object' && error !== null && '__isStorageError' in error;
}
class StorageApiError extends StorageError {
    constructor(message, status) {
        super(message);
        this.name = 'StorageApiError';
        this.status = status;
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            status: this.status,
        };
    }
}
class StorageUnknownError extends StorageError {
    constructor(message, originalError) {
        super(message);
        this.name = 'StorageUnknownError';
        this.originalError = originalError;
    }
}
//# sourceMappingURL=errors.js.map

/***/ }),

/***/ "./node_modules/@supabase/storage-js/dist/module/lib/fetch.js":
/*!********************************************************************!*\
  !*** ./node_modules/@supabase/storage-js/dist/module/lib/fetch.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   get: () => (/* binding */ get),
/* harmony export */   head: () => (/* binding */ head),
/* harmony export */   post: () => (/* binding */ post),
/* harmony export */   put: () => (/* binding */ put),
/* harmony export */   remove: () => (/* binding */ remove)
/* harmony export */ });
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./errors */ "./node_modules/@supabase/storage-js/dist/module/lib/errors.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "./node_modules/@supabase/storage-js/dist/module/lib/helpers.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


const _getErrorMessage = (err) => err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
const handleError = (error, reject, options) => __awaiter(void 0, void 0, void 0, function* () {
    const Res = yield (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.resolveResponse)();
    if (error instanceof Res && !(options === null || options === void 0 ? void 0 : options.noResolveJson)) {
        error
            .json()
            .then((err) => {
            reject(new _errors__WEBPACK_IMPORTED_MODULE_1__.StorageApiError(_getErrorMessage(err), error.status || 500));
        })
            .catch((err) => {
            reject(new _errors__WEBPACK_IMPORTED_MODULE_1__.StorageUnknownError(_getErrorMessage(err), err));
        });
    }
    else {
        reject(new _errors__WEBPACK_IMPORTED_MODULE_1__.StorageUnknownError(_getErrorMessage(error), error));
    }
});
const _getRequestParams = (method, options, parameters, body) => {
    const params = { method, headers: (options === null || options === void 0 ? void 0 : options.headers) || {} };
    if (method === 'GET') {
        return params;
    }
    params.headers = Object.assign({ 'Content-Type': 'application/json' }, options === null || options === void 0 ? void 0 : options.headers);
    if (body) {
        params.body = JSON.stringify(body);
    }
    return Object.assign(Object.assign({}, params), parameters);
};
function _handleRequest(fetcher, method, url, options, parameters, body) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            fetcher(url, _getRequestParams(method, options, parameters, body))
                .then((result) => {
                if (!result.ok)
                    throw result;
                if (options === null || options === void 0 ? void 0 : options.noResolveJson)
                    return result;
                return result.json();
            })
                .then((data) => resolve(data))
                .catch((error) => handleError(error, reject, options));
        });
    });
}
function get(fetcher, url, options, parameters) {
    return __awaiter(this, void 0, void 0, function* () {
        return _handleRequest(fetcher, 'GET', url, options, parameters);
    });
}
function post(fetcher, url, body, options, parameters) {
    return __awaiter(this, void 0, void 0, function* () {
        return _handleRequest(fetcher, 'POST', url, options, parameters, body);
    });
}
function put(fetcher, url, body, options, parameters) {
    return __awaiter(this, void 0, void 0, function* () {
        return _handleRequest(fetcher, 'PUT', url, options, parameters, body);
    });
}
function head(fetcher, url, options, parameters) {
    return __awaiter(this, void 0, void 0, function* () {
        return _handleRequest(fetcher, 'HEAD', url, Object.assign(Object.assign({}, options), { noResolveJson: true }), parameters);
    });
}
function remove(fetcher, url, body, options, parameters) {
    return __awaiter(this, void 0, void 0, function* () {
        return _handleRequest(fetcher, 'DELETE', url, options, parameters, body);
    });
}
//# sourceMappingURL=fetch.js.map

/***/ }),

/***/ "./node_modules/@supabase/storage-js/dist/module/lib/helpers.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@supabase/storage-js/dist/module/lib/helpers.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   recursiveToCamel: () => (/* binding */ recursiveToCamel),
/* harmony export */   resolveFetch: () => (/* binding */ resolveFetch),
/* harmony export */   resolveResponse: () => (/* binding */ resolveResponse)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const resolveFetch = (customFetch) => {
    let _fetch;
    if (customFetch) {
        _fetch = customFetch;
    }
    else if (typeof fetch === 'undefined') {
        _fetch = (...args) => Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! @supabase/node-fetch */ "./node_modules/@supabase/node-fetch/browser.js")).then(({ default: fetch }) => fetch(...args));
    }
    else {
        _fetch = fetch;
    }
    return (...args) => _fetch(...args);
};
const resolveResponse = () => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof Response === 'undefined') {
        // @ts-ignore
        return (yield Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! @supabase/node-fetch */ "./node_modules/@supabase/node-fetch/browser.js"))).Response;
    }
    return Response;
});
const recursiveToCamel = (item) => {
    if (Array.isArray(item)) {
        return item.map((el) => recursiveToCamel(el));
    }
    else if (typeof item === 'function' || item !== Object(item)) {
        return item;
    }
    const result = {};
    Object.entries(item).forEach(([key, value]) => {
        const newKey = key.replace(/([-_][a-z])/gi, (c) => c.toUpperCase().replace(/[-_]/g, ''));
        result[newKey] = recursiveToCamel(value);
    });
    return result;
};
//# sourceMappingURL=helpers.js.map

/***/ }),

/***/ "./node_modules/@supabase/storage-js/dist/module/lib/version.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@supabase/storage-js/dist/module/lib/version.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   version: () => (/* binding */ version)
/* harmony export */ });
// generated by genversion
const version = '2.7.1';
//# sourceMappingURL=version.js.map

/***/ }),

/***/ "./node_modules/@supabase/storage-js/dist/module/packages/StorageBucketApi.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@supabase/storage-js/dist/module/packages/StorageBucketApi.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ StorageBucketApi)
/* harmony export */ });
/* harmony import */ var _lib_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/constants */ "./node_modules/@supabase/storage-js/dist/module/lib/constants.js");
/* harmony import */ var _lib_errors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/errors */ "./node_modules/@supabase/storage-js/dist/module/lib/errors.js");
/* harmony import */ var _lib_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/fetch */ "./node_modules/@supabase/storage-js/dist/module/lib/fetch.js");
/* harmony import */ var _lib_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/helpers */ "./node_modules/@supabase/storage-js/dist/module/lib/helpers.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




class StorageBucketApi {
    constructor(url, headers = {}, fetch) {
        this.url = url;
        this.headers = Object.assign(Object.assign({}, _lib_constants__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_HEADERS), headers);
        this.fetch = (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_1__.resolveFetch)(fetch);
    }
    /**
     * Retrieves the details of all Storage buckets within an existing project.
     */
    listBuckets() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_2__.get)(this.fetch, `${this.url}/bucket`, { headers: this.headers });
                return { data, error: null };
            }
            catch (error) {
                if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_3__.isStorageError)(error)) {
                    return { data: null, error };
                }
                throw error;
            }
        });
    }
    /**
     * Retrieves the details of an existing Storage bucket.
     *
     * @param id The unique identifier of the bucket you would like to retrieve.
     */
    getBucket(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_2__.get)(this.fetch, `${this.url}/bucket/${id}`, { headers: this.headers });
                return { data, error: null };
            }
            catch (error) {
                if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_3__.isStorageError)(error)) {
                    return { data: null, error };
                }
                throw error;
            }
        });
    }
    /**
     * Creates a new Storage bucket
     *
     * @param id A unique identifier for the bucket you are creating.
     * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations. By default, buckets are private.
     * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
     * The global file size limit takes precedence over this value.
     * The default value is null, which doesn't set a per bucket file size limit.
     * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
     * The default value is null, which allows files with all mime types to be uploaded.
     * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
     * @returns newly created bucket id
     */
    createBucket(id, options = {
        public: false,
    }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_2__.post)(this.fetch, `${this.url}/bucket`, {
                    id,
                    name: id,
                    public: options.public,
                    file_size_limit: options.fileSizeLimit,
                    allowed_mime_types: options.allowedMimeTypes,
                }, { headers: this.headers });
                return { data, error: null };
            }
            catch (error) {
                if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_3__.isStorageError)(error)) {
                    return { data: null, error };
                }
                throw error;
            }
        });
    }
    /**
     * Updates a Storage bucket
     *
     * @param id A unique identifier for the bucket you are updating.
     * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations.
     * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
     * The global file size limit takes precedence over this value.
     * The default value is null, which doesn't set a per bucket file size limit.
     * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
     * The default value is null, which allows files with all mime types to be uploaded.
     * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
     */
    updateBucket(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_2__.put)(this.fetch, `${this.url}/bucket/${id}`, {
                    id,
                    name: id,
                    public: options.public,
                    file_size_limit: options.fileSizeLimit,
                    allowed_mime_types: options.allowedMimeTypes,
                }, { headers: this.headers });
                return { data, error: null };
            }
            catch (error) {
                if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_3__.isStorageError)(error)) {
                    return { data: null, error };
                }
                throw error;
            }
        });
    }
    /**
     * Removes all objects inside a single bucket.
     *
     * @param id The unique identifier of the bucket you would like to empty.
     */
    emptyBucket(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_2__.post)(this.fetch, `${this.url}/bucket/${id}/empty`, {}, { headers: this.headers });
                return { data, error: null };
            }
            catch (error) {
                if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_3__.isStorageError)(error)) {
                    return { data: null, error };
                }
                throw error;
            }
        });
    }
    /**
     * Deletes an existing bucket. A bucket can't be deleted with existing objects inside it.
     * You must first `empty()` the bucket.
     *
     * @param id The unique identifier of the bucket you would like to delete.
     */
    deleteBucket(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_2__.remove)(this.fetch, `${this.url}/bucket/${id}`, {}, { headers: this.headers });
                return { data, error: null };
            }
            catch (error) {
                if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_3__.isStorageError)(error)) {
                    return { data: null, error };
                }
                throw error;
            }
        });
    }
}
//# sourceMappingURL=StorageBucketApi.js.map

/***/ }),

/***/ "./node_modules/@supabase/storage-js/dist/module/packages/StorageFileApi.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@supabase/storage-js/dist/module/packages/StorageFileApi.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ StorageFileApi)
/* harmony export */ });
/* harmony import */ var _lib_errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/errors */ "./node_modules/@supabase/storage-js/dist/module/lib/errors.js");
/* harmony import */ var _lib_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/fetch */ "./node_modules/@supabase/storage-js/dist/module/lib/fetch.js");
/* harmony import */ var _lib_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/helpers */ "./node_modules/@supabase/storage-js/dist/module/lib/helpers.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



const DEFAULT_SEARCH_OPTIONS = {
    limit: 100,
    offset: 0,
    sortBy: {
        column: 'name',
        order: 'asc',
    },
};
const DEFAULT_FILE_OPTIONS = {
    cacheControl: '3600',
    contentType: 'text/plain;charset=UTF-8',
    upsert: false,
};
class StorageFileApi {
    constructor(url, headers = {}, bucketId, fetch) {
        this.url = url;
        this.headers = headers;
        this.bucketId = bucketId;
        this.fetch = (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_0__.resolveFetch)(fetch);
    }
    /**
     * Uploads a file to an existing bucket or replaces an existing file at the specified path with a new one.
     *
     * @param method HTTP method.
     * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
     * @param fileBody The body of the file to be stored in the bucket.
     */
    uploadOrUpdate(method, path, fileBody, fileOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let body;
                const options = Object.assign(Object.assign({}, DEFAULT_FILE_OPTIONS), fileOptions);
                let headers = Object.assign(Object.assign({}, this.headers), (method === 'POST' && { 'x-upsert': String(options.upsert) }));
                const metadata = options.metadata;
                if (typeof Blob !== 'undefined' && fileBody instanceof Blob) {
                    body = new FormData();
                    body.append('cacheControl', options.cacheControl);
                    if (metadata) {
                        body.append('metadata', this.encodeMetadata(metadata));
                    }
                    body.append('', fileBody);
                }
                else if (typeof FormData !== 'undefined' && fileBody instanceof FormData) {
                    body = fileBody;
                    body.append('cacheControl', options.cacheControl);
                    if (metadata) {
                        body.append('metadata', this.encodeMetadata(metadata));
                    }
                }
                else {
                    body = fileBody;
                    headers['cache-control'] = `max-age=${options.cacheControl}`;
                    headers['content-type'] = options.contentType;
                    if (metadata) {
                        headers['x-metadata'] = this.toBase64(this.encodeMetadata(metadata));
                    }
                }
                if (fileOptions === null || fileOptions === void 0 ? void 0 : fileOptions.headers) {
                    headers = Object.assign(Object.assign({}, headers), fileOptions.headers);
                }
                const cleanPath = this._removeEmptyFolders(path);
                const _path = this._getFinalPath(cleanPath);
                const res = yield this.fetch(`${this.url}/object/${_path}`, Object.assign({ method, body: body, headers }, ((options === null || options === void 0 ? void 0 : options.duplex) ? { duplex: options.duplex } : {})));
                const data = yield res.json();
                if (res.ok) {
                    return {
                        data: { path: cleanPath, id: data.Id, fullPath: data.Key },
                        error: null,
                    };
                }
                else {
                    const error = data;
                    return { data: null, error };
                }
            }
            catch (error) {
                if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_1__.isStorageError)(error)) {
                    return { data: null, error };
                }
                throw error;
            }
        });
    }
    /**
     * Uploads a file to an existing bucket.
     *
     * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
     * @param fileBody The body of the file to be stored in the bucket.
     */
    upload(path, fileBody, fileOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.uploadOrUpdate('POST', path, fileBody, fileOptions);
        });
    }
    /**
     * Upload a file with a token generated from `createSignedUploadUrl`.
     * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
     * @param token The token generated from `createSignedUploadUrl`
     * @param fileBody The body of the file to be stored in the bucket.
     */
    uploadToSignedUrl(path, token, fileBody, fileOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const cleanPath = this._removeEmptyFolders(path);
            const _path = this._getFinalPath(cleanPath);
            const url = new URL(this.url + `/object/upload/sign/${_path}`);
            url.searchParams.set('token', token);
            try {
                let body;
                const options = Object.assign({ upsert: DEFAULT_FILE_OPTIONS.upsert }, fileOptions);
                const headers = Object.assign(Object.assign({}, this.headers), { 'x-upsert': String(options.upsert) });
                if (typeof Blob !== 'undefined' && fileBody instanceof Blob) {
                    body = new FormData();
                    body.append('cacheControl', options.cacheControl);
                    body.append('', fileBody);
                }
                else if (typeof FormData !== 'undefined' && fileBody instanceof FormData) {
                    body = fileBody;
                    body.append('cacheControl', options.cacheControl);
                }
                else {
                    body = fileBody;
                    headers['cache-control'] = `max-age=${options.cacheControl}`;
                    headers['content-type'] = options.contentType;
                }
                const res = yield this.fetch(url.toString(), {
                    method: 'PUT',
                    body: body,
                    headers,
                });
                const data = yield res.json();
                if (res.ok) {
                    return {
                        data: { path: cleanPath, fullPath: data.Key },
                        error: null,
                    };
                }
                else {
                    const error = data;
                    return { data: null, error };
                }
            }
            catch (error) {
                if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_1__.isStorageError)(error)) {
                    return { data: null, error };
                }
                throw error;
            }
        });
    }
    /**
     * Creates a signed upload URL.
     * Signed upload URLs can be used to upload files to the bucket without further authentication.
     * They are valid for 2 hours.
     * @param path The file path, including the current file name. For example `folder/image.png`.
     * @param options.upsert If set to true, allows the file to be overwritten if it already exists.
     */
    createSignedUploadUrl(path, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let _path = this._getFinalPath(path);
                const headers = Object.assign({}, this.headers);
                if (options === null || options === void 0 ? void 0 : options.upsert) {
                    headers['x-upsert'] = 'true';
                }
                const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_2__.post)(this.fetch, `${this.url}/object/upload/sign/${_path}`, {}, { headers });
                const url = new URL(this.url + data.url);
                const token = url.searchParams.get('token');
                if (!token) {
                    throw new _lib_errors__WEBPACK_IMPORTED_MODULE_1__.StorageError('No token returned by API');
                }
                return { data: { signedUrl: url.toString(), path, token }, error: null };
            }
            catch (error) {
                if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_1__.isStorageError)(error)) {
                    return { data: null, error };
                }
                throw error;
            }
        });
    }
    /**
     * Replaces an existing file at the specified path with a new one.
     *
     * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to update.
     * @param fileBody The body of the file to be stored in the bucket.
     */
    update(path, fileBody, fileOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.uploadOrUpdate('PUT', path, fileBody, fileOptions);
        });
    }
    /**
     * Moves an existing file to a new path in the same bucket.
     *
     * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
     * @param toPath The new file path, including the new file name. For example `folder/image-new.png`.
     * @param options The destination options.
     */
    move(fromPath, toPath, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_2__.post)(this.fetch, `${this.url}/object/move`, {
                    bucketId: this.bucketId,
                    sourceKey: fromPath,
                    destinationKey: toPath,
                    destinationBucket: options === null || options === void 0 ? void 0 : options.destinationBucket,
                }, { headers: this.headers });
                return { data, error: null };
            }
            catch (error) {
                if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_1__.isStorageError)(error)) {
                    return { data: null, error };
                }
                throw error;
            }
        });
    }
    /**
     * Copies an existing file to a new path in the same bucket.
     *
     * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
     * @param toPath The new file path, including the new file name. For example `folder/image-copy.png`.
     * @param options The destination options.
     */
    copy(fromPath, toPath, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_2__.post)(this.fetch, `${this.url}/object/copy`, {
                    bucketId: this.bucketId,
                    sourceKey: fromPath,
                    destinationKey: toPath,
                    destinationBucket: options === null || options === void 0 ? void 0 : options.destinationBucket,
                }, { headers: this.headers });
                return { data: { path: data.Key }, error: null };
            }
            catch (error) {
                if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_1__.isStorageError)(error)) {
                    return { data: null, error };
                }
                throw error;
            }
        });
    }
    /**
     * Creates a signed URL. Use a signed URL to share a file for a fixed amount of time.
     *
     * @param path The file path, including the current file name. For example `folder/image.png`.
     * @param expiresIn The number of seconds until the signed URL expires. For example, `60` for a URL which is valid for one minute.
     * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
     * @param options.transform Transform the asset before serving it to the client.
     */
    createSignedUrl(path, expiresIn, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let _path = this._getFinalPath(path);
                let data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_2__.post)(this.fetch, `${this.url}/object/sign/${_path}`, Object.assign({ expiresIn }, ((options === null || options === void 0 ? void 0 : options.transform) ? { transform: options.transform } : {})), { headers: this.headers });
                const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download)
                    ? `&download=${options.download === true ? '' : options.download}`
                    : '';
                const signedUrl = encodeURI(`${this.url}${data.signedURL}${downloadQueryParam}`);
                data = { signedUrl };
                return { data, error: null };
            }
            catch (error) {
                if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_1__.isStorageError)(error)) {
                    return { data: null, error };
                }
                throw error;
            }
        });
    }
    /**
     * Creates multiple signed URLs. Use a signed URL to share a file for a fixed amount of time.
     *
     * @param paths The file paths to be downloaded, including the current file names. For example `['folder/image.png', 'folder2/image2.png']`.
     * @param expiresIn The number of seconds until the signed URLs expire. For example, `60` for URLs which are valid for one minute.
     * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
     */
    createSignedUrls(paths, expiresIn, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_2__.post)(this.fetch, `${this.url}/object/sign/${this.bucketId}`, { expiresIn, paths }, { headers: this.headers });
                const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download)
                    ? `&download=${options.download === true ? '' : options.download}`
                    : '';
                return {
                    data: data.map((datum) => (Object.assign(Object.assign({}, datum), { signedUrl: datum.signedURL
                            ? encodeURI(`${this.url}${datum.signedURL}${downloadQueryParam}`)
                            : null }))),
                    error: null,
                };
            }
            catch (error) {
                if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_1__.isStorageError)(error)) {
                    return { data: null, error };
                }
                throw error;
            }
        });
    }
    /**
     * Downloads a file from a private bucket. For public buckets, make a request to the URL returned from `getPublicUrl` instead.
     *
     * @param path The full path and file name of the file to be downloaded. For example `folder/image.png`.
     * @param options.transform Transform the asset before serving it to the client.
     */
    download(path, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const wantsTransformation = typeof (options === null || options === void 0 ? void 0 : options.transform) !== 'undefined';
            const renderPath = wantsTransformation ? 'render/image/authenticated' : 'object';
            const transformationQuery = this.transformOptsToQueryString((options === null || options === void 0 ? void 0 : options.transform) || {});
            const queryString = transformationQuery ? `?${transformationQuery}` : '';
            try {
                const _path = this._getFinalPath(path);
                const res = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_2__.get)(this.fetch, `${this.url}/${renderPath}/${_path}${queryString}`, {
                    headers: this.headers,
                    noResolveJson: true,
                });
                const data = yield res.blob();
                return { data, error: null };
            }
            catch (error) {
                if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_1__.isStorageError)(error)) {
                    return { data: null, error };
                }
                throw error;
            }
        });
    }
    /**
     * Retrieves the details of an existing file.
     * @param path
     */
    info(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const _path = this._getFinalPath(path);
            try {
                const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_2__.get)(this.fetch, `${this.url}/object/info/${_path}`, {
                    headers: this.headers,
                });
                return { data: (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_0__.recursiveToCamel)(data), error: null };
            }
            catch (error) {
                if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_1__.isStorageError)(error)) {
                    return { data: null, error };
                }
                throw error;
            }
        });
    }
    /**
     * Checks the existence of a file.
     * @param path
     */
    exists(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const _path = this._getFinalPath(path);
            try {
                yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_2__.head)(this.fetch, `${this.url}/object/${_path}`, {
                    headers: this.headers,
                });
                return { data: true, error: null };
            }
            catch (error) {
                if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_1__.isStorageError)(error) && error instanceof _lib_errors__WEBPACK_IMPORTED_MODULE_1__.StorageUnknownError) {
                    const originalError = error.originalError;
                    if ([400, 404].includes(originalError === null || originalError === void 0 ? void 0 : originalError.status)) {
                        return { data: false, error };
                    }
                }
                throw error;
            }
        });
    }
    /**
     * A simple convenience function to get the URL for an asset in a public bucket. If you do not want to use this function, you can construct the public URL by concatenating the bucket URL with the path to the asset.
     * This function does not verify if the bucket is public. If a public URL is created for a bucket which is not public, you will not be able to download the asset.
     *
     * @param path The path and name of the file to generate the public URL for. For example `folder/image.png`.
     * @param options.download Triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
     * @param options.transform Transform the asset before serving it to the client.
     */
    getPublicUrl(path, options) {
        const _path = this._getFinalPath(path);
        const _queryString = [];
        const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download)
            ? `download=${options.download === true ? '' : options.download}`
            : '';
        if (downloadQueryParam !== '') {
            _queryString.push(downloadQueryParam);
        }
        const wantsTransformation = typeof (options === null || options === void 0 ? void 0 : options.transform) !== 'undefined';
        const renderPath = wantsTransformation ? 'render/image' : 'object';
        const transformationQuery = this.transformOptsToQueryString((options === null || options === void 0 ? void 0 : options.transform) || {});
        if (transformationQuery !== '') {
            _queryString.push(transformationQuery);
        }
        let queryString = _queryString.join('&');
        if (queryString !== '') {
            queryString = `?${queryString}`;
        }
        return {
            data: { publicUrl: encodeURI(`${this.url}/${renderPath}/public/${_path}${queryString}`) },
        };
    }
    /**
     * Deletes files within the same bucket
     *
     * @param paths An array of files to delete, including the path and file name. For example [`'folder/image.png'`].
     */
    remove(paths) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_2__.remove)(this.fetch, `${this.url}/object/${this.bucketId}`, { prefixes: paths }, { headers: this.headers });
                return { data, error: null };
            }
            catch (error) {
                if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_1__.isStorageError)(error)) {
                    return { data: null, error };
                }
                throw error;
            }
        });
    }
    /**
     * Get file metadata
     * @param id the file id to retrieve metadata
     */
    // async getMetadata(
    //   id: string
    // ): Promise<
    //   | {
    //       data: Metadata
    //       error: null
    //     }
    //   | {
    //       data: null
    //       error: StorageError
    //     }
    // > {
    //   try {
    //     const data = await get(this.fetch, `${this.url}/metadata/${id}`, { headers: this.headers })
    //     return { data, error: null }
    //   } catch (error) {
    //     if (isStorageError(error)) {
    //       return { data: null, error }
    //     }
    //     throw error
    //   }
    // }
    /**
     * Update file metadata
     * @param id the file id to update metadata
     * @param meta the new file metadata
     */
    // async updateMetadata(
    //   id: string,
    //   meta: Metadata
    // ): Promise<
    //   | {
    //       data: Metadata
    //       error: null
    //     }
    //   | {
    //       data: null
    //       error: StorageError
    //     }
    // > {
    //   try {
    //     const data = await post(
    //       this.fetch,
    //       `${this.url}/metadata/${id}`,
    //       { ...meta },
    //       { headers: this.headers }
    //     )
    //     return { data, error: null }
    //   } catch (error) {
    //     if (isStorageError(error)) {
    //       return { data: null, error }
    //     }
    //     throw error
    //   }
    // }
    /**
     * Lists all the files within a bucket.
     * @param path The folder path.
     */
    list(path, options, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = Object.assign(Object.assign(Object.assign({}, DEFAULT_SEARCH_OPTIONS), options), { prefix: path || '' });
                const data = yield (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_2__.post)(this.fetch, `${this.url}/object/list/${this.bucketId}`, body, { headers: this.headers }, parameters);
                return { data, error: null };
            }
            catch (error) {
                if ((0,_lib_errors__WEBPACK_IMPORTED_MODULE_1__.isStorageError)(error)) {
                    return { data: null, error };
                }
                throw error;
            }
        });
    }
    encodeMetadata(metadata) {
        return JSON.stringify(metadata);
    }
    toBase64(data) {
        if (typeof Buffer !== 'undefined') {
            return Buffer.from(data).toString('base64');
        }
        return btoa(data);
    }
    _getFinalPath(path) {
        return `${this.bucketId}/${path}`;
    }
    _removeEmptyFolders(path) {
        return path.replace(/^\/|\/$/g, '').replace(/\/+/g, '/');
    }
    transformOptsToQueryString(transform) {
        const params = [];
        if (transform.width) {
            params.push(`width=${transform.width}`);
        }
        if (transform.height) {
            params.push(`height=${transform.height}`);
        }
        if (transform.resize) {
            params.push(`resize=${transform.resize}`);
        }
        if (transform.format) {
            params.push(`format=${transform.format}`);
        }
        if (transform.quality) {
            params.push(`quality=${transform.quality}`);
        }
        return params.join('&');
    }
}
//# sourceMappingURL=StorageFileApi.js.map

/***/ }),

/***/ "./node_modules/@supabase/supabase-js/dist/module/SupabaseClient.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@supabase/supabase-js/dist/module/SupabaseClient.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SupabaseClient)
/* harmony export */ });
/* harmony import */ var _supabase_functions_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @supabase/functions-js */ "./node_modules/@supabase/functions-js/dist/module/FunctionsClient.js");
/* harmony import */ var _supabase_postgrest_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/postgrest-js */ "./node_modules/@supabase/postgrest-js/dist/esm/wrapper.mjs");
/* harmony import */ var _supabase_realtime_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @supabase/realtime-js */ "./node_modules/@supabase/realtime-js/dist/module/index.js");
/* harmony import */ var _supabase_storage_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @supabase/storage-js */ "./node_modules/@supabase/storage-js/dist/module/StorageClient.js");
/* harmony import */ var _lib_constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/constants */ "./node_modules/@supabase/supabase-js/dist/module/lib/constants.js");
/* harmony import */ var _lib_fetch__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lib/fetch */ "./node_modules/@supabase/supabase-js/dist/module/lib/fetch.js");
/* harmony import */ var _lib_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/helpers */ "./node_modules/@supabase/supabase-js/dist/module/lib/helpers.js");
/* harmony import */ var _lib_SupabaseAuthClient__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./lib/SupabaseAuthClient */ "./node_modules/@supabase/supabase-js/dist/module/lib/SupabaseAuthClient.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};








/**
 * Supabase Client.
 *
 * An isomorphic Javascript client for interacting with Postgres.
 */
class SupabaseClient {
    /**
     * Create a new client for use in the browser.
     * @param supabaseUrl The unique Supabase URL which is supplied when you create a new project in your project dashboard.
     * @param supabaseKey The unique Supabase Key which is supplied when you create a new project in your project dashboard.
     * @param options.db.schema You can switch in between schemas. The schema needs to be on the list of exposed schemas inside Supabase.
     * @param options.auth.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
     * @param options.auth.persistSession Set to "true" if you want to automatically save the user session into local storage.
     * @param options.auth.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
     * @param options.realtime Options passed along to realtime-js constructor.
     * @param options.global.fetch A custom fetch implementation.
     * @param options.global.headers Any additional headers to send with each network request.
     */
    constructor(supabaseUrl, supabaseKey, options) {
        var _a, _b, _c;
        this.supabaseUrl = supabaseUrl;
        this.supabaseKey = supabaseKey;
        if (!supabaseUrl)
            throw new Error('supabaseUrl is required.');
        if (!supabaseKey)
            throw new Error('supabaseKey is required.');
        const _supabaseUrl = (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_2__.stripTrailingSlash)(supabaseUrl);
        this.realtimeUrl = `${_supabaseUrl}/realtime/v1`.replace(/^http/i, 'ws');
        this.authUrl = `${_supabaseUrl}/auth/v1`;
        this.storageUrl = `${_supabaseUrl}/storage/v1`;
        this.functionsUrl = `${_supabaseUrl}/functions/v1`;
        // default storage key uses the supabase project ref as a namespace
        const defaultStorageKey = `sb-${new URL(this.authUrl).hostname.split('.')[0]}-auth-token`;
        const DEFAULTS = {
            db: _lib_constants__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_DB_OPTIONS,
            realtime: _lib_constants__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_REALTIME_OPTIONS,
            auth: Object.assign(Object.assign({}, _lib_constants__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_AUTH_OPTIONS), { storageKey: defaultStorageKey }),
            global: _lib_constants__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_GLOBAL_OPTIONS,
        };
        const settings = (0,_lib_helpers__WEBPACK_IMPORTED_MODULE_2__.applySettingDefaults)(options !== null && options !== void 0 ? options : {}, DEFAULTS);
        this.storageKey = (_a = settings.auth.storageKey) !== null && _a !== void 0 ? _a : '';
        this.headers = (_b = settings.global.headers) !== null && _b !== void 0 ? _b : {};
        if (!settings.accessToken) {
            this.auth = this._initSupabaseAuthClient((_c = settings.auth) !== null && _c !== void 0 ? _c : {}, this.headers, settings.global.fetch);
        }
        else {
            this.accessToken = settings.accessToken;
            this.auth = new Proxy({}, {
                get: (_, prop) => {
                    throw new Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(prop)} is not possible`);
                },
            });
        }
        this.fetch = (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_4__.fetchWithAuth)(supabaseKey, this._getAccessToken.bind(this), settings.global.fetch);
        this.realtime = this._initRealtimeClient(Object.assign({ headers: this.headers, accessToken: this._getAccessToken.bind(this) }, settings.realtime));
        this.rest = new _supabase_postgrest_js__WEBPACK_IMPORTED_MODULE_0__.PostgrestClient(`${_supabaseUrl}/rest/v1`, {
            headers: this.headers,
            schema: settings.db.schema,
            fetch: this.fetch,
        });
        if (!settings.accessToken) {
            this._listenForAuthEvents();
        }
    }
    /**
     * Supabase Functions allows you to deploy and invoke edge functions.
     */
    get functions() {
        return new _supabase_functions_js__WEBPACK_IMPORTED_MODULE_5__.FunctionsClient(this.functionsUrl, {
            headers: this.headers,
            customFetch: this.fetch,
        });
    }
    /**
     * Supabase Storage allows you to manage user-generated content, such as photos or videos.
     */
    get storage() {
        return new _supabase_storage_js__WEBPACK_IMPORTED_MODULE_6__.StorageClient(this.storageUrl, this.headers, this.fetch);
    }
    /**
     * Perform a query on a table or a view.
     *
     * @param relation - The table or view name to query
     */
    from(relation) {
        return this.rest.from(relation);
    }
    // NOTE: signatures must be kept in sync with PostgrestClient.schema
    /**
     * Select a schema to query or perform an function (rpc) call.
     *
     * The schema needs to be on the list of exposed schemas inside Supabase.
     *
     * @param schema - The schema to query
     */
    schema(schema) {
        return this.rest.schema(schema);
    }
    // NOTE: signatures must be kept in sync with PostgrestClient.rpc
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
    rpc(fn, args = {}, options = {}) {
        return this.rest.rpc(fn, args, options);
    }
    /**
     * Creates a Realtime channel with Broadcast, Presence, and Postgres Changes.
     *
     * @param {string} name - The name of the Realtime channel.
     * @param {Object} opts - The options to pass to the Realtime channel.
     *
     */
    channel(name, opts = { config: {} }) {
        return this.realtime.channel(name, opts);
    }
    /**
     * Returns all Realtime channels.
     */
    getChannels() {
        return this.realtime.getChannels();
    }
    /**
     * Unsubscribes and removes Realtime channel from Realtime client.
     *
     * @param {RealtimeChannel} channel - The name of the Realtime channel.
     *
     */
    removeChannel(channel) {
        return this.realtime.removeChannel(channel);
    }
    /**
     * Unsubscribes and removes all Realtime channels from Realtime client.
     */
    removeAllChannels() {
        return this.realtime.removeAllChannels();
    }
    _getAccessToken() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.accessToken) {
                return yield this.accessToken();
            }
            const { data } = yield this.auth.getSession();
            return (_b = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : null;
        });
    }
    _initSupabaseAuthClient({ autoRefreshToken, persistSession, detectSessionInUrl, storage, storageKey, flowType, lock, debug, }, headers, fetch) {
        const authHeaders = {
            Authorization: `Bearer ${this.supabaseKey}`,
            apikey: `${this.supabaseKey}`,
        };
        return new _lib_SupabaseAuthClient__WEBPACK_IMPORTED_MODULE_7__.SupabaseAuthClient({
            url: this.authUrl,
            headers: Object.assign(Object.assign({}, authHeaders), headers),
            storageKey: storageKey,
            autoRefreshToken,
            persistSession,
            detectSessionInUrl,
            storage,
            flowType,
            lock,
            debug,
            fetch,
            // auth checks if there is a custom authorizaiton header using this flag
            // so it knows whether to return an error when getUser is called with no session
            hasCustomAuthorizationHeader: 'Authorization' in this.headers,
        });
    }
    _initRealtimeClient(options) {
        return new _supabase_realtime_js__WEBPACK_IMPORTED_MODULE_1__.RealtimeClient(this.realtimeUrl, Object.assign(Object.assign({}, options), { params: Object.assign({ apikey: this.supabaseKey }, options === null || options === void 0 ? void 0 : options.params) }));
    }
    _listenForAuthEvents() {
        let data = this.auth.onAuthStateChange((event, session) => {
            this._handleTokenChanged(event, 'CLIENT', session === null || session === void 0 ? void 0 : session.access_token);
        });
        return data;
    }
    _handleTokenChanged(event, source, token) {
        if ((event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') &&
            this.changedAccessToken !== token) {
            this.changedAccessToken = token;
        }
        else if (event === 'SIGNED_OUT') {
            this.realtime.setAuth();
            if (source == 'STORAGE')
                this.auth.signOut();
            this.changedAccessToken = undefined;
        }
    }
}
//# sourceMappingURL=SupabaseClient.js.map

/***/ }),

/***/ "./node_modules/@supabase/supabase-js/dist/module/index.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@supabase/supabase-js/dist/module/index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthAdminApi: () => (/* reexport safe */ _supabase_auth_js__WEBPACK_IMPORTED_MODULE_0__.AuthAdminApi),
/* harmony export */   AuthApiError: () => (/* reexport safe */ _supabase_auth_js__WEBPACK_IMPORTED_MODULE_0__.AuthApiError),
/* harmony export */   AuthClient: () => (/* reexport safe */ _supabase_auth_js__WEBPACK_IMPORTED_MODULE_0__.AuthClient),
/* harmony export */   AuthError: () => (/* reexport safe */ _supabase_auth_js__WEBPACK_IMPORTED_MODULE_0__.AuthError),
/* harmony export */   AuthImplicitGrantRedirectError: () => (/* reexport safe */ _supabase_auth_js__WEBPACK_IMPORTED_MODULE_0__.AuthImplicitGrantRedirectError),
/* harmony export */   AuthInvalidCredentialsError: () => (/* reexport safe */ _supabase_auth_js__WEBPACK_IMPORTED_MODULE_0__.AuthInvalidCredentialsError),
/* harmony export */   AuthInvalidTokenResponseError: () => (/* reexport safe */ _supabase_auth_js__WEBPACK_IMPORTED_MODULE_0__.AuthInvalidTokenResponseError),
/* harmony export */   AuthPKCEGrantCodeExchangeError: () => (/* reexport safe */ _supabase_auth_js__WEBPACK_IMPORTED_MODULE_0__.AuthPKCEGrantCodeExchangeError),
/* harmony export */   AuthRetryableFetchError: () => (/* reexport safe */ _supabase_auth_js__WEBPACK_IMPORTED_MODULE_0__.AuthRetryableFetchError),
/* harmony export */   AuthSessionMissingError: () => (/* reexport safe */ _supabase_auth_js__WEBPACK_IMPORTED_MODULE_0__.AuthSessionMissingError),
/* harmony export */   AuthUnknownError: () => (/* reexport safe */ _supabase_auth_js__WEBPACK_IMPORTED_MODULE_0__.AuthUnknownError),
/* harmony export */   AuthWeakPasswordError: () => (/* reexport safe */ _supabase_auth_js__WEBPACK_IMPORTED_MODULE_0__.AuthWeakPasswordError),
/* harmony export */   CustomAuthError: () => (/* reexport safe */ _supabase_auth_js__WEBPACK_IMPORTED_MODULE_0__.CustomAuthError),
/* harmony export */   FunctionRegion: () => (/* reexport safe */ _supabase_functions_js__WEBPACK_IMPORTED_MODULE_2__.FunctionRegion),
/* harmony export */   FunctionsError: () => (/* reexport safe */ _supabase_functions_js__WEBPACK_IMPORTED_MODULE_2__.FunctionsError),
/* harmony export */   FunctionsFetchError: () => (/* reexport safe */ _supabase_functions_js__WEBPACK_IMPORTED_MODULE_2__.FunctionsFetchError),
/* harmony export */   FunctionsHttpError: () => (/* reexport safe */ _supabase_functions_js__WEBPACK_IMPORTED_MODULE_2__.FunctionsHttpError),
/* harmony export */   FunctionsRelayError: () => (/* reexport safe */ _supabase_functions_js__WEBPACK_IMPORTED_MODULE_2__.FunctionsRelayError),
/* harmony export */   GoTrueAdminApi: () => (/* reexport safe */ _supabase_auth_js__WEBPACK_IMPORTED_MODULE_0__.GoTrueAdminApi),
/* harmony export */   GoTrueClient: () => (/* reexport safe */ _supabase_auth_js__WEBPACK_IMPORTED_MODULE_0__.GoTrueClient),
/* harmony export */   NavigatorLockAcquireTimeoutError: () => (/* reexport safe */ _supabase_auth_js__WEBPACK_IMPORTED_MODULE_0__.NavigatorLockAcquireTimeoutError),
/* harmony export */   PostgrestError: () => (/* reexport safe */ _supabase_postgrest_js__WEBPACK_IMPORTED_MODULE_1__.PostgrestError),
/* harmony export */   REALTIME_CHANNEL_STATES: () => (/* reexport safe */ _supabase_realtime_js__WEBPACK_IMPORTED_MODULE_3__.REALTIME_CHANNEL_STATES),
/* harmony export */   REALTIME_LISTEN_TYPES: () => (/* reexport safe */ _supabase_realtime_js__WEBPACK_IMPORTED_MODULE_3__.REALTIME_LISTEN_TYPES),
/* harmony export */   REALTIME_POSTGRES_CHANGES_LISTEN_EVENT: () => (/* reexport safe */ _supabase_realtime_js__WEBPACK_IMPORTED_MODULE_3__.REALTIME_POSTGRES_CHANGES_LISTEN_EVENT),
/* harmony export */   REALTIME_PRESENCE_LISTEN_EVENTS: () => (/* reexport safe */ _supabase_realtime_js__WEBPACK_IMPORTED_MODULE_3__.REALTIME_PRESENCE_LISTEN_EVENTS),
/* harmony export */   REALTIME_SUBSCRIBE_STATES: () => (/* reexport safe */ _supabase_realtime_js__WEBPACK_IMPORTED_MODULE_3__.REALTIME_SUBSCRIBE_STATES),
/* harmony export */   RealtimeChannel: () => (/* reexport safe */ _supabase_realtime_js__WEBPACK_IMPORTED_MODULE_3__.RealtimeChannel),
/* harmony export */   RealtimeClient: () => (/* reexport safe */ _supabase_realtime_js__WEBPACK_IMPORTED_MODULE_3__.RealtimeClient),
/* harmony export */   RealtimePresence: () => (/* reexport safe */ _supabase_realtime_js__WEBPACK_IMPORTED_MODULE_3__.RealtimePresence),
/* harmony export */   SupabaseClient: () => (/* reexport safe */ _SupabaseClient__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   createClient: () => (/* binding */ createClient),
/* harmony export */   isAuthApiError: () => (/* reexport safe */ _supabase_auth_js__WEBPACK_IMPORTED_MODULE_0__.isAuthApiError),
/* harmony export */   isAuthError: () => (/* reexport safe */ _supabase_auth_js__WEBPACK_IMPORTED_MODULE_0__.isAuthError),
/* harmony export */   isAuthImplicitGrantRedirectError: () => (/* reexport safe */ _supabase_auth_js__WEBPACK_IMPORTED_MODULE_0__.isAuthImplicitGrantRedirectError),
/* harmony export */   isAuthRetryableFetchError: () => (/* reexport safe */ _supabase_auth_js__WEBPACK_IMPORTED_MODULE_0__.isAuthRetryableFetchError),
/* harmony export */   isAuthSessionMissingError: () => (/* reexport safe */ _supabase_auth_js__WEBPACK_IMPORTED_MODULE_0__.isAuthSessionMissingError),
/* harmony export */   isAuthWeakPasswordError: () => (/* reexport safe */ _supabase_auth_js__WEBPACK_IMPORTED_MODULE_0__.isAuthWeakPasswordError),
/* harmony export */   lockInternals: () => (/* reexport safe */ _supabase_auth_js__WEBPACK_IMPORTED_MODULE_0__.lockInternals),
/* harmony export */   navigatorLock: () => (/* reexport safe */ _supabase_auth_js__WEBPACK_IMPORTED_MODULE_0__.navigatorLock)
/* harmony export */ });
/* harmony import */ var _SupabaseClient__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SupabaseClient */ "./node_modules/@supabase/supabase-js/dist/module/SupabaseClient.js");
/* harmony import */ var _supabase_auth_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/auth-js */ "./node_modules/@supabase/auth-js/dist/module/index.js");
/* harmony import */ var _supabase_postgrest_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @supabase/postgrest-js */ "./node_modules/@supabase/postgrest-js/dist/esm/wrapper.mjs");
/* harmony import */ var _supabase_functions_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @supabase/functions-js */ "./node_modules/@supabase/functions-js/dist/module/types.js");
/* harmony import */ var _supabase_realtime_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @supabase/realtime-js */ "./node_modules/@supabase/realtime-js/dist/module/index.js");






/**
 * Creates a new Supabase Client.
 */
const createClient = (supabaseUrl, supabaseKey, options) => {
    return new _SupabaseClient__WEBPACK_IMPORTED_MODULE_4__["default"](supabaseUrl, supabaseKey, options);
};
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@supabase/supabase-js/dist/module/lib/SupabaseAuthClient.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@supabase/supabase-js/dist/module/lib/SupabaseAuthClient.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SupabaseAuthClient: () => (/* binding */ SupabaseAuthClient)
/* harmony export */ });
/* harmony import */ var _supabase_auth_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/auth-js */ "./node_modules/@supabase/auth-js/dist/module/index.js");

class SupabaseAuthClient extends _supabase_auth_js__WEBPACK_IMPORTED_MODULE_0__.AuthClient {
    constructor(options) {
        super(options);
    }
}
//# sourceMappingURL=SupabaseAuthClient.js.map

/***/ }),

/***/ "./node_modules/@supabase/supabase-js/dist/module/lib/constants.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@supabase/supabase-js/dist/module/lib/constants.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_AUTH_OPTIONS: () => (/* binding */ DEFAULT_AUTH_OPTIONS),
/* harmony export */   DEFAULT_DB_OPTIONS: () => (/* binding */ DEFAULT_DB_OPTIONS),
/* harmony export */   DEFAULT_GLOBAL_OPTIONS: () => (/* binding */ DEFAULT_GLOBAL_OPTIONS),
/* harmony export */   DEFAULT_HEADERS: () => (/* binding */ DEFAULT_HEADERS),
/* harmony export */   DEFAULT_REALTIME_OPTIONS: () => (/* binding */ DEFAULT_REALTIME_OPTIONS)
/* harmony export */ });
/* harmony import */ var _version__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./version */ "./node_modules/@supabase/supabase-js/dist/module/lib/version.js");

let JS_ENV = '';
// @ts-ignore
if (typeof Deno !== 'undefined') {
    JS_ENV = 'deno';
}
else if (typeof document !== 'undefined') {
    JS_ENV = 'web';
}
else if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    JS_ENV = 'react-native';
}
else {
    JS_ENV = 'node';
}
const DEFAULT_HEADERS = { 'X-Client-Info': `supabase-js-${JS_ENV}/${_version__WEBPACK_IMPORTED_MODULE_0__.version}` };
const DEFAULT_GLOBAL_OPTIONS = {
    headers: DEFAULT_HEADERS,
};
const DEFAULT_DB_OPTIONS = {
    schema: 'public',
};
const DEFAULT_AUTH_OPTIONS = {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'implicit',
};
const DEFAULT_REALTIME_OPTIONS = {};
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ "./node_modules/@supabase/supabase-js/dist/module/lib/fetch.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@supabase/supabase-js/dist/module/lib/fetch.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fetchWithAuth: () => (/* binding */ fetchWithAuth),
/* harmony export */   resolveFetch: () => (/* binding */ resolveFetch),
/* harmony export */   resolveHeadersConstructor: () => (/* binding */ resolveHeadersConstructor)
/* harmony export */ });
/* harmony import */ var _supabase_node_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/node-fetch */ "./node_modules/@supabase/node-fetch/browser.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// @ts-ignore

const resolveFetch = (customFetch) => {
    let _fetch;
    if (customFetch) {
        _fetch = customFetch;
    }
    else if (typeof fetch === 'undefined') {
        _fetch = _supabase_node_fetch__WEBPACK_IMPORTED_MODULE_0__["default"];
    }
    else {
        _fetch = fetch;
    }
    return (...args) => _fetch(...args);
};
const resolveHeadersConstructor = () => {
    if (typeof Headers === 'undefined') {
        return _supabase_node_fetch__WEBPACK_IMPORTED_MODULE_0__.Headers;
    }
    return Headers;
};
const fetchWithAuth = (supabaseKey, getAccessToken, customFetch) => {
    const fetch = resolveFetch(customFetch);
    const HeadersConstructor = resolveHeadersConstructor();
    return (input, init) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const accessToken = (_a = (yield getAccessToken())) !== null && _a !== void 0 ? _a : supabaseKey;
        let headers = new HeadersConstructor(init === null || init === void 0 ? void 0 : init.headers);
        if (!headers.has('apikey')) {
            headers.set('apikey', supabaseKey);
        }
        if (!headers.has('Authorization')) {
            headers.set('Authorization', `Bearer ${accessToken}`);
        }
        return fetch(input, Object.assign(Object.assign({}, init), { headers }));
    });
};
//# sourceMappingURL=fetch.js.map

/***/ }),

/***/ "./node_modules/@supabase/supabase-js/dist/module/lib/helpers.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@supabase/supabase-js/dist/module/lib/helpers.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applySettingDefaults: () => (/* binding */ applySettingDefaults),
/* harmony export */   isBrowser: () => (/* binding */ isBrowser),
/* harmony export */   stripTrailingSlash: () => (/* binding */ stripTrailingSlash),
/* harmony export */   uuid: () => (/* binding */ uuid)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
function stripTrailingSlash(url) {
    return url.replace(/\/$/, '');
}
const isBrowser = () => typeof window !== 'undefined';
function applySettingDefaults(options, defaults) {
    const { db: dbOptions, auth: authOptions, realtime: realtimeOptions, global: globalOptions, } = options;
    const { db: DEFAULT_DB_OPTIONS, auth: DEFAULT_AUTH_OPTIONS, realtime: DEFAULT_REALTIME_OPTIONS, global: DEFAULT_GLOBAL_OPTIONS, } = defaults;
    const result = {
        db: Object.assign(Object.assign({}, DEFAULT_DB_OPTIONS), dbOptions),
        auth: Object.assign(Object.assign({}, DEFAULT_AUTH_OPTIONS), authOptions),
        realtime: Object.assign(Object.assign({}, DEFAULT_REALTIME_OPTIONS), realtimeOptions),
        global: Object.assign(Object.assign({}, DEFAULT_GLOBAL_OPTIONS), globalOptions),
        accessToken: () => __awaiter(this, void 0, void 0, function* () { return ''; }),
    };
    if (options.accessToken) {
        result.accessToken = options.accessToken;
    }
    else {
        // hack around Required<>
        delete result.accessToken;
    }
    return result;
}
//# sourceMappingURL=helpers.js.map

/***/ }),

/***/ "./node_modules/@supabase/supabase-js/dist/module/lib/version.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@supabase/supabase-js/dist/module/lib/version.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   version: () => (/* binding */ version)
/* harmony export */ });
const version = '2.49.1';
//# sourceMappingURL=version.js.map

/***/ }),

/***/ "./src/content/api/index.ts":
/*!**********************************!*\
  !*** ./src/content/api/index.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/**
 * API handling module exports
 * Re-exports all LinkedIn API handling functions for easy importing
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isLinkedInEasyApplyRequest = exports.extractJobIdFromRequest = exports.restoreOriginalFetch = exports.setupLinkedInAPIInterception = void 0;
// LinkedIn API interception and utilities
var linkedin_1 = __webpack_require__(/*! ./linkedin */ "./src/content/api/linkedin.ts");
Object.defineProperty(exports, "setupLinkedInAPIInterception", ({ enumerable: true, get: function () { return linkedin_1.setupLinkedInAPIInterception; } }));
Object.defineProperty(exports, "restoreOriginalFetch", ({ enumerable: true, get: function () { return linkedin_1.restoreOriginalFetch; } }));
Object.defineProperty(exports, "extractJobIdFromRequest", ({ enumerable: true, get: function () { return linkedin_1.extractJobIdFromRequest; } }));
Object.defineProperty(exports, "isLinkedInEasyApplyRequest", ({ enumerable: true, get: function () { return linkedin_1.isLinkedInEasyApplyRequest; } }));


/***/ }),

/***/ "./src/content/api/linkedin.ts":
/*!*************************************!*\
  !*** ./src/content/api/linkedin.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


/**
 * LinkedIn API handling module for the LinkedIn Easy Apply extension
 * Handles fetch interception, LinkedIn API response processing, and 409 conflict error management
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isLinkedInEasyApplyRequest = exports.extractJobIdFromRequest = exports.restoreOriginalFetch = exports.setupLinkedInAPIInterception = void 0;
// Store reference to the original fetch function
let originalFetch;
/**
 * Sets up LinkedIn API fetch interception to handle Easy Apply requests and 409 conflicts
 * Patches the global fetch function to intercept LinkedIn API calls and track already-applied jobs
 * @param deps - Dependencies required for API handling
 */
const setupLinkedInAPIInterception = (deps) => {
    // Save the original fetch function
    originalFetch = window.fetch;
    // Patch the fetch API to intercept LinkedIn API calls and handle 409 errors
    window.fetch = async function (input, init) {
        // Check if this is a LinkedIn Easy Apply API request
        let url = '';
        if (typeof input === 'string') {
            url = input;
        }
        else if (input instanceof URL) {
            url = input.toString();
        }
        else if ('url' in input) {
            // It's a Request object
            url = input.url;
        }
        if (url.includes('voyagerJobsDashOnsiteApplyApplication') && init?.method === 'POST') {
            try {
                // Extract the job ID from the URL or body
                let jobId = '';
                try {
                    if (init.body) {
                        const bodyText = init.body.toString();
                        // Try to extract the job ID from the request body
                        const match = bodyText.match(/jobId=(\d+)/);
                        if (match && match[1]) {
                            jobId = match[1];
                        }
                    }
                    if (!jobId) {
                        // Try to extract from URL
                        const urlMatch = url.match(/jobId=(\d+)/);
                        if (urlMatch && urlMatch[1]) {
                            jobId = urlMatch[1];
                        }
                    }
                }
                catch (e) {
                    // Ignore parsing errors, just continue
                }
                // Make the actual request
                const response = await originalFetch(input, init);
                // If we get a 409 Conflict and have a job ID
                if (response.status === 409 && jobId) {
                    if (!deps.skipped409Jobs.has(jobId)) {
                        console.log(`🔁 Skipping already-applied job ID: ${jobId}`);
                        deps.skipped409Jobs.add(jobId);
                        // Persist to Chrome storage
                        chrome.storage.local.get(['skipped409Jobs'], result => {
                            const storedIds = result.skipped409Jobs || [];
                            if (!storedIds.includes(jobId)) {
                                storedIds.push(jobId);
                                chrome.storage.local.set({ skipped409Jobs: storedIds });
                            }
                        });
                    }
                }
                return response;
            }
            catch (error) {
                return await originalFetch(input, init);
            }
        }
        // For all other requests, just pass through to the original fetch
        return await originalFetch(input, init);
    };
};
exports.setupLinkedInAPIInterception = setupLinkedInAPIInterception;
/**
 * Restores the original fetch function (for cleanup or testing)
 * Removes the LinkedIn API interception and restores normal fetch behavior
 */
const restoreOriginalFetch = () => {
    if (originalFetch) {
        window.fetch = originalFetch;
    }
};
exports.restoreOriginalFetch = restoreOriginalFetch;
/**
 * Extracts job ID from LinkedIn API request
 * Utility function to extract job ID from various sources in LinkedIn API calls
 * @param url - The request URL
 * @param body - The request body (optional)
 * @returns The extracted job ID or null if not found
 */
const extractJobIdFromRequest = (url, body) => {
    let jobId = null;
    try {
        // Try to extract from request body first
        if (body) {
            const bodyText = body.toString();
            const match = bodyText.match(/jobId=(\d+)/);
            if (match && match[1]) {
                jobId = match[1];
            }
        }
        // Try to extract from URL if not found in body
        if (!jobId) {
            const urlMatch = url.match(/jobId=(\d+)/);
            if (urlMatch && urlMatch[1]) {
                jobId = urlMatch[1];
            }
        }
    }
    catch (e) {
        // Ignore parsing errors
    }
    return jobId;
};
exports.extractJobIdFromRequest = extractJobIdFromRequest;
/**
 * Checks if a URL is a LinkedIn Easy Apply API endpoint
 * @param url - The URL to check
 * @param method - The HTTP method (optional)
 * @returns True if this is a LinkedIn Easy Apply API request
 */
const isLinkedInEasyApplyRequest = (url, method) => {
    return url.includes('voyagerJobsDashOnsiteApplyApplication') &&
        (!method || method.toUpperCase() === 'POST');
};
exports.isLinkedInEasyApplyRequest = isLinkedInEasyApplyRequest;


/***/ }),

/***/ "./src/content/application/flow.ts":
/*!*****************************************!*\
  !*** ./src/content/application/flow.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/**
 * Application flow utility functions for the LinkedIn Easy Apply extension
 * These functions handle the flow of the application process, including button clicks and popup management
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.handleSaveApplicationPopup = exports.handleButtonClick = void 0;
const utils_1 = __webpack_require__(/*! ../utils */ "./src/content/utils/index.ts");
const tracking_1 = __webpack_require__(/*! ../tracking */ "./src/content/tracking/index.ts");
/**
 * Handles clicking buttons in the LinkedIn Easy Apply modal
 * Tries multiple button types in order: submit, review, next, and primary buttons
 * @param jobTitle - The title of the job being applied to
 * @param companyName - The name of the company
 * @param jobElement - The job card HTML element
 * @param appliedJobIds - Set of job IDs that have already been processed
 * @returns Promise<boolean> true if a button was clicked, false otherwise
 */
const handleButtonClick = async (jobTitle, companyName, jobElement, appliedJobIds) => {
    // First try to find submit button within the modal
    const modal = document.querySelector('.artdeco-modal__content.jobs-easy-apply-modal__content');
    if (!modal)
        return false;
    const submitButton = modal.querySelector('button[aria-label="Submit application"]');
    if (submitButton && (0, utils_1.isElementVisible)(submitButton)) {
        await (0, utils_1.sleep)(500);
        submitButton.click();
        // Track the successful application
        await (0, tracking_1.trackSuccessfulApplication)(jobTitle, companyName, jobElement, appliedJobIds);
        // Wait 1 second after submit click
        await (0, utils_1.sleep)(1000);
        // Look for and click the close button
        const closeButton = document.querySelector('button[aria-label="Dismiss"].artdeco-modal__dismiss');
        if (closeButton && (0, utils_1.isElementVisible)(closeButton)) {
            await (0, utils_1.sleep)(500);
            closeButton.click();
        }
        return true;
    }
    // Try review button within the modal
    const reviewButton = modal.querySelector('button[aria-label="Review your application"]');
    if (reviewButton && (0, utils_1.isElementVisible)(reviewButton)) {
        await (0, utils_1.sleep)(500);
        reviewButton.click();
        return true;
    }
    // Try next button within the modal
    const nextButton = modal.querySelector('button[aria-label="Continue to next step"]');
    if (nextButton && (0, utils_1.isElementVisible)(nextButton)) {
        await (0, utils_1.sleep)(500);
        nextButton.click();
        return true;
    }
    // Try finding any primary button with Next text within the modal
    const primaryButtons = modal.querySelectorAll('.artdeco-button--primary');
    for (const button of primaryButtons) {
        if ((0, utils_1.isElementVisible)(button)) {
            const text = button.textContent?.trim().toLowerCase() || '';
            if (text.includes('next') || text.includes('continue')) {
                button.click();
                return true;
            }
        }
    }
    return false;
};
exports.handleButtonClick = handleButtonClick;
/**
 * Handles the "Save Application" popup that sometimes appears
 * Looks for discard button and clicks it to continue without saving
 * @returns Promise<boolean> true if popup was handled, false if no popup found
 */
const handleSaveApplicationPopup = async () => {
    // Look for any button with the specific data-control-name for discard
    const discardButton = document.querySelector('button[data-control-name="discard_application_confirm_btn"]');
    if (discardButton && (0, utils_1.isElementVisible)(discardButton)) {
        discardButton.click();
        await (0, utils_1.sleep)(500);
        return true;
    }
    return false;
};
exports.handleSaveApplicationPopup = handleSaveApplicationPopup;


/***/ }),

/***/ "./src/content/application/index.ts":
/*!******************************************!*\
  !*** ./src/content/application/index.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/**
 * Application module exports
 * Re-exports all application-related functions for easy importing
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.handleSaveApplicationPopup = exports.handleButtonClick = void 0;
// Application flow utilities
var flow_1 = __webpack_require__(/*! ./flow */ "./src/content/application/flow.ts");
Object.defineProperty(exports, "handleButtonClick", ({ enumerable: true, get: function () { return flow_1.handleButtonClick; } }));
Object.defineProperty(exports, "handleSaveApplicationPopup", ({ enumerable: true, get: function () { return flow_1.handleSaveApplicationPopup; } }));


/***/ }),

/***/ "./src/content/autofill/workday.ts":
/*!*****************************************!*\
  !*** ./src/content/autofill/workday.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.autofillWorkday = autofillWorkday;
console.log("Workday autofill module loaded - Step by step implementation");
// Step 1: Personal Information Selectors (based on actual captured HTML)
const WORKDAY_STEP1_SELECTORS = {
    // Legal Name Section
    FIRST_NAME: [
        'input[id="name--legalName--firstName"]',
        'input[name="legalName--firstName"]',
        'input[data-automation-id="formField-legalName--firstName"] input'
    ],
    MIDDLE_NAME: [
        'input[id="name--legalName--middleName"]',
        'input[name="legalName--middleName"]',
        'input[data-automation-id="formField-legalName--middleName"] input'
    ],
    LAST_NAME: [
        'input[id="name--legalName--lastName"]',
        'input[name="legalName--lastName"]',
        'input[data-automation-id="formField-legalName--lastName"] input'
    ],
    // Address Section
    ADDRESS_LINE_1: [
        'input[id="address--addressLine1"]',
        'input[name="addressLine1"]',
        'input[data-automation-id="formField-addressLine1"] input'
    ],
    CITY: [
        'input[id="address--city"]',
        'input[name="city"]',
        'input[data-automation-id="formField-city"] input'
    ],
    STATE: [
        'button[id="address--countryRegion"]',
        'button[name="countryRegion"]',
        'div[data-automation-id="formField-countryRegion"] button',
        'select[name*="state"]',
        'select[name*="State"]',
        'button[aria-label*="State"]',
        'div[data-automation-id*="state"] button',
        'div[data-automation-id*="State"] button'
    ],
    POSTAL_CODE: [
        'input[id="address--postalCode"]',
        'input[name="postalCode"]',
        'input[data-automation-id="formField-postalCode"] input'
    ],
    // Phone Section
    PHONE_NUMBER: [
        'input[id="phoneNumber--phoneNumber"]',
        'input[name="phoneNumber"]',
        'input[data-automation-id="formField-phoneNumber"] input'
    ],
    PHONE_EXTENSION: [
        'input[id="phoneNumber--extension"]',
        'input[name="extension"]',
        'input[data-automation-id="formField-extension"] input'
    ],
    // Country Selection
    COUNTRY: [
        'button[id="country--country"]',
        'button[name="country"]',
        'div[data-automation-id="formField-country"] button'
    ],
    // Phone Device Type Dropdown
    PHONE_DEVICE_TYPE: [
        'button[id*="phoneDeviceType"]',
        'button[name*="phoneDeviceType"]',
        'div[data-automation-id*="phoneDeviceType"] button',
        'select[name*="phoneDeviceType"]',
        'button[aria-label*="Phone Device Type"]'
    ],
    // How Did You Hear About Us Dropdown
    HOW_DID_YOU_HEAR: [
        'button[id*="howDidYouHear"]',
        'button[name*="howDidYouHear"]',
        'div[data-automation-id*="howDidYouHear"] button',
        'select[name*="howDidYouHear"]',
        'button[aria-label*="How did you hear"]',
        'div[data-automation-id*="source"] button'
    ],
    // Previous Worker Radio Buttons
    PREVIOUS_WORKER_NO: [
        'input[name="candidateIsPreviousWorker"][value="false"]',
        'input[id*="candidateIsPreviousWorker"][value="false"]'
    ],
    PREVIOUS_WORKER_YES: [
        'input[name="candidateIsPreviousWorker"][value="true"]',
        'input[id*="candidateIsPreviousWorker"][value="true"]'
    ]
};
// Step 2: My Experience Selectors (based on actual captured HTML)
const WORKDAY_STEP2_SELECTORS = {
    // Skills Section
    SKILLS_INPUT: [
        'input[id="skills--skills"]',
        'input[data-uxi-element-id*="selectinput"]',
        'div[data-automation-id="formField-skills"] input'
    ],
    // Social Network URLs
    LINKEDIN_URL: [
        'input[id="socialNetworkAccounts--linkedInAccount"]',
        'input[name="linkedInAccount"]',
        'input[data-automation-id="formField-linkedInAccount"] input'
    ],
    TWITTER_URL: [
        'input[id="socialNetworkAccounts--twitterAccount"]',
        'input[name="twitterAccount"]',
        'input[data-automation-id="formField-twitterAccount"] input'
    ],
    FACEBOOK_URL: [
        'input[id="socialNetworkAccounts--facebookAccount"]',
        'input[name="facebookAccount"]',
        'input[data-automation-id="formField-facebookAccount"] input'
    ],
    // Resume Upload
    RESUME_FILE_INPUT: [
        'input[data-automation-id="file-upload-input-ref"]',
        'input[type="file"]',
        'input[data-automation-id*="resume"]',
        'input[data-automation-id*="attachment"]',
        'input[data-automation-id*="file"]',
        'input[accept*=".pdf"]',
        'input[accept*=".doc"]',
        'div[data-automation-id*="resume"] input[type="file"]',
        'div[data-automation-id*="attachment"] input[type="file"]',
        '#resumeAttachments input[type="file"]',
        '[data-automation-id="resume-upload"] input[type="file"]'
    ],
    RESUME_SELECT_BUTTON: [
        'button[data-automation-id="select-files"]',
        'button[id="resumeAttachments--attachments"]',
        'button[data-automation-id*="resume"]',
        'button[data-automation-id*="select-file"]',
        'button[data-automation-id*="browse"]',
        'button[data-automation-id*="upload"]',
        'button[aria-label*="Select File"]',
        'button[aria-label*="Browse"]',
        'button[aria-label*="Upload"]',
        'button[title*="Select File"]',
        'button[title*="Browse"]',
        'button[title*="Upload"]'
    ],
    RESUME_UPLOAD_AREA: [
        'div[data-automation-id*="resume-upload"]',
        'div[data-automation-id*="file-upload"]',
        'div[data-automation-id*="attachment"]',
        '.file-upload-area',
        '.resume-upload',
        '[data-automation-id="dropzone"]'
    ],
    // Add Buttons for sections that require manual entry
    WORK_EXPERIENCE_ADD: [
        'div[aria-labelledby="Work-Experience-section"] button[data-automation-id="add-button"]'
    ],
    EDUCATION_ADD: [
        'div[aria-labelledby="Education-section"] button[data-automation-id="add-button"]',
        'div[aria-labelledby="Education"] button[data-automation-id="add-button"]',
        'button[data-automation-id="addEducation"]',
        'button[data-automation-id="education-add-button"]',
        'div[data-automation-id="Education"] button',
        'div[data-automation-id="education-section"] button',
        'button:contains("Add Education")',
        'button:contains("+ Education")',
        'button[aria-label*="Add Education"]'
    ],
    CERTIFICATIONS_ADD: [
        'div[aria-labelledby="Certifications-section"] button[data-automation-id="add-button"]'
    ],
    LANGUAGES_ADD: [
        'div[aria-labelledby="Languages-section"] button[data-automation-id="add-button"]',
        'div[data-automation-id*="languages"] button[data-automation-id="add-button"]',
        'button[data-automation-id*="languages-add"]',
        'button[aria-label*="Add Language"]',
        'button[title*="Add Language"]',
        // Fallback text-based search will be handled separately
    ],
    WEBSITES_ADD: [
        'div[aria-labelledby="Websites-section"] button[data-automation-id="add-button"]'
    ]
};
// Work Experience Modal Selectors (for the form that opens after clicking Add)
const WORKDAY_WORK_EXPERIENCE_MODAL = {
    JOB_TITLE: [
        'input[name*="jobTitle"]',
        'input[placeholder*="Job Title"]',
        'div[data-automation-id*="jobTitle"] input'
    ],
    COMPANY: [
        'input[name*="company"]',
        'input[name*="Company"]',
        'div[data-automation-id*="company"] input'
    ],
    LOCATION: [
        'input[name*="location"]',
        'input[name*="Location"]',
        'div[data-automation-id*="location"] input'
    ],
    CURRENTLY_WORK_HERE: [
        'input[name*="currentlyWork"]',
        'input[name*="currentJob"]',
        'input[id*="currentlyWork"]',
        'input[id*="currentJob"]',
        'div[data-automation-id*="currentlyWork"] input[type="checkbox"]',
        'div[data-automation-id*="currentJob"] input[type="checkbox"]',
        'input[type="checkbox"][aria-describedby*="current"]',
        'input[type="checkbox"] + label:contains("currently work")',
        'label[for*="current"] input[type="checkbox"]'
    ],
    FROM_DATE: [
        'input[placeholder*="MM/YYYY"]',
        'input[placeholder*="MM/YY"]',
        'input[placeholder*="From Date"]',
        'input[name*="from"]',
        'input[name*="startDate"]',
        'div[data-automation-id*="from"] input',
        'div[data-automation-id*="startDate"] input'
    ],
    TO_DATE: [
        'input[placeholder*="MM/YYYY"]:not([name*="from"])',
        'input[placeholder*="MM/YY"]:not([name*="from"])',
        'input[placeholder*="To Date"]',
        'input[name*="to"]',
        'input[name*="endDate"]',
        'div[data-automation-id*="to"] input',
        'div[data-automation-id*="endDate"] input'
    ],
    DESCRIPTION: [
        'textarea[name*="description"]',
        'textarea[placeholder*="Role Description"]',
        'div[data-automation-id*="description"] textarea'
    ],
    SAVE_BUTTON: [
        'button[data-automation-id="wd-CommandButton_uic_okButton"]',
        'button:contains("Save")',
        'button:contains("OK")',
        'button[title="OK"]'
    ],
    ADD_ANOTHER_BUTTON: [
        'button[data-automation-id="wd-CommandButton_uic_addAnotherButton"]',
        'button:contains("Add Another")',
        'button[data-automation-id*="addAnother"]'
    ],
    DONE_BUTTON: [
        'button[data-automation-id="wd-CommandButton_uic_doneButton"]',
        'button:contains("Done")',
        'button[title="Done"]'
    ]
};
// Education Modal Selectors
const WORKDAY_EDUCATION_MODAL = {
    SCHOOL_NAME: [
        'input[name*="school"]',
        'input[name*="institution"]',
        'input[placeholder*="School"]',
        'div[data-automation-id*="school"] input'
    ],
    DEGREE_TYPE: [
        'button[name*="degree"]',
        'button[name*="degreeType"]',
        'div[data-automation-id*="degree"] button'
    ],
    FIELD_OF_STUDY: [
        'input[name*="major"]',
        'input[name*="fieldOfStudy"]',
        'input[placeholder*="Field of Study"]',
        'div[data-automation-id*="major"] input'
    ],
    GPA: [
        'input[name*="gpa"]',
        'input[placeholder*="GPA"]',
        'div[data-automation-id*="gpa"] input'
    ],
    GRADUATION_DATE: [
        'input[placeholder*="MM/YYYY"]',
        'input[placeholder*="MM/YY"]',
        'input[placeholder*="Graduation"]',
        'input[placeholder*="YYYY"]',
        'input[name*="graduation"]',
        'input[name*="completionDate"]',
        'div[data-automation-id*="graduation"] input',
        'div[data-automation-id*="completionDate"] input'
    ],
    SAVE_BUTTON: [
        'button[data-automation-id="wd-CommandButton_uic_okButton"]',
        'button:contains("Save")',
        'button:contains("OK")',
        'button[title="OK"]'
    ],
    ADD_ANOTHER_BUTTON: [
        'button[data-automation-id="wd-CommandButton_uic_addAnotherButton"]',
        'button:contains("Add Another")',
        'button[data-automation-id*="addAnother"]'
    ],
    DONE_BUTTON: [
        'button[data-automation-id="wd-CommandButton_uic_doneButton"]',
        'button:contains("Done")',
        'button[title="Done"]'
    ]
};
// Certifications Modal Selectors
const WORKDAY_CERTIFICATIONS_MODAL = {
    CERTIFICATION_NAME: [
        'input[name*="certification"]',
        'input[placeholder*="Certification"]',
        'div[data-automation-id*="certification"] input'
    ],
    ISSUING_ORGANIZATION: [
        'input[name*="organization"]',
        'input[name*="Organization"]',
        'div[data-automation-id*="organization"] input'
    ],
    ISSUE_DATE: [
        'input[placeholder*="MM/YYYY"]',
        'input[name*="issue"]',
        'div[data-automation-id*="issue"] input'
    ],
    CREDENTIAL_ID: [
        'input[name*="credential"]',
        'input[name*="Credential"]',
        'div[data-automation-id*="credential"] input'
    ],
    SAVE_BUTTON: [
        'button[data-automation-id="wd-CommandButton_uic_okButton"]',
        'button:contains("Save")',
        'button:contains("OK")',
        'button[title="OK"]'
    ],
    ADD_ANOTHER_BUTTON: [
        'button[data-automation-id="wd-CommandButton_uic_addAnotherButton"]',
        'button:contains("Add Another")',
        'button[data-automation-id*="addAnother"]'
    ],
    DONE_BUTTON: [
        'button[data-automation-id="wd-CommandButton_uic_doneButton"]',
        'button:contains("Done")',
        'button[title="Done"]'
    ]
};
// Languages Modal Selectors
const WORKDAY_LANGUAGES_MODAL = {
    LANGUAGE: [
        'button[name*="language"]',
        'div[data-automation-id*="language"] button',
        'button[aria-label*="Language"]',
        'button[aria-label*="Select Language"]',
        'div[data-automation-id*="formField-language"] button',
        'select[name*="language"]',
        'input[name*="language"]'
    ],
    PROFICIENCY: [
        'button[name*="proficiency"]',
        'div[data-automation-id*="proficiency"] button',
        'button[aria-label*="Proficiency"]',
        'button[aria-label*="Select Proficiency"]',
        'div[data-automation-id*="formField-proficiency"] button',
        'select[name*="proficiency"]',
        'input[name*="proficiency"]'
    ],
    SAVE_BUTTON: [
        'button[data-automation-id="wd-CommandButton_uic_okButton"]',
        'button:contains("Save")',
        'button:contains("OK")',
        'button[title="OK"]'
    ],
    ADD_ANOTHER_BUTTON: [
        'button[data-automation-id="wd-CommandButton_uic_addAnotherButton"]',
        'button:contains("Add Another")',
        'button[data-automation-id*="addAnother"]'
    ],
    DONE_BUTTON: [
        'button[data-automation-id="wd-CommandButton_uic_doneButton"]',
        'button:contains("Done")',
        'button[title="Done"]'
    ]
};
// Step 3: Application Questions Selectors (Generic questions only)
const WORKDAY_STEP3_SELECTORS = {
    // Generic dropdown questions - using button selectors since they're Workday dropdowns
    QUESTION_BUTTONS: [
        'button[aria-haspopup="listbox"][aria-label*="Select One Required"]',
        'div[data-automation-id*="formField-"] button.css-5bqb1n'
    ]
};
// Step 4: Voluntary Disclosures Selectors
const WORKDAY_STEP4_SELECTORS = {
    // Demographic Information Dropdowns
    GENDER: [
        'button[id="personalInfoUS--gender"]',
        'button[name="gender"]',
        'div[data-automation-id="formField-gender"] button'
    ],
    ETHNICITY: [
        'button[id="personalInfoUS--ethnicity"]',
        'button[name="ethnicity"]',
        'div[data-automation-id="formField-ethnicity"] button'
    ],
    VETERAN_STATUS: [
        'button[id="personalInfoUS--veteranStatus"]',
        'button[name="veteranStatus"]',
        'div[data-automation-id="formField-veteranStatus"] button'
    ],
    // Terms and Conditions Checkbox
    TERMS_CHECKBOX: [
        'input[id="termsAndConditions--acceptTermsAndAgreements"]',
        'input[name="acceptTermsAndAgreements"]',
        'div[data-automation-id="formField-acceptTermsAndAgreements"] input[type="checkbox"]'
    ]
};
// Step 5: Self Identify Selectors
const WORKDAY_STEP5_SELECTORS = {
    // Disability Status Checkboxes (Required - must select one)
    DISABILITY_YES: [
        'input[id*="disabilityStatus"][type="checkbox"]',
        'label[for*="disabilityStatus"]:contains("Yes, I have a disability")',
        'fieldset[data-automation-id="disabilityStatus-CheckboxGroup"] input[type="checkbox"]:first-child'
    ],
    DISABILITY_NO: [
        'input[id*="disabilityStatus"][type="checkbox"]',
        'label[for*="disabilityStatus"]:contains("No, I do not have a disability")',
        'fieldset[data-automation-id="disabilityStatus-CheckboxGroup"] input[type="checkbox"]:nth-child(2)'
    ],
    DISABILITY_NO_ANSWER: [
        'input[id*="disabilityStatus"][type="checkbox"]',
        'label[for*="disabilityStatus"]:contains("I do not want to answer")',
        'fieldset[data-automation-id="disabilityStatus-CheckboxGroup"] input[type="checkbox"]:last-child'
    ],
    // All disability checkboxes for finding them
    ALL_DISABILITY_CHECKBOXES: [
        'fieldset[data-automation-id="disabilityStatus-CheckboxGroup"] input[type="checkbox"]',
        'div[data-automation-id="formField-disabilityStatus"] input[type="checkbox"]'
    ]
};
// Helper functions
function findElement(selectors) {
    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
            console.log(`✅ Found element with selector: ${selector}`);
            return element;
        }
    }
    console.log(`❌ No element found for selectors:`, selectors);
    return null;
}
// Helper function to find buttons by text content (since :contains() doesn't work)
function findButtonByText(texts) {
    const buttons = document.querySelectorAll('button');
    for (const button of buttons) {
        const buttonText = button.textContent?.trim().toLowerCase() || '';
        for (const text of texts) {
            if (buttonText.includes(text.toLowerCase())) {
                console.log(`✅ Found button with text: "${buttonText}" matching "${text}"`);
                return button;
            }
        }
    }
    console.log(`❌ No button found with texts:`, texts);
    return null;
}
// Function to find checkbox by associated label text
function findCheckboxByLabelText(texts) {
    console.log(`🔍 Searching for checkbox with label texts:`, texts);
    // Method 1: Find labels with matching text, then find associated checkbox
    const labels = document.querySelectorAll('label');
    for (const label of labels) {
        const labelText = label.textContent?.trim().toLowerCase() || '';
        for (const text of texts) {
            if (labelText.includes(text.toLowerCase())) {
                console.log(`✅ Found label with text: "${labelText}" matching "${text}"`);
                // Try to find checkbox by 'for' attribute
                if (label.hasAttribute('for')) {
                    const checkboxId = label.getAttribute('for');
                    const checkbox = document.getElementById(checkboxId);
                    if (checkbox && checkbox.type === 'checkbox') {
                        console.log(`✅ Found associated checkbox by ID: ${checkboxId}`);
                        return checkbox;
                    }
                }
                // Try to find checkbox inside the label
                const checkboxInLabel = label.querySelector('input[type="checkbox"]');
                if (checkboxInLabel) {
                    console.log(`✅ Found checkbox inside label`);
                    return checkboxInLabel;
                }
                // Try to find checkbox as next sibling
                const nextSibling = label.nextElementSibling;
                if (nextSibling && nextSibling.type === 'checkbox') {
                    console.log(`✅ Found checkbox as next sibling`);
                    return nextSibling;
                }
                // Try to find checkbox as previous sibling
                const prevSibling = label.previousElementSibling;
                if (prevSibling && prevSibling.type === 'checkbox') {
                    console.log(`✅ Found checkbox as previous sibling`);
                    return prevSibling;
                }
            }
        }
    }
    // Method 2: Find checkboxes and check nearby text
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    for (const checkbox of checkboxes) {
        const parent = checkbox.parentElement;
        if (parent) {
            const parentText = parent.textContent?.trim().toLowerCase() || '';
            for (const text of texts) {
                if (parentText.includes(text.toLowerCase())) {
                    console.log(`✅ Found checkbox with parent text: "${parentText}" matching "${text}"`);
                    return checkbox;
                }
            }
        }
    }
    console.log(`❌ No checkbox found with label texts:`, texts);
    return null;
}
// React-compatible value setter for Workday forms
function setNativeValue(element, value) {
    const prototype = Object.getPrototypeOf(element);
    const valueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
    if (valueSetter) {
        valueSetter.call(element, value);
    }
    else {
        element.value = value;
    }
    // Dispatch React-compatible events
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
}
function fillInput(element, value) {
    if (!value || !element)
        return false;
    const input = element;
    try {
        console.log(`🔄 Filling input with value: "${value}"`);
        // Step 1: Focus the element
        input.focus();
        // Step 2: Clear existing value using React-compatible method
        setNativeValue(input, '');
        // Step 3: Set new value using React-compatible method
        setNativeValue(input, value);
        // Step 4: Fire comprehensive events for Workday validation
        // Input event (for real-time validation)
        input.dispatchEvent(new Event('input', { bubbles: true }));
        // Change event (for form validation)
        input.dispatchEvent(new Event('change', { bubbles: true }));
        // Blur event (to trigger field validation)
        input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
        // KeyUp event (some forms listen for this)
        input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
        // Focus out (additional validation trigger)
        input.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
        console.log(`✅ Successfully filled input with value: "${value}"`);
        return true;
    }
    catch (error) {
        console.log(`❌ Error filling input:`, error);
        return false;
    }
}
function clickRadioButton(element) {
    if (!element)
        return false;
    const radio = element;
    radio.checked = true;
    radio.click();
    // Trigger change event
    radio.dispatchEvent(new Event('change', { bubbles: true }));
    console.log(`✅ Selected radio button: ${radio.value}`);
    return true;
}
// Specialized function for handling Workday checkboxes
async function clickWorkdayCheckbox(element, shouldCheck = true) {
    if (!element)
        return false;
    const checkbox = element;
    try {
        console.log(`🔄 Attempting to ${shouldCheck ? 'check' : 'uncheck'} checkbox. Current state: ${checkbox.checked}`);
        // Method 1: Direct manipulation for React checkboxes
        if (checkbox.checked !== shouldCheck) {
            // Focus the checkbox first
            checkbox.focus();
            await new Promise(resolve => setTimeout(resolve, 100));
            // Click to toggle state
            checkbox.click();
            await new Promise(resolve => setTimeout(resolve, 200));
            // Verify the state changed correctly
            if (checkbox.checked === shouldCheck) {
                console.log(`✅ Checkbox ${shouldCheck ? 'checked' : 'unchecked'} successfully via click`);
                return true;
            }
        }
        else {
            console.log(`✅ Checkbox already in desired state: ${shouldCheck ? 'checked' : 'unchecked'}`);
            return true;
        }
        // Method 2: Force state and trigger events
        console.log(`🔄 Trying direct state manipulation`);
        checkbox.checked = shouldCheck;
        // Trigger comprehensive events for React
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        checkbox.dispatchEvent(new Event('input', { bubbles: true }));
        checkbox.dispatchEvent(new Event('click', { bubbles: true }));
        await new Promise(resolve => setTimeout(resolve, 100));
        if (checkbox.checked === shouldCheck) {
            console.log(`✅ Checkbox ${shouldCheck ? 'checked' : 'unchecked'} via direct manipulation`);
            return true;
        }
        // Method 3: Try clicking the associated label
        console.log(`🔄 Trying to click associated label`);
        const label = document.querySelector(`label[for="${checkbox.id}"]`);
        if (label) {
            label.click();
            await new Promise(resolve => setTimeout(resolve, 200));
            if (checkbox.checked === shouldCheck) {
                console.log(`✅ Checkbox ${shouldCheck ? 'checked' : 'unchecked'} via label click`);
                return true;
            }
        }
        // Method 4: Find parent label and click it
        console.log(`🔄 Trying to click parent label`);
        const parentLabel = checkbox.closest('label');
        if (parentLabel) {
            parentLabel.click();
            await new Promise(resolve => setTimeout(resolve, 200));
            if (checkbox.checked === shouldCheck) {
                console.log(`✅ Checkbox ${shouldCheck ? 'checked' : 'unchecked'} via parent label click`);
                return true;
            }
        }
        console.log(`❌ All checkbox methods failed. Final state: ${checkbox.checked}`);
        return false;
    }
    catch (error) {
        console.log(`❌ Error handling checkbox:`, error);
        return false;
    }
}
function clickWorkdayButton(element) {
    if (!element)
        return false;
    element.click();
    console.log(`✅ Clicked Workday button`);
    return true;
}
async function fillSkillsInput(element, skills) {
    if (!element || !skills || skills.length === 0)
        return false;
    const input = element;
    // For each skill, type it and simulate selection
    for (const skill of skills.slice(0, 10)) { // Limit to 10 skills to avoid overwhelming
        try {
            // Clear and focus using React-compatible method
            input.focus();
            setNativeValue(input, '');
            // Type the skill using React-compatible method
            setNativeValue(input, skill);
            // Wait a bit for suggestions to appear
            await new Promise(resolve => setTimeout(resolve, 500));
            // Try to press Enter to add the skill
            const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                bubbles: true
            });
            input.dispatchEvent(enterEvent);
            // Wait a bit before next skill
            await new Promise(resolve => setTimeout(resolve, 300));
            console.log(`✅ Added skill: ${skill}`);
        }
        catch (error) {
            console.log(`⚠️ Could not add skill: ${skill}`, error);
        }
    }
    return true;
}
// Convert base64 to File object for proper upload
function base64ToFile(base64, filename = 'resume.pdf') {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/pdf';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--)
        u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
}
// Debug function to scan all file inputs on the page
function scanAllFileInputs() {
    console.log(`🔍 Scanning all file inputs on the page...`);
    const allFileInputs = document.querySelectorAll('input[type="file"]');
    console.log(`📄 Found ${allFileInputs.length} file input(s):`);
    allFileInputs.forEach((input, index) => {
        const htmlInput = input;
        console.log(`📄 File input ${index + 1}:`, {
            id: htmlInput.id,
            name: htmlInput.name,
            className: htmlInput.className,
            accept: htmlInput.accept,
            multiple: htmlInput.multiple,
            'data-automation-id': htmlInput.getAttribute('data-automation-id'),
            visible: htmlInput.offsetParent !== null,
            parentElement: htmlInput.parentElement?.tagName
        });
    });
}
// Enhanced resume upload handler with multiple methods
async function handleResumeUpload(fileInput, resumeUrl) {
    if (!fileInput) {
        console.log(`⚠️ Resume upload: No file input element provided`);
        scanAllFileInputs(); // Debug: scan all file inputs
        return false;
    }
    console.log(`📄 Starting resume upload process...`);
    console.log(`📄 Resume URL: ${resumeUrl || 'Not provided'}`);
    console.log(`📄 File input element:`, {
        tagName: fileInput.tagName,
        id: fileInput.id,
        className: fileInput.className,
        type: fileInput.type
    });
    // Method 1: Direct file input with base64 conversion
    console.log(`🔄 Method 1: Direct file input with base64 conversion...`);
    const input = fileInput;
    if (resumeUrl && resumeUrl.startsWith('data:')) {
        console.log(`🔄 Converting base64 resume to File object...`);
        try {
            const file = base64ToFile(resumeUrl, 'resume.pdf');
            console.log(`✅ Created file object:`, {
                name: file.name,
                size: file.size,
                type: file.type
            });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            input.files = dataTransfer.files;
            // Fire proper events for validation
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`✅ Resume uploaded successfully from base64 data`);
            console.log(`📄 Input files after upload:`, input.files?.length);
            return true;
        }
        catch (error) {
            console.log(`❌ Error converting base64 to file:`, error);
        }
    }
    // Method 2: Try to find and click a "Select Files" or "Browse" button
    console.log(`🔄 Method 2: Looking for resume upload button...`);
    const uploadButton = findElement(WORKDAY_STEP2_SELECTORS.RESUME_SELECT_BUTTON);
    if (uploadButton) {
        console.log(`✅ Found resume upload button: ${uploadButton.tagName}`);
        // Click the button to open file dialog
        uploadButton.click();
        console.log(`🔄 Clicked resume upload button`);
        // Wait for file dialog (user interaction required)
        await new Promise(resolve => setTimeout(resolve, 1000));
        // If we have a resume URL, try to create and upload the file
        if (resumeUrl) {
            const success = await uploadResumeFromUrl(fileInput, resumeUrl);
            if (success) {
                console.log(`✅ Resume uploaded successfully from URL`);
                return true;
            }
        }
        // If URL method failed, provide user guidance
        console.log(`ℹ️ Resume upload button clicked - please select your resume file manually`);
        console.log(`ℹ️ The file dialog should be open. Select your resume file to continue.`);
        return true; // Consider this a success since we opened the dialog
    }
    // Method 3: Try drag and drop area approach
    console.log(`🔄 Method 3: Looking for drag and drop upload area...`);
    const uploadArea = findElement(WORKDAY_STEP2_SELECTORS.RESUME_UPLOAD_AREA);
    if (uploadArea && resumeUrl?.startsWith('data:')) {
        console.log(`✅ Found upload area, attempting drag and drop simulation...`);
        try {
            const file = base64ToFile(resumeUrl, 'resume.pdf');
            // Create drag and drop events
            const dragEvent = new DragEvent('drop', {
                bubbles: true,
                dataTransfer: new DataTransfer()
            });
            if (dragEvent.dataTransfer) {
                dragEvent.dataTransfer.items.add(file);
                uploadArea.dispatchEvent(dragEvent);
                console.log(`✅ Resume uploaded via drag and drop simulation`);
                return true;
            }
        }
        catch (error) {
            console.log(`❌ Error with drag and drop upload:`, error);
        }
    }
    console.log(`⚠️ Resume upload: All methods attempted`);
    console.log(`ℹ️ You may need to manually upload your resume file`);
    scanAllFileInputs(); // Debug: scan all file inputs at the end
    return false;
}
// Helper function to create and upload file from URL
async function uploadResumeFromUrl(fileInput, resumeUrl) {
    if (!resumeUrl || !fileInput)
        return false;
    try {
        console.log(`🔄 Attempting to fetch resume from URL: ${resumeUrl}`);
        // Fetch the resume file
        const response = await fetch(resumeUrl, {
            mode: 'cors',
            credentials: 'omit'
        });
        if (!response.ok) {
            console.log(`⚠️ Failed to fetch resume: ${response.status} ${response.statusText}`);
            return false;
        }
        // Get the file blob
        const blob = await response.blob();
        console.log(`✅ Resume fetched successfully, size: ${blob.size} bytes`);
        // Determine file name and type
        let fileName = 'resume.pdf';
        let fileType = blob.type || 'application/pdf';
        // Try to extract filename from URL
        const urlPath = new URL(resumeUrl).pathname;
        const urlFileName = urlPath.split('/').pop();
        if (urlFileName && urlFileName.includes('.')) {
            fileName = urlFileName;
        }
        // Create a File object
        const file = new File([blob], fileName, { type: fileType });
        console.log(`✅ Created file object: ${file.name}, type: ${file.type}, size: ${file.size}`);
        // Create a FileList-like object
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        // Set the files property
        Object.defineProperty(fileInput, 'files', {
            value: dataTransfer.files,
            writable: false
        });
        // Trigger change events
        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
        fileInput.dispatchEvent(new Event('input', { bubbles: true }));
        // Additional events for React components
        const changeEvent = new Event('change', { bubbles: true });
        Object.defineProperty(changeEvent, 'target', { value: fileInput, enumerable: true });
        fileInput.dispatchEvent(changeEvent);
        console.log(`✅ File upload events dispatched`);
        // Wait a moment for processing
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Verify the file was set
        if (fileInput.files && fileInput.files.length > 0) {
            console.log(`✅ Resume file successfully set: ${fileInput.files[0].name}`);
            return true;
        }
        else {
            console.log(`⚠️ File was not set on input element`);
            return false;
        }
    }
    catch (error) {
        console.log(`❌ Error uploading resume from URL:`, error);
        // If CORS error, provide guidance
        if (error instanceof TypeError && error.message.includes('CORS')) {
            console.log(`ℹ️ CORS error - resume URL might need to be publicly accessible`);
            console.log(`ℹ️ Please manually upload your resume file instead`);
        }
        return false;
    }
}
// Helper function to find resume upload elements with better detection
function findResumeUploadElements() {
    console.log(`🔍 Searching for resume upload elements...`);
    const fileInput = findElement(WORKDAY_STEP2_SELECTORS.RESUME_FILE_INPUT);
    const uploadButton = findElement(WORKDAY_STEP2_SELECTORS.RESUME_SELECT_BUTTON);
    const uploadArea = findElement(WORKDAY_STEP2_SELECTORS.RESUME_UPLOAD_AREA);
    console.log(`📋 Resume upload elements found:`);
    console.log(`  - File Input: ${!!fileInput} ${fileInput ? `(${fileInput.tagName})` : ''}`);
    console.log(`  - Upload Button: ${!!uploadButton} ${uploadButton ? `(${uploadButton.tagName})` : ''}`);
    console.log(`  - Upload Area: ${!!uploadArea} ${uploadArea ? `(${uploadArea.tagName})` : ''}`);
    return { fileInput, uploadButton, uploadArea };
}
// Helper function to format date for Workday (detects format from placeholder)
function formatWorkdayDate(month, year, element) {
    const monthMap = {
        'January': '01', 'February': '02', 'March': '03', 'April': '04',
        'May': '05', 'June': '06', 'July': '07', 'August': '08',
        'September': '09', 'October': '10', 'November': '11', 'December': '12'
    };
    const monthNum = monthMap[month] || '01';
    // Check element placeholder to determine format
    if (element) {
        const input = element;
        const placeholder = input.placeholder?.toLowerCase() || '';
        if (placeholder.includes('yyyy')) {
            return `${monthNum}/${year}`; // MM/YYYY
        }
        else if (placeholder.includes('yy')) {
            const shortYear = year.toString().slice(-2);
            return `${monthNum}/${shortYear}`; // MM/YY
        }
        else if (placeholder.includes('mm') && !placeholder.includes('/')) {
            return `${monthNum}${year}`; // MMYYYY
        }
    }
    // Default format
    return `${monthNum}/${year}`;
}
// Helper function to format year-only dates (for some education fields)
function formatWorkdayYearOnly(year) {
    return year.toString();
}
// Specialized function to fill Workday date fields (handles masked inputs)
async function fillWorkdayDateField(element, dateValue) {
    if (!element || !dateValue)
        return false;
    const input = element;
    try {
        console.log(`🗓️ Attempting to fill date field with: ${dateValue}`);
        // Method 1: Clear field and use setNativeValue (for React inputs)
        input.focus();
        await new Promise(resolve => setTimeout(resolve, 100));
        // Clear the field completely
        input.select();
        setNativeValue(input, '');
        await new Promise(resolve => setTimeout(resolve, 100));
        // Set the date value using React-compatible method
        setNativeValue(input, dateValue);
        await new Promise(resolve => setTimeout(resolve, 200));
        // Trigger additional events for masked inputs
        input.dispatchEvent(new Event('keyup', { bubbles: true }));
        input.dispatchEvent(new Event('blur', { bubbles: true }));
        // Check if the value was set correctly
        if (input.value === dateValue || input.value.includes(dateValue.replace('/', ''))) {
            console.log(`✅ Date field filled successfully: ${input.value}`);
            return true;
        }
        // Method 2: Character-by-character typing for masked inputs
        console.log(`🔄 Trying character-by-character method for masked input`);
        input.focus();
        setNativeValue(input, '');
        await new Promise(resolve => setTimeout(resolve, 100));
        // Type each character with delays (for masked inputs)
        for (let i = 0; i < dateValue.length; i++) {
            const char = dateValue[i];
            const currentValue = input.value + char;
            setNativeValue(input, currentValue);
            // Trigger keydown/keyup for each character
            input.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
            input.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }));
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        // Final validation and events
        input.dispatchEvent(new Event('blur', { bubbles: true }));
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log(`✅ Date field filled with character method: ${input.value}`);
        return true;
    }
    catch (error) {
        console.log(`❌ Error filling date field:`, error);
        // Method 3: Fallback - simple value assignment
        try {
            input.value = dateValue;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`✅ Date field filled with fallback method: ${input.value}`);
            return true;
        }
        catch (fallbackError) {
            console.log(`❌ All date filling methods failed:`, fallbackError);
            return false;
        }
    }
}
// Helper function to fill work experience modal
async function fillWorkExperienceModal(workExp, isLastEntry = false) {
    console.log(`🔄 Filling work experience: ${workExp.position_title} at ${workExp.company_name}`);
    console.log(`🔄 Is last entry: ${isLastEntry}`);
    // Wait for modal to load
    await new Promise(resolve => setTimeout(resolve, 1500));
    let filledCount = 0;
    // Add smooth scrolling to modal for better UX
    const modal = document.querySelector('[role="dialog"], .modal, [data-automation-id*="modal"]');
    if (modal) {
        modal.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    // Fill Job Title
    const jobTitleEl = findElement(WORKDAY_WORK_EXPERIENCE_MODAL.JOB_TITLE);
    if (jobTitleEl) {
        if (fillInput(jobTitleEl, workExp.position_title)) {
            filledCount++;
            console.log(`✅ Filled job title: ${workExp.position_title}`);
        }
        else {
            console.log(`⚠️ Could not fill job title: ${workExp.position_title}`);
        }
    }
    else {
        console.log(`⚠️ Job title element not found`);
    }
    // Fill Company
    const companyEl = findElement(WORKDAY_WORK_EXPERIENCE_MODAL.COMPANY);
    if (companyEl) {
        if (fillInput(companyEl, workExp.company_name)) {
            filledCount++;
            console.log(`✅ Filled company: ${workExp.company_name}`);
        }
        else {
            console.log(`⚠️ Could not fill company: ${workExp.company_name}`);
        }
    }
    else {
        console.log(`⚠️ Company element not found`);
    }
    // Fill Location (if available)
    const locationEl = findElement(WORKDAY_WORK_EXPERIENCE_MODAL.LOCATION);
    if (locationEl && workExp.location) {
        if (fillInput(locationEl, workExp.location)) {
            filledCount++;
            console.log(`✅ Filled location: ${workExp.location}`);
        }
        else {
            console.log(`⚠️ Could not fill location: ${workExp.location}`);
        }
    }
    // Handle "Currently work here" checkbox
    const isCurrentJob = !workExp.end_month || !workExp.end_year;
    if (isCurrentJob) {
        console.log(`🔄 This is a current job, attempting to check "I currently work here" checkbox`);
        // Try to find checkbox using selectors first
        let currentlyWorkEl = findElement(WORKDAY_WORK_EXPERIENCE_MODAL.CURRENTLY_WORK_HERE);
        // If not found, try finding by label text
        if (!currentlyWorkEl) {
            currentlyWorkEl = findCheckboxByLabelText([
                'I currently work here',
                'currently work here',
                'current position',
                'present',
                'current job'
            ]);
        }
        if (currentlyWorkEl) {
            const success = await clickWorkdayCheckbox(currentlyWorkEl, true);
            if (success) {
                console.log(`✅ Successfully checked "I currently work here"`);
                filledCount++;
            }
            else {
                console.log(`⚠️ Could not check "I currently work here" checkbox`);
            }
        }
        else {
            console.log(`⚠️ Could not find "I currently work here" checkbox`);
        }
    }
    else {
        console.log(`ℹ️ This is not a current job, skipping "I currently work here" checkbox`);
    }
    // Fill From Date
    const fromDateEl = findElement(WORKDAY_WORK_EXPERIENCE_MODAL.FROM_DATE);
    if (fromDateEl && workExp.start_month && workExp.start_year) {
        const fromDate = formatWorkdayDate(workExp.start_month, workExp.start_year, fromDateEl);
        if (await fillWorkdayDateField(fromDateEl, fromDate)) {
            filledCount++;
            console.log(`✅ Filled start date: ${fromDate}`);
        }
        else {
            console.log(`⚠️ Could not fill start date: ${fromDate}`);
        }
    }
    // Fill To Date (only if not current job)
    if (!isCurrentJob) {
        const toDateEl = findElement(WORKDAY_WORK_EXPERIENCE_MODAL.TO_DATE);
        if (toDateEl && workExp.end_month && workExp.end_year) {
            const toDate = formatWorkdayDate(workExp.end_month, workExp.end_year, toDateEl);
            if (await fillWorkdayDateField(toDateEl, toDate)) {
                filledCount++;
                console.log(`✅ Filled end date: ${toDate}`);
            }
            else {
                console.log(`⚠️ Could not fill end date: ${toDate}`);
            }
        }
    }
    // Fill Description
    const descriptionEl = findElement(WORKDAY_WORK_EXPERIENCE_MODAL.DESCRIPTION);
    if (descriptionEl && workExp.description) {
        if (fillInput(descriptionEl, workExp.description)) {
            filledCount++;
            console.log(`✅ Filled description`);
        }
    }
    // Handle Save vs Add Another vs Done based on whether this is the last entry
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`🔄 Looking for buttons... isLastEntry: ${isLastEntry}`);
    if (isLastEntry) {
        // This is the last work experience - click Done to finish
        console.log(`🔄 Looking for Done button for last entry...`);
        let doneBtn = findElement(WORKDAY_WORK_EXPERIENCE_MODAL.DONE_BUTTON);
        if (!doneBtn) {
            doneBtn = findButtonByText(['Done', 'Finish', 'Complete', 'Close']);
        }
        if (doneBtn) {
            console.log(`✅ Found Done button, clicking...`);
            doneBtn.click();
            console.log(`✅ Clicked Done for last work experience - closing section`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for modal to close
        }
        else {
            // Fallback to Save/OK if Done not found
            console.log(`🔄 Done button not found, looking for Save/OK...`);
            let saveBtn = findElement(WORKDAY_WORK_EXPERIENCE_MODAL.SAVE_BUTTON);
            if (!saveBtn) {
                saveBtn = findButtonByText(['OK', 'Save', 'Submit', 'Continue']);
            }
            if (saveBtn) {
                console.log(`✅ Found Save button, clicking...`);
                saveBtn.click();
                console.log(`✅ Clicked Save for last work experience (fallback)`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            else {
                console.log(`❌ No Done or Save button found for last entry`);
            }
        }
    }
    else {
        // This is not the last entry - click Add Another to continue
        console.log(`🔄 Looking for Add Another button for entry ${filledCount}...`);
        let addAnotherBtn = findElement(WORKDAY_WORK_EXPERIENCE_MODAL.ADD_ANOTHER_BUTTON);
        if (!addAnotherBtn) {
            addAnotherBtn = findButtonByText(['Add Another', 'Add More', '+ Add', 'Add Additional']);
        }
        if (addAnotherBtn) {
            console.log(`✅ Found Add Another button, clicking...`);
            addAnotherBtn.click();
            console.log(`✅ Clicked Add Another for work experience - staying in modal`);
            await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for new form to appear
        }
        else {
            // Fallback to Save/OK if Add Another not found
            console.log(`🔄 Add Another button not found, looking for Save/OK...`);
            let saveBtn = findElement(WORKDAY_WORK_EXPERIENCE_MODAL.SAVE_BUTTON);
            if (!saveBtn) {
                saveBtn = findButtonByText(['OK', 'Save', 'Submit', 'Continue']);
            }
            if (saveBtn) {
                console.log(`✅ Found Save button, clicking...`);
                saveBtn.click();
                console.log(`✅ Clicked Save for work experience (Add Another not found)`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                // If we clicked Save instead of Add Another, we need to click Add again for next entry
                console.log(`🔄 Looking for Add button again after Save...`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                const nextAddBtn = findElement(WORKDAY_STEP2_SELECTORS.WORK_EXPERIENCE_ADD);
                if (nextAddBtn) {
                    console.log(`✅ Found Add button again, clicking for next entry...`);
                    nextAddBtn.click();
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }
            }
            else {
                console.log(`❌ No Add Another or Save button found`);
            }
        }
    }
    console.log(`✅ Filled ${filledCount} work experience fields`);
    return filledCount > 0;
}
// Helper function to fill education modal
async function fillEducationModal(education, isLastEntry = false) {
    console.log(`🔄 Filling education: ${education.degree_type} from ${education.institution_name}`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    let filledCount = 0;
    // Fill School Name
    const schoolEl = findElement(WORKDAY_EDUCATION_MODAL.SCHOOL_NAME);
    if (schoolEl && fillInput(schoolEl, education.institution_name)) {
        filledCount++;
        console.log(`✅ Filled school: ${education.institution_name}`);
    }
    // Fill Degree Type (dropdown)
    const degreeEl = findElement(WORKDAY_EDUCATION_MODAL.DEGREE_TYPE);
    if (degreeEl && education.degree_type) {
        const success = await clickWorkdayDropdown(degreeEl, education.degree_type);
        if (success) {
            filledCount++;
            console.log(`✅ Filled degree type: ${education.degree_type}`);
        }
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    // Fill Field of Study/Major
    const majorEl = findElement(WORKDAY_EDUCATION_MODAL.FIELD_OF_STUDY);
    if (majorEl && education.major && fillInput(majorEl, education.major)) {
        filledCount++;
        console.log(`✅ Filled major: ${education.major}`);
    }
    // Fill GPA
    const gpaEl = findElement(WORKDAY_EDUCATION_MODAL.GPA);
    if (gpaEl && education.gpa && fillInput(gpaEl, education.gpa.toString())) {
        filledCount++;
        console.log(`✅ Filled GPA: ${education.gpa}`);
    }
    // Fill Graduation Date
    const gradDateEl = findElement(WORKDAY_EDUCATION_MODAL.GRADUATION_DATE);
    if (gradDateEl && education.graduation_month && education.graduation_year) {
        const input = gradDateEl;
        let gradDate;
        // Check if this is a year-only field
        if (input.placeholder?.toLowerCase().includes('yyyy') && !input.placeholder?.toLowerCase().includes('mm')) {
            gradDate = formatWorkdayYearOnly(education.graduation_year);
        }
        else {
            gradDate = formatWorkdayDate(education.graduation_month, education.graduation_year, gradDateEl);
        }
        if (await fillWorkdayDateField(gradDateEl, gradDate)) {
            filledCount++;
            console.log(`✅ Filled graduation date: ${gradDate}`);
        }
        else {
            console.log(`⚠️ Could not fill graduation date: ${gradDate}`);
        }
    }
    // Handle Save vs Add Another vs Done based on whether this is the last entry
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (isLastEntry) {
        // This is the last education entry - click Done to finish
        let doneBtn = findElement(WORKDAY_EDUCATION_MODAL.DONE_BUTTON);
        if (!doneBtn) {
            doneBtn = findButtonByText(['Done', 'Finish', 'Complete']);
        }
        if (doneBtn) {
            doneBtn.click();
            console.log(`✅ Clicked Done for last education entry - closing section`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for modal to close
        }
        else {
            // Fallback to Save/OK if Done not found
            let saveBtn = findElement(WORKDAY_EDUCATION_MODAL.SAVE_BUTTON);
            if (!saveBtn) {
                saveBtn = findButtonByText(['OK', 'Save', 'Submit']);
            }
            if (saveBtn) {
                saveBtn.click();
                console.log(`✅ Clicked Save for last education entry (fallback)`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }
    else {
        // This is not the last entry - click Add Another to continue
        let addAnotherBtn = findElement(WORKDAY_EDUCATION_MODAL.ADD_ANOTHER_BUTTON);
        if (!addAnotherBtn) {
            addAnotherBtn = findButtonByText(['Add Another', 'Add More', '+ Add']);
        }
        if (addAnotherBtn) {
            addAnotherBtn.click();
            console.log(`✅ Clicked Add Another for education - staying in modal`);
            await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for new form to appear
        }
        else {
            // Fallback to Save/OK if Add Another not found
            let saveBtn = findElement(WORKDAY_EDUCATION_MODAL.SAVE_BUTTON);
            if (!saveBtn) {
                saveBtn = findButtonByText(['OK', 'Save', 'Submit']);
            }
            if (saveBtn) {
                saveBtn.click();
                console.log(`✅ Clicked Save for education (Add Another not found)`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }
    console.log(`✅ Filled ${filledCount} education fields`);
    return filledCount > 0;
}
// Helper function to fill certifications modal
async function fillCertificationModal(cert, isLastEntry = false) {
    console.log(`🔄 Filling certification: ${cert.certification_name}`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    let filledCount = 0;
    // Fill Certification Name
    const certNameEl = findElement(WORKDAY_CERTIFICATIONS_MODAL.CERTIFICATION_NAME);
    if (certNameEl && fillInput(certNameEl, cert.certification_name)) {
        filledCount++;
        console.log(`✅ Filled certification name: ${cert.certification_name}`);
    }
    // Fill Issuing Organization
    const orgEl = findElement(WORKDAY_CERTIFICATIONS_MODAL.ISSUING_ORGANIZATION);
    if (orgEl && cert.issuing_organization && fillInput(orgEl, cert.issuing_organization)) {
        filledCount++;
        console.log(`✅ Filled issuing organization: ${cert.issuing_organization}`);
    }
    // Fill Issue Date
    const issueDateEl = findElement(WORKDAY_CERTIFICATIONS_MODAL.ISSUE_DATE);
    if (issueDateEl && cert.issue_month && cert.issue_year) {
        const issueDate = formatWorkdayDate(cert.issue_month, cert.issue_year, issueDateEl);
        if (await fillWorkdayDateField(issueDateEl, issueDate)) {
            filledCount++;
            console.log(`✅ Filled issue date: ${issueDate}`);
        }
        else {
            console.log(`⚠️ Could not fill issue date: ${issueDate}`);
        }
    }
    // Fill Credential ID
    const credentialEl = findElement(WORKDAY_CERTIFICATIONS_MODAL.CREDENTIAL_ID);
    if (credentialEl && cert.credential_id && fillInput(credentialEl, cert.credential_id)) {
        filledCount++;
        console.log(`✅ Filled credential ID: ${cert.credential_id}`);
    }
    // Save the entry
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (isLastEntry) {
        // For the last entry, just click Save/OK - modal will close
        const saveBtn = findElement(WORKDAY_CERTIFICATIONS_MODAL.SAVE_BUTTON);
        if (saveBtn) {
            saveBtn.click();
            console.log(`✅ Clicked Save for certification (last entry) - modal will close`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for modal to close
        }
    }
    else {
        // Click Add Another for non-last entries
        const addAnotherBtn = findElement(WORKDAY_CERTIFICATIONS_MODAL.ADD_ANOTHER_BUTTON);
        if (addAnotherBtn) {
            addAnotherBtn.click();
            console.log(`✅ Clicked Add Another for certification`);
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
        else {
            // If no Add Another button, just save and the user can manually add more
            const saveBtn = findElement(WORKDAY_CERTIFICATIONS_MODAL.SAVE_BUTTON);
            if (saveBtn) {
                saveBtn.click();
                console.log(`✅ Clicked Save for certification (Add Another not found)`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }
    console.log(`✅ Filled ${filledCount} certification fields`);
    return filledCount > 0;
}
// Helper function to fill languages modal
async function fillLanguageModal(language, isLastEntry = false) {
    console.log(`🔄 Filling language: ${language.language_name}`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    let filledCount = 0;
    // Fill Language (dropdown)
    const langEl = findElement(WORKDAY_LANGUAGES_MODAL.LANGUAGE);
    if (langEl && language.language_name) {
        const success = await clickWorkdayDropdown(langEl, language.language_name);
        if (success) {
            filledCount++;
            console.log(`✅ Filled language: ${language.language_name}`);
        }
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    // Fill Proficiency (dropdown)
    const profEl = findElement(WORKDAY_LANGUAGES_MODAL.PROFICIENCY);
    if (profEl && language.proficiency_level) {
        const success = await clickWorkdayDropdown(profEl, language.proficiency_level);
        if (success) {
            filledCount++;
            console.log(`✅ Filled proficiency: ${language.proficiency_level}`);
        }
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    // Save the entry
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (isLastEntry) {
        // For the last entry, just click Save/OK - modal will close
        const saveBtn = findElement(WORKDAY_LANGUAGES_MODAL.SAVE_BUTTON);
        if (saveBtn) {
            saveBtn.click();
            console.log(`✅ Clicked Save for language (last entry) - modal will close`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for modal to close
        }
    }
    else {
        // Click Add Another for non-last entries
        const addAnotherBtn = findElement(WORKDAY_LANGUAGES_MODAL.ADD_ANOTHER_BUTTON);
        if (addAnotherBtn) {
            addAnotherBtn.click();
            console.log(`✅ Clicked Add Another for language`);
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
        else {
            // If no Add Another button, just save and the user can manually add more
            const saveBtn = findElement(WORKDAY_LANGUAGES_MODAL.SAVE_BUTTON);
            if (saveBtn) {
                saveBtn.click();
                console.log(`✅ Clicked Save for language (Add Another not found)`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }
    console.log(`✅ Filled ${filledCount} language fields`);
    return filledCount > 0;
}
function getGenericQuestionAnswer(questionText, profile) {
    const text = questionText.toLowerCase();
    // Work Authorization
    if (text.includes('authorized to work') && text.includes('country')) {
        return profile.work_authorization_us ? 'Yes' : 'No';
    }
    // Visa Sponsorship
    if (text.includes('visa sponsorship') || text.includes('immigration filing')) {
        return profile.visa_sponsorship_required === 'yes' ? 'Yes' : 'No';
    }
    // Relocation
    if (text.includes('relocating') || text.includes('relocation')) {
        return profile.willing_to_relocate ? 'Yes' : 'No';
    }
    // Non-compete agreements
    if (text.includes('non-compete') || text.includes('non-solicitation')) {
        return 'No'; // Default safe answer for most people
    }
    // Acknowledgment questions
    if (text.includes('acknowledge') && text.includes('truthfully')) {
        return 'Yes'; // Always acknowledge truthfulness
    }
    return null; // Skip company-specific or unknown questions
}
async function clickWorkdayDropdown(button, answerText) {
    if (!button || !answerText)
        return false;
    try {
        console.log(`🔄 Attempting to set dropdown to: "${answerText}"`);
        // Enhanced value mapping for common dropdown values
        const mappedAnswer = mapDropdownValue(answerText);
        console.log(`🔄 Mapped value: "${answerText}" → "${mappedAnswer}"`);
        // Try multiple attempts with different strategies
        for (let attempt = 1; attempt <= 4; attempt++) {
            console.log(`🔄 Dropdown attempt ${attempt}/4`);
            // Method 1: Standard click and wait approach
            if (attempt === 1) {
                const success = await tryStandardDropdownClick(button, mappedAnswer);
                if (success)
                    return true;
            }
            // Method 2: Enhanced click with longer wait
            if (attempt === 2) {
                const success = await tryEnhancedDropdownClick(button, mappedAnswer);
                if (success)
                    return true;
            }
            // Method 3: Keyboard navigation approach
            if (attempt === 3) {
                const success = await tryKeyboardDropdownNavigation(button, mappedAnswer);
                if (success)
                    return true;
            }
            // Method 4: Workday-specific approach
            if (attempt === 4) {
                const success = await tryWorkdaySpecificDropdown(button, mappedAnswer);
                if (success)
                    return true;
            }
            // Wait between attempts
            if (attempt < 4) {
                await new Promise(resolve => setTimeout(resolve, 800));
            }
        }
        console.log(`❌ All dropdown methods failed for "${answerText}"`);
        return false;
    }
    catch (error) {
        console.log(`⚠️ Error handling dropdown:`, error);
        return false;
    }
}
// Simplified value mapping - only map when we need exact matches
function mapDropdownValue(value) {
    const valueLower = value.toLowerCase().trim();
    // ONLY map specific values we know need mapping
    // For Step 1 dropdowns, return the original value
    // Phone device type - exact matches only
    if (valueLower === 'mobile')
        return 'Mobile';
    if (valueLower === 'cell' || valueLower === 'cellular')
        return 'Mobile';
    if (valueLower === 'landline' || valueLower === 'home')
        return 'Landline';
    if (valueLower === 'fax')
        return 'Fax';
    if (valueLower === 'pager')
        return 'Pager';
    // Source - exact matches only
    if (valueLower === 'indeed')
        return 'Indeed';
    if (valueLower === 'linkedin')
        return 'LinkedIn';
    if (valueLower === 'company website')
        return 'Company Website';
    if (valueLower === 'referral')
        return 'Referral';
    // State abbreviations - common ones only
    if (valueLower === 'ca')
        return 'California';
    if (valueLower === 'tx')
        return 'Texas';
    if (valueLower === 'ny')
        return 'New York';
    if (valueLower === 'fl')
        return 'Florida';
    if (valueLower === 'il')
        return 'Illinois';
    if (valueLower === 'pa')
        return 'Pennsylvania';
    if (valueLower === 'oh')
        return 'Ohio';
    if (valueLower === 'ga')
        return 'Georgia';
    if (valueLower === 'nc')
        return 'North Carolina';
    if (valueLower === 'mi')
        return 'Michigan';
    if (valueLower === 'nj')
        return 'New Jersey';
    if (valueLower === 'va')
        return 'Virginia';
    if (valueLower === 'wa')
        return 'Washington';
    if (valueLower === 'az')
        return 'Arizona';
    if (valueLower === 'ma')
        return 'Massachusetts';
    if (valueLower === 'tn')
        return 'Tennessee';
    if (valueLower === 'in')
        return 'Indiana';
    if (valueLower === 'mo')
        return 'Missouri';
    if (valueLower === 'md')
        return 'Maryland';
    if (valueLower === 'wi')
        return 'Wisconsin';
    if (valueLower === 'co')
        return 'Colorado';
    if (valueLower === 'mn')
        return 'Minnesota';
    if (valueLower === 'sc')
        return 'South Carolina';
    if (valueLower === 'al')
        return 'Alabama';
    if (valueLower === 'la')
        return 'Louisiana';
    if (valueLower === 'ky')
        return 'Kentucky';
    if (valueLower === 'or')
        return 'Oregon';
    if (valueLower === 'ok')
        return 'Oklahoma';
    if (valueLower === 'ct')
        return 'Connecticut';
    if (valueLower === 'ut')
        return 'Utah';
    if (valueLower === 'ia')
        return 'Iowa';
    if (valueLower === 'nv')
        return 'Nevada';
    if (valueLower === 'ar')
        return 'Arkansas';
    if (valueLower === 'ms')
        return 'Mississippi';
    if (valueLower === 'ks')
        return 'Kansas';
    if (valueLower === 'nm')
        return 'New Mexico';
    if (valueLower === 'ne')
        return 'Nebraska';
    if (valueLower === 'wv')
        return 'West Virginia';
    if (valueLower === 'id')
        return 'Idaho';
    if (valueLower === 'hi')
        return 'Hawaii';
    if (valueLower === 'nh')
        return 'New Hampshire';
    if (valueLower === 'me')
        return 'Maine';
    if (valueLower === 'ri')
        return 'Rhode Island';
    if (valueLower === 'mt')
        return 'Montana';
    if (valueLower === 'de')
        return 'Delaware';
    if (valueLower === 'sd')
        return 'South Dakota';
    if (valueLower === 'nd')
        return 'North Dakota';
    if (valueLower === 'ak')
        return 'Alaska';
    if (valueLower === 'vt')
        return 'Vermont';
    if (valueLower === 'wy')
        return 'Wyoming';
    // For everything else, return the original value unchanged
    return value;
}
// Method 1: Standard dropdown click approach
async function tryStandardDropdownClick(button, answerText) {
    console.log(`🔄 Trying standard dropdown click for: "${answerText}"`);
    // Click the dropdown button
    button.click();
    // Wait for dropdown to open
    await new Promise(resolve => setTimeout(resolve, 700));
    // Look for dropdown options with comprehensive selectors
    const dropdownSelectors = [
        '[role="option"]',
        '[role="listbox"] li',
        '[role="listbox"] div',
        '[role="listbox"] span',
        '.css-option',
        'li[data-automation-id*="option"]',
        'div[data-automation-id*="option"]',
        'span[data-automation-id*="option"]',
        'ul li',
        'ol li',
        '.dropdown-option',
        '.select-option',
        '[class*="option"]',
        '[class*="item"]',
        '.menu-item',
        '[data-testid*="option"]'
    ];
    let allOptions = null;
    // Try each selector until we find options
    for (const selector of dropdownSelectors) {
        const options = document.querySelectorAll(selector);
        if (options.length > 0) {
            allOptions = options;
            console.log(`✅ Found ${options.length} dropdown options using selector: ${selector}`);
            break;
        }
    }
    if (!allOptions || allOptions.length === 0) {
        console.log(`⚠️ No dropdown options found with standard method`);
        // Try clicking the button again to close dropdown
        button.click();
        return false;
    }
    // Try enhanced matching strategies
    const success = await tryMatchDropdownOptions(allOptions, answerText);
    if (!success) {
        // Close dropdown if no match found
        button.click();
    }
    return success;
}
// Method 2: Enhanced dropdown click with longer wait and validation
async function tryEnhancedDropdownClick(button, answerText) {
    console.log(`🔄 Trying enhanced dropdown click for: "${answerText}"`);
    // Focus the button first
    button.focus();
    await new Promise(resolve => setTimeout(resolve, 200));
    // Click the dropdown button
    button.click();
    // Wait longer for dropdown to open
    await new Promise(resolve => setTimeout(resolve, 1200));
    // Validate dropdown is open by checking for common dropdown indicators
    const dropdownOpen = document.querySelector('[role="listbox"]') ||
        document.querySelector('.dropdown-menu') ||
        document.querySelector('[class*="dropdown"][class*="open"]') ||
        document.querySelector('[aria-expanded="true"]');
    if (!dropdownOpen) {
        console.log(`⚠️ Dropdown doesn't appear to be open after enhanced click`);
        return false;
    }
    console.log(`✅ Dropdown appears to be open, looking for options...`);
    // Use more comprehensive selectors for options
    const enhancedSelectors = [
        '[role="option"]',
        '[role="listbox"] *',
        '.dropdown-menu li',
        '.dropdown-menu div',
        '.select-dropdown li',
        '.select-dropdown div',
        '[data-automation-id*="option"]',
        '[data-testid*="option"]',
        '[class*="option"]:not(button)',
        '[class*="item"]:not(button)',
        'li:not([role="presentation"])',
        'div[tabindex]',
        'span[tabindex]'
    ];
    let allOptions = null;
    for (const selector of enhancedSelectors) {
        const options = document.querySelectorAll(selector);
        if (options.length > 0) {
            allOptions = options;
            console.log(`✅ Found ${options.length} dropdown options using enhanced selector: ${selector}`);
            break;
        }
    }
    if (!allOptions || allOptions.length === 0) {
        console.log(`⚠️ No dropdown options found with enhanced method`);
        button.click();
        return false;
    }
    const success = await tryMatchDropdownOptions(allOptions, answerText);
    if (!success) {
        button.click();
    }
    return success;
}
// Method 3: Keyboard navigation approach
async function tryKeyboardDropdownNavigation(button, answerText) {
    console.log(`🔄 Trying keyboard navigation for: "${answerText}"`);
    // Focus the button
    button.focus();
    await new Promise(resolve => setTimeout(resolve, 200));
    // Open dropdown with Enter or Space
    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await new Promise(resolve => setTimeout(resolve, 500));
    // If Enter didn't work, try Space
    button.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    await new Promise(resolve => setTimeout(resolve, 500));
    // If still not open, try Arrow Down
    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await new Promise(resolve => setTimeout(resolve, 500));
    // Look for options
    const options = document.querySelectorAll('[role="option"], [role="listbox"] li, [role="listbox"] div');
    if (options.length === 0) {
        console.log(`⚠️ No dropdown options found with keyboard method`);
        // Try Escape to close
        button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        return false;
    }
    console.log(`✅ Found ${options.length} options with keyboard navigation`);
    // Try to navigate to the correct option using keyboard
    const answerLower = answerText.toLowerCase();
    for (let i = 0; i < Math.min(options.length, 20); i++) { // Limit to 20 to avoid infinite loops
        const option = options[i];
        const optionText = option.textContent?.trim().toLowerCase() || '';
        if (optionText.includes(answerLower) || answerLower.includes(optionText)) {
            // Found potential match, select it
            option.click();
            console.log(`✅ Selected option via keyboard navigation: "${option.textContent?.trim()}"`);
            await new Promise(resolve => setTimeout(resolve, 300));
            return true;
        }
        // Navigate to next option
        button.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log(`⚠️ No matching option found via keyboard navigation`);
    // Try Escape to close
    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    return false;
}
// Method 4: Type-and-Select approach (like Simplify)
async function tryWorkdaySpecificDropdown(button, answerText) {
    console.log(`🔄 Trying type-and-select approach for: "${answerText}"`);
    try {
        // First, ensure any previous dropdown is closed
        const escEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
        document.dispatchEvent(escEvent);
        await new Promise(resolve => setTimeout(resolve, 200));
        // Scroll button into view and focus
        button.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await new Promise(resolve => setTimeout(resolve, 200));
        button.focus();
        await new Promise(resolve => setTimeout(resolve, 200));
        // Open the dropdown
        console.log(`🔄 Opening dropdown...`);
        button.click();
        await new Promise(resolve => setTimeout(resolve, 500));
        // Look for the search input that appears when dropdown opens
        console.log(`🔍 Looking for search input...`);
        const searchInput = await waitForSelector([
            'input[type="text"]',
            '[role="combobox"] input',
            'input[role="combobox"]',
            'input[aria-expanded="true"]',
            'input[placeholder*="Search"]',
            'input[placeholder*="Type"]',
            'input[placeholder*="Select"]',
            '.dropdown input',
            '.select input',
            '[data-automation-id*="searchbox"] input',
            '[data-automation-id*="input"] input'
        ], 1500);
        if (!searchInput) {
            console.log(`⚠️ No search input found, trying direct option selection...`);
            return await tryDirectOptionSelection(answerText);
        }
        console.log(`✅ Found search input, typing "${answerText}"...`);
        // Clear any existing value
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        await new Promise(resolve => setTimeout(resolve, 100));
        // Type the answer character by character (simulate human typing)
        for (let i = 0; i < answerText.length; i++) {
            const char = answerText[i];
            searchInput.value += char;
            // Trigger input events
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            searchInput.dispatchEvent(new Event('keyup', { bubbles: true }));
            // Small delay between keystrokes
            await new Promise(resolve => setTimeout(resolve, 80));
        }
        console.log(`✅ Finished typing, waiting for filtered options...`);
        // Wait for filtered options to appear
        await new Promise(resolve => setTimeout(resolve, 800));
        // Look for filtered options
        const options = await waitForElements([
            '[role="option"]',
            '[role="listbox"] > *',
            '[data-automation-id*="option"]',
            '.dropdown-option',
            '.select-option',
            'li[tabindex]',
            'div[tabindex]'
        ], 1000);
        if (!options || options.length === 0) {
            console.log(`⚠️ No filtered options found after typing`);
            return false;
        }
        console.log(`✅ Found ${options.length} filtered options`);
        // Find the best match from filtered options
        const bestMatch = findBestMatch(options, answerText);
        if (!bestMatch) {
            console.log(`⚠️ No suitable match found in filtered options`);
            console.log(`📋 Available options:`, Array.from(options).slice(0, 5).map(opt => opt.textContent?.trim()));
            return false;
        }
        console.log(`✅ Found best match: "${bestMatch.textContent?.trim()}", clicking...`);
        // Click the best match
        const success = await clickOption(bestMatch);
        if (success) {
            console.log(`✅ Successfully selected "${bestMatch.textContent?.trim()}"`);
            return true;
        }
        return false;
    }
    catch (error) {
        console.log(`⚠️ Error in type-and-select approach:`, error);
        return false;
    }
}
// Helper function to wait for a selector to appear
async function waitForSelector(selectors, timeout = 2000) {
    const pollInterval = 100;
    const maxTries = timeout / pollInterval;
    let tries = 0;
    return new Promise(resolve => {
        const interval = setInterval(() => {
            for (const selector of selectors) {
                const el = document.querySelector(selector);
                if (el && el.offsetParent !== null) { // Check if element is visible
                    clearInterval(interval);
                    resolve(el);
                    return;
                }
            }
            if (tries++ >= maxTries) {
                clearInterval(interval);
                resolve(null);
            }
        }, pollInterval);
    });
}
// Helper function to wait for multiple elements to appear
async function waitForElements(selectors, timeout = 2000) {
    const pollInterval = 100;
    const maxTries = timeout / pollInterval;
    let tries = 0;
    return new Promise(resolve => {
        const interval = setInterval(() => {
            for (const selector of selectors) {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    // Filter for visible elements
                    const visibleElements = Array.from(elements).filter(el => el.offsetParent !== null &&
                        el.textContent?.trim());
                    if (visibleElements.length > 0) {
                        clearInterval(interval);
                        resolve(visibleElements);
                        return;
                    }
                }
            }
            if (tries++ >= maxTries) {
                clearInterval(interval);
                resolve(null);
            }
        }, pollInterval);
    });
}
// Helper function to find the best match from filtered options
function findBestMatch(options, answerText) {
    const answerLower = answerText.toLowerCase().trim();
    const optionsArray = Array.from(options);
    // Strategy 1: Exact match
    for (const option of optionsArray) {
        const optionText = option.textContent?.toLowerCase().trim() || '';
        if (optionText === answerLower) {
            return option;
        }
    }
    // Strategy 2: Starts with match
    for (const option of optionsArray) {
        const optionText = option.textContent?.toLowerCase().trim() || '';
        if (optionText.startsWith(answerLower)) {
            return option;
        }
    }
    // Strategy 3: Contains match
    for (const option of optionsArray) {
        const optionText = option.textContent?.toLowerCase().trim() || '';
        if (optionText.includes(answerLower)) {
            return option;
        }
    }
    // Strategy 4: Specific mappings
    for (const option of optionsArray) {
        const optionText = option.textContent?.toLowerCase().trim() || '';
        // Phone device type matches
        if (answerLower === 'mobile' && (optionText.includes('mobile') || optionText.includes('cell'))) {
            return option;
        }
        // Source matches
        if (answerLower === 'indeed' && optionText.includes('indeed')) {
            return option;
        }
    }
    // Strategy 5: Return first option if nothing else matches (fallback)
    if (optionsArray.length > 0) {
        console.log(`🔄 Using first option as fallback: "${optionsArray[0].textContent?.trim()}"`);
        return optionsArray[0];
    }
    return null;
}
// Helper function to click an option reliably
async function clickOption(option) {
    try {
        // Scroll into view
        option.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        await new Promise(resolve => setTimeout(resolve, 100));
        // Method 1: Simple click
        option.click();
        await new Promise(resolve => setTimeout(resolve, 200));
        // Method 2: Focus + click
        option.focus();
        await new Promise(resolve => setTimeout(resolve, 100));
        option.click();
        await new Promise(resolve => setTimeout(resolve, 200));
        // Method 3: Mouse events
        const rect = option.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        option.dispatchEvent(new MouseEvent('mousedown', {
            bubbles: true,
            clientX: centerX,
            clientY: centerY
        }));
        option.dispatchEvent(new MouseEvent('mouseup', {
            bubbles: true,
            clientX: centerX,
            clientY: centerY
        }));
        option.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            clientX: centerX,
            clientY: centerY
        }));
        await new Promise(resolve => setTimeout(resolve, 200));
        return true;
    }
    catch (error) {
        console.log(`⚠️ Error clicking option:`, error);
        return false;
    }
}
// Fallback method for dropdowns without search inputs
async function tryDirectOptionSelection(answerText) {
    console.log(`🔄 Trying direct option selection for: "${answerText}"`);
    // Wait a bit for options to load
    await new Promise(resolve => setTimeout(resolve, 500));
    // Look for options with standard selectors
    const options = document.querySelectorAll([
        '[role="option"]',
        '[role="listbox"] > *',
        '[data-automation-id*="option"]',
        'li[tabindex]',
        'div[tabindex]'
    ].join(', '));
    if (options.length === 0) {
        console.log(`⚠️ No options found for direct selection`);
        return false;
    }
    console.log(`✅ Found ${options.length} options for direct selection`);
    const bestMatch = findBestMatch(options, answerText);
    if (!bestMatch) {
        console.log(`⚠️ No match found in direct options`);
        return false;
    }
    console.log(`✅ Direct selection match: "${bestMatch.textContent?.trim()}"`);
    return await clickOption(bestMatch);
}
// Enhanced option matching with multiple strategies
async function tryMatchDropdownOptions(allOptions, answerText) {
    const answerLower = answerText.toLowerCase().trim();
    // Enhanced matching strategies with more flexibility
    const matchingStrategies = [
        // Exact match (case insensitive)
        (optionText) => optionText.toLowerCase().trim() === answerLower,
        // Contains match (case insensitive)
        (optionText) => optionText.toLowerCase().includes(answerLower),
        // Starts with match (case insensitive)
        (optionText) => optionText.toLowerCase().startsWith(answerLower),
        // Reverse contains (answer contains option)
        (optionText) => answerLower.includes(optionText.toLowerCase().trim()),
        // Word boundary match
        (optionText) => {
            const optionWords = optionText.toLowerCase().split(/\s+/);
            const answerWords = answerLower.split(/\s+/);
            return optionWords.some(ow => answerWords.some(aw => aw === ow));
        },
        // Partial word match (for abbreviations)
        (optionText) => {
            const option = optionText.toLowerCase().trim();
            // Check if any word in option starts with answer or vice versa
            const optionWords = option.split(/\s+/);
            const answerWords = answerLower.split(/\s+/);
            return optionWords.some(ow => answerWords.some(aw => ow.startsWith(aw) || aw.startsWith(ow)));
        },
        // Fuzzy match for degree types
        (optionText) => {
            const option = optionText.toLowerCase();
            if (answerLower.includes('bachelor') && option.includes('bachelor'))
                return true;
            if (answerLower.includes('master') && option.includes('master'))
                return true;
            if (answerLower.includes('doctorate') && (option.includes('doctorate') || option.includes('phd')))
                return true;
            if (answerLower.includes('associate') && option.includes('associate'))
                return true;
            return false;
        },
        // Fuzzy match for proficiency levels
        (optionText) => {
            const option = optionText.toLowerCase();
            if (answerLower.includes('native') && option.includes('native'))
                return true;
            if (answerLower.includes('fluent') && (option.includes('fluent') || option.includes('advanced')))
                return true;
            if (answerLower.includes('intermediate') && (option.includes('intermediate') || option.includes('conversational')))
                return true;
            if (answerLower.includes('basic') && (option.includes('basic') || option.includes('beginner')))
                return true;
            return false;
        }
    ];
    // Try each matching strategy
    for (let i = 0; i < matchingStrategies.length; i++) {
        const strategy = matchingStrategies[i];
        console.log(`🔄 Trying matching strategy ${i + 1}/${matchingStrategies.length}`);
        for (const option of allOptions) {
            const optionText = option.textContent?.trim() || '';
            if (optionText && strategy(optionText)) {
                console.log(`✅ Found matching option: "${optionText}" for "${answerText}" using strategy ${i + 1}`);
                // Try multiple click methods
                const clickSuccess = await tryClickOption(option);
                if (clickSuccess) {
                    await new Promise(resolve => setTimeout(resolve, 300));
                    return true;
                }
            }
        }
    }
    // If no match found, log available options for debugging
    console.log(`⚠️ No matching option found for "${answerText}"`);
    console.log(`📋 Available options:`, Array.from(allOptions).slice(0, 10).map(opt => opt.textContent?.trim()).filter(Boolean));
    return false;
}
// Enhanced option clicking with multiple methods
async function tryClickOption(option) {
    try {
        // Method 1: Direct click
        option.click();
        await new Promise(resolve => setTimeout(resolve, 100));
        // Check if click worked by seeing if option is selected/highlighted
        if (option.getAttribute('aria-selected') === 'true' ||
            option.classList.contains('selected') ||
            option.classList.contains('active')) {
            return true;
        }
        // Method 2: Focus then click
        option.focus();
        await new Promise(resolve => setTimeout(resolve, 50));
        option.click();
        await new Promise(resolve => setTimeout(resolve, 100));
        // Method 3: Mouse events
        option.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        option.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        option.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await new Promise(resolve => setTimeout(resolve, 100));
        // Method 4: Keyboard selection
        option.focus();
        option.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        await new Promise(resolve => setTimeout(resolve, 100));
        return true;
    }
    catch (error) {
        console.log(`⚠️ Error clicking option:`, error);
        return false;
    }
}
// Step 1: Fill Personal Information
async function fillStep1PersonalInfo(profile) {
    console.log("🔄 Starting Step 1: Personal Information");
    // Fill Legal Name
    const firstNameEl = findElement(WORKDAY_STEP1_SELECTORS.FIRST_NAME);
    if (firstNameEl)
        fillInput(firstNameEl, profile.first_name);
    const middleNameEl = findElement(WORKDAY_STEP1_SELECTORS.MIDDLE_NAME);
    if (middleNameEl && profile.middle_name)
        fillInput(middleNameEl, profile.middle_name);
    const lastNameEl = findElement(WORKDAY_STEP1_SELECTORS.LAST_NAME);
    if (lastNameEl)
        fillInput(lastNameEl, profile.last_name);
    // Fill Address
    const addressEl = findElement(WORKDAY_STEP1_SELECTORS.ADDRESS_LINE_1);
    if (addressEl)
        fillInput(addressEl, profile.address_line_1);
    const cityEl = findElement(WORKDAY_STEP1_SELECTORS.CITY);
    if (cityEl)
        fillInput(cityEl, profile.city);
    const postalEl = findElement(WORKDAY_STEP1_SELECTORS.POSTAL_CODE);
    if (postalEl)
        fillInput(postalEl, profile.postal_code);
    // Fill Phone
    const phoneEl = findElement(WORKDAY_STEP1_SELECTORS.PHONE_NUMBER);
    if (phoneEl)
        fillInput(phoneEl, profile.phone);
    // Handle Phone Device Type dropdown (set to Mobile)
    const phoneDeviceTypeEl = findElement(WORKDAY_STEP1_SELECTORS.PHONE_DEVICE_TYPE);
    if (phoneDeviceTypeEl) {
        console.log("🔄 Setting Phone Device Type to Mobile");
        await clickWorkdayDropdown(phoneDeviceTypeEl, "Mobile");
    }
    // Handle State dropdown
    const stateEl = findElement(WORKDAY_STEP1_SELECTORS.STATE);
    if (stateEl && profile.state) {
        console.log(`🔄 Setting State to ${profile.state}`);
        await clickWorkdayDropdown(stateEl, profile.state);
    }
    // Handle "How Did You Hear About Us" dropdown (set to Indeed)
    const howDidYouHearEl = findElement(WORKDAY_STEP1_SELECTORS.HOW_DID_YOU_HEAR);
    if (howDidYouHearEl) {
        console.log("🔄 Setting How Did You Hear About Us to Indeed");
        await clickWorkdayDropdown(howDidYouHearEl, "Indeed");
    }
    // Handle Previous Worker question (default to No for most applicants)
    const previousWorkerNoEl = findElement(WORKDAY_STEP1_SELECTORS.PREVIOUS_WORKER_NO);
    if (previousWorkerNoEl)
        clickRadioButton(previousWorkerNoEl);
    console.log("✅ Step 1: Personal Information completed");
}
// Step 2: Fill My Experience
async function fillStep2MyExperience(profile, completeProfile) {
    console.log("🔄 Starting Step 2: My Experience");
    // Fill Skills
    const skillsEl = findElement(WORKDAY_STEP2_SELECTORS.SKILLS_INPUT);
    if (skillsEl && completeProfile?.profile_skills) {
        const skills = completeProfile.profile_skills.map((skill) => skill.skill_name);
        if (skills.length > 0) {
            console.log(`🎯 Found ${skills.length} skills to add:`, skills.slice(0, 5));
            await fillSkillsInput(skillsEl, skills);
        }
    }
    // Fill Social Network URLs
    const linkedinEl = findElement(WORKDAY_STEP2_SELECTORS.LINKEDIN_URL);
    if (linkedinEl) {
        // Try multiple sources for LinkedIn URL
        const linkedinUrl = profile.linkedin_url ||
            completeProfile?.portfolio_links?.find((link) => link.platform?.toLowerCase().includes('linkedin'))?.url;
        if (linkedinUrl)
            fillInput(linkedinEl, linkedinUrl);
    }
    const twitterEl = findElement(WORKDAY_STEP2_SELECTORS.TWITTER_URL);
    if (twitterEl) {
        const twitterUrl = completeProfile?.portfolio_links?.find((link) => link.platform?.toLowerCase().includes('twitter'))?.url;
        if (twitterUrl)
            fillInput(twitterEl, twitterUrl);
    }
    const facebookEl = findElement(WORKDAY_STEP2_SELECTORS.FACEBOOK_URL);
    if (facebookEl) {
        const facebookUrl = completeProfile?.portfolio_links?.find((link) => link.platform?.toLowerCase().includes('facebook'))?.url;
        if (facebookUrl)
            fillInput(facebookEl, facebookUrl);
    }
    // Handle Resume Upload
    const resumeInputEl = findElement(WORKDAY_STEP2_SELECTORS.RESUME_FILE_INPUT);
    if (resumeInputEl) {
        console.log(`📄 Found resume upload element, attempting upload...`);
        await handleResumeUpload(resumeInputEl, profile.resume_url);
    }
    else {
        console.log(`⚠️ No resume upload element found`);
        // Try alternative approach - look for all upload elements
        const uploadElements = findResumeUploadElements();
        if (uploadElements.fileInput || uploadElements.uploadButton || uploadElements.uploadArea) {
            console.log(`📄 Found alternative resume upload elements, attempting upload...`);
            const targetElement = uploadElements.fileInput || uploadElements.uploadButton || uploadElements.uploadArea;
            if (targetElement) {
                await handleResumeUpload(targetElement, profile.resume_url);
            }
        }
        else {
            console.log(`ℹ️ No resume upload controls found on this page`);
        }
    }
    // Handle Work Experience - Click Add and fill forms automatically
    const workExpEl = findElement(WORKDAY_STEP2_SELECTORS.WORK_EXPERIENCE_ADD);
    if (workExpEl && completeProfile?.work_experiences?.length > 0) {
        console.log(`💼 Found ${completeProfile.work_experiences.length} work experiences - adding them sequentially`);
        const workExperiences = completeProfile.work_experiences.slice(0, 3); // Limit to 3 most recent
        // Click the initial Add button to start the work experience section
        console.log(`🔄 Clicking initial Work Experience Add button`);
        workExpEl.click();
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for modal to open
        // Fill each work experience
        for (let i = 0; i < workExperiences.length; i++) {
            const workExp = workExperiences[i];
            const isLastEntry = (i === workExperiences.length - 1);
            console.log(`🔄 Adding work experience ${i + 1}/${workExperiences.length}: ${workExp.position_title} at ${workExp.company_name}`);
            console.log(`🔄 Is last entry: ${isLastEntry}`);
            // Fill the modal form
            await fillWorkExperienceModal(workExp, isLastEntry);
            console.log(`✅ Completed work experience ${i + 1}/${workExperiences.length}`);
            // Small delay between entries to ensure UI updates properly
            if (!isLastEntry) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        console.log(`✅ All work experiences added successfully`);
    }
    // Handle Education - Click Add and fill forms automatically  
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait after work experience is done
    console.log(`🔍 Looking for Education Add button...`);
    let educationEl = findElement(WORKDAY_STEP2_SELECTORS.EDUCATION_ADD);
    // If not found by selectors, try finding by button text
    if (!educationEl) {
        console.log(`🔍 Education Add button not found by selectors, trying text search...`);
        educationEl = findButtonByText(['Add Education', '+ Education', 'Education Add', 'Add Another Education']);
    }
    console.log(`🔍 Education Add button found: ${!!educationEl}`);
    console.log(`🔍 Education data available: ${!!completeProfile?.education}`);
    console.log(`🔍 Education entries count: ${completeProfile?.education?.length || 0}`);
    if (educationEl && completeProfile?.education?.length > 0) {
        console.log(`🎓 Found ${completeProfile.education.length} education entries - adding them sequentially`);
        const educationEntries = completeProfile.education.slice(0, 2); // Limit to 2 most recent
        // Click the initial Add button to start the education section
        console.log(`🔄 Clicking initial Education Add button`);
        educationEl.click();
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for modal to open
        // Fill each education entry
        for (let i = 0; i < educationEntries.length; i++) {
            const education = educationEntries[i];
            const isLastEntry = (i === educationEntries.length - 1);
            console.log(`🔄 Adding education entry ${i + 1}/${educationEntries.length}: ${education.degree_type} from ${education.institution_name}`);
            console.log(`🔄 Is last entry: ${isLastEntry}`);
            // Fill the modal form
            await fillEducationModal(education, isLastEntry);
            console.log(`✅ Completed education entry ${i + 1}/${educationEntries.length}`);
            // Small delay between entries to ensure UI updates properly
            if (!isLastEntry) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        console.log(`✅ All education entries added successfully`);
    }
    console.log(`✅ Step 2: My Experience completed`);
    console.log("ℹ️  Note: Work Experience, Education, Certifications, Languages, and Resume now auto-filled!");
}
// Main Workday Autofill Function - Entry Point
async function autofillWorkday(userData) {
    console.log("🔄 Starting Workday autofill process with user data:", userData);
    try {
        // Wait for page to fully load
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Extract profile data
        const profile = userData;
        const completeProfile = userData; // Assuming userData contains all profile information
        console.log("📋 Profile data:", {
            name: `${profile.first_name} ${profile.last_name}`,
            email: profile.email,
            phone: profile.phone,
            hasWorkExperience: !!(completeProfile?.work_experiences?.length),
            hasEducation: !!(completeProfile?.education?.length),
            hasSkills: !!(completeProfile?.profile_skills?.length),
            hasLanguages: !!(completeProfile?.languages?.length)
        });
        // Detect current step and fill accordingly
        const currentStep = detectWorkdayStep();
        console.log(`🎯 Detected Workday step: ${currentStep}`);
        switch (currentStep) {
            case 1:
                console.log("🔄 Processing Step 1: Personal Information");
                await fillStep1PersonalInfo(profile);
                break;
            case 2:
                console.log("🔄 Processing Step 2: My Experience");
                await fillStep2MyExperience(profile, completeProfile);
                break;
            case 3:
                console.log("🔄 Processing Step 3: Application Questions");
                await fillStep3ApplicationQuestions(profile);
                break;
            case 4:
                console.log("🔄 Processing Step 4: Voluntary Disclosures");
                await fillStep4VoluntaryDisclosures(profile);
                break;
            case 5:
                console.log("🔄 Processing Step 5: Self Identification");
                await fillStep5SelfIdentification(profile);
                break;
            default:
                console.log("🔄 Processing all available steps");
                // Try to fill whatever step is currently visible
                await tryFillCurrentStep(profile, completeProfile);
                break;
        }
        console.log("✅ Workday autofill process completed successfully");
    }
    catch (error) {
        console.error("❌ Error in Workday autofill process:", error);
        throw error;
    }
}
// Helper function to detect which Workday step is currently active
function detectWorkdayStep() {
    // Look for step indicators in the UI
    const stepIndicators = [
        { step: 1, selectors: ['[data-automation-id*="step1"]', '[aria-label*="Step 1"]', 'h1:contains("Personal Information")', 'h2:contains("Personal Information")'] },
        { step: 2, selectors: ['[data-automation-id*="step2"]', '[aria-label*="Step 2"]', 'h1:contains("My Experience")', 'h2:contains("My Experience")'] },
        { step: 3, selectors: ['[data-automation-id*="step3"]', '[aria-label*="Step 3"]', 'h1:contains("Application Questions")', 'h2:contains("Application Questions")'] },
        { step: 4, selectors: ['[data-automation-id*="step4"]', '[aria-label*="Step 4"]', 'h1:contains("Voluntary")', 'h2:contains("Voluntary")'] },
        { step: 5, selectors: ['[data-automation-id*="step5"]', '[aria-label*="Step 5"]', 'h1:contains("Self")', 'h2:contains("Self")'] }
    ];
    // Check each step's indicators
    for (const { step, selectors } of stepIndicators) {
        for (const selector of selectors) {
            if (selector.includes(':contains(')) {
                // Handle :contains() pseudo-selector manually
                const textToFind = selector.match(/contains\("([^"]+)"\)/)?.[1];
                if (textToFind) {
                    const elements = document.querySelectorAll(selector.split(':contains(')[0]);
                    for (const el of elements) {
                        if (el.textContent?.includes(textToFind)) {
                            console.log(`✅ Detected step ${step} by text content: "${textToFind}"`);
                            return step;
                        }
                    }
                }
            }
            else {
                const element = document.querySelector(selector);
                if (element) {
                    console.log(`✅ Detected step ${step} by selector: ${selector}`);
                    return step;
                }
            }
        }
    }
    // Fallback: Try to detect by visible form fields
    if (findElement(WORKDAY_STEP1_SELECTORS.FIRST_NAME)) {
        console.log("✅ Detected step 1 by first name field");
        return 1;
    }
    if (findElement(WORKDAY_STEP2_SELECTORS.SKILLS_INPUT)) {
        console.log("✅ Detected step 2 by skills field");
        return 2;
    }
    // Default to step 1 if we can't detect
    console.log("⚠️ Could not detect specific step, defaulting to step 1");
    return 1;
}
// Helper function to try filling whatever step is currently visible
async function tryFillCurrentStep(profile, completeProfile) {
    console.log("🔄 Attempting to fill current visible step");
    // Try Step 1 fields
    if (findElement(WORKDAY_STEP1_SELECTORS.FIRST_NAME)) {
        console.log("📝 Found Step 1 fields, filling...");
        await fillStep1PersonalInfo(profile);
        return;
    }
    // Try Step 2 fields
    if (findElement(WORKDAY_STEP2_SELECTORS.SKILLS_INPUT) || findElement(WORKDAY_STEP2_SELECTORS.WORK_EXPERIENCE_ADD)) {
        console.log("📝 Found Step 2 fields, filling...");
        await fillStep2MyExperience(profile, completeProfile);
        return;
    }
    // Try Step 3 fields (when implemented)
    // if (findElement(WORKDAY_STEP3_SELECTORS.QUESTION_BUTTONS)) {
    //   console.log("📝 Found Step 3 fields, filling...");
    //   await fillStep3ApplicationQuestions(profile);
    //   return;
    // }
    console.log("ℹ️ No recognizable step fields found");
}
// Placeholder functions for Steps 3, 4, and 5 (to be implemented)
async function fillStep3ApplicationQuestions(profile) {
    console.log("🔄 Step 3: Application Questions (placeholder - to be implemented)");
    // TODO: Implement Step 3 logic
}
async function fillStep4VoluntaryDisclosures(profile) {
    console.log("🔄 Step 4: Voluntary Disclosures (placeholder - to be implemented)");
    // TODO: Implement Step 4 logic
}
async function fillStep5SelfIdentification(profile) {
    console.log("🔄 Step 5: Self Identification (placeholder - to be implemented)");
    // TODO: Implement Step 5 logic
}


/***/ }),

/***/ "./src/content/autofillEngine.ts":
/*!***************************************!*\
  !*** ./src/content/autofillEngine.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.autofillRouter = autofillRouter;
exports.autofillRouterSync = autofillRouterSync;
// @ts-ignore
const workday_1 = __webpack_require__(/*! ./autofill/workday */ "./src/content/autofill/workday.ts");
console.log("AutofillEngine module loaded");
/**
 * Enhanced autofill router that detects the current platform and routes to appropriate autofill handler
 * Supports LinkedIn, Workday, and other job application platforms
 * @param userData - User profile data for autofilling forms
 */
async function autofillRouter(userData) {
    console.log("AutofillRouter called with user data:", userData);
    const hostname = window.location.hostname.toLowerCase();
    const pathname = window.location.pathname.toLowerCase();
    const fullUrl = window.location.href.toLowerCase();
    console.log("Current page:", { hostname, pathname, fullUrl: window.location.href });
    try {
        // Workday platform detection (enhanced)
        if (isWorkdayPlatform(hostname, pathname, fullUrl)) {
            console.log("✅ Detected Workday application page, running enhanced Workday autofill");
            await (0, workday_1.autofillWorkday)(userData);
            console.log("✅ Workday autofill completed successfully");
            return;
        }
        // LinkedIn platform detection
        if (isLinkedInPlatform(hostname, pathname)) {
            console.log("✅ Detected LinkedIn page - LinkedIn autofill handled by existing automation");
            // LinkedIn autofill is handled by the existing automation system
            // No additional action needed here as the "Autofill This Page" button
            // on LinkedIn is primarily for the automation system
            console.log("ℹ️ LinkedIn autofill delegated to existing automation system");
            return;
        }
        // Other platforms can be added here
        // if (isGreenhousePlatform(hostname, pathname)) {
        //   await autofillGreenhouse(userData);
        //   return;
        // }
        // if (isLeverPlatform(hostname, pathname)) {
        //   await autofillLever(userData);
        //   return;
        // }
        console.warn("⚠️ No specific autofill handler defined for this site:", hostname);
        console.log("ℹ️ Attempting generic form autofill...");
        // Generic autofill fallback for unknown platforms
        await attemptGenericAutofill(userData);
    }
    catch (error) {
        console.error("❌ Error in autofill router:", error);
        throw error; // Re-throw to be handled by the message listener
    }
}
/**
 * Detects if the current page is a Workday application platform
 * @param hostname - Current page hostname
 * @param pathname - Current page pathname
 * @param fullUrl - Full URL for additional checks
 * @returns boolean indicating if this is a Workday platform
 */
function isWorkdayPlatform(hostname, pathname, fullUrl) {
    // Common Workday hostname patterns
    const workdayHostnamePatterns = [
        'workday.com',
        '.workday.com',
        'myworkday.com',
        '.myworkday.com',
        'workdaysuccessfactors.com'
    ];
    // Common Workday URL path patterns
    const workdayPathPatterns = [
        '/workday',
        '/careers',
        '/job',
        '/apply',
        '/application',
        '/candidate'
    ];
    // Check hostname patterns
    const isWorkdayHostname = workdayHostnamePatterns.some(pattern => hostname.includes(pattern));
    // Check path patterns
    const isWorkdayPath = workdayPathPatterns.some(pattern => pathname.includes(pattern));
    // Check for Workday-specific URL parameters or fragments
    const hasWorkdayParams = fullUrl.includes('workday') ||
        fullUrl.includes('wd-') ||
        fullUrl.includes('wday');
    const isWorkday = isWorkdayHostname || (isWorkdayPath && hasWorkdayParams);
    if (isWorkday) {
        console.log("🎯 Workday platform detected:", {
            hostname: isWorkdayHostname,
            path: isWorkdayPath,
            params: hasWorkdayParams
        });
    }
    return isWorkday;
}
/**
 * Detects if the current page is LinkedIn
 * @param hostname - Current page hostname
 * @param pathname - Current page pathname
 * @returns boolean indicating if this is LinkedIn
 */
function isLinkedInPlatform(hostname, pathname) {
    const isLinkedIn = hostname.includes('linkedin.com');
    if (isLinkedIn) {
        console.log("🎯 LinkedIn platform detected");
    }
    return isLinkedIn;
}
/**
 * Attempts generic form autofill for unknown platforms
 * Uses common field selectors and patterns
 * @param userData - User profile data
 */
async function attemptGenericAutofill(userData) {
    console.log("🔄 Attempting generic autofill for unknown platform");
    // Generic field selectors for common form fields
    const genericSelectors = {
        firstName: [
            'input[name*="first" i][name*="name" i]',
            'input[placeholder*="first name" i]',
            'input[id*="first" i][id*="name" i]'
        ],
        lastName: [
            'input[name*="last" i][name*="name" i]',
            'input[placeholder*="last name" i]',
            'input[id*="last" i][id*="name" i]'
        ],
        email: [
            'input[type="email"]',
            'input[name*="email" i]',
            'input[placeholder*="email" i]'
        ],
        phone: [
            'input[type="tel"]',
            'input[name*="phone" i]',
            'input[placeholder*="phone" i]'
        ]
    };
    let filledFields = 0;
    // Try to fill basic fields
    for (const [fieldType, selectors] of Object.entries(genericSelectors)) {
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && !element.value) {
                let value = '';
                switch (fieldType) {
                    case 'firstName':
                        value = userData.first_name || '';
                        break;
                    case 'lastName':
                        value = userData.last_name || '';
                        break;
                    case 'email':
                        value = userData.email || '';
                        break;
                    case 'phone':
                        value = userData.phone || '';
                        break;
                }
                if (value) {
                    element.value = value;
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                    element.dispatchEvent(new Event('change', { bubbles: true }));
                    filledFields++;
                    console.log(`✅ Filled ${fieldType} field with generic selector`);
                    break; // Move to next field type
                }
            }
        }
    }
    if (filledFields > 0) {
        console.log(`✅ Generic autofill completed: ${filledFields} fields filled`);
    }
    else {
        console.log("⚠️ No compatible fields found for generic autofill");
    }
}
// Legacy synchronous wrapper for backward compatibility
function autofillRouterSync(userData) {
    autofillRouter(userData).catch(error => {
        console.error("Error in async autofill router:", error);
    });
}


/***/ }),

/***/ "./src/content/automation/control.ts":
/*!*******************************************!*\
  !*** ./src/content/automation/control.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/**
 * Automation control module for the LinkedIn Easy Apply extension
 * Handles starting, stopping, and managing the automation lifecycle
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.stopAutomation = exports.startAutomation = void 0;
const core_1 = __webpack_require__(/*! ./core */ "./src/content/automation/core.ts");
// Global reference objects that persist across start/stop cycles
let globalIsRunningRef = null;
let globalContinuingRef = null;
/**
 * Starts the automation process
 * Sets up the main automation interval and initializes state management
 * @param state - The automation state object
 * @param setIsRunning - Function to update the isRunning state
 * @param setContinuing - Function to update the continuing state
 */
const startAutomation = (state, setIsRunning, setContinuing) => {
    // Update state first
    setIsRunning(true);
    setContinuing(false);
    console.log("🚀 Starting automation, state.isRunning:", state.isRunning);
    chrome.storage.local.set({ isAutomationRunning: true });
    // Clear any existing interval
    if (state.automationInterval) {
        console.log("🧹 Clearing existing automation interval");
        window.clearInterval(state.automationInterval);
        state.automationInterval = null;
    }
    // Create or reuse reference objects for state management
    if (!globalIsRunningRef) {
        globalIsRunningRef = { current: state.isRunning };
    }
    else {
        globalIsRunningRef.current = state.isRunning;
    }
    if (!globalContinuingRef) {
        globalContinuingRef = { current: state.continuing };
    }
    else {
        globalContinuingRef.current = state.continuing;
    }
    const setContinuingInternal = (value) => {
        setContinuing(value);
        if (globalContinuingRef) {
            globalContinuingRef.current = value;
        }
    };
    state.automationInterval = window.setInterval(async () => {
        // Always check the current state values
        if (!state.isRunning) {
            console.log("⏹️ Automation stopped, clearing interval");
            if (state.automationInterval) {
                window.clearInterval(state.automationInterval);
                state.automationInterval = null;
            }
            return;
        }
        // Update reference objects with current state
        if (globalIsRunningRef)
            globalIsRunningRef.current = state.isRunning;
        if (globalContinuingRef)
            globalContinuingRef.current = state.continuing;
        if (!state.continuing && globalIsRunningRef && globalContinuingRef) {
            await (0, core_1.processApplication)(globalIsRunningRef, globalContinuingRef, state.appliedJobIds, setContinuingInternal);
        }
    }, 2000);
    console.log("✅ Automation interval started with ID:", state.automationInterval);
};
exports.startAutomation = startAutomation;
/**
 * Stops the automation process
 * Cleans up intervals and resets state
 * @param state - The automation state object
 * @param setIsRunning - Function to update the isRunning state
 * @param setContinuing - Function to update the continuing state
 */
const stopAutomation = (state, setIsRunning, setContinuing) => {
    console.log("🛑 Stopping automation, current interval ID:", state.automationInterval);
    console.log("🛑 Current state.isRunning:", state.isRunning);
    // Update state first
    setIsRunning(false);
    setContinuing(false);
    // CRITICAL: Update global reference objects immediately so running processes stop
    if (globalIsRunningRef) {
        globalIsRunningRef.current = false;
        console.log("🛑 Updated globalIsRunningRef.current:", globalIsRunningRef.current);
    }
    if (globalContinuingRef) {
        globalContinuingRef.current = false;
        console.log("🛑 Updated globalContinuingRef.current:", globalContinuingRef.current);
    }
    console.log("🛑 Updated state.isRunning:", state.isRunning);
    // Clear the interval
    if (state.automationInterval) {
        console.log("🧹 Clearing automation interval:", state.automationInterval);
        window.clearInterval(state.automationInterval);
        state.automationInterval = null;
        console.log("✅ Interval cleared, state.automationInterval:", state.automationInterval);
    }
    else {
        console.log("⚠️ No automation interval to clear");
    }
    // Store the stopped state
    chrome.storage.local.set({ isAutomationRunning: false });
    console.log("✅ Automation stopped and state saved");
};
exports.stopAutomation = stopAutomation;


/***/ }),

/***/ "./src/content/automation/core.ts":
/*!****************************************!*\
  !*** ./src/content/automation/core.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/**
 * Automation core module for the LinkedIn Easy Apply extension
 * Contains the main application processing logic that orchestrates the entire job application flow
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.processApplication = void 0;
const types_1 = __webpack_require__(/*! ../../types */ "./src/types.ts");
const utils_1 = __webpack_require__(/*! ../utils */ "./src/content/utils/index.ts");
const forms_1 = __webpack_require__(/*! ../forms */ "./src/content/forms/index.ts");
const jobs_1 = __webpack_require__(/*! ../jobs */ "./src/content/jobs/index.ts");
const navigation_1 = __webpack_require__(/*! ../navigation */ "./src/content/navigation/index.ts");
const application_1 = __webpack_require__(/*! ../application */ "./src/content/application/index.ts");
/**
 * Main automation function that processes job applications
 * Orchestrates the entire application flow including job finding, scrolling, form completion, and error handling
 * @param isRunning - Reference to the global running state
 * @param continuing - Reference to the global continuing state
 * @param appliedJobIds - Set of job IDs that have already been processed
 * @param setContinuing - Function to update the continuing state
 * @returns Promise<void>
 */
const processApplication = async (isRunning, continuing, appliedJobIds, setContinuing) => {
    try {
        while (isRunning.current) {
            // Check for save application popup first
            if (await (0, application_1.handleSaveApplicationPopup)()) {
                await (0, utils_1.sleep)(250);
            }
            console.log("🔍 Looking for next applicable job...");
            const nextJob = (0, jobs_1.findNextJob)();
            if (!nextJob) {
                console.log("🔄 No applicable job found, attempting to scroll for more jobs");
                // Use dynamic detection instead of hardcoded selectors
                let jobList = (0, navigation_1.findScrollableJobListContainer)();
                let scrollPerformed = false;
                if (jobList) {
                    // Calculate a smooth scrolling amount (about 70% of viewport height)
                    const scrollAmount = window.innerHeight * 0.5;
                    const currentScrollTop = jobList.scrollTop;
                    // Only scroll if we're not already at the bottom
                    const isAtBottom = jobList.scrollHeight - jobList.scrollTop <= jobList.clientHeight + 50;
                    if (!isAtBottom) {
                        console.log(`📜 Scrolling job list by ${scrollAmount}px to load more jobs (scrollTop: ${currentScrollTop}, scrollHeight: ${jobList.scrollHeight})`);
                        // Force scroll upward first to trigger LinkedIn's job loading
                        jobList.scrollTo({
                            top: Math.max(0, currentScrollTop - 100),
                            behavior: 'smooth'
                        });
                        await (0, utils_1.sleep)(1000);
                        // Then scroll down more
                        jobList.scrollTo({
                            top: currentScrollTop + scrollAmount,
                            behavior: 'smooth'
                        });
                        scrollPerformed = true;
                    }
                    else {
                        console.log("📄 Reached bottom of job list, trying to click next page number");
                        // We're at the bottom of the list, try to click the next page number button
                        if (await (0, navigation_1.clickNextPageNumber)()) {
                            console.log("✅ Successfully clicked next page number");
                            await (0, utils_1.sleep)(3000); // Wait for next page to load
                            continue;
                        }
                        else {
                            // Fall back to the old method if page number navigation fails
                            console.log("⚠️ Falling back to 'Next' button");
                            const nextPageButton = document.querySelector('button[aria-label="Next"]');
                            if (nextPageButton && (0, utils_1.isElementVisible)(nextPageButton)) {
                                console.log("🖱️ Clicking next page button");
                                nextPageButton.click();
                                await (0, utils_1.sleep)(3000); // Wait for next page to load
                                continue;
                            }
                            else {
                                console.log("❌ No pagination buttons found - may have reached the end of results");
                                // Consider pausing automation if we've exhausted all jobs
                                let scrollAttempts = parseInt(localStorage.getItem('scrollAttempts') || '0');
                                scrollAttempts++;
                                localStorage.setItem('scrollAttempts', scrollAttempts.toString());
                                // If we've tried scrolling multiple times with no jobs, pause briefly
                                if (scrollAttempts > 5) {
                                    console.log("🛑 Multiple scroll attempts with no jobs found. Pausing automation briefly.");
                                    localStorage.setItem('scrollAttempts', '0');
                                    await (0, utils_1.sleep)(10000); // Longer pause to allow user to intervene if needed
                                }
                            }
                        }
                    }
                }
                else {
                    console.log("❓ Could not find the job list element, trying direct window scroll");
                    // If we couldn't find the job list, try scrolling the window directly
                    window.scrollBy({
                        top: window.innerHeight * 0.7,
                        behavior: 'smooth'
                    });
                    scrollPerformed = true;
                }
                // Wait longer for jobs to load after scrolling
                if (scrollPerformed) {
                    await (0, utils_1.sleep)(3000);
                    // Check if scrolling loaded any new jobs
                    const newNextJob = (0, jobs_1.findNextJob)();
                    if (newNextJob) {
                        console.log("✅ Found new job after scrolling");
                        continue; // Skip to next iteration to process this job
                    }
                }
                console.log("⏱️ Waiting briefly before next job check");
                await (0, utils_1.sleep)(2000); // Only 2 seconds wait when no jobs found
                continue;
            }
            try {
                console.log("Processing job: " + nextJob.textContent?.substring(0, 30)?.trim());
                (0, jobs_1.scrollToJob)(nextJob);
                await (0, utils_1.sleep)(1000); // Reduced from 2000ms
                if (!(0, jobs_1.clickJob)(nextJob)) {
                    console.log("Failed to click job, moving to next");
                    // Mark this job as applied so we don't get stuck on it
                    (0, jobs_1.markJobAsApplied)(nextJob);
                    continue;
                }
                await (0, utils_1.sleep)(1000); // Reduced from 2000ms
                if (!await (0, utils_1.clickElement)(types_1.SELECTORS.EASY_APPLY_BUTTON)) {
                    console.log("Failed to click Easy Apply button, moving to next job");
                    // Mark this job as applied so we don't get stuck on it
                    (0, jobs_1.markJobAsApplied)(nextJob);
                    continue;
                }
                // Get job details
                const jobTitleElement = document.querySelector('.t-24.job-details-jobs-unified-top-card__job-title');
                const companyElement = document.querySelector('.job-details-jobs-unified-top-card__company-name');
                const jobTitle = jobTitleElement?.textContent?.trim() || 'Unknown Position';
                const companyName = companyElement?.textContent?.trim() || 'Unknown Company';
                console.log(`Applying to: ${jobTitle} at ${companyName}`);
                setContinuing(true);
                let retryCount = 0;
                const maxRetries = 3;
                let currentFormCompleted = false;
                // Main application loop - stays on current form until completed
                while (continuing.current && isRunning.current) {
                    // Check for save application popup
                    if (await (0, application_1.handleSaveApplicationPopup)()) {
                        await (0, utils_1.sleep)(250); // Reduced from 500ms
                        continue;
                    }
                    // Display a message to the user that they can interact with the form
                    const formElement = document.querySelector('.jobs-easy-apply-modal__content');
                    if (formElement) {
                        console.log("✍️ Form is ready - you can fill in fields and the script will wait for you to finish");
                    }
                    // Wait for form completion (user filling fields)
                    console.log("Waiting for form completion...");
                    const formCompleted = await (0, forms_1.waitForFormCompletion)(isRunning);
                    if (!formCompleted) {
                        console.log("Form completion timed out");
                        setContinuing(false);
                        // Make sure to click close button before breaking
                        await (0, utils_1.clickElement)(types_1.SELECTORS.CLOSE_BUTTON);
                        break;
                    }
                    console.log("All fields filled, proceeding to next step");
                    // Try to click next/submit button
                    const buttonClicked = await (0, application_1.handleButtonClick)(jobTitle, companyName, nextJob, appliedJobIds);
                    if (!buttonClicked) {
                        retryCount++;
                        console.log(`Failed to click button, retry ${retryCount}/${maxRetries}`);
                        if (retryCount >= maxRetries) {
                            await (0, utils_1.clickElement)(types_1.SELECTORS.CLOSE_BUTTON);
                            setContinuing(false);
                            break;
                        }
                        await (0, utils_1.sleep)(500); // Reduced from 1000ms
                        continue;
                    }
                    // Reset retry count after successful button click
                    retryCount = 0;
                    // Wait for new form to load or submit to complete
                    await (0, utils_1.sleep)(1000); // Reduced from 2000ms
                    // Check if we're still in the application modal
                    const modal = document.querySelector('.artdeco-modal__content.jobs-easy-apply-modal__content');
                    if (!modal) {
                        console.log("Application completed successfully");
                        currentFormCompleted = true;
                        break;
                    }
                    // After clicking any button, check for save popup
                    if (buttonClicked) {
                        await (0, utils_1.sleep)(250); // Reduced from 500ms
                        if (await (0, application_1.handleSaveApplicationPopup)()) {
                            await (0, utils_1.sleep)(250); // Reduced from 500ms
                        }
                    }
                }
                // Only mark as applied if we completed the application
                if (currentFormCompleted) {
                    console.log("Application successfully completed, waiting before moving to next job");
                    // Note: We don't need to call markJobAsApplied here since it's already handled in trackSuccessfulApplication
                    await (0, utils_1.sleep)(1500); // Reduced from 3000ms - wait before moving to next job
                }
                else {
                    console.log("Application not completed, closing modal");
                    // Make sure to click close button here as well
                    await (0, utils_1.clickElement)(types_1.SELECTORS.CLOSE_BUTTON);
                    // Still mark the job as applied to avoid getting stuck
                    // Get the job ID if possible
                    const jobId = nextJob.closest('[data-job-id]')?.getAttribute('data-job-id') ||
                        window.location.href.match(/\/view\/(\d+)\//)?.[1];
                    if (jobId && !appliedJobIds.has(jobId)) {
                        // Add to our tracking set
                        appliedJobIds.add(jobId);
                        // Mark in DOM
                        (0, jobs_1.markJobAsApplied)(nextJob);
                        // Add to storage
                        chrome.storage.local.get(['appliedJobIds'], result => {
                            const storedIds = result.appliedJobIds || [];
                            storedIds.push(jobId);
                            chrome.storage.local.set({ appliedJobIds: [...new Set(storedIds)] });
                        });
                    }
                    else {
                        // Just mark in DOM if we can't get the ID
                        (0, jobs_1.markJobAsApplied)(nextJob);
                    }
                }
            }
            catch (error) {
                console.error("Error during application process:", error);
                // Check for save popup before closing
                await (0, application_1.handleSaveApplicationPopup)();
                await (0, utils_1.clickElement)(types_1.SELECTORS.CLOSE_BUTTON);
                // Mark job as applied to avoid getting stuck
                if (nextJob) {
                    const jobId = nextJob.closest('[data-job-id]')?.getAttribute('data-job-id') ||
                        window.location.href.match(/\/view\/(\d+)\//)?.[1];
                    if (jobId && !appliedJobIds.has(jobId)) {
                        // Add to our tracking set
                        appliedJobIds.add(jobId);
                        // Mark in DOM
                        (0, jobs_1.markJobAsApplied)(nextJob);
                        // Add to storage
                        chrome.storage.local.get(['appliedJobIds'], result => {
                            const storedIds = result.appliedJobIds || [];
                            storedIds.push(jobId);
                            chrome.storage.local.set({ appliedJobIds: [...new Set(storedIds)] });
                        });
                    }
                    else {
                        // Just mark in DOM if we can't get the ID
                        (0, jobs_1.markJobAsApplied)(nextJob);
                    }
                }
                continue;
            }
        }
    }
    catch (error) {
        console.error("Fatal error in processApplication:", error);
        setContinuing(false);
        await (0, application_1.handleSaveApplicationPopup)();
        await (0, utils_1.clickElement)(types_1.SELECTORS.CLOSE_BUTTON);
    }
};
exports.processApplication = processApplication;


/***/ }),

/***/ "./src/content/automation/index.ts":
/*!*****************************************!*\
  !*** ./src/content/automation/index.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/**
 * Automation module exports
 * Re-exports all automation-related functions for easy importing
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.stopAutomation = exports.startAutomation = exports.processApplication = void 0;
// Core automation processing
var core_1 = __webpack_require__(/*! ./core */ "./src/content/automation/core.ts");
Object.defineProperty(exports, "processApplication", ({ enumerable: true, get: function () { return core_1.processApplication; } }));
// Automation control and lifecycle management
var control_1 = __webpack_require__(/*! ./control */ "./src/content/automation/control.ts");
Object.defineProperty(exports, "startAutomation", ({ enumerable: true, get: function () { return control_1.startAutomation; } }));
Object.defineProperty(exports, "stopAutomation", ({ enumerable: true, get: function () { return control_1.stopAutomation; } }));


/***/ }),

/***/ "./src/content/events/index.ts":
/*!*************************************!*\
  !*** ./src/content/events/index.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/**
 * Event handling module exports
 * Re-exports all event handling functions for easy importing
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setupDebugUtilities = exports.setupPageEventListeners = exports.setupMessageListener = void 0;
// Chrome extension messaging and event handlers
var messaging_1 = __webpack_require__(/*! ./messaging */ "./src/content/events/messaging.ts");
Object.defineProperty(exports, "setupMessageListener", ({ enumerable: true, get: function () { return messaging_1.setupMessageListener; } }));
Object.defineProperty(exports, "setupPageEventListeners", ({ enumerable: true, get: function () { return messaging_1.setupPageEventListeners; } }));
Object.defineProperty(exports, "setupDebugUtilities", ({ enumerable: true, get: function () { return messaging_1.setupDebugUtilities; } }));


/***/ }),

/***/ "./src/content/events/messaging.ts":
/*!*****************************************!*\
  !*** ./src/content/events/messaging.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/**
 * Event handling module for the LinkedIn Easy Apply extension
 * Handles Chrome extension messaging, page events, and debugging utilities
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setupDebugUtilities = exports.setupPageEventListeners = exports.setupMessageListener = void 0;
const autofillEngine_1 = __webpack_require__(/*! ../autofillEngine */ "./src/content/autofillEngine.ts");
const automation_1 = __webpack_require__(/*! ../automation */ "./src/content/automation/index.ts");
const supabase_1 = __webpack_require__(/*! ../../lib/supabase */ "./src/lib/supabase.ts");
/**
 * Sets up Chrome extension message listener with comprehensive message handling
 * Handles START_AUTOMATION, STOP_AUTOMATION, GET_STATE, and AUTOFILL_CURRENT_PAGE messages
 * @param deps - Dependencies required for message handling
 */
const setupMessageListener = (deps) => {
    // Update message listener with more debugging
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log("Content script received message:", message);
        console.log("Content script sender:", sender);
        try {
            switch (message.type) {
                case 'START_AUTOMATION':
                    console.log("Handling START_AUTOMATION message");
                    if (message.settings) {
                        const currentUserData = deps.getUserData();
                        const updatedUserData = {
                            ...currentUserData,
                            settings: {
                                ...currentUserData?.settings,
                                nextJobDelay: message.settings.nextJobDelay
                            }
                        };
                        deps.setUserData(updatedUserData);
                        deps.automationState.userData = updatedUserData;
                    }
                    (0, automation_1.startAutomation)(deps.automationState, deps.setIsRunning, deps.setContinuing);
                    sendResponse({ isRunning: true });
                    break;
                case 'STOP_AUTOMATION':
                    console.log("Handling STOP_AUTOMATION message");
                    (0, automation_1.stopAutomation)(deps.automationState, deps.setIsRunning, deps.setContinuing);
                    sendResponse({ isRunning: false });
                    break;
                case 'GET_STATE':
                    console.log("Handling GET_STATE message");
                    sendResponse({ isRunning: deps.getIsRunning() });
                    break;
                case 'AUTOFILL_CURRENT_PAGE':
                    console.log("Handling AUTOFILL_CURRENT_PAGE message", message.data);
                    (async () => {
                        try {
                            if (!message.data) {
                                throw new Error("No user data provided for autofill");
                            }
                            await (0, autofillEngine_1.autofillRouter)(message.data);
                            sendResponse({ success: true });
                        }
                        catch (error) {
                            console.error("Error during autofill:", error);
                            sendResponse({ success: false, error: error.message });
                        }
                    })();
                    break;
                default:
                    console.log("Received unknown message type:", message.type);
                    sendResponse({ isRunning: deps.getIsRunning() });
            }
        }
        catch (e) {
            console.error("Error processing message:", e);
            sendResponse({ error: e.message });
        }
        return true;
    });
};
exports.setupMessageListener = setupMessageListener;
/**
 * Sets up page event listeners including cleanup on page unload
 * @param deps - Dependencies required for event handling
 */
const setupPageEventListeners = (deps) => {
    // Add cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (deps.getIsRunning()) {
            (0, automation_1.stopAutomation)(deps.automationState, deps.setIsRunning, deps.setContinuing);
        }
    });
};
exports.setupPageEventListeners = setupPageEventListeners;
/**
 * Sets up debugging utilities available from browser console
 * Creates global functions for testing database connectivity and authentication
 */
const setupDebugUtilities = () => {
    // Test function for database connectivity - can be called from browser console
    window.testDatabaseConnection = async () => {
        console.log('🔍 Testing database connection...');
        try {
            // Test 1: Check session
            const session = await (0, supabase_1.getSession)();
            console.log('🔍 Session test:', !!session);
            // Test 2: Check user
            const user = await (0, supabase_1.getCurrentUser)();
            console.log('🔍 User test:', !!user, user?.email);
            // Test 3: Try to track a test application
            const testResult = await (0, supabase_1.trackJobApplication)('Test Position', 'Test Company', {
                linkedin_job_id: `test-${Date.now()}`,
                location: 'Test Location',
                work_type: 'remote',
                job_description: 'Test description'
            });
            console.log('🔍 Database tracking test result:', testResult);
            return {
                hasSession: !!session,
                hasUser: !!user,
                userEmail: user?.email,
                trackingWorking: testResult
            };
        }
        catch (error) {
            console.error('🔍 Database connection test failed:', error);
            return {
                error: error.message
            };
        }
    };
    console.log('🔧 Database test function available: window.testDatabaseConnection()');
    // Function to check authentication status
    window.checkAuthStatus = async () => {
        console.log('🔍 Checking authentication status...');
        try {
            const session = await (0, supabase_1.getSession)();
            const user = await (0, supabase_1.getCurrentUser)();
            const authResult = await (0, supabase_1.ensureAuthenticated)();
            console.log('Auth Status:', {
                hasSession: !!session,
                hasUser: !!user,
                userEmail: user?.email,
                ensureAuthResult: authResult
            });
            return {
                hasSession: !!session,
                hasUser: !!user,
                userEmail: user?.email,
                ensureAuthResult: authResult
            };
        }
        catch (error) {
            console.error('Auth check failed:', error);
            return { error: error.message };
        }
    };
    console.log('🔧 Auth check function available: window.checkAuthStatus()');
};
exports.setupDebugUtilities = setupDebugUtilities;


/***/ }),

/***/ "./src/content/forms/completion.ts":
/*!*****************************************!*\
  !*** ./src/content/forms/completion.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/**
 * Form completion utility functions for the LinkedIn Easy Apply extension
 * These functions handle waiting for user form completion and automatic form field filling
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fillFormFields = exports.waitForFormCompletion = exports.waitForUserFinishTyping = void 0;
const utils_1 = __webpack_require__(/*! ../utils */ "./src/content/utils/index.ts");
const validation_1 = __webpack_require__(/*! ./validation */ "./src/content/forms/validation.ts");
const inputs_1 = __webpack_require__(/*! ./inputs */ "./src/content/forms/inputs.ts");
/**
 * Waits for user to finish typing in a specific element
 * Resolves when user hasn't typed for the specified timeout duration
 * @param element - The input element to monitor
 * @param timeout - Time to wait after last keystroke (default: 2000ms)
 * @returns Promise<void> that resolves when user stops typing
 */
const waitForUserFinishTyping = (element, timeout = 2000) => {
    return new Promise((resolve) => {
        let timer;
        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                element.removeEventListener('keydown', resetTimer);
                element.removeEventListener('input', resetTimer);
                resolve();
            }, timeout);
        };
        // Listen for keydown and input events
        element.addEventListener('keydown', resetTimer);
        element.addEventListener('input', resetTimer);
        // Also resolve if element loses focus
        element.addEventListener('blur', () => {
            clearTimeout(timer);
            element.removeEventListener('keydown', resetTimer);
            element.removeEventListener('input', resetTimer);
            resolve();
        }, { once: true });
        // Start the timer initially in case user doesn't type
        resetTimer();
    });
};
exports.waitForUserFinishTyping = waitForUserFinishTyping;
/**
 * Waits for form completion by monitoring required fields and user interactions
 * @param isRunning - Optional state object to check if automation should continue
 * @returns Promise<boolean> that resolves to true when form is complete, false on timeout or stop
 */
const waitForFormCompletion = async (isRunning) => {
    return new Promise((resolve) => {
        let isTyping = false;
        let typingTimer;
        let userInteractionInProgress = false;
        let stateCheckInterval;
        // Function declarations first to avoid temporal dead zone issues
        // Periodically check if automation should stop
        if (isRunning) {
            stateCheckInterval = setInterval(() => {
                if (!isRunning.current) {
                    console.log("🛑 Automation stopped during form completion");
                    cleanup();
                    resolve(false);
                    return;
                }
            }, 500); // Check every 500ms
        }
        // Function to check if user is currently interacting with any field
        const checkUserInteraction = () => {
            const activeElement = document.activeElement;
            if (activeElement &&
                (activeElement.tagName === 'INPUT' ||
                    activeElement.tagName === 'TEXTAREA' ||
                    activeElement.tagName === 'SELECT')) {
                return true;
            }
            return false;
        };
        const checkFields = async () => {
            // Check automation state first
            if (isRunning && !isRunning.current) {
                console.log("🛑 Automation stopped during field check");
                cleanup();
                resolve(false);
                return;
            }
            // If user is currently interacting with a field, wait
            if (checkUserInteraction()) {
                if (!userInteractionInProgress) {
                    userInteractionInProgress = true;
                    console.log('User interaction detected, waiting for completion...');
                    // Wait for the user to finish typing or interacting
                    const activeElement = document.activeElement;
                    await (0, exports.waitForUserFinishTyping)(activeElement, 2000);
                    userInteractionInProgress = false;
                    console.log('User interaction completed, continuing checks');
                    // Run check again after interaction finishes
                    setTimeout(checkFields, 500);
                    return;
                }
                return; // Don't proceed with checks while waiting for user
            }
            // Find all required fields using LinkedIn's required field indicators
            const requiredFields = document.querySelectorAll([
                // Text inputs with required indicator
                'label:has(span.artdeco-button__text--required) + input',
                'label:has(span.required) + input',
                // Radio button groups with required indicator
                'fieldset:has(legend span.artdeco-button__text--required) input[type="radio"]',
                // Backup selectors for LinkedIn's various required field styles
                '[data-test-single-line-text-form-component] input[required]',
                '[data-test-form-builder-radio-button-form-component] input[aria-required="true"]',
                '.artdeco-text-input--required input',
                '.fb-dash-form-element__label--is-required input'
            ].join(','));
            if (requiredFields.length === 0) {
                console.log('No required fields found, proceeding immediately');
                cleanup();
                resolve(true);
                return;
            }
            // Group radio buttons by name attribute
            const radioGroups = new Map();
            const textInputs = [];
            requiredFields.forEach(field => {
                const input = field;
                if (!(0, utils_1.isElementVisible)(input))
                    return;
                if (input.type === 'radio') {
                    const name = input.name;
                    if (!radioGroups.has(name)) {
                        radioGroups.set(name, []);
                    }
                    radioGroups.get(name)?.push(input);
                }
                else {
                    textInputs.push(input);
                }
            });
            // Check if any text input is empty or has validation errors
            const textInputsValid = textInputs.every(input => {
                const value = input.value.trim();
                const hasError = (0, validation_1.hasValidationErrors)(input);
                return value.length > 0 && !hasError;
            });
            // Check if all required radio groups have a selection
            const radioGroupsValid = Array.from(radioGroups.values()).every(group => group.some(radio => radio.checked));
            // If all fields are already filled, resolve immediately
            if (textInputsValid && radioGroupsValid) {
                console.log('All required fields are already filled, proceeding immediately');
                clearTimeout(typingTimer);
                // Still wait a small amount of time (300ms) before resolving to allow form validation to complete
                setTimeout(() => {
                    cleanup();
                    resolve(true);
                }, 300);
                return;
            }
            // Only continue waiting if not all fields are filled
            if (!textInputsValid || !radioGroupsValid) {
                // Schedule to check fields again in 500ms
                clearTimeout(typingTimer);
                typingTimer = setTimeout(checkFields, 500);
            }
        };
        // Add input event listeners to track typing
        const handleInput = () => {
            isTyping = true;
            clearTimeout(typingTimer);
            // Wait 1 second after user stops typing
            typingTimer = setTimeout(() => {
                isTyping = false;
                checkFields();
            }, 1000);
        };
        // Cleanup function - defined after all function declarations
        const cleanup = () => {
            clearTimeout(typingTimer);
            if (stateCheckInterval)
                clearInterval(stateCheckInterval);
            document.querySelectorAll('input, textarea').forEach(input => {
                input.removeEventListener('input', handleInput);
                input.removeEventListener('change', checkFields);
            });
        };
        // Add input listeners to all text inputs
        document.querySelectorAll('input[type="text"], input:not([type]), textarea').forEach(input => {
            input.addEventListener('input', handleInput);
        });
        // Add change listeners to radio buttons
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', checkFields);
        });
        // Check fields immediately in case they're already filled
        checkFields();
        // Cleanup after 3 minutes to prevent memory leaks (reduced from 5 minutes)
        setTimeout(() => {
            cleanup();
            resolve(false);
        }, 180000);
    });
};
exports.waitForFormCompletion = waitForFormCompletion;
/**
 * Checks if all required form fields are filled
 * @returns Promise<boolean> true if all required fields are filled, false otherwise
 */
const fillFormFields = async () => {
    try {
        // Find all required fields using LinkedIn's specific classes
        const formFields = document.querySelectorAll([
            '[data-test-single-line-text-form-component] input[required]',
            '[data-test-form-builder-radio-button-form-component] input[aria-required="true"]',
            '.artdeco-text-input--required input',
            '.fb-dash-form-element__label--is-required input'
        ].join(','));
        const requiredFields = Array.from(formFields).filter(field => (0, utils_1.isElementVisible)(field));
        if (requiredFields.length === 0) {
            return true; // No required fields found
        }
        // Check if any field is empty
        const emptyFields = requiredFields.filter(field => (0, inputs_1.isFieldEmpty)(field));
        if (emptyFields.length === 0) {
            return true; // All fields are filled
        }
        return false; // Some fields are still empty
    }
    catch (error) {
        return false;
    }
};
exports.fillFormFields = fillFormFields;


/***/ }),

/***/ "./src/content/forms/field-types.ts":
/*!******************************************!*\
  !*** ./src/content/forms/field-types.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {


/**
 * Form field type detection utility functions for the LinkedIn Easy Apply extension
 * These functions identify different types of form fields based on their structure and labels
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isTextInputField = exports.isNameField = exports.isSalaryField = exports.isChoiceField = exports.isNumericField = void 0;
/**
 * Checks if a form element is a numeric input field
 * @param element - HTML element to check
 * @returns true if the element is a numeric field, false otherwise
 */
const isNumericField = (element) => {
    // Check if it's a numeric input field by class and label
    const formComponent = element.closest('[data-test-single-line-text-form-component]');
    if (!formComponent)
        return false;
    const input = formComponent.querySelector('input');
    const label = formComponent.querySelector('label')?.textContent?.toLowerCase() || '';
    // Check if input has numeric-specific ID
    const isNumericInput = input?.id?.includes('numeric') || false;
    // Also check label text as backup
    const hasNumericLabel = label.includes('year') ||
        label.includes('number') ||
        label.includes('count') ||
        label.includes('amount');
    return isNumericInput || hasNumericLabel;
};
exports.isNumericField = isNumericField;
/**
 * Checks if a form element is a choice/radio button field
 * @param element - HTML element to check
 * @returns true if the element is a choice field, false otherwise
 */
const isChoiceField = (element) => {
    // Check if it's a radio button/choice field
    return !!element.closest('[data-test-form-builder-radio-button-form-component]');
};
exports.isChoiceField = isChoiceField;
/**
 * Checks if a form element is a salary-related field
 * @param element - HTML element to check
 * @returns true if the element is a salary field, false otherwise
 */
const isSalaryField = (element) => {
    const label = element.querySelector('label')?.textContent?.toLowerCase() || '';
    return label.includes('salary') ||
        label.includes('compensation') ||
        label.includes('pay') ||
        label.includes('wage');
};
exports.isSalaryField = isSalaryField;
/**
 * Checks if a form element is a name-related field
 * @param element - HTML element to check
 * @returns true if the element is a name field, false otherwise
 */
const isNameField = (element) => {
    const label = element.querySelector('label')?.textContent?.toLowerCase() || '';
    return label.includes('name') ||
        label.includes('full') ||
        label.includes('first') ||
        label.includes('last');
};
exports.isNameField = isNameField;
/**
 * Checks if a form element is a text input field (not numeric)
 * @param element - HTML element to check
 * @returns true if the element is a text input field, false otherwise
 */
const isTextInputField = (element) => {
    // Check if it's a text input field by class
    const formComponent = element.closest('[data-test-single-line-text-form-component]');
    if (!formComponent)
        return false;
    const input = formComponent.querySelector('input');
    // If input has numeric in ID, it's not a text field
    if (input?.id?.includes('numeric'))
        return false;
    return true;
};
exports.isTextInputField = isTextInputField;


/***/ }),

/***/ "./src/content/forms/index.ts":
/*!************************************!*\
  !*** ./src/content/forms/index.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/**
 * Forms module exports
 * Re-exports all form-related functions for easy importing
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fillFormFields = exports.waitForFormCompletion = exports.waitForUserFinishTyping = exports.isTextInputField = exports.isNameField = exports.isSalaryField = exports.isChoiceField = exports.isNumericField = exports.areAllFieldsFilled = exports.hasValidationErrors = exports.uploadResume = exports.selectOption = exports.fillTextArea = exports.fillInput = exports.isFieldEmpty = void 0;
// Form input utilities
var inputs_1 = __webpack_require__(/*! ./inputs */ "./src/content/forms/inputs.ts");
Object.defineProperty(exports, "isFieldEmpty", ({ enumerable: true, get: function () { return inputs_1.isFieldEmpty; } }));
Object.defineProperty(exports, "fillInput", ({ enumerable: true, get: function () { return inputs_1.fillInput; } }));
Object.defineProperty(exports, "fillTextArea", ({ enumerable: true, get: function () { return inputs_1.fillTextArea; } }));
Object.defineProperty(exports, "selectOption", ({ enumerable: true, get: function () { return inputs_1.selectOption; } }));
Object.defineProperty(exports, "uploadResume", ({ enumerable: true, get: function () { return inputs_1.uploadResume; } }));
// Form validation utilities
var validation_1 = __webpack_require__(/*! ./validation */ "./src/content/forms/validation.ts");
Object.defineProperty(exports, "hasValidationErrors", ({ enumerable: true, get: function () { return validation_1.hasValidationErrors; } }));
Object.defineProperty(exports, "areAllFieldsFilled", ({ enumerable: true, get: function () { return validation_1.areAllFieldsFilled; } }));
// Form field type detection utilities
var field_types_1 = __webpack_require__(/*! ./field-types */ "./src/content/forms/field-types.ts");
Object.defineProperty(exports, "isNumericField", ({ enumerable: true, get: function () { return field_types_1.isNumericField; } }));
Object.defineProperty(exports, "isChoiceField", ({ enumerable: true, get: function () { return field_types_1.isChoiceField; } }));
Object.defineProperty(exports, "isSalaryField", ({ enumerable: true, get: function () { return field_types_1.isSalaryField; } }));
Object.defineProperty(exports, "isNameField", ({ enumerable: true, get: function () { return field_types_1.isNameField; } }));
Object.defineProperty(exports, "isTextInputField", ({ enumerable: true, get: function () { return field_types_1.isTextInputField; } }));
// Form completion utilities
var completion_1 = __webpack_require__(/*! ./completion */ "./src/content/forms/completion.ts");
Object.defineProperty(exports, "waitForUserFinishTyping", ({ enumerable: true, get: function () { return completion_1.waitForUserFinishTyping; } }));
Object.defineProperty(exports, "waitForFormCompletion", ({ enumerable: true, get: function () { return completion_1.waitForFormCompletion; } }));
Object.defineProperty(exports, "fillFormFields", ({ enumerable: true, get: function () { return completion_1.fillFormFields; } }));


/***/ }),

/***/ "./src/content/forms/inputs.ts":
/*!*************************************!*\
  !*** ./src/content/forms/inputs.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/**
 * Form input utility functions for the LinkedIn Easy Apply extension
 * These functions handle filling, selecting, and uploading data to form elements
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.uploadResume = exports.selectOption = exports.fillTextArea = exports.fillInput = exports.isFieldEmpty = void 0;
const core_1 = __webpack_require__(/*! ../utils/core */ "./src/content/utils/core.ts");
/**
 * Checks if a form element is empty
 * @param element - Input, textarea, or select element to check
 * @returns true if the element has no value, false otherwise
 */
const isFieldEmpty = (element) => {
    return element.value.trim().length === 0;
};
exports.isFieldEmpty = isFieldEmpty;
/**
 * Fills an input field with the specified value
 * @param selector - CSS selector for the input element
 * @param value - Value to fill into the input
 * @returns Promise<boolean> - true if successfully filled, false otherwise
 */
const fillInput = async (selector, value) => {
    const input = document.querySelector(selector);
    if (input && (0, core_1.isElementVisible)(input) && (0, exports.isFieldEmpty)(input)) {
        // Don't modify if the field already has a value
        if (input.value.trim()) {
            return true;
        }
        // Preserve the original value
        const originalValue = input.value;
        try {
            input.value = value;
            // Use a more natural event dispatch sequence
            input.dispatchEvent(new Event('focus', { bubbles: true }));
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.dispatchEvent(new Event('blur', { bubbles: true }));
            return true;
        }
        catch (error) {
            // Restore original value if there was an error
            input.value = originalValue;
            return false;
        }
    }
    return false;
};
exports.fillInput = fillInput;
/**
 * Fills a textarea field with the specified value
 * @param selector - CSS selector for the textarea element
 * @param value - Value to fill into the textarea
 * @returns Promise<boolean> - true if successfully filled, false otherwise
 */
const fillTextArea = async (selector, value) => {
    const textarea = document.querySelector(selector);
    if (textarea && (0, core_1.isElementVisible)(textarea) && (0, exports.isFieldEmpty)(textarea)) {
        // Don't modify if the field already has a value
        if (textarea.value.trim()) {
            return true;
        }
        const originalValue = textarea.value;
        try {
            textarea.value = value;
            textarea.dispatchEvent(new Event('focus', { bubbles: true }));
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
            textarea.dispatchEvent(new Event('blur', { bubbles: true }));
            return true;
        }
        catch (error) {
            textarea.value = originalValue;
            return false;
        }
    }
    return false;
};
exports.fillTextArea = fillTextArea;
/**
 * Selects an option in a select dropdown
 * @param selector - CSS selector for the select element
 * @param value - Value to select in the dropdown
 * @returns Promise<boolean> - true if successfully selected, false otherwise
 */
const selectOption = async (selector, value) => {
    const select = document.querySelector(selector);
    if (select && (0, exports.isFieldEmpty)(select)) {
        select.value = value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
    }
    return false;
};
exports.selectOption = selectOption;
/**
 * Uploads a resume file to a file input
 * @param selector - CSS selector for the file input element
 * @param base64Data - Base64 encoded data of the file to upload
 * @returns Promise<boolean> - true if successfully uploaded, false otherwise
 */
const uploadResume = async (selector, base64Data) => {
    const input = document.querySelector(selector);
    // Only upload if there's no file already selected
    if (input && input.type === 'file' && (!input.files || input.files.length === 0)) {
        const blob = await fetch(base64Data).then(res => res.blob());
        const file = new File([blob], 'resume.pdf', { type: 'application/pdf' });
        const container = new DataTransfer();
        container.items.add(file);
        input.files = container.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
    }
    return false;
};
exports.uploadResume = uploadResume;


/***/ }),

/***/ "./src/content/forms/validation.ts":
/*!*****************************************!*\
  !*** ./src/content/forms/validation.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/**
 * Form validation utility functions for the LinkedIn Easy Apply extension
 * These functions handle form validation, error checking, and field completion verification
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.areAllFieldsFilled = exports.hasValidationErrors = void 0;
const core_1 = __webpack_require__(/*! ../utils/core */ "./src/content/utils/core.ts");
const inputs_1 = __webpack_require__(/*! ./inputs */ "./src/content/forms/inputs.ts");
/**
 * Checks if a form element has validation errors
 * @param element - HTML element to check for validation errors
 * @returns true if the element has validation errors, false otherwise
 */
const hasValidationErrors = (element) => {
    // Check for LinkedIn's error classes
    return element.classList.contains('artdeco-text-input--error') ||
        element.getAttribute('aria-invalid') === 'true' ||
        !!element.closest('.artdeco-text-input--error');
};
exports.hasValidationErrors = hasValidationErrors;
/**
 * Checks if all required form fields are filled and have no validation errors
 * @returns Promise<boolean> - true if all fields are valid and filled, false otherwise
 */
const areAllFieldsFilled = async () => {
    // Get all visible input fields, textareas, and selects that are required or have error messages
    const formFields = document.querySelectorAll('input:not([type="hidden"]), textarea, select');
    for (const field of Array.from(formFields)) {
        const element = field;
        // Skip if not visible
        if (!(0, core_1.isElementVisible)(element)) {
            continue;
        }
        // Check if field is required or has error message
        const isRequired = element.hasAttribute('required') ||
            element.getAttribute('aria-required') === 'true' ||
            element.closest('.required') !== null;
        // Check for error messages
        const hasError = element.getAttribute('aria-invalid') === 'true' ||
            element.classList.contains('artdeco-text-input--error');
        if (isRequired || hasError) {
            const isEmpty = (0, inputs_1.isFieldEmpty)(element);
            if (isEmpty) {
                return false;
            }
        }
    }
    // Check for any error messages on the page
    const errorMessages = document.querySelectorAll('.artdeco-inline-feedback--error');
    if (errorMessages.length > 0) {
        return false;
    }
    return true;
};
exports.areAllFieldsFilled = areAllFieldsFilled;


/***/ }),

/***/ "./src/content/initialization/index.ts":
/*!*********************************************!*\
  !*** ./src/content/initialization/index.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/**
 * Initialization module exports
 * Re-exports all initialization-related functions for easy importing
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.initializeState = void 0;
// State initialization utilities
var state_1 = __webpack_require__(/*! ./state */ "./src/content/initialization/state.ts");
Object.defineProperty(exports, "initializeState", ({ enumerable: true, get: function () { return state_1.initializeState; } }));


/***/ }),

/***/ "./src/content/initialization/state.ts":
/*!*********************************************!*\
  !*** ./src/content/initialization/state.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/**
 * Initialization state module for the LinkedIn Easy Apply extension
 * Handles extension initialization including authentication, storage loading, and automation state setup
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.initializeState = void 0;
const supabase_1 = __webpack_require__(/*! ../../lib/supabase */ "./src/lib/supabase.ts");
/**
 * Initializes the content script state including authentication and storage loading
 * Sets up Supabase authentication, loads persisted data, and restores automation state
 * @param deps - Dependencies required for initialization
 * @returns Promise<void>
 */
const initializeState = async (deps) => {
    console.log("Initializing content script state");
    // First, ensure Supabase authentication is properly restored
    const authResult = await (0, supabase_1.ensureAuthenticated)();
    console.log("Authentication initialization result:", authResult);
    // Then initialize the client and try to refresh the session
    await (0, supabase_1.initSupabaseClient)();
    // Check if we can actually get a session
    const session = await (0, supabase_1.getSession)();
    if (session) {
        console.log("✅ Successfully authenticated with Supabase");
        // Check if we have a valid user
        const user = await (0, supabase_1.getCurrentUser)();
        if (user) {
            console.log(`✅ Current user: ${user.email}`);
        }
        else {
            console.warn("⚠️ No user found despite having a session");
        }
    }
    else {
        console.warn("⚠️ No valid session available - database operations may fail");
    }
    chrome.storage.local.get(['isAutomationRunning', 'userData', 'appliedJobIds', 'skipped409Jobs'], (result) => {
        console.log("Loaded data from storage:", result);
        // Load persisted applied job IDs into memory
        if (result.appliedJobIds && Array.isArray(result.appliedJobIds)) {
            result.appliedJobIds.forEach(id => deps.appliedJobIds.add(id));
            console.log(`📋 Loaded ${deps.appliedJobIds.size} previously applied jobs from storage`);
        }
        // Load persisted skipped 409 job IDs into memory
        if (result.skipped409Jobs && Array.isArray(result.skipped409Jobs)) {
            result.skipped409Jobs.forEach(id => deps.skipped409Jobs.add(id));
            console.log(`📋 Loaded ${deps.skipped409Jobs.size} previously skipped 409 jobs from storage`);
        }
        if (result.isAutomationRunning) {
            const userData = result.userData;
            deps.setUserData(userData);
            deps.automationState.userData = userData;
            deps.startAutomation(deps.automationState, deps.setIsRunning, deps.setContinuing);
        }
        else {
            deps.setIsRunning(false);
            deps.setContinuing(false);
        }
    });
};
exports.initializeState = initializeState;


/***/ }),

/***/ "./src/content/jobs/detection.ts":
/*!***************************************!*\
  !*** ./src/content/jobs/detection.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {


/**
 * Job detection utility functions for the LinkedIn Easy Apply extension
 * These functions handle detecting whether jobs are already applied to or are Easy Apply jobs
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isEasyApplyCard = exports.isJobAlreadyApplied = void 0;
/**
 * Checks if a job card indicates the job has already been applied to
 * Uses multiple detection methods to be layout-agnostic
 * @param jobCard - The job card HTML element to check
 * @returns true if the job has already been applied to, false otherwise
 */
const isJobAlreadyApplied = (jobCard) => {
    // Layout-agnostic check for "Applied" text in any span
    const appliedTextSpans = Array.from(jobCard.querySelectorAll('span[dir="ltr"]')).some(span => span.textContent?.trim().toLowerCase().includes('applied'));
    if (appliedTextSpans) {
        return true;
    }
    // Check for LinkedIn's "Applied" status text in any element
    const appliedTexts = Array.from(jobCard.querySelectorAll('*')).some(el => el.textContent?.trim().toLowerCase() === 'applied');
    if (appliedTexts) {
        return true;
    }
    // Check for "Applied" button state
    const appliedButton = jobCard.querySelector('.jobs-apply-button--applied, [aria-label*="Applied"]');
    if (appliedButton) {
        return true;
    }
    // Check for any feedback message containing "Applied"
    const feedbackMessage = jobCard.querySelector('.artdeco-inline-feedback__message');
    if (feedbackMessage?.textContent?.trim().toLowerCase().includes('applied')) {
        return true;
    }
    // Check for any footer item containing "Applied" text
    const footerItems = jobCard.querySelectorAll('[class*="footer-item"]');
    for (const item of footerItems) {
        if (item.textContent?.trim().toLowerCase().includes('applied')) {
            return true;
        }
    }
    return false;
};
exports.isJobAlreadyApplied = isJobAlreadyApplied;
/**
 * Layout-agnostic check for whether a job card is an Easy Apply job.
 * Looks for a span[dir="ltr"] containing "easy apply" (case-insensitive),
 * and optionally checks for a LinkedIn icon SVG.
 * @param card - The job card HTML element to check
 * @returns true if the job card represents an Easy Apply job, false otherwise
 */
const isEasyApplyCard = (card) => {
    // Look for any span[dir="ltr"] with text "easy apply"
    const easyApplyLabel = Array.from(card.querySelectorAll('span[dir="ltr"]')).find(span => span.textContent?.trim().toLowerCase().includes("easy apply"));
    if (!easyApplyLabel)
        return false;
    // Optionally, confirm with LinkedIn icon (not strictly required)
    // const hasLinkedInIcon = !!card.querySelector('svg[data-test-icon*="linkedin"]');
    // return hasLinkedInIcon;
    return true;
};
exports.isEasyApplyCard = isEasyApplyCard;


/***/ }),

/***/ "./src/content/jobs/finding.ts":
/*!*************************************!*\
  !*** ./src/content/jobs/finding.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/**
 * Job finding and interaction utility functions for the LinkedIn Easy Apply extension
 * These functions handle finding job cards, interacting with them, and managing their state
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.clickJob = exports.markJobAsApplied = exports.scrollToJob = exports.findNextJob = void 0;
const types_1 = __webpack_require__(/*! ../../types */ "./src/types.ts");
const utils_1 = __webpack_require__(/*! ../utils */ "./src/content/utils/index.ts");
const detection_1 = __webpack_require__(/*! ./detection */ "./src/content/jobs/detection.ts");
/**
 * Finds the next applicable job card on the current page
 * Looks for visible Easy Apply jobs that haven't been applied to yet
 * @returns HTMLElement of the next job card to apply to, or null if none found
 */
const findNextJob = () => {
    // Get all visible job cards on the current page using expanded selector list
    const jobCards = Array.from(document.querySelectorAll(types_1.SELECTORS.JOB_CARD));
    if (jobCards.length === 0) {
        console.warn("⚠️ No job cards found with current selectors. LinkedIn layout might be different.");
        // Try logging some visible list items to help debug
        const allListItems = Array.from(document.querySelectorAll('li'));
        const visibleListItems = allListItems.filter(li => (0, utils_1.isElementVisible)(li));
        console.log(`📊 Found ${visibleListItems.length} visible list items on page`);
        return null;
    }
    // Look for the next non-applied Easy Apply job
    for (const jobCard of jobCards) {
        const card = jobCard;
        // Skip if not visible
        if (!(0, utils_1.isElementVisible)(card)) {
            continue;
        }
        // Skip if already applied
        if (card.getAttribute('data-applied') === 'true' || (0, detection_1.isJobAlreadyApplied)(card)) {
            continue;
        }
        // Only proceed if this is an Easy Apply card
        if (!(0, detection_1.isEasyApplyCard)(card)) {
            continue;
        }
        // Found a job to apply to
        return card;
    }
    // No jobs found to apply to
    console.log("⚠️ No applicable job cards found - may need to scroll or load more");
    return null;
};
exports.findNextJob = findNextJob;
/**
 * Scrolls a job element into view smoothly
 * @param jobElement - The job card element to scroll to
 */
const scrollToJob = (jobElement) => {
    jobElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
};
exports.scrollToJob = scrollToJob;
/**
 * Marks a job element as applied by setting data attribute
 * @param jobElement - The job card element to mark as applied
 */
const markJobAsApplied = (jobElement) => {
    jobElement.setAttribute('data-applied', 'true');
};
exports.markJobAsApplied = markJobAsApplied;
/**
 * Attempts to click on a job card to open the job details
 * Uses multiple fallback strategies to find clickable elements
 * @param jobElement - The job card element to click
 * @returns true if click was attempted, false if no clickable element found
 */
const clickJob = (jobElement) => {
    // Try finding any clickable anchor in the job card using more comprehensive selectors
    const clickable = jobElement.querySelector('a.job-card-container__link, a[class*="job-card"], a[data-control-name="job_card_title"], a[href*="/jobs/view/"], a');
    if (clickable && (0, utils_1.isElementVisible)(clickable)) {
        clickable.scrollIntoView({ behavior: 'smooth', block: 'center' });
        clickable.click();
        return true;
    }
    // Fallback to any button if no anchor found
    const clickableButton = jobElement.querySelector('button[data-job-id]');
    if (clickableButton && (0, utils_1.isElementVisible)(clickableButton)) {
        clickableButton.click();
        return true;
    }
    // Last resort - try clicking the job card itself
    console.warn("⚠️ No clickable anchor or button found inside job card. Trying to click the card itself.");
    jobElement.click();
    return true; // Return true to avoid getting stuck, log will show if we had to resort to clicking the card
};
exports.clickJob = clickJob;


/***/ }),

/***/ "./src/content/jobs/index.ts":
/*!***********************************!*\
  !*** ./src/content/jobs/index.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/**
 * Jobs module exports
 * Re-exports all job-related functions for easy importing
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.clickJob = exports.markJobAsApplied = exports.scrollToJob = exports.findNextJob = exports.isEasyApplyCard = exports.isJobAlreadyApplied = void 0;
// Job detection utilities
var detection_1 = __webpack_require__(/*! ./detection */ "./src/content/jobs/detection.ts");
Object.defineProperty(exports, "isJobAlreadyApplied", ({ enumerable: true, get: function () { return detection_1.isJobAlreadyApplied; } }));
Object.defineProperty(exports, "isEasyApplyCard", ({ enumerable: true, get: function () { return detection_1.isEasyApplyCard; } }));
// Job finding and interaction utilities
var finding_1 = __webpack_require__(/*! ./finding */ "./src/content/jobs/finding.ts");
Object.defineProperty(exports, "findNextJob", ({ enumerable: true, get: function () { return finding_1.findNextJob; } }));
Object.defineProperty(exports, "scrollToJob", ({ enumerable: true, get: function () { return finding_1.scrollToJob; } }));
Object.defineProperty(exports, "markJobAsApplied", ({ enumerable: true, get: function () { return finding_1.markJobAsApplied; } }));
Object.defineProperty(exports, "clickJob", ({ enumerable: true, get: function () { return finding_1.clickJob; } }));


/***/ }),

/***/ "./src/content/navigation/index.ts":
/*!*****************************************!*\
  !*** ./src/content/navigation/index.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/**
 * Navigation module exports
 * Re-exports all navigation-related functions for easy importing
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.findScrollableJobListContainer = exports.clickNextPageNumber = void 0;
// Navigation and pagination utilities
var pagination_1 = __webpack_require__(/*! ./pagination */ "./src/content/navigation/pagination.ts");
Object.defineProperty(exports, "clickNextPageNumber", ({ enumerable: true, get: function () { return pagination_1.clickNextPageNumber; } }));
Object.defineProperty(exports, "findScrollableJobListContainer", ({ enumerable: true, get: function () { return pagination_1.findScrollableJobListContainer; } }));


/***/ }),

/***/ "./src/content/navigation/pagination.ts":
/*!**********************************************!*\
  !*** ./src/content/navigation/pagination.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/**
 * Navigation and pagination utility functions for the LinkedIn Easy Apply extension
 * These functions handle page navigation, pagination, and scrollable container detection
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.findScrollableJobListContainer = exports.clickNextPageNumber = void 0;
const types_1 = __webpack_require__(/*! ../../types */ "./src/types.ts");
const utils_1 = __webpack_require__(/*! ../utils */ "./src/content/utils/index.ts");
/**
 * Attempts to click on the next page number button in LinkedIn's pagination
 * Uses multiple detection methods to find and click the next page
 * @returns Promise<boolean> true if next page button was clicked, false otherwise
 */
const clickNextPageNumber = async () => {
    try {
        // Look for pagination container from screenshot
        const paginationContainer = document.querySelector('.jobs-search-pagination');
        if (!paginationContainer) {
            console.log("Could not find pagination container");
        }
        else {
            console.log("Found pagination container");
        }
        // Method 1: Try to find the current active page
        const activePageButton = document.querySelector('button[aria-current="page"]');
        if (activePageButton) {
            // Get the current page number
            const currentPageSpan = activePageButton.querySelector('span');
            if (currentPageSpan) {
                // Parse the current page number and calculate the next page number
                const currentPage = parseInt(currentPageSpan.textContent || "1", 10);
                const nextPage = currentPage + 1;
                console.log(`Current page: ${currentPage}, looking for page ${nextPage} button`);
                // Find all page buttons
                const pageButtons = document.querySelectorAll('button[aria-label^="Page"]');
                // Look for the button with the next page number
                for (const button of pageButtons) {
                    const span = button.querySelector('span');
                    if (span && span.textContent?.trim() === String(nextPage)) {
                        console.log(`Found page ${nextPage} button, clicking...`);
                        button.click();
                        return true;
                    }
                }
                // Alternative approach: look for specific button with aria-label="Page X"
                const nextPageButton = document.querySelector(`button[aria-label="Page ${nextPage}"]`);
                if (nextPageButton && (0, utils_1.isElementVisible)(nextPageButton)) {
                    console.log(`Found page ${nextPage} button by aria-label, clicking...`);
                    nextPageButton.click();
                    return true;
                }
            }
        }
        // Method 2: Direct approach - try to find any numbered page buttons
        const pageNumbers = document.querySelectorAll('.jobs-search-pagination__indicator-button, li.jobs-search-pagination__indicator button');
        const pageNumbersArray = Array.from(pageNumbers);
        console.log(`Found ${pageNumbersArray.length} page number buttons`);
        // Find active page
        let activePageIndex = -1;
        let nextPageElement = null;
        // Try to find the active page by checking aria-current or CSS classes
        for (let i = 0; i < pageNumbersArray.length; i++) {
            const button = pageNumbersArray[i];
            // Check if this is the active page 
            if (button.getAttribute('aria-current') === 'page' ||
                button.classList.contains('active') ||
                button.classList.contains('jobs-search-pagination__indicator-button--active') ||
                button.classList.contains('jobs-search-pagination__indicator-button--selected')) {
                activePageIndex = i;
                break;
            }
            // Also check parent li if button is inside a list item
            const parentLi = button.closest('li');
            if (parentLi && (parentLi.classList.contains('active') ||
                parentLi.classList.contains('jobs-search-pagination__indicator--active') ||
                parentLi.classList.contains('selected'))) {
                activePageIndex = i;
                break;
            }
        }
        // If we found the active page, click the next one
        if (activePageIndex !== -1 && activePageIndex < pageNumbersArray.length - 1) {
            nextPageElement = pageNumbersArray[activePageIndex + 1];
            console.log(`Found next page element at index ${activePageIndex + 1}`);
            nextPageElement.click();
            return true;
        }
        // Method 3: From screenshot - try to find numbered pagination buttons (1, 2, 3, ...)
        // Look through all buttons with spans containing just numbers
        const allButtons = document.querySelectorAll('button');
        for (const button of allButtons) {
            const span = button.querySelector('span');
            if (span && /^\d+$/.test(span.textContent?.trim() || '')) {
                const pageNum = parseInt(span.textContent?.trim() || '0', 10);
                console.log(`Found numeric page button: ${pageNum}`);
                // Check if this might be the next page
                const isCurrentPage = button.getAttribute('aria-current') === 'page' ||
                    button.classList.contains('jobs-search-pagination__indicator-button--active');
                if (!isCurrentPage && pageNum > 1) {
                    console.log(`Clicking numeric page button: ${pageNum}`);
                    button.click();
                    return true;
                }
            }
        }
        // Method 4: Last resort - find any "Next" or pagination arrow button
        const nextButtons = [
            document.querySelector('button[aria-label="Next"]'),
            document.querySelector('button.artdeco-pagination__button--next'),
            document.querySelector('.jobs-search-pagination__button--next'),
            document.querySelector('button[aria-label="Next page"]'),
            // Try to find by child SVG 
            document.querySelector('button svg[data-test-icon="chevron-right-small"]')?.closest('button'),
            // Try to find by class or ID containing "next"
            document.querySelector('button[id*="next" i]'),
            document.querySelector('button[class*="next" i]'),
            // From your screenshot - the ember button
            document.querySelector('button#ember289, button[id^="ember"][id$="next"]')
        ];
        for (const button of nextButtons) {
            if (button && (0, utils_1.isElementVisible)(button)) {
                console.log("Found next button by alternative selector, clicking...");
                button.click();
                return true;
            }
        }
        console.log("Could not find any page navigation buttons");
        return false;
    }
    catch (error) {
        console.error("Error in clickNextPageNumber:", error);
        return false;
    }
};
exports.clickNextPageNumber = clickNextPageNumber;
/**
 * Dynamically detects the scrollable job list container based on structure and behavior
 * instead of relying on hardcoded class names.
 * @returns The scrollable container div element or null if not found
 */
const findScrollableJobListContainer = () => {
    // First try to find job list using known selector
    const jobListContainer = document.querySelector(types_1.SELECTORS.JOBS_LIST);
    if (jobListContainer &&
        (window.getComputedStyle(jobListContainer).overflowY === 'auto' ||
            window.getComputedStyle(jobListContainer).overflowY === 'scroll')) {
        return jobListContainer;
    }
    // If not found with known selector, try dynamic detection
    const allDivs = Array.from(document.querySelectorAll('div'));
    let bestMatch = null;
    let maxJobItems = 0;
    for (const div of allDivs) {
        const style = window.getComputedStyle(div);
        // Must be scrollable vertically
        const isScrollableY = (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
            div.scrollHeight > div.clientHeight;
        if (!isScrollableY)
            continue;
        // Try different job card selectors to find container with most cards
        // Use the expanded selectors similar to JOB_CARD in SELECTORS
        const jobSelectors = [
            'li.scaffold-layout__list-item',
            'li.jobs-search-results__list-item',
            'li.job-card-container',
            'li.job-card-job-posting-card-wrapper',
            'li[class*="job-card"]',
            'li[class*="job-posting"]'
        ];
        let totalJobItems = 0;
        for (const selector of jobSelectors) {
            const items = div.querySelectorAll(selector);
            totalJobItems += items.length;
        }
        // If this container has more job items than our previous best match, update
        if (isScrollableY && totalJobItems > maxJobItems) {
            maxJobItems = totalJobItems;
            bestMatch = div;
        }
    }
    if (bestMatch && maxJobItems >= 3) {
        localStorage.setItem("lastSuccessfulScrollClass", bestMatch.className); // optional debug
        return bestMatch;
    }
    // Last resort - try to find any scrollable container with <li> elements
    for (const div of allDivs) {
        const style = window.getComputedStyle(div);
        const isScrollableY = (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
            div.scrollHeight > div.clientHeight;
        const listItems = div.querySelectorAll('li');
        if (isScrollableY && listItems.length >= 5) {
            return div;
        }
    }
    console.warn("❌ Could not detect scrollable job list container");
    return null;
};
exports.findScrollableJobListContainer = findScrollableJobListContainer;


/***/ }),

/***/ "./src/content/tracking/application.ts":
/*!*********************************************!*\
  !*** ./src/content/tracking/application.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/**
 * Job application tracking utility functions for the LinkedIn Easy Apply extension
 * These functions handle tracking successful job applications, extracting job data, and managing persistence
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.trackSuccessfulApplication = void 0;
const supabase_1 = __webpack_require__(/*! ../../lib/supabase */ "./src/lib/supabase.ts");
// Import global state from content.ts
// Note: This is a temporary solution - ideally this should be managed by a state manager
/**
 * Tracks a successful job application with comprehensive data extraction and storage
 * Extracts job details from LinkedIn's DOM and stores in database and local storage
 * @param jobTitle - The title of the job being applied to
 * @param companyName - The name of the company
 * @param jobElement - The job card HTML element for ID extraction
 * @param appliedJobIds - Set of job IDs that have already been processed
 * @returns Promise<boolean> true if tracking was successful or handled, false only on critical errors
 */
const trackSuccessfulApplication = async (jobTitle, companyName, jobElement, appliedJobIds) => {
    try {
        // Improved job ID extraction with multiple methods and consistency checks
        let jobId = null;
        // Method 1: Get from job element's data attribute
        jobId = jobElement.closest('[data-job-id]')?.getAttribute('data-job-id');
        // Method 2: Get from URL (most reliable for LinkedIn)
        if (!jobId) {
            const urlMatch = window.location.href.match(/currentJobId=(\d+)/);
            if (urlMatch && urlMatch[1]) {
                jobId = urlMatch[1];
            }
        }
        // Method 3: Alternative URL pattern
        if (!jobId) {
            const urlMatch = window.location.href.match(/\/view\/(\d+)\//);
            if (urlMatch && urlMatch[1]) {
                jobId = urlMatch[1];
            }
        }
        // Method 4: Get from job details section
        if (!jobId) {
            const jobDetailsElement = document.querySelector('.jobs-unified-top-card, .job-details-jobs-unified-top-card');
            if (jobDetailsElement) {
                // Try to find any element with data-job-id
                const jobIdElement = jobDetailsElement.querySelector('[data-job-id]');
                if (jobIdElement) {
                    jobId = jobIdElement.getAttribute('data-job-id');
                }
            }
        }
        // Method 5: Extract from Apply button
        if (!jobId) {
            const applyButton = document.querySelector('.jobs-apply-button, .jobs-s-apply button');
            if (applyButton) {
                const applyId = applyButton.getAttribute('data-job-id');
                if (applyId) {
                    jobId = applyId;
                }
            }
        }
        // Create a deterministic ID that will be the same for the same job
        if (!jobId) {
            // Use a hash-like approach for consistency
            const baseString = `${jobTitle.trim()}-${companyName.trim()}`;
            const hash = baseString.split('').reduce((a, b) => {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return a & a; // Convert to 32-bit integer
            }, 0);
            jobId = `synthetic-${Math.abs(hash)}`;
            console.log('🔧 Created deterministic synthetic job ID:', jobId);
        }
        if (!jobId) {
            console.log('❌ Could not extract job ID for tracking');
            return false;
        }
        // Check if this job has already been processed in this session
        if (appliedJobIds.has(jobId)) {
            console.log(`⏭️ Job ${jobId} already processed in this session. Skipping database tracking.`);
            return true;
        }
        // Mark job as processed immediately to prevent duplicate processing
        appliedJobIds.add(jobId);
        console.log(`🔄 Marked job ${jobId} as processed to prevent duplicates`);
        // Mark job as applied in the DOM immediately
        jobElement.setAttribute('data-applied', 'true');
        // Also mark any other instances of this job as applied right away
        document.querySelectorAll(`[data-job-id="${jobId}"]`).forEach(card => {
            card.setAttribute('data-applied', 'true');
        });
        console.log(`📝 Tracking application for "${jobTitle}" at "${companyName}" (ID: ${jobId})`);
        // Add the job ID to Chrome storage for persistence
        chrome.storage.local.get(['appliedJobIds'], result => {
            const storedIds = result.appliedJobIds || [];
            storedIds.push(jobId);
            chrome.storage.local.set({ appliedJobIds: [...new Set(storedIds)] });
        });
        // Get additional job details
        const locationElement = document.querySelector('.job-details-jobs-unified-top-card__bullet');
        const workTypeElement = document.querySelector('.job-details-jobs-unified-top-card__workplace-type');
        const salaryElement = document.querySelector('.job-details-jobs-unified-top-card__salary-range');
        const descriptionElement = document.querySelector('.jobs-description');
        const companyUrlElement = document.querySelector('.job-details-jobs-unified-top-card__company-name a');
        // Get location data safely
        let location = locationElement?.textContent?.trim() || '';
        // Get work type data safely
        let workType = 'onsite'; // default
        if (workTypeElement) {
            const workTypeText = workTypeElement.textContent?.trim()?.toLowerCase() || '';
            if (workTypeText.includes('remote')) {
                workType = 'remote';
            }
            else if (workTypeText.includes('hybrid')) {
                workType = 'hybrid';
            }
        }
        // Get salary data safely
        let salaryMin = null;
        let salaryMax = null;
        if (salaryElement) {
            const salaryText = salaryElement.textContent?.trim() || '';
            const numbers = salaryText.match(/\d+/g);
            if (numbers && numbers.length >= 1) {
                salaryMin = parseInt(numbers[0]) || null;
                if (numbers.length > 1) {
                    salaryMax = parseInt(numbers[1]) || null;
                }
            }
        }
        // Job application data to save
        const jobData = {
            linkedin_job_id: jobId,
            location: location,
            work_type: workType,
            salary_min: salaryMin,
            salary_max: salaryMax,
            salary_currency: 'USD',
            job_description: descriptionElement?.textContent?.trim() || '',
            company_url: companyUrlElement?.getAttribute('href') || undefined
        };
        // Enhanced debugging for database tracking
        console.log('🔍 [DEBUG] About to track application to database with data:', {
            jobTitle,
            companyName,
            jobId,
            location: jobData.location,
            workType: jobData.work_type,
            hasDescription: !!jobData.job_description
        });
        // Try to save the application to the database
        let result = await (0, supabase_1.trackJobApplication)(jobTitle, companyName, jobData);
        console.log('🔍 [DEBUG] First tracking attempt result:', result);
        // If tracking failed, try to re-authenticate and try again
        if (!result) {
            console.log('⚠️ Initial tracking failed, attempting to re-authenticate...');
            // Try to ensure we're authenticated
            const authResult = await (0, supabase_1.ensureAuthenticated)();
            console.log('🔍 [DEBUG] Re-authentication result:', authResult);
            if (authResult) {
                console.log('🔄 Retrying database tracking after re-authentication...');
                // Try to save again after re-authenticating
                result = await (0, supabase_1.trackJobApplication)(jobTitle, companyName, jobData);
                console.log('🔍 [DEBUG] Second tracking attempt result:', result);
            }
            else {
                console.error('❌ Re-authentication failed completely');
            }
        }
        if (result) {
            console.log(`✅ Successfully tracked application for "${jobTitle}" at "${companyName}" (ID: ${jobId})`);
            return true;
        }
        else {
            console.error(`❌ FAILED to track application in database for "${jobTitle}" at "${companyName}" (ID: ${jobId})`);
            console.log('⚠️ Continuing automation despite database tracking failure');
            return true;
        }
    }
    catch (error) {
        console.error(`❌ Error tracking application:`, error);
        // Still return true to continue the application process
        return true;
    }
};
exports.trackSuccessfulApplication = trackSuccessfulApplication;


/***/ }),

/***/ "./src/content/tracking/index.ts":
/*!***************************************!*\
  !*** ./src/content/tracking/index.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/**
 * Tracking module exports
 * Re-exports all tracking-related functions for easy importing
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.trackSuccessfulApplication = void 0;
// Job application tracking utilities
var application_1 = __webpack_require__(/*! ./application */ "./src/content/tracking/application.ts");
Object.defineProperty(exports, "trackSuccessfulApplication", ({ enumerable: true, get: function () { return application_1.trackSuccessfulApplication; } }));


/***/ }),

/***/ "./src/content/utils/core.ts":
/*!***********************************!*\
  !*** ./src/content/utils/core.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {


/**
 * Core utility functions for the LinkedIn Easy Apply extension
 * These are the most basic, reusable functions with no dependencies
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isElementVisible = exports.sleep = void 0;
/**
 * Pauses execution for the specified number of milliseconds
 * @param ms - Number of milliseconds to sleep
 * @returns Promise that resolves after the specified delay
 */
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
exports.sleep = sleep;
/**
 * Checks if an HTML element is visible on the page
 * @param element - The HTML element to check
 * @returns true if the element is visible, false otherwise
 */
const isElementVisible = (element) => {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        style.opacity !== '0' &&
        element.offsetWidth > 0 &&
        element.offsetHeight > 0;
};
exports.isElementVisible = isElementVisible;


/***/ }),

/***/ "./src/content/utils/dom.ts":
/*!**********************************!*\
  !*** ./src/content/utils/dom.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/**
 * DOM utility functions for the LinkedIn Easy Apply extension
 * These functions handle DOM element interaction, clicking, and finding elements
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.clickAnyElement = exports.findButtonByText = exports.findVisibleElement = exports.clickElement = void 0;
const core_1 = __webpack_require__(/*! ./core */ "./src/content/utils/core.ts");
/**
 * Clicks an element if it exists and is visible
 * @param selector - CSS selector for the element to click
 * @returns Promise<boolean> - true if element was clicked, false otherwise
 */
const clickElement = async (selector) => {
    const element = document.querySelector(selector);
    if (element && (0, core_1.isElementVisible)(element)) {
        element.click();
        return true;
    }
    return false;
};
exports.clickElement = clickElement;
/**
 * Finds a visible element by selector
 * @param selector - CSS selector for the element to find
 * @returns HTMLElement if found and visible, null otherwise
 */
const findVisibleElement = (selector) => {
    const element = document.querySelector(selector);
    if (element && (0, core_1.isElementVisible)(element)) {
        return element;
    }
    return null;
};
exports.findVisibleElement = findVisibleElement;
/**
 * Finds a button by its text content or aria-label
 * @param text - Text to search for in button content or aria-label
 * @returns HTMLElement if found, null otherwise
 */
const findButtonByText = (text) => {
    // First try finding by aria-label
    const buttonByAriaLabel = document.querySelector(`button[aria-label*="${text}" i]`);
    if (buttonByAriaLabel && (0, core_1.isElementVisible)(buttonByAriaLabel)) {
        return buttonByAriaLabel;
    }
    // Then try finding by button text content
    const buttons = Array.from(document.getElementsByTagName('button'));
    const buttonByText = buttons.find(button => {
        if (!(0, core_1.isElementVisible)(button))
            return false;
        // Check button's direct text content
        if (button.textContent?.trim().toLowerCase().includes(text.toLowerCase())) {
            return true;
        }
        // Check text content in span inside button
        const span = button.querySelector('.artdeco-button__text');
        return span?.textContent?.trim().toLowerCase().includes(text.toLowerCase());
    });
    return buttonByText || null;
};
exports.findButtonByText = findButtonByText;
/**
 * Attempts to click any element from a list of selectors or by button text
 * @param selectors - Array of CSS selectors to try clicking
 * @returns Promise<boolean> - true if any element was clicked, false otherwise
 */
const clickAnyElement = async (selectors) => {
    // First try the exact selectors
    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element && (0, core_1.isElementVisible)(element)) {
            element.click();
            return true;
        }
    }
    // Then try finding buttons by text content
    const buttonTexts = ['Next', 'Continue', 'Review'];
    for (const text of buttonTexts) {
        const button = (0, exports.findButtonByText)(text);
        if (button) {
            button.click();
            return true;
        }
    }
    // Need to provide full class name, there might be some other class name with same variable name,
    // Try finding primary buttons that might be next/review buttons
    const primaryButtons = document.querySelectorAll('.artdeco-button--primary');
    for (const button of primaryButtons) {
        if ((0, core_1.isElementVisible)(button)) {
            const text = button.textContent?.trim().toLowerCase() || '';
            if (text.includes('next') || text.includes('continue') || text.includes('review')) {
                button.click();
                return true;
            }
        }
    }
    return false;
};
exports.clickAnyElement = clickAnyElement;


/***/ }),

/***/ "./src/content/utils/index.ts":
/*!************************************!*\
  !*** ./src/content/utils/index.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/**
 * Utils module exports
 * Re-exports all utility functions for easy importing
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.clickAnyElement = exports.findButtonByText = exports.findVisibleElement = exports.clickElement = exports.isElementVisible = exports.sleep = void 0;
// Core utilities
var core_1 = __webpack_require__(/*! ./core */ "./src/content/utils/core.ts");
Object.defineProperty(exports, "sleep", ({ enumerable: true, get: function () { return core_1.sleep; } }));
Object.defineProperty(exports, "isElementVisible", ({ enumerable: true, get: function () { return core_1.isElementVisible; } }));
// DOM utilities
var dom_1 = __webpack_require__(/*! ./dom */ "./src/content/utils/dom.ts");
Object.defineProperty(exports, "clickElement", ({ enumerable: true, get: function () { return dom_1.clickElement; } }));
Object.defineProperty(exports, "findVisibleElement", ({ enumerable: true, get: function () { return dom_1.findVisibleElement; } }));
Object.defineProperty(exports, "findButtonByText", ({ enumerable: true, get: function () { return dom_1.findButtonByText; } }));
Object.defineProperty(exports, "clickAnyElement", ({ enumerable: true, get: function () { return dom_1.clickAnyElement; } }));


/***/ }),

/***/ "./src/lib/supabase.ts":
/*!*****************************!*\
  !*** ./src/lib/supabase.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.transformCompleteProfileToUserProfile = exports.getCompleteProfile = exports.getUserProfile = exports.initSupabaseClient = exports.refreshSession = exports.trackJobApplication = exports.getCurrentUser = exports.getSession = exports.ensureAuthenticated = exports.signOut = exports.signIn = exports.supabase = void 0;
const supabase_js_1 = __webpack_require__(/*! @supabase/supabase-js */ "./node_modules/@supabase/supabase-js/dist/module/index.js");
const supabaseUrl = 'https://tedelpcjgknjnlhezsdo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZGVscGNqZ2tuam5saGV6c2RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5MTU4ODUsImV4cCI6MjA1NjQ5MTg4NX0.TUfoy4jG2t9YzniUbd-GnHGHYW6k4NY4yeUiBzyCYqw';
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
// Auth helper functions
const signIn = async (email, password) => {
    const { data, error } = await exports.supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) {
        throw error;
    }
    // Store the session in chrome.storage.local
    if (data.session) {
        // Set session expiration to one year from now
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        const extendedSession = {
            ...data.session,
            expires_at: oneYearFromNow.getTime()
        };
        await chrome.storage.local.set({
            'supabase_session': extendedSession
        });
        // Notify all tabs about the authentication state change
        const tabs = await chrome.tabs.query({});
        for (const tab of tabs) {
            if (tab.id) {
                try {
                    await chrome.tabs.sendMessage(tab.id, { type: 'AUTH_STATE_CHANGED' });
                }
                catch (err) {
                    // Ignore errors for tabs that can't receive messages
                }
            }
        }
    }
    return data;
};
exports.signIn = signIn;
const signOut = async () => {
    const { error } = await exports.supabase.auth.signOut();
    if (error) {
        throw error;
    }
    await chrome.storage.local.remove('supabase_session');
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
        if (tab.id) {
            try {
                await chrome.tabs.sendMessage(tab.id, { type: 'AUTH_STATE_CHANGED' });
            }
            catch (err) {
                // Ignore errors for tabs that can't receive messages
            }
        }
    }
};
exports.signOut = signOut;
// Add this function to ensure session is properly restored
const ensureAuthenticated = async () => {
    try {
        const { supabase_session } = await chrome.storage.local.get('supabase_session');
        if (!supabase_session) {
            return false;
        }
        // Simply set the session without checking expiration
        await exports.supabase.auth.setSession({
            access_token: supabase_session.access_token,
            refresh_token: supabase_session.refresh_token
        });
        const { data: { session } } = await exports.supabase.auth.getSession();
        return !!session;
    }
    catch (error) {
        return false;
    }
};
exports.ensureAuthenticated = ensureAuthenticated;
const getSession = async () => {
    try {
        // Assume authentication is valid without continuously checking
        const { data: { session } } = await exports.supabase.auth.getSession();
        return session;
    }
    catch (error) {
        return null;
    }
};
exports.getSession = getSession;
const getCurrentUser = async () => {
    try {
        // Get user directly without checking authentication first
        const { data: { user } } = await exports.supabase.auth.getUser();
        return user;
    }
    catch (error) {
        return null;
    }
};
exports.getCurrentUser = getCurrentUser;
// Update the trackJobApplication function
const trackJobApplication = async (position, company, additionalData) => {
    try {
        console.log('🔍 [DEBUG] trackJobApplication called with:', { position, company, linkedin_job_id: additionalData?.linkedin_job_id });
        const session = await (0, exports.getSession)();
        console.log('🔍 [DEBUG] Session check result:', !!session);
        if (!session) {
            console.log('❌ No session found, cannot track job application. Attempting to re-authenticate...');
            const authResult = await (0, exports.ensureAuthenticated)();
            console.log('🔍 [DEBUG] ensureAuthenticated result:', authResult);
            if (!authResult) {
                console.log('❌ Re-authentication failed');
                return false;
            }
            // Get the session again after re-authentication
            const newSession = await (0, exports.getSession)();
            console.log('🔍 [DEBUG] New session after re-auth:', !!newSession);
            if (!newSession) {
                console.log('❌ Still no session after re-authentication');
                return false;
            }
            console.log('✅ Re-authentication successful');
        }
        const user = await (0, exports.getCurrentUser)();
        console.log('🔍 [DEBUG] getCurrentUser result:', !!user, user?.id);
        if (!user) {
            console.log('❌ No user found, cannot track job application');
            return false;
        }
        console.log('✅ User authenticated: ', user.id);
        // Sanitize inputs to prevent issues
        const sanitizedPosition = position?.substring(0, 255) || 'Unknown Position';
        const sanitizedCompany = company?.substring(0, 255) || 'Unknown Company';
        const sanitizedLocation = additionalData?.location?.substring(0, 255) || null;
        // Trim job description length to avoid huge texts
        const sanitizedDescription = additionalData?.job_description?.substring(0, 2000) || null;
        // Generate a unique ID for this application if LinkedIn ID is not available
        const uniqueId = additionalData?.linkedin_job_id ||
            `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
        // Build complete application data matching the database schema
        const applicationData = {
            user_id: user.id,
            position: sanitizedPosition,
            company: sanitizedCompany,
            location: sanitizedLocation,
            work_type: additionalData?.work_type || 'onsite',
            salary_min: additionalData?.salary_min || null,
            salary_max: additionalData?.salary_max || null,
            salary_currency: additionalData?.salary_currency || 'USD',
            apply_time: Math.floor(Date.now() / 1000),
            source: 'linkedin',
            status: 'applied',
            company_url: additionalData?.company_url || null,
            job_description: sanitizedDescription,
            notes: additionalData?.notes || null,
            linkedin_job_id: uniqueId,
            application_type: 'easy_apply'
        };
        console.log('🔄 [DB] Inserting application data:', {
            position: sanitizedPosition,
            company: sanitizedCompany,
            linkedin_job_id: uniqueId,
            user_id: user.id
        });
        // First check if this job already exists in the database
        console.log('🔍 [DEBUG] Checking for existing application...');
        const { data: existingData, error: checkError } = await exports.supabase
            .from('applications')
            .select('id')
            .eq('user_id', user.id)
            .eq('linkedin_job_id', uniqueId)
            .limit(1);
        console.log('🔍 [DEBUG] Existing check result:', {
            hasError: !!checkError,
            errorMessage: checkError?.message,
            existingCount: existingData?.length || 0
        });
        if (checkError) {
            console.log(`⚠️ Error checking for existing application: ${checkError.message}`);
            console.log('🔍 [DEBUG] Full check error:', checkError);
        }
        else if (existingData && existingData.length > 0) {
            console.log('✅ Job already exists in database, no need to insert again');
            return true;
        }
        // Use upsert directly to handle duplicates gracefully
        console.log('🔍 [DEBUG] Attempting database upsert...');
        const { error: upsertError } = await exports.supabase
            .from('applications')
            .upsert([applicationData], {
            onConflict: 'user_id,linkedin_job_id',
            ignoreDuplicates: false
        });
        console.log('🔍 [DEBUG] Upsert result:', {
            hasError: !!upsertError,
            errorCode: upsertError?.code,
            errorMessage: upsertError?.message
        });
        if (upsertError) {
            console.error('❌ Failed to track job application:', upsertError.message, upsertError);
            console.log('🔍 [DEBUG] Full upsert error:', upsertError);
            return false;
        }
        console.log(`✅ Application upserted: ${sanitizedPosition} at ${sanitizedCompany}`);
        return true;
    }
    catch (error) {
        console.error('❌ Exception tracking job application:', error);
        return false;
    }
};
exports.trackJobApplication = trackJobApplication;
// Add a new function to refresh the session
const refreshSession = async () => {
    try {
        const { data: { session }, error } = await exports.supabase.auth.refreshSession();
        if (error || !session) {
            return false;
        }
        // Extend session expiration to one year from now
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        const extendedSession = {
            ...session,
            expires_at: oneYearFromNow.getTime()
        };
        await chrome.storage.local.set({
            'supabase_session': extendedSession
        });
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.refreshSession = refreshSession;
// Update initSupabaseClient to handle session refresh
const initSupabaseClient = async () => {
    try {
        // Just return true without checking auth status - assume it's valid
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.initSupabaseClient = initSupabaseClient;
const getUserProfile = async () => {
    try {
        const user = await (0, exports.getCurrentUser)();
        if (!user) {
            return null;
        }
        const { data, error } = await exports.supabase
            .from('profiles')
            .select(`
        id,
        full_name,
        title,
        location,
        phone,
        bio,
        education,
        experience,
        projects,
        skills,
        languages,
        socials,
        resume_url,
        avatar_url,
        daily_goal
      `)
            .eq('id', user.id)
            .single();
        if (error) {
            return null;
        }
        if (!data) {
            const { data: newProfile, error: insertError } = await exports.supabase
                .from('profiles')
                .insert([
                {
                    id: user.id,
                    full_name: '',
                    title: '',
                    education: [],
                    experience: [],
                    projects: [],
                    skills: [],
                    languages: [],
                    socials: {},
                    daily_goal: 10
                }
            ])
                .select()
                .single();
            if (insertError) {
                return null;
            }
            return newProfile;
        }
        return data;
    }
    catch (error) {
        return null;
    }
};
exports.getUserProfile = getUserProfile;
/**
 * Get complete profile data using the database RPC function
 * Returns profile with all normalized tables (work_experiences, education, skills, etc.)
 */
const getCompleteProfile = async () => {
    try {
        console.log('🔍 [DEBUG] getCompleteProfile called');
        const user = await (0, exports.getCurrentUser)();
        if (!user) {
            console.log('❌ No user found, cannot get complete profile');
            return null;
        }
        console.log('✅ User authenticated:', user.id);
        // Call the database RPC function
        const { data, error } = await exports.supabase
            .rpc('get_complete_profile', { user_id: user.id });
        if (error) {
            console.error('❌ Error calling get_complete_profile RPC:', error.message);
            console.log('🔍 [DEBUG] Full RPC error:', error);
            return null;
        }
        if (!data) {
            console.log('⚠️ No profile data returned from RPC');
            return null;
        }
        console.log('✅ Complete profile data retrieved successfully');
        console.log('🔍 [DEBUG] Profile data structure:', {
            hasProfile: !!data.profile,
            workExperiencesCount: data.work_experiences?.length || 0,
            educationCount: data.education?.length || 0,
            skillsCount: data.skills?.length || 0,
            languagesCount: data.languages?.length || 0,
            certificationsCount: data.certifications?.length || 0,
            portfolioLinksCount: data.portfolio_links?.length || 0
        });
        return data;
    }
    catch (error) {
        console.error('❌ Exception getting complete profile:', error);
        return null;
    }
};
exports.getCompleteProfile = getCompleteProfile;
/**
 * Transform CompleteProfile data into UserProfile format for autofill engine
 */
const transformCompleteProfileToUserProfile = (completeProfile) => {
    const profile = completeProfile.profile;
    // Transform work experiences to old format
    const experience = completeProfile.work_experiences?.map(work => ({
        id: work.id,
        title: work.position_title,
        company: work.company_name,
        location: work.location || '',
        date: work.is_current
            ? `${work.start_month} ${work.start_year} - Present`
            : `${work.start_month} ${work.start_year} - ${work.end_month} ${work.end_year}`,
        description: work.description || ''
    })) || [];
    // Transform education to old format
    const education = completeProfile.education?.map(edu => ({
        degree: edu.degree_type || '',
        school: edu.institution_name,
        date: edu.is_current
            ? `${edu.start_year} - Present`
            : `${edu.start_year} - ${edu.end_year}`,
        description: edu.description || ''
    })) || [];
    // Transform skills to array of strings
    const skills = completeProfile.skills?.map(skill => skill.skill_name) || [];
    // Transform languages to array of strings
    const languages = completeProfile.languages?.map(lang => lang.language_name) || [];
    // Transform portfolio links to socials object
    const socials = {};
    completeProfile.portfolio_links?.forEach(link => {
        socials[link.platform] = link.url;
    });
    return {
        id: profile.id,
        full_name: profile.full_name || '',
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        title: profile.title || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: `${profile.city || ''}, ${profile.state || ''}`.replace(/^,\s*|,\s*$/g, '') || '',
        // Address fields
        address: profile.address_line_1 || '',
        address_line_1: profile.address_line_1,
        address_line_2: profile.address_line_2,
        city: profile.city || '',
        state: profile.state || '',
        zip_code: profile.postal_code || '',
        postal_code: profile.postal_code,
        country: profile.country || '',
        county: profile.county,
        // Contact details
        phone_device_type: profile.phone_device_type,
        country_phone_code: profile.country_phone_code,
        phone_extension: profile.phone_extension,
        bio: profile.bio || '',
        // Transform normalized data to old format
        education,
        experience,
        skills,
        languages,
        socials,
        // URLs and documents
        linkedin_url: profile.linkedin_url,
        website_url: profile.personal_website,
        resume_url: profile.resume_url,
        resume_filename: profile.resume_filename,
        cover_letter_url: profile.cover_letter_url,
        cover_letter_filename: profile.cover_letter_filename,
        github_url: profile.github_url,
        personal_website: profile.personal_website,
        avatar_url: profile.avatar_url,
        // Work authorization
        work_authorization_status: profile.work_authorization_status,
        visa_sponsorship_required: profile.visa_sponsorship_required,
        work_authorization_us: profile.work_authorization_us,
        work_authorization_canada: profile.work_authorization_canada,
        work_authorization_uk: profile.work_authorization_uk,
        // Application preferences
        how_did_you_hear_about_us: profile.how_did_you_hear_about_us,
        previously_worked_for_workday: profile.previously_worked_for_workday,
        salary_expectation: profile.salary_expectation,
        available_start_date: profile.available_start_date,
        willing_to_relocate: profile.willing_to_relocate,
        years_of_experience: profile.years_of_experience,
        highest_education_level: profile.highest_education_level,
        education_level: profile.highest_education_level,
        // Voluntary disclosures
        gender: profile.gender,
        ethnicity: profile.ethnicity,
        military_veteran: profile.military_veteran,
        disability_status: profile.disability_status,
        lgbtq_status: profile.lgbtq_status,
        // Consent fields
        references_available: profile.references_available,
        background_check_consent: profile.background_check_consent,
        drug_test_consent: profile.drug_test_consent,
        // Other fields
        birthday: profile.birthday,
        daily_goal: profile.daily_goal || 10,
        profile_completion_percentage: profile.profile_completion_percentage,
        job_search_status: profile.job_search_status,
        // Keep normalized data arrays for advanced usage
        work_experiences: completeProfile.work_experiences,
        education_records: completeProfile.education,
        profile_skills: completeProfile.skills,
        profile_languages: completeProfile.languages,
        certifications: completeProfile.certifications,
        portfolio_links: completeProfile.portfolio_links,
        // Default values
        projects: [],
        custom_answers: {},
        settings: {
            nextJobDelay: 5000
        }
    };
};
exports.transformCompleteProfileToUserProfile = transformCompleteProfileToUserProfile;


/***/ }),

/***/ "./src/types.ts":
/*!**********************!*\
  !*** ./src/types.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SELECTORS = void 0;
exports.SELECTORS = {
    EASY_APPLY_BUTTON: '.jobs-apply-button',
    NEXT_BUTTON: [
        '[data-easy-apply-next-button]',
        '[data-live-test-easy-apply-next-button]',
        'button[aria-label="Continue to next step"]',
        'button.artdeco-button.artdeco-button--2.artdeco-button--primary',
        '.artdeco-button--primary',
        'button[type="button"].artdeco-button--primary'
    ],
    SUBMIT_BUTTON: '[aria-label="Submit application"]',
    REVIEW_BUTTON: [
        '[aria-label="Review your application"]',
        '[aria-label="Review"]',
        'button.artdeco-button--primary',
        '.artdeco-button--primary'
    ],
    CLOSE_BUTTON: '[aria-label="Dismiss"]',
    JOB_CARD: 'li.jobs-search-results__list-item, li.scaffold-layout__list-item, li.job-card-container, li.job-card-job-posting-card-wrapper, li[class*="job-card"], li[class*="job-posting"]',
    JOB_TITLE_LINK: '.job-card-container__link, a[data-control-name="job_card_title"], a[class*="job-card"][class*="title"]',
    JOBS_LIST: '.jobs-search-results-list, .jobs-search-results__list, div.GDWMPYlbLvJwwJkvOFRdwOcJxcoOxMsCHeyMgIQ, div[class*="GDWMP"], .jobs-search-two-pane__results',
    NEXT_PAGE_BUTTON: 'button[aria-label="Next"]',
    // Form field selectors
    FIRST_NAME_INPUT: 'input[name*="first" i]',
    LAST_NAME_INPUT: 'input[name*="last" i]',
    EMAIL_INPUT: 'input[type="email"]',
    PHONE_INPUT: 'input[name*="phone" i]',
    LOCATION_INPUT: 'input[name*="location" i], input[name*="city" i]',
    RESUME_INPUT: 'input[type="file"]',
    LINKEDIN_INPUT: 'input[name*="linkedin" i]',
    WEBSITE_INPUT: 'input[name*="website" i], input[name*="portfolio" i]',
    EXPERIENCE_YEARS: 'select[name*="experience" i], select[name*="years" i]',
    EDUCATION_LEVEL: 'select[name*="education" i], select[name*="degree" i]',
    // Common question selectors
    YES_NO_RADIO: 'input[type="radio"]',
    MULTIPLE_CHOICE: 'select',
    TEXT_INPUT: 'input[type="text"]',
    TEXT_AREA: 'textarea'
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "linkedin-easy-apply-automation:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/^blob:/, "").replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"content": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunklinkedin_easy_apply_automation"] = self["webpackChunklinkedin_easy_apply_automation"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!********************************!*\
  !*** ./src/content/content.ts ***!
  \********************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const automation_1 = __webpack_require__(/*! ./automation */ "./src/content/automation/index.ts");
const initialization_1 = __webpack_require__(/*! ./initialization */ "./src/content/initialization/index.ts");
const events_1 = __webpack_require__(/*! ./events */ "./src/content/events/index.ts");
const api_1 = __webpack_require__(/*! ./api */ "./src/content/api/index.ts");
console.log("LinkedIn Easy Apply content script loaded");
let isRunning = false;
let automationInterval = null;
let userData = null;
let continuing = false;
// Track job IDs that have already been processed to avoid duplicates
const appliedJobIds = new Set();
// Track jobs with 409 Conflict errors to avoid logging multiple times
const skipped409Jobs = new Set();
// Remove all the input listeners - we don't need them
const setupInputListeners = () => {
    // No listeners needed
};
//  Need ti cleanuo all the console logs
const verifySession = async () => {
    // Simply return true without extensive checking
    // This assumes the user is logged in based on previous auth
    return true;
};
// Create automation state object
const automationState = {
    isRunning: false,
    continuing: false,
    automationInterval: null,
    appliedJobIds,
    userData
};
// State management functions
const setIsRunning = (value) => {
    isRunning = value;
    automationState.isRunning = value;
};
const setContinuing = (value) => {
    continuing = value;
    automationState.continuing = value;
};
const setUserData = (value) => {
    userData = value;
    automationState.userData = value;
};
// Set up LinkedIn API interception
(0, api_1.setupLinkedInAPIInterception)({ skipped409Jobs });
// Initialize state when content script loads with dependencies
(0, initialization_1.initializeState)({
    appliedJobIds,
    skipped409Jobs,
    automationState,
    setUserData,
    startAutomation: automation_1.startAutomation,
    setIsRunning,
    setContinuing
});
// Set up event handling with dependencies
const eventDependencies = {
    automationState,
    getIsRunning: () => isRunning,
    getUserData: () => userData,
    setIsRunning,
    setContinuing,
    setUserData
};
// Initialize all event handlers
(0, events_1.setupMessageListener)(eventDependencies);
(0, events_1.setupPageEventListeners)(eventDependencies);
(0, events_1.setupDebugUtilities)();

})();

/******/ })()
;
//# sourceMappingURL=content.js.map