clonq_revo_config_ui = {
	init: function(config){
		//todo: figure out the race condition and remove setTimeout
		setTimeout(function(){
			var pageTags = generatePage(config.template);
			$('.settings').append(pageTags);
			$('.add-btn').click(function(){
				var data = [];
				//todo: count all sections and finish implementation
				var sectionData = config.template;
				Object.keys(config.template).forEach(function(section){
					var fields = Object.keys(config.template[section]);
					fields.forEach(function(field){
						var inputId = [section, '_', field].join('');
						sectionData[section][field] = $('#'+inputId).val()
					})
				});
				alert(JSON.stringify(sectionData, null, 4));
			})
		}, 100);
	}
}

function generateEntry(section, pair) {
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
		var inputEl = $('<input id="'+section+'_'+key+'"/>');
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
		var entry = generateEntry(section, pair);
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
	var row = $('<div class="row"/>');
	var col = $('<div class="col-xs-12"/>');
	var addBtn = $(['<hr/>', '<button class="btn btn-primary add-btn">', 'Add', '</button>'].join(''));
	col.append(addBtn);
	row.append(col);
	ret.push(row);
	return ret;
}
