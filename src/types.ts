export type Route = 'home' | 'profile' | 'terms' | 'privacy' | 'refund' | 'contact' | 'login' | 'subscription' | 'demo-request';

export interface User {
  name: string;
  email: string;
  role: string;
}
