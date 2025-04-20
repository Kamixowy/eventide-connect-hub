
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  AlertCircle, 
  Edit, 
  FileCheck, 
  FileX, 
  Upload
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { CollaborationStatus } from "@/services/collaborations/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CollaborationDialogActionsProps {
  status: CollaborationStatus;
  userType: 'organization' | 'sponsor';
  onStatusChange: (newStatus: CollaborationStatus, settlementFile?: File) => void;
  counterOfferMessage?: string;
  onCounterOfferChange?: (message: string) => void;
  onEditOptions?: () => void;
}

const CollaborationDialogActions = ({
  status,
  userType,
  onStatusChange,
  counterOfferMessage,
  onCounterOfferChange,
  onEditOptions
}: CollaborationDialogActionsProps) => {
  const [isSettlementDialogOpen, setIsSettlementDialogOpen] = useState(false);
  const [settlementFile, setSettlementFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSettlementFile(e.target.files[0]);
    }
  };

  const handleSettlementSubmit = () => {
    if (settlementFile) {
      onStatusChange('settlement', settlementFile);
      setIsSettlementDialogOpen(false);
    }
  };

  // Actions for organization
  if (userType === 'organization') {
    switch (status) {
      case 'pending':
        return (
          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => onStatusChange('canceled')}
              className="text-red-600"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Odrzuć
            </Button>
            <Button 
              variant="outline"
              onClick={() => onStatusChange('negotiation')}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Negocjuj
            </Button>
            <Button 
              className="btn-gradient"
              onClick={() => onStatusChange('accepted')}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Zaakceptuj
            </Button>
          </div>
        );

      case 'negotiation':
        return (
          <div className="space-y-4">
            {counterOfferMessage !== undefined && (
              <Textarea
                placeholder="Wpisz swoją wiadomość..."
                value={counterOfferMessage}
                onChange={(e) => onCounterOfferChange?.(e.target.value)}
                className="min-h-[100px]"
              />
            )}
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => onStatusChange('canceled')}
                className="text-red-600"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Odrzuć współpracę
              </Button>
              <Button 
                variant="outline"
                onClick={onEditOptions}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edytuj opcje
              </Button>
              <Button 
                className="btn-gradient"
                onClick={() => onStatusChange('in_progress')}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Akceptuj warunki
              </Button>
            </div>
          </div>
        );
        
      case 'in_progress':
        return (
          <div className="flex gap-2 justify-end">
            <Dialog open={isSettlementDialogOpen} onOpenChange={setIsSettlementDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-gradient">
                  <FileCheck className="w-4 h-4 mr-2" />
                  Rozlicz współpracę
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rozliczenie współpracy</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <p className="text-sm text-muted-foreground">
                    Wgraj raport z rozliczenia współpracy w formacie PDF.
                  </p>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="settlement-file">Plik rozliczenia</Label>
                    <Input
                      id="settlement-file"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsSettlementDialogOpen(false)}>
                    Anuluj
                  </Button>
                  <Button 
                    className="btn-gradient" 
                    onClick={handleSettlementSubmit}
                    disabled={!settlementFile}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Wyślij rozliczenie
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );
        
      case 'settlement_rejected':
        return (
          <div className="flex gap-2 justify-end">
            <Dialog open={isSettlementDialogOpen} onOpenChange={setIsSettlementDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-gradient">
                  <FileCheck className="w-4 h-4 mr-2" />
                  Wyślij poprawione rozliczenie
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Poprawione rozliczenie współpracy</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <p className="text-sm text-muted-foreground">
                    Wgraj poprawiony raport z rozliczenia współpracy w formacie PDF.
                  </p>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="settlement-file">Plik rozliczenia</Label>
                    <Input
                      id="settlement-file"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsSettlementDialogOpen(false)}>
                    Anuluj
                  </Button>
                  <Button 
                    className="btn-gradient" 
                    onClick={handleSettlementSubmit}
                    disabled={!settlementFile}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Wyślij rozliczenie
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );
    }
  }
  // Actions for sponsor
  else if (userType === 'sponsor') {
    switch (status) {
      case 'negotiation':
        return (
          <div className="space-y-4">
            {counterOfferMessage !== undefined && (
              <Textarea
                placeholder="Wpisz swoją wiadomość..."
                value={counterOfferMessage}
                onChange={(e) => onCounterOfferChange?.(e.target.value)}
                className="min-h-[100px]"
              />
            )}
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline"
                onClick={() => onStatusChange('canceled')}
                className="text-red-600"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Anuluj współpracę
              </Button>
              <Button 
                variant="outline"
                onClick={onEditOptions}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edytuj opcje
              </Button>
              <Button 
                className="btn-gradient"
                onClick={() => onStatusChange('in_progress')}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Akceptuj warunki
              </Button>
            </div>
          </div>
        );
        
      case 'pending':
        return (
          <div className="flex justify-end">
            <Button 
              variant="outline"
              onClick={() => onStatusChange('canceled')}
              className="text-red-600"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Anuluj propozycję
            </Button>
          </div>
        );
        
      case 'settlement':
        return (
          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline"
              onClick={() => onStatusChange('settlement_rejected')}
              className="text-red-600"
            >
              <FileX className="w-4 h-4 mr-2" />
              Odrzuć rozliczenie
            </Button>
            <Button 
              className="btn-gradient"
              onClick={() => onStatusChange('completed')}
            >
              <FileCheck className="w-4 h-4 mr-2" />
              Akceptuję rozliczenie
            </Button>
          </div>
        );
    }
  }
  
  // For completed/rejected/canceled statuses or other cases
  const statusMessage = 
    status === 'completed' ? 'zakończona' : 
    status === 'rejected' ? 'odrzucona' : 
    status === 'canceled' ? 'anulowana' :
    status === 'settlement' ? 'w trakcie rozliczenia' :
    status === 'in_progress' ? 'w trakcie realizacji' :
    'w innym statusie';
    
  return (
    <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
      <AlertCircle className="w-5 h-5 mr-2 text-gray-500" />
      <span className="text-gray-600">
        Ta współpraca jest obecnie {statusMessage}
      </span>
    </div>
  );
};

export default CollaborationDialogActions;
