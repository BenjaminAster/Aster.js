const e={equals:(e,t)=>e===t};let t=w;const n={},s={owned:null,cleanups:null,context:null,owner:null};var o=null;let r=null,l=null,u=null,i=null,f=0;function c(t,s){s=s?Object.assign({},e,s):e;const o={value:t,observers:null,observerSlots:null,pending:n,comparator:s.equals||void 0};return[h.bind(o),e=>("function"==typeof e&&(e=e(o.pending!==n?o.pending:o.value)),p(o,e))]}function a(e,t,n){g(v(e,t,!1,1))}function d(e){let t,n=r;return r=null,t=e(),r=n,t}function h(){if(this.state&&this.sources){const e=u;u=null,1===this.state?g(this):m(this),u=e}if(r){const e=this.observers?this.observers.length:0;r.sources?(r.sources.push(this),r.sourceSlots.push(e)):(r.sources=[this],r.sourceSlots=[e]),this.observers?(this.observers.push(r),this.observerSlots.push(r.sources.length-1)):(this.observers=[r],this.observerSlots=[r.sources.length-1])}return this.value}function p(e,t,s){if(e.comparator&&e.comparator(e.value,t))return t;if(l)return e.pending===n&&l.push(e),e.pending=t,t;let o=!1;return e.value=t,e.observers&&e.observers.length&&y((()=>{for(let t=0;t<e.observers.length;t+=1){const n=e.observers[t];o,n.pure?u.push(n):i.push(n),n.observers&&!n.state&&A(n),n.state=1}if(u.length>1e6)throw u=[],new Error}),!1),t}function g(e){if(!e.fn)return;S(e);const t=o,n=r,s=f;r=o=e,function(e,t,n){let s;try{s=e.fn(t)}catch(o){C(o)}(!e.updatedAt||e.updatedAt<=n)&&(e.observers&&e.observers.length?p(e,s):e.value=s,e.updatedAt=n)}(e,e.value,s),r=n,o=t}function v(e,t,n,r=1,l){const u={fn:e,state:r,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:t,owner:o,context:null,pure:n};return null===o||o!==s&&(o.owned?o.owned.push(u):o.owned=[u]),u}function b(e){if(1!==e.state)return e.state=0;if(e.suspense&&d(e.suspense.inFallback))return e.suspense.effects.push(e);const t=[e];for(;(e=e.owner)&&(!e.updatedAt||e.updatedAt<f);)e.state&&t.push(e);for(let n=t.length-1;n>=0;n--)if(1===(e=t[n]).state)g(e);else if(2===e.state){const t=u;u=null,m(e),u=t}}function y(e,s){if(u)return e();let o=!1;s||(u=[]),i?o=!0:i=[],f++;try{e()}catch(r){C(r)}finally{!function(e){u&&(w(u),u=null);if(e)return;i.length?function(e){if(l)return e();let t;const s=l=[];try{t=e()}finally{l=null}y((()=>{for(let e=0;e<s.length;e+=1){const t=s[e];if(t.pending!==n){const e=t.pending;t.pending=n,p(t,e)}}}),!1)}((()=>{t(i),i=null})):i=null}(o)}}function w(e){for(let t=0;t<e.length;t++)b(e[t])}function m(e){e.state=0;for(let t=0;t<e.sources.length;t+=1){const n=e.sources[t];n.sources&&(1===n.state?b(n):2===n.state&&m(n))}}function A(e){for(let t=0;t<e.observers.length;t+=1){const n=e.observers[t];n.state||(n.state=2,n.pure?u.push(n):i.push(n),n.observers&&A(n))}}function S(e){let t;if(e.sources)for(;e.sources.length;){const t=e.sources.pop(),n=e.sourceSlots.pop(),s=t.observers;if(s&&s.length){const e=s.pop(),o=t.observerSlots.pop();n<s.length&&(e.sourceSlots[o]=n,s[n]=e,t.observerSlots[n]=o)}}if(e.owned){for(t=0;t<e.owned.length;t++)S(e.owned[t]);e.owned=null}if(e.cleanups){for(t=0;t<e.cleanups.length;t++)e.cleanups[t]();e.cleanups=null}e.state=0,e.context=null}function C(e){throw e}function x(e,t){return d((()=>e(t)))}function N(t,s){return function(t,s,o){o=o?Object.assign({},e,o):e;const r=v(t,s,!0,0);return r.pending=n,r.observers=null,r.observerSlots=null,r.comparator=o.equals||void 0,g(r),h.bind(r)}(t,void 0,s?void 0:{equals:s})}function E(e,t,n){let s=n.length,o=t.length,r=s,l=0,u=0,i=t[o-1].nextSibling,f=null;for(;l<o||u<r;)if(t[l]!==n[u]){for(;t[o-1]===n[r-1];)o--,r--;if(o===l){const t=r<s?u?n[u-1].nextSibling:n[r-u]:i;for(;u<r;)e.insertBefore(n[u++],t)}else if(r===u)for(;l<o;)f&&f.has(t[l])||e.removeChild(t[l]),l++;else if(t[l]===n[r-1]&&n[u]===t[o-1]){const s=t[--o].nextSibling;e.insertBefore(n[u++],t[l++].nextSibling),e.insertBefore(n[--r],s),t[o]=n[r]}else{if(!f){f=new Map;let e=u;for(;e<r;)f.set(n[e],e++)}const s=f.get(t[l]);if(null!=s)if(u<s&&s<r){let i,c=l,a=1;for(;++c<o&&c<r&&null!=(i=f.get(t[c]))&&i===s+a;)a++;if(a>s-u){const o=t[l];for(;u<s;)e.insertBefore(n[u++],o)}else e.replaceChild(n[u++],t[l++])}else l++;else e.removeChild(t[l++])}}else l++,u++}function T(e,t,n){let l;return function(e,t){t&&(o=t);const n=r,l=o,u=0===e.length?s:{owned:null,cleanups:null,context:null,owner:l};let i;o=u,r=null;try{y((()=>i=e((()=>S(u)))),!0)}finally{r=n,o=l}}((s=>{l=s,D(t,e(),t.firstChild?null:void 0,n)})),()=>{l(),t.textContent=""}}function B(e,t,n){const s=document.createElement("template");s.innerHTML=e;let o=s.content.firstChild;return n&&(o=o.firstChild),o}function $(e,t=window.document){const n=t._$DX_DELEGATE||(t._$DX_DELEGATE=new Set);for(let s=0,o=e.length;s<o;s++){const o=e[s];n.has(o)||(n.add(o),t.addEventListener(o,j))}}function D(e,t,n,s){if(void 0===n||s||(s=[]),"function"!=typeof t)return q(e,t,s,n);a((s=>q(e,t(),s,n)),s)}function j(e){const t=`$$${e.type}`;let n=e.composedPath&&e.composedPath()[0]||e.target;for(e.target!==n&&Object.defineProperty(e,"target",{configurable:!0,value:n}),Object.defineProperty(e,"currentTarget",{configurable:!0,get:()=>n});null!==n;){const s=n[t];if(s&&!n.disabled){const o=n[`${t}Data`];if(void 0!==o?s(o,e):s(e),e.cancelBubble)return}n=n.host&&n.host!==n&&n.host instanceof Node?n.host:n.parentNode}}function q(e,t,n,s,o){for(;"function"==typeof n;)n=n();if(t===n)return n;const r=typeof t,l=void 0!==s;if(e=l&&n[0]&&n[0].parentNode||e,"string"===r||"number"===r)if("number"===r&&(t=t.toString()),l){let o=n[0];o&&3===o.nodeType?o.data=t:o=document.createTextNode(t),n=P(e,n,s,o)}else n=""!==n&&"string"==typeof n?e.firstChild.data=t:e.textContent=t;else if(null==t||"boolean"===r)n=P(e,n,s);else{if("function"===r)return a((()=>{let o=t();for(;"function"==typeof o;)o=o();n=q(e,o,n,s)})),()=>n;if(Array.isArray(t)){const r=[];if(L(r,t,o))return a((()=>n=q(e,r,n,s,!0))),()=>n;if(0===r.length){if(n=P(e,n,s),l)return n}else Array.isArray(n)?0===n.length?O(e,r,s):E(e,n,r):null==n||""===n?O(e,r):E(e,l&&n||[e.firstChild],r);n=r}else if(t instanceof Node){if(Array.isArray(n)){if(l)return n=P(e,n,s,t);P(e,n,null,t)}else null!=n&&""!==n&&e.firstChild?e.replaceChild(t,e.firstChild):e.appendChild(t);n=t}}return n}function L(e,t,n){let s=!1;for(let o=0,r=t.length;o<r;o++){let r,l=t[o];if(l instanceof Node)e.push(l);else if(null==l||!0===l||!1===l);else if(Array.isArray(l))s=L(e,l)||s;else if("string"==(r=typeof l))e.push(document.createTextNode(l));else if("function"===r)if(n){for(;"function"==typeof l;)l=l();s=L(e,Array.isArray(l)?l:[l])||s}else e.push(l),s=!0;else e.push(document.createTextNode(l.toString()))}return s}function O(e,t,n){for(let s=0,o=t.length;s<o;s++)e.insertBefore(t[s],n)}function P(e,t,n,s){if(void 0===n)return e.textContent="";const o=s||document.createTextNode("");if(t.length){let s=!1;for(let r=t.length-1;r>=0;r--){const l=t[r];if(o!==l){const t=l.parentNode===e;s||r?t&&e.removeChild(l):t?e.replaceChild(o,l):e.insertBefore(o,n)}else s=!0}}else e.insertBefore(o,n);return[o]}export{c as a,x as c,$ as d,D as i,N as m,T as r,B as t};
//# sourceMappingURL=vendor.db363134.js.map
