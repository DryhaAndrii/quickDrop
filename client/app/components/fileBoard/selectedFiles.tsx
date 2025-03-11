import React from 'react'

interface SelectedFilesProps {
  files: File[]
}

const SelectedFiles: React.FC<SelectedFilesProps> = ({ files }) => {
  return (
    <div className="mt-4">
      <h4 className="text-md font-semibold text-foreground">Selected Files</h4>
      <ul className="list-disc pl-6">
        {files.map((file, index) => (
          <li key={index} className="text-foreground">
            {`${file.name} ${(file.size / 1024 / 1024).toFixed(2)} Mb`}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SelectedFiles
