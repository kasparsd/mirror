/* Contents:
 - twentynineteen-priority-menu
 - twentynineteen-touch-navigation
 - comment-reply
 - wp-hooks
 - wp-i18n
 - wp-private-apis
 - wp-url
 - wp-api-fetch
 - wp-dom-ready
 - dambis-kit--aff
*/

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
	 * Adds class to an element.
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
	 * Deletes class from an element.
	 *
	 * @param {Object} el
	 * @param {string} cls
	 */
	function deleteClass(el, cls) {
		el.className = el.className.replace( new RegExp( '(?:^|\\s)' + cls + '(?!\\S)' ),'' );
	}

	/**
	 * Determines whether an element has the given class.
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
	 * Toggles Aria Expanded state for screenreaders.
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
	 * Opens sub-menu.
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
	 * Closes sub-menu.
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
	 * Finds first ancestor of an element by selector.
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
	 * Removes all off-canvas states.
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
	 * Toggles `focus` class to allow sub-menu access on touch screens.
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
window.addComment=function(v){var I,C,h,E=v.document,b={commentReplyClass:"comment-reply-link",commentReplyTitleId:"reply-title",cancelReplyId:"cancel-comment-reply-link",commentFormId:"commentform",temporaryFormId:"wp-temp-form-div",parentIdFieldId:"comment_parent",postIdFieldId:"comment_post_ID"},e=v.MutationObserver||v.WebKitMutationObserver||v.MozMutationObserver,i="querySelector"in E&&"addEventListener"in v,n=!!E.documentElement.dataset;function t(){o(),e&&new e(d).observe(E.body,{childList:!0,subtree:!0})}function o(e){if(i&&(I=g(b.cancelReplyId),C=g(b.commentFormId),I)){I.addEventListener("click",l);function t(e){if((e.metaKey||e.ctrlKey)&&13===e.keyCode&&"a"!==E.activeElement.tagName.toLowerCase())return C.removeEventListener("keydown",t),e.preventDefault(),C.submit.click(),!1}C&&C.addEventListener("keydown",t);for(var n=function(e){var t=b.commentReplyClass;e&&e.childNodes||(e=E);e=E.getElementsByClassName?e.getElementsByClassName(t):e.querySelectorAll("."+t);return e}(e),o=0,d=n.length;o<d;o++)n[o].addEventListener("click",r)}}function l(e){var t,n,o=g(b.temporaryFormId);o&&h&&(g(b.parentIdFieldId).value="0",t=o.textContent,o.parentNode.replaceChild(h,o),this.style.display="none",n=(o=(o=g(b.commentReplyTitleId))&&o.firstChild)&&o.nextSibling,o&&o.nodeType===Node.TEXT_NODE&&t&&(n&&"A"===n.nodeName&&n.id!==b.cancelReplyId&&(n.style.display=""),o.textContent=t),e.preventDefault())}function r(e){var t=g(b.commentReplyTitleId),t=t&&t.firstChild.textContent,n=this,o=a(n,"belowelement"),d=a(n,"commentid"),i=a(n,"respondelement"),l=a(n,"postid"),n=a(n,"replyto")||t;o&&d&&i&&l&&!1===v.addComment.moveForm(o,d,i,l,n)&&e.preventDefault()}function d(e){for(var t=e.length;t--;)if(e[t].addedNodes.length)return void o()}function a(e,t){return n?e.dataset[t]:e.getAttribute("data-"+t)}function g(e){return E.getElementById(e)}return i&&"loading"!==E.readyState?t():i&&v.addEventListener("DOMContentLoaded",t,!1),{init:o,moveForm:function(e,t,n,o,d){var i,l,r,a,m,c,s,e=g(e),n=(h=g(n),g(b.parentIdFieldId)),y=g(b.postIdFieldId),p=g(b.commentReplyTitleId),u=(p=p&&p.firstChild)&&p.nextSibling;if(e&&h&&n){void 0===d&&(d=p&&p.textContent),a=h,m=b.temporaryFormId,c=g(m),s=(s=g(b.commentReplyTitleId))?s.firstChild.textContent:"",c||((c=E.createElement("div")).id=m,c.style.display="none",c.textContent=s,a.parentNode.insertBefore(c,a)),o&&y&&(y.value=o),n.value=t,I.style.display="",e.parentNode.insertBefore(h,e.nextSibling),p&&p.nodeType===Node.TEXT_NODE&&(u&&"A"===u.nodeName&&u.id!==b.cancelReplyId&&(u.style.display="none"),p.textContent=d),I.onclick=function(){return!1};try{for(var f=0;f<C.elements.length;f++)if(i=C.elements[f],l=!1,"getComputedStyle"in v?r=v.getComputedStyle(i):E.documentElement.currentStyle&&(r=i.currentStyle),(i.offsetWidth<=0&&i.offsetHeight<=0||"hidden"===r.visibility)&&(l=!0),"hidden"!==i.type&&!i.disabled&&!l){i.focus();break}}catch(e){}return!1}}}}(window);



/* Minit: /wp-includes/js/dist/hooks.min.js */
/*! This file is auto-generated */
(function() {
"use strict";var wp;(wp||={}).hooks=(()=>{var v=Object.defineProperty;var S=Object.getOwnPropertyDescriptor;var g=Object.getOwnPropertyNames;var I=Object.prototype.hasOwnProperty;var w=(e,n)=>{for(var s in n)v(e,s,{get:n[s],enumerable:!0})},D=(e,n,s,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let t of g(n))!I.call(e,t)&&t!==s&&v(e,t,{get:()=>n[t],enumerable:!(r=S(n,t))||r.enumerable});return e};var T=e=>D(v({},"__esModule",{value:!0}),e);var le={};w(le,{actions:()=>ae,addAction:()=>J,addFilter:()=>K,applyFilters:()=>N,applyFiltersAsync:()=>ee,createHooks:()=>F,currentAction:()=>te,currentFilter:()=>re,defaultHooks:()=>b,didAction:()=>ie,didFilter:()=>se,doAction:()=>X,doActionAsync:()=>Y,doingAction:()=>ne,doingFilter:()=>oe,filters:()=>ce,hasAction:()=>P,hasFilter:()=>Q,removeAction:()=>L,removeAllActions:()=>U,removeAllFilters:()=>W,removeFilter:()=>M});function z(e){return typeof e!="string"||e===""?(console.error("The namespace must be a non-empty string."),!1):/^[a-zA-Z][a-zA-Z0-9_.\-\/]*$/.test(e)?!0:(console.error("The namespace can only contain numbers, letters, dashes, periods, underscores and slashes."),!1)}var m=z;function E(e){return typeof e!="string"||e===""?(console.error("The hook name must be a non-empty string."),!1):/^__/.test(e)?(console.error("The hook name cannot begin with `__`."),!1):/^[a-zA-Z][a-zA-Z0-9_.-]*$/.test(e)?!0:(console.error("The hook name can only contain numbers, letters, dashes, periods and underscores."),!1)}var f=E;function Z(e,n){return function(r,t,a,i=10){let c=e[n];if(!f(r)||!m(t))return;if(typeof a!="function"){console.error("The hook callback must be a function.");return}if(typeof i!="number"){console.error("If specified, the hook priority must be a number.");return}let l={callback:a,priority:i,namespace:t};if(c[r]){let o=c[r].handlers,d;for(d=o.length;d>0&&!(i>=o[d-1].priority);d--);d===o.length?o[d]=l:o.splice(d,0,l),c.__current.forEach(h=>{h.name===r&&h.currentIndex>=d&&h.currentIndex++})}else c[r]={handlers:[l],runs:0};r!=="hookAdded"&&e.doAction("hookAdded",r,t,a,i)}}var H=Z;function C(e,n,s=!1){return function(t,a){let i=e[n];if(!f(t)||!s&&!m(a))return;if(!i[t])return 0;let c=0;if(s)c=i[t].handlers.length,i[t]={runs:i[t].runs,handlers:[]};else{let l=i[t].handlers;for(let o=l.length-1;o>=0;o--)l[o].namespace===a&&(l.splice(o,1),c++,i.__current.forEach(d=>{d.name===t&&d.currentIndex>=o&&d.currentIndex--}))}return t!=="hookRemoved"&&e.doAction("hookRemoved",t,a),c}}var p=C;function O(e,n){return function(r,t){let a=e[n];return typeof t<"u"?r in a&&a[r].handlers.some(i=>i.namespace===t):r in a}}var _=O;function j(e,n,s,r){return function(a,...i){let c=e[n];c[a]||(c[a]={handlers:[],runs:0}),c[a].runs++;let l=c[a].handlers;if(!l||!l.length)return s?i[0]:void 0;let o={name:a,currentIndex:0};async function d(){try{c.__current.add(o);let u=s?i[0]:void 0;for(;o.currentIndex<l.length;)u=await l[o.currentIndex].callback.apply(null,i),s&&(i[0]=u),o.currentIndex++;return s?u:void 0}finally{c.__current.delete(o)}}function h(){try{c.__current.add(o);let u=s?i[0]:void 0;for(;o.currentIndex<l.length;)u=l[o.currentIndex].callback.apply(null,i),s&&(i[0]=u),o.currentIndex++;return s?u:void 0}finally{c.__current.delete(o)}}return(r?d:h)()}}var A=j;function $(e,n){return function(){let r=e[n];return Array.from(r.__current).at(-1)?.name??null}}var y=$;function V(e,n){return function(r){let t=e[n];return typeof r>"u"?t.__current.size>0:Array.from(t.__current).some(a=>a.name===r)}}var k=V;function q(e,n){return function(r){let t=e[n];if(f(r))return t[r]&&t[r].runs?t[r].runs:0}}var x=q;var B=class{actions;filters;addAction;addFilter;removeAction;removeFilter;hasAction;hasFilter;removeAllActions;removeAllFilters;doAction;doActionAsync;applyFilters;applyFiltersAsync;currentAction;currentFilter;doingAction;doingFilter;didAction;didFilter;constructor(){this.actions=Object.create(null),this.actions.__current=new Set,this.filters=Object.create(null),this.filters.__current=new Set,this.addAction=H(this,"actions"),this.addFilter=H(this,"filters"),this.removeAction=p(this,"actions"),this.removeFilter=p(this,"filters"),this.hasAction=_(this,"actions"),this.hasFilter=_(this,"filters"),this.removeAllActions=p(this,"actions",!0),this.removeAllFilters=p(this,"filters",!0),this.doAction=A(this,"actions",!1,!1),this.doActionAsync=A(this,"actions",!1,!0),this.applyFilters=A(this,"filters",!0,!1),this.applyFiltersAsync=A(this,"filters",!0,!0),this.currentAction=y(this,"actions"),this.currentFilter=y(this,"filters"),this.doingAction=k(this,"actions"),this.doingFilter=k(this,"filters"),this.didAction=x(this,"actions"),this.didFilter=x(this,"filters")}};function G(){return new B}var F=G;var b=F(),{addAction:J,addFilter:K,removeAction:L,removeFilter:M,hasAction:P,hasFilter:Q,removeAllActions:U,removeAllFilters:W,doAction:X,doActionAsync:Y,applyFilters:N,applyFiltersAsync:ee,currentAction:te,currentFilter:re,doingAction:ne,doingFilter:oe,didAction:ie,didFilter:se,actions:ae,filters:ce}=b;return T(le);})();
(window.wp ||= {}).hooks = wp.hooks;
})();




