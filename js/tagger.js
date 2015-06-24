var Tagger = function(wrap) {
	var that = {};
	that.error = false;

	var keypressFunc = function(e) {
		var char = getChar(e);
		var str = this.value + char;
		if(str.length < 3) {
			that.cancelError(this);
			return false;
		}
		var eq = new RegExp('^'+str+'$'),
			_eq = new RegExp('^'+str),
			arr = that.set;
		that.error = true;
		for(var i = 0; i < arr.length; i++) {
			if(eq.test(arr[i])) {
				that.createTag(str);
				this.value = "";				
				e.preventDefault();
				return false;
			} else if(_eq.test(arr[i])) {
				that.error = false;
			}
		}
		if(that.error) 
			that.showError(this);
		else
			that.cancelError(this);
	};

	$(wrap.el().getElementsByTagName('input')[0]).on('keypress', keypressFunc);

	that.createTag = function(val) { //default
		var input = wrap.el().getElementsByTagName('input')[0],
			el = wrap.insert('span', input).insertText(val).attr('class', 'form_tt_tag'),
			x = el.insert('span').insertText('✖'),
			w1 = el.el().offsetWidth,
			w2 = input.offsetWidth;

		$(input).style('width', (w2 - w1 - 20) + 'px'); //20 is span margin-right and input padding

		x.on('click', function() {
			var w1 = this.offsetWidth,
				input = this.parentNode.parentNode.getElementsByTagName('input')[0],
				w2 = input.offsetWidth;
			this.parentNode.parentNode.removeChild(this.parentNode);
			$(input).style('width', (w2 + w1 + 10) + 'px').el().focus();
		});
	};

	$(window).on('resize', function() {
		var input = wrap.el().getElementsByTagName('input')[0],
			parent = input.parentNode,
			new_input, w, tags;

		parent.removeChild(input);
		new_input = $(parent).append('input').attr('type', 'text');
		w = new_input.el().offsetWidth;
		console.log(w);
		tags = Array.prototype.slice.call(parent.children);
		tags.forEach(function(tag) {
			if(tag.tagName === 'SPAN') {
				w -= tag.offsetWidth;
				console.log(w);
			}
		});
		new_input.style('width', (w - 20) +'px');

		new_input.on('keypress', keypressFunc);
	});

	that.showError = function(el) { //default
		console.log('Error');
	};
	that.cancelError = function() { };

	function getChar(event) { //learn.javascript.ru
  		if (event.which == null) { // IE
    		if (event.keyCode < 32) return null; // спец. символ
    			return String.fromCharCode(event.keyCode)
 		}

  		if (event.which != 0 && event.charCode != 0) { // все кроме IE
    		if (event.which < 32) return null; // спец. символ
    			return String.fromCharCode(event.which); // остальные
  		}

  		return null; // спец. символ
	};

	return that;
};