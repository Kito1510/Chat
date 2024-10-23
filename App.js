// App.js
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';

// Firebaseの設定
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // 認証状態の監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // メッセージの監視
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'messages'), orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messages);
    });

    return () => unsubscribe();
  }, [user]);

  // Googleログイン
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  // ログアウト
  const handleSignOut = () => signOut(auth);

  // メッセージ送信
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        createdAt: new Date(),
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow">
        {/* ヘッダー */}
        <div className="p-4 border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold">チャットアプリ</h1>
          {user ? (
            <div className="flex items-center gap-4">
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="w-8 h-8 rounded-full"
              />
              <span>{user.displayName}</span>
              <button 
                onClick={handleSignOut}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                ログアウト
              </button>
            </div>
          ) : (
            <button 
              onClick={signInWithGoogle}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Googleでログイン
            </button>
          )}
        </div>

        {user ? (
          <>
            {/* メッセージ一覧 */}
            <div className="h-[500px] overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex items-start gap-2 ${
                    message.uid === user.uid ? 'flex-row-reverse' : ''
                  }`}
                >
                  <img 
                    src={message.photoURL} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full"
                  />
                  <div className={`max-w-[70%] ${
                    message.uid === user.uid 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200'
                  } rounded-lg p-3`}>
                    <div className="text-sm font-semibold mb-1">
                      {message.displayName}
                    </div>
                    <div>{message.text}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* メッセージ入力フォーム */}
            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="メッセージを入力..."
                  className="flex-1 border rounded p-2"
                />
                <button 
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  送信
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="p-8 text-center text-gray-500">
            ログインしてチャットを開始してください
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
