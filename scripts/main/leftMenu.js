/**
 * @description This module is used for the context menu.
 */

/**
 * @namespace
 * @property {jQuery} _dom
 */
const leftMenu = {
	_dom: $("#lychee_left_menu_container"),
};

/**
 * @param {?string} [selector=null]
 * @returns {jQuery}
 */
leftMenu.dom = function (selector) {
	if (selector == null || selector === "") return leftMenu._dom;
	return leftMenu._dom.find(selector);
};

/**
 * Note: on mobile we use a context menu instead; please make sure that
 * contextMenu.config is kept in sync with any changes here!
 *
 * @returns {void}
 */
leftMenu.build = function () {
	let html = lychee.html`
		<a id="text_settings_close" class="closetxt">${lychee.locale["CLOSE"]}</a>
		<a id="button_settings_close" class="closebtn">&times;</a>
		<a class="linkMenu" id="button_settings_open"><svg class="iconic"><use xlink:href="#cog"></use></svg>${lychee.locale["SETTINGS"]}</a>`;
	if (lychee.new_photos_notification) {
		html += lychee.html`
		<a class="linkMenu" id="button_notifications">${build.iconic("bell")}${lychee.locale["NOTIFICATIONS"]} </a>
		`;
	}
	html += lychee.html`
		<a class="linkMenu" id="button_users">${build.iconic("person")}${lychee.locale["USERS"]} </a>
		<a class="linkMenu" id="button_u2f">${build.iconic("key")}${lychee.locale["U2F"]} </a>
		<a class="linkMenu" id="button_sharing">${build.iconic("cloud")}${lychee.locale["SHARING"]}</a>`;
	html += lychee.html`
		<a class="linkMenu" id="button_logs">${build.iconic("align-left")}${lychee.locale["LOGS"]}</a>
		<a class="linkMenu" id="button_diagnostics">${build.iconic("wrench")}${lychee.locale["DIAGNOSTICS"]}</a>
		<a class="linkMenu" id="button_about">${build.iconic("info")}${lychee.locale["ABOUT_LYCHEE"]}</a>
		<a class="linkMenu" id="button_signout">${build.iconic("account-logout")}${lychee.locale["SIGN_OUT"]}</a>`;
	if (lychee.update_available) {
		html += lychee.html`
		<a class="linkMenu" id="button_update">${build.iconic("timer")}${lychee.locale["UPDATE_AVAILABLE"]}</a>
		`;
	}
	leftMenu.dom("#lychee_left_menu").html(html);
};

/** Set the width of the side navigation to 250px and the left margin of the page content to 250px
 *
 * @returns {void}
 */
leftMenu.open = function () {
	leftMenu.dom().addClass("visible");

	// Make background unfocusable
	tabindex.makeUnfocusable(header.dom());
	tabindex.makeUnfocusable(lychee.content);
	tabindex.makeFocusable(leftMenu.dom());
	$("#button_signout").focus();

	multiselect.unbind();
};

/**
 * Set the width of the side navigation to 0 and the left margin of the page content to 0
 *
 * @returns {void}
 */
leftMenu.close = function () {
	leftMenu.dom().removeClass("visible");

	tabindex.makeFocusable(header.dom());
	tabindex.makeFocusable(lychee.content);
	tabindex.makeUnfocusable(leftMenu.dom());

	multiselect.bind();
	lychee.load();
};

/**
 * @returns {void}
 */
leftMenu.bind = function () {
	// Event Name
	const eventName = "click touchend";

	leftMenu.dom("#button_settings_close").on(eventName, leftMenu.close);
	leftMenu.dom("#text_settings_close").on(eventName, leftMenu.close);
	leftMenu.dom("#button_settings_open").on(eventName, settings.open);
	leftMenu.dom("#button_signout").on(eventName, lychee.logout);
	leftMenu.dom("#button_logs").on(eventName, leftMenu.Logs);
	leftMenu.dom("#button_diagnostics").on(eventName, leftMenu.Diagnostics);
	leftMenu.dom("#button_about").on(eventName, lychee.aboutDialog);
	leftMenu.dom("#button_notifications").on(eventName, leftMenu.Notifications);
	leftMenu.dom("#button_users").on(eventName, leftMenu.Users);
	leftMenu.dom("#button_u2f").on(eventName, leftMenu.u2f);
	leftMenu.dom("#button_sharing").on(eventName, leftMenu.Sharing);
	leftMenu.dom("#button_update").on(eventName, leftMenu.Update);
};

/**
 * @returns {void}
 */
leftMenu.Logs = function () {
	view.logs.init();
};

/**
 * @returns {void}
 */
leftMenu.Diagnostics = function () {
	view.diagnostics.init();
};

/**
 * @returns {void}
 */
leftMenu.Update = function () {
	view.update.init();
};

/**
 * @returns {void}
 */
leftMenu.Notifications = function () {
	notifications.load();
};

/**
 * @returns {void}
 */
leftMenu.Users = function () {
	users.list();
};

/**
 * @returns {void}
 */
leftMenu.u2f = function () {
	u2f.list();
};

/**
 * @returns {void}
 */
leftMenu.Sharing = function () {
	sharing.list();
};
