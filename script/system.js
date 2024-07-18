$.extend({
	'bannerShow' : function(bo){
		if(this == $) {
			if(!$(bo).length) return;
			return new $.bannerShow(bo, index);
		}
		var _this = this, index = 0, timeout = null;
		var o = $(bo);
		var cbo = $(bo + ' .content');
		var bbo = $(bo + " .titBg");
		var tbo = $(bo + " .tit");
		var cot = cbo.find('li').length;
		var ibo = $(Array(cot + 1).join('<a/>')).appendTo(bo + ' .count');
		$(bo + ' .count').css({'marginTop' : o.height() - 22 + 'px'});
		ibo.on('click', function(){
			index = $(this).index();
			return _this.pause().start().Mar();
		});
		cbo.on('mouseenter', function(e){
			_this.pause();
			return false;
		}).on('mouseleave', function(e){
			_this.start();
			return false;
		});
		$(bo + ' .prev').click(function(){
			if(index == 1) index = cot - 1;
			else index -= 2;
			return _this.pause().start().Mar();
		});
		$(bo + ' .next').click(function(){
			if(index == cot) index = 0;
			return _this.pause().start().Mar();
		});
		this.pause = function(){
			if(timeout) clearInterval(timeout);
			timeout = null;
			return _this;
		}
		this.start = function(){
			if(!timeout) timeout = setInterval(_this.Mar, 3000);
			return _this;
		}
		this.Mar = function() {
			if(index >= cot) index = 0;
			tbo.text(cbo.find('li').eq(index).data('tit'));
			ibo.not(ibo.eq(index).css('backgroundColor', '#fff')).css('backgroundColor', '#000');
			var ol = - index * 100 + '%';
			bbo.css({'height' : '180px'});
			tbo.css({'font-size' : index % 2 ? '1px' : '90px', 'line-height' : '160px'});
			cbo.animate({'marginLeft' : ol}, function(){
				bbo.css({'height' : '80px'});
			});
			tbo.animate({'font-size' : '46px', 'line-height' : '70px'});
			index ++;
		}
		this.start();
		return this.Mar();
	},
	'proShow' : function(po) {
		if(this == $) {
			if(!$(po).length) return;
			return new $.proShow(po);
		}
		var _this = this, timeout = null;
		var uo = $(po + ' ul');
		var ow = uo.find('li').length * (uo.find('li').width() + 9);
		uo.append(uo.find('li').clone());
		this.Mar = function(){ 
			timeout = setInterval(function(){
				var lt = parseInt(uo.css('marginLeft')) - 1;
				if(Math.abs(lt) >= ow) lt = 0;
				uo.css('marginLeft', lt + "px");
			}, 20);
		}
		this.Mar();
		uo.mouseenter(function(){
			clearInterval(timeout);
		}).mouseleave(function(){
			_this.Mar();
		});
	},
	'fullPage' : function(o){
		var o = $(o)
		, el = document.documentElement
		, rfs = el.requestFullScreen
			 || el.webkitRequestFullScreen
			 || el.mozRequestFullScreen
			 || el.msRequestFullScreen
		, efs = document.exitFullscreen
			 || document.webkitExitFullscreen
			 || document.mozCancelFullScreen
		;
		if(typeof rfs!="undefined" && rfs){
			if(o.text() != '\u9000\u51fa\u5168\u5c4f') {
				rfs.call(el);
				o.text('\u9000\u51fa\u5168\u5c4f');
			} else {
				efs.call(document);
				o.text('\u5168\u5c4f\u6d4f\u89c8');
			}
		}
	},
	'alert' : function(Str, callBack) {
		var alt = $('.talert');
		if(!!window.ActiveXObject && (!document.documentMode || document.documentMode < 10)) {
			window.alert(Str);
			!!callBack && callBack();
			return;
		}
		$('#all').css('filter', 'blur(3px)');
		var alt = $("<div class='talert'><div class='bg'></div><div class='body'>\
				<div class='text'>" + Str + "</div>\
				<div class='foot'>&#30830;&nbsp;&nbsp;&#23450;</div>\
				</div></div>").appendTo('body');
		alt.fadeIn().find('.text').html(Str)
			.parent().css({
				'marginTop' : function(){return - $(this).height() / 2 + 'px'},
				'animation' : 'loadDiv8 0.7s ease-in backwards'
			}).find('.foot').click(function(){
				$(this).parent().css({
					'animation' : 'loadDiv9 0.7s ease-out forwards'
				}).on('animationend', function(){
					$(this).parent().fadeOut(function(){
						return $(this).remove();
					});
				});
				$('#all').css('filter', 'none');
				!!callBack && callBack();
			});
	},
	'tts' : function(o) {
		var nowID = 0, texArr = [];
		$(o + " p").each(function(){
			var re = $(this).text().replace(/[\s&%\/\\\\#]/g, '');
			if(re.length > 510) {
				texArr = texArr.concat(re.match(/([^\u3002\uff1f\uff01]+)/g));
			} else {
				if(re.length > 0) texArr.push(re);
			}
		});
		var audObj = $('#aud').on('ended', function(){
			if(++ nowID < texArr.length) {
				setSrc();
			} else {
				butObj.removeClass('play');
			}
		});
		var audDom = audObj.get(0);
		var butObj = $('.audplay a');
		if(audDom.readyState) {
			if(audDom.paused || audDom.ended) {
				butObj.addClass('play');
				audDom.play();
			} else {
				butObj.removeClass('play');
				audDom.pause();
			}
			
		} else {
			setSrc();
			butObj.addClass('play');
		}
		function setSrc() {
			audDom.src = "https://tts.baidu.com/text2audio?cuid=baike&lan=ZH&ctp=1&pdt=301&vol=9&rate=32&per=5&tex=" + encodeURI(texArr[nowID]);
		}
	}
});
$(function(){
	if(self != top) {
		top.location.href = location.href;
	}
	var toolTop = $('#tools .top');
	var amt = $('#main:not(.child)').find('.tit,.content[class!=msglink],.news,.help,.msglink li,.imageslist dt').not('.msglink').add('#bannerchird,#banner');
	//var amtCld = $('.child .body').find('*').not('dl,ul');
	//amt = $.merge(amt, amtCld);
	if(!(!!window.ActiveXObject && (!document.documentMode || document.documentMode < 10))) {
		amt.css('visibility', 'hidden');
	}
	$.bannerShow('#banner');
	$.proShow('#prolist');
	$('.body p').parent().add('.body ul, .body dl').css('visibility', 'visible');
	$('#menu li').eq($('#menu').data('index')).addClass('hover');
	$('marquee').mouseenter(function(){
		this.stop();
	}).mouseleave(function(){
		this.start();
	});
	$('#tools .top').click(function(){
		window.scrollTo({left:0,top:0,behavior:"smooth"});
	});
	function loadPage(){
		var wt = $(window).scrollTop();
		var c = wt + window.innerHeight;
		amt.each(function(){
			var o = $(this);
			if(o.css('visibility') == 'hidden' && c - o.offset().top > 0) {
				if(o.css('opacity') == 0) o.css('opacity', 10);
				amt = amt.not(o.css({
					'visibility': 'visible', 
					'animation': 'loadDiv' + Math.floor(Math.random() * 6) + ' 0.7s ease-out backwards'
				}));
			}
		});
		if(toolTop.not(':visible') && wt > 1) {
			$('#tools').css('margin-bottom', -128);
			toolTop.show();
		}
		if(toolTop.is(':visible') && wt < 1) {
			$('#tools').css('margin-bottom', -96);
			toolTop.hide();
		}
	}
	$(window).on('load resize', function(){
		if($('body').width() < 1330) {
			$('#tools').hide();
		} else {
			$('#tools').show();
		}
		$('#bannerchird div').css('animation', 'startdiv 0.7s ease-out 0.8s backwards');
	}).on('load resize scroll', loadPage);
	$('.body,#banner').one('animationend', loadPage);
});