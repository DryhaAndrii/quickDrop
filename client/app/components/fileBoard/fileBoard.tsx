import React, { useRef, useState } from 'react'
import Button from '../button/button'
import DragAndDrop from './dragAndDrop'
import { useAtom } from 'jotai'
import { apiAtom } from '@/store/apiUrl'
import { API_URL } from '@/environments'
import toast from 'react-hot-toast'
import { fetchData } from '@/app/functionsAndHooks/fetch'
import { useEndpoints } from '@/endpointsAndPaths'
import Loading, { useLoading } from '@/app/components/loading/loading'
import SelectedFiles from './selectedFiles'
import FilesList from './filesList'

const ONE_MB = 1000000

export default function FileBoard() {
  const [files, setFiles] = useState<File[]>([])
  const [apiUrl, setApiUrl] = useAtom(apiAtom)
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

    const smallApi = apiUrl === API_URL;
    if (smallApi && filesSize > ONE_MB) {
      //if files size is more than 1mb and user use small api
      toast.error('You cant upload more than 1mb in room that use api for small files')
      return
    }
    const options = {
      method: 'POST',
      credentials: 'include',
      body: formData,
    }

    const response = await fetchData<any>(saveFileEndpoint, showLoading, hideLoading, options)
    if (response) {
      toast.success(response.message)
      clearFiles()

      filesListRef.current?.refreshFiles()
    }
  }

  function clearFiles() {
    setFiles([])
  }

  return (
    <div className="shadow-insetShadow rounded-lg p-4 flex flex-col gap-4">
      <Loading isShow={isShow} />
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
