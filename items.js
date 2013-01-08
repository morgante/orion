var items= {
	init: function() {
		$('#items li.item').each(function() {
			items.initItem($(this));
		});
		
		// $.lightbox();
	},
	initItem: function(item) {
		var options= {
			imageArray: $('ul.images li a', item)
		};
		$('ul.images li a', item).lightbox(options);
		
		$('h3.title.images a').click(function() {
			$('ul.images li a', item).eq(0).click();
			
			return false;
		});
		
		$('h3.title.images a').click(function() {
			$('ul.images li a', item).eq(0).click();
			
			return false;
		});
		
		$('.thumbnail.images a.thumbnail').click(function() {
			$('ul.images li a', item).eq(0).click();
			
			return false;
		});
		
		$('.tags a', item).click(function() {

			tags.add($(this).text());
			return false;
		});
		
	},
	update: function() {
		var query= {};
		
		var str= '';
		
		$('#tags li a strong').each(function() {
			query[$(this).text()]= 'tag';
			
			str= str + '.' + $(this).text();
		});
		
		if(str.length != 0) {
			$('#items li.item' + str).fadeIn();
			$('#items li.item').not(str).fadeOut();
		} else {
			$('#items li.item').fadeIn();
		}
		
		
		
		//  $.ajax({
		// 	url: urls.items,
		// 	type: "POST",
		// 	data: query,
		// 	success: function(data) {
		// 		$('#items').html(data);
		// 		
		// 		items.init();
		// 	}
		// });
		
	}
}

var tags= {
	init: function() {
		$('#tags li:eq(1)').addClass('first');
		
		$('#tags li a').each(function() {
			tags.initTag($(this));
		});
	},
	initTag: function(tag) {
		tag.click(function() {
			$(this).parent().fadeOut("medium", function() {
				$(this).remove();
				
				tags.init();

				items.update();
			});
			
			return false;
		});
	},
	add: function(tag) {
		if($('#tags li.tag.' + tag).length != 0) return;
		
		var link= $('<li class="tag"><a href="#remove" title="Remove tag \'' + tag + '\'"><strong>' + tag + '</strong><span class="remove">X</span></a></li>');
		
		link.addClass(tag);
		
		link.appendTo('#tags').hide().fadeIn("medium");
		
		items.update();
		
		tags.init();
	}
}

$(document).ready(function() {
	items.init();
	tags.init();
});