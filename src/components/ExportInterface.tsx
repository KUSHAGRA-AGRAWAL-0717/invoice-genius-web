
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Download, FileJson } from "lucide-react";
import { Document } from "@/types/document";

interface ExportInterfaceProps {
  documents: Document[];
  onBack: () => void;
  onDocumentsUpdate: (documents: Document[]) => void;
}

const ExportInterface = ({ documents, onBack, onDocumentsUpdate }: ExportInterfaceProps) => {
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');

  const handleSelectAll = () => {
    if (selectedDocs.length === documents.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(documents.map(doc => doc.id));
    }
  };

  const handleDocSelect = (docId: string) => {
    setSelectedDocs(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const handleExport = () => {
    const selectedDocuments = documents.filter(doc => selectedDocs.includes(doc.id));
    
    // Mark selected documents as exported
    const updatedDocuments = documents.map(doc => 
      selectedDocs.includes(doc.id) 
        ? { ...doc, status: 'exported' as const }
        : doc
    );

    // Simulate export
    const exportData = selectedDocuments.map(doc => ({
      invoice_number: doc.ocrData.invoice_number,
      vendor_name: doc.ocrData.vendor_name,
      total_amount: doc.ocrData.total_amount,
      invoice_date: doc.ocrData.invoice_date
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    onDocumentsUpdate(updatedDocuments);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>← Back</Button>
          <div>
            <CardTitle>Export Documents</CardTitle>
            <p className="text-sm text-muted-foreground">Select documents to export</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={handleSelectAll}>
              {selectedDocs.length === documents.length ? 'Deselect All' : 'Select All'}
            </Button>
            <Button 
              onClick={handleExport}
              disabled={selectedDocs.length === 0}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export ({selectedDocs.length})
            </Button>
          </div>

          <div className="space-y-3">
            {documents.map((doc) => (
              <Card key={doc.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedDocs.includes(doc.id)}
                        onCheckedChange={() => handleDocSelect(doc.id)}
                      />
                      <div>
                        <h4 className="font-medium">{doc.name}</h4>
                        <p className="text-sm text-gray-500">
                          {doc.ocrData.vendor_name} - ${doc.ocrData.total_amount}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">Ready</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportInterface;
