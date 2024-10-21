/* Contents:
 - stand-with-ukraine
 - twentynineteen-priority-menu
 - twentynineteen-touch-navigation
 - comment-reply
 - mc4wp-forms-api
*/

/* Minit: https://kasparsdambis.lv/wp-content/plugins/stand-with-ukraine/stand_with_ukraine.js */
document.addEventListener('DOMContentLoaded', function() {
	let body = document.getElementsByTagName('body')[0];
	let div  = document.createElement('div');
	div.id = 'stand_with_ukraine_overlay';
	div.innerHTML = '<a title="' + swu_options.text + '" href="' + swu_options.url + '">' + swu_options.hashtag + '</a>';
	document.body.insertBefore(div, body.firstChild);
});




/* Minit: https://kasparsdambis.lv/wp-content/themes/twentynineteen/js/priority-menu.js */
(function() {

	/**
	 * Debounce.
	 *
	 * @param {Function} func
	 * @param {number} wait
	 * @param {boolean} immediate
	 */
	function debounce(func, wait, immediate) {
		'use strict';

		var timeout;
		wait      = (typeof wait !== 'undefined') ? wait : 20;
		immediate = (typeof immediate !== 'undefined') ? immediate : true;

		return function() {

			var context = this, args = arguments;
			var later = function() {
				timeout = null;

				if (!immediate) {
					func.apply(context, args);
				}
			};

			var callNow = immediate && !timeout;

			clearTimeout(timeout);
			timeout = setTimeout(later, wait);

			if (callNow) {
				func.apply(context, args);
			}
		};
	}

	/**
	 * Prepends an element to a container.
	 *
	 * @param {Element} container
	 * @param {Element} element
	 */
	function prependElement(container, element) {
		if (container.firstChild.nextSibling) {
			return container.insertBefore(element, container.firstChild.nextSibling);
		} else {
			return container.appendChild(element);
		}
	}

	/**
	 * Shows an element by adding a hidden className.
	 *
	 * @param {Element} element
	 */
	function showButton(element) {
		// classList.remove is not supported in IE11.
		element.className = element.className.replace('is-empty', '');
	}

	/**
	 * Hides an element by removing the hidden className.
	 *
	 * @param {Element} element
	 */
	function hideButton(element) {
		// classList.add is not supported in IE11.
		if (!element.classList.contains('is-empty')) {
			element.className += ' is-empty';
		}
	}

	/**
	 * Returns the currently available space in the menu container.
	 *
	 * @returns {number} Available space
	 */
	function getAvailableSpace( button, container ) {
		return container.offsetWidth - button.offsetWidth - 22;
	}

	/**
	 * Returns whether the current menu is overflowing or not.
	 *
	 * @returns {boolean} Is overflowing
	 */
	function isOverflowingNavivation( list, button, container ) {
		return list.offsetWidth > getAvailableSpace( button, container );
	}

	/**
	 * Set menu container variable.
	 */
	var navContainer = document.querySelector('.main-navigation');
	var breaks       = [];

	/**
	 * Let’s bail if we our menu doesn't exist.
	 */
	if ( ! navContainer ) {
		return;
	}

	/**
	 * Refreshes the list item from the menu depending on the menu size.
	 */
	function updateNavigationMenu( container ) {

		/**
		 * Let’s bail if our menu is empty.
		 */
		if ( ! container.parentNode.querySelector('.main-menu[id]') ) {
			return;
		}

		// Adds the necessary UI to operate the menu.
		var visibleList  = container.parentNode.querySelector('.main-menu[id]');
		var hiddenList   = visibleList.parentNode.nextElementSibling.querySelector('.hidden-links');
		var toggleButton = visibleList.parentNode.nextElementSibling.querySelector('.main-menu-more-toggle');

		if ( isOverflowingNavivation( visibleList, toggleButton, container ) ) {

			// Record the width of the list.
			breaks.push( visibleList.offsetWidth );
			// Move last item to the hidden list.
			prependElement( hiddenList, ! visibleList.lastChild || null === visibleList.lastChild ? visibleList.previousElementSibling : visibleList.lastChild );
			// Show the toggle button.
			showButton( toggleButton );

		} else {

			// There is space for another item in the nav.
			if ( getAvailableSpace( toggleButton, container ) > breaks[breaks.length - 1] ) {
				// Move the item to the visible list.
				visibleList.appendChild( hiddenList.firstChild.nextSibling );
				breaks.pop();
			}

			// Hide the dropdown btn if hidden list is empty.
			if (breaks.length < 2) {
				hideButton( toggleButton );
			}
		}

		// Recur if the visible list is still overflowing the nav.
		if ( isOverflowingNavivation( visibleList, toggleButton, container ) ) {
			updateNavigationMenu( container );
		}
	}

	/**
	 * Run our priority+ function as soon as the document is `ready`.
	 */
	document.addEventListener( 'DOMContentLoaded', function() {

		updateNavigationMenu( navContainer );

		// Also, run our priority+ function on selective refresh in the customizer.
		var hasSelectiveRefresh = (
			'undefined' !== typeof wp &&
			wp.customize &&
			wp.customize.selectiveRefresh &&
			wp.customize.navMenusPreview.NavMenuInstancePartial
		);

		if ( hasSelectiveRefresh ) {
			// Re-run our priority+ function on Nav Menu partial refreshes.
			wp.customize.selectiveRefresh.bind( 'partial-content-rendered', function ( placement ) {

				var isNewNavMenu = (
					placement &&
					placement.partial.id.includes( 'nav_menu_instance' ) &&
					'null' !== placement.container[0].parentNode &&
					placement.container[0].parentNode.classList.contains( 'main-navigation' )
				);

				if ( isNewNavMenu ) {
					updateNavigationMenu( placement.container[0].parentNode );
				}
			});
        }
	});

	/**
	 * Run our priority+ function on load.
	 */
	window.addEventListener( 'load', function() {
		updateNavigationMenu( navContainer );
	});

	/**
	 * Run our priority+ function every time the window resizes.
	 */
	var isResizing = false;
	window.addEventListener( 'resize',
		debounce( function() {
			if ( isResizing ) {
				return;
			}

			isResizing = true;
			setTimeout( function() {
				updateNavigationMenu( navContainer );
				isResizing = false;
			}, 150 );
		} )
	);

	/**
	 * Run our priority+ function.
	 */
	updateNavigationMenu( navContainer );

})();




