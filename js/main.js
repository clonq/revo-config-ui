clonq_revo_config_ui = {
	init: function(config){
		//todo: figure out the race condition and remove setTimeout
		setTimeout(function(){
			var template = config.template;
			Object.keys(template).forEach(function(key){
				var group = $('<h2/>');
				group.html(key);
				console.log(template[key])
				$('.settings').append(group);
			});
		}, 100);
	}
}
