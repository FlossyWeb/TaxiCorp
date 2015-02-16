var fastButtons = {
	replace: function() {
		// copy the current click events on document
		var clickEvents = jQuery.hasData( document ) && jQuery._data( document ).events.click;
		clickEvents = jQuery.extend(true, {}, clickEvents);
		// remove these click events
		$(document).off('click');
		// reset them as vclick events
		for (var i in clickEvents) {
			$(document).on('vclick', clickEvents[i].handler);
		}
	}
};
// Call fastbuttons and replace all click events with vclick
$(document).ready(function() {
    fastButtons.replace();
});