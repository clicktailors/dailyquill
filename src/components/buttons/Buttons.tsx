import { BuyMeACoffeeButton } from "./BuyMeACoffeeButton";
import { GithubButton } from "./GithubButton";
import { ClickTailorsButton } from "./ClickTailorsButton";
import { FeedbackButton } from "./FeedbackButton";

interface ButtonsProps {
	variant: "buyMeACoffee" | "github" | "clicktailors" | "feedback";
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
		case "feedback":
			return <FeedbackButton className={className} href={href} label={label} />;
		default:
			return null;
	}
}