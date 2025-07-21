import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import CollectionCard from '../components/CollectionCard';

export default function CollectionList() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      const querySnapshot = await getDocs(collection(db, "collections"));
      const collectionsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCollections(collectionsData);
    };
    fetchCollections();
  }, []);

  const handleAddCollection = () => {
    [cite_start]
    const newCollectionName = prompt("Enter new collection name:");
    if (newCollectionName) {
      alert(`Collection "${newCollectionName}" created!`);
    }
  };

  return (
    <div>
      <h1>My Collections</h1>
      <button onClick={handleAddCollection}>Add a Collection</button>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
        {collections.map(c => (
          <CollectionCard key={c.id} collection={c} />
        ))}
      </div>
    </div>
  );
}