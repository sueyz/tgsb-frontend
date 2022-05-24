import clsx from 'clsx'
import {FC} from 'react'

type Props = {
  className?: string
  scroll?: boolean
  height?: number
  children: React.ReactNode
}

const KTCardBody: FC<Props> = (props) => {
  const {className, scroll, height, children} = props
  return (
    <div
      className={clsx(
        'card-body',
        className && className,
        {
          'card-scroll': scroll,
        },
        height && `h-${height}px`
      )}
    >
      {children}
    </div>
  )
}

export {KTCardBody}
