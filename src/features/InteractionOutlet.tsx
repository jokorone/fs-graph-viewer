import React from 'react';

export const InteractionOutlet = React.memo((
  props: { hoveredId: string | null }
) => {
  return (
    <div className='pointer-events-none absolute top-16 left-1/2 transform -translate-x-1/2 text-gray-300 font-bold'>
      {
        Boolean(props.hoveredId)
        && <span className='text-4xl pointer-events-none outline-none'>
            {props.hoveredId}
          </span>
      }
    </div>
  )

});
