
import React from 'react'
import { NextIntlProvider } from 'next-intl'
import type { ReactNode } from 'react'
import { enUS, nlNL } from '@orchestrator-ui/orchestrator-ui-components'
import { useRouter  } from 'next/router'

interface TranslationsProviderProps {
  children: ReactNode,
}

export const TranslationsProvider = ({children}: TranslationsProviderProps) => {
  const router = useRouter()
  
  const defaultMessages = (() => {
    switch(router.locale) {
      case 'en-US':
        return enUS
      case 'nl-NL':
        return nlNL
      default:
        return enUS    
    }
  })()

  return (
    <NextIntlProvider messages={defaultMessages}>
      {children}
    </NextIntlProvider>
  )

}