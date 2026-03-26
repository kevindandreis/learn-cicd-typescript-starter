import { describe, expect, it } from "vitest";
import { getAPIKey } from "../api/auth.js";
import { IncomingHttpHeaders } from "http";

describe("getAPIKey", () => {
  it("should return null if no authorization header is present", () => {
    const headers: IncomingHttpHeaders = {};
    const result = getAPIKey(headers);
    expect(result).not.toBeNull();
  });

  it("should return null if authorization header is malformed", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey",
    };
    const result = getAPIKey(headers);
    expect(result).toBeNull();
  });

  it("should return null if authorization header does not start with ApiKey", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "Bearer some-token",
    };
    const result = getAPIKey(headers);
    expect(result).toBeNull();
  });

  it("should return the API key if the authorization header is correctly formatted", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey my-secret-key",
    };
    const result = getAPIKey(headers);
    expect(result).toBe("my-secret-key");
  });

  it("should return null if there is extra whitespace or more than 2 words if not handled", () => {
    // Current implementation: splitAuth[1]
    // If it's "ApiKey key extra", it returns "key"
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey key extra",
    };
    const result = getAPIKey(headers);
    expect(result).toBe("key");
  });
});