/* Minit: /wp-includes/js/dist/i18n.min.js */
/*! This file is auto-generated */
(function() {
"use strict";var wp;(wp||={}).i18n=(()=>{var nt=Object.create;var L=Object.defineProperty;var at=Object.getOwnPropertyDescriptor;var it=Object.getOwnPropertyNames;var ut=Object.getPrototypeOf,lt=Object.prototype.hasOwnProperty;var ft=(t,r)=>()=>(r||t((r={exports:{}}).exports,r),r.exports),ot=(t,r)=>{for(var e in r)L(t,e,{get:r[e],enumerable:!0})},O=(t,r,e,n)=>{if(r&&typeof r=="object"||typeof r=="function")for(let u of it(r))!lt.call(t,u)&&u!==e&&L(t,u,{get:()=>r[u],enumerable:!(n=at(r,u))||n.enumerable});return t};var st=(t,r,e)=>(e=t!=null?nt(ut(t)):{},O(r||!t||!t.__esModule?L(e,"default",{value:t,enumerable:!0}):e,t)),pt=t=>O(L({},"__esModule",{value:!0}),t);var $=ft((It,M)=>{M.exports=window.wp.hooks});var yt={};ot(yt,{__:()=>Z,_n:()=>G,_nx:()=>B,_x:()=>q,createI18n:()=>R,defaultI18n:()=>H,getLocaleData:()=>j,hasTranslation:()=>Q,isRTL:()=>J,resetLocaleData:()=>U,setLocaleData:()=>z,sprintf:()=>P,subscribe:()=>X});var ct=/%(((\d+)\$)|(\(([$_a-zA-Z][$_a-zA-Z0-9]*)\)))?[ +0#-]*\d*(\.(\d+|\*))?(ll|[lhqL])?([cduxXefgsp%])/g;function T(t,...r){var e=0;return Array.isArray(r[0])&&(r=r[0]),t.replace(ct,function(){var n,u,l,o,f;return n=arguments[3],u=arguments[5],l=arguments[7],o=arguments[9],o==="%"?"%":(l==="*"&&(l=r[e],e++),u===void 0?(n===void 0&&(n=e+1),e++,f=r[n-1]):r[0]&&typeof r[0]=="object"&&r[0].hasOwnProperty(u)&&(f=r[0][u]),o==="f"?f=parseFloat(f)||0:o==="d"&&(f=parseInt(f)||0),l!==void 0&&(o==="f"?f=f.toFixed(l):o==="s"&&(f=f.substr(0,l))),f??"")})}function P(t,...r){return T(t,...r)}var D,I,h,N;D={"(":9,"!":8,"*":7,"/":7,"%":7,"+":6,"-":6,"<":5,"<=":5,">":5,">=":5,"==":4,"!=":4,"&&":3,"||":2,"?":1,"?:":1};I=["(","?"];h={")":["("],":":["?","?:"]};N=/<=|>=|==|!=|&&|\|\||\?:|\(|!|\*|\/|%|\+|-|<|>|\?|\)|:/;function b(t){for(var r=[],e=[],n,u,l,o;n=t.match(N);){for(u=n[0],l=t.substr(0,n.index).trim(),l&&r.push(l);o=e.pop();){if(h[u]){if(h[u][0]===o){u=h[u][1]||u;break}}else if(I.indexOf(o)>=0||D[o]<D[u]){e.push(o);break}r.push(o)}h[u]||e.push(u),t=t.substr(n.index+u.length)}return t=t.trim(),t&&r.push(t),r.concat(e.reverse())}var dt={"!":function(t){return!t},"*":function(t,r){return t*r},"/":function(t,r){return t/r},"%":function(t,r){return t%r},"+":function(t,r){return t+r},"-":function(t,r){return t-r},"<":function(t,r){return t<r},"<=":function(t,r){return t<=r},">":function(t,r){return t>r},">=":function(t,r){return t>=r},"==":function(t,r){return t===r},"!=":function(t,r){return t!==r},"&&":function(t,r){return t&&r},"||":function(t,r){return t||r},"?:":function(t,r,e){if(t)throw r;return e}};function g(t,r){var e=[],n,u,l,o,f,_;for(n=0;n<t.length;n++){if(f=t[n],o=dt[f],o){for(u=o.length,l=Array(u);u--;)l[u]=e.pop();try{_=o.apply(null,l)}catch(v){return v}}else r.hasOwnProperty(f)?_=r[f]:_=+f;e.push(_)}return e[0]}function A(t){var r=b(t);return function(e){return g(r,e)}}function E(t){var r=A(t);return function(e){return+r({n:e})}}var S={contextDelimiter:"",onMissingKey:null};function _t(t){var r,e,n;for(r=t.split(";"),e=0;e<r.length;e++)if(n=r[e].trim(),n.indexOf("plural=")===0)return n.substr(7)}function x(t,r){var e;this.data=t,this.pluralForms={},this.options={};for(e in S)this.options[e]=r!==void 0&&e in r?r[e]:S[e]}x.prototype.getPluralForm=function(t,r){var e=this.pluralForms[t],n,u,l;return e||(n=this.data[t][""],l=n["Plural-Forms"]||n["plural-forms"]||n.plural_forms,typeof l!="function"&&(u=_t(n["Plural-Forms"]||n["plural-forms"]||n.plural_forms),l=E(u)),e=this.pluralForms[t]=l),e(r)};x.prototype.dcnpgettext=function(t,r,e,n,u){var l,o,f;return u===void 0?l=0:l=this.getPluralForm(t,u),o=e,r&&(o=r+this.options.contextDelimiter+e),f=this.data[t][o],f&&f[l]?f[l]:(this.options.onMissingKey&&this.options.onMissingKey(e,t),l===0?e:n)};var K={"":{plural_forms(t){return t===1?0:1}}},vt=/^i18n\.(n?gettext|has_translation)(_|$)/,R=(t,r,e)=>{let n=new x({}),u=new Set,l=()=>{u.forEach(a=>a())},o=a=>(u.add(a),()=>u.delete(a)),f=(a="default")=>n.data[a],_=(a,i="default")=>{n.data[i]={...n.data[i],...a},n.data[i][""]={...K[""],...n.data[i]?.[""]},delete n.pluralForms[i]},v=(a,i)=>{_(a,i),l()},V=(a,i="default")=>{n.data[i]={...n.data[i],...a,"":{...K[""],...n.data[i]?.[""],...a?.[""]}},delete n.pluralForms[i],l()},W=(a,i)=>{n.data={},n.pluralForms={},v(a,i)},m=(a="default",i,s,c,d)=>(n.data[a]||_(void 0,a),n.dcnpgettext(a,i,s,c,d)),y=a=>a||"default",Y=(a,i)=>{let s=m(i,void 0,a);return e?(s=e.applyFilters("i18n.gettext",s,a,i),e.applyFilters("i18n.gettext_"+y(i),s,a,i)):s},w=(a,i,s)=>{let c=m(s,i,a);return e?(c=e.applyFilters("i18n.gettext_with_context",c,a,i,s),e.applyFilters("i18n.gettext_with_context_"+y(s),c,a,i,s)):c},k=(a,i,s,c)=>{let d=m(c,void 0,a,i,s);return e?(d=e.applyFilters("i18n.ngettext",d,a,i,s,c),e.applyFilters("i18n.ngettext_"+y(c),d,a,i,s,c)):d},tt=(a,i,s,c,d)=>{let F=m(d,c,a,i,s);return e?(F=e.applyFilters("i18n.ngettext_with_context",F,a,i,s,c,d),e.applyFilters("i18n.ngettext_with_context_"+y(d),F,a,i,s,c,d)):F},rt=()=>w("ltr","text direction")==="rtl",et=(a,i,s)=>{let c=i?i+""+a:a,d=!!n.data?.[s??"default"]?.[c];return e&&(d=e.applyFilters("i18n.has_translation",d,a,i,s),d=e.applyFilters("i18n.has_translation_"+y(s),d,a,i,s)),d};if(t&&v(t,r),e){let a=i=>{vt.test(i)&&l()};e.addAction("hookAdded","core/i18n",a),e.addAction("hookRemoved","core/i18n",a)}return{getLocaleData:f,setLocaleData:v,addLocaleData:V,resetLocaleData:W,subscribe:o,__:Y,_x:w,_n:k,_nx:tt,isRTL:rt,hasTranslation:et}};var C=st($(),1);var p=R(void 0,void 0,C.defaultHooks),H=p,j=p.getLocaleData.bind(p),z=p.setLocaleData.bind(p),U=p.resetLocaleData.bind(p),X=p.subscribe.bind(p),Z=p.__.bind(p),q=p._x.bind(p),G=p._n.bind(p),B=p._nx.bind(p),J=p.isRTL.bind(p),Q=p.hasTranslation.bind(p);return pt(yt);})();
(window.wp ||= {}).i18n = wp.i18n;
})();




/* Minit: /wp-includes/js/dist/private-apis.min.js */
/*! This file is auto-generated */
(function() {
"use strict";var wp;(wp||={}).privateApis=(()=>{var n=Object.defineProperty;var w=Object.getOwnPropertyDescriptor;var p=Object.getOwnPropertyNames;var l=Object.prototype.hasOwnProperty;var u=(r,e)=>{for(var o in e)n(r,o,{get:e[o],enumerable:!0})},c=(r,e,o,d)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of p(e))!l.call(r,s)&&s!==o&&n(r,s,{get:()=>e[s],enumerable:!(d=w(e,s))||d.enumerable});return r};var f=r=>c(n({},"__esModule",{value:!0}),r);var g={};u(g,{__dangerousOptInToUnstableAPIsOnlyForCoreModules:()=>i});var h=["@wordpress/admin-ui","@wordpress/api-fetch","@wordpress/block-directory","@wordpress/block-editor","@wordpress/block-library","@wordpress/blocks","@wordpress/boot","@wordpress/commands","@wordpress/compose","@wordpress/connectors","@wordpress/workflows","@wordpress/components","@wordpress/content-types","@wordpress/core-commands","@wordpress/core-data","@wordpress/customize-widgets","@wordpress/data","@wordpress/edit-post","@wordpress/edit-site","@wordpress/edit-widgets","@wordpress/editor","@wordpress/font-list-route","@wordpress/format-library","@wordpress/patterns","@wordpress/preferences","@wordpress/reusable-blocks","@wordpress/rich-text","@wordpress/route","@wordpress/router","@wordpress/routes","@wordpress/storybook","@wordpress/sync","@wordpress/theme","@wordpress/dataviews","@wordpress/fields","@wordpress/lazy-editor","@wordpress/media-editor","@wordpress/media-utils","@wordpress/upload-media","@wordpress/global-styles-engine","@wordpress/global-styles-ui","@wordpress/ui","@wordpress/views","@wordpress/widget-dashboard"],b="I acknowledge private features are not for use in themes or plugins and doing so will break in the next version of WordPress.",i=(r,e)=>{if(!h.includes(e))throw new Error(`You tried to opt-in to unstable APIs as module "${e}". This feature is only for JavaScript modules shipped with WordPress core. Please do not use it in plugins and themes as the unstable APIs will be removed without a warning. If you ignore this error and depend on unstable features, your product will inevitably break on one of the next WordPress releases.`);if(r!==b)throw new Error("You tried to opt-in to unstable APIs without confirming you know the consequences. This feature is only for JavaScript modules shipped with WordPress core. Please do not use it in plugins and themes as the unstable APIs will removed without a warning. If you ignore this error and depend on unstable features, your product will inevitably break on the next WordPress release.");return{lock:m,unlock:y}};function m(r,e){if(!r)throw new Error("Cannot lock an undefined object.");let o=r;t in o||(o[t]={}),a.set(o[t],e)}function y(r){if(!r)throw new Error("Cannot unlock an undefined object.");let e=r;if(!(t in e))throw new Error("Cannot unlock an object that was not locked before. ");return a.get(e[t])}var a=new WeakMap,t=Symbol("Private API ID");return f(g);})();
(window.wp ||= {}).privateApis = wp.privateApis;
})();




/* Minit: /wp-includes/js/dist/url.min.js */
/*! This file is auto-generated */
(function() {
"use strict";var wp;(wp||={}).url=(()=>{var M=Object.create;var l=Object.defineProperty;var Y=Object.getOwnPropertyDescriptor;var j=Object.getOwnPropertyNames;var B=Object.getPrototypeOf,K=Object.prototype.hasOwnProperty;var W=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),Z=(e,t)=>{for(var r in t)l(e,r,{get:t[r],enumerable:!0})},E=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of j(t))!K.call(e,o)&&o!==r&&l(e,o,{get:()=>t[o],enumerable:!(n=Y(t,o))||n.enumerable});return e};var J=(e,t,r)=>(r=e!=null?M(B(e)):{},E(t||!e||!e.__esModule?l(r,"default",{value:e,enumerable:!0}):r,e)),ee=e=>E(l({},"__esModule",{value:!0}),e);var L=W((Me,U)=>{var z={\u00C0:"A",\u00C1:"A",\u00C2:"A",\u00C3:"A",\u00C4:"A",\u00C5:"A",\u1EA4:"A",\u1EAE:"A",\u1EB2:"A",\u1EB4:"A",\u1EB6:"A",\u00C6:"AE",\u1EA6:"A",\u1EB0:"A",\u0202:"A",\u1EA2:"A",\u1EA0:"A",\u1EA8:"A",\u1EAA:"A",\u1EAC:"A",\u00C7:"C",\u1E08:"C",\u00C8:"E",\u00C9:"E",\u00CA:"E",\u00CB:"E",\u1EBE:"E",\u1E16:"E",\u1EC0:"E",\u1E14:"E",\u1E1C:"E",\u0206:"E",\u1EBA:"E",\u1EBC:"E",\u1EB8:"E",\u1EC2:"E",\u1EC4:"E",\u1EC6:"E",\u00CC:"I",\u00CD:"I",\u00CE:"I",\u00CF:"I",\u1E2E:"I",\u020A:"I",\u1EC8:"I",\u1ECA:"I",\u00D0:"D",\u00D1:"N",\u00D2:"O",\u00D3:"O",\u00D4:"O",\u00D5:"O",\u00D6:"O",\u00D8:"O",\u1ED0:"O",\u1E4C:"O",\u1E52:"O",\u020E:"O",\u1ECE:"O",\u1ECC:"O",\u1ED4:"O",\u1ED6:"O",\u1ED8:"O",\u1EDC:"O",\u1EDE:"O",\u1EE0:"O",\u1EDA:"O",\u1EE2:"O",\u00D9:"U",\u00DA:"U",\u00DB:"U",\u00DC:"U",\u1EE6:"U",\u1EE4:"U",\u1EEC:"U",\u1EEE:"U",\u1EF0:"U",\u00DD:"Y",\u00E0:"a",\u00E1:"a",\u00E2:"a",\u00E3:"a",\u00E4:"a",\u00E5:"a",\u1EA5:"a",\u1EAF:"a",\u1EB3:"a",\u1EB5:"a",\u1EB7:"a",\u00E6:"ae",\u1EA7:"a",\u1EB1:"a",\u0203:"a",\u1EA3:"a",\u1EA1:"a",\u1EA9:"a",\u1EAB:"a",\u1EAD:"a",\u00E7:"c",\u1E09:"c",\u00E8:"e",\u00E9:"e",\u00EA:"e",\u00EB:"e",\u1EBF:"e",\u1E17:"e",\u1EC1:"e",\u1E15:"e",\u1E1D:"e",\u0207:"e",\u1EBB:"e",\u1EBD:"e",\u1EB9:"e",\u1EC3:"e",\u1EC5:"e",\u1EC7:"e",\u00EC:"i",\u00ED:"i",\u00EE:"i",\u00EF:"i",\u1E2F:"i",\u020B:"i",\u1EC9:"i",\u1ECB:"i",\u00F0:"d",\u00F1:"n",\u00F2:"o",\u00F3:"o",\u00F4:"o",\u00F5:"o",\u00F6:"o",\u00F8:"o",\u1ED1:"o",\u1E4D:"o",\u1E53:"o",\u020F:"o",\u1ECF:"o",\u1ECD:"o",\u1ED5:"o",\u1ED7:"o",\u1ED9:"o",\u1EDD:"o",\u1EDF:"o",\u1EE1:"o",\u1EDB:"o",\u1EE3:"o",\u00F9:"u",\u00FA:"u",\u00FB:"u",\u00FC:"u",\u1EE7:"u",\u1EE5:"u",\u1EED:"u",\u1EEF:"u",\u1EF1:"u",\u00FD:"y",\u00FF:"y",\u0100:"A",\u0101:"a",\u0102:"A",\u0103:"a",\u0104:"A",\u0105:"a",\u0106:"C",\u0107:"c",\u0108:"C",\u0109:"c",\u010A:"C",\u010B:"c",\u010C:"C",\u010D:"c",C\u0306:"C",c\u0306:"c",\u010E:"D",\u010F:"d",\u0110:"D",\u0111:"d",\u0112:"E",\u0113:"e",\u0114:"E",\u0115:"e",\u0116:"E",\u0117:"e",\u0118:"E",\u0119:"e",\u011A:"E",\u011B:"e",\u011C:"G",\u01F4:"G",\u011D:"g",\u01F5:"g",\u011E:"G",\u011F:"g",\u0120:"G",\u0121:"g",\u0122:"G",\u0123:"g",\u0124:"H",\u0125:"h",\u0126:"H",\u0127:"h",\u1E2A:"H",\u1E2B:"h",\u0128:"I",\u0129:"i",\u012A:"I",\u012B:"i",\u012C:"I",\u012D:"i",\u012E:"I",\u012F:"i",\u0130:"I",\u0131:"i",\u0132:"IJ",\u0133:"ij",\u0134:"J",\u0135:"j",\u0136:"K",\u0137:"k",\u1E30:"K",\u1E31:"k",K\u0306:"K",k\u0306:"k",\u0139:"L",\u013A:"l",\u013B:"L",\u013C:"l",\u013D:"L",\u013E:"l",\u013F:"L",\u0140:"l",\u0141:"l",\u0142:"l",\u1E3E:"M",\u1E3F:"m",M\u0306:"M",m\u0306:"m",\u0143:"N",\u0144:"n",\u0145:"N",\u0146:"n",\u0147:"N",\u0148:"n",\u0149:"n",N\u0306:"N",n\u0306:"n",\u014C:"O",\u014D:"o",\u014E:"O",\u014F:"o",\u0150:"O",\u0151:"o",\u0152:"OE",\u0153:"oe",P\u0306:"P",p\u0306:"p",\u0154:"R",\u0155:"r",\u0156:"R",\u0157:"r",\u0158:"R",\u0159:"r",R\u0306:"R",r\u0306:"r",\u0212:"R",\u0213:"r",\u015A:"S",\u015B:"s",\u015C:"S",\u015D:"s",\u015E:"S",\u0218:"S",\u0219:"s",\u015F:"s",\u0160:"S",\u0161:"s",\u0162:"T",\u0163:"t",\u021B:"t",\u021A:"T",\u0164:"T",\u0165:"t",\u0166:"T",\u0167:"t",T\u0306:"T",t\u0306:"t",\u0168:"U",\u0169:"u",\u016A:"U",\u016B:"u",\u016C:"U",\u016D:"u",\u016E:"U",\u016F:"u",\u0170:"U",\u0171:"u",\u0172:"U",\u0173:"u",\u0216:"U",\u0217:"u",V\u0306:"V",v\u0306:"v",\u0174:"W",\u0175:"w",\u1E82:"W",\u1E83:"w",X\u0306:"X",x\u0306:"x",\u0176:"Y",\u0177:"y",\u0178:"Y",Y\u0306:"Y",y\u0306:"y",\u0179:"Z",\u017A:"z",\u017B:"Z",\u017C:"z",\u017D:"Z",\u017E:"z",\u017F:"s",\u0192:"f",\u01A0:"O",\u01A1:"o",\u01AF:"U",\u01B0:"u",\u01CD:"A",\u01CE:"a",\u01CF:"I",\u01D0:"i",\u01D1:"O",\u01D2:"o",\u01D3:"U",\u01D4:"u",\u01D5:"U",\u01D6:"u",\u01D7:"U",\u01D8:"u",\u01D9:"U",\u01DA:"u",\u01DB:"U",\u01DC:"u",\u1EE8:"U",\u1EE9:"u",\u1E78:"U",\u1E79:"u",\u01FA:"A",\u01FB:"a",\u01FC:"AE",\u01FD:"ae",\u01FE:"O",\u01FF:"o",\u00DE:"TH",\u00FE:"th",\u1E54:"P",\u1E55:"p",\u1E64:"S",\u1E65:"s",X\u0301:"X",x\u0301:"x",\u0403:"\u0413",\u0453:"\u0433",\u040C:"\u041A",\u045C:"\u043A",A\u030B:"A",a\u030B:"a",E\u030B:"E",e\u030B:"e",I\u030B:"I",i\u030B:"i",\u01F8:"N",\u01F9:"n",\u1ED2:"O",\u1ED3:"o",\u1E50:"O",\u1E51:"o",\u1EEA:"U",\u1EEB:"u",\u1E80:"W",\u1E81:"w",\u1EF2:"Y",\u1EF3:"y",\u0200:"A",\u0201:"a",\u0204:"E",\u0205:"e",\u0208:"I",\u0209:"i",\u020C:"O",\u020D:"o",\u0210:"R",\u0211:"r",\u0214:"U",\u0215:"u",B\u030C:"B",b\u030C:"b",\u010C\u0323:"C",\u010D\u0323:"c",\u00CA\u030C:"E",\u00EA\u030C:"e",F\u030C:"F",f\u030C:"f",\u01E6:"G",\u01E7:"g",\u021E:"H",\u021F:"h",J\u030C:"J",\u01F0:"j",\u01E8:"K",\u01E9:"k",M\u030C:"M",m\u030C:"m",P\u030C:"P",p\u030C:"p",Q\u030C:"Q",q\u030C:"q",\u0158\u0329:"R",\u0159\u0329:"r",\u1E66:"S",\u1E67:"s",V\u030C:"V",v\u030C:"v",W\u030C:"W",w\u030C:"w",X\u030C:"X",x\u030C:"x",Y\u030C:"Y",y\u030C:"y",A\u0327:"A",a\u0327:"a",B\u0327:"B",b\u0327:"b",\u1E10:"D",\u1E11:"d",\u0228:"E",\u0229:"e",\u0190\u0327:"E",\u025B\u0327:"e",\u1E28:"H",\u1E29:"h",I\u0327:"I",i\u0327:"i",\u0197\u0327:"I",\u0268\u0327:"i",M\u0327:"M",m\u0327:"m",O\u0327:"O",o\u0327:"o",Q\u0327:"Q",q\u0327:"q",U\u0327:"U",u\u0327:"u",X\u0327:"X",x\u0327:"x",Z\u0327:"Z",z\u0327:"z",\u0439:"\u0438",\u0419:"\u0418",\u0451:"\u0435",\u0401:"\u0415"},D=Object.keys(z).join("|"),ie=new RegExp(D,"g"),ae=new RegExp(D,"");function se(e){return z[e]}var H=function(e){return e.replace(ie,se)},ce=function(e){return!!e.match(ae)};U.exports=H;U.exports.has=ce;U.exports.remove=H});var pe={};Z(pe,{addQueryArgs:()=>w,buildQueryString:()=>u,cleanForSlug:()=>X,filterURLForDisplay:()=>$,getAuthority:()=>P,getFilename:()=>q,getFragment:()=>A,getPath:()=>d,getPathAndQueryString:()=>C,getProtocol:()=>R,getQueryArg:()=>h,getQueryArgs:()=>s,getQueryString:()=>p,hasQueryArg:()=>N,isEmail:()=>g,isPhoneNumber:()=>I,isURL:()=>O,isValidAuthority:()=>Q,isValidFragment:()=>T,isValidPath:()=>v,isValidProtocol:()=>S,isValidQueryString:()=>b,normalizePath:()=>_,prependHTTP:()=>x,prependHTTPS:()=>G,removeQueryArgs:()=>F,safeDecodeURI:()=>V,safeDecodeURIComponent:()=>y});function O(e){try{return new URL(e),!0}catch{return!1}}var te=/^(mailto:)?[a-z0-9._%+-]+@[a-z0-9][a-z0-9.-]*\.[a-z]{2,63}$/i;function g(e){return te.test(e)}var re=/^(tel:)?(\+)?\d{6,15}$/;function I(e){return e=e.replace(/[-.() ]/g,""),re.test(e)}function R(e){let t=/^([^\s:]+:)/.exec(e);if(t)return t[1]}function S(e){return e?/^[a-z\-.\+]+[0-9]*:$/i.test(e):!1}function P(e){let t=/^[^\/\s:]+:(?:\/\/)?\/?([^\/\s#?]+)[\/#?]{0,1}\S*$/.exec(e);if(t)return t[1]}function Q(e){return e?/^[^\s#?]+$/.test(e):!1}function d(e){let t=/^[^\/\s:]+:(?:\/\/)?[^\/\s#?]+[\/]([^\s#?]+)[#?]{0,1}\S*$/.exec(e);if(t)return t[1]}function v(e){return e?/^[^\s#?]+$/.test(e):!1}function p(e){let t;try{t=new URL(e,"http://example.com").search.substring(1)}catch{}if(t)return t}function u(e){let t="",r=Object.entries(e),n;for(;n=r.shift();){let[o,i]=n;if(Array.isArray(i)||i&&i.constructor===Object){let c=Object.entries(i).reverse();for(let[m,f]of c)r.unshift([`${o}[${m}]`,f])}else i!==void 0&&(i===null&&(i=""),t+="&"+[o,String(i)].map(encodeURIComponent).join("="))}return t.substr(1)}function b(e){return e?/^[^\s#?\/]+$/.test(e):!1}function C(e){let t=d(e),r=p(e),n="/";return t&&(n+=t),r&&(n+=`?${r}`),n}function A(e){let t=/^\S+?(#[^\s\?]*)/.exec(e);if(t)return t[1]}function T(e){return e?/^#[^\s#?\/]*$/.test(e):!1}function y(e){try{return decodeURIComponent(e)}catch{return e}}function oe(e,t,r){let n=t.length,o=n-1;for(let i=0;i<n;i++){let a=t[i];!a&&Array.isArray(e)&&(a=e.length.toString()),a=["__proto__","constructor","prototype"].includes(a)?a.toUpperCase():a;let c=!isNaN(Number(t[i+1]));e[a]=i===o?r:e[a]||(c?[]:{}),Array.isArray(e[a])&&!c&&(e[a]={...e[a]}),e=e[a]}}function s(e){return(p(e)||"").replace(/\+/g,"%20").split("&").reduce((t,r)=>{let[n,o=""]=r.split("=").filter(Boolean).map(y);if(n){let i=n.replace(/\]/g,"").split("[");oe(t,i,o)}return t},Object.create(null))}function w(e="",t){if(!t||!Object.keys(t).length)return e;let r=A(e)||"",n=e.replace(r,""),o=e.indexOf("?");return o!==-1&&(t=Object.assign(s(e),t),n=n.substr(0,o)),n+"?"+u(t)+r}function h(e,t){return s(e)[t]}function N(e,t){return h(e,t)!==void 0}function F(e,...t){let r=e.replace(/^[^#]*/,"");e=e.replace(/#.*/,"");let n=e.indexOf("?");if(n===-1)return e+r;let o=s(e),i=e.substr(0,n);t.forEach(m=>delete o[m]);let a=u(o);return(a?i+"?"+a:i)+r}var ne=/^(?:[a-z]+:|#|\?|\.|\/)/i;function x(e){return e&&(e=e.trim(),!ne.test(e)&&!g(e)?"http://"+e:e)}function V(e){try{return decodeURI(e)}catch{return e}}function $(e,t=null){if(!e)return"";let r=e.replace(/^[a-z\-.\+]+[0-9]*:(\/\/)?/i,"").replace(/^www\./i,"");r.match(/^[^\/]+\/$/)&&(r=r.replace("/",""));let n=/\/([^\/?]+)\.(?:[\w]+)(?=\?|$)/;if(!t||r.length<=t||!r.match(n))return r;r=r.split("?")[0];let o=r.split("/"),i=o[o.length-1];if(i.length<=t)return"\u2026"+r.slice(-t);let a=i.lastIndexOf("."),[c,m]=[i.slice(0,a),i.slice(a+1)],f=c.slice(-3)+"."+m;return i.slice(0,t-f.length-1)+"\u2026"+f}var k=J(L(),1);function X(e){return e?(0,k.default)(e).replace(/(&nbsp;|&ndash;|&mdash;)/g,"-").replace(/[\s\./]+/g,"-").replace(/&\S+?;/g,"").replace(/[^\p{L}\p{N}_-]+/gu,"").toLowerCase().replace(/-+/g,"-").replace(/(^-+)|(-+$)/g,""):""}function q(e){let t;if(e){try{t=new URL(e,"http://example.com").pathname.split("/").pop()}catch{}if(t)return t}}function _(e){let t=e.split("?"),r=t[1],n=t[0];return r?n+"?"+r.split("&").map(o=>o.split("=")).map(o=>o.map(decodeURIComponent)).sort((o,i)=>o[0].localeCompare(i[0])).map(o=>o.map(encodeURIComponent)).map(o=>o.join("=")).join("&"):n}function G(e){return!e||e.startsWith("http://")?e:(e=x(e),e.replace(/^http:/,"https:"))}return ee(pe);})();
(window.wp ||= {}).url = wp.url;
})();




/* Minit: /wp-includes/js/dist/api-fetch.min.js */
/*! This file is auto-generated */
(function() {
"use strict";var wp;(wp||={}).apiFetch=(()=>{var re=Object.create;var g=Object.defineProperty;var ae=Object.getOwnPropertyDescriptor;var te=Object.getOwnPropertyNames;var de=Object.getPrototypeOf,ne=Object.prototype.hasOwnProperty;var O=(e,r)=>()=>(r||e((r={exports:{}}).exports,r),r.exports),ie=(e,r)=>{for(var a in r)g(e,a,{get:r[a],enumerable:!0})},S=(e,r,a,t)=>{if(r&&typeof r=="object"||typeof r=="function")for(let n of te(r))!ne.call(e,n)&&n!==a&&g(e,n,{get:()=>r[n],enumerable:!(t=ae(r,n))||t.enumerable});return e};var p=(e,r,a)=>(a=e!=null?re(de(e)):{},S(r||!e||!e.__esModule?g(a,"default",{value:e,enumerable:!0}):a,e)),le=e=>S(g({},"__esModule",{value:!0}),e);var y=O((Ne,j)=>{j.exports=window.wp.i18n});var k=O((Se,I)=>{I.exports=window.wp.privateApis});var v=O((Fe,G)=>{G.exports=window.wp.url});var Ue={};ie(Ue,{default:()=>T});var L=p(y(),1);var C=p(k(),1),{lock:H,unlock:je}=(0,C.__dangerousOptInToUnstableAPIsOnlyForCoreModules)("I acknowledge private features are not for use in themes or plugins and doing so will break in the next version of WordPress.","@wordpress/api-fetch");function oe(e){let r=(a,t)=>{let{headers:n={}}=a;for(let d in n)if(d.toLowerCase()==="x-wp-nonce"&&n[d]===r.nonce)return t(a);return t({...a,headers:{...n,"X-WP-Nonce":r.nonce}})};return r.nonce=e,r}var Q=oe;var se=(e,r)=>{let a=e.path,t,n;return typeof e.namespace=="string"&&typeof e.endpoint=="string"&&(t=e.namespace.replace(/^\/|\/$/g,""),n=e.endpoint.replace(/^\//,""),n?a=t+"/"+n:a=t),delete e.namespace,delete e.endpoint,r({...e,path:a})},E=se;var ce=e=>(r,a)=>E(r,t=>{let n=t.url,d=t.path,l;return typeof d=="string"&&(l=e,e.indexOf("?")!==-1&&(d=d.replace("?","&")),d=d.replace(/^\//,""),typeof l=="string"&&l.indexOf("?")!==-1&&(d=d.replace("?","&")),n=l+d),a({...t,url:n})}),F=ce;var m=p(v(),1),x=Symbol("preloadingEnableMultiUse"),R=Symbol("preloadingClear");function ue(e){let{OPTIONS:r={},...a}=Object.fromEntries(Object.entries(e).map(([i,s])=>[(0,m.normalizePath)(i),s])),t=new Set(Object.keys(a)),n=new Set(Object.keys(r)),d=!1,l=(i,s)=>{let{parse:c=!0}=i,_=i.path;if(!_&&i.url){let{rest_route:h,...ee}=(0,m.getQueryArgs)(i.url);typeof h=="string"&&(_=(0,m.addQueryArgs)(h,ee))}if(typeof _!="string")return s(i);let N=i.method||"GET",f=(0,m.normalizePath)(_);if(N==="GET"&&a[f]){let h=a[f];return d||delete a[f],t.delete(f),z(h,!!c)}else if(N==="OPTIONS"&&r[f]){let h=r[f];return d||delete r[f],n.delete(f),z(h,!!c)}return s(i)};return l[x]=()=>{d=!0},l[R]=()=>{let i=[...Array.from(t,s=>`GET ${s}`),...Array.from(n,s=>`OPTIONS ${s}`)];i.length?console.warn("[api-fetch][preload] Some preloads were never consumed:",i):console.log("[api-fetch][preload] All preloads consumed."),t.clear(),n.clear();for(let s of Object.keys(a))delete a[s];for(let s of Object.keys(r))delete r[s]},l}function z(e,r){if(r)return Promise.resolve(e.body);try{return Promise.resolve(new window.Response(JSON.stringify(e.body),{status:200,statusText:"OK",headers:e.headers}))}catch{return Object.entries(e.headers).forEach(([a,t])=>{a.toLowerCase()==="link"&&(e.headers[a]=t.replace(/<([^>]+)>/,(n,d)=>`<${encodeURI(d)}>`))}),Promise.resolve(r?e.body:new window.Response(JSON.stringify(e.body),{status:200,statusText:"OK",headers:e.headers}))}}var $=ue;var b=p(v(),1);var fe=({path:e,url:r,...a},t)=>({...a,url:r&&(0,b.addQueryArgs)(r,t),path:e&&(0,b.addQueryArgs)(e,t)}),D=e=>e.json?e.json():Promise.reject(e),pe=e=>{if(!e)return{};let r=e.match(/<([^>]+)>; rel="next"/);return r?{next:r[1]}:{}},J=e=>{let{next:r}=pe(e.headers.get("link"));return r},me=e=>{let r=!!e.path&&e.path.indexOf("per_page=-1")!==-1,a=!!e.url&&e.url.indexOf("per_page=-1")!==-1;return r||a},he=async(e,r)=>{if(e.parse===!1||!me(e))return r(e);let a=await T({...fe(e,{per_page:100}),parse:!1}),t=await D(a);if(!Array.isArray(t))return t;let n=J(a);if(!n)return t;let d=[].concat(t);for(;n;){let l=await T({...e,path:void 0,url:n,parse:!1}),i=await D(l);d=d.concat(i),n=J(l)}return d},U=he;var we=new Set(["PATCH","PUT","DELETE"]),ve="GET",_e=(e,r)=>{let{method:a=ve}=e;return we.has(a.toUpperCase())&&(e={...e,headers:{"Content-Type":"application/json",...e.headers,"X-HTTP-Method-Override":a},method:"POST"}),r(e)},q=_e;var w=p(v(),1),ge=(e,r)=>(typeof e.url=="string"&&!(0,w.hasQueryArg)(e.url,"_locale")&&(e.url=(0,w.addQueryArgs)(e.url,{_locale:"user"})),typeof e.path=="string"&&!(0,w.hasQueryArg)(e.path,"_locale")&&(e.path=(0,w.addQueryArgs)(e.path,{_locale:"user"})),r(e)),B=ge;var X=p(y(),1);var V=p(y(),1);async function K(e){try{return await e.json()}catch{throw{code:"invalid_json",message:(0,V.__)("The response is not a valid JSON response.")}}}async function A(e,r=!0){return r?e.status===204?null:await K(e):e}async function M(e,r=!0){throw r?await K(e):e}function ye(e){let r=!!e.method&&e.method==="POST";return(!!e.path&&e.path.indexOf("/wp/v2/media")!==-1||!!e.url&&e.url.indexOf("/wp/v2/media")!==-1)&&r}var Ee=(e,r)=>{if(!ye(e))return r(e);let a=0,t=5,n=d=>(a++,r({path:`/wp/v2/media/${d}/post-process`,method:"POST",data:{action:"create-image-subsizes"},parse:!1}).catch(()=>a<t?n(d):(r({path:`/wp/v2/media/${d}?force=true`,method:"DELETE"}),Promise.reject())));return r({...e,parse:!1}).catch(d=>{if(!(d instanceof globalThis.Response))return Promise.reject(d);let l=d.headers.get("x-wp-upload-attachment-id");return d.status>=500&&d.status<600&&l?n(l).catch(()=>e.parse!==!1?Promise.reject({code:"post_process",message:(0,X.__)("Media upload failed. If this is a photo or a large image, please scale it down and try again.")}):Promise.reject(d)):M(d,e.parse)}).then(d=>A(d,e.parse))},W=Ee;var u=p(v(),1),Te=e=>(r,a)=>{if(typeof r.url=="string"){let t=(0,u.getQueryArg)(r.url,"wp_theme_preview");t===void 0?r.url=(0,u.addQueryArgs)(r.url,{wp_theme_preview:e}):t===""&&(r.url=(0,u.removeQueryArgs)(r.url,"wp_theme_preview"))}if(typeof r.path=="string"){let t=(0,u.getQueryArg)(r.path,"wp_theme_preview");t===void 0?r.path=(0,u.addQueryArgs)(r.path,{wp_theme_preview:e}):t===""&&(r.path=(0,u.removeQueryArgs)(r.path,"wp_theme_preview"))}return a(r)},Y=Te;var Ae={Accept:"application/json, */*;q=0.1"},Me={credentials:"include"},P=[B,E,q,U];function Pe(e){P.unshift(e)}function Oe(){for(let e of P)e[x]?.()}function xe(){for(let e of P)e[R]?.()}var Re=e=>{let{url:r,path:a,data:t,parse:n=!0,...d}=e,{body:l,headers:i}=e;return i={...Ae,...i},t&&(l=JSON.stringify(t),i["Content-Type"]="application/json"),globalThis.fetch(r||a||window.location.href,{...Me,...d,body:l,headers:i}).then(c=>c.ok?A(c,n):M(c,n),c=>{throw c&&c.name==="AbortError"?c:globalThis.navigator.onLine?{code:"fetch_error",message:(0,L.__)("Could not get a valid response from the server.")}:{code:"offline_error",message:(0,L.__)("Unable to connect. Please check your Internet connection.")}})},Z=Re;function be(e){Z=e}var o=e=>P.reduceRight((a,t)=>n=>t(n,a),Z)(e).catch(a=>a.code!=="rest_cookie_invalid_nonce"?Promise.reject(a):globalThis.fetch(o.nonceEndpoint).then(t=>t.ok?t.text():Promise.reject(a)).then(t=>(o.nonceMiddleware.nonce=t,o(e))));o.use=Pe;o.setFetchHandler=be;o.privateApis={};H(o.privateApis,{enablePreloadMultiUse:Oe,clearPreloadedData:xe});o.createNonceMiddleware=Q;o.createPreloadingMiddleware=$;o.createRootURLMiddleware=F;o.fetchAllMiddleware=U;o.mediaUploadMiddleware=W;o.createThemePreviewMiddleware=Y;var T=o;return le(Ue);})();
if (typeof wp.apiFetch === 'object' && wp.apiFetch.default) { wp.apiFetch = wp.apiFetch.default; }
(window.wp ||= {}).apiFetch = wp.apiFetch;
})();




/* Minit: /wp-includes/js/dist/dom-ready.min.js */
/*! This file is auto-generated */
(function() {
"use strict";var wp;(wp||={}).domReady=(()=>{var o=Object.defineProperty;var u=Object.getOwnPropertyDescriptor;var a=Object.getOwnPropertyNames;var i=Object.prototype.hasOwnProperty;var f=(e,t)=>{for(var n in t)o(e,n,{get:t[n],enumerable:!0})},m=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let d of a(t))!i.call(e,d)&&d!==n&&o(e,d,{get:()=>t[d],enumerable:!(r=u(t,d))||r.enumerable});return e};var c=e=>m(o({},"__esModule",{value:!0}),e);var p={};f(p,{default:()=>y});function y(e){if(!(typeof document>"u")){if(document.readyState==="complete"||document.readyState==="interactive")return void e();document.addEventListener("DOMContentLoaded",e)}}return c(p);})();
if (typeof wp.domReady === 'object' && wp.domReady.default) { wp.domReady = wp.domReady.default; }
(window.wp ||= {}).domReady = wp.domReady;
})();




/* Minit: https://kasparsdambis.lv/wp-content/plugins/dambis-kit/build/js/modules/affiliate.js */
(()=>{"use strict";var e={n:r=>{var t=r&&r.__esModule?()=>r.default:()=>r;return e.d(t,{a:t}),t},d:(r,t)=>{for(var n in t)e.o(t,n)&&!e.o(r,n)&&Object.defineProperty(r,n,{enumerable:!0,get:t[n]})},o:(e,r)=>Object.prototype.hasOwnProperty.call(e,r)};const r=window.wp.domReady;var t=e.n(r);const n=window.wp.apiFetch;var a=e.n(n);const o=window.wp.url;t()(()=>{const e={onclickHrefPatterns:["amazon."]},r={urls:{}};function t(e){const t=(0,o.addQueryArgs)("/dambis-kit/v1/aff-url",{url:e});return r.urls[e]||(r.urls[e]=a()({path:t}).then(e=>e.url).catch(()=>e)),r.urls[e]}function n(e){const r=e.currentTarget;e.preventDefault(),t(r.href).then(e=>{"_blank"===r.target?window.open(e,"_blank","noopener,noreferrer"):window.location.assign(e)})}document.querySelectorAll("a[href]").forEach(r=>{e.onclickHrefPatterns.some(e=>r.href.includes(e))&&(r.addEventListener("mouseenter",e=>{t(e.currentTarget.href)}),r.addEventListener("focus",e=>{t(e.currentTarget.href)},!0),r.addEventListener("touchstart",e=>{t(e.currentTarget.href)},{passive:!0}),r.addEventListener("click",n))})})})();