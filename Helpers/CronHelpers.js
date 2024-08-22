const axios = require("axios");
const Event = require("../Models/eventModelv2");
const TicketRate = require("../Models/ticketRateModelv2");
const Organization = require("../Models/organizationModel");
const deepEqual = require("deep-equal");

const API_KEY =
  "sk_test_2jRIs1i0WWS6WwqCSgGe66oQEQUSmU06I2q06I6SsWkMYGOs2skKUIMusG2uUYwgasYSIKUCkKM2WmqC2COKsesYWeoKYCESWYkG";

function cleanObject(obj) {
  const { _id, __v, ...cleanedObj } = obj;
  return cleanedObj;
}

async function fetchAndStoreEvents() {
  try {
    const response = await axios.get(
      "https://channels-service-alpha.fourvenues.com/events",
      {
        headers: {
          "X-Api-Key": API_KEY,
        },
      }
    );
    const events = response.data.data;
    //console.log("EVENTS IS:", events);

    for (const event of events) {
    //   const existingEvent = await Event.findOne({ eventId: event._id }).lean();

    //   const cleanedExistingEvent = existingEvent
    //     ? cleanObject(existingEvent)
    //     : null;
    //   console.log("CLEANED:::::::::::", cleanedExistingEvent);

    //   if (!existingEvent || !deepEqual(cleanedExistingEvent, event)) {
    //     console.log("CHANGES IN EVENT FOUND. UPDATING IN DATABASE!!!!");
        await Event.updateOne(
          { eventId: event._id },
          {
            eventId: event._id,
            name: event.name,
            slug: event.slug,
            description: event.description,
            display_date: event.display_date,
            start_date: event.start_date,
            end_date: event.end_date,
            code: event.code,
            age: event.age,
            image_url: event.image_url,
            outfit: event.outfit,
            ambiences: event.ambiences,
            music_genres: event.music_genres,
            artists: event.artists,
            organization_id: event.organization_id,
            location: event.location,
          },
          { upsert: true }
        );

        // Fetch and store ticket rates for the event
        await fetchAndStoreTicketRates(event._id);
    //   } else {
    //     console.log("NO CHANGES FOUND!");
    //   }
    }

    console.log("Events and ticket rates updated/inserted successfully");
  } catch (error) {
    console.error("Error fetching or storing events:", error);
  }
}

async function fetchAndStoreTicketRates(eventId) {
  try {
    const response = await axios.get(
      `https://channels-service-alpha.fourvenues.com/ticket-rates?event_id=${eventId}`,
      {
        headers: {
          "X-Api-Key": API_KEY,
        },
      }
    );

    const ticketRates = response.data.data;
    //console.log("------------------------------------------");
    //console.log("TICKET RATES IS:", ticketRates);

    for (const rate of ticketRates) {
    //   const existingRate = await TicketRate.findOne({
    //     ticketRateId: rate._id,
    //   }).lean();

    //   const cleanedExistingRate = existingRate
    //     ? cleanObject(existingRate)
    //     : null;

    //   if (!existingRate || !deepEqual(cleanedExistingRate, rate)) {
    //     console.log("CHANGES IN TICKET RATE FOUND. UPDATING IN DATABASE!!!!");
        await TicketRate.updateOne(
          { ticketRateId: rate._id },
          {
            ticketRateId: rate._id,
            organization_id: rate.organization_id,
            event_id: rate.event_id,
            name: rate.name,
            slug: rate.slug,
            valid_from: rate.valid_from,
            complete: rate.complete,
            type: rate.type,
            show_all_prices: rate.show_all_prices,
            prices: rate.prices.map((price) => ({
              priceId: price._id,
              name: price.name,
              price: price.price,
              valid_until: price.valid_until,
              fee_type: price.fee_type,
              fee_quantity: price.fee_quantity,
              includes: price.includes,
              additional_info: price.additional_info,
              quantity: price.quantity,
            })),
            supplements: rate.supplements.map((supplement) => ({
              supplementId: supplement._id,
              label: supplement.label,
              price: supplement.price,
            })),
            warranty: rate.warranty,
            available: rate.available,
            current_price: {
              priceId: rate.current_price._id,
              name: rate.current_price.name,
              price: rate.current_price.price,
              valid_until: rate.current_price.valid_until,
              fee_type: rate.current_price.fee_type,
              fee_quantity: rate.current_price.fee_quantity,
              includes: rate.current_price.includes,
              additional_info: rate.current_price.additional_info,
              quantity: rate.current_price.quantity,
            },
            availability: rate.availability,
            min: rate.min,
            max: rate.max,
            fields: rate.fields,
            questions: rate.questions.map((question) => ({
              questionId: question._id,
              label: question.label,
              type: question.type,
              required: question.required,
              items: question.items,
            })),
          },
          { upsert: true }
        );
    //   } else {
    //     console.log("NO CHANGES IN TICKET FOUND");
    //   }
    }

    console.log(
      `Ticket rates for event ${eventId} updated/inserted successfully`
    );
  } catch (error) {
    console.error(
      `Error fetching or storing ticket rates for event ${eventId}:`,
      error
    );
  }
}

async function fetchAndStoreOrganizations() {
  try {
    const response = await axios.get(
      "https://channels-service-alpha.fourvenues.com/organizations",
      {
        headers: {
          "X-Api-Key": API_KEY,
        },
      }
    );

    const organizations = response.data.data;

    //console.log("ORGANIZATIONS ARE::::::", organizations)

    for (const org of organizations) {
    //   const existingOrg = await Organization.findOne({
    //     organizationId: org._id,
    //   }).lean();

    //   const cleanedExistingOrg = existingOrg ? cleanObject(existingOrg) : null;

    //   if (!existingOrg || !deepEqual(cleanedExistingOrg, org)) {
    //     console.log("CHANGES IN ORGS FOUND!!!. UPDATING IN DATABASE!!!!");
        await Organization.updateOne(
          { organizationId: org._id },
          {
            organizationId: org._id,
            name: org.name,
            slug: org.slug,
          },
          { upsert: true }
        );
    //   } else {
    //     console.log("NO CHANGES IN ORG FOUND");
    //   }
    }

    
  } catch (err) {
    console.log("ERROR WHILE FETCHING AND STORING ORGANIZATIONS:", err);
  }
}

module.exports = {
  fetchAndStoreEvents,
  fetchAndStoreOrganizations
};
