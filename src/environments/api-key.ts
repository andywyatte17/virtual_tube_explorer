//
// api-key.ts
//

import { environment } from "./environment";
import * as CryptoJS from "crypto-js";

function AES_Encrypt(toEncrypt: string, secretPhrase: string): string {
  return CryptoJS.AES.encrypt(toEncrypt, secretPhrase).toString();
}

function AES_Decrypt(toDecrypt: string, secretPhrase: string): string {
  let bytes = CryptoJS.AES.decrypt(toDecrypt, secretPhrase);
  return bytes.toString(CryptoJS.enc.Utf8);
}

type ApiKeyJson = {
  Tfl: { ApplicationID: "..."; ApplicationKey: "..." };
};

export class ApiKeys {
  /**
   * Encrypted version of string
   * '{"Tfl":{"ApplicationID":"...","ApplicationKey":"..."}}' giving your Tfl
   * API key. The encryption can be done on the Login modal in the 'Show Encrypt
   * Area' UI.
   */
  static readonly encrypted =
    "U2FsdGVkX1+g4y+NkXoJA1/GiofPNTWYtxASWSscR9lPDg7B7M7giG7FVr4KfSntZziqrlVDPLUVX5wyzoe/fQN+9jIrtl6XJ2JDHXHlzWd38DwAaZIpUWVBSHmsd4scsQAKS80mFqzUpEm5l9Hwpg==";

  /** Decrypted Tfl API key data. */
  private static decrypted: ApiKeyJson;

  static ApplicationIDKey(): [string, string] {
    if (!ApiKeys.decrypted && environment.apiDecryptPassword) {
      console.log("Here!");
      try {
        ApiKeys.decrypted = <ApiKeyJson>(
          JSON.parse(
            AES_Decrypt(ApiKeys.encrypted, environment.apiDecryptPassword)
          )
        );
      } catch (e) {
        environment.apiDecryptPassword = null;
      }
    }
    if (!ApiKeys.decrypted) return null;
    return [
      ApiKeys.decrypted.Tfl.ApplicationID,
      ApiKeys.decrypted.Tfl.ApplicationKey
    ];
  }

  static AddKeys(urlIn: string): string {
    let applicationIdKey = ApiKeys.ApplicationIDKey();
    return ApiKeys.AddKeys2(applicationIdKey, urlIn);
  }

  static AddKeys2(applicationIdKey: [string, string], urlIn: string): string {
    if (!applicationIdKey) return urlIn;
    let [applicationId, applicationKey] = applicationIdKey;
    try {
      let url = new URL(urlIn);
      url.searchParams.append("app_id", applicationId);
      url.searchParams.append("app_key", applicationKey);
      return url.toString();
    } catch (e) {
      console.error("Failed to add applicationId/Key to url " + urlIn);
    }
    return urlIn;
  }
}
