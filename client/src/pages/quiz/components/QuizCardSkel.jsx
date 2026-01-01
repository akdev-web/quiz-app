import { useMemo } from "react";
import '../components/skelcss.css'
const QuizCardSkel = ({ skelton }) => {
    const {
        usernameWidth,
        titleWidth,
        descWidth1,
        descWidth2,
        durationWidth,
        delay: animDelay
    } = skelton;

    const skelBase = `
        rounded 
        bg-[var(---color-qsklbg-light)]
        skeleton-shimmer
    `;

    return (
        <div
            className="
                max-sm:w-full
                max-sm:max-w-[400px] 
                max-sm:mx-auto 
                flex flex-col 
                rounded-xl 
                shadow-lg 
                bg-[var(---color-qsklbg)]
                overflow-hidden 
                transition 
                hover:shadow-2xl 
                hover:-translate-y-1 
                duration-200
            "
            style={{ animationDelay: animDelay }}
        >
            {/* Thumbnail */}
            <div
                className={`${skelBase} w-full h-48`}
                style={{ animationDelay: animDelay }}
            />

            <div className="p-5">
                {/* Profile row */}
                <div className="flex items-center gap-3 mb-3">
                    <div
                        className={`${skelBase} w-10 h-10 rounded-full`}
                        style={{ animationDelay: animDelay }}
                    />

                    <div
                        className={`${skelBase} h-4`}
                        style={{
                            width: usernameWidth,
                            animationDelay: animDelay
                        }}
                    />
                </div>

                {/* Title */}
                <div
                    className={`${skelBase} h-5 mb-3`}
                    style={{
                        width: titleWidth,
                        animationDelay: animDelay
                    }}
                />

                {/* Text line 1 */}
                <div
                    className={`${skelBase} h-4 mb-2`}
                    style={{
                        width: descWidth1,
                        animationDelay: animDelay
                    }}
                />

                {/* Text line 2 */}
                <div
                    className={`${skelBase} h-4 mb-2`}
                    style={{
                        width: descWidth2,
                        animationDelay: animDelay
                    }}
                />

                {/* Duration */}
                <div
                    className={`${skelBase} h-3 mb-2`}
                    style={{width:durationWidth, animationDelay: animDelay }}
                />

                {/* Quiz start time */}
                <div
                    className={`${skelBase} h-3 w-24`}
                    style={{ animationDelay: animDelay }}
                />
            </div>
        </div>
    );
};

export default QuizCardSkel;
