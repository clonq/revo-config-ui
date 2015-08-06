clonq_revo_config_ui = {
	init: function(config){
		//todo: figure out the race condition and remove setTimeout
		setTimeout(function(){
			var pageTags = generatePage(config.template);
			$('.settings').append(pageTags);
		}, 100);
	}
}

function generateEntry(pair) {
	var row = $('<div class="row"/>');
	var leftCol = $('<div class="col-xs-3"/>');
	var rightCol = $('<div class="col-xs-9"/>');
	var key = Object.keys(pair)[0];
	var value = pair[key];
	var hasSubfields = !!value && typeof(value) === 'object';
	if(hasSubfields) {
		var label = $(['<label>', key, '</label>'].join(''));
		leftCol.append(label);
		row.append(leftCol);
		Object.keys(value).forEach(function(key){
			var subrow = $('<div class="row"/>');
			var rightLeftCol = $('<div class="col-xs-3"/>');
			var rightRightCol = $('<div class="col-xs-9"/>');
			var label = $(['<label>', key, '</label>'].join(''));
			var value = pair[key];
			var isMultivalue = !!value && !hasSubfields && value.split(' ').length > 1;
			var inputEl = $('<input/>');
			if(isMultivalue) {
			}
			rightLeftCol.append(label);
			rightRightCol.append(inputEl);
			subrow.append(rightLeftCol);
			subrow.append(rightRightCol);
			rightCol.append(subrow);
		})
		row.append(rightCol);
	} else {
		var label = $(['<label>', key, '</label>'].join(''));
		leftCol.append(label);
		row.append(leftCol);
		var isMultivalue = !!value && !hasSubfields && value.split(' ').length > 1;
		var inputEl = $('<input/>');
		if(isMultivalue) {
			inputEl = $('<select/>');
			value.split(' ').forEach(function(val){
				var option = $('<option/>');
				option.html(val);
				inputEl.append(option);
			});
		}
		rightCol.append(inputEl);
		row.append(rightCol);
	}
	return row;
}

function generateSection(template, section) {
	var sectionEl = $('<fieldset/>');
	var sectionTitleEl = $(['<legend>',section,'</legend>'].join(''));
	sectionEl.append(sectionTitleEl);
	var fieldPairs = Object.keys(template[section]).map(function(key){
		var ret = {};
		ret[key] = template[section][key];
		return ret;
	});
	fieldPairs.forEach(function(pair){
		var entry = generateEntry(pair);
		sectionEl.append(entry);
	})
	return sectionEl;
}

function generatePage(template) {
	var ret = [];
	var sections = Object.keys(template);
	sections.forEach(function(section){
		var sectionEl = generateSection(template, section);
		ret.push(sectionEl);
	});
	return ret;
}
/*
function generateForm(fieldList) {
	console.log(fieldList)
	var form = $('<form/>');
	Object.keys(fieldList).forEach(function(fieldName){
		var row = $('<div class="row"/>');
		var fieldValue = fieldList[fieldName];
		var label = $('<label/>')
		label.html(fieldName);
		var field;
		var col1 = $('<div class="col-md-3"/>');

		if(fieldValue) {
			var fieldset = $('<fieldset/>');
			if(typeof(fieldValue) === 'object') {
				var row = $('<div class="row"/>');
				if(!!label) {
					var legend = $('<legend/>');
					legend.html(label);
					fieldset.append(legend);
				}
				var subform = generateForm(fieldValue)
				fieldset.append(subform);
			} else if(typeof(fieldValue) === 'string') {
				if(fieldValue.split(' ').length > 1) {
					field = $('<select/>');
					fieldValue.split(' ').forEach(function(val){
						var option = $('<option/>');
						option.html(val);
						field.append(option);
					});
				}
			}
			row.append(fieldset);
			form.append(row);
		} else {
			field = $('<input/>');
			if(!!label) col1.append(label);
		}
		var col2 = $('<div class="col-md-9"/>');
		if(!!field) col2.append(field);
		row.append(col1);
		row.append(col2);
		form.append(row);
	});
	return form;
}
*/