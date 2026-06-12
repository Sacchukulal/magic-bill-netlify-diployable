import { ChefHat, CreditCard, LineChart, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';

const features = [
  {
    name: 'Lightning-Fast Billing',
    description: 'Process orders and generate bills in seconds. Built for speed to handle peak hour rushes with zero lag.',
    icon: CreditCard,
  },
  {
    name: 'Kitchen Display System',
    description: 'Send orders directly to the kitchen. Track preparation times and reduce miscommunication between front and back of house.',
    icon: ChefHat,
  },
  {
    name: 'Real-time Analytics',
    description: 'Get actionable insights into your sales, best-selling items, and peak hours to optimize your restaurant operations.',
    icon: LineChart,
  },
  {
    name: 'Works on Any Device',
    description: 'Whether you use a desktop, tablet, or mobile phone, Magicbill adapts perfectly to your screen size.',
    icon: Smartphone,
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-slate-50 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-brand-600">Faster Operations</h2>
          <p className="mt-2 text-3xl font-display font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to run your restaurant
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Magicbill simplifies your workflow so you can focus on what matters most — delivering great food and excellent customer service.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.name} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col"
              >
                <dt className="text-base font-semibold leading-7 text-slate-900">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100/50">
                    <feature.icon className="h-6 w-6 text-brand-600" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-slate-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
