
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  CheckCircle, 
  Edit, 
  XCircle, 
  MessageSquare, 
  FileCheck,
  FileX,
  Upload
} from 'lucide-react';
import { getAvailableActions } from '@/services/collaborations/utils';
import { CollaborationStatus } from '@/services/collaborations/types';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface CollaborationActionsProps {
  collaboration: any;
  userType: 'organization' | 'sponsor';
  onStatusChange: (newStatus: CollaborationStatus, settlementFile?: File) => void;
  onEditOptions?: () => void;
}

const CollaborationActions = ({ 
  collaboration, 
  userType,
  onStatusChange,
  onEditOptions
}: CollaborationActionsProps) => {
  const [isSettlementDialogOpen, setIsSettlementDialogOpen] = useState(false);
  const [settlementFile, setSettlementFile] = useState<File | null>(null);

  if (!collaboration) return null;
  
  const availableActions = getAvailableActions(collaboration.status, userType);

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
  
  return (
    <Card className="p-4">
      <h3 className="text-xl font-semibold mb-4">Akcje</h3>
      
      <div className="space-y-3">
        {availableActions.includes('edit') && (
          <Button 
            className="w-full" 
            variant="outline"
            onClick={onEditOptions}
          >
            <Edit size={16} className="mr-2" /> Edytuj opcje
          </Button>
        )}
        
        {availableActions.includes('accept') && (
          <Button 
            className="w-full btn-gradient"
            onClick={() => onStatusChange('accepted')}
          >
            <CheckCircle size={16} className="mr-2" /> Zaakceptuj
          </Button>
        )}
        
        {availableActions.includes('reject') && (
          <Button 
            className="w-full" 
            variant="destructive"
            onClick={() => onStatusChange('rejected')}
          >
            <XCircle size={16} className="mr-2" /> Odrzuć
          </Button>
        )}
        
        {availableActions.includes('negotiate') && (
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => onStatusChange('negotiation')}
          >
            <MessageSquare size={16} className="mr-2" /> Negocjuj
          </Button>
        )}
        
        {availableActions.includes('accept_terms') && (
          <Button 
            className="w-full btn-gradient"
            onClick={() => onStatusChange('in_progress')}
          >
            <CheckCircle size={16} className="mr-2" /> Akceptuj warunki
          </Button>
        )}
        
        {availableActions.includes('settle') && (
          <>
            <Button 
              className="w-full"
              variant="default"
              onClick={() => setIsSettlementDialogOpen(true)}
            >
              <FileCheck size={16} className="mr-2" /> Rozlicz współpracę
            </Button>
            
            <Dialog open={isSettlementDialogOpen} onOpenChange={setIsSettlementDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rozliczenie współpracy</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <p className="text-sm text-muted-foreground">
                    Wgraj raport z rozliczenia współpracy w formacie PDF.
                  </p>
                  <div className="grid w-full items-center gap-1.5">
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
                    <Upload size={16} className="mr-2" />
                    Wyślij rozliczenie
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
        
        {availableActions.includes('accept_settlement') && (
          <Button 
            className="w-full btn-gradient"
            onClick={() => onStatusChange('completed')}
          >
            <FileCheck size={16} className="mr-2" /> Akceptuję rozliczenie
          </Button>
        )}
        
        {availableActions.includes('reject_settlement') && (
          <Button 
            className="w-full" 
            variant="destructive"
            onClick={() => onStatusChange('settlement_rejected')}
          >
            <FileX size={16} className="mr-2" /> Odrzuć rozliczenie
          </Button>
        )}
        
        {availableActions.includes('cancel') && (
          <Button 
            className="w-full" 
            variant="destructive"
            onClick={() => onStatusChange('canceled')}
          >
            Anuluj
          </Button>
        )}
      </div>
    </Card>
  );
};

export default CollaborationActions;
