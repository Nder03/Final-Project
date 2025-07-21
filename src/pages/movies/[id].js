import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, getDoc, getDocs, collection, updateDoc, arrayUnion, addDoc, query, where } from 'firebase/firestore';
import { useAuth } from '../../AuthContext';
import Modal from '../../components/Modal';

export default function MovieDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [collections, setCollections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    if (id) {
      const fetchMovie = async () => {
        setLoading(true);
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

  useEffect(() => {
    if (isModalOpen && currentUser) {
      const fetchCollections = async () => {
        const q = query(collection(db, "collections"), where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        const userCollections = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCollections(userCollections);
      };
      fetchCollections();
    }
  }, [isModalOpen, currentUser]);

  const handleAddToExistingCollection = async (collectionId) => {
    const collectionRef = doc(db, "collections", collectionId);
    await updateDoc(collectionRef, {
      movies: arrayUnion(movie.id)
    });
    alert(`Added to collection!`);
    setIsModalOpen(false);
  };

  const handleCreateAndAddToCollection = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) {
        alert("Collection name cannot be empty.");
        return;
    }
    const newCollectionRef = await addDoc(collection(db, "collections"), {
      name: newCollectionName,
      userId: currentUser.uid,
      movies: [movie.id]
    });

    alert(`Created collection "${newCollectionName}" and added the movie!`);
    setNewCollectionName("");
    setIsModalOpen(false);
  };

  if (loading) return <div>Loading...</div>;
  if (!movie) return <div>Movie not found.</div>;

  return (
    <div>
      <img src={movie.cover} alt={movie.title} width="400" />
      <h1>{movie.title}</h1>
      <p><strong>Genre:</strong> {movie.genres}</p>
      <p><strong>Description:</strong> {movie.description}</p>
      <button onClick={() => setIsModalOpen(true)} disabled={!currentUser}>
        {currentUser ? "Add to Collection" : "Login to Add"}
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Add "{movie.title}" to a collection</h2>
        <hr/>
        <h3>Your Collections</h3>
        {collections.length > 0 ? (
          collections.map(c => (
            <button key={c.id} onClick={() => handleAddToExistingCollection(c.id)}>
              {c.name}
            </button>
          ))
        ) : (
          <p>You don't have any collections yet.</p>
        )}
        <hr/>
        <h3>Or, Create a New Collection</h3>
        <form onSubmit={handleCreateAndAddToCollection}>
          <input 
              type="text" 
              value={newCollectionName} 
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="New collection name" 
          />
          <button type="submit">Create and Add</button>
        </form>
      </Modal>
    </div>
  );
}