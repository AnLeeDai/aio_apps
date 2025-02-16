import { Route, Routes } from "react-router-dom";

import VideoCompress from "./pages/video-compress";
import { routeConfig } from "./config/site";
import ImageCompress from "./pages/image-compress";

import HomePage from "@/pages/index";

function App() {
  return (
    <Routes>
      <Route element={<HomePage />} path={routeConfig.home} />
      <Route element={<VideoCompress />} path={routeConfig.videoCompress} />
      <Route element={<ImageCompress />} path={routeConfig.imageCompress} />
    </Routes>
  );
}

export default App;
