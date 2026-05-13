import * as HugeIcons from '@hugeicons/react'

console.log('Available icons in @hugeicons/react:')
console.log(Object.keys(HugeIcons).filter(key => key.endsWith('Icon')).slice(0, 50))
