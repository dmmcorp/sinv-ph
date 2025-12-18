import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, User } from "lucide-react";
import { NewClientTypes } from "./client-selector";
import useClientSelection from "@/stores/client/useClientSelection";

interface AddNewClientDialogTypes {
  newClient: NewClientTypes;
  onSetNewClient: React.Dispatch<React.SetStateAction<NewClientTypes>>;
  onHandleAddClient: () => void;
}
function AddNewClientDialog({
  newClient,

  onSetNewClient,
  onHandleAddClient,
}: AddNewClientDialogTypes) {
  const clientStore = useClientSelection();

  return (
    <Dialog
      open={clientStore.newClientDialogOpen}
      onOpenChange={clientStore.setNewClientDialogOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Client</DialogTitle>
          <DialogDescription>
            Enter the client&apos;s details below to add them to your list.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Client name"
                value={newClient.name}
                onChange={(e) =>
                  onSetNewClient((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="client@example.com"
                value={newClient.email}
                onChange={(e) =>
                  onSetNewClient((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="address"
                placeholder="123 Street, City, State"
                value={newClient.address}
                onChange={(e) =>
                  onSetNewClient((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                className="pl-9"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => clientStore.setNewClientDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={onHandleAddClient}
            disabled={!newClient.name || !newClient.email || !newClient.address}
          >
            Add Client
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewClientDialog;
