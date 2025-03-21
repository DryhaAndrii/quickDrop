import { fetchData } from '@/app/functionsAndHooks/fetch'
import { File } from '@/types/file'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react'
import { useEndpoints } from '@/endpointsAndPaths'
import Loading, { useLoading } from '../loading/loading'
import { useAtom } from 'jotai'
import { roomNameAtom } from '@/store/roomName'
import Button from '../button/button'
import GoogleIcon from '../googleIcon/googleIcon'
import { nicknameAtom } from '@/store/nickname'
import toast from 'react-hot-toast'

interface FilesListProps {
  setUploadedFilesSize: React.Dispatch<React.SetStateAction<number>>
}

const FilesList = forwardRef(({ setUploadedFilesSize }: FilesListProps, ref) => {
  const [files, setFiles] = useState<File[]>([])
  const [roomName, _] = useAtom(roomNameAtom)
  const [nickname, __] = useAtom(nicknameAtom)
  const { getRoomFilesEndpoint, downloadFileEndpoint, deleteFileEndpoint } = useEndpoints({
    roomName,
  })
  const { hideLoading, showLoading, isShow } = useLoading()

  useEffect(() => {
    if (!roomName) return

    const fetchFiles = async () => {
      await getRoomFiles()
    }

    fetchFiles()

    const intervalId = setInterval(fetchFiles, 5000)

    return () => clearInterval(intervalId)
  }, [roomName])

  async function getRoomFiles() {
    const options = {
      method: 'GET',
      credentials: 'include',
    }
    const response = await fetchData<any>(getRoomFilesEndpoint, undefined, undefined, options)

    if (response.files) {
      setFiles(response.files)
      const filesSize = response.files.reduce(
        (acc: any, file: { size: any }) => acc + Number(file.size),
        0,
      )
      setUploadedFilesSize(filesSize)
    }
  }

  useImperativeHandle(ref, () => ({
    refreshFiles: getRoomFiles,
  }))

  function downloadFile(file: File) {
    const link = document.createElement('a')

    link.href = `${downloadFileEndpoint}${file.storedName}`
    link.setAttribute('download', file.originalName)
    link.setAttribute('target', '_blank')
    link.setAttribute('rel', 'noopener noreferrer')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  async function deleteFile(file: File) {
    console.log('Your nickname:', nickname, 'Creator:', file.creator)
    if (nickname !== file.creator) {
      toast.error('Only creator can delete file')
      return
    }
    const options = {
      method: 'DELETE',
      credentials: 'include',
    }

    const response = await fetchData(
      `${deleteFileEndpoint}?roomName=${roomName}&storedName=${file.storedName}`,
      showLoading,
      hideLoading,
      options,
    )

    await getRoomFiles()
  }

  return (
    <>
      <Loading isShow={isShow} />
      <h4 className="text-foreground">Files</h4>
      {files.length === 0 && <p className="text-foreground">No files in this room yet :P</p>}
      <div className="flex flex-col gap-2 text-foreground max-h-96 overflow-auto custom-scroll">
        {files.map((file, index) => (
          <div
            className={`h-16 p-1 px-2 md:px-4 rounded-lg border border-foreground flex items-center gap-2 relative`}
            key={index}
          >
            <div className="grow min-w-0 flex flex-col">
              <p className="overflow-hidden text-ellipsis whitespace-nowrap">{file.originalName}</p>
              <p className="text-[10px] whitespace-nowrap text-ellipsis w-full overflow-hidden">
                {file.creator}
              </p>
            </div>

            <p className="shrink-0 overflow-hidden h-full flex items-center text-ellipsis whitespace-nowrap">
              {(+file.size / 1024 / 1024).toFixed(2)} mb
            </p>
            <div className="size-10 shrink-0">
              <Button onClick={() => downloadFile(file)}>
                <GoogleIcon iconName="download" />
              </Button>
            </div>
            <div className="size-10 shrink-0">
              <Button onClick={() => deleteFile(file)}>
                <GoogleIcon iconName="delete" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
})

export default FilesList
