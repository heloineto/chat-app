import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { Form, Field } from 'react-final-form';
import { useRef } from 'react';

firebase.initializeApp({
  apiKey: 'AIzaSyA28Zg2JMlis63xwvdZPOZlwHVX5f84ka4',
  authDomain: 'chat-app-dev-4ed2f.firebaseapp.com',
  projectId: 'chat-app-dev-4ed2f',
  storageBucket: 'chat-app-dev-4ed2f.appspot.com',
  messagingSenderId: '466788416953',
  appId: '1:466788416953:web:0271ae95320c169f98ca68',
  measurementId: 'G-MY2Y86V3CQ',
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <Leave />
      </header>
      <section>{user ? <ChatRoom /> : <Enter />}</section>
    </div>
  );
}

const Enter = () => {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return <button onClick={signInWithGoogle}>Sign in with google</button>;
};

const Leave = () => {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
  );
};

const ChatRoom = () => {
  const bottom = useRef();

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const onSubmit = async ({ text }) => {
    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    bottom.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <main>
        {messages &&
          messages.map((message) => <Message key={message.id} {...message} />)}
        <div ref={bottom}></div>
      </main>

      <Form onSubmit={onSubmit}>
        {({ handleSubmit, form, submitting, pristine }) => (
          <form onSubmit={handleSubmit}>
            <Field name="text" component="input" type="text" />
            <button
              type="submit"
              disabled={submitting || pristine}
              onClick={(e) => {
                e.preventDefault();
                form.submit();
                form.reset();
              }}
            >
              Send
            </button>
          </form>
        )}
      </Form>
    </>
  );
};

const Message = ({ text, uid, photoURL }) => {
  const isSent = uid === auth.currentUser.uid;

  return (
    <div className={`message ${isSent ? 'sent' : 'recieved'}`}>
      <img src={photoURL} alt={`${uid}`} />
      <p>{text}</p>
    </div>
  );
};

export default App;
