/*

  SAMO-Soft Nightpicker jQuery Plugin
  by Andrey Krokhin (@andreykrokhin)
  v2018.12.24

  <input class="nightpicker" />
  $('._nightpicker').nightpicker();
  $('._nightpicker').nightpicker('select', 7);

  link: https://habrahabr.ru/post/158235/

*/

(function( $ ){

  var methods = {
    /* инициализация плагина после загрузки страницы */
    init: function ( options ) {

      return this.each(function () {

        var settings = $.extend({
          nights: 28,                     // Количество ночей
          range: true,                    // Выбирать интервал ночей
          multiple: false,                // Выбирать отдельные ночи
          altField: 'input.nightpicker',  // Поле для отображения выбранных ночей
          separator: ' – ',               // Разделитель ночей
          sort: true,                     // Сортировка ночей по возрастанию
          debug: false,                   // DEBUG mode
        }, options);

        var $this = $(this),
             data = $this.data('nightpicker');

        // Если плагин ещё не инициализирован
        if (!data) {

          if (this.dataset.nights) {
            settings.nights = !!+this.dataset.nights;
          }
          if (this.dataset.range) {
            settings.range = !!+this.dataset.range;
          }
          if (this.dataset.multiple) {
            settings.multiple = !!+this.dataset.multiple;
          }

          // задание id для загрузчика
          var gid = $('.nightpicker').length;

          $this.data('nightpicker', {
            target: $this,
            gid: gid,
            settings: settings,
            states: {         // состояния (обнуляются в методе 'clean')
              nightFrom: 0,   // выбрана ли первая ночь в интервале
              nightTo: 0,     // выбрана ли последняя ночь в интервале
              nights: [],     // массив выбранных ночей для multiple
            }
          });
          data = $this.data('nightpicker');

          if (data.settings.debug) {
            console.log('>_ 🌙 Nightpicker > #' + data.gid, data);
          }

          $this.attr('id', 'nightpicker-' + data.gid);

          // отображение ночей
          $nightpicker = $(document.createElement('div'));
          $nightpicker.addClass('nightpicker');
          for (var i = 1; i <= data.settings.nights; i++) {
            $nightpicker[0].innerHTML += '<div class="nightpicker__night" data-night="'+i+'">'+i+'</div>';
          }
          $this.parent().append($nightpicker);

          // клик по ночам
          $nightpicker.on('click', '.nightpicker__night', function () {
            var $this = $(this),
                currentNight = +this.dataset.night;

            // если указан интервал
            if (data.settings.range && !data.settings.multiple) {
              // выбор первой точки интервала, если вторая не выбрана или выбраны все
              if ((!data.states.nightFrom && !data.states.nightTo) || (data.states.nightFrom && data.states.nightTo)) {
                data.states.nightFrom = currentNight;
                data.states.nightTo = 0;

                $('.nightpicker__night').removeClass('-range-from-')
                                        .removeClass('-range-to-')
                                        .removeClass('-in-range-')
                                        .removeClass('-selected-');

                $this.addClass('-range-from-').addClass('-selected-');

                // отображение выбранных ночей
                $(data.settings.altField).val(data.states.nightFrom);
                $(data.settings.altField).trigger('change');
              }
              // выбор первой точки интервала, если вторая выбрана и это не та же самая точка
              else if (!data.states.nightFrom && data.states.nightTo && data.states.nightTo !== currentNight) {
                data.states.nightFrom = currentNight;

                $this.addClass('-range-from-').addClass('-selected-');

                // отображение выбранных ночей
                $(data.settings.altField).val(data.states.nightFrom + data.settings.separator + data.states.nightTo);
                $(data.settings.altField).trigger('change');
              }
              // выбор последней точки интервала, если первая выбрана и это не та же самая точка
              else if (data.states.nightFrom && !data.states.nightTo && data.states.nightFrom !== currentNight) {
                data.states.nightTo = currentNight;

                $this.addClass('-range-to-').addClass('-selected-');

                // отображение выбранных ночей
                $(data.settings.altField).val(data.states.nightFrom + data.settings.separator + data.states.nightTo);
                $(data.settings.altField).trigger('change');
              }
            }
            // если указан multiple
            else if (!data.settings.range && data.settings.multiple) {
              // выбор ночи, если она ещё не выбрана
              if (data.states.nights.indexOf(currentNight) == -1) {
                $this.addClass('-selected-');

                data.states.nights.unshift(currentNight);

                // Сортировка выбранных ночей по возрастанию
                if (data.settings.sort) {
                  data.states.nights.sort(function(a, b) {
                    return a - b;
                  });
                }

                // отображение выбранных ночей
                $(data.settings.altField).val(data.states.nights.join(data.settings.separator));
                $(data.settings.altField).trigger('change');
              } else {
                $this.removeClass('-selected-');
                data.states.nights.splice(data.states.nights.indexOf(currentNight), 1);

                // отображение выбранных ночей
                $(data.settings.altField).val(data.states.nights.join(data.settings.separator));
                $(data.settings.altField).trigger('change');
              }
            }
          });

          // подсвечивание ночей
          $nightpicker.on('mouseenter', '.nightpicker__night', function () {
            var $elementHover = $(this),
                elementHover = this,
                elementHoverNight = +elementHover.dataset.night;

            // убираем подсветку
            $('.nightpicker__night').removeClass('-hover-');
            $elementHover.addClass('-hover-');

            // если указан интервал
            if (data.settings.range && !data.settings.multiple) {

              // подсвечивать точки после первой точки интервала, если последняя точка не выбрана
              if (data.states.nightFrom && !data.states.nightTo) {
                // если выбранная точка больше первой точки интервала
                if (elementHoverNight > data.states.nightFrom) {
                  // выделить её в интервал
                  $('.nightpicker__night').removeClass('-range-to-');
                  $elementHover.addClass('-range-to-');

                  $('.nightpicker__night').removeClass('-in-range-').each(function (index, element) {
                    var $element = $(element),
                        elementNight = +element.dataset.night;

                    // выделить все точки, которые больше первой точки интервала и меньше текущей
                    if (elementNight > data.states.nightFrom && elementNight < elementHoverNight) {
                      $element.addClass('-in-range-');
                    }
                  });
                }
                // если выбранная точка меньше первой точки интервала
                else if (elementHoverNight < data.states.nightFrom) {
                  // поменять местами последнюю и первую точки интервала
                  data.states.nightTo = data.states.nightFrom;
                  data.states.nightFrom = 0;

                  $('.nightpicker__night').removeClass('-range-from-').removeClass('-range-to-').removeClass('-in-range-').each(function (index, element) {
                    var $element = $(element),
                        elementNight = +element.dataset.night;

                    // выделить последнюю точку интервала
                    if (elementNight == data.states.nightTo) {
                      $element.addClass('-range-to-');
                    }
                    // выделить все точки между текущей и последней точкой интервала
                    if (elementNight < data.states.nightTo && elementNight > elementHoverNight) {
                      $element.addClass('-in-range-');
                    }
                  });
                }
              }

              // подсвечивать точки перед последней точкой интервала, если первая точка не выбрана
              else if (!data.states.nightFrom && data.states.nightTo) {
                // если выбранная точка меньше последней точки интервала
                if (elementHoverNight < data.states.nightTo) {
                  // выделить её в интервал
                  $('.nightpicker__night').removeClass('-range-from-');
                  $elementHover.addClass('-range-from-');

                  $('.nightpicker__night').removeClass('-in-range-').each(function (index, element) {
                    var $element = $(element),
                        elementNight = +element.dataset.night;

                    // выделить все точки, которые больше текущей и меньше последней точки интервала
                    if (elementNight < data.states.nightTo && elementNight > elementHoverNight) {
                      $element.addClass('-in-range-');
                    }
                  });
                }
                // если выбранная точка больше последней точки интервала
                else if (elementHoverNight > data.states.nightTo) {
                  // поменять местами последнюю и первую точки интервала
                  data.states.nightFrom = data.states.nightTo;
                  data.states.nightTo = 0;

                  $('.nightpicker__night').removeClass('-range-from-').removeClass('-range-to-').removeClass('-in-range-').each(function (index, element) {
                    var $element = $(element),
                        elementNight = +element.dataset.night;

                    // выделить последнюю точку интервала
                    if (elementNight == data.states.nightFrom) {
                      $element.addClass('-range-from-');
                    }
                    // выделить все точки между текущей и последней точкой интервала
                    if (elementNight > data.states.nightFrom && elementNight < elementHoverNight) {
                      $element.addClass('-in-range-');
                    }
                  });
                }
              }

            }
          });

          // убрать подсвечивание ночей
          $nightpicker.on('mouseleave', '.nightpicker__night', function () {
            var $elementHover = $(this);
            $elementHover.removeClass('-hover-');
          });

          if (data.settings.debug) {
            console.log('>_ 🌙 Nightpicker > #' + data.gid + ' is Inited!');
          }

        }
      });

    },
    /* выбрать ночь */
    select: function ( nights ) {

      return this.each(function () {
        var $this = $(this),
             data = $this.data('nightpicker');

        // выбор ночей для интервала
        if (data.settings.range && !data.settings.multiple) {
          $('.nightpicker__night').each(function (index, element) {
            if (element.dataset.night == nights) {
              $(this).trigger('mouseenter').trigger('click');
            }
          });
        }
        // выбор ночей для multiple
        else if (!data.settings.range && data.settings.multiple) {
          $('.nightpicker__night').each(function (index, element) {
            if (nights.indexOf(+element.dataset.night) !== -1) {
              $(this).trigger('mouseenter').trigger('click');
            }
          });
        }

        if (data.settings.debug) {
          console.log('>_ 🌙 Nightpicker > #' + data.gid + ' is Selected!');
        }
      });

    },
    /* обновление параметров плагина */
    update: function ( options ) {

      return this.each(function () {
        var $this = $(this),
             data = $this.data('nightpicker');

        data.settings = $.extend(data.settings, options);

        $(data.settings.altField).trigger('change');

        if (data.settings.debug) {
          console.log('>_ 🌙 Nightpicker > #' + data.gid + ' is Updated!', data.settings);
        }
      });

    },
    /* сбросить выбранные ночи */
    clear: function ( ) {

      return this.each(function () {
        var $this = $(this),
             data = $this.data('nightpicker');

        data.states = {
          nightFrom: 0,
          nightTo: 0,
          nights: [],
        }
        $this.data('nightpicker', data);

        $('.nightpicker__night').removeClass('-range-from-')
                                .removeClass('-range-to-')
                                .removeClass('-in-range-')
                                .removeClass('-selected-');

        $(data.settings.altField).val('');

        if (data.settings.debug) {
          console.log('>_ 🌙 Nightpicker > #' + data.gid + ' is Cleared!');
        }
      });

    },
    /* удаление плагина со страницы */
    /*destroy: function( ) {

      return this.each(function() {
        var $this = $(this),
             data = $this.data('lamaprogress');

        $this.unbind('ajaxStart');
        $this.unbind('ajaxStop');
        $this.unbind('ajaxError');

        $(window).unbind('.lamaprogress');
        data.lamaprogress.remove();
        $this.removeData('lamaprogress');
        $this.empty();

        if (data.settings.debug) {
          console.log('>_ Stratos🚀 LamaProgress > #' + data.gid + ' is Destroy!');
        }
      });

    }*/
    /* добавить класс к элементу / массиву элементов / всем элементам */
    addClass: function ( userClass, nights ) {

      return this.each(function () {
        var $this = $(this),
             data = $this.data('nightpicker');

        $('.nightpicker__night').each(function (index, element) {
          // все ночи
          if (!nights) {
            $(this).addClass(userClass);
          }
          // одна ночь
          else if (!Array.isArray(nights)) {
            if (element.dataset.night == nights) {
              $(this).addClass(userClass);
            }
          }
          // перечисление нескольких ночей
          else {
            if (nights.indexOf(+element.dataset.night) !== -1) {
              $(this).addClass(userClass);
            }
          }
        });

        if (data.settings.debug) {
          console.log('>_ 🌙 Nightpicker > #' + data.gid + ' - classes are Added!');
        }
      });

    },
    /* убрать класс у элемента / массива элементов */
    removeClass: function ( userClass, nights ) {

      return this.each(function () {
        var $this = $(this),
             data = $this.data('nightpicker');

        $('.nightpicker__night').each(function (index, element) {
          // все ночи
          if (!nights) {
            $(this).removeClass(userClass);
          }
          // одна ночь
          else if (!Array.isArray(nights)) {
            if (element.dataset.night == nights) {
              $(this).removeClass(userClass);
            }
          }
          // перечисление нескольких ночей
          else {
            if (nights.indexOf(+element.dataset.night) !== -1) {
              $(this).removeClass(userClass);
            }
          }
        });

        if (data.settings.debug) {
          console.log('>_ 🌙 Nightpicker > #' + data.gid + ' - classes are Removed!');
        }
      });

    },
  };

  $.fn.nightpicker = function( method ) {

    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( '>_ 🌙 Nightpicker method - ' +  method + ' is not defined!' );
    }

  };
})( jQuery );
