import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Camera } from "lucide-react";
import { Document } from "@/types/document";

interface DocumentUploadProps {
  onBack: () => void;
  onDocumentUpload: (document: Document) => void;
}

const DocumentUpload = ({ onBack, onDocumentUpload }: DocumentUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock OCR data generator
  const generateMockOCRData = (fileName: string) => {
    const mockData = {
      invoice_number: `INV-${Math.floor(Math.random() * 10000)}`,
      vendor_name: ["ABC Corp", "XYZ Industries", "Global Services Ltd"][Math.floor(Math.random() * 3)],
      invoice_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      total_amount: (Math.random() * 5000 + 100).toFixed(2),
      subtotal: (Math.random() * 4500 + 90).toFixed(2),
      tax_amount: (Math.random() * 500 + 10).toFixed(2),
      line_items: [
        {
          description: "Professional Services",
          quantity: Math.floor(Math.random() * 10) + 1,
          unit_price: (Math.random() * 200 + 50).toFixed(2),
          total: (Math.random() * 1000 + 100).toFixed(2)
        },
        {
          description: "Software License",
          quantity: Math.floor(Math.random() * 5) + 1,
          unit_price: (Math.random() * 500 + 100).toFixed(2),
          total: (Math.random() * 2000 + 200).toFixed(2)
        }
      ]
    };
    return mockData;
  };

  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return;

    setUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const file = files[0];
      const mockOCRData = generateMockOCRData(file.name);
      
      const newDocument: Document = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: file.type,
        uploadDate: new Date().toISOString(),
        status: 'pending',
        ocrData: mockOCRData,
        templateType: 'Invoice'
      };

      onDocumentUpload(newDocument);
      setUploading(false);
    }, 2000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileUpload(files);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>← Back</Button>
          <div>
            <CardTitle>Upload Documents</CardTitle>
            <CardDescription>Upload your invoice files for OCR processing</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {uploading ? (
              <div className="space-y-4">
                <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <h3 className="text-lg font-medium">Processing Document...</h3>
                <p className="text-muted-foreground">Extracting data using OCR technology</p>
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Drag and drop your files here</h3>
                <p className="text-muted-foreground mb-4">
                  Supports PDF, JPG, PNG files up to 10MB
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={handleFileSelect}>
                    <FileText className="h-4 w-4 mr-2" />
                    Browse Files
                  </Button>
                  <Button variant="outline">
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button>
                </div>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="bg-accent/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Supported Document Types</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Purchase Invoices</li>
              <li>• Sales Invoices</li>
              <li>• Utility Bills</li>
              <li>• Receipts</li>
              <li>• Credit Notes</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;
