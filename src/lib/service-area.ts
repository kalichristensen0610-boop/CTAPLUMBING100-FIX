export const approvedServiceZipCodes = new Set([
  "83605", "83607", "83616", "83634", "83642", "83644", "83646", "83651", "83669", "83686", "83687",
  "83702", "83703", "83704", "83705", "83706", "83709", "83712", "83713", "83714", "83716",
]);

export function isApprovedServiceZip(zipCode: string) {
  return approvedServiceZipCodes.has(zipCode.trim().slice(0, 5));
}

export const outsideServiceAreaMessage = "Thanks for reaching out! It looks like this property may be outside our current service area. Please call us if you believe this is an error.";
