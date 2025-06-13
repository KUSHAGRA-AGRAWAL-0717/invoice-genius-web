import { useState } from "react";
import DocumentUpload from "@/components/DocumentUpload";
import DocumentReview from "@/components/DocumentReview";
import ExportInterface from "@/components/ExportInterface";
import ExportHistory from "@/components/ExportHistory";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, CheckCircle2, DollarSign, File, FileJson2, ListChecks } from "lucide-react";
import TemplateSelector from "@/components/TemplateSelector";

const Index = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'upload' | 'review' | 'export' | 'history' | 'templates'>('dashboard');
  const [documents, setDocuments] = useState<any[]>([]);
  const [currentDocument, setCurrentDocument] = useState<any | null>(null);
  const [exportHistory, setExportHistory] = useState<any[]>([]);

  const handleManageTemplates = () => {
    setActiveView('templates');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto py-6 px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <div className="space-x-4">
              <Button onClick={() => setActiveView('upload')}><File className="mr-2 h-4 w-4" /> Upload Document</Button>
              <Button onClick={handleManageTemplates}>Manage Templates</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeView === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                  <File className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{documents.length}</div>
                  <p className="text-sm text-gray-500">All uploaded documents</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approved Documents</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{documents.filter(doc => doc.status === 'approved').length}</div>
                  <p className="text-sm text-gray-500">Documents ready for export</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Exports</CardTitle>
                  <FileJson2 className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{exportHistory.length}</div>
                  <p className="text-sm text-gray-500">Number of exports performed</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest document uploads and approvals</CardDescription>
              </CardHeader>
              <CardContent>
                {documents.slice(0, 5).map(doc => (
                  <div key={doc.id} className="py-2 border-b border-gray-200 last:border-none">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {doc.status === 'approved' ? <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> : <File className="mr-2 h-4 w-4 text-gray-500" />}
                        <span>{doc.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{doc.status === 'approved' ? 'Approved' : 'Uploaded'}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        {activeView === 'upload' && (
          <DocumentUpload 
            onBack={() => setActiveView('dashboard')}
            onDocumentProcessed={(doc) => {
              setDocuments(prev => [...prev, doc]);
              setActiveView('review');
              setCurrentDocument(doc);
            }}
          />
        )}

        {activeView === 'review' && currentDocument && (
          <DocumentReview 
            document={currentDocument}
            onBack={() => setActiveView('dashboard')}
            onApprove={(doc) => {
              setDocuments(prev => prev.map(d => d.id === doc.id ? doc : d));
              setActiveView('dashboard');
            }}
          />
        )}

        {activeView === 'export' && (
          <ExportInterface 
            documents={documents.filter(doc => doc.status === 'approved')}
            onBack={() => setActiveView('dashboard')}
            onExport={(exportedDocs, exportData) => {
              setExportHistory(prev => [...prev, {
                date: new Date().toLocaleDateString(),
                documents: exportedDocs.map(doc => doc.name),
                exportData
              }]);
              setDocuments(prev => prev.filter(doc => !exportedDocs.find(eDoc => eDoc.id === doc.id)));
              setActiveView('dashboard');
            }}
          />
        )}

        {activeView === 'history' && (
          <ExportHistory 
            exports={exportHistory}
            onBack={() => setActiveView('dashboard')}
          />
        )}

        {activeView === 'templates' && (
          <TemplateSelector onBack={() => setActiveView('dashboard')} />
        )}
      </main>
    </div>
  );
};

export default Index;
