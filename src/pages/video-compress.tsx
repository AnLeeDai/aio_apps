import { useState, useRef, useEffect, SetStateAction } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

import DefaultLayout from "@/layouts/default";

export default function VideoCompress() {
  const [loaded, setLoaded] = useState(false);
  const [originalVideo, setOriginalVideo] = useState<string | null>(null);
  const [compressedVideo, setCompressedVideo] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState("mp4");
  const [compressionLevel, setCompressionLevel] = useState(26);
  const [compressionQuality, setCompressionQuality] = useState("Medium");
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [processingTime, setProcessingTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [fileSize, setFileSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressionRatio, setCompressionRatio] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const ffmpegRef = useRef(new FFmpeg());
  const originalFile = useRef<File | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const loadFFmpeg = async () => {
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
      const ffmpeg = ffmpegRef.current;

      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript",
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm",
        ),
      });

      setLoaded(true);
    };

    loadFFmpeg();
  }, []); // Chạy một lần khi component mount

  const handleVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    originalFile.current = file;
    setFileSize(file.size / (1024 * 1024));
    setOriginalVideo(URL.createObjectURL(file));
    setCompressedVideo(null);
    setProcessingTime(0);
    setCompressedSize(0);
    setCompressionRatio(0);
    setProgress(0);
  };

  const handleQualityChange = (quality: SetStateAction<string>) => {
    setCompressionQuality(quality);

    let newCRF;
    let compressionFactor;

    switch (quality) {
      case "High":
        newCRF = 18;
        compressionFactor = 0.9;
        break;
      case "Medium":
        newCRF = 26;
        compressionFactor = 0.6;
        break;
      case "Low":
        newCRF = 35;
        compressionFactor = 0.3;
        break;
      default:
        return;
    }

    setCompressionLevel(newCRF);
    setCompressedSize(parseFloat((fileSize * compressionFactor).toFixed(2)));

    // Dự đoán thời gian nén
    const estimatedTimeSec = Math.max(
      5,
      (fileSize / (fileSize * compressionFactor)) * 5,
    );

    setEstimatedTime(parseFloat(estimatedTimeSec.toFixed(1)));
  };

  const handleCompression = async () => {
    if (!originalFile.current) return;

    const ffmpeg = ffmpegRef.current;
    const inputFileName = `input.${originalFile.current.name.split(".").pop()}`;
    const outputFileName = `output.${outputFormat}`;

    await ffmpeg.writeFile(
      inputFileName,
      await fetchFile(originalFile.current),
    );

    setIsProcessing(true);
    setProcessingTime(0);
    setProgress(0);

    let startTime = Date.now();

    // Cập nhật thời gian thực khi nén video
    intervalRef.current = setInterval(() => {
      setProcessingTime(
        parseFloat(((Date.now() - startTime) / 1000).toFixed(1)),
      );
    }, 1000);

    // Lắng nghe tiến trình từ FFmpeg
    ffmpeg.on("progress", ({ progress }) => {
      setProgress(Math.floor(progress * 100));

      // Dự đoán thời gian còn lại
      const elapsed = (Date.now() - startTime) / 1000;
      const estimatedTotal = (elapsed / progress) * (1 - progress);

      setEstimatedTime(parseFloat(estimatedTotal.toFixed(1)));
    });

    await ffmpeg.exec([
      "-i",
      inputFileName,
      "-vcodec",
      "libx264",
      "-crf",
      compressionLevel.toString(),
      outputFileName,
    ]);

    clearInterval(intervalRef.current);
    setIsProcessing(false);

    const data = await ffmpeg.readFile(outputFileName);
    const blob = new Blob([data], { type: `video/${outputFormat}` });
    const newSize = blob.size / (1024 * 1024);

    setCompressedSize(parseFloat(newSize.toFixed(2)));
    setCompressionRatio(
      parseFloat((((fileSize - newSize) / fileSize) * 100).toFixed(2)),
    );

    setCompressedVideo(URL.createObjectURL(blob));
    setProcessingTime(parseFloat(((Date.now() - startTime) / 1000).toFixed(1)));
    setEstimatedTime(0);
  };

  return (
    <DefaultLayout>
      <div className="p-4">
        {loaded && (
          <>
            <input accept="video/*" type="file" onChange={handleVideoUpload} />
            <select
              className="mt-2 p-2 border rounded"
              onChange={(e) => setOutputFormat(e.target.value)}
            >
              <option value="mp4">MP4</option>
              <option value="avi">AVI</option>
              <option value="mov">MOV</option>
              <option value="webm">WEBM</option>
            </select>

            <div className="mt-2">
              <label htmlFor="compression-quality">Compression Quality:</label>
              <div className="flex gap-2" id="compression-quality">
                {["High", "Medium", "Low"].map((quality) => (
                  <button
                    key={quality}
                    className={`p-2 rounded ${compressionQuality === quality ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    onClick={() => handleQualityChange(quality)}
                  >
                    {quality}
                  </button>
                ))}
              </div>
            </div>

            <button
              className={`mt-2 p-2 rounded ${isProcessing ? "bg-gray-400" : "bg-green-500"} text-white`}
              disabled={isProcessing}
              onClick={handleCompression}
            >
              {isProcessing
                ? `Compressing... ${progress}%`
                : "Start Compression"}
            </button>

            <div className="mt-2">
              {isProcessing && (
                <p>
                  Progress: {progress}% | Estimated Time: {estimatedTime}s
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <h3 className="text-lg font-bold">Original Video</h3>
                {originalVideo && (
                  <video controls className="w-full mt-2" src={originalVideo}>
                    <track
                      default
                      kind="captions"
                      label="English captions"
                      srcLang="en"
                    />
                  </video>
                )}
                {fileSize > 0 && <p>Original Size: {fileSize.toFixed(2)} MB</p>}
              </div>
              <div>
                <h3 className="text-lg font-bold">Compressed Video</h3>
                {compressedVideo && (
                  <>
                    <video
                      controls
                      className="w-full mt-2"
                      src={compressedVideo}
                    >
                      <track
                        default
                        kind="captions"
                        label="English captions"
                        srcLang="en"
                      />
                    </video>
                    <p>Compressed Size: {compressedSize} MB</p>
                    <p>Size Reduction: {compressionRatio}%</p>
                    <p>Total Processing Time: {processingTime} seconds</p>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DefaultLayout>
  );
}
