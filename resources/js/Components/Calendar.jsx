import React from "react";
import "../../sass/_calendarStyle.scss";

const Calendar = ({className=''}) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.toLocaleString("default", {
      month: "long",
    });
    const numDays = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentDate.getMonth(), 1).getDay();
    const days = Array.from({ length: 38 }, (_, i) => {
      const day = i - firstDay + 1;
      return day > 0 && day <= numDays ? day : day < numDays ? day - numDays : -1;
    });
  
    const rows = [];
    for (let i = 0; i < days.length; i += 7) {
      const row = days.slice(i, i + 7);
      rows.push(row);
    }
  
    return (
      <div className={"container h-full p-4 " + className}>
        <h2>
          {currentMonth} {currentYear}
        </h2>
        <table className="calendar">
          <thead>
            <tr>
              <th>do.</th>
              <th>lu.</th>
              <th>ma.</th>
              <th>mi.</th>
              <th>ju.</th>
              <th>vi.</th>
              <th>sa.</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((day, cellIndex) => {
                  const isCurrentMonth = day > 0 && day <= numDays;
                  const isToday =
                    isCurrentMonth &&
                    day === currentDate.getDate() &&
                    currentMonth === currentDate.toLocaleString("default", {
                      month: "long",
                    });
                  const isNextMonth = day > numDays;
                  const isLastEightDays =
                    day < numDays  - 4  && day >= numDays;
  
                  return (
                    <td
                      key={cellIndex}
                      className={`cell ${
                        isToday ? "current-day" : ""
                      } ${
                        !isCurrentMonth ? "other-month-day" : ""
                      } ${
                        isNextMonth ? "next-month-day" : ""
                      } ${isLastEightDays ? "last-eight-days" : ""}`}
                    >
                      {day > 0 ? day : ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
export default Calendar;
