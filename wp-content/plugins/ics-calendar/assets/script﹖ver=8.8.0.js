/*
ICS Calendar front end scripts
https://icscalendar.com
*/


function r34ics_is_phone() {
	return window.innerWidth <= 782;
}


function r34ics_show_hide_headers(elem) {
	if (typeof elem == 'undefined' || elem == null) { elem = '.ics-calendar'; }
	// First we restore all of the headers we may be hiding
	jQuery(elem + ' .ics-calendar-list-wrapper h4, ' + elem + ':not(.monthnav-compact) .ics-calendar-label, ' + elem + ' .ics-calendar-month-grid .day').show();
	jQuery(elem + ' .ics-calendar-list-wrapper h4, ' + elem + ':not(.monthnav-compact) .ics-calendar-label, ' + elem + ' .ics-calendar-month-grid .day').removeClass('nomobile').removeClass('hidden_in_list');
	// In list view, hide/show the day header
	if (jQuery('.ics-calendar.layout-list').length > 0) {
		jQuery(elem + ' .ics-calendar-list-wrapper h4').each(function() {
			if (jQuery(this).next('dl').find('.event:not([style*="none"])').length == 0) {
				jQuery(this).hide();
			}
			else {
				jQuery(this).show();
			}
		});
		// And also hide/show the month header
		jQuery(elem + ' .ics-calendar-list-wrapper .ics-calendar-label').each(function() {
			if (jQuery(this).siblings('.ics-calendar-date-wrapper').children('h4:not([style*="none"])').length == 0) {
				jQuery(this).hide();
			}
			else {
				jQuery(this).show();
			}
		});
	}
	// In month view list (phone breakpoint), hide the day header
	// Also applies to Pro in month view with table/list toggle set to list
	if (jQuery('body.r34ics_phone .ics-calendar.layout-month').length > 0 || jQuery(elem).data('month-table-list-toggle') == 'list') {
		jQuery(elem + ' .ics-calendar-month-grid .events').each(function() {
			if (jQuery(this).find('.event:not([style*="none"])').length == 0) {
				jQuery(this).siblings('.day').addClass('nomobile').addClass('hidden_in_list');
			}
			else {
				jQuery(this).siblings('.day').removeClass('nomobile').removeClass('hidden_in_list');
			}
		});
		// And also hide/show the month header
		jQuery(elem + ' .ics-calendar-month-wrapper .ics-calendar-month-grid').each(function() {
			if (jQuery(this).find('.event:not([style*="none"])').length == 0) {
				jQuery(this).siblings('.ics-calendar-label').addClass('nomobile').addClass('hidden_in_list');
			}
			else {
				jQuery(this).siblings('.ics-calendar-label').removeClass('nomobile').removeClass('hidden_in_list');
			}
		});
	}
}


