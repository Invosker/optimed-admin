const Tabs = ({ tabs, setCurrentTab, currentTab }) => {
    return (
        <div className="max-w-full mb-5">
            <div className="bg-white shadow-2xl rounded-lg overflow-hidden w-full">
                <div className="flex border-b">
                    {
                        tabs.map((x) => (
                            <button key={x.name} type='button' onClick={() => setCurrentTab(x.key)} className={`flex-1 text-center py-4 text-lg font-semibold text-gray-700 bg-gray-200 rounded-tl-lg rounded-tr-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-300 focus:outline-none  ${x.key === currentTab ? ' bg-sigeBlue text-white' : ''}`}>
                                {x.name}
                            </button>
                        ))
                    }
                    {/* <button className="flex-1 text-center py-4 text-lg font-semibold text-gray-700 bg-gray-200 rounded-tl-lg rounded-tr-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-300 focus:outline-none animate-pulse">
                        Tab 1
                    </button>
                    <button className="flex-1 text-center py-4 text-lg font-semibold text-gray-700 bg-gray-200 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-300 focus:outline-none animate-pulse">
                        Tab 2
                    </button>
                    <button className="flex-1 text-center py-4 text-lg font-semibold text-gray-700 bg-gray-200 rounded-tr-lg rounded-br-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-300 focus:outline-none animate-pulse">
                        Tab 3
                    </button> */}
                </div>
            </div>
        </div>
    )
}

export default Tabs