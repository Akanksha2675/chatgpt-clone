
interface SidebarProps {
    file: File | null;
    handleFileIngestion: (nextFile: File | null) => void;
    ingestStatus: string | null;
}

export default function Sidebar( { file, handleFileIngestion, ingestStatus }: SidebarProps) {

    const ingestColor = ingestStatus === "Ingestion successful" ? "text-green-700" : ( ingestStatus === "Ingestion failed" ? "text-red-700" : "text-blue-700")
    console.log("Ingest status:", ingestStatus, "Ingest color:", ingestColor)

    return (
        <div className="bg-gray-50 w-60 flex flex-col rounded-3xl justify-center items-center">
            <h2 className="text-lg font-semibold mb-4 mt-4">
                Upload File
            </h2>

            <label className="flex flex-col items-center justify-center w-40 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer">
                <p className=" hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded cursor-pointer">
                    Click to upload
                </p>  

                <input
                    type="file"
                    className="hidden"
                    onChange={(event) => {
                        const selectedFile = event.target.files?.[0] || null
                        handleFileIngestion(selectedFile);
                    }}
                >
                </input>
            </label>

            { file && (
                <div>
                    <p className="text-gray-500 text-center">{file.name}</p>
                    { ingestStatus && ( 
                        <p className={`text-gray-500 text-center ${ingestColor}`}>{ingestStatus}</p> 
                    ) }
                </div>
            )}
        </div>
    )
}