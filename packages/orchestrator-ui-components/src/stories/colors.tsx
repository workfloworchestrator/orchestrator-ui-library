import React from 'react'
import { ColorPalette, ColorItem} from '@storybook/blocks'
import { useOrchestratorTheme } from '../hooks'

export const Colors = () => {
  const { theme, toSecondaryColor } = useOrchestratorTheme()
  const colorItems = []
  const themeColors = theme.colors

  if(themeColors) {
    for(const [name, hex] of Object.entries(themeColors)) {
      const color = hex as string // Casting here because TS gets confused by the LIGHT/DARK theme pattern and cant decide
      colorItems.push(
        <ColorItem 
        key={name}
        title={name}
        subtitle='toSecondary'
        colors={[color, toSecondaryColor(color)]}
      />    
      )
    }
  }

  return (
    <ColorPalette>
      {colorItems}
    </ColorPalette>
  
  )
}