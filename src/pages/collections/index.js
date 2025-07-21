import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs, addDoc, doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../../AuthContext';
import CollectionCard from '../../components/CollectionCard';
import Link from 'next/link';

export default function CollectionList() {
  const { currentUser } = useAuth();
  const [collections, setCollections] = useState([]);

  const fetchCollections = async () => {
      if (!currentUser) return;
      const q = query(collection(db, "collections"), where("userId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      const collectionsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCollections(collectionsData);
  };

  useEffect(() => {
    fetchCollections();
  }, [currentUser]);

  const handleAddCollection = async () => {
    const newCollectionName = prompt("Enter new collection name:");
    if (newCollectionName && currentUser) {
      await addDoc(collection(db, "collections"), {
        name: newCollectionName,
        userId: currentUser.uid,
        movies: []
      });
      fetchCollections();
    }
  };

  const handleDeleteCollection = async (collectionId, collectionName) => {
    if (window.confirm(`Are you sure you want to delete the "${collectionName}" collection?`)) {
      const collectionRef = doc(db, 'collections', collectionId);
      await deleteDoc(collectionRef);
      
      setCollections(prevCollections => prevCollections.filter(c => c.id !== collectionId));
      alert("Collection deleted.");
    }
  };

  if (!currentUser) {
    return (
        <div>
            <h1>My Collections</h1>
            <p>Please <Link href="/login">login</Link> to view your collections.</p>
        </div>
    );
  }

  return (
    <div>
      <h1>My Collections</h1>
      <button onClick={handleAddCollection}>Add a Collection</button>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
        {collections.map(c => (
          <CollectionCard 
            key={c.id} 
            collection={c} 
            onDelete={handleDeleteCollection}
          />
        ))}
      </div>
    </div>
  );
}