import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Dashboard from './components/Dashboard'

export default function Home() {
  redirect('/dashboard')
}
