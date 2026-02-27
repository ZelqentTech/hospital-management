import { AlertCircle, X } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { cn } from '../../lib/utils';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  isLoading = false
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
      <Card className="w-full max-w-md p-0 overflow-hidden shadow-2xl border-none">
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className={cn(
              "size-12 rounded-2xl flex items-center justify-center shrink-0",
              variant === 'danger' ? "bg-red-100 text-red-600" : "bg-primary/10 text-primary"
            )}>
              <AlertCircle size={24} />
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button 
            variant={variant === 'danger' ? 'danger' : 'primary'} 
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </Card>
    </div>
  );
}
