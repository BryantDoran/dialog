/*  Än( ÒnamespaceÓ, ÒglobalÓ )
 * namespace String: to call, attached to foundation
 * foundation object: the object to append
 */
( function( namespace, foundation ){ 
	foundation[ namespace ] = {
		dialog: ''
	};	
}( 'bryant', typeof window === 'undefined' ? this : window ) ); /* call Òanonymous ÄnÓ and pass in the ÒwindowÓ object */

( function( namespace, foundation, global ){ 
	var collection = namespace + 's',
			foundation_name = foundation,
			error_message = 'Dialog module installation failed.\n';
	
	try {
		/* test for the existance of ÒfoundationÓ */
		if ( ! global[ foundation ] || typeof global[ foundation ] !== 'object' ){ 
			throw error_message + 'Couldn\'t find the `foundation` specified.'; 
		} else {
			foundation = global[ foundation ];
		}
		
		/* test for the existance of the prefered collection namespace */
		if ( foundation[ collection ] ){ /* exists: error */
			throw error_message + 'namespace `' + collection + '` already taken.';
		} else { /* doesn't exist: create */
			collection = foundation[ collection ] = [];
		}
		
		/* test for the existance of the prefered namespace */
		if( foundation[ namespace ] ){
			throw error_message + 'namespace `' + namespace + '` already taken.';
		}

		/* extend the foundation supplied by attaching the  dialog class to it */
		foundation[ namespace ] = function( options, classes ){
			var	return_space = {},	
					dialog = {
						about: {
							author: 'Bryant Fusco',
							version: 1,
							subversion: 0,
							initialized_at: new Date(),
							foundation_name: foundation_name,
							namespace: namespace
						},
						defaults: {
							height: 50,
							width: 200,
							heading: namespace,
							message: '[no message supplied]',
							classes: namespace,
							fade_in_duration: 100,
							fade_out_duration: 100,
							slide_in_duration: 300,
							slide_out_duration: 300,
							autoclose_delay: 0,
							close_on_click: true,
							trigger: document.body
						},
						collection: collection,
						collection_index: collection.length,
						mask: global.document.createElement( 'div' ),
						frame: global.document.createElement( 'div' ),
						heading: global.document.createElement( 'h1' ),
						close_button: global.document.createElement( 'a' ),
						contents: global.document.createElement( 'div' ),
						footer: global.document.createElement( 'footer' ),
						buttons: [], /* Array button collection: [ {button}, ... ] */
						guid: function( length ){
							var	chars = 'abcdefghijklmnopqrstuvwxyz',
									new_id = '',
									step = -1;
					
							chars += chars.toUpperCase() + '1234567890';
							while ( step++ < length ){
								new_id += chars.charAt( Math.floor( Math.random() * 62 ) );	
							}	
							
							this.guid = new_id;
							return this.guid;
						},
						repack_options: function( options ){
							/* switch on typeof the options passed in on the initial dailog 
							 * call.  This should be either: 
							 * string: Just fire a no-frills dialog and use this as the message
							 * array[ strings ]: no-frills dialog. array values in a list
							 * object: full or partially filled dialog definition
							 *
							 * When processed, the .show() method of the dialog class will 
							 * Only take a dialog definition, so this! function will take 
							 * all of the available information { user, default, developer }
							 * and decide the final architetual plans, then return those plans
							 * for further processing.
							 * 
							 * The architectural dialog plan is as follows:
							 * {
							 * 		height: int - dialog frame height. default 200
							 *		width: int - dialog container width. default 300
							 *		autoclose_delay: int - the milliseconds to wait until auto 
							 *						closing the dialog.  A value of 0 will disable the
							 *						autoclose feature.  default 0
							 *		url: string - a url to load contents from; an extrnal source
							 *						Uses JQuery.load temporarily and should be replaced
							 *					  with a native code solution in a future revision to
							 *					  remove dependencies. default ''
							 *		fade_in_duration: int - milliseconds between the start and stop 
							 *						of the fade in animation.  Uses the JQuery.animate function
							 *					  and should be replace with a native code solution in a 
							 *						future revision to remove dependencies. default 300
							 *		fade_out_duration: int - milliseconds between the start and stop 
							 *						of the fade out animation.  Uses the JQuery.animate function
							 *					  and should be replace with a native code solution in a 
							 *						future revision to remove dependencies. default 300
							 *		slide_in_duration: int - milliseconds between the start and stop 
							 *						of the slide in animation.  Uses the JQuery.animate function
							 *					  and should be replace with a native code solution in a 
							 *						future revision to remove dependencies. default 300
							 *		slide_out_duration: int - milliseconds between the start and stop 
							 *						of the slide out animation.  Uses the JQuery.animate function
							 *					  and should be replace with a native code solution in a 
							 *						future revision to remove dependencies. default 300	
							 *		heading: string - an the html contents of an H1 element; 
							 *						div[mask] > div[frame] > h1[heading] > div[contents] > ...
							 *						default window.document.body.title
							 *		message: string | array[ strings ] : default ''
							 *						- string, html to fill the contents of the dialog, or 
							 *							preceeding the html data returned from an external
							 *							source.
							 *						- array[ strings ], strings of html to be used as the 
							 *							contents of LI elements of an unordered list.
							 *		before_load( fn( dialog ){ callback process } ): fn, 
							 *						callback function fired between initialization and the
							 *						creation of the contents of the dailog respectively
							 *						caller `this` = dialog object
							 *		after_load( contents, dailog ): fn, callback function fired between the creation of 
							 *						the contents of the dialog and the show dialog animation
							 *						caller `this`: dailog contents container
							 *		before_show( fn( dialog ){ callback process } ): fn
							 *						callback function fired at the same time as the 
							 *						previous callback, after_load.  An alias
							 *						caller `this`: dailog object
							 *		after_show( fn( dailog ){ callback process } ): fn
							 *						callback function fired at the start of the time 
							 *						between the showing of the dialog component and user 
							 *						interaction
							 *						caller `this`: dialog object
							 *		before_hide: fn, callback function fired between user interaction
							 *						and the start of the animation that moves the dialog off 
							 *						the screen
							 *		after_hide:	fn, callback function fired once the animations to 
							 *						move the dialog offscreen, but before the dialog is 
							 *						destroyed from both the dom and memory
							 *		buttons: array[ objects ], collection of button plans
							 *
							 * }
							 */
							 var	rebuild = options.defaults,
							 			classes = options.classes,
							 			options = options.options,
							 			return_list = function( array ){
							 				return '<ul><li>' + array.join( '</li><li>' ) + '</li></ul>';
							 			},
							 			choose = function( test_value, otherwise ){
				 							return test_value ? test_value : otherwise;
				 						};
				 						
							 /* handle `options` as a string */
							 if ( typeof options === 'string' )
							 	rebuild.message = options;

							 /* handle `options` as an object */
							 if ( typeof options === 'object' ){
							 	/* handle `options as an array */
							 	if ( options.length )
							 		rebuild.message = return_list( options );

							 	/* handle an array as the message property of an object */
								if ( typeof options.message === 'object' && options.message.length )
							 		rebuild.message = return_list( options.message );
							 		
							 	/* handle a string as the message property of an object */	
							 	if ( typeof options.message === 'string' )
							 		rebuild.message = choose( options.message, rebuild.message );
							 }
							 
							 rebuild.heading = choose( options.heading, rebuild.heading );
							 rebuild.width = choose( options.heading, rebuild.width );
							 rebuild.height = choose( options.height, rebuild.height );
							 rebuild.autoclose_delay = choose( options.autoclose_delay, rebuild.autoclose_delay );
							 rebuild.fade_in_duration = choose( options.fade_in_duration, rebuild.fade_in_duration );
							 rebuild.fade_out_duration = choose( options.fade_out_duration, rebuild.fade_out_duration );
							 rebuild.slide_in_duration = choose( options.slide_in_duration, rebuild.slide_in_duration );
							 rebuild.slide_out_duration = choose( options.slide_out_duration, rebuild.slide_out_duration );
							 rebuild.close_on_click = choose( options.close_on_click, rebuild.close_on_click );
							 rebuild.trigger = choose( options.trigger, rebuild.trigger );
							 
							 rebuild.classes += ' ' + choose( options.classes, '' );
							 rebuild.classes += ' ' + choose( classes, '' );
							 
							 rebuild.before_create = choose( options.before_create, null );
							 rebuild.after_create = choose( options.after_create, null );
							 rebuild.before_load = choose( options.before_load, null );
							 rebuild.after_load = choose( options.after_load, null );
							 rebuild.before_show = choose( options.before_show, null );
							 rebuild.after_show = choose( options.after_show, null );
							 rebuild.before_hide = choose( options.before_hide, null );
							 rebuild.after_hide = choose( options.after_hide, null );
							 rebuild.before_destroy = choose( options.before_destroy, null );
							 rebuild.after_destroy = choose( options.after_destroy, null );
							 
							 rebuild.buttons = choose( options.buttons, [] );
							 
							 delete classes; delete options; delete return_list;
							 delete choose;
							 
							 return rebuild;
						},
						create_api_close_string: function( blueprint ){
							var foundation = blueprint.foundation_name,
									namespace = blueprint.namespace,
									index = blueprint.collection_index,
									api_close = '';
														
							api_close += 'if ( ';
							api_close += 'window.' + foundation_name;
							api_close += '.' + namespace + 's';
							api_close += '[' + index + ']';
							api_close += ' ){';
							api_close += ' window.' + foundation_name;
							api_close += '.' + namespace + 's';
							api_close += '[' + index + ']';
							api_close += '.close(); };'
							
							this.about.api_close = api_close;
							delete this.create_api_close_string;
							return api_close;
						},
						set_close_on_click: function( blueprint ){
							var	element = blueprint.element,
									should_close = blueprint.should_close_on_click,
									eval_close_string = blueprint.api_close,
									on_click = element.onclick;
						
							console.log( should_close );
							
							if ( should_close && eval_close_string ){
								element.onclick = function(){
									eval( eval_close_string );
									if ( on_click ) on_click.call( this );
								}
							}		
							
							delete this.set_close_on_click;
						},
						height: function( value ){
							if ( value ) 
								$( this.mask ).css( 'height', value + 'px' );
								
							return parseInt( $( this.mask ).css( 'height' ), 10 );
						},
						width: function( value ){
							if( value )
								$( this.frame ).css( 'width', value + 'px' );
								
							return parseInt( $( this.frame ).css( 'width' ), 10 );
						},
						header: function( heading_html ){
							if ( heading_html )
								this.heading.innerHTML = heading_html;

							return this.heading.innerHTML;
						},
						message: function( value ){
							if ( typeof value === 'object' && value.length ) /* array */
								value = '<ul><li>' + value.join( '</li><li>' ) + '</li></ul>';
							
							if( value.indexOf( '<' ) < 0 && value.indexOf( '>' ) < 0 )
								 value = '<p>' + value + '</p>';
							
							this.contents.innerHTML = value ? value : '';

							return this.contents.innerHTML;
						},
						create_structure: function( fn ){
							var	dailog = this,
									contents = dialog.contents,
									id = dialog.guid,
									callback = ( fn ) ? fn : null;
							
							if ( this.options.before_create )
								this.options.before_create.call( dialog, contents, dialog );
						
							this.mask.setAttribute( 'id', id + '_mask' );
							this.frame.setAttribute( 'id', id + '_frame' );
							this.close_button.setAttribute( 'id', id + '_close_button' );
							this.contents.setAttribute( 'id', id );
							this.footer.setAttribute( 'id', id + '_footer' );
							this.heading.setAttribute( 'id', id + '_heading' );

							this.mask.setAttribute( 'class', this.options.classes );

							this.close_button.innerHTML = 'X';
							
							this.frame.appendChild( this.close_button );
							this.frame.appendChild( this.heading );
							this.frame.appendChild( this.contents );
							this.frame.appendChild( this.footer );
							this.mask.appendChild( this.frame );
							
							if ( global.document.body ){
								global.document.body.appendChild( this.mask );
							} else {
								throw new Error( 'Document doesn\'t appear to be fully loaded, can\'t attach the dialog' );
							}
							
							if ( this.options.after_create )
								this.options.after_create.call( dialog, contents, dialog );
								
							if ( callback )
								callback.call( dialog, contents, dialog );
						},
						load_contents: function( fn ){
							var	dialog = this,
									contents = dialog.contents;
									
						},
						set_buttons: function( button_array ){
							var step = -1, /* an initial step value */
									dialog = this, /* local variable for the dialog object */
									settings = {}, /* working settings */
									close_dialog = function(){ /* handler to close the dialog */
											/* call the dialog.close method and pass any on_close handlers */
											dialog.close( dialog.on_close ? dialog.on_close : null ) 
										},
									create_button = function( settings, container, dialog ){
										var button = {}, /* working element reference */
												click_handler = function(){ /* group functions within */
													if ( settings.click ) settings.click.call( this, this.value, dialog.contents, dialog );
													if ( settings.autoclose !== false ) close_dialog();
												};
										
										settings.id = settings.id ? settings.id : dialog.guid + '_' + settings.label;
										button = global.document.createElement( 'button' ); /* create the button */
										button.setAttribute( 'id', settings.id ); /* set the id */
										/* if value isn't supplied, use the label instead */
								  	button.value = settings.value ? settings.value : settings.label;
								  	button.innerHTML = settings.label; /* set the label */
								  	button.className = 'button'; /* give it a class of button */
								  	button.onclick = click_handler; /* attach the click handler */
								  	
								  	container.appendChild( button ) /* append the button to the dialog */
								  	
								  	/* with the HTML side handled, we now create a javascript reference
								  	 * to the button that we will attach to the dialog, complete with 
								  	 * methods for manipulating the button 
								  	 */								  	
								  	button = { /* reassign the variable `button` */
								  		reference: button, /* create a reference to the html button */
								  		value: function( new_value ){ /* set / get button value */
								  			if ( new_value ) this.reference.value = new_value;
								  			return this.reference.value;
								  		},
								  		disable: function( value ){ /* disable the button */
								  			/* disable can also be called to enable the button by supplying
								  			 * a value of false.  This allows one liners to disable the 
								  			 * button instead of having to call two seperate methods
								  			 * ie. [button].disable( 1 = 1 ? true : false );
								  			 */
								  			if ( value === false ) return this.enable();
								  			
								  			$( this.reference ) /* select the button from the refernce */
								  				.addClass( 'disabled' ) /* add disabled class for appearance */
								  				.attr( 'disabled', '1' ); /* actually disable the button */
								  		},
								  		enable: function( value ){ /* enable the button */
								  			/* enable can also be called to disable the button by supplying
								  			 * a value of false.  This allows one liners to enable the 
								  			 * button instead of having to call two seperate methods
								  			 * ie. [button].enable( 1 = 1 ? true : false );
								  			 */
								  			if ( value === false ) return this.disable();
								  			
								  			$( this.reference ) /* select the button from the reference */
								  				.removeClass( 'disabled' ) /* remove the class 'disabled' */
								  				.removeAttr( 'disabled' ); /* enable the button */
								  		},
								  		click: function( fn ){ /* click add listener wrapper */
								  			$( this.reference ) /* select the button through the reference */
								  				.click( fn ? fn : null ); /* attach the click handler provided */
								  		},
								  		hover: function( fn_over, fn_out ){ /* hover add listener wrapper */
								  			$( this.reference ) /* select the button through the reference */
								  				.hover( fn_over ? fn_over : null, fn_out ? fn_out : null );
								  		}								  		
								  	}
								  	
								  	/* handle a default of disabled */
								  	if ( settings.disabled === true )	button.disable();
								  	
								  	dialog.buttons.push( button ); /* append it to the container supplied */
									};
																		
							$( this.close_button ) /* select the close button (the circle X ) */
								.html( 'X' ) /* add the X for display */
								.click( function(){ dialog.close(); }); /* call the dialogs close */
							
							/* if there is an array of buttons supplied, cycle through the 
							 * array and create a button for each 
							 */
							if ( typeof button_array === 'object' && button_array.length ){	
							  while ( settings = button_array[ ++step ] ){ /* move to the next button */
							  	create_button( settings, this.footer, dialog ); /* create with settings */
							  } 
							} else { /* no buttons were defined, so we'll make the default `OK` button */
								create_button({ label: 'OK', click: close_dialog }, this.footer, dialog );
							  this.close_button.style.display = 'none'; /* hide the circle X button */
							}
						},
						arrange_on_top: function(){
							var	z_index = 0; /* starting z-index of 0 */
							
							/* cycle through the dom elements for this page, noting 
							 * the highest z-index, then set the z-index of this 
							 * dialog we're creating to the next highest number 
							 */
							$( 'body > *' ) /* select all decendents */
								.each( function(){ /* cycle through each */
									var compare = parseFloat( $( this ).css( 'z-index' ) ); 
									
									/* if the z-index of the compared element is higher then
									 * what we're currently storing, reset our z-index to 
									 * the compared element's z-index + 1
									 */
									z_index = z_index <= compare ? compare + 1 : z_index;
									compare = null;
								});
							
							this.mask.style.zIndex = z_index; /* set the z-index for the dialog */
							z_index = null; /* cleanup */
						},
						show: function( fn ){
							var	dialog = this,
									mask = $( dialog.mask ),
									frame = $( dialog.frame ),
									contents = dialog.contents,
									slide = dialog.options.slide_in_duration,
									fade = dialog.options.fade_in_duration,
									callback = ( fn ) ? fn : null,
									autoclose = '';
									
							if ( dialog.options.before_show )
								dialog.options.before_show.call( dialog, contents, dialog );
								
							mask.fadeIn( fade, function(){
								frame.animate({ top: 0 }, slide, function(){
									if ( dialog.options.after_show )
										dialog.options.after_show.call( dialog, contents, dialog );
									
									if ( callback )
										callback.call( dialog, contents, dialog );
										
									/* create a timeout to autoclose the dialog */
									if ( dialog.options.autoclose_delay > 0 ){
										autoclose += 'if ( ';
										autoclose += 'window.' + dialog.about.foundation_name;
										autoclose += '.' + dialog.about.namespace + 's';
										autoclose += '[' + dialog.collection_index + ']';
										autoclose += ' )';
										autoclose += 'window.' + dialog.about.foundation_name;
										autoclose += '.' + dialog.about.namespace + 's';
										autoclose += '[' + dialog.collection_index + ']';
										autoclose += '.close();'
										
										setTimeout( autoclose, dialog.options.autoclose_delay );
									}	
								});
							});
						},
						hide: function( fn ){
							var	dialog = this,
									mask = $( dialog.mask ),
									frame = $( dialog.frame ),
									contents = dialog.contents,
									slide = dialog.options.slide_out_duration,
									fade = dialog.options.fade_out_duration,
									callback = ( fn ) ? fn : null;
							
							/* call any before_hide functions */
							if ( options.before_hide ) 
								options.before_hide.call( dialog, contents, dialog );
							
							/* hide the dialog */
							frame.animate({ top: '-3000px' }, slide, function(){
								mask.fadeOut( fade, function(){
									if ( options.after_hide )
										options.after_hide.call( dialog, contents, dialog );
										
									if ( callback )
										callback.call( dialog, contents, dialog );
								});
							});
						},
						destroy: function( fn ){
							var	dialog = this,
									mask = $( dialog.mask ),
									contents = dialog.contents,
									callback = ( fn ) ? fn : null;
									
							if ( options.before_destroy )
								options.before_destroy.call( dialog, contents, dialog );
							
							mask.remove();
							this.collection[ this.collection_index ] = null;
							
							if ( options.after_destroy )
								options.after_destroy( true );
							
							if ( callback )
								callback.call( true );										
						},
						close: function( fn ){
							var	dialog = this,
									callback = ( fn ) ? fn : null;
							
							if ( options.before_close )
								options.before_close.call( dialog, dialog );
							
							this.hide( function(){
								this.destroy( callback );
							});
						},
						initialize: function( options, classes, collection ){
							var arguments = {};
									
							/* initialize the guid */
							this.guid = this.guid( 32 );
							
							if ( options.id ){
								this.guid = options.id
									.replace( /[^a-zA-Z 0-9]+/g, '_' )
									.replace( /\s/g, '_' );
							}
							
							/* quality check the options blueprint */
							arguments = {
								options: options,
								defaults: this.defaults,
								classes: classes
							};
							options = this.options = this.repack_options( arguments );
							
							/* create an api close */
							arguments = {
								foundation_name: this.about.foundation_name,
								namespace: this.about.namespace,
								collection_index: this.collection_index
							};
							
							/* set the close on click of the body */
							arguments = {
								api_close: this.create_api_close_string( arguments ),
								should_close_on_click: options.close_on_click,
								element: global.document.body
							};
							this.set_close_on_click( arguments );
							
							/* create the structure */
							this.create_structure();
							
							/* create / set buttons */
							this.set_buttons( this.options.buttons );
							
							/* set the heading */
							this.header( this.options.heading );
							
							/* set the message */
							this.message( this.options.message );
							
							/* move the dialog to the top of the z-index */
							this.arrange_on_top();
							
							/* show the dialog */
							this.show();
							
							/* add dialog object to collection */
							collection.push( this );
							
							return this;
						},
						slim: function(){
							delete this.initialize;
							delete this.create_structure;
							delete this.repack_options;
							delete this.defaults;
							delete this.set_buttons;
							delete this.slim;
							delete this.show;
						}
					};
			
			return_space = dialog.initialize( options, classes, collection );
			return_space.slim();
			
			return return_space;
		};	
	} catch( error_message ){
		throw new Error( error_message );
		return null;
	};
}( 'dialog', 'bryant', typeof window === 'undefined' ? this : window )); /* call Òanonymous ÄnÓ and pass in the ÒwindowÓ object */

