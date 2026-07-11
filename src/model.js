export const MODEL = {
  "regionMap": {
    "Amsterdam": 14355.3,
    "Bemelen": 20139.8,
    "Breda": 10589.2,
    "Delft": 11538.1,
    "Den Bosch": 11315.2,
    "Eindhoven": 9610.2,
    "Groningen": 11498.7,
    "Haarlem": 11981.0,
    "Hoofddorp": 10291.0,
    "Leeuwarden": 10650.6,
    "Maastricht": 22630.1,
    "Middelburg": 12203.3,
    "Nijmegen": 12186.9,
    "Roermond": 11727.6,
    "Rotterdam": 12374.8,
    "Scheveningen": 12988.3,
    "The Hague": 12715.4,
    "Utrecht": 12256.3,
    "Valkenburg": 12294.4,
    "Vlissingen": 13010.4,
    "Voorthuizen": 14464.8,
    "Zandvoort": 13315.3,
    "Zwolle": 10002.0
  },
  "roomTypeMap": {
    "Apartment/Studio": 13968.6,
    "Dorm/Pod": 11275.2,
    "Double": 10811.2,
    "Family": 15071.8,
    "King": 14840.2,
    "Other": 15533.8,
    "Single": 12760.9,
    "Suite": 14323.6,
    "Twin": 11440.4,
    "Villa/Chalet": 14142.6
  },
  "globalMean": 12866.9,
  "coefficients": {
    "RegionEnc": 1.3765,
    "RoomTypeEnc": 0.4238,
    "Rating": 1141.7906,
    "ReviewsLog": -18.041,
    "HasView": 1912.8726,
    "HasBalcony": 354.4042,
    "IsDeluxePremium": 748.9353
  },
  "intercept": -19929.02,
  "metrics": {
    "mae": 4016.93,
    "r2": 0.2257,
    "mape": 0.3012
  },
  "regions": [
    "Amsterdam",
    "Bemelen",
    "Breda",
    "Delft",
    "Den Bosch",
    "Eindhoven",
    "Groningen",
    "Haarlem",
    "Hoofddorp",
    "Leeuwarden",
    "Maastricht",
    "Middelburg",
    "Nijmegen",
    "Roermond",
    "Rotterdam",
    "Scheveningen",
    "The Hague",
    "Utrecht",
    "Valkenburg",
    "Vlissingen",
    "Voorthuizen",
    "Zandvoort",
    "Zwolle"
  ],
  "roomTypes": [
    "Apartment/Studio",
    "Dorm/Pod",
    "Double",
    "Family",
    "King",
    "Other",
    "Single",
    "Suite",
    "Twin",
    "Villa/Chalet"
  ],
  "ratingRange": [
    3.7,
    10.0
  ],
  "reviewsRange": [
    1,
    7748
  ]
};

// Predicts nightly hotel price (INR) from a Ridge regression trained on
// Netherlands hotel listings. Runs entirely client-side — no server call.
export function predictPrice({ region, roomType, rating, reviewsCount, hasView, hasBalcony, isDeluxe }) {
  const regionEnc = MODEL.regionMap[region] ?? MODEL.globalMean;
  const roomTypeEnc = MODEL.roomTypeMap[roomType] ?? MODEL.globalMean;
  const reviewsLog = Math.log1p(Math.max(0, reviewsCount));
  const c = MODEL.coefficients;

  const raw =
    MODEL.intercept +
    c.RegionEnc * regionEnc +
    c.RoomTypeEnc * roomTypeEnc +
    c.Rating * rating +
    c.ReviewsLog * reviewsLog +
    c.HasView * (hasView ? 1 : 0) +
    c.HasBalcony * (hasBalcony ? 1 : 0) +
    c.IsDeluxePremium * (isDeluxe ? 1 : 0);

  return Math.max(1500, Math.round(raw));
}
