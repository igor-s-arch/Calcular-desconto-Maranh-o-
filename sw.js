const CACHE="calcula-facil-hp-v3";
const ARQUIVOS=["./","./index.html","./manifest.json","./logo.png","./icon-192.png","./icon-512.png","./apple-touch-icon.png","./online.js"];

self.addEventListener("install",event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ARQUIVOS)));
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET") return;
  event.respondWith(
    fetch(event.request).then(response=>{
      const copy=response.clone();
      caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});
      return response;
    }).catch(()=>caches.match(event.request).then(cached=>cached||caches.match("./index.html")))
  );
});

self.addEventListener("push",event=>{
  let data={title:"Calcula Fácil HP",body:"Você tem uma nova atualização."};
  try{data=Object.assign(data,event.data?event.data.json():{})}catch(e){
    try{data.body=event.data?event.data.text():data.body}catch(_){}
  }
  event.waitUntil(self.registration.showNotification(data.title,{
    body:data.body,
    icon:"./icon-192.png",
    badge:"./icon-192.png",
    tag:data.tag||"cfhp-push",
    data:data.url||"./"
  }));
});

self.addEventListener("notificationclick",event=>{
  event.notification.close();
  const target=event.notification.data||"./";
  event.waitUntil(
    clients.matchAll({type:"window",includeUncontrolled:true}).then(list=>{
      for(const client of list){if("focus" in client)return client.focus()}
      if(clients.openWindow)return clients.openWindow(target);
    })
  );
});
