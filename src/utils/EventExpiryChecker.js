import Event from "../models/Event.model.js";

const checkAndExpireEvent = async (event) => {

  if (!event) return null;

  const now = new Date();

  if (event.status === "ACTIVE" && now >= event.endTime) {

    event.status = "ENDED";
    await event.save();

    // Expire all unused tokens of this event
    await Token.updateMany(
      {
        eventId: event._id,
        status: "UNUSED",
      },
      {
        status: "EXPIRED",
      }
    );
  }

  return event;
};

export default checkAndExpireEvent;
