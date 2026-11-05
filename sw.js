// Offline cache for the E² Spinning simulator.
// Pages (index.html) are fetched fresh from the network first, so a new upload shows up on the next open.
// Everything else (three.js, icons) is served from the cache first.
const VERSION="es-v31";
const FILES=["./","index.html","manifest.webmanifest","three.min.js","OrbitControls.js","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;
  const page=e.request.mode==="navigate"||/\.html?$|\/$/.test(new URL(e.request.url).pathname);
  if(page){
    e.respondWith(fetch(e.request,{cache:"no-store"}).then(res=>{const copy=res.clone();caches.open(VERSION).then(c=>c.put("index.html",copy));return res;})
      .catch(()=>caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||fetch(e.request).then(res=>{const copy=res.clone();caches.open(VERSION).then(c=>c.put(e.request,copy));return res;})));});
