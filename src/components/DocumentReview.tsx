
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Edit, MessageSquare, Save } from "lucide-react";
import { Document } from "@/types/document";
import AIAssistant from "@/components/AIAssistant";

interface DocumentReviewProps {
  document: Document;
  onBack: () => void;
  onDocumentUpdate: (document: Document) => void;
}

const DocumentReview = ({ document, onBack, onDocumentUpdate }: DocumentReviewProps) => {
  const [editedData, setEditedData] = useState(document.ocrData);
  const [isEditing, setIsEditing] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [fieldStates, setFieldStates] = useState<Record<string, 'approved' | 'rejected' | 'pending'>>({});

  const handleFieldApprove = (fieldKey: string) => {
    setFieldStates(prev => ({ ...prev, [fieldKey]: 'approved' }));
  };

  const handleFieldReject = (fieldKey: string) => {
    setFieldStates(prev => ({ ...prev, [fieldKey]: 'rejected' }));
    setIsEditing(true);
  };

  const handleApproveAll = () => {
    const updatedDocument = {
      ...document,
      status: 'ready_for_export' as const,
      ocrData: editedData
    };
    onDocumentUpdate(updatedDocument);
  };

  const handleRejectDocument = () => {
    const updatedDocument = {
      ...document,
      status: 'rejected' as const,
      ocrData: editedData
    };
    onDocumentUpdate(updatedDocument);
  };

  const handleSaveChanges = () => {
    const updatedDocument = {
      ...document,
      ocrData: editedData,
      status: 'reviewing' as const
    };
    onDocumentUpdate(updatedDocument);
    setIsEditing(false);
  };

  const handleFieldChange = (fieldKey: string, value: any) => {
    setEditedData(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  };

  const getFieldBadge = (fieldKey: string) => {
    const state = fieldStates[fieldKey];
    if (state === 'approved') return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
    if (state === 'rejected') return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
    return <Badge variant="secondary">Pending</Badge>;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600";
    if (confidence >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const renderField = (fieldKey: string, value: any, label: string, confidence = Math.floor(Math.random() * 40) + 60) => {
    const isLineItems = fieldKey === 'line_items';
    
    return (
      <div key={fieldKey} className="space-y-2 p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label className="font-medium">{label}</Label>
            <span className={`text-xs ${getConfidenceColor(confidence)}`}>
              {confidence}% confidence
            </span>
          </div>
          <div className="flex items-center gap-2">
            {getFieldBadge(fieldKey)}
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleFieldApprove(fieldKey)}
              className="h-8 w-8 p-0"
            >
              <CheckCircle className="h-4 w-4 text-green-600" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleFieldReject(fieldKey)}
              className="h-8 w-8 p-0"
            >
              <XCircle className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>
        
        {isLineItems ? (
          <div className="space-y-2">
            {Array.isArray(value) && value.map((item, index) => (
              <div key={index} className="grid grid-cols-4 gap-2 p-2 bg-accent/50 rounded">
                <Input
                  value={item.description || ''}
                  onChange={(e) => {
                    const newLineItems = [...value];
                    newLineItems[index] = { ...item, description: e.target.value };
                    handleFieldChange(fieldKey, newLineItems);
                  }}
                  placeholder="Description"
                  disabled={!isEditing}
                />
                <Input
                  value={item.quantity || ''}
                  onChange={(e) => {
                    const newLineItems = [...value];
                    newLineItems[index] = { ...item, quantity: e.target.value };
                    handleFieldChange(fieldKey, newLineItems);
                  }}
                  placeholder="Quantity"
                  disabled={!isEditing}
                />
                <Input
                  value={item.unit_price || ''}
                  onChange={(e) => {
                    const newLineItems = [...value];
                    newLineItems[index] = { ...item, unit_price: e.target.value };
                    handleFieldChange(fieldKey, newLineItems);
                  }}
                  placeholder="Unit Price"
                  disabled={!isEditing}
                />
                <Input
                  value={item.total || ''}
                  onChange={(e) => {
                    const newLineItems = [...value];
                    newLineItems[index] = { ...item, total: e.target.value };
                    handleFieldChange(fieldKey, newLineItems);
                  }}
                  placeholder="Total"
                  disabled={!isEditing}
                />
              </div>
            ))}
          </div>
        ) : (
          <Input
            value={value || ''}
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
            disabled={!isEditing}
            className={fieldStates[fieldKey] === 'rejected' ? 'border-red-300' : ''}
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={onBack}>← Back</Button>
              <div>
                <CardTitle>Review Document: {document.name}</CardTitle>
                <Badge variant={document.status === 'approved' ? 'default' : 'secondary'}>
                  {document.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowAI(!showAI)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
              {isEditing && (
                <Button onClick={handleSaveChanges}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancel Edit' : 'Edit Mode'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Document Preview</h3>
              <div className="aspect-[3/4] bg-accent/50 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Document preview placeholder</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Extracted Data</h3>
              {renderField('invoice_number', editedData.invoice_number, 'Invoice Number')}
              {renderField('vendor_name', editedData.vendor_name, 'Vendor Name')}
              {renderField('invoice_date', editedData.invoice_date, 'Invoice Date')}
              {renderField('due_date', editedData.due_date, 'Due Date')}
              {renderField('total_amount', editedData.total_amount, 'Total Amount')}
              {renderField('line_items', editedData.line_items, 'Line Items')}
            </div>
          </div>
          
          <div className="flex justify-center gap-4 mt-6 pt-6 border-t">
            <Button
              onClick={handleApproveAll}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Document
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectDocument}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject Document
            </Button>
          </div>
        </CardContent>
      </Card>

      {showAI && (
        <AIAssistant
          document={document}
          onFieldUpdate={handleFieldChange}
          onClose={() => setShowAI(false)}
        />
      )}
    </div>
  );
};

export default DocumentReview;
