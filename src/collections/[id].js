import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import MovieCard from '../components/MovieCard';

export default function CollectionDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [collection, setCollection] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchCollection = async () => {
        const collectionDoc = await getDoc(doc(db, "collections", id));
        if (collectionDoc.exists()) {
          setCollection({ id: collectionDoc.id, ...collectionDoc.data() });
        }
      };
      fetchCollection();
    }
  }, [id]);

  if (!collection) {
    return <div>Loading...</div>;
  }

  const handleRemoveMovie = (movieId) => {
    [cite_start]
    alert(`Removing movie ${movieId} from ${collection.name}`);
  };

  return (
    <div>
      <h1>Collection: {collection.name}</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      </div>
    </div>
  );
}