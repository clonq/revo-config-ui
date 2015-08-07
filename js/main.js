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

function addPair(parent, section, key, value) {
	var hasSubfields = !!value && typeof(value) === 'object';
	var label = $(['<label>', key, '</label>'].join(''));
	parent.append(label);
	var isMultivalue = !!value && !hasSubfields && value.split(' ').length > 1;
	var field = $('<input class="form-control" id="'+section+'_'+key+'"/>');
	if(isMultivalue) {
		field = $('<select class="form-control"/>');
		value.split(' ').forEach(function(val){
			var option = $('<option/>');
			option.html(val);
			field.append(option);
		});
	}
	parent.append(field);
}
function generateEntry(section, pair) {
	var group = $('<div class="form-group"/>');
	var key = Object.keys(pair)[0];
	var value = pair[key];
	var hasSubfields = !!value && typeof(value) === 'object';
	if(hasSubfields) {
		var well = $('<div class="well form-group"/>');
		var label = $(['<label>', key, '</label><br/><br/>'].join(''));
		well.append(label);
		Object.keys(value).forEach(function(key){
			var value = pair[key];
			addPair(well, section, key, value);
		});
		group.append(well);
	} else {
		addPair(group, section, key, value);
	}
	return group;
}

function generateSection(template, section) {
	var panel = $('<div class="panel panel-primary">');
	var panelHeader = $(['<div class="panel-heading">',section,'</div>'].join(''));
	panel.append(panelHeader);
	var panelBody = $('<div class="panel-body">');
	var fieldPairs = Object.keys(template[section]).map(function(key){
		var ret = {};
		ret[key] = template[section][key];
		return ret;
	});
	fieldPairs.forEach(function(pair){
		var entry = generateEntry(section, pair);
		panelBody.append(entry);
	})
	panel.append(panelBody);
	return panel;
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
	var addBtn = $(['<button class="btn btn-success add-btn" style="width:100%">', 'Add', '</button>'].join(''));
	col.append(addBtn);
	row.append(col);
	ret.push(row);
	return ret;
}
