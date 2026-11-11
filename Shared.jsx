import {useEffect,useState} from 'react'
import {onAuthStateChanged,signInWithEmailAndPassword,createUserWithEmailAndPassword,sendPasswordResetEmail,updateProfile} from 'firebase/auth'
import {auth} from './firebase'
export const useAuth=()=>{const[u,s]=useState();useEffect(()=>onAuthStateChanged(auth,s),[]);return u}
const msg=c=>({'auth/invalid-credential':'Sai email hoặc mật khẩu','auth/email-already-in-use':'Email đã được đăng ký','auth/weak-password':'Mật khẩu tối thiểu 6 ký tự','auth/invalid-email':'Email không hợp lệ','auth/too-many-requests':'Thử lại sau ít phút','auth/user-not-found':'Email chưa đăng ký'}[c]||'Có lỗi xảy ra, thử lại')
export const inp='w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100 outline-none focus:border-emerald-500'
export const btn='rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 font-medium text-white disabled:opacity-50'
export const money=n=>Number(n||0).toLocaleString('vi-VN')+'đ'
export function Modal({onClose,children}){return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}><div className="w-full max-w-md rounded-2xl bg-slate-950 border border-slate-800 p-6 max-h-[90vh] overflow-auto" onClick={e=>e.stopPropagation()}>{children}</div></div>}
export function AuthBox({admin,onDone}){
 const[mode,setMode]=useState('login'),[f,setF]=useState({name:'',email:'',pw:''}),[err,setErr]=useState(''),[ok,setOk]=useState(''),[busy,setBusy]=useState(false)
 const set=k=>e=>setF({...f,[k]:e.target.value})
 const submit=async e=>{e.preventDefault();setErr('');setOk('');setBusy(true)
  try{
   if(mode==='login')await signInWithEmailAndPassword(auth,f.email,f.pw)
   else if(mode==='register'){const c=await createUserWithEmailAndPassword(auth,f.email,f.pw);if(f.name)await updateProfile(c.user,{displayName:f.name})}
   else{await sendPasswordResetEmail(auth,f.email);setOk('Đã gửi email đặt lại mật khẩu. Kiểm tra hộp thư (cả mục Spam).')}
   if(mode!=='reset')onDone?.()
  }catch(x){setErr(msg(x.code))}
  setBusy(false)}
 const title={login:admin?'Đăng nhập Admin':'Đăng nhập',register:'Đăng ký tài khoản',reset:'Quên mật khẩu'}[mode]
 return <form onSubmit={submit} className="space-y-3">
  <h2 className="font-serif text-2xl text-white">{title}</h2>
  {mode==='register'&&<input className={inp} placeholder="Họ tên" value={f.name} onChange={set('name')}/>}
  <input className={inp} type="email" required placeholder="Email" value={f.email} onChange={set('email')}/>
  {mode!=='reset'&&<input className={inp} type="password" required minLength={6} placeholder="Mật khẩu" value={f.pw} onChange={set('pw')}/>}
  {err&&<p className="text-sm text-red-400">{err}</p>}{ok&&<p className="text-sm text-emerald-400">{ok}</p>}
  <button className={btn+' w-full'} disabled={busy}>{busy?'Đang xử lý...':mode==='login'?'Đăng nhập':mode==='register'?'Đăng ký':'Gửi email đặt lại'}</button>
  <div className="flex justify-between text-sm text-emerald-400">
   {mode==='login'&&<button type="button" onClick={()=>setMode('reset')}>Quên mật khẩu?</button>}
   {mode!=='login'&&<button type="button" onClick={()=>setMode('login')}>← Đăng nhập</button>}
   {!admin&&mode!=='register'&&<button type="button" onClick={()=>setMode('register')}>Đăng ký</button>}
  </div></form>}
