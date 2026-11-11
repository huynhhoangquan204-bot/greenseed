import {useEffect,useState} from 'react'
import {collection,addDoc,onSnapshot,orderBy,query,where,serverTimestamp} from 'firebase/firestore'
import {signOut} from 'firebase/auth'
import {Sprout,LogOut} from 'lucide-react'
import {auth,db} from './firebase'
import {useAuth,AuthBox,Modal,inp,btn,money} from './Shared'
import ChatWidget from './Chat'
import Admin from './Admin'

const useCol=(name,order='createdAt')=>{const[d,s]=useState([]);useEffect(()=>onSnapshot(query(collection(db,name),orderBy(order,'desc')),x=>s(x.docs.map(y=>({id:y.id,...y.data()})))),[name]);return d}

function OrderForm({plant,user,onClose}){
 const[f,setF]=useState({qty:1,name:user.displayName||'',phone:'',address:''}),[done,setDone]=useState(false),[busy,setBusy]=useState(false)
 const set=k=>e=>setF({...f,[k]:e.target.value})
 const submit=async e=>{e.preventDefault();setBusy(true)
  await addDoc(collection(db,'orders'),{uid:user.uid,email:user.email,plantId:plant.id,plantName:plant.name,price:plant.price,qty:Number(f.qty),total:plant.price*f.qty,name:f.name,phone:f.phone,address:f.address,status:'Mới',createdAt:serverTimestamp()})
  setDone(true);setBusy(false)}
 if(done)return <div className="space-y-3 text-center"><p className="text-emerald-400">Đặt mua thành công! Admin sẽ liên hệ bạn sớm.</p><button className={btn} onClick={onClose}>Đóng</button></div>
 return <form onSubmit={submit} className="space-y-3">
  <h2 className="font-serif text-2xl text-white">Đặt mua: {plant.name}</h2>
  <input className={inp} required placeholder="Họ tên người nhận" value={f.name} onChange={set('name')}/>
  <input className={inp} required placeholder="Số điện thoại" value={f.phone} onChange={set('phone')}/>
  <input className={inp} required placeholder="Địa chỉ giao hàng" value={f.address} onChange={set('address')}/>
  <input className={inp} type="number" min="1" required value={f.qty} onChange={set('qty')}/>
  <p className="text-right text-slate-300">Tổng: <b className="text-emerald-400">{money(plant.price*f.qty)}</b></p>
  <button className={btn+' w-full'} disabled={busy}>Xác nhận đặt mua</button></form>}

function MyOrders({uid}){
 const[o,setO]=useState([])
 useEffect(()=>onSnapshot(query(collection(db,'orders'),where('uid','==',uid)),s=>setO(s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0)))),[uid])
 if(!o.length)return null
 return <section className="mt-10"><h2 className="font-serif text-2xl text-white mb-3">Đơn hàng của tôi</h2>
  <div className="space-y-2">{o.map(x=><div key={x.id} className="flex justify-between rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm"><span>{x.plantName} × {x.qty}</span><span className="text-emerald-400">{money(x.total)} · {x.status}</span></div>)}</div></section>}

function Home({user}){
 const plants=useCol('plants'),news=useCol('announcements'),[modal,setModal]=useState(null)
 const buy=p=>user?setModal({t:'order',p}):setModal({t:'auth'})
 return <div className="min-h-screen bg-slate-950">
  <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 py-3 backdrop-blur">
   <div className="flex items-center gap-2 font-serif text-xl text-white"><Sprout className="text-emerald-500"/>GreenSeed</div>
   {user?<div className="flex items-center gap-3 text-sm"><span className="hidden sm:inline text-slate-400">{user.displayName||user.email}</span><button onClick={()=>signOut(auth)} className="flex items-center gap-1 text-emerald-400"><LogOut size={16}/>Đăng xuất</button></div>
   :<button className={btn} onClick={()=>setModal({t:'auth'})}>Đăng nhập / Đăng ký</button>}
  </header>
  {news[0]&&<div className="bg-emerald-900/60 px-4 py-2 text-center text-sm text-emerald-100">📢 {news[0].text}</div>}
  <main className="mx-auto max-w-6xl p-4">
   <h1 className="font-serif text-4xl text-white my-6">Mầm Xanh</h1>
   {plants.length===0&&<p className="text-slate-500">Chưa có cây nào. Admin hãy thêm cây ở trang /admin.</p>}
   <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{plants.map(p=><div key={p.id} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
    {p.image?<img src={p.image} alt={p.name} className="h-48 w-full object-cover"/>:<div className="flex h-48 items-center justify-center bg-slate-800"><Sprout size={48} className="text-emerald-700"/></div>}
    <div className="space-y-2 p-4"><h3 className="font-serif text-xl text-white">{p.name}</h3><p className="text-sm text-slate-400">{p.desc}</p>
     <div className="flex items-center justify-between"><b className="text-emerald-400">{money(p.price)}</b><button className={btn} onClick={()=>buy(p)}>Đặt mua</button></div></div></div>)}</div>
   {user&&<MyOrders uid={user.uid}/>}
   {news.length>1&&<section className="mt-10"><h2 className="font-serif text-2xl text-white mb-3">Thông báo</h2><ul className="space-y-1 text-sm text-slate-300">{news.map(n=><li key={n.id}>• {n.text}</li>)}</ul></section>}
  </main>
  <footer className="p-6 text-center text-xs text-slate-600"><a href="/admin">Admin</a></footer>
  <ChatWidget user={user} onNeedLogin={()=>setModal({t:'auth'})}/>
  {modal&&<Modal onClose={()=>setModal(null)}>{modal.t==='auth'?<AuthBox onDone={()=>setModal(null)}/>:<OrderForm plant={modal.p} user={user} onClose={()=>setModal(null)}/>}</Modal>}
 </div>}

export default function App(){
 const user=useAuth()
 if(user===undefined)return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-500">Đang tải...</div>
 return location.pathname.startsWith('/admin')?<Admin user={user}/>:<Home user={user}/>}
