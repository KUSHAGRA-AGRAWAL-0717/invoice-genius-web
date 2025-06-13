
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TemplateFormCreatorProps {
  onBack: () => void;
}

const TemplateFormCreator = ({ onBack }: TemplateFormCreatorProps) => {
  const [formData, setFormData] = useState({
    supplier: "",
    party: "",
    billNumber: "",
    registerDate: null as Date | null,
    amount: ""
  });

  const [supplierOpen, setSupplierOpen] = useState(false);
  const [partyOpen, setPartyOpen] = useState(false);

  // Mock data for dropdowns
  const suppliers = [
    { value: "supplier1", label: "ABC Corp" },
    { value: "supplier2", label: "XYZ Ltd" },
    { value: "supplier3", label: "Global Supplies Inc" },
    { value: "supplier4", label: "Metro Trading Co" }
  ];

  const parties = [
    { value: "party1", label: "Client A" },
    { value: "party2", label: "Client B" },
    { value: "party3", label: "Client C" },
    { value: "party4", label: "Internal Department" }
  ];

  const handleReset = () => {
    setFormData({
      supplier: "",
      party: "",
      billNumber: "",
      registerDate: null,
      amount: ""
    });
  };

  const handleSaveDraft = () => {
    console.log("Draft saved:", formData);
    // Add toast notification here
  };

  const handleSubmit = () => {
    console.log("Register entry submitted:", formData);
    // Add validation and submission logic here
  };

  // Keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.altKey) {
      switch (e.key.toLowerCase()) {
        case 'r':
          e.preventDefault();
          handleReset();
          break;
        case 'd':
          e.preventDefault();
          handleSaveDraft();
          break;
        case 's':
          e.preventDefault();
          handleSubmit();
          break;
      }
    }
  };

  return (
    <div onKeyDown={handleKeyDown} tabIndex={-1} className="outline-none">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>← Back</Button>
            <div>
              <CardTitle>Register Entry Template</CardTitle>
              <p className="text-sm text-muted-foreground">Create and customize your register entry form</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Supplier Field */}
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Popover open={supplierOpen} onOpenChange={setSupplierOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={supplierOpen}
                        className="w-full justify-between"
                      >
                        {formData.supplier
                          ? suppliers.find((supplier) => supplier.value === formData.supplier)?.label
                          : "Select supplier..."}
                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search supplier..." />
                        <CommandList>
                          <CommandEmpty>No supplier found.</CommandEmpty>
                          <CommandGroup>
                            {suppliers.map((supplier) => (
                              <CommandItem
                                key={supplier.value}
                                value={supplier.value}
                                onSelect={(currentValue) => {
                                  setFormData({ ...formData, supplier: currentValue });
                                  setSupplierOpen(false);
                                }}
                              >
                                {supplier.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Party Field */}
                <div className="space-y-2">
                  <Label htmlFor="party">Party</Label>
                  <Popover open={partyOpen} onOpenChange={setPartyOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={partyOpen}
                        className="w-full justify-between"
                      >
                        {formData.party
                          ? parties.find((party) => party.value === formData.party)?.label
                          : "Select party..."}
                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search party..." />
                        <CommandList>
                          <CommandEmpty>No party found.</CommandEmpty>
                          <CommandGroup>
                            {parties.map((party) => (
                              <CommandItem
                                key={party.value}
                                value={party.value}
                                onSelect={(currentValue) => {
                                  setFormData({ ...formData, party: currentValue });
                                  setPartyOpen(false);
                                }}
                              >
                                {party.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Bill Number Field */}
                <div className="space-y-2">
                  <Label htmlFor="billNumber">Bill Number</Label>
                  <Input
                    id="billNumber"
                    type="text"
                    placeholder="Enter bill number"
                    value={formData.billNumber}
                    onChange={(e) => setFormData({ ...formData, billNumber: e.target.value })}
                    className="w-full"
                  />
                </div>

                {/* Register Date Field */}
                <div className="space-y-2">
                  <Label htmlFor="registerDate">Register Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.registerDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.registerDate ? format(formData.registerDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.registerDate}
                        onSelect={(date) => setFormData({ ...formData, registerDate: date })}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Amount Field */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full"
                    step="0.01"
                    min="0"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    className="flex-1"
                  >
                    Reset Form <span className="ml-2 text-xs text-muted-foreground">(Alt+R)</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                    className="flex-1"
                  >
                    Save Draft <span className="ml-2 text-xs text-muted-foreground">(Alt+D)</span>
                  </Button>
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Submit Register Entry <span className="ml-2 text-xs text-blue-100">(Alt+S)</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplateFormCreator;
