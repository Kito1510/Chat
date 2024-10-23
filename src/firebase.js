import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // ここにFirebaseの設定情報を入れる
  apiKey: "AIzaSyClkDsCczZpKaaQCRKcvtBA_gThvPdPzGU",
  authDomain: "chat-3d0e2.firebaseapp.com",
  projectId: "chat-3d0e2",
  storageBucket: "chat-3d0e2.appspot.com",
  messagingSenderId: "708685401073",
  appId: "1:708685401073:web:1f9eacd10e352571f5d250"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
