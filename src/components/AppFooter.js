import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <span className="ms-1"> Zijag Hub &copy; 2026 </span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Designed by</span>
        <a href="https://twitter.com/akjesus01" target="_blank" rel="noopener noreferrer">
          @akjesus
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
