type IwFormColorHexString = `#${string}`

type IwFormColorRgbArray = [number, number, number] | [number, number, number, number]

type IwFormColorRgbString = `${'RGB' | 'rgb'}(${number},${number},${number})`
    | `${'RGBA' | 'rgba'}(${number},${number},${number},${number})`
