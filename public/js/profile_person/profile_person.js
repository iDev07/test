(function($){samo.profile_person=function(){const $frm=$('#recovery-frm');function search_person(e){e.preventDefault();$.post($frm.attr('action'),$frm.serialize(),null,'script');}
$frm.on('submit',search_person);};samo.profile_person_email_sended=function(output){$('.sended').text(output);$('#recovery-frm').remove();};$(samo.profile_person);})(samo.jQuery);