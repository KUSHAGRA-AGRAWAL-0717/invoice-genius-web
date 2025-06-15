import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Save, FileText, Trash2 } from "lucide-react";
import { Document } from "@/types/document";
import ProgressIndicator from "./ProgressIndicator";
import { useToast } from "@/hooks/use-toast";

interface KeyValueExtractionProps {
  document: Document;
  onBack: () => void;
  onDataSaved: (document: Document) => void;
}

const KeyValueExtraction = ({ document, onBack, onDataSaved }: KeyValueExtractionProps) => {
  const { toast } = useToast();
  
  // Provide proper default structure for ocrData
  const defaultOcrData = {
    invoice_number: '',
    vendor_name: '',
    invoice_date: '',
    due_date: '',
    total_amount: '',
    subtotal: '',
    tax_amount: '',
    line_items: []
  };

  const [extractedData, setExtractedData] = useState(document.ocrData || defaultOcrData);
  const [extraFields, setExtraFields] = useState<Array<{id: string, key: string, value: string}>>([]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleExtractedDataChange = (key: string, value: string) => {
    setExtractedData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAddExtraField = () => {
    if (newKey.trim() && newValue.trim()) {
      setExtraFields(prev => [...prev, {
        id: Date.now().toString(),
        key: newKey.trim(),
        value: newValue.trim()
      }]);
      setNewKey('');
      setNewValue('');
    }
  };

  const handleRemoveExtraField = (id: string) => {
    setExtraFields(prev => prev.filter(field => field.id !== id));
  };

  const handleUpdateExtraField = (id: string, key: string, value: string) => {
    setExtraFields(prev => prev.map(field => 
      field.id === id ? { ...field, key, value } : field
    ));
  };

  const handleSave = () => {
    // Combine extracted data with extra fields
    const combinedData = { ...extractedData };
    extraFields.forEach(field => {
      combinedData[field.key] = field.value;
    });

    const updatedDocument: Document = {
      ...document,
      ocrData: combinedData,
      status: 'ready_for_export'
    };

    onDataSaved(updatedDocument);
    
    toast({
      title: "Success!",
      description: "Document data has been saved successfully.",
    });
  };

  const getTemplateFields = () => {
    switch (document.templateType) {
      case 'register-basic':
        return ['supplier', 'party', 'billNumber', 'registerDate', 'amount'];
      case 'register-gst':
        return ['supplier', 'party', 'billNumber', 'registerDate', 'amount', 'gstPercentage'];
      case 'invoice-standard':
        return ['invoiceNumber', 'vendorName', 'invoiceDate', 'dueDate', 'totalAmount', 'subtotal', 'taxAmount'];
      default:
        return Object.keys(extractedData);
    }
  };

  const formatFieldName = (field: string) => {
    return field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <ProgressIndicator currentStep={3} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Document Preview Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Document Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="h-8 w-8 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{document.name}</p>
                  <p className="text-xs text-gray-500">Template: {document.templateType}</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-green-600 font-medium">Extracted Data</p>
                <p className="text-sm text-gray-600 mt-1">Review and edit the extracted information</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key-Value Extraction Panel */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={onBack}>← Back</Button>
                <div>
                  <CardTitle>Extract & Edit Data</CardTitle>
                  <p className="text-sm text-muted-foreground">Review extracted data and add custom fields</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Extracted Data Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Extracted Data</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getTemplateFields().map((field) => (
                      <div key={field} className="space-y-2">
                        <Label htmlFor={field}>{formatFieldName(field)}</Label>
                        <Input
                          id={field}
                          value={extractedData[field] || ''}
                          onChange={(e) => handleExtractedDataChange(field, e.target.value)}
                          placeholder={`Enter ${formatFieldName(field).toLowerCase()}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Extra Fields Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Additional Fields</h3>
                  
                  {/* Add New Field */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="newKey">Field Name</Label>
                      <Input
                        id="newKey"
                        value={newKey}
                        onChange={(e) => setNewKey(e.target.value)}
                        placeholder="Enter field name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newValue">Field Value</Label>
                      <Input
                        id="newValue"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        placeholder="Enter field value"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>&nbsp;</Label>
                      <Button 
                        onClick={handleAddExtraField}
                        disabled={!newKey.trim() || !newValue.trim()}
                        className="w-full"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Field
                      </Button>
                    </div>
                  </div>

                  {/* Display Extra Fields */}
                  {extraFields.length > 0 && (
                    <div className="space-y-3">
                      {extraFields.map((field) => (
                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg">
                          <Input
                            value={field.key}
                            onChange={(e) => handleUpdateExtraField(field.id, e.target.value, field.value)}
                            placeholder="Field name"
                          />
                          <Input
                            value={field.value}
                            onChange={(e) => handleUpdateExtraField(field.id, field.key, e.target.value)}
                            placeholder="Field value"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveExtraField(field.id)}
                            className="w-full"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Save Button */}
                <div className="border-t pt-6">
                  <Button onClick={handleSave} className="w-full bg-green-600 hover:bg-green-700">
                    <Save className="mr-2 h-4 w-4" />
                    Save Template Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default KeyValueExtraction;
