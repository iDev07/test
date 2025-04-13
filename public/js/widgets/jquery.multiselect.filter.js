(function($){var rEscape=/[\-\[\]{}()*+?.,\\\^$|#\s]/g;var filterRules={contains:'{{term}}',beginsWith:'^{{term}}',endsWith:'{{term}}$',exactMatch:'^{{term}}$',containsNumber:'\d',isNumeric:'^\d+$',isNonNumeric:'^\D+$',};var headerSelector='.ui-multiselect-header';var hasFilterClass='ui-multiselect-hasfilter';var filterClass='ui-multiselect-filter';var optgroupClass='ui-multiselect-optgroup';var groupLabelClass='ui-multiselect-grouplabel';var hiddenClass='ui-multiselect-excluded';function debounce(func,wait,immediate){var timeout;return function(){var context=this;var args=arguments;var later=function(){timeout=null;if(!immediate){func.apply(context,args);}};var callNow=immediate&&!timeout;clearTimeout(timeout);timeout=setTimeout(later,wait);if(callNow){func.apply(context,args);}};}
$.widget('ech.multiselectfilter',{options:{label:'Filter:',placeholder:'Enter keywords',filterRule:'contains',searchGroups:false,autoReset:false,width:null,debounceMS:250,},_create:function(){var opts=this.options;var $element=this.element;this.instance=$element.data('ech-multiselect');this.$header=this.instance.$menu.find(headerSelector).addClass(hasFilterClass);this.$input=$(document.createElement('input')).attr({placeholder:opts.placeholder,type:'search',}).css({width:(typeof opts.width==='string')?this.instance._parse2px(opts.width,this.$header).px+'px':(/\d/.test(opts.width)?opts.width+'px':null),});this._bindInputEvents();if(this.options.autoReset){$element.on('multiselectbeforeclose',$.proxy(this._reset,this));}
var $label=$(document.createElement('label')).text(opts.label).append(this.$input).addClass('ui-multiselect-filter-label');this.$wrapper=$(document.createElement('div')).addClass(filterClass).append($label).prependTo(this.$header);if(!!this.instance._isOpen){this.instance._setMenuHeight(true);}
this.updateCache();var instance=this.instance;var filter=this.$input[0];instance._oldToggleChecked=instance._toggleChecked;instance._toggleChecked=function(flag,group){instance._oldToggleChecked(flag,group,!!filter.value);};},_bindInputEvents:function(){this.$input.on({keydown:function(e){if(e.which===13){e.preventDefault();}else if(e.which===27){$element.multiselect('close');e.preventDefault();}else if(e.which===9&&e.shiftKey){$element.multiselect('close');e.preventDefault();}else if(e.altKey){switch(e.which){case 82:e.preventDefault();$(this).val('').trigger('input','');break;case 65:$element.multiselect('checkAll');break;case 85:$element.multiselect('uncheckAll');break;case 70:$element.multiselect('flipAll');break;case 76:$element.multiselect('instance').$labels.first().trigger('mouseenter');break;}}},input:$.proxy(debounce(this._handler,this.options.debounceMS),this),search:$.proxy(this._handler,this),});},_handler:function(e){var term=this.$input[0].value.toLowerCase().replace(/^\s+|\s+$/g,'');var filterRule=this.options.filterRule||'contains';var regex=new RegExp((filterRules[filterRule]||filterRule).replace('{{term}}',term.replace(rEscape,'\\$&')),'i');var searchGroups=!!this.options.searchGroups;var $checkboxes=this.instance.$checkboxes;var cache=this.cache;this.$rows.toggleClass(hiddenClass,!!term);var filteredInputs=$checkboxes.children().map(function(x){var elem=this;var $groupItems=$(elem);var groupShown=false;if(elem.classList.contains(optgroupClass)){var $groupItems=$groupItems.find('li');if(searchGroups&&regex.test(cache[x])){elem.classList.remove(hiddenClass);$groupItems.removeClass(hiddenClass);return $groupItems.find('input').get();}}
return $groupItems.map(function(y){if(regex.test(cache[x+'.'+y])){if(!groupShown){elem.classList.remove(hiddenClass);groupShown=true;}
this.classList.remove(hiddenClass);return this.getElementsByTagName('input')[0];}
return null;});});if(term){this._trigger('filter',e,filteredInputs);}
if(!this.instance.options.listbox&&this.instance._isOpen){this.instance._setMenuHeight(true);this.instance.position();}
return;},_reset:function(){this.$input.val('');var event=document.createEvent('Event');event.initEvent('reset',true,true);this.$input.get(0).dispatchEvent(event);this._handler(event);},updateCache:function(alsoRefresh){var cache={};this.instance.$checkboxes.children().each(function(x){var $element=$(this);if(this.classList.contains(optgroupClass)){cache[x]=this.getElementsByClassName(groupLabelClass)[0].textContent;$element=$element.find('li');}
$element.each(function(y){cache[x+'.'+y]=this.textContent;});});this.cache=cache;this.$rows=this.instance.$checkboxes.find('li');if(!!alsoRefresh){this._handler();}},widget:function(){return this.$wrapper;},destroy:function(){$.Widget.prototype.destroy.call(this);this.$input.val('').trigger('keyup').off('keydown input search');this.instance.$menu.find(headerSelector).removeClass(hasFilterClass);this.$wrapper.remove();},});})(samo.jQuery);