import {useEffect,useRef,useState} from 'react'
import {collection,doc,addDoc,setDoc,onSnapshot,orderBy,query,serverTimestamp} from 'firebase/firestore'
import {MessageCircle,Send,X} from 'lucide-react'
import {db} from './firebase'
import {inp} from './Shared'
export function Thread({uid,email,as,className='h-72'}){
 const[m,setM]=useState([]),[t,setT]=useState(''),end=useRef()
 useEffect(()=>onSnapshot(query(collection(db,'chats',uid,'messages'),orderBy('createdAt')),s=>setM(s.docs.map(d=>({id:d.id,...d.data()})))),[uid])
 useEffect(()=>{end.current?.scrollIntoView()},[m])
 const send=async e=>{e.preventDefault();const x=t.trim();if(!x)return;setT('')
  await setDoc(doc(db,'chats',uid),{email,lastMessage:x,updatedAt:serverTimestamp()},{merge:true})
  await addDoc(collection(db,'chats',uid,'messages'),{text:x,from:as,createdAt:serverTimestamp()})}
 return <div className="flex flex-col"><div className={'overflow-auto space-y-2 p-3 '+className}>
  {m.length===0&&<p className="text-center text-sm text-slate-500">Chưa có tin nhắn</p>}
  {m.map(x=><div key={x.id} className={'flex '+(x.from===as?'justify-end':'justify-start')}><span className={'max-w-[80%] rounded-2xl px-3 py-1.5 text-sm '+(x.from===as?'bg-emerald-600 text-white':'bg-slate-800 text-slate-100')}>{x.text}</span></div>)}
  <div ref={end}/></div>
  <form onSubmit={send} className="flex gap-2 border-t border-slate-800 p-2"><input className={inp} value={t} onChange={e=>setT(e.target.value)} placeholder="Nhập tin nhắn..."/><button className="rounded-lg bg-emerald-600 px-3 text-white"><Send size={16}/></button></form></div>}
export default function ChatWidget({user,onNeedLogin}){
 const[open,setOpen]=useState(false)
 const toggle=()=>user?setOpen(!open):onNeedLogin()
 return <div className="fixed bottom-4 right-4 z-40">
  {open&&user&&<div className="mb-3 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
   <div className="bg-emerald-700 px-4 py-2 font-medium text-white">Chat với Admin</div>
   <Thread uid={user.uid} email={user.email} as="user" className="h-72"/></div>}
  <button onClick={toggle} className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-500" aria-label="Chat">{open?<X/>:<MessageCircle/>}</button></div>}
