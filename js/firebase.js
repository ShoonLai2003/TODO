import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
}from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDLrlPSV_9jgKFwgxzJ71UyHFLe8Hyybuw",
  authDomain: "todo-66bec.firebaseapp.com",
  projectId: "todo-66bec",
  storageBucket: "todo-66bec.firebasestorage.app",
  messagingSenderId: "705876050353",
  appId: "1:705876050353:web:cd8c3ab80eaa1148dd3d90",
  measurementId: "G-V0ZTCH4FB2"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, collection, addDoc, getDocs, deleteDoc,doc, updateDoc,auth, provider,
        　signInWithPopup,signOut ,onAuthStateChanged,query,where};