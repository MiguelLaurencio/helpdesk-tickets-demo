var H=3600000,SLA={alta:4,media:24,baja:72},K="helpdesk_demo_v1";
var USERS=[{u:"ana",n:"Ana Pérez",r:"usuario"},{u:"luis",n:"Luis Gómez",r:"usuario"},{u:"carlos",n:"Carlos Díaz",r:"agente"},{u:"marta",n:"Marta Rosario",r:"agente"}];
var S={tk:[],me:null,v:"list",sel:null,q:"",st:"",pr:"",err:""};
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function load(){try{var d=localStorage.getItem(K);if(d)return JSON.parse(d)}catch(e){}return null}
function save(){try{localStorage.setItem(K,JSON.stringify(S.tk))}catch(e){}}
function seed(){var n=Date.now();return[
{id:1,t:"No puedo entrar al correo",d:"Me dice contraseña incorrecta desde ayer.",p:"alta",s:"abierto",by:"ana",as:"",c:n-2*H,cm:[]},
{id:2,t:"Impresora del piso 2 no imprime",d:"Aparece fuera de línea.",p:"media",s:"proceso",by:"luis",as:"carlos",c:n-10*H,cm:[{u:"carlos",x:"Revisando el cable y el driver.",at:n-9*H}]},
{id:3,t:"Solicitud de acceso a la carpeta compartida",d:"Necesito acceso a Contabilidad.",p:"baja",s:"abierto",by:"ana",as:"",c:n-30*H,cm:[]},
{id:4,t:"Laptop muy lenta",d:"Tarda 10 minutos en encender.",p:"media",s:"resuelto",by:"luis",as:"marta",c:n-50*H,cm:[{u:"marta",x:"Se liberó espacio y se actualizó el sistema.",at:n-40*H}]},
{id:5,t:"VPN no conecta",d:"Error 809 al intentar conectarme desde casa.",p:"alta",s:"proceso",by:"ana",as:"marta",c:n-6*H,cm:[]}]}
S.tk=load()||seed();
function nm(u){var x=USERS.filter(function(a){return a.u===u})[0];return x?x.n:"Sin asignar"}
function agents(){return USERS.filter(function(a){return a.r==="agente"})}
function due(t){return t.c+SLA[t.p]*H}
function late(t){return t.s!=="resuelto"&&Date.now()>due(t)}
function fmt(m){return m<60?m+" min":Math.round(m/60)+" h"}
function sla(t){if(t.s==="resuelto")return"Cerrado";var m=Math.round((due(t)-Date.now())/60000);return m<0?"SLA vencido hace "+fmt(-m):"SLA: vence en "+fmt(m)}
function SL(s){return{abierto:"Abierto",proceso:"En proceso",resuelto:"Resuelto"}[s]}
function mine(){return S.me.r==="agente"?S.tk:S.tk.filter(function(t){return t.by===S.me.u})}
function filt(){var q=S.q.toLowerCase();return mine().filter(function(t){return(!S.st||t.s===S.st)&&(!S.pr||t.p===S.pr)&&(!q||(t.t+" "+t.d+" #"+t.id).toLowerCase().indexOf(q)>-1)}).sort(function(a,b){return b.c-a.c})}
function card(t){return'<div class="c t" data-a="open" data-id="'+t.id+'"><div class="tr"><b>#'+t.id+" "+esc(t.t)+'</b><span><span class="tg '+t.p+'">'+t.p+'</span><span class="tg '+t.s+'">'+SL(t.s)+'</span></span></div><div class="mu">'+esc(nm(t.by))+" · Asignado a: "+esc(nm(t.as))+' · <span'+(late(t)?' class="alta"':"")+">"+sla(t)+"</span></div></div>"}
function list(){var a=filt();return a.length?a.map(card).join(""):'<div class="c mu">No hay tickets con esos filtros.</div>'}
function vLogin(){return'<div class="c lg"><h1 style="margin-top:0">HelpDesk</h1><p class="mu">Demo de sistema de tickets. Usuarios: <b>ana</b> (usuario), <b>carlos</b> (agente). Contraseña: <b>demo</b></p><label>Usuario</label><input id="lu" autocapitalize="none"><label>Contraseña</label><input id="lp" type="password"><p class="alta">'+esc(S.err)+'</p><button data-a="login" style="width:100%">Entrar</button></div>'}
function vHead(){var ag=S.me.r==="agente";return'<header><h1>HelpDesk <span class="mu">· '+esc(S.me.n)+" ("+S.me.r+')</span></h1><nav><button class="g'+(S.v==="list"?" on":"")+'" data-a="v" data-v="list">Tickets</button>'+(ag?'<button class="g'+(S.v==="dash"?" on":"")+'" data-a="v" data-v="dash">Panel</button>':"")+'<button data-a="v" data-v="new">+ Nuevo</button><button class="g" data-a="out">Salir</button></nav></header>'}
function vList(){return'<div class="fl c"><input id="q" placeholder="Buscar por título o número" value="'+esc(S.q)+'"><select id="st"><option value="">Todos los estados</option><option value="abierto">Abierto</option><option value="proceso">En proceso</option><option value="resuelto">Resuelto</option></select><select id="pr"><option value="">Todas las prioridades</option><option>alta</option><option>media</option><option>baja</option></select></div><div id="lst">'+list()+"</div>"}
function vNew(){return'<div class="c"><h2 style="margin-top:0">Nuevo ticket</h2><label>Título</label><input id="nt"><label>Descripción</label><textarea id="nd" rows="4"></textarea><label>Prioridad</label><select id="np"><option value="media">Media (SLA 24 h)</option><option value="alta">Alta (SLA 4 h)</option><option value="baja">Baja (SLA 72 h)</option></select><p class="alta">'+esc(S.err)+'</p><button data-a="create">Crear ticket</button> <button class="g" data-a="v" data-v="list">Cancelar</button></div>'}
function vDet(){var t=S.tk.filter(function(x){return x.id===S.sel})[0];if(!t)return vList();var ag=S.me.r==="agente";
var ctl=ag?'<label>Estado</label><select data-a="setst"><option value="abierto"'+(t.s==="abierto"?" selected":"")+'>Abierto</option><option value="proceso"'+(t.s==="proceso"?" selected":"")+'>En proceso</option><option value="resuelto"'+(t.s==="resuelto"?" selected":"")+'>Resuelto</option></select><label>Asignado a</label><select data-a="setas"><option value="">Sin asignar</option>'+agents().map(function(a){return'<option value="'+a.u+'"'+(t.as===a.u?" selected":"")+">"+esc(a.n)+"</option>"}).join("")+"</select>":"";
return'<button class="g" data-a="v" data-v="list">← Volver</button><div class="c" style="margin-top:10px"><h2 style="margin-top:0">#'+t.id+" "+esc(t.t)+'</h2><span class="tg '+t.p+'">'+t.p+'</span><span class="tg '+t.s+'">'+SL(t.s)+'</span><p>'+esc(t.d)+'</p><p class="mu">Creado por '+esc(nm(t.by))+" · "+new Date(t.c).toLocaleString("es-DO")+" · "+sla(t)+"</p>"+ctl+"</div><div class=\"c\"><b>Comentarios</b>"+(t.cm.length?t.cm.map(function(c){return'<div class="cm"><b>'+esc(nm(c.u))+'</b> <span class="mu">'+new Date(c.at).toLocaleString("es-DO")+"</span><br>"+esc(c.x)+"</div>"}).join(""):'<p class="mu">Sin comentarios.</p>')+'<label>Agregar comentario</label><textarea id="cx" rows="2"></textarea><p><button data-a="cm">Enviar</button></p></div>'}
function vDash(){var a=S.tk,n=function(f){return a.filter(f).length};var tot=a.length,ab=n(function(t){return t.s==="abierto"}),pr=n(function(t){return t.s==="proceso"}),rs=n(function(t){return t.s==="resuelto"}),lt=n(late);
function bars(items){return items.map(function(i){return'<div>'+i[0]+" <b>"+i[1]+'</b><div class="bar"><i style="width:'+(tot?Math.round(i[1]/tot*100):0)+'%"></i></div></div>'}).join("")}
return'<div class="k"><div class="c"><b>'+tot+'</b>Total</div><div class="c"><b class="abierto">'+ab+'</b>Abiertos</div><div class="c"><b class="proceso">'+pr+'</b>En proceso</div><div class="c"><b class="resuelto">'+rs+'</b>Resueltos</div><div class="c"><b class="alta">'+lt+'</b>SLA vencido</div></div><div class="c"><b>Por prioridad</b><br><br>'+bars(["alta","media","baja"].map(function(p){return[p,n(function(t){return t.p===p})]}))+'</div><div class="c"><b>Carga por agente</b><br><br>'+bars(agents().map(function(g){return[g.n,n(function(t){return t.as===g.u&&t.s!=="resuelto"})]}))+"</div>"}
function render(){var h=document.getElementById("app");if(!S.me){h.innerHTML=vLogin();return}
h.innerHTML=vHead()+(S.v==="new"?vNew():S.v==="det"?vDet():S.v==="dash"&&S.me.r==="agente"?vDash():vList());
var s=document.getElementById("st"),p=document.getElementById("pr");if(s)s.value=S.st;if(p)p.value=S.pr}
document.addEventListener("click",function(e){var el=e.target.closest("[data-a]");if(!el)return;var a=el.dataset.a;
if(a==="login"){var u=document.getElementById("lu").value.trim().toLowerCase(),p=document.getElementById("lp").value,x=USERS.filter(function(z){return z.u===u})[0];if(x&&p==="demo"){S.me=x;S.err="";S.v="list"}else S.err="Usuario o contraseña incorrectos.";render()}
else if(a==="out"){S.me=null;render()}
else if(a==="v"){S.v=el.dataset.v;S.err="";render()}
else if(a==="open"){S.sel=+el.dataset.id;S.v="det";render()}
else if(a==="create"){var t=document.getElementById("nt").value.trim(),d=document.getElementById("nd").value.trim();if(!t||!d){S.err="Completa el título y la descripción.";render();return}
S.tk.push({id:Math.max.apply(null,S.tk.map(function(z){return z.id}).concat([0]))+1,t:t,d:d,p:document.getElementById("np").value,s:"abierto",by:S.me.u,as:"",c:Date.now(),cm:[]});save();S.err="";S.v="list";render()}
else if(a==="cm"){var tx=document.getElementById("cx").value.trim();if(!tx)return;S.tk.filter(function(z){return z.id===S.sel})[0].cm.push({u:S.me.u,x:tx,at:Date.now()});save();render()}});
document.addEventListener("change",function(e){var a=e.target.dataset.a,t=S.tk.filter(function(z){return z.id===S.sel})[0];
if(a==="setst"&&t){t.s=e.target.value;save();render()}else if(a==="setas"&&t){t.as=e.target.value;if(t.as&&t.s==="abierto")t.s="proceso";save();render()}
else if(e.target.id==="st"||e.target.id==="pr"){S[e.target.id]=e.target.value;document.getElementById("lst").innerHTML=list()}});
document.addEventListener("input",function(e){if(e.target.id==="q"){S.q=e.target.value;document.getElementById("lst").innerHTML=list()}});
render();
