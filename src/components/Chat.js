import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'messages'),
      orderBy('createdAt'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      );
    });

    return unsubscribe;
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (newMessage.trim()) {
      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        createdAt: new Date(),
        uid: auth.currentUser.uid,
        displayName: auth.currentUser.displayName,
        photoURL: auth.currentUser.photoURL
      });

      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-blue-500 p-4 text-white flex justify-between items-center">
        <h1 className="text-xl font-bold">Chat Room</h1>
        <button
          onClick={() => signOut(auth)}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start space-x-2 ${
              msg.uid === auth.currentUser.uid ? 'flex-row-reverse' : ''
            }`}
          >
            <img
              src={msg.photoURL}
              alt={msg.displayName}
              className="w-8 h-8 rounded-full"
            />
            <div className={`p-3 rounded-lg max-w-xs ${
              msg.uid === auth.currentUser.uid
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200'
            }`}>
              <p className="text-sm font-semibold">{msg.displayName}</p>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default Chat;
