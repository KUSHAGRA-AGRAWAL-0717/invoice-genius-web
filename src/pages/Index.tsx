import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Search, Settings, User, Download } from "lucide-react";
import DashboardStats from "@/components/DashboardStats";
import RecentActivity from "@/components/RecentActivity";
import QuickActions from "@/components/QuickActions";
import DocumentUpload from "@/components/DocumentUpload";
import DocumentReview from "@/components/DocumentReview";
import ExportInterface from "@/components/ExportInterface";
import ExportHistory from "@/components/ExportHistory";

export interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'ready_for_export' | 'exported';
  ocrData: Record<string, any>;
  templateType: string;
}

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const handleDocumentUpload = (newDoc: Document) => {
    setDocuments(prev => [...prev, newDoc]);
    setSelectedDocument(newDoc);
    setActiveSection("review");
  };

  const handleDocumentUpdate = (updatedDoc: Document) => {
    setDocuments(prev => 
      prev.map(doc => doc.id === updatedDoc.id ? updatedDoc : doc)
    );
    setSelectedDocument(updatedDoc);
  };

  const handleBackToDashboard = () => {
    setActiveSection("dashboard");
    setSelectedDocument(null);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "upload":
        return (
          <DocumentUpload 
            onBack={handleBackToDashboard}
            onDocumentUpload={handleDocumentUpload}
          />
        );
      case "review":
        return selectedDocument ? (
          <DocumentReview 
            document={selectedDocument}
            onBack={handleBackToDashboard}
            onDocumentUpdate={handleDocumentUpdate}
          />
        ) : (
          <div>No document selected</div>
        );
      case "export":
        return (
          <ExportInterface 
            documents={documents}
            onBack={handleBackToDashboard}
            onDocumentsUpdate={setDocuments}
          />
        );
      case "history":
        return (
          <ExportHistory 
            onBack={handleBackToDashboard}
          />
        );
      case "processing":
        return <ProcessingQueue documents={documents} onBack={handleBackToDashboard} onSelectDocument={(doc) => {
          setSelectedDocument(doc);
          setActiveSection("review");
        }} />;
      case "templates":
        return <TemplateManagement onBack={handleBackToDashboard} />;
      default:
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Invoice OCR Dashboard</h1>
                <p className="text-muted-foreground">Process and extract data from your invoices with AI-powered accuracy</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </div>
            </div>

            <DashboardStats />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <QuickActions onNavigate={setActiveSection} />
              <RecentActivity />
            </div>
          </div>
        );
    }
  };

  if (activeSection !== "dashboard") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {renderContent()}
      </div>
    </div>
  );
};

// Processing Queue Component
const ProcessingQueue = ({ documents, onBack, onSelectDocument }: { 
  documents: Document[], 
  onBack: () => void,
  onSelectDocument: (doc: Document) => void 
}) => {
  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      reviewing: "bg-blue-100 text-blue-800", 
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      ready_for_export: "bg-purple-100 text-purple-800",
      exported: "bg-gray-100 text-gray-800"
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors]}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>← Back</Button>
          <div>
            <CardTitle>Processing Queue</CardTitle>
            <CardDescription>Monitor and manage your document processing</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No documents in queue</h3>
            <p className="text-muted-foreground">Upload some documents to start processing</p>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium">{doc.name}</h4>
                  <p className="text-sm text-muted-foreground">Uploaded: {doc.uploadDate}</p>
                  <p className="text-sm text-muted-foreground">Type: {doc.templateType}</p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(doc.status)}
                  <Button variant="outline" size="sm" onClick={() => onSelectDocument(doc)}>
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Template Management Component
const TemplateManagement = ({ onBack }: { onBack: () => void }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>← Back</Button>
          <div>
            <CardTitle>Template Management</CardTitle>
            <CardDescription>Create and manage your document templates</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No templates created</h3>
          <p className="text-muted-foreground mb-4">Create your first template to get started</p>
          <Button>Create New Template</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Index;
