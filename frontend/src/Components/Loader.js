import Shimmer from "./Shimmer"

const Loader = () => {
  return (
    <div className="min-h-screen bg-white py-6 flex flex-col justify-center sm:py-12 border-2 border-black"> {/* Changed to white background and black border */}
                    <style>{`
                        .glossy-text {
                            text-shadow:
                                -1px -1px 0 #fff,
                                1px -1px 0 #fff,
                                -1px 1px 0 #fff,
                                1px 1px 0 #fff,
                                2px 2px 5px rgba(0,0,0,0.5);
                            -webkit-text-stroke: 0.5px #000;
                            color: #000;
                        }
                        .glossy-heading {
                            text-shadow:
                                0 0 5px rgba(255,255,255,0.7),
                                0 0 10px rgba(255,255,255,0.5),
                                2px 2px 5px rgba(0,0,0,0.3);
                            -webkit-text-stroke: 0.7px #333;
                            color: #000;
                        }
                    `}</style>
                    <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 rounded-3xl border-4 border-yellow-700"></div> {/* Yellow border */}
                        <div className="relative px-4 py-10 bg-white shadow-lg rounded-3xl sm:p-20 border-4 border-yellow-700"> {/* White background and yellow border */}
                            <div className="animate-pulse">
                                <Shimmer type="heading" />
                                <div className="mt-6 grid grid-cols-1 gap-6">
                                    <Shimmer type="paragraph" />
                                    <Shimmer type="paragraph" />
                                    <Shimmer type="paragraph" />
                                    <Shimmer type="button" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
  )
}

export default Loader


