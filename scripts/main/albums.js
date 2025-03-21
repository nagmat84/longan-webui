/**
 * @description Takes care of every action albums can handle and execute.
 */

const albums = {
	/** @type {?Albums} */
	json: null,
};

/**
 * @returns {void}
 */
albums.load = function () {
	const showRootAlbum = function () {
		// DO NOT change the order of `header.setMode` and `view.albums.init`.
		// The latter relies on the header being set correctly.
		//
		// `view.albums.init` builds the HTML of the albums view (note the
		// plural-s).
		// Internally, this exploits code for regular albums which in
		// turn calls `album.isUploadabe` (note the missing plural-s) to
		// check whether the current album supports drag-&-drop.
		// In order to return the correct value `album.isUploadabe` resorts
		// to a hack: if no (regular) album is loaded `album.isUploadabe`
		// normally returns `false` except the root album is visible.
		// In that case `album.isUploadabe` returns a "fake" `true`.
		// However, in order to do so `album.isUploadabe` needs to check
		// whether the root album is visible which is determined by the
		// visibility of the corresponding header.
		// That is why the header needs to be set first.
		//
		// However, the actual bug is to call `album.isUploadable` for the
		// root view.
		// TODO: Fix the bug described above.
		header.setMode("albums");
		view.albums.init();
		lychee.animate(lychee.content, "contentZoomIn");

		tabindex.makeFocusable(lychee.content);

		if (lychee.active_focus_on_page_load) {
			// Put focus on first element - either album or photo
			let first_album = $(".album:first");
			if (first_album.length !== 0) {
				first_album.focus();
			} else {
				let first_photo = $(".photo:first");
				if (first_photo.length !== 0) {
					first_photo.focus();
				}
			}
		}

		setTimeout(() => {
			lychee.footer_show();
		}, 300);

		// If no user is authenticated and there is nothing to see in the
		// root album, we automatically show the login dialog
		if (lychee.publicMode === true && lychee.viewMode === false && albums.isEmpty()) {
			lychee.loginDialog();
		}
	};

	let startTime = new Date().getTime();

	lychee.animate(lychee.content, "contentZoomOut");

	/**
	 * @param {Albums} data
	 */
	const successCallback = function (data) {
		// Smart Albums
		if (data.smart_albums) albums.localizeSmartAlbums(data.smart_albums);

		albums.json = data;

		// Skip delay when opening a blank Lychee
		const skipDelay = (!visible.albums() && !visible.photo() && !visible.album()) || (visible.album() && lychee.content.html() === "");
		// Calculate delay
		const durationTime = new Date().getTime() - startTime;
		const waitTime = durationTime > 300 || skipDelay ? 0 : 300 - durationTime;

		setTimeout(() => {
			showRootAlbum();
		}, waitTime);
	};

	if (albums.json === null) {
		api.post("Albums::get", {}, successCallback);
	} else {
		setTimeout(() => {
			showRootAlbum();
		}, 300);
	}
};

/**
 * @param {(Album|TagAlbum|SmartAlbum)} album
 * @returns {void}
 */
albums.parse = function (album) {
	if (!album.thumb) {
		album.thumb = {
			id: "",
			thumb: album.has_password ? "img/password.svg" : "img/no_images.svg",
			type: "image/svg+xml",
			thumb2x: null,
		};
	}
};

/**
 * Normalizes the built-in smart albums.
 *
 * @param {SmartAlbums} data
 * @returns {void}
 */
albums.localizeSmartAlbums = function (data) {
	if (data.unsorted) {
		data.unsorted.title = lychee.locale["UNSORTED"];
	}

	if (data.starred) {
		data.starred.title = lychee.locale["STARRED"];
	}

	if (data.public) {
		data.public.title = lychee.locale["PUBLIC"];
		// TODO: Why do we need to set these two attributes? What component relies upon them, what happens if we don't set them? Is it legacy?
		data.public.is_public = true;
		data.public.requires_link = true;
	}

	if (data.recent) {
		data.recent.title = lychee.locale["RECENT"];
	}
};

/**
 * @param {?string} albumID
 * @returns {boolean}
 */
albums.isShared = function (albumID) {
	if (albumID == null) return false;
	if (!albums.json) return false;
	if (!albums.json.albums) return false;

	let found = false;

	/**
	 * @this {Album}
	 * @returns {boolean}
	 */
	const func = function () {
		if (this.id === albumID) {
			found = true;
			return false; // stop the loop
		}
		if (this.albums) {
			$.each(this.albums, func);
		}
	};

	if (albums.json.shared_albums !== null) $.each(albums.json.shared_albums, func);

	return found;
};

/**
 * @param {?string} albumID
 * @returns {(null|Album|TagAlbum|SmartAlbum)}
 */
albums.getByID = function (albumID) {
	if (albumID == null) return null;
	if (!albums.json) return null;
	if (!albums.json.albums) return null;

	if (albums.json.smart_albums.hasOwnProperty(albumID)) {
		return albums.json.smart_albums[albumID];
	}

	let result = albums.json.tag_albums.find((tagAlbum) => tagAlbum.id === albumID);
	if (result) {
		return result;
	}

	result = albums.json.albums.find((album) => album.id === albumID);
	if (result) {
		return result;
	}

	result = albums.json.shared_albums.find((album) => album.id === albumID);
	if (result) {
		return result;
	}

	return null;
};

/**
 * Deletes a top-level album by ID from the cached JSON for albums.
 *
 * The method is called by {@link album.delete} after a top-level album has
 * successfully been deleted at the server-side.
 *
 * @param {?string} albumID
 * @returns {void}
 */
albums.deleteByID = function (albumID) {
	if (albumID == null) return;
	if (!albums.json) return;
	if (!albums.json.albums) return;

	let idx = albums.json.albums.findIndex((a) => a.id === albumID);
	albums.json.albums.splice(idx, 1);

	if (idx !== -1) return;

	idx = albums.json.shared_albums.findIndex((a) => a.id === albumID);
	albums.json.shared_albums.splice(idx, 1);

	if (idx !== -1) return;

	idx = albums.json.tag_albums.findIndex((a) => a.id === albumID);
	albums.json.tag_albums.splice(idx, 1);
};

/**
 * @returns {void}
 */
albums.refresh = function () {
	albums.json = null;
};

/**
 * @param {?string} albumID
 * @returns {boolean}
 */
albums.isTagAlbum = function (albumID) {
	return albums.json && albums.json.tag_albums.find((tagAlbum) => tagAlbum.id === albumID);
};

/**
 * Returns true if the root album is empty in the sense that there is no
 * visible user content.
 *
 * @returns {boolean}
 */
albums.isEmpty = function () {
	return (
		albums.json === null ||
		(albums.isSmartAlbumEmpty(albums.json.smart_albums.public) &&
			albums.isSmartAlbumEmpty(albums.json.smart_albums.recent) &&
			albums.isSmartAlbumEmpty(albums.json.smart_albums.starred) &&
			albums.isSmartAlbumEmpty(albums.json.smart_albums.unsorted) &&
			albums.json.albums.length === 0 &&
			albums.json.shared_albums.length === 0 &&
			albums.json.tag_albums.length === 0)
	);
};

/**
 * @param {?SmartAlbum} smartAlbum
 * @returns {boolean}
 */
albums.isSmartAlbumEmpty = function (smartAlbum) {
	return !smartAlbum || !smartAlbum.photos || smartAlbum.photos.length === 0;
};
