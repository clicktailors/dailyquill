import { BuyMeACoffeeButton } from "./BuyMeACoffeeButton";
import { GithubButton } from "./GithubButton";
import { ClickTailorsButton } from "./ClickTailorsButton";

interface ButtonsProps {
	variant: "buyMeACoffee" | "github" | "clicktailors";
	className?: string;
	href?: string;
	label?: string;
}

export default function Buttons({ variant, className, href, label }: ButtonsProps) {
	switch (variant) {
		case "buyMeACoffee":
			return <BuyMeACoffeeButton className={className} href={href} label={label} />;
		case "github":
			return <GithubButton className={className} href={href} label={label} />;
		case "clicktailors":
			return <ClickTailorsButton className={className} href={href} label={label} />;
		default:
			return null;
	}
}