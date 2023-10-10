import React, { ReactNode } from 'react';



interface WFONoResultsProps {
  text: string
  icon: ReactNode
}

export const WFONoResults = ({text, icon}: WFONoResultsProps) => {
  return (
    <h1>Loading...</h1>
  )
}