/* Minit: https://kasparsdambis.lv/wp-content/themes/twentynineteen/js/touch-keyboard-navigation.js */
/**
 * Touch & Keyboard navigation.
 *
 * Contains handlers for touch devices and keyboard navigation.
 */

(function() {

	/**
	 * Debounce.
	 *
	 * @param {Function} func
	 * @param {number} wait
	 * @param {boolean} immediate
	 */
	function debounce(func, wait, immediate) {
		'use strict';

		var timeout;
		wait      = (typeof wait !== 'undefined') ? wait : 20;
		immediate = (typeof immediate !== 'undefined') ? immediate : true;

		return function() {

			var context = this, args = arguments;
			var later = function() {
				timeout = null;

				if (!immediate) {
					func.apply(context, args);
				}
			};

			var callNow = immediate && !timeout;

			clearTimeout(timeout);
			timeout = setTimeout(later, wait);

			if (callNow) {
				func.apply(context, args);
			}
		};
	}

	/**
	 * Add class.
	 *
	 * @param {Object} el
	 * @param {string} cls
	 */
	function addClass(el, cls) {
		if ( ! el.className.match( '(?:^|\\s)' + cls + '(?!\\S)') ) {
			el.className += ' ' + cls;
		}
	}

	/**
	 * Delete class.
	 *
	 * @param {Object} el
	 * @param {string} cls
	 */
	function deleteClass(el, cls) {
		el.className = el.className.replace( new RegExp( '(?:^|\\s)' + cls + '(?!\\S)' ),'' );
	}

	/**
	 * Has class?
	 *
	 * @param {Object} el
	 * @param {string} cls
	 *
	 * @returns {boolean} Has class
	 */
	function hasClass(el, cls) {

		if ( el.className.match( '(?:^|\\s)' + cls + '(?!\\S)' ) ) {
			return true;
		}
	}

	/**
	 * Toggle Aria Expanded state for screenreaders.
	 *
	 * @param {Object} ariaItem
	 */
	function toggleAriaExpandedState( ariaItem ) {
		'use strict';

		var ariaState = ariaItem.getAttribute('aria-expanded');

		if ( ariaState === 'true' ) {
			ariaState = 'false';
		} else {
			ariaState = 'true';
		}

		ariaItem.setAttribute('aria-expanded', ariaState);
	}

	/**
	 * Open sub-menu.
	 *
	 * @param {Object} currentSubMenu
	 */
	function openSubMenu( currentSubMenu ) {
		'use strict';

		// Update classes.
		// classList.add is not supported in IE11.
		currentSubMenu.parentElement.className += ' off-canvas';
		currentSubMenu.parentElement.lastElementChild.className += ' expanded-true';

		// Update aria-expanded state.
		toggleAriaExpandedState( currentSubMenu );
	}

	/**
	 * Close sub-menu.
	 *
	 * @param {Object} currentSubMenu
	 */
	function closeSubMenu( currentSubMenu ) {
		'use strict';

		var menuItem     = getCurrentParent( currentSubMenu, '.menu-item' ); // this.parentNode
		var menuItemAria = menuItem.querySelector('a[aria-expanded]');
		var subMenu      = currentSubMenu.closest('.sub-menu');

		// If this is in a sub-sub-menu, go back to parent sub-menu.
		if ( getCurrentParent( currentSubMenu, 'ul' ).classList.contains( 'sub-menu' ) ) {

			// Update classes.
			// classList.remove is not supported in IE11.
			menuItem.className = menuItem.className.replace( 'off-canvas', '' );
			subMenu.className  = subMenu.className.replace( 'expanded-true', '' );

			// Update aria-expanded and :focus states.
			toggleAriaExpandedState( menuItemAria );

		// Or else close all sub-menus.
		} else {

			// Update classes.
			// classList.remove is not supported in IE11.
			menuItem.className = menuItem.className.replace( 'off-canvas', '' );
			menuItem.lastElementChild.className = menuItem.lastElementChild.className.replace( 'expanded-true', '' );

			// Update aria-expanded and :focus states.
			toggleAriaExpandedState( menuItemAria );
		}
	}

	/**
	 * Find first ancestor of an element by selector.
	 *
	 * @param {Object} child
	 * @param {String} selector
	 * @param {String} stopSelector
	 */
	function getCurrentParent( child, selector, stopSelector ) {

		var currentParent = null;

		while ( child ) {

			if ( child.matches(selector) ) {

				currentParent = child;
				break;

			} else if ( stopSelector && child.matches(stopSelector) ) {

				break;
			}

			child = child.parentElement;
		}

		return currentParent;
	}

	/**
	 * Remove all off-canvas states.
	 */
	function removeAllFocusStates() {
		'use strict';

		var siteBranding            = document.getElementsByClassName( 'site-branding' )[0];
		var getFocusedElements      = siteBranding.querySelectorAll(':hover, :focus, :focus-within');
		var getFocusedClassElements = siteBranding.querySelectorAll('.is-focused');
		var i;
		var o;

		for ( i = 0; i < getFocusedElements.length; i++) {
			getFocusedElements[i].blur();
		}

		for ( o = 0; o < getFocusedClassElements.length; o++) {
			deleteClass( getFocusedClassElements[o], 'is-focused' );
		}
	}

	/**
	 * Matches polyfill for IE11.
	 */
	if (!Element.prototype.matches) {
		Element.prototype.matches = Element.prototype.msMatchesSelector;
	}

	/**
	 * Toggle `focus` class to allow sub-menu access on touch screens.
	 */
	function toggleSubmenuDisplay() {

		document.addEventListener('touchstart', function(event) {

			if ( event.target.matches('a') ) {

				var url = event.target.getAttribute( 'href' ) ? event.target.getAttribute( 'href' ) : '';

				// Open submenu if URL is #.
				if ( '#' === url && event.target.nextSibling.matches('.submenu-expand') ) {
					openSubMenu( event.target );
				}
			}

			// Check if .submenu-expand is touched.
			if ( event.target.matches('.submenu-expand') ) {
				openSubMenu(event.target);

			// Check if child of .submenu-expand is touched.
			} else if ( null != getCurrentParent( event.target, '.submenu-expand' ) &&
								getCurrentParent( event.target, '.submenu-expand' ).matches( '.submenu-expand' ) ) {
				openSubMenu( getCurrentParent( event.target, '.submenu-expand' ) );

			// Check if .menu-item-link-return is touched.
			} else if ( event.target.matches('.menu-item-link-return') ) {
				closeSubMenu( event.target );

			// Check if child of .menu-item-link-return is touched.
			} else if ( null != getCurrentParent( event.target, '.menu-item-link-return' ) && getCurrentParent( event.target, '.menu-item-link-return' ).matches( '.menu-item-link-return' ) ) {
				closeSubMenu( event.target );
			}

			// Prevent default mouse/focus events.
			removeAllFocusStates();

		}, false);

		document.addEventListener('touchend', function(event) {

			var mainNav = getCurrentParent( event.target, '.main-navigation' );

			if ( null != mainNav && hasClass( mainNav, '.main-navigation' ) ) {
				// Prevent default mouse events.
				event.preventDefault();

			} else if (
				event.target.matches('.submenu-expand') ||
				null != getCurrentParent( event.target, '.submenu-expand' ) &&
				getCurrentParent( event.target, '.submenu-expand' ).matches( '.submenu-expand' ) ||
				event.target.matches('.menu-item-link-return') ||
				null != getCurrentParent( event.target, '.menu-item-link-return' ) &&
				getCurrentParent( event.target, '.menu-item-link-return' ).matches( '.menu-item-link-return' ) ) {
					// Prevent default mouse events.
					event.preventDefault();
			}

			// Prevent default mouse/focus events.
			removeAllFocusStates();

		}, false);

		document.addEventListener('focus', function(event) {

			if ( event.target !== window.document && event.target.matches( '.main-navigation > div > ul > li a' ) ) {

				// Remove Focused elements in sibling div.
				var currentDiv        = getCurrentParent( event.target, 'div', '.main-navigation' );
				var currentDivSibling = currentDiv.previousElementSibling === null ? currentDiv.nextElementSibling : currentDiv.previousElementSibling;
				var focusedElement    = currentDivSibling.querySelector( '.is-focused' );
				var focusedClass      = 'is-focused';
				var prevLi            = getCurrentParent( event.target, '.main-navigation > div > ul > li', '.main-navigation' ).previousElementSibling;
				var nextLi            = getCurrentParent( event.target, '.main-navigation > div > ul > li', '.main-navigation' ).nextElementSibling;

				if ( null !== focusedElement && null !== hasClass( focusedElement, focusedClass ) ) {
					deleteClass( focusedElement, focusedClass );
				}

				// Add .is-focused class to top-level li.
				if ( getCurrentParent( event.target, '.main-navigation > div > ul > li', '.main-navigation' ) ) {
					addClass( getCurrentParent( event.target, '.main-navigation > div > ul > li', '.main-navigation' ), focusedClass );
				}

				// Check for previous li.
				if ( prevLi && hasClass( prevLi, focusedClass ) ) {
					deleteClass( prevLi, focusedClass );
				}

				// Check for next li.
				if ( nextLi && hasClass( nextLi, focusedClass ) ) {
					deleteClass( nextLi, focusedClass );
				}
			}

		}, true);

		document.addEventListener('click', function(event) {

			// Remove all focused menu states when clicking outside site branding.
			if ( event.target !== document.getElementsByClassName( 'site-branding' )[0] ) {
				removeAllFocusStates();
			} else {
				// Nothing.
			}

		}, false);
	}

	/**
	 * Run our sub-menu function as soon as the document is `ready`.
	 */
	document.addEventListener( 'DOMContentLoaded', function() {
		toggleSubmenuDisplay();
	});

	/**
	 * Run our sub-menu function on selective refresh in the customizer.
	 */
	document.addEventListener( 'customize-preview-menu-refreshed', function( e, params ) {
		if ( 'menu-1' === params.wpNavMenuArgs.theme_location ) {
			toggleSubmenuDisplay();
		}
	});

	/**
	 * Run our sub-menu function every time the window resizes.
	 */
	var isResizing = false;
	window.addEventListener( 'resize', function() {
		isResizing = true;
		debounce( function() {
			if ( isResizing ) {
				return;
			}

			toggleSubmenuDisplay();
			isResizing = false;

		}, 150 );
	} );

})();




