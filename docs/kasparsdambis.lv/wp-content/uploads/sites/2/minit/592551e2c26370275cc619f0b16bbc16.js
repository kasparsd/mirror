/* Contents:
 - stand-with-ukraine
 - twentynineteen-priority-menu
 - twentynineteen-touch-navigation
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

			if ( event.target.matches('.main-navigation > div > ul > li a') ) {

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




/* Minit: https://kasparsdambis.lv/wp-content/plugins/mailchimp-for-wp/assets/js/forms.js */
(()=>{var e={1677:()=>{function e(e){for(var t=!!e.getAttribute("data-show-if"),r=t?e.getAttribute("data-show-if").split(":"):e.getAttribute("data-hide-if").split(":"),n=r[0],a=(r.length>1?r[1]:"*").split("|"),i=function(e,t){for(var r=[],n=e.querySelectorAll('input[name="'+t+'"],select[name="'+t+'"],textarea[name="'+t+'"]'),a=0;a<n.length;a++){var i=n[a];("radio"!==i.type&&"checkbox"!==i.type||i.checked)&&r.push(i.value)}return r}(function(e){for(var t=e;t.parentElement;)if("FORM"===(t=t.parentElement).tagName)return t;return null}(e),n),o=!1,s=0;s<i.length;s++){var c=i[s];if(o=a.indexOf(c)>-1||a.indexOf("*")>-1&&c.length>0)break}e.style.display=t?o?"":"none":o?"none":"";var u=e.querySelectorAll("input,select,textarea");[].forEach.call(u,(function(e){(o||t)&&e.getAttribute("data-was-required")&&(e.required=!0,e.removeAttribute("data-was-required")),o&&t||!e.required||(e.setAttribute("data-was-required","true"),e.required=!1)}))}function t(){var t=document.querySelectorAll(".mc4wp-form [data-show-if],.mc4wp-form [data-hide-if]");[].forEach.call(t,e)}function r(t){if(t.target&&t.target.form&&!(t.target.form.className.indexOf("mc4wp-form")<0)){var r=t.target.form.querySelectorAll("[data-show-if],[data-hide-if]");[].forEach.call(r,e)}}document.addEventListener("keyup",r,!0),document.addEventListener("change",r,!0),document.addEventListener("mc4wp-refresh",t,!0),window.addEventListener("load",t),t()},2573:(e,t,r)=>{var n=r(7422),a=r(3409),i=function(e,t){this.id=e,this.element=t||document.createElement("form"),this.name=this.element.getAttribute("data-name")||"Form #"+this.id,this.errors=[],this.started=!1};i.prototype.setData=function(e){try{a(this.element,e)}catch(e){console.error(e)}},i.prototype.getData=function(){return n(this.element,{hash:!0,empty:!0})},i.prototype.getSerializedData=function(){return n(this.element,{hash:!1,empty:!0})},i.prototype.setResponse=function(e){this.element.querySelector(".mc4wp-response").innerHTML=e},i.prototype.reset=function(){this.setResponse(""),this.element.querySelector(".mc4wp-form-fields").style.display="",this.element.reset()},e.exports=i},8592:(e,t,r)=>{var n=r(2573),a=[],i={};function o(e,t){i[e]=i[e]||[],i[e].forEach((function(e){return e.apply(null,t)}))}function s(e,t){t=t||parseInt(e.getAttribute("data-id"))||0;var r=new n(t,e);return a.push(r),r}e.exports={get:function(e){e=parseInt(e);for(var t=0;t<a.length;t++)if(a[t].id===e)return a[t];return s(document.querySelector(".mc4wp-form-"+e),e)},getByElement:function(e){for(var t=e.form||e,r=0;r<a.length;r++)if(a[r].element===t)return a[r];return s(t)},on:function(e,t){i[e]=i[e]||[],i[e].push(t)},off:function(e,t){i[e]=i[e]||[],i[e]=i[e].filter((function(e){return e!==t}))},trigger:function(e,t){"submit"===e||e.indexOf(".submit")>0?o(e,t):window.setTimeout((function(){o(e,t)}),1)}}},7422:e=>{var t=/^(?:submit|button|image|reset|file)$/i,r=/^(?:input|select|textarea|keygen)/i,n=/(\[[^\[\]]*\])/g;function a(e,t,r){if(0===t.length)return r;var n=t.shift(),i=n.match(/^\[(.+?)\]$/);if("[]"===n)return e=e||[],Array.isArray(e)?e.push(a(null,t,r)):(e._values=e._values||[],e._values.push(a(null,t,r))),e;if(i){var o=i[1],s=+o;isNaN(s)?(e=e||{})[o]=a(e[o],t,r):(e=e||[])[s]=a(e[s],t,r)}else e[n]=a(e[n],t,r);return e}function i(e,t,r){if(t.match(n))a(e,function(e){var t=[],r=new RegExp(n),a=/^([^\[\]]*)/.exec(e);for(a[1]&&t.push(a[1]);null!==(a=r.exec(e));)t.push(a[1]);return t}(t),r);else{var i=e[t];i?(Array.isArray(i)||(e[t]=[i]),e[t].push(r)):e[t]=r}return e}function o(e,t,r){return r=r.replace(/(\r)?\n/g,"\r\n"),r=(r=encodeURIComponent(r)).replace(/%20/g,"+"),e+(e?"&":"")+encodeURIComponent(t)+"="+r}e.exports=function(e,n){"object"!=typeof n?n={hash:!!n}:void 0===n.hash&&(n.hash=!0);for(var a=n.hash?{}:"",s=n.serializer||(n.hash?i:o),c=e&&e.elements?e.elements:[],u=Object.create(null),l=0;l<c.length;++l){var f=c[l];if((n.disabled||!f.disabled)&&f.name&&r.test(f.nodeName)&&!t.test(f.type)){var d=f.name,m=f.value;if("checkbox"!==f.type&&"radio"!==f.type||f.checked||(m=void 0),n.empty){if("checkbox"!==f.type||f.checked||(m=""),"radio"===f.type&&(u[f.name]||f.checked?f.checked&&(u[f.name]=!0):u[f.name]=!1),null==m&&"radio"==f.type)continue}else if(!m)continue;if("select-multiple"!==f.type)a=s(a,d,m);else{m=[];for(var p=f.options,h=!1,v=0;v<p.length;++v){var g=p[v],y=n.empty&&!g.value,w=g.value||y;g.selected&&w&&(h=!0,a=n.hash&&"[]"!==d.slice(d.length-2)?s(a,d+"[]",g.value):s(a,d,g.value))}!h&&n.empty&&(a=s(a,d,""))}}}if(n.empty)for(var d in u)u[d]||(a=s(a,d,""));return a}},3409:e=>{e.exports&&(e.exports=function e(t,r,n){for(var a in r)if(r.hasOwnProperty(a)){var i=a,o=r[a];if(void 0===o&&(o=""),null===o&&(o=""),void 0!==n&&(i=n+"["+a+"]"),o.constructor===Array)i+="[]";else if("object"==typeof o){e(t,o,i);continue}var s=t.elements.namedItem(i);if(s)switch(s.type||s[0].type){default:s.value=o;break;case"radio":case"checkbox":for(var c=o.constructor===Array?o:[o],u=0;u<s.length;u++)s[u].checked=c.indexOf(s[u].value)>-1;break;case"select-multiple":c=o.constructor===Array?o:[o];for(var l=0;l<s.options.length;l++)s.options[l].selected=c.indexOf(s.options[l].value)>-1;break;case"select":case"select-one":s.value=o.toString()||o;break;case"date":s.value=new Date(o).toISOString().split("T")[0]}}})}},t={};function r(n){var a=t[n];if(void 0!==a)return a.exports;var i=t[n]={exports:{}};return e[n](i,i.exports,r),i.exports}(()=>{var e=window.mc4wp||{},t=r(8592);function n(e,r){t.trigger(r[0].id+"."+e,r),t.trigger(e,r)}function a(e,t){document.addEventListener(e,(function(e){if(e.target){var r=e.target,n=!1;"string"==typeof r.className&&(n=r.className.indexOf("mc4wp-form")>-1),n||"function"!=typeof r.matches||(n=r.matches(".mc4wp-form *")),n&&t.call(e,e)}}),!0)}if(r(1677),a("submit",(function(e){var r=t.getByElement(e.target);e.defaultPrevented||t.trigger(r.id+".submit",[r,e]),e.defaultPrevented||t.trigger("submit",[r,e])})),a("focus",(function(e){var r=t.getByElement(e.target);r.started||(n("started",[r,e]),r.started=!0)})),a("change",(function(e){n("change",[t.getByElement(e.target),e])})),e.listeners){for(var i=e.listeners,o=0;o<i.length;o++)t.on(i[o].event,i[o].callback);delete e.listeners}e.forms=t,window.mc4wp=e})()})();