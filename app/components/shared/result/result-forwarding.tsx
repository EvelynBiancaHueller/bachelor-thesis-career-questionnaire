export function ForwardingPage() {
    const onetLink = `https://www.onetonline.org/explore/interests/Artistic/`;

    return (
        <div className="flex flex-1 flex-col min-h-0">
            <div className="min-h-0 flex-1 overflow-y-auto items-center text-center">
                <div className="mb-10 mt-11.25 flex justify-center">
                    <div className="max-w-120 text-center text-[18px] leading-relaxed text-ink">
                        <h3 className="font-bold">Thank you for participating!</h3>
                        <br/>
                        <br/>
                        You can use this result as a starting point to explore occupations in the external O*NET database.
                        The linked page lets you browse careers related to your top interest areas.
                    </div>
                </div>

                <a
                    href={onetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex rounded-full bg-ink px-5 py-2 text-sm font-semibold underline"
                >
                    Explore matching occupations
                </a>
            </div>
        </div>
    );
}
