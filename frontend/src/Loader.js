import React from 'react'
import LogoShimmer from './Components/LogoShimmer'

const Loader = () => {
  return (
            <div className="bg-white flex py-1 flex-col justify-center">
                    <div className="relative py-2  sm:mx-auto ">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 rounded-3xl border-4 border-yellow-700"></div> {/* Yellow border */}
                        <div className="relative px-4 p-1.5 bg-white shadow-lg rounded-2xl sm:p-1.5 border-4 border-yellow-700">
                            <div className="">
                                <div className="grid grid-cols-1">                        
                                    <LogoShimmer type="button" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
           )
}

export default Loader