ALTER TABLE "locations" RENAME COLUMN "placeId" TO "place_id";--> statement-breakpoint
ALTER TABLE "locations" RENAME COLUMN "formattedAddress" TO "formatted_address";--> statement-breakpoint
ALTER TABLE "locations" RENAME COLUMN "googleMapsUri" TO "google_maps_uri";--> statement-breakpoint
ALTER TABLE "locations" RENAME COLUMN "timeZone" TO "time_zone";--> statement-breakpoint
ALTER TABLE "locations" RENAME COLUMN "streetName" TO "street_name";--> statement-breakpoint
ALTER TABLE "locations" RENAME COLUMN "streetNumber" TO "street_number";--> statement-breakpoint
ALTER TABLE "locations" RENAME COLUMN "postalCode" TO "postal_code";--> statement-breakpoint
ALTER TABLE "locations" RENAME COLUMN "administrativeArea" TO "administrative_area";--> statement-breakpoint
ALTER TABLE "locations" RENAME COLUMN "countryCode" TO "country_code";--> statement-breakpoint
ALTER TABLE "locations" ALTER COLUMN "lat" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "locations" ALTER COLUMN "lng" SET DATA TYPE double precision;