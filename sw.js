if(!self.define){let e,s={};const i=(i,r)=>(i=new URL(i+".js",r).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(r,l)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let o={};const u=e=>i(e,n),c={module:{uri:n},exports:o,require:u};s[n]=Promise.all(r.map((e=>c[e]||u(e)))).then((e=>(l(...e),o)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/_plugin-vue_export-helper-DlAUqK2U.js",revision:null},{url:"assets/AllGames-Ej3Zdrje.js",revision:null},{url:"assets/AllGames-o3aT1Qio.css",revision:null},{url:"assets/Game-BAZemERC.css",revision:null},{url:"assets/Game-C8j6Nchy.js",revision:null},{url:"assets/GameIcon.vue_vue_type_script_setup_true_lang-Cag7LOvg.js",revision:null},{url:"assets/Home-DiyTVWel.js",revision:null},{url:"assets/Home-HXe6MkbJ.css",revision:null},{url:"assets/main-BaQAKFYj.css",revision:null},{url:"assets/main-BroMhSce.js",revision:null},{url:"assets/NotFound-Bgy5g-yH.js",revision:null},{url:"assets/NotFound-CYXDN3uD.css",revision:null},{url:"assets/PageCenterer-CLY5f6is.css",revision:null},{url:"assets/PageCenterer-DceqHGeZ.js",revision:null},{url:"assets/PhArrowLeftBold-C6x6ZseE.js",revision:null},{url:"assets/PhXBold-DlgrmtPU.js",revision:null},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"apple-touch-icon.png",revision:"d18dff3151bfc72f12db03a5b888fe9e"},{url:"favicon-circle-192.png",revision:"da961087984b3bcb307f0dc10322f77c"},{url:"favicon-circle-512.png",revision:"edf1f0d144dc4bcd318cf3e7830a3085"},{url:"favicon-maskable-192.png",revision:"76981bc97afbb2a7aad5538707e32530"},{url:"favicon-maskable-512.png",revision:"ea6ef3411ddc36764073b4b91948b510"},{url:"favicon.ico",revision:"b30c54241a2cc48aa1c4373e44b30bff"},{url:"favicon.svg",revision:"dd9ae2bb1fe905b9c55671b1c75dd15e"},{url:"space-grotesk.woff2",revision:"b75d397ffd1c55bb6210349df3931142"},{url:"manifest.webmanifest",revision:"1978cc2966aa5d4e91d2fc474c788400"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
