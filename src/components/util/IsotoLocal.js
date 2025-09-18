export default function IsoToLocalTimeString(isoString) {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
        return "Invalid Date";
    }
    return date.toLocaleString();
}