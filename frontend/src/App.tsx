import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { TIFFViewer } from "react-tiff";
import debounce from "lodash/debounce";
import "react-tiff/dist/index.css";
import Navbar from "./components/Navbar";
import Slider from "./components/Slider";

function App() {
  const [weight, setWeight] = useState(0.5);
  const [blendedImage, setBlendedImage] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const blendImage = useCallback(
    debounce(async (newWeight: number) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        const response = await axios.post(
          `http://localhost:8000/blend/?weight=${newWeight}`,
          {},
          {
            responseType: "blob",
            signal: abortController.signal,
          }
        );

        if (blendedImage) {
          URL.revokeObjectURL(blendedImage);
        }

        const imgUrl = URL.createObjectURL(response.data);
        setBlendedImage(imgUrl);
      } catch (error) {
        if (axios.isCancel(error)) {
          return;
        }
        console.error("Error blending image:", error);
      }
    }, 200),
    [blendedImage]
  );

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWeight = parseFloat(e.target.value);
    setWeight(newWeight);
    blendImage(newWeight);
  };

  useEffect(() => {
    blendImage(weight);
  }, []);

  return (
    <div className="w-full min-h-[90vh] flex flex-col items-center">
      <Navbar />
      <Slider value={weight} onChangeHandler={handleSliderChange} />
      {blendedImage && (
        <TIFFViewer
          className="md:w-[500px] md:h-[500px] w-[250px] h-[250px] my-10"
          key={blendedImage}
          tiff={blendedImage}
        />
      )}
    </div>
  );
}

export default App;
