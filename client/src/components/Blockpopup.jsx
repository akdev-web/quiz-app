const Blockpopup = ({onClose}) => {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-11/12 max-w-md text-center">
                <div className="mb-4">
                    <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-8 h-8"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m0 3.75h.008v.008H12v-.008zm-9 0A9 9 0 1112 21a9 9 0 01-9-9z"
                            />
                        </svg>
                    </div>
                </div>

                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    Cookies Are Disabled
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                    Your browser is blocking cookies — this may happen in private or
                    incognito mode. Please use a normal window or enable cookies to
                    continue using this site.
                </p>

                <div className="flex justify-center gap-3">
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Blockpopup;