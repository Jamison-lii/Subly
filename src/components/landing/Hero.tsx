import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D5FFE4]/20 to-transparent"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-[#007A5E]/5 rounded-full blur-3xl animate-pulse-slow"></div>
            
            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-[#007A5E]/10 rounded-full animate-float"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-[#D5FFE4]/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-[#007A5E]/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
            
            {/* Gradient Orbs */}
            <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-r from-[#007A5E] to-[#006B52] rounded-full opacity-20 blur-xl animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-gradient-to-r from-[#D5FFE4] to-[#007A5E] rounded-full opacity-30 blur-lg animate-float" style={{ animationDelay: '1.5s' }}></div>
          </div>

          {/* Main content with animations */}
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 animate-fade-in-up">
              Master Your Subscriptions with{' '}
              <span className="text-[#007A5E] relative">
                AI
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#007A5E] to-[#D5FFE4] rounded-full animate-pulse-slow"></div>
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Track, cancel, and save — effortlessly. Subly gives you control over your recurring expenses.
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link
                href="/auth/signup"
                className="group relative bg-[#007A5E] text-white px-8 py-4 rounded-lg hover:bg-[#006B52] transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover-lift focus-ring"
              >
                <span className="relative z-10">Start Managing Free</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#007A5E] to-[#006B52] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 rounded-lg bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                href="#how-it-works"
                className="group text-[#007A5E] hover:text-[#006B52] font-semibold text-lg transition-all duration-300 flex items-center"
              >
                <span>See How It Works</span>
                <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            {/* Enhanced Stats with animations */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <div className="text-2xl font-bold text-[#007A5E] mb-2 hover-glow p-2 rounded-lg transition-all duration-300">$127</div>
                <div className="text-sm text-gray-600">Average monthly savings</div>
              </div>
              <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                <div className="text-2xl font-bold text-[#007A5E] mb-2 hover-glow p-2 rounded-lg transition-all duration-300">15+</div>
                <div className="text-sm text-gray-600">Subscriptions tracked</div>
              </div>
              <div className="text-center animate-fade-in-up" style={{ animationDelay: '1s' }}>
                <div className="text-2xl font-bold text-[#007A5E] mb-2 hover-glow p-2 rounded-lg transition-all duration-300">98%</div>
                <div className="text-sm text-gray-600">User satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 