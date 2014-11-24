$(function($) {
 	$("#tableofcontents").tocify({
 		extendPage: true,
 		selectors: "h1,h2,h3,h4"
 	});
 	var addToAll = true;
 	var gallery = false;
 	var titlePosition = 'inside';
 	$(addToAll ? 'img' : 'img.fancybox').each(function() {
 		var $this = $(this);
 		var title = $this.attr('title');
 		var src = $this.attr('data-big') || $this.attr('src');
 		var a = $('<a href="#" class="fancybox"></a>').attr('href', src).attr('title', title);
 		$this.wrap(a);
 	});
 	if (gallery)
 		$('a.fancybox').attr('rel', 'fancyboxgallery');
 	$('a.fancybox').fancybox({
 		titlePosition: titlePosition
 	});
 });

 $.noConflict();


 function toggle_R() {
 	$("pre").slideToggle(1);
 	setTimeout(function() {
 		$("div[data-unique*=" + $(".active")[0].getAttribute("data-unique") + "]")[0].scrollIntoView();
 	}, 100);

 }