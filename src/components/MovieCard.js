import Link from 'next/link';
import styles from '@/styles/MovieCard.module.css';

export default function MovieCard({ movie, onSelect, isSelected }) {
  const handleSelect = (e) => {
    e.stopPropagation();
    onSelect(movie.id);
  };

  return (
    <div style={{ position: 'relative' }}>
      {onSelect && (
        <input 
          type="checkbox"
          checked={isSelected}
          onChange={handleSelect}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '20px',
            height: '20px',
            zIndex: 2
          }}
        />
      )}
      
      <Link href={`/movies/${movie.id}`} className={styles.card}>
        <div className={styles.imageContainer}>
          <img 
            src={movie.cover || 'https://via.placeholder.com/200x300'} 
            alt={movie.title} 
            className={styles.image}
          />
        </div>
        <h3 className={styles.title}>{movie.title}</h3>
      </Link>
    </div>
  );
}