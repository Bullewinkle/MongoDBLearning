var mongo={config:null,shells:{}};mongo.Coll=function(a,b){if(b.length>80)throw new mongo.CollectionNameError("Collection name must be 80 characters or less");if(b.match(/(\$|\0)/))throw new mongo.CollectionNameError("Collection name may not contain $ or \\0");if(b.match(/^system\./))throw new mongo.CollectionNameError("Collection name may not begin with system.*");if(""===b)throw new mongo.CollectionNameError("Collection name may not be empty");this.name=b,this.db=a,this.shell=a.shell,this.urlBase=mongo.util.getDBCollectionResURL(a.shell.mwsResourceID,b)},mongo.Coll.prototype.toString=function(){return this.db.toString()+"."+this.name},mongo.Coll.prototype.find=function(a,b){function c(a,b){$.extend(params,b),mongo.request.makeRequest(d,params,"GET","dbCollectionFind",e,a)}var d=this.urlBase+"find",e=this.shell;a=a||null,b=b||null;var f;return mongo.events.functionTrigger(this.shell,"db.collection.find",arguments,{collection:this.name}),params={query:a,projection:b},f=new mongo.Cursor(this,c)},mongo.Coll.prototype.findOne=function(a,b){var c=this.urlBase+"find_one",d=this.shell;a=a||null,b=b||null;var e={query:a,projection:b};mongo.events.functionTrigger(this.shell,"db.collection.findOne",arguments,{collection:this.name});var f=d.evaluator.pause();mongo.request.makeRequest(c,e,"GET","dbCollectionFindOne",d,function(a){d.evaluator.resume(f,a)})},mongo.Coll.prototype.count=function(a){var b=this.urlBase+"count",c=this.shell;a=a||null;var d={query:a};mongo.events.functionTrigger(c,"db.collection.count",arguments,{collection:this.name});var e=c.evaluator.pause();mongo.request.makeRequest(b,d,"GET","dbCollectionCount",c,function(a){c.evaluator.resume(e,a)})},mongo.Coll.prototype.insert=function(a){var b=this.urlBase+"insert",c={document:a},d=this.shell;mongo.events.functionTrigger(this.shell,"db.collection.insert",arguments,{collection:this.name});var e=d.evaluator.pause();tst=mongo.request.makeRequest(b,c,"POST","dbCollectionInsert",d,function(a){d.evaluator.resume(e,a.pretty)})},mongo.Coll.prototype.save=function(a){var b=this.urlBase+"save",c={document:a},d=this.shell;mongo.events.functionTrigger(this.shell,"db.collection.save",arguments,{collection:this.name});var e=d.evaluator.pause();mongo.request.makeRequest(b,c,"POST","dbCollectionSave",d,function(a){d.evaluator.resume(e,a.pretty)})},mongo.Coll.prototype.remove=function(a,b){var c=this.shell;if("object"!=typeof b){var d=b;b={justOne:!!d}}if(!a)return void c.insertError("remove needs a query");var e=this.urlBase+"remove",f={constraint:a,options:b};mongo.events.functionTrigger(this.shell,"db.collection.remove",arguments,{collection:this.name});var g=c.evaluator.pause();mongo.request.makeRequest(e,f,"DELETE","dbCollectionRemove",c,function(a){c.evaluator.resume(g,a.pretty)})},mongo.Coll.prototype.update=function(a,b,c,d){var e=this.urlBase+"update",f=this.shell;if(mongo.events.functionTrigger(this.shell,"db.collection.update",arguments,{collection:this.name}),"object"==typeof c){if(void 0!==d){var g="Fourth argument must be empty when specifying upsert and multi with an object";throw this.shell.insertError(g),{message:"dbCollectionUpdate: Syntax error"}}d=c.multi,c=c.upsert}var h={query:a,update:b,upsert:!!c,multi:!!d},i=f.evaluator.pause();mongo.request.makeRequest(e,h,"PUT","dbCollectionUpdate",f,function(a){f.evaluator.resume(i,a.pretty)})},mongo.Coll.prototype.drop=function(){var a=this.urlBase+"drop",b=this.shell;mongo.events.functionTrigger(this.shell,"db.collection.drop",arguments,{collection:this.name});var c=b.evaluator.pause();mongo.request.makeRequest(a,null,"DELETE","dbCollectionDrop",b,function(){b.evaluator.resume(c,!0)})},mongo.Coll.prototype.aggregate=function(){function a(a){mongo.request.makeRequest(d,b,"GET","dbCollectionAggregate",c,a)}var b,c=this.shell;b=1===arguments.length&&$.isArray(arguments[0])?arguments[0]:$.makeArray(arguments);var d=this.urlBase+"aggregate";return mongo.events.functionTrigger(this.shell,"db.collection.aggregate",arguments,{collection:this.name}),cursor=new mongo.Cursor(this,a)},mongo.Coll.prototype.__methodMissing=function(a){var b,c={createIndex:0,copyTo:0,distinct:0,dropIndex:0,dropIndexes:0,ensureIndex:0,findAndModify:0,getIndexes:0,getShardDistribution:0,getShardVersion:0,group:0,isCapped:0,mapReduce:0,reIndex:0,renameCollection:0,stats:0,storageSize:0,totalSize:0,totalIndexSize:0,validate:0};return b=c.hasOwnProperty(a)?" is not implemented.":" is not a function on collections.",this.shell.insertError(a+b),mongo.util.noOp},mongo.CollectionNameError=function(a){this.name="CollectionNameError",this.message=a||"Invalid collection name"},mongo.CollectionNameError.prototype=new Error,mongo.CollectionNameError.prototype.constructor=mongo.CollectionNameError,mongo.Cursor=function(a,b){this._coll=a,this._shell=a.shell,this.urlBase=mongo.util.getDBCollectionResURL(this._shell.mwsResourceID,a.name),this._query=b,this._executed=!1,this._result=[],this._retrieved=0,this._count=0,this._batchSize=a.shell.getShellBatchSize()},mongo.Cursor.prototype._executeQuery=function(a){var b=function(b){b&&(mongo.events.callbackTrigger(this._shell,"cursor.execute",b.result.slice()),this._storeQueryResult(b.result),this._cursorId=b.cursor_id||this._cursorId,this._count=b.count||this._count,this._retrieved+=b.result.length,this._hasNext=this._retrieved<this._count),a&&a()}.bind(this);if(this._executed)this._getMore(b);else{var c={};c.sort=this._sort,c.limit=this._limit,c.skip=this._skip,this._query(b,c),this._executed=!0}},mongo.Cursor.prototype._getMore=function(a){if((!this._executed||this._retrieved<this._count)&&0===this._result.length){var b=this.urlBase+"next",c={};c.cursor_id=this._cursorId,c.retrieved=this._retrieved,mongo.request.makeRequest(b,c,"GET","CursorGetMore",this._shell,a)}else a&&a()},mongo.Cursor.prototype._printBatch=function(){function a(){function a(){b.next(function(d){b._shell.insertResponseLine(d),c++,c<b._batchSize?b.hasNext()&&a():b._shell.insertResponseLine('Type "it" for more')})}b._shell.lastUsedCursor=b;var c=0;a()}var b=this;if(this._executed)a();else{var c=this._shell.evaluator.pause();this._executeQuery(function(){a(),b._shell.evaluator.resume(c)})}},mongo.Cursor.prototype._storeQueryResult=function(a){this._result=a.reverse().concat(this._result)},mongo.Cursor.prototype._warnIfExecuted=function(a){return this._executed&&(this._shell.insertResponseLine("Warning: Cannot call "+a+" on already executed mongo.Cursor."+this),console.warn("Cannot call",a,"on already executed mongo.Cursor.",this)),this._executed},mongo.Cursor.prototype._ensureNotExecuted=function(a){if(this._executed)throw new Error("Cannot "+a+" results after query has been executed.")},mongo.Cursor.prototype.hasNext=function(){return this._result.length>0||this._hasNext},mongo.Cursor.prototype.next=function(a){if(this._result.length>0)return void a(this._result.pop());var b=this._shell.evaluator.pause();this._executeQuery(function(){var c,d;0===this._result.length?(c=new Error("Cursor does not have any more elements."),d=!0,this._shell.lastUsedCursor=null,this._count%this._batchSize===0&&this._executeQuery()):(c=this._result.pop(),d=!1),a&&!d&&a(c),this._shell.evaluator.resume(b,c,d)}.bind(this))},mongo.Cursor.prototype.sort=function(a){if(this._ensureNotExecuted("sort"),!$.isPlainObject(a))throw new Error("Sort must be an object");return this._sort=a,console.debug("mongo.Cursor would be sorted with",a,this),this},mongo.Cursor.prototype.skip=function(a){if(this._ensureNotExecuted("skip"),!mongo.util.isInteger(a))throw new Error("Skip amount must be an integer.");return this._skip=a,this},mongo.Cursor.prototype.limit=function(a){if(this._ensureNotExecuted("limit"),!mongo.util.isInteger(a))throw new Error("Limit amount must be an integer.");return this._limit=a,this},mongo.Cursor.prototype.batchSize=function(){throw new Error("batchSize() is disallowed in the web shell")},mongo.Cursor.prototype.toArray=function(){for(var a=[];this.hasNext();)a.push(this.next());return a},mongo.Cursor.prototype.count=function(a){if(a=!!a,this._count)return this._count;var b=this._shell.evaluator.pause();this._executeQuery(function(){this._shell.evaluator.resume(b,this._count,!1)}.bind(this))},mongo.Cursor.prototype.size=function(){return this.count(!0)},mongo.Cursor.prototype.toString=function(){var a=this._query||{};return"Cursor: "+this._coll.toString()+" -> "+mongo.jsonUtils.tojson(a)},mongo.Cursor.prototype.__methodMissing=function(a){if(mongo.util.isInteger(a)){var b=this._shell.evaluator.pause();this.toArray(function(c){this._shell.evaluator.resume(b,c[a])}.bind(this))}},mongo.Readline=function(a,b){this.inputBox=a,this.submitFunction=b,localStorage&&(this.history=localStorage[mongo.config.shellHistoryKey]),this.history=this.history?JSON.parse(this.history):[],this.historyIndex=this.history.length,this.historyFirstCommand="",this.inputBox.on("keydown",function(a,b){this.keydown(b)}.bind(this))},mongo.Readline.prototype.keydown=function(a){var b,c=mongo.config.keycodes;switch(a.keyCode){case c.up:b=this.getOlderHistoryEntry();break;case c.down:b=this.getNewerHistoryEntry();break;case c.enter:this.submit(this.inputBox.getValue());break;default:return}void 0!==b&&null!==b&&(this.inputBox.setValue(b),this.moveCursorToEnd()),a.preventDefault?a.preventDefault():a.returnValue=!1},mongo.Readline.prototype.getNewerHistoryEntry=function(){if(0===this.history.length)return void 0;var a=this.historyIndex;return this.historyIndex=Math.min(this.historyIndex+1,this.history.length),this.historyIndex===this.history.length?a!==this.historyIndex?this.historyFirstCommand:void 0:this.history[this.historyIndex]},mongo.Readline.prototype.getOlderHistoryEntry=function(){return 0===this.history.length?void 0:(this.historyIndex===this.history.length&&(this.historyFirstCommand=this.inputBox.getValue()),this.historyIndex=Math.max(this.historyIndex-1,0),this.history[this.historyIndex])},mongo.Readline.prototype.submit=function(a){if(this.history.push(a),localStorage){var b=localStorage[mongo.config.shellHistoryKey];b=b?JSON.parse(b):[],b.push(a),b.length>mongo.config.shellHistorySize&&b.shift(),localStorage[mongo.config.shellHistoryKey]=JSON.stringify(b)}this.historyIndex=this.history.length,this.submitFunction()},mongo.Readline.prototype.moveCursorToEnd=function(){var a=this.inputBox.lineCount()-1,b=this.inputBox.getLine(a).length-1;this.inputBox.setCursor({line:a,pos:b})},mongo.Readline.prototype.getLastCommand=function(){return this.history[this.history.length-2]},mongo.Shell=function(a,b){this.$rootElement=$(a),this.hasShownResponse=!1,this.id=b,this.mwsResourceID=null,this.readline=null,this.lastUsedCursor=null,this.shellBatchSize=mongo.config.shellBatchSize,this.db=new mongo.DB(this,"test"),this.injectHTML(),this.attachClickListener()},mongo.Shell.prototype.injectHTML=function(){this.$rootElement.html('<div class="mws-scroll-wrapper">'+this.$rootElement.html()+'<div class="mws-responses"/><div class="mws-input-wrapper"><div class="mws-prompt">&gt;</div><div class="mws-input"></div></div></div>'),this.$responseWrapper=this.$rootElement.find(".mws-responses"),this.responseBlock=CodeMirror(this.$responseWrapper.get(0),{readOnly:!0,lineWrapping:!0,theme:"default"}),this.$responseWrapper.css({display:"none"}),this.inputBox=CodeMirror(this.$rootElement.find(".mws-input").get(0),{matchBrackets:!0,lineWrapping:!0,readOnly:"nocursor",theme:"default"}),$(this.inputBox.getWrapperElement()).css({background:"transparent"}),this.$inputPrompt=this.$rootElement.find(".mws-prompt").hide(),this.$inputWrapper=this.$rootElement.find(".mws-input-wrapper"),this.$scrollWrapper=this.$rootElement.find(".mws-scroll-wrapper"),this.evaluator=new Evaluator,this.evaluator.setGlobal("print",function(){this.insertResponseLine($.makeArray(arguments).map(function(a){return mongo.util.toString(a)}).join(" "))}.bind(this)),this.evaluator.setGlobal("ObjectId",function(a){return{$oid:a}}),this.evaluator.setGlobal("__get",mongo.util.__get),this.evaluator.setGlobal("db",this.db)},mongo.Shell.prototype.clear=function(){this.responseBlock.setValue(""),this.hasShownResponse=!1},mongo.Shell.prototype.attachClickListener=function(){this.$rootElement.click(function(){this.inputBox.focus(),this.inputBox.refresh(),this.responseBlock.setSelection({line:0,ch:0})}.bind(this))},mongo.Shell.prototype.attachInputHandler=function(a){this.mwsResourceID=a,this.readline=new mongo.Readline(this.inputBox,this.handleInput.bind(this)),this.enableInput(!0)},mongo.Shell.prototype.handleInput=function(){var a=this.inputBox.getValue();if(""===a.trim&&this.insertResponseLine(">"),this.insertResponseLine(a,"> "),this.inputBox.setValue(""),!mongo.keyword.handleKeywords(this,a))try{var b=mongo.mutateSource.swapMemberAccesses(a);this.eval(b)}catch(c){this.insertError(c)}},mongo.Shell.prototype.eval=function(a){this.evaluator.eval(a,function(a,b){b?this.insertError(a):a instanceof mongo.Cursor?a._printBatch():void 0!=a&&this.insertResponseLine(a)}.bind(this))},mongo.Shell.prototype.enableInput=function(a){var b=a?!1:"nocursor";this.inputBox.setOption("readOnly",b),a?this.$inputPrompt.show():this.$inputPrompt.hide()},mongo.Shell.prototype.focus=function(){this.inputBox.focus()},mongo.Shell.prototype.insertResponseArray=function(a){for(var b=0;b<a.length;b++)this.insertResponseLine(a[b],null,!0);this.responseBlock.refresh()},mongo.Shell.prototype.insertResponseLine=function(a,b,c){var d=this.responseBlock.lineCount()-1,e=this.responseBlock.getLine(d).length,f={line:d,ch:e},g="string"==typeof a,h=this.hasShownResponse?"\n":"";if(a=mongo.util.toString(a),b){a=b+a;var i=Array(b.length+1).join(" ");a=a.replace(/\n/g,"\n"+i)}if(this.responseBlock.replaceRange(h+a,f),g&&!b)for(var j=a.match(/\n/g),k=j?j.length+1:1,l=this.responseBlock.lineCount(),m=l-k,n=m;l>n;n++)this.responseBlock.addLineClass(n,"text","mws-cm-plain-text");this.hasShownResponse=!0,this.$responseWrapper.css({display:""}),this.$inputWrapper.css({marginTop:"-8px"}),c||this.responseBlock.refresh(),this.$scrollWrapper.scrollTop(this.$scrollWrapper.get(0).scrollHeight)},mongo.Shell.prototype.insertError=function(a){a=a instanceof Error||a instanceof this.evaluator.getGlobal("Error")?a.toString():a.message?"ERROR: "+a.message:"ERROR: "+a,this.insertResponseLine(a)},mongo.Shell.prototype.getShellBatchSize=function(){var a=this.shellBatchSize;if(!mongo.util.isNumeric(a))throw this.insertResponseLine("ERROR: Please set DBQuery.shellBatchSize to a valid numerical value."),console.debug("Please set DBQuery.shellBatchSize to a valid numerical value."),"Bad shell batch size.";return a},mongo.config=function(){var a=window.MWS_HOST||"",b={enter:13,left:37,up:38,right:39,down:40};return{keycodes:b,keepAliveTime:3e4,rootElementSelector:".mongo-web-shell",scriptName:"mongoWebShell",shellBatchSize:20,shellHistoryKey:"mongo.history",shellHistorySize:500,mwsHost:a,baseUrl:a+"/mws/"}}(),mongo.DB=function(a,b){this.name=b,this.shell=a},mongo.DB.prototype.toString=function(){return this.name},mongo.DB.prototype.listCollections=function(){mongo.keyword.show(this.shell,["collections"])},mongo.DB.prototype.getName=function(){return this.name},mongo.DB.prototype.__methodMissing=function(a){var b={addUser:0,adminCommand:0,auth:0,cloneDatabase:0,commandHelp:0,copyDatabase:0,createCollection:0,currentOp:0,dropDatabase:0,eval:0,fsyncLock:0,fsyncUnlock:0,getCollection:0,getLastError:0,getLastErrorObj:0,getMongo:0,getPrevError:0,getProfilingLevel:0,getProfilingStatus:0,getReplicationInfo:0,getSiblingDB:0,hostInfo:0,isMaster:0,killOp:0,listCommands:0,loadServerScripts:0,logout:0,printCollectionStats:0,printReplicationInfo:0,printShardingStatus:0,printSlaveReplicationInfo:0,removeUser:0,repairDatabase:0,resetError:0,runCommand:0,serverStatus:0,setProfilingLevel:0,setVerboseShell:0,shutdownServer:0,stats:0,version:0};return b.hasOwnProperty(a)?(this.shell.insertError("The web shell does not support db."+a+"()"),mongo.util.noOp):(this[a]=new mongo.Coll(this,a),this[a])},mongo.DB.prototype.getCollectionNames=function(a){var b=mongo.util.getDBResURL(this.shell.mwsResourceID)+"getCollectionNames";mongo.request.makeRequest(b,void 0,"GET","getCollectionNames",this.shell,a)},mongo.events=function(){var a=function(a,b,c){c=$.extend({shell:a,event:b},c),console.info("["+a.id+"] "+b+" triggered with data ",c);var d=a.events;d=d&&d[b],d&&$.each(d,function(a,b){b(c)})},b=function(a,b,c,d){d=$.extend({arguments:c},d),mongo.events.trigger(a,b,d)},c=function(a,b,c,d){d=$.extend({result:c},d),mongo.events.trigger(a,b,d)},d=function(a,b,c,d,e){return $.Deferred(function(f){a.events||(a.events={}),a.events[b]||(a.events[b]={});var g=function(b){var g=$.extend({},d,b);("function"!=typeof e||e.call(a,g))&&("function"==typeof c&&c.call(a,g),f.resolveWith(a,[g]))};"function"==typeof c&&(c.id||(c.id=++mongo.events._id),a.events[b][c.id]=g)}).promise()},e=function(a,b,c,d,e){return mongo.events.bind(a,b,c,d,e).done(function(){mongo.events.unbind(a,b,c)})},f=function(a,b,c,d){return mongo.shells.map(function(e){return mongo.events.bind(e,a,b,c,d)})},g=function(a,b,c){if(c){if(!c.id)return;delete a.events[b][c.id]}else delete a.events[b]},h=function(a,b){mongo.shells.forEach(function(c){mongo.events.unbind(c,a,b)})};return{trigger:a,functionTrigger:b,callbackTrigger:c,bind:d,bindOnce:e,bindAll:f,unbind:g,unbindAll:h,_id:0}}(),mongo.init=function(){function a(a){for(var b={},c=[],d=0,e=a.length;e>d;++d)b.hasOwnProperty(a[d])||(c.push(a[d]),b[a[d]]=1);return c}function b(a){var b={};return $.each(a,function(a,c){$.each(c,function(a,d){if($.isArray(d)){var e=b[a]||[];b[a]=e.concat(d)}else console.error("Json format is incorrect, top level collection name "+a+"does not map to an array: "+c)})}),b}function c(a,b){var c=$.map(a,function(a){return $.ajax(a)});$.when.apply($,c).then(function(){b()})}var d={},e=function(){mongo.util.enableConsoleProtection();var e=[],f=[],g=[];$(mongo.config.rootElementSelector).each(function(a,b){var c=b.getAttribute("data-initialization-url");c&&e.push(c);var d=b.getAttribute("data-initialization-json");if(d&&"{"===d[0]&&"}"===d[d.length-1])try{f.push(JSON.parse(d))}catch(h){console.error("Unable to parse initialization json: "+d)}else d&&g.push(d);mongo.shells[a]=new mongo.Shell(b,a)}),mongo.request.createMWSResource(mongo.shells,function(h){setInterval(function(){mongo.request.keepAlive(h.res_id)},mongo.config.keepAliveTime),e=$.map(a(e),function(a){return{type:"POST",url:a,data:JSON.stringify({res_id:h.res_id}),contentType:"application/json"}}),g=$.map(a(g),function(a){return{type:"GET",url:a,success:function(a){"string"==typeof a&&(a=JSON.parse(a)),f.push(a)}}}),c(g,function(){f=b(f),Object.keys(f).length>0&&e.push({type:"POST",url:"/init/load_json",data:JSON.stringify({res_id:h.res_id,collections:f}),contentType:"application/json"}),d[h.res_id]=e;var a=function(){$.each(mongo.shells,function(a,b){b.attachInputHandler(h.res_id)})};h.is_new?mongo.init.runInitializationScripts(h.res_id,a):a()})})},f=function(a,b){c(d[a],b)};return{run:e,runInitializationScripts:f}}(),mongo.jsonUtils=function(){var a=function(a,d,e){if(null===a||void 0===a)return String(a);switch(d=d||"",typeof a){case"string":var f=new Array(a.length+1);f[0]='"';for(var g=0;g<a.length;g++)if('"'===a[g])f[f.length]='\\"';else if("\\"===a[g])f[f.length]="\\\\";else if("\b"===a[g])f[f.length]="\\b";else if("\f"===a[g])f[f.length]="\\f";else if("\n"===a[g])f[f.length]="\\n";else if("\r"===a[g])f[f.length]="\\r";else if("	"===a[g])f[f.length]="\\t";else{var h=a.charCodeAt(g);f[f.length]=32>h?(16>h?"\\u000":"\\u00")+h.toString(16):a[g]}return f.join("")+'"';case"number":case"boolean":return""+a;case"object":var i=$.isArray(a)?c:b,j=i(a,d,e);return null!==e&&void 0!==e&&e!==!0||!(j.length<80)||null!==d&&0!==d.length||(j=j.replace(/[\t\r\n]+/gm," ")),j;case"function":return a.toString();default:throw"tojson can't handle type "+typeof a}},b=function(b,c,f){var g=f?" ":"\n",h=f?"":"	";if(c=c||"","function"==typeof b.tojson&&b.tojson!==a)return b.tojson(c,f);if(b.constructor&&"function"==typeof b.constructor.tojson&&b.constructor.tojson!==a)return b.constructor.tojson(b,c,f);if(e(b,"toString")&&!$.isArray(b))return b.toString();if(b instanceof Error)return b.toString();if(d(b))return'ObjectId("'+b.$oid+'")';c+=h;var i="{",j=[];for(var k in b)if(b.hasOwnProperty(k)){var l=b[k],m='"'+k+'" : '+a(l,c,f);"_id"===k?j.unshift(m):j.push(m)}return i+=$.map(j,function(a){return g+c+a}).join(","),i+=g,c=c.substring(1),i+c+"}"},c=function(b,c,d){if(0===b.length)return"[ ]";var e=d?" ":"\n";(!c||d)&&(c="");var f="["+e;c+="	";for(var g=0;g<b.length;g++)f+=c+a(b[g],c,d),g<b.length-1&&(f+=","+e);return 0===b.length&&(f+=c),c=c.substring(1),f+=e+c+"]"},d=function(a){var b=Object.keys(a);return 1===b.length&&"$oid"===b[0]&&"string"==typeof a.$oid&&/^[0-9a-f]{24}$/.test(a.$oid)},e=function(a,b){return void 0===Object.getPrototypeOf||null===Object.getPrototypeOf(a)?!1:a.hasOwnProperty(b)?!0:e(Object.getPrototypeOf(a),b)};return{tojson:a}}(),mongo.keyword=function(){function a(a,b){var c=b.split(/\s+/).filter(function(a){return 0!==a.length}),d=c[0],e=c.slice(1);return mongo.keyword[d]?(mongo.keyword[d](a,e),!0):!1}function b(a){var b=a.lastUsedCursor;b&&b.hasNext()?b._printBatch():a.insertResponseLine("no cursor")}function c(a,b){if(0===b.length)return void a.insertResponseLine("ERROR: show requires at least one argument");var c=b[0];switch(c){case"tables":case"collections":a.db.getCollectionNames(function(b){$(b.result).each(function(b,c){a.insertResponseLine(c)})});break;case"dbs":a.insertResponseLine("The web shell only allows one db");break;default:a.insertResponseLine("ERROR: Not yet implemented")}}function d(a){a.insertResponseLine("Cannot change db: the web shell only allows one db")}function e(a){a.insertResponseLine("help",[]),a.insertResponseLine("    Print out this help information."),a.insertResponseLine("show collections",[]),a.insertResponseLine("    Show collections in current database."),a.insertResponseLine("db.foo.find()",[]),a.insertResponseLine("    List objects in collection foo."),a.insertResponseLine("db.foo.find(query)",[]),a.insertResponseLine("    List objects in foo matching query."),a.insertResponseLine("db.foo.update(query, update, upsert, multi)",[]),a.insertResponseLine("    Updates an object matching query with the given update if no documents match and upsert is true, update is inserted if multiple documents matching query exist and multi is true all matching documents are updated."),a.insertResponseLine("db.foo.remove(query, justOne)",[]),a.insertResponseLine("    Removes all or just one documents matching query."),a.insertResponseLine("db.foo.drop()",[]),a.insertResponseLine("    Removes the foo collection from the database."),a.insertResponseLine("it",[]),a.insertResponseLine("    Get next batch of results from a query.")}return{handleKeywords:a,_resetHasBeenCalled:!1,it:b,show:c,use:d,help:e}}(),mongo.mutateSource=function(){function a(a){if("UpdateExpression"!==a.parent.type&&("AssignmentExpression"!==a.parent.type||a.parent.left!==a)){var b=a.object.source(),c=a.property.source();"Identifier"===a.property.type&&a.computed===!1&&(c='"'+c+'"');var d="__get("+b+", "+c+")";a.update(d)}}function b(b){var c=falafel(b,function(b){"MemberExpression"===b.type&&a(b)});return c.toString()}return{swapMemberAccesses:b}}(),mongo.request=function(){function a(a,b){$.post(mongo.config.baseUrl,null,function(c){c.res_id?(console.info("/mws/"+c.res_id,"was created succssfully."),b(c)):$.each(a,function(a,b){b.insertError("No res_id recieved! Shell disabled.")})},"json").fail(function(){$.each(a,function(a,b){b.insertError("Failed to create resources on DB on server")})})}function b(a,b,c,d,e,f,g){void 0===g&&(g=!0),e.enableInput(!1);var h=e.evaluator.pause();console.debug(d+" request:",a,b),data=JSON.stringify(b),"GET"==c&&(data={data:data}),$.ajax({async:!!g,type:c,url:a,data:data,dataType:"json",contentType:"application/json",success:function(a){console.info(d+" success"),e.enableInput(!0),e.focus(),e.evaluator.resume(h),f&&f(a)},error:function(a,b,c){try{var f=$.parseJSON(a.responseText),g=f.reason}catch(i){var g="The server experienced an unexpected error."}null==h&&e.insertError(g),console.error(d+" fail:",b,c),e.enableInput(!0),e.focus(),e.evaluator.resume(h,new Error(g),!0)}})}function c(a){var b=mongo.config.baseUrl+a+"/keep-alive";$.post(b,null,function(){console.info("Keep-alive succesful"),mongo.keepaliveNotification&&(mongo.keepaliveNotification.setText("and we're back!"),setTimeout(function(){mongo.keepaliveNotification.close()},1500))}).fail(function(a,b,c){console.error("ERROR: keep alive failed: "+c+" STATUS: "+b),mongo.keepaliveNotification||(mongo.keepaliveNotification=noty({layout:"topCenter",type:"warning",text:"Lost connection with server\nreconnecting...",callback:{afterClose:function(){delete mongo.keepaliveNotification}}}))})}return $.ajaxSetup({xhrFields:{withCredentials:!0}}),{createMWSResource:a,keepAlive:c,makeRequest:b}}();var console;mongo.util=function(){function a(){if(console&&console.log||(console={log:function(){}}),!(console.debug&&console.error&&console.info&&console.warn)){var a=console.log;console.debug=console.error=console.info=console.warn=a}}function b(a){return"number"==typeof a&&!isNaN(a)}function c(a){return"number"==typeof a&&a%1===0}function d(a,b){return e(a)+b+"/"}function e(a){return mongo.config.baseUrl+a+"/db/"}function f(a){if("string"==typeof a)return a;try{return mongo.jsonUtils.tojson(a)}catch(b){return"ERROR: "+b.message}}function g(a,b){if(b in a||!("__methodMissing"in a)){var c=a[b];return"function"==typeof c&&(c=c.bind(a)),c}return a.__methodMissing(b)}var h=function(){};return h.toString=function(){return""},{enableConsoleProtection:a,isNumeric:b,isInteger:c,getDBCollectionResURL:d,getDBResURL:e,toString:f,noOp:h,__get:g}}(),"undefined"==typeof String.prototype.trim&&(String.prototype.trim=function(){return String(this).replace(/^\s+|\s+$/g,"")});