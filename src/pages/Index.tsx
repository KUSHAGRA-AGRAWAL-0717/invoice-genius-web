
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Search, Settings, User } from "lucide-react";
import DashboardStats from "@/components/DashboardStats";
import RecentActivity from "@/components/RecentActivity";
import QuickActions from "@/components/QuickActions";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "upload":
        return <InvoiceUpload onBack={() => setActiveSection("dashboard")} />;
      case "processing":
        return <ProcessingQueue onBack={() => setActiveSection("dashboard")} />;
      case "templates":
        return <TemplateManagement onBack={() => setActiveSection("dashboard")} />;
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

// Import components that will be created
const InvoiceUpload = ({ onBack }: { onBack: () => void }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>← Back</Button>
          <div>
            <CardTitle>Upload Invoices</CardTitle>
            <CardDescription>Upload your invoice files for OCR processing</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Drag and drop your files here</h3>
          <p className="text-muted-foreground mb-4">or click to browse files</p>
          <Button>Browse Files</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ProcessingQueue = ({ onBack }: { onBack: () => void }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>← Back</Button>
          <div>
            <CardTitle>Processing Queue</CardTitle>
            <CardDescription>Monitor the status of your invoice processing</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No invoices in queue</h3>
          <p className="text-muted-foreground">Upload some invoices to start processing</p>
        </div>
      </CardContent>
    </Card>
  );
};

const TemplateManagement = ({ onBack }: { onBack: () => void }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>← Back</Button>
          <div>
            <CardTitle>Template Management</CardTitle>
            <CardDescription>Create and manage your invoice templates</CardDescription>
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