jQuery(function() {


	// VIEW: ALL

	// Add .r34ics_phone class to body if we're on a phone screen size
	if (r34ics_is_phone()) { jQuery('body').addClass('r34ics_phone'); }

	// Handle "toggle" functionality for event descriptions
	/*
	Note: .toggle class was changed to .r34ics_toggle in templates
	and CSS to work around a conflict with another plugin;
	however, the original class is retained here for flexibility.
	We are using jQuery(document) to account for dynamically-inserted elements.
	*/
	jQuery(document).on('click', '.ics-calendar.r34ics_toggle .event, .ics-calendar.toggle .event', function() {
		// No description -- do nothing
		if (jQuery(this).find('.descloc').length == 0) { return false; }
		// Lightbox
		if (jQuery('#r34ics_lightbox').length > 0 && jQuery(this).closest('.ics-calendar').hasClass('r34ics_toggle_lightbox')) {
			jQuery('#r34ics_lightbox .r34ics_lightbox_content').html(jQuery(this).find('.descloc').html());
			jQuery('#r34ics_lightbox').addClass('open');
		}
		// Toggle in place
		else {
			if (jQuery(this).hasClass('open')) { jQuery(this).removeClass('open'); }
			else { jQuery(this).addClass('open'); }
		}
	});
	// Don't trigger toggle if we're clicking a link inside the event
	jQuery(document).on('click', '.ics-calendar.r34ics_toggle .event a, .ics-calendar.toggle .event a, #r34ics_lightbox .r34ics_lightbox_content', function(e) {
		e.stopPropagation();
	});
	// Lightbox close functionality
	if (jQuery('#r34ics_lightbox').length > 0) {
		jQuery('#r34ics_lightbox, #r34ics_lightbox .r34ics_lightbox_close').on('click', function() {
			jQuery('#r34ics_lightbox .r34ics_lightbox_content').html('');
			jQuery('#r34ics_lightbox').removeClass('open');
		});
	}

	// Make offsite links open in new tab
	jQuery('.ics-calendar a').each(function() {
		if (jQuery(this).attr('target') == '_blank') {
			jQuery(this).addClass('offsite-link');
		}
		else if (
				typeof jQuery(this).attr('href') != 'undefined' &&
				jQuery(this).attr('href').indexOf('http') == 0 &&
				jQuery(this).attr('href').indexOf('//'+location.hostname) == -1
		) {
			jQuery(this).addClass('offsite-link').attr('target','_blank');
		}
	});

	// Toggle color-coded multi-feed calendars
	jQuery('.ics-calendar-color-key-toggle').on('change', function() {
		var cal = jQuery(this).closest('.ics-calendar');
		var feedkey = jQuery(this).attr('data-feed-key');
		if (jQuery(this).prop('checked') == true) {
			cal.find('.event[data-feed-key=' + parseInt(feedkey) + '], .events *[data-feed-key=' + parseInt(feedkey) + ']').show();
		}
		else {
			cal.find('.event[data-feed-key=' + parseInt(feedkey) + '], .events *[data-feed-key=' + parseInt(feedkey) + ']').hide();
		}
		// Show/hide day and month headers (this is encapsulated in a function so we can trigger it separately)
		r34ics_show_hide_headers('#' + cal.attr('id'));
		// Uncheck the show/hide all button
		if (!jQuery(this).prop('checked')) {
			jQuery(this).parent().parent().siblings().find('.ics-calendar-color-key-toggle-all').each(function() {
				jQuery(this).prop('checked', false);
			});
		}
		// Check the show/hide button only if all are checked
		else {
			var all_siblings_checked = true;
			jQuery(this).parent().parent().siblings().find('.ics-calendar-color-key-toggle').each(function() {
				if (!jQuery(this).prop('checked')) { all_siblings_checked = false; }
			});
			if (all_siblings_checked) {
				jQuery(this).parent().parent().siblings().find('.ics-calendar-color-key-toggle-all').each(function() {
					jQuery(this).prop('checked', true);
				});
			}
		}
	});
	jQuery('.ics-calendar-color-key-toggle-all').on('click', function() {
		if (jQuery(this).prop('checked')) {
			jQuery(this).parent().parent().siblings().find('.ics-calendar-color-key-toggle').each(function() {
				if (!jQuery(this).prop('checked')) {
					jQuery(this).trigger('click');
				}
			});
		}
		else {
			jQuery(this).parent().parent().siblings().find('.ics-calendar-color-key-toggle').each(function() {
				if (jQuery(this).prop('checked')) {
					jQuery(this).trigger('click');
				}
			});
		}
	});


	// VIEW: WEEK
	// Outer section wrapper has classes .ics-calendar.layout-week

	if (jQuery('.ics-calendar.layout-week').length > 0) {
		// Week select interactivity
		jQuery('.ics-calendar.layout-week .ics-calendar-select').on('change', function() {
			var r34ics_cal = jQuery(this).closest('.ics-calendar');
			r34ics_cal.addClass('show-past-events');
			r34ics_cal.find('.ics-calendar-month-grid tbody tr').css('display','none');
			r34ics_cal.find('.ics-calendar-month-grid tbody tr.' + jQuery(this).val()).css('display','table-row');
		});
		// Show/hide past events on mobile
		jQuery('a[data-ics-calendar-action="show-past-events"]').on('click', function() {
			var r34ics_cal = jQuery(this).closest('.ics-calendar');
			if (!r34ics_cal.hasClass('show-past-events')) {
				r34ics_cal.addClass('show-past-events');
				// On week view, remove this from the DOM instead of showing toggle
				jQuery(this).remove();
			}
			else {
				r34ics_cal.removeClass('show-past-events');
				jQuery(this).text(ics_calendar_i18n.show_past_events);
			}
			// Don't jump!
			return false;
		});
		// Initial state
		jQuery('.ics-calendar.layout-week .ics-calendar-month-grid:not(.fixed_dates) tbody tr').addClass('remove');
		jQuery('.ics-calendar.layout-week .ics-calendar-month-grid.fixed_dates tbody tr').addClass('current-week');
		jQuery('.ics-calendar.layout-week .ics-calendar-month-grid:not(.fixed_dates) tbody td.today').parent().addClass('current-week').removeClass('remove');
		jQuery('.ics-calendar.layout-week .ics-calendar-month-grid:not(.fixed_dates) tbody td.today').parent().prev().addClass('previous-week').removeClass('remove');
		jQuery('.ics-calendar.layout-week .ics-calendar-month-grid:not(.fixed_dates) tbody td.today').parent().next().addClass('next-week').removeClass('remove');
		jQuery('.ics-calendar.layout-week .ics-calendar-month-grid:not(.fixed_dates) tbody tr.remove').remove();
		jQuery('.ics-calendar.layout-week .ics-calendar-month-grid tbody tr.current-week').css('display','table-row');
		jQuery('.ics-calendar.layout-week .ics-calendar-select').show();
		jQuery('.ics-calendar.layout-week .ics-calendar-week-wrapper:first-of-type').show();
		// Remove Show Past Events link if there *are* no past events
		jQuery('.ics-calendar.layout-week').each(function() {
			if (jQuery(this).find('.ics-calendar-week-wrapper:visible .past:not(.empty)').length == 0) {
				jQuery(this).find('.ics-calendar-past-events-toggle').remove();
			}
		});
	}


	// VIEW: LIST
	// Outer section wrapper has classes .ics-calendar.layout-list

	if (jQuery('.ics-calendar.layout-list').length > 0) {
		jQuery('.ics-calendar.layout-list .descloc_toggle_excerpt').on('click', function() {
			jQuery(this).hide().siblings('.descloc_toggle_full').show();
		});
	}


	// VIEW: MONTH
	// Outer section wrapper has classes .ics-calendar.layout-month

	if (jQuery('.ics-calendar.layout-month').length > 0) {
		// Month select interactivity
		jQuery('.ics-calendar.layout-month .ics-calendar-select').on('change', function() {
			var r34ics_cal = jQuery(this).closest('.ics-calendar');
			r34ics_cal.find('.ics-calendar-month-wrapper').hide();
			r34ics_cal.find('.ics-calendar-month-wrapper[data-year-month="' + jQuery(this).val() + '"]').show();
			// Change arrow labels
			var r34ics_arrownav = r34ics_cal.find('.ics-calendar-arrow-nav');
			if (r34ics_arrownav.length > 0) {
				var r34ics_arrownav_prev = jQuery(this).find('option:selected').prev();
				if (r34ics_arrownav_prev.length > 0) {
					r34ics_arrownav.find('.prev').data('goto', r34ics_arrownav_prev.attr('value'));
					r34ics_arrownav.find('.prev-text').text(r34ics_arrownav_prev.text()).parent().removeClass('inactive');
				}
				else {
					r34ics_arrownav.find('.prev').data('goto', '');
					r34ics_arrownav.find('.prev-text').text('').parent().addClass('inactive');
				}
				var r34ics_arrownav_next = jQuery(this).find('option:selected').next();
				if (r34ics_arrownav_next.length > 0) {
					r34ics_arrownav.find('.next').data('goto', r34ics_arrownav_next.attr('value'));
					r34ics_arrownav.find('.next-text').text(r34ics_arrownav_next.text()).parent().removeClass('inactive');
				}
				else {
					r34ics_arrownav.find('.next').data('goto', '');
					r34ics_arrownav.find('.next-text').text('').parent().addClass('inactive');
				}
			}
		});
		// Month previous/next arrow interactivity
		jQuery('.ics-calendar.layout-month .ics-calendar-arrow-nav > *').on('click', function() {
			if (jQuery(this).data('goto') != '') {
				var r34ics_cal = jQuery(this).closest('.ics-calendar');
				r34ics_cal.find('.ics-calendar-select').val(jQuery(this).data('goto')).trigger('change');
			}
			return false;
		});
		// Show/hide past events on mobile
		jQuery('a[data-ics-calendar-action="show-past-events"]').on('click', function() {
			var r34ics_cal = jQuery(this).closest('.ics-calendar');
			if (!r34ics_cal.hasClass('show-past-events')) {
				r34ics_cal.addClass('show-past-events');
				// Show toggle
				jQuery(this).text(ics_calendar_i18n.hide_past_events);
			}
			else {
				r34ics_cal.removeClass('show-past-events');
				jQuery(this).text(ics_calendar_i18n.show_past_events);
			}
			// Don't jump!
			return false;
		});
		// Show/hide past events toggle depending on selected month
		jQuery('.ics-calendar-select').on('change', function() {
			var r34ics_cal = jQuery(this).closest('.ics-calendar');
			// Always show if we're showing the full list (Pro only)
			if (r34ics_cal.hasClass('month_list_all')) {
				r34ics_cal.find('a[data-ics-calendar-action="show-past-events"]').show();
			}
			else if (jQuery(this).val() == jQuery(this).attr('data-this-month')) {
				r34ics_cal.find('a[data-ics-calendar-action="show-past-events"]').show();
			}
			else {
				r34ics_cal.find('a[data-ics-calendar-action="show-past-events"]').hide();
			}
		});
		// Initial state
		jQuery('.ics-calendar.layout-month .ics-calendar-select:not(.hidden), .ics-calendar.layout-month .ics-calendar-arrow-nav').show();
		jQuery('.ics-calendar.layout-month .ics-calendar-month-wrapper[data-year-month="' + jQuery('.ics-calendar-select').val() + '"]').show();
		jQuery('.ics-calendar.layout-month .ics-calendar-select').trigger('change');
		// Remove Show Past Events link if there *are* no past events
		jQuery('.ics-calendar.layout-month').each(function() {
			if (jQuery(this).find('.ics-calendar-month-wrapper:visible .past:not(.empty)').length == 0) {
				jQuery(this).find('.ics-calendar-past-events-toggle').remove();
			}
		});
	}


	// DEBUGGER

	jQuery(".r34ics_debug_toggle").on("click", function() {
		if (jQuery(".r34ics_debug_wrapper").hasClass("minimized")) { jQuery(".r34ics_debug_wrapper").removeClass("minimized"); }
		else { jQuery(".r34ics_debug_wrapper").addClass("minimized"); }
	});

});


jQuery(window).on('resize', function() {

	// Add/remove .r34ics_phone class on body
	if (r34ics_is_phone()) { jQuery('body').addClass('r34ics_phone'); } else { jQuery('body').removeClass('r34ics_phone'); }

	// Simulate color key toggle
	//jQuery('.ics-calendar-color-key-toggle').trigger('change');

	// Show/hide headers
	r34ics_show_hide_headers();

});
