
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Search, FileText, Settings } from "lucide-react";

interface QuickActionsProps {
  onNavigate: (section: string) => void;
}

const QuickActions = ({ onNavigate }: QuickActionsProps) => {
  const actions = [
    {
      title: "Upload New Invoices",
      description: "Add invoices for OCR processing",
      icon: Upload,
      action: "upload",
      variant: "default" as const
    },
    {
      title: "Review Pending",
      description: "Verify extracted data",
      icon: Search,
      action: "processing",
      variant: "outline" as const
    },
    {
      title: "View Processed",
      description: "Access completed invoices",
      icon: FileText,
      action: "processed",
      variant: "outline" as const
    },
    {
      title: "Manage Templates",
      description: "Configure extraction rules",
      icon: Settings,
      action: "templates",
      variant: "outline" as const
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant}
            className="w-full justify-start h-auto p-4"
            onClick={() => onNavigate(action.action)}
          >
            <action.icon className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">{action.title}</div>
              <div className="text-sm text-muted-foreground">{action.description}</div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default QuickActions;
