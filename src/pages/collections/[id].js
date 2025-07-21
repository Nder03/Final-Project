import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, arrayRemove } from 'firebase/firestore';
import { useAuth } from '@/AuthContext';
import MovieCard from '@/components/MovieCard';

export default function CollectionDetail() {
  const router = useRouter();
  const { id: collectionId } = router.query;
  const { currentUser } = useAuth();

  const [collectionInfo, setCollectionInfo] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCollectionDetails = async () => {
    if (!collectionId || !currentUser) return;

    setLoading(true);
    const collectionDocRef = doc(db, 'collections', collectionId);
    const collectionDoc = await getDoc(collectionDocRef);

    if (!collectionDoc.exists() || collectionDoc.data().userId !== currentUser.uid) {
      console.error("Collection not found or access denied.");
      setLoading(false);
      return;
    }

    const collectionData = collectionDoc.data();
    setCollectionInfo(collectionData);

    if (collectionData.movies && collectionData.movies.length > 0) {
      const moviesQuery = query(collection(db, 'movies'), where('__name__', 'in', collectionData.movies));
      const moviesSnapshot = await getDocs(moviesQuery);
      const moviesData = moviesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMovies(moviesData);
    } else {
      setMovies([]);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchCollectionDetails();
  }, [collectionId, currentUser]);

  const handleRemoveMovie = async (movieId) => {
    const collectionRef = doc(db, 'collections', collectionId);

    await updateDoc(collectionRef, {
      movies: arrayRemove(movieId)
    });

    setMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
    alert("Movie removed from collection.");
  };

  if (loading) return <div>Loading collection...</div>;
  if (!collectionInfo) return <div>Collection not found.</div>;

  return (
    <div>
      <h1>Collection: {collectionInfo.name}</h1>
      <p>You have {movies.length} movie(s) in this collection.</p>
      <hr />
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '20px' 
      }}>
        {movies.length > 0 ? (
          movies.map(movie => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onRemove={handleRemoveMovie}
            />
          ))
        ) : (
          <p>No movies have been added to this collection yet.</p>
        )}
      </div>
    </div>
  );
}