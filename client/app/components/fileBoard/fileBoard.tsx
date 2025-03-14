import React, { useRef, useState } from 'react'
import Button from '../button/button'
import DragAndDrop from './dragAndDrop'
import { useAtom } from 'jotai'
import { apiAtom } from '@/store/apiUrl'
import { SMALL_API_URL } from '@/environments'
import toast from 'react-hot-toast'
import { fetchData } from '@/app/functionsAndHooks/fetch'
import { useEndpoints } from '@/endpointsAndPaths'
import Loading, { useLoading } from '@/app/components/loading/loading'
import SelectedFiles from './selectedFiles'
import FilesList from './filesList'

const MAX_SIZE_SMALL_API = 5 * 1024 * 1024 // 5 MB in bytes
const MAX_SIZE_BIG_API = 500 * 1024 * 1024 // 500 MB in bytes

export default function FileBoard() {
  const [files, setFiles] = useState<File[]>([])
  const [apiUrl, setApiUrl] = useAtom(apiAtom)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { saveFileEndpoint } = useEndpoints()
  const { hideLoading, showLoading, isShow } = useLoading()
  const filesListRef = useRef<{ refreshFiles: () => void } | null>(null)
  const handleFilesChange = (newFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles])
  }

  async function handleUpload() {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))

    const filesSize = files.reduce((acc, file) => acc + file.size, 0)

    const smallApi = apiUrl === SMALL_API_URL
    if (!smallApi && filesSize > MAX_SIZE_BIG_API) {
      toast.error('Max size of file is 500mb')
      return
    }
    if (smallApi && filesSize > MAX_SIZE_SMALL_API) {
      toast.error('You cant upload more than 5mb in room that use api for small files')
      return
    }
    formData.append('smallApi', smallApi.toString())

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
    <div className="shadow-insetShadow rounded-lg p-4 flex flex-col gap-4">
      <Loading isShow={isShow} text={`Loading file: ${Math.round(uploadProgress)}%`} />
      <h3 className="text-lg font-bold text-foreground text-center">File Board</h3>

      <FilesList ref={filesListRef} />

      {/* Drag and drop component */}
      <DragAndDrop onFilesChange={handleFilesChange} />

      {/* List of selected files */}
      {files.length > 0 && <SelectedFiles files={files} />}

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
