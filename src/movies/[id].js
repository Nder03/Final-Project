import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function MovieDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchMovie = async () => {
        const movieDocRef = doc(db, 'movies', id);
        const movieDoc = await getDoc(movieDocRef);
        
        if (movieDoc.exists()) {
          setMovie({ id: movieDoc.id, ...movieDoc.data() });
        } else {
          console.log("No such document!");
        }
        setLoading(false);
      };
      fetchMovie();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!movie) {
    return <div>Movie not found.</div>;
  }

  return (
    <div>
      <img src={movie.cover || 'https://via.placeholder.com/400'} alt={movie.title} width="400" />
      
      <h1>{movie.title}</h1>
      
      <p><strong>Genre:</strong> {movie.genres}</p>
      <p><strong>Duration:</strong> {movie.duration} minutes</p>
      <p><strong>Rating:</strong> {movie.rating}</p>
      <p><strong>Description:</strong> {movie.description}</p>
    </div>
  );
}