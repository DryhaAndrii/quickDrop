import React from 'react'
import { useDropzone } from 'react-dropzone'

interface DragAndDropProps {
  onFilesChange: (files: File[]) => void
}

const DragAndDrop: React.FC<DragAndDropProps> = ({ onFilesChange }) => {
  const onDrop = (acceptedFiles: File[]) => {
    onFilesChange(acceptedFiles)
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: 100 * 1024 * 1024, // 100MB
  })

  return (
    <div
      {...getRootProps()}
      className="border-2 rounded-lg border-dashed border-foreground p-6 flex justify-center items-center hover:cursor-pointer"
    >
      <input {...getInputProps()} />
      <p className="text-center text-foreground">Drag & drop files here, or click to select</p>
    </div>
  )
}

export default DragAndDrop
