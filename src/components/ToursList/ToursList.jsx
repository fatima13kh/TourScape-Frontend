import React from 'react';
//import TourCard from '../TourCard/TourCard';

const ToursList = ({ tours, loading, isCompanyView, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <p style={{ fontSize: '1.25rem', color: 'var(--charcoal)' }}>Loading tours...</p>
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="card luxury-shadow" style={{ padding: '4rem', textAlign: 'center' }}>
        <p style={{ fontSize: '1.25rem', color: 'var(--charcoal)' }}>
          {isCompanyView
            ? 'No tours yet. Create your first tour!'
            : 'No tours available at the moment.'}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '2rem',
      }}
    >
      {tours.map((tour) => (
        <TourCard
          key={tour._id}
          tour={tour}
          isCompanyView={isCompanyView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ToursList;
