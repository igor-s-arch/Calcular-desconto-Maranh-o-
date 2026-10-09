
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
  ".cfhp-sync-warn{background:#fff5df;color:#8f6810;border:1px solid #eed291;padding:9px;border-radius:11px;font-size:11px;margin-top:8px}"+
  ".cfhp-filter-tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.cfhp-filter-btn{height:42px;border:1px solid #cfdae3;background:#f5f8fb;border-radius:11px;color:#49677e;font-size:11px;font-weight:900}.cfhp-filter-btn.active{background:#17324b;color:#fff;border-color:#17324b}.cfhp-period-fields{display:grid;grid-template-columns:1fr 1fr auto;gap:7px;margin-top:9px;align-items:end}.cfhp-period-fields label{display:block;font-size:9px;font-weight:900;color:#71869a;margin-bottom:4px}.cfhp-period-fields input{width:100%;height:42px;border:1px solid #cedce6;border-radius:10px;padding:0 8px;background:#fff;color:#193047}.cfhp-period-fields .btn{height:42px}.cfhp-sale-detail{margin-top:8px;border-top:1px solid #dde6ed;padding-top:8px}.cfhp-sale-detail-row{display:flex;justify-content:space-between;gap:10px;padding:7px 0;border-bottom:1px dashed #dce5ec;font-size:11px;color:#667e90}.cfhp-sale-detail-row:last-child{border-bottom:0}.cfhp-sale-detail-row strong{color:#17324b}.cfhp-seller-zero{font-size:11px;color:#8a9aa6;margin-top:8px}"+
  "@media(max-width:480px){.cfhp-filter-tabs{grid-template-columns:1fr 1fr}.cfhp-period-fields{grid-template-columns:1fr 1fr}.cfhp-period-fields .btn{grid-column:1/-1;width:100%}}@media(max-width:380px){.cfhp-admin-edit{grid-template-columns:1fr}}";
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

  var salesScreen=document.getElementById("screen-sales");
  if(salesScreen && !document.getElementById("cfhpStoreGoalSeller")){
    var salesTitle=salesScreen.querySelector(".pageTitle");
    var storeCard=document.createElement("div");
    storeCard.id="cfhpStoreGoalSeller";
    storeCard.className="metaCard";
    storeCard.innerHTML=
      '<div class="metaTop"><div><div class="sectionTitle" style="margin-bottom:3px">Meta da loja</div><strong id="cfhpStoreGoalValue">R$ 0,00</strong></div><span class="badge" id="cfhpStoreGoalPct">0%</span></div>'+
      '<div class="progress"><div id="cfhpStoreGoalProgress"></div></div>'+
      '<div class="metaGrid">'+
        '<div class="metaMini"><small>VENDIDO PELA LOJA</small><strong id="cfhpStoreSold">R$ 0,00</strong></div>'+
        '<div class="metaMini"><small>FALTA PARA A LOJA</small><strong id="cfhpStoreRemaining">R$ 0,00</strong></div>'+
        '<div class="metaMini"><small>VENDAS DA EQUIPE</small><strong id="cfhpStoreSalesCount">0</strong></div>'+
        '<div class="metaMini"><small>SEU OBJETIVO</small><strong>Meta individual abaixo</strong></div>'+
      '</div>';
    salesTitle.insertAdjacentElement("afterend",storeCard);
  }

  var adminScreen=document.getElementById("screen-admin");
  if(adminScreen){
    var at=adminScreen.querySelector(".pageTitle");

    var filter=document.createElement("div");
    filter.id="cfhpAdminFilter";
    filter.className="card";
    filter.innerHTML=
      '<div class="sectionTitle">Consultar vendas</div>'+
      '<div class="cfhp-filter-tabs">'+
        '<button class="cfhp-filter-btn active" data-filter="today" onclick="CFHP.setAdminFilter(\'today\',this)">Hoje</button>'+
        '<button class="cfhp-filter-btn" data-filter="month" onclick="CFHP.setAdminFilter(\'month\',this)">Este mês</button>'+
        '<button class="cfhp-filter-btn" data-filter="period" onclick="CFHP.setAdminFilter(\'period\',this)">Período</button>'+
        '<button class="cfhp-filter-btn" data-filter="all" onclick="CFHP.setAdminFilter(\'all\',this)">Todas</button>'+
      '</div>'+
      '<div id="cfhpPeriodFields" class="cfhp-period-fields" style="display:none">'+
        '<div><label>De</label><input id="cfhpPeriodStart" type="date"></div>'+
        '<div><label>Até</label><input id="cfhpPeriodEnd" type="date"></div>'+
        '<button class="btn dark" onclick="CFHP.applyAdminPeriod()">Aplicar</button>'+
      '</div>'+
      '<div id="cfhpAdminFilterLabel" class="notice" style="margin-top:9px">Mostrando o movimento de hoje.</div>';

    var team=document.createElement("div");team.id="cfhpTeamCard";team.className="card";
    team.innerHTML='<div class="sectionTitle" id="cfhpTeamTitle">Todas as vendedoras — hoje</div><div id="cfhpTeamList" class="cfhp-admin-team"><div class="empty">Carregando vendedoras...</div></div>';

    var storeGoal=document.createElement("div");
    storeGoal.id="cfhpStoreGoalAdmin";
    storeGoal.className="card";
    storeGoal.innerHTML=
      '<div class="sectionTitle">Meta mensal da loja</div>'+
      '<div class="notice">Essa meta é da loja inteira. A meta individual de cada vendedor continua separada.</div>'+
      '<div class="field" style="margin-top:10px"><label>Valor da meta da loja</label><input class="plainInput" id="cfhpStoreGoalInput" type="number" min="1" step="1000" placeholder="Ex.: 150000"></div>'+
      '<button class="btn primary full" onclick="CFHP.saveStoreGoal()">💾 Salvar meta da loja e avisar equipe</button>'+
      '<div class="metaGrid" style="margin-top:10px">'+
        '<div class="metaMini"><small>VENDIDO NO MÊS</small><strong id="cfhpStoreAdmSold">R$ 0,00</strong></div>'+
        '<div class="metaMini"><small>FALTA</small><strong id="cfhpStoreAdmRemaining">R$ 0,00</strong></div>'+
        '<div class="metaMini"><small>ATINGIDO</small><strong id="cfhpStoreAdmPct">0%</strong></div>'+
        '<div class="metaMini"><small>VENDAS</small><strong id="cfhpStoreAdmCount">0</strong></div>'+
      '</div>';

    at.insertAdjacentElement("afterend",storeGoal);
    storeGoal.insertAdjacentElement("afterend",filter);
    filter.insertAdjacentElement("afterend",team);
  }
}
function setPill(t,ok){var e=document.getElementById("cfhpOnlinePill");if(e){e.textContent=t;e.classList.toggle("ok",!!ok);}}
function authMsg(t,err){var e=document.getElementById("cfhpAuthMsg");if(e){e.textContent=t||"";e.style.color=err?"#b3444b":"#60788c";}}
async function loadStoreProgress(){
  if(!currentUser)return null;
  try{
    var r=await sb.rpc("cfhp_store_progress");
    if(r.error)throw r.error;
    var x=Array.isArray(r.data)?r.data[0]:r.data;
    if(!x)return null;
    var goal=Number(x.monthly_goal||0),sold=Number(x.sold_month||0),remaining=Number(x.remaining||0),pct=Number(x.percent||0),count=Number(x.sales_count||0);
    var el=document.getElementById("cfhpStoreGoalValue");if(el)el.textContent=dinheiro(goal);
    el=document.getElementById("cfhpStoreSold");if(el)el.textContent=dinheiro(sold);
    el=document.getElementById("cfhpStoreRemaining");if(el)el.textContent=dinheiro(remaining);
    el=document.getElementById("cfhpStoreSalesCount");if(el)el.textContent=count;
    el=document.getElementById("cfhpStoreGoalPct");if(el)el.textContent=pct.toFixed(1).replace(".",",")+"%";
    el=document.getElementById("cfhpStoreGoalProgress");if(el)el.style.width=Math.min(100,pct)+"%";
    el=document.getElementById("cfhpStoreGoalInput");if(el && document.activeElement!==el)el.value=goal;
    el=document.getElementById("cfhpStoreAdmSold");if(el)el.textContent=dinheiro(sold);
    el=document.getElementById("cfhpStoreAdmRemaining");if(el)el.textContent=dinheiro(remaining);
    el=document.getElementById("cfhpStoreAdmPct");if(el)el.textContent=pct.toFixed(1).replace(".",",")+"%";
    el=document.getElementById("cfhpStoreAdmCount");if(el)el.textContent=count;
    return {goal:goal,sold:sold,remaining:remaining,pct:pct,count:count};
  }catch(e){console.warn("Meta da loja",e);return null;}
}
async function saveStoreGoal(){
  if(!isAdmin){toast("Somente o administrador pode alterar a meta da loja.");return;}
  var input=document.getElementById("cfhpStoreGoalInput");
  var goal=Number(input&&input.value||0);
  if(!goal||goal<=0){toast("Digite uma meta da loja maior que zero.");return;}
  try{
    var r=await sb.rpc("cfhp_admin_set_store_goal",{p_goal:goal});
    if(r.error)throw r.error;
    await loadStoreProgress();
    toast("🏪 Meta da loja atualizada para "+dinheiro(goal)+".");
    try{
      var n=await sb.functions.invoke("cfhp-store-goal-notify",{body:{}});
      if(n.error)console.warn("Notificação da meta da loja",n.error);
      else toast("🔔 A nova meta foi enviada para a equipe.");
    }catch(e){console.warn("Notificação da meta da loja",e);}
  }catch(e){
    console.error(e);toast("Não foi possível alterar a meta da loja.");
  }
}
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
  ["metaInput","taxaVista","taxaEntrada","taxaPrazo","taxaCheque"].forEach(function(id){
    var el=document.getElementById(id);
    if(el){el.disabled=!isAdmin;el.style.opacity=isAdmin?"1":".72";}
  });
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
    await loadProfile();await syncUp();await syncDown();await loadStoreProgress();updateRole();
  }catch(e){console.error(e);authMsg("Não foi possível carregar sua conta: "+(e.message||e),true);}finally{handling=false;}
}
async function saveCloudProfile(){
  if(!currentUser)return;
  var p=window.getProfile(),r;
  if(isAdmin){
    r=await sb.rpc("cfhp_admin_update_profile",{p_user_id:currentUser.id,p_name:p.nome,p_goal:Number(p.meta||0),p_cash:Number(p.taxaVista||0),p_entry:Number(p.taxaEntrada||0),p_credit:Number(p.taxaPrazo||0),p_check:Number(p.taxaCheque||0)});
    if(r.error)throw r.error;currentProfile=r.data;
  }else{
    r=await sb.from("cfhp_profiles").update({name:p.nome}).eq("id",currentUser.id).select().single();
    if(r.error)throw r.error;currentProfile=r.data;
    await loadProfile();
  }
}
window.salvarPerfil=async function(){baseSalvarPerfil();try{await saveCloudProfile();toast("Perfil salvo no aparelho e na nuvem.");}catch(e){console.warn(e);toast("Perfil salvo neste aparelho. Vai sincronizar quando possível.");}};
window.salvarVenda=function(v){baseSalvarVenda(v);setTimeout(async function(){await syncUp();await loadStoreProgress();},0);};
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
var adminFilterMode="today",adminPeriodStart="",adminPeriodEnd="",adminProfilesCache=[],adminSalesCache=[];

