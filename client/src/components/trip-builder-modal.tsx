import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import TripBuilderForm from "@/components/trip-builder-form";

interface TripBuilderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TripBuilderModal({ open, onOpenChange }: TripBuilderModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="w-[95vw] sm:w-[90vw] max-w-[1400px] p-0 overflow-hidden max-h-[90vh] flex flex-col gap-0"
      >
        {/* Radix requires an accessible title; the visible one lives inside TripBuilderForm's own header */}
        <DialogTitle className="sr-only">Plan Your Bespoke Egypt Journey</DialogTitle>
        <TripBuilderForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
