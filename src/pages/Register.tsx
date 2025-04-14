
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import RegisterCard from '@/components/auth/RegisterCard';

const Register = () => {
  const [searchParams] = useSearchParams();
  const [accountType, setAccountType] = useState<'organization' | 'sponsor'>(
    (searchParams.get('type') as 'organization' | 'sponsor') || 'organization'
  );

  useEffect(() => {
    const type = searchParams.get('type') as 'organization' | 'sponsor';
    if (type === 'organization' || type === 'sponsor') {
      setAccountType(type);
    }
  }, [searchParams]);

  return (
    <Layout>
      <div className="container py-16 max-w-md">
        <RegisterCard initialAccountType={accountType} />
      </div>
    </Layout>
  );
};

export default Register;