function todayRange(){var d=window.hojeISO();return {start:d,end:d,label:"Hoje"};}
function monthRange(){var d=new Date(),y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,"0");return {start:y+"-"+m+"-01",end:y+"-"+m+"-31",label:"Este mês"};}
function currentAdminRange(){
  if(adminFilterMode==="today")return todayRange();
  if(adminFilterMode==="month")return monthRange();
  if(adminFilterMode==="period")return {start:adminPeriodStart||window.hojeISO(),end:adminPeriodEnd||window.hojeISO(),label:"Período"};
  return {start:null,end:null,label:"Todas as vendas"};
}
function filterLabel(r){
  if(adminFilterMode==="today")return "Mostrando o movimento de hoje.";
  if(adminFilterMode==="month")return "Mostrando todas as vendas deste mês.";
  if(adminFilterMode==="all")return "Mostrando todo o histórico disponível.";
  return "Mostrando de "+String(r.start).split("-").reverse().join("/")+" até "+String(r.end).split("-").reverse().join("/")+".";
}
async function fetchAllAdminSales(start,end,userId){
  var page=0,size=1000,all=[];
  while(true){
    var from=page*size,to=from+size-1;
    var q=sb.from("cfhp_sales").select("*").order("sold_at",{ascending:false}).range(from,to);
    if(start)q=q.gte("sale_date",start);
    if(end)q=q.lte("sale_date",end);
    if(userId)q=q.eq("user_id",userId);
    var r=await q;
    if(r.error)throw r.error;
    var batch=r.data||[];
    all=all.concat(batch);
    if(batch.length<size)break;
    page++;
  }
  return all;
}
async function loadAdminData(){
  var team=document.getElementById("cfhpTeamList");
  if(team)team.innerHTML='<div class="empty">Carregando equipe...</div>';
  try{
    var r=currentAdminRange();
    var pr=await sb.from("cfhp_profiles").select("*").eq("app_code","cfhp").order("name");
    if(pr.error)throw pr.error;
    var allSales=await fetchAllAdminSales(r.start,r.end,null);
    adminProfilesCache=pr.data||[];
    adminSalesCache=allSales;
    renderAdminSummary(adminProfilesCache,adminSalesCache,r);
    renderTeam(adminProfilesCache,adminSalesCache,r);
    renderSales(adminSalesCache,adminProfilesCache,"Vendas — "+r.label);
    await loadStoreProgress();
    var lab=document.getElementById("cfhpAdminFilterLabel");if(lab)lab.textContent=filterLabel(r);
  }catch(e){
    console.error(e);
    if(team)team.innerHTML='<div class="empty">Não foi possível carregar o painel online.</div>';
  }
}
function renderAdminSummary(profiles,sales,r){
  var total=sales.reduce(function(a,v){return a+Number(v.final_total||0);},0);
  var discounts=sales.reduce(function(a,v){return a+Number(v.discount_amount||0);},0);
  var comm=sales.reduce(function(a,v){return a+Number(v.commission_amount||0);},0);
  document.getElementById("admVendedor").textContent=profiles.length+" vendedora(s)";
  document.getElementById("admVendaMes").textContent=dinheiro(total);
  document.getElementById("admFalta").textContent=dinheiro(discounts);
  document.getElementById("admComissao").textContent=dinheiro(comm);
  document.getElementById("admMeta").textContent=sales.length+" venda(s)";
  document.getElementById("admPct").textContent=sales.length?dinheiro(total/sales.length):dinheiro(0);
  document.getElementById("admDiaria").textContent=r.label;
  document.getElementById("admQtd").textContent=sales.length;
  document.getElementById("admProgress").style.width=sales.length?"100%":"0%";
  var stats=document.querySelectorAll("#screen-admin .stats .stat small");
  if(stats[0])stats[0].textContent="VENDEDORAS";
  if(stats[1])stats[1].textContent="TOTAL VENDIDO";
  if(stats[2])stats[2].textContent="DESCONTOS";
  if(stats[3])stats[3].textContent="COMISSÃO";
  var minis=document.querySelectorAll("#screen-admin .metaMini small");
  if(minis[0])minis[0].textContent="QUANTIDADE";
  if(minis[1])minis[1].textContent="MÉDIA POR VENDA";
  if(minis[2])minis[2].textContent="FILTRO";
  if(minis[3])minis[3].textContent="VENDAS";
}
window.abrirAdmin=async function(){
  if(!isAdmin){toast("Esta conta não tem acesso de administrador.");return;}
  window.navigate("admin");
  adminFilterMode="today";
  var fields=document.getElementById("cfhpPeriodFields");if(fields)fields.style.display="none";
  document.querySelectorAll(".cfhp-filter-btn").forEach(function(b){b.classList.toggle("active",b.dataset.filter==="today");});
  await loadAdminData();
};
function renderTeam(profiles,sales,r){
  var list=document.getElementById("cfhpTeamList");list.innerHTML="";
  var title=document.getElementById("cfhpTeamTitle");if(title)title.textContent="Todas as vendedoras — "+r.label.toLowerCase();
  if(!profiles.length){list.innerHTML='<div class="empty">Nenhuma vendedora cadastrada.</div>';return;}
  profiles.forEach(function(p){
    var own=sales.filter(function(v){return v.user_id===p.id;});
    var total=own.reduce(function(a,v){return a+Number(v.final_total||0);},0);
    var desc=own.reduce(function(a,v){return a+Number(v.discount_amount||0);},0);
    var comm=own.reduce(function(a,v){return a+Number(v.commission_amount||0);},0);
    var card=document.createElement("div");card.className="cfhp-seller";
    var badge=own.length?'<span class="badge">'+own.length+' venda(s)</span>':'<span class="badge warn">Sem venda</span>';
    var detail='';
    if(own.length){
      detail='<div class="cfhp-sale-detail">'+own.map(function(v){
        var h="";
        try{h=new Date(v.sold_at).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});}catch(e){}
        return '<div class="cfhp-sale-detail-row"><span>'+esc(h)+' · '+esc(v.payment_method)+'</span><strong>'+dinheiro(v.final_total)+'</strong></div>';
      }).join("")+'</div>';
    }else{
      detail='<div class="cfhp-seller-zero">Nenhuma venda registrada neste filtro.</div>';
    }
    card.innerHTML='<div class="cfhp-seller-head"><div><strong>'+esc(p.name)+'</strong><div style="font-size:10px;color:#8092a1;margin-top:2px">'+(p.role==="admin"?"Administrador":"Vendedora")+'</div></div>'+badge+'</div>'+
      '<div class="cfhp-seller-metrics"><div><small>VENDAS</small><b>'+own.length+'</b></div><div><small>TOTAL</small><b>'+dinheiro(total)+'</b></div><div><small>DESCONTOS</small><b>'+dinheiro(desc)+'</b></div><div><small>COMISSÃO</small><b>'+dinheiro(comm)+'</b></div></div>'+
      detail+
      '<button class="btn secondary full" style="margin-top:9px;height:42px" data-view="'+esc(p.id)+'">Ver histórico da vendedora</button>'+
      '<details><summary>Editar meta e comissão</summary><div class="cfhp-admin-edit"><div><label>META MENSAL</label><input id="goal-'+p.id+'" type="number" value="'+Number(p.monthly_goal||0)+'"></div><div><label>À VISTA %</label><input id="cash-'+p.id+'" type="number" step="0.01" value="'+Number(p.commission_cash||0)+'"></div><div><label>ENTRADA %</label><input id="entry-'+p.id+'" type="number" step="0.01" value="'+Number(p.commission_entry||0)+'"></div><div><label>CARTÃO/CARNÊ %</label><input id="credit-'+p.id+'" type="number" step="0.01" value="'+Number(p.commission_credit||0)+'"></div></div><button class="btn primary full" style="margin-top:8px;height:42px" data-save="'+esc(p.id)+'">Salvar regras</button></details>';
    card.querySelector("[data-view]").onclick=function(){viewSeller(p.id,p.name);};
    card.querySelector("[data-save]").onclick=function(){saveSeller(p.id);};
    list.appendChild(card);
  });
}
function renderSales(sales,profiles,title){
  var map={};profiles.forEach(function(p){map[p.id]=p.name;});
  var t=document.querySelector("#screen-admin .card:last-child .sectionTitle");if(t)t.textContent=title;
  var l=document.getElementById("admLista");l.innerHTML="";
  if(!sales.length){l.innerHTML='<div class="empty">Nenhuma venda neste filtro.</div>';return;}
  sales.forEach(function(v){
    var row=document.createElement("div");row.className="saleRow";
    var when=String(v.sale_date).split("-").reverse().join("/");
    var h="";try{h=new Date(v.sold_at).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});}catch(e){}
    row.innerHTML='<div class="saleTop"><span>'+esc(map[v.user_id]||"Vendedora")+' · '+when+' '+esc(h)+'</span><strong>'+dinheiro(v.final_total)+'</strong></div>'+
      '<div class="saleMeta">'+esc(v.payment_method)+' · Desconto '+dinheiro(v.discount_amount||0)+' · Comissão '+dinheiro(v.commission_amount||0)+'</div>';
    l.appendChild(row);
  });
}
async function viewSeller(uid,name){
  try{
    var sales=await fetchAllAdminSales(null,null,uid);
    renderSales(sales,[{id:uid,name:name}],"Histórico completo de "+name);
    document.getElementById("admLista").scrollIntoView({behavior:"smooth",block:"start"});
  }catch(e){console.error(e);toast("Não foi possível carregar as vendas.");}
}
async function setAdminFilter(mode,btn){
  adminFilterMode=mode;
  document.querySelectorAll(".cfhp-filter-btn").forEach(function(b){b.classList.remove("active");});
  if(btn)btn.classList.add("active");
  var fields=document.getElementById("cfhpPeriodFields");
  if(fields)fields.style.display=mode==="period"?"grid":"none";
  if(mode!=="period")await loadAdminData();
}
async function applyAdminPeriod(){
  var start=document.getElementById("cfhpPeriodStart").value,end=document.getElementById("cfhpPeriodEnd").value;
  if(!start||!end){toast("Escolha a data inicial e final.");return;}
  if(start>end){toast("A data inicial não pode ser maior que a final.");return;}
  adminPeriodStart=start;adminPeriodEnd=end;adminFilterMode="period";await loadAdminData();
}
async function saveSeller(uid){
  function n(id){return Number(document.getElementById(id+"-"+uid).value||0);}
  var r=await sb.rpc("cfhp_admin_update_profile",{p_user_id:uid,p_name:null,p_goal:n("goal"),p_cash:n("cash"),p_entry:n("entry"),p_credit:n("credit"),p_check:null});
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
window.CFHP={showAuthMode:showAuthMode,submitAuth:submitAuth,logout:logout,claimAdmin:claimAdmin,viewSeller:viewSeller,saveSeller:saveSeller,saveStoreGoal:saveStoreGoal,setAdminFilter:setAdminFilter,applyAdminPeriod:applyAdminPeriod,syncNow:async function(){await syncUp();await syncDown();await loadStoreProgress();},client:sb};

async function boot(){
  addStyle();injectUI();var r=await sb.auth.getSession();await handleSession(r.data.session);
  sb.auth.onAuthStateChange(function(_e,session){setTimeout(function(){handleSession(session);},0);});
  window.addEventListener("online",async function(){setPill("Sincronizando...",false);await syncUp();await syncDown();});
  window.addEventListener("offline",function(){syncInfo(false);});
  setInterval(function(){if(currentUser&&navigator.onLine)syncUp();},45000);
}
boot();
})();