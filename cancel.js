const cfg=window.NORTON_HELP_CONFIG||{};
let client=null;
if(window.supabase && cfg.SUPABASE_URL && !cfg.SUPABASE_URL.includes("YOUR-PROJECT") && cfg.SUPABASE_ANON_KEY && !cfg.SUPABASE_ANON_KEY.includes("YOUR_")){
  client=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);
}
const toast=document.getElementById("toast");
function showToast(t){toast.textContent=t;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),4000)}
document.getElementById("year").textContent=new Date().getFullYear();
document.getElementById("cancelForm").addEventListener("submit",async e=>{
 e.preventDefault();
 const btn=e.target.querySelector(".submit");btn.disabled=true;btn.textContent="Submitting...";
 const payload={
  full_name:document.getElementById("full_name").value.trim(),
  email:document.getElementById("email").value.trim(),
  phone:document.getElementById("phone").value.trim(),
  address:document.getElementById("address").value.trim(),
  amount:Number(document.getElementById("amount").value),
  bank_name:document.getElementById("bank_name").value.trim(),
  device:document.querySelector('input[name="device"]:checked')?.value,
  cancellation_choice:document.querySelector('input[name="cancel"]:checked')?.value,
  details:document.getElementById("details").value.trim()
 };
 try{
  if(!client) throw new Error("SUPABASE_NOT_CONFIGURED");
  const {error}=await client.from("cancellation_requests").insert(payload);
  if(error) throw error;
  e.target.reset();
  showToast("Request submitted successfully.");
 }catch(err){
  console.error(err);
  showToast(client?"Unable to submit right now. Please try again.":"Connect Supabase in config.js first.");
 }finally{btn.disabled=false;btn.innerHTML='Submit Cancellation Request <b>→</b>'}
});
