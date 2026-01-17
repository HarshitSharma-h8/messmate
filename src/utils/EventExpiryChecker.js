import Event from "../models/Event.model.js";

const checkAndExpireEvent = async (event) => {

  if (!event) return null;

  const now = new Date();

  if (event.status === "ACTIVE" && now >= event.endTime) {

    event.status = "ENDED";
    await event.save();

    return event;
  }

  return event;
};

export default checkAndExpireEvent;
