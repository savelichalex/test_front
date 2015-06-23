//util functions
//without var that var's would be in global scope
(function() {
	util = function() {
		this._el = null
	};
	util.prototype.el = function() { return this._el; };
	$ = function(el) {
		var u = new util();
		if(typeof el === 'string')
			u._el = document.getElementById(el);
		else
			u._el = el;
		return u;
	};
	$$ = function(el) {
		var u = new util();
		u._el = document.getElementsByClassName(el)[0];
		return u;
	};
	util.prototype.style = function(prop, val) {
		this._el.style[prop] = val;
		return this;
	};
	util.prototype.attr = function(attr, val) {
		this._el.setAttribute(attr, val);
		return this;
	};
	util.prototype.on = function(event, cb) {
		this._el.addEventListener(event, cb, false);
	};
	util.prototype.append = function(tag) {
		var newEl = document.createElement(tag);
		var link = this._el.appendChild(newEl);
		return $(link);
	};
	util.prototype.insert = function(tag, beforeEl) {
		var newEl = document.createElement(tag);
		if(beforeEl === void 0) {
			var link = this._el.insertBefore(newEl, this._el.firstChild);
		} else {
			var link = this._el.insertBefore(newEl, beforeEl);
		}

		return $(link);
	};
	util.prototype.insertText = function(text) {
		var textNode = document.createTextNode(text);
		var link = this._el.insertBefore(textNode, this._el.firstChild);
		return this;
	};
	util.prototype.inner = function(html) {
		this._el.innerHtml = html;
		return this;
	};
}());
