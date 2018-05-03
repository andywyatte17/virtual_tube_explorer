//
// my_tfl_api_key.ts
//

export class ApiKeys {
  /**
   * Encrypted version of string
   * '{"Tfl":{"ApplicationID":"...","ApplicationKey":"..."}}' giving your Tfl
   * API key. The encryption can be done on the Login modal in the 'Show Encrypt
   * Area' UI.
   */
  static readonly encrypted =
      'U2FsdGVkX1+g4y+NkXoJA1/GiofPNTWYtxASWSscR9lPDg7B7M7giG7FVr4KfSntZziqrlVDPLUVX5wyzoe/fQN+9jIrtl6XJ2JDHXHlzWd38DwAaZIpUWVBSHmsd4scsQAKS80mFqzUpEm5l9Hwpg==';

  /** Decrypted Tfl API key data. */
  static decrypted = {'Tfl': {'ApplicationID': '...', 'ApplicationKey': '...'}};
};