import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'

const WidgetsDropdown = ({ stats, className }) => {
  const widgetChartRef1 = useRef(null)
  const widgetChartRef2 = useRef(null)

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary')
          widgetChartRef1.current.update()
        })
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info')
          widgetChartRef2.current.update()
        })
      }
    })
  }, [widgetChartRef1, widgetChartRef2])

  return (
    <CRow className={className} xs={{ gutter: 4 }}>
      {stats.map((stat, index) => (
        <CCol sm={6} xl={4} xxl={3} key={index}>
          <CWidgetStatsA
            color={stat.color}
            value={
              <>
                {stat.value}{' '}
                <span className="fs-6 fw-normal">
                  ({stat.change} <CIcon icon={stat.icon} />)
                </span>
              </>
            }
            title={stat.title}
            action={
              <CDropdown alignment="end">
                <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                  <CIcon icon={cilOptions} />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>Action</CDropdownItem>
                  <CDropdownItem>Another action</CDropdownItem>
                  <CDropdownItem>Something else here...</CDropdownItem>
                  <CDropdownItem disabled>Disabled action</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            }
            chart={
              <CChartLine
                className="mt-3 mx-3"
                style={{ height: '70px' }}
                data={stat.chartData}
                options={stat.chartOptions}
              />
            }
          />
        </CCol>
      ))}
    </CRow>
  )
}

WidgetsDropdown.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      change: PropTypes.string.isRequired,
      icon: PropTypes.object.isRequired,
      color: PropTypes.string.isRequired,
      chartData: PropTypes.object.isRequired,
      chartOptions: PropTypes.object.isRequired,
    })
  ).isRequired,
  className: PropTypes.string,
}

export default WidgetsDropdown
