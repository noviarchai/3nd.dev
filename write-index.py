#!/usr/bin/env python3
content = """<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>QRForge - 3ND Labs</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0a0a0f;color:#e8e8f0;font-family:monospace;min-height:100vh;display:flex;align-items:center;justify-content:center}
.box{background:#12121a;border:1px solid #9D4EDD;border-radius:12px;padding:40px;width:320px;text-align:center}
h1{font-size:28px;color:#9D4EDD;margin-bottom:8px}
p{color:#8888a0;margin-bottom:20px;font-size:13px}
input{width:100%;padding:12px;margin-bottom:12px;background:#1a1a25;border:1px solid #252535;border-radius:8px;color:#e8e8f0;font-size:14px;box-sizing:border-box}
input:focus{border-color:#9D4EDD;outline:none}
button{width:100%;padding:12px;background:#9D4EDD;color:#fff;border:none;border-radius:8px;font-size:14px;cursor:pointer;font-weight:600}
button:hover{background:#b366e6}
button:disabled{opacity:0.5}
.err{color:#FF5252;margin-top:12px;font-size:12px;display:none}
.main{display:none;width:100%}
.main-inner{max-width:900px;margin:0 auto;padding:20px}
.main h1{font-size:20px;color:#9D4EDD}
.stats{display:flex;gap:12px;margin:20px 0}
.stat{background:#12121a;border:1px solid #252535;border-radius:8px;padding:16px;flex:1;text-align:center}
.stat .v{font-size:24px;color:#9D4EDD;font-weight:700}
.stat .l{font-size:11px;color:#8888a0;margin-top:4px}
.create{background:#12121a;border:1px solid #252535;border-radius:12px;padding:24px;margin-bottom:24px}
.create h2{font-size:14px;color:#8888a0;margin-bottom:16px;text-transform:uppercase;letter-spacing:1px}
.row{display:flex;gap:10px;margin-bottom:10px}
.row input,.row select{flex:1;padding:10px 14px;background:#1a1a25;border:1px solid #252535;border-radius:6px;color:#e8e8f0;font-size:13px;box-sizing:border-box}
.row input:focus,.row select:focus{border-color:#9D4EDD}
.cbtn{width:100%;padding:12px;background:#9D4EDD;color:#fff;border:none;border-radius:8px;font-size:14px;cursor:pointer;font-weight:600;margin-top:4px}
.cbtn:hover{background:#b366e6}
.qr-section h2{font-size:14px;color:#8888a0;margin-bottom:12px;text-transform:uppercase;letter-spacing:1px}
.qr-empty{text-align:center;padding:40px;color:#555568;font-size:13px}
.qr-item{display:flex;gap:14px;align-items:center;background:#12121a;border:1px solid #252535;border-radius:8px;padding:14px;margin-bottom:8px}
.qr-img{width:64px;height:64px;border-radius:6px;background:#fff;flex-shrink:0}
.qr-info{flex:1;min-width:0}
.qr-title{font-size:14px;font-weight:600;margin-bottom:4px}
.qr-meta{font-size:11px;color:#8888a0;margin-bottom:8px}
.qr-actions{display:flex;gap:8px;flex-wrap:wrap}
.qr-actions button,.qr-actions a{background:#1a1a25;border:1px solid #252535;color:#8888a0;padding:5px 10px;border-radius:5px;cursor:pointer;font-size:11px;text-decoration:none}
.qr-actions button:hover,.qr-actions a:hover{border-color:#9D4EDD;color:#9D4EDD}
.export-box{background:#12121a;border:1px solid #252535;border-radius:12px;padding:20px;margin-top:20px;display:none}
.export-box h3{font-size:14px;color:#8888a0;margin-bottom:12px;text-transform:uppercase;letter-spacing:1px}
.exp-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px}
.exp-row label{font-size:12px;color:#8888a0}
.exp-row select,.exp-row input{padding:6px 10px;background:#1a1a25;border:1px solid #252535;border-radius:6px;color:#e8e8f0;font-size:12px}
.exp-row input[type=number]{width:70px}
.exp-row input[type=color]{width:36px;height:36px;padding:2px;background:#1a1a25;border-radius:6px;border:none;cursor:pointer}
.exp-btns{display:flex;gap:8px;margin-top:12px}
.exp-btns button{width:auto;padding:8px 16px;background:#9D4EDD;color:#fff;border:none;border-radius:8px;font-size:12px;cursor:pointer;font-weight:600}
.exp-btns button:hover{background:#b366e6}
.toast{position:fixed;bottom:20px;right:20px;background:#12121a;border:1px solid #00E676;color:#00E676;padding:12px 20px;border-radius:8px;font-size:13px;display:none;z-index:9999}
.toast.error{border-color:#FF5252;color:#FF5252}
.api-error{background:transparent;border:1px solid #FF5252;color:#FF5252;padding:10px;border-radius:6px;margin-bottom:12px;font-size:12px;display:none}
</style>
</head>
<body>
<div class="box" id="loginBox">
<h1>QRForge</h1>
<p>3ND Labs QR Platform</p>
<input type="email" id="email" placeholder="Email" value="dan@3nd.dev">
<input type="password" id="pass" placeholder="Password" value="QrForge2024!Dan">
<button id="btn" onclick="loginClick()">Sign In</button>
<div class="err" id="err">Invalid credentials</div>
</div>
<div class="main" id="mainBox">
<div class="main-inner">
<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #252535;padding:20px 0;margin-bottom:24px">
<h1>QRForge</h1>
<button onclick="logoutClick()" style="width:auto;padding:8px 16px;background:#1a1a25;border:1px solid #252535;color:#8888a0;border-radius:6px;font-size:12px;cursor:pointer">Logout</button>
</div>
<div class="stats">
<div class="stat"><div class="v" id="statTotal">0</div><div class="l">Total QR Codes</div></div>
<div class="stat"><div class="v" id="statScans">0</div><div class="l">Total Scans</div></div>
<div class="stat"><div class="v" id="statToday">0</div><div class="l">Scans Today</div></div>
</div>
<div class="create">
<h2>Create New QR</h2>
<div class="api-error" id="createError"></div>
<div class="row">
<input type="text" id="qrTitle" placeholder="Title">
<select id="qrType"><option value="url">URL</option><option value="wifi">WiFi</option><option value="vcard">vCard</option><option value="sms">SMS</option><option value="email">Email</option><option value="text">Text</option></select>
</div>
<div class="row">
<input type="text" id="qrContent" placeholder="https://...">
</div>
<button class="cbtn" id="createBtn" onclick="createClick()">Generate QR Code</button>
</div>
<div class="qr-section">
<h2>Your QR Codes</h2>
<div id="qrList"><div class="qr-empty">No QR codes yet. Create one above!</div></div>
</div>
<div class="export-box" id="exportSection">
<h3>Export QR</h3>
<div class="exp-row">
<label>Format:</label>
<select id="expFmt"><option value="png">PNG</option><option value="svg">SVG</option><option value="pdf">PDF</option></select>
<label>Size:</label>
<input type="number" id="expW" value="400" min="100" max="2000">
</div>
<div class="exp-row">
<label>Color:</label>
<input type="color" id="expColor" value="#000000">
<label>BG:</label>
<input type="color" id="expBg" value="#ffffff">
<select id="expBgTrans"><option value="solid">Solid</option><option value="transparent">Transparent</option></select>
</div>
<div class="exp-btns">
<button onclick="downloadExp('png')">PNG</button>
<button onclick="downloadExp('svg')">SVG</button>
<button onclick="downloadExp('pdf')">PDF</button>
</div>
</div>
</div>
</div>
<div id="toast"></div>
<script>
function loginClick(){
  var e=document.getElementById("email").value;
  var p=document.getElementById("pass").value;
  var btn=document.getElementById("btn");
  btn.textContent="Signing in...";btn.disabled=true;
  fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:p})})
    .then(function(r){return r.json()})
    .then(function(d){
      if(d.error){document.getElementById("err").textContent=d.error;document.getElementById("err").style.display="block";btn.textContent="Sign In";btn.disabled=false;return}
      document.getElementById("err").style.display="none";
      document.getElementById("loginBox").style.display="none";
      document.getElementById("mainBox").style.display="block";
      loadStats();loadList()
    })
    .catch(function(){document.getElementById("err").textContent="Connection error";document.getElementById("err").style.display="block";btn.textContent="Sign In";btn.disabled=false})
}
function logoutClick(){
  fetch("/api/logout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({})})
    .then(function(){document.getElementById("loginBox").style.display="block";document.getElementById("mainBox").style.display="none"})
}
function createClick(){
  var t=document.getElementById("qrTitle").value.trim();
  var ty=document.getElementById("qrType").value;
  var c=document.getElementById("qrContent").value.trim();
  if(!t||!c){var e=document.getElementById("createError");e.textContent="Required";e.style.display="block";setTimeout(function(){e.style.display="none"},4000);return}
  var btn=document.getElementById("createBtn");btn.textContent="Creating...";btn.disabled=true;
  fetch("/api/create",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:t,type:ty,content:c})})
    .then(function(r){return r.json()})
    .then(function(d){
      if(d.error){var e=document.getElementById("createError");e.textContent=d.error;e.style.display="block";btn.textContent="Generate QR Code";btn.disabled=false;return}
      document.getElementById("qrTitle").value="";document.getElementById("qrContent").value="";
      var t2=document.getElementById("toast");t2.textContent="QR created!";t2.style.display="block";setTimeout(function(){t2.style.display="none"},3000);
      btn.textContent="Generate QR Code";btn.disabled=false;
      loadList();loadStats()
    })
    .catch(function(){var e=document.getElementById("createError");e.textContent="Failed";e.style.display="block";btn.textContent="Generate QR Code";btn.disabled=false})
}
function deleteClick(id){
  if(!confirm("Delete?"))return;
  fetch("/api/delete/"+id,{method:"DELETE"})
    .then(function(){
      var t=document.getElementById("toast");t.textContent="Deleted";t.style.display="block";t.className="";
      setTimeout(function(){t.style.display="none"},3000);
      loadList();loadStats();closeExport()
    })
    .catch(function(){
      var t=document.getElementById("toast");t.textContent="Failed";t.style.display="block";t.className="toast error";
      setTimeout(function(){t.style.display="none"},3000)
    })
}
function openExport(shortId){
  window.currentExportId=shortId;
  document.getElementById("exportSection").style.display="block";
  document.getElementById("exportSection").scrollIntoView({behavior:"smooth"})
}
function closeExport(){window.currentExportId=null;document.getElementById("exportSection").style.display="none"}
function downloadExp(fmt){
  if(!window.currentExportId)return;
  var color=encodeURIComponent(document.getElementById("expColor").value);
  var bg=encodeURIComponent(document.getElementById("expBg").value);
  var bgp=encodeURIComponent(document.getElementById("expBgTrans").value==="transparent"?"transparent":bg);
  var w=encodeURIComponent(document.getElementById("expW").value);
  var url="/api/export/"+window.currentExportId+"?format="+fmt+"&color="+color+"&bg="+bgp+"&width="+w;
  var a=document.createElement("a");a.href=url;a.download=window.currentExportId+"."+fmt;
  document.body.appendChild(a);a.click();document.body.removeChild(a)
}
function loadList(){
  fetch("/api/list").then(function(r){return r.json()}).then(function(d){
    var el=document.getElementById("qrList");
    if(!d.qrs||!d.qrs.length){el.innerHTML="<div class=qr-empty>No QR codes yet</div>";return}
    el.innerHTML="";
    for(var i=0;i<d.qrs.length;i++){
      var q=d.qrs[i];
      var item=document.createElement("div");
      item.className="qr-item";
      item.innerHTML="<img src='/qr/"+q.short_id+".png' class=qr-img><div class=qr-info><div class=qr-title>"+q.title+"</div><div class=qr-meta>"+q.type+" - "+q.views+" scans</div><div class=qr-actions><button onclick=\"openExport('"+q.short_id+"')\">Export</button><a href=\"/qr/"+q.short_id+".png\" download>Save PNG</a><button onclick=\"deleteClick("+q.id+")\">Delete</button></div></div></div>";
      el.appendChild(item)
    }
  }).catch(function(){document.getElementById("qrList").innerHTML="<div class=qr-empty>Load failed</div>"})
}
function loadStats(){
  fetch("/api/stats").then(function(r){return r.json()}).then(function(d){
    document.getElementById("statTotal").textContent=d.total||0;
    document.getElementById("statScans").textContent=d.scans||0;
    document.getElementById("statToday").textContent=d.today||0
  }).catch(function(){})
}
</script>
</body>
</html>"""

with open('/var/www/111117.lab.3nd.dev/public/index.html', 'w') as f:
    f.write(content)
print('Written', len(content), 'bytes')