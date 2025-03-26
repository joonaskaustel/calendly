import Link from "next/link";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";

export default function NavigationBar() {
	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Item One</NavigationMenuTrigger>
					<NavigationMenuContent>
						<Link href="/">
							<NavigationMenuLink>Home</NavigationMenuLink>
						</Link>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Item Two</NavigationMenuTrigger>
					<NavigationMenuContent>
						<Link href="/calendar">
							<NavigationMenuLink>Calendar</NavigationMenuLink>
						</Link>
					</NavigationMenuContent>
				</NavigationMenuItem>
				{/* Add more items as needed */}
			</NavigationMenuList>
		</NavigationMenu>
	);
}
