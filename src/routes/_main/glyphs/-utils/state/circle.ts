import type { StateTransitionFn } from './types'

export const CIRCLE_CHARS = [
  '=◯,!=©,@=®,^=°,/=∅',
  'a=ⓐ,b=ⓑ,c=ⓒ,d=ⓓ,e=ⓔ,f=ⓕ,g=ⓖ,h=ⓗ,i=ⓘ,j=ⓙ,k=ⓚ,l=ⓛ,m=ⓜ,n=ⓝ,o=ⓞ,p=ⓟ,q=ⓠ,r=ⓡ,s=ⓢ,t=ⓣ,u=ⓤ,v=ⓥ,w=ⓦ,x=ⓧ,y=ⓨ,z=ⓩ',
  'A=Ⓐ,B=Ⓑ,C=Ⓒ,D=Ⓓ,E=Ⓔ,F=Ⓕ,G=Ⓖ,H=Ⓗ,I=Ⓘ,J=Ⓙ,K=Ⓚ,L=Ⓛ,M=Ⓜ,N=Ⓝ,O=Ⓞ,P=Ⓟ,Q=Ⓠ,R=Ⓡ,S=Ⓢ,T=Ⓣ,U=Ⓤ,V=Ⓥ,W=Ⓦ,X=Ⓧ,Y=Ⓨ,Z=Ⓩ',
  '0=⓪',
  '1=①,2=②,3=③,4=④,5=⑤,6=⑥,7=⑦,8=⑧,9=⑨,10=⑩',
  '11=⑪,12=⑫,13=⑬,14=⑭,15=⑮,16=⑯,17=⑰,18=⑱,19=⑲,20=⑳',
  '21=㉑,22=㉒,23=㉓,24=㉔,25=㉕,26=㉖,27=㉗,28=㉘,29=㉙,30=㉚',
  '31=㉛,32=㉜,33=㉝,34=㉞,35=㉟,36=㊱,37=㊲,38=㊳,39=㊴,40=㊵',
  '41=㊶,42=㊷,43=㊸,44=㊹,45=㊺,46=㊻,47=㊼,48=㊽,49=㊾,50=㊿',
  '-=●,-0=⓿',
  '-1=❶,-2=❷,-3=❸,-4=❹,-5=❺,-6=❻,-7=❼,-8=❽,-9=❾,-10=❿',
  '-11=⓫,-12=⓬,-13=⓭,-14=⓮,-15=⓯,-16=⓰,-17=⓱,-18=⓲,-19=⓳,-20=⓴',
  '+=◎',
  '+1=⓵,+2=⓶,+3=⓷,+4=⓸,+5=⓹,+6=⓺,+7=⓻,+8=⓼,+9=⓽,+10=⓾',
]
  .join(',')
  .split(',')
  .map((entry) => {
    const [key, value] = entry.split('=')
    return [key, value]
  })

const COMMIT_KEYS = ['Enter', ' ', 'Tab']

export const nextStateCircle: StateTransitionFn = (state, action) => {
  const { key } = action

  if (!state || state.type !== 'circle') {
    throw new Error('Invalid state type for nextStateCircle')
  }

  const commit = () => {
    action.preventDefault()
    const matchedEntry = CIRCLE_CHARS.find(([k]) => k === state.input)
    if (matchedEntry) {
      return {
        newState: null,
        input: matchedEntry[1],
      }
    } else {
      return {
        newState: null,
        input: null,
      }
    }
  }

  if (key === 'Backspace') {
    action.preventDefault()
    if (state.input.length === 0) {
      return {
        newState: null,
        input: null,
      }
    }
    return {
      newState: {
        ...state,
        input: state.input.slice(0, -1),
      },
      input: null,
    }
  }
  if (COMMIT_KEYS.includes(key)) return commit()

  const { input } = state
  if (key.length === 1) {
    const newInput = input + key
    const matchedEntry = CIRCLE_CHARS.filter(([k]) => k.startsWith(newInput))
    if (matchedEntry.length === 1) {
      action.preventDefault()
      return {
        newState: null,
        input: matchedEntry[0][1],
      }
    }
    if (matchedEntry.length === 0) {
      if (key.toLowerCase() === 'o') {
        return { ...commit(), newState: { type: 'circle', input: '' } }
      }
      return {
        newState: state,
        input: null,
      }
    }
    if (matchedEntry.length > 1) {
      action.preventDefault()
      return {
        newState: {
          ...state,
          input: newInput,
        },
        input: null,
      }
    }
  }

  return {
    newState: state,
    input: null,
  }
}
