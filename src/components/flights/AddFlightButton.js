'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, Upload, PenTool, ChevronDown } from 'lucide-react'
import FlightForm from './FlightForm'
import LogUpload from './LogUpload'

export default function AddFlightButton({ onFlightAdded }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState('') // 'manual' or 'upload'

  const handleSuccess = () => {
    setDialogOpen(false)
    setDialogType('')
    onFlightAdded?.()
  }

  const openDialog = (type) => {
    setDialogType(type)
    setDialogOpen(true)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Flight
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => openDialog('upload')}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Flight Log
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openDialog('manual')}>
            <PenTool className="h-4 w-4 mr-2" />
            Manual Entry
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'upload' ? 'Upload Flight Log' : 'Add Flight Manually'}
            </DialogTitle>
          </DialogHeader>
          
          {dialogType === 'upload' ? (
            <div className="space-y-6">
              <LogUpload onUploadComplete={handleSuccess} />
            </div>
          ) : dialogType === 'manual' ? (
            <FlightForm 
              onSuccess={handleSuccess} 
              onCancel={() => setDialogOpen(false)} 
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}