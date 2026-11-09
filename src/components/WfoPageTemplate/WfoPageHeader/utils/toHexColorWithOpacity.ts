export const toHexColorWithOpacity = (hexColor: string, opacity: number) => {
  const opacityHex = Math.round(opacity * 255).toString(16);

  return `${hexColor}${opacityHex}`;
};
