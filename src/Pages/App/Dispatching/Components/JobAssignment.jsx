import React from "react";
import Scheduler from "react-big-scheduler";
import { notify } from "Services/ToastService";

function JobAssignment({ 
  schedulerData, 
  dndSources, 
  newEvent, 
  updateEventStart, 
  updateEventEnd,
  prevClick,
  nextClick,
  moveEvent,
  eventItemClick,
  viewChanged
}) {

  const onSelectDate = (e) => console.log("select date:", e);
  const movingEvent = () => {};
  const popOverTemplate = (schedulerData, eventItem, title, start, end, statusColor) => {
    return (
      <>
        <h1>{title}</h1>
      </>
    );
  };
  const conflictOccurred = (schedulerData, action, event, type, slotId, slotName, start, end) => {
    notify(`you already have overlapping job.`,false);
  }
  return (
    <div>

      {schedulerData !== null && (
      <Scheduler
        schedulerData={schedulerData}
        prevClick={prevClick}
        nextClick={nextClick}
        onSelectDate={onSelectDate}
        onViewChange={viewChanged}
        eventItemClick={eventItemClick}
        dndSources={dndSources}
        movingEvent={movingEvent}
        moveEvent={moveEvent}
        newEvent={newEvent}
        updateEventStart={updateEventStart}
        updateEventEnd={updateEventEnd}
        eventItemPopoverTemplateResolver={popOverTemplate}
        conflictOccurred={conflictOccurred}
      />
      )}
    </div>
  );
}

//export default DragDropContext(HTML5Backend)(JobAssignment);
export default JobAssignment;
