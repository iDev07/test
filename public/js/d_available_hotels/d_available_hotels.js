(function($){const $module_container=$('#d_available_hotels');samo.d_available_hotels=function(){samo.cache_controls($module_container);const _ROOT_URL=samo.ROUTES.d_available_hotels.url;$module_container.find('.date').datePicker();$module_container.find('.TOURINC').chosen();$module_container.find('.search.button').on('click',function(){let TOURINC=$module_container.find('.TOURINC').val();let DATEFROM=$.controlValue($('.DATEFROM',$module_container).get(0));let DATETO=$.controlValue($('.DATETO',$module_container).get(0));if(checkFields(TOURINC,DATEFROM,DATETO)){let result={};result.TOURINC=TOURINC;result.DATEFROM=DATEFROM;result.DATETO=DATETO;result.samo_action='RESULT';$.getScript(_ROOT_URL+$.param(result));}});function checkFields(tourinc,datefrom,dateto){let is_ok=true;if(tourinc<=0){$module_container.find('.TOURINC').errorField(samo.i18n('MB_FIELD_ERROR'));is_ok=false;}
if(!datefrom){$module_container.find('.DATEFROM').errorField(samo.i18n('MB_FIELD_ERROR'));is_ok=false;}
if(!dateto){$module_container.find('.DATETO').errorField(samo.i18n('MB_FIELD_ERROR'));is_ok=false;}
if(datefrom&&dateto&&datefrom>dateto){$module_container.find('.DATEFROM').errorField(samo.i18n('MB_FIELD_ERROR'));is_ok=false;}
return is_ok;}};$(samo.d_available_hotels);})(samo.jQuery);