	window.$on = function(target, type,cb){
		target.addEventListener(type,cb,false);
	} 

	var a = document.getElementById("handle");

var CORE =(function(){
	"use strict";

	//keep track of modules
	var modules = {};

	function addModule(module_id, mod){
		modules[module_id]= mod;
	}

	function registerEvents(evt,module_id){
		modules[module_id].events=evt;
	}

	function triggerEvents(evt){
		var mod;
		for(mod in modules){
			if(modules.hasOwnProperty(mod)){
				mod = modules[mod];
				if(mod.events && mod.events[evt.type]){
					mod.events[evt.type](evt.data);
				}
			}
		}
	}

	return{
		addModule: addModule,
		registerEvents: registerEvents,
		triggerEvents:triggerEvents,
	}
})();
			
			var sb = (function(){
				function listen(evt, module_id){
					CORE.registerEvents(evt,module_id);
				}

				function notify(evt){
					CORE.triggerEvents(evt);
				
				}

				return{
					listen:listen,
					notify:notify
				}

			})();


			var calculator =(function(){
				var id, input, handle, cels;

				id = "calculator-module";

				function init(){
					input = document.getElementById("temp");
					handle = document.getElementById("convert");

					$on(handle, "click", calculate);

				}

				function convert(f){
					return (f - 32)* (5/9);
				}

				function calculate(e){
					cels = convert(input.value);
					
					sb.notify({
						type:"notify-board",
						data:cels
					});

				e.preventDefault();
				}

				return{
					id:id,
					init:init,
					calculate:calculate
				}

			})();

			var board =(function(){
				var id, display;

				function init(){
					display = document.getElementById("board");

					sb.listen({
						"notify-board": refreshBoard
					},id);
				}

				function refreshBoard(cels){
					var p = document.createElement("p");
					var text = document.createTextNode(cels);
					p.appendChild(text);

					display.innerHTML = "";
					display.appendChild(p);
				}

				return{
					id:id,
					init:init,
					refreshBoard:refreshBoard
				}
			})();

			CORE.addModule(board.id,board);
			CORE.addModule(calculator.id, calculator);

			board.init();
			calculator.init();