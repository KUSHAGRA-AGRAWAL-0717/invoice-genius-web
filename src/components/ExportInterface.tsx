
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, FileSpreadsheet, Filter } from "lucide-react";
import { Document } from "@/pages/Index";
import { toast } from "sonner";

interface ExportInterfaceProps {
  documents: Document[];
  onBack: () => void;
  onDocumentsUpdate: (documents: Document[]) => void;
}

const ExportInterface = ({ documents, onBack, onDocumentsUpdate }: ExportInterfaceProps) => {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [outputFormat, setOutputFormat] = useState<string>('excel');
  const [exporting, setExporting] = useState(false);

  const readyDocuments = documents.filter(doc => doc.status === 'ready_for_export');
  const filteredDocuments = filterType === 'all' 
    ? readyDocuments 
    : readyDocuments.filter(doc => doc.templateType === filterType);

  const templateTypes = [...new Set(readyDocuments.map(doc => doc.templateType))];

  const handleSelectDocument = (docId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocuments(prev => [...prev, docId]);
    } else {
      setSelectedDocuments(prev => prev.filter(id => id !== docId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDocuments(filteredDocuments.map(doc => doc.id));
    } else {
      setSelectedDocuments([]);
    }
  };

  const handleExport = async () => {
    if (selectedDocuments.length === 0) {
      toast.error("Please select at least one document to export");
      return;
    }

    setExporting(true);

    // Simulate export process
    setTimeout(() => {
      const updatedDocuments = documents.map(doc => 
        selectedDocuments.includes(doc.id) 
          ? { ...doc, status: 'exported' as const }
          : doc
      );

      onDocumentsUpdate(updatedDocuments);
      setSelectedDocuments([]);
      setExporting(false);
      
      toast.success(`Successfully exported ${selectedDocuments.length} document(s) to ${outputFormat.toUpperCase()}`);
    }, 2000);
  };

  const outputFormats = [
    { value: 'excel', label: 'Excel (.xlsx)', icon: '📊' },
    { value: 'csv', label: 'CSV (.csv)', icon: '📄' },
    { value: 'json', label: 'JSON (.json)', icon: '🔧' },
    { value: 'xml', label: 'XML (.xml)', icon: '📝' }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>← Back</Button>
          <div>
            <CardTitle>Export Documents</CardTitle>
            <CardDescription>
              Export approved documents in your preferred format
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {templateTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            <Select value={outputFormat} onValueChange={setOutputFormat}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Output format" />
              </SelectTrigger>
              <SelectContent>
                {outputFormats.map(format => (
                  <SelectItem key={format.value} value={format.value}>
                    <span className="flex items-center gap-2">
                      <span>{format.icon}</span>
                      {format.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Document List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Ready for Export ({filteredDocuments.length} documents)</h3>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedDocuments.length === filteredDocuments.length && filteredDocuments.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-muted-foreground">Select All</span>
            </div>
          </div>

          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12 bg-accent/50 rounded-lg">
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No documents ready for export</h3>
              <p className="text-muted-foreground">
                Process and approve some documents first
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className={`flex items-center gap-4 p-4 border rounded-lg transition-colors ${
                    selectedDocuments.includes(doc.id) ? 'bg-primary/5 border-primary' : 'hover:bg-accent/50'
                  }`}
                >
                  <Checkbox
                    checked={selectedDocuments.includes(doc.id)}
                    onCheckedChange={(checked) => handleSelectDocument(doc.id, checked as boolean)}
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{doc.name}</h4>
                      <Badge variant="secondary">{doc.templateType}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</p>
                      <p>
                        Invoice: {doc.ocrData.invoice_number} | 
                        Vendor: {doc.ocrData.vendor_name} | 
                        Amount: ${doc.ocrData.total_amount}
                      </p>
                    </div>
                  </div>
                  
                  <Badge className="bg-green-100 text-green-800">Ready</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Export Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {selectedDocuments.length} of {filteredDocuments.length} documents selected
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline">
              Preview Output
            </Button>
            <Button 
              onClick={handleExport}
              disabled={selectedDocuments.length === 0 || exporting}
              className="bg-green-600 hover:bg-green-700"
            >
              {exporting ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Selected
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportInterface;
