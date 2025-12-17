"use client";

import { useState, useMemo } from "react";
import { Search, UserPlus, Check, Mail, MapPin, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useClientSelection from "@/stores/client/useClientSelection";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export interface Client {
  id: string;
  name: string;
  email: string;
  address: string;
}

// Sample clients data
const initialClients: Client[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    address: "123 Main St, New York, NY",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@company.co",
    address: "456 Oak Ave, Los Angeles, CA",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "m.chen@business.com",
    address: "789 Pine Rd, Chicago, IL",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.d@corp.net",
    address: "321 Elm St, Houston, TX",
  },
];
interface ClientSelector {
  onSetStep: (step: number) => void;
}
export function ClientSelector({ onSetStep }: ClientSelector) {
  const clients = useQuery(api.clients.getAllClients);
  const createClient = useMutation(api.clients.createClient);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    address: "",
  });
  const { selectedClient, setSelectedClient } = useClientSelection();

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients;
    const query = searchQuery.toLowerCase();
    return clients?.filter(
      (client) =>
        client.name.toLowerCase().includes(query) ||
        client.email?.toLowerCase().includes(query) ||
        client.address?.toLowerCase().includes(query)
    );
  }, [clients, searchQuery]);

  const showNoResults = searchQuery.trim() && filteredClients?.length === 0;

  const handleAddClient = async () => {
    //convex add client
    if (!newClient.name || !newClient.email || !newClient.address) return;

    const result = await createClient({
      email: newClient.email,
      name: newClient.name,
      address: newClient.address,
    });

    if (result.includes("Successfully created a new client.")) {
      toast.success(result);
    } else {
      toast.error(result);
    }
    setNewClient({ name: "", email: "", address: "" });
    setShowAddDialog(false);
    setSearchQuery("");
  };

  const handleContinue = () => {
    if (selectedClient) {
      setSelectedClient(selectedClient);
      onSetStep(1);
    }
  };

  return (
    <Card className="flex-1 min-h-full flex flex-col w-full max-w-full shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Select a Client</CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose an existing client or add a new one to continue
        </p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4 h-full ">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Client List */}
        <div className="">
          {filteredClients && filteredClients?.length > 0 ? (
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-5 space-y-2 w-full overflow-y-auto ">
              {filteredClients?.map((client) => (
                <button
                  key={client._id}
                  onClick={() => setSelectedClient(client)}
                  className={`max-h-40 w-full text-left p-3 rounded-lg border transition-all flex flex-col ${
                    selectedClient?._id === client._id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 ">
                    <div className="space-y-1 min-w-0">
                      <p className="font-semibold truncate">{client.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {client.email}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {client.address}
                      </p>
                    </div>
                    {selectedClient?._id === client._id && (
                      <div className="shrink-0 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center self-center w-full py-8 px-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <UserPlus className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-1">
                No client found for &qout;{searchQuery}&qout;
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Looks like this client isn&apos;t in your list yet. Would you
                like to add them?
              </p>
              <Button
                onClick={() => {
                  setNewClient((prev) => ({ ...prev, name: searchQuery }));
                  setShowAddDialog(true);
                }}
                size="sm"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add New Client
              </Button>
            </div>
          )}
        </div>
        <div className="mt-auto space-y-2">
          {/* Add New Client Button */}

          {!showNoResults && (
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => setShowAddDialog(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add New Client
            </Button>
          )}

          {/* Continue Button */}
          <Button
            className="w-full "
            disabled={!selectedClient}
            onClick={handleContinue}
          >
            Continue with Selected Client
          </Button>
        </div>
      </CardContent>

      {/* Add New Client Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
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
                    setNewClient((prev) => ({
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
                    setNewClient((prev) => ({
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
                    setNewClient((prev) => ({
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
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddClient}
              disabled={
                !newClient.name || !newClient.email || !newClient.address
              }
            >
              Add Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
