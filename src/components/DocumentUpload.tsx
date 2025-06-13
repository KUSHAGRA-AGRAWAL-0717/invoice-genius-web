
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, File } from "lucide-react";
import { Document } from "@/types/document";

interface DocumentUploadProps {
  onBack: () => void;
  onDocumentUpload: (document: Document) => void;
}

const DocumentUpload = ({ onBack, onDocumentUpload }: DocumentUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    
    // Simulate upload and OCR processing
    setTimeout(() => {
      const mockDocument: Document = {
        id: Date.now().toString(),
        name: selectedFile.name,
        type: selectedFile.type,
        uploadDate: new Date().toISOString(),
        status: 'reviewing',
        ocrData: {
          invoice_number: 'INV-2024-001',
          vendor_name: 'Sample Vendor Corp',
          invoice_date: '2024-01-15',
          due_date: '2024-02-15',
          total_amount: '1250.00',
          subtotal: '1000.00',
          tax_amount: '250.00',
          line_items: [
            {
              description: 'Professional Services',
              quantity: 1,
              unit_price: '1000.00',
              total: '1000.00'
            }
          ]
        },
        templateType: 'register-basic'
      };

      onDocumentUpload(mockDocument);
      setIsUploading(false);
    }, 2000);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>← Back</Button>
          <div>
            <CardTitle>Upload Document</CardTitle>
            <p className="text-sm text-muted-foreground">Upload an invoice or document for processing</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <Label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Click to upload
                </span>
                <span className="text-sm text-gray-500"> or drag and drop</span>
              </Label>
              <Input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">PDF, PNG, JPG up to 10MB</p>
          </div>

          {selectedFile && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <File className="h-8 w-8 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          )}

          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || isUploading}
            className="w-full"
          >
            {isUploading ? 'Processing...' : 'Upload and Process'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;
