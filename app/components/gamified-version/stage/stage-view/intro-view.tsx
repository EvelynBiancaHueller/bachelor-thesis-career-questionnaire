import { ReactNode } from "react";

type IntroPageProps = {
    title: string;
    icon: string;
    story: ReactNode;
};

export function IntroPage({
    title,
    icon,
    story,
}: IntroPageProps) {
    return (
        <div className="flex flex-1 flex-col min-h-0">
            <div className="mt-10 shrink-0 flex flex-col items-center gap-2.5">
                <img src={icon} alt={title} className="block h-20 w-20 sm:h-30 sm:w-30"/>
                <h2 className="mt-3 sm:mt-7.5 text-center text-xl font-semibold">{title}</h2>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="mb-10 mt-11.25 flex justify-center">
                    <div className="max-w-120 text-center text-[18px] leading-relaxed text-ink">
                        {story}
                    </div>
                </div>
            </div>
        </div>
    );
}
