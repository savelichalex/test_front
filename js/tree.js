var Tree = (function() {
	'use strict';

	/**
	 * Node class is basic for all nodes
	 */
	function Node(el) {
		var that = Object.create(Node.prototype);

		that._setCheck = function() {
			if(this.status === 'checked') return;
			el.el().indeterminate = false;
			el.el().checked = true;
			this.status = 'checked';
		};
		that._setUncheck = function() {
			if(this.status === 'unchecked') return;
			el.el().indeterminate = false;
			el.el().checked =false;
			this.status = 'unchecked';
		};
		that.setIndeterminate = function() {
			if(this.status === 'indeterminate') return;
			el.el().indeterminate = true;
			this.status = 'indeterminate';
		};

		el.on('click', function() {
			that.toggle();
		});

		return that;
	};

	Node.prototype = {
		_parent: null,
		status: 'unchecked'
	};

	/**
	 * ListNode class
	 */
	function ListNode(el, parentNode) {
		var that = Node(el);
		
		that._parent = parentNode || null;
		that.setCheck = that._setCheck;
		that.setUncheck = that._setUncheck;
		that.getChildsCount = function() { return 1; };
		that.getActiveCount = function() {
			return this.status === 'checked' ? 1 : 0;
		};
		that.toggle = function() {
			if(this.status === 'checked') {
				this.setUncheck();
			} else if(this.status === 'unchecked') {
				this.setCheck();
			}
			if(this._parent !== null) this._parent.changed();
		};

		return that;
	};

	/**
	 * ParentNode class
	 */

	function ParentNode(el, parentNode) {
		var that = Node(el),
		_childs = [],
		_activeCount = 0;

		that._parent = parentNode || null;
		that.addChild = function(listNode) {
			_childs.push(listNode);
		};
		that.getChildsCount = function() {
			var childsCount = 0;

			_childs.forEach(function(child) {
				childsCount += child.getChildsCount();
			});

			return childsCount;
		};
		that.getActiveCount = function() {
			var activeCount = 0;

			_childs.forEach(function(child) {
				activeCount += child.getActiveCount();
			});

			return activeCount;
		};
		that.setCheck = function() {
			this._setCheck();
			_childs.forEach(function(child) { child.setCheck(); });
		};
		that.setUncheck = function() {
			this._setUncheck();
			_childs.forEach(function(child) { child.setUncheck(); });
		};
		that.changed = function() {
			var childsCount = this.getChildsCount(),
				activeCount = this.getActiveCount();
			
			if(activeCount === childsCount) {
				this.setCheck();
			} else if(activeCount > 0 && activeCount < childsCount) {
				this.setIndeterminate();
			} else if(activeCount === 0) {
				this.setUncheck();
			}
			if(this._parent !== null) this._parent.changed();
		};
		that.toggle = function() {
			if(this.status === 'checked') {
				this.setUncheck();
			} else if(this.status === 'unchecked' || this.status === 'indeterminate') {
				this.setCheck();
			}
			if(this._parent !== null) this._parent.changed();
		};

		return that;
	};

	/**
	 * Parse function is build tree
	 */
	function Parse(wrap) {
		function parentToChilds(el, parent) {
			var arr = Array.prototype.slice.call(el.children),
				len = arr.length;
				
			for(var i = 0; i < len; i++) {
				if(arr[i+1] !== undefined && arr[i].tagName === 'LABEL' && arr[i+1].tagName === 'FIELDSET') {
					var p = new ParentNode($(arr[i].children[0]), parent);
					if(parent !== null) parent.addChild(p);
					parentToChilds(arr[i+1], p);
				} else if(arr[i].tagName === 'LABEL') {
					var list = new ListNode($(arr[i].children[0]), parent);
					if(parent !== null) parent.addChild(list);
				}
			}
		}

		parentToChilds(wrap, null);
	};

	return Parse;
}());