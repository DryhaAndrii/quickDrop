import React, { useState } from 'react'
import Button from '../button/button'
import DragAndDrop from './dragAndDrop'
import FileList from './fileList'
import { useAtom } from 'jotai'
import { apiAtom } from '@/store/apiUrl'
import { API_URL } from '@/environments'
import toast from 'react-hot-toast'

export default function FileBoard() {
  const [files, setFiles] = useState<File[]>([])
  const [apiUrl, setApiUrl] = useAtom(apiAtom)
  const handleFilesChange = (newFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles])
  }

  const handleUpload = () => {
    const formData = new FormData()
    files.forEach((file) => formData.append('file', file))
    const filesSize = files.reduce((acc, file) => acc + file.size, 0)
    if (apiUrl === API_URL && filesSize > 1000000) {
      //if files size is more than 1mb
      toast.error('You cant upload more than 1mb in room that use api for small files')
      return
    }
    console.log('files:', files)
  }

  const clearFiles = () => {
    setFiles([])
  }

  return (
    <div className="shadow-insetShadow rounded-lg p-4 flex flex-col gap-4">
      <h3 className="text-lg font-bold text-foreground">File Board</h3>

      {/* Drag and drop component */}
      <DragAndDrop onFilesChange={handleFilesChange} />

      {/* List of selected files */}
      {files.length > 0 && <FileList files={files} />}

      {/* Buttons */}
      {files.length > 0 && (
        <div className="flex gap-4 h-10">
          <div className="flex-grow">
            <Button onClick={handleUpload}>Upload Files</Button>
          </div>
          <div className="w-24">
            <Button onClick={clearFiles}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  )
}
