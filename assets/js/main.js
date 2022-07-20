
/*** Slide Function for Reviews ***/

let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1} 
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none"; 
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block"; 
  dots[slideIndex-1].className += " active";
}


(function($) {

	var	$window = $(window),
		$header = $('#header'),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Tweaks/fixes.

		// Polyfill: Object fit.
			if (!browser.canUse('object-fit')) {

				$('.image[data-position]').each(function() {

					var $this = $(this),
						$img = $this.children('img');

					// Apply img as background.
						$this
							.css('background-image', 'url("' + $img.attr('src') + '")')
							.css('background-position', $this.data('position'))
							.css('background-size', 'cover')
							.css('background-repeat', 'no-repeat');

					// Hide img.
						$img
							.css('opacity', '0');

				});

			}

	// Dropdowns.
		$('#nav > ul').dropotron({
			alignment: 'right',
			hideDelay: 350,
			baseZIndex: 100000
		});

	// Menu.
		$('<a href="#navPanel" class="navPanelToggle">Menu</a>')
			.appendTo($header);

		$(	'<div id="navPanel">' +
				'<nav>' +
					$('#nav') .navList() +
				'</nav>' +
				'<a href="#navPanel" class="close"></a>' +
			'</div>')
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'right'
				});

// Scrolly.
$('.scrolly').scrolly();

// Slider.
		$('.slider-wrapper').each(function() {

			var $this = $(this),
				$slider = $this.children('.slider'),
				$indicators = $('<div class="indicators" />').appendTo($this),
				$slide = $slider.children(),
				$indicator,
				locked = false,
				i;

			// Indicators.
				for (i=0; i < $slide.length; i++)
					$('<a href="#">' + (i + 1) + '</a>')
						.appendTo($indicators);

				$indicator = $indicators.children('a')
					.each(function(index) {

						var	$this = $(this),
							$target = $slide.eq(index);

						$this.on('click', function(event, initial) {

							var	x;

							// Prevent default.
								event.stopPropagation();
								event.preventDefault();

							// Already selected?
								if ($this.hasClass('active'))
									return;

							// Locked?
								if (locked)
									return;

								locked = true;

							// Calculate scroll position.
								x = ($target.position().left + $slider.scrollLeft()) - (Math.max(0, $slider.width() - $target.outerWidth()) / 2);

							// Scroll.
								$slide.addClass('inactive');
								$indicator.removeClass('active');
								$this.addClass('active');

								if (initial) {

									$slider.scrollLeft(x);
									$target.removeClass('inactive');
									locked = false;

								}
								else {

									$slider
										.stop()
										.animate(
											{ scrollLeft: x },
											settings.sliderSpeed,
											'swing'
										);

									setTimeout(function() {
										$target.removeClass('inactive');
										locked = false;
									}, Math.max(0, settings.sliderSpeed - 250));

								}

						});

					});

			// Slides.
				$slide.on('click', function(event, initial) {

					var $this = $(this);

					$indicator.eq($this.index())
						.trigger('click', initial);

				});

				$slide.on('click', 'a', function(event) {

					if ($(this).parents('article').hasClass('inactive'))
						event.preventDefault();

				});

			// Re-position on resize.
				$window.on('resize.transit_slider', function(event) {

					var $target = $slide.not('.inactive');

					$slider.scrollLeft(($target.position().left + $slider.scrollLeft()) - (Math.max(0, $slider.width() - $target.outerWidth()) / 2));

				});

			// Initialize.
				$slide.filter('.initial')
					.trigger('click', true);

		});

})(jQuery);