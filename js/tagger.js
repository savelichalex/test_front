var Tagger = function(wrap) {
	var that = {};
	that.error = false;

	$(wrap.el().getElementsByTagName('input')[0]).on('keypress', function(e) {
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
	});

	that.createTag = function(val) { //default
		var input = wrap.el().getElementsByTagName('input')[0],
			el = wrap.insert('span', input).insertText(val).attr('class', 'form_tt_tag'),
			x = el.insert('span').insertText('✖'),
			w1 = el.el().offsetWidth,
			w2 = input.offsetWidth;

		$(input).style('width', (w2 - w1 - 10) + 'px'); //10 is span margin-right

		x.on('click', function() {
			var w1 = this.offsetWidth,
				input = this.parentNode.parentNode.getElementsByTagName('input')[0],
				w2 = input.offsetWidth;
			this.parentNode.parentNode.removeChild(this.parentNode);
			$(input).style('width', (w2 + w1 + 10) + 'px').el().focus();
		});
	};
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