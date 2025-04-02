
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Trash2 } from 'lucide-react';

interface ImageUploadSectionProps {
  bannerPreview: string | null;
  resetBannerImage: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleBannerUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUploadSection = ({
  bannerPreview,
  resetBannerImage,
  fileInputRef,
  handleBannerUpload,
}: ImageUploadSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Zdjęcie główne</CardTitle>
        <CardDescription>
          Dodaj zdjęcie główne wydarzenia
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed rounded-lg p-4 text-center space-y-4">
          {bannerPreview ? (
            <div className="relative">
              <img 
                src={bannerPreview} 
                alt="Podgląd" 
                className="mx-auto max-h-48 rounded-md"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={resetBannerImage}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ) : (
            <>
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Przeciągnij i upuść lub kliknij, aby przesłać
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Zalecany rozmiar: 1200x600px, max 5MB
                </p>
              </div>
            </>
          )}
          <input
            type="file"
            id="banner-upload"
            className="hidden"
            accept="image/*"
            onChange={handleBannerUpload}
            ref={fileInputRef}
          />
          {!bannerPreview && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }}
            >
              <Upload size={16} className="mr-2" /> Wybierz plik
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUploadSection;
