import React, { useState } from 'react'
import { LineChart } from '@mui/x-charts';
import { useSelector } from 'react-redux';
import { analyzeWeightRecord, formatDateArray, weightDataFormat } from '../utility';
import { useEffect } from 'react';

const BasicLineChart = () => {

    

    const weightRecords = useSelector((state) => state.weightRecords.value)

    const {lastSevenRecords, lastThirtyRecords} = weightDataFormat(weightRecords)
    const [displayData, setDisplayData] = useState(lastSevenRecords)
    const buttons = [
        {
            id:1,
            name:'7 records',
            showRecords: lastSevenRecords
        },
        {
            id:2,
            name:'30 records',
            showRecords: lastThirtyRecords
        },
    ]
    
    const [chartThemeColor, setChartThemeColor] = useState({
        color:'red'
    })

    useEffect(() => {
      setChartThemeColor({
        color:'white'
      })
    }, [])
    

    const [highlightId, setHighlightId] = useState(1)
    
    const filterDisplay = (data)=>{
        setDisplayData(data)
    }
  return (
    <div className='w-full h-full justify-center flex relative'>
        <LineChart
        sx={(theme) => ({
            '.MuiChartsAxis-line, .MuiLineChart-tickLine': {
            stroke: chartThemeColor.color, // Customize the color of the axis lines and ticks
            },
            '.MuiChartsAxis-tickLabel': {
            fill: chartThemeColor.color, // Customize the color of the axis tick labels
            },
        })}
        //   xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
        xAxis={[{ scaleType: 'band', data: displayData.dates }]}
        series={[
            {
            data: displayData.weights,
            color: 'green', // You can also specify the color directly in the series data
            },
        ]}
        slotProps={{
            loadingOverlay: { message: 'Data Should be available soon' },
        }}
        width={displayData.chartWidth}
        height={300}
        />
        
        <div className=' absolute  text-black  right-2 top-2  justify-between flex gap-4  py-1 px-1 rounded-full bg-white'>
           {
            buttons.map((button)=>(
                <div
                key={button.id}
                onClick={()=>{
                    filterDisplay(button.showRecords)
                    setHighlightId(button.id)

                }} className={`button-highlight ${highlightId === button.id ? 'button-highlight-active' : ''} `}>
                        <span>{button.name}</span>
                </div>
            ))
           }
        </div>
  </div>
  )
}

export default BasicLineChart