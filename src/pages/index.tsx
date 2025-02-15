import CardApps from "@/components/Card/CardApps";
import { routeConfig } from "@/config/site";
import DefaultLayout from "@/layouts/default";

const dataAllApps = [
  {
    title: "Nén video",
    description: "Nén video của bạn để tiết kiệm dung lượng",
    image: "https://heroui.com/images/hero-card-complete.jpeg",
    route: routeConfig.videoCompress,
  },

  {
    title: "Nén ảnh",
    description: "Nén ảnh của bạn để tiết kiệm dung lượng",
    image: "https://heroui.com/images/hero-card-complete.jpeg",
    route: routeConfig.imageCompress,
  },
];

export default function HomePage() {
  return (
    <DefaultLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataAllApps.map((data, index) => (
          <CardApps key={index} {...data} />
        ))}
      </div>
    </DefaultLayout>
  );
}
