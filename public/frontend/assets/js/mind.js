$(document).ready(function () {
  
  // Определение устройства
  function initDevice() {
    var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (w < 992) { return 'mobile'; } else if (w >= 992 && w < 1024) { return 'tablet'; } else { return 'pc'; }
  };
  const device = initDevice();

  $(document).on('click', '._hbox', function () {
    const $this = $(this);
    const $target = $($this.data('hbox'));
    const $hboxWrap = $('._hbox-wrap');
    const $hbox = $('._hbox');

    /*
      data-hbox="#hbox-1"         – id hbox у триггера
      data-hbox-hold-always="1"   – не закрывать hbox, при открытии других hbox
      data-hbox-hold-click="1"    – не закрывать hbox, при клике на триггер
      data-hbox-fixed="1"         – запрещать скролл страницы в мобильной версии
      data-hbox-input="1"         – активировать/блокировать hbox (когда он input) при открытии/закрытии hbox
      data-hbox-input-alt="#el"   – альтернативный input для hbox
      data-hbox-disable-click="1" – устанавливать "disabled" элементу при клике
    */

    if (!$target.is('.active')) {
      /* закрывать hbox, если нет свойства data-hbox-hold-always="1" */
      $hboxWrap.each(function (i, el) {
        if ( !(!!+$(el).data('hboxHoldAlways')) ) { $(el).removeClass('active'); }
      });
      /* блокировать input, если есть свойство data-hbox-input="1" */
      $hbox.each(function (i, el) {
        if ( !!+$(el).data('hboxInput') ) {
          var hboxInputAlt = $(el).data('hboxInputAlt');
          /* если есть свойство data-hbox-input-alt и существует такой объект, блокировать его */
          if ( hboxInputAlt && $(hboxInputAlt).length ) { $(hboxInputAlt).attr('readonly', 'readonly'); }
          /* если нет свойства data-hbox-input-alt, блокировать сам hbox */
          else { $(el).attr('readonly', 'readonly'); }
        }
      });
      $target.addClass('active');
      /* активировать input, если есть свойство data-hbox-input="1" */
      if ( !!+$this.data('hboxInput') ) {
        var hboxInputAlt = $this.data('hboxInputAlt');
        /* если есть свойство data-hbox-input-alt и существует такой объект, активировать его */
        if ( hboxInputAlt && $(hboxInputAlt).length ) { $(hboxInputAlt).removeAttr('readonly').select(); }
        /* если нет свойства data-hbox-input-alt, активировать сам hbox */
        else { $this.removeAttr('readonly').select(); }
      }
      /* запрещать скролл страницы в моб. версии, если есть свойство data-hbox-fixed="1" */
      if ( !!+$target.data('hboxFixed') && device == 'mobile' ) { $('body').css({ 'overflow': 'hidden' }); }
      /* устанавливать "disabled" элементу при клике */
      if ( !!+$this.data('hboxDisableClick') ) { $this.attr('disabled', 'disabled'); }
    } else {
      /* закрывать hbox, если нет свойства data-hbox-hold-click="1" */
      if ( !(!!+$this.data('hboxHoldClick')) ) {
        $target.removeClass('active');
        /* блокировать input, если есть свойство data-hbox-input="1" */
        $hbox.each(function (i, el) {
          if ( !!+$(el).data('hboxInput') ) {
            var hboxInputAlt = $(el).data('hboxInputAlt');
            /* если есть свойство data-hbox-input-alt и существует такой объект, блокировать его */
            if ( hboxInputAlt && $(hboxInputAlt).length ) { $(hboxInputAlt).attr('readonly', 'readonly'); }
            /* если нет свойства data-hbox-input-alt, блокировать сам hbox */
            else { $(el).attr('readonly', 'readonly'); }
          }
        });
        /* разрешать скролл страницы в моб. версии, если есть свойство data-hbox-fixed="1" */
        if ( !!+$target.data('hboxFixed') && device == 'mobile' ) { $('body').css({ 'overflow': 'auto' }); }
        /* убирать "disabled" у элемента при клике */
        if ( !!+$this.data('hboxDisableClick') ) { $this.removeAttr('disabled'); }
      } else {
        /* активировать input, если есть свойство data-hbox-input="1" */
        if ( !!+$this.data('hboxInput') ) {
          var hboxInputAlt = $this.data('hboxInputAlt');
          /* если есть свойство data-hbox-input-alt и существует такой объект, активировать его */
          if ( hboxInputAlt && $(hboxInputAlt).length ) { $(hboxInputAlt).removeAttr('readonly').select(); }
          /* если нет свойства data-hbox-input-alt, активировать сам hbox */
          else { $this.removeAttr('readonly').select(); }
        }
      }
    }
  });

  /* Клик в любом месте */
  $(document).on('click', 'body', function (event) {
    const $hboxWrap = $('._hbox-wrap');
    const $hbox = $('._hbox');

    if ( !$(event.target).closest('._hbox-wrap').length && !$(event.target).closest('._hbox').length && $hboxWrap.is('.active') ) {
      $hboxWrap.each(function (i, el) {
        /* закрывать hbox, если нет свойства data-hbox-hold-always="1" */
        if ( !(!!+$(el).data('hboxHoldAlways')) ) { $(el).removeClass('active'); }
      });
      /* блокировать input, если есть свойство data-hbox-input="1" */
      $hbox.each(function (i, el) {
        if ( !!+$(el).data('hboxInput') ) { $(el).attr('readonly', 'readonly'); }
      });
    }
  });

});
