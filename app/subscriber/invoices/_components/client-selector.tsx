"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, UserPlus, Check, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useClientSelection from "@/stores/client/useClientSelection";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import AddNewClientDialog from "./add-new-client-dialog";
import Box from "../new/_components/skeleton/box";
import { motion } from "motion/react";
export interface Client {
  id: string;
  name: string;
  email: string;
  address: string;
}

interface ClientSelector {
  onSetStep: (step: number) => void;
}
export interface NewClientTypes {
  name: string;
  email: string;
  address: string;
  tin: string;
}
export function ClientSelector({ onSetStep }: ClientSelector) {
  const clients = useQuery(api.clients.getAllClients);
  const createClient = useMutation(api.clients.createClient);
  const clientStore = useClientSelection();
  const [searchQuery, setSearchQuery] = useState("");
  const [newClient, setNewClient] = useState<NewClientTypes>({
    name: "",
    email: "",
    address: "",
    tin: "",
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

    if (result.message.includes("Successfully created a new client.")) {
      toast.success(result.message);
      //automatically set the newly created client as selected client
      if (result.data) {
        setSelectedClient(result.data);
      }
    } else {
      toast.error(result.message);
    }
    setNewClient({ name: "", email: "", address: "", tin: "" });
    clientStore.setNewClientDialogOpen(false);
    setSearchQuery("");
  };

  const handleContinue = () => {
    if (selectedClient) {
      setSelectedClient(selectedClient);
      onSetStep(1);
    }
  };

  useEffect(() => {
    const hanleNoClients = () => {
      if (clients?.length === 0) {
        if (clientStore.newClientDialogOpen != true) {
          clientStore.setNewClientDialogOpen(true);
        }
      }
    };
    hanleNoClients();
  }, [clients?.length, clientStore]);

  return (
    <Card className="flex-1 min-h-full flex flex-col w-full max-w-full shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex justify-start lg:justify-between items-center">
          <CardTitle className="">
            <h1 className="text-2xl">Select a Client</h1>
          </CardTitle>
          {/* Add New Client Dialog */}

          <Button
            variant="outline"
            className=" hidden lg:flex font-black  text-sm  h-11 lg bg-accent text-white"
            onClick={() => clientStore.setNewClientDialogOpen(true)}
          >
            <UserPlus className="size-7 lg:text-8" />
            Add New Client
          </Button>
        </div>
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
          {filteredClients ? (
            filteredClients?.length > 0 ? (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-5 space-y-2 w-full overflow-y-auto "
              >
                {filteredClients?.map((client) => (
                  <div key={client._id} className="">
                    <button
                      onClick={() => setSelectedClient(client)}
                      className={`h- w-full text-left p-3 rounded-lg border transition-all flex flex-col ${
                        selectedClient?._id === client._id
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 ">
                        <div className="space-y-1 min-w-0">
                          <p className="font-semibold truncate capitalize">
                            {client.name}
                          </p>
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
                  </div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center self-center w-full py-8 px-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <UserPlus className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">
                  No client found for &quot;
                  <span className="font-semibold">{searchQuery}</span> &quot;
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Looks like this client isn&apos;t in your list yet. Would you
                  like to add them?
                </p>
                <Button
                  onClick={() => {
                    setNewClient((prev) => ({ ...prev, name: searchQuery }));
                    clientStore.setNewClientDialogOpen(true);
                  }}
                  size="sm"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New Client
                </Button>
              </div>
            )
          ) : (
            [1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-5 space-y-2 w-full overflow-y-auto "
              >
                <div className="col-span-1 h-6">
                  <Box />
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-auto space-y-2">
          {/* Add New Client Button */}

          {/* Add New Client Dialog */}
          {!showNoResults && (
            <Button
              variant="ghost"
              className="flex w-full lg:hidden font-semibold text-sm lg:text-2xl h-11"
              onClick={() => clientStore.setNewClientDialogOpen(true)}
            >
              <UserPlus className="size-7 lg:text-8" />
              Add New Client
            </Button>
          )}

          {/* Continue Button */}
          <Button
            className=" w-full font-semibold text-xs sm:text-sm lg:text-2xl h-11"
            disabled={!selectedClient}
            onClick={handleContinue}
          >
            Continue with Selected Client{" "}
            <ChevronRight size={40} className="hidden sm:blick size-11" />
          </Button>
        </div>
      </CardContent>
      <AddNewClientDialog
        newClient={newClient}
        onSetNewClient={setNewClient}
        onHandleAddClient={handleAddClient}
      />
    </Card>
  );
}
