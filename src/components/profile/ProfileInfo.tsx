
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileInfoProps {
  user: any;
}

const ProfileInfo = ({ user }: ProfileInfoProps) => {
  return (
    <div className="flex-1">
      <Card>
        <CardHeader>
          <CardTitle>Informacje o profilu</CardTitle>
          <CardDescription>
            Twój adres email: {user.email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">
            Typ konta: {user.user_metadata?.userType === 'organization' ? 'Organizacja' : 'Sponsor'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileInfo;
