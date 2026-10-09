
(function(){
"use strict";

var SUPA_URL="https://lfsbbzunrattlkfssbjm.supabase.co";
var SUPA_KEY="sb_publishable_5QPnWPkwsW-OShMuXjQWTw_e7q7yhdI";
var VAPID_PUBLIC="BHYwHJoB7xmUDOJ45boyHvTiwHcRFOWW5DQNh5M2TcWMEFIy894YjuWA88F4kPjqmb47enNDSGvdLi9cfQzuezs";
if(!window.supabase){console.error("Supabase JS não carregou.");return;}

var sb=window.supabase.createClient(SUPA_URL,SUPA_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
var currentUser=null,currentProfile=null,isAdmin=false,authMode="login",handling=false;
var baseSalvarPerfil=window.salvarPerfil;
var baseSalvarVenda=window.salvarVenda;

function esc(v){
  return String(v==null?"":v).replace(/[&<>"']/g,function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c];
  });
}
function addStyle(){
  var s=document.createElement("style");
  s.textContent=
  ".cfhp-auth{position:fixed;inset:0;z-index:2000;background:linear-gradient(160deg,#dce9f3,#f7f9fb);display:flex;align-items:center;justify-content:center;padding:18px}"+
  ".cfhp-auth.hidden{display:none}.cfhp-auth-card{width:min(440px,100%);background:#fff;border:1px solid #d5e0e9;border-radius:26px;padding:20px;box-shadow:0 22px 60px rgba(32,66,94,.18)}"+
  ".cfhp-auth-logo{width:76px;height:76px;border-radius:22px;margin:0 auto 11px;display:block;border:2px solid #f2ca64;object-fit:cover;background:#17324b}"+
  ".cfhp-auth h2{margin:0;text-align:center;color:#17324b;font-size:25px}.cfhp-auth .lead{text-align:center;color:#71869a;font-size:13px;margin:5px 0 17px}"+
  ".cfhp-auth-tabs{display:grid;grid-template-columns:1fr 1fr;background:#edf3f8;border-radius:13px;padding:4px;margin-bottom:14px}.cfhp-auth-tab{height:42px;border:0;border-radius:10px;background:transparent;color:#60788c;font-weight:900}.cfhp-auth-tab.active{background:#fff;color:#17324b;box-shadow:0 4px 12px rgba(23,50,75,.09)}"+
  ".cfhp-auth-field{margin-bottom:10px}.cfhp-auth-field label{display:block;font-size:11px;font-weight:900;color:#5d7488;margin:0 0 5px;text-transform:uppercase}.cfhp-auth-field input{width:100%;height:48px;border:1px solid #cad9e4;border-radius:12px;background:#f8fbfd;padding:0 12px;outline:0;color:#193047}.cfhp-auth-msg{min-height:18px;font-size:12px;text-align:center;color:#60788c;margin:9px 0}.cfhp-auth-note{font-size:11px;color:#8093a2;text-align:center;line-height:1.45;margin-top:10px}"+
  ".cfhp-online-pill{position:absolute;right:15px;bottom:11px;background:rgba(255,255,255,.12);color:#dceaf3;border:1px solid rgba(255,255,255,.12);padding:5px 9px;border-radius:999px;font-size:10px;font-weight:900;z-index:2}.cfhp-online-pill.ok{color:#c9f3df;background:rgba(39,139,97,.22)}"+
  ".cfhp-account{background:linear-gradient(145deg,#eef6fb,#fff);border:1px solid #d2e1ea;border-radius:16px;padding:12px;margin-bottom:12px}.cfhp-account-top{display:flex;justify-content:space-between;gap:10px;align-items:center}.cfhp-account small{display:block;color:#71869a}.cfhp-account strong{display:block;color:#17324b;margin-top:2px}"+
  ".cfhp-admin-team{display:grid;gap:10px}.cfhp-seller{border:1px solid #d7e2ea;border-radius:16px;padding:13px;background:#f9fbfc}.cfhp-seller-head{display:flex;justify-content:space-between;gap:8px;align-items:flex-start}.cfhp-seller-head strong{font-size:17px;color:#17324b}.cfhp-seller-metrics{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:9px}.cfhp-seller-metrics div{background:#fff;border-radius:10px;padding:8px}.cfhp-seller-metrics small{display:block;color:#8294a2;font-size:9px;font-weight:900}.cfhp-seller-metrics b{display:block;color:#214866;margin-top:3px;font-size:13px}.cfhp-seller details{margin-top:9px}.cfhp-seller summary{cursor:pointer;color:#49697f;font-weight:900;font-size:12px}.cfhp-admin-edit{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:9px}.cfhp-admin-edit label{font-size:9px;font-weight:900;color:#71869a}.cfhp-admin-edit input{width:100%;height:39px;border:1px solid #cedce6;border-radius:9px;padding:0 8px;background:#fff}"+
  ".cfhp-sync-warn{background:#fff5df;color:#8f6810;border:1px solid #eed291;padding:9px;border-radius:11px;font-size:11px;margin-top:8px}@media(max-width:380px){.cfhp-admin-edit{grid-template-columns:1fr}}";
  document.head.appendChild(s);
}
function injectUI(){
  var app=document.querySelector(".app");if(app){app.id="appRoot";app.style.display="none";}
  var a=document.createElement("div");a.id="cfhpAuth";a.className="cfhp-auth";
  a.innerHTML='<div class="cfhp-auth-card">'+
    '<img class="cfhp-auth-logo" src="logo.png" alt="Calcula Fácil HP">'+
    '<h2>Calcula Fácil HP</h2><div class="lead">Entre para salvar vendas, metas e comissão online.</div>'+
    '<div class="cfhp-auth-tabs"><button id="cfhpTabLogin" class="cfhp-auth-tab active" onclick="CFHP.showAuthMode(\'login\')">Entrar</button><button id="cfhpTabSignup" class="cfhp-auth-tab" onclick="CFHP.showAuthMode(\'signup\')">Criar conta</button></div>'+
    '<div id="cfhpSignupName" class="cfhp-auth-field" style="display:none"><label>Nome</label><input id="cfhpAuthName" type="text" placeholder="Nome da vendedora"></div>'+
    '<div class="cfhp-auth-field"><label>E-mail</label><input id="cfhpAuthEmail" type="email" autocomplete="email" placeholder="seuemail@exemplo.com"></div>'+
    '<div class="cfhp-auth-field"><label>Senha</label><input id="cfhpAuthPassword" type="password" autocomplete="current-password" placeholder="Sua senha"></div>'+
    '<button id="cfhpAuthButton" class="btn primary full" onclick="CFHP.submitAuth()">Entrar</button><div id="cfhpAuthMsg" class="cfhp-auth-msg"></div>'+
    '<div class="cfhp-auth-note">Cada vendedora usa sua própria conta. O administrador acompanha os resultados pelo mesmo aplicativo.</div></div>';
  document.body.appendChild(a);

  var hero=document.querySelector(".hero");
  if(hero){var p=document.createElement("div");p.id="cfhpOnlinePill";p.className="cfhp-online-pill";p.textContent="Conectando...";hero.appendChild(p);}

  var profile=document.getElementById("screen-profile");
  if(profile){
    var title=profile.querySelector(".pageTitle");
    var box=document.createElement("div");box.id="cfhpAccount";box.className="cfhp-account";
    box.innerHTML='<div class="cfhp-account-top"><div><small>CONTA CONECTADA</small><strong id="cfhpAccountEmail">—</strong></div><button class="btn secondary" style="height:39px" onclick="CFHP.logout()">Sair</button></div><div id="cfhpSyncInfo" style="font-size:11px;color:#6f8394;margin-top:7px">Sincronização online ativa.</div>';
    title.insertAdjacentElement("afterend",box);
    var buttons=[].slice.call(profile.querySelectorAll("button"));
    var adm=buttons.find(function(b){return b.textContent.indexOf("Área ADM")>=0;});
    if(adm){adm.id="cfhpAdminBtn";if(adm.parentElement)adm.parentElement.id="cfhpAdminCard";}
    var claim=document.createElement("div");claim.id="cfhpClaimAdmin";claim.className="card";
    claim.innerHTML='<div class="sectionTitle">Ativar administração</div><div class="notice">Use o código mestre apenas na sua conta de administrador.</div><div class="dateBar" style="margin-top:9px"><input id="cfhpAdminCode" type="password" placeholder="Código mestre"><button class="btn dark" onclick="CFHP.claimAdmin()">Ativar</button></div>';
    var adminCard=document.getElementById("cfhpAdminCard");
    if(adminCard)adminCard.insertAdjacentElement("beforebegin",claim);else profile.appendChild(claim);
  }

  var adminScreen=document.getElementById("screen-admin");
  if(adminScreen){
    var at=adminScreen.querySelector(".pageTitle");
    var team=document.createElement("div");team.id="cfhpTeamCard";team.className="card";
    team.innerHTML='<div class="sectionTitle">Equipe</div><div id="cfhpTeamList" class="cfhp-admin-team"><div class="empty">Carregando vendedoras...</div></div>';
    at.insertAdjacentElement("afterend",team);
  }
}
function setPill(t,ok){var e=document.getElementById("cfhpOnlinePill");if(e){e.textContent=t;e.classList.toggle("ok",!!ok);}}
function authMsg(t,err){var e=document.getElementById("cfhpAuthMsg");if(e){e.textContent=t||"";e.style.color=err?"#b3444b":"#60788c";}}
async function joinApp(name){
  try{await sb.auth.updateUser({data:{app:"cfhp",name:name||undefined}});}catch(e){}
  var r=await sb.rpc("cfhp_join",{p_name:name||null});if(r.error)throw r.error;return r.data;
}
async function loadProfile(){
  var r=await sb.from("cfhp_profiles").select("*").eq("id",currentUser.id).eq("app_code","cfhp").maybeSingle();
  if(r.error)throw r.error;
  if(!r.data){await joinApp(currentUser.user_metadata&&currentUser.user_metadata.name||currentUser.email.split("@")[0]);r=await sb.from("cfhp_profiles").select("*").eq("id",currentUser.id).eq("app_code","cfhp").single();if(r.error)throw r.error;}
  currentProfile=r.data;isAdmin=currentProfile.role==="admin";
  var local=window.getProfile();
  window.saveProfileData({nome:currentProfile.name||local.nome||"Vendedor",foto:local.foto||"",meta:Number(currentProfile.monthly_goal||40000),taxaVista:Number(currentProfile.commission_cash||1.3),taxaEntrada:Number(currentProfile.commission_entry||5),taxaPrazo:Number(currentProfile.commission_credit||1.3),taxaCheque:Number(currentProfile.commission_check||1.3)});
  window.renderHeader();window.carregarPerfilForm();updateRole();
}
function updateRole(){
  var em=document.getElementById("cfhpAccountEmail");if(em)em.textContent=currentUser&&currentUser.email||"Conta conectada";
  var c=document.getElementById("cfhpClaimAdmin"),a=document.getElementById("cfhpAdminCard");
  if(c)c.style.display=isAdmin?"none":"block";if(a)a.style.display=isAdmin?"block":"none";
}
function uuid(){return crypto.randomUUID?crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(c){var r=Math.random()*16|0,v=c==="x"?r:(r&3|8);return v.toString(16);});}
function validUuid(v){return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(v||""));}
function cloudRow(v){
  return {id:validUuid(v.cloud_id)?v.cloud_id:uuid(),user_id:currentUser.id,sale_date:v.date||window.hojeISO(),sold_at:v.timestamp||new Date().toISOString(),items:Array.isArray(v.items)?v.items:[],gross_total:Number(v.total||0),discount_amount:Number(v.discount||0),discount_percent:Number(v.percent||0),final_total:Number(v.final||0),payment_method:v.payment||"avista",entry_amount:Number(v.entry||0),remaining_amount:Number(v.remaining||0),installments:Number(v.installments||0),commission_amount:Number(v.commission||0)};
}
function localRow(r){
  return {id:"cloud-"+r.id,cloud_id:r.id,synced_user_id:r.user_id,date:r.sale_date,timestamp:r.sold_at,hora:new Date(r.sold_at).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}),items:Array.isArray(r.items)?r.items:[],total:Number(r.gross_total||0),discount:Number(r.discount_amount||0),percent:Number(r.discount_percent||0),final:Number(r.final_total||0),payment:r.payment_method||"avista",entry:Number(r.entry_amount||0),remaining:Number(r.remaining_amount||0),installments:Number(r.installments||0),commission:Number(r.commission_amount||0)};
}
function syncInfo(ok){
  var e=document.getElementById("cfhpSyncInfo");if(e){e.textContent=ok?"✓ Vendas sincronizadas com o painel ADM.":"Sem internet: as vendas ficam neste aparelho e sincronizam depois.";e.className=ok?"":"cfhp-sync-warn";}setPill(ok?"Online":"Modo local",ok);
}
async function syncUp(){
  if(!currentUser||!navigator.onLine)return false;
  var sales=window.getSales(),changed=false,ok=true;
  for(var i=0;i<sales.length;i++){
    var v=sales[i];if(v.synced_user_id===currentUser.id&&validUuid(v.cloud_id))continue;
    try{var row=cloudRow(v),res=await sb.from("cfhp_sales").insert(row);if(res.error&&res.error.code!=="23505")throw res.error;v.cloud_id=row.id;v.synced_user_id=currentUser.id;changed=true;}catch(e){ok=false;console.warn(e);}
  }
  if(changed)window.saveSales(sales);syncInfo(ok);return ok;
}
async function syncDown(){
  if(!currentUser||!navigator.onLine)return false;
  try{
    var r=await sb.from("cfhp_sales").select("*").eq("user_id",currentUser.id).order("sold_at",{ascending:true});if(r.error)throw r.error;
    var local=window.getSales(),unsynced=local.filter(function(v){return !(v.synced_user_id===currentUser.id&&validUuid(v.cloud_id));});
    window.saveSales((r.data||[]).map(localRow).concat(unsynced));window.atualizarPainelVendas();syncInfo(true);return true;
  }catch(e){console.warn(e);syncInfo(false);return false;}
}
async function handleSession(session){
  if(handling)return;handling=true;
  try{
    var auth=document.getElementById("cfhpAuth"),app=document.getElementById("appRoot");
    if(!session){currentUser=null;currentProfile=null;isAdmin=false;if(auth)auth.classList.remove("hidden");if(app)app.style.display="none";setPill("Desconectado",false);handling=false;return;}
    currentUser=session.user;if(auth)auth.classList.add("hidden");if(app)app.style.display="block";setPill(navigator.onLine?"Online":"Modo local",navigator.onLine);
    await loadProfile();await syncUp();await syncDown();updateRole();
  }catch(e){console.error(e);authMsg("Não foi possível carregar sua conta: "+(e.message||e),true);}finally{handling=false;}
}
async function saveCloudProfile(){
  if(!currentUser)return;
  var p=window.getProfile();
  var r=await sb.from("cfhp_profiles").update({name:p.nome,monthly_goal:Number(p.meta||0),commission_cash:Number(p.taxaVista||0),commission_entry:Number(p.taxaEntrada||0),commission_credit:Number(p.taxaPrazo||0),commission_check:Number(p.taxaCheque||0)}).eq("id",currentUser.id).select().single();
  if(r.error)throw r.error;currentProfile=r.data;
}
window.salvarPerfil=async function(){baseSalvarPerfil();try{await saveCloudProfile();toast("Perfil salvo no aparelho e na nuvem.");}catch(e){console.warn(e);toast("Perfil salvo neste aparelho. Vai sincronizar quando possível.");}};
window.salvarVenda=function(v){baseSalvarVenda(v);setTimeout(syncUp,0);};
window.excluirVenda=async function(id){
  var sales=window.getSales(),v=sales.find(function(x){return x.id===id;});if(!v)return;if(!confirm("Apagar esta venda?"))return;
  window.saveSales(sales.filter(function(x){return x.id!==id;}));window.atualizarPainelVendas();
  if(v.cloud_id&&currentUser&&navigator.onLine)await sb.from("cfhp_sales").delete().eq("id",v.cloud_id);
};
window.limparVendasDaData=async function(){
  var data=document.getElementById("filtroData").value||window.hojeISO(),sales=window.getSales();if(!sales.some(function(v){return v.date===data;}))return;if(!confirm("Apagar todas as vendas desta data?"))return;
  window.saveSales(sales.filter(function(v){return v.date!==data;}));window.atualizarPainelVendas();if(currentUser&&navigator.onLine)await sb.from("cfhp_sales").delete().eq("user_id",currentUser.id).eq("sale_date",data);
};
function daysLeft(){var d=new Date(),last=new Date(d.getFullYear(),d.getMonth()+1,0).getDate(),c=0;for(var day=d.getDate();day<=last;day++){if(new Date(d.getFullYear(),d.getMonth(),day).getDay()!==0)c++;}return Math.max(1,c);}
function range(){var d=new Date(),y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,"0");return {start:y+"-"+m+"-01",end:y+"-"+m+"-31"};}
function sum(p,sales){
  var total=sales.reduce(function(a,v){return a+Number(v.final_total||0);},0),comm=sales.reduce(function(a,v){return a+Number(v.commission_amount||0);},0),goal=Number(p.monthly_goal||0),missing=Math.max(0,goal-total);
  return {total:total,comm:comm,goal:goal,missing:missing,daily:missing/daysLeft(),pct:goal>0?total/goal*100:0,count:sales.length};
}
window.abrirAdmin=async function(){
  if(!isAdmin){toast("Esta conta não tem acesso de administrador.");return;}window.navigate("admin");
  var team=document.getElementById("cfhpTeamList");team.innerHTML='<div class="empty">Carregando equipe...</div>';
  try{
    var rg=range(),pr=await sb.from("cfhp_profiles").select("*").eq("app_code","cfhp").order("name"),sr=await sb.from("cfhp_sales").select("*").gte("sale_date",rg.start).lte("sale_date",rg.end).order("sold_at",{ascending:false});
    if(pr.error)throw pr.error;if(sr.error)throw sr.error;var profiles=pr.data||[],sales=sr.data||[],tg=0,tt=0,tc=0,td=0;
    profiles.forEach(function(p){var x=sum(p,sales.filter(function(v){return v.user_id===p.id;}));tg+=x.goal;tt+=x.total;tc+=x.comm;td+=x.daily;});
    document.getElementById("admVendedor").textContent=profiles.length+" conta(s)";document.getElementById("admVendaMes").textContent=dinheiro(tt);document.getElementById("admFalta").textContent=dinheiro(Math.max(0,tg-tt));document.getElementById("admComissao").textContent=dinheiro(tc);document.getElementById("admMeta").textContent=dinheiro(tg);document.getElementById("admPct").textContent=(tg>0?tt/tg*100:0).toFixed(1).replace(".",",")+"%";document.getElementById("admDiaria").textContent=dinheiro(td);document.getElementById("admQtd").textContent=sales.length;document.getElementById("admProgress").style.width=Math.min(100,tg>0?tt/tg*100:0)+"%";
    renderTeam(profiles,sales);renderSales(sales,profiles,"Últimas vendas da equipe");
  }catch(e){console.error(e);team.innerHTML='<div class="empty">Não foi possível carregar o painel online.</div>';}
};
function renderTeam(profiles,sales){
  var list=document.getElementById("cfhpTeamList");list.innerHTML="";
  if(!profiles.length){list.innerHTML='<div class="empty">Nenhuma vendedora cadastrada.</div>';return;}
  profiles.forEach(function(p){
    var x=sum(p,sales.filter(function(v){return v.user_id===p.id;})),card=document.createElement("div");card.className="cfhp-seller";
    card.innerHTML='<div class="cfhp-seller-head"><div><strong>'+esc(p.name)+'</strong><div style="font-size:10px;color:#8092a1;margin-top:2px">'+(p.role==="admin"?"Administrador":"Vendedora")+'</div></div><span class="badge '+(x.pct>=100?"":"warn")+'">'+x.pct.toFixed(1).replace(".",",")+'%</span></div>'+
      '<div class="progress"><div style="width:'+Math.min(100,x.pct)+'%"></div></div>'+
      '<div class="cfhp-seller-metrics"><div><small>VENDEU NO MÊS</small><b>'+dinheiro(x.total)+'</b></div><div><small>FALTA</small><b>'+dinheiro(x.missing)+'</b></div><div><small>PRECISA / DIA</small><b>'+dinheiro(x.daily)+'</b></div><div><small>COMISSÃO</small><b>'+dinheiro(x.comm)+'</b></div></div>'+
      '<button class="btn secondary full" style="margin-top:9px;height:42px" data-view="'+esc(p.id)+'">Ver vendas</button>'+
      '<details><summary>Editar meta e comissão</summary><div class="cfhp-admin-edit"><div><label>META MENSAL</label><input id="goal-'+p.id+'" type="number" value="'+Number(p.monthly_goal||0)+'"></div><div><label>À VISTA %</label><input id="cash-'+p.id+'" type="number" step="0.01" value="'+Number(p.commission_cash||0)+'"></div><div><label>ENTRADA %</label><input id="entry-'+p.id+'" type="number" step="0.01" value="'+Number(p.commission_entry||0)+'"></div><div><label>CARTÃO/CARNÊ %</label><input id="credit-'+p.id+'" type="number" step="0.01" value="'+Number(p.commission_credit||0)+'"></div></div><button class="btn primary full" style="margin-top:8px;height:42px" data-save="'+esc(p.id)+'">Salvar regras</button></details>';
    card.querySelector("[data-view]").onclick=function(){viewSeller(p.id,p.name);};card.querySelector("[data-save]").onclick=function(){saveSeller(p.id);};list.appendChild(card);
  });
}
function renderSales(sales,profiles,title){
  var map={};profiles.forEach(function(p){map[p.id]=p.name;});var t=document.querySelector("#screen-admin .card:last-child .sectionTitle");if(t)t.textContent=title;var l=document.getElementById("admLista");l.innerHTML="";if(!sales.length){l.innerHTML='<div class="empty">Nenhuma venda.</div>';return;}
  sales.slice(0,100).forEach(function(v){var row=document.createElement("div");row.className="saleRow";row.innerHTML='<div class="saleTop"><span>'+esc(map[v.user_id]||"Vendedora")+' · '+String(v.sale_date).split("-").reverse().join("/")+'</span><strong>'+dinheiro(v.final_total)+'</strong></div><div class="saleMeta">'+esc(v.payment_method)+' · Comissão '+dinheiro(v.commission_amount||0)+'</div>';l.appendChild(row);});
}
async function viewSeller(uid,name){var r=await sb.from("cfhp_sales").select("*").eq("user_id",uid).order("sold_at",{ascending:false}).limit(100);if(r.error){toast("Não foi possível carregar as vendas.");return;}renderSales(r.data||[],[{id:uid,name:name}],"Vendas de "+name);document.getElementById("admLista").scrollIntoView({behavior:"smooth",block:"start"});}
async function saveSeller(uid){
  function n(id){return Number(document.getElementById(id+"-"+uid).value||0);}
  var r=await sb.from("cfhp_profiles").update({monthly_goal:n("goal"),commission_cash:n("cash"),commission_entry:n("entry"),commission_credit:n("credit")}).eq("id",uid);
  if(r.error){console.error(r.error);toast("Erro ao salvar regras.");return;}toast("Meta e comissão atualizadas.");window.abrirAdmin();
}
async function claimAdmin(){
  var code=(document.getElementById("cfhpAdminCode").value||"").trim();if(!code){toast("Digite o código mestre.");return;}
  try{await sb.auth.updateUser({data:{app:"cfhp"}});var r=await sb.rpc("cfhp_claim_admin",{p_code:code});if(r.error)throw r.error;if(!r.data){toast("Código mestre inválido.");return;}await loadProfile();toast("🛡 Administração ativada nesta conta.");}catch(e){console.error(e);toast("Não foi possível ativar o ADM.");}
}
function b64(s){var pad="=".repeat((4-s.length%4)%4),raw=atob((s+pad).replace(/-/g,"+").replace(/_/g,"/"));return Uint8Array.from([].map.call(raw,function(c){return c.charCodeAt(0);}));}
window.ativarNotificacoes=async function(){
  if(!currentUser){toast("Entre na sua conta primeiro.");return;}if(!("Notification" in window)||!("serviceWorker" in navigator)){toast("Este aparelho não oferece notificações web.");return;}
  try{var p=await Notification.requestPermission();if(p!=="granted"){toast("Permissão de notificações não concedida.");return;}var reg=await navigator.serviceWorker.ready,sub=await reg.pushManager.getSubscription();if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64(VAPID_PUBLIC)});var j=sub.toJSON(),r=await sb.from("cfhp_push_subscriptions").upsert({user_id:currentUser.id,endpoint:j.endpoint,p256dh:j.keys.p256dh,auth:j.keys.auth},{onConflict:"endpoint"});if(r.error)throw r.error;await reg.showNotification("🔔 Calcula Fácil HP",{body:"Notificações de meta ativadas neste aparelho.",icon:"icon-192.png",badge:"icon-192.png",tag:"cfhp-activated"});toast("Notificações ativadas.");}catch(e){console.error(e);toast("Não foi possível ativar as notificações neste aparelho.");}
};
async function logout(){await syncUp();await sb.auth.signOut();window.saveSales([]);location.reload();}
function showAuthMode(m){authMode=m;document.getElementById("cfhpTabLogin").classList.toggle("active",m==="login");document.getElementById("cfhpTabSignup").classList.toggle("active",m==="signup");document.getElementById("cfhpSignupName").style.display=m==="signup"?"block":"none";document.getElementById("cfhpAuthButton").textContent=m==="signup"?"Criar conta":"Entrar";authMsg("");}
async function submitAuth(){
  var email=(document.getElementById("cfhpAuthEmail").value||"").trim(),pass=document.getElementById("cfhpAuthPassword").value||"",name=(document.getElementById("cfhpAuthName").value||"").trim();if(!email||!pass){authMsg("Preencha e-mail e senha.",true);return;}if(authMode==="signup"&&!name){authMsg("Digite o nome da vendedora.",true);return;}authMsg("Aguarde...");
  try{
    if(authMode==="signup"){var r=await sb.auth.signUp({email:email,password:pass,options:{data:{name:name,app:"cfhp"}}});if(r.error)throw r.error;if(!r.data.session){authMsg("Conta criada. Confira seu e-mail para confirmar o cadastro.");}else{await handleSession(r.data.session);}}
    else{var l=await sb.auth.signInWithPassword({email:email,password:pass});if(l.error)throw l.error;await joinApp(l.data.user&&l.data.user.user_metadata&&l.data.user.user_metadata.name||l.data.user.email.split("@")[0]);await handleSession(l.data.session);}
  }catch(e){console.error(e);var m=e.message||"Não foi possível entrar.";if(/invalid login/i.test(m))m="E-mail ou senha incorretos.";authMsg(m,true);}
}
window.CFHP={showAuthMode:showAuthMode,submitAuth:submitAuth,logout:logout,claimAdmin:claimAdmin,viewSeller:viewSeller,saveSeller:saveSeller,syncNow:async function(){await syncUp();await syncDown();},client:sb};

async function boot(){
  addStyle();injectUI();var r=await sb.auth.getSession();await handleSession(r.data.session);
  sb.auth.onAuthStateChange(function(_e,session){setTimeout(function(){handleSession(session);},0);});
  window.addEventListener("online",async function(){setPill("Sincronizando...",false);await syncUp();await syncDown();});
  window.addEventListener("offline",function(){syncInfo(false);});
  setInterval(function(){if(currentUser&&navigator.onLine)syncUp();},45000);
}
boot();
})();