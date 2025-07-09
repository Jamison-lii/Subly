import Link from 'next/link';

export default function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started with subscription tracking.',
      features: [
        'Up to 5 subscriptions',
        'Basic alerts',
        'Manual entry',
        'Email support',
        'Mobile app access'
      ],
      cta: 'Get Started Free',
      popular: false
    },
    {
      name: 'Pro',
      price: '$3.99',
      period: 'per month',
      description: 'For serious subscription managers who want AI insights.',
      features: [
        'Unlimited subscriptions',
        'AI-powered insights',
        'Cancel assistance',
        'Priority support',
        'Advanced analytics',
        'Export reports'
      ],
      cta: 'Start Pro Trial',
      popular: true
    },
    {
      name: 'Plus',
      price: '$6.99',
      period: 'per month',
      description: 'For teams and families who want shared management.',
      features: [
        'Everything in Pro',
        'Shared profiles',
        'Smart budget analytics',
        'AI chat assistant',
        'Team collaboration',
        'Custom integrations'
      ],
      cta: 'Start Plus Trial',
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-[#007A5E]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#D5FFE4]/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. Start free and upgrade anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative bg-white rounded-2xl p-8 shadow-sm border-2 hover-lift animate-fade-in-up ${
                plan.popular 
                  ? 'border-[#007A5E] shadow-lg scale-105' 
                  : 'border-gray-100'
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#007A5E] text-white px-4 py-1 rounded-full text-sm font-semibold animate-pulse-slow">
                  Most Popular
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#007A5E] transition-colors duration-300">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center group">
                    <svg className="w-5 h-5 text-[#007A5E] mr-3 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/auth/signup"
                className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover-lift focus-ring ${
                  plan.popular
                    ? 'bg-[#007A5E] text-white hover:bg-[#006B52] hover-glow'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </Link>
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#007A5E]/5 to-[#D5FFE4]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Enhanced FAQ Section */}
        <div className="mt-20 text-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left group hover-lift p-6 rounded-lg transition-all duration-300">
              <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-[#007A5E] transition-colors duration-300">Can I cancel anytime?</h4>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Yes, you can cancel your subscription at any time with no questions asked.</p>
            </div>
            <div className="text-left group hover-lift p-6 rounded-lg transition-all duration-300">
              <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-[#007A5E] transition-colors duration-300">Is my data secure?</h4>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">We use bank-level encryption and never store your banking credentials.</p>
            </div>
            <div className="text-left group hover-lift p-6 rounded-lg transition-all duration-300">
              <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-[#007A5E] transition-colors duration-300">Do you support my country?</h4>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">We support 50+ countries with local payment methods and banking integrations.</p>
            </div>
            <div className="text-left group hover-lift p-6 rounded-lg transition-all duration-300">
              <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-[#007A5E] transition-colors duration-300">What if I need help?</h4>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Our support team is available via email, chat, and phone for all users.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 