import type React from "react"

type CountryFlagProps = {
  countryCode: string
}

export const CountryFlag: React.FC<CountryFlagProps> = ({ countryCode }) => {
  // Convert country code to lowercase for consistency with flag APIs
  const code = countryCode.toLowerCase()

  return (
    <div className="flex items-center">
      <img
        src={`https://flagcdn.com/16x12/${code}.png`}
        srcSet={`https://flagcdn.com/32x24/${code}.png 2x, https://flagcdn.com/48x36/${code}.png 3x`}
        width="16"
        height="12"
        alt={`Flag of ${countryCode}`}
        className="rounded-sm"
      />
    </div>
  )
}

