import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { Input } from "@heroui/input";

import { IconSearch } from "../theme-switch/icon";

import { Logo } from "./logo";

import { ThemeSwitch } from "@/components/theme-switch";

export default function App() {
  return (
    <Navbar
      isBordered
      className="container mx-auto"
      classNames={{
        wrapper: "p-0",
      }}
      maxWidth="full"
    >
      <NavbarBrand>
        <Logo />
      </NavbarBrand>

      <NavbarContent>
        <Input
          isClearable
          className="w-full"
          placeholder="Gõ để tìm kiếm..."
          radius="lg"
          startContent={<IconSearch />}
        />
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>

        {/* <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem> */}
      </NavbarContent>
    </Navbar>
  );
}
