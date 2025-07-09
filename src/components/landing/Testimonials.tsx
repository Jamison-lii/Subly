export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Manager',
      company: 'TechCorp',
      content: 'Subly helped me discover $89 in unused subscriptions I completely forgot about. The AI suggestions are spot-on!',
      rating: 5,
      avatar: 'SJ'
    },
    {
      name: 'Michael Chen',
      role: 'Freelance Developer',
      company: 'Self-employed',
      content: 'As someone who travels frequently, I love how Subly works globally. The mobile money integration is perfect for my needs.',
      rating: 5,
      avatar: 'MC'
    },
    {
      name: 'Aisha Patel',
      role: 'Student',
      company: 'University of Lagos',
      content: 'The SMS parsing feature is brilliant! It automatically detected my mobile data subscriptions and helped me optimize my spending.',
      rating: 5,
      avatar: 'AP'
    },
    {
      name: 'David Rodriguez',
      role: 'Small Business Owner',
      company: 'Café Luna',
      content: "I was spending $200+ on subscriptions I barely used. Subly's insights helped me cut that down to $45. Game changer!",
      rating: 5,
      avatar: 'DR'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'} transition-colors duration-300`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#007A5E]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#D5FFE4]/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Loved by Users Worldwide
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See what our users are saying about their experience with Subly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover-lift animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Rating */}
              <div className="flex mb-4 group-hover:scale-105 transition-transform duration-300">
                {renderStars(testimonial.rating)}
              </div>
              
              {/* Content */}
              <p className="text-gray-600 mb-6 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                "{testimonial.content}"
              </p>
              
              {/* Author */}
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#007A5E] rounded-full flex items-center justify-center text-white font-semibold mr-3 group-hover:scale-110 transition-transform duration-300">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 group-hover:text-[#007A5E] transition-colors duration-300">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#007A5E]/5 to-[#D5FFE4]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Enhanced Stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="text-3xl font-bold text-[#007A5E] mb-2 hover-glow p-2 rounded-lg transition-all duration-300 animate-pulse-slow">
              50,000+
            </div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <div className="text-3xl font-bold text-[#007A5E] mb-2 hover-glow p-2 rounded-lg transition-all duration-300 animate-pulse-slow">
              $2.1M
            </div>
            <div className="text-gray-600">Total Savings</div>
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '1s' }}>
            <div className="text-3xl font-bold text-[#007A5E] mb-2 hover-glow p-2 rounded-lg transition-all duration-300 animate-pulse-slow">
              4.9/5
            </div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
} 