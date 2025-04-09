
import React from 'react';

const OrganizationsEmptyState = () => {
  return (
    <div className="text-center py-12">
      <h3 className="text-xl font-semibold mb-2">Nie znaleziono żadnych organizacji</h3>
      <p className="text-muted-foreground">
        Spróbuj zmienić kryteria wyszukiwania lub wróć później
      </p>
    </div>
  );
};

export default OrganizationsEmptyState;
