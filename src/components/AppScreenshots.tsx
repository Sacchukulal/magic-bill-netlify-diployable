import { motion } from 'motion/react';

export function AppScreenshots() {
  const screenshots = [
    {
      id: 1,
      src: '/screenshot1.jpeg',
      alt: 'Magicbill Dashboard Overview',
      title: 'Comprehensive Dashboard',
      description: 'Get a clear view of your daily sales, expenses, and net profit at a glance.'
    },
    {
      id: 2,
      src: '/screenshot2.jpeg',
      alt: 'Sales Visualization and Orders',
      title: 'Detailed Analytics',
      description: 'Visualize sales by category, payment modes, and monitor recent orders in real-time.'
    },
    {
      id: 3,
      src: '/screenshot3.jpeg',
      alt: 'Business Overview and Trends',
      title: 'Business Overview',
      description: 'Track revenue vs expenses trends over time and identify your top-selling items.'
    }
  ];

  return (
    <section className="py-24 bg-white sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-brand-600">App Preview</h2>
          <p className="mt-2 text-3xl font-display font-bold tracking-tight text-slate-900 sm:text-4xl">
            See Magicbill in Action
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            A clean, modern, dark-themed interface built for speed and ease of use in fast-paced restaurant environments.
          </p>
        </div>

        <div className="space-y-24">
          {screenshots.map((screenshot, index) => (
            <motion.div 
              key={screenshot.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className={`flex flex-col lg:flex-row gap-12 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
            >
              <div className="flex-1 w-full relative">
                 <div className="absolute inset-0 bg-gradient-to-tr from-brand-100 to-blue-50 transform -skew-y-3 rounded-3xl -z-10"></div>
                 <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800 p-2 sm:p-4">
                    <img 
                      src={screenshot.src} 
                      alt={screenshot.alt} 
                      onError={(e) => {
                        e.currentTarget.src = `https://picsum.photos/seed/magicbill${index}/1024/768`;
                      }}
                      className="w-full h-auto rounded-xl ring-1 ring-white/10 object-cover"
                      referrerPolicy="no-referrer"
                    />
                 </div>
              </div>
              <div className="flex-1 lg:max-w-md">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-100 text-brand-600 font-bold font-display text-xl mb-6">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-display font-bold text-slate-900 mb-4">{screenshot.title}</h3>
                <p className="text-lg text-slate-600">{screenshot.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
