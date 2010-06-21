var FormCheck=new Class({Implements:[Options,Events],options:{tipsClass:'fc-tbx',errorClass:'fc-error',fieldErrorClass:'fc-field-error',submit:true,trimValue:false,validateDisabled:false,submitByAjax:false,ajaxResponseDiv:false,ajaxEvalScripts:false,onAjaxRequest:$empty,onAjaxSuccess:$empty,onAjaxFailure:$empty,onSubmit:$empty,onValidateSuccess:$empty,onValidateFailure:$empty,display:{showErrors:0,titlesInsteadNames:0,errorsLocation:1,indicateErrors:1,indicateErrorsInit:0,keepFocusOnError:0,checkValueIfEmpty:1,addClassErrorToField:0,removeClassErrorOnTipClosure:0,fixPngForIe:1,replaceTipsEffect:1,flashTips:0,closeTipsButton:1,tipsPosition:"right",tipsOffsetX:-45,tipsOffsetY:0,listErrorsAtTop:false,scrollToFirst:true,fadeDuration:300},alerts:{required:"This field is required.",alpha:"This field accepts alphabetic characters only.",alphanum:"This field accepts alphanumeric characters only.",nodigit:"No digits are accepted.",digit:"Please enter a valid integer.",digitltd:"The value must be between %0 and %1",number:"Please enter a valid number.",email:"Please enter a valid email.",image:'This field should only contain image types',phone:"Please enter a valid phone.",phone_inter:"Please enter a valid international phone number.",url:"Please enter a valid url.",confirm:"This field is different from %0",differs:"This value must be different of %0",length_str:"The length is incorrect, it must be between %0 and %1",length_fix:"The length is incorrect, it must be exactly %0 characters",lengthmax:"The length is incorrect, it must be at max %0",lengthmin:"The length is incorrect, it must be at least %0",words_min:"This field must concain at least %0 words, currently: %1 words",words_range:"This field must contain %0-%1 words, currently: %2 words",words_max:"This field must contain at max %0 words, currently: %1 words",checkbox:"Please check the box",radios:"Please select a radio",select:"Please choose a value"},regexp:{required:/[^.*]/,alpha:/^[a-z ._-]+$/i,alphanum:/^[a-z0-9 ._-]+$/i,digit:/^[-+]?[0-9]+$/,nodigit:/^[^0-9]+$/,number:/^[-+]?\d*\.?\d+$/,email:/^([a-zA-Z0-9_\.\-\+%])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,image:/.(jpg|jpeg|png|gif|bmp)$/i,phone:/^[\d\s ().-]+$/,phone_inter:/^\+{0,1}[0-9 \(\)\.\-]+$/,url:/^(http|https|ftp)\:\/\/[a-z0-9\-\.]+\.[a-z]{2,3}(:[a-z0-9]*)?\/?([a-z0-9\-\._\?\,\'\/\\\+&amp;%\$#\=~])*$/i}},initialize:function(c,d){if(this.form=$(c)){this.form.isValid=true;this.regex=['length'];this.setOptions(d);if(typeof(formcheckLanguage)!='undefined')this.options.alerts=$merge(this.options.alerts,formcheckLanguage);this.validations=[];this.alreadyIndicated=false;this.firstError=false;var e=new Hash(this.options.regexp);e.each(function(a,b){this.regex.push(b)},this);this.form.getElements("*[class*=validate]").each(function(a){if(a.get('tag')=='select'||a.get('tag')=='input'||a.get('tag')=='textarea')this.register(a)},this);this.form.addEvents({"submit":this.onSubmit.bind(this)});if(this.options.display.fixPngForIe)this.fixIeStuffs();document.addEvent('mousewheel',function(){this.isScrolling=false}.bind(this))}},register:function(g,j){g.validation=[];g.getProperty("class").split(' ').each(function(c){if(c.match(/^validate(\[.+\])$/)){var d=true;if(g.type=="radio"){this.validations.each(function(a){if(a.name==g.name)d=false},this)}var e=eval(c.match(/^validate(\[.+\])$/)[1]);for(var f=0;f<e.length;f++){g.validation.push(e[f]);if(e[f].match(/^confirm\[/)){var h=eval(e[f].match(/^.+(\[.+\])$/)[1].replace(/([A-Z0-9\._-]+)/i,"'$1'"));if(this.form[h].validation.contains('required')){g.validation.push('required')}}if(e[f].match(/^target:.+/)){g.target=e[f].match(/^target:(.+)/)[1]}}if(j&&j<=this.validations.length){var i=[];this.validations.each(function(a,b){if(j==b+1&&d){i.push(g);this.addListener(g)}i.push(a)},this);this.validations=i}else{if(d){this.validations.push(g);this.addListener(g)}}}},this)},dispose:function(a){this.validations.erase(a)},addListener:function(b){b.errors=[];if(this.options.display.indicateErrorsInit){this.validations.each(function(a){if(!this.manageError(a,'submit'))this.form.isValid=false},this);return true}if(b.validation[0]=='submit'){b.addEvent('click',function(a){if(this.onSubmit(a))this.form.submit()}.bind(this));return true}if(this.isChildType(b)==false)b.addEvent('blur',function(){(function(){if(!this.fxRunning&&(b.element||this.options.display.showErrors==1)&&(this.options.display.checkValueIfEmpty||b.value))this.manageError(b,'blur')}.bind(this)).delay(100)}.bind(this))else if(this.isChildType(b)==true){var c=this.form.getElements('input[name="'+b.getProperty("name")+'"]');c.each(function(a){a.addEvent('blur',function(){(function(){if((b.element||this.options.display.showErrors==1)&&(this.options.display.checkValueIfEmpty||b.value))this.manageError(b,'click')}.bind(this)).delay(100)}.bind(this))},this)}},validate:function(d){d.errors=[];d.isOk=true;if(!this.options.validateDisabled&&d.get('disabled'))return true;if(this.options.trimValue&&d.value)d.value=d.value.trim();d.validation.each(function(a){if(this.isChildType(d)){if(this.validateGroup(d)==false){d.isOk=false}}else{var b=[];if(a.match(/target:.+/))return;if(a.match(/^.+\[/)){var c=a.split('[')[0];b=eval(a.match(/^.+(\[.+\])$/)[1].replace(/([A-Z0-9\._-]+)/i,"'$1'"))}else var c=a;if(this.regex.contains(c)&&d.get('tag')!="select"){if(this.validateRegex(d,c,b)==false){d.isOk=false}}if(c=='confirm'){if(this.validateConfirm(d,b)==false){d.isOk=false}}if(c=='differs'){if(this.validateDiffers(d,b)==false){d.isOk=false}}if(c=='words'){if(this.validateWords(d,b)==false){d.isOk=false}}if(d.get('tag')=="select"||(d.type=="checkbox"&&c=='required')){if(this.simpleValidate(d)==false){d.isOk=false}}if(a.match(/%[A-Z0-9\._-]+$/i)||(d.isOk&&a.match(/~[A-Z0-9\._-]+$/i))){if(eval(a.slice(1)+'(el)')==false){d.isOk=false}}}},this);if(d.isOk)return true;else return false},simpleValidate:function(a){if(a.get('tag')=='select'&&a.selectedIndex<=0){a.errors.push(this.options.alerts.select);return false}else if(a.type=="checkbox"&&a.checked==false){a.errors.push(this.options.alerts.checkbox);return false}return true},validateRegex:function(a,b,c){var d="";if(c[1]&&b=='length'){if(c[1]==-1){this.options.regexp.length=new RegExp("^[\\s\\S]{"+c[0]+",}$");d=this.options.alerts.lengthmin.replace("%0",c[0])}else if(c[0]==c[1]){this.options.regexp.length=new RegExp("^[\\s\\S]{"+c[0]+"}$");d=this.options.alerts.length_fix.replace("%0",c[0])}else{this.options.regexp.length=new RegExp("^[\\s\\S]{"+c[0]+","+c[1]+"}$");d=this.options.alerts.length_str.replace("%0",c[0]).replace("%1",c[1])}}else if(c[0]&&b=='length'){this.options.regexp.length=new RegExp("^.{0,"+c[0]+"}$");d=this.options.alerts.lengthmax.replace("%0",c[0])}else{d=this.options.alerts[b]}if(c[1]&&b=='digit'){var e=true;if(!this.options.regexp.digit.test(a.value)){a.errors.push(this.options.alerts[b]);e=false}if(c[1]==-1){var f=(a.value.toInt()>=c[0].toInt());d=this.options.alerts.digitmin.replace("%0",c[0])}else{var f=(a.value.toInt()>=c[0].toInt()&&a.value.toInt()<=c[1].toInt());d=this.options.alerts.digitltd.replace("%0",c[0]).replace("%1",c[1])}if(e==false||f==false){a.errors.push(d);return false}}else if(this.options.regexp[b].test(a.value)==false){a.errors.push(d);return false}return true},validateConfirm:function(a,b){var c=b[0];if(a.value!=this.form[c].value){if(this.options.display.titlesInsteadNames)var d=this.options.alerts.confirm.replace("%0",this.form[c].getProperty('title'));else var d=this.options.alerts.confirm.replace("%0",c);a.errors.push(d);return false}return true},validateDiffers:function(a,b){var c=b[0];if(a.value==this.form[c].value){if(this.options.display.titlesInsteadNames)var d=this.options.alerts.differs.replace("%0",this.form[c].getProperty('title'));else var d=this.options.alerts.differs.replace("%0",c);a.errors.push(d);return false}return true},validateWords:function(a,b){var c=b[0];var d=b[1];var e=a.value.replace(/[ \t\v\n\r\f\p]/m,' ').replace(/[,.;:]/g,' ').clean().split(' ');if(d==-1){if(e.length<c){a.errors.push(this.options.alerts.words_min.replace("%0",c).replace("%1",e.length));return false}}else{if(c>0){if(e.length<c||e.length>d){a.errors.push(this.options.alerts.words_range.replace("%0",c).replace("%1",d).replace("%2",e.length));return false}}else{if(e.length>d){a.errors.push(this.options.alerts.words_max.replace("%0",d).replace("%1",e.length));return false}}}return true},isFormValid:function(){this.form.isValid=true;this.validations.each(function(a){var b=this.manageError(a,'testonly');if(!b)this.form.isValid=false},this);return this.form.isValid},isChildType:function(a){return($defined(a.type)&&a.type=='radio')?true:false},validateGroup:function(a){a.errors=[];var b=this.form[a.getProperty("name")];a.group=b;var c=false;for(var d=0;d<b.length;d++){if(b[d].checked){c=true}}if(c==false){a.errors.push(this.options.alerts.radios);return false}else{return true}},listErrorsAtTop:function(b){if(!this.form.element){this.form.element=new Element('div',{'id':'errorlist','class':this.options.errorClass}).injectTop(this.form)}if($type(b)=='collection'){new Element('p').set('html',"<span>"+b[0].name+" : </span>"+b[0].errors[0]).injectInside(this.form.element)}else{if((b.validation.contains('required')&&b.errors.length>0)||(b.errors.length>0&&b.value&&b.validation.contains('required')==false)){b.errors.each(function(a){new Element('p').set('html',"<span>"+b.name+" : </span>"+a).injectInside(this.form.element)},this)}}window.fireEvent('resize')},manageError:function(a,b){var c=this.validate(a);if(b=='testonly')return c;if((!c&&a.validation.flatten()[0].contains('confirm['))||(!c&&a.validation.contains('required'))||(!a.validation.contains('required')&&a.value&&!c)){if(this.options.display.listErrorsAtTop==true&&b=='submit')this.listErrorsAtTop(a);if(this.options.display.indicateErrors==2||this.alreadyIndicated==false||a.name==this.alreadyIndicated.name){if(!this.firstError)this.firstError=a;this.alreadyIndicated=a;if(this.options.display.keepFocusOnError&&a.name==this.firstError.name)(function(){a.focus()}).delay(20);this.addError(a);return false}}else if((c||(!a.validation.contains('required')&&!a.value))){this.removeError(a);return true}return true},addError:function(b){var c=b.target?$(b.target).getCoordinates():b.getCoordinates();if(!b.element&&this.options.display.indicateErrors!=0){if(this.options.display.errorsLocation==1){var d=(this.options.display.tipsPosition=='left')?c.left:c.right;var e={'opacity':0,'position':'absolute','float':'left','left':d+this.options.display.tipsOffsetX}b.element=new Element('div',{'class':this.options.tipsClass,'styles':e}).injectInside(document.body);this.addPositionEvent(b)}else if(this.options.display.errorsLocation==2){b.element=new Element('div',{'class':this.options.errorClass,'styles':{'opacity':0}}).injectBefore(b)}else if(this.options.display.errorsLocation==3){b.element=new Element('div',{'class':this.options.errorClass,'styles':{'opacity':0}});if($type(b.group)=='object'||$type(b.group)=='collection')b.element.injectAfter(b.group[b.group.length-1]);else b.element.injectAfter(b)}}if(b.element&&b.element!=true){b.element.empty();if(this.options.display.errorsLocation==1){var f=[];b.errors.each(function(a){f.push(new Element('p').set('html',a))});var h=this.makeTips(f).injectInside(b.element);if(this.options.display.closeTipsButton){h.getElements('a.close').addEvent('mouseup',function(){this.removeError(b,'tip')}.bind(this))}b.element.setStyle('top',c.top-h.getCoordinates().height+this.options.display.tipsOffsetY)}else{b.errors.each(function(a){new Element('p').set('html',a).injectInside(b.element)})}if(!this.options.display.fadeDuration||Browser.Engine.trident&&Browser.Engine.version==5&&this.options.display.errorsLocation<2){b.element.setStyle('opacity',1)}else{b.fx=new Fx.Tween(b.element,{'duration':this.options.display.fadeDuration,'ignore':true,'onStart':function(){this.fxRunning=true}.bind(this),'onComplete':function(){this.fxRunning=false;if(b.element&&b.element.getStyle('opacity').toInt()==0){b.element.destroy();b.element=false}}.bind(this)})if(b.element.getStyle('opacity').toInt()!=1)b.fx.start('opacity',1)}}if(this.options.display.addClassErrorToField&&this.isChildType(b)==false){b.addClass(this.options.fieldErrorClass);b.element=b.element||true}},addPositionEvent:function(b){if(this.options.display.replaceTipsEffect){b.event=function(){var a=b.target?$(b.target).getCoordinates():b.getCoordinates();new Fx.Morph(b.element,{'duration':this.options.display.fadeDuration}).start({'left':[b.element.getStyle('left'),a.right+this.options.display.tipsOffsetX],'top':[b.element.getStyle('top'),a.top-b.element.getCoordinates().height+this.options.display.tipsOffsetY]})}.bind(this)}else{b.event=function(){var a=b.target?$(b.target).getCoordinates():b.getCoordinates();b.element.setStyles({'left':a.right+this.options.display.tipsOffsetX,'top':a.top-b.element.getCoordinates().height+this.options.display.tipsOffsetY})}.bind(this)}window.addEvent('resize',b.event)},removeError:function(a,b){if((this.options.display.addClassErrorToField&&!this.isChildType(a)&&this.options.display.removeClassErrorOnTipClosure)||(this.options.display.addClassErrorToField&&!this.isChildType(a)&&!this.options.display.removeClassErrorOnTipClosure&&b!='tip'))a.removeClass(this.options.fieldErrorClass);if(!a.element)return;this.alreadyIndicated=false;a.errors=[];a.isOK=true;window.removeEvent('resize',a.event);if(this.options.display.errorsLocation>=2&&a.element){new Fx.Tween(a.element,{'duration':this.options.display.fadeDuration}).start('height',0)}if(!this.options.display.fadeDuration||Browser.Engine.trident&&Browser.Engine.version==5&&this.options.display.errorsLocation==1&&a.element){this.fxRunning=true;a.element.destroy();a.element=false;(function(){this.fxRunning=false}.bind(this)).delay(200)}else if(a.element&&a.element!=true){a.fx.start('opacity',0)}},focusOnError:function(a){if(this.options.display.scrollToFirst&&!this.alreadyFocused&&!this.isScrolling){if(!this.options.display.indicateErrors||!this.options.display.errorsLocation){var b=a.getCoordinates().top-30}else if(this.alreadyIndicated.element){switch(this.options.display.errorsLocation){case 1:var b=a.element.getCoordinates().top;break;case 2:var b=a.element.getCoordinates().top-30;break;case 3:var b=a.getCoordinates().top-30;break}this.isScrolling=true}if(window.getScroll.y!=b){new Fx.Scroll(window,{onComplete:function(){this.isScrolling=false;if(a.getProperty('type')!='hidden')a.focus()}.bind(this)}).start(0,b)}else{this.isScrolling=false;a.focus()}this.alreadyFocused=true}},fixIeStuffs:function(){if(Browser.Engine.trident4){var a=new RegExp('url\\(([\.a-zA-Z0-9_/:-]+\.png)\\)');var b=new RegExp('(.+)formcheck\.css');for(var c=0;c<document.styleSheets.length;c++){if(document.styleSheets[c].href.match(/formcheck\.css$/)){var d=document.styleSheets[c].href.replace(b,'$1');var e=document.styleSheets[c].rules.length;for(var f=0;f<e;f++){var h=document.styleSheets[c].rules[f].style;var i=d+h.backgroundImage.replace(a,'$1');if(i&&i.match(/\.png/i)){var g=(h.backgroundRepeat=='no-repeat')?'crop':'scale';h.filter='progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, src=\''+i+'\', sizingMethod=\''+g+'\')';h.backgroundImage="none"}}}}}},makeTips:function(b){var c=new Element('table');c.cellPadding='0';c.cellSpacing='0';c.border='0';var d=new Element('tbody').injectInside(c);var e=new Element('tr').injectInside(d);new Element('td',{'class':'tl'}).injectInside(e);new Element('td',{'class':'t'}).injectInside(e);new Element('td',{'class':'tr'}).injectInside(e);var f=new Element('tr').injectInside(d);new Element('td',{'class':'l'}).injectInside(f);var h=new Element('td',{'class':'c'}).injectInside(f);var i=new Element('div',{'class':'err'}).injectInside(h);b.each(function(a){a.injectInside(i)});if(this.options.display.closeTipsButton)new Element('a',{'class':'close'}).injectInside(h);new Element('td',{'class':'r'}).injectInside(f);var g=new Element('tr').injectInside(d);new Element('td',{'class':'bl'}).injectInside(g);new Element('td',{'class':'b'}).injectInside(g);new Element('td',{'class':'br'}).injectInside(g);return c},reinitialize:function(b){this.validations.each(function(a){if(a.element){a.errors=[];a.isOK=true;if(this.options.display.flashTips==1||?b=='forced'){a.element.destroy();a.element=false}}},this);if(this.form.element)this.form.element.empty();this.alreadyFocused=false;this.firstError=false;this.elementToRemove=this.alreadyIndicated;this.alreadyIndicated=false;this.form.isValid=true},submitByAjax:function(){var b=this.form.getProperty('action');this.fireEvent('ajaxRequest');new Request({url:b,method:this.form.getProperty('method'),data:this.form.toQueryString(),evalScripts:this.options.ajaxEvalScripts,onFailure:function(a){this.fireEvent('ajaxFailure',a)}.bind(this),onSuccess:function(a){this.fireEvent('ajaxSuccess',a);if(this.options.ajaxResponseDiv)$(this.options.ajaxResponseDiv).set('html',a)}.bind(this)}).send()},onSubmit:function(c){this.reinitialize();this.fireEvent('onSubmit');this.validations.each(function(a){var b=this.manageError(a,'submit');if(!b)this.form.isValid=false},this);if(this.form.isValid){if(this.options.submitByAjax){new Event(c).stop();this.submitByAjax()}else if(!this.options.submit){new Event(c).stop()}this.fireEvent('validateSuccess');return true}else{new Event(c).stop();if(this.elementToRemove&&this.elementToRemove!=this.firstError&&this.options.display.indicateErrors==1){this.removeError(this.elementToRemove)}this.focusOnError(this.firstError);this.fireEvent('validateFailure');return false}}});