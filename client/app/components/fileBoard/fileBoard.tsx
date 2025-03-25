import React, { useEffect, useRef, useState } from 'react'
import Button from '../button/button'
import DragAndDrop from './dragAndDrop'
import { useAtom } from 'jotai'
import { apiAtom } from '@/store/apiUrl'
import toast from 'react-hot-toast'
import { useEndpoints } from '@/endpointsAndPaths'
import Loading, { useLoading } from '@/app/components/loading/loading'
import SelectedFiles from './selectedFiles'
import FilesList from './filesList'
import { roomMemoryAtom } from '@/store/apiMemory'

interface FilesListRef {
  refreshFiles: () => void
}

export default function FileBoard() {
  const [files, setFiles] = useState<File[]>([])
  const [uploadedFilesSize, setUploadedFilesSize] = useState(0)
  const [apiUrl, setApiUrl] = useAtom(apiAtom)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { saveFileEndpoint } = useEndpoints()
  const { hideLoading, showLoading, isShow } = useLoading()
  const [roomMemory, __] = useAtom(roomMemoryAtom)
  const [roomSize, setRoomSize] = useState(0)

  const filesListRef = useRef<FilesListRef | null>(null)

  useEffect(() => {
    setRoomSize(uploadedFilesSize)
  }, [uploadedFilesSize])

  const handleFilesChange = (newFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles])
  }

  async function handleUpload() {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))

    const filesSize = files.reduce((acc, file) => acc + file.size, 0)

    if (filesSize > roomMemory.maxFilesSize * 1024 * 1024) {
      toast.error(`Files limit exceeded. The limit is ${roomMemory.maxFilesSize} MB`)
      return
    }

    if(roomSize+filesSize>roomMemory.maxRoomSize*1024*1024){
      toast.error(`Room limit will exceeded. The limit is ${roomMemory.maxRoomSize} MB`)
      return
    }

    const xhr = new XMLHttpRequest()
    showLoading()

    // Progress
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100
        setUploadProgress(percentComplete)
      }
    })

    // Handling end of loading
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText)

          if (response.message) {
            toast.success(response.message)
          } else {
            toast.success('Files uploaded successfully!')
          }

          clearFiles()
          filesListRef.current?.refreshFiles()
        } catch (error) {
          console.error('Failed to parse server response:', error)
          toast.error('Failed to process server response')
        }
      } else {
        try {
          const errorResponse = JSON.parse(xhr.responseText)

          if (errorResponse.message) {
            toast.error(errorResponse.message)
          } else {
            toast.error('Upload failed')
          }
        } catch (error) {
          console.error('Failed to parse server error response:', error)
          toast.error('Upload failed')
        }
      }
      setUploadProgress(0)
      hideLoading()
    })

    // Error handling
    xhr.addEventListener('error', () => {
      toast.error('Upload failed')
      setUploadProgress(0)
      hideLoading()
    })

    // Sending request
    xhr.open('POST', saveFileEndpoint, true)
    xhr.withCredentials = true
    xhr.send(formData)
  }

  function clearFiles() {
    setFiles([])
  }

  return (
    <div className="shadow-insetShadow rounded-lg p-2 md:p-4 flex flex-col gap-4">
      <Loading isShow={isShow} text={`Loading file: ${Math.round(uploadProgress)}%`} />
      <h3 className="text-lg font-bold text-foreground text-center">File Board</h3>
      <p className='text-foreground'>
        Current room size: {(roomSize / 1024 / 1024).toFixed(2)} mb of {roomMemory.maxRoomSize} mb
      </p>
      <FilesList ref={filesListRef} setUploadedFilesSize={setUploadedFilesSize} />

      {/* Drag and drop component */}
      <DragAndDrop onFilesChange={handleFilesChange} />

      {/* List of selected files */}
      {files.length > 0 && <SelectedFiles files={files} />}

      {/* Buttons */}
      {files.length > 0 && (
        <div className="flex gap-4 h-10">
          <div className="flex-grow">
            <Button variant='rounded' onClick={handleUpload}>Upload Files</Button>
          </div>
          <div className="w-24">
            <Button variant='rounded' onClick={clearFiles}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  )
}
