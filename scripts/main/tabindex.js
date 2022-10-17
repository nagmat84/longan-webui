/**
 * @description Helper class to manage tabindex
 */

const tabindex = {
};

/**
 * @param {jQuery} elem
 * @param {boolean} [saveFocusElement=false]
 * @returns {void}
 */
tabindex.makeUnfocusable = function (elem, saveFocusElement = false) {
	if (!lychee.enable_tabindex) return;

	// Get all elements which are considered "interactive" and are reachable
	// via tab
	// See: https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#interactive_content
	const interactiveElements = elem.find("a button label select textarea input");
	// Set tabindex to -1 (i.e. make them not focussable)
	interactiveElements.attr("tabindex", "-1");

	if (saveFocusElement) {
		// document.activeElement is faster than jQuery pseudo selector ':focus'
		// See: https://api.jquery.com/focus-selector/#focus1
		const e = $(document.activeElement);
		e.data("tabindex-focus", true);
		// Remove focus
		e.blur();
	}
};

/**
 * @param {jQuery} elem
 * @param {boolean} [restoreFocusElement=false]
 * @returns {void}
 */
tabindex.makeFocusable = function (elem, restoreFocusElement = false) {
	if (!lychee.enable_tabindex) return;

	// Get all elements which are considered "interactive" and are reachable
	// via tab
	// See: https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#interactive_content
	const interactiveElements = elem.find("a button label select textarea input");
	// Remove previously set tabindex
	interactiveElements.removeAttr("tabindex");

	// Find element which has previous focus
	const e = interactiveElements.find("[data-tabindex-focus]");
	e.removeData("tabindex-focus");
	// If we have an element and focus shall be restored, focus that
	// otherwise focus the first element
	if (restoreFocusElement) {
		if (e.length === 1) {
			e.focus();
		} else {
			interactiveElements.first().focus();
		}
	}
};