/* Minit: /wp-includes/js/comment-reply.min.js */
/*! This file is auto-generated */
window.addComment=function(v){var I,C,h,E=v.document,b={commentReplyClass:"comment-reply-link",commentReplyTitleId:"reply-title",cancelReplyId:"cancel-comment-reply-link",commentFormId:"commentform",temporaryFormId:"wp-temp-form-div",parentIdFieldId:"comment_parent",postIdFieldId:"comment_post_ID"},e=v.MutationObserver||v.WebKitMutationObserver||v.MozMutationObserver,r="querySelector"in E&&"addEventListener"in v,n=!!E.documentElement.dataset;function t(){d(),e&&new e(o).observe(E.body,{childList:!0,subtree:!0})}function d(e){if(r&&(I=g(b.cancelReplyId),C=g(b.commentFormId),I)){I.addEventListener("touchstart",l),I.addEventListener("click",l);function t(e){if((e.metaKey||e.ctrlKey)&&13===e.keyCode)return C.removeEventListener("keydown",t),e.preventDefault(),C.submit.click(),!1}C&&C.addEventListener("keydown",t);for(var n,d=function(e){var t=b.commentReplyClass;e&&e.childNodes||(e=E);e=E.getElementsByClassName?e.getElementsByClassName(t):e.querySelectorAll("."+t);return e}(e),o=0,i=d.length;o<i;o++)(n=d[o]).addEventListener("touchstart",a),n.addEventListener("click",a)}}function l(e){var t,n,d=g(b.temporaryFormId);d&&h&&(g(b.parentIdFieldId).value="0",t=d.textContent,d.parentNode.replaceChild(h,d),this.style.display="none",n=(d=(d=g(b.commentReplyTitleId))&&d.firstChild)&&d.nextSibling,d&&d.nodeType===Node.TEXT_NODE&&t&&(n&&"A"===n.nodeName&&n.id!==b.cancelReplyId&&(n.style.display=""),d.textContent=t),e.preventDefault())}function a(e){var t=g(b.commentReplyTitleId),t=t&&t.firstChild.textContent,n=this,d=m(n,"belowelement"),o=m(n,"commentid"),i=m(n,"respondelement"),r=m(n,"postid"),n=m(n,"replyto")||t;d&&o&&i&&r&&!1===v.addComment.moveForm(d,o,i,r,n)&&e.preventDefault()}function o(e){for(var t=e.length;t--;)if(e[t].addedNodes.length)return void d()}function m(e,t){return n?e.dataset[t]:e.getAttribute("data-"+t)}function g(e){return E.getElementById(e)}return r&&"loading"!==E.readyState?t():r&&v.addEventListener("DOMContentLoaded",t,!1),{init:d,moveForm:function(e,t,n,d,o){var i,r,l,a,m,c,s,e=g(e),n=(h=g(n),g(b.parentIdFieldId)),y=g(b.postIdFieldId),p=g(b.commentReplyTitleId),u=(p=p&&p.firstChild)&&p.nextSibling;if(e&&h&&n){void 0===o&&(o=p&&p.textContent),a=h,m=b.temporaryFormId,c=g(m),s=(s=g(b.commentReplyTitleId))?s.firstChild.textContent:"",c||((c=E.createElement("div")).id=m,c.style.display="none",c.textContent=s,a.parentNode.insertBefore(c,a)),d&&y&&(y.value=d),n.value=t,I.style.display="",e.parentNode.insertBefore(h,e.nextSibling),p&&p.nodeType===Node.TEXT_NODE&&(u&&"A"===u.nodeName&&u.id!==b.cancelReplyId&&(u.style.display="none"),p.textContent=o),I.onclick=function(){return!1};try{for(var f=0;f<C.elements.length;f++)if(i=C.elements[f],r=!1,"getComputedStyle"in v?l=v.getComputedStyle(i):E.documentElement.currentStyle&&(l=i.currentStyle),(i.offsetWidth<=0&&i.offsetHeight<=0||"hidden"===l.visibility)&&(r=!0),"hidden"!==i.type&&!i.disabled&&!r){i.focus();break}}catch(e){}return!1}}}}(window);



