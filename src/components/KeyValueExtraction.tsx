
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Save, FileText, Trash2, Eye, Database, Check, X, FileSpreadsheet } from 'lucide-react';
import { Document } from "@/types/document";
import ProgressIndicator from "./ProgressIndicator";
import { useToast } from "@/hooks/use-toast";

interface KeyValueExtractionProps {
  document: Document;
  onBack: () => void;
  onDataSaved: (document: Document) => void;
}

interface ExtraField {
  id: string;
  key: string;
  value: string;
  type: 'text' | 'number' | 'date' | 'email' | 'url';
  approved: boolean;
}

interface FieldApproval {
  [key: string]: boolean;
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
  const [extraFields, setExtraFields] = useState<ExtraField[]>([]);
  const [fieldApprovals, setFieldApprovals] = useState<FieldApproval>({});
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'number' | 'date' | 'email' | 'url'>('text');

  const saveCustomTemplate = (templateFields: string[]) => {
    try {
      const existingTemplates = JSON.parse(localStorage.getItem('customTemplates') || '[]');
      const newTemplate = {
        id: `custom-${Date.now()}`,
        name: `Custom Template - ${document.name}`,
        description: `Custom template with ${templateFields.length} fields created from ${document.name}`,
        fields: templateFields,
        isCustom: true,
        templateData: { ...extractedData }
      };
      
      const updatedTemplates = [...existingTemplates, newTemplate];
      localStorage.setItem('customTemplates', JSON.stringify(updatedTemplates));
      
      return newTemplate;
    } catch (error) {
      console.error('Error saving custom template:', error);
      return null;
    }
  };

