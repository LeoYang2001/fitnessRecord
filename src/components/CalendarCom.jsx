import React, { useEffect, useState } from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Badge from '@mui/material/Badge';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import CheckIcon from '@mui/icons-material/Check';
import { green } from '@mui/material/colors';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { convertToYearMonth, filterDatesByMonth } from '../utility';
import { useSelector } from 'react-redux';

const CalendarCom = ({dateVal, setDateVal, records}) => {

    const weightRecords = records

    const requestAbortController = React.useRef(null);
    const [highlightedDays, setHighlightedDays] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
        


   useEffect(() => {
        fetchHighlightedDays(dateVal);
        setTimeout(()=>{
            setIsLoading(false)
        },600)
        // abort request on unmount
        return () => requestAbortController.current?.abort();
      }, [weightRecords]);
    

   
    function ServerDay(props) {
        const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
      
        const isSelected =
          !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;
      
        return (
          <Badge
            key={props.day.toString()}
            overlap="circular"
            badgeContent={isSelected ? <CheckIcon
                sx={{
                    color: green[500],
                    fontSize: 18
                }} /> : undefined}
          >
            <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
          </Badge>
        );
      }

      const fetchHighlightedDays = (date) => {
        const controller = new AbortController();
        
        let monthYear = convertToYearMonth(date.toString())
        let filteredDates = filterDatesByMonth(monthYear, weightRecords)
        setHighlightedDays(filteredDates)

        requestAbortController.current = controller;
      };

      
    
      const handleMonthChange = (date) => {
        if (requestAbortController.current) {
          requestAbortController.current.abort();
        }
    
        setHighlightedDays([]);
        fetchHighlightedDays(date);
      };

  return (
    <section className=' flex justify-center items-start mt-10 w-full'>
        <div style={{width:400}} className=' calendar-container bg-white border '>
         <DateCalendar
         loading={isLoading}
         onMonthChange={handleMonthChange}
         renderLoading={() => <DayCalendarSkeleton />}
         showDaysOutsideCurrentMonth
         slots={{
            day:ServerDay
         }}
         slotProps={{
            day: {
              highlightedDays,
            },
          }}
         value={dateVal} onChange={(newValue) => setDateVal(newValue)} />
    </div>
    </section>
  )
}

export default CalendarCom