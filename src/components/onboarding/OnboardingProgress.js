'use client'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Check, User, Plane, FileText } from 'lucide-react'

const steps = [
  {
    id: 'profile',
    name: 'Profile Setup',
    href: '/onboarding/profile',
    icon: User,
    description: 'Complete your pilot profile'
  },
  {
    id: 'aircraft',
    name: 'Add Aircraft',
    href: '/onboarding/aircraft',
    icon: Plane,
    description: 'Register your first aircraft'
  },
  {
    id: 'flights',
    name: 'First Flight',
    href: '/onboarding/flights',
    icon: FileText,
    description: 'Upload or log your first flight'
  }
]

export default function OnboardingProgress() {
  const pathname = usePathname()
  
  const getCurrentStep = () => {
    if (pathname.includes('/profile')) return 0
    if (pathname.includes('/aircraft')) return 1
    if (pathname.includes('/flights')) return 2
    return 0
  }

  const currentStep = getCurrentStep()

  return (
    <nav className="mb-8">
      <ol className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.id}
            className={cn(
              stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : '',
              'relative'
            )}
          >
            <div className="flex items-center">
              <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center">
                {stepIdx < currentStep ? (
                  <div className="h-10 w-10 rounded-full bg-sky-500 flex items-center justify-center">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                ) : stepIdx === currentStep ? (
                  <div className="h-10 w-10 rounded-full bg-sky-500 flex items-center justify-center">
                    <step.icon className="h-5 w-5 text-white" />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                    <step.icon className="h-5 w-5 text-slate-400" />
                  </div>
                )}
              </div>
              <div className="ml-4 min-w-0">
                <p className={cn(
                  'text-sm font-medium',
                  stepIdx <= currentStep ? 'text-sky-600' : 'text-slate-500'
                )}>
                  {step.name}
                </p>
                <p className="text-xs text-slate-500">
                  {step.description}
                </p>
              </div>
            </div>
            {stepIdx !== steps.length - 1 && (
              <div className="absolute top-5 left-5 -ml-px h-0.5 w-full bg-slate-200">
                <div
                  className={cn(
                    'h-0.5 bg-sky-500 transition-all duration-300',
                    stepIdx < currentStep ? 'w-full' : 'w-0'
                  )}
                />
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}