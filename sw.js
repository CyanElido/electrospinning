// Offline cache for the E² Spinning simulator.
// Pages (index.html) are fetched fresh from the network first, so a new upload shows up on the next open.
// Everything else (three.js, icons) is served from the cache first.
const VERSION="es-v114";
const FILES=["./","index.html","manifest.webmanifest","three.min.js","OrbitControls.js","icon-192.png","icon-512.png","apple-touch-icon.png","md-01.jpeg","IMG_3007.jpeg","md-03.jpeg","md-04.jpeg","md-05.jpeg","md-06.jpeg","md-07.jpeg","md-08.jpeg","md-09.jpeg","md-10.jpeg","md-11.jpeg","iccm-01.jpeg","iccm-02.jpeg","iccm-03.jpeg","iccm-04.jpeg","iccm-05.jpeg","iccm-06.jpeg"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>Promise.all(FILES.map(f=>c.add(f).catch(()=>{})))).then(()=>self.skipWaiting()));   // a missing file never blocks the update});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;
  // lab videos stream straight from the network: Safari needs range requests, which the cache cannot answer
  if(e.request.headers.has("range")||/\.(mp4|webm|mov)$/i.test(new URL(e.request.url).pathname))return;
  const page=e.request.mode==="navigate"||/\.html?$|\/$/.test(new URL(e.request.url).pathname);
  if(page){
    e.respondWith(fetch(e.request,{cache:"no-store"}).then(res=>{const copy=res.clone();caches.open(VERSION).then(c=>c.put("index.html",copy));return res;})
      .catch(()=>caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||fetch(e.request).then(res=>{const copy=res.clone();caches.open(VERSION).then(c=>c.put(e.request,copy));return res;})));});
