"use server";

export type AddressSuggestion = {
  placeId: string;
  text: {
    text: string;
  };
};

type AutocompleteResponse = {
  suggestions: {
    placePrediction: AddressSuggestion;
  }[];
};

type AddressComponent = {
  longText: string;
  shortText?: string;
  types: string[];
};

type PlaceDetailsResponse = {
  location: { latitude: number; longitude: number };
  addressComponents: AddressComponent[];
  googleMapsUri: string;
  timeZone: string;
  formattedAddress: string;
};

export type PlaceAddress = {
  placeId: string;

  formattedAddress: string;
  googleMapsUri: string;
  timeZone: string;

  streetName: string | null;
  streetNumber: string | null;
  postalCode: string | null;
  city: string;
  administrativeArea: string | null;
  countryCode: string;

  lat: number;
  lng: number;
};

function getComponent(
  components: AddressComponent[],
  type: string,
  useShort = false
): string | null {
  const component = components.find((c) => c.types.includes(type));
  if (!component) return null;
  return useShort ? (component.shortText ?? null) : component.longText;
}

function getCity(components: AddressComponent[]): string {
  return (
    getComponent(components, "locality") ||
    getComponent(components, "postal_town") ||
    getComponent(components, "administrative_area_level_2") ||
    ""
  );
}

export async function autocompleteAddress(
  query: string
): Promise<AddressSuggestion[]> {
  try {
    const res = await fetch(
      "https://places.googleapis.com/v1/places:autocomplete",
      {
        method: "POST",
        body: JSON.stringify({
          input: query,
          includedPrimaryTypes: [
            "street_address",
            "route",
            "premise",
            "subpremise",
          ],
        }),
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY!,
          "X-Goog-FieldMask":
            "suggestions.placePrediction.placeId," +
            "suggestions.placePrediction.text.text,",
        },
      }
    );

    const data: AutocompleteResponse = await res.json();

    return data.suggestions.map((s) => s.placePrediction);
  } catch {
    return [];
  }
}

export async function getPlaceDetails(
  placeId: string
): Promise<PlaceAddress | null> {
  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY!,
          "X-Goog-FieldMask":
            "location," +
            "googleMapsUri," +
            "timeZone," +
            "addressComponents," +
            "formattedAddress,",
        },
      }
    );

    const data: PlaceDetailsResponse = await res.json();

    return {
      placeId,
      formattedAddress: data.formattedAddress ?? null,
      googleMapsUri: data.googleMapsUri ?? null,
      timeZone: data.timeZone ?? null,

      streetName: getComponent(data.addressComponents, "route"),
      streetNumber: getComponent(data.addressComponents, "street_number"),
      postalCode: getComponent(data.addressComponents, "postal_code"),
      city: getCity(data.addressComponents),
      administrativeArea: getComponent(
        data.addressComponents,
        "administrative_area_level_1"
      ),
      countryCode: getComponent(data.addressComponents, "country", true) || "",

      lat: data.location.latitude,
      lng: data.location.longitude,
    };
  } catch {
    console.log("error");

    return null;
  }
}
