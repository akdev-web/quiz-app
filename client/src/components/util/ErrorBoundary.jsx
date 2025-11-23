import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("React ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen bg-[var(---color-body-bg)] p-2">
            <div className="mt-10 flex-col px-4 py-10 md:max-w-[400px] mx-auto rounded-lg">
                <div className="w-64  mx-auto rounded-xl">
                  <img className="drop-shadow-[2px_4px_6px_black]" src="quizv.png" alt=""  />
                </div>
                <div className="mt-4  text-center">
                    <p className="font-semibold text-xl">Something Went Wrong !</p>
                    <button onClick={()=>window.location.reload()} className="text-white mt-10 px-4 py-2 bg-black rounded-full cursor-pointer" type="button">Refresh</button>
                </div>
                
            </div>
        </div>
      );
    }
    return this.props.children;
  }
}
