clonq_revo_config_ui = {
	init: function(config){
		// register listeners
		revo.registerCustomEventHandler('configuieventhandler', function(event, payload){
			if(event === 'config:get.response') { // we might add more than one form / register for more than one event
				if(!!payload && payload.component && payload.data) {
					// populate existing settings
					config.components.forEach(function(component){
						if(component.name === payload.component) {
							if(!!component.key) {
								var settingsDataArray = payload.data[component.key];
								settingsDataArray.forEach(function(settingsData){
									var settingsEntry = generateListEntry(settingsData);
									$('.list').append(settingsEntry);
								});
							}
						}
					});
				}
			}
		});
		// page setup
		document.addEventListener("revo:ready", function (e) {
			// set dom elements
			$('#revo-config-ui .title').html(config.title);
			config.components.forEach(function(component){
				// request existing settings
				revo.emit({ action:'get', model:'config', data:component.name });
				// component tab
				var menuItem = $('<li role="presentation" class="active"><a href="#">'+component.label+'</a></li>');
				$('#revo-config-ui .nav').append(menuItem);
				var pageTags = generatePage(component.template);
				// edit form
				$('#revo-config-ui .settings').append(pageTags);
				$('#revo-config-ui .add-btn').click(function(){
					var sectionData = captureSectionData(component);
					var settingsEntry = generateListEntry(sectionData);
					var configData = {};
					configData[component.name] = {};
					configData[component.name][component.key] = sectionData
					revo.emit({ action:'push', model:'config', data:configData });
					//todo: populate list based on config.<component>.change data
					$('.list').append(settingsEntry);
				})
			})
		});
	}
}

function captureSectionData(config) {
	var sectionData = config.template;
	Object.keys(config.template).forEach(function(section){
		var fields = Object.keys(config.template[section]);
		fields.forEach(function(field){
			var hasSubfields = !!config.template[section][field] && (typeof(config.template[section][field]) === 'object');
			if(hasSubfields) {
				var subfields = Object.keys(config.template[section][field]);
				subfields.forEach(function(subfield){
					var inputId = [section, '_', field, '_', subfield].join('');
					sectionData[section][field][subfield] = $('#'+inputId).val();
				});
			} else {
				var inputId = [section, '_', field].join('');
				sectionData[section][field] = $('#'+inputId).val();
			}
		});
	});
	return sectionData;
}

function generateListEntry(data) {
	var ret = [];
	var well = $('<div class="well"/>');
	var deleteBtn = $('<button type="button" class="btn btn-danger" style="float:right">Remove</button>');
	well.append(deleteBtn);
	Object.keys(data).forEach(function(section){
		var sectionEl = $('<blockquote/>');
		var title = $(['<p>', section, '</p>'].join(''));
		sectionEl.append(title);
		var footer = $('<footer/>');
		var fields = Object.keys(data[section]);
		fields.forEach(function(name){
			var value = data[section][name];
			var hasSubfields = !!value && (typeof(value) === 'object');
			if(hasSubfields) {
				var entry = $(['<div style="width:100%;overflow:hidden;white-space:nowrap;">', name, ': ', '</div>'].join(''));
				footer.append(entry);
				var subfields = Object.keys(value);
				subfields.forEach(function(subfield){
					var value = data[section][name][subfield];
					var subentry = $(['<div style="width:100%;overflow:hidden;white-space:nowrap;">', '&nbsp;&nbsp;&nbsp;&nbsp;', subfield, ': ', JSON.stringify(value), '</div>'].join(''));
					footer.append(subentry);
				});
			} else {
				var entry = $(['<div style="width:100%;overflow:hidden;white-space:nowrap;">', name, ': ', JSON.stringify(value), '</div>'].join(''));
				footer.append(entry);
			}
		});
		sectionEl.append(footer);
		well.append(sectionEl);
	});
	ret.push(well);		
	return ret;
}

function addPair(parent, section, key, label, value) {
	var fieldId = section+'_'+key;
	var hasSubfields = !!value && (typeof(value) === 'object');
	var lbl = $(['<label for="'+fieldId+'">', label, '</label>'].join(''));
	parent.append(lbl);
	var isMultivalue = !!value && !hasSubfields && value.split(' ').length > 1;
	var field = $('<input class="form-control" id="'+fieldId+'"/>');
	if(isMultivalue) {
		field = $('<select class="form-control" id="'+fieldId+'"/>');
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
		Object.keys(value).forEach(function(subkey){
			var value = pair[subkey];
			addPair(well, section, key+'_'+subkey, subkey, value);
		});
		group.append(well);
	} else {
		addPair(group, section, key, key, value);
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
