import Link from 'next/link';

export default function CollectionCard({ collection, onDelete }) {
  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(collection.id, collection.name);
  };

  return (
    <div style={{ position: 'relative' }}>
      <Link href={`/collections/${collection.id}`}>
        <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', cursor: 'pointer', width: '200px' }}>
          <div style={{ width: '180px', height: '270px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <span>{collection.name}</span>
          </div>
          <h3>{collection.name}</h3>
        </div>
      </Link>
      
      {onDelete && (
        <button 
          onClick={handleDeleteClick}
          style={{ 
            position: 'absolute', 
            top: '15px', 
            right: '15px', 
            backgroundColor: '#dc3545', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Delete
        </button>
      )}
    </div>
  );
}