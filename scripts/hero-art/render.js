const {chromium}=require('playwright');
(async()=>{const [,, svgPath, outPath]=process.argv;const fs=require('fs');
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
await p.setContent('<html><body style="margin:0">'+fs.readFileSync(svgPath,'utf8')+'</body></html>');
await p.screenshot({path:outPath});await b.close();})();
