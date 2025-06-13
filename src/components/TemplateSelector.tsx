
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Plus } from "lucide-react";
import TemplateFormCreator from "./TemplateFormCreator";

interface TemplateSelectorProps {
  onBack: () => void;
}

const TemplateSelector = ({ onBack }: TemplateSelectorProps) => {
  const [selectedView, setSelectedView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const templates = [
    {
      id: 'register-basic',
      name: 'Register Entry - Basic',
      description: 'Basic register entry with Supplier, Party, Bill Number, Date, and Amount',
      fields: ['supplier', 'party', 'billNumber', 'registerDate', 'amount']
    },
    {
      id: 'register-gst',
      name: 'Register Entry - With GST',
      description: 'Register entry with additional GST Percentage field',
      fields: ['supplier', 'party', 'billNumber', 'registerDate', 'amount', 'gstPercentage']
    }
  ];

  const handleCreateNew = () => {
    setSelectedTemplate('register-basic');
    setSelectedView('create');
  };

  const handleEditTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    setSelectedView('edit');
  };

  const handleBackToList = () => {
    setSelectedView('list');
    setSelectedTemplate('');
  };

  if (selectedView === 'create' || selectedView === 'edit') {
    return (
      <TemplateFormCreator 
        onBack={handleBackToList}
        templateType={selectedTemplate}
        isEditing={selectedView === 'edit'}
      />
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>← Back</Button>
          <div>
            <CardTitle>Template Management</CardTitle>
            <p className="text-sm text-muted-foreground">Create and manage your form templates</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Create New Template */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Available Templates</h3>
            <Button onClick={handleCreateNew} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Template
            </Button>
          </div>

          {/* Template List */}
          <div className="grid gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{template.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-2">Fields included:</p>
                        <div className="flex flex-wrap gap-1">
                          {template.fields.map((field) => (
                            <span 
                              key={field} 
                              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
                            >
                              {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditTemplate(template.id)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => {
                          setSelectedTemplate(template.id);
                          setSelectedView('create');
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Use Template
                      </Button>
                    </div>
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

export default TemplateSelector;
