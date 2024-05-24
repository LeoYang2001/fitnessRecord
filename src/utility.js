function hexWithOpacity(color, opacity) {
    // Ensure the color is in the correct format
    if (color[0] === '#') {
        color = color.slice(1);
    }

    // Ensure the color is 6 characters long
    if (color.length === 3) {
        // Convert shorthand hex color (e.g., "abc") to full form (e.g., "aabbcc")
        color = color.split('').map(char => char + char).join('');
    }

    // Convert the color components to integers
    const r = parseInt(color.slice(0, 2), 16);
    const g = parseInt(color.slice(2, 4), 16);
    const b = parseInt(color.slice(4, 6), 16);

    // Apply the opacity to each color component
    const applyOpacity = (component, opacity) => {
        const result = Math.round(component * opacity);
        const hex = result.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    // Get the new color components with opacity applied
    const newR = applyOpacity(r, opacity);
    const newG = applyOpacity(g, opacity);
    const newB = applyOpacity(b, opacity);

    return `#${newR}${newG}${newB}`;
}

function convertToYearMonth(dateString) {
    // Create a Date object from the given string
    const date = new Date(dateString);
  
    // Extract the year and month components
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Month index starts from 0
  
    // Format the year and month as "YYYY-MM"
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}`;
  
    return formattedDate;
  }

  function filterDatesByMonth(monthYear, weightRecords) {
    const targetMonthYear = monthYear.slice(0, 7); // Extract only the year and month part
  
    // Filter the keys of weightRecords to find dates that match the target month
    const filteredDates = Object.keys(weightRecords)
      .filter(date => date.startsWith(targetMonthYear))
      .map(date => parseInt(date.slice(-2))); // Extract the day part and convert to number
  
    return filteredDates;
  }


  //a function to analyze weightRecord
  function analyzeWeightRecord(weightRecords){
      const dates = Object.keys(weightRecords)
      dates.sort()

      const firstRecordDate = dates[0]
      const lastRecordDate = dates[dates.length - 1]
      
    
      let latestWeight = Number(weightRecords[lastRecordDate]?.weight)
      let originalWeight = Number(weightRecords[firstRecordDate]?.weight)

  
      let weightsArr = []
      for(let date of dates)
      {
        weightsArr.push(weightRecords[date].weight)
      }


      let daysPassed = calculateDaysBetween(lastRecordDate, firstRecordDate)

      return {
        lastRecordDate,
        firstRecordDate,
        latestWeight,
        originalWeight,
        daysPassed,
        datesArr : dates,
        weightsArr
      }

  
  }

  function calculateDaysBetween(dateString1, dateString2) {
    // Parse the input strings as Date objects
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);

    // Calculate the difference in time
    const timeDifference = Math.abs(date1 - date2);

    // Convert the time difference from milliseconds to days
    const dayDifference = timeDifference / (1000 * 60 * 60 * 24);

    return dayDifference;
}
  

function getLastRecordWeight(weightRecords, dateString){
  let datesArr = analyzeWeightRecord(weightRecords).datesArr
  if(datesArr.length === 0) return null

  if(datesArr.indexOf(dateString) > 0)
  {
    
    let lastRecordWeightIndex = datesArr.indexOf(dateString) - 1
    let lastRecordWeight = weightRecords[datesArr[lastRecordWeightIndex]].weight
    return lastRecordWeight
  }
  else if(dateString > datesArr[datesArr.length - 1])
  {
    console.log('have not been recorded yet');
    
    let lastRecordWeight = weightRecords[datesArr[datesArr.length - 1]].weight
    return lastRecordWeight
  }
  else return null

}

function formatDateArray(dateArray) {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const formattedDates = dateArray.map(dateStr => {
    const [year, month, day] = dateStr.split('-');
    const monthName = months[parseInt(month, 10) - 1];
    const suffix = getDaySuffix(parseInt(day, 10));
    return `${monthName} ${parseInt(day, 10)}${suffix}`;
  });

  return formattedDates;
}

function getDaySuffix(day) {
  if (day >= 11 && day <= 13) {
    return 'th';
  }
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}


const weightDataFormat = (weightRecords)=>{
  const datesArr = analyzeWeightRecord(weightRecords).datesArr
  const weights = []
  const formattedDates = formatDateArray(datesArr);
  for(let date of datesArr)
  {
      weights.push(weightRecords[date].weight)
  }

  const lastSevenRecords = {
      dates : formattedDates.length > 7 ? formattedDates.slice(-7) : formattedDates,
      weights : weights.length > 7 ? weights.slice(-7) : weights,
      chartWidth: 800
   }

   const lastThirtyRecords = {
      dates : formattedDates.length > 30 ? formattedDates.slice(-30) : formattedDates,
      weights : weights.length > 30 ? weights.slice(-30) : weights,
      chartWidth: 1200
   }
  return {lastSevenRecords, lastThirtyRecords}
}



export {
  hexWithOpacity ,
   convertToYearMonth,
    filterDatesByMonth,
     analyzeWeightRecord ,
      getLastRecordWeight ,
      formatDateArray,
      weightDataFormat
    }