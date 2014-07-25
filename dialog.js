/*  Än( ÒnamespaceÓ, ÒglobalÓ )
 * namespace String: to call, attached to foundation
 * foundation object: the object to append
 */
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
							version: 2,
							subversion: 4,
							initialized_at: new Date(),
							foundation_name: foundation_name,
							namespace: namespace
						},
						defaults: {
							height: 50,
							width: 400,
							heading: namespace,
							message: '[no message supplied]',
							classes: namespace,
							autoclose_delay: 0,
							close_on_click: false,
							close_on_esc: false,
							use_close_button: true,
							trigger: window.document.body,
							pivot: null,
							url: ''
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
						set_pivot: function( parcel ){
							var	trigger = parcel.options.trigger,
									defaults = parcel.defaults.pivot,
									position = { left: defaults[ 0 ], top: defaults[ 1 ] },
									scroll_top = 0; 
							
							/* 1. If no `trigger` element is supplied, animate from 0,0
							 * 2. If the trigger is supplied as a string, convert it to a jquery
							 * instance of the element and then use it's offset to set the
							 * animate from.
							 * 3. If the trigger is supplied as a jQuery instance, use the offset
							 * to set the animate from.
							 * NOTE: JQuery.offset() and JQuery.position() are set on the load of 
							 * document and don't take into account scrolling.  Hence we have to 
							 * determine the scroll top to shift the Y position setting
							 */
							
							if ( trigger ){
								trigger = ( ! trigger instanceof jQuery ? $( trigger ) : trigger );
								position = trigger.offset(); 
								scroll_top = trigger.scrollTop();
							}
							return [ position.left, position.top - scroll_top ];
						},
						repack_options: function( options ){
							/* switch on typeof the options passed in on the initial dialog 
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
							 *						creation of the contents of the dialog respectively
							 *						caller `this` = dialog object
							 *		after_load( contents, dialog ): fn, callback function fired between the creation of 
							 *						the contents of the dialog and the show dialog animation
							 *						caller `this`: dialog contents container
							 *		before_show( fn( dialog ){ callback process } ): fn
							 *						callback function fired at the same time as the 
							 *						previous callback, after_load.  An alias
							 *						caller `this`: dialog object
							 *		after_show( fn( dialog ){ callback process } ): fn
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
							 rebuild.width = choose( options.width, rebuild.width );
							 rebuild.height = choose( options.height, rebuild.height );
							 rebuild.autoclose_delay = choose( options.autoclose_delay, rebuild.autoclose_delay );
							 rebuild.close_on_click = choose( options.close_on_click, rebuild.close_on_click );
							 rebuild.trigger = choose( options.trigger, rebuild.trigger );
							 rebuild.pivot = choose( options.pivot, rebuild.pivot );
							 rebuild.url = choose( options.url, rebuild.url );
							 
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
							 
							 rebuild.use_close_button = options.use_close_button === false ? false : true;
							 
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
								$( this.frame ).css( 'height', value + 'px' );
								
							return parseInt( $( this.frame ).css( 'height' ), 10 );
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
							var	dialog = this,
									contents = dialog.contents,
									id = dialog.guid,
									callback = ( fn ) ? fn : null;
							
							if ( dialog.options.before_create )
								dialog.options.before_create.call( dialog, contents, dialog );
						
							dialog.mask.setAttribute( 'id', id + '_mask' );
							dialog.frame.setAttribute( 'id', id + '_frame' );
							dialog.close_button.setAttribute( 'id', id + '_close_button' );
							dialog.contents.setAttribute( 'id', id );
							dialog.footer.setAttribute( 'id', id + '_footer' );
							dialog.heading.setAttribute( 'id', id + '_heading' );

							dialog.mask.setAttribute( 'class', dialog.options.classes );

							dialog.close_button.innerHTML = 'X';
							
							dialog.frame.appendChild( dialog.close_button );
							dialog.frame.appendChild( dialog.heading );
							dialog.frame.appendChild( dialog.contents );
							dialog.frame.appendChild( dialog.footer );
							dialog.mask.appendChild( dialog.frame );
							
							if ( global.document.body ){
								global.document.body.appendChild( dialog.mask );
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
									options = dialog.options,
									contents = dialog.contents;
							
							/* if a before_load function is supplied fire it now */
							if ( options.before_load )
								options.before_load.call( dialog, contents, dialog ); 
						
							/* display the message supplied */
							$( contents )
								.html( '<p>' + options.message + '</p>' ); 

							/* if options.url is set, then we're loading external content 
							 * through the use of the JQuery.load function
							 */
							if ( options.url ){ /* test for a non-empty url value */
								$( contents ).load( options.url, function( response, status, xhr ){ /* load */
									if ( options.after_load ){
										options.after_load.call( dialog, contents, dialog, response );
									}
								});									
							}	
						},
						set_buttons: function( button_array ){
							var step = -1, /* an initial step value */
									dialog = this, /* local variable for the dialog object */
									settings = {}, /* working settings */
									close_dialog = function(){ /* handler to close the dialog */
											/* call the dialog.close method and pass any on_close handlers */
										dialog.close( dialog.on_close ? dialog.on_close : null );
									},
									create_button = function( settings, container, dialog ){
										var button = {}, /* working element reference */
												click_handler = function(){ /* group functions within */
													var user_return = true;
													
													/* In order to inject an interrupt process in the dialog, say
													 * when the dialog has an error on the form and we don't want 
													 * the dialog to go away until the user has made the necessary
													 * corrections, we look for a return value for the supplied 
													 * click handler.  If the click handler returns true and the 
													 * the autoclose property for the button is true we shut down
													 * the dialog.  Otherwise if the value returns as false, then
													 * we hold off on closing the dialog 
													 */		
													if ( settings.click ) 
														user_return = settings.click.call( this, this, dialog.contents, dialog );

													if ( user_return !== false && settings.autoclose !== false ) close_dialog();
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
								  		can_close: true,
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
								if ( dialog.options.use_close_button === false ) 
									dialog.close_button.style.display = 'none';
									
							  while ( settings = button_array[ ++step ] ){ /* move to the next button */
							  	create_button( settings, this.footer, dialog ); /* create with settings */
							  } 
							} else { /* no buttons were defined, so we'll make the default `OK` button */
								create_button({ label: 'OK', click: close_dialog }, this.footer, dialog );
							  dialog.close_button.style.display = 'none'; /* hide the circle X button */
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
									options = dialog.options,
									mask = $( dialog.mask ),
									frame = $( dialog.frame ),
									contents = dialog.contents,
									choose_pivot = function( trigger, pivot ){
										var offset = {},
												scroll_top = 0;
										
										if ( pivot ) return pivot;
										
										element = ( trigger instanceof jQuery ) ? trigger : $( trigger );
										offset = element.offset();
										offset.left += element.width() / 2;
										offset.top += element.height() / 2;
											
										return [ offset.left, offset.top ];
									},
									pivot = choose_pivot( options.trigger, options.pivot ),
									left_position = function( frame_width ){
										var	width = parseInt( frame_width, 10 ) / 2,
												document_center = $( document ).width() / 2;
										return ( document_center - width ) + 'px';
									},
									css_definition = {
										height: 0,
										width: 0,
										opacity: 0,
										left: ( ( pivot[ 0 ] + 10 ) - $( window ).scrollLeft() ) + 'px',
										top: ( ( pivot[ 1 ] - 20 ) - $( window ).scrollTop() ) + 'px'
									},
									animation = {
										height: options.height,
										width: options.width,
										opacity: 1,
										left: left_position( options.width ),
										top: 50
									},
									autoclose = '',
									callback = fn;
							
							/* record the pivot position so `close()` can use it */
							dialog.options.pivot = pivot;
							
							/* if exists, call the before_show callback */
							if ( options.before_show )
								options.before_show.call( dialog, contents, dialog );
							
							mask.show();
									
							frame /* select the content area of the dialog box */
								.find( '>h1, >div, >footer, >a' )
								.css( 'visibility', 'hidden' ) /* hide them from view */
								.css( 'opacity', 0 ); /* set the opacity to 0 */
							
							frame /* select the content area of the dialog box */
								.css( css_definition ) /* assign a starting position */
								.animate( animation, 400, 'swing', function(){ /* animate */
									$( this ) /* select the content area of the dialog box */
								  	.find( '>h1, >div, >footer, >a' ) /* select it's children */
								  	.css( 'visibility', 'visible' ) /* make the children visible */
								  	.animate({ opacity: 1 }, 200, 'swing' ); /* fade them in */
									
									frame /* select the content area of the dialog box */
										.css( 'height', 'auto' );
									
									if ( options.after_show )
										options.after_show.call( dialog, contents, dialog );
										
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
							
							/* make draggable */		
							frame
							 .mousedown( function( down_event ){
							 	if ( frame.attr( 'id' ) !== $( down_event.target ).attr( 'id' ) ) return;
							 
							 	var element = this, 
							 			target = $( down_event.target ),
							 			position = target.offset(),
							 			offset = [
							 				down_event.pageX - ( parseInt( position.left, 10 ) - $( window ).scrollLeft() ),
							 				down_event.pageY - ( parseInt( position.top, 10 ) - $( window ).scrollTop() )
							 			];
							 			
							 	/* collect and store what we need for the 
							 	 * move function to operate and attach it 
							 	 * to the element.
							 	 */
							 	element.held = { /* attach to the element */
							 		target: target, /* a reference to the jQuery instance */
							 		offset: offset /* the offset from the top, left of the element */
							 	}	
							 	
							 	$( document ) /* select the document */
							 		.mousemove( function( move_event ){ /* attach a mouse move handler */
							 			var css; 
							 			if ( element.held ){ /* test for the held property */
							 				css = { /* create a parcel with the positional information */
							 					left: ( move_event.pageX - element.held.offset[ 0 ] ) + 'px',
							 					top: ( move_event.pageY - element.held.offset[ 1 ] ) + 'px',
							 					cursor: 'move'
							 				}
							 				element.held.target.css( css ); /* move the element */
							 			}
							 			delete css;
							 		})
							 		.mouseup( function( up_event ){	/* attach a mouseup handler */	
							 			var	css = { cursor: 'default' },
							 					box = {},							 					
							 					scroll = {
							 						left: $( window ).scrollLeft(), 
							 						top: $( window ).scrollTop() 
							 					},
							 					view = {
							 						width: $( window ).width(), 
							 						height: $( window ).height() 
							 					},
							 					pixelate = function( value ){
							 						return value + 'px';
							 					};
							 			
							 			if ( element.held ){ /* test fo the held property */
							 				box.width = element.held.target.width();
							 				box.height = element.held.target.height();
							 				box.top = element.held.target.offset().top; /* top */
							 				box.left = element.held.target.offset().left; /* left */
							 				box.right = box.left + box.width; /* right */
							 				box.bottom = box.top + box.height; /* bottom */
							 				box.bottom_pad = parseInt( element.held.target.css( 'padding-bottom' ), 10 );
							 				box.right_pad = parseInt( element.held.target.css( 'padding-right' ), 10 );
							 				
							 				/* constrain to view on the y-axis */
							 				if ( box.top <= 20 + scroll.top )
							 					css.top = pixelate( 20 );
							 				else if ( box.bottom >= view.height + scroll.top )
							 					css.top = pixelate( view.height - box.height - box.bottom_pad - 40 );
							 				else	
							 					css.top = pixelate( box.top - scroll.top );
							 				
							 				/* constrain to view on the x-axis */
							 				if ( box.left <= 20 + scroll.left )
							 					css.left = pixelate( 20 );
							 				else if ( box.right >= view.width + scroll.left )
							 					css.left = pixelate( view.width - box.width - box.right_pad - 40 );
							 				else
							 					css.left = pixelate( box.left - scroll.left );
							 				
							 				element.held.target.css( css );
							 				delete scroll;
							 				delete view;
							 				delete box;
							 				delete element.held; /* delete it */
							 			}
							 		});
							 });
																	
									if ( callback )
										callback.call( dialog, frame, dialog );
							});	
						},
						hide: function( fn ){
							var	dialog = this,
									options = dialog.options,
									frame = $( dialog.frame ),
									mask = $( dialog.mask ),
									animation = {
										'height': 0,
										'width': 0,
										'opacity': 0,
										'left': ( options.pivot[ 0 ] + 10 ) - $( window ).scrollLeft(),
										'top': ( options.pivot[ 1 ] - 20 ) - $( window ).scrollTop()
									},
									callback = fn;

							if ( options.before_hide )
								options.before_hide.call( dialog, frame, dialog );

							frame
								.children()
								.css( 'visibility', 'hidden' ) /* make the children visible */

							frame
								.animate( animation, 300, 'swing', function(){
									if ( options.after_hide )
										options.after_hide.call( dialog, frame, dialog );
									
									if ( callback )
										callback.call( dialog, frame, dialog );
										
									mask.hide();
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
							var dialog = this,
									arguments = {};
									
							/* initialize the guid */
							dialog.guid = dialog.guid( 32 );
							
							if ( options.id ){
								dialog.guid = options.id
									.replace( /[^a-zA-Z 0-9]+/g, '_' )
									.replace( /\s/g, '_' );
							}
							
							/* quality check the options blueprint */
							arguments = {
								options: options,
								defaults: dialog.defaults,
								classes: classes
							};
							options = dialog.options = dialog.repack_options( arguments );
							
							/* create an api close */
							arguments = {
								foundation_name: dialog.about.foundation_name,
								namespace: dialog.about.namespace,
								collection_index: dialog.collection_index
							};
							
							/* set the close on click of the body */
							arguments = {
								api_close: dialog.create_api_close_string( arguments ),
								should_close_on_click: options.close_on_click,
								element: dialog.mask
							};
							dialog.set_close_on_click( arguments );
							
							/* create the structure */
							dialog.create_structure();
							
							/* create / set buttons */
							dialog.set_buttons( dialog.options.buttons );
							
							/* set the heading */
							dialog.header( dialog.options.heading );
							
							/* set the message */
							dialog.message( dialog.options.message );
							
							/* move the dialog to the top of the z-index */
							dialog.arrange_on_top();
							
							/* set the contents */
							dialog.load_contents();
							
							/* show the dialog */
							dialog.show();
							
							/* add dialog object to collection */
							collection.push( dialog );
							
							return dialog;
						},
						slim: function(){
							var dialog = this;
							
							delete dialog.initialize;
							delete dialog.create_structure;
							delete dialog.repack_options;
							delete dialog.defaults;
							delete dialog.set_buttons;
							delete dialog.slim;
							delete dialog.show;
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

