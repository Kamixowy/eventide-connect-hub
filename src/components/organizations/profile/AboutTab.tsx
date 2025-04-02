
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AboutTabProps {
  organization: any;
}

const AboutTab: React.FC<AboutTabProps> = ({ organization }) => {
  return (
    <>
      <div className="prose max-w-none mb-8">
        <h2 className="text-2xl font-bold mb-4">O nas</h2>
        {organization.description.split('\n\n').map((paragraph: string, index: number) => (
          <p key={index} className="mb-4 text-gray-700">{paragraph}</p>
        ))}
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Osiągnięcia</h3>
        <ul className="space-y-2">
          {organization.achievements.map((achievement: string, index: number) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-3">
                <div className="h-2 w-2 rounded-full bg-green-600"></div>
              </div>
              <span>{achievement}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Nasz zespół</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {organization.team.map((member: any) => (
            <Card key={member.id} className="border">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <h4 className="font-semibold">{member.name}</h4>
                <p className="text-sm text-muted-foreground">{member.position}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default AboutTab;
