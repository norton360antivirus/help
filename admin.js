const cfg=window.NORTON_HELP_CONFIG||{};let client=null;
if(window.supabase&&cfg.SUPABASE_URL&&!cfg.SUPABASE_URL.includes("YOUR-PROJECT")&&cfg.SUPABASE_ANON_KEY&&!cfg.SUPABASE_ANON_KEY.includes("YOUR_")) client=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);
const login=document.getElementById("login"),dash=document.getElementById("dashboard"),rows=document.getElementById("rows"),toast=document.getElementById("toast");
let data=[];
function showToast(t){toast.textContent=t;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),3000)}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
async function check(){
 if(!client)return;
 const {data:{session}}=await client.auth.getSession();
 if(session){login.style.display="none";dash.style.display="block";load()}
}
document.getElementById("loginForm").addEventListener("submit",async e=>{e.preventDefault();if(!client)return showToast("Configure Supabase in config.js first.");const {error}=await client.auth.signInWithPassword({email:loginEmail.value,password:loginPassword.value});if(error)return showToast(error.message);login.style.display="none";dash.style.display="block";load()});
document.getElementById("logout").onclick=async()=>{await client.auth.signOut();location.reload()};
async function load(){
 const {data:r,error}=await client.from("cancellation_requests").select("*").order("created_at",{ascending:false});
 if(error){showToast(error.message);return}data=r||[];render()
}
function render(){
 const q=document.getElementById("search").value.toLowerCase(), f=document.getElementById("filter").value;
 const list=data.filter(x=>(f==="all"||x.status===f)&&(`${x.full_name} ${x.email} ${x.phone}`.toLowerCase().includes(q)));
 total.textContent=data.length;pending.textContent=data.filter(x=>x.status==="Pending").length;processing.textContent=data.filter(x=>x.status==="Processing").length;completed.textContent=data.filter(x=>x.status==="Completed").length;
 rows.innerHTML=list.length?list.map(x=>`<tr><td>${new Date(x.created_at).toLocaleDateString()}</td><td><b>${esc(x.full_name)}</b></td><td>${esc(x.email)}<br>${esc(x.phone)}</td><td>₹${Number(x.amount||0).toFixed(2)}</td><td>${esc(x.bank_name)}</td><td>${esc(x.device)}</td><td>${esc(x.cancellation_choice)}</td><td><select class="status" data-id="${x.id}"><option ${x.status==="Pending"?"selected":""}>Pending</option><option ${x.status==="Processing"?"selected":""}>Processing</option><option ${x.status==="Completed"?"selected":""}>Completed</option><option ${x.status==="Rejected"?"selected":""}>Rejected</option></select></td><td><button class="action" data-view="${x.id}">View</button></td></tr>`).join(""):`<tr><td colspan="9" class="empty">No requests found.</td></tr>`;
 document.querySelectorAll("[data-id]").forEach(s=>s.onchange=()=>updateStatus(s.dataset.id,s.value));
 document.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>view(b.dataset.view));
}
async function updateStatus(id,status){const {error}=await client.from("cancellation_requests").update({status,updated_at:new Date().toISOString()}).eq("id",id);if(error)showToast(error.message);else{const x=data.find(a=>a.id===id);if(x)x.status=status;render();showToast("Status updated.")}}
function view(id){const x=data.find(a=>a.id===id);if(!x)return;detail.innerHTML=`<div><small>Name</small>${esc(x.full_name)}</div><div><small>Email</small>${esc(x.email)}</div><div><small>Phone</small>${esc(x.phone)}</div><div><small>Bank</small>${esc(x.bank_name)}</div><div><small>Amount</small>₹${Number(x.amount||0).toFixed(2)}</div><div><small>Device</small>${esc(x.device)}</div><div><small>Cancellation</small>${esc(x.cancellation_choice)}</div><div><small>Status</small>${esc(x.status)}</div><div class="full"><small>Address</small>${esc(x.address)}</div><div class="full"><small>Details</small>${esc(x.details)||"—"}</div>`;modal.classList.add("open")}
document.getElementById("close").onclick=()=>modal.classList.remove("open");modal.onclick=e=>{if(e.target===modal)modal.classList.remove("open")};
document.getElementById("search").oninput=render;document.getElementById("filter").onchange=render;document.getElementById("refresh").onclick=load;check();
