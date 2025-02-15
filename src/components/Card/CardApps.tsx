import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  Skeleton,
  Link,
} from "@heroui/react";

interface CardProductProps {
  title: string;
  description: string;
  image: string;
  route: string;
  isLoading?: boolean;
}

export default function CardApps(props: CardProductProps) {
  const { title, description, image, route, isLoading } = props;
  const [imgLoaded, setImgLoaded] = useState(false);

  // Nếu prop isLoading được truyền thì ưu tiên dùng nó,
  // nếu không, sử dụng trạng thái imgLoaded nội bộ
  const loading = isLoading !== undefined ? isLoading : !imgLoaded;

  const handleImageLoad = () => {
    setImgLoaded(true);
  };

  if (loading) {
    return (
      <Card className="py-4">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <Skeleton className="rounded-lg">
            <p className="text-tiny uppercase font-bold">{title}</p>
          </Skeleton>

          <Skeleton className="rounded-lg mt-2">
            <small className="text-default-500">{description}</small>
          </Skeleton>
        </CardHeader>

        <CardBody className="overflow-visible py-2">
          <Skeleton className="rounded-lg">
            <Image
              alt="Card background"
              className="object-cover rounded-xl"
              src={image}
              onLoad={handleImageLoad}
            />
          </Skeleton>
        </CardBody>
      </Card>
    );
  }

  return (
    <Link className="cursor-pointer" href={route}>
      <Card className="py-4">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p className="text-tiny uppercase font-bold">{title}</p>
          <small className="text-default-500">{description}</small>
        </CardHeader>

        <CardBody className="overflow-visible py-2">
          <Image
            alt="Card background"
            className="object-cover rounded-xl"
            src={image}
            onLoad={handleImageLoad}
          />
        </CardBody>
      </Card>
    </Link>
  );
}
