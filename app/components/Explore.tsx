import { Search, Clock } from 'lucide-react'

const Explore = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-6xl font-bold text-center mb-16">Explore</h1>
      
      <div className="relative w-full max-w-3xl mx-auto mb-16">
        <input
          type="text"
          placeholder="Explore with Keywords/Topics/Authors"
          className="w-full px-12 py-4 bg-[#111111] rounded-full text-gray-400 focus:outline-none border border-gray-800"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
      </div>

      <div className="flex gap-4 justify-center flex-wrap mb-16">
        {['#hashtags', '#hashtags', '#hashtags', '#hashtags'].map((tag, index) => (
          <span key={index} className="px-6 py-2 bg-[#111111] border border-gray-800 rounded-full text-gray-400">{tag}</span>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {[
          { time: '5 mins read' },
          { time: '3 mins read' },
          { time: '4 mins read' }
        ].map((item, index) => (
          <div key={index} className="group relative rounded-3xl overflow-hidden">
            <div className="aspect-[4/3] bg-gradient-to-br from-purple-900/30 to-gray-900/30 relative">
              <div className="absolute top-4 right-4 bg-white rounded-full px-4 py-1.5 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-black" />
                <span className="text-sm text-black">{item.time}</span>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <h2 className="text-4xl font-bold mb-4 text-white">Title<br/>Name</h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                <span className="text-white/90">NAME AUTHOR/BUSINESS</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center max-w-2xl mx-auto">
        <p className="text-gray-400 text-lg leading-relaxed mb-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        </p>
        <button className="inline-flex items-center gap-2 text-white border border-white rounded-full px-8 py-3 hover:bg-white/10 transition-colors">
          Read Now <span className="text-xl">→</span>
        </button>
      </div>
    </div>
  )
}

export default Explore 