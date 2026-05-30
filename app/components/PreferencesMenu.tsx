"use client"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemSeparator, ItemTitle } from '@/components/ui/item';
import { Toggle } from '@/components/ui/toggle';
import { BookIcon, BriefcaseBusiness, CheckCheckIcon, CheckIcon, ComputerIcon, Home, MusicIcon, PaintBucketIcon, SportShoeIcon, TreePineIcon } from 'lucide-react';
import React, { useState } from 'react'
const PreferencesMenu = () => {
  const [selected, setSelected] = useState<string[]>([])

  const interests = [
    { name: 'Technology', icon: ComputerIcon },
    { name: 'Business', icon: BriefcaseBusiness },
    { name: 'Sports', icon: SportShoeIcon },
    { name: 'Art', icon: PaintBucketIcon },
    { name: 'Music', icon: MusicIcon },
    { name: 'Nature', icon: TreePineIcon },
    { name: 'Reading', icon: BookIcon },
    { name: 'Design', icon: PaintBucketIcon },
  ]

  const toggleInterest = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    )
  }

  return (
    <div className="flex-1 min-w-0 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">Select your interests</h1>
          <p className="text-base text-muted-foreground">
            Choose topics you&apos;re interested in to personalize your experience
          </p>
        </div>

        {/* Pills Container - Flexbox wrapping */}
        <div className="flex flex-wrap gap-3 mb-8">
          {interests.map((interest) => {
            const Icon = interest.icon
            const isSelected = selected.includes(interest.name)

            return (
              <button
                key={interest.name}
                onClick={() => toggleInterest(interest.name)}
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

        {/* Counter and Help Text */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {selected.length} of {interests.length} selected
          </p>
          <p className="text-xs text-muted-foreground">
            You can change these anytime in settings
          </p>
        </div>
      </div>
    </div>
  )
}

export default PreferencesMenu