  const handleExtractedDataChange = (key: string, value: string) => {
    setExtractedData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFieldApproval = (fieldKey: string, approved: boolean) => {
    setFieldApprovals(prev => ({
      ...prev,
      [fieldKey]: approved
    }));
  };

  const handleAddExtraField = () => {
    if (newKey.trim() && newValue.trim()) {
      setExtraFields(prev => [...prev, {
        id: Date.now().toString(),
        key: newKey.trim(),
        value: newValue.trim(),
        type: newFieldType,
        approved: false
      }]);
      setNewKey('');
      setNewValue('');
      setNewFieldType('text');
    }
  };

  const handleRemoveExtraField = (id: string) => {
    setExtraFields(prev => prev.filter(field => field.id !== id));
  };

  const handleUpdateExtraField = (id: string, key: string, value: string, type: string) => {
    setExtraFields(prev => prev.map(field => 
      field.id === id ? { ...field, key, value, type: type as any } : field
    ));
  };

  const handleExtraFieldApproval = (id: string, approved: boolean) => {
    setExtraFields(prev => prev.map(field => 
      field.id === id ? { ...field, approved } : field
    ));
  };

  const handleSaveData = () => {
    // Only include approved fields
    const approvedData = { ...extractedData };
    const approvedExtraFields: any = {};
    
    // Filter template fields by approval
    getTemplateFields().forEach(field => {
      if (fieldApprovals[field] !== false) { // Default to approved if not explicitly rejected
        // Field is approved or not reviewed (default approved)
      } else {
        delete approvedData[field];
      }
    });

    // Add approved extra fields
    extraFields.forEach(field => {
      if (field.approved) {
        approvedExtraFields[field.key] = field.value;
      }
    });

    const combinedData = { ...approvedData, ...approvedExtraFields };

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

  const handleSaveAsTemplate = () => {
    const templateFields = getTemplateFields();
    const extraFieldKeys = extraFields.filter(field => field.approved).map(field => field.key);
    const allFields = [...templateFields, ...extraFieldKeys];
    
    const savedTemplate = saveCustomTemplate(allFields);
    if (savedTemplate) {
      toast({
        title: "Template Saved!",
        description: `Custom template "${savedTemplate.name}" has been saved and can be reused.`,
      });
    }

    // Also save the data
    handleSaveData();
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

  const getAllOcrFields = () => {
    const templateFields = getTemplateFields();
    const allFields = Object.keys(extractedData);
    return allFields.filter(field => !templateFields.includes(field) && field !== 'line_items');
  };

  const formatFieldName = (field: string) => {
    return field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1');
  };

  const getFieldTypeIcon = (type: string) => {
    switch (type) {
      case 'number': return '123';
      case 'date': return '📅';
      case 'email': return '📧';
      case 'url': return '🔗';
      default: return 'Aa';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <ProgressIndicator currentStep={3} />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        {/* Document Preview & OCR Data Panel */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            {/* Full Document Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Document Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Document Image/Preview Area */}
                  <div className="aspect-[3/4] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-center p-4">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-600">{document.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {document.type.toUpperCase()} Document
                      </p>
                      <p className="text-xs text-gray-500">
                        Uploaded: {document.uploadDate}
                      </p>
                    </div>
                  </div>
                  
                  {/* Document Info */}
                  <div className="space-y-2">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-600 font-medium">Template</p>
                      <p className="text-sm text-blue-800">{document.templateType}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-green-600 font-medium">Status</p>
                      <p className="text-sm text-green-800">Ready for extraction</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* All OCR Data */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  All OCR Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {Object.entries(extractedData).map(([key, value]) => (
                      <div key={key} className="p-2 bg-gray-50 rounded">
                        <div className="text-xs font-medium text-gray-600 mb-1">
                          {formatFieldName(key)}
                        </div>
                        <div className="text-sm text-gray-800 break-words">
                          {Array.isArray(value) ? (
                            <div className="space-y-1">
                              {value.length > 0 ? (
                                value.map((item, index) => (
                                  <Badge key={index} variant="outline" className="text-xs mr-1">
                                    {typeof item === 'object' ? JSON.stringify(item) : String(item)}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-gray-400 italic">No items</span>
                              )}
                            </div>
                          ) : (
                            value || <span className="text-gray-400 italic">Not extracted</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Key-Value Extraction Panel */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={onBack}>← Back</Button>
                <div>
                  <CardTitle>Extract & Edit Data</CardTitle>
                  <p className="text-sm text-muted-foreground">Review, approve/reject fields and add custom data</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Template Fields Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Template Fields ({document.templateType})
                  </h3>
                  <div className="space-y-4">
                    {getTemplateFields().map((field) => (
                      <div key={field} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="flex-1 space-y-2">
                          <Label htmlFor={field}>{formatFieldName(field)}</Label>
                          <Input
                            id={field}
                            value={extractedData[field] || ''}
                            onChange={(e) => handleExtractedDataChange(field, e.target.value)}
                            placeholder={`Enter ${formatFieldName(field).toLowerCase()}`}
                            className="w-full"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={fieldApprovals[field] === true ? "default" : "outline"}
                            onClick={() => handleFieldApproval(field, true)}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={fieldApprovals[field] === false ? "default" : "outline"}
                            onClick={() => handleFieldApproval(field, false)}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Other OCR Fields Section */}
                {getAllOcrFields().length > 0 && (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Additional OCR Data
                      </h3>
                      <div className="space-y-4">
                        {getAllOcrFields().map((field) => (
                          <div key={field} className="flex items-center gap-4 p-4 border rounded-lg">
                            <div className="flex-1 space-y-2">
                              <Label htmlFor={field}>{formatFieldName(field)}</Label>
                              <Input
                                id={field}
                                value={extractedData[field] || ''}
                                onChange={(e) => handleExtractedDataChange(field, e.target.value)}
                                placeholder={`Enter ${formatFieldName(field).toLowerCase()}`}
                                className="w-full"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant={fieldApprovals[field] === true ? "default" : "outline"}
                                onClick={() => handleFieldApproval(field, true)}
                                className="text-green-600 border-green-600 hover:bg-green-50"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant={fieldApprovals[field] === false ? "default" : "outline"}
                                onClick={() => handleFieldApproval(field, false)}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Custom Fields Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Custom Fields
                  </h3>
                  
                  {/* Add New Field */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
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
                      <Label htmlFor="newFieldType">Field Type</Label>
                      <Select value={newFieldType} onValueChange={(value: any) => setNewFieldType(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="url">URL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newValue">Field Value</Label>
                      <Input
                        id="newValue"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        placeholder="Enter field value"
                        type={newFieldType === 'number' ? 'number' : newFieldType === 'date' ? 'date' : newFieldType === 'email' ? 'email' : newFieldType === 'url' ? 'url' : 'text'}
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
                        <div key={field.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>Field Name</Label>
                              <Input
                                value={field.key}
                                onChange={(e) => handleUpdateExtraField(field.id, e.target.value, field.value, field.type)}
                                placeholder="Field name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Field Type</Label>
                              <Select 
                                value={field.type} 
                                onValueChange={(value) => handleUpdateExtraField(field.id, field.key, field.value, value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="text">Text</SelectItem>
                                  <SelectItem value="number">Number</SelectItem>
                                  <SelectItem value="date">Date</SelectItem>
                                  <SelectItem value="email">Email</SelectItem>
                                  <SelectItem value="url">URL</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Field Value</Label>
                              <Input
                                value={field.value}
                                onChange={(e) => handleUpdateExtraField(field.id, field.key, e.target.value, field.type)}
                                placeholder="Field value"
                                type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={field.approved ? "default" : "outline"}
                              onClick={() => handleExtraFieldApproval(field.id, true)}
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={!field.approved ? "default" : "outline"}
                              onClick={() => handleExtraFieldApproval(field.id, false)}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveExtraField(field.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Save Buttons */}
                <div className="border-t pt-6">
                  <div className="flex gap-4">
                    <Button onClick={handleSaveData} className="flex-1 bg-blue-600 hover:bg-blue-700 text-lg py-3">
                      <Save className="mr-2 h-5 w-5" />
                      Save Data
                    </Button>
                    <Button onClick={handleSaveAsTemplate} variant="outline" className="flex-1 text-lg py-3">
                      <FileSpreadsheet className="mr-2 h-5 w-5" />
                      Save as New Template
                    </Button>
                  </div>
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

