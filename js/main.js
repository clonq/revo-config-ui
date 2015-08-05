clonq_revo_config_ui = {
	init: function(config){
		//todo: figure out the race condition and remove setTimeout
		setTimeout(function(){
			var template = config.template;
			Object.keys(template).forEach(function(key){
				var group = $('<h2/>');
				group.html(key);
				$('.settings').append(group);
				var fieldList = template[key];
				var form = generateForm(fieldList);
				$('.settings').append(form);
			});
		}, 100);
	}
}

function generateForm(fieldList) {
	var form = $('<form/>');
	Object.keys(fieldList).forEach(function(fieldName){
		var row = $('<div class="row"/>');
		var fieldValue = fieldList[fieldName];
		var label = $('<label/>')
		label.html(fieldName);
		var field;
		if(fieldValue) {
			if(typeof(fieldValue) === 'object') {
				//todo: add subfields
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
		} else {
			field = $('<input/>');
		}
		var col1 = $('<div class="col-md-3"/>');
		if(!!label) col1.append(label);
		var col2 = $('<div class="col-md-9"/>');
		if(!!field) col2.append(field);
		row.append(col1);
		row.append(col2);
		form.append(row);
	});
	return form;
}
