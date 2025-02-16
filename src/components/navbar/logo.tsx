import { Link } from "@heroui/link";

import { routeConfig } from "@/config/site";

export const Logo = () => {
  return (
    <Link className="font-bold text-inherit" href={routeConfig.home}>
      AIO APPS
    </Link>
  );
};