window.onload = function(){
	
	options = {
	//	id: 'myDialog',
	//	fade_in_duration: 200,
	//	slide_in_duration: 500,
	//	fade_out_duration: 200,
	//	slide_out_duration: 500,
		trigger: document.body,
		heading: 'My Dialog',
		message: 'Your settings have been saved',	
		url: 'my_test_page.php?val1=1,val2=2',
		close_on_click: true,
		before_create: function( contents, dialog ){ console.log( 'about to create ' + dialog.options.heading ); },
		after_create: function( contents, dialog ){ console.log( 'done creating ' + dialog.options.heading ); },
		before_load: function( contents, dialog ){ console.log( 'about to load ' + dialog.options.url ); },
		after_load: function( contents, dialog, data ) { console.log( 'done loading ' + dialog.options.url ); },
		before_show: function( contents, dialog ){ console.log( 'about to show ' + dialog.options.heading ); },
		after_show: function( contents, dialog ){ console.log( 'done showing ' + dialog.options.heading ); },
		before_hide: function( contents, dialog ){ console.log( 'about to hide ' + dialog.options.heading ); },
		after_hide: function( contents, dailog ){ console.log( 'done hiding ' + dialog.options.heading ); },
		before_destroy: function( contents, dialog ){ console.log( 'about to destroy ' + dialog.options.heading ); },
		after_destroy: function(){ console.log( 'done destroying' ); },
		autoclose_delay: 3000
	},
	my_dialog = function(){
		var dailog = {};
		
		dialog = window.bryant.dialog( options );
		console.dir( dialog );
	}
	
	window.bryant.dialog( 'Dailog 1' );
	
	setTimeout( my_dialog, 500 );			
};