import { Link } from "react-router-dom";
import { NavigationMenu, NavigationMenuList, NavigationMenuLink } from "@/components/ui/navigation-menu";

export default function Component() {
  return (
    <nav className="sticky inset-x-0 top-0 z-50 bg-white shadow-sm px-4 md:px-6 dark:bg-black">
      <div className="flex justify-between h-14 items-center">
        <Link to="http://www.automate.builders" className="font-semibold">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-2xl">Automate Builders</h1>
        </Link>
        <NavigationMenu>
          <NavigationMenuList className="flex-1 justify-evenly">
            <NavigationMenuLink asChild>
              <Link to="/" className="mr-4">
                Home
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <Link to="/connections" className="mr-4">
                Connections
              </Link>
            </NavigationMenuLink>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}
