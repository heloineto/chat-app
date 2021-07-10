import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { Form, Field } from 'react-final-form';

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

const [user] = useAuthState();

function App() {
  return (
    <div className="App">
      <header></header>
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
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: id });

  const onSubmit = ({}) => {
    return;
  };

  return (
    <>
      <div>
        {messages &&
          messages.map((msg) => <Message key={msg.id} message={msg} />)}
      </div>

      <Form onSubmit={onSubmit}>
        {({ handleSubmit, submitting, pristine }) => (
          <form onSubmit={handleSubmit}>
            <Field name="message" component="input" type="text" />
            <button type="submit" disabled={submitting || pristine}>
              Send
            </button>
          </form>
        )}
      </Form>
    </>
  );
};

const Message = ({ msg }) => {
  const { text, uid, photoURL } = msg;

  const isSent = uid === auth.currentUser.uid;

  return (
    <div className={`${isSent ? 'sent' : 'recieved'}`}>
      <img src={photoURL} alt={`${uid}'s photo`} />
      <p>{text}</p>
    </div>
  );
};

export default App;
