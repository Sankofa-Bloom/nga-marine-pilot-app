
import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

interface GenerateReportDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  template?: { name: string; category: string } | null;
}

const ReportContentToPrint = React.forwardRef<HTMLDivElement, { data: any }>(({ data }, ref) => (
  <div ref={ref} className="p-10 bg-white text-black w-[800px]">
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-2">
        <FileText className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Maritime Report</h1>
      </div>
      <span className="text-sm text-gray-500">Generated on: {format(new Date(), 'PPP')}</span>
    </div>

    <div className="grid grid-cols-2 gap-6 mb-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-2">Report Details</h2>
        <p><strong className="font-medium">Template:</strong> {data.templateName}</p>
        <p><strong className="font-medium">Department:</strong> {data.department}</p>
        <p><strong className="font-medium">Task:</strong> {data.task}</p>
        {data.dateRange?.from && (
          <p><strong className="font-medium">Date Range:</strong> {format(data.dateRange.from, 'LLL dd, y')} - {data.dateRange.to ? format(data.dateRange.to, 'LLL dd, y') : ''}</p>
        )}
      </div>
    </div>
    
    <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Generated Content</h3>
        <p className="text-gray-600">This is a sample report content area. In a real application, this section would be populated with charts, tables, and data visualizations based on the selected filters. For now, it serves as a placeholder to demonstrate PDF generation.</p>
    </div>
  </div>
));


const GenerateReportDialog: React.FC<GenerateReportDialogProps> = ({ isOpen, setIsOpen, template }) => {
  const [date, setDate] = useState<DateRange | undefined>({ from: new Date(), to: new Date() });
  const [department, setDepartment] = useState('');
  const [task, setTask] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const reportContentRef = useRef<HTMLDivElement>(null);

  const departments = ['Operations', 'Finance', 'HR', 'Maintenance'];
  const tasks = ['Vessel Inspection', 'Budget Review', 'Crew Payroll', 'Engine Maintenance'];

  const handleGeneratePdf = async () => {
    if (!reportContentRef.current) return;
    setIsGenerating(true);
    toast.info('Generating PDF, please wait...');

    try {
      const canvas = await html2canvas(reportContentRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`NGA-Report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);

      toast.success('Report generated and downloaded successfully!');
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const reportData = {
    templateName: template?.name || 'Custom Report',
    department: department || 'All',
    task: task || 'All',
    dateRange: date
  };

  return (
    <>
      <div className="absolute -z-50" style={{ left: '-9999px' }}>
        <ReportContentToPrint ref={reportContentRef} data={reportData} />
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Generate Report</DialogTitle>
            <DialogDescription>
              Select criteria for your report. Leave fields blank to include all data.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date-range" className="text-right">
                Date Range
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(date.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Department
              </Label>
              <Select onValueChange={setDepartment} defaultValue={template?.category}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(d => <SelectItem key={d} value={d.toLowerCase()}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task" className="text-right">
                Task
              </Label>
              <Select onValueChange={setTask}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a task" />
                </SelectTrigger>
                <SelectContent>
                  {tasks.map(t => <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleGeneratePdf}
              disabled={isGenerating}
              variant="dialogPrimary"
            >
              {isGenerating ? 'Generating...' : 'Generate PDF'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GenerateReportDialog;
