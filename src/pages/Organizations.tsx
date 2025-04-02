
import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Layout from '@/components/layout/Layout';
import { OrganizationsList } from '@/components/organizations/OrganizationsList';

const Organizations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Organizacje</h1>
            <p className="text-muted-foreground">
              Przeglądaj organizacje i ich wydarzenia
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Szukaj organizacji..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="ml-2">
              <Filter size={18} />
            </Button>
          </div>
        </div>
        
        <OrganizationsList />
      </div>
    </Layout>
  );
};

export default Organizations;