/* Minit: https://kasparsdambis.lv/wp-content/plugins/mailchimp-for-wp/assets/js/forms.js */
(()=>{var e={9885:e=>{function t(){this.listeners={}}t.prototype.emit=function(e,t){this.listeners[e]=this.listeners[e]??[],this.listeners[e].forEach((e=>e.apply(null,t)))},t.prototype.on=function(e,t){this.listeners[e]=this.listeners[e]??[],this.listeners[e].push(t)},e.exports=t},5626:()=>{function e(e){const t=!!e.getAttribute("data-show-if"),n=t?e.getAttribute("data-show-if").split(":"):e.getAttribute("data-hide-if").split(":"),r=n[0],i=(n.length>1?n[1]:"*").split("|"),o=function(e,t){const n=[],r=e.querySelectorAll('input[name="'+t+'"],select[name="'+t+'"],textarea[name="'+t+'"]');for(let e=0;e<r.length;e++)("radio"!==r[e].type&&"checkbox"!==r[e].type||r[e].checked)&&n.push(r[e].value);return n}(function(e){let t=e;for(;t.parentElement;)if(t=t.parentElement,"FORM"===t.tagName)return t;return null}(e),r);let s=!1;for(let e=0;e<o.length&&!s;e++)s=i.indexOf(o[e])>-1||i.indexOf("*")>-1&&o[e].length>0;e.style.display=t?s?"":"none":s?"none":"";const a=e.querySelectorAll("input,select,textarea");for(let e=0;e<a.length;e++)(s||t)&&a[e].getAttribute("data-was-required")&&(a[e].required=!0,a[e].removeAttribute("data-was-required")),s&&t||!a[e].required||(a[e].setAttribute("data-was-required","true"),a[e].required=!1)}function t(){const t=document.querySelectorAll(".mc4wp-form [data-show-if],.mc4wp-form [data-hide-if]");for(let n=0;n<t.length;n++)e(t[n])}function n(t){if(!t.target||!t.target.form||t.target.form.className.indexOf("mc4wp-form")<0)return;const n=t.target.form.querySelectorAll("[data-show-if],[data-hide-if]");for(let t=0;t<n.length;t++)e(n[t])}document.addEventListener("keyup",n,!0),document.addEventListener("change",n,!0),document.addEventListener("mc4wp-refresh",t,!0),window.addEventListener("load",t),t()},6942:(e,t,n)=>{const r=n(2076),i=n(6564),o=function(e,t){this.id=e,this.element=t||document.createElement("form"),this.name=this.element.getAttribute("data-name")||"Form #"+this.id,this.errors=[],this.started=!1};o.prototype.setData=function(e){try{i(this.element,e)}catch(e){console.error(e)}},o.prototype.getData=function(){return r(this.element,{hash:!0,empty:!0})},o.prototype.getSerializedData=function(){return r(this.element,{hash:!1,empty:!0})},o.prototype.setResponse=function(e){this.element.querySelector(".mc4wp-response").innerHTML=e},o.prototype.reset=function(){this.setResponse(""),this.element.querySelector(".mc4wp-form-fields").style.display="",this.element.reset()},e.exports=o},9685:(e,t,n)=>{const r=n(6942),i=[],o=new(n(9885));function s(e,t){t=t||parseInt(e.getAttribute("data-id"))||0;const n=new r(t,e);return i.push(n),n}e.exports={get:function(e){e=parseInt(e);for(let t=0;t<i.length;t++)if(i[t].id===e)return i[t];return s(document.querySelector(".mc4wp-form-"+e),e)},getByElement:function(e){const t=e.form||e;for(let e=0;e<i.length;e++)if(i[e].element===t)return i[e];return s(t)},on:function(e,t){o.on(e,t)},trigger:function(e,t){"submit"===e||e.indexOf(".submit")>0?(o.emit(t[0].id+"."+e,t),o.emit(e,t)):window.setTimeout((function(){o.emit(t[0].id+"."+e,t),o.emit(e,t)}),10)}}},2076:e=>{var t=/^(?:submit|button|image|reset|file)$/i,n=/^(?:input|select|textarea|keygen)/i,r=/(\[[^\[\]]*\])/g;function i(e,t,n){if(0===t.length)return n;var r=t.shift(),o=r.match(/^\[(.+?)\]$/);if("[]"===r)return e=e||[],Array.isArray(e)?e.push(i(null,t,n)):(e._values=e._values||[],e._values.push(i(null,t,n))),e;if(o){var s=o[1],a=+s;isNaN(a)?(e=e||{})[s]=i(e[s],t,n):(e=e||[])[a]=i(e[a],t,n)}else e[r]=i(e[r],t,n);return e}function o(e,t,n){if(t.match(r))i(e,function(e){var t=[],n=new RegExp(r),i=/^([^\[\]]*)/.exec(e);for(i[1]&&t.push(i[1]);null!==(i=n.exec(e));)t.push(i[1]);return t}(t),n);else{var o=e[t];o?(Array.isArray(o)||(e[t]=[o]),e[t].push(n)):e[t]=n}return e}function s(e,t,n){return n=n.replace(/(\r)?\n/g,"\r\n"),n=(n=encodeURIComponent(n)).replace(/%20/g,"+"),e+(e?"&":"")+encodeURIComponent(t)+"="+n}e.exports=function(e,r){"object"!=typeof r?r={hash:!!r}:void 0===r.hash&&(r.hash=!0);for(var i=r.hash?{}:"",a=r.serializer||(r.hash?o:s),c=e&&e.elements?e.elements:[],l=Object.create(null),u=0;u<c.length;++u){var f=c[u];if((r.disabled||!f.disabled)&&f.name&&n.test(f.nodeName)&&!t.test(f.type)){var d=f.name,h=f.value;if("checkbox"!==f.type&&"radio"!==f.type||f.checked||(h=void 0),r.empty){if("checkbox"!==f.type||f.checked||(h=""),"radio"===f.type&&(l[f.name]||f.checked?f.checked&&(l[f.name]=!0):l[f.name]=!1),null==h&&"radio"==f.type)continue}else if(!h)continue;if("select-multiple"!==f.type)i=a(i,d,h);else{h=[];for(var p=f.options,m=!1,g=0;g<p.length;++g){var y=p[g],v=r.empty&&!y.value,w=y.value||v;y.selected&&w&&(m=!0,i=r.hash&&"[]"!==d.slice(d.length-2)?a(i,d+"[]",y.value):a(i,d,y.value))}!m&&r.empty&&(i=a(i,d,""))}}}if(r.empty)for(var d in l)l[d]||(i=a(i,d,""));return i}},6564:e=>{e.exports&&(e.exports=function e(t,n,r){for(const i in n){if(!n.hasOwnProperty(i))continue;const o=i;let s=n[i];if(void 0===s&&(s=""),null===s&&(s=""),void 0!==r&&(o=r+"["+i+"]"),s.constructor===Array)o+="[]";else if("object"==typeof s){e(t,s,o);continue}const a=t.elements.namedItem(o);if(!a)continue;const c=a.type||a[0].type;switch(c){default:a.value=s;break;case"radio":case"checkbox":{const e=s.constructor===Array?s:[s];for(let t=0;t<a.length;t++)a[t].checked=e.indexOf(a[t].value)>-1}break;case"select-multiple":{const e=s.constructor===Array?s:[s];for(let t=0;t<a.options.length;t++)a.options[t].selected=e.indexOf(a.options[t].value)>-1}break;case"select":case"select-one":a.value=s.toString()||s;break;case"date":a.value=new Date(s).toISOString().split("T")[0]}const l=new Event("change",{bubbles:!0});switch(c){default:a.dispatchEvent(l);break;case"radio":case"checkbox":for(let e=0;e<a.length;e++)a[e].checked&&a[e].dispatchEvent(l)}}})}},t={};function n(r){var i=t[r];if(void 0!==i)return i.exports;var o=t[r]={exports:{}};return e[r](o,o.exports,n),o.exports}const r=window.mc4wp||{},i=n(9685);function o(e,t){document.addEventListener(e,(e=>{if(!e.target)return;const n=e.target;("string"==typeof n.className&&n.className.indexOf("mc4wp-form")>-1||"function"==typeof n.matches&&n.matches(".mc4wp-form *"))&&t.call(e,e)}),!0)}n(5626),o("submit",(function(e){if(e.defaultPrevented)return;const t=i.getByElement(e.target);i.trigger("submit",[t,e])})),o("focus",(function(e){const t=i.getByElement(e.target);t.started||(i.trigger("started",[t,e]),t.started=!0)})),o("change",(function(e){const t=i.getByElement(e.target);i.trigger("change",[t,e])})),r.listeners&&([].forEach.call(r.listeners,(function(e){i.on(e.event,e.callback)})),delete r.listeners),r.forms=i,window.mc4wp=r})();