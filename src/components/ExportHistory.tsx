
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { History, Download, Eye, Calendar, FileText } from "lucide-react";

interface ExportHistoryProps {
  onBack: () => void;
}

interface ExportRecord {
  id: string;
  exportDate: string;
  format: string;
  documentCount: number;
  documents: {
    id: string;
    name: string;
    templateType: string;
    invoiceNumber: string;
    vendorName: string;
    amount: string;
  }[];
  status: 'completed' | 'failed';
}

const ExportHistory = ({ onBack }: ExportHistoryProps) => {
  const [selectedExport, setSelectedExport] = useState<ExportRecord | null>(null);
  const [filterFormat, setFilterFormat] = useState<string>('all');

  // Mock export history data
  const exportHistory: ExportRecord[] = [
    {
      id: "exp-001",
      exportDate: "2024-06-12T10:30:00Z",
      format: "excel",
      documentCount: 5,
      status: "completed",
      documents: [
        {
          id: "doc-001",
          name: "Invoice_ABC_2024.pdf",
          templateType: "Invoice",
          invoiceNumber: "INV-1001",
          vendorName: "ABC Corp",
          amount: "1,250.00"
        },
        {
          id: "doc-002",
          name: "Utility_Bill_March.pdf",
          templateType: "Utility Bill",
          invoiceNumber: "UB-3456",
          vendorName: "Power Company",
          amount: "340.50"
        },
        {
          id: "doc-003",
          name: "Service_Invoice_2024.pdf",
          templateType: "Invoice",
          invoiceNumber: "INV-2001",
          vendorName: "Service Provider",
          amount: "890.75"
        },
        {
          id: "doc-004",
          name: "Office_Supplies.pdf",
          templateType: "Purchase Order",
          invoiceNumber: "PO-5678",
          vendorName: "Office Depot",
          amount: "123.99"
        },
        {
          id: "doc-005",
          name: "Consulting_Fee.pdf",
          templateType: "Invoice",
          invoiceNumber: "INV-3001",
          vendorName: "Consulting Group",
          amount: "2,500.00"
        }
      ]
    },
    {
      id: "exp-002",
      exportDate: "2024-06-11T14:15:00Z",
      format: "csv",
      documentCount: 3,
      status: "completed",
      documents: [
        {
          id: "doc-006",
          name: "Monthly_Rent.pdf",
          templateType: "Invoice",
          invoiceNumber: "RENT-0624",
          vendorName: "Property Management",
          amount: "3,200.00"
        },
        {
          id: "doc-007",
          name: "Insurance_Premium.pdf",
          templateType: "Bill",
          invoiceNumber: "INS-7890",
          vendorName: "Insurance Co",
          amount: "456.78"
        },
        {
          id: "doc-008",
          name: "Software_License.pdf",
          templateType: "Invoice",
          invoiceNumber: "SW-1234",
          vendorName: "Tech Solutions",
          amount: "1,800.00"
        }
      ]
    },
    {
      id: "exp-003",
      exportDate: "2024-06-10T09:45:00Z",
      format: "json",
      documentCount: 2,
      status: "completed",
      documents: [
        {
          id: "doc-009",
          name: "Travel_Expense.pdf",
          templateType: "Expense Report",
          invoiceNumber: "EXP-9876",
          vendorName: "Travel Agency",
          amount: "675.25"
        },
        {
          id: "doc-010",
          name: "Equipment_Purchase.pdf",
          templateType: "Purchase Order",
          invoiceNumber: "PO-5432",
          vendorName: "Equipment Supplier",
          amount: "4,300.00"
        }
      ]
    }
  ];

  const filteredHistory = filterFormat === 'all' 
    ? exportHistory 
    : exportHistory.filter(exp => exp.format === filterFormat);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getFormatBadge = (format: string) => {
    const formatColors = {
      excel: "bg-green-100 text-green-800",
      csv: "bg-blue-100 text-blue-800",
      json: "bg-purple-100 text-purple-800",
      xml: "bg-orange-100 text-orange-800"
    };
    
    return (
      <Badge className={formatColors[format as keyof typeof formatColors] || "bg-gray-100 text-gray-800"}>
        {format.toUpperCase()}
      </Badge>
    );
  };

  const calculateTotalAmount = (documents: ExportRecord['documents']) => {
    return documents.reduce((total, doc) => {
      return total + parseFloat(doc.amount.replace(/,/g, ''));
    }, 0).toLocaleString('en-US', { minimumFractionDigits: 2 });
  };

  if (selectedExport) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setSelectedExport(null)}>← Back to History</Button>
            <div>
              <CardTitle>Export Details</CardTitle>
              <CardDescription>
                Export #{selectedExport.id} - {formatDate(selectedExport.exportDate)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-accent/50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Format</div>
              <div className="font-semibold">{getFormatBadge(selectedExport.format)}</div>
            </div>
            <div className="bg-accent/50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Documents</div>
              <div className="font-semibold">{selectedExport.documentCount}</div>
            </div>
            <div className="bg-accent/50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Total Amount</div>
              <div className="font-semibold">${calculateTotalAmount(selectedExport.documents)}</div>
            </div>
            <div className="bg-accent/50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Status</div>
              <div className="font-semibold">
                <Badge className="bg-green-100 text-green-800">
                  {selectedExport.status}
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Exported Documents</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedExport.documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{doc.templateType}</Badge>
                    </TableCell>
                    <TableCell>{doc.invoiceNumber}</TableCell>
                    <TableCell>{doc.vendorName}</TableCell>
                    <TableCell className="text-right">${doc.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Re-download Export
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>← Back</Button>
          <div>
            <CardTitle>Export History</CardTitle>
            <CardDescription>
              View and manage your document export history
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <Select value={filterFormat} onValueChange={setFilterFormat}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Formats</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="xml">XML</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 bg-accent/50 rounded-lg">
            <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No export history</h3>
            <p className="text-muted-foreground">
              Export some documents to see your history here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((exportRecord) => (
              <div
                key={exportRecord.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">Export #{exportRecord.id}</h4>
                    {getFormatBadge(exportRecord.format)}
                    <Badge className="bg-green-100 text-green-800">
                      {exportRecord.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(exportRecord.exportDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {exportRecord.documentCount} documents
                      </span>
                      <span>
                        Total: ${calculateTotalAmount(exportRecord.documents)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedExport(exportRecord)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download
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

export default ExportHistory;
