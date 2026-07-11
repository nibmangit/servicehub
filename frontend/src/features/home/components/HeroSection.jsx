export default function HeroSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        
        <div>
          <h1 className="text-5xl font-bold leading-tight text-slate-900">
            Find Trusted Local Services Near You
          </h1>
          
          <p className="mt-6 text-lg text-slate-600">
            Connect with skilled professionals for your everyday needs.
          </p>
          
          <div className="mt-8 flex gap-4">
            <input 
              placeholder="What service do you need?" 
              className="flex-1 rounded-xl border px-5 py-3" 
            />
            <button className="bg-blue-600 text-white px-6 rounded-xl">
              Search
            </button>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="bg-blue-600 rounded-3xl h-80 flex items-center justify-center text-white text-6xl">
            🛠️
          </div>
        </div>

      </div>
    </section>
  );
}