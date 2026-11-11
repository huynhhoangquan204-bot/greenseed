import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
const e=import.meta.env
const app=initializeApp({apiKey:e.VITE_FIREBASE_API_KEY,authDomain:e.VITE_FIREBASE_AUTH_DOMAIN,projectId:e.VITE_FIREBASE_PROJECT_ID,storageBucket:e.VITE_FIREBASE_STORAGE_BUCKET,messagingSenderId:e.VITE_FIREBASE_MESSAGING_SENDER_ID,appId:e.VITE_FIREBASE_APP_ID})
export const auth=getAuth(app),db=getFirestore(app)
export const isAdminUser=u=>!!u&&!!e.VITE_ADMIN_EMAIL&&u.email?.toLowerCase()===e.VITE_ADMIN_EMAIL.toLowerCase()
