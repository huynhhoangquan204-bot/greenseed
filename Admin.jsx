import {useEffect,useState} from 'react'
import {collection,addDoc,deleteDoc,updateDoc,doc,onSnapshot,orderBy,query,serverTimestamp} from 'firebase/firestore'
import {signOut} from 'firebase/auth'
import {auth,db,isAdminUser} from './firebase'
import {AuthBox,inp,btn,money} from './Shared'
import {Thread} from './Chat'
const useCol=(name,order='createdAt')=>{const[d,s]=useState([]);useEffect(()=>onSnapshot(query(collection(db,name),orderBy(order,'desc')),x=>s(x.docs.map(y=>({id:y.id,...y.data()})))),[name]);return d}
const Del=({c,id})=><button className="text-xs text-red-400" onClick={()=>confirm('Xoá?')&&deleteDoc(doc(db,c,id))}>Xoá</button>

function Plants(){
 const list=useCol('plants'),[f,setF]=useState({name:'',price:'',image:'',desc:''}),set=k=>e=>setF({...f,[k]:e.target.value})
 const add=async e=>{e.preventDefault();await addDoc(collection(db,'plants'),{...f,price:Number(f.price),createdAt:serverTimestamp()});setF({name:'',price:'',image:'',desc:''})}
 return <div className="space-y-4"><form onSubmit={add} className="grid gap-2 sm:grid-cols-2">
  <input className={inp} required placeholder="Tên cây" value={f.name} onChange={set('name')}/><input className={inp} required type="number" min="0" placeholder="Giá (VNĐ)" value={f.price} onChange={set('price')}/>
  <input className={inp+' sm:col-span-2'} placeholder="Link ảnh (https://...)" value={f.image} onChange={set('image')}/>
  <textarea className={inp+' sm:col-span-2'} placeholder="Mô tả" value={f.desc} onChange={set('desc')}/><button className={btn+' sm:col-span-2'}>Thêm cây</button></form>
  {list.map(p=><div key={p.id} className="flex items-center justify-between rounded-lg bg-slate-900 px-4 py-2 text-sm"><span>{p.name} · {money(p.price)}</span><Del c="plants" id={p.id}/></div>)}</div>}

function News(){
 const list=useCol('announcements'),[t,setT]=useState('')
 const add=async e=>{e.preventDefault();if(!t.trim())return;await addDoc(collection(db,'announcements'),{text:t.trim(),createdAt:serverTimestamp()});setT('')}
 return <div className="space-y-4"><form onSubmit={add} className="space-y-2"><textarea className={inp} required placeholder="Nội dung thông báo" value={t} onChange={e=>setT(e.target.value)}/><button className={btn}>Đăng thông báo</button></form>
  {list.map(n=><div key={n.id} className="flex items-center justify-between rounded-lg bg-slate-900 px-4 py-2 text-sm"><span>{n.text}</span><Del c="announcements" id={n.id}/></div>)}</div>}

function Orders(){
 const list=useCol('orders')
 return <div className="space-y-2">{list.length===0&&<p className="text-slate-500">Chưa có đơn</p>}{list.map(o=><div key={o.id} className="space-y-1 rounded-lg bg-slate-900 p-3 text-sm">
  <div className="flex justify-between"><b>{o.plantName} × {o.qty}</b><span className="text-emerald-400">{money(o.total)}</span></div>
  <p className="text-slate-400">{o.name} · {o.phone} · {o.address} · {o.email}</p>
  <select className={inp+' !w-auto !py-1'} value={o.status} onChange={e=>updateDoc(doc(db,'orders',o.id),{status:e.target.value})}>{['Mới','Đang giao','Hoàn tất','Huỷ'].map(s=><option key={s}>{s}</option>)}</select></div>)}</div>}

function Chats(){
 const list=useCol('chats','updatedAt'),[sel,setSel]=useState(null)
 return <div className="grid gap-3 sm:grid-cols-3"><div className="space-y-1">{list.length===0&&<p className="text-slate-500">Chưa có chat</p>}{list.map(c=><button key={c.id} onClick={()=>setSel(c)} className={'block w-full rounded-lg px-3 py-2 text-left text-sm '+(sel?.id===c.id?'bg-emerald-800':'bg-slate-900')}><b className="block truncate">{c.email}</b><span className="block truncate text-slate-400">{c.lastMessage}</span></button>)}</div>
  <div className="rounded-lg border border-slate-800 sm:col-span-2">{sel?<Thread key={sel.id} uid={sel.id} email={sel.email} as="admin" className="h-80"/>:<p className="p-4 text-slate-500">Chọn một cuộc trò chuyện</p>}</div></div>}

export default function Admin({user}){
 const[tab,setTab]=useState('Cây'),[err,setErr]=useState('')
 useEffect(()=>{if(user&&!isAdminUser(user)){signOut(auth);setErr('Tài khoản này không có quyền admin')}},[user])
 const tabs={'Cây':Plants,'Thông báo':News,'Đơn hàng':Orders,'Chat':Chats},T=tabs[tab]
 if(!isAdminUser(user))return <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4"><div className="w-full max-w-sm space-y-3 rounded-2xl border border-slate-800 p-6">{err&&<p className="text-sm text-red-400">{err}</p>}<AuthBox admin/><a href={import.meta.env.BASE_URL} className="block text-center text-xs text-slate-500">← Về trang chủ</a></div></div>
 return <div className="min-h-screen bg-slate-950"><header className="flex items-center justify-between border-b border-slate-800 px-4 py-3"><b className="font-serif text-xl text-white">GreenSeed Admin</b><div className="flex gap-4 text-sm text-emerald-400"><a href={import.meta.env.BASE_URL}>Trang chủ</a><button onClick={()=>signOut(auth)}>Đăng xuất</button></div></header>
  <div className="mx-auto max-w-4xl p-4"><nav className="mb-4 flex gap-2">{Object.keys(tabs).map(k=><button key={k} onClick={()=>setTab(k)} className={'rounded-lg px-3 py-1.5 text-sm '+(tab===k?'bg-emerald-600 text-white':'bg-slate-900')}>{k}</button>)}</nav><T/></div></div>}
