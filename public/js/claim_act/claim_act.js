(function($){samo.claim_act=function(){const _ROOT_URL=samo.ROUTES.claim_act.url;var $module_container=$('#claim_act');$module_container.find('a.external').on('click',samo.delayed_download);$module_container.find('.res').on('change','.upload-attach',function(e){var frm=document.getElementById("SAVE_ATTACHMENT_FORM_"+$(this).data('act-inc'));var formData=new FormData(frm);$.ajaxSetup({processData:false,contentType:false});$.post(_ROOT_URL+'samo_action=SAVE_ATTACHMENT',formData);}).on('click','.link.download-attach',function(){const fileInc=$(this).data('fileInc');$.getScript(_ROOT_URL+'samo_action=DOWNLOAD&fileInc='+fileInc);return false;});};$(samo.claim_act);})(samo.jQuery);