"use client"

import React, { useEffect, useState } from 'react'

import {
  AtomIcon,
  BookIcon,
  BrainIcon,
  CheckIcon,
  Church,
  Cpu,
  Earth,
  Hourglass,
  PaintBucketIcon,
  PersonStanding,
  PiSquareIcon,
  Scale,
  SportShoe,
  Users
} from 'lucide-react'

import PersonalityButton from '../Preferences/PersonalityButton'
import { useAuth } from '@/app/context/AuthContext';
import { redirect, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { delay } from '@/app/utils/helpers/delay';

const PreferencesMenu = () => {
  const [selected, setSelected] = useState<number[]>([])
  const { userDataObj } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!userDataObj?.embedding_sum) return;
  
    toast("Welcome Back!");
  
    const timeout = setTimeout(() => {
      router.replace("/app");
    }, 3000);
  
    return () => clearTimeout(timeout);
  }, [userDataObj?.embedding_sum, router]);

  const interests = [
    { name: 'General Reference', icon: BookIcon, id: 1 },
    { name: 'Culture and the Arts', icon: PaintBucketIcon, id: 2 },
    { name: 'Geography and Places', icon: Earth, id: 3 },
    { name: 'Health and Fitness', icon: SportShoe, id: 4 },
    { name: 'History and Events', icon: Hourglass, id: 5 },
    { name: 'Human Activities', icon: PersonStanding, id: 6 },
    { name: 'Mathematics and Logic', icon: PiSquareIcon, id: 7 },
    { name: 'Natural and Physical Sciences', icon: AtomIcon, id: 8 },
    { name: 'People and Self', icon: BrainIcon, id: 9 },
    { name: 'Philosophy and Thinking', icon: Scale, id: 10 },
    { name: 'Religion and Belief Systems', icon: Church, id: 11 },
    { name: 'Society and Social Sciences', icon: Users, id: 12 },
    { name: 'Technology and Applied Sciences', icon: Cpu, id: 13 }
  ]

  const toggleInterest = (id: number) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="flex-1 min-w-0 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Select your interests
          </h1>
          <p className="text-base text-muted-foreground">
            Choose topics you&apos;re interested in to personalize your experience
          </p>
        </div>

        {/* Interest Pills */}
        <div className="flex flex-wrap gap-3 mb-8">
          {interests.map((interest) => {
            const Icon = interest.icon
            const isSelected = selected.includes(interest.id)

            return (
              <button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-card border border-border text-foreground hover:border-primary/50 hover:bg-card/80'
                }`}
                aria-label={`${isSelected ? 'Deselect' : 'Select'} ${interest.name}`}
              >
                <Icon className="w-4 h-4" />
                <span>{interest.name}</span>
                {isSelected && <CheckIcon className="w-4 h-4 ml-1" />}
              </button>
            )
          })}
        </div>

        <PersonalityButton selectedItems={selected} />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {selected.length} of {interests.length} selected
          </p>
        </div>
      </div>
    </div>
  )
}

export default PreferencesMenu