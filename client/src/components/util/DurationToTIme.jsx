export default function GetTime({ duration, sec = false }) {
    let totalseconds = duration;
    if (!sec) {
        totalseconds = Math.floor(duration / 1000)
    }
    const hours = Math.floor(totalseconds / 3600);
    const minutes = hours ? Math.floor((totalseconds % 3600) / 60 ) : Math.floor(totalseconds / 60);
    const seconds = totalseconds % 60;
    if (minutes <= 0) {

        return (
            <span className="text-sm text-[var(---color-text-xlight)]">{minutes < 10 ? '0' + minutes : minutes}
                :
                {seconds < 10 ? '0' + seconds : seconds}</span>
        )

    }

    return (
        <span className="text-sm text-[var(---color-text-xlight)]">
            {hours > 0 ?
                hours+'h'+ " : " : '' 
            }
            {minutes < 10 ? 
                '0' + minutes + 'm' : 
                minutes + 'm'}
            {" : "} 
            {seconds < 10 ? 
                '0' + seconds + 's' : 
                seconds + 's'}
        </span>
    )
}